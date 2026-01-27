import React from 'react';
import Card from './Card';

export default function StatCard({ title, value, icon, color = 'primary', delay = '0' }) {
    const gradients = {
        primary: 'from-primary-500 to-indigo-600',
        secondary: 'from-secondary-500 to-pink-600',
        success: 'from-accent-500 to-emerald-600',
        accent: 'from-orange-500 to-red-600',
        warning: 'from-yellow-400 to-orange-500',
        info: 'from-blue-400 to-cyan-500',
    };

    return (
        <Card
            hover
            className="p-6 flex items-center justify-between"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>

            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[color] || gradients.primary} flex items-center justify-center text-white text-2xl shadow-lg shadow-primary-500/20 transform group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
        </Card>
    );
}
