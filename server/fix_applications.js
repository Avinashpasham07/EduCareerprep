const mongoose = require('mongoose');
const User = require('./src/models/User');
const Job = require('./src/models/Job');
require('dotenv').config();

async function fixUserData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sih');

        console.log('--- CLEANING USER DATA ---');

        // Find all student users
        const users = await User.find({ role: 'student' });
        console.log(`Found ${users.length} students.`);

        for (const user of users) {
            console.log(`Cleaning data for: ${user.name} (${user._id})`);

            // Wipe appliedJobs to remove bad references
            user.appliedJobs = [];
            // Wipe savedJobs just in case
            user.savedJobs = [];

            await user.save();
            console.log('✅ Cleared applications and saved jobs.');
        }

        console.log('--- DONE ---');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixUserData();
