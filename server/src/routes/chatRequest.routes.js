const express = require('express');
const router = express.Router();
const chatRequestController = require('../controllers/chatRequest.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/send', authMiddleware, chatRequestController.sendChatRequest);
router.post('/respond', authMiddleware, chatRequestController.respondToChatRequest);
router.get('/my-requests', authMiddleware, chatRequestController.getMyRequests);

module.exports = router;
