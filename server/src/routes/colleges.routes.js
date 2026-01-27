const router = require('express').Router();
const College = require('../models/College');

// Nearby search using simple geo query
router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, max = 50000 } = req.query; // meters
    if (!lat || !lng) return res.status(400).json({ message: 'lat,lng required' });
    const items = await College.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(max),
        }
      },
      type: 'government'
    }).limit(50);
    res.json({ items });
  } catch (err) { next(err); }
});

const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Update Dashboard Stats
router.put('/stats', authenticate, async (req, res, next) => {
  try {
    console.log('[API] PUT /colleges/stats called by user:', req.user.id);
    const { totalStudents, placedStudents, activeCompanies, upcomingDrives } = req.body;
    console.log('[API] Payload:', req.body);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'profile.collegeProfile.stats': {
            totalStudents: totalStudents || 0,
            placedStudents: placedStudents || 0,
            activeCompanies: activeCompanies || 0,
            upcomingDrives: upcomingDrives || 0
          }
        }
      },
      { new: true, runValidators: false } // Disable validation to allow flexible profile structure
    );

    if (!user) {
      console.error('[API] User not found during stats update');
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = user.profile?.collegeProfile?.stats || {};
    console.log('[API] Stats updated:', stats);
    res.json(stats);
  } catch (err) {
    console.error('[API] Error in PUT /stats:', err);
    next(err);
  }
});

// Get Dashboard Stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const stats = user?.profile?.collegeProfile?.stats || {};
    res.json(stats);
  } catch (err) { next(err); }
});

module.exports = router;
