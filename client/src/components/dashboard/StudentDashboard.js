import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BriefcaseIcon,
    UserCircleIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    CurrencyRupeeIcon,
    ChartBarIcon,
    BookOpenIcon,
    BeakerIcon,
    DocumentTextIcon,
    PuzzlePieceIcon,
    SparklesIcon,
    CommandLineIcon,
    MapIcon,
    BuildingLibraryIcon,
    BellIcon,
    ChevronRightIcon,
    AcademicCapIcon,
    TrophyIcon,
    FireIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { JobCard } from '../common/JobCard';
import CollegeCard from '../common/CollegeCard';
import Leaderboard from '../gamification/Leaderboard';

// --- Animations ---
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function StudentDashboard() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // State
    const [stats, setStats] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMarkCard, setShowMarkCard] = useState(false);

    // Dynamic Greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                // Parallel fetching for performance
                const [statsRes, jobsRes, collegeRes] = await Promise.allSettled([
                    userApi.getDashboardStats(),
                    userApi.getJobs({ limit: 4 }),
                    userApi.getColleges()
                ]);

                // Handle Stats
                setStats(statsRes.status === 'fulfilled' ? statsRes.value.data : { applied: 0, saved: 0, interviews: 0, profileScore: 65 });

                // Handle Jobs
                const jobsData = jobsRes.status === 'fulfilled' ? (jobsRes.value.data.jobs || jobsRes.value.data) : [];
                setJobs(Array.isArray(jobsData) ? jobsData : []);

                // Handle Colleges
                const collegesData = collegeRes.status === 'fulfilled' ? collegeRes.value.data : [];
                setColleges(collegesData?.slice(0, 4) || []);

            } catch (error) {
                console.error("Dashboard data load error", error);
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        if (user) loadDashboardData();
    }, [user]);

    return (
        <div className="min-h-screen -mt-40 bg-slate-50 dark:bg-black font-sans selection:bg-emerald-500/30">

            {/* --- Hero Section --- */}
            <div className="relative bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-white/10 pt-32 pb-16 px-6 overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Student Portal
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight -ml-1">
                                {getGreeting()}, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">{user?.name?.split(' ')[0] || 'Scholar'}</span>.
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                                Your complete career command center. From <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:text-white font-bold decoration-emerald-500/50  decoration-2 underline-offset-2"> learning to landing jobs</span>, everything you need is right here.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.4 }}
                            className="hidden lg:flex items-center justify-center relative pointer-events-none select-none"
                        >
                            {/* Big Student Icon - Slate & No Card */}
                            <AcademicCapIcon className="w-80 h-80 text-green-400 dark:text-emerald-500" />
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-12">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {loading ? (
                                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl hover:border-emerald-500 hover:border-2" />)
                            ) : (
                                <>
                                    <StatItem label="Applied Jobs" value={stats?.appliedJobs?.length || 0} icon={BriefcaseIcon} />
                                    <StatItem label="Saved Items" value={stats?.savedJobs?.length || 0} icon={BookOpenIcon} delay={0.1} />
                                    <StatItem label="Interviews" value={stats?.interviews || 0} icon={UserCircleIcon} delay={0.2} />
                                    <StatItem label="Profile Score" value={`${stats?.profileScore || 0}%`} icon={ChartBarIcon} delay={0.3} type="progress" />
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- Mark Card / Report Card Modal --- */}
            <AnimatePresence>
                {showMarkCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowMarkCard(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
                        >
                            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-widest">Skill Report Card</h3>
                                    <p className="opacity-80 text-sm font-medium">Official Student Evaluation • Term 1</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-md">
                                    <AcademicCapIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">Technical Proficiency</h4>
                                    <SkillBar skill="Data Structures" score={85} color="bg-emerald-500" />
                                    <SkillBar skill="Review Algorithms" score={60} color="bg-blue-500" />
                                    <SkillBar skill="Frontend Dev" score={92} color="bg-purple-500" />
                                    <SkillBar skill="Database Mgmt" score={74} color="bg-orange-500" />
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">Soft Skills</h4>
                                    <SkillBar skill="Communication" score={88} color="bg-pink-500" />
                                    <SkillBar skill="Leadership" score={79} color="bg-yellow-500" />
                                    <SkillBar skill="Problem Solving" score={95} color="bg-cyan-500" />
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-black/20 p-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Overall Grade:</span>
                                    <span className="text-2xl font-black text-emerald-600">A+</span>
                                </div>
                                <button onClick={() => setShowMarkCard(false)} className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition">Close Report</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Main Layout --- */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

                {/* Preparation Tools Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <SparklesIcon className="w-8 h-8 text-emerald-500" />
                                Power Tools
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Everything you need to crush your goals.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Tool Cards - All Unified Green Theme */}
                        <ToolCard
                            to="/interviews"
                            icon={BeakerIcon}
                            title="Mock Interview"
                            desc="Practice with AI-driven technical & HR rounds."
                        />
                        <ToolCard
                            to="/resume"
                            icon={DocumentTextIcon}
                            title="Resume Builder"
                            desc="Build ATS-friendly resumes in seconds."
                        />
                        <ToolCard
                            to="/playground"
                            icon={CommandLineIcon}
                            title="Code Arena"
                            desc="Compile and run code in 40+ languages."
                        />
                        <ToolCard
                            to="/assessments"
                            icon={PuzzlePieceIcon}
                            title="Skill Assessments"
                            desc="Prove your skills with timed tests."
                        />
                        <ToolCard
                            to="/roadmap"
                            icon={MapIcon}
                            title="AI Roadmap"
                            desc="Get a personalized learning path."
                        />
                        <ToolCard
                            to="/career-assessment"
                            icon={ChartBarIcon}
                            title="Career Predictor"
                            desc="Analyze your skills for the perfect role."
                        />
                        <ToolCard
                            to="/applications"
                            icon={BriefcaseIcon}
                            title="Application Tracker"
                            desc="Track your job applications Kanban-style."
                        />
                    </div>
                </section>

                {/* Two Column Layout: Jobs & Leaderboard */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Left: Jobs (Takes 2 cols) */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <FireIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">Recommended Jobs</h3>
                                </div>
                                <button onClick={() => navigate('/jobs')} className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 text-sm font-bold flex items-center gap-1 transition-colors">
                                    View All <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                                ) : jobs.length > 0 ? (
                                    jobs.map(job => (
                                        <JobCard
                                            key={job._id || job.id}
                                            job={job}
                                            onClick={() => navigate(`/jobs?id=${job._id}`)}
                                            variant="row"
                                        />
                                    ))
                                ) : (
                                    <EmptyState icon={BriefcaseIcon} text="No jobs found matching your profile yet." />
                                )}
                            </div>
                        </div>

                        {/* Featured Institutes */}
                        <div className="bg-white dark:bg-black rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <BuildingLibraryIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">Featured Institutes</h3>
                                </div>
                                <button onClick={() => navigate('/colleges')} className="text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 text-sm font-bold flex items-center gap-1 transition-colors">
                                    Explore <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                                ) : colleges.length > 0 ? (
                                    colleges.map(college => (
                                        <CollegeCard
                                            key={college._id || college.id}
                                            college={college}
                                            onClick={() => navigate(`/colleges/${college._id || college.id}`)}
                                            variant="row"
                                        />
                                    ))
                                ) : (
                                    <EmptyState icon={BuildingLibraryIcon} text="No colleges featured at the moment." />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Leaderboard */}
                    <div className="space-y-6">
                        <Leaderboard />

                        {/* Gamification Status Card */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider">Current Status</p>
                                        <h3 className="text-3xl font-black mt-1">Level {user?.gamification?.level || 1}</h3>
                                    </div>
                                    <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                                        <TrophyIcon className="w-8 h-8 text-yellow-300" />
                                    </div>
                                </div>
                                <div className="mb-2 flex justify-between text-xs font-bold opacity-80">
                                    <span>XP Progress</span>
                                    <span>{((user?.gamification?.xp || 0) % 100)} / 100 XP</span>
                                </div>
                                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                    <div style={{ width: `${(user?.gamification?.xp || 0) % 100}%` }} className="h-full bg-white/90 rounded-full"></div>
                                </div>
                                <p className="mt-4 text-xs text-emerald-100 font-medium leading-relaxed">
                                    Earn {100 - ((user?.gamification?.xp || 0) % 100)} more XP to reach the next level!
                                </p>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>

            </div>



        </div>
    );
}

/* --- Refined Sub-Components --- */

function StatItem(props) {
    const { label, value, icon: Icon, trend, type, delay = 0 } = props;
    return (
        <motion.div
            variants={fadeInUp}
            className="group relative bg-white dark:bg-white/5 p-6 rounded-3xl border-emerald-150 border-2 dark:border-white/10 shadow-sm hover:-translate-y-1 transition-all duration-300 hover:border-emerald-200 dark:hover:border-white/10"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">{trend}</span>}
            </div>

            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">{value}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">{label}</p>

            {/* Progress Bar for Profile Score */}
            {type === 'progress' && (
                <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: value }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
            )}
        </motion.div>
    );
}

function ToolCard({ to, icon: Icon, title, desc }) {
    const navigate = useNavigate();

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(to)}
            className="group relative text-left p-6 rounded-3xl bg-white dark:bg-white/5 border border-green-200 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity">
                <Icon className="w-24 h-24 -mr-8 -mt-8 rotate-12" />
            </div>

            <div className={`mb-4 inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300`}>
                <Icon className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed pr-8">
                {desc}
            </p>
        </motion.button>
    );
}

function SkillBar({ skill, score, color }) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{skill}</span>
                <span className="text-sm font-bold text-emerald-600">{score}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}

function EmptyState({ icon: Icon, text }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-full mb-3">
                <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{text}</p>
        </div>
    );
}

function Skeleton({ className }) {
    return <div className={`animate-pulse bg-green-200 dark:bg-white/5 ${className}`}></div>;
}
