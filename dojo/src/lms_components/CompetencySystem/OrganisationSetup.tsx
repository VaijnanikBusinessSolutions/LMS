// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Building2, Briefcase, Plus, Trash2, MapPin, X, Save, 
//   Building, Layers, LayoutGrid, Info, Loader2, ArrowRight, AlertCircle, Users, Globe,
//   ChevronDown, ChevronRight, Sparkles, Zap, Target, Crown, Network, GitBranch,
//   FolderTree, Triangle, Eye, EyeOff, Expand, Minimize2
// } from 'lucide-react';

// // ==========================================
// // 1. CONFIG & API
// // ==========================================

// const API_BASE = 'http://127.0.0.1:8000/lms';

// const getAuthHeaders = (): Record<string, string> => {
//   try {
//     const authData = localStorage.getItem("auth");
//     const token = authData ? JSON.parse(authData).accessToken : "";
//     if (token) return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
//     return { 'Content-Type': 'application/json' };
//   } catch (e) {
//     return { 'Content-Type': 'application/json' };
//   }
// };

// type OrgLevel = 'hq' | 'bu' | 'dept' | 'section' | 'designation';

// interface OrgItem {
//   id: string;
//   name: string;
//   location?: string;
//   org_type: OrgLevel;
//   parent?: number | string | null;
//   parent_name?: string;
// }

// interface SectionConfig {
//   key: OrgLevel;
//   title: string;
//   subtitle: string;
//   icon: React.ElementType;
//   color: string;
//   bgColor: string;
//   borderColor: string;
//   gradient: string;
//   level: number;
// }

// const HIERARCHY_CONFIG: SectionConfig[] = [
//   { key: 'hq', title: 'Headquarters', subtitle: 'Top Level Entity', icon: Crown, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', gradient: 'from-amber-500 to-orange-500', level: 1 },
//   { key: 'bu', title: 'Business Units', subtitle: 'Strategic Units', icon: Briefcase, color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', gradient: 'from-indigo-500 to-violet-500', level: 2 },
//   { key: 'dept', title: 'Departments', subtitle: 'Functional Areas', icon: Building2, color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', gradient: 'from-cyan-500 to-teal-500', level: 3 },
//   { key: 'section', title: 'Sections', subtitle: 'Sub-departments', icon: LayoutGrid, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', gradient: 'from-emerald-500 to-green-500', level: 4 },
//   { key: 'designation', title: 'Designations', subtitle: 'Global Roles', icon: Users, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', gradient: 'from-rose-500 to-pink-500', level: 5 }
// ];

// const getLevelConfig = (key: OrgLevel): SectionConfig => HIERARCHY_CONFIG.find(c => c.key === key)!;

// // ==========================================
// // 2. COMPACT NODE WITH TOOLTIP (FOR PYRAMID VIEW)
// // ==========================================

// interface CompactNodeProps {
//   item: OrgItem;
//   config: SectionConfig;
//   onDelete: (level: OrgLevel, id: string) => void;
// }

// const CompactNode: React.FC<CompactNodeProps> = ({ item, config, onDelete }) => {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const firstLetter = item.name.charAt(0).toUpperCase();

//   return (
//     <div 
//       className="relative group"
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       {/* Compact Circle Node */}
//       <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-black text-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 border-4 border-white`}>
//         {firstLetter}
//       </div>

//       {/* Tooltip on Hover */}
//       {showTooltip && (
//         <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 animate-in fade-in zoom-in-95 duration-200">
//           <div className={`bg-white rounded-2xl shadow-2xl border-2 ${config.borderColor} p-4 min-w-[220px] max-w-[300px]`}>
//             {/* Arrow */}
//             <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 ${config.borderColor} rotate-45`}></div>
            
//             {/* Header */}
//             <div className="flex items-center gap-3 mb-3">
//               <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
//                 <config.icon size={16} />
//               </div>
//               <span className={`text-xs font-black ${config.color} ${config.bgColor} px-2 py-1 rounded-full border ${config.borderColor}`}>
//                 {config.title.slice(0, -1)}
//               </span>
//             </div>
            
//             {/* Name */}
//             <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
            
//             {/* Location */}
//             {item.location && (
//               <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
//                 <MapPin size={12} /> {item.location}
//               </div>
//             )}
            
//             {/* Parent */}
//             {item.parent_name && (
//               <div className={`flex items-center gap-1.5 text-xs ${config.color} mt-2 ${config.bgColor} px-2 py-1 rounded-lg`}>
//                 <ArrowRight size={12} /> Under: {item.parent_name}
//               </div>
//             )}
            
//             {/* Delete Button */}
//             <button 
//               onClick={(e) => { e.stopPropagation(); onDelete(config.key, item.id); }}
//               className="mt-4 w-full py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-200"
//             >
//               <Trash2 size={14} /> Delete Item
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 3. PYRAMID VISUALIZATION (CONNECTED)
// // ==========================================

// interface PyramidViewProps {
//   data: Record<OrgLevel, OrgItem[]>;
//   onDelete: (level: OrgLevel, id: string) => void;
// }

// const PyramidView: React.FC<PyramidViewProps> = ({ data, onDelete }) => {
  
//   // Get children of a specific parent
//   const getChildren = (parentId: string, childLevel: OrgLevel): OrgItem[] => {
//     return data[childLevel].filter(item => String(item.parent) === String(parentId));
//   };

//   // Render section nodes
//   const renderSectionNodes = (sections: OrgItem[]) => {
//     if (sections.length === 0) return null;
//     const config = getLevelConfig('section');
    
//     return (
//       <div className="flex flex-wrap justify-center gap-3">
//         {sections.map(section => (
//           <CompactNode key={section.id} item={section} config={config} onDelete={onDelete} />
//         ))}
//       </div>
//     );
//   };

//   // Render department with its sections
//   const renderDepartmentWithSections = (dept: OrgItem) => {
//     const sections = getChildren(dept.id, 'section');
//     const config = getLevelConfig('dept');
    
//     return (
//       <div key={dept.id} className="flex flex-col items-center">
//         <CompactNode item={dept} config={config} onDelete={onDelete} />
        
//         {sections.length > 0 && (
//           <>
//             {/* Vertical Line */}
//             <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-emerald-400"></div>
//             {/* Arrow */}
//             <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-emerald-400 -mt-0.5"></div>
//             {/* Sections */}
//             <div className="mt-2">
//               {renderSectionNodes(sections)}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   // Render BU with its departments
//   const renderBUWithDepts = (bu: OrgItem) => {
//     const depts = getChildren(bu.id, 'dept');
//     const config = getLevelConfig('bu');
    
//     return (
//       <div key={bu.id} className="flex flex-col items-center">
//         <CompactNode item={bu} config={config} onDelete={onDelete} />
        
//         {depts.length > 0 && (
//           <>
//             {/* Vertical Line */}
//             <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
//             {/* Arrow */}
//             <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-cyan-400 -mt-0.5"></div>
            
//             {/* Horizontal connector for multiple depts */}
//             {depts.length > 1 && (
//               <div className="relative w-full flex justify-center mt-2">
//                 <div 
//                   className="absolute top-0 h-0.5 bg-cyan-300"
//                   style={{ width: `${Math.min(depts.length * 70, 300)}px` }}
//                 ></div>
//               </div>
//             )}
            
//             {/* Departments */}
//             <div className="flex flex-wrap justify-center gap-6 mt-4">
//               {depts.map(dept => (
//                 <div key={dept.id} className="relative">
//                   {/* Vertical line from horizontal connector */}
//                   {depts.length > 1 && (
//                     <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-0.5 h-4 bg-cyan-300"></div>
//                   )}
//                   {renderDepartmentWithSections(dept)}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   // Render HQ with its BUs
//   const renderHQWithBUs = (hq: OrgItem) => {
//     const bus = getChildren(hq.id, 'bu');
//     const config = getLevelConfig('hq');
    
//     return (
//       <div key={hq.id} className="flex flex-col items-center">
//         <CompactNode item={hq} config={config} onDelete={onDelete} />
        
//         {bus.length > 0 && (
//           <>
//             {/* Vertical Line */}
//             <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-indigo-400"></div>
//             {/* Arrow */}
//             <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-indigo-400 -mt-0.5"></div>
            
//             {/* Horizontal connector for multiple BUs */}
//             {bus.length > 1 && (
//               <div className="relative w-full flex justify-center mt-3">
//                 <div 
//                   className="absolute top-0 h-0.5 bg-indigo-300"
//                   style={{ width: `${Math.min(bus.length * 120, 500)}px` }}
//                 ></div>
//               </div>
//             )}
            
//             {/* Business Units */}
//             <div className="flex flex-wrap justify-center gap-10 mt-6">
//               {bus.map(bu => (
//                 <div key={bu.id} className="relative">
//                   {/* Vertical line from horizontal connector */}
//                   {bus.length > 1 && (
//                     <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-0.5 h-6 bg-indigo-300"></div>
//                   )}
//                   {renderBUWithDepts(bu)}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const hasAnyData = data.hq.length > 0;

//   if (!hasAnyData) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16 text-center">
//         <div className="relative mb-6">
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full blur-2xl opacity-50"></div>
//           <div className="relative p-6 bg-gradient-to-br from-slate-100 to-indigo-100 rounded-full">
//             <Network size={48} className="text-slate-400" />
//           </div>
//         </div>
//         <h3 className="text-xl font-black text-slate-700">No Hierarchy Yet</h3>
//         <p className="text-slate-500 mt-2 max-w-sm">
//           Add a <span className="font-bold text-amber-600">Headquarters</span> to start building
//         </p>
//         <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
//           <Crown className="text-amber-500" size={16} />
//           <ArrowRight size={12} />
//           <Briefcase className="text-indigo-500" size={16} />
//           <ArrowRight size={12} />
//           <Building2 className="text-cyan-500" size={16} />
//           <ArrowRight size={12} />
//           <LayoutGrid className="text-emerald-500" size={16} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-8 px-4 overflow-x-auto">
//       {/* Legend */}
//       <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
//         {HIERARCHY_CONFIG.filter(c => c.key !== 'designation').map(config => (
//           <div key={config.key} className="flex items-center gap-2">
//             <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold`}>
//               {config.title.charAt(0)}
//             </div>
//             <span className={`font-bold ${config.color}`}>{config.title}</span>
//           </div>
//         ))}
//       </div>
      
//       {/* Instruction */}
//       <p className="text-center text-sm text-slate-500 mb-8 font-medium">
//         💡 Hover over nodes to see full details
//       </p>
      
//       <div className="min-w-max flex flex-col items-center">
//         {/* HQ Level */}
//         <div className="flex flex-wrap justify-center gap-16">
//           {data.hq.map(hq => renderHQWithBUs(hq))}
//         </div>
//       </div>
      
//       {/* Designations (Global) */}
//       {data.designation.length > 0 && (
//         <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-200">
//           <div className="flex items-center justify-center gap-2 mb-6">
//             <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-200 max-w-[100px]"></div>
//             <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black rounded-full flex items-center gap-2">
//               <Globe size={14} /> GLOBAL DESIGNATIONS
//             </span>
//             <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-200 max-w-[100px]"></div>
//           </div>
          
//           <div className="flex flex-wrap justify-center gap-3">
//             {data.designation.map(item => (
//               <CompactNode key={item.id} item={item} config={getLevelConfig('designation')} onDelete={onDelete} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 4. TREE NODE COMPONENT
// // ==========================================

// interface TreeNodeProps {
//   item: OrgItem;
//   level: OrgLevel;
//   children: React.ReactNode;
//   onDelete: (level: OrgLevel, id: string) => void;
//   isExpanded: boolean;
//   onToggle: () => void;
//   hasChildren: boolean;
//   config: SectionConfig;
// }

// const TreeNode: React.FC<TreeNodeProps> = ({ 
//   item, level, children, onDelete, isExpanded, onToggle, hasChildren, config 
// }) => {
//   return (
//     <div className="relative">
//       {/* Node Card */}
//       <div className={`relative group bg-white rounded-2xl border-2 ${config.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
//         {/* Gradient Top Bar */}
//         <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`}></div>
        
//         <div className="p-4 flex items-center gap-4">
//           {/* Expand Toggle */}
//           {hasChildren && (
//             <button 
//               onClick={onToggle}
//               className={`p-2 rounded-xl ${config.bgColor} ${config.color} hover:scale-110 transition-transform`}
//             >
//               {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
//             </button>
//           )}
          
//           {/* Icon */}
//           <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
//             <config.icon size={20} />
//           </div>
          
//           {/* Content */}
//           <div className="flex-1 min-w-0">
//             <h4 className="font-bold text-slate-800 text-base truncate">{item.name}</h4>
//             <div className="flex items-center gap-2 mt-1">
//               {level === 'designation' ? (
//                 <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
//                   <Globe size={10} /> Global
//                 </span>
//               ) : item.parent_name && (
//                 <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${config.color} ${config.bgColor} px-2 py-0.5 rounded-full border ${config.borderColor}`}>
//                   <ArrowRight size={10} /> {item.parent_name}
//                 </span>
//               )}
//               {item.location && (
//                 <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
//                   <MapPin size={10} /> {item.location}
//                 </span>
//               )}
//             </div>
//           </div>
          
//           {/* Delete Button */}
//           <button 
//             onClick={() => onDelete(level, item.id)}
//             className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
      
//       {/* Children Container */}
//       {hasChildren && isExpanded && (
//         <div className="ml-8 mt-4 relative">
//           {/* Connecting Line */}
//           <div className="absolute left-0 top-0 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 to-transparent"></div>
          
//           <div className="space-y-4 pl-8">
//             {children}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 5. HIERARCHICAL TREE VIEW
// // ==========================================

// interface HierarchicalTreeProps {
//   data: Record<OrgLevel, OrgItem[]>;
//   onDelete: (level: OrgLevel, id: string) => void;
// }

// const HierarchicalTree: React.FC<HierarchicalTreeProps> = ({ data, onDelete }) => {
//   const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
//   const toggleNode = (id: string) => {
//     setExpandedNodes(prev => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const expandAll = () => {
//     const allIds = [
//       ...data.hq.map(i => i.id),
//       ...data.bu.map(i => i.id),
//       ...data.dept.map(i => i.id),
//     ];
//     setExpandedNodes(new Set(allIds));
//   };

//   const collapseAll = () => setExpandedNodes(new Set());

//   // Build tree structure
//   const getChildren = (parentId: string, level: OrgLevel): OrgItem[] => {
//     const childLevel = level === 'hq' ? 'bu' : level === 'bu' ? 'dept' : level === 'dept' ? 'section' : null;
//     if (!childLevel) return [];
//     return data[childLevel].filter(item => String(item.parent) === String(parentId));
//   };

//   const renderTree = (items: OrgItem[], level: OrgLevel) => {
//     const config = HIERARCHY_CONFIG.find(c => c.key === level)!;
    
//     return items.map((item, idx) => {
//       const children = getChildren(item.id, level);
//       const hasChildren = children.length > 0;
//       const isExpanded = expandedNodes.has(item.id);
//       const childLevel = level === 'hq' ? 'bu' : level === 'bu' ? 'dept' : level === 'dept' ? 'section' : null;
//       const childConfig = childLevel ? HIERARCHY_CONFIG.find(c => c.key === childLevel) : null;
      
//       return (
//         <div 
//           key={item.id} 
//           className="animate-in slide-in-from-left duration-500"
//           style={{ animationDelay: `${idx * 50}ms` }}
//         >
//           <TreeNode
//             item={item}
//             level={level}
//             config={config}
//             onDelete={onDelete}
//             isExpanded={isExpanded}
//             onToggle={() => toggleNode(item.id)}
//             hasChildren={hasChildren}
//           >
//             {childLevel && childConfig && renderTree(children, childLevel)}
//           </TreeNode>
//         </div>
//       );
//     });
//   };

//   const hasAnyData = Object.values(data).some(arr => arr.length > 0);

//   if (!hasAnyData) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className="p-6 bg-gradient-to-br from-slate-100 to-indigo-100 rounded-full mb-6">
//           <FolderTree size={48} className="text-slate-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-slate-700">No Organization Structure</h3>
//         <p className="text-slate-500 mt-2 max-w-md">
//           Start by adding a Headquarters, then build your organization hierarchy
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Controls */}
//       <div className="flex justify-end gap-3">
//         <button 
//           onClick={expandAll}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
//         >
//           <Expand size={16} /> Expand All
//         </button>
//         <button 
//           onClick={collapseAll}
//           className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
//         >
//           <Minimize2 size={16} /> Collapse All
//         </button>
//       </div>
      
//       {/* Tree */}
//       <div className="space-y-4">
//         {renderTree(data.hq, 'hq')}
//       </div>
      
//       {/* Designations Section (Separate) */}
//       {data.designation.length > 0 && (
//         <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl text-white shadow-lg">
//               <Users size={24} />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-slate-800">Global Designations</h3>
//               <p className="text-sm text-slate-500">Roles that apply across all hierarchy levels</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {data.designation.map((item, idx) => (
//               <div 
//                 key={item.id}
//                 className="group bg-white rounded-2xl border-2 border-rose-200 p-4 hover:shadow-lg transition-all animate-in slide-in-from-bottom duration-500"
//                 style={{ animationDelay: `${idx * 50}ms` }}
//               >
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h4 className="font-bold text-slate-800">{item.name}</h4>
//                     <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-2">
//                       <Globe size={10} /> Global Role
//                     </span>
//                   </div>
//                   <button 
//                     onClick={() => onDelete('designation', item.id)}
//                     className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================
// // 6. ADD ITEM CARDS
// // ==========================================

// interface AddItemCardsProps {
//   onAdd: (level: OrgLevel) => void;
//   data: Record<OrgLevel, OrgItem[]>;
// }

// const AddItemCards: React.FC<AddItemCardsProps> = ({ onAdd, data }) => {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//       {HIERARCHY_CONFIG.map((config, idx) => {
//         const count = data[config.key].length;
//         const canAdd = config.key === 'hq' || config.key === 'designation' || 
//           (config.key === 'bu' && data.hq.length > 0) ||
//           (config.key === 'dept' && data.bu.length > 0) ||
//           (config.key === 'section' && data.dept.length > 0);
        
//         return (
//           <button
//             key={config.key}
//             onClick={() => canAdd && onAdd(config.key)}
//             disabled={!canAdd}
//             className={`group relative p-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
//               canAdd 
//                 ? `${config.borderColor} hover:border-solid hover:shadow-xl hover:-translate-y-1 ${config.bgColor}` 
//                 : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
//             }`}
//           >
//             {/* Level Badge */}
//             <div className="absolute -top-3 -right-3">
//               <span className={`px-2 py-1 bg-gradient-to-r ${config.gradient} text-white text-[10px] font-black rounded-lg shadow-lg`}>
//                 L{config.level}
//               </span>
//             </div>
            
//             {/* Icon */}
//             <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
//               <config.icon size={24} />
//             </div>
            
//             {/* Content */}
//             <h4 className={`font-bold text-center ${config.color}`}>{config.title}</h4>
//             <p className="text-xs text-slate-500 text-center mt-1">{config.subtitle}</p>
            
//             {/* Count & Add */}
//             <div className="flex items-center justify-center gap-2 mt-4">
//               <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-slate-600 shadow-sm">
//                 {count} added
//               </span>
//               {canAdd && (
//                 <span className={`p-1.5 rounded-full ${config.bgColor} ${config.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
//                   <Plus size={14} />
//                 </span>
//               )}
//             </div>
            
//             {/* Disabled Message */}
//             {!canAdd && (
//               <p className="text-[10px] text-rose-500 text-center mt-2 font-medium">
//                 Add {HIERARCHY_CONFIG[idx - 1]?.title.toLowerCase()} first
//               </p>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// // ==========================================
// // 7. MAIN COMPONENT
// // ==========================================

// export default function OrganizationSetup() {
  
//   const [data, setData] = useState<Record<OrgLevel, OrgItem[]>>({
//     hq: [], bu: [], dept: [], section: [], designation: []
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeLevel, setActiveLevel] = useState<OrgLevel | null>(null);
//   const [viewMode, setViewMode] = useState<'pyramid' | 'tree'>('pyramid');
  
//   const [itemName, setItemName] = useState('');
//   const [itemMeta, setItemMeta] = useState('');
//   const [parentId, setParentId] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   const getParentType = (lvl: OrgLevel): OrgLevel | null => {
//       if (lvl === 'bu') return 'hq';
//       if (lvl === 'dept') return 'bu';
//       if (lvl === 'section') return 'dept';
//       return null;
//   };

//   // --- API: Fetch ---
//   const fetchStructure = async () => {
//     setLoading(true);
//     try {
//         const res = await fetch(`${API_BASE}/organization/structure/`, { headers: getAuthHeaders() });
//         if (res.ok) {
//             const json = await res.json();
//             setData({
//                 hq: Array.isArray(json.hq) ? json.hq : [],
//                 bu: Array.isArray(json.bu) ? json.bu : [],
//                 dept: Array.isArray(json.dept) ? json.dept : [],
//                 section: Array.isArray(json.section) ? json.section : [],
//                 designation: Array.isArray(json.designation) ? json.designation : [] 
//             });
//         } else {
//             console.error("Fetch failed:", res.statusText);
//         }
//     } catch (error) { 
//         console.error("Fetch Error", error); 
//     } 
//     finally { 
//         setLoading(false); 
//     }
//   };

//   useEffect(() => { fetchStructure(); }, []);

//   // --- API: Save ---
//   const handleSave = async () => {
//     if (!activeLevel || !itemName.trim()) return;
    
//     const isParentRequired = activeLevel !== 'hq' && activeLevel !== 'designation';
//     if (isParentRequired && !parentId) {
//         alert(`Please select a parent.`);
//         return;
//     }

//     setIsSaving(true);
//     try {
//         const payload = {
//             name: itemName,
//             org_type: activeLevel,
//             location: itemMeta,
//             parent: (parentId && activeLevel !== 'designation') ? parseInt(parentId) : null
//         };

//         const res = await fetch(`${API_BASE}/organization/`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             const savedItem = await res.json();
//             setData(prev => ({
//                 ...prev,
//                 [activeLevel]: [...prev[activeLevel], savedItem]
//             }));
//             setIsModalOpen(false);
//             setItemName('');
//             setItemMeta('');
//             setParentId('');
//         } else {
//             const err = await res.json();
//             alert(`Failed to save: ${JSON.stringify(err)}`);
//         }
//     } catch (error) { 
//         console.error("Save Error", error);
//         alert("Network error occurred.");
//     } 
//     finally { setIsSaving(false); }
//   };

//   // --- API: Delete ---
//   const handleDelete = async (level: OrgLevel, id: string) => {
//     if(!window.confirm("Delete this item? This will also remove all child items.")) return;
    
//     const previousData = { ...data };
//     setData(prev => ({ ...prev, [level]: prev[level].filter(i => String(i.id) !== String(id)) }));

//     try {
//         const res = await fetch(`${API_BASE}/organization/${id}/`, { method: 'DELETE', headers: getAuthHeaders() });
//         if (!res.ok) {
//             setData(previousData);
//             alert("Failed to delete item.");
//         }
//     } catch (error) { 
//         setData(previousData);
//         console.error("Delete Error", error); 
//     }
//   };

//   const openAddModal = (level: OrgLevel) => {
//     setActiveLevel(level);
//     setItemName('');
//     setItemMeta('');
//     setParentId('');
//     setIsModalOpen(true);
//   };

//   const getLevelDetails = (key: string) => HIERARCHY_CONFIG.find(c => c.key === key);

//   const totalItems = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

//   // Loading State
//   if (loading && totalItems === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative mb-6">
//             <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//             <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
//               <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
//             </div>
//           </div>
//           <h3 className="text-2xl font-black text-slate-800">Loading Organization</h3>
//           <p className="text-slate-500 mt-2 font-medium">Fetching hierarchy structure...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 font-sans text-slate-900">
      
//       {/* Custom Styles */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float { animation: float 3s ease-in-out infinite; }
//       `}</style>

//       {/* Background Decorations */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full blur-3xl opacity-40 animate-float"></div>
//         <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
//       </div>

//       <div className="w-full p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
        
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//           <div className="flex items-start gap-5">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
//               <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30">
//                 <Network size={36} className="text-white" />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 tracking-tight">
//                 Organization Hierarchy
//               </h1>
//               <p className="text-slate-500 mt-2 text-lg font-medium">
//                 Build your organizational structure from top to bottom
//               </p>
//               <div className="flex gap-2 mt-3">
//                 <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold flex items-center gap-1">
//                   <Layers size={12}/>5 Levels
//                 </span>
//                 <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1">
//                   <Zap size={12}/>{totalItems} Items
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* View Toggle */}
//           <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border-2 border-slate-200 shadow-lg">
//             <button
//               onClick={() => setViewMode('pyramid')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
//                 viewMode === 'pyramid' 
//                   ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg' 
//                   : 'text-slate-600 hover:bg-slate-100'
//               }`}
//             >
//               <Triangle size={18} /> Pyramid View
//             </button>
//             <button
//               onClick={() => setViewMode('tree')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
//                 viewMode === 'tree' 
//                   ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg' 
//                   : 'text-slate-600 hover:bg-slate-100'
//               }`}
//             >
//               <GitBranch size={18} /> Tree View
//             </button>
//           </div>
//         </div>

//         {/* ADD ITEM CARDS */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border-2 border-white p-8">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
//               <Plus className="text-emerald-600" size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-black text-slate-800">Quick Add</h2>
//               <p className="text-slate-500 font-medium">Click on any level to add new items</p>
//             </div>
//           </div>
          
//           <AddItemCards onAdd={openAddModal} data={data} />
//         </div>

//         {/* HIERARCHY VISUALIZATION */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 border-2 border-white overflow-hidden">
//           <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-indigo-50/50 flex items-center gap-4">
//             <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl">
//               {viewMode === 'pyramid' ? <Triangle className="text-indigo-600" size={24} /> : <GitBranch className="text-indigo-600" size={24} />}
//             </div>
//             <div>
//               <h2 className="text-xl font-black text-slate-800">
//                 {viewMode === 'pyramid' ? 'Pyramid Visualization' : 'Hierarchical Tree'}
//               </h2>
//               <p className="text-slate-500 font-medium">
//                 {viewMode === 'pyramid' 
//                   ? 'Compact view - hover over nodes for details' 
//                   : 'Explore the complete hierarchy structure'
//                 }
//               </p>
//             </div>
//           </div>
          
//           <div className="p-8 custom-scrollbar overflow-auto">
//             {viewMode === 'pyramid' ? (
//               <PyramidView data={data} onDelete={handleDelete} />
//             ) : (
//               <HierarchicalTree data={data} onDelete={handleDelete} />
//             )}
//           </div>
//         </div>

//         {/* LEGEND / INFO SECTION */}
//         <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-6 border-2 border-indigo-100">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-indigo-100 rounded-xl">
//               <Info className="text-indigo-600" size={24} />
//             </div>
//             <div>
//               <h3 className="font-bold text-indigo-800 text-lg">Understanding the Hierarchy</h3>
//               <p className="text-indigo-700 mt-2 font-medium">
//                 <strong>HQ → Business Units → Departments → Sections</strong> form a parent-child relationship. 
//                 Each level can only be added after its parent level exists. 
//                 <strong> Designations</strong> are global and apply across all levels.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODAL ================= */}
//       {isModalOpen && activeLevel && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
//             <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                
//                 {/* Modal Header */}
//                 <div className={`px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r ${getLevelDetails(activeLevel)?.bgColor} to-white`}>
//                     <div className="flex items-center gap-4">
//                         <div className={`p-4 rounded-2xl bg-gradient-to-br ${getLevelDetails(activeLevel)?.gradient} text-white shadow-xl`}>
//                             {React.createElement(getLevelDetails(activeLevel)?.icon || Building, { size: 24 })}
//                         </div>
//                         <div>
//                             <h3 className="text-2xl font-black text-slate-800">Add {getLevelDetails(activeLevel)?.title.slice(0, -1)}</h3>
//                             <p className="text-slate-500 font-medium">
//                                 {activeLevel === 'designation' ? 'Create a global designation' : `Add to Level ${getLevelDetails(activeLevel)?.level}`}
//                             </p>
//                         </div>
//                     </div>
//                     <button 
//                       onClick={() => setIsModalOpen(false)} 
//                       className="p-3 hover:bg-white/50 rounded-xl text-slate-500 transition-colors"
//                     >
//                       <X size={24} />
//                     </button>
//                 </div>

//                 <div className="p-8 space-y-6">
                    
//                     {/* PARENT DROPDOWN */}
//                     {activeLevel !== 'hq' && activeLevel !== 'designation' && (
//                         <div>
//                             <label className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
//                                 <ArrowRight size={14} className="text-indigo-500" />
//                                 Parent {activeLevel === 'bu' ? 'Headquarters' : activeLevel === 'dept' ? 'Business Unit' : 'Department'}
//                                 <span className="text-rose-500">*</span>
//                             </label>
//                             <div className="relative">
//                               <select 
//                                   value={parentId}
//                                   onChange={(e) => setParentId(e.target.value)}
//                                   className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none bg-gradient-to-r from-slate-50 to-indigo-50/30 font-bold text-slate-700 appearance-none cursor-pointer transition-all"
//                               >
//                                   <option value="">-- Select Parent --</option>
//                                   {(activeLevel === 'bu' ? data.hq : activeLevel === 'dept' ? data.bu : data.dept).map(p => (
//                                       <option key={p.id} value={p.id}>{p.name}</option>
//                                   ))}
//                               </select>
//                               <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                             </div>
//                         </div>
//                     )}

//                     {/* Name Input */}
//                     <div>
//                         <label className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
//                             <Sparkles size={14} className="text-indigo-500" />
//                             Name <span className="text-rose-500">*</span>
//                         </label>
//                         <input 
//                             type="text" 
//                             value={itemName}
//                             onChange={(e) => setItemName(e.target.value)}
//                             placeholder={activeLevel === 'designation' ? "e.g. Senior Engineer" : "e.g. Sales Division"} 
//                             className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-bold text-slate-700 placeholder:font-medium placeholder:text-slate-400"
//                         />
//                     </div>

//                     {/* Meta Input */}
//                     <div>
//                         <label className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-widest mb-3">
//                             <MapPin size={14} className="text-indigo-500" />
//                             {['hq', 'bu'].includes(activeLevel) ? 'Location / Region' : 'Description / Code'}
//                             <span className="text-slate-400 text-xs font-normal">(Optional)</span>
//                         </label>
//                         <input 
//                             type="text" 
//                             value={itemMeta}
//                             onChange={(e) => setItemMeta(e.target.value)}
//                             placeholder="Enter additional info..." 
//                             className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
//                         />
//                     </div>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
//                     <button 
//                       onClick={() => setIsModalOpen(false)} 
//                       className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-lg transition-all"
//                     >
//                       Cancel
//                     </button>
//                     <button 
//                         onClick={handleSave}
//                         disabled={!itemName.trim() || isSaving || (activeLevel !== 'hq' && activeLevel !== 'designation' && !parentId)}
//                         className={`px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getLevelDetails(activeLevel)?.gradient} shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2`}
//                     >
//                         {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
//                         {isSaving ? 'Saving...' : 'Save Item'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//       )}
//     </div>
//   );
// }







import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Briefcase, Plus, Trash2, MapPin, X, Save, 
  Building, Layers, LayoutGrid, Info, Loader2, ArrowRight, AlertCircle, Users, Globe,
  ChevronDown, ChevronRight, Sparkles, Zap, Target, Crown, Network, GitBranch,
  FolderTree, Triangle, Eye, EyeOff, Expand, Minimize2
} from 'lucide-react';

// ==========================================
// 1. CONFIG & API
// ==========================================

const API_BASE = 'http://127.0.0.1:8000/lms';

const getAuthHeaders = (): Record<string, string> => {
  try {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    if (token) return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    return { 'Content-Type': 'application/json' };
  } catch (e) {
    return { 'Content-Type': 'application/json' };
  }
};

type OrgLevel = 'hq' | 'bu' | 'dept' | 'section' | 'designation';

interface OrgItem {
  id: string;
  name: string;
  location?: string;
  org_type: OrgLevel;
  parent?: number | string | null;
  parent_name?: string;
}

interface SectionConfig {
  key: OrgLevel;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  level: number;
}

const HIERARCHY_CONFIG: SectionConfig[] = [
  { key: 'hq', title: 'Headquarters', subtitle: 'Top Level Entity', icon: Crown, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20', borderColor: 'border-amber-200 dark:border-amber-800', gradient: 'from-amber-500 to-orange-500', level: 1 },
  { key: 'bu', title: 'Business Units', subtitle: 'Strategic Units', icon: Briefcase, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-800', gradient: 'from-indigo-500 to-violet-500', level: 2 },
  { key: 'dept', title: 'Departments', subtitle: 'Functional Areas', icon: Building2, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', borderColor: 'border-cyan-200 dark:border-cyan-800', gradient: 'from-cyan-500 to-teal-500', level: 3 },
  { key: 'section', title: 'Sections', subtitle: 'Sub-departments', icon: LayoutGrid, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', borderColor: 'border-emerald-200 dark:border-emerald-800', gradient: 'from-emerald-500 to-green-500', level: 4 },
  { key: 'designation', title: 'Designations', subtitle: 'Global Roles', icon: Users, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-900/20', borderColor: 'border-rose-200 dark:border-rose-800', gradient: 'from-rose-500 to-pink-500', level: 5 }
];

const getLevelConfig = (key: OrgLevel): SectionConfig => HIERARCHY_CONFIG.find(c => c.key === key)!;

// ==========================================
// 2. COMPACT NODE WITH TOOLTIP (FOR PYRAMID VIEW)
// ==========================================

interface CompactNodeProps {
  item: OrgItem;
  config: SectionConfig;
  onDelete: (level: OrgLevel, id: string) => void;
}

const CompactNode: React.FC<CompactNodeProps> = ({ item, config, onDelete }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const firstLetter = item.name.charAt(0).toUpperCase();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Compact Circle Node */}
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-black text-lg shadow-lg cursor-pointer hover:scale-110 transition-all duration-300 border-4 border-white dark:border-slate-800`}>
        {firstLetter}
      </div>

      {/* Tooltip on Hover */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 animate-in fade-in zoom-in-95 duration-200">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 ${config.borderColor} p-4 min-w-[220px] max-w-[300px]`}>
            {/* Arrow */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-r-2 border-b-2 ${config.borderColor} rotate-45`}></div>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                <config.icon size={16} />
              </div>
              <span className={`text-xs font-black ${config.color} ${config.bgColor} px-2 py-1 rounded-full border ${config.borderColor}`}>
                {config.title.slice(0, -1)}
              </span>
            </div>
            
            {/* Name */}
            <h4 className="font-bold text-slate-800 dark:text-white text-base">{item.name}</h4>
            
            {/* Location */}
            {item.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin size={12} /> {item.location}
              </div>
            )}
            
            {/* Parent */}
            {item.parent_name && (
              <div className={`flex items-center gap-1.5 text-xs ${config.color} mt-2 ${config.bgColor} px-2 py-1 rounded-lg`}>
                <ArrowRight size={12} /> Under: {item.parent_name}
              </div>
            )}
            
            {/* Delete Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(config.key, item.id); }}
              className="mt-4 w-full py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-colors flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-800"
            >
              <Trash2 size={14} /> Delete Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. PYRAMID VISUALIZATION (CONNECTED)
// ==========================================

interface PyramidViewProps {
  data: Record<OrgLevel, OrgItem[]>;
  onDelete: (level: OrgLevel, id: string) => void;
}

const PyramidView: React.FC<PyramidViewProps> = ({ data, onDelete }) => {
  
  // Get children of a specific parent
  const getChildren = (parentId: string, childLevel: OrgLevel): OrgItem[] => {
    return data[childLevel].filter(item => String(item.parent) === String(parentId));
  };

  // Render section nodes
  const renderSectionNodes = (sections: OrgItem[]) => {
    if (sections.length === 0) return null;
    const config = getLevelConfig('section');
    
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {sections.map(section => (
          <CompactNode key={section.id} item={section} config={config} onDelete={onDelete} />
        ))}
      </div>
    );
  };

  // Render department with its sections
  const renderDepartmentWithSections = (dept: OrgItem) => {
    const sections = getChildren(dept.id, 'section');
    const config = getLevelConfig('dept');
    
    return (
      <div key={dept.id} className="flex flex-col items-center">
        <CompactNode item={dept} config={config} onDelete={onDelete} />
        
        {sections.length > 0 && (
          <>
            {/* Vertical Line */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-emerald-400"></div>
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-emerald-400 -mt-0.5"></div>
            {/* Sections */}
            <div className="mt-2">
              {renderSectionNodes(sections)}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render BU with its departments
  const renderBUWithDepts = (bu: OrgItem) => {
    const depts = getChildren(bu.id, 'dept');
    const config = getLevelConfig('bu');
    
    return (
      <div key={bu.id} className="flex flex-col items-center">
        <CompactNode item={bu} config={config} onDelete={onDelete} />
        
        {depts.length > 0 && (
          <>
            {/* Vertical Line */}
            <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-cyan-400 -mt-0.5"></div>
            
            {/* Horizontal connector for multiple depts */}
            {depts.length > 1 && (
              <div className="relative w-full flex justify-center mt-2">
                <div 
                  className="absolute top-0 h-0.5 bg-cyan-300"
                  style={{ width: `${Math.min(depts.length * 70, 300)}px` }}
                ></div>
              </div>
            )}
            
            {/* Departments */}
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {depts.map(dept => (
                <div key={dept.id} className="relative">
                  {/* Vertical line from horizontal connector */}
                  {depts.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-0.5 h-4 bg-cyan-300"></div>
                  )}
                  {renderDepartmentWithSections(dept)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Render HQ with its BUs
  const renderHQWithBUs = (hq: OrgItem) => {
    const bus = getChildren(hq.id, 'bu');
    const config = getLevelConfig('hq');
    
    return (
      <div key={hq.id} className="flex flex-col items-center">
        <CompactNode item={hq} config={config} onDelete={onDelete} />
        
        {bus.length > 0 && (
          <>
            {/* Vertical Line */}
            <div className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-indigo-400"></div>
            {/* Arrow */}
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-indigo-400 -mt-0.5"></div>
            
            {/* Horizontal connector for multiple BUs */}
            {bus.length > 1 && (
              <div className="relative w-full flex justify-center mt-3">
                <div 
                  className="absolute top-0 h-0.5 bg-indigo-300"
                  style={{ width: `${Math.min(bus.length * 120, 500)}px` }}
                ></div>
              </div>
            )}
            
            {/* Business Units */}
            <div className="flex flex-wrap justify-center gap-10 mt-6">
              {bus.map(bu => (
                <div key={bu.id} className="relative">
                  {/* Vertical line from horizontal connector */}
                  {bus.length > 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-0.5 h-6 bg-indigo-300"></div>
                  )}
                  {renderBUWithDepts(bu)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const hasAnyData = data.hq.length > 0;

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full blur-2xl opacity-50"></div>
          <div className="relative p-6 bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-900 rounded-full">
            <Network size={48} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">No Hierarchy Yet</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
          Add a <span className="font-bold text-amber-600 dark:text-amber-400">Headquarters</span> to start building
        </p>
        <div className="flex items-center gap-2 mt-4 text-slate-400 dark:text-slate-500 text-sm">
          <Crown className="text-amber-500" size={16} />
          <ArrowRight size={12} />
          <Briefcase className="text-indigo-500" size={16} />
          <ArrowRight size={12} />
          <Building2 className="text-cyan-500" size={16} />
          <ArrowRight size={12} />
          <LayoutGrid className="text-emerald-500" size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 overflow-x-auto">
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
        {HIERARCHY_CONFIG.filter(c => c.key !== 'designation').map(config => (
          <div key={config.key} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold`}>
              {config.title.charAt(0)}
            </div>
            <span className={`font-bold ${config.color}`}>{config.title}</span>
          </div>
        ))}
      </div>
      
      {/* Instruction */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
        💡 Hover over nodes to see full details

      </p>
      
      <div className="min-w-max flex flex-col items-center">
        {/* HQ Level */}
        <div className="flex flex-wrap justify-center gap-16">
          {data.hq.map(hq => renderHQWithBUs(hq))}
        </div>
      </div>
      
      {/* Designations (Global) */}
      {data.designation.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-200 dark:to-rose-800 max-w-[100px]"></div>
            <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black rounded-full flex items-center gap-2">
              <Globe size={14} /> GLOBAL DESIGNATIONS
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-200 dark:to-rose-800 max-w-[100px]"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {data.designation.map(item => (
              <CompactNode key={item.id} item={item} config={getLevelConfig('designation')} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. TREE NODE COMPONENT
// ==========================================

interface TreeNodeProps {
  item: OrgItem;
  level: OrgLevel;
  children: React.ReactNode;
  onDelete: (level: OrgLevel, id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  hasChildren: boolean;
  config: SectionConfig;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  item, level, children, onDelete, isExpanded, onToggle, hasChildren, config 
}) => {
  return (
    <div className="relative">
      {/* Node Card */}
      <div className={`relative group bg-white dark:bg-slate-900 rounded-2xl border-2 ${config.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
        {/* Gradient Top Bar */}
        <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`}></div>
        
        <div className="p-4 flex items-center gap-4">
          {/* Expand Toggle */}
          {hasChildren && (
            <button 
              onClick={onToggle}
              className={`p-2 rounded-xl ${config.bgColor} ${config.color} hover:scale-110 transition-transform`}
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          
          {/* Icon */}
          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
            <config.icon size={20} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 dark:text-white text-base truncate">{item.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              {level === 'designation' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Globe size={10} /> Global
                </span>
              ) : item.parent_name && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${config.color} ${config.bgColor} px-2 py-0.5 rounded-full border ${config.borderColor}`}>
                  <ArrowRight size={10} /> {item.parent_name}
                </span>
              )}
              {item.location && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  <MapPin size={10} /> {item.location}
                </span>
              )}
            </div>
          </div>
          
          {/* Delete Button */}
          <button 
            onClick={() => onDelete(level, item.id)}
            className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Children Container */}
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-4 relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-0 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 dark:from-slate-700 to-transparent"></div>
          
          <div className="space-y-4 pl-8">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. HIERARCHICAL TREE VIEW
// ==========================================

interface HierarchicalTreeProps {
  data: Record<OrgLevel, OrgItem[]>;
  onDelete: (level: OrgLevel, id: string) => void;
}

const HierarchicalTree: React.FC<HierarchicalTreeProps> = ({ data, onDelete }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const allIds = [
      ...data.hq.map(i => i.id),
      ...data.bu.map(i => i.id),
      ...data.dept.map(i => i.id),
    ];
    setExpandedNodes(new Set(allIds));
  };

  const collapseAll = () => setExpandedNodes(new Set());

  // Build tree structure
  const getChildren = (parentId: string, level: OrgLevel): OrgItem[] => {
    const childLevel = level === 'hq' ? 'bu' : level === 'bu' ? 'dept' : level === 'dept' ? 'section' : null;
    if (!childLevel) return [];
    return data[childLevel].filter(item => String(item.parent) === String(parentId));
  };

  const renderTree = (items: OrgItem[], level: OrgLevel) => {
    const config = HIERARCHY_CONFIG.find(c => c.key === level)!;
    
    return items.map((item, idx) => {
      const children = getChildren(item.id, level);
      const hasChildren = children.length > 0;
      const isExpanded = expandedNodes.has(item.id);
      const childLevel = level === 'hq' ? 'bu' : level === 'bu' ? 'dept' : level === 'dept' ? 'section' : null;
      const childConfig = childLevel ? HIERARCHY_CONFIG.find(c => c.key === childLevel) : null;
      
      return (
        <div 
          key={item.id} 
          className="animate-in slide-in-from-left duration-500"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <TreeNode
            item={item}
            level={level}
            config={config}
            onDelete={onDelete}
            isExpanded={isExpanded}
            onToggle={() => toggleNode(item.id)}
            hasChildren={hasChildren}
          >
            {childLevel && childConfig && renderTree(children, childLevel)}
          </TreeNode>
        </div>
      );
    });
  };

  const hasAnyData = Object.values(data).some(arr => arr.length > 0);

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-6 bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-900 rounded-full mb-6">
          <FolderTree size={48} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-white">No Organization Structure</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          Start by adding a Headquarters, then build your organization hierarchy
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={expandAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
        >
          <Expand size={16} /> Expand All
        </button>
        <button 
          onClick={collapseAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Minimize2 size={16} /> Collapse All
        </button>
      </div>
      
      {/* Tree */}
      <div className="space-y-4">
        {renderTree(data.hq, 'hq')}
      </div>
      
      {/* Designations Section (Separate) */}
      {data.designation.length > 0 && (
        <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl text-white shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Global Designations</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Roles that apply across all hierarchy levels</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.designation.map((item, idx) => (
              <div 
                key={item.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 p-4 hover:shadow-lg transition-all animate-in slide-in-from-bottom duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{item.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mt-2">
                      <Globe size={10} /> Global Role
                    </span>
                  </div>
                  <button 
                    onClick={() => onDelete('designation', item.id)}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. ADD ITEM CARDS
// ==========================================

interface AddItemCardsProps {
  onAdd: (level: OrgLevel) => void;
  data: Record<OrgLevel, OrgItem[]>;
}

const AddItemCards: React.FC<AddItemCardsProps> = ({ onAdd, data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {HIERARCHY_CONFIG.map((config, idx) => {
        const count = data[config.key].length;
        const canAdd = config.key === 'hq' || config.key === 'designation' || 
          (config.key === 'bu' && data.hq.length > 0) ||
          (config.key === 'dept' && data.bu.length > 0) ||
          (config.key === 'section' && data.dept.length > 0);
        
        return (
          <button
            key={config.key}
            onClick={() => canAdd && onAdd(config.key)}
            disabled={!canAdd}
            className={`group relative p-6 rounded-2xl border-2 border-dashed transition-all duration-300 ${
              canAdd 
                ? `${config.borderColor} hover:border-solid hover:shadow-xl hover:-translate-y-1 ${config.bgColor}` 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 opacity-50 cursor-not-allowed'
            }`}
          >
            {/* Level Badge */}
            <div className="absolute -top-3 -right-3">
              <span className={`px-2 py-1 bg-gradient-to-r ${config.gradient} text-white text-[10px] font-black rounded-lg shadow-lg`}>
                L{config.level}
              </span>
            </div>
            
            {/* Icon */}
            <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <config.icon size={24} />
            </div>
            
            {/* Content */}
            <h4 className={`font-bold text-center ${config.color}`}>{config.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">{config.subtitle}</p>
            
            {/* Count & Add */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-full text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                {count} added
              </span>
              {canAdd && (
                <span className={`p-1.5 rounded-full ${config.bgColor} ${config.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <Plus size={14} />
                </span>
              )}
            </div>
            
            {/* Disabled Message */}
            {!canAdd && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 text-center mt-2 font-medium">
                Add {HIERARCHY_CONFIG[idx - 1]?.title.toLowerCase()} first
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ==========================================
// 7. MAIN COMPONENT
// ==========================================

export default function OrganizationSetup() {
  
  const [data, setData] = useState<Record<OrgLevel, OrgItem[]>>({
    hq: [], bu: [], dept: [], section: [], designation: []
  });
  
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState<OrgLevel | null>(null);
  const [viewMode, setViewMode] = useState<'pyramid' | 'tree'>('pyramid');
  
  const [itemName, setItemName] = useState('');
  const [itemMeta, setItemMeta] = useState('');
  const [parentId, setParentId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getParentType = (lvl: OrgLevel): OrgLevel | null => {
      if (lvl === 'bu') return 'hq';
      if (lvl === 'dept') return 'bu';
      if (lvl === 'section') return 'dept';
      return null;
  };

  // --- API: Fetch ---
  const fetchStructure = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${API_BASE}/organization/structure/`, { headers: getAuthHeaders() });
        if (res.ok) {
            const json = await res.json();
            setData({
                hq: Array.isArray(json.hq) ? json.hq : [],
                bu: Array.isArray(json.bu) ? json.bu : [],
                dept: Array.isArray(json.dept) ? json.dept : [],
                section: Array.isArray(json.section) ? json.section : [],
                designation: Array.isArray(json.designation) ? json.designation : [] 
            });
        } else {
            console.error("Fetch failed:", res.statusText);
        }
    } catch (error) { 
        console.error("Fetch Error", error); 
    } 
    finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchStructure(); }, []);

  // --- API: Save ---
  const handleSave = async () => {
    if (!activeLevel || !itemName.trim()) return;
    
    const isParentRequired = activeLevel !== 'hq' && activeLevel !== 'designation';
    if (isParentRequired && !parentId) {
        alert(`Please select a parent.`);
        return;
    }

    setIsSaving(true);
    try {
        const payload = {
            name: itemName,
            org_type: activeLevel,
            location: itemMeta,
            parent: (parentId && activeLevel !== 'designation') ? parseInt(parentId) : null
        };

        const res = await fetch(`${API_BASE}/organization/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const savedItem = await res.json();
            setData(prev => ({
                ...prev,
                [activeLevel]: [...prev[activeLevel], savedItem]
            }));
            setIsModalOpen(false);
            setItemName('');
            setItemMeta('');
            setParentId('');
        } else {
            const err = await res.json();
            alert(`Failed to save: ${JSON.stringify(err)}`);
        }
    } catch (error) { 
        console.error("Save Error", error);
        alert("Network error occurred.");
    } 
    finally { setIsSaving(false); }
  };

  // --- API: Delete ---
  const handleDelete = async (level: OrgLevel, id: string) => {
    if(!window.confirm("Delete this item? This will also remove all child items.")) return;
    
    const previousData = { ...data };
    setData(prev => ({ ...prev, [level]: prev[level].filter(i => String(i.id) !== String(id)) }));

    try {
        const res = await fetch(`${API_BASE}/organization/${id}/`, { method: 'DELETE', headers: getAuthHeaders() });
        if (!res.ok) {
            setData(previousData);
            alert("Failed to delete item.");
        }
    } catch (error) { 
        setData(previousData);
        console.error("Delete Error", error); 
    }
  };

  const openAddModal = (level: OrgLevel) => {
    setActiveLevel(level);
    setItemName('');
    setItemMeta('');
    setParentId('');
    setIsModalOpen(true);
  };

  const getLevelDetails = (key: string) => HIERARCHY_CONFIG.find(c => c.key === key);

  const totalItems = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

  // Loading State
  if (loading && totalItems === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl">
              <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">Loading Organization</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Fetching hierarchy structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-slate-950 dark:via-indigo-900/20 dark:to-violet-900/20 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30">
                <Network size={36} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 tracking-tight">
                Organization Hierarchy
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                Build your organizational structure from top to bottom
              </p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-bold flex items-center gap-1">
                  <Layers size={12}/>5 Levels
                </span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                  <Zap size={12}/>{totalItems} Items
                </span>
              </div>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-lg">
            <button
              onClick={() => setViewMode('pyramid')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                viewMode === 'pyramid' 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Triangle size={18} /> Pyramid View
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                viewMode === 'tree' 
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <GitBranch size={18} /> Tree View
            </button>
          </div>
        </div>

        {/* ADD ITEM CARDS */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border-2 border-white dark:border-slate-800 p-8 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
              <Plus className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">Quick Add</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Click on any level to add new items</p>
            </div>
          </div>
          
          <AddItemCards onAdd={openAddModal} data={data} />
        </div>

        {/* HIERARCHY VISUALIZATION */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border-2 border-white dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-indigo-50/50 dark:from-slate-900/50 dark:to-indigo-900/20 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl">
              {viewMode === 'pyramid' ? <Triangle className="text-indigo-600 dark:text-indigo-400" size={24} /> : <GitBranch className="text-indigo-600 dark:text-indigo-400" size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">
                {viewMode === 'pyramid' ? 'Pyramid Visualization' : 'Hierarchical Tree'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {viewMode === 'pyramid' 
                  ? 'Compact view - hover over nodes for details' 
                  : 'Explore the complete hierarchy structure'
                }
              </p>
            </div>
          </div>
          
          <div className="p-8 custom-scrollbar overflow-auto">
            {viewMode === 'pyramid' ? (
              <PyramidView data={data} onDelete={handleDelete} />
            ) : (
              <HierarchicalTree data={data} onDelete={handleDelete} />
            )}
          </div>
        </div>

        {/* LEGEND / INFO SECTION */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-6 border-2 border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Info className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-lg">Understanding the Hierarchy</h3>
              <p className="text-indigo-700 dark:text-indigo-400 mt-2 font-medium">
                <strong>HQ → Business Units → Departments → Sections</strong> form a parent-child relationship. 
                Each level can only be added after its parent level exists. 
                <strong> Designations</strong> are global and apply across all levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {isModalOpen && activeLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-slate-800">
                
                {/* Modal Header */}
                <div className={`px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r ${getLevelDetails(activeLevel)?.bgColor} to-white dark:to-slate-900`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getLevelDetails(activeLevel)?.gradient} text-white shadow-xl`}>
                            {React.createElement(getLevelDetails(activeLevel)?.icon || Building, { size: 24 })}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Add {getLevelDetails(activeLevel)?.title.slice(0, -1)}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                {activeLevel === 'designation' ? 'Create a global designation' : `Add to Level ${getLevelDetails(activeLevel)?.level}`}
                            </p>
                        </div>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="p-3 hover:bg-white/50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      <X size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    
                    {/* PARENT DROPDOWN */}
                    {activeLevel !== 'hq' && activeLevel !== 'designation' && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                                <ArrowRight size={14} className="text-indigo-500 dark:text-indigo-400" />
                                Parent {activeLevel === 'bu' ? 'Headquarters' : activeLevel === 'dept' ? 'Business Unit' : 'Department'}
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                              <select 
                                  value={parentId}
                                  onChange={(e) => setParentId(e.target.value)}
                                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 font-bold text-slate-700 dark:text-slate-200 appearance-none cursor-pointer transition-all"
                              >
                                  <option value="" className="dark:bg-slate-900">-- Select Parent --</option>
                                  {(activeLevel === 'bu' ? data.hq : activeLevel === 'dept' ? data.bu : data.dept).map(p => (
                                      <option key={p.id} value={p.id} className="dark:bg-slate-900">{p.name}</option>
                                  ))}
                              </select>
                              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                            <Sparkles size={14} className="text-indigo-500 dark:text-indigo-400" />
                            Name <span className="text-rose-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder={activeLevel === 'designation' ? "e.g. Senior Engineer" : "e.g. Sales Division"} 
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-bold text-slate-700 dark:text-slate-200 placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 bg-white dark:bg-slate-900" 
                        />
                    </div>

                    {/* Meta Input */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                            <MapPin size={14} className="text-indigo-500 dark:text-indigo-400" />
                            {['hq', 'bu'].includes(activeLevel) ? 'Location / Region' : 'Description / Code'}
                            <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <input 
                            type="text" 
                            value={itemMeta}
                            onChange={(e) => setItemMeta(e.target.value)}
                            placeholder="Enter additional info..." 
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 bg-white dark:bg-slate-900"
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-4">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="px-6 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!itemName.trim() || isSaving || (activeLevel !== 'hq' && activeLevel !== 'designation' && !parentId)}
                        className={`px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getLevelDetails(activeLevel)?.gradient} shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2`}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                        {isSaving ? 'Saving...' : 'Save Item'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}