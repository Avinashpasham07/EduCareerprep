const mongoose = require('mongoose');

const CollegeReviewSchema = new mongoose.Schema({
    collegeId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.CollegeReview || mongoose.model('CollegeReview', CollegeReviewSchema);
