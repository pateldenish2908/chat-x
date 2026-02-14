let io;
const { Server } = require('socket.io');
const cookie = require('cookie');
const { verifyAccessToken } = require('../utils/jwt.util');

const SocketEvents = require('../constants/socketEvents');
const registerChatHandlers = require('../socket/handlers/chat.handler');
const registerCallHandlers = require('../socket/handlers/call.handler');

const config = require('./env');

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new Error('No cookies found'));

    const parsed = cookie.parse(rawCookie);
    const token = parsed.accessToken;
    if (!token) return next(new Error('Token not found'));

    try {
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on(SocketEvents.CONNECTION, (socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join user's own room for personal notifications/calls
    socket.join(socket.data.userId);

    // Register handlers
    registerChatHandlers(io, socket);
    registerCallHandlers(io, socket);

    socket.on(SocketEvents.DISCONNECT, () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });
}

function getIO() {
  if (!io) throw new Error('Socket not init');
  return io;
}

module.exports = { initSocket, getIO };
