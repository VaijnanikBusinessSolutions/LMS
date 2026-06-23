



// // import React from 'react';
// // import { FooterLogoNew } from '../../molecules/footer copy/FooterLogo';
// // import { FooterTaglineNew } from '../../molecules/footer copy/FooterTagline';
// // import { FooterCopyrightNew } from '../../molecules/footer copy/FooterCopyright';

// // interface FooterProps {
// //   isLoading?: boolean;
// //   logoUrl?: string;
// //   companyName: string;
// //   companyUrl: string;
// //   tagline: string;
// //   className?: string;
// // }

// // export const FooterNew: React.FC<FooterProps> = ({
// //   isLoading,
// //   logoUrl,
// //   companyName,
// //   companyUrl,
// //   tagline,
// //   className = '',
// // }) => {
// //   return (
// //     <footer
// //       className={`
// //         bg-surface text-text text-sm
// //         shadow-[0_-2px_10px_rgba(0,0,0,0.03)]
// //         ${className}
// //       `}
// //     >
// //       {/* Decorative accent line */}
    

// //       <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-5">
// //         <FooterLogoNew isLoading={isLoading} logoUrl={logoUrl} companyName={companyName} />
// //         <FooterTaglineNew tagline={tagline} />
// //         <FooterCopyrightNew companyName={companyName} companyUrl={companyUrl} />
// //       </div>
// //     </footer>
// //   );
// // };



// import React from 'react';
// import { FooterLogoNew } from '../../molecules/footer copy/FooterLogo';
// import { FooterTaglineNew } from '../../molecules/footer copy/FooterTagline';
// import { FooterCopyrightNew } from '../../molecules/footer copy/FooterCopyright';

// interface FooterProps {
//   isLoading?: boolean;
//   logoUrl?: string;
//   darkLogoUrl?: string; // Support for theme switching
//   companyName: string;
//   companyUrl: string;
//   tagline: string;
//   className?: string;
// }

// export const FooterNew: React.FC<FooterProps> = ({
//   isLoading,
//   logoUrl,
//   darkLogoUrl,
//   companyName,
//   companyUrl,
//   tagline,
//   className = '',
// }) => {
//   return (
//     <footer
//       className={`
//         relative w-full
//         bg-slate-50 dark:bg-[#0f172a] 
//         text-slate-500 dark:text-slate-400 text-sm
//         border-t border-teal-500/10 dark:border-teal-500/5
//         transition-all duration-500
//         ${className}
//       `}
//     >
//       {/* Modern Glow Effect for Dark Mode */}
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-0 dark:opacity-100" />

//       <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 md:px-20 py-8 gap-8 md:gap-4">
//         <div className="flex-1 flex justify-center md:justify-start">
//           <FooterLogoNew 
//             isLoading={isLoading} 
//             logoUrl={logoUrl} 
//             darkLogoUrl={darkLogoUrl} 
//             companyName={companyName} 
//           />
//         </div>

//         <div className="flex-1 flex justify-center">
//           <FooterTaglineNew tagline={tagline} />
//         </div>

//         <div className="flex-1 flex justify-center md:justify-end">
//           <FooterCopyrightNew 
//             companyName={companyName} 
//             companyUrl={companyUrl} 
//           />
//         </div>
//       </div>
//     </footer>
//   );
// };



import React from 'react';
import { FooterLogoNew } from '../../molecules/footer copy/FooterLogo';
import { FooterTaglineNew } from '../../molecules/footer copy/FooterTagline';
import { FooterCopyrightNew } from '../../molecules/footer copy/FooterCopyright';
import { useTheme } from '../../../theme/ThemeContext'; // Import this to force re-render

interface FooterProps {
  isLoading?: boolean;
  logoUrl?: string;
  darkLogoUrl?: string; 
  companyName: string;
  companyUrl: string;
  tagline: string;
  className?: string;
}

export const FooterNew: React.FC<FooterProps> = ({
  isLoading,
  logoUrl,
  darkLogoUrl,
  companyName,
  companyUrl,
  tagline,
  className = '',
}) => {
  const { theme } = useTheme(); // Hooking into theme state

  return (
    <footer
      className={`
        relative w-full
        bg-slate-50 dark:bg-[#0f172a] 
        text-slate-500 dark:text-slate-400 text-sm
        border-t border-teal-500/10 dark:border-teal-500/5
        transition-all duration-500
        ${className}
      `}
    >
      {/* Modern Glow Effect for Dark Mode */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent opacity-0 dark:opacity-100" />

      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center px-8 md:px-20 py-8 gap-8 md:gap-4">
        <div className="flex-1 flex justify-center md:justify-start">
          {/* IMPORTANT: We pass both URLs. 
              FooterLogoNew must handle 'darkLogoUrl' with 'hidden dark:block' 
          */}
          <FooterLogoNew 
            isLoading={isLoading} 
            logoUrl={logoUrl} 
            darkLogoUrl={darkLogoUrl} 
            companyName={companyName} 
          />
        </div>

        <div className="flex-1 flex justify-center">
          <FooterTaglineNew tagline={tagline} />
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <FooterCopyrightNew 
            companyName={companyName} 
            companyUrl={companyUrl} 
          />
        </div>
      </div>
    </footer>
  );
};