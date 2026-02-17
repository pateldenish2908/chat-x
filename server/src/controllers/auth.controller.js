const redisClient = require('../config/redis');

exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);

    const payload = { id: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Single active session: Store current accessToken in Redis if available
    if (redisClient.isReady) {
      await redisClient.set(`user:${user._id}:session`, accessToken);
    }

    res.json({
      message: 'Login successful',
      data: user,
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await redisClient.del(`user:${req.user.id}:session`);
    }
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
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
