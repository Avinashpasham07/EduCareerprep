import { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { TrophyIcon, FireIcon, MapPinIcon } from '@heroicons/react/24/solid';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userApi.getLeaderboard()
            .then(res => setLeaders(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4 text-center text-slate-500">Loading rankings...</div>;

    return (
        <div className="bg-white dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-gradient-to-r from-amber-200/20 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                        <TrophyIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Top Students</h3>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Global Leaderboard</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
                {leaders.map((student, index) => (
                    <div key={student._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <div className={`
                            w-8 h-8 flex items-center justify-center rounded-full font-black text-sm
                            ${index === 0 ? 'bg-yellow-400 text-yellow-900 ring-4 ring-yellow-400/20' : ''}
                            ${index === 1 ? 'bg-slate-300 text-slate-800' : ''}
                            ${index === 2 ? 'bg-orange-300 text-orange-900' : ''}
                            ${index > 2 ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : ''}
                        `}>
                            {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{student.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10">Lvl {student.gamification?.level || 1}</span>
                                <span className="flex items-center gap-1 truncate">
                                    <MapPinIcon className="w-3 h-3 opacity-70" /> {student.profile?.location || 'India'}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                                {student.gamification?.xp || 0}
                                <span className="text-[10px] uppercase text-slate-400">XP</span>
                            </p>
                        </div>
                    </div>
                ))}

                {leaders.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        No rankings yet. Start learning to earn XP!
                    </div>
                )}
            </div>
        </div>
    );
}
