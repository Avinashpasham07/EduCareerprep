const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['government', 'private'], default: 'government' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
  },
  courses: [{ name: String, eligibility: String, duration: String }],
  admissions: {
    timeline: String,
    website: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('College', CollegeSchema);


