let io;
const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt.util');

const SocketEvents = require('../constants/socketEvents');
const registerChatHandlers = require('../socket/handlers/chat.handler');
const redisClient = require('./redis');

const config = require('./env');

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const whitelist = [config.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'].filter(Boolean);
        const normalizedTarget = origin.replace(/\/$/, "");
        const isWhitelisted = whitelist.some(url => url.replace(/\/$/, "") === normalizedTarget);
        const isLocalDev = config.NODE_ENV === 'development' && (
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1') ||
          origin.startsWith('http://192.168.') ||
          origin.startsWith('http://10.')
        );
        if (isWhitelisted || isLocalDev) {
          callback(null, true);
        } else {
          callback(new Error('CORS not allowed for socket'), false);
        }
      },
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token not found'));

    try {
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on(SocketEvents.CONNECTION, async (socket) => {
    const userId = socket.data.userId;
    console.log(`User connected: ${userId}`);

    // Track online status in Redis (optional)
    if (redisClient.isReady) {
      await redisClient.set(`user:${userId}:socketId`, socket.id);
      await redisClient.set(`user:${userId}:online`, 'true');
    }

    // Broadcast user online
    io.emit(SocketEvents.USER_ONLINE, { userId });

    // Join user's own room for personal notifications
    // This allows us to use io.to(userId) to send messages to all user's devices
    socket.join(userId);

    // Register handlers
    registerChatHandlers(io, socket);

    socket.on(SocketEvents.DISCONNECT, async () => {
      console.log(`User disconnected: ${userId}`);
      if (redisClient.isReady) {
        await redisClient.del(`user:${userId}:socketId`);
        await redisClient.set(`user:${userId}:online`, 'false');
        await redisClient.set(`user:${userId}:lastSeen`, new Date().toISOString());
      }

      io.emit(SocketEvents.USER_OFFLINE, { userId });
    });
  });
}

function getIO() {
  if (!io) throw new Error('Socket not init');
  return io;
}

module.exports = { initSocket, getIO };
