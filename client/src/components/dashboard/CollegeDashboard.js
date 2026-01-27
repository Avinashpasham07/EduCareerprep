import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import CollegeProfileEditor from './CollegeProfileEditor';
import Footer from '../common/Footer';
import JobDetailModal from './JobDetailModal';
import BroadcastModal from './BroadcastModal';
// Assuming you have these icons or similar installed
import {
    UsersIcon,
    AcademicCapIcon,
    BuildingLibraryIcon,
    CalendarIcon,
    ChartBarIcon,
    BriefcaseIcon,
    MegaphoneIcon,
    PlusIcon,
    ArrowTopRightOnSquareIcon,
    ArrowTrendingUpIcon,
    BellIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function CollegeDashboard() {
    const { user } = useSelector((s) => s.auth);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

    // Enhanced Placeholder Data with Trends
    const [stats, setStats] = useState({
        totalStudents: { value: 0, trend: '0%', label: 'vs last year' },
        placedStudents: { value: 0, trend: '0%', label: 'vs last month' },
        activeCompanies: { value: 0, trend: '0', label: 'new this week' },
        upcomingDrives: { value: 0, trend: '0', label: 'scheduled' }
    });

    const [targetedJobs, setTargetedJobs] = useState([]);
    const [recruiters, setRecruiters] = useState([]);

    // Derived Recent Activity from Real Data
    const recentActivity = targetedJobs.map(job => ({
        id: job._id || job.id,
        text: `${job.company} scheduled a drive for ${job.title}`,
        time: new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        type: "drive"
    })).slice(0, 5);

    useEffect(() => {
        // Fetch stats logic here
    }, []);

    const tabs = ['Overview', 'Students', 'Hiring Partners'];

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [statsRes, jobsRes, recRes] = await Promise.all([
                    api.get('/colleges/stats'),
                    api.get('/jobs'),
                    api.get('/user/recruiters')
                ]);

                if (statsRes.data) {
                    setStats(prev => ({
                        totalStudents: { ...prev.totalStudents, value: statsRes.data.totalStudents || 0 },
                        placedStudents: { ...prev.placedStudents, value: statsRes.data.placedStudents || 0 },
                        activeCompanies: { ...prev.activeCompanies, value: statsRes.data.activeCompanies || 0 },
                        upcomingDrives: { ...prev.upcomingDrives, value: jobsRes.data.length || 0 }
                    }));
                }
                setTargetedJobs(jobsRes.data);
                setRecruiters(recRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const handleUpdateStats = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const payload = {
            totalStudents: Number(formData.get('totalStudents')),
            placedStudents: Number(formData.get('placedStudents')),
            activeCompanies: Number(formData.get('activeCompanies')),
            upcomingDrives: Number(formData.get('upcomingDrives'))
        };

        try {
            const { data } = await api.put('/colleges/stats', payload);
            setStats(prev => ({
                totalStudents: { ...prev.totalStudents, value: data.totalStudents },
                placedStudents: { ...prev.placedStudents, value: data.placedStudents },
                activeCompanies: { ...prev.activeCompanies, value: data.activeCompanies },
                upcomingDrives: { ...prev.upcomingDrives, value: data.upcomingDrives }
            }));
            alert("Statistics updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update statistics.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">

            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Brand / Logo Area */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <BuildingLibraryIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    {user?.name || 'OnIT Campus'}
                                </h1>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Admin Console</p>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsBroadcastOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">New Notice</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Sidebar Navigation */}
                    <nav className="w-full md:w-64 flex-shrink-0">
                        <div className="sticky top-24 space-y-1">
                            {tabs.map(tab => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                                            group w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-r-lg transition-all duration-200 border-l-[3px]
                                            ${isActive
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        <span className={`transition-colors duration-200 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                            {tab === 'Overview' && <ChartBarIcon className="w-5 h-5" />}
                                            {tab === 'Manage Profile' && <BuildingLibraryIcon className="w-5 h-5" />}
                                            {tab === 'Students' && <UsersIcon className="w-5 h-5" />}
                                            {tab === 'Hiring Partners' && <BriefcaseIcon className="w-5 h-5" />}

                                        </span>
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Content Area */}
                    <main className="flex-1 min-w-0">
                        {activeTab === 'Overview' && (
                            <div className="space-y-6 animate-fade-in-up">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        title="Total Students"
                                        value={stats.totalStudents.value}
                                        trend={stats.totalStudents.trend}
                                        sub={stats.totalStudents.label}
                                        icon={<UsersIcon className="w-6 h-6" />}
                                    />
                                    <StatCard
                                        title="Placed"
                                        value={stats.placedStudents.value}
                                        trend={stats.placedStudents.trend}
                                        sub={stats.placedStudents.label}
                                        icon={<AcademicCapIcon className="w-6 h-6" />}
                                    />
                                    <StatCard
                                        title="Partners"
                                        value={stats.activeCompanies.value}
                                        trend={stats.activeCompanies.trend}
                                        sub={stats.activeCompanies.label}
                                        icon={<BriefcaseIcon className="w-6 h-6" />}
                                    />
                                    <StatCard
                                        title="Active Drives"
                                        value={stats.upcomingDrives.value}
                                        trend={stats.upcomingDrives.trend}
                                        sub={stats.upcomingDrives.label}
                                        icon={<CalendarIcon className="w-6 h-6" />}
                                        highlight
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Action Console */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            Quick Actions
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ConsoleCard
                                                icon={<UsersIcon className="w-6 h-6" />}
                                                title="Update Student Data"
                                                desc="Update total count and placement records."
                                                action="Manage Data"
                                                onClick={() => setActiveTab('Students')}
                                            />
                                            <ConsoleCard
                                                icon={<BriefcaseIcon className="w-6 h-6" />}
                                                title="Targeted Opportunities"
                                                desc="View jobs specifically for your college."
                                                action="View Drives"
                                                onClick={() => setActiveTab('Hiring Partners')}
                                            />
                                            <ConsoleCard
                                                icon={<MegaphoneIcon className="w-6 h-6" />}
                                                title="Broadcast Notice"
                                                desc="Send alerts to all student dashboards."
                                                action="Create Post"
                                                onClick={() => setIsBroadcastOpen(true)}
                                            />
                                            <ConsoleCard
                                                icon={<ArrowTopRightOnSquareIcon className="w-6 h-6" />}
                                                title="Public Page"
                                                desc="Edit the landing page visible to visitors."
                                                action="Edit Page"
                                                onClick={() => setActiveTab('Manage Profile')}
                                            />
                                        </div>
                                    </div>

                                    {/* Recent Activity Feed */}
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-fit">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Recent Activity</h3>
                                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                                            {recentActivity.map((activity) => (
                                                <div key={activity.id} className="relative pl-6">
                                                    <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 shadow-sm"></span>
                                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug">{activity.text}</p>
                                                    <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-6 py-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-emerald-200 transition-all">
                                            View Full Log
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === 'Students' && (
                            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="border-b border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/50">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <UsersIcon className="w-5 h-5 text-emerald-600" />
                                        Manage Student Data
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">Update your institution's registration and placement records.</p>
                                </div>
                                <form onSubmit={handleUpdateStats} className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Total Students Enrolled</label>
                                            <input
                                                type="number"
                                                name="totalStudents"
                                                defaultValue={stats.totalStudents.value}
                                                className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Total Placed Students</label>
                                            <input
                                                type="number"
                                                name="placedStudents"
                                                defaultValue={stats.placedStudents.value}
                                                className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Active Hiring Partners</label>
                                            <input
                                                type="number"
                                                name="activeCompanies"
                                                defaultValue={stats.activeCompanies.value}
                                                className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Upcoming Drives</label>
                                            <input
                                                type="number"
                                                name="upcomingDrives"
                                                defaultValue={stats.upcomingDrives.value}
                                                className="w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'Hiring Partners' && (
                            <HiringPartnersTab
                                user={user}
                                recruiters={recruiters}
                                targetedJobs={targetedJobs}
                                setTargetedJobs={setTargetedJobs}
                                loading={loading}
                            />
                        )}


                    </main>
                </div>
            </div>
            <Footer />
            <BroadcastModal
                isOpen={isBroadcastOpen}
                onClose={() => setIsBroadcastOpen(false)}
                userRole="counselor"
            />
        </div>
    );
}

function HiringPartnersTab({ user, recruiters, targetedJobs, setTargetedJobs, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    const preferredRecruiters = user?.profile?.collegeProfile?.offCampusRecruiters || [];

    const togglePartner = async (id) => {
        try {
            await api.post('/user/college/preferred-recruiters', { recruiterId: id });
            alert("Partner status updated! (Refresh to see changes in profile)");
        } catch (err) {
            alert("Failed to update partner status");
        }
    };

    const filteredRecruiters = recruiters.filter(r =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center animate-pulse text-slate-500 font-medium italic">Scanning network for recruiters...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Targeted Jobs Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MegaphoneIcon className="w-6 h-6 text-emerald-600" />
                        Active Drives for Your Campus
                    </h2>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {targetedJobs.length} ACTIVE DRIVES
                    </span>
                </div>

                {targetedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {targetedJobs.map(job => (
                            <div key={job._id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-500/20 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${job.hiringType === 'on-campus' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {job.hiringType === 'on-campus' ? '🏫 On-Campus Drive' : '🎓 Off-Campus/Preferred'}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{job.vacancies || 0} Openings</span>
                                </div>
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                                <p className="text-sm text-slate-500 mb-4">{job.company}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-bold text-emerald-600">{job.applications?.length || 0} Applied</span>
                                    <button
                                        onClick={() => setSelectedJob(job)}
                                        className="text-xs font-black text-slate-900 dark:text-white uppercase hover:text-emerald-600 transition-colors"
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 text-sm italic font-medium">No active drives specifically targeted at your campus yet.</p>
                    </div>
                )}
            </section>

            {/* Recruiter Discovery Section */}
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-emerald-600" />
                            Recruiter Discovery
                        </h2>
                        <p className="text-sm text-slate-500">Connect with employers for off-campus events and preferred status.</p>
                    </div>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecruiters.map(recruiter => {
                        const isPreferred = preferredRecruiters.includes(recruiter.id);
                        return (
                            <div key={recruiter.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-emerald-600">
                                        {recruiter.companyName?.[0] || recruiter.name?.[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{recruiter.companyName || recruiter.name}</h3>
                                        <p className="text-xs text-slate-500 truncate">{recruiter.industry || 'Tech / Engineering'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => togglePartner(recruiter.id)}
                                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isPreferred ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-200'}`}
                                    >
                                        {isPreferred ? '✓ Preferred Partner' : '🤝 Add as Partner'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Job Details Modal */}
            <JobDetailModal
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
            />
        </div>
    );
}

// ---------------- Sub Components ----------------

function StatCard({ title, value, trend, sub, icon, highlight }) {
    return (
        <div className="group relative overflow-hidden p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 font-display">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${highlight ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'} group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    {trend}
                </span>
                <span className="text-xs text-slate-400">{sub}</span>
            </div>
        </div>
    );
}

function ConsoleCard({ title, desc, action, onClick, icon }) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 leading-relaxed">{desc}</p>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                        {action} <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </div>
    );
}