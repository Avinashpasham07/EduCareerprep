import React from 'react';

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const glassStyles = glass
        ? 'backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-white/10 shadow-xl'
        : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm';

    const hoverStyles = hover
        ? 'hover:transform hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/30 dark:hover:border-primary-400/30 cursor-pointer group relative overflow-hidden'
        : '';

    return (
        <div className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`} {...props}>
            {hover && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
