const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const Assessment = require('../models/Assessment');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const list = await Assessment.find().select('title description scoring');
    res.json({ items: list });
  } catch (err) { next(err); }
});

module.exports = router;


