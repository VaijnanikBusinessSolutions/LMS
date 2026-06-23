



// import React, { useEffect, useState } from 'react';
// import {
//   Save,
//   RotateCcw,
//   CheckCircle,
//   Square,
//   CheckSquare,
//   Settings,
//   Factory,
//   Target,
//   Building2,
//   AlertCircle,
//   Layers,
//   Zap,
//   Globe,
// } from 'lucide-react';
// import { ProcessDojo } from '../../hooks/ServiceApis';
// import { API_ENDPOINTS } from '../../constants/api';

// // ---------------- Types ----------------
// interface Station {
//   id: number;
//   station_name: string;
//   department_id?: number;
//   department_name?: string;
//   line_id?: number;
//   line_name?: string;
//   subline_id?: number;
//   subline_name?: string;
// }

// interface Subline {
//   id: number;
//   subline_name: string;
//   stations: Station[];
// }

// interface Line {
//   id: number;
//   line_name: string;
//   sublines: Subline[];
//   stations?: Station[];
// }

// interface DepartmentAPI {
//   department_id: number;
//   department_name: string;
//   lines?: Line[];
//   sublines?: Subline[];
//   stations?: Station[];
// }

// interface HierarchyStructure {
//   id: number;
//   department: DepartmentAPI;
// }

// interface Level {
//   level_id: number;
//   level_name: string;
//   days: any[];
//   colours: any[];
// }

// interface StationSheetMatrix {
//   [stationKey: string]: {
//     ojt: boolean;
//     tenCycle: boolean;
//     skillEvaluation: boolean;
//     others: boolean;
//     evaluation: boolean;
//     maruA: boolean;
//     station_id: number;
//     department_id: number;
//     line_id: number | null;
//     subline_id: number | null;
//   };
// }

// interface ConfigurationKey {
//   level_id: number | null;
//   department_id: number | null | 'all';
//   line_id: number | null;
//   subline_id: number | null;
// }

// // ---------------- Constants ----------------
// const sheetTypes = [
//   { key: 'ojt', label: 'OJT', color: 'blue' },
//   { key: 'tenCycle', label: '10 Cycle', color: 'emerald' },
//   { key: 'skillEvaluation', label: 'Skill Evaluation', color: 'purple' },
//   { key: 'others', label: 'Others', color: 'orange' },
//   { key: 'evaluation', label: 'Evaluation', color: 'pink' },
//   { key: 'maruA', label: 'Maru A', color: 'red' },
// ] as const;

// type SheetType = typeof sheetTypes[number]['key'];

// const sheetKeyToField: Record<SheetType, string> = {
//   ojt: 'ojt_enabled',
//   tenCycle: 'ten_cycle_enabled',
//   skillEvaluation: 'skill_evaluation_enabled',
//   others: 'others_enabled',
//   evaluation: 'evaluation_enabled',
//   maruA: 'maru_a_enabled',
// };

// const CONFIGS_BASE = `${API_ENDPOINTS.BASE_URL}/station-sheet-configs`;
// const CONFIGS_BY_COMPOSITE = `${CONFIGS_BASE}/by-composite/`;

// // ---------------- API Helpers ----------------
// async function fetchByComposite(
//   level_id: number,
//   department_id: number,
//   line_id: number | null,
//   subline_id: number | null,
//   station_id: number
// ) {
//   const params = new URLSearchParams();
//   params.set('level_id', String(level_id));
//   params.set('department_id', String(department_id));
//   if (line_id !== null && line_id !== undefined) params.set('line_id', String(line_id));
//   if (subline_id !== null && subline_id !== undefined) params.set('subline_id', String(subline_id));
//   params.set('station_id', String(station_id));

//   const url = `${CONFIGS_BY_COMPOSITE}?${params.toString()}`;
//   const resp = await fetch(url, { method: 'GET' });
//   if (resp.status === 404) return null;
//   if (!resp.ok) {
//     const text = await resp.text();
//     throw new Error(`fetchByComposite error: ${resp.status} ${text}`);
//   }
//   return resp.json();
// }

// async function createConfig(payload: any) {
//   const resp = await fetch(CONFIGS_BASE + '/', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   if (resp.status === 201) return resp.json();
//   if (resp.status === 409) {
//     return resp.json();
//   }
//   const text = await resp.text();
//   throw new Error(`createConfig failed: ${resp.status} ${text}`);
// }

// async function patchConfig(id: number, payload: any) {
//   const resp = await fetch(`${CONFIGS_BASE}/${id}/`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!resp.ok) {
//     const text = await resp.text();
//     throw new Error(`patchConfig failed: ${resp.status} ${text}`);
//   }
//   return resp.json();
// }

// // ---------------- Component ----------------
// export default function MatrixConfiguration() {
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
//   const [allHierarchies, setAllHierarchies] = useState<Map<number, HierarchyStructure>>(new Map());
//   const [selectedKey, setSelectedKey] = useState<ConfigurationKey>({
//     level_id: null,
//     department_id: null,
//     line_id: null,
//     subline_id: null,
//   });
//   const [matrix, setMatrix] = useState<StationSheetMatrix>({});
//   const [selectedStations, setSelectedStations] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

//   // ---------------- Helper normalization functions ----------------
//   const normalizeStation = (raw: any, deptId?: number, lineId?: number, sublineId?: number): Station => ({
//     id: raw.station_id ?? raw.id,
//     station_name: String(raw.station_name ?? raw.name ?? `Station-${raw.station_id ?? raw.id}`).trim(),
//     department_id: deptId,
//     line_id: lineId,
//     subline_id: sublineId,
//   });

//   const normalizeSubline = (raw: any, deptId?: number, lineId?: number): Subline => ({
//     id: raw.subline_id ?? raw.id,
//     subline_name: String(raw.subline_name ?? raw.name ?? `Subline-${raw.subline_id ?? raw.id}`).trim(),
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, lineId, raw.subline_id ?? raw.id)) : [],
//   });

//   const normalizeLine = (raw: any, deptId?: number): Line => ({
//     id: raw.line_id ?? raw.id,
//     line_name: String(raw.line_name ?? raw.name ?? `Line-${raw.line_id ?? raw.id}`).trim(),
//     sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, deptId, raw.line_id ?? raw.id)) : [],
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, raw.line_id ?? raw.id)) : [],
//   });

//   const normalizeDepartment = (raw: any): DepartmentAPI => ({
//     department_id: raw.department_id ?? raw.id ?? 0,
//     department_name: String(raw.department_name ?? raw.name ?? `Dept-${raw.department_id ?? raw.id}`).trim(),
//     lines: Array.isArray(raw.lines) ? raw.lines.map((l: any) => normalizeLine(l, raw.department_id ?? raw.id)) : [],
//     sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, raw.department_id ?? raw.id)) : [],
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, raw.department_id ?? raw.id)) : [],
//   });

//   const normalizeHierarchyResponse = (res: any): HierarchyStructure | null => {
//     if (!res) return null;
//     const first = Array.isArray(res) ? res[0] : res;

//     if (first && (first.department_id || first.department_name) && (first.lines || first.sublines || first.stations)) {
//       return {
//         id: first.id || 0,
//         department: normalizeDepartment(first)
//       };
//     }

//     if (first && first.department) {
//       return {
//         id: first.id || 0,
//         department: normalizeDepartment(first.department)
//       };
//     }

//     return null;
//   };

//   const getLevels = async (): Promise<Level[]> => {
//     const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LEVELS}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error fetching levels: ${response.statusText}`);
//     }

//     return response.json();
//   };

//   // Get all stations from all departments
//   const getAllStationsFromAllDepartments = (): Station[] => {
//     const allStations: Station[] = [];
    
//     departments.forEach(dept => {
//       const hierarchy = allHierarchies.get(dept.department_id);
//       const sourceDept = hierarchy?.department || dept;
      
//       // Department level stations
//       if (sourceDept.stations) {
//         sourceDept.stations.forEach(s => {
//           allStations.push({
//             ...s,
//             department_id: dept.department_id,
//             department_name: dept.department_name,
//           });
//         });
//       }
      
//       // Line level stations
//       if (sourceDept.lines) {
//         sourceDept.lines.forEach(line => {
//           if (line.stations) {
//             line.stations.forEach(s => {
//               allStations.push({
//                 ...s,
//                 department_id: dept.department_id,
//                 department_name: dept.department_name,
//                 line_id: line.id,
//                 line_name: line.line_name,
//               });
//             });
//           }
          
//           // Subline level stations
//           if (line.sublines) {
//             line.sublines.forEach(subline => {
//               if (subline.stations) {
//                 subline.stations.forEach(s => {
//                   allStations.push({
//                     ...s,
//                     department_id: dept.department_id,
//                     department_name: dept.department_name,
//                     line_id: line.id,
//                     line_name: line.line_name,
//                     subline_id: subline.id,
//                     subline_name: subline.subline_name,
//                   });
//                 });
//               }
//             });
//           }
//         });
//       }
      
//       // Department level sublines
//       if (sourceDept.sublines) {
//         sourceDept.sublines.forEach(subline => {
//           if (subline.stations) {
//             subline.stations.forEach(s => {
//               allStations.push({
//                 ...s,
//                 department_id: dept.department_id,
//                 department_name: dept.department_name,
//                 subline_id: subline.id,
//                 subline_name: subline.subline_name,
//               });
//             });
//           }
//         });
//       }
//     });
    
//     return allStations;
//   };

//   const availableStations: Station[] = React.useMemo(() => {
//     // All departments selected
//     if (selectedKey.department_id === 'all') {
//       return getAllStationsFromAllDepartments();
//     }
    
//     // Single department selected
//     if (!selectedKey.department_id) return [];

//     const hierarchy = allHierarchies.get(selectedKey.department_id);
//     const sourceDept: DepartmentAPI | undefined =
//       hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);

//     if (!sourceDept) return [];

//     if (selectedKey.subline_id) {
//       const lineSublines = (sourceDept.lines || []).flatMap(l => l.sublines || []);
//       const deptSublines = sourceDept.sublines || [];
//       const allSublines = [...lineSublines, ...deptSublines];
//       const sub = allSublines.find(s => s.id === selectedKey.subline_id);
//       return sub ? (sub.stations || []) : [];
//     }

//     if (selectedKey.line_id) {
//       const lineMatch = (sourceDept.lines || []).find(l => l.id === selectedKey.line_id);
//       if (!lineMatch) return [];
//       if (lineMatch.stations && lineMatch.stations.length > 0) return lineMatch.stations;
//       return (lineMatch.sublines || []).flatMap(sl => sl.stations || []);
//     }

//     return sourceDept.stations || [];
//   }, [departments, allHierarchies, selectedKey.department_id, selectedKey.line_id, selectedKey.subline_id]);

//   const isConfigurationComplete = (() => {
//     if (!selectedKey.level_id) return false;
    
//     // All departments mode - only need level selected
//     if (selectedKey.department_id === 'all') return true;
    
//     if (!selectedKey.department_id) return false;

//     const hierarchy = allHierarchies.get(selectedKey.department_id);
//     const sourceDept: DepartmentAPI | undefined =
//       hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);

//     if (!sourceDept) return false;

//     const hasLines = Array.isArray(sourceDept.lines) && sourceDept.lines.length > 0;
//     const deptSublines = Array.isArray(sourceDept.sublines) && sourceDept.sublines.length > 0;
//     const linesHaveSublines = hasLines && sourceDept.lines!.some(l => Array.isArray(l.sublines) && l.sublines!.length > 0);
//     const hasSublines = deptSublines || linesHaveSublines;

//     if (!hasLines && !hasSublines) return true;
//     if (hasLines && !hasSublines) return !!selectedKey.line_id;
//     if (hasSublines) return !!selectedKey.line_id && !!selectedKey.subline_id;

//     return false;
//   })();

//   // Initialize matrix when stations are available
//   useEffect(() => {
//     let cancelled = false;

//     const stationIdsKey = availableStations.map(s => `${s.id}-${s.department_id}`).join(',');

//     const initOrLoadMatrix = async () => {
//       if (!(availableStations.length > 0 && isConfigurationComplete)) {
//         setMatrix({});
//         return;
//       }

//       const localMatrix: StationSheetMatrix = {};
//       availableStations.forEach((station) => {
//         const key = `${station.id}-${station.department_id}-${station.line_id || 0}-${station.subline_id || 0}`;
//         localMatrix[key] = {
//           ojt: false,
//           tenCycle: false,
//           skillEvaluation: false,
//           others: false,
//           evaluation: false,
//           maruA: false,
//           station_id: station.id,
//           department_id: station.department_id!,
//           line_id: station.line_id || null,
//           subline_id: station.subline_id || null,
//         };
//       });
//       setMatrix(localMatrix);

//       try {
//         const fetchJobs = availableStations.map(station =>
//           fetchByComposite(
//             selectedKey.level_id as number,
//             station.department_id!,
//             station.line_id || null,
//             station.subline_id || null,
//             station.id
//           ).then((res: any) => ({ station, res })).catch((err) => {
//             console.debug('by-composite fetch error for', station.station_name, err);
//             return { station, res: null };
//           })
//         );

//         const results = await Promise.all(fetchJobs);

//         if (cancelled) return;

//         const merged: StationSheetMatrix = { ...localMatrix };
//         results.forEach(({ station, res }) => {
//           const obj = res && (res.existing ?? res);
//           const key = `${station.id}-${station.department_id}-${station.line_id || 0}-${station.subline_id || 0}`;
//           if (obj && (obj.id || obj.id === 0)) {
//             merged[key] = {
//               ojt: !!obj.ojt_enabled,
//               tenCycle: !!obj.ten_cycle_enabled,
//               skillEvaluation: !!obj.skill_evaluation_enabled,
//               others: !!obj.others_enabled,
//               evaluation: !!obj.evaluation_enabled,
//               maruA: !!obj.maru_a_enabled,
//               station_id: station.id,
//               department_id: station.department_id!,
//               line_id: station.line_id || null,
//               subline_id: station.subline_id || null,
//             };
//           }
//         });

//         setMatrix(merged);
//       } catch (err) {
//         console.error('initOrLoadMatrix error', err);
//       }
//     };

//     initOrLoadMatrix();

//     return () => { cancelled = true; };
//   }, [
//     availableStations.length,
//     availableStations.map(s => `${s.id}-${s.department_id}`).join(','),
//     isConfigurationComplete,
//     selectedKey.level_id,
//     selectedKey.department_id,
//     selectedKey.line_id,
//     selectedKey.subline_id,
//   ]);

//   // Fetch levels and departments on mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const levelsData = await getLevels();
//         const allowedLevels = levelsData.filter((l: Level) => l.level_id !== 1);
//         setLevels(allowedLevels);

//         const res = await ProcessDojo.fetchDepartments();
//         const incomingDepartments = Array.isArray(res) ? res : res?.departments ?? [];
//         const normalized = incomingDepartments.map((d: any) => normalizeDepartment(d));
//         setDepartments(normalized);

//         // Load all hierarchies
//         const hierarchyMap = new Map<number, HierarchyStructure>();
//         await Promise.all(
//           normalized.map(async (dept: DepartmentAPI) => {
//             try {
//               const hierarchyRes = await ProcessDojo.fetchHierarchyByDepartment(dept.department_id);
//               const normalizedHierarchy = normalizeHierarchyResponse(hierarchyRes);
//               if (normalizedHierarchy) {
//                 hierarchyMap.set(dept.department_id, normalizedHierarchy);
//               }
//             } catch (err) {
//               console.error(`Error loading hierarchy for dept ${dept.department_id}`, err);
//             }
//           })
//         );
//         setAllHierarchies(hierarchyMap);
//       } catch (err) {
//         console.error('fetchInitialData error', err);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleDepartmentChange = (value: string) => {
//     if (value === 'all') {
//       setSelectedKey(prev => ({ 
//         ...prev, 
//         department_id: 'all', 
//         line_id: null, 
//         subline_id: null 
//       }));
//     } else {
//       const departmentId = value ? Number(value) : null;
//       setSelectedKey(prev => ({ 
//         ...prev, 
//         department_id: departmentId, 
//         line_id: null, 
//         subline_id: null 
//       }));
//     }
//   };

//   const handleKeyChange = (field: keyof ConfigurationKey, value: number | null) => {
//     setSelectedKey(prev => ({
//       ...prev,
//       [field]: value,
//       ...(field === 'level_id' && { department_id: null, line_id: null, subline_id: null }),
//       ...(field === 'department_id' && { line_id: null, subline_id: null }),
//     }));
//   };

//   const persistStationConfig = async (stationKey: string, stationState: StationSheetMatrix[string]) => {
//     if (!isConfigurationComplete) return;

//     const payload: any = {
//       level_id: selectedKey.level_id,
//       department_id: stationState.department_id,
//       line_id: stationState.line_id || null,
//       subline_id: stationState.subline_id || null,
//       station_id: stationState.station_id,
//       ojt_enabled: !!stationState.ojt,
//       ten_cycle_enabled: !!stationState.tenCycle,
//       skill_evaluation_enabled: !!stationState.skillEvaluation,
//       others_enabled: !!stationState.others,
//       evaluation_enabled: !!stationState.evaluation,
//       maru_a_enabled: !!stationState.maruA,
//     };

//     try {
//       const existing = await fetchByComposite(
//         selectedKey.level_id as number,
//         stationState.department_id,
//         stationState.line_id,
//         stationState.subline_id,
//         stationState.station_id
//       );

//       if (!existing) {
//         await createConfig(payload);
//       } else {
//         const existingObj = existing.existing ?? existing;
//         const id = existingObj.id;
//         await patchConfig(id, payload);
//       }
//     } catch (err) {
//       console.error('persistStationConfig error', err);
//       throw err;
//     }
//   };

//   const handleCellToggle = (stationKey: string, sheetType: SheetType) => {
//     setMatrix(prev => {
//       const newState = {
//         ...prev,
//         [stationKey]: {
//           ...prev[stationKey],
//           [sheetType]: !prev[stationKey]?.[sheetType],
//         },
//       };
//       return newState;
//     });
//   };

//   const handleStationSelect = (stationKey: string) => {
//     setSelectedStations(prev => (
//       prev.includes(stationKey) ? prev.filter(s => s !== stationKey) : [...prev, stationKey]
//     ));
//   };

//   const handleSelectAllStations = () => {
//     const allKeys = Object.keys(matrix);
//     if (selectedStations.length === allKeys.length) {
//       setSelectedStations([]);
//     } else {
//       setSelectedStations(allKeys);
//     }
//   };

//   const handleBulkSheetToggle = (sheetType: SheetType) => {
//     if (selectedStations.length === 0) return;
//     const allSelected = selectedStations.every(key => matrix[key]?.[sheetType]);

//     setMatrix(prev => {
//       const newMatrix = { ...prev };
//       selectedStations.forEach(key => {
//         if (newMatrix[key]) {
//           newMatrix[key][sheetType] = !allSelected;
//         }
//       });
//       return newMatrix;
//     });
//   };

//   const handleApplyToAll = (sheetType: SheetType, enable: boolean) => {
//     setMatrix(prev => {
//       const newMatrix = { ...prev };
//       Object.keys(newMatrix).forEach(key => {
//         newMatrix[key][sheetType] = enable;
//       });
//       return newMatrix;
//     });
//   };

//   const handleApplyAllSheetsToAll = (enable: boolean) => {
//     setMatrix(prev => {
//       const newMatrix = { ...prev };
//       Object.keys(newMatrix).forEach(key => {
//         newMatrix[key] = {
//           ...newMatrix[key],
//           ojt: enable,
//           tenCycle: enable,
//           skillEvaluation: enable,
//           others: enable,
//           evaluation: enable,
//           maruA: enable,
//         };
//       });
//       return newMatrix;
//     });
//   };

//   const handleSave = async () => {
//     if (!isConfigurationComplete) return;
//     setSaveStatus('saving');

//     try {
//       const jobs: Promise<any>[] = Object.entries(matrix).map(([key, stationState]) => {
//         return persistStationConfig(key, stationState);
//       });

//       await Promise.all(jobs);

//       setSaveStatus('saved');
//       setTimeout(() => setSaveStatus('idle'), 1500);
//     } catch (err) {
//       console.error('Full save failed', err);
//       setSaveStatus('error');
//       setTimeout(() => setSaveStatus('idle'), 2000);
//     }
//   };

//   const handleReset = () => {
//     const newMatrix: StationSheetMatrix = {};
//     Object.entries(matrix).forEach(([key, value]) => {
//       newMatrix[key] = {
//         ojt: false,
//         tenCycle: false,
//         skillEvaluation: false,
//         others: false,
//         evaluation: false,
//         maruA: false,
//         station_id: value.station_id,
//         department_id: value.department_id,
//         line_id: value.line_id,
//         subline_id: value.subline_id,
//       };
//     });
//     setMatrix(newMatrix);
//     setSelectedStations([]);
//   };

//   const getSheetColor = (color: string) => {
//     const colors: Record<string, string> = {
//       blue: 'bg-blue-500 hover:bg-blue-600 text-white',
//       emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white',
//       purple: 'bg-purple-500 hover:bg-purple-600 text-white',
//       orange: 'bg-orange-500 hover:bg-orange-600 text-white',
//       pink: 'bg-pink-500 hover:bg-pink-600 text-white',
//       red: 'bg-red-500 hover:bg-red-600 text-white',
//     };
//     return colors[color] || colors.blue;
//   };

//   const getTotalActiveSheets = () => {
//     return Object.values(matrix).reduce((total, stationSheets) => {
//       return total + Object.values(stationSheets).filter(v => typeof v === 'boolean' && v).length;
//     }, 0);
//   };

//   const getStationDisplayInfo = (station: Station) => {
//     const parts = [station.station_name];
//     if (selectedKey.department_id === 'all') {
//       if (station.department_name) parts.push(station.department_name);
//       if (station.line_name) parts.push(station.line_name);
//       if (station.subline_name) parts.push(station.subline_name);
//     }
//     return parts.join(' > ');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       <div className="container mx-auto px-6 py-8">
//         <div className="mb-8">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
//               <Settings className="w-7 h-7 text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900">Method Configuration Matrix</h1>
//               <p className="text-gray-600 text-lg mt-1">Configure evaluation sheets for stations across departments</p>
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//               <Target className="w-6 h-6 text-blue-600" />
//               Configuration Setup
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="space-y-3">
//                 <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
//                   <Layers className="w-5 h-5 text-indigo-600" />
//                   Level *
//                 </label>
//                 <select
//                   value={selectedKey.level_id ?? ''}
//                   onChange={(e) => handleKeyChange('level_id', e.target.value ? Number(e.target.value) : null)}
//                   className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-900 font-medium shadow-sm"
//                 >
//                   <option value="">Select Level</option>
//                   {levels.map(level => (
//                     <option key={level.level_id} value={level.level_id}>{level.level_name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-3">
//                 <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
//                   <Building2 className="w-5 h-5 text-blue-600" />
//                   Department *
//                 </label>
//                 <select
//                   value={selectedKey.department_id ?? ''}
//                   onChange={(e) => handleDepartmentChange(e.target.value)}
//                   className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 font-medium shadow-sm"
//                 >
//                   <option value="">Select Department</option>
//                   <option value="all" className="font-bold text-indigo-600"> All Departments</option>
//                   {departments.map(dept => (
//                     <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
//                   ))}
//                 </select>
//               </div>

//               {selectedKey.department_id !== 'all' && (
//                 <>
//                   <div className="space-y-3">
//                     <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
//                       <Factory className="w-5 h-5 text-emerald-600" />
//                       Line {selectedKey.department_id && '*'}
//                     </label>
//                     <select
//                       value={selectedKey.line_id ?? ''}
//                       onChange={(e) => handleKeyChange('line_id', e.target.value ? Number(e.target.value) : null)}
//                       className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white text-gray-900 font-medium shadow-sm"
//                       disabled={!selectedKey.department_id}
//                     >
//                       <option value="">Select Line</option>
//                       {(() => {
//                         if (!selectedKey.department_id || selectedKey.department_id === 'all') return null;
//                         const hierarchy = allHierarchies.get(selectedKey.department_id);
//                         const dept = hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);
//                         return (dept?.lines || []).map((line) => (
//                           <option key={line.id} value={line.id}>{line.line_name}</option>
//                         ));
//                       })()}
//                     </select>
//                   </div>

//                   <div className="space-y-3">
//                     <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
//                       <Target className="w-5 h-5 text-purple-600" />
//                       Subline {selectedKey.line_id && '*'}
//                     </label>
//                     <select
//                       value={selectedKey.subline_id ?? ''}
//                       onChange={(e) => handleKeyChange('subline_id', e.target.value ? Number(e.target.value) : null)}
//                       className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-gray-900 font-medium shadow-sm"
//                       disabled={!selectedKey.line_id}
//                     >
//                       <option value="">Select Subline</option>
//                       {(() => {
//                         if (!selectedKey.department_id || selectedKey.department_id === 'all' || !selectedKey.line_id) return null;
//                         const hierarchy = allHierarchies.get(selectedKey.department_id);
//                         const dept = hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);
//                         const line = (dept?.lines || []).find(l => l.id === selectedKey.line_id);
//                         const sublines = line ? (line.sublines || []) : (dept?.sublines || []);
//                         return sublines.map(sl => <option key={sl.id} value={sl.id}>{sl.subline_name}</option>);
//                       })()}
//                     </select>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {isConfigurationComplete && (
//           <div className="space-y-6">
//             {selectedKey.department_id === 'all' && (
//               <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl border-2 border-indigo-300">
//                 <div className="flex items-center gap-3 text-white">
//                   <Globe className="w-8 h-8" />
//                   <div>
//                     <h3 className="text-2xl font-bold">All Departments Mode</h3>
//                     <p className="text-indigo-100 mt-1">You are configuring stations across all departments</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
//               <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//                 <Zap className="w-7 h-7 text-purple-600" />
//                 Quick Apply Controls
//               </h3>

//               <div className="space-y-4">
//                 <div className="flex flex-wrap items-center gap-4">
//                   {sheetTypes.slice(0, 4).map(({ key, label }) => (
//                     <div key={key} className="flex items-center bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
//                       <button
//                         onClick={() => handleApplyToAll(key, true)}
//                         className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station => station?.[key])
//                             ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
//                             : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
//                           }`}
//                       >
//                         {label}
//                       </button>
//                       <button
//                         onClick={() => handleApplyToAll(key, false)}
//                         className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station => !station?.[key])
//                             ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
//                             : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
//                           }`}
//                       >
//                         Disable
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-4">
//                   {sheetTypes.slice(4).map(({ key, label }) => (
//                     <div key={key} className="flex items-center bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
//                       <button
//                         onClick={() => handleApplyToAll(key, true)}
//                         className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station => station?.[key])
//                             ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
//                             : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
//                           }`}
//                       >
//                         {label}
//                       </button>
//                       <button
//                         onClick={() => handleApplyToAll(key, false)}
//                         className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station => !station?.[key])
//                             ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
//                             : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
//                           }`}
//                       >
//                         Disable
//                       </button>
//                     </div>
//                   ))}

//                   <div className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-indigo-300 shadow-lg hover:shadow-xl transition-all">
//                     <button
//                       onClick={() => handleApplyAllSheetsToAll(true)}
//                       className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station =>
//                         station?.ojt || station?.tenCycle || station?.skillEvaluation || station?.others || station?.evaluation
//                       )
//                           ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
//                           : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
//                         }`}
//                     >
//                       Enable All
//                     </button>
//                     <button
//                       onClick={() => handleApplyAllSheetsToAll(false)}
//                       className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station =>
//                         !station?.ojt && !station?.tenCycle && !station?.skillEvaluation && !station?.others && !station?.evaluation
//                       )
//                           ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
//                           : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
//                         }`}
//                     >
//                       Disable All
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
//                   <div className="text-2xl font-bold text-blue-600">{availableStations.length}</div>
//                   <div className="text-sm text-gray-600">Total Stations</div>
//                 </div>
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
//                   <div className="text-2xl font-bold text-emerald-600">{selectedStations.length}</div>
//                   <div className="text-sm text-gray-600">Selected Stations</div>
//                 </div>
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
//                   <div className="text-2xl font-bold text-purple-600">{getTotalActiveSheets()}</div>
//                   <div className="text-sm text-gray-600">Active Sheets</div>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button onClick={handleReset} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all flex items-center gap-2 shadow-sm">
//                   <RotateCcw className="w-5 h-5" />
//                   Reset
//                 </button>
//                 <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${saveStatus === 'saved' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : saveStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'}`}>
//                   {saveStatus === 'saving' ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Saving...
//                     </>
//                   ) : saveStatus === 'saved' ? (
//                     <>
//                       <CheckCircle className="w-5 h-5" />
//                       Saved!
//                     </>
//                   ) : saveStatus === 'error' ? (
//                     <>
//                       <AlertCircle className="w-5 h-5" />
//                       Error
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5" />
//                       Save Configuration
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
//                       <th className="sticky left-0 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 text-left">
//                         <div className="flex items-center gap-3">
//                           <button onClick={handleSelectAllStations} className="text-white hover:text-blue-300 transition-colors">
//                             {selectedStations.length === Object.keys(matrix).length ? (
//                               <CheckSquare className="w-5 h-5" />
//                             ) : (
//                               <Square className="w-5 h-5" />
//                             )}
//                           </button>
//                           <span className="text-white font-bold text-lg">Stations</span>
//                         </div>
//                       </th>
//                       {sheetTypes.map(({ key, label, color }) => (
//                         <th key={key} className="px-4 py-4 text-center min-w-[140px]">
//                           <button
//                             onClick={() => handleBulkSheetToggle(key)}
//                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${getSheetColor(color)}`}
//                           >
//                             {label}
//                           </button>
//                           {selectedStations.length > 0 && <div className="text-xs text-gray-300 mt-1">Toggle {selectedStations.length} selected</div>}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {Object.entries(matrix).map(([key, stationData], index) => {
//                       const station = availableStations.find(s => 
//                         `${s.id}-${s.department_id}-${s.line_id || 0}-${s.subline_id || 0}` === key
//                       );
//                       if (!station) return null;
                      
//                       return (
//                         <tr key={key} className={`border-b border-gray-200 hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white/50'}`}>
//                           <td className="sticky left-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-r border-gray-200">
//                             <div className="flex items-center gap-3">
//                               <button onClick={() => handleStationSelect(key)} className={`transition-colors ${selectedStations.includes(key) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
//                                 {selectedStations.includes(key) ? (<CheckSquare className="w-5 h-5" />) : (<Square className="w-5 h-5" />)}
//                               </button>
//                               <span className={`font-medium ${selectedStations.includes(key) ? 'text-blue-900' : 'text-gray-700'}`}>
//                                 {getStationDisplayInfo(station)}
//                               </span>
//                             </div>
//                           </td>
//                           {sheetTypes.map(({ key: sheetKey, color }) => (
//                             <td key={sheetKey} className="px-4 py-4 text-center">
//                               <button onClick={() => handleCellToggle(key, sheetKey)} className={`w-8 h-8 rounded-lg border-2 transition-all ${stationData?.[sheetKey] ? `${getSheetColor(color)} border-transparent shadow-md` : 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400'}`}>
//                                 {stationData?.[sheetKey] && (<CheckCircle className="w-5 h-5 mx-auto" />)}
//                               </button>
//                             </td>
//                           ))}
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {!isConfigurationComplete && (
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/50">
//             <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-2xl font-bold text-gray-600 mb-2">Select Configuration</h3>
//             <p className="text-gray-500 text-lg">
//               {selectedKey.department_id === 'all' 
//                 ? 'Please select a Level to start configuring all departments' 
//                 : 'Please select Level and Department (or Line/Subline if required) to start configuring'}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// src/components/organisms/MatrixConfiguration/MatrixConfiguration.tsx

import React, { useEffect, useState } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle,
  Square,
  CheckSquare,
  Settings,
  Factory,
  Target,
  Building2,
  AlertCircle,
  Layers,
  Zap,
  Globe,
} from 'lucide-react';
import { ProcessDojo } from '../../hooks/ServiceApis';
import { API_ENDPOINTS } from '../../constants/api';

// ---------------- Types ----------------
interface Station {
  id: number;
  station_name: string;
  department_id?: number;
  department_name?: string;
  line_id?: number;
  line_name?: string;
  subline_id?: number;
  subline_name?: string;
}

interface Subline {
  id: number;
  subline_name: string;
  stations: Station[];
}

interface Line {
  id: number;
  line_name: string;
  sublines: Subline[];
  stations?: Station[];
}

interface DepartmentAPI {
  department_id: number;
  department_name: string;
  lines?: Line[];
  sublines?: Subline[];
  stations?: Station[];
}

interface HierarchyStructure {
  id: number;
  department: DepartmentAPI;
}

interface Level {
  level_id: number;
  level_name: string;
  days: any[];
  colours: any[];
}

interface StationSheetMatrix {
  [stationKey: string]: {
    ojt: boolean;
    tenCycle: boolean;
    skillEvaluation: boolean;
    others: boolean;
    evaluation: boolean;
    maruA: boolean;
    station_id: number;
    department_id: number;
    line_id: number | null;
    subline_id: number | null;
  };
}

interface ConfigurationKey {
  level_id: number | null;
  department_id: number | null | 'all';
  line_id: number | null;
  subline_id: number | null;
}

// ---------------- Constants ----------------
const sheetTypes = [
  { key: 'ojt', label: 'OJT', color: 'blue' },
  { key: 'tenCycle', label: '10 Cycle', color: 'emerald' },
  { key: 'skillEvaluation', label: 'Skill Evaluation', color: 'purple' },
  { key: 'others', label: 'Others', color: 'orange' },
  { key: 'evaluation', label: 'Evaluation', color: 'pink' },
  { key: 'maruA', label: 'Maru A', color: 'red' },
] as const;

type SheetType = typeof sheetTypes[number]['key'];

const sheetKeyToField: Record<SheetType, string> = {
  ojt: 'ojt_enabled',
  tenCycle: 'ten_cycle_enabled',
  skillEvaluation: 'skill_evaluation_enabled',
  others: 'others_enabled',
  evaluation: 'evaluation_enabled',
  maruA: 'maru_a_enabled',
};

const CONFIGS_BASE = `${API_ENDPOINTS.BASE_URL}/station-sheet-configs`;
const CONFIGS_BY_COMPOSITE = `${CONFIGS_BASE}/by-composite/`;

// ---------------- API Helpers ----------------
async function fetchByComposite(
  level_id: number,
  department_id: number,
  line_id: number | null,
  subline_id: number | null,
  station_id: number
) {
  const params = new URLSearchParams();
  params.set('level_id', String(level_id));
  params.set('department_id', String(department_id));
  if (line_id !== null && line_id !== undefined) params.set('line_id', String(line_id));
  if (subline_id !== null && subline_id !== undefined) params.set('subline_id', String(subline_id));
  params.set('station_id', String(station_id));

  const url = `${CONFIGS_BY_COMPOSITE}?${params.toString()}`;
  const resp = await fetch(url, { method: 'GET' });
  if (resp.status === 404) return null;
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`fetchByComposite error: ${resp.status} ${text}`);
  }
  return resp.json();
}

async function createConfig(payload: any) {
  const resp = await fetch(CONFIGS_BASE + '/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (resp.status === 201) return resp.json();
  if (resp.status === 409) {
    return resp.json();
  }
  const text = await resp.text();
  throw new Error(`createConfig failed: ${resp.status} ${text}`);
}

async function patchConfig(id: number, payload: any) {
  const resp = await fetch(`${CONFIGS_BASE}/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`patchConfig failed: ${resp.status} ${text}`);
  }
  return resp.json();
}

// ---------------- Component ----------------
export default function MatrixConfiguration() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
  const [allHierarchies, setAllHierarchies] = useState<Map<number, HierarchyStructure>>(new Map());
  const [selectedKey, setSelectedKey] = useState<ConfigurationKey>({
    level_id: null,
    department_id: null,
    line_id: null,
    subline_id: null,
  });
  const [matrix, setMatrix] = useState<StationSheetMatrix>({});
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // ---------------- Helper normalization functions ----------------
  const normalizeStation = (raw: any, deptId?: number, lineId?: number, sublineId?: number): Station => ({
    id: raw.station_id ?? raw.id,
    station_name: String(raw.station_name ?? raw.name ?? `Station-${raw.station_id ?? raw.id}`).trim(),
    department_id: deptId,
    line_id: lineId,
    subline_id: sublineId,
  });

  const normalizeSubline = (raw: any, deptId?: number, lineId?: number): Subline => ({
    id: raw.subline_id ?? raw.id,
    subline_name: String(raw.subline_name ?? raw.name ?? `Subline-${raw.subline_id ?? raw.id}`).trim(),
    stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, lineId, raw.subline_id ?? raw.id)) : [],
  });

  const normalizeLine = (raw: any, deptId?: number): Line => ({
    id: raw.line_id ?? raw.id,
    line_name: String(raw.line_name ?? raw.name ?? `Line-${raw.line_id ?? raw.id}`).trim(),
    sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, deptId, raw.line_id ?? raw.id)) : [],
    stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, raw.line_id ?? raw.id)) : [],
  });

  const normalizeDepartment = (raw: any): DepartmentAPI => ({
    department_id: raw.department_id ?? raw.id ?? 0,
    department_name: String(raw.department_name ?? raw.name ?? `Dept-${raw.department_id ?? raw.id}`).trim(),
    lines: Array.isArray(raw.lines) ? raw.lines.map((l: any) => normalizeLine(l, raw.department_id ?? raw.id)) : [],
    sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, raw.department_id ?? raw.id)) : [],
    stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, raw.department_id ?? raw.id)) : [],
  });

  const normalizeHierarchyResponse = (res: any): HierarchyStructure | null => {
    if (!res) return null;
    const first = Array.isArray(res) ? res[0] : res;

    if (first && (first.department_id || first.department_name) && (first.lines || first.sublines || first.stations)) {
      return {
        id: first.id || 0,
        department: normalizeDepartment(first)
      };
    }

    if (first && first.department) {
      return {
        id: first.id || 0,
        department: normalizeDepartment(first.department)
      };
    }

    return null;
  };

  const getLevels = async (): Promise<Level[]> => {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LEVELS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching levels: ${response.statusText}`);
    }

    return response.json();
  };

  // Get all stations from all departments
  const getAllStationsFromAllDepartments = (): Station[] => {
    const allStations: Station[] = [];
    
    departments.forEach(dept => {
      const hierarchy = allHierarchies.get(dept.department_id);
      const sourceDept = hierarchy?.department || dept;
      
      // Department level stations
      if (sourceDept.stations) {
        sourceDept.stations.forEach(s => {
          allStations.push({
            ...s,
            department_id: dept.department_id,
            department_name: dept.department_name,
          });
        });
      }
      
      // Line level stations
      if (sourceDept.lines) {
        sourceDept.lines.forEach(line => {
          if (line.stations) {
            line.stations.forEach(s => {
              allStations.push({
                ...s,
                department_id: dept.department_id,
                department_name: dept.department_name,
                line_id: line.id,
                line_name: line.line_name,
              });
            });
          }
          
          // Subline level stations
          if (line.sublines) {
            line.sublines.forEach(subline => {
              if (subline.stations) {
                subline.stations.forEach(s => {
                  allStations.push({
                    ...s,
                    department_id: dept.department_id,
                    department_name: dept.department_name,
                    line_id: line.id,
                    line_name: line.line_name,
                    subline_id: subline.id,
                    subline_name: subline.subline_name,
                  });
                });
              }
            });
          }
        });
      }
      
      // Department level sublines
      if (sourceDept.sublines) {
        sourceDept.sublines.forEach(subline => {
          if (subline.stations) {
            subline.stations.forEach(s => {
              allStations.push({
                ...s,
                department_id: dept.department_id,
                department_name: dept.department_name,
                subline_id: subline.id,
                subline_name: subline.subline_name,
              });
            });
          }
        });
      }
    });
    
    return allStations;
  };

  const availableStations: Station[] = React.useMemo(() => {
    // All departments selected
    if (selectedKey.department_id === 'all') {
      return getAllStationsFromAllDepartments();
    }
    
    // Single department selected
    if (!selectedKey.department_id) return [];

    const hierarchy = allHierarchies.get(selectedKey.department_id);
    const sourceDept: DepartmentAPI | undefined =
      hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);

    if (!sourceDept) return [];

    if (selectedKey.subline_id) {
      const lineSublines = (sourceDept.lines || []).flatMap(l => l.sublines || []);
      const deptSublines = sourceDept.sublines || [];
      const allSublines = [...lineSublines, ...deptSublines];
      const sub = allSublines.find(s => s.id === selectedKey.subline_id);
      return sub ? (sub.stations || []) : [];
    }

    if (selectedKey.line_id) {
      const lineMatch = (sourceDept.lines || []).find(l => l.id === selectedKey.line_id);
      if (!lineMatch) return [];
      if (lineMatch.stations && lineMatch.stations.length > 0) return lineMatch.stations;
      return (lineMatch.sublines || []).flatMap(sl => sl.stations || []);
    }

    return sourceDept.stations || [];
  }, [departments, allHierarchies, selectedKey.department_id, selectedKey.line_id, selectedKey.subline_id]);

  const isConfigurationComplete = (() => {
    if (!selectedKey.level_id) return false;
    
    // All departments mode - only need level selected
    if (selectedKey.department_id === 'all') return true;
    
    if (!selectedKey.department_id) return false;

    const hierarchy = allHierarchies.get(selectedKey.department_id);
    const sourceDept: DepartmentAPI | undefined =
      hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);

    if (!sourceDept) return false;

    const hasLines = Array.isArray(sourceDept.lines) && sourceDept.lines.length > 0;
    const deptSublines = Array.isArray(sourceDept.sublines) && sourceDept.sublines.length > 0;
    const linesHaveSublines = hasLines && sourceDept.lines!.some(l => Array.isArray(l.sublines) && l.sublines!.length > 0);
    const hasSublines = deptSublines || linesHaveSublines;

    if (!hasLines && !hasSublines) return true;
    if (hasLines && !hasSublines) return !!selectedKey.line_id;
    if (hasSublines) return !!selectedKey.line_id && !!selectedKey.subline_id;

    return false;
  })();

  // Initialize matrix when stations are available
  useEffect(() => {
    let cancelled = false;

    const stationIdsKey = availableStations.map(s => `${s.id}-${s.department_id}`).join(',');

    const initOrLoadMatrix = async () => {
      if (!(availableStations.length > 0 && isConfigurationComplete)) {
        setMatrix({});
        return;
      }

      const localMatrix: StationSheetMatrix = {};
      availableStations.forEach((station) => {
        const key = `${station.id}-${station.department_id}-${station.line_id || 0}-${station.subline_id || 0}`;
        localMatrix[key] = {
          ojt: false,
          tenCycle: false,
          skillEvaluation: false,
          others: false,
          evaluation: false,
          maruA: false,
          station_id: station.id,
          department_id: station.department_id!,
          line_id: station.line_id || null,
          subline_id: station.subline_id || null,
        };
      });
      setMatrix(localMatrix);

      try {
        const fetchJobs = availableStations.map(station =>
          fetchByComposite(
            selectedKey.level_id as number,
            station.department_id!,
            station.line_id || null,
            station.subline_id || null,
            station.id
          ).then((res: any) => ({ station, res })).catch((err) => {
            console.debug('by-composite fetch error for', station.station_name, err);
            return { station, res: null };
          })
        );

        const results = await Promise.all(fetchJobs);

        if (cancelled) return;

        const merged: StationSheetMatrix = { ...localMatrix };
        results.forEach(({ station, res }) => {
          const obj = res && (res.existing ?? res);
          const key = `${station.id}-${station.department_id}-${station.line_id || 0}-${station.subline_id || 0}`;
          if (obj && (obj.id || obj.id === 0)) {
            merged[key] = {
              ojt: !!obj.ojt_enabled,
              tenCycle: !!obj.ten_cycle_enabled,
              skillEvaluation: !!obj.skill_evaluation_enabled,
              others: !!obj.others_enabled,
              evaluation: !!obj.evaluation_enabled,
              maruA: !!obj.maru_a_enabled,
              station_id: station.id,
              department_id: station.department_id!,
              line_id: station.line_id || null,
              subline_id: station.subline_id || null,
            };
          }
        });

        setMatrix(merged);
      } catch (err) {
        console.error('initOrLoadMatrix error', err);
      }
    };

    initOrLoadMatrix();

    return () => { cancelled = true; };
  }, [
    availableStations.length,
    availableStations.map(s => `${s.id}-${s.department_id}`).join(','),
    isConfigurationComplete,
    selectedKey.level_id,
    selectedKey.department_id,
    selectedKey.line_id,
    selectedKey.subline_id,
  ]);

  // Fetch levels and departments on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const levelsData = await getLevels();
        const allowedLevels = levelsData.filter((l: Level) => l.level_id !== 1);
        setLevels(allowedLevels);

        const res = await ProcessDojo.fetchDepartments();
        const incomingDepartments = Array.isArray(res) ? res : res?.departments ?? [];
        const normalized = incomingDepartments.map((d: any) => normalizeDepartment(d));
        setDepartments(normalized);

        // Load all hierarchies
        const hierarchyMap = new Map<number, HierarchyStructure>();
        await Promise.all(
          normalized.map(async (dept: DepartmentAPI) => {
            try {
              const hierarchyRes = await ProcessDojo.fetchHierarchyByDepartment(dept.department_id);
              const normalizedHierarchy = normalizeHierarchyResponse(hierarchyRes);
              if (normalizedHierarchy) {
                hierarchyMap.set(dept.department_id, normalizedHierarchy);
              }
            } catch (err) {
              console.error(`Error loading hierarchy for dept ${dept.department_id}`, err);
            }
          })
        );
        setAllHierarchies(hierarchyMap);
      } catch (err) {
        console.error('fetchInitialData error', err);
      }
    };

    fetchInitialData();
  }, []);

  const handleDepartmentChange = (value: string) => {
    if (value === 'all') {
      setSelectedKey(prev => ({ 
        ...prev, 
        department_id: 'all', 
        line_id: null, 
        subline_id: null 
      }));
    } else {
      const departmentId = value ? Number(value) : null;
      setSelectedKey(prev => ({ 
        ...prev, 
        department_id: departmentId, 
        line_id: null, 
        subline_id: null 
      }));
    }
  };

  const handleKeyChange = (field: keyof ConfigurationKey, value: number | null) => {
    setSelectedKey(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'level_id' && { department_id: null, line_id: null, subline_id: null }),
      ...(field === 'department_id' && { line_id: null, subline_id: null }),
    }));
  };

  const persistStationConfig = async (stationKey: string, stationState: StationSheetMatrix[string]) => {
    if (!isConfigurationComplete) return;

    const payload: any = {
      level_id: selectedKey.level_id,
      department_id: stationState.department_id,
      line_id: stationState.line_id || null,
      subline_id: stationState.subline_id || null,
      station_id: stationState.station_id,
      ojt_enabled: !!stationState.ojt,
      ten_cycle_enabled: !!stationState.tenCycle,
      skill_evaluation_enabled: !!stationState.skillEvaluation,
      others_enabled: !!stationState.others,
      evaluation_enabled: !!stationState.evaluation,
      maru_a_enabled: !!stationState.maruA,
    };

    try {
      const existing = await fetchByComposite(
        selectedKey.level_id as number,
        stationState.department_id,
        stationState.line_id,
        stationState.subline_id,
        stationState.station_id
      );

      if (!existing) {
        await createConfig(payload);
      } else {
        const existingObj = existing.existing ?? existing;
        const id = existingObj.id;
        await patchConfig(id, payload);
      }
    } catch (err) {
      console.error('persistStationConfig error', err);
      throw err;
    }
  };

  const handleCellToggle = (stationKey: string, sheetType: SheetType) => {
    setMatrix(prev => {
      const newState = {
        ...prev,
        [stationKey]: {
          ...prev[stationKey],
          [sheetType]: !prev[stationKey]?.[sheetType],
        },
      };
      return newState;
    });
  };

  const handleStationSelect = (stationKey: string) => {
    setSelectedStations(prev => (
      prev.includes(stationKey) ? prev.filter(s => s !== stationKey) : [...prev, stationKey]
    ));
  };

  const handleSelectAllStations = () => {
    const allKeys = Object.keys(matrix);
    if (selectedStations.length === allKeys.length) {
      setSelectedStations([]);
    } else {
      setSelectedStations(allKeys);
    }
  };

  const handleBulkSheetToggle = (sheetType: SheetType) => {
    if (selectedStations.length === 0) return;
    const allSelected = selectedStations.every(key => matrix[key]?.[sheetType]);

    setMatrix(prev => {
      const newMatrix = { ...prev };
      selectedStations.forEach(key => {
        if (newMatrix[key]) {
          newMatrix[key][sheetType] = !allSelected;
        }
      });
      return newMatrix;
    });
  };

  const handleApplyToAll = (sheetType: SheetType, enable: boolean) => {
    setMatrix(prev => {
      const newMatrix = { ...prev };
      Object.keys(newMatrix).forEach(key => {
        newMatrix[key][sheetType] = enable;
      });
      return newMatrix;
    });
  };

  const handleApplyAllSheetsToAll = (enable: boolean) => {
    setMatrix(prev => {
      const newMatrix = { ...prev };
      Object.keys(newMatrix).forEach(key => {
        newMatrix[key] = {
          ...newMatrix[key],
          ojt: enable,
          tenCycle: enable,
          skillEvaluation: enable,
          others: enable,
          evaluation: enable,
          maruA: enable,
        };
      });
      return newMatrix;
    });
  };

  const handleSave = async () => {
    if (!isConfigurationComplete) return;
    setSaveStatus('saving');

    try {
      const jobs: Promise<any>[] = Object.entries(matrix).map(([key, stationState]) => {
        return persistStationConfig(key, stationState);
      });

      await Promise.all(jobs);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      console.error('Full save failed', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    const newMatrix: StationSheetMatrix = {};
    Object.entries(matrix).forEach(([key, value]) => {
      newMatrix[key] = {
        ojt: false,
        tenCycle: false,
        skillEvaluation: false,
        others: false,
        evaluation: false,
        maruA: false,
        station_id: value.station_id,
        department_id: value.department_id,
        line_id: value.line_id,
        subline_id: value.subline_id,
      };
    });
    setMatrix(newMatrix);
    setSelectedStations([]);
  };

  const getSheetColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white',
      emerald: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white',
      orange: 'bg-orange-500 hover:bg-orange-600 text-white',
      pink: 'bg-pink-500 hover:bg-pink-600 text-white',
      red: 'bg-red-500 hover:bg-red-600 text-white',
    };
    return colors[color] || colors.blue;
  };

  const getTotalActiveSheets = () => {
    return Object.values(matrix).reduce((total, stationSheets) => {
      return total + Object.values(stationSheets).filter(v => typeof v === 'boolean' && v).length;
    }, 0);
  };

  const getStationDisplayInfo = (station: Station) => {
    const parts = [station.station_name];
    if (selectedKey.department_id === 'all') {
      if (station.department_name) parts.push(station.department_name);
      if (station.line_name) parts.push(station.line_name);
      if (station.subline_name) parts.push(station.subline_name);
    }
    return parts.join(' > ');
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text">Method Configuration Matrix</h1>
              <p className="text-muted text-lg mt-1">Configure evaluation sheets for stations across departments</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Configuration Setup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-text flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Level *
                </label>
                <select
                  value={selectedKey.level_id ?? ''}
                  onChange={(e) => handleKeyChange('level_id', e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background text-text font-medium shadow-sm outline-none"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level.level_id} value={level.level_id}>{level.level_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-text flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Department *
                </label>
                <select
                  value={selectedKey.department_id ?? ''}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-4 py-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all bg-background text-text font-medium shadow-sm outline-none"
                >
                  <option value="">Select Department</option>
                  <option value="all" className="font-bold text-indigo-600 dark:text-indigo-400"> All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>

              {selectedKey.department_id !== 'all' && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-text flex items-center gap-2">
                      <Factory className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Line {selectedKey.department_id && '*'}
                    </label>
                    <select
                      value={selectedKey.line_id ?? ''}
                      onChange={(e) => handleKeyChange('line_id', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-4 py-4 border border-border rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-background text-text font-medium shadow-sm outline-none disabled:opacity-50"
                      disabled={!selectedKey.department_id}
                    >
                      <option value="">Select Line</option>
                      {(() => {
                        if (!selectedKey.department_id || selectedKey.department_id === 'all') return null;
                        const hierarchy = allHierarchies.get(selectedKey.department_id);
                        const dept = hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);
                        return (dept?.lines || []).map((line) => (
                          <option key={line.id} value={line.id}>{line.line_name}</option>
                        ));
                      })()}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-text flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Subline {selectedKey.line_id && '*'}
                    </label>
                    <select
                      value={selectedKey.subline_id ?? ''}
                      onChange={(e) => handleKeyChange('subline_id', e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-4 py-4 border border-border rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-background text-text font-medium shadow-sm outline-none disabled:opacity-50"
                      disabled={!selectedKey.line_id}
                    >
                      <option value="">Select Subline</option>
                      {(() => {
                        if (!selectedKey.department_id || selectedKey.department_id === 'all' || !selectedKey.line_id) return null;
                        const hierarchy = allHierarchies.get(selectedKey.department_id);
                        const dept = hierarchy?.department || departments.find(d => d.department_id === selectedKey.department_id);
                        const line = (dept?.lines || []).find(l => l.id === selectedKey.line_id);
                        const sublines = line ? (line.sublines || []) : (dept?.sublines || []);
                        return sublines.map(sl => <option key={sl.id} value={sl.id}>{sl.subline_name}</option>);
                      })()}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isConfigurationComplete && (
          <div className="space-y-6">
            {selectedKey.department_id === 'all' && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl border-2 border-indigo-300">
                <div className="flex items-center gap-3 text-white">
                  <Globe className="w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold">All Departments Mode</h3>
                    <p className="text-indigo-100 mt-1">You are configuring stations across all departments</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                Quick Apply Controls
              </h3>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  {sheetTypes.slice(0, 4).map(({ key, label }) => (
                    <div key={key} className="flex items-center bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-1.5 border border-border shadow-lg hover:shadow-xl transition-all">
                      <button
                        onClick={() => handleApplyToAll(key, true)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station => station?.[key])
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          }`}
                      >
                        {label}
                      </button>
                      <button
                        onClick={() => handleApplyToAll(key, false)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station => !station?.[key])
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                      >
                        Disable
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {sheetTypes.slice(4).map(({ key, label }) => (
                    <div key={key} className="flex items-center bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-1.5 border border-border shadow-lg hover:shadow-xl transition-all">
                      <button
                        onClick={() => handleApplyToAll(key, true)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station => station?.[key])
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          }`}
                      >
                        {label}
                      </button>
                      <button
                        onClick={() => handleApplyToAll(key, false)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station => !station?.[key])
                            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                      >
                        Disable
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center bg-indigo-100/50 dark:bg-indigo-900/20 backdrop-blur-sm rounded-2xl p-1.5 border-2 border-indigo-300 dark:border-indigo-700 shadow-lg hover:shadow-xl transition-all">
                    <button
                      onClick={() => handleApplyAllSheetsToAll(true)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).some(station =>
                        station?.ojt || station?.tenCycle || station?.skillEvaluation || station?.others || station?.evaluation
                      )
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md transform scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        }`}
                    >
                      Enable All
                    </button>
                    <button
                      onClick={() => handleApplyAllSheetsToAll(false)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${Object.values(matrix).every(station =>
                        !station?.ojt && !station?.tenCycle && !station?.skillEvaluation && !station?.others && !station?.evaluation
                      )
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md transform scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                    >
                      Disable All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{availableStations.length}</div>
                  <div className="text-sm text-muted">Total Stations</div>
                </div>
                <div className="bg-surface backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selectedStations.length}</div>
                  <div className="text-sm text-muted">Selected Stations</div>
                </div>
                <div className="bg-surface backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getTotalActiveSheets()}</div>
                  <div className="text-sm text-muted">Active Sheets</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="px-6 py-3 border-2 border-border text-muted hover:text-text rounded-xl hover:bg-muted/10 font-semibold transition-all flex items-center gap-2 shadow-sm">
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                <button onClick={handleSave} disabled={saveStatus === 'saving'} className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${saveStatus === 'saved' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : saveStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'}`}>
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Saved!
                    </>
                  ) : saveStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Error
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Configuration
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                      <th className="sticky left-0 bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 text-left border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          <button onClick={handleSelectAllStations} className="text-white hover:text-blue-300 transition-colors">
                            {selectedStations.length === Object.keys(matrix).length ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                          <span className="text-white font-bold text-lg">Stations</span>
                        </div>
                      </th>
                      {sheetTypes.map(({ key, label, color }) => (
                        <th key={key} className="px-4 py-4 text-center min-w-[140px] border-b border-gray-700">
                          <button
                            onClick={() => handleBulkSheetToggle(key)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${getSheetColor(color)}`}
                          >
                            {label}
                          </button>
                          {selectedStations.length > 0 && <div className="text-xs text-gray-300 mt-1">Toggle {selectedStations.length} selected</div>}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(matrix).map(([key, stationData], index) => {
                      const station = availableStations.find(s => 
                        `${s.id}-${s.department_id}-${s.line_id || 0}-${s.subline_id || 0}` === key
                      );
                      if (!station) return null;
                      
                      return (
                        <tr key={key} className={`border-b border-border hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors ${index % 2 === 0 ? 'bg-muted/5' : 'bg-surface'}`}>
                          <td className="sticky left-0 bg-surface px-6 py-4 border-r border-border">
                            <div className="flex items-center gap-3">
                              <button onClick={() => handleStationSelect(key)} className={`transition-colors ${selectedStations.includes(key) ? 'text-blue-600 dark:text-blue-400' : 'text-muted hover:text-text'}`}>
                                {selectedStations.includes(key) ? (<CheckSquare className="w-5 h-5" />) : (<Square className="w-5 h-5" />)}
                              </button>
                              <span className={`font-medium ${selectedStations.includes(key) ? 'text-blue-900 dark:text-blue-200' : 'text-text'}`}>
                                {getStationDisplayInfo(station)}
                              </span>
                            </div>
                          </td>
                          {sheetTypes.map(({ key: sheetKey, color }) => (
                            <td key={sheetKey} className="px-4 py-4 text-center">
                              <button onClick={() => handleCellToggle(key, sheetKey)} className={`w-8 h-8 rounded-lg border-2 transition-all ${stationData?.[sheetKey] ? `${getSheetColor(color)} border-transparent shadow-md` : 'bg-background border-border hover:bg-muted/10'}`}>
                                {stationData?.[sheetKey] && (<CheckCircle className="w-5 h-5 mx-auto" />)}
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!isConfigurationComplete && (
          <div className="bg-surface rounded-2xl p-12 text-center shadow-lg border border-border">
            <Settings className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text mb-2">Select Configuration</h3>
            <p className="text-muted text-lg">
              {selectedKey.department_id === 'all' 
                ? 'Please select a Level to start configuring all departments' 
                : 'Please select Level and Department (or Line/Subline if required) to start configuring'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}