




// // // LessonSidebar.tsx — Smooth drag & drop with exclusive highlighting (fixed test click)
// // import React, { useMemo, useState, useRef, useEffect } from 'react';
// // import { CheckCircle, Circle, Clock, Video, GripVertical } from 'lucide-react';
// // import type { Test as SharedTest } from '../Utils/types';
// // import type { Lesson } from '../Utils/types';

// // type ItemType = 'lesson' | 'test';

// // interface UnifiedItem {
// //   id: number | string;
// //   type: ItemType;
// //   title: string;
// //   order: number;
// //   duration?: string;
// //   completed?: boolean;
// //   sample?: boolean;
// //   videoUrl?: string;
// //   questionCount?: number;
// //   raw?: Lesson | SharedTest;
// // }

// // interface LessonSidebarProps {
// //   lessons: Lesson[];
// //   tests?: SharedTest[];
// //   selectedLesson: number;
// //   onLessonSelect: (lessonId: number) => void;
// //   selectedTest?: number | null;
// //   onTestSelect?: (testId: number | null) => void; // allow null to clear selection
// //   onReorder?: (items: UnifiedItem[]) => void;
// // }

// // export const LessonSidebar: React.FC<LessonSidebarProps> = ({
// //   lessons,
// //   tests = [],
// //   selectedLesson,
// //   onLessonSelect,
// //   selectedTest = null,
// //   onTestSelect,
// //   onReorder,
// // }) => {
// //   const items: UnifiedItem[] = useMemo(() => {
// //     const lessonItems = (lessons || []).map((l, idx) => ({
// //       id: l.id,
// //       type: 'lesson' as ItemType,
// //       title: l.title || `Lesson ${idx + 1}`,
// //       order: typeof l.order === 'number' ? l.order : idx + 1,
// //       duration: l.duration,
// //       completed: l.completed,
// //       sample: l.sample,
// //       videoUrl: (l as any).videoUrl || '',
// //       raw: l,
// //     }));

// //     const testItems = (tests || []).map((t, idx) => ({
// //       id: t.id,
// //       type: 'test' as ItemType,
// //       title: t.title || `Test ${idx + 1}`,
// //       order: typeof t.order === 'number' ? t.order : lessons.length + idx + 1,
// //       questionCount: Array.isArray((t as any).questions) ? (t as any).questions.length : 0,
// //       raw: t,
// //     }));

// //     return [...lessonItems, ...testItems].sort((a, b) => {
// //       if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
// //       if (a.type === b.type) return String(a.id).localeCompare(String(b.id));
// //       return a.type === 'lesson' ? -1 : 1;
// //     });
// //   }, [lessons, tests]);

// //   const [currentItems, setCurrentItems] = useState<UnifiedItem[]>(() => items.slice());
// //   useEffect(() => {
// //     setCurrentItems(items.slice());
// //   }, [items]);

// //   const [draggedItem, setDraggedItem] = useState<UnifiedItem | null>(null);
// //   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
// //   const dragIndexRef = useRef<number | null>(null);

// //   const keyFor = (it: UnifiedItem) => `${it.type}-${it.id}`;

// //   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, it: UnifiedItem, index: number) => {
// //     setDraggedItem(it);
// //     dragIndexRef.current = index;
// //     try {
// //       const img = document.createElement('canvas');
// //       img.width = 1; img.height = 1;
// //       e.dataTransfer.setDragImage(img, 0, 0);
// //     } catch {}
// //     e.dataTransfer.effectAllowed = 'move';
// //     e.dataTransfer.setData('text/plain', index.toString());
// //   };

// //   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
// //     e.preventDefault();
// //     e.dataTransfer.dropEffect = 'move';
// //     if (!draggedItem) return;

// //     const from = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
// //     if (from === -1) return;
// //     if (from === index) {
// //       setDragOverIndex(index);
// //       return;
// //     }
// //     if (dragOverIndex === index) return;

// //     const next = currentItems.slice();
// //     const [removed] = next.splice(from, 1);
// //     next.splice(index, 0, removed);
// //     setCurrentItems(next);
// //     setDragOverIndex(index);
// //     dragIndexRef.current = index;
// //   };

// //   const handleDragEnd = () => {
// //     if (draggedItem) {
// //       const originalIndex = items.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
// //       const newIndex = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
// //       if (originalIndex !== -1 && newIndex !== -1 && originalIndex !== newIndex && onReorder) {
// //         const out = currentItems.map((it, idx) => ({ ...it, order: idx + 1 }));
// //         onReorder(out);
// //       }
// //     }
// //     setDraggedItem(null);
// //     setDragOverIndex(null);
// //     dragIndexRef.current = null;
// //   };

// //   const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, _index: number) => {};
// //   const handleDragLeave = (_e: React.DragEvent<HTMLDivElement>) => {};

// //   // ✅ Exclusive selection without clearing the lesson on test click
// //   const handleClick = (it: UnifiedItem) => {
// //     if (draggedItem) return;
// //     if (it.type === 'lesson') {
// //       onLessonSelect(Number(it.id));
// //       onTestSelect?.(null);               // clear test when a lesson is chosen
// //     } else {
// //       onTestSelect?.(Number(it.id));      // choose test
// //       // do NOT clear lesson; highlight logic below hides lesson highlight when a test is selected
// //     }
// //   };

// //   return (
// //     <div className="w-80 bg-surface border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
// //       <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
// //         <div className="space-y-2">
// //           <div className="pb-3 text-xs text-muted uppercase font-bold tracking-wider flex items-center gap-2">
// //             <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
// //             Content Structure
// //           </div>

// //           {currentItems.length === 0 && (
// //             <div className="text-center py-12 px-4">
// //               <div className="bg-background rounded-xl p-8 border border-border">
// //                 <Circle className="mx-auto mb-3 text-muted" size={40} />
// //                 <p className="text-sm text-text font-medium">No content yet</p>
// //                 <p className="text-xs mt-1 text-muted">Add lessons or tests to get started</p>
// //               </div>
// //             </div>
// //           )}

// //           {currentItems.map((it, index) => {
// //             const isDragging = draggedItem?.type === it.type && draggedItem?.id === it.id;

// //             // ✅ Only one highlight:
// //             // - If a test is selected, highlight only that test
// //             // - If no test is selected, highlight the selected lesson
// //             const isSelected =
// //               (selectedTest === null && it.type === 'lesson' && selectedLesson === Number(it.id)) ||
// //               (it.type === 'test' && selectedTest === Number(it.id));

// //             return (
// //               <div
// //                 key={`${it.type}-${it.id}`}
// //                 style={{ transition: 'transform 160ms cubic-bezier(.2,.9,.2,1), opacity 120ms linear' }}
// //               >
// //                 <div
// //                   draggable
// //                   onDragStart={(e) => handleDragStart(e, it, index)}
// //                   onDragEnd={handleDragEnd}
// //                   onDragOver={(e) => handleDragOver(e, index)}
// //                   onDragEnter={(e) => handleDragEnter(e, index)}
// //                   onDragLeave={handleDragLeave}
// //                   onClick={() => handleClick(it)}
// //                   className={`p-3 rounded-lg transition-all flex items-center gap-3 group select-none ${
// //                     isSelected
// //                       ? it.type === 'lesson'
// //                         ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30'
// //                         : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold border border-green-500/30 shadow-lg shadow-green-500/30'
// //                       : 'text-text hover:bg-background border border-transparent hover:border-border'
// //                   }`}
// //                   style={{
// //                     userSelect: 'none',
// //                     touchAction: 'manipulation',
// //                     cursor: isDragging ? 'grabbing' : 'grab',
// //                     opacity: isDragging ? 0.65 : 1,
// //                     transform: isDragging ? 'scale(1.01)' : undefined,
// //                   }}
// //                 >
// //                   <div
// //                     className={`flex-shrink-0 transition-all group-hover:opacity-100 ${isDragging ? 'text-blue-500' : 'text-muted'}`}
// //                     style={{ opacity: 0, cursor: 'grab' }}
// //                   >
// //                     <span style={{ display: 'inline-flex', pointerEvents: 'none' }}>
// //                       <GripVertical size={16} />
// //                     </span>
// //                   </div>

// //                   <div className="flex-shrink-0">
// //                     {it.type === 'lesson' ? (
// //                       it.completed ? (
// //                         <CheckCircle size={18} className="text-green-500" />
// //                       ) : (
// //                         <Circle size={18} className={isSelected ? 'text-blue-200' : 'text-muted'} />
// //                       )
// //                     ) : (
// //                       <div className={`w-4 h-4 rounded-full ${isSelected ? 'bg-green-300' : 'bg-green-500/30'}`} />
// //                     )}
// //                   </div>

// //                   <div className="flex-1 min-w-0">
// //                     <div className="flex items-center justify-between gap-2">
// //                       <div className="truncate text-sm font-semibold">{it.title}</div>
// //                       <div className={`text-xs px-2 py-0.5 rounded-full ${
// //                         isSelected ? 'bg-white/20 text-white' : 'bg-background text-muted border border-border'
// //                       }`}>
// //                         {it.order}
// //                       </div>
// //                     </div>

// //                     <div className={`text-xs flex items-center gap-2 mt-1.5 ${
// //                       isSelected ? 'text-white/80' : 'text-muted'
// //                     }`}>
// //                       {it.type === 'lesson' ? (
// //                         <>
// //                           <div className="flex items-center gap-1.5">
// //                             <Clock size={12} />
// //                             <span>{it.duration || '0:00'}</span>
// //                           </div>
// //                           {it.sample && (
// //                             <span className="bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded-full text-xs font-semibold border border-pink-200">
// //                               SAMPLE
// //                             </span>
// //                           )}
// //                           {it.videoUrl && (
// //                             <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
// //                               <Video size={12} className="text-blue-500" />
// //                             </div>
// //                           )}
// //                         </>
// //                       ) : (
// //                         <span className="flex items-center gap-1">
// //                           <span className="font-medium">{it.questionCount ?? 0}</span>
// //                           question{(it.questionCount ?? 0) === 1 ? '' : 's'}
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* Custom Scrollbar Styles - Updated to be more neutral */}
// //       <style>{`
// //         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
// //         .custom-scrollbar::-webkit-scrollbar-track {
// //           background: transparent;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb {
// //           background: #e2e8f0;
// //           border-radius: 4px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
// //           background: #cbd5e1;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };



// // LessonSidebar.tsx — Enhanced with beautiful UI and user-friendly features
// import React, { useMemo, useState, useRef, useEffect } from 'react';
// import { 
//   CheckCircle, Circle, Clock, Video, GripVertical, 
//   Search, BookOpen, ClipboardCheck, Sparkles, Filter,
//   ChevronDown, ChevronUp, Eye, Layers, ArrowUpDown,
//   FileText, HelpCircle, Zap, X, LayoutList
// } from 'lucide-react';
// import type { Test as SharedTest } from '../Utils/types';
// import type { Lesson } from '../Utils/types';

// type ItemType = 'lesson' | 'test';

// interface UnifiedItem {
//   id: number | string;
//   type: ItemType;
//   title: string;
//   order: number;
//   duration?: string;
//   completed?: boolean;
//   sample?: boolean;
//   videoUrl?: string;
//   questionCount?: number;
//   raw?: Lesson | SharedTest;
// }

// interface LessonSidebarProps {
//   lessons: Lesson[];
//   tests?: SharedTest[];
//   selectedLesson: number;
//   onLessonSelect: (lessonId: number) => void;
//   selectedTest?: number | null;
//   onTestSelect?: (testId: number | null) => void;
//   onReorder?: (items: UnifiedItem[]) => void;
// }

// // Filter Chip Component
// const FilterChip: React.FC<{
//   label: string;
//   active: boolean;
//   count: number;
//   icon: React.ReactNode;
//   color: string;
//   onClick: () => void;
// }> = ({ label, active, count, icon, color, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
//       active
//         ? `${color} text-white shadow-md`
//         : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//     }`}
//   >
//     {icon}
//     <span>{label}</span>
//     <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
//       active ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
//     }`}>
//       {count}
//     </span>
//   </button>
// );

// // Progress Ring Component
// const ProgressRing: React.FC<{ progress: number; size?: number }> = ({ progress, size = 40 }) => {
//   const strokeWidth = 3;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = radius * 2 * Math.PI;
//   const offset = circumference - (progress / 100) * circumference;

//   return (
//     <div className="relative" style={{ width: size, height: size }}>
//       <svg className="transform -rotate-90" width={size} height={size}>
//         <circle
//           className="text-slate-200 dark:text-slate-700"
//           strokeWidth={strokeWidth}
//           stroke="currentColor"
//           fill="transparent"
//           r={radius}
//           cx={size / 2}
//           cy={size / 2}
//         />
//         <circle
//           className="text-emerald-500 transition-all duration-500"
//           strokeWidth={strokeWidth}
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           stroke="currentColor"
//           fill="transparent"
//           r={radius}
//           cx={size / 2}
//           cy={size / 2}
//         />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
//       </div>
//     </div>
//   );
// };

// // Drag Handle Component
// const DragHandle: React.FC<{ isDragging: boolean; isVisible: boolean }> = ({ isDragging, isVisible }) => (
//   <div
//     className={`flex-shrink-0 p-1 rounded transition-all duration-200 ${
//       isDragging 
//         ? 'text-violet-500 bg-violet-100 dark:bg-violet-900/30' 
//         : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
//     } ${isVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
//     style={{ cursor: 'grab' }}
//   >
//     <GripVertical size={14} />
//   </div>
// );

// // Type Badge Component
// const TypeBadge: React.FC<{ type: ItemType; isSelected: boolean }> = ({ type, isSelected }) => (
//   <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
//     type === 'lesson'
//       ? isSelected 
//         ? 'bg-blue-400/30 text-blue-100' 
//         : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//       : isSelected 
//         ? 'bg-emerald-400/30 text-emerald-100' 
//         : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
//   }`}>
//     {type === 'lesson' ? <BookOpen size={10} /> : <ClipboardCheck size={10} />}
//     <span>{type}</span>
//   </div>
// );

// export const LessonSidebar: React.FC<LessonSidebarProps> = ({
//   lessons,
//   tests = [],
//   selectedLesson,
//   onLessonSelect,
//   selectedTest = null,
//   onTestSelect,
//   onReorder,
// }) => {
//   // Search and filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState<'all' | 'lesson' | 'test'>('all');
//   const [showFilters, setShowFilters] = useState(false);
//   const [isCompactView, setIsCompactView] = useState(false);

//   const items: UnifiedItem[] = useMemo(() => {
//     const lessonItems = (lessons || []).map((l, idx) => ({
//       id: l.id,
//       type: 'lesson' as ItemType,
//       title: l.title || `Lesson ${idx + 1}`,
//       order: typeof l.order === 'number' ? l.order : idx + 1,
//       duration: l.duration,
//       completed: l.completed,
//       sample: l.sample,
//       videoUrl: (l as any).videoUrl || (l as any).video_url || '',
//       raw: l,
//     }));

//     const testItems = (tests || []).map((t, idx) => ({
//       id: t.id,
//       type: 'test' as ItemType,
//       title: t.title || `Test ${idx + 1}`,
//       order: typeof t.order === 'number' ? t.order : lessons.length + idx + 1,
//       questionCount: Array.isArray((t as any).questions) ? (t as any).questions.length : 0,
//       raw: t,
//     }));

//     return [...lessonItems, ...testItems].sort((a, b) => {
//       if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
//       if (a.type === b.type) return String(a.id).localeCompare(String(b.id));
//       return a.type === 'lesson' ? -1 : 1;
//     });
//   }, [lessons, tests]);

//   // Filter items based on search and type
//   const filteredItems = useMemo(() => {
//     return items.filter(item => {
//       const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesType = filterType === 'all' || item.type === filterType;
//       return matchesSearch && matchesType;
//     });
//   }, [items, searchQuery, filterType]);

//   const [currentItems, setCurrentItems] = useState<UnifiedItem[]>(() => items.slice());
//   useEffect(() => {
//     setCurrentItems(items.slice());
//   }, [items]);

//   // Calculate progress
//   const completedLessons = lessons.filter(l => l.completed).length;
//   const totalLessons = lessons.length;
//   const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

//   const [draggedItem, setDraggedItem] = useState<UnifiedItem | null>(null);
//   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
//   const dragIndexRef = useRef<number | null>(null);

//   const handleDragStart = (e: React.DragEvent<HTMLDivElement>, it: UnifiedItem, index: number) => {
//     setDraggedItem(it);
//     dragIndexRef.current = index;
//     try {
//       const img = document.createElement('canvas');
//       img.width = 1; img.height = 1;
//       e.dataTransfer.setDragImage(img, 0, 0);
//     } catch {}
//     e.dataTransfer.effectAllowed = 'move';
//     e.dataTransfer.setData('text/plain', index.toString());
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//     if (!draggedItem) return;

//     const from = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
//     if (from === -1) return;
//     if (from === index) {
//       setDragOverIndex(index);
//       return;
//     }
//     if (dragOverIndex === index) return;

//     const next = currentItems.slice();
//     const [removed] = next.splice(from, 1);
//     next.splice(index, 0, removed);
//     setCurrentItems(next);
//     setDragOverIndex(index);
//     dragIndexRef.current = index;
//   };

//   const handleDragEnd = () => {
//     if (draggedItem) {
//       const originalIndex = items.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
//       const newIndex = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
//       if (originalIndex !== -1 && newIndex !== -1 && originalIndex !== newIndex && onReorder) {
//         const out = currentItems.map((it, idx) => ({ ...it, order: idx + 1 }));
//         onReorder(out);
//       }
//     }
//     setDraggedItem(null);
//     setDragOverIndex(null);
//     dragIndexRef.current = null;
//   };

//   const handleDragEnter = (_e: React.DragEvent<HTMLDivElement>, _index: number) => {};
//   const handleDragLeave = (_e: React.DragEvent<HTMLDivElement>) => {};

//   const handleClick = (it: UnifiedItem) => {
//     if (draggedItem) return;
//     if (it.type === 'lesson') {
//       onLessonSelect(Number(it.id));
//       onTestSelect?.(null);
//     } else {
//       onTestSelect?.(Number(it.id));
//     }
//   };

//   // Get display items (filtered or all based on search)
//   const displayItems = searchQuery || filterType !== 'all' ? filteredItems : currentItems;

//   return (
//     <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
      
//       {/* Header Section */}
//       <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
        
//         {/* Progress Overview */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <ProgressRing progress={progressPercentage} />
//             <div>
//               <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Course Progress</p>
//               <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
//                 {completedLessons} of {totalLessons} completed
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setIsCompactView(!isCompactView)}
//             className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//             title={isCompactView ? "Expanded view" : "Compact view"}
//           >
//             <LayoutList size={16} />
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative mb-3">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search content..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-9 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
//           />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery('')}
//               className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
//             >
//               <X size={14} />
//             </button>
//           )}
//         </div>

//         {/* Filter Toggle */}
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//         >
//           <div className="flex items-center gap-2">
//             <Filter size={14} />
//             <span>Filter by type</span>
//             {filterType !== 'all' && (
//               <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-bold">
//                 Active
//               </span>
//             )}
//           </div>
//           {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//         </button>

//         {/* Filter Chips */}
//         {showFilters && (
//           <div className="flex gap-2 mt-3 animate-fadeIn">
//             <FilterChip
//               label="All"
//               active={filterType === 'all'}
//               count={items.length}
//               icon={<Layers size={12} />}
//               color="bg-gradient-to-r from-violet-500 to-purple-600"
//               onClick={() => setFilterType('all')}
//             />
//             <FilterChip
//               label="Lessons"
//               active={filterType === 'lesson'}
//               count={lessons.length}
//               icon={<BookOpen size={12} />}
//               color="bg-gradient-to-r from-blue-500 to-blue-600"
//               onClick={() => setFilterType('lesson')}
//             />
//             <FilterChip
//               label="Tests"
//               active={filterType === 'test'}
//               count={tests.length}
//               icon={<ClipboardCheck size={12} />}
//               color="bg-gradient-to-r from-emerald-500 to-teal-600"
//               onClick={() => setFilterType('test')}
//             />
//           </div>
//         )}
//       </div>

//       {/* Reorder Hint */}
//       {!searchQuery && filterType === 'all' && displayItems.length > 1 && (
//         <div className="flex-shrink-0 px-4 py-2 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-100 dark:border-violet-800/30">
//           <div className="flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400">
//             <ArrowUpDown size={12} />
//             <span>Drag items to reorder</span>
//           </div>
//         </div>
//       )}

//       {/* Content List */}
//       <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
//         {displayItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full py-12 text-center">
//             <div className="relative mb-4">
//               <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full blur-xl opacity-50" />
//               <div className="relative p-5 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl">
//                 {searchQuery ? (
//                   <Search size={32} className="text-slate-400" />
//                 ) : (
//                   <Layers size={32} className="text-slate-400" />
//                 )}
//               </div>
//             </div>
//             <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
//               {searchQuery ? 'No results found' : 'No content yet'}
//             </h3>
//             <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[180px]">
//               {searchQuery 
//                 ? `No items match "${searchQuery}"`
//                 : 'Add lessons or tests to build your course'
//               }
//             </p>
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery('')}
//                 className="mt-4 px-4 py-2 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
//               >
//                 Clear search
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {displayItems.map((it, index) => {
//               const isDragging = draggedItem?.type === it.type && draggedItem?.id === it.id;
//               const isSelected =
//                 (selectedTest === null && it.type === 'lesson' && selectedLesson === Number(it.id)) ||
//                 (it.type === 'test' && selectedTest === Number(it.id));

//               return (
//                 <div
//                   key={`${it.type}-${it.id}`}
//                   className="transition-all duration-200"
//                   style={{
//                     transform: isDragging ? 'scale(1.02)' : 'scale(1)',
//                     opacity: isDragging ? 0.8 : 1,
//                   }}
//                 >
//                   <div
//                     draggable={!searchQuery && filterType === 'all'}
//                     onDragStart={(e) => handleDragStart(e, it, index)}
//                     onDragEnd={handleDragEnd}
//                     onDragOver={(e) => handleDragOver(e, index)}
//                     onDragEnter={(e) => handleDragEnter(e, index)}
//                     onDragLeave={handleDragLeave}
//                     onClick={() => handleClick(it)}
//                     className={`group relative overflow-hidden rounded-xl transition-all duration-200 cursor-pointer ${
//                       isSelected
//                         ? it.type === 'lesson'
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
//                           : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
//                         : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
//                     } ${isCompactView ? 'p-2.5' : 'p-3.5'}`}
//                   >
//                     {/* Selection indicator */}
//                     {isSelected && (
//                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30" />
//                     )}

//                     <div className="flex items-start gap-3">
//                       {/* Drag Handle */}
//                       {!searchQuery && filterType === 'all' && (
//                         <DragHandle isDragging={isDragging} isVisible={false} />
//                       )}

//                       {/* Status Icon */}
//                       <div className="flex-shrink-0 mt-0.5">
//                         {it.type === 'lesson' ? (
//                           it.completed ? (
//                             <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
//                               <CheckCircle size={16} className="text-emerald-500" />
//                             </div>
//                           ) : (
//                             <div className={`p-1.5 rounded-lg ${
//                               isSelected 
//                                 ? 'bg-white/20' 
//                                 : 'bg-slate-200 dark:bg-slate-700'
//                             }`}>
//                               <Circle size={16} className={isSelected ? 'text-white/70' : 'text-slate-400'} />
//                             </div>
//                           )
//                         ) : (
//                           <div className={`p-1.5 rounded-lg ${
//                             isSelected 
//                               ? 'bg-white/20' 
//                               : 'bg-emerald-100 dark:bg-emerald-900/30'
//                           }`}>
//                             <ClipboardCheck size={16} className={isSelected ? 'text-white' : 'text-emerald-500'} />
//                           </div>
//                         )}
//                       </div>

//                       {/* Content */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between gap-2 mb-1">
//                           <h4 className={`font-semibold truncate ${
//                             isCompactView ? 'text-xs' : 'text-sm'
//                           } ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
//                             {it.title}
//                           </h4>
//                           <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
//                             isSelected 
//                               ? 'bg-white/20 text-white' 
//                               : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
//                           }`}>
//                             #{it.order}
//                           </span>
//                         </div>

//                         {!isCompactView && (
//                           <div className="flex items-center flex-wrap gap-2">
//                             {/* Type Badge */}
//                             <TypeBadge type={it.type} isSelected={isSelected} />

//                             {/* Duration or Question Count */}
//                             {it.type === 'lesson' ? (
//                               <>
//                                 <div className={`flex items-center gap-1 text-[11px] ${
//                                   isSelected ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
//                                 }`}>
//                                   <Clock size={11} />
//                                   <span>{it.duration || '0:00'}</span>
//                                 </div>

//                                 {it.videoUrl && (
//                                   <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
//                                     isSelected 
//                                       ? 'bg-white/20 text-white' 
//                                       : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                                   }`}>
//                                     <Video size={10} />
//                                     <span>Video</span>
//                                   </div>
//                                 )}

//                                 {it.sample && (
//                                   <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
//                                     isSelected 
//                                       ? 'bg-amber-400/30 text-amber-100' 
//                                       : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
//                                   }`}>
//                                     <Sparkles size={10} />
//                                     <span>Sample</span>
//                                   </div>
//                                 )}
//                               </>
//                             ) : (
//                               <div className={`flex items-center gap-1 text-[11px] ${
//                                 isSelected ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
//                               }`}>
//                                 <HelpCircle size={11} />
//                                 <span>{it.questionCount ?? 0} question{(it.questionCount ?? 0) === 1 ? '' : 's'}</span>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Hover Glow Effect */}
//                     <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
//                       isSelected ? '' : 'bg-gradient-to-r from-transparent via-white/5 to-transparent'
//                     }`} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Footer Stats */}
//       <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
//         <div className="flex items-center justify-between text-xs">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
//               <BookOpen size={12} />
//               <span className="font-semibold">{lessons.length}</span>
//               <span className="text-slate-400 dark:text-slate-500">lessons</span>
//             </div>
//             <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
//               <ClipboardCheck size={12} />
//               <span className="font-semibold">{tests.length}</span>
//               <span className="text-slate-400 dark:text-slate-500">tests</span>
//             </div>
//           </div>
//           {displayItems.length !== items.length && (
//             <span className="text-slate-400 dark:text-slate-500">
//               Showing {displayItems.length} of {items.length}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Custom Scrollbar & Animation Styles */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #e2e8f0;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #cbd5e1;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #475569;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #64748b;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };




import React, { useMemo, useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, Circle, Clock, Video, GripVertical, 
  Search, BookOpen, ClipboardCheck, Sparkles, Filter,
  ChevronDown, ChevronUp, Layers, ArrowUpDown,
  HelpCircle, X
} from 'lucide-react';
import type { Test as SharedTest } from '../Utils/types';
import type { Lesson } from '../Utils/types';

type ItemType = 'lesson' | 'test';

interface UnifiedItem {
  id: number | string;
  type: ItemType;
  title: string;
  order: number;
  duration?: string;
  completed?: boolean;
  sample?: boolean;
  videoUrl?: string;
  questionCount?: number;
  raw?: Lesson | SharedTest;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  tests?: SharedTest[];
  selectedLesson: number;
  onLessonSelect: (lessonId: number) => void;
  selectedTest?: number | null;
  onTestSelect?: (testId: number | null) => void;
  onReorder?: (items: UnifiedItem[]) => void;
}

// Filter Chip Component
const FilterChip: React.FC<{
  label: string;
  active: boolean;
  count: number;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}> = ({ label, active, count, icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
      active
        ? `${color} text-white shadow-sm`
        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${
      active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
    }`}>
      {count}
    </span>
  </button>
);

// Type Badge Component
const TypeBadge: React.FC<{ type: ItemType; isSelected: boolean }> = ({ type, isSelected }) => (
  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
    type === 'lesson'
      ? isSelected 
        ? 'bg-white/20 text-white' 
        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      : isSelected 
        ? 'bg-white/20 text-white' 
        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
  }`}>
    {type === 'lesson' ? <BookOpen size={9} /> : <ClipboardCheck size={9} />}
    <span>{type}</span>
  </div>
);

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  lessons,
  tests = [],
  selectedLesson,
  onLessonSelect,
  selectedTest = null,
  onTestSelect,
  onReorder,
}) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lesson' | 'test'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const items: UnifiedItem[] = useMemo(() => {
    const lessonItems = (lessons || []).map((l, idx) => ({
      id: l.id,
      type: 'lesson' as ItemType,
      title: l.title || `Lesson ${idx + 1}`,
      order: typeof l.order === 'number' ? l.order : idx + 1,
      duration: l.duration,
      completed: l.completed,
      sample: l.sample,
      videoUrl: (l as any).videoUrl || (l as any).video_url || '',
      raw: l,
    }));

    const testItems = (tests || []).map((t, idx) => ({
      id: t.id,
      type: 'test' as ItemType,
      title: t.title || `Test ${idx + 1}`,
      order: typeof t.order === 'number' ? t.order : lessons.length + idx + 1,
      questionCount: Array.isArray((t as any).questions) ? (t as any).questions.length : 0,
      raw: t,
    }));

    return [...lessonItems, ...testItems].sort((a, b) => {
      if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
      if (a.type === b.type) return String(a.id).localeCompare(String(b.id));
      return a.type === 'lesson' ? -1 : 1;
    });
  }, [lessons, tests]);

  // Filter items based on search and type
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, filterType]);

  const [currentItems, setCurrentItems] = useState<UnifiedItem[]>(() => items.slice());
  useEffect(() => {
    setCurrentItems(items.slice());
  }, [items]);

  const [draggedItem, setDraggedItem] = useState<UnifiedItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, it: UnifiedItem, index: number) => {
    setDraggedItem(it);
    try {
      const img = document.createElement('canvas');
      img.width = 1; img.height = 1;
      e.dataTransfer.setDragImage(img, 0, 0);
    } catch {}
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedItem) return;

    const from = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
    if (from === -1) return;
    if (from === index) {
      setDragOverIndex(index);
      return;
    }
    if (dragOverIndex === index) return;

    const next = currentItems.slice();
    const [removed] = next.splice(from, 1);
    next.splice(index, 0, removed);
    setCurrentItems(next);
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedItem) {
      const originalIndex = items.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
      const newIndex = currentItems.findIndex(it => it.type === draggedItem.type && it.id === draggedItem.id);
      if (originalIndex !== -1 && newIndex !== -1 && originalIndex !== newIndex && onReorder) {
        const out = currentItems.map((it, idx) => ({ ...it, order: idx + 1 }));
        onReorder(out);
      }
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleClick = (it: UnifiedItem) => {
    if (draggedItem) return;
    if (it.type === 'lesson') {
      onLessonSelect(Number(it.id));
      onTestSelect?.(null);
    } else {
      onTestSelect?.(Number(it.id));
    }
  };

  const displayItems = searchQuery || filterType !== 'all' ? filteredItems : currentItems;

  return (
    <div className="flex flex-col w-full">
      
      {/* Search & Filter Section */}
      <div className="mb-4 space-y-3 px-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-700 px-1"
        >
          <span className="flex items-center gap-1"><Filter size={12} /> Filter items</span>
          {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <FilterChip
              label="All"
              active={filterType === 'all'}
              count={items.length}
              icon={<Layers size={10} />}
              color="bg-slate-600"
              onClick={() => setFilterType('all')}
            />
            <FilterChip
              label="Lessons"
              active={filterType === 'lesson'}
              count={lessons.length}
              icon={<BookOpen size={10} />}
              color="bg-blue-500"
              onClick={() => setFilterType('lesson')}
            />
            <FilterChip
              label="Tests"
              active={filterType === 'test'}
              count={tests.length}
              icon={<ClipboardCheck size={10} />}
              color="bg-emerald-500"
              onClick={() => setFilterType('test')}
            />
          </div>
        )}
      </div>

      {/* Draggable List */}
      <div className="space-y-1.5 pb-4">
        {displayItems.map((it, index) => {
          const isDragging = draggedItem?.type === it.type && draggedItem?.id === it.id;
          const isSelected =
            (selectedTest === null && it.type === 'lesson' && selectedLesson === Number(it.id)) ||
            (it.type === 'test' && selectedTest === Number(it.id));

          return (
            <div
              key={`${it.type}-${it.id}`}
              draggable={!searchQuery && filterType === 'all'}
              onDragStart={(e) => handleDragStart(e, it, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onClick={() => handleClick(it)}
              className={`
                group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                ${isSelected 
                  ? it.type === 'lesson' 
                    ? 'bg-violet-600 border-violet-600 text-white shadow-md' 
                    : 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700'
                }
                ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
              `}
            >
              {/* Drag Handle (Hidden unless hovering) */}
              {!searchQuery && filterType === 'all' && (
                <div className={`absolute left-1 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab ${isSelected ? 'text-white/50' : 'text-slate-400'}`}>
                  <GripVertical size={12} />
                </div>
              )}

              {/* Status Icon */}
              <div className="pl-2">
                {it.type === 'lesson' ? (
                  it.completed ? (
                    <CheckCircle size={16} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                  ) : (
                    <Circle size={16} className={isSelected ? 'text-white/50' : 'text-slate-300'} />
                  )
                ) : (
                  <ClipboardCheck size={16} className={isSelected ? 'text-white' : 'text-emerald-500'} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{it.title}</p>
                  <TypeBadge type={it.type} isSelected={isSelected} />
                </div>
                
                <div className={`flex items-center gap-3 mt-1 text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                   <span className="flex items-center gap-1">
                     #{it.order}
                   </span>
                   {it.type === 'lesson' && (
                     <>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {it.duration || '0:00'}
                        </span>
                        {it.videoUrl && <Video size={10} />}
                        {it.sample && <Sparkles size={10} />}
                     </>
                   )}
                   {it.type === 'test' && (
                     <span className="flex items-center gap-1">
                       <HelpCircle size={10} /> {it.questionCount || 0} Qs
                     </span>
                   )}
                </div>
              </div>
            </div>
          );
        })}

        {displayItems.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};