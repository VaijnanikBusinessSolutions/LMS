


// import React from 'react';

// interface FooterTaglineProps {
//   tagline: string;
//   className?: string;
// }

// export const FooterTagline: React.FC<FooterTaglineProps> = ({ tagline, className = '' }) => {
//   return (
//     <div className={`text-center w-full md:w-auto ${className}`}>
//       <div className="flex items-center justify-center gap-3">
//         <span className="hidden sm:flex items-center gap-1">
//           <span className="w-8 h-px bg-gradient-to-r from-transparent to-accent" />
//           <span className="text-accent text-xs">✦</span>
//         </span>

//         <p className="text-text text-sm font-semibold tracking-wide italic">{tagline}</p>

//         <span className="hidden sm:flex items-center gap-1">
//           <span className="text-accent text-xs">✦</span>
//           <span className="w-8 h-px bg-gradient-to-l from-transparent to-accent" />
//         </span>
//       </div>
//     </div>
//   );
// };


import React from 'react';

interface FooterTaglineProps {
  tagline: string;
  className?: string;
}

export const FooterTagline: React.FC<FooterTaglineProps> = ({ tagline, className = '' }) => {
  return (
    /* Removed w-full md:w-auto since the parent footer centers this now */
    <div className={`flex items-center justify-center ${className}`}>
      
      {/* Reduced main gap from gap-3 to gap-2 for neater look */}
      <div className="flex items-center justify-center gap-2">

        {/* --- Left Decoration --- */}
        {/* Added opacity-70 so the decoration is subtler than the text */}
        <span className="hidden sm:flex items-center gap-1 opacity-70">
           {/* Reduced line width from w-8 to w-4. Changed color to subtle indigo. */}
          <span className="w-4 h-px bg-gradient-to-r from-transparent to-indigo-300" />
           {/* Made star smaller (text-[10px]) and changed color to soft indigo */}
          <span className="text-indigo-400 text-[10px]">✦</span>
        </span>

        {/* --- Tagline Text --- */}
        {/* Updated typography to be smaller and slate-colored to match the new footer */}
        <p className="text-slate-500 text-xs font-medium tracking-wide italic whitespace-nowrap">
          {tagline}
        </p>

        {/* --- Right Decoration --- */}
        <span className="hidden sm:flex items-center gap-1 opacity-70">
          <span className="text-indigo-400 text-[10px]">✦</span>
          <span className="w-4 h-px bg-gradient-to-l from-transparent to-indigo-300" />
        </span>

      </div>
    </div>
  );
};