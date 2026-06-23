
// // StationRequirementPage.tsx
// import React, { useEffect, useState, useRef } from 'react';
// import { 
//   Users, Save, RotateCcw, AlertCircle, CheckCircle, 
//   List, MapPin, RefreshCw, Pencil, Trash2, X, Plus, Lock
// } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000';

// // --- Types ---
// interface Department {
//   department_id: number;
//   department_name: string;
//   lines: Line[];
//   stations: Station[];
// }
// interface Line {
//   line_id: number;
//   line_name: string;
//   sublines: Subline[];
//   stations: Station[];
// }
// interface Subline {
//   subline_id: number;
//   subline_name: string;
//   stations: Station[];
// }
// interface Station {
//   station_id: number;
//   station_name: string;
// }
// interface FactoryStructure {
//   factory_id: number;
//   factory_name: string;
//   hq: number;
//   departments: Department[];
// }

// interface ExistingRequirement {
//   id: number;
//   department_name?: string;
//   line_name?: string;
//   subline_name?: string;
//   station_name?: string;
//   department_id?: number;
//   line_id?: number;
//   subline_id?: number;
//   station_id?: number;
//   minimum_operators: number;
//   minimum_level_required: string;
// }

// interface ApiHierarchyResponseItem {
//   factory: number;
//   factory_name: string;
//   structure_data: any;
// }

// const LEVEL_CHOICES = [
//   { value: 'Beginner', label: 'Beginner' },
//   { value: 'Intermediate', label: 'Intermediate' },
//   { value: 'Advanced', label: 'Advanced' },
//   { value: 'Expert', label: 'Expert' },
// ];

// // --- API Functions ---
// const fetchHierarchyStructures = async (): Promise<FactoryStructure[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/hierarchy-simple/`);
//     const apiData: ApiHierarchyResponseItem[] = await response.json();
//     const factoriesMap = new Map<number, FactoryStructure>();

//     apiData.forEach(item => {
//       if (!item.factory) return;
//       let factory = factoriesMap.get(item.factory);
//       if (!factory) {
//         factory = { factory_id: item.factory, factory_name: item.factory_name, hq: 0, departments: [] };
//         factoriesMap.set(item.factory, factory);
//       }
//       item.structure_data?.departments?.forEach((deptData: any) => {
//         let department = factory!.departments.find(d => d.department_id === deptData.id);
//         if (!department) {
//           department = { department_id: deptData.id, department_name: deptData.department_name, lines: [], stations: [] };
//           factory!.departments.push(department);
//         }
//         deptData.stations?.forEach((s: any) => {
//              if(!department!.stations.some(ex => ex.station_id === s.id))
//                 department!.stations.push({ station_id: s.id, station_name: s.station_name });
//         });
//         deptData.lines?.forEach((lineData: any) => {
//           let line = department!.lines.find(l => l.line_id === lineData.id);
//           if (!line) {
//             line = { line_id: lineData.id, line_name: lineData.line_name, sublines: [], stations: [] };
//             department!.lines.push(line);
//           }
//           lineData.stations?.forEach((s: any) => {
//              if(!line!.stations.some(ex => ex.station_id === s.id))
//                 line!.stations.push({ station_id: s.id, station_name: s.station_name });
//           });
//           lineData.sublines?.forEach((subData: any) => {
//             let subline = line!.sublines.find(sl => sl.subline_id === subData.id);
//             if (!subline) {
//               subline = { subline_id: subData.id, subline_name: subData.subline_name, stations: [] };
//               line!.sublines.push(subline);
//             }
//             subData.stations?.forEach((s: any) => {
//                 if(!subline!.stations.some(ex => ex.station_id === s.id))
//                     subline!.stations.push({ station_id: s.id, station_name: s.station_name });
//             });
//           });
//         });
//       });
//     });
//     return Array.from(factoriesMap.values());
//   } catch (error) { return []; }
// };

// const createStationManager = async (payload: any) => {
//   const response = await fetch(`${API_BASE_URL}/station-managers/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//   if (!response.ok) throw new Error('Failed'); return response.json();
// };
// const updateStationManager = async (id: number, payload: any) => {
//   const response = await fetch(`${API_BASE_URL}/station-managers/${id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//   if (!response.ok) throw new Error('Failed'); return response.json();
// };
// const deleteStationManager = async (id: number) => {
//   const response = await fetch(`${API_BASE_URL}/station-managers/${id}/`, { method: 'DELETE' });
//   if (!response.ok) throw new Error('Failed'); return true;
// };
// const fetchExistingRequirements = async (): Promise<ExistingRequirement[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/station-managers/`);
//     const data = await response.json();
//     return Array.isArray(data) ? data : data.results || [];
//   } catch (error) { return []; }
// };

// // --- FORM COMPONENT ---
// interface RequirementFormProps {
//   departments: Department[];
//   lines: Line[];
//   sublines: Subline[];
//   stations: Station[];
  
//   // State Values
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
  
//   // Display Names for Edit Mode
//   displayNames: {
//     dept: string;
//     line: string;
//     subline: string;
//     station: string;
//   };

//   setDepartmentId: (val: number | null) => void;
//   setLineId: (val: number | null) => void;
//   setSublineId: (val: number | null) => void;
//   setStationId: (val: number | null) => void;
  
//   minOperators: number | '';
//   setMinOperators: (val: number | '') => void;
//   minLevelRequired: string | '';
//   setMinLevelRequired: (val: string) => void;
  
//   onSubmit: () => void;
//   onCancel: () => void;
//   submitting: boolean;
//   isEditing: boolean;
// }

// const RequirementForm: React.FC<RequirementFormProps> = (props) => {
//   const { isEditing, departments, lines, sublines, stations, displayNames } = props;

//   // --- RENDER HELPERS ---
//   // In Edit Mode, we show a Text Block instead of a Select Dropdown
//   const renderField = (label: string, value: string, selectComponent: React.ReactNode) => {
//     return (
//       <div className="space-y-2">
//         <label className="text-sm font-medium text-gray-700 flex items-center">
//           {label}
//           {isEditing && <Lock className="h-3 w-3 ml-2 text-amber-500" />}
//         </label>
//         {isEditing ? (
//           <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700 font-medium">
//             {value || <span className="text-gray-400 italic">Not Assigned</span>}
//           </div>
//         ) : (
//           selectComponent
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
//         {/* Department */}
//         {renderField("Department", displayNames.dept, (
//           <select
//             value={props.departmentId ?? ''}
//             onChange={(e) => props.setDepartmentId(e.target.value ? Number(e.target.value) : null)}
//             className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">Select Department</option>
//             {departments.map(d => (
//               <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
//             ))}
//           </select>
//         ))}

//         {/* Line */}
//         {renderField("Line", displayNames.line, (
//           <select
//             value={props.lineId ?? ''}
//             onChange={(e) => props.setLineId(e.target.value ? Number(e.target.value) : null)}
//             disabled={!props.departmentId}
//             className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Line (Optional)</option>
//             {lines.map(l => (
//               <option key={l.line_id} value={l.line_id}>{l.line_name}</option>
//             ))}
//           </select>
//         ))}

//         {/* Subline */}
//         {renderField("Subline", displayNames.subline, (
//           <select
//             value={props.sublineId ?? ''}
//             onChange={(e) => props.setSublineId(e.target.value ? Number(e.target.value) : null)}
//             disabled={!props.lineId}
//             className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Subline (Optional)</option>
//             {sublines.map(sl => (
//               <option key={sl.subline_id} value={sl.subline_id}>{sl.subline_name}</option>
//             ))}
//           </select>
//         ))}

//         {/* Station */}
//         {renderField("Station", displayNames.station, (
//           <select
//             value={props.stationId ?? ''}
//             onChange={(e) => props.setStationId(e.target.value ? Number(e.target.value) : null)}
//             disabled={!props.departmentId}
//             className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//           >
//             <option value="">Select Station (Optional)</option>
//             {stations.map(s => (
//               <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
//             ))}
//           </select>
//         ))}
//       </div>

//       <div className="border-t border-gray-100 my-4"></div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-2">
//           <label className="flex items-center text-sm font-medium text-gray-700">
//             <Users className="h-4 w-4 mr-2 text-gray-500" /> Minimum Operators <span className="text-red-500 ml-1">*</span>
//           </label>
//           <input
//             type="number"
//             min={1}
//             value={props.minOperators}
//             onChange={(e) => props.setMinOperators(e.target.value ? Number(e.target.value) : '')}
//             className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div className="space-y-2">
//           <label className="flex items-center text-sm font-medium text-gray-700">
//             <Users className="h-4 w-4 mr-2 text-gray-500" /> Min Level Required <span className="text-red-500 ml-1">*</span>
//           </label>
//           <select
//             value={props.minLevelRequired}
//             onChange={(e) => props.setMinLevelRequired(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select Level</option>
//             {LEVEL_CHOICES.map((level) => (
//               <option key={level.value} value={level.value}>{level.label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <button type="button" onClick={props.onCancel} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
//           <RotateCcw className="inline h-4 w-4 mr-2" /> {isEditing ? 'Cancel' : 'Reset'}
//         </button>
//         <button type="button" onClick={props.onSubmit} disabled={props.submitting} className={`px-6 py-2 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
//           <Save className="inline h-4 w-4 mr-2" /> {isEditing ? 'Update Changes' : 'Save'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- MAIN PAGE ---
// const StationRequirementPage: React.FC = () => {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   // Dropdown options
//   const [lines, setLines] = useState<Line[]>([]);
//   const [sublines, setSublines] = useState<Subline[]>([]);
//   const [stations, setStations] = useState<Station[]>([]);
  
//   // Selected Values (IDs)
//   const [departmentId, setDepartmentId] = useState<number | null>(null);
//   const [lineId, setLineId] = useState<number | null>(null);
//   const [sublineId, setSublineId] = useState<number | null>(null);
//   const [stationId, setStationId] = useState<number | null>(null);
  
//   // Display Names (For Edit Mode Text)
//   const [displayNames, setDisplayNames] = useState({ dept: '', line: '', subline: '', station: '' });

//   const [minOperators, setMinOperators] = useState<number | ''>('');
//   const [minLevelRequired, setMinLevelRequired] = useState<string | ''>('');
  
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
//   const [existingRequirements, setExistingRequirements] = useState<ExistingRequirement[]>([]);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   const isSettingUpEdit = useRef(false);

//   const showToast = (type: 'success' | 'error', message: string) => {
//     setToast({ type, message }); setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
//       const structures = await fetchHierarchyStructures();
//       const allDepts: Department[] = [];
//       structures.forEach(f => f.departments.forEach(d => {
//         if (!allDepts.find(existing => existing.department_id === d.department_id)) allDepts.push(d);
//       }));
//       setDepartments(allDepts);
//       setExistingRequirements(await fetchExistingRequirements());
//       setLoading(false);
//     };
//     init();
//   }, []);

//   // --- CASCADING LOGIC (Only runs in Add Mode) ---
//   useEffect(() => {
//     if (isSettingUpEdit.current) return;
//     if (!departmentId) {
//       setLines([]); setSublines([]); setStations([]); 
//       setLineId(null); setSublineId(null); setStationId(null);
//       return;
//     }
//     const d = departments.find(x => x.department_id === departmentId);
//     if (d) {
//       setLines(d.lines || []);
//       if (!editingId) {
//         setStations(d.stations || []);
//         setLineId(null); setSublineId(null); setStationId(null); setSublines([]);
//       }
//     }
//   }, [departmentId, departments]);

//   useEffect(() => {
//     if (isSettingUpEdit.current) return;
//     if (!lineId) {
//        if (!editingId && departmentId) {
//           const d = departments.find(x => x.department_id === departmentId);
//           setStations(d?.stations || []);
//        }
//        setSublines([]); setSublineId(null);
//        return;
//     }
//     const l = lines.find(x => x.line_id === lineId);
//     if (l) {
//       setSublines(l.sublines || []);
//       if (!editingId) {
//         setStations(l.stations || []);
//         setSublineId(null); setStationId(null);
//       }
//     }
//   }, [lineId, lines]);

//   useEffect(() => {
//     if (isSettingUpEdit.current) return;
//     if (sublineId) {
//       const s = sublines.find(x => x.subline_id === sublineId);
//       if (s && !editingId) {
//         setStations(s.stations || []);
//         setStationId(null);
//       }
//     } else if (lineId && !editingId) {
//        const l = lines.find(x => x.line_id === lineId);
//        setStations(l?.stations || []);
//     }
//   }, [sublineId, sublines]);

//   // --- EDIT HANDLER (Calculates IDs but Sets Text) ---
//   const handleEditClick = (req: ExistingRequirement) => {
//     isSettingUpEdit.current = true;

//     // 1. Set Display Names directly from JSON (Guarantees visibility)
//     setDisplayNames({
//       dept: req.department_name || '',
//       line: req.line_name || '',
//       subline: req.subline_name || '',
//       station: req.station_name || ''
//     });

//     // 2. Try to reverse-lookup IDs for the state (for the PUT request later)
//     let foundDId: number | null = null;
//     let foundLId: number | null = null;
//     let foundSlId: number | null = null;
//     let foundSId: number | null = null;

//     // Use Name to find ID
//     const dept = departments.find(d => d.department_name === req.department_name);
//     if (dept) {
//         foundDId = dept.department_id;
        
//         if (req.line_name) {
//             const line = dept.lines.find(l => l.line_name === req.line_name);
//             if (line) {
//                 foundLId = line.line_id;
//                 if (req.subline_name) {
//                     const sub = line.sublines.find(s => s.subline_name === req.subline_name);
//                     if (sub) foundSlId = sub.subline_id;
//                 }
//             }
//         }
        
//         // Find Station ID (Search recursively to be safe)
//         const allStations = [
//              ...dept.stations, 
//              ...(dept.lines.flatMap(l => [
//                  ...l.stations, 
//                  ...l.sublines.flatMap(sl => sl.stations)
//              ]))
//         ];
//         const station = allStations.find(s => s.station_name === req.station_name);
//         if(station) foundSId = station.station_id;
//     }

//     setEditingId(req.id);
//     setMinOperators(req.minimum_operators);
//     setMinLevelRequired(req.minimum_level_required);
    
//     // Set IDs (even if null, the UI will show the text names)
//     setDepartmentId(foundDId);
//     setLineId(foundLId);
//     setSublineId(foundSlId);
//     setStationId(foundSId);

//     setIsModalOpen(true);
//     setTimeout(() => { isSettingUpEdit.current = false; }, 500);
//   };

//   const resetForm = () => {
//     isSettingUpEdit.current = false;
//     setEditingId(null); setIsModalOpen(false);
//     setDepartmentId(null); setLineId(null); setSublineId(null); setStationId(null);
//     setDisplayNames({ dept: '', line: '', subline: '', station: '' });
//     setMinOperators(''); setMinLevelRequired('');
//     setLines([]); setSublines([]); setStations([]);
//   };

//   const onSubmit = async () => {
//     // Validation: If adding, check IDs. If editing, we assume location is fixed/valid.
//     if (!editingId && (!departmentId && !stationId)) return showToast('error', 'Select Department/Station');
    
//     const payload = {
//       minimum_operators: Number(minOperators),
//       minimum_level_required: minLevelRequired,
//       // If editing, use existing IDs if state is null, or don't send if API allows partial
//       department_id: departmentId,
//       line_id: lineId,
//       subline_id: sublineId,
//       station_id: stationId
//     };

//     try {
//       setSubmitting(true);
//       if (editingId) {
//         await updateStationManager(editingId, payload);
//         showToast('success', 'Updated');
//       } else {
//         await createStationManager(payload);
//         showToast('success', 'Created');
//       }
//       resetForm();
//       setExistingRequirements(await fetchExistingRequirements());
//     } catch (e) { showToast('error', 'Failed'); } finally { setSubmitting(false); }
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm('Delete?')) {
//       await deleteStationManager(id);
//       showToast('success', 'Deleted');
//       setExistingRequirements(await fetchExistingRequirements());
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Station Requirements</h1>
        
//         {toast && !isModalOpen && (
//           <div className={`fixed top-4 right-4 p-4 rounded-xl shadow bg-white border ${toast.type === 'success' ? 'text-green-700 border-green-200' : 'text-red-700 border-red-200'}`}>{toast.message}</div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-7 bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-bold mb-4 flex items-center"><Plus className="mr-2 h-5 w-5 text-blue-600"/> Add Requirement</h2>
//             <RequirementForm 
//               departments={departments} lines={lines} sublines={sublines} stations={stations}
//               displayNames={displayNames}
//               departmentId={departmentId} setDepartmentId={setDepartmentId}
//               lineId={lineId} setLineId={setLineId}
//               sublineId={sublineId} setSublineId={setSublineId}
//               stationId={stationId} setStationId={setStationId}
//               minOperators={minOperators} setMinOperators={setMinOperators}
//               minLevelRequired={minLevelRequired} setMinLevelRequired={setMinLevelRequired}
//               onSubmit={onSubmit} onCancel={resetForm} submitting={submitting} isEditing={false}
//             />
//           </div>

//           <div className="lg:col-span-5 bg-white rounded-xl shadow flex flex-col h-[600px]">
//              <div className="p-4 border-b bg-gray-50 rounded-t-xl"><h2 className="font-bold">List</h2></div>
//              <div className="flex-1 overflow-y-auto p-4 space-y-3">
//                 {existingRequirements.map((req, i) => (
//                   <div key={req.id || i} className="p-3 border rounded-lg bg-white">
//                     <div className="flex justify-between">
//                       <div>
//                         <div className="text-sm font-bold">{req.department_name} {req.line_name ? `› ${req.line_name}` : ''} {req.station_name ? `› ${req.station_name}` : ''}</div>
//                         <div className="text-xs text-gray-500">{req.minimum_operators} Ops • {req.minimum_level_required}</div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <button onClick={() => handleEditClick(req)} className="p-1.5 text-blue-600 bg-blue-50 rounded"><Pencil className="h-4 w-4"/></button>
//                         <button onClick={() => handleDelete(req.id)} className="p-1.5 text-red-600 bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//              </div>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 animate-fade-in-up">
//             <div className="flex justify-between mb-4"><h3 className="text-xl font-bold text-gray-800">Edit Requirement</h3><button onClick={resetForm}><X/></button></div>
//             <RequirementForm 
//               departments={departments} lines={lines} sublines={sublines} stations={stations}
//               displayNames={displayNames}
//               departmentId={departmentId} setDepartmentId={setDepartmentId}
//               lineId={lineId} setLineId={setLineId}
//               sublineId={sublineId} setSublineId={setSublineId}
//               stationId={stationId} setStationId={setStationId}
//               minOperators={minOperators} setMinOperators={setMinOperators}
//               minLevelRequired={minLevelRequired} setMinLevelRequired={setMinLevelRequired}
//               onSubmit={onSubmit} onCancel={resetForm} submitting={submitting} isEditing={true}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StationRequirementPage;





// src/components/pages/StationRequirementPage.tsx

import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, Save, RotateCcw, AlertCircle, CheckCircle, 
  List, MapPin, RefreshCw, Pencil, Trash2, X, Plus, Lock
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// --- Types ---
interface Department {
  department_id: number;
  department_name: string;
  lines: Line[];
  stations: Station[];
}
interface Line {
  line_id: number;
  line_name: string;
  sublines: Subline[];
  stations: Station[];
}
interface Subline {
  subline_id: number;
  subline_name: string;
  stations: Station[];
}
interface Station {
  station_id: number;
  station_name: string;
}
interface FactoryStructure {
  factory_id: number;
  factory_name: string;
  hq: number;
  departments: Department[];
}

interface ExistingRequirement {
  id: number;
  department_name?: string;
  line_name?: string;
  subline_name?: string;
  station_name?: string;
  department_id?: number;
  line_id?: number;
  subline_id?: number;
  station_id?: number;
  minimum_operators: number;
  minimum_level_required: string;
}

interface ApiHierarchyResponseItem {
  factory: number;
  factory_name: string;
  structure_data: any;
}

const LEVEL_CHOICES = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

// --- API Functions ---
const fetchHierarchyStructures = async (): Promise<FactoryStructure[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/hierarchy-simple/`);
    const apiData: ApiHierarchyResponseItem[] = await response.json();
    const factoriesMap = new Map<number, FactoryStructure>();

    apiData.forEach(item => {
      if (!item.factory) return;
      let factory = factoriesMap.get(item.factory);
      if (!factory) {
        factory = { factory_id: item.factory, factory_name: item.factory_name, hq: 0, departments: [] };
        factoriesMap.set(item.factory, factory);
      }
      item.structure_data?.departments?.forEach((deptData: any) => {
        let department = factory!.departments.find(d => d.department_id === deptData.id);
        if (!department) {
          department = { department_id: deptData.id, department_name: deptData.department_name, lines: [], stations: [] };
          factory!.departments.push(department);
        }
        deptData.stations?.forEach((s: any) => {
             if(!department!.stations.some(ex => ex.station_id === s.id))
                department!.stations.push({ station_id: s.id, station_name: s.station_name });
        });
        deptData.lines?.forEach((lineData: any) => {
          let line = department!.lines.find(l => l.line_id === lineData.id);
          if (!line) {
            line = { line_id: lineData.id, line_name: lineData.line_name, sublines: [], stations: [] };
            department!.lines.push(line);
          }
          lineData.stations?.forEach((s: any) => {
             if(!line!.stations.some(ex => ex.station_id === s.id))
                line!.stations.push({ station_id: s.id, station_name: s.station_name });
          });
          lineData.sublines?.forEach((subData: any) => {
            let subline = line!.sublines.find(sl => sl.subline_id === subData.id);
            if (!subline) {
              subline = { subline_id: subData.id, subline_name: subData.subline_name, stations: [] };
              line!.sublines.push(subline);
            }
            subData.stations?.forEach((s: any) => {
                if(!subline!.stations.some(ex => ex.station_id === s.id))
                    subline!.stations.push({ station_id: s.id, station_name: s.station_name });
            });
          });
        });
      });
    });
    return Array.from(factoriesMap.values());
  } catch (error) { return []; }
};

const createStationManager = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/station-managers/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error('Failed'); return response.json();
};
const updateStationManager = async (id: number, payload: any) => {
  const response = await fetch(`${API_BASE_URL}/station-managers/${id}/`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error('Failed'); return response.json();
};
const deleteStationManager = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/station-managers/${id}/`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed'); return true;
};
const fetchExistingRequirements = async (): Promise<ExistingRequirement[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/station-managers/`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) { return []; }
};

// --- FORM COMPONENT ---
interface RequirementFormProps {
  departments: Department[];
  lines: Line[];
  sublines: Subline[];
  stations: Station[];
  
  // State Values
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  
  // Display Names for Edit Mode
  displayNames: {
    dept: string;
    line: string;
    subline: string;
    station: string;
  };

  setDepartmentId: (val: number | null) => void;
  setLineId: (val: number | null) => void;
  setSublineId: (val: number | null) => void;
  setStationId: (val: number | null) => void;
  
  minOperators: number | '';
  setMinOperators: (val: number | '') => void;
  minLevelRequired: string | '';
  setMinLevelRequired: (val: string) => void;
  
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  isEditing: boolean;
}

const RequirementForm: React.FC<RequirementFormProps> = (props) => {
  const { isEditing, departments, lines, sublines, stations, displayNames } = props;

  // --- RENDER HELPERS ---
  // In Edit Mode, we show a Text Block instead of a Select Dropdown
  const renderField = (label: string, value: string, selectComponent: React.ReactNode) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-text flex items-center">
          {label}
          {isEditing && <Lock className="h-3 w-3 ml-2 text-amber-500" />}
        </label>
        {isEditing ? (
          <div className="w-full px-3 py-2 border border-border bg-muted/10 rounded-lg text-text font-medium">
            {value || <span className="text-muted italic">Not Assigned</span>}
          </div>
        ) : (
          selectComponent
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Department */}
        {renderField("Department", displayNames.dept, (
          <select
            value={props.departmentId ?? ''}
            onChange={(e) => props.setDepartmentId(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
            ))}
          </select>
        ))}

        {/* Line */}
        {renderField("Line", displayNames.line, (
          <select
            value={props.lineId ?? ''}
            onChange={(e) => props.setLineId(e.target.value ? Number(e.target.value) : null)}
            disabled={!props.departmentId}
            className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Line (Optional)</option>
            {lines.map(l => (
              <option key={l.line_id} value={l.line_id}>{l.line_name}</option>
            ))}
          </select>
        ))}

        {/* Subline */}
        {renderField("Subline", displayNames.subline, (
          <select
            value={props.sublineId ?? ''}
            onChange={(e) => props.setSublineId(e.target.value ? Number(e.target.value) : null)}
            disabled={!props.lineId}
            className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Subline (Optional)</option>
            {sublines.map(sl => (
              <option key={sl.subline_id} value={sl.subline_id}>{sl.subline_name}</option>
            ))}
          </select>
        ))}

        {/* Station */}
        {renderField("Station", displayNames.station, (
          <select
            value={props.stationId ?? ''}
            onChange={(e) => props.setStationId(e.target.value ? Number(e.target.value) : null)}
            disabled={!props.departmentId}
            className="w-full px-3 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Station (Optional)</option>
            {stations.map(s => (
              <option key={s.station_id} value={s.station_id}>{s.station_name}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="border-t border-border my-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-text">
            <Users className="h-4 w-4 mr-2 text-muted" /> Minimum Operators <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={props.minOperators}
            onChange={(e) => props.setMinOperators(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-4 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-text">
            <Users className="h-4 w-4 mr-2 text-muted" /> Min Level Required <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={props.minLevelRequired}
            onChange={(e) => props.setMinLevelRequired(e.target.value)}
            className="w-full px-4 py-2 border border-border bg-background text-text rounded-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
            required
          >
            <option value="">Select Level</option>
            {LEVEL_CHOICES.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
        <button type="button" onClick={props.onCancel} className="px-4 py-2 border border-border text-text bg-surface hover:bg-muted/10 font-medium rounded-lg transition-colors">
          <RotateCcw className="inline h-4 w-4 mr-2" /> {isEditing ? 'Cancel' : 'Reset'}
        </button>
        <button type="button" onClick={props.onSubmit} disabled={props.submitting} className={`px-6 py-2 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          <Save className="inline h-4 w-4 mr-2" /> {isEditing ? 'Update Changes' : 'Save'}
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const StationRequirementPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  // Dropdown options
  const [lines, setLines] = useState<Line[]>([]);
  const [sublines, setSublines] = useState<Subline[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  
  // Selected Values (IDs)
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [lineId, setLineId] = useState<number | null>(null);
  const [sublineId, setSublineId] = useState<number | null>(null);
  const [stationId, setStationId] = useState<number | null>(null);
  
  // Display Names (For Edit Mode Text)
  const [displayNames, setDisplayNames] = useState({ dept: '', line: '', subline: '', station: '' });

  const [minOperators, setMinOperators] = useState<number | ''>('');
  const [minLevelRequired, setMinLevelRequired] = useState<string | ''>('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [existingRequirements, setExistingRequirements] = useState<ExistingRequirement[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isSettingUpEdit = useRef(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message }); setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const structures = await fetchHierarchyStructures();
      const allDepts: Department[] = [];
      structures.forEach(f => f.departments.forEach(d => {
        if (!allDepts.find(existing => existing.department_id === d.department_id)) allDepts.push(d);
      }));
      setDepartments(allDepts);
      setExistingRequirements(await fetchExistingRequirements());
      setLoading(false);
    };
    init();
  }, []);

  // --- CASCADING LOGIC (Only runs in Add Mode) ---
  useEffect(() => {
    if (isSettingUpEdit.current) return;
    if (!departmentId) {
      setLines([]); setSublines([]); setStations([]); 
      setLineId(null); setSublineId(null); setStationId(null);
      return;
    }
    const d = departments.find(x => x.department_id === departmentId);
    if (d) {
      setLines(d.lines || []);
      if (!editingId) {
        setStations(d.stations || []);
        setLineId(null); setSublineId(null); setStationId(null); setSublines([]);
      }
    }
  }, [departmentId, departments]);

  useEffect(() => {
    if (isSettingUpEdit.current) return;
    if (!lineId) {
       if (!editingId && departmentId) {
          const d = departments.find(x => x.department_id === departmentId);
          setStations(d?.stations || []);
       }
       setSublines([]); setSublineId(null);
       return;
    }
    const l = lines.find(x => x.line_id === lineId);
    if (l) {
      setSublines(l.sublines || []);
      if (!editingId) {
        setStations(l.stations || []);
        setSublineId(null); setStationId(null);
      }
    }
  }, [lineId, lines]);

  useEffect(() => {
    if (isSettingUpEdit.current) return;
    if (sublineId) {
      const s = sublines.find(x => x.subline_id === sublineId);
      if (s && !editingId) {
        setStations(s.stations || []);
        setStationId(null);
      }
    } else if (lineId && !editingId) {
       const l = lines.find(x => x.line_id === lineId);
       setStations(l?.stations || []);
    }
  }, [sublineId, sublines]);

  // --- EDIT HANDLER (Calculates IDs but Sets Text) ---
  const handleEditClick = (req: ExistingRequirement) => {
    isSettingUpEdit.current = true;

    // 1. Set Display Names directly from JSON (Guarantees visibility)
    setDisplayNames({
      dept: req.department_name || '',
      line: req.line_name || '',
      subline: req.subline_name || '',
      station: req.station_name || ''
    });

    // 2. Try to reverse-lookup IDs for the state (for the PUT request later)
    let foundDId: number | null = null;
    let foundLId: number | null = null;
    let foundSlId: number | null = null;
    let foundSId: number | null = null;

    // Use Name to find ID
    const dept = departments.find(d => d.department_name === req.department_name);
    if (dept) {
        foundDId = dept.department_id;
        
        if (req.line_name) {
            const line = dept.lines.find(l => l.line_name === req.line_name);
            if (line) {
                foundLId = line.line_id;
                if (req.subline_name) {
                    const sub = line.sublines.find(s => s.subline_name === req.subline_name);
                    if (sub) foundSlId = sub.subline_id;
                }
            }
        }
        
        // Find Station ID (Search recursively to be safe)
        const allStations = [
             ...dept.stations, 
             ...(dept.lines.flatMap(l => [
                 ...l.stations, 
                 ...l.sublines.flatMap(sl => sl.stations)
             ]))
        ];
        const station = allStations.find(s => s.station_name === req.station_name);
        if(station) foundSId = station.station_id;
    }

    setEditingId(req.id);
    setMinOperators(req.minimum_operators);
    setMinLevelRequired(req.minimum_level_required);
    
    // Set IDs (even if null, the UI will show the text names)
    setDepartmentId(foundDId);
    setLineId(foundLId);
    setSublineId(foundSlId);
    setStationId(foundSId);

    setIsModalOpen(true);
    setTimeout(() => { isSettingUpEdit.current = false; }, 500);
  };

  const resetForm = () => {
    isSettingUpEdit.current = false;
    setEditingId(null); setIsModalOpen(false);
    setDepartmentId(null); setLineId(null); setSublineId(null); setStationId(null);
    setDisplayNames({ dept: '', line: '', subline: '', station: '' });
    setMinOperators(''); setMinLevelRequired('');
    setLines([]); setSublines([]); setStations([]);
  };

  const onSubmit = async () => {
    // Validation: If adding, check IDs. If editing, we assume location is fixed/valid.
    if (!editingId && (!departmentId && !stationId)) return showToast('error', 'Select Department/Station');
    
    const payload = {
      minimum_operators: Number(minOperators),
      minimum_level_required: minLevelRequired,
      // If editing, use existing IDs if state is null, or don't send if API allows partial
      department_id: departmentId,
      line_id: lineId,
      subline_id: sublineId,
      station_id: stationId
    };

    try {
      setSubmitting(true);
      if (editingId) {
        await updateStationManager(editingId, payload);
        showToast('success', 'Updated');
      } else {
        await createStationManager(payload);
        showToast('success', 'Created');
      }
      resetForm();
      setExistingRequirements(await fetchExistingRequirements());
    } catch (e) { showToast('error', 'Failed'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete?')) {
      await deleteStationManager(id);
      showToast('success', 'Deleted');
      setExistingRequirements(await fetchExistingRequirements());
    }
  };

  if (loading) return (
    <div className="p-10 text-center flex items-center justify-center h-64 text-muted">
      <RefreshCw className="w-6 h-6 animate-spin mr-2" />
      Loading...
    </div>
  );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6 text-text">Station Requirements</h1>
      
      {toast && !isModalOpen && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow bg-surface border ${toast.type === 'success' ? 'text-green-700 border-green-200 dark:text-green-400 dark:border-green-800' : 'text-red-700 border-red-200 dark:text-red-400 dark:border-red-800'}`}>{toast.message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface rounded-xl shadow-sm border border-border p-6 h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center text-text">
            <Plus className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400"/> Add Requirement
          </h2>
          <RequirementForm 
            departments={departments} lines={lines} sublines={sublines} stations={stations}
            displayNames={displayNames}
            departmentId={departmentId} setDepartmentId={setDepartmentId}
            lineId={lineId} setLineId={setLineId}
            sublineId={sublineId} setSublineId={setSublineId}
            stationId={stationId} setStationId={setStationId}
            minOperators={minOperators} setMinOperators={setMinOperators}
            minLevelRequired={minLevelRequired} setMinLevelRequired={setMinLevelRequired}
            onSubmit={onSubmit} onCancel={resetForm} submitting={submitting} isEditing={false}
          />
        </div>

        <div className="lg:col-span-5 bg-surface rounded-xl shadow-sm border border-border flex flex-col h-[600px]">
           <div className="p-4 border-b border-border bg-muted/5 rounded-t-xl">
             <h2 className="font-bold text-text">Existing Requirements</h2>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {existingRequirements.length === 0 ? (
                <div className="text-center text-muted py-8">No requirements found</div>
              ) : (
                existingRequirements.map((req, i) => (
                  <div key={req.id || i} className="p-3 border border-border rounded-lg bg-surface hover:bg-muted/5 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-bold text-text mb-1">
                          {req.department_name} 
                          {req.line_name ? ` › ${req.line_name}` : ''} 
                          {req.station_name ? ` › ${req.station_name}` : ''}
                        </div>
                        <div className="text-xs text-muted flex items-center gap-2">
                           <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">{req.minimum_operators} Ops</span>
                           <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">{req.minimum_level_required}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditClick(req)} className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"><Pencil className="h-4 w-4"/></button>
                        <button onClick={() => handleDelete(req.id)} className="p-1.5 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl shadow-xl max-w-2xl w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
              <h3 className="text-xl font-bold text-text">Edit Requirement</h3>
              <button onClick={resetForm} className="text-muted hover:text-text"><X className="w-5 h-5"/></button>
            </div>
            <RequirementForm 
              departments={departments} lines={lines} sublines={sublines} stations={stations}
              displayNames={displayNames}
              departmentId={departmentId} setDepartmentId={setDepartmentId}
              lineId={lineId} setLineId={setLineId}
              sublineId={sublineId} setSublineId={setSublineId}
              stationId={stationId} setStationId={setStationId}
              minOperators={minOperators} setMinOperators={setMinOperators}
              minLevelRequired={minLevelRequired} setMinLevelRequired={setMinLevelRequired}
              onSubmit={onSubmit} onCancel={resetForm} submitting={submitting} isEditing={true}
            />
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StationRequirementPage;