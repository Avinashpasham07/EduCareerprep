import React from 'react';
import {
    XMarkIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
    BriefcaseIcon,
    BookmarkIcon,
    AcademicCapIcon,
    SparklesIcon,
    CheckCircleIcon,
    GiftIcon,
    BuildingLibraryIcon,
    CalendarDaysIcon,
    TrophyIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const JobDetailModal = ({ job, onClose, onApply, onSave, isApplied, isSaved }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
                {/* Header Section */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
                            <BuildingOfficeIcon className="w-10 h-10" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{job.title}</h2>
                                {job.hiringType && job.hiringType !== 'general' && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${job.hiringType === 'on-campus' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>
                                        {job.hiringType === 'on-campus' ? <><BuildingLibraryIcon className="w-3 h-3 inline-block mr-1 mb-0.5" /> On-Campus</> : <><AcademicCapIcon className="w-3 h-3 inline-block mr-1 mb-0.5" /> Off-Campus</>}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                <span className="hover:underline cursor-pointer">{job.company}</span>
                                <span className="text-slate-300 dark:text-slate-700 mx-1">•</span>
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-base flex items-center gap-1.5">
                                    <MapPinIcon className="w-4 h-4" /> {job.location}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-all hover:rotate-90"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Description */}
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 text-emerald-500" />
                                    About the Role
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-lg font-medium opacity-90">
                                    {job.description}
                                </p>
                            </section>

                            {/* Requirements */}
                            {job.requirements && job.requirements.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                                        Key Requirements
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {job.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {/* Benefits */}
                            {job.benefits && job.benefits.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <GiftIcon className="w-5 h-5 text-pink-500" />
                                        Perks & Benefits
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.benefits.map((benefit, i) => (
                                            <span key={i} className="px-4 py-2 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-bold border border-pink-100 dark:border-pink-500/20">
                                                <SparklesIcon className="w-3 h-3 inline-block mr-1 mb-0.5" /> {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats Card */}
                            <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 space-y-6">
                                <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest pl-1">Snapshot</h4>

                                <div className="space-y-5">
                                    <StatRow icon={CurrencyRupeeIcon} label="CTC Range" value={job.salary || 'Not Disclosed'} color="text-emerald-600" />
                                    <StatRow icon={BriefcaseIcon} label="Level" value={job.experience || 'Entry Level/Fresher'} color="text-blue-600" />
                                    <StatRow icon={AcademicCapIcon} label="Role Type" value={job.type || 'Full Time'} color="text-purple-600" />
                                    <StatRow icon={SparklesIcon} label="Vacancies" value={job.vacancies > 0 ? `${job.vacancies} Openings` : 'Limited'} color="text-orange-600" />
                                </div>
                            </div>

                            {/* Skills Card */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Company Bio/Owner info (Optional) */}
                            {job.owner?.profile?.recruiterProfile?.companyBio && (
                                <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 pl-1">Company Info</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed italic">
                                        "{job.owner.profile.recruiterProfile.companyBio}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    {onApply && (
                        <button
                            onClick={onApply}
                            disabled={isApplied}
                            className={`flex-[2] md:flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-lg uppercase tracking-wider transition-all shadow-xl flex justify-center items-center gap-1.5 md:gap-3 ${isApplied
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:-translate-y-1'
                                }`}
                        >
                            {isApplied ? (
                                (() => {
                                    switch (job.status) {
                                        case 'shortlisted': return <><SparklesIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Shortlisted</>;
                                        case 'interview': return <><CalendarDaysIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Interview Scheduled</>;
                                        case 'hired': return <><TrophyIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Selected / Hired</>;
                                        case 'rejected': return <><XCircleIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Application Rejected</>;
                                        default: return <><CheckCircleIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Application Submitted</>;
                                    }
                                })()
                            ) : (
                                <><BriefcaseIcon className="w-4 h-4 md:w-6 md:h-6 shrink-0" /> Apply Now Virtual</>
                            )}
                        </button>
                    )}

                    {onSave && (
                        <button
                            onClick={onSave}
                            className={`flex-1 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 border-2 transition-all text-xs md:text-base ${isSaved
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-lg'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-600'
                                }`}
                        >
                            <BookmarkIcon className={`w-4 h-4 md:w-6 md:h-6 ${isSaved ? 'fill-current' : ''} shrink-0`} />
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                    )}

                    {!onApply && !onSave && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg uppercase tracking-wider hover:opacity-90 transition-all"
                        >
                            Close Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatRow = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-slate-900 dark:text-white font-bold leading-none">{value}</p>
        </div>
    </div>
);

export default JobDetailModal;
