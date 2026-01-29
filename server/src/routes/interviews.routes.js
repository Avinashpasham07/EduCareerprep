const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const Interview = require('../models/Interview');
const geminiService = require('../services/geminiService');

// Get Next Question
router.post('/generate-question', authenticate, async (req, res, next) => {
  try {
    const { role, difficulty, history } = req.body;
    const question = await geminiService.generateQuestion(role, difficulty, history);
    res.json({ question });
  } catch (err) { next(err); }
});

// Analyze Answer
router.post('/analyze-response', authenticate, async (req, res, next) => {
  try {
    const { role, question, answer } = req.body;
    const analysis = await geminiService.analyzeResponse(role, question, answer);
    res.json(analysis);
  } catch (err) { next(err); }
});

// Generate Full Session Feedback
router.post('/generate-feedback', authenticate, async (req, res, next) => {
  try {
    const { role, transcript } = req.body;
    const feedback = await geminiService.generateFeedback(role, transcript);
    res.json(feedback);
  } catch (err) { next(err); }
});

// Get Interview History (For Dashboard)
router.get('/history', authenticate, async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10); // Get last 10
    res.json(interviews);
  } catch (err) { next(err); }
});

// Save Completed Interview
router.post('/save', authenticate, async (req, res, next) => {
  try {
    const { role, transcript, score, feedback, durationSeconds } = req.body;

    // Create new interview record
    const interview = await Interview.create({
      user: req.user.id,
      role,
      transcript,
      overallScore: score,
      feedback,
      durationSeconds,
      status: 'completed'
    });

    res.status(201).json(interview);
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const interview = await Interview.create({ user: req.user.id, role: req.body.role, questions: req.body.questions || [], score: 0 });
    res.status(201).json({ interview });
  } catch (err) { next(err); }
});

module.exports = router;


