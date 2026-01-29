import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import {
    BriefcaseIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

const COLUMNS = [
    { id: 'applied', title: 'Applied', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'shortlisted', title: 'Shortlisted', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'interview', title: 'Interview', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'offer', title: 'Offer', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'hired', title: 'Hired', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' }
];



export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggingId, setDraggingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await userApi.getApplications();
            console.log("Fetched Applications:", res.data); // DEBUG
            setApplications(res.data);
        } catch (err) {
            console.error("Failed to fetch applications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e, appId) => {
        setDraggingId(appId);
        e.dataTransfer.setData('applicationId', appId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, status) => {
        e.preventDefault();
        const appId = e.dataTransfer.getData('applicationId');

        // Optimistic Update
        const updatedApps = applications.map(app => {
            if (app.job._id === appId || app._id === appId) { // Handle mismatch if any
                return { ...app, status };
            }
            return app;
        });
        setApplications(updatedApps);

        // API Call
        try {
            // Find the job ID associated with this application
            const app = applications.find(a => a.job._id === appId || a._id === appId);
            if (app) {
                await userApi.updateMyApplicationStatus(app.job._id, status);
            }
        } catch (err) {
            console.error("Failed to update status", err);
            fetchApplications(); // Revert on error
        }
        setDraggingId(null);
    };

    if (loading) return (
        <div className="min-h-screen pt-24 flex justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 overflow-x-auto">
            <div className="max-w-[1800px] mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Application Tracker</h1>
                    <p className="text-slate-500 dark:text-slate-400">Drag and drop cards to update your application status.</p>
                </div>

                <div className="flex gap-6 min-w-full pb-8">
                    {COLUMNS.map(col => (
                        <div
                            key={col.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className="flex-1 min-w-[300px] bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col"
                        >
                            <div className={`flex items-center justify-between p-3 rounded-xl mb-4 border ${col.color} bg-opacity-50`}>
                                <h3 className="font-bold flex items-center gap-2">
                                    {col.title}
                                    <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs">
                                        {applications.filter(a => a.status === col.id).length}
                                    </span>
                                </h3>
                            </div>

                            <div className="flex-1 space-y-3 min-h-[200px]">
                                {applications
                                    .filter(app => (app.status || 'applied') === col.id)
                                    .map(app => {
                                        // Safety check for missing/deleted jobs
                                        if (!app.job) return null; // or render a placeholder

                                        return (
                                            <div
                                                key={app._id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, app.job._id)}
                                                className={`
                                                bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm
                                                cursor-grab active:cursor-grabbing hover:shadow-md transition-all
                                                ${draggingId === app.job?._id ? 'opacity-50 scale-95' : 'opacity-100'}
                                            `}
                                            >
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                                                    {app.job?.title || 'Unavailable Job'}
                                                </h4>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                                                    {app.job?.company || 'Unknown Company'}
                                                </p>

                                                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-3">
                                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded">
                                                        <MapPinIcon className="w-3 h-3" /> {app.job?.location || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded">
                                                        <CurrencyDollarIcon className="w-3 h-3" /> {app.job?.salary || 'N/A'}
                                                    </div>
                                                </div>

                                                {
                                                    app.status === 'interview' && app.interviewDetails && (
                                                        <div className="mb-3">
                                                            <a
                                                                href={app.interviewDetails.meetingLink || '#'}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="block w-full text-center py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm animate-pulse"
                                                            >
                                                                <CalendarDaysIcon className="w-4 h-4 inline-block mr-1 mb-0.5" /> Join Interview (External)
                                                            </a>
                                                            <p className="text-xs text-center text-amber-600 font-medium mt-1">
                                                                {new Date(app.interviewDetails.date).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )
                                                }

                                                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 flex justify-between items-center text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" /> {new Date(app.appliedDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
