const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['applied', 'interview', 'offer', 'rejected'], default: 'applied' },
  resumeUrl: String,
  coverLetter: String,
}, { timestamps: true });

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'internship', 'part-time', 'contract'], default: 'full-time' },
  salary: String,
  experience: String,
  description: String,
  hiringType: { type: String, enum: ['on-campus', 'off-campus', 'general'], default: 'general' },
  targetColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  vacancies: { type: Number, default: 0 },
  skills: [String],
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  applications: [ApplicationSchema],
  views: { type: Number, default: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);


