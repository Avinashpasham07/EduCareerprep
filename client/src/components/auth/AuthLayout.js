import React from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex bg-white dark:bg-slate-950">
            {/* Left Side - Visual (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-mesh opacity-80"></div>
                <div className="absolute inset-0 bg-green-200"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow delay-300"></div>

                {/* Content */}
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="mb-8 inline-flex p-4 bg-white backdrop-blur-md rounded-2xl border border-black shadow-xl animate-float">
                        <RocketLaunchIcon className="w-10 h-10 text-black" />
                    </div>
                    <h1 className="text-5xl font-bold font-display mb-6 text-black leading-tight">
                        Launch your <span className="text-black bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">career</span> journey today.
                    </h1>
                    <p className="text-lg text-black leading-relaxed opacity-90">
                        Join thousands of students and recruiters connecting on the most advanced career platform.
                    </p>

                    {/* Mini Stats Card */}
                    <div className="mt-12 flex gap-4">
                        <div className="glass-card p-4 text-black rounded-xl flex-1 backdrop-blur-sm bg-white border-black">
                            <div className="text-2xl font-bold">10+</div>
                            <div className="text-green-500 text-sm">Active Jobs</div>
                        </div>
                        <div className="glass-card p-4 text-black rounded-xl flex-1 backdrop-blur-sm bg-white border-black">
                            <div className="text-2xl font-bold">5+</div>
                            <div className="text-green-500 text-sm">Partners</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Background enhancements */}
                <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-primary-50/50 to-pink-50/50 dark:from-slate-900 dark:to-slate-900 -z-10"></div>

                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">E</div>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">EduCareer</span>
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">{title}</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
                    </div>

                    {children}

                    <p className="text-center text-xs text-slate-400 mt-12">
                        &copy; 2026 EduCareer Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
