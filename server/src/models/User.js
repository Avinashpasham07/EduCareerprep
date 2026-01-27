const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StatsSchema = new mongoose.Schema({
  totalStudents: { type: Number, default: 0 },
  placedStudents: { type: Number, default: 0 },
  activeCompanies: { type: Number, default: 0 },
  upcomingDrives: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'counselor', 'employer', 'admin'], default: 'student' },
  profile: {
    grade: String,
    interests: [String],
    skills: [String],
    location: String,
    phone: String,
    bio: String,
    education: String,
    university: String,
    graduationYear: String,
    portfolioLink: String,
    avatar: String,
    resumeLink: String,
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // College specific (One or Many)
    collegeProfile: {
      description: String,
      website: String,
      phone: String,
      established: String,
      courses: [String],
      logo: String,
      campusPhotos: [String],
      banner: String,
      videoLink: String,
      mapsLink: String,
      offCampusRecruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      stats: StatsSchema
    },
    managedColleges: [{
      name: String,
      location: String,
      description: String,
      website: String,
      phone: String,
      established: String,
      courses: [String],
      logo: String,
      campusPhotos: [String],
      banner: String,
      videoLink: String,
      mapsLink: String,
      stats: StatsSchema
    }],

    // Recruiter specific
    recruiterProfile: {
      companyName: String,
      industry: String,
    }
  },
  savedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  // Kanban Application Tracking
  appliedJobs: [{
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offer', 'rejected'],
      default: 'applied'
    },
    notes: String,
    appliedDate: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  solvedChallenges: [String],
  completedAssessments: [{
    assessmentId: Number,
    title: String,
    score: Number,
    recommendations: [String],
    completedDate: Date
  }],
  roadmaps: [{
    role: String,
    status: { type: String, default: 'active' }, // active, completed, archived
    steps: [{
      title: String,
      time: String,
      topics: [String],
      status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
      completedDate: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }],
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{
      id: String,
      name: String,
      icon: String, // emoji or icon name
      date: { type: Date, default: Date.now }
    }]
  },
  refreshToken: { type: String },
}, { timestamps: true });

UserSchema.methods.comparePassword = async function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);
