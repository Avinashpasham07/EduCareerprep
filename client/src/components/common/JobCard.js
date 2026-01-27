import React from 'react';
import {
    BuildingOfficeIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
    CalendarIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

export default function JobCard({
    job,
    onClick,
    onSave,
    onApply,
    isSaved,
    isApplied,
    variant = 'card' // 'card' or 'row'
}) {

    // -------------------------------------------
    // Variant: ROW (Used in Dashboard / Compact)
    // -------------------------------------------
    if (variant === 'row') {
        return (
            <div onClick={onClick} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border border-slate-300 hover:border-emerald-200 dark:hover:border-white/10">
                <div className="w-14 h-14 shrink-0 rounded-xl bg-emerald-50 dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <BuildingOfficeIcon className="w-7 h-7 text-emerald-400 dark:text-emerald-500 group-hover:text-emerald-500 transition-colors " />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{job.title}</h4>
                        <div className="flex gap-2">
                            {job.hiringType && job.hiringType !== 'general' && (
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${job.hiringType === 'on-campus' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>
                                    {job.hiringType === 'on-campus' ? '🏫 On-Campus' : '🎓 Off-Campus'}
                                </span>
                            )}
                            {job.type && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg">
                                    {job.type}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold truncate">{job.company}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CurrencyRupeeIcon className="w-3.5 h-3.5" /> {job.salary || "Not disclosed"}</span>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------------------
    // Variant: CARD (Used in Jobs List)
    // -------------------------------------------
    const getTypeColor = (type) => {
        switch (type) {
            case 'full-time': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'internship': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'contract': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            case 'part-time': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            default: return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200 dark:border-slate-800';
        }
    };

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all shadow-sm hover:shadow-md">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center border-emerald-500 border justify-center">
                        <BuildingOfficeIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                {job.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                {job.hiringType && job.hiringType !== 'general' && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${job.hiringType === 'on-campus' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>
                                        {job.hiringType === 'on-campus' ? '🏫 On-Campus' : '🎓 Off-Campus'}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getTypeColor(job.type)}`}>
                                    {job.type}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400">
                                {job.applications?.length || 0} applicants
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><CurrencyRupeeIcon className="w-4 h-4" /> {job.salary || 'Competitive'}</span>
                        <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={onClick}
                            className="btn-secondary-new py-2 px-4 text-sm"
                        >
                            Details
                        </button>
                        {onApply && (
                            <button
                                onClick={onApply}
                                disabled={isApplied}
                                className="bg-green-500 text-white rounded-xl py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isApplied ? 'Applied' : 'Apply Now'}
                            </button>
                        )}
                        {onSave && (
                            <button
                                onClick={onSave}
                                className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                            >
                                {isSaved ? <BookmarkIconSolid className="w-5 h-5 fill-current text-primary-600" /> : <BookmarkIcon className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
