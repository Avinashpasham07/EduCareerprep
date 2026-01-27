const Job = require('../models/Job');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new job
exports.createJob = async (req, res, next) => {
    try {
        const jobData = {
            ...req.body,
            owner: req.user.id,
            company: req.user.name || req.body.company // Fallback or use user's name as company
        };
        const job = await Job.create(jobData);
        res.status(201).json(job);
    } catch (err) {
        next(err);
    }
};

// Get all jobs (public/student view)
exports.getAllJobs = async (req, res, next) => {
    try {
        const filters = {};

        // 1. Core Filters
        if (req.query.type && req.query.type !== 'all' && req.query.type !== '') {
            filters.type = req.query.type;
        }
        if (req.query.location && req.query.location !== 'all' && req.query.location !== '') {
            filters.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.title && req.query.title !== '') {
            filters.title = { $regex: req.query.title, $options: 'i' };
        }

        // 2. Targeted Hiring Logic
        let orParts = [
            { hiringType: 'general' },
            { hiringType: { $exists: false } },
            { hiringType: null },
            { hiringType: 'off-campus' }
        ];

        if (!req.user || req.user.role === 'student') {
            // Students/Guests see general and off-campus jobs
            if (req.user?.role === 'student') {
                try {
                    const student = await User.findById(req.user.id).select('profile.collegeId');
                    if (student?.profile?.collegeId) {
                        orParts.push({ hiringType: 'on-campus', targetColleges: student.profile.collegeId });
                    }
                } catch (userErr) {
                    console.error("[API] Error fetching student collegeId for filters:", userErr.message);
                }
            }
            filters.$or = orParts;
        } else if (req.user.role === 'counselor') {
            filters.$or = [
                { hiringType: 'off-campus' },
                { targetColleges: req.user.id }
            ];
        } else {
            filters.$or = [
                ...orParts,
                { owner: req.user.id }
            ];
        }

        console.log(`[API] getAllJobs Filters for ${req.user?.role || 'guest'}:`, JSON.stringify(filters));

        // Handle limit if provided
        // Handle pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalJobs = await Job.countDocuments(filters);
        const jobs = await Job.find(filters)
            .populate('owner', 'name profile.recruiterProfile')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log(`[API] Found ${jobs.length} jobs out of ${totalJobs} total matching filters`);

        res.json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs
        });
    } catch (err) {
        next(err);
    }
};

// Get jobs posted by the logged-in recruiter
exports.getMyJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ owner: req.user.id })
            .populate('applications.user', 'name email profile phone')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        next(err);
    }
};

// Toggle save job
exports.toggleSaveJob = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.id;

        // Ensure we are comparing strings
        const isSaved = user.savedJobs.some(id => id.toString() === jobId);

        if (isSaved) {
            user.savedJobs.pull(jobId);
        } else {
            user.savedJobs.push(jobId);
        }
        await user.save();

        res.json({ saved: !isSaved, savedJobs: user.savedJobs });
    } catch (err) {
        console.error("Toggle Save Job Error:", err);
        next(err);
    }
};

// Apply for a job
exports.applyJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const user = await User.findById(userId);

        // Check if already applied
        const alreadyApplied = job.applications.some(app => app.user.toString() === userId);
        if (alreadyApplied) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Add to Job applications
        job.applications.push({
            user: userId,
            status: 'applied',
            resumeUrl: req.body.resumeUrl || null,
            coverLetter: req.body.coverLetter || null
        });
        await job.save();

        // Add to User appliedJobs
        user.appliedJobs.push({
            job: job._id,
            status: 'applied',
            appliedDate: new Date()
        });

        try {
            await user.save();
        } catch (saveErr) {
            console.error('[API] Failed to save user after application:', JSON.stringify(saveErr.errors || saveErr, null, 2));
            // Rollback job application if user save fails to keep DB consistent
            job.applications.pop();
            await job.save();
            return res.status(500).json({
                message: 'Failed to update user profile: Validation Error',
                error: saveErr.message,
                details: saveErr.errors ? Object.keys(saveErr.errors).map(k => `${k}: ${saveErr.errors[k].message}`) : undefined
            });
        }

        // --- TRIGGER NOTIFICATIONS ---
        try {
            if (job.hiringType === 'on-campus' && job.targetColleges?.length > 0) {
                // Notify the College (Counselor)
                await Notification.create({
                    recipient: job.targetColleges[0], // Assuming first for now, or all in a real case
                    sender: userId,
                    type: 'job',
                    title: 'New On-Campus Application',
                    message: `${user.name} applied for "${job.title}" (On-Campus)`,
                    link: `/dashboard`
                });
            } else {
                // Notify the Company (Employer)
                await Notification.create({
                    recipient: job.owner,
                    sender: userId,
                    type: 'job',
                    title: 'New Application Received',
                    message: `${user.name} applied for "${job.title}"`,
                    link: `/dashboard`
                });
            }
        } catch (notifErr) {
            console.error('Failed to trigger notification:', notifErr);
            // Don't fail the application if notification fails
        }

        res.json({ message: 'Application submitted successfully', appliedJobs: user.appliedJobs });
    } catch (err) {
        console.error('[API] Critical Apply Job Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to apply: ' + err.message, error: err.message });
        }
    }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { id, userId } = req.params;
        const { status } = req.body;

        const job = await Job.findById(id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const appIndex = job.applications.findIndex(app => app.user.toString() === userId);
        if (appIndex === -1) return res.status(404).json({ message: 'Application not found' });

        job.applications[appIndex].status = status;
        await job.save();

        res.json({ message: 'Status updated', application: job.applications[appIndex] });
    } catch (err) {
        next(err);
    }
};

// Increment View Count
exports.incrementView = async (req, res, next) => {
    try {
        await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.status(200).json({ message: 'View counted' });
    } catch (err) {
        next(err);
    }
};
