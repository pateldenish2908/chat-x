const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const chatRoomRoutes = require('./chatRoom.routes');
const messageRoutes = require('./message.routes');
const discoverRoutes = require('./discover.routes');
const chatRequestRoutes = require('./chatRequest.routes');
const blockRoutes = require('./block.routes');
const reportRoutes = require('./report.routes');

// Auth
router.use('/auth', authRoutes);

// User
router.use('/users', userRoutes);

// Chat
router.use('/chat-rooms', chatRoomRoutes);
router.use('/messages', messageRoutes);

// New Modules
router.use('/discover', discoverRoutes);
router.use('/chat-requests', chatRequestRoutes);
router.use('/blocks', blockRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
