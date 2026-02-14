const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SendMessageRequest:
 *       type: object
 *       required:
 *         - chatRoomId
 *         - senderId
 *         - message
 *       properties:
 *         chatRoomId:
 *           type: string
 *           description: Chat room ID
 *         senderId:
 *           type: string
 *           description: Sender user ID
 *         message:
 *           type: string
 *           description: Message content
 */

/**
 * @swagger
 * /message/send:
 *   post:
 *     summary: Send a message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       400:
 *         description: Bad request
 */
router.post('/send', messageController.sendMessage);

/**
 * @swagger
 * /message/{chatRoomId}:
 *   get:
 *     summary: Get messages by chat room ID
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: chatRoomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the chat room
 *     responses:
 *       200:
 *         description: Successfully fetched messages
 *       404:
 *         description: Chat room not found or no messages
 */
router.get('/:chatRoomId', authMiddleware, messageController.getMessagesByChatRoom);

module.exports = router;
