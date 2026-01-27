const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: uploadDir });

router.post('/', authenticate, async (req, res, next) => {
  try {
    const resume = await Resume.create({ user: req.user.id, template: req.body.template || 'classic', data: req.body.data || {} });
    res.status(201).json({ resume });
  } catch (err) { next(err); }
});

router.post('/upload', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    res.json({ file: { filename: req.file.filename, path: req.file.path } });
  } catch (err) { next(err); }
});

module.exports = router;


