const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoom.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-or-get', authMiddleware, chatRoomController.createOrGetChatRoom);
router.get('/my-chat-rooms', authMiddleware, chatRoomController.getMyChatRooms);
router.get('/', authMiddleware, chatRoomController.getChatAllRooms);

module.exports = router;
