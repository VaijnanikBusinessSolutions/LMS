


// import React, { useState } from 'react';
// import { 
//   Bell, 
//   Moon, 
//   Sun, 
//   ArrowLeft, 
//   Home,
//   Sparkles
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { UserDropdown } from '../../molecules/UserDropdown/UserDropdown';
// import { NotificationDrawer } from './NotificationDrawer';
// import { useTheme } from '../../../theme/ThemeContext';

// interface User {
//   first_name: string;
//   last_name?: string;
//   email: string;
// }

// interface NavbarProps {
//   user: User;
//   unreadCount: number;
//   notifications: any[];
//   refreshNotifications: () => void;
//   onLogout: () => void;
//   onPrivacyPolicy: () => void;
//   onTermsAndConditions: () => void;
//   onVersionControl: () => void;
// }

// export const Navbar: React.FC<NavbarProps> = ({
//   user,
//   unreadCount,
//   notifications,
//   refreshNotifications,
//   onLogout,
//   onPrivacyPolicy,
//   onTermsAndConditions,
//   onVersionControl,
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   if (!user) return null;

//   return (
//     <>
//       <nav 
//         className="fixed top-0 left-0 right-0 z-50 h-16 md:h-[68px] backdrop-blur-2xl border-b px-1 flex justify-between items-center transition-all duration-300"
//         style={{
//             backgroundColor: 'rgba(var(--header-bg), 0.8)',
//             borderColor: 'rgb(var(--header-border))'
//         }}
//       >

//         {/* LEFT SECTION - Company Brand */}
//         <div 
//           className="flex items-center gap-3 cursor-pointer group select-none" 
//           onClick={() => navigate('/home')}
//         >
//           {/* Logo */}
//           <div className="relative px-1">
//             <div 
//                 className="w-10 h-10 p-2 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
//                 style={{
//                     background: 'linear-gradient(135deg, rgb(var(--brand-primary)), rgb(var(--brand-accent)))',
//                     boxShadow: '0 4px 6px -1px rgba(var(--brand-primary), 0.3)'
//                 }}
//             >
//               <span className="text-lg font-bold tracking-tight">NL</span>
//             </div>
//             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-[2px] flex items-center justify-center" style={{ borderColor: 'rgb(var(--header-bg))' }}>
//               <Sparkles size={6} className="text-white" />
//             </div>
//           </div>

//           {/* Company Name */}
//           <div className="hidden sm:flex flex-col">
//             <span 
//                 className="text-[15px] font-semibold leading-tight tracking-[-0.01em] transition-colors duration-200"
//                 style={{ color: 'rgb(var(--header-text))' }}
//             >
//               NL Technologies
//             </span>
//             <span 
//                 className="text-[11px] font-medium tracking-wide uppercase"
//                 style={{ color: 'rgb(var(--header-muted))' }}
//             >
//               V Train LMS Platform
//             </span>
//           </div>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="flex items-center gap-1.5 md:gap-2">

//           {/* Navigation Buttons */}
//           <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
//             <button 
//               onClick={() => navigate(-1)}
//               className="p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
//               style={{ color: 'rgb(var(--header-muted))' }}
//               // Inline hover style logic or CSS class for hover bg needed if not using Tailwind fully for theme vars
//               onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgb(var(--header-surface))';
//                   e.currentTarget.style.color = 'rgb(var(--header-text))';
//               }}
//               onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'transparent';
//                   e.currentTarget.style.color = 'rgb(var(--header-muted))';
//               }}
//               title="Go Back"
//             >
//               <ArrowLeft size={18} strokeWidth={2.5} />
//             </button>
//             <button 
//               onClick={() => navigate('/home')}
//               className="p-2 rounded-lg transition-all duration-200 hover:shadow-sm"
//               style={{ color: 'rgb(var(--header-muted))' }}
//               onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = 'rgb(var(--header-surface))';
//                   e.currentTarget.style.color = 'rgb(var(--header-text))';
//               }}
//               onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'transparent';
//                   e.currentTarget.style.color = 'rgb(var(--header-muted))';
//               }}
//               title="Home"
//             >
//               <Home size={18} strokeWidth={2.5} />
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="hidden md:block h-6 w-px mx-1" style={{ backgroundColor: 'rgb(var(--header-border))' }} />

//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="p-2.5 rounded-xl transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-900/20"
//             style={{ color: 'rgb(var(--header-muted))' }}
//             title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
//           >
//             {theme === 'dark' ? (
//               <Sun size={20} strokeWidth={2} className="text-amber-400 transition-transform duration-300 hover:rotate-90" />
//             ) : (
//               <Moon size={20} strokeWidth={2} className="transition-transform duration-300 hover:-rotate-12" />
//             )}
//           </button>

//           {/* Notification Bell */}
//           <button 
//             onClick={() => setIsNotificationsOpen(true)}
//             className="relative p-2.5 rounded-xl transition-all duration-200"
//             style={{ color: 'rgb(var(--header-muted))' }}
//             onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = 'rgba(var(--brand-primary), 0.1)';
//                 e.currentTarget.style.color = 'rgb(var(--brand-primary))';
//             }}
//             onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'transparent';
//                 e.currentTarget.style.color = 'rgb(var(--header-muted))';
//             }}
//             title="Notifications"
//           >
//             <Bell size={20} strokeWidth={2} />
//             {unreadCount > 0 && (
//               <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2" style={{ ringColor: 'rgb(var(--header-bg))' }}>
//                 {unreadCount > 9 ? '9+' : unreadCount}
//               </span>
//             )}
//           </button>

//           {/* Divider */}
//           <div className="hidden md:block h-6 w-px mx-1" style={{ backgroundColor: 'rgb(var(--header-border))' }} />

//           {/* User Profile */}
//           <UserDropdown
//             isOpen={dropdownOpen}
//             onToggle={() => setDropdownOpen(!dropdownOpen)}
//             onClose={() => setDropdownOpen(false)}
//             userInitial={user.first_name.charAt(0)}
//             userEmail={user.email}
//             userName={user.first_name}
//             userInitials={user.first_name.charAt(0) + (user.last_name?.charAt(0) || '')}
//             onLogout={onLogout}
//             onPrivacyPolicy={onPrivacyPolicy}
//             onTermsOfService={onTermsAndConditions}
//             onVersion={onVersionControl}
//           />
//         </div>
//       </nav>

//       {/* Spacer to prevent content from going behind navbar */}
//       <div className="h-16 md:h-[68px]" />

//       {/* Notification Drawer */}
//       <NotificationDrawer 
//         isOpen={isNotificationsOpen} 
//         onClose={() => setIsNotificationsOpen(false)}
//         notifications={notifications}
//         refreshNotifications={refreshNotifications}
//       />
//     </>
//   );
// };




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Moon,
  Sun,
  ArrowLeft,
  Home,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserDropdown } from '../../molecules/UserDropdown/UserDropdown';
import { NotificationDrawer } from './NotificationDrawer';
import { useTheme } from '../../../theme/ThemeContext';
import { useDesign } from "../../../context/DesignContext";

interface User {
  first_name: string;
  last_name?: string;
  email: string;
}

interface NavbarProps {
  user: User;
  unreadCount: number;
  notifications: any[];
  refreshNotifications: () => void;
  onLogout: () => void;
  onPrivacyPolicy: () => void;
  onTermsAndConditions: () => void;
  onVersionControl: () => void;
}

// ============================================
// TEAL COLOR PALETTE
// ============================================
const TEAL = {
  primary: '#14b8a6',      // Main teal
  dark: '#0d9488',         // Darker teal
  darker: '#0f766e',       // Even darker
  light: '#2dd4bf',        // Lighter teal
  lighter: '#5eead4',      // Even lighter
  pale: '#99f6e4',         // Pale teal
  rgb: '20, 184, 166',     // RGB for rgba()
  rgbDark: '13, 148, 136',
  rgbLight: '45, 212, 191',
};

// ============================================
// GLOWING ICON BUTTON COMPONENT
// ============================================
const GlowButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  color?: string;
  rgb?: string;
  badge?: number;
  isActive?: boolean;
}> = ({
  onClick,
  icon,
  title,
  color = TEAL.primary,
  rgb = TEAL.rgb,
  badge,
  isActive = false
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    

    return (
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative p-2.5 rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: isHovered || isActive
            ? `rgba(${rgb}, 0.15)`
            : 'transparent',
          boxShadow: isHovered || isActive
            ? `0 0 20px rgba(${rgb}, 0.4), 0 0 40px rgba(${rgb}, 0.15), inset 0 0 20px rgba(${rgb}, 0.05)`
            : 'none',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={title}
      >
        {/* Glow Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at center, rgba(${rgb}, 0.25) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon Container */}
        <motion.div
          className="relative z-10"
          style={{
            color: isHovered || isActive ? color : 'currentColor',
            filter: isHovered
              ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 12px rgba(${rgb}, 0.6))`
              : 'none'
          }}
          animate={{
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>

        {/* Notification Badge */}
        {badge !== undefined && badge > 0 && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold text-white px-1"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.6), 0 0 20px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0,0,0,0.2)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {badge > 9 ? '9+' : badge}
            </motion.span>
          </motion.span>
        )}
      </motion.button>
    );
  };

// ============================================
// NAVIGATION BUTTON GROUP
// ============================================
const NavButtonGroup: React.FC<{
  children: React.ReactNode;
  theme: string;
}> = ({ children, theme }) => {
  return (
    <motion.div
      className="flex items-center gap-1 p-1.5 rounded-2xl backdrop-blur-xl border transition-all duration-300"
      style={{
        backgroundColor: theme === 'dark'
          ? 'rgba(30, 41, 59, 0.6)'
          : 'rgba(240, 253, 250, 0.8)', // Teal-tinted background
        borderColor: theme === 'dark'
          ? 'rgba(71, 85, 105, 0.3)'
          : 'rgba(153, 246, 228, 0.5)', // Teal border
        boxShadow: theme === 'dark'
          ? '0 4px 24px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : `0 4px 24px -4px rgba(${TEAL.rgb}, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)`,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// MINI NAV BUTTON
// ============================================
const MiniNavButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  theme: string;
}> = ({ onClick, icon, title, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-2 rounded-xl transition-all duration-200"
      style={{
        backgroundColor: isHovered
          ? theme === 'dark' ? 'rgba(13, 148, 136, 0.3)' : 'rgba(20, 184, 166, 0.15)'
          : 'transparent',
        color: isHovered
          ? TEAL.primary
          : theme === 'dark' ? '#94a3b8' : '#64748b',
        boxShadow: isHovered
          ? `0 0 12px rgba(${TEAL.rgb}, 0.3)`
          : 'none',
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={title}
    >
      <motion.div
        animate={{ x: isHovered && title === 'Go Back' ? -2 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          filter: isHovered ? `drop-shadow(0 0 4px ${TEAL.primary})` : 'none'
        }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
};

// ============================================
// THEME TOGGLE BUTTON
// ============================================
const ThemeToggle: React.FC<{
  theme: string;
  onToggle: () => void;
}> = ({ theme, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative p-2.5 rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: isHovered
          ? isDark ? 'rgba(251, 191, 36, 0.15)' : `rgba(${TEAL.rgb}, 0.12)`
          : 'transparent',
        boxShadow: isHovered
          ? isDark
            ? '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.15)'
            : `0 0 20px rgba(${TEAL.rgb}, 0.3), 0 0 40px rgba(${TEAL.rgb}, 0.1)`
          : 'none',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: isDark
            ? 'radial-gradient(circle at center, rgba(251, 191, 36, 0.35) 0%, transparent 70%)'
            : `radial-gradient(circle at center, rgba(${TEAL.rgb}, 0.25) 0%, transparent 70%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon with Animation */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
            style={{
              filter: isHovered
                ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 16px rgba(251, 191, 36, 0.5))'
                : 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))',
            }}
          >
            <Sun size={20} strokeWidth={2} className="text-amber-400" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
            style={{
              color: TEAL.primary,
              filter: isHovered
                ? `drop-shadow(0 0 8px ${TEAL.primary}) drop-shadow(0 0 16px rgba(${TEAL.rgb}, 0.5))`
                : 'none',
            }}
          >
            <Moon size={20} strokeWidth={2} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orbiting Stars (Dark Mode) */}
      {isDark && isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-300"
              style={{
                boxShadow: '0 0 4px rgba(251, 191, 36, 0.8)',
                top: '50%',
                left: '50%',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
};

// ============================================
// LOGO COMPONENT - TEAL THEMED
// ============================================
const Logo: React.FC<{
  onClick: () => void;
  theme: string;
}> = ({ onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-3.5 cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Logo Icon */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${TEAL.dark} 0%, ${TEAL.primary} 50%, ${TEAL.light} 100%)`,
            boxShadow: isHovered
              ? `0 0 25px rgba(${TEAL.rgb}, 0.7), 0 0 50px rgba(${TEAL.rgb}, 0.35), 0 8px 24px -4px rgba(${TEAL.rgb}, 0.5)`
              : `0 0 15px rgba(${TEAL.rgb}, 0.5), 0 0 30px rgba(${TEAL.rgb}, 0.2), 0 8px 24px -4px rgba(${TEAL.rgb}, 0.4)`,
          }}
        >
          {/* Animated Shine Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
            }}
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%',
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
          />

          {/* Inner Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, transparent 70%)',
            }}
            animate={{
              opacity: isHovered ? 1 : 0.5,
              scale: isHovered ? 1.2 : 1,
            }}
          />

          {/* Logo Text */}
          <motion.span
            className="text-lg font-bold tracking-tight relative z-10"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              textShadow: isHovered ? `0 0 10px rgba(255,255,255,0.5)` : 'none',
            }}
          >
            NL
          </motion.span>
        </motion.div>

        {/* Status Indicator - Teal Themed */}
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2"
          style={{
            background: `linear-gradient(135deg, ${TEAL.light}, ${TEAL.lighter})`,
            borderColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            boxShadow: `0 0 8px rgba(${TEAL.rgbLight}, 0.7), 0 0 16px rgba(${TEAL.rgbLight}, 0.4)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              `0 0 8px rgba(${TEAL.rgbLight}, 0.7), 0 0 16px rgba(${TEAL.rgbLight}, 0.4)`,
              `0 0 12px rgba(${TEAL.rgbLight}, 0.9), 0 0 24px rgba(${TEAL.rgbLight}, 0.5)`,
              `0 0 8px rgba(${TEAL.rgbLight}, 0.7), 0 0 16px rgba(${TEAL.rgbLight}, 0.4)`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles size={7} className="text-white" />
        </motion.div>
      </motion.div>

      {/* Company Name */}
      <div className="hidden sm:flex flex-col">
        <motion.span
          className="text-[15px] font-bold leading-tight tracking-tight"
          style={{
            color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
            filter: isHovered ? `drop-shadow(0 0 8px rgba(${TEAL.rgb}, 0.4))` : 'none',
          }}
        >
          NL Technologies
        </motion.span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[11px] font-semibold tracking-wide uppercase"
            style={{ color: theme === 'dark' ? '#64748b' : '#94a3b8' }}
          >
            V Train LMS
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: TEAL.primary,
              boxShadow: `0 0 6px rgba(${TEAL.rgb}, 0.9), 0 0 12px rgba(${TEAL.rgb}, 0.5)`,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.4, 1],
              boxShadow: [
                `0 0 6px rgba(${TEAL.rgb}, 0.9), 0 0 12px rgba(${TEAL.rgb}, 0.5)`,
                `0 0 10px rgba(${TEAL.rgb}, 1), 0 0 20px rgba(${TEAL.rgb}, 0.7)`,
                `0 0 6px rgba(${TEAL.rgb}, 0.9), 0 0 12px rgba(${TEAL.rgb}, 0.5)`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// DIVIDER COMPONENT - TEAL GRADIENT
// ============================================
const Divider: React.FC<{ theme: string }> = ({ theme }) => (
  <motion.div
    className="hidden md:block h-7 w-px mx-2 rounded-full"
    style={{
      background: theme === 'dark'
        ? `linear-gradient(to bottom, transparent, rgba(${TEAL.rgb}, 0.3), transparent)`
        : `linear-gradient(to bottom, transparent, rgba(${TEAL.rgb}, 0.25), transparent)`,
    }}
    initial={{ opacity: 0, scaleY: 0 }}
    animate={{ opacity: 1, scaleY: 1 }}
    transition={{ delay: 0.2 }}
  />
);

// ============================================
// MAIN NAVBAR COMPONENT
// ============================================
export const Navbar: React.FC<NavbarProps> = ({
  user,
  unreadCount,
  notifications,
  refreshNotifications,
  onLogout,
  onPrivacyPolicy,
  onTermsAndConditions,
  onVersionControl,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toggleDesign, designMode } = useDesign();

  if (!user) return null;

  const isDark = theme === 'dark';

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 h-16 md:h-[72px] px-2 flex justify-between items-center transition-all duration-500"
        style={{
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.88)'
            : 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${isDark ? `rgba(${TEAL.rgb}, 0.15)` : `rgba(${TEAL.rgb}, 0.2)`}`,
          boxShadow: isDark
            ? `0 4px 30px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(${TEAL.rgb}, 0.1) inset`
            : `0 4px 30px rgba(${TEAL.rgb}, 0.08), 0 1px 0 rgba(255,255,255,0.9) inset`,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Subtle Teal Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? `linear-gradient(90deg, rgba(${TEAL.rgb}, 0.04) 0%, transparent 30%, transparent 70%, rgba(${TEAL.rgbLight}, 0.04) 100%)`
              : `linear-gradient(90deg, rgba(${TEAL.rgb}, 0.03) 0%, transparent 30%, transparent 70%, rgba(${TEAL.rgbLight}, 0.03) 100%)`,
          }}
        />

        {/* Animated Bottom Border Glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${TEAL.rgb}, 0.5), transparent)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* LEFT SECTION - Logo & Brand */}
        <Logo onClick={() => navigate('/home')} theme={theme} />

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Navigation Button Group */}
          <NavButtonGroup theme={theme}>
            <MiniNavButton
              onClick={() => navigate(-1)}
              icon={<ArrowLeft size={18} strokeWidth={2.5} />}
              title="Go Back"
              theme={theme}
            />
            <MiniNavButton
              onClick={() => navigate('/home')}
              icon={<Home size={18} strokeWidth={2.5} />}
              title="Home"
              theme={theme}
            />
          </NavButtonGroup>

          <Divider theme={theme} />

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <motion.button
              onClick={toggleDesign}
              className="flex items-center gap-2 px-4 py-2 mr-2 rounded-xl bg-teal-500 text-white font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              Classic Mode
            </motion.button>
            {/* Theme Toggle */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {/* Notification Bell - Teal Themed */}
            <GlowButton
              onClick={() => setIsNotificationsOpen(true)}
              icon={<Bell size={20} strokeWidth={2} />}
              title="Notifications"
              color={TEAL.primary}
              rgb={TEAL.rgb}
              badge={unreadCount}
            />
          </div>

          <Divider theme={theme} />

          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <UserDropdown
              isOpen={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
              onClose={() => setDropdownOpen(false)}
              userInitial={user.first_name.charAt(0)}
              userEmail={user.email}
              userName={user.first_name}
              userInitials={user.first_name.charAt(0) + (user.last_name?.charAt(0) || '')}
              onLogout={onLogout}
              onPrivacyPolicy={onPrivacyPolicy}
              onTermsOfService={onTermsAndConditions}
              onVersion={onVersionControl}
            />
          </motion.div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 md:h-[72px]" />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        refreshNotifications={refreshNotifications}
      />
    </>
  );
};

export default Navbar;