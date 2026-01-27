import React from 'react';

const Section = ({ children, className = '', background = 'transparent', ...props }) => {
    const bgStyles = {
        transparent: '',
        light: 'bg-white dark:bg-slate-900',
        gray: 'bg-gray-50 dark:bg-slate-950',
        gradient: 'bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
    };

    return (
        <section className={`py-16 md:py-24 relative overflow-hidden ${bgStyles[background]} ${className}`} {...props}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {children}
            </div>
        </section>
    );
};

export default Section;
