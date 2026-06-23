



// import React from 'react';
// import { FooterLogo } from '../../molecules/footer/FooterLogo';
// import { FooterTagline } from '../../molecules/footer/FooterTagline';
// import { FooterCopyright } from '../../molecules/footer/FooterCopyright';

// interface FooterProps {
//   isLoading?: boolean;
//   logoUrl?: string;
//   companyName: string;
//   companyUrl: string;
//   tagline: string;
//   className?: string;
// }

// export const Footer: React.FC<FooterProps> = ({
//   isLoading,
//   logoUrl,
//   companyName,
//   companyUrl,
//   tagline,
//   className = '',
// }) => {
//   return (
//     <footer
//       className={`
//         bg-surface text-text text-sm
//         shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
//         ${className}
//       `}
//     >
//       {/* Decorative accent line */}
    

//       <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-5">
//         <FooterLogo isLoading={isLoading} logoUrl={logoUrl} companyName={companyName} />
//         <FooterTagline tagline={tagline} />
//         <FooterCopyright companyName={companyName} companyUrl={companyUrl} />
//       </div>
//     </footer>
//   );
// };



import React from 'react';
import { FooterLogo } from '../../molecules/footer/FooterLogo';
import { FooterTagline } from '../../molecules/footer/FooterTagline';
import { FooterCopyright } from '../../molecules/footer/FooterCopyright';

interface FooterProps {
  isLoading?: boolean;
  logoUrl?: string;
  darkLogoUrl?: string; // Support for theme switching
  companyName: string;
  companyUrl: string;
  tagline: string;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  isLoading,
  logoUrl,
  darkLogoUrl,
  companyName,
  companyUrl,
  tagline,
  className = '',
}) => {
  return (
    <footer
      className={`
        relative w-full
        bg-white dark:bg-slate-900 
        text-slate-600 dark:text-slate-400 text-sm
        border-t border-slate-200 dark:border-slate-800
        transition-colors duration-500
        ${className}
      `}
    >
      {/* Subtle Teal Accent Line at the top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-5 gap-6 md:gap-0">
        <FooterLogo 
          isLoading={isLoading} 
          logoUrl={logoUrl} 
          darkLogoUrl={darkLogoUrl} 
          companyName={companyName} 
        />
        
        <FooterTagline tagline={tagline} />
        
        <FooterCopyright 
          companyName={companyName} 
          companyUrl={companyUrl} 
        />
      </div>
    </footer>
  );
};