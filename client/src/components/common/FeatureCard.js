import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

export default function FeatureCard({ icon, title, description, to, color = 'primary', delay = '0' }) {
    const gradients = {
        primary: 'from-primary-500 to-indigo-600',
        secondary: 'from-secondary-500 to-pink-600',
        success: 'from-accent-500 to-emerald-600',
        accent: 'from-orange-500 to-red-600',
        warning: 'from-yellow-400 to-orange-500',
        error: 'from-red-500 to-rose-600',
    };

    return (
        <Link to={to} className="block group" style={{ animationDelay: `${delay}ms` }}>
            <Card hover className="h-full p-8 transition-all duration-300 group-hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[color] || gradients.primary} flex items-center justify-center text-white text-3xl mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {description}
                </p>

                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Get Started
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m-4-4H3" />
                    </svg>
                </div>
            </Card>
        </Link>
    );
}
