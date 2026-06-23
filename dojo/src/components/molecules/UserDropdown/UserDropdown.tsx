// import React, { useEffect, useRef } from 'react';
// import { 
//   LogOut, 
//   Shield, 
//   FileText, 
//   Settings, 
//   ChevronRight,
//   User as UserIcon 
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface UserDropdownProps {
//   isOpen: boolean;
//   onToggle: () => void;
//   onClose: () => void;
//   userName: string;
//   userEmail: string;
//   userInitials: string;
//   onLogout: () => void;
//   onPrivacyPolicy: () => void;
//   onTermsOfService: () => void;
//   onVersion: () => void;
// }

// export const UserDropdown: React.FC<UserDropdownProps> = ({ 
//   isOpen, 
//   onClose, 
//   onToggle,
//   userName, 
//   userEmail, 
//   userInitials, 
//   onLogout, 
//   onPrivacyPolicy, 
//   onTermsOfService, 
//   onVersion 
// }) => {
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         onClose();
//       }
//     };
//     if (isOpen) document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, onClose]);

//   return (
//     <div className="relative flex items-center" ref={dropdownRef}>
//       {/* TRIGGER: THE VISIBLE AVATAR ICON */}
//       <button
//         onClick={onToggle}
//         className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-sm hover:ring-4 hover:ring-indigo-100 transition-all duration-300 overflow-hidden"
//       >
//         {userInitials ? userInitials : <UserIcon size={18} />}
//       </button>

//       {/* DROPDOWN MENU */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.95, y: 10 }}
//             className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[100]"
//           >
//             {/* USER HEADER */}
//             <div className="p-4 bg-slate-50/50 border-b border-slate-100">
//               <p className="text-sm font-bold text-slate-900 truncate">Hi, {userName}!</p>
//               <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
//             </div>

//             {/* ACTION LINKS */}
//             <div className="p-2">
//               <DropdownItem 
//                 icon={Shield} 
//                 label="Privacy Policy" 
//                 onClick={() => { onPrivacyPolicy(); onClose(); }} 
//               />
//               <DropdownItem 
//                 icon={FileText} 
//                 label="Terms of Service" 
//                 onClick={() => { onTermsOfService(); onClose(); }} 
//               />
//               <DropdownItem 
//                 icon={Settings} 
//                 label="System Version" 
//                 onClick={() => { onVersion(); onClose(); }} 
//               />
              
//               <div className="my-1.5 h-px bg-slate-100 mx-2" />
              
//               {/* LOGOUT BUTTON */}
//               <button
//                 onClick={onLogout}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
//               >
//                 <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
//                   <LogOut size={16} />
//                 </div>
//                 <span>Sign Out</span>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Helper for Menu Items
// const DropdownItem = ({ icon: Icon, label, onClick }: any) => (
//   <button
//     onClick={onClick}
//     className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group"
//   >
//     <div className="flex items-center gap-3">
//       <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
//         <Icon size={16} />
//       </div>
//       {label}
//     </div>
//     <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
//   </button>
// );



import React, { useEffect, useRef, useState } from 'react';
import { 
  LogOut, 
  Shield, 
  FileText, 
  Settings, 
  ChevronRight,
  User as UserIcon,
  Sparkles,
  Crown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../theme/ThemeContext';

interface UserDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userInitials: string;
  onLogout: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfService: () => void;
  onVersion: () => void;
}

// ============================================
// TEAL COLOR PALETTE
// ============================================
const TEAL = {
  primary: '#14b8a6',
  dark: '#0d9488',
  darker: '#0f766e',
  light: '#2dd4bf',
  lighter: '#5eead4',
  pale: '#99f6e4',
  palest: '#f0fdfa',
  rgb: '20, 184, 166',
  rgbDark: '13, 148, 136',
  rgbLight: '45, 212, 191',
};

// ============================================
// DROPDOWN ITEM COMPONENT
// ============================================
const DropdownItem: React.FC<{
  icon: any;
  label: string;
  onClick: () => void;
  theme: string;
  delay?: number;
}> = ({ icon: Icon, label, onClick, theme, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group"
      style={{
        backgroundColor: isHovered 
          ? isDark ? `rgba(${TEAL.rgb}, 0.15)` : `rgba(${TEAL.rgb}, 0.08)`
          : 'transparent',
        boxShadow: isHovered 
          ? `0 0 20px rgba(${TEAL.rgb}, 0.1), inset 0 0 20px rgba(${TEAL.rgb}, 0.03)`
          : 'none',
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.05 + 0.1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        {/* Icon Container */}
        <motion.div 
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isHovered 
              ? isDark ? `rgba(${TEAL.rgb}, 0.25)` : `rgba(${TEAL.rgb}, 0.15)`
              : isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(241, 245, 249, 1)',
            color: isHovered 
              ? TEAL.primary 
              : isDark ? '#94a3b8' : '#64748b',
            boxShadow: isHovered 
              ? `0 0 15px rgba(${TEAL.rgb}, 0.4), 0 0 30px rgba(${TEAL.rgb}, 0.2)`
              : 'none',
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            style={{
              filter: isHovered 
                ? `drop-shadow(0 0 6px ${TEAL.primary})`
                : 'none',
            }}
          >
            <Icon size={16} strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Label */}
        <span 
          className="text-sm font-semibold transition-colors duration-300"
          style={{
            color: isHovered 
              ? TEAL.primary 
              : isDark ? '#e2e8f0' : '#475569',
          }}
        >
          {label}
        </span>
      </div>

      {/* Chevron */}
      <motion.div
        animate={{
          x: isHovered ? 0 : -8,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{ color: TEAL.primary }}
      >
        <ChevronRight size={14} strokeWidth={2.5} />
      </motion.div>
    </motion.button>
  );
};

// ============================================
// LOGOUT BUTTON COMPONENT
// ============================================
const LogoutButton: React.FC<{
  onClick: () => void;
  theme: string;
}> = ({ onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300"
      style={{
        backgroundColor: isHovered 
          ? isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)'
          : 'transparent',
        boxShadow: isHovered 
          ? '0 0 20px rgba(239, 68, 68, 0.15), inset 0 0 20px rgba(239, 68, 68, 0.03)'
          : 'none',
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon Container */}
      <motion.div 
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: isHovered 
            ? isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.15)'
            : isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(254, 242, 242, 1)',
          color: isHovered ? '#ef4444' : isDark ? '#f87171' : '#ef4444',
          boxShadow: isHovered 
            ? '0 0 15px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)'
            : 'none',
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotate: isHovered ? [0, -10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          style={{
            filter: isHovered 
              ? 'drop-shadow(0 0 6px #ef4444)'
              : 'none',
          }}
        >
          <LogOut size={16} strokeWidth={2} />
        </motion.div>
      </motion.div>

      {/* Label */}
      <span 
        className="text-sm font-bold transition-colors duration-300"
        style={{
          color: isHovered ? '#ef4444' : isDark ? '#f87171' : '#ef4444',
        }}
      >
        Sign Out
      </span>
    </motion.button>
  );
};

// ============================================
// AVATAR BUTTON COMPONENT
// ============================================
const AvatarButton: React.FC<{
  initials: string;
  isOpen: boolean;
  onClick: () => void;
  theme: string;
}> = ({ initials, isOpen, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center w-10 h-10 rounded-2xl text-white font-bold text-xs overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${TEAL.dark} 0%, ${TEAL.primary} 50%, ${TEAL.light} 100%)`,
        boxShadow: isHovered || isOpen
          ? `0 0 25px rgba(${TEAL.rgb}, 0.6), 0 0 50px rgba(${TEAL.rgb}, 0.3), 0 4px 15px rgba(${TEAL.rgb}, 0.4)`
          : `0 0 15px rgba(${TEAL.rgb}, 0.4), 0 0 30px rgba(${TEAL.rgb}, 0.15), 0 4px 10px rgba(${TEAL.rgb}, 0.3)`,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: isOpen ? [0, -5, 5, 0] : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Shine */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
        }}
        animate={{
          x: isHovered ? ['-100%', '200%'] : '-100%',
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />

      {/* Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0.5,
          scale: isHovered ? 1.2 : 1,
        }}
      />

      {/* Initials or Icon */}
      <motion.span 
        className="relative z-10 text-sm font-bold"
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none',
        }}
      >
        {initials ? initials : <UserIcon size={18} />}
      </motion.span>

      {/* Active Ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2"
        style={{
          borderColor: `rgba(${TEAL.rgbLight}, 0.5)`,
        }}
        animate={{
          scale: isOpen ? [1, 1.15, 1] : 1,
          opacity: isOpen ? [0.5, 0, 0.5] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isOpen ? Infinity : 0,
        }}
      />

      {/* Online Status Dot */}
      <motion.div
        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
        style={{
          background: `linear-gradient(135deg, #10b981, #34d399)`,
          borderColor: isDark ? '#0f172a' : '#ffffff',
          boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
};

// ============================================
// MAIN USER DROPDOWN COMPONENT
// ============================================
export const UserDropdown: React.FC<UserDropdownProps> = ({ 
  isOpen, 
  onClose, 
  onToggle,
  userName, 
  userEmail, 
  userInitials, 
  onLogout, 
  onPrivacyPolicy, 
  onTermsOfService, 
  onVersion 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* AVATAR TRIGGER */}
      <AvatarButton
        initials={userInitials}
        isOpen={isOpen}
        onClick={onToggle}
        theme={theme}
      />

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur (Mobile) */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-3 w-72 rounded-3xl overflow-hidden z-50"
              style={{
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${isDark ? `rgba(${TEAL.rgb}, 0.2)` : `rgba(${TEAL.rgb}, 0.15)`}`,
                boxShadow: isDark
                  ? `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(${TEAL.rgb}, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)`
                  : `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 40px rgba(${TEAL.rgb}, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
              }}
            >
              {/* Decorative Top Gradient Line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, ${TEAL.dark}, ${TEAL.primary}, ${TEAL.light})`,
                  boxShadow: `0 0 20px rgba(${TEAL.rgb}, 0.5)`,
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* USER HEADER */}
              <motion.div 
                className="relative px-5 pt-6 pb-4 overflow-hidden"
                style={{
                  backgroundColor: isDark 
                    ? `rgba(${TEAL.rgb}, 0.08)` 
                    : `rgba(${TEAL.rgb}, 0.04)`,
                  borderBottom: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                {/* Background Glow */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30"
                  style={{
                    background: `radial-gradient(circle, rgba(${TEAL.rgb}, 0.4) 0%, transparent 70%)`,
                    transform: 'translate(30%, -30%)',
                  }}
                />

                <div className="flex items-center gap-4 relative">
                  {/* Large Avatar */}
                  <motion.div 
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${TEAL.dark} 0%, ${TEAL.primary} 50%, ${TEAL.light} 100%)`,
                      boxShadow: `0 0 20px rgba(${TEAL.rgb}, 0.5), 0 8px 20px -4px rgba(${TEAL.rgb}, 0.4)`,
                    }}
                    whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                      }}
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                    
                    <span className="relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      {userInitials || <UserIcon size={24} />}
                    </span>

                    {/* Verified Badge */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${TEAL.primary}, ${TEAL.light})`,
                        boxShadow: `0 0 10px rgba(${TEAL.rgb}, 0.6)`,
                        border: `2px solid ${isDark ? '#0f172a' : '#ffffff'}`,
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </motion.div>
                  </motion.div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 
                        className="text-base font-bold truncate"
                        style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
                      >
                        {userName}
                      </h3>
                      <motion.div
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        style={{
                          backgroundColor: `rgba(${TEAL.rgb}, 0.15)`,
                          color: TEAL.primary,
                          boxShadow: `0 0 10px rgba(${TEAL.rgb}, 0.2)`,
                        }}
                        animate={{
                          boxShadow: [
                            `0 0 10px rgba(${TEAL.rgb}, 0.2)`,
                            `0 0 15px rgba(${TEAL.rgb}, 0.4)`,
                            `0 0 10px rgba(${TEAL.rgb}, 0.2)`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Crown size={10} />
                        Pro
                      </motion.div>
                    </div>
                    <p 
                      className="text-xs truncate mt-0.5"
                      style={{ color: isDark ? '#64748b' : '#94a3b8' }}
                    >
                      {userEmail}
                    </p>
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: '#10b981',
                          boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span 
                        className="text-[11px] font-medium"
                        style={{ color: '#10b981' }}
                      >
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ACTION LINKS */}
              <div className="p-2">
                <DropdownItem 
                  icon={Shield} 
                  label="Privacy Policy" 
                  onClick={() => { onPrivacyPolicy(); onClose(); }} 
                  theme={theme}
                  delay={0}
                />
                <DropdownItem 
                  icon={FileText} 
                  label="Terms of Service" 
                  onClick={() => { onTermsOfService(); onClose(); }} 
                  theme={theme}
                  delay={1}
                />
                <DropdownItem 
                  icon={Settings} 
                  label="System Version" 
                  onClick={() => { onVersion(); onClose(); }} 
                  theme={theme}
                  delay={2}
                />
                
                {/* Divider */}
                <motion.div 
                  className="my-2 mx-3 h-px rounded-full"
                  style={{
                    background: isDark
                      ? `linear-gradient(90deg, transparent, rgba(${TEAL.rgb}, 0.3), transparent)`
                      : `linear-gradient(90deg, transparent, rgba(${TEAL.rgb}, 0.2), transparent)`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                />
                
                {/* LOGOUT BUTTON */}
                <LogoutButton onClick={onLogout} theme={theme} />
              </div>

              {/* Footer Branding */}
              <motion.div 
                className="px-4 py-3 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                  borderTop: `1px solid ${isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles 
                  size={12} 
                  style={{ 
                    color: TEAL.primary,
                    filter: `drop-shadow(0 0 4px ${TEAL.primary})`,
                  }} 
                />
                <span 
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: isDark ? '#64748b' : '#94a3b8' }}
                >
                  V Train LMS
                </span>
                <motion.div
                  className="w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: TEAL.primary,
                    boxShadow: `0 0 6px rgba(${TEAL.rgb}, 0.8)`,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;