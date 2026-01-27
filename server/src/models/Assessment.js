const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ label: String, value: Number }],
  category: { type: String, required: true },
});

const AssessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  scoring: {
    type: String,
    enum: ['interest', 'aptitude', 'mixed'],
    default: 'mixed',
  },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);


