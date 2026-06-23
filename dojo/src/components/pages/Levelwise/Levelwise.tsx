// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   Factory,
//   Settings,
//   MapPin,
//   ChevronRight,
//   ChevronDown,
//   Sparkles,
//   Target,
//   TrendingUp,
//   Layers,
//   Hexagon, 
// } from "lucide-react";
// import { ProcessDojo } from "../../hooks/ServiceApis";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// // --- Configuration ---
// const API_BASE_URL = "http://127.0.0.1:8000"; 

// // Session storage key for persisting state
// const STATE_STORAGE_KEY = 'levelwise_navigation_state';

// // ---------------- Types ----------------

// interface StationTypeConfig {
//   code: string;
//   name: string;
//   icon_url: string | null;
//   color: string;
// }

// interface Station {
//   station_name: string;
//   id: number;
//   station_type?: string;
// }

// interface Subline {
//   subline_name: string;
//   id: number;
//   stations: Station[];
// }

// interface Line {
//   line_name: string;
//   id: number;
//   sublines: Subline[];
//   stations?: Station[];
// }

// interface Department {
//   department_id: number;
//   department_name: string;
//   lines: Line[];
//   sublines?: Subline[];
//   stations?: Station[];
// }

// interface HierarchyStructure {
//   structure_id: number;
//   structure_name: string;
//   hq_id: number;
//   hq_name: string;
//   factory_id: number;
//   factory_name: string;
//   department: Department;
// }

// interface LocationState {
//   levelId?: number;
//   levelName?: string;
// }

// // Interface for saved state
// interface SavedNavigationState {
//   currentDepartmentId: number;
//   expandedLines: number[];
//   expandedSublines: number[];
//   scrollPosition?: number;
//   timestamp: number;
// }

// // ---------------- Helper functions ----------------

// const normalizeStation = (raw: any): Station => ({
//   id: raw.station_id ?? raw.id,
//   station_name: raw.station_name,
//   station_type: raw.station_type || null, 
// });

// const normalizeSubline = (raw: any): Subline => ({
//   id: raw.subline_id ?? raw.id,
//   subline_name: raw.subline_name,
//   stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
// });

// const normalizeLine = (raw: any): Line => ({
//   id: raw.line_id ?? raw.id,
//   line_name: raw.line_name,
//   sublines: Array.isArray(raw.sublines) ? raw.sublines.map(normalizeSubline) : [],
//   stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
// });

// const normalizeDepartment = (raw: any): Department => ({
//   department_id: raw.department_id ?? raw.id ?? 0,
//   department_name: raw.department_name ?? raw.name ?? "",
//   lines: Array.isArray(raw.lines) ? raw.lines.map(normalizeLine) : [],
//   sublines: Array.isArray(raw.sublines) ? raw.sublines.map(normalizeSubline) : [],
//   stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
// });

// const normalizeHierarchyResponse = (res: any): HierarchyStructure | null => {
//   if (!res) return null;
//   const first = Array.isArray(res) ? res[0] : res;

//   if (first && (first.department_id || first.department_name)) {
//     return {
//       structure_id: 0,
//       structure_name: "",
//       hq_id: 0,
//       hq_name: "",
//       factory_id: 0,
//       factory_name: "",
//       department: normalizeDepartment(first),
//     };
//   }

//   if (first && first.department) {
//     return {
//       structure_id: first.structure_id ?? 0,
//       structure_name: first.structure_name ?? "",
//       hq_id: first.hq_id ?? first.hq ?? 0,
//       hq_name: first.hq_name ?? "",
//       factory_id: first.factory_id ?? first.factory ?? 0,
//       factory_name: first.factory_name ?? "",
//       department: normalizeDepartment(first.department),
//     };
//   }

//   return null;
// };

// // Helper functions for state persistence - SIMPLIFIED
// const saveNavigationState = (state: Omit<SavedNavigationState, 'timestamp'>) => {
//   try {
//     const stateWithTimestamp: SavedNavigationState = {
//       ...state,
//       timestamp: Date.now()
//     };
//     sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(stateWithTimestamp));
//   } catch (e) {
//     console.error('Failed to save navigation state:', e);
//   }
// };

// const getSavedNavigationState = (): SavedNavigationState | null => {
//   try {
//     const saved = sessionStorage.getItem(STATE_STORAGE_KEY);
//     if (!saved) return null;
    
//     const parsed: SavedNavigationState = JSON.parse(saved);
    
//     // Expire saved state after 1 hour
//     const EXPIRY_TIME = 60 * 60 * 1000;
//     if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
//       sessionStorage.removeItem(STATE_STORAGE_KEY);
//       return null;
//     }
    
//     return parsed;
//   } catch {
//     return null;
//   }
// };

// const stationColors = ['purple', 'blue', 'green', 'red', 'orange', 'yellow', 'indigo', 'pink'];

// // ---------------- Component ----------------
// export const Levelwise: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { levelId, levelName } = (location.state as LocationState) || {};
  
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(null);
//   const [hierarchy, setHierarchy] = useState<HierarchyStructure | null>(null);
//   const [stationTypeMap, setStationTypeMap] = useState<Record<string, StationTypeConfig>>({});

//   const [expandedLines, setExpandedLines] = useState<number[]>([]);
//   const [expandedSublines, setExpandedSublines] = useState<number[]>([]);
  
//   // Track initialization state
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Refs to prevent double initialization and track user actions
//   const isInitializedRef = useRef(false);
//   const isUserChangingDepartment = useRef(false);
//   const lastSavedStateRef = useRef<string>('');

//   // Debounced save function to prevent excessive writes
//   const saveStateDebounced = useCallback(() => {
//     if (currentDepartmentId === null) return;
    
//     const stateToSave = {
//       currentDepartmentId,
//       expandedLines,
//       expandedSublines,
//       scrollPosition: window.scrollY
//     };
    
//     const stateString = JSON.stringify(stateToSave);
    
//     // Only save if state actually changed
//     if (stateString !== lastSavedStateRef.current) {
//       lastSavedStateRef.current = stateString;
//       saveNavigationState(stateToSave);
//     }
//   }, [currentDepartmentId, expandedLines, expandedSublines]);

//   // 1. Fetch Station Types on Mount
//   useEffect(() => {
//     const fetchStationTypes = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/station-types/`);
//         const types: StationTypeConfig[] = response.data;
        
//         const typeMap: Record<string, StationTypeConfig> = {};
//         types.forEach(t => {
//           typeMap[t.code] = t;
//         });
//         setStationTypeMap(typeMap);
//       } catch (error) {
//         console.error("Error fetching station types:", error);
//       }
//     };

//     fetchStationTypes();
//   }, []);

//   // 2. Initialize - Fetch departments and restore state
//   useEffect(() => {
//     // Prevent double initialization (React StrictMode)
//     if (isInitializedRef.current) return;
//     isInitializedRef.current = true;

//     const initialize = async () => {
//       setIsLoading(true);
      
//       try {
//         // Fetch departments first
//         const res = await ProcessDojo.fetchDepartments();
//         const incomingDepartments = Array.isArray(res) ? res : res?.departments ?? [];
//         const normalized = incomingDepartments.map((d: any) => normalizeDepartment(d));
//         setDepartments(normalized);

//         if (normalized.length === 0) {
//           setIsLoading(false);
//           return;
//         }

//         // Try to restore saved state
//         const savedState = getSavedNavigationState();
        
//         let targetDepartmentId: number;
//         let restoredExpandedLines: number[] = [];
//         let restoredExpandedSublines: number[] = [];
//         let scrollPosition = 0;

//         if (savedState && normalized.some(d => d.department_id === savedState.currentDepartmentId)) {
//           // Valid saved state found - restore it
//           targetDepartmentId = savedState.currentDepartmentId;
//           restoredExpandedLines = savedState.expandedLines || [];
//           restoredExpandedSublines = savedState.expandedSublines || [];
//           scrollPosition = savedState.scrollPosition || 0;
//         } else {
//           // No valid saved state - use first department
//           targetDepartmentId = normalized[0].department_id;
//         }

//         // Set state BEFORE loading hierarchy
//         setCurrentDepartmentId(targetDepartmentId);
//         setExpandedLines(restoredExpandedLines);
//         setExpandedSublines(restoredExpandedSublines);

//         // Load hierarchy
//         try {
//           const hierarchyRes = await ProcessDojo.fetchHierarchyByDepartment(targetDepartmentId);
//           const normalizedHierarchy = normalizeHierarchyResponse(hierarchyRes);
//           setHierarchy(normalizedHierarchy);
//         } catch (error) {
//           console.error("Error fetching hierarchy:", error);
//           setHierarchy(null);
//         }

//         // Restore scroll position after a brief delay
//         if (scrollPosition > 0) {
//           setTimeout(() => {
//             window.scrollTo({ top: scrollPosition, behavior: 'auto' });
//           }, 100);
//         }

//       } catch (error) {
//         console.error("Error during initialization:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initialize();
//   }, []);

//   // 3. Save state whenever it changes (after loading completes)
//   useEffect(() => {
//     if (!isLoading && currentDepartmentId !== null) {
//       saveStateDebounced();
//     }
//   }, [currentDepartmentId, expandedLines, expandedSublines, isLoading, saveStateDebounced]);

//   // 4. Save state before page unload (backup)
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (currentDepartmentId !== null) {
//         saveNavigationState({
//           currentDepartmentId,
//           expandedLines,
//           expandedSublines,
//           scrollPosition: window.scrollY
//         });
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [currentDepartmentId, expandedLines, expandedSublines]);

//   // 5. Save state when component unmounts
//   useEffect(() => {
//     return () => {
//       if (currentDepartmentId !== null) {
//         // Use the refs to get latest values in cleanup
//         const stateToSave = {
//           currentDepartmentId,
//           expandedLines,
//           expandedSublines,
//           scrollPosition: window.scrollY
//         };
//         sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
//           ...stateToSave,
//           timestamp: Date.now()
//         }));
//       }
//     };
//   }, [currentDepartmentId, expandedLines, expandedSublines]);

//   const loadHierarchy = async (departmentId: number) => {
//     try {
//       const res = await ProcessDojo.fetchHierarchyByDepartment(departmentId);
//       const normalized = normalizeHierarchyResponse(res);
//       setHierarchy(normalized);
//     } catch (error) {
//       console.error("Error fetching hierarchy:", error);
//       setHierarchy(null);
//     }
//   };

//   const handleDepartmentChange = async (departmentId: number) => {
//     if (departmentId === currentDepartmentId) return;
    
//     isUserChangingDepartment.current = true;
    
//     // Reset expanded states when user manually changes department
//     setExpandedLines([]);
//     setExpandedSublines([]);
//     setCurrentDepartmentId(departmentId);
    
//     await loadHierarchy(departmentId);
    
//     isUserChangingDepartment.current = false;
//   };

//   const toggleLine = (lineId: number) => {
//     setExpandedLines((prev) => {
//       const newState = prev.includes(lineId) 
//         ? prev.filter((id) => id !== lineId) 
//         : [...prev, lineId];
//       return newState;
//     });
//   };

//   const toggleSubline = (sublineId: number) => {
//     setExpandedSublines((prev) => {
//       const newState = prev.includes(sublineId) 
//         ? prev.filter((id) => id !== sublineId) 
//         : [...prev, sublineId];
//       return newState;
//     });
//   };

//   const handleStationClick = (
//     station: Station,
//     ctx: { department: Department; line?: Line; subline?: Subline }
//   ) => {
//     // Explicitly save current state before navigation
//     saveNavigationState({
//       currentDepartmentId: currentDepartmentId!,
//       expandedLines,
//       expandedSublines,
//       scrollPosition: window.scrollY
//     });

//     navigate("/TrainingOptionsPageNew", {
//       state: {
//         stationId: station.id,
//         stationName: station.station_name,
//         sublineId: ctx.subline?.id ?? null,
//         sublineName: ctx.subline?.subline_name ?? null,
//         lineId: ctx.line?.id ?? null,
//         lineName: ctx.line?.line_name ?? null,
//         departmentId: ctx.department?.department_id ?? currentDepartmentId,
//         departmentName: ctx.department?.department_name ?? null,
//         levelId,
//         levelName,
//       },
//     });
//   };

//   // --- UI Helpers for Stations ---

//   const getStationGradient = (station: Station, index: number) => {
//     const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;
    
//     if (typeConfig && typeConfig.color && typeConfig.color.includes('from-')) {
//         return `bg-gradient-to-r ${typeConfig.color}`;
//     }

//     const color = stationColors[index % stationColors.length];
//     const colorClasses = {
//       purple: 'bg-gradient-to-r from-purple-500 to-violet-600',
//       blue: 'bg-gradient-to-r from-blue-500 to-cyan-600',
//       green: 'bg-gradient-to-r from-green-500 to-emerald-600',
//       red: 'bg-gradient-to-r from-red-500 to-rose-600',
//       orange: 'bg-gradient-to-r from-orange-500 to-amber-600',
//       yellow: 'bg-gradient-to-r from-yellow-500 to-orange-600',
//       indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600',
//       pink: 'bg-gradient-to-r from-pink-500 to-rose-600'
//     };
//     return colorClasses[color as keyof typeof colorClasses];
//   };

//   const getStationBgClass = (index: number) => {
//     const color = stationColors[index % stationColors.length];
//     const bgClasses = {
//       purple: 'bg-purple-400/10',
//       blue: 'bg-blue-400/10',
//       green: 'bg-green-400/10',
//       red: 'bg-red-400/10',
//       orange: 'bg-orange-400/10',
//       yellow: 'bg-yellow-400/10',
//       indigo: 'bg-indigo-400/10',
//       pink: 'bg-pink-400/10'
//     };
//     return bgClasses[color as keyof typeof bgClasses];
//   };

//   const renderStationIcon = (station: Station) => {
//     const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;

//     if (typeConfig && typeConfig.icon_url) {
//         const imageUrl = typeConfig.icon_url.startsWith('http') 
//             ? typeConfig.icon_url 
//             : `${API_BASE_URL}${typeConfig.icon_url}`;

//         return (
//             <img 
//                 src={imageUrl} 
//                 alt={typeConfig.name} 
//                 className="w-6 h-6 object-contain"
//                 onError={(e) => { e.currentTarget.style.display = 'none'; }} 
//             />
//         );
//     }

//     if (typeConfig) {
//         return (
//             <span className="text-[10px] font-extrabold text-gray-600 uppercase">
//                 {typeConfig.code.substring(0, 3)}
//             </span>
//         );
//     }

//     return <Hexagon size={20} className="text-gray-400" />;
//   };

//   const renderStations = (
//     stations: Station[] | undefined,
//     department: Department,
//     line?: Line,
//     subline?: Subline,
//     levelType?: string
//   ) => {
//     const list = stations ?? [];
//     if (list.length === 0) {
//       return (
//         <div className="text-center py-8">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
//             <MapPin size={32} className="text-gray-400" />
//           </div>
//           <p className="text-gray-500 font-medium">No stations configured</p>
//         </div>
//       );
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {list
//           .filter(station => station.station_name?.toLowerCase() !== "general")
//           .map((station, index) => {
//             return (
//               <button
//                 key={station.id}
//                 onClick={() => handleStationClick(station, { department, line, subline })}
//                 className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 text-left hover:shadow-2xl hover:-translate-y-2 transform border border-white/30 overflow-hidden"
//               >
//                 <div className={`absolute top-0 left-0 w-full h-1 ${getStationGradient(station, index)}`}></div>
//                 <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${getStationBgClass(index)}`}></div>
                
//                 <div className="relative z-10">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all duration-300 flex items-center justify-center min-w-[44px] min-h-[44px] border border-gray-100">
//                       {renderStationIcon(station)}
//                     </div>

//                    <div className="flex flex-col flex-1 min-w-0">
//                       <span
//                           className={`text-xs font-bold ${
//                               levelType === 'Department'
//                                   ? 'text-orange-600'
//                                   : levelType === 'Line'
//                                   ? 'text-blue-600'
//                                   : 'text-purple-600'
//                           }`}
//                       >
//                           {levelType} Level
//                       </span>
//                     </div>
//                   </div>

//                   <h5 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors duration-300 truncate" title={station.station_name}>
//                     {station.station_name}
//                   </h5>
                  
//                   <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
//                     <Target size={14} />
//                     Ready for training
//                   </p>
                  
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-bold text-gray-500 tracking-wider">
//                       Station
//                     </span>
//                     <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-bold shadow-sm">
//                       Active
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
//               </button>
//             );
//         })}
//       </div>
//     );
//   };

//   const activeDepartment = departments.find(d => d.department_id === currentDepartmentId) || departments[0];

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading your workspace...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-indigo-400/5 to-pink-400/5 rounded-full blur-3xl"></div>

//       {/* Department Tabs */}
//       <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-2xl">
//         <div className="px-8">
//           <nav className="flex space-x-8 overflow-x-auto">
//             {departments.map((dept) => (
//               <button
//                 key={dept.department_id}
//                 onClick={() => handleDepartmentChange(dept.department_id)}
//                 className={`py-6 px-4 border-b-3 font-bold text-lg transition-all duration-300 relative group whitespace-nowrap ${
//                   dept.department_id === currentDepartmentId
//                     ? "border-indigo-500 text-indigo-600 bg-gradient-to-t from-indigo-50/50 to-transparent"
//                     : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-gradient-to-t hover:from-indigo-50/30 hover:to-transparent"
//                 }`}
//               >
//                 {dept.department_id === currentDepartmentId && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-t-xl"></div>
//                 )}
//                 {dept.department_name}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Hierarchical Content */}
//       <div className="relative z-10 p-8">
//         <div className="mb-10">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
//               <Sparkles size={28} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
//                 {activeDepartment?.department_name} Operations
//               </h2>
//               <p className="text-gray-600 text-lg">
//                 Navigate through your manufacturing hierarchy
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Hierarchy View */}
//         {hierarchy ? (
//           <>
//             {/* Department has lines */}
//             {hierarchy.department.lines && hierarchy.department.lines.length > 0 ? (
//               <div className="space-y-8">
//                 {hierarchy.department.lines.map((line) => (
//                   <div key={line.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
//                     <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                    
//                     {/* Line Header */}
//                     <div 
//                       className="relative z-10 p-8 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-purple-50/80 backdrop-blur-sm border-b border-white/20 cursor-pointer hover:from-indigo-100/80 hover:via-blue-100/60 hover:to-purple-100/80 transition-all duration-300"
//                       onClick={() => toggleLine(line.id)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-6">
//                           <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
//                             <Factory size={32} className="text-white" />
//                           </div>
//                           <div>
//                             <h3 className="text-2xl font-bold text-gray-900 mb-1">{line.line_name}</h3>
//                             <p className="text-gray-600 flex items-center gap-2">
//                               <TrendingUp size={16} />
//                               {line.sublines?.length || 0} sub line{(line.sublines?.length || 0) !== 1 ? 's' : ''}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-2xl text-sm font-bold shadow-lg">
//                             Line
//                           </span>
//                           <div className="p-2 bg-white/50 rounded-xl">
//                             {expandedLines.includes(line.id) ? (
//                               <ChevronDown size={24} className="text-gray-600" />
//                             ) : (
//                               <ChevronRight size={24} className="text-gray-600" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Expand line content */}
//                     {expandedLines.includes(line.id) && (
//                       <div className="relative z-10 p-6 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
//                         {/* Line has sublines */}
//                         {line.sublines && line.sublines.length > 0 ? (
//                           <div className="space-y-6">
//                             {line.sublines.map((subline) => (
//                               <div key={subline.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden relative">
//                                 <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
                                
//                                 {/* Sub Line Header */}
//                                 <div 
//                                   className="relative z-10 p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-b border-white/20 cursor-pointer hover:from-purple-100/80 hover:to-pink-100/80 transition-all duration-300"
//                                   onClick={() => toggleSubline(subline.id)}
//                                 >
//                                   <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-4">
//                                       <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
//                                         <Settings size={24} className="text-white" />
//                                       </div>
//                                       <div>
//                                         <h4 className="text-xl font-bold text-gray-900 mb-1">{subline.subline_name}</h4>
//                                         <p className="text-gray-600 flex items-center gap-2">
//                                           <Target size={14} />
//                                           {subline.stations?.length || 0} station{(subline.stations?.length || 0) !== 1 ? 's' : ''}
//                                         </p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                       <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-2xl text-sm font-bold shadow-lg">
//                                         Sub Line
//                                       </span>
//                                       <div className="p-2 bg-white/50 rounded-xl">
//                                         {expandedSublines.includes(subline.id) ? (
//                                           <ChevronDown size={20} className="text-gray-600" />
//                                         ) : (
//                                           <ChevronRight size={20} className="text-gray-600" />
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Show stations under subline */}
//                                 {expandedSublines.includes(subline.id) && (
//                                   <div className="relative z-10 p-6">
//                                     {renderStations(subline.stations, hierarchy.department, line, subline, 'Subline')}
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           // Line has no sublines; show stations under line
//                           <div className="bg-gray-50/80 rounded-xl p-6">
//                             {line.stations && line.stations.length > 0 ? 
//                               renderStations(line.stations, hierarchy.department, line, undefined, 'Line') : 
//                               <div className="text-center py-12">
//                                 <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
//                                   <Layers size={40} className="text-gray-400" />
//                                 </div>
//                                 <p className="text-gray-500 text-lg font-medium">No sublines available for this line</p>
//                               </div>
//                             }
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : hierarchy.department.sublines && hierarchy.department.sublines.length > 0 ? (
//               // Department has no lines but has sublines
//               <div className="space-y-6">
//                 {hierarchy.department.sublines.map((subline) => (
//                   <div key={subline.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
//                     <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
                    
//                     <div 
//                       className="relative z-10 p-8 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-b border-white/20 cursor-pointer hover:from-purple-100/80 hover:to-pink-100/80 transition-all duration-300"
//                       onClick={() => toggleSubline(subline.id)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-6">
//                           <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
//                             <Settings size={32} className="text-white" />
//                           </div>
//                           <div>
//                             <h3 className="text-2xl font-bold text-gray-900 mb-1">{subline.subline_name}</h3>
//                             <p className="text-gray-600 flex items-center gap-2">
//                               <Target size={16} />
//                               {subline.stations?.length || 0} station{(subline.stations?.length || 0) !== 1 ? 's' : ''}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-2xl text-sm font-bold shadow-lg">
//                             Sub Line
//                           </span>
//                           <div className="p-2 bg-white/50 rounded-xl">
//                             {expandedSublines.includes(subline.id) ? (
//                               <ChevronDown size={24} className="text-gray-600" />
//                             ) : (
//                               <ChevronRight size={24} className="text-gray-600" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Show stations under subline */}
//                     {expandedSublines.includes(subline.id) && (
//                       <div className="relative z-10 p-8">
//                         {renderStations(subline.stations, hierarchy.department, undefined, subline, 'Subline')}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               // Department has no lines and no sublines, show stations under department
//               <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 relative">
//                 <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl"></div>
                
//                 <div className="relative z-10 p-8 bg-gradient-to-r from-orange-50/80 via-red-50/60 to-pink-50/80 backdrop-blur-sm border-b border-white/20">
//                   <div className="flex items-center gap-6">
//                     <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl">
//                       <MapPin size={32} className="text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-900 mb-1">Department Stations</h3>
//                       <p className="text-gray-600 flex items-center gap-2">
//                         <Target size={16} />
//                         {hierarchy.department.stations?.length || 0} station{(hierarchy.department.stations?.length || 0) !== 1 ? 's' : ''}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="relative z-10 p-8">
//                   {hierarchy.department.stations && hierarchy.department.stations.length > 0 ? (
//                     renderStations(hierarchy.department.stations, hierarchy.department, undefined, undefined, 'Department')
//                   ) : (
//                     <div className="text-center py-20">
//                       <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
//                         <Factory size={64} className="text-gray-400" />
//                       </div>
//                       <p className="text-2xl font-bold text-gray-500 mb-4">No stations configured</p>
//                       <p className="text-gray-400 text-lg max-w-md mx-auto">
//                         Set up your stations in the Settings page to get started.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50"></div>
//             <div className="relative z-10">
//               <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
//                 <Factory size={64} className="text-gray-400" />
//               </div>
//               <p className="text-2xl font-bold text-gray-500 mb-4">Select a department to view hierarchy</p>
//               <p className="text-gray-400 text-lg max-w-md mx-auto">
//                 Choose a department from the tabs above to explore the manufacturing hierarchy.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };



import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Factory,
  Settings,
  MapPin,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Target,
  TrendingUp,
  Layers,
  Hexagon, 
} from "lucide-react";
import { ProcessDojo } from "../../hooks/ServiceApis";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:8000"; 

// Session storage key for persisting state
const STATE_STORAGE_KEY = 'levelwise_navigation_state';

// ---------------- Types ----------------

interface StationTypeConfig {
  code: string;
  name: string;
  icon_url: string | null;
  color: string;
}

interface Station {
  station_name: string;
  id: number;
  station_type?: string;
}

interface Subline {
  subline_name: string;
  id: number;
  stations: Station[];
}

interface Line {
  line_name: string;
  id: number;
  sublines: Subline[];
  stations?: Station[];
}

interface Department {
  department_id: number;
  department_name: string;
  lines: Line[];
  sublines?: Subline[];
  stations?: Station[];
}

interface HierarchyStructure {
  structure_id: number;
  structure_name: string;
  hq_id: number;
  hq_name: string;
  factory_id: number;
  factory_name: string;
  department: Department;
}

interface LocationState {
  levelId?: number;
  levelName?: string;
}

// Interface for saved state
interface SavedNavigationState {
  currentDepartmentId: number;
  expandedLines: number[];
  expandedSublines: number[];
  scrollPosition?: number;
  timestamp: number;
}

// ---------------- Helper functions ----------------

const normalizeStation = (raw: any): Station => ({
  id: raw.station_id ?? raw.id,
  station_name: raw.station_name,
  station_type: raw.station_type || null, 
});

const normalizeSubline = (raw: any): Subline => ({
  id: raw.subline_id ?? raw.id,
  subline_name: raw.subline_name,
  stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
});

const normalizeLine = (raw: any): Line => ({
  id: raw.line_id ?? raw.id,
  line_name: raw.line_name,
  sublines: Array.isArray(raw.sublines) ? raw.sublines.map(normalizeSubline) : [],
  stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
});

const normalizeDepartment = (raw: any): Department => ({
  department_id: raw.department_id ?? raw.id ?? 0,
  department_name: raw.department_name ?? raw.name ?? "",
  lines: Array.isArray(raw.lines) ? raw.lines.map(normalizeLine) : [],
  sublines: Array.isArray(raw.sublines) ? raw.sublines.map(normalizeSubline) : [],
  stations: Array.isArray(raw.stations) ? raw.stations.map(normalizeStation) : [],
});

const normalizeHierarchyResponse = (res: any): HierarchyStructure | null => {
  if (!res) return null;
  const first = Array.isArray(res) ? res[0] : res;

  if (first && (first.department_id || first.department_name)) {
    return {
      structure_id: 0,
      structure_name: "",
      hq_id: 0,
      hq_name: "",
      factory_id: 0,
      factory_name: "",
      department: normalizeDepartment(first),
    };
  }

  if (first && first.department) {
    return {
      structure_id: first.structure_id ?? 0,
      structure_name: first.structure_name ?? "",
      hq_id: first.hq_id ?? first.hq ?? 0,
      hq_name: first.hq_name ?? "",
      factory_id: first.factory_id ?? first.factory ?? 0,
      factory_name: first.factory_name ?? "",
      department: normalizeDepartment(first.department),
    };
  }

  return null;
};

// Helper functions for state persistence
const saveNavigationState = (state: Omit<SavedNavigationState, 'timestamp'>) => {
  try {
    const stateWithTimestamp: SavedNavigationState = {
      ...state,
      timestamp: Date.now()
    };
    sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(stateWithTimestamp));
  } catch (e) {
    console.error('Failed to save navigation state:', e);
  }
};

const getSavedNavigationState = (): SavedNavigationState | null => {
  try {
    const saved = sessionStorage.getItem(STATE_STORAGE_KEY);
    if (!saved) return null;
    
    const parsed: SavedNavigationState = JSON.parse(saved);
    
    // Expire saved state after 1 hour
    const EXPIRY_TIME = 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > EXPIRY_TIME) {
      sessionStorage.removeItem(STATE_STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
};

const stationColors = ['purple', 'blue', 'green', 'red', 'orange', 'yellow', 'indigo', 'pink'];

// ---------------- Component ----------------
export const Levelwise: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { levelId, levelName } = (location.state as LocationState) || {};
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentDepartmentId, setCurrentDepartmentId] = useState<number | null>(null);
  const [hierarchy, setHierarchy] = useState<HierarchyStructure | null>(null);
  const [stationTypeMap, setStationTypeMap] = useState<Record<string, StationTypeConfig>>({});

  const [expandedLines, setExpandedLines] = useState<number[]>([]);
  const [expandedSublines, setExpandedSublines] = useState<number[]>([]);
  
  // Track initialization state
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs to prevent double initialization and track user actions
  const isInitializedRef = useRef(false);
  const isUserChangingDepartment = useRef(false);
  const lastSavedStateRef = useRef<string>('');

  // Debounced save function to prevent excessive writes
  const saveStateDebounced = useCallback(() => {
    if (currentDepartmentId === null) return;
    
    const stateToSave = {
      currentDepartmentId,
      expandedLines,
      expandedSublines,
      scrollPosition: window.scrollY
    };
    
    const stateString = JSON.stringify(stateToSave);
    
    // Only save if state actually changed
    if (stateString !== lastSavedStateRef.current) {
      lastSavedStateRef.current = stateString;
      saveNavigationState(stateToSave);
    }
  }, [currentDepartmentId, expandedLines, expandedSublines]);

  // 1. Fetch Station Types on Mount
  useEffect(() => {
    const fetchStationTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/station-types/`);
        const types: StationTypeConfig[] = response.data;
        
        const typeMap: Record<string, StationTypeConfig> = {};
        types.forEach(t => {
          typeMap[t.code] = t;
        });
        setStationTypeMap(typeMap);
      } catch (error) {
        console.error("Error fetching station types:", error);
      }
    };

    fetchStationTypes();
  }, []);

  // 2. Initialize - Fetch departments and restore state
  useEffect(() => {
    // Prevent double initialization (React StrictMode)
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initialize = async () => {
      setIsLoading(true);
      
      try {
        // Fetch departments first
        const res = await ProcessDojo.fetchDepartments();
        const incomingDepartments = Array.isArray(res) ? res : res?.departments ?? [];
        const normalized = incomingDepartments.map((d: any) => normalizeDepartment(d));
        setDepartments(normalized);

        if (normalized.length === 0) {
          setIsLoading(false);
          return;
        }

        // Try to restore saved state
        const savedState = getSavedNavigationState();
        
        let targetDepartmentId: number;
        let restoredExpandedLines: number[] = [];
        let restoredExpandedSublines: number[] = [];
        let scrollPosition = 0;

        if (savedState && normalized.some(d => d.department_id === savedState.currentDepartmentId)) {
          // Valid saved state found - restore it
          targetDepartmentId = savedState.currentDepartmentId;
          restoredExpandedLines = savedState.expandedLines || [];
          restoredExpandedSublines = savedState.expandedSublines || [];
          scrollPosition = savedState.scrollPosition || 0;
        } else {
          // No valid saved state - use first department
          targetDepartmentId = normalized[0].department_id;
        }

        // Set state BEFORE loading hierarchy
        setCurrentDepartmentId(targetDepartmentId);
        setExpandedLines(restoredExpandedLines);
        setExpandedSublines(restoredExpandedSublines);

        // Load hierarchy
        try {
          const hierarchyRes = await ProcessDojo.fetchHierarchyByDepartment(targetDepartmentId);
          const normalizedHierarchy = normalizeHierarchyResponse(hierarchyRes);
          setHierarchy(normalizedHierarchy);
        } catch (error) {
          console.error("Error fetching hierarchy:", error);
          setHierarchy(null);
        }

        // Restore scroll position after a brief delay
        if (scrollPosition > 0) {
          setTimeout(() => {
            window.scrollTo({ top: scrollPosition, behavior: 'auto' });
          }, 100);
        }

      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // 3. Save state whenever it changes (after loading completes)
  useEffect(() => {
    if (!isLoading && currentDepartmentId !== null) {
      saveStateDebounced();
    }
  }, [currentDepartmentId, expandedLines, expandedSublines, isLoading, saveStateDebounced]);

  // 4. Save state before page unload (backup)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentDepartmentId !== null) {
        saveNavigationState({
          currentDepartmentId,
          expandedLines,
          expandedSublines,
          scrollPosition: window.scrollY
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentDepartmentId, expandedLines, expandedSublines]);

  // 5. Save state when component unmounts
  useEffect(() => {
    return () => {
      if (currentDepartmentId !== null) {
        // Use the refs to get latest values in cleanup
        const stateToSave = {
          currentDepartmentId,
          expandedLines,
          expandedSublines,
          scrollPosition: window.scrollY
        };
        sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
          ...stateToSave,
          timestamp: Date.now()
        }));
      }
    };
  }, [currentDepartmentId, expandedLines, expandedSublines]);

  const loadHierarchy = async (departmentId: number) => {
    try {
      const res = await ProcessDojo.fetchHierarchyByDepartment(departmentId);
      const normalized = normalizeHierarchyResponse(res);
      setHierarchy(normalized);
    } catch (error) {
      console.error("Error fetching hierarchy:", error);
      setHierarchy(null);
    }
  };

  const handleDepartmentChange = async (departmentId: number) => {
    if (departmentId === currentDepartmentId) return;
    
    isUserChangingDepartment.current = true;
    
    // Reset expanded states when user manually changes department
    setExpandedLines([]);
    setExpandedSublines([]);
    setCurrentDepartmentId(departmentId);
    
    await loadHierarchy(departmentId);
    
    isUserChangingDepartment.current = false;
  };

  const toggleLine = (lineId: number) => {
    setExpandedLines((prev) => {
      const newState = prev.includes(lineId) 
        ? prev.filter((id) => id !== lineId) 
        : [...prev, lineId];
      return newState;
    });
  };

  const toggleSubline = (sublineId: number) => {
    setExpandedSublines((prev) => {
      const newState = prev.includes(sublineId) 
        ? prev.filter((id) => id !== sublineId) 
        : [...prev, sublineId];
      return newState;
    });
  };

  const handleStationClick = (
    station: Station,
    ctx: { department: Department; line?: Line; subline?: Subline }
  ) => {
    // Explicitly save current state before navigation
    saveNavigationState({
      currentDepartmentId: currentDepartmentId!,
      expandedLines,
      expandedSublines,
      scrollPosition: window.scrollY
    });

    navigate("/TrainingOptionsPageNew", {
      state: {
        stationId: station.id,
        stationName: station.station_name,
        sublineId: ctx.subline?.id ?? null,
        sublineName: ctx.subline?.subline_name ?? null,
        lineId: ctx.line?.id ?? null,
        lineName: ctx.line?.line_name ?? null,
        departmentId: ctx.department?.department_id ?? currentDepartmentId,
        departmentName: ctx.department?.department_name ?? null,
        levelId,
        levelName,
      },
    });
  };

  // --- UI Helpers for Stations ---

  const getStationGradient = (station: Station, index: number) => {
    const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;
    
    if (typeConfig && typeConfig.color && typeConfig.color.includes('from-')) {
        return `bg-gradient-to-r ${typeConfig.color}`;
    }

    const color = stationColors[index % stationColors.length];
    const colorClasses = {
      purple: 'bg-gradient-to-r from-purple-500 to-violet-600',
      blue: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      green: 'bg-gradient-to-r from-green-500 to-emerald-600',
      red: 'bg-gradient-to-r from-red-500 to-rose-600',
      orange: 'bg-gradient-to-r from-orange-500 to-amber-600',
      yellow: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      indigo: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      pink: 'bg-gradient-to-r from-pink-500 to-rose-600'
    };
    return colorClasses[color as keyof typeof colorClasses];
  };

  const renderStationIcon = (station: Station) => {
    const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;

    if (typeConfig && typeConfig.icon_url) {
        const imageUrl = typeConfig.icon_url.startsWith('http') 
            ? typeConfig.icon_url 
            : `${API_BASE_URL}${typeConfig.icon_url}`;

        return (
            <img 
                src={imageUrl} 
                alt={typeConfig.name} 
                className="w-6 h-6 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
        );
    }

    if (typeConfig) {
        return (
            <span className="text-[10px] font-extrabold text-muted uppercase">
                {typeConfig.code.substring(0, 3)}
            </span>
        );
    }

    return <Hexagon size={20} className="text-muted" />;
  };

  const renderStations = (
    stations: Station[] | undefined,
    department: Department,
    line?: Line,
    subline?: Subline,
    levelType?: string
  ) => {
    const list = stations ?? [];
    if (list.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-xl flex items-center justify-center border border-border">
            <MapPin size={32} className="text-muted" />
          </div>
          <p className="text-muted font-medium">No stations configured</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {list
          .filter(station => station.station_name?.toLowerCase() !== "general")
          .map((station, index) => {
            return (
              <button
                key={station.id}
                onClick={() => handleStationClick(station, { department, line, subline })}
                className="group relative bg-surface rounded-2xl p-6 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-2 transform border border-border overflow-hidden"
              >
                {/* Station Top Bar Color - Kept for semantic differentiation */}
                <div className={`absolute top-0 left-0 w-full h-1 ${getStationGradient(station, index)}`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-background rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all duration-300 flex items-center justify-center min-w-[44px] min-h-[44px] border border-border">
                      {renderStationIcon(station)}
                    </div>

                   <div className="flex flex-col flex-1 min-w-0">
                      <span
                          className={`text-xs font-bold ${
                              levelType === 'Department'
                                  ? 'text-orange-600'
                                  : levelType === 'Line'
                                  ? 'text-blue-600'
                                  : 'text-purple-600'
                          }`}
                      >
                          {levelType} Level
                      </span>
                    </div>
                  </div>

                  <h5 className="font-bold text-xl text-text mb-3 group-hover:text-indigo-600 transition-colors duration-300 truncate" title={station.station_name}>
                    {station.station_name}
                  </h5>
                  
                  <p className="text-sm text-muted mb-4 flex items-center gap-2">
                    <Target size={14} />
                    Ready for training
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted tracking-wider">
                      Station
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                      Active
                    </span>
                  </div>
                </div>
              </button>
            );
        })}
      </div>
    );
  };

  const activeDepartment = departments.find(d => d.department_id === currentDepartmentId) || departments[0];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background relative overflow-hidden">
      
      {/* Department Tabs */}
      <div className="relative z-10 bg-surface border-b border-border shadow-sm">
        <div className="px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {departments.map((dept) => (
              <button
                key={dept.department_id}
                onClick={() => handleDepartmentChange(dept.department_id)}
                className={`py-6 px-4 border-b-2 font-bold text-lg transition-all duration-300 relative group whitespace-nowrap ${
                  dept.department_id === currentDepartmentId
                    ? "border-indigo-500 text-indigo-600 bg-background"
                    : "border-transparent text-muted hover:text-text hover:bg-background"
                }`}
              >
                {dept.department_name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Hierarchical Content */}
      <div className="relative z-10 p-8">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text">
                {activeDepartment?.department_name} Operations
              </h2>
              <p className="text-muted text-lg">
                Navigate through your manufacturing hierarchy
              </p>
            </div>
          </div>
        </div>

        {/* Hierarchy View */}
        {hierarchy ? (
          <>
            {/* Department has lines */}
            {hierarchy.department.lines && hierarchy.department.lines.length > 0 ? (
              <div className="space-y-6">
                {hierarchy.department.lines.map((line) => (
                  <div key={line.id} className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    
                    {/* Line Header */}
                    <div 
                      className="relative z-10 p-6 bg-surface border-b border-border cursor-pointer hover:bg-background transition-all duration-300"
                      onClick={() => toggleLine(line.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                            <Factory size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-text mb-1">{line.line_name}</h3>
                            <p className="text-muted flex items-center gap-2 text-sm">
                              <TrendingUp size={14} />
                              {line.sublines?.length || 0} sub line{(line.sublines?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                            Line
                          </span>
                          <div className="p-2 bg-background rounded-lg border border-border">
                            {expandedLines.includes(line.id) ? (
                              <ChevronDown size={20} className="text-muted" />
                            ) : (
                              <ChevronRight size={20} className="text-muted" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand line content */}
                    {expandedLines.includes(line.id) && (
                      <div className="relative z-10 p-6 bg-background">
                        {/* Line has sublines */}
                        {line.sublines && line.sublines.length > 0 ? (
                          <div className="space-y-4">
                            {line.sublines.map((subline) => (
                              <div key={subline.id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                                
                                {/* Sub Line Header */}
                                <div 
                                  className="relative z-10 p-4 bg-surface border-b border-border cursor-pointer hover:bg-background transition-all duration-300"
                                  onClick={() => toggleSubline(subline.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
                                        <Settings size={20} className="text-white" />
                                      </div>
                                      <div>
                                        <h4 className="text-lg font-bold text-text mb-0.5">{subline.subline_name}</h4>
                                        <p className="text-muted flex items-center gap-2 text-xs">
                                          <Target size={12} />
                                          {subline.stations?.length || 0} station{(subline.stations?.length || 0) !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                                        Sub Line
                                      </span>
                                      <div className="p-1.5 bg-background rounded-lg border border-border">
                                        {expandedSublines.includes(subline.id) ? (
                                          <ChevronDown size={16} className="text-muted" />
                                        ) : (
                                          <ChevronRight size={16} className="text-muted" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Show stations under subline */}
                                {expandedSublines.includes(subline.id) && (
                                  <div className="relative z-10 p-6 bg-background">
                                    {renderStations(subline.stations, hierarchy.department, line, subline, 'Subline')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Line has no sublines; show stations under line
                          <div className="bg-background rounded-xl">
                            {line.stations && line.stations.length > 0 ? 
                              renderStations(line.stations, hierarchy.department, line, undefined, 'Line') : 
                              <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-xl flex items-center justify-center border border-border">
                                  <Layers size={32} className="text-muted" />
                                </div>
                                <p className="text-muted text-lg font-medium">No sublines available for this line</p>
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : hierarchy.department.sublines && hierarchy.department.sublines.length > 0 ? (
              // Department has no lines but has sublines
              <div className="space-y-6">
                {hierarchy.department.sublines.map((subline) => (
                  <div key={subline.id} className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                    
                    <div 
                      className="relative z-10 p-6 bg-surface border-b border-border cursor-pointer hover:bg-background transition-all duration-300"
                      onClick={() => toggleSubline(subline.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md">
                            <Settings size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-text mb-1">{subline.subline_name}</h3>
                            <p className="text-muted flex items-center gap-2 text-sm">
                              <Target size={14} />
                              {subline.stations?.length || 0} station{(subline.stations?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
                            Sub Line
                          </span>
                          <div className="p-2 bg-background rounded-lg border border-border">
                            {expandedSublines.includes(subline.id) ? (
                              <ChevronDown size={20} className="text-muted" />
                            ) : (
                              <ChevronRight size={20} className="text-muted" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show stations under subline */}
                    {expandedSublines.includes(subline.id) && (
                      <div className="relative z-10 p-6 bg-background">
                        {renderStations(subline.stations, hierarchy.department, undefined, subline, 'Subline')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Department has no lines and no sublines, show stations under department
              <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="relative z-10 p-8 bg-surface border-b border-border">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                      <MapPin size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-1">Department Stations</h3>
                      <p className="text-muted flex items-center gap-2">
                        <Target size={16} />
                        {hierarchy.department.stations?.length || 0} station{(hierarchy.department.stations?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 p-8 bg-background">
                  {hierarchy.department.stations && hierarchy.department.stations.length > 0 ? (
                    renderStations(hierarchy.department.stations, hierarchy.department, undefined, undefined, 'Department')
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 mx-auto mb-6 bg-surface rounded-2xl flex items-center justify-center border border-border">
                        <Factory size={48} className="text-muted" />
                      </div>
                      <p className="text-xl font-bold text-text mb-2">No stations configured</p>
                      <p className="text-muted max-w-md mx-auto">
                        Set up your stations in the Settings page to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-surface rounded-2xl shadow-sm border border-border">
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-background rounded-2xl flex items-center justify-center border border-border">
                <Factory size={48} className="text-muted" />
              </div>
              <p className="text-xl font-bold text-text mb-2">Select a department to view hierarchy</p>
              <p className="text-muted max-w-md mx-auto">
                Choose a department from the tabs above to explore the manufacturing hierarchy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};