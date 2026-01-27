require('dotenv').config();
const { connectToDatabase } = require('../lib/db');
const User = require('../models/User');
const College = require('../models/College');
const Assessment = require('../models/Assessment');

async function run() {
  await connectToDatabase(process.env.MONGO_URI);
  const adminEmail = 'admin@ecp.local';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const passwordHash = await User.hashPassword('Admin@123');
    await User.create({ name: 'Admin', email: adminEmail, passwordHash, role: 'admin' });
  }

  if ((await College.countDocuments()) === 0) {
    await College.create([
      { name: 'Govt. College A', type: 'government', location: { type: 'Point', coordinates: [72.8777, 19.076] } },
      { name: 'Govt. College B', type: 'government', location: { type: 'Point', coordinates: [77.209, 28.6139] } },
    ]);
  }

  if ((await Assessment.countDocuments()) === 0) {
    await Assessment.create({
      title: 'Aptitude & Interest Test',
      description: 'Baseline assessment',
      scoring: 'mixed',
      questions: [
        { text: 'I enjoy solving math problems', category: 'aptitude', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
        { text: 'I like helping people', category: 'interest', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }] },
      ],
    });
  }

  // eslint-disable-next-line no-console
  console.log('Seed completed');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });


