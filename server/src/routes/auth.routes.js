const router = require('express').Router();
const Joi = require('joi');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'counselor', 'employer', 'admin').default('student'),
  location: Joi.string().optional().allow(''),
  // Allow other potential fields to pass through, but we only explicitly save what's in the schema or model
}).unknown(true);

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, location } = await registerSchema.validateAsync(req.body);
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await User.hashPassword(password);

    // Create user with all allowed fields
    const userPayload = {
      name,
      email,
      passwordHash,
      role: role || 'student'
    };

    // Add role-specific fields if present
    if (location) userPayload.location = location;

    const user = await User.create(userPayload);
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id, role: user.role });
    user.refreshToken = refreshToken;
    await user.save();
    res.status(201).json({
      user: user.toObject({ transform: (doc, ret) => { delete ret.passwordHash; delete ret.refreshToken; return ret; } }),
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    next(err);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'counselor', 'employer', 'admin').optional(),
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // If role was specified in login, verify it matches
    if (role && user.role !== role) {
      return res.status(401).json({
        message: `Please log in via the ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} portal`
      });
    }

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id, role: user.role });
    user.refreshToken = refreshToken;
    await user.save();
    res.json({
      user: await User.findById(user._id)
        .select('-passwordHash -refreshToken')
        .populate('profile.collegeId', 'name profile.location'),
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    if (err.isJoi) return res.status(400).json({ message: err.message });
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ message: 'Token required' });
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid token' });
    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id, role: user.role });
    user.refreshToken = refreshToken;
    await user.save();
    res.json({ tokens: { accessToken, refreshToken } });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(200).json({ message: 'Logged out' });
    const payload = verifyRefreshToken(token);
    await User.findByIdAndUpdate(payload.id, { $unset: { refreshToken: 1 } });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.json({ message: 'Logged out' });
  }
});

module.exports = router;


