const userService = require('../services/user.service');

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

exports.getNearbyUsers = async (req, res, next) => {
  try {
    const { longitude, latitude, distance, userId } = req.query;
    const users = await userService.getNearbyUsers(
      userId,
      parseFloat(longitude),
      parseFloat(latitude),
      distance ? parseInt(distance) : 5000
    );
    res.json({ users });
  } catch (error) {
    next(error);
  }
};
