const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const auth = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/messages/:otherUserId
 * @desc    Get chat history between current user and another user
 * @access  Private
 */
router.get('/:otherUserId', auth, async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user.id;

        const chatRoom = [currentUserId, otherUserId].sort().join('_');

        const messages = await Message.find({ chatRoom })
            .sort({ createdAt: 1 })
            .limit(50); // Pagination could be added later

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
