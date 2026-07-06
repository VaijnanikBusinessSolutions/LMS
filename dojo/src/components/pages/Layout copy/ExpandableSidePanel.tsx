


// src/components/Navigation/ExpandableSidePanel.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type TabId, dashboardLinks, tableLinks, formLinks, tabs, tiles } from '../../constants/tileData';
import { getAllowedLinksForTile } from '../../constants/permissions';

interface ExpandableSidePanelProps {
  activeTab: TabId;
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
  user?: { role?: string; userType?: string; permissions?: Record<string, { view?: boolean; create?: boolean; update?: boolean; delete?: boolean; approve?: boolean; export?: boolean; manage?: boolean }> } | null;
}

export const ExpandableSidePanelNew = ({ activeTab, isOpen, onClose, userRole, user }: ExpandableSidePanelProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const currentTab = tabs.find(t => t.id === activeTab);

  const getLinks = () => {
    let rawLinks: any[] = [];

    // 1. MAP DATA TO PERMISSION TILE IDs
    if (activeTab === 'dashboards') {
      rawLinks = dashboardLinks.map(link => ({ ...link, tileId: 'lms-dashboard' }));
    } else if (activeTab === 'tables') {
      rawLinks = tableLinks.map(link => {
        let tileId = 'reports';
        if (link.name === 'Courses') tileId = 'courses';
        if (link.name === 'User Table' || link.name === 'Employee History Card') tileId = 'master-employee';
        if (link.name === 'Lesson Materials') tileId = 'level-curriculum';
        if (link.name === 'AR/VR Experience' || link.name === 'Animations') tileId = 'ar-vr';
        return { ...link, tileId };
      });
    } else if (activeTab === 'forms') {
      rawLinks = formLinks.map(link => {
        let tileId = 'User Managements';
        if (link.name === 'Registration') tileId = 'process-dojo';
        if (link.name === 'Planning') tileId = 'planning';
        if (link.name === 'Create Course') tileId = 'courses';
        return { ...link, tileId };
      });
    } else {
      const categoryTiles = tiles.filter(tile => tile.tabCategories.includes(activeTab));
      rawLinks = categoryTiles.flatMap(tile =>
        tile.links.map(link => ({ ...link, tileId: tile.id, parentTitle: tile.title }))
      );
    }

    const effectiveUser = user || { role: userRole, userType: userRole };
    const filtered = rawLinks.filter(link => {
      if (!link.tileId) {
        return false;
      }
      return getAllowedLinksForTile(effectiveUser, link.tileId, [link]).length > 0;
    });

    if (!searchQuery.trim()) return filtered;
    return filtered.filter(link => 
      link.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const links = getLinks();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 280 }}
          exit={{ width: 0 }}
          className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0 z-20 pt-16"
        >
          <div className="w-[280px] h-full flex flex-col">
            <div className="p-5 border-b flex justify-between items-center">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                {currentTab?.icon && <currentTab.icon size={18} />}
                <h2 className="font-bold text-xl">{currentTab?.label}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>

            <div className="px-4 py-3">
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${currentTab?.label}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
              {links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => navigate(link.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-blue-900/20 hover:text-indigo-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {link.icon && <link.icon size={18} className="text-slate-900 dark:text-slate-100 group-hover:text-indigo-800" />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};






// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, ChevronRight, Search as SearchIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { type TabId, dashboardLinks, tableLinks, formLinks, tabs, tiles } from '../../constants/tileData';
// import { linkPermissions } from '../../constants/permissions';

// interface ExpandableSidePanelProps {
//   activeTab: TabId;
//   isOpen: boolean;
//   onClose: () => void;
//   userRole: string;
// }

// export const ExpandableSidePanel = ({ activeTab, isOpen, onClose, userRole }: ExpandableSidePanelProps) => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const currentTab = tabs.find(t => t.id === activeTab);

//   const getLinks = () => {
//     let rawLinks: any[] = [];

//     if (activeTab === 'dashboards') {
//       rawLinks = dashboardLinks.map(link => ({ ...link, tileId: 'lms-dashboard' }));
//     } else if (activeTab === 'tables') {
//       rawLinks = tableLinks.map(link => {
//         let tileId = 'reports';
//         if (link.name === 'Courses') tileId = 'courses';
//         if (link.name === 'User Table' || link.name === 'Employee History Card') tileId = 'master-employee';
//         if (link.name === 'Lesson Materials') tileId = 'level-curriculum';
//         if (link.name === 'AR/VR Experience' || link.name === 'Animations') tileId = 'ar-vr';
//         return { ...link, tileId };
//       });
//     } else if (activeTab === 'forms') {
//       rawLinks = formLinks.map(link => {
//         let tileId = 'User Managements';
//         if (link.name === 'Registration') tileId = 'process-dojo';
//         if (link.name === 'Planning') tileId = 'planning';
//         if (link.name === 'Create Course') tileId = 'courses';
//         return { ...link, tileId };
//       });
//     } else {
//       const categoryTiles = tiles.filter(tile => tile.tabCategories.includes(activeTab));
//       rawLinks = categoryTiles.flatMap(tile =>
//         tile.links.map(link => ({ ...link, tileId: tile.id, parentTitle: tile.title }))
//       );
//     }

//     const rolePerms = (linkPermissions as any)[userRole];
//     if (!rolePerms) return [];

//     let filtered = rawLinks.filter(link => {
//       if (link.tileId && rolePerms[link.tileId]) {
//         return rolePerms[link.tileId].includes(link.name);
//       }
//       return false;
//     });

//     if (!searchQuery.trim()) return filtered;
//     return filtered.filter(link => 
//       link.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const links = getLinks();

//   return (
//     <AnimatePresence initial={false}>
//       {isOpen && (
//         <motion.div
//           initial={{ width: 0, opacity: 0 }}
//           animate={{ width: 280, opacity: 1 }}
//           exit={{ width: 0, opacity: 0 }}
//           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//           className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shrink-0 z-20 pt-16 shadow-2xl dark:shadow-teal-900/10"
//         >
//           <div className="w-[280px] h-full flex flex-col">
//             {/* HEADER - Updated with Teal accent */}
//             <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-500/20">
//                   {currentTab?.icon && <currentTab.icon size={18} />}
//                 </div>
//                 <h2 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
//                   {currentTab?.label}
//                 </h2>
//               </div>
//               <button 
//                 onClick={onClose} 
//                 className="p-2 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-400 hover:text-teal-600 rounded-lg transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* SEARCH AREA */}
//             <div className="px-4 py-4">
//               <div className="relative group">
//                 <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
//                 <input
//                   type="text"
//                   placeholder={`Search ${currentTab?.label}...`}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all dark:text-white"
//                 />
//               </div>
//             </div>

//             {/* LINKS LIST - Vibrant Teal Hovers */}
//             <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
//               {links.map((link, i) => (
//                 <button
//                   key={i}
//                   onClick={() => navigate(link.path)}
//                   className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300 transition-all group"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-teal-500 group-hover:shadow-md transition-all">
//                       {link.icon && (
//                         <link.icon 
//                           size={16} 
//                           className="text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-white" 
//                         />
//                       )}
//                     </div>
//                     <span>{link.name}</span>
//                   </div>
//                   <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-teal-500" />
//                 </button>
//               ))}
//             </div>
            
//             {/* FOOTER STATS (Optional extra "pop") */}
//             <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
//                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
//                   {links.length} Active Modules
//                </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };
