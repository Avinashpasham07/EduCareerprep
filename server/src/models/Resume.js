const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  template: { type: String, default: 'classic' },
  data: mongoose.Schema.Types.Mixed,
  pdfUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);


