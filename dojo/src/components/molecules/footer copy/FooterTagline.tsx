import React from 'react';

interface FooterTaglineProps {
  tagline: string;
  className?: string;
}

export const FooterTaglineNew: React.FC<FooterTaglineProps> = ({ tagline, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center justify-center gap-3">

        {/* --- Left Decoration --- */}
        <span className="hidden sm:flex items-center gap-1.5 opacity-60">
          {/* Subtle teal gradient line */}
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-teal-500/50" />
          {/* Small glowing star */}
          <span className="text-teal-400 text-[10px] drop-shadow-[0_0_3px_rgba(45,212,191,0.5)]">✦</span>
        </span>

        {/* --- Tagline Text --- */}
        <p className="text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs font-medium tracking-widest uppercase italic whitespace-nowrap">
          {tagline}
        </p>

        {/* --- Right Decoration --- */}
        <span className="hidden sm:flex items-center gap-1.5 opacity-60">
          <span className="text-teal-400 text-[10px] drop-shadow-[0_0_3px_rgba(45,212,191,0.5)]">✦</span>
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-teal-500/50" />
        </span>

      </div>
    </div>
  );
};