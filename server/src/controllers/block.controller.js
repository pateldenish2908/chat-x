const Block = require('../models/block.model');

const blockUser = async (req, res) => {
    try {
        const { blockedId } = req.body;
        const blockerId = req.user.id;

        if (blockerId === blockedId) {
            return res.status(400).json({ message: 'Cannot block yourself' });
        }

        await Block.findOneAndUpdate(
            { blocker: blockerId, blocked: blockedId },
            { blocker: blockerId, blocked: blockedId },
            { upsert: true }
        );

        res.status(200).json({ success: true, message: 'User blocked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { blockedId } = req.body;
        await Block.findOneAndDelete({ blocker: req.user.id, blocked: blockedId });
        res.status(200).json({ success: true, message: 'User unblocked' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlockedUsers = async (req, res) => {
    try {
        const blocked = await Block.find({ blocker: req.user.id }).populate('blocked', 'name profileImage');
        res.status(200).json({ success: true, data: blocked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { blockUser, unblockUser, getBlockedUsers };
