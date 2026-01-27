const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // May be null if global or college-wide
    },
    recipientRole: {
        type: String,
        enum: ['student', 'counselor', 'employer', 'admin'],
        required: false
    },
    targetCollege: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the counselor/college user
        required: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['admission', 'scholarship', 'exam', 'job', 'assessment', 'interview', 'alert'],
        default: 'alert'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGlobal: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Add indices for performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ targetCollege: 1, createdAt: -1 });
notificationSchema.index({ isGlobal: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
