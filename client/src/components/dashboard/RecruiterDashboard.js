import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { MegaphoneIcon, BriefcaseIcon, GlobeAltIcon, BuildingLibraryIcon, AcademicCapIcon, RocketLaunchIcon, EnvelopeIcon, PhoneIcon, CalendarDaysIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline';
import { userApi } from '../../services/api';
import CompanyProfileEditor from './CompanyProfileEditor';
import BroadcastModal from './BroadcastModal';

// Icons
const Icons = {
    dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    add: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
};

export default function RecruiterDashboard({ user }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await userApi.getMyJobs();
            // Handle both direct array and wrapped response
            const jobsData = res.data.jobs || (Array.isArray(res.data) ? res.data : []);
            setJobs(jobsData);
        } catch (err) {
            console.error(err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Active Jobs', value: Array.isArray(jobs) ? jobs.length : 0, icon: Icons.briefcase, color: 'bg-emerald-500' },
        { label: 'Total Applicants', value: Array.isArray(jobs) ? jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0) : 0, icon: Icons.users, color: 'bg-green-500' },
        { label: 'Views', value: Array.isArray(jobs) ? jobs.reduce((acc, job) => acc + (job.views || 0), 0) : 0, icon: Icons.dashboard, color: 'bg-teal-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-white/10 pt-32 pb-20 px-6 sm:px-8 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-8 animate-fade-in-up">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Recruiter Workspace
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">{user?.name?.split(' ')[0] || 'Recruiter'}</span>.
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
                                Manage your talent pipeline, post new opportunities, and connect with the best candidates efficiently.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsBroadcastOpen(true)}
                                className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-2xl font-bold border border-slate-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 group"
                            >
                                <MegaphoneIcon className="w-5 h-5 text-emerald-500" />
                                <span>Broadcast All</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('post-job')}
                                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 group"
                            >
                                {Icons.add}
                                <span>Post New Job</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-3xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                    <div className={`w-24 h-24 ${stat.color} rounded-full blur-2xl`}></div>
                                </div>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide mb-1 opacity-80">{stat.label}</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 pb-20">
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[600px]">

                    {/* Tabs Header */}
                    <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl overflow-x-auto scrollbar-hide">
                        {['overview', 'post-job', 'profile'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-5 text-sm font-bold uppercase tracking-wide transition-all relative whitespace-nowrap ${activeTab === tab
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                {tab === 'overview' ? 'Job Listings' : tab === 'post-job' ? 'Post a Job' : 'Company Profile'}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {activeTab === 'overview' && (
                            <MyJobsTab
                                jobs={jobs}
                                loading={loading}
                                onPostNew={() => setActiveTab('post-job')}
                                onManage={(job) => {
                                    setSelectedJob(job);
                                    setActiveTab('manage-job');
                                }}
                            />
                        )}
                        {activeTab === 'manage-job' && selectedJob && (
                            <ManageCandidates
                                job={selectedJob}
                                onBack={() => {
                                    setSelectedJob(null);
                                    setActiveTab('overview');
                                }}
                            />
                        )}
                        {activeTab === 'post-job' && (
                            <div className="animate-fade-in max-w-4xl mx-auto">
                                <PostJobForm onSuccess={() => {
                                    setActiveTab('overview');
                                    fetchMyJobs();
                                }} />
                            </div>
                        )}
                        {activeTab === 'profile' && (
                            <CompanyProfileEditor />
                        )}
                    </div>
                </div>
            </div>


            <BroadcastModal
                isOpen={isBroadcastOpen}
                onClose={() => setIsBroadcastOpen(false)}
                userRole="employer"
            />

            {/* Icons used in broadcast */}
            <svg style={{ display: 'none' }}>
                <symbol id="megaphone" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </symbol>
            </svg>
        </div>
    );
}

function MyJobsTab({ jobs, loading, onPostNew, onManage }) {
    if (loading) return (
        <div className="space-y-4">
            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
    );

    if (jobs.length === 0) return (
        <div className="text-center py-20">
            <BriefcaseIcon className="w-12 h-12 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Listings</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">You haven't posted any jobs yet. Create your first listing to start evaluating candidates.</p>
            <button onClick={onPostNew} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                Post First Job
            </button>
        </div>
    );

    return (
        <div className="grid gap-6">
            {jobs.map(job => (
                <div key={job._id} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-green-100 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-2xl font-bold text-green-600">
                        {job.company.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h3>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${job.type === 'internship' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {job.type}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                            {job.location} • Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                            {job.skills?.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-md">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{job.applications?.length || 0}</div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Applicants</div>
                        </div>
                        <button
                            onClick={() => onManage(job)}
                            className="flex-1 md:flex-none px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            Manage
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PostJobForm({ onSuccess }) {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { hiringType: 'general' }
    });
    const [colleges, setColleges] = useState([]);
    const hiringType = watch('hiringType');

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await userApi.getColleges();
                setColleges(res.data);
            } catch (err) {
                console.error('Failed to fetch colleges:', err);
            }
        };
        fetchColleges();
    }, []);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                skills: data.skills.split(',').map(s => s.trim()),
                requirements: data.requirements.split('\n').map(s => s.trim()),
                benefits: data.benefits.split(',').map(s => s.trim()),
                vacancies: parseInt(data.vacancies) || 0
            };
            await userApi.createJob(payload);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to post job.');
        }
    };

    const InputGroup = ({ label, name, placeholder, required, type = 'text', area = false }) => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{label} {required && <span className="text-red-500">*</span>}</label>
            {area ? (
                <textarea
                    {...register(name, { required })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all font-medium"
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    {...register(name, { required })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all font-medium"
                    placeholder={placeholder}
                />
            )}
            {errors[name] && <span className="text-red-500 text-xs">This field is required</span>}
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Opportunity</h2>
                <p className="text-slate-500">Reach thousands of pre-vetted candidates instantly.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="Job Title" name="title" placeholder="e.g. Senior Product Designer" required />
                    <InputGroup label="Company Name" name="company" placeholder="e.g. Acme Inc." required />
                    <InputGroup label="Location" name="location" placeholder="e.g. New York, Remote" required />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Employment Type</label>
                        <select {...register('type')} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white appearance-none font-medium">
                            <option value="full-time">Full Time</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                            <option value="part-time">Part Time</option>
                        </select>
                    </div>

                    <InputGroup label="Salary Range" name="salary" placeholder="e.g. ₹12L - ₹18L" />
                    <InputGroup label="Experience Required" name="experience" placeholder="e.g. 2-4 Years" />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Hiring Model</label>
                        <select {...register('hiringType')} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white appearance-none font-medium">
                            <option value="general">General (Public)</option>
                            <option value="on-campus">On-Campus Drive</option>
                            <option value="off-campus">Off-Campus/Preferred</option>
                        </select>
                    </div>

                    <InputGroup label="Vacancies" name="vacancies" type="number" placeholder="Number of openings" />
                </div>

                {hiringType !== 'general' && (
                    <div className="space-y-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 animate-fade-in">
                        <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                            Target Colleges
                        </h3>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500">Select the colleges that should have exclusive/preferred access to this drive.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {colleges.map(college => (
                                <label key={college.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-emerald-500 transition-all">
                                    <input
                                        type="checkbox"
                                        value={college.id}
                                        {...register('targetColleges')}
                                        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{college.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{college.location || 'Remote/TBD'}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <InputGroup label="Job Description" name="description" placeholder="Describe the role responsibilities..." area required />

                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="Required Skills (comma separated)" name="skills" placeholder="React, Node.js, TypeScript" />
                    <InputGroup label="Perks & Benefits (comma separated)" name="benefits" placeholder="Health Insurance, Remote Work" />
                </div>

                <InputGroup label="Requirements (one per line)" name="requirements" placeholder="- Bachelor's Degree&#10;- Portfolio required" area />

                <div className="pt-4 flex items-center justify-end gap-4">
                    <button type="submit" disabled={isSubmitting} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 transform transition-all hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Publishing...' : <><RocketLaunchIcon className="w-4 h-4 inline-block mr-1" /> Publish Job Opening</>}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ManageCandidates({ job, onBack }) {
    const [localJob, setLocalJob] = useState(job);
    const [schedulingUser, setSchedulingUser] = useState(null); // { userId, name }

    const updateStatus = async (userId, status, extraData = {}) => {
        try {
            await userApi.updateApplicationStatus(job._id, userId, { status, ...extraData });
            // Update local state
            setLocalJob(prev => ({
                ...prev,
                applications: prev.applications.map(app =>
                    app.user._id === userId ? { ...app, status, ...extraData } : app
                )
            }));
            if (status === 'interview') {
                // No alert needed, modal closes
            } else {
                alert(`Candidate marked as ${status}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="text-slate-500 hover:text-emerald-600 font-bold mb-6 flex items-center gap-2 transition-colors">
                ← Back to Jobs
            </button>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{localJob.title}</h2>
                    <p className="text-slate-500">Managing {localJob.applications?.length || 0} candidates</p>
                </div>
            </div>

            <div className="space-y-4">
                {localJob.applications && localJob.applications.length > 0 ? (
                    localJob.applications.map((app, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    {/* Header: Name & Status */}
                                    <div className="flex items-center gap-3">
                                        <Link to={`/profile/${app.user?._id}`} className="hover:scale-105 transition-transform duration-300">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-300 overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm">
                                                {app.user?.profile?.avatar ? (
                                                    <img src={app.user.profile.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    app.user?.name?.charAt(0) || '?'
                                                )}
                                            </div>
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{app.user?.name || 'Unknown Candidate'}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide 
                                                    ${app.status === 'interview' ? 'bg-amber-100 text-amber-700' :
                                                        app.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                    'bg-slate-100 text-slate-700'}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm">Applied on {new Date(app.createdAt || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-2">
                                            <EnvelopeIcon className="w-4 h-4" />
                                            <span className="font-medium">{app.user?.email}</span>
                                        </div>
                                        {(app.user?.phone || app.user?.profile?.phone) && (
                                            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                                                <PhoneIcon className="w-4 h-4" />
                                                <span className="font-medium text-slate-900 dark:text-white tracking-wide">{app.user?.phone || app.user?.profile?.phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {app.status === 'interview' && app.interviewDetails && (
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-700/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div>
                                                <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm uppercase tracking-wide mb-1">Video Interview Scheduled</h4>
                                                <p className="text-amber-700 dark:text-amber-300 font-medium">
                                                    <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" /> {new Date(app.interviewDetails.date).toLocaleString()}
                                                </p>
                                            </div>
                                            <a
                                                href={app.interviewDetails.meetingLink || `https://meet.google.com/new`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                                            >
                                                <CalendarDaysIcon className="w-4 h-4 inline-block mr-1" /> Open Meeting Link
                                            </a>
                                        </div>
                                    )}

                                    {/* Cover Letter */}
                                    {app.coverLetter && (
                                        <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 relative">
                                            <span className="absolute top-3 left-3 text-2xl text-slate-300 dark:text-slate-600">"</span>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 italic pl-6 pr-2 leading-relaxed">
                                                {app.coverLetter}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <a
                                            href={app.resumeUrl || app.user?.profile?.resumeLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold hover:bg-emerald-100 transition-colors shadow-sm"
                                        >
                                            <DocumentTextIcon className="w-4 h-4" /> View Resume
                                        </a>
                                        <Link
                                            to={`/profile/${app.user?._id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:indigo-500/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm"
                                        >
                                            <UserIcon className="w-4 h-4" /> View Overall Profile
                                        </Link>
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="flex flex-col gap-2 min-w-[150px]">
                                    {app.status === 'applied' && (
                                        <button
                                            onClick={() => updateStatus(app.user._id, 'shortlisted')}
                                            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                                        >
                                            Shortlist
                                        </button>
                                    )}

                                    {(app.status === 'applied' || app.status === 'shortlisted') && (
                                        <button
                                            onClick={() => setSchedulingUser({ userId: app.user._id, name: app.user.name })}
                                            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                                        >
                                            Schedule Interview
                                        </button>
                                    )}

                                    {app.status === 'interview' && (
                                        <button
                                            onClick={() => updateStatus(app.user._id, 'hired')}
                                            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all active:scale-95 animate-pulse"
                                        >
                                            Hire Candidate!
                                        </button>
                                    )}

                                    {app.status !== 'rejected' && app.status !== 'hired' && (
                                        <button
                                            onClick={() => updateStatus(app.user._id, 'rejected')}
                                            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                                        >
                                            Reject
                                        </button>
                                    )}

                                    {app.status === 'hired' && (
                                        <div className="w-full py-3 px-4 bg-green-100 text-green-700 font-bold text-sm rounded-xl text-center border border-green-200">
                                            Hired
                                        </div>
                                    )}
                                    {app.status === 'rejected' && (
                                        <div className="w-full py-3 px-4 bg-red-50 text-red-500 font-bold text-sm rounded-xl text-center border border-red-200">
                                            Rejected
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 font-medium">No applications yet.</p>
                    </div>
                )}
            </div>

            {/* Schedule Modal */}
            {schedulingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Schedule Interview</h3>
                        <p className="text-slate-500 mb-6 text-sm">Set the interview time and provide a link (Google Meet, Zoom, etc.) for <strong>{schedulingUser.name}</strong>.</p>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const date = formData.get('date');
                            const time = formData.get('time');
                            const meetingLink = formData.get('meetingLink');
                            const combinedDate = new Date(`${date}T${time}`);

                            updateStatus(schedulingUser.userId, 'interview', { date: combinedDate, meetingLink });
                            setSchedulingUser(null);
                        }}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Link</label>
                                    <input type="url" name="meetingLink" placeholder="https://meet.google.com/xxx-xxxx-xxx" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                        <input type="date" name="date" required className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                                        <input type="time" name="time" required className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setSchedulingUser(null)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
