/* eslint-disable no-undef */
const userService = require('../services/user.service');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt.util');

exports.register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.loginUser(email, password);

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: 'Login successful',
      data: user,
      accessToken,
      refreshToken
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.logout = (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
    });

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (err) {
    next(err);
  }
};
