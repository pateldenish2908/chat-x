const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const chatRoomRoutes = require('./chatRoom.routes');
const messageRoutes = require('./message.routes');

// Auth
router.use('/auth', authRoutes);

// User
router.use('/users', userRoutes);

// Chat
router.use('/chat-rooms', chatRoomRoutes);
router.use('/messages', messageRoutes);

module.exports = router;
