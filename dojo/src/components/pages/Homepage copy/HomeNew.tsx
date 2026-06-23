

// normal design 

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import {
  getTilesByTab,
  dashboardLinks,
  tableLinks,
  formLinks,
  type TabId
} from '../../constants/tileData';
import { rolePermissions } from '../../constants/permissions';
import TilesGridNew from '../../organisms/TilesGrid copy/TilesGrid';

// REPLACE THIS WITH YOUR ACTUAL IMAGE PATH
import HeroImage from '../../../assets/Images/hero.png';
import TilesGrid from '../../organisms/TilesGrid/TilesGrid';
import { useDesign } from "../../../context/DesignContext";

export const HomePageNew = () => {
  const [searchParams] = useSearchParams();
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const navigate = useNavigate();

  const initialTab = (searchParams.get('tab') as TabId) || 'overview';
  const [activeTab] = useState<TabId>(initialTab);
  const { designMode } = useDesign();

  const loadRecents = () => {
    const saved = JSON.parse(localStorage.getItem('recent_visits') || '[]');
    setRecentVisits(saved);
  };

  useEffect(() => {
    loadRecents();
    window.addEventListener('recent_visits_updated', loadRecents);
    window.addEventListener('storage', loadRecents);

    return () => {
      window.removeEventListener('recent_visits_updated', loadRecents);
      window.removeEventListener('storage', loadRecents);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role as keyof typeof rolePermissions;
  const JOURNEY_ORDER = ['lms-dashboard', 'process-dojo', 'courses', 'department-training', 'planning'];

  const filteredTiles = useMemo(() => {
    const allTiles = getTilesByTab(activeTab);
    return allTiles
      .filter(tile => {
        if (rolePermissions[userRole] === 'ALL') return true;
        return rolePermissions[userRole]?.includes(tile.id);
      })
      .sort((a, b) => {
        const indexA = JOURNEY_ORDER.indexOf(a.id);
        const indexB = JOURNEY_ORDER.indexOf(b.id);
        return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
      });
  }, [activeTab, userRole]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-transparent"
    >
      {/* HERO SECTION */}
      <section className="px-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl" />

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] animate-shine" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Content Container - UPDATED GRID LAYOUT */}
          {/* Changed grid-cols-2 to grid-cols-12 to allow uneven split */}
          <div className="relative z-10 px-8 md:px-12 py-10 md:py-14 grid lg:grid-cols-12 gap-8 items-center">

            {/* LEFT COLUMN: Text Content - NOW NARROWER */}
            {/* Changed to col-span-5 (approx 40% width) */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xL font-semibold text-blue-300 uppercase tracking-wide">
                  V Train LMS Platform
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
              >
                Welcome to{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Digital Learning
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-base md:text-lg text-slate-300 max-w-xl leading-relaxed"
              >
                Discover courses, track your progress, and achieve your professional goals with our state-of-the-art LMS.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12"
              >
                {[
                  { value: 'Secure', label: 'SSO Enabled' },
                  { value: 'Custom', label: 'Learning Paths' },
                  { value: 'Internal', label: 'Resource Hub' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex flex-col items-center lg:items-start"
                  >
                    <span className="text-xl font-semibold text-white">{stat.value}</span>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Image - NOW WIDER AREA BUT SHORTER IMAGE */}
            {/* Changed to col-span-7 (approx 60% width) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative hidden lg:block lg:col-span-7"
            >
              <motion.img
                src={HeroImage}
                alt="LMS Dashboard Illustration"
                // UPDATED IMAGE STYLING:
                // h-64: Forces fixed small height
                // w-full: Takes up full width of the col-span-7
                // object-contain: Ensures image isn't cropped
                className="w-full h-64 object-contain drop-shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

          </div>
        </div>

        {/* Recently Visited */}
        <AnimatePresence>
          {recentVisits.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <div
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg mr-1"
                style={{
                  backgroundColor: 'rgb(var(--bg-card))',
                  color: 'rgb(var(--text-muted))'
                }}
              >
                <Clock size={12} />
                <span>Recent</span>
              </div>
              {recentVisits.slice(0, 5).map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="group flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-500/5"
                  style={{
                    backgroundColor: 'rgb(var(--bg-card))',
                    borderColor: 'rgb(var(--border-main))',
                    color: 'rgb(var(--text-main))'
                  }}
                >
                  {item.name}
                  <ArrowRight
                    size={10}
                    className="text-blue-500 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Divider */}
      <div className="my-8 px-6 md:px-12">
        <div
          className="h-px w-full"
          style={{ backgroundColor: 'rgb(var(--border-main))' }}
        />
      </div>

      {/* GRID CONTENT */}
      <main className="w-full">
        <AnimatePresence mode="wait">
          {['dashboards', 'tables', 'forms'].includes(activeTab) ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full px-6 md:px-12"
            >
              {(activeTab === 'dashboards' ? dashboardLinks :
                activeTab === 'tables' ? tableLinks : formLinks).map((link, i) => (
                  <motion.div
                    key={i}
                    onClick={() => navigate(link.path)}
                    whileHover={{ y: -2 }}
                    className="group p-5 rounded-xl cursor-pointer border transition-all duration-200 hover:shadow-lg hover:border-blue-500/30"
                    style={{
                      backgroundColor: 'rgb(var(--bg-card))',
                      borderColor: 'rgb(var(--border-main))'
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-500"
                    >
                      <link.icon size={18} />
                    </div>

                    <h3
                      className="font-semibold text-sm group-hover:text-blue-500 transition-colors"
                      style={{ color: 'rgb(var(--text-main))' }}
                    >
                      {link.name}
                    </h3>
                    <p
                      className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
                      style={{ color: 'rgb(var(--text-muted))' }}
                    >
                      {link.description}
                    </p>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <motion.div key="journey-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
              {/* DYNAMIC SWAP HERE */}
              {designMode === 'modern' ? (
                <TilesGridNew tiles={filteredTiles} userRole={userRole} />
              ) : (
                <TilesGrid tiles={filteredTiles} userRole={userRole} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Shine Animation */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-200%) skewX(-12deg); }
          100% { transform: translateX(400%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 8s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default HomePageNew;





// import { useState, useEffect, useMemo } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Clock, ArrowRight, Zap } from 'lucide-react';
// import {
//   getTilesByTab,
//   dashboardLinks,
//   tableLinks,
//   formLinks,
//   type TabId
// } from '../../constants/tileData';
// import { rolePermissions } from '../../constants/permissions';
// import TilesGrid from '../../organisms/TilesGrid/TilesGrid';

// // REPLACE THIS WITH YOUR ACTUAL IMAGE PATH
// import HeroImage from '../../../assets/Images/hero.png';

// export const HomePage = () => {
//   const [searchParams] = useSearchParams();
//   const [recentVisits, setRecentVisits] = useState<any[]>([]);
//   const navigate = useNavigate();

//   const initialTab = (searchParams.get('tab') as TabId) || 'overview';
//   const [activeTab] = useState<TabId>(initialTab);

//   const loadRecents = () => {
//     const saved = JSON.parse(localStorage.getItem('recent_visits') || '[]');
//     setRecentVisits(saved);
//   };

//   useEffect(() => {
//     loadRecents();
//     window.addEventListener('recent_visits_updated', loadRecents);
//     window.addEventListener('storage', loadRecents);

//     return () => {
//       window.removeEventListener('recent_visits_updated', loadRecents);
//       window.removeEventListener('storage', loadRecents);
//     };
//   }, []);

//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const userRole = user?.role as keyof typeof rolePermissions;
//   const JOURNEY_ORDER = ['lms-dashboard', 'process-dojo', 'courses', 'department-training', 'planning'];

//   const filteredTiles = useMemo(() => {
//     const allTiles = getTilesByTab(activeTab);
//     return allTiles
//       .filter(tile => {
//         if (rolePermissions[userRole] === 'ALL') return true;
//         return rolePermissions[userRole]?.includes(tile.id);
//       })
//       .sort((a, b) => {
//         const indexA = JOURNEY_ORDER.indexOf(a.id);
//         const indexB = JOURNEY_ORDER.indexOf(b.id);
//         return (indexA > -1 ? indexA : 99) - (indexB > -1 ? indexB : 99);
//       });
//   }, [activeTab, userRole]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       /* UPDATED: Dynamic background for light and dark modes */
//       className="w-full min-h-screen transition-colors duration-500 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 relative overflow-hidden pb-20"
//     >
//       {/* BACKGROUND ATMOSPHERE: Colors adjust automatically for Dark Mode */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 right-10 w-64 h-64 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-blob"></div>
//         <div className="absolute bottom-40 left-10 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-blob" style={{animationDelay: '2s'}}></div>
//         <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob" style={{animationDelay: '4s'}}></div>
//       </div>

//       {/* HERO SECTION */}
//       <section className="px-2 relative z-10 pt-1">
//         <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0d2329] via-[#153a42] to-[#1a5045] dark:from-slate-900 dark:via-slate-800 dark:to-teal-900 shadow-2xl border border-white/5 dark:border-teal-500/20">
//           <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-teal-400/[0.05] rounded-full blur-3xl pointer-events-none" />
          
//           <div className="relative z-10 px-8 md:px-12 lg:px-16 py-8 md:py-16 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[420px]">
//             {/* LEFT COLUMN: Text Content */}
//             <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d2528]/80 dark:bg-slate-950/50 border border-emerald-400/30 backdrop-blur-sm mb-8"
//               >
//                 <Zap className="w-3.5 h-3.5 text-emerald-400" />
//                 <span className="text-sm font-medium text-emerald-300/90 tracking-wide">
//                   V TRAIN LMS PLATFORM
//                 </span>
//               </motion.div>

//               <motion.h1
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold tracking-tight"
//               >
//                 <span className="text-white">Welcome to </span>
//                 <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
//                   Digital Learning
//                 </span>
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="mt-4 text-base md:text-lg text-slate-400 dark:text-slate-300 max-w-lg leading-relaxed"
//               >
//                 Discover courses, track your progress, and achieve your professional goals with our state-of-the-art LMS.
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="mt-8 flex items-center justify-center lg:justify-start"
//               >
//                 {[
//                   { label: 'Secure', value: 'SSO ENABLED' },
//                   { label: 'Custom', value: 'LEARNING PATHS' },
//                   { label: 'Internal', value: 'RESOURCE HUB' },
//                 ].map((stat, i, arr) => (
//                   <div key={i} className="flex items-center">
//                     <div className="flex flex-col items-center lg:items-start px-6 first:pl-0 last:pr-0">
//                       <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-teal-500/70 font-bold mb-1">
//                         {stat.label}
//                       </span>
//                       <span className="text-sm font-bold text-white uppercase tracking-wide">
//                         {stat.value}
//                       </span>
//                     </div>
//                     {i < arr.length - 1 && <div className="w-px h-10 bg-slate-700/50" />}
//                   </div>
//                 ))}
//               </motion.div>
//             </div>

//             {/* RIGHT COLUMN: Hero Illustration */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2, duration: 0.6 }}
//               className="relative hidden lg:flex lg:col-span-6 justify-center"
//             >
//               <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
//               <motion.img
//                 src={HeroImage}
//                 alt="Digital Learning"
//                 className="relative z-10 w-full max-w-xl object-contain drop-shadow-2xl"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
//               />
//             </motion.div>
//           </div>
//         </div>

//         {/* Recently Visited - Pill Navigation */}
//         <AnimatePresence>
//           {recentVisits.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="mt-8 flex flex-wrap items-center justify-start gap-3 px-4"
//             >
//               <div className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
//                 <Clock size={14} />
//                 <span>Recent</span>
//               </div>
              
//               {recentVisits.slice(0, 5).map((item, i) => (
//                 <motion.button
//                   key={i}
//                   onClick={() => navigate(item.path)}
//                   className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300 hover:border-emerald-400 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-600 hover:shadow-md"
//                 >
//                   {item.name}
//                   <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
//                 </motion.button>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </section>

//       {/* Main Content Area */}
//       <main className="w-full relative z-10 mt-12">
//         <AnimatePresence mode="wait">
//           {['dashboards', 'tables', 'forms'].includes(activeTab) ? (
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, scale: 0.98 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full"
//             >
//               {(activeTab === 'dashboards' ? dashboardLinks :
//                 activeTab === 'tables' ? tableLinks : formLinks).map((link, i) => (
//                   <motion.div
//                     key={i}
//                     onClick={() => navigate(link.path)}
//                     whileHover={{ y: -5 }}
//                     /* UPDATED: Glassmorphism that adapts to Dark Mode */
//                     className="group p-6 rounded-[24px] cursor-pointer border border-white/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500/50"
//                   >
//                     <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
//                       <link.icon size={22} />
//                     </div>
//                     <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
//                       {link.name}
//                     </h3>
//                     <p className="text-xs mt-2 text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
//                       {link.description}
//                     </p>
//                   </motion.div>
//                 ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="journey-grid"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="w-full"
//             >
//               <TilesGrid tiles={filteredTiles} userRole={userRole} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </motion.div>
//   );
// };

// export default HomePage;