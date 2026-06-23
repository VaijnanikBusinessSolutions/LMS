// import React from 'react';
// import { Sparkles } from 'lucide-react';

// interface FooterLogoProps {
//   isLoading?: boolean;
//   logoUrl?: string;
//   companyName: string;
//   className?: string;
// }

// export const FooterLogo: React.FC<FooterLogoProps> = ({
//   isLoading,
//   logoUrl,
//   companyName,
//   className = '',
// }) => {
//   return (
//     <div className={`flex justify-center md:justify-start w-full md:w-auto ${className}`}>
//       {isLoading ? (
//         <div className="relative h-10 w-40 bg-slate-100 rounded-xl overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent animate-[shimmer_1.5s_infinite]" />
//           <style>{`
//             @keyframes shimmer {
//               0% { transform: translateX(-100%); }
//               100% { transform: translateX(100%); }
//             }
//           `}</style>
//         </div>
//       ) : logoUrl ? (
//         <div className="group relative">
//           <img
//             src={logoUrl}
//             alt={companyName}
//             className="h-10 w-auto max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
//           />
//           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-200 group-hover:w-3/4" />
//         </div>
//       ) : (
//         <div className="flex items-center gap-2.5 select-none group cursor-default">
//           {/* Logo Icon */}
//           <div className="relative">
//             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 group-hover:shadow-indigo-500/40">
//               <span className="text-sm font-bold tracking-tight">NL</span>
//             </div>
//             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-[1.5px] border-white flex items-center justify-center">
//               <Sparkles size={5} className="text-white" />
//             </div>
//           </div>

//           {/* Company Name */}
//           <div className="flex flex-col">
//             <span className="text-[15px] font-semibold text-slate-800 leading-tight tracking-[-0.01em] group-hover:text-indigo-600 transition-colors duration-200">
//               {companyName}
//             </span>
//             <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
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
  darkLogoUrl?: string; // ADDED
  companyName: string;
  className?: string;
}

export const FooterLogo: React.FC<FooterLogoProps> = ({
  isLoading,
  logoUrl,
  darkLogoUrl, // DESTRUCTURED
  companyName,
  className = '',
}) => {
  return (
    <div className={`flex justify-center md:justify-start w-full md:w-auto ${className}`}>
      {isLoading ? (
        <div className="relative h-10 w-40 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      ) : logoUrl ? (
        <div className="group relative">
          {/* 1. LIGHT THEME LOGO: Shown by default, hidden when 'dark' class is present */}
          <img
            src={logoUrl}
            alt={companyName}
            className={`h-14 w-auto max-w-[220px] object-contain transition-all duration-300 group-hover:scale-105 
      ${darkLogoUrl ? 'block dark:hidden' : 'block'}`}
          />

          {/* 2. DARK THEME LOGO: Hidden by default, shown only when 'dark' class is present */}
          {darkLogoUrl && (
            <img
              src={darkLogoUrl}
              alt={companyName}
              className="hidden dark:block h-14 w-auto max-w-[220px] object-contain transition-all duration-300 group-hover:scale-105"
            />
          )}

          {/* Accent Underline */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300 group-hover:w-full" />
        </div>
      ) : (
        /* Fallback Classic Icon */
        <div className="flex items-center gap-2.5 select-none group cursor-default">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-teal-500 dark:to-emerald-600 flex items-center justify-center text-white shadow-lg transition-all duration-200">
              <span className="text-sm font-bold tracking-tight">NL</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-[1.5px] border-white dark:border-slate-900 flex items-center justify-center">
              <Sparkles size={5} className="text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-teal-400">
              {companyName}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">LMS Platform</span>
          </div>
        </div>
      )}
    </div>
  );
};