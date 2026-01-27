import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, ChevronDownIcon, CheckCircleIcon, ExclamationTriangleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { Card, Button } from '../common';
import { userApi } from '../../services/api';

export default function AIResumeAnalyzer() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setError(null);
        setIsOpen(true);
        try {
            const res = await userApi.analyzeProfile();
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze profile. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="mb-8">
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-[1px] shadow-xl"
            >
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"></div>

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    AI Profile & Resume Analyzer
                                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold uppercase tracking-wider">Beta</span>
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400">Get instant feedback on your profile strength and missing skills.</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full md:w-auto px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
                        >
                            {analyzing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    Analyze My Profile
                                </>
                            )}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isOpen && (result || error) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                                    {error ? (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5" />
                                            {error}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Score Card */}
                                            <div className="lg:col-span-1 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center text-center border border-slate-200 dark:border-slate-700">
                                                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                                    <svg className="w-full h-full transform -rotate-90">
                                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-700" />
                                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * result.score) / 100} className={`text-violet-500 transition-all duration-1000 ease-out`} strokeLinecap="round" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-3xl font-black text-slate-900 dark:text-white">{result.score}</span>
                                                        <span className="text-xs font-bold text-slate-500 uppercase">Score</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Profile Strength</h4>
                                                <p className="text-sm text-slate-500">{result.summary}</p>
                                            </div>

                                            {/* Details */}
                                            <div className="lg:col-span-2 space-y-6">
                                                <div>
                                                    <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                                        Missing Critical Skills
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.missingSkills.map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm font-medium rounded-lg border border-amber-100 dark:border-amber-900/30">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                                                        <LightBulbIcon className="w-5 h-5 text-emerald-500" />
                                                        Suggestions
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.suggestions.map((tip, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                                <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
