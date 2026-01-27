import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common';
import {
    ChartBarIcon,
    CheckBadgeIcon,
    ArrowPathIcon,
    SpeakerWaveIcon,
    BoltIcon,
    FaceSmileIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function InterviewFeedback() {
    const navigate = useNavigate();
    const location = useLocation();

    // Fallback Mock Data if no state passed
    const stats = location.state?.stats || {
        score: 82,
        duration: "12:45",
        questions: 4,
        role: "Frontend Developer",
        metrics: {
            clarity: 85,
            technical: 80,
            confidence: 75
        },
        feedback: [
            { type: 'strength', text: "Excellent explanation of React concepts.", icon: 'check' },
            { type: 'improvement', text: "Could provide more specific examples.", icon: 'warning' }
        ]
    };

    // Map icon string to component
    const getIcon = (name, type) => {
        const className = `w-5 h-5 ${type === 'strength' ? 'text-green-500' : 'text-amber-500'}`;
        if (name === 'check') return <CheckBadgeIcon className={className} />;
        if (name === 'smile') return <FaceSmileIcon className={className} />;
        if (name === 'warning') return <ExclamationTriangleIcon className={className} />;
        if (name === 'speaker') return <SpeakerWaveIcon className={className} />; // Added for filler words
        return <BoltIcon className={className} />; // Default or generic icon
    };

    const feedbackList = stats.feedback?.map(f => ({
        ...f,
        icon: getIcon(f.icon, f.type)
    })) || [
            { type: 'strength', text: "Excellent explanation of React Component Lifecycle.", icon: <CheckBadgeIcon className="w-5 h-5 text-green-500" /> },
            { type: 'strength', text: "Good pacing and confident tone throughout.", icon: <FaceSmileIcon className="w-5 h-5 text-green-500" /> },
            { type: 'improvement', text: "Could provide more specific examples for error handling.", icon: <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" /> },
            { type: 'improvement', text: "Used filler words ('um', 'like') 15 times.", icon: <SpeakerWaveIcon className="w-5 h-5 text-amber-500" /> }
        ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Session Analysis</h1>
                    <p className="text-slate-500">
                        {stats.role} • {stats.duration} Duration
                    </p>
                </div>

                {/* Score Card */}
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-slate-200 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Circular Progress (CSS only) */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * stats.score) / 100} className="text-green-500" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{stats.score}</span>
                            <span className="text-xs font-bold text-green-500 uppercase">Excellent</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Great Job! You're impressive.</h3>
                            <p className="text-slate-500 text-sm">You demonstrated strong technical knowledge. Focus on structuring your behavioral answers more effectively to reach the next level.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Clarity</div>
                                <div className="text-lg font-bold text-slate-900">{stats.metrics?.clarity || 85}%</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Technical</div>
                                <div className="text-lg font-bold text-slate-900">{stats.metrics?.technical || 80}%</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Confidence</div>
                                <div className="text-lg font-bold text-slate-900">{stats.metrics?.confidence || 75}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <BoltIcon className="w-5 h-5 text-green-500" /> Key Strengths
                        </h3>
                        <div className="space-y-4">
                            {feedbackList.filter(f => f.type === 'strength').map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-100">
                                    {item.icon}
                                    <p className="text-sm font-medium text-slate-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <ArrowPathIcon className="w-5 h-5 text-amber-500" /> Areas to Improve
                        </h3>
                        <div className="space-y-4">
                            {feedbackList.filter(f => f.type === 'improvement').map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    {item.icon}
                                    <p className="text-sm font-medium text-slate-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/interviews')}
                        className="w-40"
                    >
                        Back to Lobby
                    </Button>
                    <Button
                        onClick={() => navigate('/interview/room')}
                        className="w-40"
                    >
                        Practice Again
                    </Button>
                </div>

            </div>
        </div>
    );
}
