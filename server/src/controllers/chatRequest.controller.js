const ChatRequest = require('../models/chatRequest.model');
const Block = require('../models/block.model');
const chatRoomService = require('../services/chatRoom.service');

const sendChatRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user.id;

        if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself' });
        }

        // Check if blocked
        const isBlocked = await Block.findOne({
            $or: [
                { blocker: senderId, blocked: receiverId },
                { blocker: receiverId, blocked: senderId },
            ],
        });

        if (isBlocked) {
            return res.status(403).json({ message: 'You cannot connect with this user' });
        }

        const existingRequest = await ChatRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        const chatRequest = await ChatRequest.create({
            sender: senderId,
            receiver: receiverId,
        });

        res.status(201).json({
            success: true,
            data: chatRequest,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const respondToChatRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body; // 'accepted' or 'declined'

        if (!['accepted', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const chatRequest = await ChatRequest.findById(requestId);

        if (!chatRequest || chatRequest.receiver.toString() !== req.user.id) {
            console.error(`❌ Request response failed: Request ${requestId} not found or receiver mismatch. User: ${req.user.id}`);
            return res.status(404).json({ message: 'Request not found' });
        }

        console.log(`✅ Responding to request ${requestId} with status ${status}`);
        chatRequest.status = status;
        await chatRequest.save();

        let chatRoom = null;
        if (status === 'accepted') {
            chatRoom = await chatRoomService.findOrCreateChatRoom(
                chatRequest.sender.toString(),
                chatRequest.receiver.toString()
            );
        }

        res.status(200).json({
            success: true,
            data: chatRequest,
            chatRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await ChatRequest.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }],
        })
            .populate('sender', 'name profileImage _id')
            .populate('receiver', 'name profileImage _id')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: requests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendChatRequest,
    respondToChatRequest,
    getMyRequests,
};
