const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoom.controller');

/**
 * @swagger
 * tags:
 *   name: ChatRoom
 *   description: Chat Room APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrGetChatRoomRequest:
 *       type: object
 *       required:
 *         - userId1
 *         - userId2
 *       properties:
 *         userId1:
 *           type: string
 *           description: First user ID
 *         userId2:
 *           type: string
 *           description: Second user ID
 */

/**
 * @swagger
 * /chat-rooms/create-or-get:
 *   post:
 *     summary: Create or Get existing chat room between 2 users
 *     tags: [ChatRoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrGetChatRoomRequest'
 *     responses:
 *       200:
 *         description: Chat room created or fetched successfully
 *       400:
 *         description: Bad request
 */
router.post('/create-or-get', chatRoomController.createOrGetChatRoom);

/**
 * @swagger
 * /chat-room/my-chat-rooms/{userId}:
 *   get:
 *     summary: Get all chat rooms for a user
 *     tags: [ChatRoom]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully fetched chat rooms
 *       404:
 *         description: User not found or no chat rooms
 */
router.get('/my-chat-rooms/:userId', chatRoomController.getMyChatRooms);

/**
 * @swagger
 * /chat-rooms:
 *   get:
 *     summary: Get all chat rooms for a user
 *     tags: [ChatRoom]
 *     responses:
 *       200:
 *         description: Successfully fetched chat rooms
 *       404:
 *         description: User not found or no chat rooms
 */
router.get('/', chatRoomController.getChatAllRooms);

module.exports = router;
