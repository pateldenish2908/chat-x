const userService = require('../services/user.service');
const User = require('../models/user.model');

exports.addUser = async (req, res, next) => {
  try {
    const user = await userService.addUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully', user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserWithPaginationSearchingAndSorting = async (req, res, next) => {
  try {
    const result = await userService.getUserWithPaginationSearchingAndSorting(
      req.query
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.seedUsers = async (req, res, next) => {
  try {
    const message = await userService.seedUsers();
    res.json({ message });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getNearbyUsers = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 50, page = 1, limit = 10 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    // Get blocked users to exclude
    const Block = require('../models/block.model');
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
          $maxDistance: radius * 1000,
        },
      },
      _id: { $nin: excludedIds },
      locationEnabled: true,
      isActive: true,
    })
      .select('name gender bio profileImage birthday locationEnabled lastSeen')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
