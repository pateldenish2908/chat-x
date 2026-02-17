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
        callback(null, true);
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
