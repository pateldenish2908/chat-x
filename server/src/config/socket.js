let io;
const { Server } = require('socket.io');
const cookie = require('cookie');
<<<<<<< HEAD
const { sendMessage } = require('../services/message.service');
const { verifyAccessToken } = require('../utils/jwt.util');
=======
const { verifyAccessToken } = require('../utils/jwt.util');

const SocketEvents = require('../constants/socketEvents');
const registerChatHandlers = require('../socket/handlers/chat.handler');
const registerCallHandlers = require('../socket/handlers/call.handler');
>>>>>>> main

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

<<<<<<< HEAD
  // Middleware to verify token from cookie
  io.use((socket, next) => {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) {
      return next(new Error('No cookies found'));
    }

    const parsed = cookie.parse(rawCookie);
    const token = parsed.accessToken; // Or whatever key you use

    if (!token) {
      return next(new Error('Token not found in cookies'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.id; // or decoded.userId
      next();
    } catch (err) {
      console.error('JWT Verification Error:', err);
=======
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
>>>>>>> main
      return next(new Error('Invalid token'));
    }
  });

<<<<<<< HEAD
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    console.log('User connected:', socket.data.userId);

    // Join personal room based on userId
    socket.join(socket.data.userId);
    console.log(`Socket ${socket.id} joined personal room: ${socket.data.userId}`);

//     setInterval(() => {
//   io.to(socket.data.userId).emit("chatListUpdated");
//   console.log("Test emit to personal room");
// }, 5000);

    socket.on('join', ({ roomId }) => {
      console.log(`User joined room: ${roomId}`);
      socket.join(roomId);
    });

    socket.on('leave', ({ roomId }) => {
      console.log(`User leave room: ${roomId}`);
      socket.leave(roomId);
    });

    socket.on('sendMessage', async (data) => {
      console.log('sendMessage', data);

      // const senderId=   socket.data.userId // from middleware

      const { chatRoom, senderId, content } = data;
      const message = await sendMessage(chatRoom, senderId, content);

      io.to(chatRoom).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    // socket.onAny((event, ...args) => {
    //   console.log(`Received event: ${event}`, args);
    // });
=======
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
>>>>>>> main
  });
}

function getIO() {
<<<<<<< HEAD
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
=======
  if (!io) throw new Error('Socket not init');
>>>>>>> main
  return io;
}

module.exports = { initSocket, getIO };
