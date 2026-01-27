const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase(uri) {
  if (isConnected) return;
  if (!uri) throw new Error('MONGO_URI not provided');
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  isConnected = true;
}

module.exports = { connectToDatabase };


