const { verifyAccessToken } = require('../utils/jwt.util');
const redisClient = require('../config/redis');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token found' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyAccessToken(token);

    // Single active session check (only if Redis is available)
    if (redisClient.isReady) {
      const activeToken = await redisClient.get(`user:${user.id}:session`);
      if (activeToken && activeToken !== token) {
        return res.status(401).json({ message: 'Session invalidated by another login' });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

module.exports = authMiddleware;
