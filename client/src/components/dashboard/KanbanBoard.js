import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const COLUMNS = [
    { id: 'Applied', label: 'Applied', color: 'blue', icon: DocumentTextIcon },
    { id: 'Screening', label: 'Screening', color: 'indigo', icon: ClockIcon },
    { id: 'Interview', label: 'Interview', color: 'amber', icon: ChatBubbleLeftRightIcon },
    { id: 'Offer', label: 'Offer', color: 'emerald', icon: CheckCircleIcon },
    { id: 'Rejected', label: 'Rejected', color: 'rose', icon: XCircleIcon },
];

export default function KanbanBoard({ jobs = [] }) {
    const groupedJobs = useMemo(() => {
        const groups = COLUMNS.reduce((acc, col) => {
            acc[col.id] = [];
            return acc;
        }, {});

        jobs.forEach(job => {
            const status = job.status || 'Applied';
            if (groups[status]) {
                groups[status].push(job);
            } else {
                // Fallback for unknown statuses
                if (!groups['Applied']) groups['Applied'] = [];
                groups['Applied'].push(job);
            }
        });

        return groups;
    }, [jobs]);

    return (
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x">
            {COLUMNS.map(col => (
                <div key={col.id} className="min-w-[280px] w-80 flex-shrink-0 snap-center">
                    <div className={`flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg bg-${col.color}-50 dark:bg-${col.color}-900/10 border border-${col.color}-100 dark:border-${col.color}-900/20`}>
                        <col.icon className={`w-5 h-5 text-${col.color}-600 dark:text-${col.color}-400`} />
                        <span className={`font-bold text-sm text-${col.color}-900 dark:text-${col.color}-100`}>{col.label}</span>
                        <span className={`ml-auto bg-white dark:bg-slate-800 text-${col.color}-600 dark:text-${col.color}-400 text-xs font-bold px-2 py-0.5 rounded-md border border-${col.color}-100 dark:border-${col.color}-900/30`}>
                            {groupedJobs[col.id]?.length || 0}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {groupedJobs[col.id]?.map((job, index) => (
                            <motion.div
                                key={job.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {job.title}
                                    </h4>
                                    {job.salary && (
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                            {job.salary}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium flex items-center gap-1">
                                    <span>{job.company}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'Just now'}
                                    </span>
                                    <button className="text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                        View &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {groupedJobs[col.id]?.length === 0 && (
                            <div className="h-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center">
                                <span className="text-xs text-slate-300 dark:text-slate-600 font-medium italic">Empty</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
