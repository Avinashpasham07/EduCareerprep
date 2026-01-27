const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
    res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;


