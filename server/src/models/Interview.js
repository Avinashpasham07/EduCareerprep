const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String, // e.g., 'Frontend Developer'
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transcript: [
    {
      role: { type: String, enum: ['system', 'user', 'ai'] },
      text: String,
      feedback: String, // Mini-feedback on specific answers
      timestamp: { type: Date, default: Date.now }
    }
  ],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  durationSeconds: {
    type: Number,
    default: 0
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    summary: String
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'aborted'],
    default: 'in-progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
