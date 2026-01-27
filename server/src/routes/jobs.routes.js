const router = require('express').Router();
const { authenticate, softAuthenticate, authorize } = require('../middleware/auth');
const jobsController = require('../controllers/jobs.controller');

// Public/Student: Get all jobs
router.get('/', softAuthenticate, jobsController.getAllJobs);

// Employer: Create job
router.post('/', authenticate, authorize(['employer', 'admin']), jobsController.createJob);

// Employer: Get my posted jobs
router.get('/my-jobs', authenticate, authorize(['employer', 'admin']), jobsController.getMyJobs);

// Student: Apply and Save
router.post('/:id/apply', authenticate, authorize(['student']), jobsController.applyJob);
router.post('/:id/save', authenticate, authorize(['student']), jobsController.toggleSaveJob);
router.post('/:id/view', jobsController.incrementView);

// Employer: Update Application Status
router.put('/:id/applications/:userId/status', authenticate, authorize(['employer', 'admin']), jobsController.updateApplicationStatus);

module.exports = router;


