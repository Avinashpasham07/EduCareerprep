const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

// Protected: Get/Update own profile
// Persistence Routes
router.post('/assessments/save', authenticate, userController.saveAssessment);
router.post('/roadmaps/save', authenticate, userController.saveRoadmap);
router.get('/roadmaps', authenticate, userController.getRoadmaps);
router.post('/roadmaps/step/update', authenticate, userController.updateRoadmapStep);

// Kanban Routes
router.get('/applications', authenticate, userController.getApplications);
router.put('/applications/status', authenticate, userController.updateApplicationStatus);

// Gamification
router.get('/leaderboard', authenticate, userController.getLeaderboard);

router.get('/profile', authenticate, userController.getProfile);
router.get('/profile/:id', authenticate, userController.getUserById);
router.put('/profile', authenticate, userController.updateProfile);
router.post('/analyze-profile', authenticate, userController.analyzeProfile);

// Public/Protected: Get list of colleges
router.get('/colleges', userController.getColleges);
router.get('/colleges/:id', userController.getCollegeById);
router.post('/colleges/save/:id', authenticate, userController.toggleSaveCollege);
router.post('/colleges/review/:id', authenticate, userController.addReview);

// Stats & Challenges
router.get('/dashboard-stats', authenticate, userController.getDashboardStats);
router.post('/challenge/solve', authenticate, userController.markChallengeSolved);

// Recruiter discovery for colleges
router.get('/recruiters', authenticate, userController.getRecruiters);
router.post('/college/preferred-recruiters', authenticate, userController.togglePreferredRecruiter);

// Multi-college management per counselor
router.post('/managed-colleges', authenticate, userController.addManagedCollege);
router.put('/managed-colleges/:id', authenticate, userController.updateManagedCollege);
router.delete('/managed-colleges/:id', authenticate, userController.deleteManagedCollege);

module.exports = router;
