import React from 'react';
import {
    BuildingLibraryIcon,
    MapPinIcon,
    ArrowRightIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function CollegeCard({
    college,
    onClick,
    variant = 'card' // 'card' or 'row'
}) {

    // -------------------------------------------
    // Variant: ROW (Used in Dashboard / Compact)
    // -------------------------------------------
    if (variant === 'row') {
        return (
            <div onClick={onClick} className="group flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-slate-300 border hover:border-slate-200 dark:hover:border-white/10">
                <div className="w-14 h-14 shrink-0 border-emerald-300 border rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    {college.logo ? (
                        <img src={college.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                        <BuildingLibraryIcon className="w-7 h-7" />
                    )}
                </div>
                <div className="flex-1 min-w-0 ">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{college.name}</h4>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                            {college.avgRating > 0 ? college.avgRating.toFixed(1) : '0'} <StarIconSolid className="w-3 h-3" />
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 font-bold">
                        <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" /> {college.location}</span>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------------------
    // Variant: CARD (Used in Listing)
    // -------------------------------------------
    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-6 relative">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    {college.logo ? (
                        <img src={college.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                        <BuildingLibraryIcon className="w-8 h-8 text-emerald-600 dark:text-slate-500" />
                    )}
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl border border-amber-100 dark:border-amber-800/30">
                    <StarIcon Solid className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        {college.avgRating > 0 ? college.avgRating.toFixed(1) : '4.5'}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                {college.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium">
                <MapPinIcon className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                <span className="truncate">{college.location || 'Location Not Added'}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {(college.courses || []).slice(0, 3).map((course, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-100 dark:border-slate-700 group-hover:border-emerald-200 transition-colors">
                        {course}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between relative">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">Member Since</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Est. {college.established || 'N/A'}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 shadow-sm transition-all duration-300">
                    <ArrowRightIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
                </div>
            </div>
        </div>
    );
}
