

import { LayoutGrid } from 'lucide-react';
import { type TabId, tabs } from '../../constants/tileData';

export const NavigationRailNew = ({ activeTab, onTabSelect }: { activeTab: TabId, onTabSelect: (id: TabId) => void }) => (
    <div 
        className="w-16 flex flex-col items-center py-4 z-20 shrink-0 border-r transition-colors duration-300" 
        style={{ 
            height: 'calc(100vh - 56px)', // Standardized to viewport height minus header
            backgroundColor: 'rgb(var(--bg-surface))',
            borderColor: 'rgb(var(--border-main))'
        }}
    >
        {/* Logo / Top Icon */}
        <div 
            className="w-10 h-10 mb-8 rounded-xl flex items-center justify-center shadow-lg transition-colors"
            style={{
                backgroundColor: 'rgb(var(--bg-background))', // Darker contrast against the rail
                color: 'rgb(var(--brand-primary))'
            }}
        >
            <LayoutGrid size={20} />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-4">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabSelect(tab.id)}
                        className={`p-3 rounded-xl transition-all duration-300 group relative ${
                            isActive ? 'shadow-lg' : ''
                        }`}
                        style={{
                            // Active: Brand Color; Inactive: Transparent
                            backgroundColor: isActive ? 'rgb(var(--brand-primary))' : 'transparent',
                            // Active: White Text; Inactive: Muted Text
                            color: isActive ? '#ffffff' : 'rgb(var(--text-muted))',
                            // Active: Colored Shadow
                            boxShadow: isActive ? '0 10px 15px -3px rgba(var(--brand-primary), 0.3)' : 'none'
                        }}
                    >
                        {/* Icon with hover transition */}
                        <div 
                            className="relative z-10 transition-colors duration-300"
                            style={{
                                color: !isActive ? 'inherit' : '#ffffff' 
                            }}
                        >
                            <tab.icon 
                                size={22} 
                                className={!isActive ? 'group-hover:text-[rgb(var(--brand-primary))] transition-colors' : ''}
                            />
                        </div>

                        {/* Hover Background Effect for Inactive State */}
                        {!isActive && (
                            <div 
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ backgroundColor: 'rgba(var(--brand-primary), 0.1)' }}
                            />
                        )}
                    </button>
                );
            })}
        </nav>
    </div>
);




// import { LayoutGrid } from 'lucide-react';
// import { type TabId, tabs } from '../../constants/tileData';

// export const NavigationRail = ({ activeTab, onTabSelect }: { activeTab: TabId, onTabSelect: (id: TabId) => void }) => (
//     <div 
//         className="w-16 flex flex-col items-center py-4 z-20 shrink-0 border-r transition-colors duration-300" 
//         style={{ 
//             height: 'calc(100vh - 56px)', 
//             backgroundColor: 'rgb(var(--bg-surface))',
//             borderColor: 'rgb(var(--border-main))'
//         }}
//     >
//         {/* Logo / Top Icon - Updated to Teal Gradient */}
//         <div 
//             className="w-10 h-10 mb-8 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-teal-400 to-teal-600 shadow-teal-500/20"
//         >
//             <LayoutGrid size={20} className="text-white" />
//         </div>

//         {/* Navigation Items */}
//         <nav className="flex flex-col gap-4">
//             {tabs.map((tab) => {
//                 const isActive = activeTab === tab.id;
                
//                 return (
//                     <button
//                         key={tab.id}
//                         onClick={() => onTabSelect(tab.id)}
//                         className={`p-3 rounded-xl transition-all duration-300 group relative ${
//                             isActive ? 'shadow-lg shadow-teal-500/40' : 'hover:scale-110'
//                         }`}
//                         style={{
//                             // Active: Solid Teal; Inactive: Transparent
//                             backgroundColor: isActive ? '#0d9488' : 'transparent', // teal-600
//                             // Active: White; Inactive: Muted (handled by tailwind/CSS vars)
//                             color: isActive ? '#ffffff' : 'rgb(var(--text-muted))',
//                         }}
//                     >
//                         {/* Icon */}
//                         <div 
//                             className="relative z-10 transition-colors duration-300"
//                             style={{
//                                 color: isActive ? '#ffffff' : 'inherit' 
//                             }}
//                         >
//                             <tab.icon 
//                                 size={22} 
//                                 className={!isActive ? 'group-hover:text-teal-500 transition-colors' : ''}
//                             />
//                         </div>

//                         {/* Hover Background Effect (Inactive State) - Teal Tint */}
//                         {!isActive && (
//                             <div 
//                                 className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-teal-500/10 dark:bg-teal-400/10"
//                             />
//                         )}

//                         {/* Active Indicator Glow (Optional) */}
//                         {isActive && (
//                             <div className="absolute inset-0 rounded-xl bg-teal-400 blur-sm opacity-20 animate-pulse" />
//                         )}
//                     </button>
//                 );
//             })}
//         </nav>
//     </div>
// );