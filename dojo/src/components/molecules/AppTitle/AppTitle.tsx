

// import React from 'react';
// import { COMPANY_INFO } from '../../constants/navigation';

// interface AppTitleProps {
//   onClick?: () => void;
//   className?: string;
// }

// export const AppTitle: React.FC<AppTitleProps> = ({ onClick, className = '' }) => {
//   return (
//     <div 
//       className={`
//         absolute 
//         left-1/2 
//         transform 
//         -translate-x-1/2 
//         cursor-pointer 
//         group
//         ${className}
//       `}
//       onClick={onClick}
//     >
//       {/* Container with Border */}
//       <div 
//         className="
//           relative
//           px-6
//           py-2
//           border
//           border-[#C9A227]/30
//           rounded-sm
//           bg-gradient-to-r
//           from-[#F9F7F2]/50
//           via-transparent
//           to-[#F9F7F2]/50
//           group-hover:border-[#C9A227]/60
//           group-hover:shadow-[0_0_20px_rgba(201,162,39,0.15)]
//           transition-all
//           duration-300
//         "
//       >
//         {/* Top Gold Line */}
//         <span 
//           className="
//             absolute 
//             -top-px 
//             left-1/2 
//             -translate-x-1/2 
//             w-12 
//             h-0.5 
//             bg-[#C9A227]
//           " 
//         />
        
//         {/* App Title */}
//         <h1 
//           className="
//             text-lg
//             md:text-3xl
//             font-bold 
//             tracking-[0.2em]
//             uppercase
//             text-[#0d1c30]
//             group-hover:text-[#1E3A46]
//             transition-colors
//             duration-300
//           "
//         >
//           {COMPANY_INFO.APP_NAME}
//         </h1>
        
//         {/* Bottom Gold Line */}
//         <span 
//           className="
//             absolute 
//             -bottom-px 
//             left-1/2 
//             -translate-x-1/2 
//             w-12 
//             h-0.5 
//             bg-[#C9A227]
//           " 
//         />
//       </div>
//     </div>
//   );
// };



import React from 'react';
import { COMPANY_INFO } from '../../constants/navigation';

interface AppTitleProps {
  onClick?: () => void;
  className?: string;
}

export const AppTitle: React.FC<AppTitleProps> = ({ onClick, className = '' }) => {
  return (
    <div
      className={`
        absolute left-1/2 -translate-x-1/2
        cursor-pointer group
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div
        className="
          relative
          px-6 py-2
          border border-border
          rounded-sm
          bg-background/40
          group-hover:border-accent/60
          group-hover:shadow-[0_0_20px_rgba(0,0,0,0.08)]
          transition-all duration-300
        "
      >
        {/* Top accent line */}
        <span
          className="
            absolute -top-px left-1/2 -translate-x-1/2
            w-12 h-0.5 bg-accent
          "
        />

        <h1
          className="
            text-lg md:text-3xl
            font-bold tracking-[0.2em] uppercase
            text-text
            group-hover:text-primary
            transition-colors duration-300
          "
        >
          {COMPANY_INFO.APP_NAME}
        </h1>

        {/* Bottom accent line */}
        <span
          className="
            absolute -bottom-px left-1/2 -translate-x-1/2
            w-12 h-0.5 bg-accent
          "
        />
      </div>
    </div>
  );
};