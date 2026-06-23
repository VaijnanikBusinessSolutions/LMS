// // import React from 'react';
// // import { Sparkles } from 'lucide-react';

// // interface FooterLogoProps {
// //   isLoading?: boolean;
// //   logoUrl?: string;
// //   companyName: string;
// //   className?: string;
// // }

// // export const FooterLogoNew: React.FC<FooterLogoProps> = ({
// //   isLoading,
// //   logoUrl,
// //   companyName,
// //   className = '',
// // }) => {
// //   return (
// //     <div className={`flex justify-center md:justify-start w-full md:w-auto ${className}`}>
// //       {isLoading ? (
// //         <div className="relative h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
// //           <div 
// //             className="
// //               absolute inset-0 
// //               bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent 
// //               animate-[shimmer_1.5s_infinite]
// //             " 
// //           />
// //           <style>{`
// //             @keyframes shimmer {
// //               0% { transform: translateX(-100%); }
// //               100% { transform: translateX(100%); }
// //             }
// //           `}</style>
// //         </div>
// //       ) : logoUrl ? (
// //         <div className="group relative">
// //           <img
// //             src={logoUrl}
// //             alt={companyName}
// //             className="h-10 w-auto max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
// //           />
// //           <div 
// //             className="
// //               absolute -bottom-1 left-1/2 -translate-x-1/2 
// //               w-0 h-0.5 
// //               bg-gradient-to-r from-teal-500 to-cyan-500
// //               dark:from-teal-400 dark:to-cyan-400
// //               rounded-full 
// //               transition-all duration-200 
// //               group-hover:w-3/4
// //             " 
// //           />
// //         </div>
// //       ) : (
// //         <div className="flex items-center gap-2.5 select-none group cursor-default">
// //           {/* Logo Icon */}
// //           <div className="relative">
// //             <div 
// //               className="
// //                 w-9 h-9 rounded-xl 
// //                 bg-gradient-to-br from-teal-500 to-cyan-600
// //                 dark:from-teal-400 dark:to-cyan-500
// //                 flex items-center justify-center 
// //                 text-white 
// //                 shadow-lg shadow-teal-500/25 
// //                 dark:shadow-teal-400/20
// //                 transition-all duration-200 
// //                 group-hover:shadow-teal-500/40
// //                 dark:group-hover:shadow-teal-400/30
// //               "
// //             >
// //               <span className="text-sm font-bold tracking-tight">NL</span>
// //             </div>
// //             <div 
// //               className="
// //                 absolute -bottom-0.5 -right-0.5 
// //                 w-2.5 h-2.5 
// //                 bg-emerald-400 dark:bg-emerald-500
// //                 rounded-full 
// //                 border-[1.5px] border-white dark:border-slate-900
// //                 flex items-center justify-center
// //               "
// //             >
// //               <Sparkles size={5} className="text-white" />
// //             </div>
// //           </div>
          
// //           {/* Company Name */}
// //           <div className="flex flex-col">
// //             <span 
// //               className="
// //                 text-[15px] font-semibold leading-tight tracking-[-0.01em]
// //                 text-slate-800 dark:text-slate-100
// //                 group-hover:text-teal-600 dark:group-hover:text-teal-400
// //                 transition-colors duration-200
// //               "
// //             >
// //               {companyName}
// //             </span>
// //             <span 
// //               className="
// //                 text-[10px] font-medium tracking-wide uppercase
// //                 text-slate-400 dark:text-slate-500
// //               "
// //             >
// //               LMS Platform
// //             </span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };



// import React from 'react';
// import { Sparkles } from 'lucide-react';

// interface FooterLogoProps {
//   isLoading?: boolean;
//   logoUrl?: string;
//   darkLogoUrl?: string; // ADDED
//   companyName: string;
//   className?: string;
// }

// export const FooterLogoNew: React.FC<FooterLogoProps> = ({
//   isLoading,
//   logoUrl,
//   darkLogoUrl, // DESTRUCTURED
//   companyName,
//   className = '',
// }) => {
//   return (
//     <div className={`flex justify-center md:justify-start w-full md:w-auto ${className}`}>
//       {isLoading ? (
//         <div className="relative h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent animate-[shimmer_1.5s_infinite]" />
//           <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
//         </div>
//       ) : logoUrl ? (
//         <div className="group relative">
//           {/* Toggle between light/dark logo images */}
//           <img
//             src={logoUrl}
//             alt={companyName}
//             className={`h-14 w-auto max-w-[2200px] object-contain transition-transform duration-200 group-hover:scale-[1.02] ${darkLogoUrl ? 'dark:hidden' : ''}`}
//           />
//           {darkLogoUrl && (
//             <img
//               src={darkLogoUrl}
//               alt={companyName}
//               className="hidden dark:block h-14 w-auto max-w-[220px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
//             />
//           )}
          
//           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:to-cyan-400 rounded-full transition-all duration-300 group-hover:w-3/4" />
//         </div>
//       ) : (
//         /* Fallback Teal Icon */
//         <div className="flex items-center gap-2.5 select-none group cursor-default">
//           <div className="relative">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-400 dark:to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 dark:shadow-teal-400/20 transition-all duration-200 group-hover:shadow-teal-500/40">
//               <span className="text-sm font-bold tracking-tight">NL</span>
//             </div>
//             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 dark:bg-emerald-500 rounded-full border-[1.5px] border-white dark:border-slate-900 flex items-center justify-center">
//               <Sparkles size={5} className="text-white" />
//             </div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200">
//               {companyName}
//             </span>
//             <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
//               LMS Platform
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterLogoProps {
  isLoading?: boolean;
  logoUrl?: string;
  darkLogoUrl?: string;
  companyName: string;
  className?: string;
}

export const FooterLogoNew: React.FC<FooterLogoProps> = ({
  isLoading,
  logoUrl,
  darkLogoUrl,
  companyName,
  className = '',
}) => {
  return (
    <div className={`flex justify-center md:justify-start w-full md:w-auto ${className}`}>
      {isLoading ? (
        <div className="relative h-14 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      ) : logoUrl ? (
        <div className="group relative">
          {/* LIGHT THEME LOGO: Hidden when 'dark' mode is active */}
          <img
            src={logoUrl}
            alt={companyName}
            className={`h-14 w-auto max-w-[220px] object-contain transition-all duration-300 group-hover:scale-105 ${darkLogoUrl ? 'block dark:hidden' : 'block'}`}
          />
          
          {/* DARK THEME LOGO: Shown ONLY when 'dark' mode is active */}
          {darkLogoUrl && (
            <img
              src={darkLogoUrl}
              alt={companyName}
              className="hidden dark:block h-14 w-auto max-w-[220px] object-contain transition-all duration-300 group-hover:scale-105"
            />
          )}
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-full" />
        </div>
      ) : (
        /* Fallback if no images exist */
        <div className="flex items-center gap-3 select-none">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white">
              <span className="text-lg font-bold">NL</span>
           </div>
        </div>
      )}
    </div>
  );
};