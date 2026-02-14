const { verifyAccessToken } = require('../utils/jwt.util');
const cookie = require('cookie');

function authMiddleware(req, res, next) {
  const cookies = req.headers.cookie
    ? cookie.parse(req.headers.cookie)
    : {};

  const token = cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token found' });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

module.exports = authMiddleware;
