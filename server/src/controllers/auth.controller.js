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
    // Set HttpOnly Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production', // only HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ message: 'Login successful', data: user });
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    // ✅ Get refreshToken from cookie, not body
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false in dev
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
