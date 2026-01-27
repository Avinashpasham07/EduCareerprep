import React from 'react';
import Card from './Card';
import Button from './Button';

/**
 * ResourceCard - A standardized card for list items (Jobs, Colleges, etc.)
 * 
 * @param {string} title - Main title (Job Title, College Name)
 * @param {string} subtitle - Secondary text (Company, Location)
 * @param {string} meta - Tertiary text (Salary, Rating)
 * @param {ReactNode} badge - Status badge or rating badge
 * @param {string} date - Date label
 * @param {ReactNode} tags - Filter tags array
 * @param {function} onAction - Main action handler
 * @param {string} actionLabel - Label for main action ("View Details")
 */
export default function ResourceCard({
    title,
    subtitle,
    meta,
    badge,
    date,
    tags = [],
    onAction,
    actionLabel = 'View Details'
}) {
    return (
        <Card hover className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{subtitle}</p>
                </div>
                {badge && (
                    <div className="shrink-0 ml-4">
                        {badge}
                    </div>
                )}
            </div>

            {(meta || tags.length > 0) && (
                <div className="mb-6 grow space-y-3">
                    {meta && (
                        <div className="font-medium text-primary-600 dark:text-primary-400 text-sm">
                            {meta}
                        </div>
                    )}

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <span className="text-xs text-slate-400 font-medium">
                    {date}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAction}
                    className="!px-0 hover:bg-transparent hover:text-primary-600 dark:hover:text-primary-400"
                >
                    {actionLabel} →
                </Button>
            </div>
        </Card>
    );
}
