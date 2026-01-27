import React from 'react';

export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 ${className}`}>
            <div className="flex overflow-x-auto scrollbar-hide p-2 space-x-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
              flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap
              ${activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }
            `}
                    >
                        <span className="mr-2 text-lg">{tab.icon}</span>
                        {tab.name}
                        {tab.count !== undefined && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
