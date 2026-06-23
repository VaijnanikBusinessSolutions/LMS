import React from 'react';

interface FooterCopyrightProps {
  companyName: string;
  companyUrl: string;
  className?: string;
}

export const FooterCopyrightNew: React.FC<FooterCopyrightProps> = ({
  companyName,
  companyUrl,
  className = '',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`text-center md:text-right w-full md:w-auto ${className}`}>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium">
        <span className="text-slate-400 dark:text-slate-500">©</span> {currentYear}{' '}
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative inline-block
            text-slate-600 dark:text-slate-300 
            font-semibold
            transition-colors duration-200
            hover:text-teal-600 dark:hover:text-teal-400
            group
          "
        >
          {companyName}
          <span 
            className="
              absolute bottom-0 left-0 
              w-0 h-px 
              bg-gradient-to-r from-teal-500 to-cyan-500
              dark:from-teal-400 dark:to-cyan-400
              transition-all duration-200 ease-out 
              group-hover:w-full
            " 
          />
        </a>
        <span className="text-slate-400 dark:text-slate-500 mx-1.5">·</span>
        <span className="text-slate-500 dark:text-slate-400">All rights reserved</span>
      </p>
    </div>
  );
};