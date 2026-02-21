const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const auth = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/messages/:otherUserId
 * @desc    Get chat history between current user and another user
 * @access  Private
 */
router.get('/:chatRoomId', auth, async (req, res) => {
    try {
        const { chatRoomId } = req.params;

        const messages = await Message.find({ chatRoom: chatRoomId })
            .sort({ createdAt: 1 })
            .limit(100);

        res.json({
            status: 'success',
            data: messages
        });
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ message: 'Server error fetching history' });
    }
});

module.exports = router;
