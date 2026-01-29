import React from 'react';
import { CameraIcon, MapPinIcon, BriefcaseIcon, DocumentIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function ProfileHero({ user, onEdit }) {
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';

    return (
        <div className="relative mb-8 group">
            {/* Cover Image - Premium Mesh Gradient */}
            <div className="h-64 md:h-80 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100 via-green-100 "></div>

                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] rounded-full bg-green-600/20 blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[100%] rounded-full bg-green-500/10 blur-[100px]"></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-black via-transparent to-transparent"></div>
            </div>

            {/* Profile Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-20 md:-mt-32">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 pb-6 text-center md:text-left">

                    {/* Unique Avatar with Ring/Glow */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] p-1 bg-gradient-to-br from-white/40 to-white/0 backdrop-blur-xl border border-white/20 shadow-2xl relative">
                            <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                                {(user?.profile?.avatar || user?.profile?.recruiterProfile?.logo) ? (
                                    <img src={user.profile.avatar || user.profile.recruiterProfile.logo} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                        <span className="text-4xl md:text-6xl font-black text-slate-300 dark:text-slate-700 select-none">
                                            {getInitials(user?.name)}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <CameraIcon className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* User Info - Glassmorphic Card Style */}
                    <div className="flex-1 md:pb-8 pt-2 md:pt-0">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                                {user?.role === 'employer' ? (user?.profile?.recruiterProfile?.companyName || user?.name) : user?.name}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-slate-600 dark:text-slate-400 mb-6 font-bold text-xs md:text-sm">
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <BriefcaseIcon className="w-4 h-4 text-emerald-500" />
                                    {user?.role === 'employer' ? (user?.profile?.recruiterProfile?.industry || 'Organization') : (user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student')}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <MapPinIcon className="w-4 h-4 text-violet-500" />
                                    {user?.profile?.location || 'Add Location'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {(user?.role === 'employer' ? user?.profile?.recruiterProfile?.benefits : user?.profile?.interests)?.length > 0 ?
                                    (user?.role === 'employer' ? user.profile.recruiterProfile.benefits : user.profile.interests).map((tag, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/30 dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200/50 dark:border-white/10 shadow-sm hover:scale-105 transition-transform cursor-default">
                                            {tag}
                                        </span>
                                    )) : (
                                        <span className="text-xs text-slate-400 italic font-medium">
                                            {user?.role === 'employer' ? 'Add company benefits...' : 'Add interests to customize your feed...'}
                                        </span>
                                    )}
                                {onEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                                    >
                                        + Edit
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Actions Grid */}
                    <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 md:flex gap-3 mt-4 md:mt-0 md:mb-8 self-center md:self-end">
                        {(user?.profile?.portfolioLink || user?.profile?.recruiterProfile?.website) && (
                            <a
                                href={user?.role === 'employer' ? (user.profile.recruiterProfile.website.startsWith('http') ? user.profile.recruiterProfile.website : `https://${user.profile.recruiterProfile.website}`) : user.profile.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <GlobeAltIcon className="w-4 h-4 text-emerald-500" />
                                {user?.role === 'employer' ? 'Website' : 'Portfolio'}
                            </a>
                        )}
                        {user?.role !== 'employer' && user?.profile?.resumeLink && (
                            <a
                                href={user.profile.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <DocumentIcon className="w-4 h-4 text-white" />
                                Resume
                            </a>
                        )}
                        <button className="px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            {user?.role === 'employer' ? 'Company Page' : 'Public Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
