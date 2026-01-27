const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sih');
        const users = await User.find({}, 'email role name').lean();
        console.log('--- FOUND USERS ---');
        users.forEach(u => console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
