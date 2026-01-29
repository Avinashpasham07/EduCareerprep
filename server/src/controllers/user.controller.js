const User = require('../models/User');
const CollegeReview = require('../models/Review');
const mongoose = require('mongoose');


// --- Persistence Features ---
exports.saveAssessment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { assessmentId, title, score, recommendations } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if already taken, update if so, or push new
        const existingIndex = user.completedAssessments.findIndex(a => a.assessmentId == assessmentId);
        const newEntry = {
            assessmentId,
            title,
            score,
            recommendations,
            completedDate: new Date()
        };

        if (existingIndex > -1) {
            user.completedAssessments[existingIndex] = newEntry;
            await user.save();
        } else {
            user.completedAssessments.push(newEntry);
            // Award XP for new assessment
            await user.awardXP(100);
        }

        res.json({ success: true, completedAssessments: user.completedAssessments });
    } catch (err) {
        next(err);
    }
};

exports.saveRoadmap = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { role, steps } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure steps have default status
        const processedSteps = steps.map(s => ({
            ...s,
            status: s.status || 'pending'
        }));

        // Check if roadmap for role exists
        const existingIndex = user.roadmaps.findIndex(r => r.role.toLowerCase() === role.toLowerCase());

        if (existingIndex > -1) {
            // Update existing
            user.roadmaps[existingIndex].steps = processedSteps;
            user.roadmaps[existingIndex].updatedAt = new Date();
        } else {
            // Create new
            user.roadmaps.push({
                role,
                steps: processedSteps,
                status: 'active'
            });
        }

        await user.save();
        res.json({ success: true, roadmaps: user.roadmaps });
    } catch (err) {
        next(err);
    }
};

exports.getRoadmaps = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('roadmaps');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.roadmaps || []);
    } catch (err) {
        next(err);
    }
};

exports.updateRoadmapStep = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { roadmapId, stepIndex, status } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const roadmap = user.roadmaps.id(roadmapId);
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

        if (roadmap.steps[stepIndex]) {
            roadmap.steps[stepIndex].status = status;
            if (status === 'completed') {
                roadmap.steps[stepIndex].completedDate = new Date();
            }
            roadmap.updatedAt = new Date();
        }

        await user.save();
        res.json({ success: true, roadmap });
    } catch (err) {
        next(err);
    }
};

// --- Kanban Application Tracking ---

exports.getApplications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .select('appliedJobs')
            .populate({
                path: 'appliedJobs.job',
                select: 'title company type location salary applications' // temporarily fetch applications to find self
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Transform applications to include interviewDetails from the Job model
        const applications = user.appliedJobs.map(app => {
            const job = app.job;
            if (!job) return app;

            // Find the specific application in the job's applications array
            // Note: app.job is populated, so it's an object. 
            // However, we shouldn't expose all applications to the client.
            // We'll process this on server and return clean object.

            const jobApp = job.applications?.find(a => a.user.toString() === userId.toString());

            let interviewDetails = null;
            if (jobApp && jobApp.interviewDetails) {
                interviewDetails = jobApp.interviewDetails;
            }

            // Return a clean object, omitting the full 'applications' array from job
            const { applications, ...cleanJob } = job.toObject();

            return {
                ...app.toObject(),
                job: cleanJob,
                interviewDetails,
                status: app.status || (jobApp ? jobApp.status : 'applied') // Prioritize User status for Student Kanban
            };
        });

        res.json(applications);
    } catch (err) {
        next(err);
    }
};

exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { jobId, status } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const appIndex = user.appliedJobs.findIndex(app => app.job.toString() === jobId);

        if (appIndex > -1) {
            user.appliedJobs[appIndex].status = status;
            user.appliedJobs[appIndex].updatedAt = new Date();
            await user.save();
            res.json({ success: true, application: user.appliedJobs[appIndex] });
        } else {
            res.status(404).json({ message: "Application not found" });
        }
    } catch (err) {
        next(err);
    }
};

// --- Gamification ---

exports.getLeaderboard = async (req, res, next) => {
    try {
        // Get top 10 students by XP (Only those who have earned XP)
        const leaderboard = await User.find({
            role: 'student',
            'gamification.xp': { $gt: 0 }
        })
            .sort({ 'gamification.xp': -1 })
            .limit(10)
            .select('name profile.location profile.collegeId gamification');

        // Populate College Name if possible
        // Note: Since collegeId is a reference in profile, we can populate it
        // but let's just return what we have for speed.

        res.json(leaderboard);
    } catch (err) {
        next(err);
    }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .select('-passwordHash')
            .populate('savedColleges', 'name profile.location profile.collegeProfile.logo')
            .populate('savedJobs', 'title company location type salary')
            .populate({
                path: 'appliedJobs.job',
                select: 'title company location type salary applications' // temporary applications fetch
            })
            .populate('profile.collegeId', 'name profile.location');

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Transform appliedJobs to include interviewDetails from Job model
        const transformedAppliedJobs = user.appliedJobs.map(app => {
            const job = app.job;
            if (!job) return app;

            const jobApp = job.applications?.find(a => a.user.toString() === userId.toString());

            let interviewDetails = null;
            if (jobApp && jobApp.interviewDetails) {
                interviewDetails = jobApp.interviewDetails;
            }

            // Expose a clean job object without all applications
            const { applications, ...cleanJob } = job.toObject();

            return {
                ...app.toObject(),
                job: cleanJob,
                interviewDetails,
                status: app.status || (jobApp ? jobApp.status : 'applied')
            };
        });

        // Convert user to object and update appliedJobs
        const userObj = user.toObject();
        userObj.appliedJobs = transformedAppliedJobs;

        res.json(userObj);
    } catch (err) {
        next(err);
    }
};

// Get any user profile by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-passwordHash -refreshToken')
            .populate('savedColleges', 'name profile.location profile.collegeProfile.logo')
            .populate('savedJobs', 'title company location type salary')
            .populate({
                path: 'appliedJobs.job',
                select: 'title company location type salary'
            })
            .populate('profile.collegeId', 'name profile.location');

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// Update user profile (generic for all roles)
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log(`[API] Update Profile for User: ${userId} (${req.user.role})`);

        const updates = req.body;

        // Security: Prevent updating sensitive fields
        delete updates.passwordHash;
        delete updates.role;
        delete updates.email;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-passwordHash')
            .populate('profile.collegeId', 'name profile.location');

        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log(`[API] Profile updated successfully for ${userId}`);
        res.json(user);
    } catch (err) {
        console.error(`[API] Update Profile Error (${req.user.id}):`, err.message);
        next(err);
    }
};

// Analyze Profile AI
exports.analyzeProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const { analyzeProfile } = require('../services/geminiService');
        const analysis = await analyzeProfile({
            name: user.name,
            ...user.profile,
            // Pass other relevant fields if needed
        });

        res.json(analysis);
    } catch (err) {
        next(err);
    }
};

// Get list of all colleges (for Students/Public)
exports.getColleges = async (req, res, next) => {
    try {
        const counselors = await User.find({ role: 'counselor' })
            .select('name email profile.location profile.collegeProfile profile.managedColleges')
            .lean();

        // 1. Collect all college IDs (primary and managed)
        const allCollegeIds = [];
        counselors.forEach(c => {
            if (c.profile?.collegeProfile) allCollegeIds.push(c._id);
            if (c.profile?.managedColleges) {
                c.profile.managedColleges.forEach(mc => allCollegeIds.push(mc._id || mc.id));
            }
        });

        // 2. Fetch average ratings for all these colleges at once
        const ratings = await CollegeReview.aggregate([
            { $match: { collegeId: { $in: allCollegeIds } } },
            {
                $group: {
                    _id: "$collegeId",
                    avgRating: { $avg: "$rating" },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);

        // Map ratings for easy lookup
        const ratingMap = {};
        ratings.forEach(r => {
            ratingMap[r._id.toString()] = {
                avgRating: Math.round(r.avgRating * 10) / 10,
                reviewCount: r.reviewCount
            };
        });

        let allColleges = [];

        counselors.forEach(c => {
            // Add primary profile if exists
            if (c.profile?.collegeProfile && c.name) {
                const r = ratingMap[c._id.toString()] || { avgRating: 0, reviewCount: 0 };
                allColleges.push({
                    id: c._id, // Use User ID for primary
                    name: c.name,
                    location: c.profile?.location,
                    ...c.profile?.collegeProfile,
                    email: c.email,
                    isPrimary: true,
                    avgRating: r.avgRating,
                    reviewCount: r.reviewCount
                });
            }

            // Add managed ones
            if (c.profile?.managedColleges?.length > 0) {
                c.profile.managedColleges.forEach(mc => {
                    const collegeId = mc._id || mc.id;
                    const r = ratingMap[collegeId.toString()] || { avgRating: 0, reviewCount: 0 };
                    allColleges.push({
                        ...mc,
                        id: collegeId,
                        counselorId: c._id,
                        email: c.email,
                        isPrimary: false,
                        avgRating: r.avgRating,
                        reviewCount: r.reviewCount
                    });
                });
            }
        });

        res.json(allColleges);
    } catch (err) {
        next(err);
    }
};

// Get single college details
exports.getCollegeById = async (req, res, next) => {
    try {
        const id = req.params.id;

        // 1. Try finding by User ID (Primary College)
        const primary = await User.findById(id)
            .select('name email role profile.location profile.collegeProfile')
            .lean();

        if (primary && primary.role === 'counselor') {
            // Fetch reviews for primary college
            const reviews = await CollegeReview.find({ collegeId: new mongoose.Types.ObjectId(id) }).sort({ createdAt: -1 });
            const avgRating = reviews.length > 0
                ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length * 10) / 10
                : 0;

            return res.json({
                id: primary._id,
                name: primary.name,
                email: primary.email,
                role: primary.role,
                location: primary.profile?.location,
                ...primary.profile?.collegeProfile,
                reviews,
                avgRating,
                reviewCount: reviews.length
            });
        }

        // 2. Try finding in managedColleges arrays of all counselors
        const counselor = await User.findOne({
            'profile.managedColleges._id': id
        }).select('email profile.managedColleges').lean();

        if (counselor) {
            const college = counselor.profile.managedColleges.find(c => c._id.toString() === id);
            if (college) {
                // Fetch reviews for managed college
                const reviews = await CollegeReview.find({ collegeId: new mongoose.Types.ObjectId(id) }).sort({ createdAt: -1 });
                const avgRating = reviews.length > 0
                    ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length * 10) / 10
                    : 0;

                return res.json({
                    ...college,
                    id: college._id,
                    email: counselor.email,
                    reviews,
                    avgRating,
                    reviewCount: reviews.length
                });
            }
        }

        res.status(404).json({ message: 'College not found' });
    } catch (err) {
        next(err);
    }
};

// Add review for a college
exports.addReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const collegeIdStr = req.params.id;
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(collegeIdStr)) {
            return res.status(400).json({ message: 'Invalid college ID format' });
        }
        const collegeId = new mongoose.Types.ObjectId(collegeIdStr);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newReview = new CollegeReview({
            collegeId,
            userId,
            userName: user.name,
            rating: Number(rating),
            comment: String(comment).trim()
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (err) {
        next(err);
    }
};

exports.toggleSaveCollege = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id: collegeId } = req.params;

        const user = await User.findById(userId);

        const isSaved = user.savedColleges.includes(collegeId);

        if (isSaved) {
            user.savedColleges.pull(collegeId);
        } else {
            user.savedColleges.push(collegeId);
        }

        await user.save();

        res.json({
            success: true,
            isSaved: !isSaved,
            savedColleges: user.savedColleges
        });
    } catch (err) {
        next(err);
    }
};

// Get Dashboard Stats (Role-based)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let stats = {};

        if (role === 'counselor') {
            const interestedStudents = await User.countDocuments({ savedColleges: userId });

            stats = {
                totalStudents: interestedStudents,
                placedStudents: 0,
                activeCompanies: 0,
                upcomingDrives: 0
            };
        } else if (role === 'employer') {
            const Job = require('../models/Job');
            const jobs = await Job.find({ owner: userId });

            const activeJobs = jobs.length;
            const totalCandidates = jobs.reduce((acc, job) => acc + (job.applications ? job.applications.length : 0), 0);

            stats = {
                activeJobs,
                totalCandidates,
                interviews: 0,
                hired: 0
            };
        } else {
            // Student Stats
            const user = await User.findById(userId)
                .populate({
                    path: 'appliedJobs.job',
                    select: 'title company location type salary'
                })
                .populate('savedJobs', 'title company location type salary')
                .populate('savedColleges', 'name profile.location profile.collegeProfile.logo');

            const Interview = require('../models/Interview');

            // 1. Interviews Count
            const interviewCount = await Interview.countDocuments({ user: userId });

            // 2. Profile Score Calculation
            let score = 20; // Base score for signing up
            if (user.profile?.location) score += 10;
            if (user.profile?.bio) score += 10;
            if (user.profile?.skills?.length > 0) score += 20;
            if (user.profile?.resumeLink) score += 20;
            if (user.profile?.education?.length > 0) score += 20;
            if (score > 100) score = 100;

            stats = {
                appliedJobs: user.appliedJobs || [],
                savedJobs: [...(user.savedJobs || []), ...(user.savedColleges || [])],
                interviews: interviewCount,
                profileScore: score
            };
        }

        res.json(stats);
    } catch (err) {
        next(err);
    }
};

// Mark Challenge Solved
exports.markChallengeSolved = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { challengeId } = req.body;

        const user = await User.findById(userId);
        if (!user.solvedChallenges.includes(challengeId)) {
            user.solvedChallenges.push(challengeId);

            // Award XP
            await user.awardXP(50);
        }

        res.json({ success: true, solvedChallenges: user.solvedChallenges, gamification: user.gamification });
    } catch (err) {
        next(err);
    }
};

// Get all recruiters (for Colleges to choose from)
exports.getRecruiters = async (req, res, next) => {
    try {
        const recruiters = await User.find({ role: 'employer' })
            .select('name email profile.recruiterProfile profile.location')
            .lean();

        const formatted = recruiters.map(r => ({
            id: r._id,
            name: r.name,
            email: r.email,
            location: r.profile?.location,
            companyName: r.profile?.recruiterProfile?.companyName,
            industry: r.profile?.recruiterProfile?.industry
        }));

        res.json(formatted);
    } catch (err) {
        next(err);
    }
};

// Toggle Preferred Recruiter for a College
exports.togglePreferredRecruiter = async (req, res, next) => {
    try {
        const { recruiterId } = req.body;
        const collegeId = req.user.id; // Logged in as Counselor

        const college = await User.findById(collegeId);
        if (!college || college.role !== 'counselor') {
            return res.status(403).json({ message: 'Only colleges can manage preferred recruiters' });
        }

        const isPreferred = college.profile.collegeProfile.offCampusRecruiters.includes(recruiterId);

        if (isPreferred) {
            college.profile.collegeProfile.offCampusRecruiters.pull(recruiterId);
        } else {
            college.profile.collegeProfile.offCampusRecruiters.push(recruiterId);
        }

        await college.save();

        res.json({
            success: true,
            isPreferred: !isPreferred,
            offCampusRecruiters: college.profile.collegeProfile.offCampusRecruiters
        });
    } catch (err) {
        next(err);
    }
};

// Multi-college management for Counselors
exports.addManagedCollege = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'counselor') return res.status(403).json({ message: 'Only counselors can add colleges' });

        if ((user.profile.managedColleges?.length || 0) >= 10) {
            return res.status(400).json({ message: 'Maximum 10 colleges allowed per profile' });
        }

        const newCollege = {
            ...req.body,
            stats: { totalStudents: 0, placedStudents: 0, activeCompanies: 0, upcomingDrives: 0 }
        };

        user.profile.managedColleges.push(newCollege);
        await user.save();
        res.status(201).json(user);
    } catch (err) { next(err); }
};

exports.updateManagedCollege = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const collegeId = req.params.id;
        console.log(`[API] Update Managed College: ${collegeId} by user ${userId}`);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.profile.managedColleges.findIndex(c => c._id?.toString() === collegeId || c.id === collegeId);

        if (index === -1) {
            // Check if it's the primary college profile (the user itself)
            if (user._id.toString() === collegeId) {
                console.log(`[API] Updating Primary College Profile for user ${userId}`);
                user.name = req.body.name || user.name;
                if (!user.profile) user.profile = {};
                user.profile.location = req.body.location || user.profile.location;

                // Safe update for collegeProfile
                if (!user.profile.collegeProfile) user.profile.collegeProfile = { stats: { totalStudents: 0, placedStudents: 0, activeCompanies: 0, upcomingDrives: 0 } };

                // Update specific fields instead of spreading the whole object
                const fields = ['description', 'website', 'phone', 'established', 'courses', 'logo', 'campusPhotos', 'videoLink', 'mapsLink'];
                fields.forEach(field => {
                    if (req.body[field] !== undefined) {
                        user.profile.collegeProfile[field] = req.body[field];
                    }
                });
            } else {
                return res.status(404).json({ message: 'College not found' });
            }
        } else {
            // Update managed college in array
            console.log(`[API] Updating Managed College at index ${index} for user ${userId}`);
            const existing = user.profile.managedColleges[index];
            const fields = ['name', 'location', 'description', 'website', 'phone', 'established', 'courses', 'logo', 'campusPhotos', 'videoLink', 'mapsLink'];
            fields.forEach(field => {
                if (req.body[field] !== undefined) {
                    existing[field] = req.body[field];
                }
            });
            // Ensure stats exist for the managed college
            if (!existing.stats) {
                existing.stats = { totalStudents: 0, placedStudents: 0, activeCompanies: 0, upcomingDrives: 0 };
            }
        }

        await user.save();
        console.log(`[API] Managed college update saved successfully for ${userId}`);
        res.json(user);
    } catch (err) {
        console.error(`[API] Update Managed College Error (${req.user.id}):`, err.message);
        next(err);
    }
};

exports.deleteManagedCollege = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const collegeId = req.params.id;

        if (user._id.toString() === collegeId) {
            user.profile.collegeProfile = null;
        } else {
            user.profile.managedColleges = user.profile.managedColleges.filter(c => c._id.toString() !== collegeId);
        }

        await user.save();
        res.json(user);
    } catch (err) { next(err); }
};
