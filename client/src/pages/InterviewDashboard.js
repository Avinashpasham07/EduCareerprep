import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MicrophoneIcon,
    PlayCircleIcon,
    ClockIcon,
    CpuChipIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    SparklesIcon,
    AdjustmentsHorizontalIcon,
    TrophyIcon,
    FireIcon,
    ChartBarIcon,
    ArrowRightIcon,
    DevicePhoneMobileIcon,
    ShieldCheckIcon,
    PaintBrushIcon,
    CloudIcon
} from '@heroicons/react/24/outline';
import Footer from '../components/common/Footer';

export default function InterviewDashboard() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ avgScore: 0, practiceTime: "0h 0m" });
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [config, setConfig] = useState({
        role: '',
        difficulty: 'Intermediate',
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch('http://localhost:5000/api/interviews/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setHistory(data);

                // Calculate Stats
                if (data.length > 0) {
                    const totalScore = data.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
                    const avg = Math.round(totalScore / data.length);

                    const totalSeconds = data.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
                    const hours = Math.floor(totalSeconds / 3600);
                    const minutes = Math.floor((totalSeconds % 3600) / 60);

                    setStats({
                        avgScore: avg,
                        practiceTime: `${hours}h ${minutes}m`
                    });
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            }
        };
        fetchHistory();
    }, []);

    const roles = [
        { id: 'Frontend Developer', label: 'Frontend Dev', desc: 'React, CSS, DOM', icon: <CpuChipIcon className="w-6 h-6" /> },
        { id: 'Backend Developer', label: 'Backend Dev', desc: 'Node, DB, API', icon: <BriefcaseIcon className="w-6 h-6" /> },
        { id: 'Full Stack Developer', label: 'Fullstack', desc: 'End-to-end Systems', icon: <AcademicCapIcon className="w-6 h-6" /> },
        { id: 'Data Scientist', label: 'Data Scientist', desc: 'Python, ML, SQL', icon: <ChartBarIcon className="w-6 h-6" /> },
        { id: 'DevOps Engineer', label: 'DevOps', desc: 'Docker, AWS, CI/CD', icon: <CloudIcon className="w-6 h-6" /> },
        { id: 'Mobile Developer', label: 'Mobile Dev', desc: 'iOS, Android, React Native', icon: <DevicePhoneMobileIcon className="w-6 h-6" /> },
        { id: 'Cybersecurity Analyst', label: 'Cybersecurity', desc: 'Network, Encryption, Risk', icon: <ShieldCheckIcon className="w-6 h-6" /> },
        { id: 'UI/UX Designer', label: 'Product Design', desc: 'Figma, User Research', icon: <PaintBrushIcon className="w-6 h-6" /> },
        { id: 'HR', label: 'Behavioral', desc: 'Soft Skills, Leadership', icon: <MicrophoneIcon className="w-6 h-6" /> },
    ];

    const difficulties = [
        { id: 'Junior', color: 'bg-green-100 text-green-700 border-green-200' },
        { id: 'Intermediate', color: 'bg-amber-100 text-amber-700 border-amber-200' },
        { id: 'Senior', color: 'bg-red-100 text-red-700 border-red-200' }
    ];

    const handleStartInterview = () => {
        navigate('/interview/room', { state: { config } });
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-20 pb-12 font-sans text-slate-900 selection:bg-green-100">

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Dashboard Header & Stats */}
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Welcome back, Avinash</h1>
                    <p className="text-slate-500 mb-8">Ready to crush your next interview?</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <TrophyIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Score</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.avgScore}%</p>
                            </div>
                        </div>
                        {/* Streak Removed as requested */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Practice Time</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.practiceTime}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Action Area - The Hero / Configurator */}
                <div className="relative mb-12 group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 transition-opacity duration-500 ${isConfiguring ? 'opacity-40' : 'opacity-20'}`}></div>

                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 transition-all duration-500">

                        {/* HEADER - Always Visible */}
                        <div className="bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full mb-4 backdrop-blur-md border border-white/10">
                                        <SparklesIcon className="w-4 h-4 text-green-300" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-green-50">AI Simulator V2.0</span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Master Your Interview</h2>
                                    <p className="text-slate-400 max-w-lg">Configure a custom persona and receive real-time audio feedback.</p>
                                </div>

                                {!isConfiguring && (
                                    <button
                                        onClick={() => setIsConfiguring(true)}
                                        className="group bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-900/50 transition-all flex items-center gap-3 active:scale-95"
                                    >
                                        <PlayCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        Start New Session
                                    </button>
                                )}
                            </div>

                            {/* Decorative Noise/Pattern */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500 rounded-full blur-[80px] opacity-40"></div>
                        </div>

                        {/* CONFIGURATION PANEL - Slides Down */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isConfiguring ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 md:p-10 bg-white">

                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-green-600" />
                                    Customize Your Session
                                </h3>

                                {/* Grid Selection for Roles */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {roles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => setConfig({ ...config, role: role.id })}
                                            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${config.role === role.id
                                                ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-500/20'
                                                : 'border-slate-100 bg-white hover:border-green-200 hover:shadow-md'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${config.role === role.id ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600'
                                                }`}>
                                                {role.icon}
                                            </div>
                                            <div className="font-bold text-slate-800 text-sm mb-1">{role.label}</div>
                                            <div className="text-xs text-slate-400">{role.desc}</div>

                                            {config.role === role.id && (
                                                <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Difficulty Segmented Control */}
                                <div className="mb-8">
                                    <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Difficulty Level</label>
                                    <div className="flex flex-wrap gap-3">
                                        {difficulties.map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => setConfig({ ...config, difficulty: level.id })}
                                                className={`px-6 py-2.5 rounded-xl text-sm font-bold border transition-all ${config.difficulty === level.id
                                                    ? `${level.color} shadow-sm border-transparent ring-2 ring-offset-1 ring-slate-100`
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                {level.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={handleStartInterview}
                                        disabled={!config.role}
                                        className="flex-1 bg-slate-900 text-white h-12 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>Enter Interview Room</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsConfiguring(false)}
                                        className="px-6 h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Recent History Section */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-slate-400" />
                            Recent Sessions
                        </h2>
                        <button className="text-sm font-bold text-green-600 hover:text-green-700">View All</button>
                    </div>

                    {history.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {history.map((item, i) => {
                                // Format Duration
                                const mins = Math.floor((item.durationSeconds || 0) / 60);
                                const secs = (item.durationSeconds || 0) % 60;
                                const durationStr = `${mins}m ${secs}s`;

                                // Format Date
                                const dateStr = new Date(item.createdAt).toLocaleDateString();

                                return (
                                    <div key={item._id || i} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-green-50 transition-colors">
                                                <ChartBarIcon className="w-6 h-6 text-slate-400 group-hover:text-green-600" />
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.overallScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {item.overallScore || 0}% Score
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1">{item.role}</h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                                            <span>{dateStr}</span>
                                            <span>•</span>
                                            <span>{durationStr}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-800 rounded-full" style={{ width: `${item.overallScore || 0}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <SparklesIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">No Interviews Yet</h3>
                            <p className="text-slate-400">Start a new session to begin tracking your progress.</p>
                        </div>
                    )}
                </div>

            </div>
            <Footer />
        </div>
    );
}