

// normal design 

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Star,
  BookOpen, List, Users,
  ClipboardCheck, Calendar,
  FileText, Activity, ShieldCheck,
  Settings, BarChart3, GraduationCap,
  Search, Bell, Briefcase, Layout,
  MousePointer2, Wrench,
  IdCard,Bot
} from 'lucide-react';
import { getAllowedLinksForTile } from '../../constants/permissions';

const getLinkIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('course') || n.includes('lesson')) return <BookOpen size={18} />;
  if (n.includes('training') || n.includes('ojt')) return <GraduationCap size={18} />;
  if (n.includes('quiz') || n.includes('exam') || n.includes('result')) return <ClipboardCheck size={18} />;
  if (n.includes('user') || n.includes('group') || n.includes('people')) return <Users size={18} />;
  if (n.includes('register') || n.includes('enroll') || n.includes('add')) return <IdCard size={18} />;
  if (n.includes('plan') || n.includes('schedule') || n.includes('calendar')) return <Calendar size={18} />;
  if (n.includes('list') || n.includes('table')) return <List size={18} />;
  if (n.includes('report') || n.includes('overview') || n.includes('doc')) return <FileText size={18} />;
  if (n.includes('tracking') || n.includes('status') || n.includes('activity')) return <Activity size={18} />;
  if (n.includes('permission') || n.includes('admin') || n.includes('handover')) return <ShieldCheck size={18} />;
  if (n.includes('setting') || n.includes('config')) return <Settings size={18} />;
  if (n.includes('chart') || n.includes('analytic') || n.includes('metric')) return <BarChart3 size={18} />;
  if (n.includes('search') || n.includes('find')) return <Search size={18} />;
  if (n.includes('notif')) return <Bell size={18} />;
  if (n.includes('work') || n.includes('job')) return <Briefcase size={18} />;
  if (n.includes('dash')) return <Layout size={18} />;
  if (n.includes('ai')) return <Bot size={18} />;

  if (n.includes('tool') || n.includes('fix') || n.includes('maintenance')) return <Wrench size={18} />;
  
  return <MousePointer2 size={18} />;
};

interface TileProps {
  title: string;
  links: any[];
  icon: any;
  disabled?: boolean;
  userRole: string;
  tileId: string;
  index?: number;
}

const TileNew: React.FC<TileProps> = ({ title, links = [], icon: Icon, disabled = false, userRole, tileId }) => {
  const navigate = useNavigate();
  const [pinned, setPinned] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pinned_modules') || '[]');
    setPinned(saved.map((item: any) => item.name));
  }, []);

  const filteredLinks = useMemo(() => {
    if (userRole && tileId) {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      const effectiveUser = auth?.user || { role: userRole };
      return getAllowedLinksForTile(effectiveUser, tileId, links || []);
    }
    return links || [];
  }, [links, userRole, tileId]);

  const handleNavigation = (link: any) => {
    if (disabled) return;
    let recents = JSON.parse(localStorage.getItem('recent_visits') || '[]');
    recents = recents.filter((r: any) => r.name !== link.name);
    recents.unshift({ name: link.name, path: link.path, parentTile: title });
    localStorage.setItem('recent_visits', JSON.stringify(recents.slice(0, 5)));
    window.dispatchEvent(new Event('recent_visits_updated'));
    navigate(link.path);
  };

  const togglePin = (e: React.MouseEvent, link: any) => {
    e.stopPropagation();
    let currentPinned = JSON.parse(localStorage.getItem('pinned_modules') || '[]');
    const isPinned = currentPinned.some((p: any) => p.name === link.name);
    if (isPinned) {
      currentPinned = currentPinned.filter((p: any) => p.name !== link.name);
    } else {
      currentPinned.push({ ...link, parentTile: title });
    }
    localStorage.setItem('pinned_modules', JSON.stringify(currentPinned));
    setPinned(currentPinned.map((p: any) => p.name));
    window.dispatchEvent(new Event('favorites_updated'));
  };

  return (
    <motion.div
      whileHover={!disabled ? { y: -5 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full"
    >
      <div className={`
        group flex flex-col justify-start h-full p-6 rounded-[24px] border transition-all duration-300
        bg-white dark:bg-slate-800
        ${disabled
          ? 'opacity-50 border-slate-100 dark:border-slate-700'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 dark:hover:border-indigo-500/50 hover:shadow-xl dark:hover:shadow-none'
        }
      `}>
        {/* HEADER SECTION */}
        <div className="mb-6 -mx-6 -mt-6 p-6 rounded-t-[24px] bg-indigo-100/100 dark:bg-indigo-900/100 flex items-center justify-between w-[calc(100%+48px)] self-center border-b border-indigo-100/50 dark:border-indigo-500/50">
          <div className="flex items-center gap-4 min-w-0">
            {/* PARENT ICON - Always Active/Colored */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm
              ${disabled
                ? 'bg-slate-50 dark:bg-slate-100/50 text-slate-300 dark:text-slate-600'
                : 'bg-indigo-600 dark:bg-white text-white dark:text-black' 
              }
            `}>
              {Icon && <Icon size={30} strokeWidth={2.5} />}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight break-words whitespace-normal">
                {title}
              </h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mt-0.5">
                {Array.isArray(filteredLinks) ? filteredLinks.length : 0} Modules
              </p>
            </div>
          </div>
        </div>

        {/* LINKS LIST - All modules now styled with the highlight color */}
        <div className="space-y-3">
          {Array.isArray(filteredLinks) && filteredLinks.map((link: any, i: number) => {
            const isStarred = pinned.includes(link.name);

            return (
              <div key={i} className="group/link flex items-center justify-between">
                <button
                  onClick={() => handleNavigation(link)}
                  className={`flex-1 flex items-center py-2 px-3 rounded-xl text-sm font-medium transition-all text-left relative overflow-hidden
                    bg-blue-50/80 dark:bg-indigo-800/40 hover:bg-blue-100 dark:hover:bg-indigo-900/60
                  `}
                >
                  {/* CHILD ICON FRAME - Dark blue in light mode, white in dark mode */}
                  <div className={`
                    mr-4 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${disabled 
                      ? 'bg-slate-100 text-slate-400' 
                      : 'bg-indigo-900 dark:bg-gray-300 text-white dark:text-black shadow-sm'}
                  `}>
                    {getLinkIcon(link.name)}
                  </div>

                  <div className="relative flex-1 min-w-0">
                    <div className="relative inline-block max-w-full">
                      <span className="block text-base font-bold leading-tight whitespace-normal break-words pr-2 text-indigo-900 dark:text-indigo-100">
                        {link.name}
                      </span>
                      {/* Animated underline always ready on hover */}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-600 dark:bg-white transition-all duration-300 group-hover/link:w-full" />
                    </div>
                  </div>

                  <ChevronRight size={14} className="opacity-100 text-indigo-400 transition-all shrink-0 ml-auto" />
                </button>

                {/* STAR BUTTON */}
                <button
                  onClick={(e) => togglePin(e, link)}
                  className={`p-2 rounded-lg transition-all shrink-0 z-10 ${isStarred ? 'opacity-100 text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 opacity-60 group-hover/link:opacity-100'}`}
                >
                  <Star size={16} fill={isStarred ? "currentColor" : "none"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default TileNew;






// // // ====================================================================================================
// // // =======================================================================================================================================
// // // =============================================================================================================================================================
// // // ============================================================================================================================================================================







// // // bubble design 

// // // import React, { useMemo, useState, useEffect } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { motion } from 'framer-motion';
// // // import {
// // //   ChevronRight, Star, BookOpen, List, Users,
// // //   ClipboardCheck, IdCard, Calendar, FileText,
// // //   Activity, ShieldCheck, Settings, BarChart3,
// // //   Search, Bell, Briefcase, Layout, Wrench,
// // //   MousePointer2, GraduationCap, Folder, Home,
// // //   Mail, Phone, Globe, Lock, Key, Clock,
// // //   Award, Target, Zap, Heart, Flag, Bookmark,
// // //   Database, Server, Monitor, Cpu, Wifi, Cloud,
// // //   PieChart, TrendingUp, DollarSign, CreditCard,
// // //   Package, Truck, Map, Compass, Layers, Grid3X3
// // // } from 'lucide-react';
// // // import { linkPermissions } from '../../constants/permissions';

// // // // --- PALETTES WITH HOVER COLORS ---
// // // const PALETTES = [
// // //   { bg: 'bg-purple-100', hoverBg: 'group-hover/item:bg-purple-200', circle: 'bg-purple-200', text: 'text-purple-600', icon: 'bg-purple-500', border: 'border-purple-200 hover:border-purple-400', glow: 'group-hover/item:shadow-purple-300', ring: 'group-hover/item:ring-purple-400' },
// // //   { bg: 'bg-rose-100', hoverBg: 'group-hover/item:bg-rose-200', circle: 'bg-rose-200', text: 'text-rose-600', icon: 'bg-rose-500', border: 'border-rose-200 hover:border-rose-400', glow: 'group-hover/item:shadow-rose-300', ring: 'group-hover/item:ring-rose-400' },
// // //   { bg: 'bg-emerald-100', hoverBg: 'group-hover/item:bg-emerald-200', circle: 'bg-emerald-200', text: 'text-emerald-600', icon: 'bg-emerald-500', border: 'border-emerald-200 hover:border-emerald-400', glow: 'group-hover/item:shadow-emerald-300', ring: 'group-hover/item:ring-emerald-400' },
// // //   { bg: 'bg-amber-100', hoverBg: 'group-hover/item:bg-amber-200', circle: 'bg-amber-200', text: 'text-amber-600', icon: 'bg-amber-500', border: 'border-amber-200 hover:border-amber-400', glow: 'group-hover/item:shadow-amber-300', ring: 'group-hover/item:ring-amber-400' },
// // //   { bg: 'bg-sky-100', hoverBg: 'group-hover/item:bg-sky-200', circle: 'bg-sky-200', text: 'text-sky-600', icon: 'bg-sky-500', border: 'border-sky-200 hover:border-sky-400', glow: 'group-hover/item:shadow-sky-300', ring: 'group-hover/item:ring-sky-400' },
// // //   { bg: 'bg-orange-100', hoverBg: 'group-hover/item:bg-orange-200', circle: 'bg-orange-200', text: 'text-orange-600', icon: 'bg-orange-500', border: 'border-orange-200 hover:border-orange-400', glow: 'group-hover/item:shadow-orange-300', ring: 'group-hover/item:ring-orange-400' },
// // //   { bg: 'bg-pink-100', hoverBg: 'group-hover/item:bg-pink-200', circle: 'bg-pink-200', text: 'text-pink-600', icon: 'bg-pink-500', border: 'border-pink-200 hover:border-pink-400', glow: 'group-hover/item:shadow-pink-300', ring: 'group-hover/item:ring-pink-400' },
// // //   { bg: 'bg-lime-100', hoverBg: 'group-hover/item:bg-lime-200', circle: 'bg-lime-200', text: 'text-lime-600', icon: 'bg-lime-500', border: 'border-lime-200 hover:border-lime-400', glow: 'group-hover/item:shadow-lime-300', ring: 'group-hover/item:ring-lime-400' },
// // //   { bg: 'bg-indigo-100', hoverBg: 'group-hover/item:bg-indigo-200', circle: 'bg-indigo-200', text: 'text-indigo-600', icon: 'bg-indigo-500', border: 'border-indigo-200 hover:border-indigo-400', glow: 'group-hover/item:shadow-indigo-300', ring: 'group-hover/item:ring-indigo-400' },
// // //   { bg: 'bg-teal-100', hoverBg: 'group-hover/item:bg-teal-200', circle: 'bg-teal-200', text: 'text-teal-600', icon: 'bg-teal-500', border: 'border-teal-200 hover:border-teal-400', glow: 'group-hover/item:shadow-teal-300', ring: 'group-hover/item:ring-teal-400' },
// // //   { bg: 'bg-fuchsia-100', hoverBg: 'group-hover/item:bg-fuchsia-200', circle: 'bg-fuchsia-200', text: 'text-fuchsia-600', icon: 'bg-fuchsia-500', border: 'border-fuchsia-200 hover:border-fuchsia-400', glow: 'group-hover/item:shadow-fuchsia-300', ring: 'group-hover/item:ring-fuchsia-400' },
// // //   { bg: 'bg-cyan-100', hoverBg: 'group-hover/item:bg-cyan-200', circle: 'bg-cyan-200', text: 'text-cyan-600', icon: 'bg-cyan-500', border: 'border-cyan-200 hover:border-cyan-400', glow: 'group-hover/item:shadow-cyan-300', ring: 'group-hover/item:ring-cyan-400' },
// // //   { bg: 'bg-violet-100', hoverBg: 'group-hover/item:bg-violet-200', circle: 'bg-violet-200', text: 'text-violet-600', icon: 'bg-violet-500', border: 'border-violet-200 hover:border-violet-400', glow: 'group-hover/item:shadow-violet-300', ring: 'group-hover/item:ring-violet-400' },
// // //   { bg: 'bg-yellow-100', hoverBg: 'group-hover/item:bg-yellow-200', circle: 'bg-yellow-200', text: 'text-yellow-600', icon: 'bg-yellow-500', border: 'border-yellow-200 hover:border-yellow-400', glow: 'group-hover/item:shadow-yellow-300', ring: 'group-hover/item:ring-yellow-400' },
// // //   { bg: 'bg-red-100', hoverBg: 'group-hover/item:bg-red-200', circle: 'bg-red-200', text: 'text-red-600', icon: 'bg-red-500', border: 'border-red-200 hover:border-red-400', glow: 'group-hover/item:shadow-red-300', ring: 'group-hover/item:ring-red-400' },
// // //   { bg: 'bg-blue-100', hoverBg: 'group-hover/item:bg-blue-200', circle: 'bg-blue-200', text: 'text-blue-600', icon: 'bg-blue-500', border: 'border-blue-200 hover:border-blue-400', glow: 'group-hover/item:shadow-blue-300', ring: 'group-hover/item:ring-blue-400' },
// // //   { bg: 'bg-slate-100', hoverBg: 'group-hover/item:bg-slate-200', circle: 'bg-slate-200', text: 'text-slate-600', icon: 'bg-slate-500', border: 'border-slate-200 hover:border-slate-400', glow: 'group-hover/item:shadow-slate-300', ring: 'group-hover/item:ring-slate-400' },
// // // ];

// // // // --- 28 UNIQUE ICONS ---
// // // const UNIQUE_ICONS = [
// // //   BookOpen,
// // //   GraduationCap,
// // //   ClipboardCheck,
// // //   Users,
// // //   IdCard,
// // //   Calendar,
// // //   FileText,
// // //   Settings,
// // //   Briefcase,
// // //   Layout,
// // //   Wrench,
// // //   Activity,
// // //   ShieldCheck,
// // //   BarChart3,
// // //   Search,
// // //   Bell,
// // //   Folder,
// // //   Home,
// // //   Mail,
// // //   Globe,
// // //   Lock,
// // //   Key,
// // //   Clock,
// // //   Award,
// // //   Target,
// // //   Zap,
// // //   Database,
// // //   PieChart,
// // // ];

// // // // Get unique icon based on index
// // // const getUniqueIcon = (index: number, size: number = 24) => {
// // //   const IconComponent = UNIQUE_ICONS[index % UNIQUE_ICONS.length];
// // //   return <IconComponent size={size} strokeWidth={1.8} />;
// // // };

// // // interface TileProps {
// // //   title: string;
// // //   links: any[];
// // //   icon: any;
// // //   disabled?: boolean;
// // //   userRole: string;
// // //   tileId: string;
// // //   index: number;
// // // }

// // // const Tile: React.FC<TileProps> = ({ title, links = [], icon: Icon, disabled = false, userRole, tileId, index }) => {
// // //   const navigate = useNavigate();
// // //   const [pinned, setPinned] = useState<string[]>([]);

// // //   useEffect(() => {
// // //     const saved = JSON.parse(localStorage.getItem('pinned_modules') || '[]');
// // //     setPinned(saved.map((item: any) => item.name));
// // //   }, []);

// // //   const filteredLinks = useMemo(() => {
// // //     if (userRole && tileId) {
// // //       const rolePerms = (linkPermissions as any)[userRole];
// // //       const perms = rolePerms ? rolePerms[tileId] : null;
// // //       if (perms) return (links || []).filter((l: any) => perms.includes(l.name));
// // //     }
// // //     return links || [];
// // //   }, [links, userRole, tileId]);

// // //   // Main tile palette - ALL CHILDREN WILL USE THIS SAME PALETTE
// // //   const palette = useMemo(() => PALETTES[index % PALETTES.length], [index]);

// // //   const handleNavigation = (link: any) => {
// // //     if (disabled) return;
// // //     let recents = JSON.parse(localStorage.getItem('recent_visits') || '[]');
// // //     recents = recents.filter((r: any) => r.name !== link.name);
// // //     recents.unshift({ name: link.name, path: link.path, parentTile: title });
// // //     localStorage.setItem('recent_visits', JSON.stringify(recents.slice(0, 5)));
// // //     window.dispatchEvent(new Event('recent_visits_updated'));
// // //     navigate(link.path);
// // //   };

// // //   const togglePin = (e: React.MouseEvent, link: any) => {
// // //     e.stopPropagation();
// // //     let currentPinned = JSON.parse(localStorage.getItem('pinned_modules') || '[]');
// // //     const isPinned = currentPinned.some((p: any) => p.name === link.name);
// // //     if (isPinned) {
// // //       currentPinned = currentPinned.filter((p: any) => p.name !== link.name);
// // //     } else {
// // //       currentPinned.push({ ...link, parentTile: title });
// // //     }
// // //     localStorage.setItem('pinned_modules', JSON.stringify(currentPinned));
// // //     setPinned(currentPinned.map((p: any) => p.name));
// // //     window.dispatchEvent(new Event('favorites_updated'));
// // //   };

// // //   return (
// // //     <motion.div
// // //       whileHover={!disabled ? { y: -6 } : {}}
// // //       className="h-full w-full group"
// // //     >
// // //       <div className={`
// // //         relative overflow-hidden flex flex-col h-full rounded-[32px] 
// // //         border-2 transition-all duration-300
// // //         bg-white dark:bg-slate-900 
// // //         ${disabled
// // //           ? 'opacity-50 grayscale border-slate-200'
// // //           : `${palette.border} shadow-md hover:shadow-2xl`
// // //         }
// // //       `}>

// // //         {/* ========== HEADER SECTION - BIG ICON & BIG TEXT ========== */}
// // //         <div className={`relative h-30 p-7 overflow-hidden transition-colors ${palette.bg} dark:bg-opacity-10`}>

// // //           {/* Decorative half-circle */}
// // //           <div className={`
// // //             absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-60 
// // //             transition-transform duration-700 group-hover:scale-125 
// // //             ${palette.circle}
// // //           `} />

// // //           {/* Second decorative circle */}
// // //           <div className={`
// // //             absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-30 
// // //             transition-transform duration-700 group-hover:scale-110 
// // //             ${palette.circle}
// // //           `} />

// // //           <div className="relative z-10 flex flex-row items-center gap-4">

// // //             {/* ===== ICON BOX (Smaller & Squared) ===== */}
// // //             <div className={`
// // //       flex-shrink-0 w-18 h-18 rounded-2xl flex items-center justify-center 
// // //       shadow-lg transition-transform duration-300
// // //       group-hover:scale-105
// // //       ${disabled ? 'bg-slate-300' : `${palette.icon} text-white`}
// // //     `}>
// // //               {Icon && <Icon size={32} strokeWidth={2.5} />}
// // //             </div>

// // //             {/* ===== TEXT COLUMN (Centered beside icon) ===== */}
// // //             <div className="flex flex-col justify-center">
// // //               <h2 className={`text-2xl font-extrabold tracking-tight leading-none ${palette.text} dark:text-white`}>
// // //                 {title}
// // //               </h2>
// // //               <p className={`text-[11px] font-bold uppercase tracking-wider mt-1.5 opacity-80 ${palette.text} dark:text-slate-400`}>
// // //                 {filteredLinks.length} MODULES
// // //               </p>
// // //             </div>

// // //           </div>
// // //         {/* </div> */}
// // //       </div>

// // //       {/* ========== 2-COLUMN GRID - CHILD ICONS ========== */}
// // //       <div className="p-5 flex-1">
// // //         <div className="grid grid-cols-2 gap-3">
// // //           {filteredLinks.map((link, i) => {
// // //             const isStarred = pinned.includes(link.name);

// // //             return (
// // //               <div
// // //                 key={i}
// // //                 className="group/item relative"
// // //               >
// // //                 <button
// // //                   onClick={() => handleNavigation(link)}
// // //                   className={`
// // //                       w-full flex flex-col items-center p-4 rounded-2xl 
// // //                       transition-all duration-300 ease-out
// // //                       border-2 border-transparent
// // //                       bg-slate-50/80 
// // //                       hover:bg-white hover:shadow-xl hover:scale-[1.03]
// // //                       hover:border-current
// // //                       dark:bg-slate-800/50 dark:hover:bg-slate-800
// // //                       ${palette.text}
// // //                     `}
// // //                 >
// // //                   {/* ===== CHILD ICON BOX - SAME COLOR AS PARENT ===== */}
// // //                   <div className={`
// // //                       relative overflow-hidden w-14 h-14 rounded-2xl mb-3
// // //                       transition-all duration-300 ease-out
// // //                       ${palette.bg} ${palette.hoverBg}
// // //                       ${palette.glow}
// // //                       group-hover/item:shadow-lg
// // //                       group-hover/item:scale-110
// // //                       group-hover/item:ring-2 ${palette.ring}
// // //                       flex items-center justify-center
// // //                     `}>
// // //                     {/* Decorative circles */}
// // //                     <div className={`
// // //                         absolute -bottom-3 -right-3 w-8 h-8 rounded-full opacity-50 
// // //                         transition-all duration-500 
// // //                         group-hover/item:scale-150 group-hover/item:opacity-70
// // //                         ${palette.circle}
// // //                       `} />
// // //                     <div className={`
// // //                         absolute -top-2 -left-2 w-5 h-5 rounded-full opacity-30 
// // //                         transition-all duration-700 
// // //                         group-hover/item:scale-125 group-hover/item:opacity-50
// // //                         ${palette.circle}
// // //                       `} />

// // //                     {/* ===== CHILD ICON - SAME COLOR AS PARENT ===== */}
// // //                     <div className={`
// // //                         relative z-10 
// // //                         transition-all duration-300 ease-out
// // //                         ${palette.text}
// // //                         group-hover/item:scale-110
// // //                       `}>
// // //                       {getUniqueIcon(i, 24)}
// // //                     </div>
// // //                   </div>

// // //                   {/* ===== SMALL CHILD TEXT ===== */}
// // //                   <span className={`
// // //                       text-[18px] font-semibold text-center leading-tight
// // //                       text-slate-600 dark:text-slate-300
// // //                       group-hover/item:font-bold
// // //                       transition-all duration-200
// // //                       line-clamp-2 w-full
// // //                       ${palette.text} group-hover/item:opacity-100 opacity-80
// // //                     `}>
// // //                     {link.name}
// // //                   </span>
// // //                 </button>

// // //                 {/* STAR BUTTON */}
// // //                 <button
// // //                   onClick={(e) => togglePin(e, link)}
// // //                   className={`
// // //                       absolute top-2 right-2 p-1.5 rounded-full
// // //                       transition-all duration-200 z-10
// // //                       ${isStarred
// // //                       ? 'text-amber-400 bg-amber-50 opacity-100 shadow-sm scale-110'
// // //                       : 'text-slate-300 hover:text-amber-400 hover:bg-white/90 opacity-0 group-hover/item:opacity-100'
// // //                     }
// // //                     `}
// // //                 >
// // //                   <Star size={14} fill={isStarred ? "currentColor" : "none"} strokeWidth={2} />
// // //                 </button>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       </div>

// // //     </div>
// // //     </motion.div >
// // //   );
// // // };

// // // export default Tile;





// import React, { useMemo, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   ChevronRight, Star, BookOpen, GraduationCap, 
//   ClipboardCheck, Users, IdCard, Calendar, 
//   List, FileText, Activity, ShieldCheck, 
//   Settings, BarChart3, Search, Bell, 
//   Briefcase, Layout, Wrench, MousePointer2,
//   Shield, PenTool, ClipboardList, UserCheck, Zap
// } from 'lucide-react';
// import { linkPermissions } from '../../constants/permissions';

// interface TileProps {
//   title: string;
//   links: any[];
//   icon: any;
//   disabled?: boolean;
//   userRole: string;
//   tileId: string;
// }

// // --- ICON LOGIC ---
// const getLinkIcon = (name: string) => {
//   const n = name.toLowerCase();
//   const props = { size: 18, strokeWidth: 2, className: "text-white" };
//   if (n.includes('admin')) return <Shield {...props} />;
//   if (n.includes('management') || n.includes('review')) return <BarChart3 {...props} />;
//   if (n.includes('registration')) return <UserCheck {...props} />;
//   if (n.includes('course')) return <BookOpen {...props} />;
//   if (n.includes('create')) return <PenTool {...props} />;
//   if (n.includes('enroll')) return <ClipboardList {...props} />;
//   if (n.includes('plan')) return <Calendar {...props} />;
//   return <Layout {...props} />;
// };

// // --- THEME STYLES ---
// const getThemeStyles = (title: string) => {
//   const t = title.toLowerCase();
//   const createStyles = (color: string, rgb: string, gradient: string) => ({
//     color: color,
//     rgb: rgb,
//     gradient: gradient,
//     glowColor: `rgba(${rgb}, 0.4)`,
//     parentShadow: `0 8px 24px rgba(${rgb}, 0.4)`,
//     cardShadow: `0 10px 40px -12px rgba(0,0,0,0.05)`,
//     hoverCardShadow: `0 20px 60px rgba(${rgb}, 0.4)`,
//   });
  
//   if (t.includes('dash')) return createStyles('#3b82f6', '59,130,246', 'from-cyan-500 via-blue-500 to-indigo-600');
//   if (t.includes('regis')) return createStyles('#6366f1', '99,102,241', 'from-blue-500 via-indigo-500 to-violet-600');
//   if (t.includes('course')) return createStyles('#10b981', '16,185,129', 'from-emerald-500 via-teal-500 to-green-600');
//   if (t.includes('plan')) return createStyles('#06b6d4', '6,182,212', 'from-teal-500 via-cyan-500 to-sky-600');
//   if (t.includes('group')) return createStyles('#8b5cf6', '139,92,246', 'from-violet-500 via-purple-500 to-fuchsia-600');
//   if (t.includes('user') || t.includes('master')) return createStyles('#14b8a6', '20,184,166', 'from-orange-500 via-red-500 to-rose-600');
//   if (t.includes('assess')) return createStyles('#f59e0b', '245,158,11', 'from-pink-500 via-rose-500 to-red-600');
//   if (t.includes('skill')) return createStyles('#f97316', '249,115,22', 'from-amber-500 via-yellow-500 to-orange-600');
//   if (t.includes('knowledge')) return createStyles('#10b981', '16,185,129', 'from-lime-500 via-green-500 to-emerald-600');
//   if (t.includes('multi')) return createStyles('#ef4444', '239,68,68', 'from-red-500 via-pink-500 to-fuchsia-600');
//   if (t.includes('setting')) return createStyles('#5683c2', '10,116,139', 'from-blue-500 via-orange-500 to-teal-600');
//   if (t.includes('notif')) return createStyles('#eab308', '234,179,8', 'from-yellow-500 via-amber-500 to-orange-600');
//   if (t.includes('report')) return createStyles('#a855f7', '168,85,247', 'from-purple-500 via-indigo-500 to-blue-600');
//   if (t.includes('method')) return createStyles('#7bf755', '123,247,85', 'from-lime-400 via-green-500 to-emerald-600');

//   return createStyles('#14b8a6', '20,184,166', 'from-teal-500 via-emerald-500 to-green-600');
// };

// const Tile: React.FC<TileProps> = ({ title, links = [], icon: Icon, disabled = false, userRole, tileId }) => {
//   const navigate = useNavigate();
//   const [pinned, setPinned] = useState<string[]>([]);
//   const styles = useMemo(() => getThemeStyles(title), [title]);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem('pinned_modules') || '[]');
//     setPinned(saved.map((item: any) => item.name));
//   }, []);

//   const filteredLinks = useMemo(() => {
//     if (userRole && tileId) {
//       const rolePerms = (linkPermissions as any)[userRole];
//       const perms = rolePerms ? rolePerms[tileId] : null;
//       if (perms) return (links || []).filter((l: any) => perms.includes(l.name));
//     }
//     return links || [];
//   }, [links, userRole, tileId]);

//   return (
//     <motion.div 
//       layout
//       initial={{ opacity: 0, y: 15 }} 
//       animate={{ opacity: 1, y: 0 }} 
//       className="w-full flex"
//     >
//       <div 
//         className={`
//           flex flex-col flex-1 p-6 md:p-8 rounded-[32px] transition-all duration-500 border overflow-hidden group
//           bg-white dark:bg-[#1e293b] border-slate-100 dark:border-[#334155] relative w-full
//           ${disabled ? 'opacity-60 grayscale' : 'hover:scale-[1.01] hover:z-10 dark:hover:border-teal-500/20'}
//         `}
//         style={{
//           boxShadow: styles.cardShadow // Height is now auto-adjusting based on flex-col
//         }}
//         onMouseEnter={(e) => { 
//           if (!disabled) {
//             e.currentTarget.style.boxShadow = styles.hoverCardShadow;
//           }
//         }}
//         onMouseLeave={(e) => { 
//           e.currentTarget.style.boxShadow = styles.cardShadow;
//         }}
//       >
//         {/* Background Effects */}
//         <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-5 transition-all duration-500`} />
//         <div className="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" />
//         <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

//         {/* Header Section */}
//         <div className="flex items-center gap-5 mb-8 relative z-10">
//           <div 
//             className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${styles.gradient} rounded-[20px] md:rounded-[22px] flex items-center justify-center shrink-0 shadow-xl transition-all duration-500 relative overflow-hidden`}
//             style={{ boxShadow: styles.parentShadow }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />
//             {Icon && <Icon className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10 icon-glow" />}
//           </div>
//           <div className="flex flex-col min-w-0 flex-1">
//             <h3 className={`text-lg md:text-[22px] font-bold text-slate-900 dark:text-slate-50 leading-tight mb-1 transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${styles.gradient}`}>
//               {title}
//             </h3>
//             <div className="flex items-center gap-2">
//               <p className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">
//                 {filteredLinks.length} MODULES
//               </p>
//               <motion.div 
//                 className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${styles.gradient}`} 
//                 animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }} 
//                 transition={{ duration: 2, repeat: Infinity }} 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Modules List Section - Auto-height container */}
//         <div className="flex flex-col gap-4 relative z-10">
//           {filteredLinks.map((link: any, i: number) => {
//             const isStarred = pinned.includes(link.name);
//             return (
//               <motion.button 
//                 key={i} 
//                 onClick={() => !disabled && navigate(link.path)} 
//                 className="group/item w-full flex items-center justify-between p-3 md:p-4 rounded-[18px] md:rounded-[20px] transition-all duration-300 text-left relative overflow-hidden bg-slate-50/40 dark:bg-[#334155]/40 hover:bg-white dark:hover:bg-[#334155]/80 border border-transparent hover:border-slate-100 dark:hover:border-teal-500/10"
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient} opacity-0 group-hover/item:opacity-10 transition-all duration-300`} />
//                 <div className={`absolute left-0 inset-y-0 w-0 group-hover/item:w-1 bg-gradient-to-b ${styles.gradient} transition-all duration-300 rounded-l-xl`} />
                
//                 <div className="flex items-center gap-4 min-w-0 relative z-10 flex-1">
//                   <div className={`w-10 h-10 bg-gradient-to-br ${styles.gradient} rounded-[14px] flex items-center justify-center shrink-0 shadow-md`} style={{ boxShadow: `0 4px 12px -2px ${styles.glowColor}` }}>
//                     {getLinkIcon(link.name)}
//                   </div>
//                   <span className="text-[15px] font-bold text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover:text-teal-100 leading-tight whitespace-normal break-words">
//                     {link.name}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 shrink-0 relative z-10 ml-2">
//                   <Star 
//                     size={18} 
//                     className={`transition-all duration-300 ${isStarred ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-200 dark:text-slate-600 group-hover/item:text-teal-400/40'}`} 
//                   />
//                   <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover/item:text-teal-400/60 transition-all" />
//                 </div>
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Tile;
