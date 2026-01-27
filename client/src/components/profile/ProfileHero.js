import React from 'react';
import { CameraIcon, MapPinIcon, BriefcaseIcon, DocumentIcon } from '@heroicons/react/24/outline';
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-32">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-8 pb-6">

                    {/* Unique Avatar with Ring/Glow */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-10"
                    >
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] p-1.5 bg-gradient-to-br from-white/20 to-white/0 backdrop-blur-xl border border-white/20 shadow-2xl relative">
                            <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group-hover:scale-[1.02] transition-transform duration-500">
                                {user?.profile?.avatar ? (
                                    <img src={user.profile.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                        <span className="text-6xl font-black text-slate-300 dark:text-slate-700 select-none">
                                            {getInitials(user?.name)}
                                        </span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                    <CameraIcon className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* User Info - Glassmorphic Card Style */}
                    <div className="flex-1 md:pb-8 text-center md:text-left pt-4 md:pt-0">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                {user?.name || 'Student Name'}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 dark:text-slate-400 mb-6 font-medium">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                    <BriefcaseIcon className="w-4 h-4 text-emerald-500" />
                                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                                    <MapPinIcon className="w-4 h-4 text-violet-500" />
                                    {user?.profile?.location || 'Add Location'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {user?.profile?.interests?.length > 0 ? user.profile.interests.map((tag, i) => (
                                    <span key={i} className="px-4 py-1.5 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold border border-slate-200/50 dark:border-white/10 shadow-sm hover:scale-105 transition-transform cursor-default">
                                        {tag}
                                    </span>
                                )) : (
                                    <span className="text-sm text-slate-400 italic">Add interests to customize your feed...</span>
                                )}
                                {onEdit && (
                                    <button
                                        onClick={onEdit}
                                        className="px-4 py-1.5 bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 rounded-xl text-sm font-bold transition-all"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-8 md:mb-12 self-center md:self-end">
                        {user?.profile?.portfolioLink && (
                            <a
                                href={user.profile.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 flex items-center gap-2"
                            >
                                <BriefcaseIcon className="w-4 h-4 text-emerald-500" />
                                Visit Website
                            </a>
                        )}
                        {user?.profile?.resumeLink && (
                            <a
                                href={user.profile.resumeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 dark:shadow-none hover:-translate-y-1 flex items-center gap-2"
                            >
                                <DocumentIcon className="w-4 h-4 text-white" />
                                View Resume
                            </a>
                        )}
                        <button className="px-6 py-3 rounded-2xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all">
                            Public View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
