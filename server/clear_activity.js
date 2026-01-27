const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function clearActivity() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        // Use the same connection string as your main app
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educareerprep';
        await mongoose.connect(MONGO_URI);

        console.log('🧹 Clearing Recent Activity & Applied Jobs for ALL Students...');

        // Update all users with role 'student'
        // Set appliedJobs and savedJobs to empty arrays []
        const result = await User.updateMany(
            { role: 'student' },
            {
                $set: {
                    appliedJobs: [],
                    savedJobs: []
                }
            }
        );

        console.log(`✅ Success! Cleared activity for ${result.matchedCount} students.`);
        console.log(`📝 Modified ${result.modifiedCount} documents.`);
        console.log('Profile "Recent Activity" and "Applied Jobs" are now empty.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearActivity();
