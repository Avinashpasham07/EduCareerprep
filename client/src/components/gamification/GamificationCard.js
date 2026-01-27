import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function GamificationCard({ user }) {
    // Safety check
    if (!user) return null;

    const level = user.gamification?.level || 1;
    const xp = user.gamification?.xp || 0;
    const xpProgress = xp % 100;
    const nextLevelXp = 100 - xpProgress;

    return (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider">Current Status</p>
                        <h3 className="text-3xl font-black mt-1">Level {level}</h3>
                    </div>
                    <div className="p-2 bg-white/20 backdrop-blur rounded-xl">
                        <TrophyIcon className="w-8 h-8 text-yellow-300" />
                    </div>
                </div>
                <div className="mb-2 flex justify-between text-xs font-bold opacity-80">
                    <span>XP Progress</span>
                    <span>{xpProgress} / 100 XP</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                    <div style={{ width: `${xpProgress}%` }} className="h-full bg-white/90 rounded-full"></div>
                </div>
                <p className="mt-4 text-xs text-emerald-100 font-medium leading-relaxed">
                    Earn {nextLevelXp} more XP to reach the next level!
                </p>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        </div>
    );
}
