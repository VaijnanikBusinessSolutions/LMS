


// import React from 'react';

// interface FooterCopyrightProps {
//   companyName: string;
//   companyUrl: string;
//   className?: string;
// }

// export const FooterCopyright: React.FC<FooterCopyrightProps> = ({
//   companyName,
//   companyUrl,
//   className = '',
// }) => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <div className={`text-center md:text-right w-full md:w-auto text-sm ${className}`}>
//       <p className="text-text/80 font-medium">
//         <span className="text-accent font-bold">©</span> {currentYear}{' '}
//         <a
//           href={companyUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="
//             relative inline-block
//             text-text font-semibold
//             transition-colors duration-200
//             hover:text-accent
//             group
//           "
//         >
//           {companyName}
//           <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-300 ease-out group-hover:w-full" />
//         </a>
//         <span className="text-text/60">. All rights reserved.</span>
//       </p>
//     </div>
//   );
// };




import React from 'react';

interface FooterCopyrightProps {
  companyName: string;
  companyUrl: string;
  className?: string;
}

export const FooterCopyright: React.FC<FooterCopyrightProps> = ({
  companyName,
  companyUrl,
  className = '',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`text-center md:text-right w-full md:w-auto ${className}`}>
      <p className="text-[13px] text-slate-400 font-medium">
        <span className="text-slate-300">©</span> {currentYear}{' '}
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative inline-block
            text-slate-500 font-semibold
            transition-colors duration-200
            hover:text-indigo-500
            group
          "
        >
          {companyName}
          <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-200 ease-out group-hover:w-full" />
        </a>
        <span className="text-slate-300 mx-1.5">·</span>
        <span className="text-slate-400">All rights reserved</span>
      </p>
    </div>
  );
};