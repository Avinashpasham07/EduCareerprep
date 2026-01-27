const jwt = require('jsonwebtoken');

function signAccessToken(payload, expiresIn = '24h') {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
}

function signRefreshToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};


