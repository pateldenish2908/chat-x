const User = require('../models/user.model');
const Block = require('../models/block.model');

const getNearbyUsers = async (req, res) => {
    try {
        const { longitude, latitude, radius = 5000, page = 1, limit = 20 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ message: 'Longitude and latitude are required' });
        }

        // 1. Efficiently get all excluded IDs in one query
        const blocks = await Block.find({
            $or: [{ blocker: req.user.id }, { blocked: req.user.id }],
        }).select('blocker blocked').lean();

        const excludedIds = new Set([req.user.id]);
        blocks.forEach(b => {
            if (b.blocker) excludedIds.add(b.blocker.toString());
            if (b.blocked) excludedIds.add(b.blocked.toString());
        });

        const excludedList = Array.from(excludedIds);

        // 1. Try to find nearby users first
        let users = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: parseInt(radius) * 1000, // convert km to meters
                },
            },
            _id: { $nin: excludedList },
            isActive: true,
        })
            .select('name gender bio profileImage birthday locationEnabled lastSeen')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // 2. Fallback: If no one is nearby, show all active users (for cold-start/testing)
        if (users.length === 0) {
            users = await User.find({
                _id: { $nin: excludedList },
                isActive: true
            })
                .select('name gender bio profileImage birthday locationEnabled lastSeen')
                .limit(limit * 1)
                .sort('-lastSeen')
                .lean();
        }

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNearbyUsers,
};
