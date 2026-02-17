const User = require('../models/user.model');
const Block = require('../models/block.model');

const getNearbyUsers = async (req, res) => {
    try {
        const { longitude, latitude, radius = 50, page = 1, limit = 10 } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({ message: 'Longitude and latitude are required' });
        }

        // Get blocked users to exclude
        const blockedIds = await Block.find({
            $or: [{ blocker: req.user.id }, { blocked: req.user.id }],
        }).distinct('blocked');

        const blockedMeIds = await Block.find({ blocked: req.user.id }).distinct('blocker');
        const excludedIds = [...new Set([...blockedIds, ...blockedMeIds, req.user.id])];

        const users = await User.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    },
                    $maxDistance: radius * 1000, // convert km to meters
                },
            },
            _id: { $nin: excludedIds },
            locationEnabled: true,
            isActive: true,
        })
            .select('name gender bio profileImage birthday locationEnabled lastSeen')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getNearbyUsers,
};
