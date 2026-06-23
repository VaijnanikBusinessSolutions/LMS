
// import React, { useState, useEffect } from 'react';
// import {
//   Building, Layers, Zap, Save, X, CheckCircle, ArrowRight, Plus,
//   Loader2, MapPin, Minus, Settings, Upload, Hexagon, AlertTriangle, Edit2
// } from 'lucide-react';
// import axios from 'axios';

// // --- 1. Configuration & Constants ---

// const API_BASE_URL = 'http://127.0.0.1:8000';

// // --- 2. Color Helper Functions ---

// // Helper to darken hex color to create a gradient effect
// const adjustColorBrightness = (col: string, amt: number) => {
//     let usePound = false;
//     if (col[0] === "#") {
//         col = col.slice(1);
//         usePound = true;
//     }
//     let num = parseInt(col, 16);
//     let r = (num >> 16) + amt;
//     if (r > 255) r = 255; else if (r < 0) r = 0;
//     let b = ((num >> 8) & 0x00FF) + amt;
//     if (b > 255) b = 255; else if (b < 0) b = 0;
//     let g = (num & 0x0000FF) + amt;
//     if (g > 255) g = 255; else if (g < 0) g = 0;
//     return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
// }

// // Generate inline styles for Hex colors
// const getBackgroundStyle = (color: string) => {
//   if (color && color.startsWith('#')) {
//     return { background: `linear-gradient(135deg, ${color}, ${adjustColorBrightness(color, -40)})` };
//   }
//   return {};
// };

// // --- 3. Types Definitions ---

// type StationType = string;

// type Hq = { hq_id: number; hq_name: string; };
// type Factory = { factory_id: number; factory_name: string; hq: number; };
// type Department = { department_id: number; department_name: string; factory: number; hq: number; };
// type Line = { line_id: number; line_name: string; department: number; factory: number; hq: number; };
// type SubLine = { subline_id: number; subline_name: string; line: number; department: number; factory: number; hq: number; };
// type Station = { station_id: number; station_name: string; subline: number; line: number; department: number; factory: number; hq: number; };

// type PlanStation = {
//   id?: number;
//   station_name: string;
//   station_type?: StationType;
// };

// type PlanSubline = { id?: number; subline_name: string; stations: PlanStation[]; };
// type PlanLine = { id?: number; line_name: string; sublines?: PlanSubline[]; stations?: PlanStation[]; };
// type PlanDepartment = { id?: number; department_name: string; lines: PlanLine[]; stations?: PlanStation[]; };

// type HierarchyStructure = {
//   structure_id?: number;
//   structure_name: string;
//   hq?: number | null;
//   factory?: number | null;
//   hq_name?: string;
//   factory_name?: string;
//   structure_data: {
//     hq_name?: string;
//     factory_name?: string;
//     departments: PlanDepartment[];
//     stations?: PlanStation[];
//   };
// };

// type StationConfig = {
//   type: StationType;
//   label: string;
//   color: string;
//   icon: any;
//   imgUrl?: string;
//   desc: string;
//   type_id?: number;
// };

// // Fallback config
// const FALLBACK_CONFIG: StationConfig = {
//   type: 'NONE',
//   label: 'Standard',
//   color: 'from-blue-600 to-purple-700',
//   icon: Minus,
//   desc: 'Standard Station',
//   type_id: 0
// };

// // --- 4. Helper: Selection Style Generator (Fixed & Restored) ---

// const getSelectionStyle = (isSelected: boolean, isStation: boolean, stationType?: StationType, configs?: StationConfig[]) => {
//   if (!isSelected) {
//     return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-blue-300';
//   }

//   if (isStation) {
//     const config = (configs || []).find(t => t.type === (stationType || 'NONE')) || FALLBACK_CONFIG;
    
//     // If it's a HEX color, we return base classes (style applied inline)
//     if (config.color.startsWith('#')) {
//       return 'text-white shadow-md transform scale-105 border-transparent';
//     }
    
//     // If it's a Tailwind class, we return the class string
//     return `bg-gradient-to-r ${config.color} text-white shadow-md transform scale-105 border-transparent`;
//   }

//   return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md border-transparent';
// };

// // --- 5. Reusable Components ---

// const DynamicIcon = ({ config, className }: { config: StationConfig, className?: string }) => {
//   if (config.imgUrl) {
//     return (
//       <img
//         src={config.imgUrl}
//         alt={config.label}
//         className={`object-contain ${className}`}
//         onError={(e) => { e.currentTarget.style.display = 'none'; }}
//       />
//     );
//   }
//   const IconComponent = config.icon || Hexagon;
//   return <IconComponent className={className} />;
// };

// const SelectionCard = ({ title, icon: Icon, children, headerAction }: { title: string; icon: React.ComponentType<any>; children: React.ReactNode, headerAction?: React.ReactNode }) => (
//   <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//         <Icon className="mr-2 text-blue-600" size={20} /> {title}
//       </h3>
//       {headerAction}
//     </div>
//     {children}
//   </div>
// );

// const OptionButton = ({
//   option,
//   isSelected,
//   onClick,
//   variant = 'default',
//   stationType,
//   isStation = false,
//   configs
// }: {
//   option: string;
//   isSelected: boolean;
//   onClick?: () => void;
//   variant?: 'default' | 'small';
//   stationType?: StationType;
//   isStation?: boolean;
//   configs?: StationConfig[];
// }) => {
  
//   const baseClasses = `rounded-lg font-medium transition-all duration-200 flex items-center justify-center border-2 select-none`;
//   const sizeClasses = variant === 'small' ? 'px-3 py-2 text-sm' : 'px-4 py-3';
//   const cursorClass = onClick ? 'cursor-pointer' : 'cursor-default';
  
//   // Use the helper to get classes
//   const bgClass = getSelectionStyle(isSelected, isStation, stationType, configs);
  
//   // Handle inline styles for Hex colors
//   let inlineStyle = {};
//   let config = FALLBACK_CONFIG;

//   if (isSelected && isStation) {
//     config = (configs || []).find(t => t.type === (stationType || 'NONE')) || FALLBACK_CONFIG;
//     if (config.color.startsWith('#')) {
//       inlineStyle = getBackgroundStyle(config.color);
//     }
//   }

//   let RenderIcon = null;
//   if (isSelected && isStation) {
//     RenderIcon = () => <DynamicIcon config={config} className="w-4 h-4" />;
//   }

//   return (
//     <div 
//       className={`${baseClasses} ${bgClass} ${sizeClasses} ${cursorClass}`} 
//       onClick={onClick}
//       style={inlineStyle}
//     >
//       {RenderIcon && <div className="mr-2"><RenderIcon /></div>}
//       {option}
//     </div>
//   );
// };

// const RemoveButton = ({ onClick }: { onClick: () => void }) => (
//   <button onClick={onClick} className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
//     <X size={16} />
//   </button>
// );

// // --- 6. Settings Modal (Standard UI with Color Picker) ---

// const SettingsModal = ({
//   isOpen,
//   onClose,
//   configs,
//   onUpdateSuccess
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   configs: StationConfig[];
//   onUpdateSuccess: () => void;
// }) => {
//   if (!isOpen) return null;

//   const [newType, setNewType] = useState({ name: '', code: '', color: '#3b82f6' }); // Default Hex Blue
//   const [newTypeFile, setNewTypeFile] = useState<File | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [uploadingId, setUploadingId] = useState<number | null>(null);

//   const handleCreate = async () => {
//     if (!newType.name || !newType.code) return alert('Name and Code are required');

//     setIsCreating(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', newType.name);
//       formData.append('code', newType.code.toUpperCase());
//       formData.append('color', newType.color); // Sends Hex code
//       if (newTypeFile) formData.append('icon', newTypeFile);

//       await axios.post(`${API_BASE_URL}/station-types/`, formData);
//       setNewType({ name: '', code: '', color: '#3b82f6' });
//       setNewTypeFile(null);
//       onUpdateSuccess();
//     } catch (err: any) {
//       alert(err.response?.data?.detail || 'Failed to create type');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const updateColor = async (type_id: number, color: string) => {
//     try {
//       await axios.patch(`${API_BASE_URL}/station-types/${type_id}/`, { color });
//       onUpdateSuccess();
//     } catch (err) {
//       alert('Failed to update color');
//     }
//   };

//   const uploadIcon = async (e: React.ChangeEvent<HTMLInputElement>, type_id: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploadingId(type_id);
//     try {
//       const formData = new FormData();
//       formData.append('icon', file);
//       await axios.patch(`${API_BASE_URL}/station-types/${type_id}/`, formData);
//       onUpdateSuccess();
//     } catch (err) {
//       alert('Icon upload failed');
//     } finally {
//       setUploadingId(null);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        
//         {/* Header */}
//         <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
//           <div>
//             <h2 className="text-2xl font-bold flex items-center text-gray-800">
//               <Settings className="mr-3 text-blue-600" size={28} /> 
//               Station Configuration
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">Manage your station types, icons, and colors.</p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-8 overflow-y-auto bg-gray-50/30 flex-1">
          
//           {/* Create New Type Section */}
//           <div className="bg-white p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-10 relative overflow-hidden group">
//             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            
//             <h3 className="text-lg font-bold mb-6 flex items-center text-gray-800">
//               <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">
//                  <Plus size={20} />
//               </span>
//               Define New Station Type
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
//               {/* Name Input */}
//               <div className="md:col-span-4">
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Name</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Quality Control"
//                   value={newType.name}
//                   onChange={e => setNewType(p => ({ ...p, name: e.target.value }))}
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                 />
//               </div>

//               {/* Code Input */}
//               <div className="md:col-span-3">
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Short Code</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. QC"
//                   value={newType.code}
//                   onChange={e => setNewType(p => ({ ...p, code: e.target.value }))}
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                   maxLength={10}
//                 />
//               </div>

//               {/* Native Color Picker Input */}
//               <div className="md:col-span-2">
//                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Color</label>
//                 <div className="flex items-center h-[50px] w-full px-2 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 relative cursor-pointer">
//                   {/* Color Preview Box */}
//                   <div className="w-full h-8 rounded border border-gray-300 shadow-sm" style={{ backgroundColor: newType.color }}></div>
//                   <input
//                     type="color"
//                     value={newType.color}
//                     onChange={(e) => setNewType(p => ({ ...p, color: e.target.value }))}
//                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                     title="Choose Color"
//                   />
//                 </div>
//               </div>

//               {/* Icon Upload */}
//               <div className="md:col-span-3">
//                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Icon (Optional)</label>
//                  <label className="flex items-center justify-center h-[50px] px-4 bg-gray-50 border border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all text-sm text-gray-600 truncate">
//                     <Upload className="mr-2 flex-shrink-0" size={16} />
//                     <span className="truncate">{newTypeFile ? newTypeFile.name : 'Choose File'}</span>
//                     <input type="file" accept="image/*" className="hidden" onChange={e => setNewTypeFile(e.target.files?.[0] || null)} />
//                  </label>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end">
//                 <button
//                 onClick={handleCreate}
//                 disabled={isCreating}
//                 className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center"
//                 >
//                 {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
//                 Create Station Type
//                 </button>
//             </div>
//           </div>

//           {/* Existing Types List */}
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-bold text-gray-800">Existing Station Types</h3>
//             <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
//                 {configs.length} Types Found
//             </span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {configs.map(config => {
//                 // Determine display style based on whether color is Hex or Tailwind Class
//                 const isHex = config.color.startsWith('#');
//                 const bgStyle = isHex ? getBackgroundStyle(config.color) : {};
//                 const bgClass = isHex ? 'text-white shadow-md' : `bg-gradient-to-br ${config.color} text-white shadow-md`;

//                 return (
//                 <div key={config.type} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all flex flex-col">
//                     <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-4">
//                              {/* Icon Preview */}
//                             <div 
//                                 className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${bgClass}`}
//                                 style={bgStyle}
//                             >
//                                 <DynamicIcon config={config} className="w-8 h-8" />
//                             </div>
//                             <div>
//                                 <h4 className="font-bold text-gray-800 text-lg leading-tight">{config.label}</h4>
//                                 <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block border border-gray-200">
//                                     {config.type}
//                                 </code>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
//                         {/* Inline Color Picker for Updates */}
//                         <div className="relative group">
//                             <label className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
//                                 <div 
//                                     className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
//                                     style={{ background: isHex ? config.color : 'transparent' }} 
//                                 ></div>
//                                 <span>Edit Color</span>
//                                 {/* The actual input is hidden but clickable via label */}
//                                 <input 
//                                     type="color" 
//                                     className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
//                                     defaultValue={isHex ? config.color : '#000000'}
//                                     onBlur={(e) => config.type_id && updateColor(config.type_id, e.target.value)}
//                                 />
//                             </label>
//                         </div>

//                         {/* Icon Upload Button */}
//                         <label className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
//                             {uploadingId === config.type_id ? (
//                                 <Loader2 className="animate-spin text-blue-600" size={16} />
//                             ) : (
//                                 <Edit2 size={14} />
//                             )}
//                             <span>Edit Icon</span>
//                             <input type="file" accept="image/*" className="hidden" onChange={e => config.type_id && uploadIcon(e, config.type_id)} />
//                         </label>
//                     </div>
//                 </div>
//             )})}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// const TypeSelectionModal = ({
//   isOpen,
//   stationName,
//   configs,
//   onSelect,
//   onClose
// }: {
//   isOpen: boolean;
//   stationName: string;
//   configs: StationConfig[];
//   onSelect: (type: StationType) => void;
//   onClose: () => void;
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-100">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Select Station Type</h2>
//             <p className="text-gray-500 mt-1">Assigning type for: <span className="font-bold text-blue-600">{stationName}</span></p>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={28} /></button>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {/* Always show Standard / Default Option */}
//             <button
//                 onClick={() => onSelect('NONE')}
//                 className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-gray-400 hover:bg-gray-50 transition-all text-center flex flex-col items-center shadow-sm hover:shadow-xl"
//             >
//                 <div className="w-full aspect-square rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-500 to-purple-600">
//                    <Minus className="w-16 h-16 text-white" />
//                 </div>
//                 <div className="text-lg font-bold text-gray-800 group-hover:text-gray-900">Standard</div>
//                 <div className="text-sm text-gray-500 mt-1">No specific type</div>
//             </button>

//             {/* Render Custom Types */}
//             {configs.map(config => {
//               const isHex = config.color.startsWith('#');
//               const bgStyle = isHex ? getBackgroundStyle(config.color) : {};
//               const bgClass = isHex ? '' : `bg-gradient-to-br ${config.color}`;

//               return (
//               <button
//                 key={config.type}
//                 onClick={() => onSelect(config.type)}
//                 className="group p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center shadow-sm hover:shadow-xl"
//               >
//                 <div 
//                   className={`w-full aspect-square rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300 ${bgClass}`}
//                   style={bgStyle}
//                 >
//                   <DynamicIcon config={config} className="w-16 h-16 text-white" />
//                 </div>
//                 <div className="text-lg font-bold text-gray-800 group-hover:text-blue-700">{config.type}</div>
//                 <div className="text-sm text-gray-500 mt-1">{config.label}</div>
//               </button>
//             )})}
//           </div>
//       </div>
//     </div>
//   );
// };



// // --- 8. Main Component ---

// const Planning = () => {
//   // State Initialization
//   const [stationConfigs, setStationConfigs] = useState<StationConfig[]>([]); 
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   // --- Fetch Logic (Updated for Colors) ---
//   const fetchStationConfigs = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/station-types/`);
//       const dbTypes = response.data;

//       if (!dbTypes || dbTypes.length === 0) {
//         setStationConfigs([]);
//         return;
//       }

//       // Map DB types to Config objects
//       const mergedConfigs: StationConfig[] = dbTypes.map((dbType: any) => {
//         return {
//           type: dbType.code,
//           label: dbType.name,
//           desc: 'Station Type',
//           color: dbType.color || 'from-gray-500 to-gray-600', // Use DB color or fallback
//           icon: Hexagon, 
//           imgUrl: dbType.icon_url,
//           type_id: dbType.type_id
//         };
//       });

//       setStationConfigs(mergedConfigs);
//       setApiError(null);

//     } catch (error) {
//       console.error("Error fetching station types", error);
//       setApiError("Failed to fetch station types.");
//       setStationConfigs([]);
//     }
//   };

//   const [plan, setPlan] = useState<HierarchyStructure>({
//     structure_name: '',
//     hq: null,
//     factory: null,
//     structure_data: { departments: [], stations: [] }
//   });

//   const [showSummary, setShowSummary] = useState(false);
//   const [newItems, setNewItems] = useState({ hq: '', factory: '', department: '', line: '', subline: '', station: '' });
//   const [isSaving, setIsSaving] = useState(false);
//   const [savedStructures, setSavedStructures] = useState<HierarchyStructure[]>([]);
//   const [selectedStructure, setSelectedStructure] = useState<HierarchyStructure | null>(null);

//   const [data, setData] = useState({ hqs: [] as Hq[], factories: [] as Factory[], departments: [] as Department[], lines: [] as Line[], sublines: [] as SubLine[], stations: [] as Station[] });
//   const [isLoading, setIsLoading] = useState({ hqs: false, factories: false, departments: false, lines: false, sublines: false, stations: false, structures: false });

//   const [levelEnabled, setLevelEnabled] = useState({ hq: true, factory: true, department: true, line: true, subline: true, station: true });

//   const [pendingSelection, setPendingSelection] = useState<{
//     deptIdx: number;
//     lineIdx?: number;
//     subIdx?: number | null;
//     station: Station;
//   } | null>(null);

//   const effectiveEnabled = {
//     hq: levelEnabled.hq,
//     factory: levelEnabled.hq && levelEnabled.factory,
//     department: levelEnabled.hq && levelEnabled.factory && levelEnabled.department,
//     line: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line,
//     subline: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line && levelEnabled.subline,
//     station: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line && levelEnabled.subline && levelEnabled.station
//   };

//   // --- API Functions ---

//   const fetchData = async (endpoint: string, key: keyof typeof data) => {
//     setIsLoading(prev => ({ ...prev, [key]: true }));
//     try {
//       const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
//       setData(prev => ({ ...prev, [key]: response.data }));
//     } catch (error) {
//       console.error(`Error fetching ${key}:`, error);
//     } finally {
//       setIsLoading(prev => ({ ...prev, [key]: false }));
//     }
//   };

//   const fetchFactories = (hqId?: number) => fetchData(hqId ? `factories/?hq=${hqId}` : 'factories/', 'factories');
//   const fetchDepartments = (factoryId?: number, hqId?: number) => fetchData(`departments/${factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'departments');
//   const fetchLines = (departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`lines/${departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'lines');
//   const fetchSubLines = (lineId?: number, departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`sublines/${lineId ? `?line=${lineId}` : departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'sublines');
//   const fetchStations = (sublineId?: number, lineId?: number, departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`stations/${sublineId ? `?subline=${sublineId}` : lineId ? `?line=${lineId}` : departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'stations');
//   const fetchHqs = () => fetchData('hq/', 'hqs');

//   const fetchHierarchyStructures = async () => {
//     setIsLoading(prev => ({ ...prev, structures: true }));
//     try {
//       const response = await axios.get(`${API_BASE_URL}/hierarchy-simple/`);
//       setSavedStructures(response.data);
//     } catch (error) {
//       console.error('Error fetching hierarchy structures:', error);
//     } finally {
//       setIsLoading(prev => ({ ...prev, structures: false }));
//     }
//   };

//   // --- Creation Handlers ---

//   const handleAddNewItem = async (type: keyof typeof newItems) => {
//     if (!newItems[type]) return;
//     const endpointMap = { hq: 'hq/', factory: 'factories/', department: 'departments/', line: 'lines/', subline: 'sublines/', station: 'stations/' };
//     const nameFieldMap = { hq: 'hq_name', factory: 'factory_name', department: 'department_name', line: 'line_name', subline: 'subline_name', station: 'station_name' };
//     try {
//       const payload = { [nameFieldMap[type]]: newItems[type] };
//       await axios.post(`${API_BASE_URL}/${endpointMap[type]}`, payload);
//       setNewItems(prev => ({ ...prev, [type]: '' }));
//       if (type === 'hq') await fetchHqs();
//       else if (type === 'factory' && plan.structure_data.hq_name) {
//         const hq = data.hqs.find(h => h.hq_name === plan.structure_data.hq_name);
//         if (hq) await fetchFactories(hq.hq_id);
//       } else if (type === 'department' && plan.structure_data.factory_name) {
//         const factory = data.factories.find(f => f.factory_name === plan.structure_data.factory_name);
//         if (factory) await fetchDepartments(factory.factory_id);
//       }
//     } catch (error) { console.error(`Error adding ${type}:`, error); }
//   };

//   // --- Selection Handlers (Structure) ---

//   const handleHqSelect = (hqName: string) => {
//     const selectedHq = data.hqs.find(h => h.hq_name === hqName);
//     if (selectedHq) {
//       setPlan(prev => ({ ...prev, hq: selectedHq.hq_id, structure_data: { ...prev.structure_data, hq_name: hqName, departments: [], stations: [] } }));
//       fetchFactories(selectedHq.hq_id); setShowSummary(false); setSelectedStructure(null);
//     }
//   };
//   const handleFactorySelect = (factoryName: string) => {
//     const selectedFactory = data.factories.find(f => f.factory_name === factoryName);
//     if (selectedFactory) {
//       setPlan(prev => ({ ...prev, factory: selectedFactory.factory_id, structure_data: { ...prev.structure_data, factory_name: factoryName, departments: [], stations: [] } }));
//       fetchDepartments(selectedFactory.factory_id); setShowSummary(false); setSelectedStructure(null);
//     }
//   };

//   const handleDepartmentSelect = (departmentName: string) => {
//     const selectedDepartment = data.departments.find(d => d.department_name === departmentName);
//     if (selectedDepartment) {
//       setPlan(prev => {
//         const isSelected = prev.structure_data.departments.some(d => d.department_name === departmentName);
//         if (isSelected) {
//           return { ...prev, structure_data: { ...prev.structure_data, departments: prev.structure_data.departments.filter(d => d.department_name !== departmentName) } };
//         } else {
//           return { ...prev, structure_data: { ...prev.structure_data, departments: [...prev.structure_data.departments, { department_name: departmentName, id: selectedDepartment.department_id, lines: [], stations: !levelEnabled.line ? [] : undefined }] } };
//         }
//       });
//       if (levelEnabled.line) fetchLines(selectedDepartment.department_id);
//       else if (levelEnabled.station) fetchStations(undefined, undefined, selectedDepartment.department_id);
//       setShowSummary(false);
//     }
//   };

//   const handleLineSelect = (departmentIndex: number, lineName: string) => {
//     const selectedLine = data.lines.find(l => l.line_name === lineName);
//     if (selectedLine) {
//       setPlan(prev => {
//         const updatedDepartments = [...prev.structure_data.departments];
//         const department = updatedDepartments[departmentIndex];
//         const isSelected = department.lines.some(l => l.line_name === lineName);
//         if (isSelected) {
//           updatedDepartments[departmentIndex] = { ...department, lines: department.lines.filter(l => l.line_name !== lineName) };
//         } else {
//           updatedDepartments[departmentIndex] = { ...department, lines: [...department.lines, { line_name: lineName, id: selectedLine.line_id, sublines: levelEnabled.subline ? [] : undefined, stations: !levelEnabled.subline ? [] : undefined }] };
//         }
//         return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
//       });
//       if (levelEnabled.subline) fetchSubLines(selectedLine.line_id);
//       else if (levelEnabled.station) fetchStations(undefined, selectedLine.line_id);
//       setShowSummary(false);
//     }
//   };

//   const handleSubLineSelect = (departmentIndex: number, lineIndex: number, sublineName: string) => {
//     const selectedSubLine = data.sublines.find(s => s.subline_name === sublineName);
//     if (selectedSubLine) {
//       setPlan(prev => {
//         const updatedDepartments = [...prev.structure_data.departments];
//         const updatedLines = [...updatedDepartments[departmentIndex].lines];
//         const updatedSubLines = [...updatedLines[lineIndex].sublines || []];
//         const sublineIndex = updatedSubLines.findIndex(s => s.subline_name === sublineName);
//         if (sublineIndex === -1) updatedSubLines.push({ subline_name: sublineName, id: selectedSubLine.subline_id, stations: [] });
//         else updatedSubLines.splice(sublineIndex, 1);
//         updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedSubLines };
//         updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedLines };
//         return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
//       });
//       fetchStations(selectedSubLine.subline_id); setShowSummary(false);
//     }
//   };

//   // --- Selection Handlers (Stations with Type Logic) ---

//   const confirmStationType = (type: StationType) => {
//     if (!pendingSelection) return;
//     const { deptIdx, lineIdx, subIdx, station } = pendingSelection;

//     setPlan(prev => {
//       const updatedDepartments = [...prev.structure_data.departments];
//       const department = updatedDepartments[deptIdx];

//       const newStationEntry: PlanStation = {
//         station_name: station.station_name,
//         id: station.station_id,
//         station_type: type
//       };

//       if (lineIdx === undefined) {
//         // Department level station
//         const updatedStations = [...(department.stations || [])];
//         updatedStations.push(newStationEntry);
//         updatedDepartments[deptIdx] = { ...department, stations: updatedStations };
//       } else {
//         const updatedLines = [...(department.lines || [])];

//         if (subIdx !== undefined && subIdx !== null && levelEnabled.subline) {
//           // Subline level station
//           const updatedSubLines = [...(updatedLines[lineIdx].sublines || [])];
//           const subline = updatedSubLines[subIdx];
//           const updatedStations = [...subline.stations];
//           updatedStations.push(newStationEntry);
//           updatedSubLines[subIdx] = { ...subline, stations: updatedStations };
//           updatedLines[lineIdx] = { ...updatedLines[lineIdx], sublines: updatedSubLines };
//         } else {
//           // Line level station
//           const updatedStations = [...(updatedLines[lineIdx].stations || [])];
//           updatedStations.push(newStationEntry);
//           updatedLines[lineIdx] = { ...updatedLines[lineIdx], stations: updatedStations };
//         }
//         updatedDepartments[deptIdx] = { ...department, lines: updatedLines };
//       }
//       return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
//     });

//     setPendingSelection(null);
//     setShowSummary(false);
//   };

//   const handleDepartmentStationSelect = (departmentIndex: number, stationId: number) => {
//     const selectedStation = data.stations.find(s => s.station_id === stationId);
//     if (!selectedStation) return;

//     const dept = plan.structure_data.departments[departmentIndex];
//     const existingStation = dept.stations?.find(s => s.id === stationId);

//     if (existingStation) {
//       setPlan(prev => {
//         const updatedDepartments = [...prev.structure_data.departments];
//         updatedDepartments[departmentIndex] = {
//           ...updatedDepartments[departmentIndex],
//           stations: updatedDepartments[departmentIndex].stations?.filter(s => s.id !== stationId)
//         };
//         return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
//       });
//     } else {
//       setPendingSelection({ deptIdx: departmentIndex, station: selectedStation });
//     }
//   };

//   const handleStationSelect = (departmentIndex: number, lineIndex: number, sublineIndex: number | null, stationId: number) => {
//     const selectedStation = data.stations.find(s => s.station_id === stationId);
//     if (!selectedStation) return;

//     let exists = false;
//     const dept = plan.structure_data.departments[departmentIndex];
//     const line = dept.lines[lineIndex];

//     if (sublineIndex !== null && levelEnabled.subline) {
//       const subline = line.sublines?.[sublineIndex];
//       exists = subline?.stations.some(s => s.id === stationId) || false;
//     } else {
//       exists = line.stations?.some(s => s.id === stationId) || false;
//     }

//     if (exists) {
//       setPlan(prev => {
//         const updatedDepartments = [...prev.structure_data.departments];
//         const department = updatedDepartments[departmentIndex];
//         const updatedLines = [...(department.lines || [])];
//         if (sublineIndex !== null && levelEnabled.subline) {
//           const updatedSubLines = [...(updatedLines[lineIndex]?.sublines || [])];
//           if (updatedSubLines[sublineIndex]) {
//             updatedSubLines[sublineIndex] = { ...updatedSubLines[sublineIndex], stations: updatedSubLines[sublineIndex].stations.filter(s => s.id !== stationId) };
//             updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedSubLines };
//           }
//         } else {
//           updatedLines[lineIndex] = { ...updatedLines[lineIndex], stations: updatedLines[lineIndex].stations?.filter(s => s.id !== stationId) };
//         }
//         updatedDepartments[departmentIndex] = { ...department, lines: updatedLines };
//         return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
//       });
//     } else {
//       setPendingSelection({ deptIdx: departmentIndex, lineIdx: lineIndex, subIdx: sublineIndex, station: selectedStation });
//     }
//   };

//   // --- Removal Helpers ---
//   const removeDepartment = (index: number) => { setPlan(prev => ({ ...prev, structure_data: { ...prev.structure_data, departments: prev.structure_data.departments.filter((_, i) => i !== index) } })); };
//   const removeLine = (departmentIndex: number, lineIndex: number) => { setPlan(prev => { const updatedDepartments = [...prev.structure_data.departments]; updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedDepartments[departmentIndex].lines.filter((_, i) => i !== lineIndex) }; return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } }; }); };
//   const removeSubLine = (departmentIndex: number, lineIndex: number, sublineIndex: number) => { setPlan(prev => { const updatedDepartments = [...prev.structure_data.departments]; const updatedLines = [...updatedDepartments[departmentIndex].lines]; updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedLines[lineIndex].sublines?.filter((_, i) => i !== sublineIndex) || [] }; updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedLines }; return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } }; }); };

//   // --- Data Persistence ---

//   const saveHierarchyStructure = async () => {
//     if (!hasCompletePlan()) return;
//     setIsSaving(true);
//     try {
//       const payload = {
//         structure_name: plan.structure_name || `Structure-${Date.now()}`,
//         structure_data: plan.structure_data,
//         hq: plan.hq || null,
//         factory: plan.factory || null
//       };

//       if (!plan.structure_id) {
//         await axios.post(`${API_BASE_URL}/hierarchy-structures/`, payload);
//         alert('New hierarchy saved');
//       } else {
//         await axios.put(`${API_BASE_URL}/hierarchy-structures/${plan.structure_id}/`, payload);
//         alert('Hierarchy updated successfully');
//       }
//       await fetchHierarchyStructures();
//       setShowSummary(true);
//     } catch (error: any) {
//       console.error('Error saving/updating hierarchy structure:', error);
//       const serverMsg = error?.response?.data?.detail || error?.response?.data || null;
//       alert(`Error: ${JSON.stringify(serverMsg) || error.message}`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const loadStructure = (structure: HierarchyStructure) => {
//     // 1. Set the plan data
//     setPlan(structure);
//     setSelectedStructure(structure);

//     // 2. Intelligently determine enabled levels from data
//     const hasDepartments = structure.structure_data.departments.length > 0;
//     const hasLines = structure.structure_data.departments.some(d => d.lines && d.lines.length > 0);
//     const hasSublines = structure.structure_data.departments.some(d =>
//       d.lines?.some(l => l.sublines && l.sublines.length > 0)
//     );

//     setLevelEnabled({
//       hq: !!structure.structure_data.hq_name,
//       factory: !!structure.structure_data.factory_name,
//       department: hasDepartments,
//       line: hasLines,
//       subline: hasSublines,
//       station: true
//     });

//     setShowSummary(false);

//     // 3. Fetch necessary data for editing
//     if (structure.hq) fetchFactories(structure.hq);
//     if (structure.factory) fetchDepartments(structure.factory);

//     structure.structure_data.departments.forEach(dept => {
//       if (dept.id) {
//         if (hasLines) fetchLines(dept.id);
//         if (dept.stations?.length) fetchStations(undefined, undefined, dept.id);
//         dept.lines.forEach(line => {
//           if (line.id) {
//             if (hasSublines) fetchSubLines(line.id);
//             if (line.stations?.length) fetchStations(undefined, line.id);
//             line.sublines?.forEach(sub => {
//               if (sub.id) fetchStations(sub.id);
//             });
//           }
//         });
//       }
//     });
//   };

//   const hasCompletePlan = () => {
//     if (levelEnabled.hq && !plan.structure_data.hq_name) return false;
//     if (levelEnabled.factory && !plan.structure_data.factory_name) return false;
//     if (levelEnabled.department && plan.structure_data.departments.length === 0) return false;
//     return true;
//   };

//   useEffect(() => {
//     fetchHqs();
//     fetchHierarchyStructures();
//     fetchStationConfigs();
//   }, []);

//   useEffect(() => { if (!levelEnabled.hq) fetchFactories(); }, [levelEnabled.hq]);
//   useEffect(() => { if (!levelEnabled.factory && levelEnabled.department) fetchDepartments(); }, [levelEnabled.factory, levelEnabled.department]);

//   const getPlanStation = (id: number, list?: PlanStation[]) => {
//     return list?.find(s => s.id === id);
//   };

//   // --- UI Components ---

//  const SavedStructuresList = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         <Save className="mr-2 text-blue-600" size={20} />
//         Saved Manufacturing Plans
//       </h3>
//       {isLoading.structures ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading saved plans...</p>
//         </div>
//       ) : savedStructures.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">No saved manufacturing plans found</div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {savedStructures.map((structure, idx) => (
//             <div key={idx} className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${selectedStructure?.structure_id === structure.structure_id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => loadStructure(structure)}>
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-bold text-gray-800 flex items-center">
//                   {structure.hq_name && <MapPin className="mr-2 text-red-600" size={18} />}
//                   {structure.factory_name && <Building className="mr-2 text-purple-600" size={18} />}
//                   {structure.structure_name}
//                 </h4>
//                 {selectedStructure?.structure_id === structure.structure_id && <CheckCircle className="text-green-500" size={18} />}
//               </div>
//               <div className="text-sm text-gray-600">
//                 {structure.hq_name && (
//                   <div className="flex items-center mb-1">
//                     <MapPin className="mr-1" size={14} />
//                     {structure.hq_name}
//                   </div>
//                 )}
//                 {structure.factory_name && (
//                   <div className="flex items-center mb-1">
//                     <Building className="mr-1" size={14} />
//                     {structure.factory_name}
//                   </div>
//                 )}
//                 <div className="flex items-center mb-1">
//                   <Layers className="mr-1" size={14} />
//                   {structure.structure_data.departments?.length || 0} Departments
//                 </div>
//                 <div className="flex items-center">
//                   <Zap className="mr-1" size={14} />
//                   {structure.structure_data.departments?.reduce((acc, d) => acc + (d.lines?.length || 0), 0) || 0} Lines
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const PlanSummary = () => (
//     <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-green-200">
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//           <CheckCircle className="text-white" size={32} />
//         </div>
//         <h3 className="text-2xl font-bold text-gray-800 mb-2">Manufacturing Plan Summary</h3>
//         <p className="text-gray-600">Your production hierarchy is ready!</p>
//       </div>

//       <div className="space-y-8">
//         <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//           <div className="flex items-center justify-center space-x-8">
//             {effectiveEnabled.hq && plan.structure_data.hq_name && (
//               <div className={getSelectionStyle(true, false)}>
//                 <div className="px-6 py-3 flex items-center rounded-lg">
//                   <MapPin className="mr-2" size={20} />
//                   <span className="font-semibold text-xl">{plan.structure_data.hq_name}</span>
//                 </div>
//               </div>
//             )}
//             {effectiveEnabled.factory && plan.structure_data.factory_name && (
//               <div className={getSelectionStyle(true, false)}>
//                 <div className="px-6 py-3 flex items-center rounded-lg">
//                   <Building className="mr-2" size={20} />
//                   <span className="font-semibold text-xl">{plan.structure_data.factory_name}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
//           <h4 className="text-xl font-bold text-gray-800 mb-6 text-center">Production Flow Hierarchy</h4>
//           <div className="flex flex-col items-center min-w-max">

//             {levelEnabled.department && plan.structure_data.departments.length > 0 && (
//               <>
//                 <div className="flex gap-12 mb-6">
//                   {plan.structure_data.departments.map((department, deptIdx) => (
//                     <div key={deptIdx} className="flex flex-col items-center">
//                       <div className={`px-6 py-3 rounded-lg shadow-md font-medium flex items-center mb-4 ${getSelectionStyle(true, false)}`}>
//                         <Layers className="mr-2" size={20} />
//                         {department.department_name}
//                       </div>

//                       {!levelEnabled.line && levelEnabled.station && department.stations && department.stations.length > 0 && (
//                         <>
//                           <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-red-400 mb-3"></div>
//                           <div className="flex flex-wrap gap-2 justify-center">
//                             {department.stations.map((station, stationIdx) => {
//                               const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
//                               const isHex = config.color.startsWith('#');
//                               const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
//                               const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

//                               return (
//                                 <div 
//                                     key={stationIdx} 
//                                     className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
//                                     style={inlineStyle}
//                                 >
//                                   <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
//                                   {station.station_name}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </>
//                       )}

//                       {levelEnabled.line && department.lines.length > 0 && (
//                         <>
//                           <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-green-400 mb-4"></div>
//                           <div className="flex gap-8">
//                             {department.lines.map((line, lineIdx) => (
//                               <div key={lineIdx} className="flex flex-col items-center">
//                                 <div className={`px-5 py-2 rounded-lg shadow-md font-medium flex items-center mb-3 ${getSelectionStyle(true, false)}`}>
//                                   <Zap className="mr-2" size={18} />
//                                   {line.line_name}
//                                 </div>

//                                 {levelEnabled.subline && line.sublines && line.sublines.length > 0 && (
//                                   <>
//                                     <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-yellow-400 mb-3"></div>
//                                     <div className="flex gap-6">
//                                       {line.sublines.map((subline, sublineIdx) => (
//                                         <div key={sublineIdx} className="flex flex-col items-center">
//                                           <div className={`px-4 py-2 rounded-md shadow text-sm font-medium flex items-center mb-2 ${getSelectionStyle(true, false)}`}>
//                                             <Zap className="mr-1" size={14} />
//                                             {subline.subline_name}
//                                           </div>

//                                           {levelEnabled.station && subline.stations.length > 0 && (
//                                             <>
//                                               <div className="w-0.5 h-4 bg-gradient-to-b from-yellow-400 to-red-400 mb-2"></div>
//                                               <div className="flex flex-col items-center gap-2">
//                                                 {subline.stations.map((station, stationIdx) => {
//                                                   const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
//                                                   const isHex = config.color.startsWith('#');
//                                                   const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
//                                                   const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

//                                                   return (
//                                                     <div 
//                                                         key={stationIdx} 
//                                                         className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
//                                                         style={inlineStyle}
//                                                     >
//                                                       <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
//                                                       {station.station_name}
//                                                     </div>
//                                                   );
//                                                 })}
//                                               </div>
//                                             </>
//                                           )}
//                                         </div>
//                                       ))}
//                                     </div>
//                                   </>
//                                 )}

//                                 {!levelEnabled.subline && levelEnabled.station && line.stations && line.stations.length > 0 && (
//                                   <>
//                                     <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-red-400 mb-3"></div>
//                                     <div className="flex flex-col items-center gap-2">
//                                       {line.stations.map((station, stationIdx) => {
//                                         const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
//                                         const isHex = config.color.startsWith('#');
//                                         const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
//                                         const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

//                                         return (
//                                           <div 
//                                             key={stationIdx} 
//                                             className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
//                                             style={inlineStyle}
//                                           >
//                                             <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
//                                             {station.station_name}
//                                           </div>
//                                         );
//                                       })}
//                                     </div>
//                                   </>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between mt-8">
//         <button onClick={() => setShowSummary(false)} className="py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
//           <ArrowRight className="mr-2 rotate-180" size={20} />
//           Continue Editing Plan
//         </button>
//         <button onClick={saveHierarchyStructure} disabled={isSaving} className="py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
//           {isSaving ? <><Loader2 className="mr-2 animate-spin" size={20} />Saving...</> : <><Save className="mr-2" size={20} />Save Plan</>}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
//       {/* Modals */}
//       <TypeSelectionModal
//         isOpen={!!pendingSelection}
//         stationName={pendingSelection?.station.station_name || ''}
//         configs={stationConfigs}
//         onSelect={confirmStationType}
//         onClose={() => setPendingSelection(null)}
//       />

//       <SettingsModal
//         isOpen={isSettingsOpen}
//         onClose={() => setIsSettingsOpen(false)}
//         configs={stationConfigs}
//         onUpdateSuccess={fetchStationConfigs}
//       />

//       <div className="max-w-6xl mx-auto relative">
//         {/* Settings Button - Positioned Top Right */}
//         <button
//           onClick={() => setIsSettingsOpen(true)}
//           className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg hover:shadow-xl text-blue-600 hover:text-blue-800 transition-all transform hover:scale-105"
//           title="Station Type Settings"
//         >
//           <Settings size={28} />
//         </button>

//         {/* Header */}
//         <div className="flex justify-between items-start mb-8 pt-4">
//           <div className="text-center flex-1">
//             <h1 className="text-4xl  py-3 md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-5">
//               Manufacturing Planning System
//             </h1>
//             <br></br>
//             <p className="text-xl  text-gray-600 max-w-2xl mx-auto">Design your production hierarchy with precision and types</p>
//           </div>
//         </div>

//         {apiError && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-center">
//             <AlertTriangle className="mr-2" /> {apiError}
//           </div>
//         )}

//         {/* Creation Input */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//             <Plus className="mr-2 text-blue-600" size={20} />
//             Add New Items
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[
//               { key: 'hq', label: 'Headquarters' }, { key: 'factory', label: 'Factory' },
//               { key: 'department', label: 'Department' }, { key: 'line', label: 'Line' },
//               { key: 'subline', label: 'Sub Line' }, { key: 'station', label: 'Station' }
//             ].map((item) => (
//               <div key={item.key}>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
//                 <div className="flex">
//                   <input
//                     type="text"
//                     value={newItems[item.key as keyof typeof newItems]}
//                     onChange={(e) => setNewItems(prev => ({ ...prev, [item.key]: e.target.value }))}
//                     className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder={item.label}
//                   />
//                   <button onClick={() => handleAddNewItem(item.key as keyof typeof newItems)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg flex items-center justify-center">
//                     <Plus size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <SavedStructuresList />

//         {showSummary ? <PlanSummary /> : (
//           <div className="space-y-8">
//             <SelectionCard title="Enable / Disable Hierarchy Levels" icon={Layers}>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {[
//                   { key: 'hq', label: 'Headquarters' }, { key: 'factory', label: 'Factory' },
//                   { key: 'department', label: 'Department' }, { key: 'line', label: 'Production Line' },
//                   { key: 'subline', label: 'Sub Line' }, { key: 'station', label: 'Station' }
//                 ].map((lvl) => (
//                   <OptionButton
//                     key={lvl.key}
//                     option={`${lvl.label}: ${levelEnabled[lvl.key as keyof typeof levelEnabled] ? 'On' : 'Off'}`}
//                     isSelected={levelEnabled[lvl.key as keyof typeof levelEnabled]}
//                     onClick={() => setLevelEnabled(prev => {
//                       const key = lvl.key as keyof typeof prev;
//                       return { ...prev, [key]: !prev[key] };
//                     })}
//                   />
//                 ))}
//               </div>
//             </SelectionCard>

//             {levelEnabled.hq && (
//               <SelectionCard title="Choose Headquarters" icon={MapPin}>
//                 {isLoading.hqs ? (
//                   <div className="text-center py-8">Loading...</div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {data.hqs.map(hq => (
//                       <OptionButton key={hq.hq_id} option={hq.hq_name} isSelected={plan.structure_data.hq_name === hq.hq_name} onClick={() => handleHqSelect(hq.hq_name)} />
//                     ))}
//                   </div>
//                 )}
//               </SelectionCard>
//             )}

//             {(levelEnabled.hq ? !!plan.structure_data.hq_name : true) && levelEnabled.factory && (
//               <SelectionCard title="Choose Manufacturing Factory" icon={Building}>
//                 {isLoading.factories ? (
//                   <div className="text-center py-8">Loading...</div>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     {data.factories.map(factory => (
//                       <OptionButton key={factory.factory_id} option={factory.factory_name} isSelected={plan.structure_data.factory_name === factory.factory_name} onClick={() => handleFactorySelect(factory.factory_name)} />
//                     ))}
//                   </div>
//                 )}
//               </SelectionCard>
//             )}

//             {(levelEnabled.factory ? !!plan.structure_data.factory_name : true) && (
//               <SelectionCard title="Configure Departments & Production Structure" icon={Layers}>
//                 {levelEnabled.department && (
//                   <div className="mb-6">
//                     <h4 className="text-lg font-semibold text-gray-700 mb-4">Available Departments:</h4>
//                     {isLoading.departments ? (
//                       <div className="text-center py-4">Loading...</div>
//                     ) : (
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         {data.departments.map(department => (
//                           <OptionButton
//                             key={department.department_id}
//                             option={department.department_name}
//                             isSelected={plan.structure_data.departments.some(d => d.department_name === department.department_name)}
//                             onClick={() => handleDepartmentSelect(department.department_name)}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {levelEnabled.department && plan.structure_data.departments.map((department, departmentIndex) => (
//                   <div key={departmentIndex} className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200 shadow-inner">
//                     <div className="flex items-center justify-between mb-6">
//                       <h4 className="text-xl font-bold text-gray-800 flex items-center">
//                         <Layers className="mr-2 text-blue-600" size={20} />
//                         {department.department_name}
//                       </h4>
//                       <RemoveButton onClick={() => removeDepartment(departmentIndex)} />
//                     </div>

//                     {!levelEnabled.line && levelEnabled.station && (
//                       <div className="mb-6">
//                         <h5 className="text-lg font-semibold text-gray-700 mb-3">Department Stations:</h5>
//                         {isLoading.stations ? (
//                           <div className="text-center py-4">Loading...</div>
//                         ) : (
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
//                             {data.stations.map(station => {
//                               const planStation = getPlanStation(station.station_id, department.stations);
//                               return (
//                                 <OptionButton
//                                   key={station.station_id}
//                                   option={station.station_name}
//                                   isSelected={!!planStation}
//                                   isStation={true}
//                                   stationType={planStation?.station_type}
//                                   configs={stationConfigs}
//                                   onClick={() => handleDepartmentStationSelect(departmentIndex, station.station_id)}
//                                   variant="small"
//                                 />
//                               );
//                             })}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {levelEnabled.line && (
//                       <div className="mb-6">
//                         <h5 className="text-lg font-semibold text-gray-700 mb-3">Production Lines:</h5>
//                         {isLoading.lines ? (
//                           <div className="text-center py-4">Loading...</div>
//                         ) : (
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
//                             {data.lines.map(line => (
//                               <OptionButton key={line.line_id} option={line.line_name} isSelected={department.lines.some(l => l.line_name === line.line_name)} onClick={() => handleLineSelect(departmentIndex, line.line_name)} />
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {levelEnabled.line && department.lines.map((line, lineIndex) => (
//                       <div key={lineIndex} className="mb-6 p-5 bg-white rounded-lg shadow-md border border-gray-200">
//                         <div className="flex items-center justify-between mb-4">
//                           <h6 className="text-lg font-semibold text-gray-800 flex items-center">
//                             <Zap className="mr-2 text-purple-600" size={18} />
//                             {line.line_name}
//                           </h6>
//                           <RemoveButton onClick={() => removeLine(departmentIndex, lineIndex)} />
//                         </div>

//                         {levelEnabled.subline && (
//                           <div className="mb-4">
//                             <h6 className="text-md font-medium text-gray-700 mb-3">Select Sub Lines:</h6>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
//                               {data.sublines.map(subline => (
//                                 <OptionButton key={subline.subline_id} option={subline.subline_name} isSelected={line.sublines?.some(s => s.subline_name === subline.subline_name) || false} onClick={() => handleSubLineSelect(departmentIndex, lineIndex, subline.subline_name)} variant="small" />
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {levelEnabled.subline && line.sublines?.map((subline, sublineIndex) => (
//                           <div key={sublineIndex} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="flex items-center justify-between mb-3">
//                               <h6 className="text-md font-medium text-gray-800 flex items-center">
//                                 <Zap className="mr-2 text-orange-600" size={16} />
//                                 {subline.subline_name}
//                               </h6>
//                               <RemoveButton onClick={() => removeSubLine(departmentIndex, lineIndex, sublineIndex)} />
//                             </div>

//                             {levelEnabled.station && (
//                               <div>
//                                 <h6 className="text-sm font-medium text-gray-700 mb-2">Select Active Stations:</h6>
//                                 {isLoading.stations ? (
//                                   <div className="text-center py-2">Loading...</div>
//                                 ) : (
//                                   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
//                                     {data.stations.map(station => {
//                                       const planStation = getPlanStation(station.station_id, subline.stations);
//                                       return (
//                                         <OptionButton
//                                           key={station.station_id}
//                                           option={station.station_name}
//                                           isSelected={!!planStation}
//                                           isStation={true}
//                                           stationType={planStation?.station_type}
//                                           configs={stationConfigs}
//                                           onClick={() => handleStationSelect(departmentIndex, lineIndex, sublineIndex, station.station_id)}
//                                           variant="small"
//                                         />
//                                       );
//                                     })}
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         ))}

//                         {!levelEnabled.subline && levelEnabled.station && (
//                           <div className="mt-4">
//                             <h6 className="text-md font-medium text-gray-700 mb-3">Select Active Stations:</h6>
//                             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
//                               {data.stations.map(station => {
//                                 const planStation = getPlanStation(station.station_id, line.stations);
//                                 return (
//                                   <OptionButton
//                                     key={station.station_id}
//                                     option={station.station_name}
//                                     isSelected={!!planStation}
//                                     isStation={true}
//                                     stationType={planStation?.station_type}
//                                     configs={stationConfigs}
//                                     onClick={() => handleStationSelect(departmentIndex, lineIndex, null, station.station_id)}
//                                     variant="small"
//                                   />
//                                 );
//                               })}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </SelectionCard>
//             )}

//             {hasCompletePlan() && (
//               <div className="text-center pb-8">
//                 <button onClick={() => setShowSummary(true)} className="py-4 px-8 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center mx-auto">
//                   <Save className="mr-3" size={24} />
//                   Finalize Manufacturing Plan
//                   <ArrowRight className="ml-3" size={24} />
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Planning;





import React, { useState, useEffect } from 'react';
import {
  Building, Layers, Zap, Save, X, CheckCircle, ArrowRight, Plus,
  Loader2, MapPin, Minus, Settings, Upload, Hexagon, AlertTriangle, Edit2
} from 'lucide-react';
import axios from 'axios';

// --- 1. Configuration & Constants ---

const API_BASE_URL = 'http://127.0.0.1:8000';

// --- 2. Color Helper Functions ---

// Helper to darken hex color to create a gradient effect
const adjustColorBrightness = (col: string, amt: number) => {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

// Generate inline styles for Hex colors
const getBackgroundStyle = (color: string) => {
  if (color && color.startsWith('#')) {
    return { background: `linear-gradient(135deg, ${color}, ${adjustColorBrightness(color, -40)})` };
  }
  return {};
};

// --- 3. Types Definitions ---

type StationType = string;

type Hq = { hq_id: number; hq_name: string; };
type Factory = { factory_id: number; factory_name: string; hq: number; };
type Department = { department_id: number; department_name: string; factory: number; hq: number; };
type Line = { line_id: number; line_name: string; department: number; factory: number; hq: number; };
type SubLine = { subline_id: number; subline_name: string; line: number; department: number; factory: number; hq: number; };
type Station = { station_id: number; station_name: string; subline: number; line: number; department: number; factory: number; hq: number; };

type PlanStation = {
  id?: number;
  station_name: string;
  station_type?: StationType;
};

type PlanSubline = { id?: number; subline_name: string; stations: PlanStation[]; };
type PlanLine = { id?: number; line_name: string; sublines?: PlanSubline[]; stations?: PlanStation[]; };
type PlanDepartment = { id?: number; department_name: string; lines: PlanLine[]; stations?: PlanStation[]; };

type HierarchyStructure = {
  structure_id?: number;
  structure_name: string;
  hq?: number | null;
  factory?: number | null;
  hq_name?: string;
  factory_name?: string;
  structure_data: {
    hq_name?: string;
    factory_name?: string;
    departments: PlanDepartment[];
    stations?: PlanStation[];
  };
};

type StationConfig = {
  type: StationType;
  label: string;
  color: string;
  icon: any;
  imgUrl?: string;
  desc: string;
  type_id?: number;
};

// Fallback config
const FALLBACK_CONFIG: StationConfig = {
  type: 'NONE',
  label: 'Standard',
  color: 'from-blue-600 to-purple-700',
  icon: Minus,
  desc: 'Standard Station',
  type_id: 0
};

// --- 4. Helper: Selection Style Generator (Fixed & Restored) ---

const getSelectionStyle = (isSelected: boolean, isStation: boolean, stationType?: StationType, configs?: StationConfig[]) => {
  if (!isSelected) {
    return 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500';
  }

  if (isStation) {
    const config = (configs || []).find(t => t.type === (stationType || 'NONE')) || FALLBACK_CONFIG;
    
    // If it's a HEX color, we return base classes (style applied inline)
    if (config.color.startsWith('#')) {
      return 'text-white shadow-md transform scale-105 border-transparent';
    }
    
    // If it's a Tailwind class, we return the class string
    return `bg-gradient-to-r ${config.color} text-white shadow-md transform scale-105 border-transparent`;
  }

  return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md border-transparent';
};

// --- 5. Reusable Components ---

const DynamicIcon = ({ config, className }: { config: StationConfig, className?: string }) => {
  if (config.imgUrl) {
    return (
      <img
        src={config.imgUrl}
        alt={config.label}
        className={`object-contain ${className}`}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }
  const IconComponent = config.icon || Hexagon;
  return <IconComponent className={className} />;
};

const SelectionCard = ({ title, icon: Icon, children, headerAction }: { title: string; icon: React.ComponentType<any>; children: React.ReactNode, headerAction?: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-800 mb-6 transition-colors duration-300">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
        <Icon className="mr-2 text-blue-600 dark:text-blue-400" size={20} /> {title}
      </h3>
      {headerAction}
    </div>
    {children}
  </div>
);

const OptionButton = ({
  option,
  isSelected,
  onClick,
  variant = 'default',
  stationType,
  isStation = false,
  configs
}: {
  option: string;
  isSelected: boolean;
  onClick?: () => void;
  variant?: 'default' | 'small';
  stationType?: StationType;
  isStation?: boolean;
  configs?: StationConfig[];
}) => {
  
  const baseClasses = `rounded-lg font-medium transition-all duration-200 flex items-center justify-center border-2 select-none`;
  const sizeClasses = variant === 'small' ? 'px-3 py-2 text-sm' : 'px-4 py-3';
  const cursorClass = onClick ? 'cursor-pointer' : 'cursor-default';
  
  // Use the helper to get classes
  const bgClass = getSelectionStyle(isSelected, isStation, stationType, configs);
  
  // Handle inline styles for Hex colors
  let inlineStyle = {};
  let config = FALLBACK_CONFIG;

  if (isSelected && isStation) {
    config = (configs || []).find(t => t.type === (stationType || 'NONE')) || FALLBACK_CONFIG;
    if (config.color.startsWith('#')) {
      inlineStyle = getBackgroundStyle(config.color);
    }
  }

  let RenderIcon = null;
  if (isSelected && isStation) {
    RenderIcon = () => <DynamicIcon config={config} className="w-4 h-4" />;
  }

  return (
    <div 
      className={`${baseClasses} ${bgClass} ${sizeClasses} ${cursorClass}`} 
      onClick={onClick}
      style={inlineStyle}
    >
      {RenderIcon && <div className="mr-2"><RenderIcon /></div>}
      {option}
    </div>
  );
};

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
    <X size={16} />
  </button>
);

// --- 6. Settings Modal (Standard UI with Color Picker) ---

const SettingsModal = ({
  isOpen,
  onClose,
  configs,
  onUpdateSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  configs: StationConfig[];
  onUpdateSuccess: () => void;
}) => {
  if (!isOpen) return null;

  const [newType, setNewType] = useState({ name: '', code: '', color: '#3b82f6' }); // Default Hex Blue
  const [newTypeFile, setNewTypeFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const handleCreate = async () => {
    if (!newType.name || !newType.code) return alert('Name and Code are required');

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append('name', newType.name);
      formData.append('code', newType.code.toUpperCase());
      formData.append('color', newType.color); // Sends Hex code
      if (newTypeFile) formData.append('icon', newTypeFile);

      await axios.post(`${API_BASE_URL}/station-types/`, formData);
      setNewType({ name: '', code: '', color: '#3b82f6' });
      setNewTypeFile(null);
      onUpdateSuccess();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create type');
    } finally {
      setIsCreating(false);
    }
  };

  const updateColor = async (type_id: number, color: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/station-types/${type_id}/`, { color });
      onUpdateSuccess();
    } catch (err) {
      alert('Failed to update color');
    }
  };

  const uploadIcon = async (e: React.ChangeEvent<HTMLInputElement>, type_id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(type_id);
    try {
      const formData = new FormData();
      formData.append('icon', file);
      await axios.patch(`${API_BASE_URL}/station-types/${type_id}/`, formData);
      onUpdateSuccess();
    } catch (err) {
      alert('Icon upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
              <Settings className="mr-3 text-blue-600 dark:text-blue-400" size={28} /> 
              Station Configuration
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your station types, icons, and colors.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-gray-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/50 flex-1">
          
          {/* Create New Type Section */}
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-blue-100 dark:border-slate-700 shadow-sm mb-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            
            <h3 className="text-lg font-bold mb-6 flex items-center text-gray-800 dark:text-white">
              <span className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 text-blue-600 dark:text-blue-400">
                 <Plus size={20} />
              </span>
              Define New Station Type
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              {/* Name Input */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Quality Control"
                  value={newType.name}
                  onChange={e => setNewType(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                />
              </div>

              {/* Code Input */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Short Code</label>
                <input
                  type="text"
                  placeholder="e.g. QC"
                  value={newType.code}
                  onChange={e => setNewType(p => ({ ...p, code: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  maxLength={10}
                />
              </div>

              {/* Native Color Picker Input */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Color</label>
                <div className="flex items-center h-[50px] w-full px-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 relative cursor-pointer">
                  {/* Color Preview Box */}
                  <div className="w-full h-8 rounded border border-gray-300 dark:border-slate-600 shadow-sm" style={{ backgroundColor: newType.color }}></div>
                  <input
                    type="color"
                    value={newType.color}
                    onChange={(e) => setNewType(p => ({ ...p, color: e.target.value }))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Choose Color"
                  />
                </div>
              </div>

              {/* Icon Upload */}
              <div className="md:col-span-3">
                 <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Icon (Optional)</label>
                 <label className="flex items-center justify-center h-[50px] px-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 transition-all text-sm text-gray-600 dark:text-slate-300 truncate">
                    <Upload className="mr-2 flex-shrink-0" size={16} />
                    <span className="truncate">{newTypeFile ? newTypeFile.name : 'Choose File'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setNewTypeFile(e.target.files?.[0] || null)} />
                 </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                onClick={handleCreate}
                disabled={isCreating}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center"
                >
                {isCreating ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                Create Station Type
                </button>
            </div>
          </div>

          {/* Existing Types List */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Existing Station Types</h3>
            <span className="text-sm font-medium text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
                {configs.length} Types Found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {configs.map(config => {
                // Determine display style based on whether color is Hex or Tailwind Class
                const isHex = config.color.startsWith('#');
                const bgStyle = isHex ? getBackgroundStyle(config.color) : {};
                const bgClass = isHex ? 'text-white shadow-md' : `bg-gradient-to-br ${config.color} text-white shadow-md`;

                return (
                <div key={config.type} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-lg transition-all flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                             {/* Icon Preview */}
                            <div 
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${bgClass}`}
                                style={bgStyle}
                            >
                                <DynamicIcon config={config} className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{config.label}</h4>
                                <code className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded mt-1 inline-block border border-gray-200 dark:border-slate-700">
                                    {config.type}
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                        {/* Inline Color Picker for Updates */}
                        <div className="relative group">
                            <label className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                <div 
                                    className="w-4 h-4 rounded-full border border-gray-300 dark:border-slate-600 shadow-sm" 
                                    style={{ background: isHex ? config.color : 'transparent' }} 
                                ></div>
                                <span>Edit Color</span>
                                {/* The actual input is hidden but clickable via label */}
                                <input 
                                    type="color" 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    defaultValue={isHex ? config.color : '#000000'}
                                    onBlur={(e) => config.type_id && updateColor(config.type_id, e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Icon Upload Button */}
                        <label className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                            {uploadingId === config.type_id ? (
                                <Loader2 className="animate-spin text-blue-600" size={16} />
                            ) : (
                                <Edit2 size={14} />
                            )}
                            <span>Edit Icon</span>
                            <input type="file" accept="image/*" className="hidden" onChange={e => config.type_id && uploadIcon(e, config.type_id)} />
                        </label>
                    </div>
                </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
};


const TypeSelectionModal = ({
  isOpen,
  stationName,
  configs,
  onSelect,
  onClose
}: {
  isOpen: boolean;
  stationName: string;
  configs: StationConfig[];
  onSelect: (type: StationType) => void;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Select Station Type</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Assigning type for: <span className="font-bold text-blue-600 dark:text-blue-400">{stationName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors"><X size={28} /></button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Always show Standard / Default Option */}
            <button
                onClick={() => onSelect('NONE')}
                className="group p-6 rounded-2xl border-2 border-gray-100 dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-center flex flex-col items-center shadow-sm hover:shadow-xl"
            >
                <div className="w-full aspect-square rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-500 to-purple-600">
                   <Minus className="w-16 h-16 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-slate-200">Standard</div>
                <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">No specific type</div>
            </button>

            {/* Render Custom Types */}
            {configs.map(config => {
              const isHex = config.color.startsWith('#');
              const bgStyle = isHex ? getBackgroundStyle(config.color) : {};
              const bgClass = isHex ? '' : `bg-gradient-to-br ${config.color}`;

              return (
              <button
                key={config.type}
                onClick={() => onSelect(config.type)}
                className="group p-6 rounded-2xl border-2 border-gray-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-800 transition-all text-center flex flex-col items-center shadow-sm hover:shadow-xl"
              >
                <div 
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300 ${bgClass}`}
                  style={bgStyle}
                >
                  <DynamicIcon config={config} className="w-16 h-16 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">{config.type}</div>
                <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">{config.label}</div>
              </button>
            )})}
          </div>
      </div>
    </div>
  );
};



// --- 8. Main Component ---

const Planning = () => {
  // State Initialization
  const [stationConfigs, setStationConfigs] = useState<StationConfig[]>([]); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- Fetch Logic (Updated for Colors) ---
  const fetchStationConfigs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/station-types/`);
      const dbTypes = response.data;

      if (!dbTypes || dbTypes.length === 0) {
        setStationConfigs([]);
        return;
      }

      // Map DB types to Config objects
      const mergedConfigs: StationConfig[] = dbTypes.map((dbType: any) => {
        return {
          type: dbType.code,
          label: dbType.name,
          desc: 'Station Type',
          color: dbType.color || 'from-gray-500 to-gray-600', // Use DB color or fallback
          icon: Hexagon, 
          imgUrl: dbType.icon_url,
          type_id: dbType.type_id
        };
      });

      setStationConfigs(mergedConfigs);
      setApiError(null);

    } catch (error) {
      console.error("Error fetching station types", error);
      setApiError("Failed to fetch station types.");
      setStationConfigs([]);
    }
  };

  const [plan, setPlan] = useState<HierarchyStructure>({
    structure_name: '',
    hq: null,
    factory: null,
    structure_data: { departments: [], stations: [] }
  });

  const [showSummary, setShowSummary] = useState(false);
  const [newItems, setNewItems] = useState({ hq: '', factory: '', department: '', line: '', subline: '', station: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [savedStructures, setSavedStructures] = useState<HierarchyStructure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<HierarchyStructure | null>(null);

  const [data, setData] = useState({ hqs: [] as Hq[], factories: [] as Factory[], departments: [] as Department[], lines: [] as Line[], sublines: [] as SubLine[], stations: [] as Station[] });
  const [isLoading, setIsLoading] = useState({ hqs: false, factories: false, departments: false, lines: false, sublines: false, stations: false, structures: false });

  const [levelEnabled, setLevelEnabled] = useState({ hq: true, factory: true, department: true, line: true, subline: true, station: true });

  const [pendingSelection, setPendingSelection] = useState<{
    deptIdx: number;
    lineIdx?: number;
    subIdx?: number | null;
    station: Station;
  } | null>(null);

  const effectiveEnabled = {
    hq: levelEnabled.hq,
    factory: levelEnabled.hq && levelEnabled.factory,
    department: levelEnabled.hq && levelEnabled.factory && levelEnabled.department,
    line: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line,
    subline: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line && levelEnabled.subline,
    station: levelEnabled.hq && levelEnabled.factory && levelEnabled.department && levelEnabled.line && levelEnabled.subline && levelEnabled.station
  };

  // --- API Functions ---

  const fetchData = async (endpoint: string, key: keyof typeof data) => {
    setIsLoading(prev => ({ ...prev, [key]: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
      setData(prev => ({ ...prev, [key]: response.data }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
    } finally {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const fetchFactories = (hqId?: number) => fetchData(hqId ? `factories/?hq=${hqId}` : 'factories/', 'factories');
  const fetchDepartments = (factoryId?: number, hqId?: number) => fetchData(`departments/${factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'departments');
  const fetchLines = (departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`lines/${departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'lines');
  const fetchSubLines = (lineId?: number, departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`sublines/${lineId ? `?line=${lineId}` : departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'sublines');
  const fetchStations = (sublineId?: number, lineId?: number, departmentId?: number, factoryId?: number, hqId?: number) => fetchData(`stations/${sublineId ? `?subline=${sublineId}` : lineId ? `?line=${lineId}` : departmentId ? `?department=${departmentId}` : factoryId ? `?factory=${factoryId}` : hqId ? `?hq=${hqId}` : ''}`, 'stations');
  const fetchHqs = () => fetchData('hq/', 'hqs');

  const fetchHierarchyStructures = async () => {
    setIsLoading(prev => ({ ...prev, structures: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/hierarchy-simple/`);
      setSavedStructures(response.data);
    } catch (error) {
      console.error('Error fetching hierarchy structures:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, structures: false }));
    }
  };

  // --- Creation Handlers ---

  const handleAddNewItem = async (type: keyof typeof newItems) => {
    if (!newItems[type]) return;
    const endpointMap = { hq: 'hq/', factory: 'factories/', department: 'departments/', line: 'lines/', subline: 'sublines/', station: 'stations/' };
    const nameFieldMap = { hq: 'hq_name', factory: 'factory_name', department: 'department_name', line: 'line_name', subline: 'subline_name', station: 'station_name' };
    try {
      const payload = { [nameFieldMap[type]]: newItems[type] };
      await axios.post(`${API_BASE_URL}/${endpointMap[type]}`, payload);
      setNewItems(prev => ({ ...prev, [type]: '' }));
      if (type === 'hq') await fetchHqs();
      else if (type === 'factory' && plan.structure_data.hq_name) {
        const hq = data.hqs.find(h => h.hq_name === plan.structure_data.hq_name);
        if (hq) await fetchFactories(hq.hq_id);
      } else if (type === 'department' && plan.structure_data.factory_name) {
        const factory = data.factories.find(f => f.factory_name === plan.structure_data.factory_name);
        if (factory) await fetchDepartments(factory.factory_id);
      }
    } catch (error) { console.error(`Error adding ${type}:`, error); }
  };

  // --- Selection Handlers (Structure) ---

  const handleHqSelect = (hqName: string) => {
    const selectedHq = data.hqs.find(h => h.hq_name === hqName);
    if (selectedHq) {
      setPlan(prev => ({ ...prev, hq: selectedHq.hq_id, structure_data: { ...prev.structure_data, hq_name: hqName, departments: [], stations: [] } }));
      fetchFactories(selectedHq.hq_id); setShowSummary(false); setSelectedStructure(null);
    }
  };
  const handleFactorySelect = (factoryName: string) => {
    const selectedFactory = data.factories.find(f => f.factory_name === factoryName);
    if (selectedFactory) {
      setPlan(prev => ({ ...prev, factory: selectedFactory.factory_id, structure_data: { ...prev.structure_data, factory_name: factoryName, departments: [], stations: [] } }));
      fetchDepartments(selectedFactory.factory_id); setShowSummary(false); setSelectedStructure(null);
    }
  };

  const handleDepartmentSelect = (departmentName: string) => {
    const selectedDepartment = data.departments.find(d => d.department_name === departmentName);
    if (selectedDepartment) {
      setPlan(prev => {
        const isSelected = prev.structure_data.departments.some(d => d.department_name === departmentName);
        if (isSelected) {
          return { ...prev, structure_data: { ...prev.structure_data, departments: prev.structure_data.departments.filter(d => d.department_name !== departmentName) } };
        } else {
          return { ...prev, structure_data: { ...prev.structure_data, departments: [...prev.structure_data.departments, { department_name: departmentName, id: selectedDepartment.department_id, lines: [], stations: !levelEnabled.line ? [] : undefined }] } };
        }
      });
      if (levelEnabled.line) fetchLines(selectedDepartment.department_id);
      else if (levelEnabled.station) fetchStations(undefined, undefined, selectedDepartment.department_id);
      setShowSummary(false);
    }
  };

  const handleLineSelect = (departmentIndex: number, lineName: string) => {
    const selectedLine = data.lines.find(l => l.line_name === lineName);
    if (selectedLine) {
      setPlan(prev => {
        const updatedDepartments = [...prev.structure_data.departments];
        const department = updatedDepartments[departmentIndex];
        const isSelected = department.lines.some(l => l.line_name === lineName);
        if (isSelected) {
          updatedDepartments[departmentIndex] = { ...department, lines: department.lines.filter(l => l.line_name !== lineName) };
        } else {
          updatedDepartments[departmentIndex] = { ...department, lines: [...department.lines, { line_name: lineName, id: selectedLine.line_id, sublines: levelEnabled.subline ? [] : undefined, stations: !levelEnabled.subline ? [] : undefined }] };
        }
        return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
      });
      if (levelEnabled.subline) fetchSubLines(selectedLine.line_id);
      else if (levelEnabled.station) fetchStations(undefined, selectedLine.line_id);
      setShowSummary(false);
    }
  };

  const handleSubLineSelect = (departmentIndex: number, lineIndex: number, sublineName: string) => {
    const selectedSubLine = data.sublines.find(s => s.subline_name === sublineName);
    if (selectedSubLine) {
      setPlan(prev => {
        const updatedDepartments = [...prev.structure_data.departments];
        const updatedLines = [...updatedDepartments[departmentIndex].lines];
        const updatedSubLines = [...updatedLines[lineIndex].sublines || []];
        const sublineIndex = updatedSubLines.findIndex(s => s.subline_name === sublineName);
        if (sublineIndex === -1) updatedSubLines.push({ subline_name: sublineName, id: selectedSubLine.subline_id, stations: [] });
        else updatedSubLines.splice(sublineIndex, 1);
        updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedSubLines };
        updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedLines };
        return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
      });
      fetchStations(selectedSubLine.subline_id); setShowSummary(false);
    }
  };

  // --- Selection Handlers (Stations with Type Logic) ---

  const confirmStationType = (type: StationType) => {
    if (!pendingSelection) return;
    const { deptIdx, lineIdx, subIdx, station } = pendingSelection;

    setPlan(prev => {
      const updatedDepartments = [...prev.structure_data.departments];
      const department = updatedDepartments[deptIdx];

      const newStationEntry: PlanStation = {
        station_name: station.station_name,
        id: station.station_id,
        station_type: type
      };

      if (lineIdx === undefined) {
        // Department level station
        const updatedStations = [...(department.stations || [])];
        updatedStations.push(newStationEntry);
        updatedDepartments[deptIdx] = { ...department, stations: updatedStations };
      } else {
        const updatedLines = [...(department.lines || [])];

        if (subIdx !== undefined && subIdx !== null && levelEnabled.subline) {
          // Subline level station
          const updatedSubLines = [...(updatedLines[lineIdx].sublines || [])];
          const subline = updatedSubLines[subIdx];
          const updatedStations = [...subline.stations];
          updatedStations.push(newStationEntry);
          updatedSubLines[subIdx] = { ...subline, stations: updatedStations };
          updatedLines[lineIdx] = { ...updatedLines[lineIdx], sublines: updatedSubLines };
        } else {
          // Line level station
          const updatedStations = [...(updatedLines[lineIdx].stations || [])];
          updatedStations.push(newStationEntry);
          updatedLines[lineIdx] = { ...updatedLines[lineIdx], stations: updatedStations };
        }
        updatedDepartments[deptIdx] = { ...department, lines: updatedLines };
      }
      return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
    });

    setPendingSelection(null);
    setShowSummary(false);
  };

  const handleDepartmentStationSelect = (departmentIndex: number, stationId: number) => {
    const selectedStation = data.stations.find(s => s.station_id === stationId);
    if (!selectedStation) return;

    const dept = plan.structure_data.departments[departmentIndex];
    const existingStation = dept.stations?.find(s => s.id === stationId);

    if (existingStation) {
      setPlan(prev => {
        const updatedDepartments = [...prev.structure_data.departments];
        updatedDepartments[departmentIndex] = {
          ...updatedDepartments[departmentIndex],
          stations: updatedDepartments[departmentIndex].stations?.filter(s => s.id !== stationId)
        };
        return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
      });
    } else {
      setPendingSelection({ deptIdx: departmentIndex, station: selectedStation });
    }
  };

  const handleStationSelect = (departmentIndex: number, lineIndex: number, sublineIndex: number | null, stationId: number) => {
    const selectedStation = data.stations.find(s => s.station_id === stationId);
    if (!selectedStation) return;

    let exists = false;
    const dept = plan.structure_data.departments[departmentIndex];
    const line = dept.lines[lineIndex];

    if (sublineIndex !== null && levelEnabled.subline) {
      const subline = line.sublines?.[sublineIndex];
      exists = subline?.stations.some(s => s.id === stationId) || false;
    } else {
      exists = line.stations?.some(s => s.id === stationId) || false;
    }

    if (exists) {
      setPlan(prev => {
        const updatedDepartments = [...prev.structure_data.departments];
        const department = updatedDepartments[departmentIndex];
        const updatedLines = [...(department.lines || [])];
        if (sublineIndex !== null && levelEnabled.subline) {
          const updatedSubLines = [...(updatedLines[lineIndex]?.sublines || [])];
          if (updatedSubLines[sublineIndex]) {
            updatedSubLines[sublineIndex] = { ...updatedSubLines[sublineIndex], stations: updatedSubLines[sublineIndex].stations.filter(s => s.id !== stationId) };
            updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedSubLines };
          }
        } else {
          updatedLines[lineIndex] = { ...updatedLines[lineIndex], stations: updatedLines[lineIndex].stations?.filter(s => s.id !== stationId) };
        }
        updatedDepartments[departmentIndex] = { ...department, lines: updatedLines };
        return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } };
      });
    } else {
      setPendingSelection({ deptIdx: departmentIndex, lineIdx: lineIndex, subIdx: sublineIndex, station: selectedStation });
    }
  };

  // --- Removal Helpers ---
  const removeDepartment = (index: number) => { setPlan(prev => ({ ...prev, structure_data: { ...prev.structure_data, departments: prev.structure_data.departments.filter((_, i) => i !== index) } })); };
  const removeLine = (departmentIndex: number, lineIndex: number) => { setPlan(prev => { const updatedDepartments = [...prev.structure_data.departments]; updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedDepartments[departmentIndex].lines.filter((_, i) => i !== lineIndex) }; return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } }; }); };
  const removeSubLine = (departmentIndex: number, lineIndex: number, sublineIndex: number) => { setPlan(prev => { const updatedDepartments = [...prev.structure_data.departments]; const updatedLines = [...updatedDepartments[departmentIndex].lines]; updatedLines[lineIndex] = { ...updatedLines[lineIndex], sublines: updatedLines[lineIndex].sublines?.filter((_, i) => i !== sublineIndex) || [] }; updatedDepartments[departmentIndex] = { ...updatedDepartments[departmentIndex], lines: updatedLines }; return { ...prev, structure_data: { ...prev.structure_data, departments: updatedDepartments } }; }); };

  // --- Data Persistence ---

  const saveHierarchyStructure = async () => {
    if (!hasCompletePlan()) return;
    setIsSaving(true);
    try {
      const payload = {
        structure_name: plan.structure_name || `Structure-${Date.now()}`,
        structure_data: plan.structure_data,
        hq: plan.hq || null,
        factory: plan.factory || null
      };

      if (!plan.structure_id) {
        await axios.post(`${API_BASE_URL}/hierarchy-structures/`, payload);
        alert('New hierarchy saved');
      } else {
        await axios.put(`${API_BASE_URL}/hierarchy-structures/${plan.structure_id}/`, payload);
        alert('Hierarchy updated successfully');
      }
      await fetchHierarchyStructures();
      setShowSummary(true);
    } catch (error: any) {
      console.error('Error saving/updating hierarchy structure:', error);
      const serverMsg = error?.response?.data?.detail || error?.response?.data || null;
      alert(`Error: ${JSON.stringify(serverMsg) || error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const loadStructure = (structure: HierarchyStructure) => {
    // 1. Set the plan data
    setPlan(structure);
    setSelectedStructure(structure);

    // 2. Intelligently determine enabled levels from data
    const hasDepartments = structure.structure_data.departments.length > 0;
    const hasLines = structure.structure_data.departments.some(d => d.lines && d.lines.length > 0);
    const hasSublines = structure.structure_data.departments.some(d =>
      d.lines?.some(l => l.sublines && l.sublines.length > 0)
    );

    setLevelEnabled({
      hq: !!structure.structure_data.hq_name,
      factory: !!structure.structure_data.factory_name,
      department: hasDepartments,
      line: hasLines,
      subline: hasSublines,
      station: true
    });

    setShowSummary(false);

    // 3. Fetch necessary data for editing
    if (structure.hq) fetchFactories(structure.hq);
    if (structure.factory) fetchDepartments(structure.factory);

    structure.structure_data.departments.forEach(dept => {
      if (dept.id) {
        if (hasLines) fetchLines(dept.id);
        if (dept.stations?.length) fetchStations(undefined, undefined, dept.id);
        dept.lines.forEach(line => {
          if (line.id) {
            if (hasSublines) fetchSubLines(line.id);
            if (line.stations?.length) fetchStations(undefined, line.id);
            line.sublines?.forEach(sub => {
              if (sub.id) fetchStations(sub.id);
            });
          }
        });
      }
    });
  };

  const hasCompletePlan = () => {
    if (levelEnabled.hq && !plan.structure_data.hq_name) return false;
    if (levelEnabled.factory && !plan.structure_data.factory_name) return false;
    if (levelEnabled.department && plan.structure_data.departments.length === 0) return false;
    return true;
  };

  useEffect(() => {
    fetchHqs();
    fetchHierarchyStructures();
    fetchStationConfigs();
  }, []);

  useEffect(() => { if (!levelEnabled.hq) fetchFactories(); }, [levelEnabled.hq]);
  useEffect(() => { if (!levelEnabled.factory && levelEnabled.department) fetchDepartments(); }, [levelEnabled.factory, levelEnabled.department]);

  const getPlanStation = (id: number, list?: PlanStation[]) => {
    return list?.find(s => s.id === id);
  };

  // --- UI Components ---

 const SavedStructuresList = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-slate-800 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <Save className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
        Saved Manufacturing Plans
      </h3>
      {isLoading.structures ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Loading saved plans...</p>
        </div>
      ) : savedStructures.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-slate-500">No saved manufacturing plans found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedStructures.map((structure, idx) => (
            <div key={idx} className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${selectedStructure?.structure_id === structure.structure_id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'}`} onClick={() => loadStructure(structure)}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800 dark:text-white flex items-center">
                  {structure.hq_name && <MapPin className="mr-2 text-red-600 dark:text-red-400" size={18} />}
                  {structure.factory_name && <Building className="mr-2 text-purple-600 dark:text-purple-400" size={18} />}
                  {structure.structure_name}
                </h4>
                {selectedStructure?.structure_id === structure.structure_id && <CheckCircle className="text-green-500" size={18} />}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                {structure.hq_name && (
                  <div className="flex items-center mb-1">
                    <MapPin className="mr-1" size={14} />
                    {structure.hq_name}
                  </div>
                )}
                {structure.factory_name && (
                  <div className="flex items-center mb-1">
                    <Building className="mr-1" size={14} />
                    {structure.factory_name}
                  </div>
                )}
                <div className="flex items-center mb-1">
                  <Layers className="mr-1" size={14} />
                  {structure.structure_data.departments?.length || 0} Departments
                </div>
                <div className="flex items-center">
                  <Zap className="mr-1" size={14} />
                  {structure.structure_data.departments?.reduce((acc, d) => acc + (d.lines?.length || 0), 0) || 0} Lines
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PlanSummary = () => (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 border border-green-200 dark:border-green-900/50">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Manufacturing Plan Summary</h3>
        <p className="text-gray-600 dark:text-slate-300">Your production hierarchy is ready!</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-center space-x-8">
            {effectiveEnabled.hq && plan.structure_data.hq_name && (
              <div className={getSelectionStyle(true, false)}>
                <div className="px-6 py-3 flex items-center rounded-lg">
                  <MapPin className="mr-2" size={20} />
                  <span className="font-semibold text-xl">{plan.structure_data.hq_name}</span>
                </div>
              </div>
            )}
            {effectiveEnabled.factory && plan.structure_data.factory_name && (
              <div className={getSelectionStyle(true, false)}>
                <div className="px-6 py-3 flex items-center rounded-lg">
                  <Building className="mr-2" size={20} />
                  <span className="font-semibold text-xl">{plan.structure_data.factory_name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 overflow-x-auto">
          <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Production Flow Hierarchy</h4>
          <div className="flex flex-col items-center min-w-max">

            {levelEnabled.department && plan.structure_data.departments.length > 0 && (
              <>
                <div className="flex gap-12 mb-6">
                  {plan.structure_data.departments.map((department, deptIdx) => (
                    <div key={deptIdx} className="flex flex-col items-center">
                      <div className={`px-6 py-3 rounded-lg shadow-md font-medium flex items-center mb-4 ${getSelectionStyle(true, false)}`}>
                        <Layers className="mr-2" size={20} />
                        {department.department_name}
                      </div>

                      {!levelEnabled.line && levelEnabled.station && department.stations && department.stations.length > 0 && (
                        <>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-red-400 mb-3"></div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {department.stations.map((station, stationIdx) => {
                              const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
                              const isHex = config.color.startsWith('#');
                              const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
                              const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

                              return (
                                <div 
                                    key={stationIdx} 
                                    className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
                                    style={inlineStyle}
                                >
                                  <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
                                  {station.station_name}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {levelEnabled.line && department.lines.length > 0 && (
                        <>
                          <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-green-400 mb-4"></div>
                          <div className="flex gap-8">
                            {department.lines.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex flex-col items-center">
                                <div className={`px-5 py-2 rounded-lg shadow-md font-medium flex items-center mb-3 ${getSelectionStyle(true, false)}`}>
                                  <Zap className="mr-2" size={18} />
                                  {line.line_name}
                                </div>

                                {levelEnabled.subline && line.sublines && line.sublines.length > 0 && (
                                  <>
                                    <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-yellow-400 mb-3"></div>
                                    <div className="flex gap-6">
                                      {line.sublines.map((subline, sublineIdx) => (
                                        <div key={sublineIdx} className="flex flex-col items-center">
                                          <div className={`px-4 py-2 rounded-md shadow text-sm font-medium flex items-center mb-2 ${getSelectionStyle(true, false)}`}>
                                            <Zap className="mr-1" size={14} />
                                            {subline.subline_name}
                                          </div>

                                          {levelEnabled.station && subline.stations.length > 0 && (
                                            <>
                                              <div className="w-0.5 h-4 bg-gradient-to-b from-yellow-400 to-red-400 mb-2"></div>
                                              <div className="flex flex-col items-center gap-2">
                                                {subline.stations.map((station, stationIdx) => {
                                                  const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
                                                  const isHex = config.color.startsWith('#');
                                                  const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
                                                  const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

                                                  return (
                                                    <div 
                                                        key={stationIdx} 
                                                        className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
                                                        style={inlineStyle}
                                                    >
                                                      <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
                                                      {station.station_name}
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}

                                {!levelEnabled.subline && levelEnabled.station && line.stations && line.stations.length > 0 && (
                                  <>
                                    <div className="w-0.5 h-6 bg-gradient-to-b from-green-400 to-red-400 mb-3"></div>
                                    <div className="flex flex-col items-center gap-2">
                                      {line.stations.map((station, stationIdx) => {
                                        const config = stationConfigs?.find(t => t.type === station.station_type) || FALLBACK_CONFIG;
                                        const isHex = config.color.startsWith('#');
                                        const bgClass = getSelectionStyle(true, true, station.station_type, stationConfigs);
                                        const inlineStyle = isHex ? getBackgroundStyle(config.color) : {};

                                        return (
                                          <div 
                                            key={stationIdx} 
                                            className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center shadow-sm ${bgClass}`}
                                            style={inlineStyle}
                                          >
                                            <div className="mr-1 w-4 h-4"><DynamicIcon config={config} /></div>
                                            {station.station_name}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={() => setShowSummary(false)} className="py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
          <ArrowRight className="mr-2 rotate-180" size={20} />
          Continue Editing Plan
        </button>
        <button onClick={saveHierarchyStructure} disabled={isSaving} className="py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
          {isSaving ? <><Loader2 className="mr-2 animate-spin" size={20} />Saving...</> : <><Save className="mr-2" size={20} />Save Plan</>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 transition-colors duration-300">
      {/* Modals */}
      <TypeSelectionModal
        isOpen={!!pendingSelection}
        stationName={pendingSelection?.station.station_name || ''}
        configs={stationConfigs}
        onSelect={confirmStationType}
        onClose={() => setPendingSelection(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        configs={stationConfigs}
        onUpdateSuccess={fetchStationConfigs}
      />

      <div className="max-w-6xl mx-auto relative">
        {/* Settings Button - Positioned Top Right */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-0 right-0 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all transform hover:scale-105"
          title="Station Type Settings"
        >
          <Settings size={28} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-8 pt-4">
          <div className="text-center flex-1">
            <h1 className="text-4xl  py-3 md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-5">
              Manufacturing Planning System
            </h1>
            <br></br>
            <p className="text-xl  text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Design your production hierarchy with precision and types</p>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center justify-center">
            <AlertTriangle className="mr-2" /> {apiError}
          </div>
        )}

        {/* Creation Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-slate-800 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Plus className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
            Add New Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'hq', label: 'Headquarters' }, { key: 'factory', label: 'Factory' },
              { key: 'department', label: 'Department' }, { key: 'line', label: 'Line' },
              { key: 'subline', label: 'Sub Line' }, { key: 'station', label: 'Station' }
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{item.label}</label>
                <div className="flex">
                  <input
                    type="text"
                    value={newItems[item.key as keyof typeof newItems]}
                    onChange={(e) => setNewItems(prev => ({ ...prev, [item.key]: e.target.value }))}
                    className="flex-1 rounded-l-lg border border-gray-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder={item.label}
                  />
                  <button onClick={() => handleAddNewItem(item.key as keyof typeof newItems)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 rounded-r-lg flex items-center justify-center">
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SavedStructuresList />

        {showSummary ? <PlanSummary /> : (
          <div className="space-y-8">
            <SelectionCard title="Enable / Disable Hierarchy Levels" icon={Layers}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'hq', label: 'Headquarters' }, { key: 'factory', label: 'Factory' },
                  { key: 'department', label: 'Department' }, { key: 'line', label: 'Production Line' },
                  { key: 'subline', label: 'Sub Line' }, { key: 'station', label: 'Station' }
                ].map((lvl) => (
                  <OptionButton
                    key={lvl.key}
                    option={`${lvl.label}: ${levelEnabled[lvl.key as keyof typeof levelEnabled] ? 'On' : 'Off'}`}
                    isSelected={levelEnabled[lvl.key as keyof typeof levelEnabled]}
                    onClick={() => setLevelEnabled(prev => {
                      const key = lvl.key as keyof typeof prev;
                      return { ...prev, [key]: !prev[key] };
                    })}
                  />
                ))}
              </div>
            </SelectionCard>

            {levelEnabled.hq && (
              <SelectionCard title="Choose Headquarters" icon={MapPin}>
                {isLoading.hqs ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.hqs.map(hq => (
                      <OptionButton key={hq.hq_id} option={hq.hq_name} isSelected={plan.structure_data.hq_name === hq.hq_name} onClick={() => handleHqSelect(hq.hq_name)} />
                    ))}
                  </div>
                )}
              </SelectionCard>
            )}

            {(levelEnabled.hq ? !!plan.structure_data.hq_name : true) && levelEnabled.factory && (
              <SelectionCard title="Choose Manufacturing Factory" icon={Building}>
                {isLoading.factories ? (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.factories.map(factory => (
                      <OptionButton key={factory.factory_id} option={factory.factory_name} isSelected={plan.structure_data.factory_name === factory.factory_name} onClick={() => handleFactorySelect(factory.factory_name)} />
                    ))}
                  </div>
                )}
              </SelectionCard>
            )}

            {(levelEnabled.factory ? !!plan.structure_data.factory_name : true) && (
              <SelectionCard title="Configure Departments & Production Structure" icon={Layers}>
                {levelEnabled.department && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">Available Departments:</h4>
                    {isLoading.departments ? (
                      <div className="text-center py-4 text-gray-500 dark:text-slate-400">Loading...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.departments.map(department => (
                          <OptionButton
                            key={department.department_id}
                            option={department.department_name}
                            isSelected={plan.structure_data.departments.some(d => d.department_name === department.department_name)}
                            onClick={() => handleDepartmentSelect(department.department_name)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {levelEnabled.department && plan.structure_data.departments.map((department, departmentIndex) => (
                  <div key={departmentIndex} className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl border-2 border-blue-200 dark:border-slate-700 shadow-inner">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                        <Layers className="mr-2 text-blue-600 dark:text-blue-400" size={20} />
                        {department.department_name}
                      </h4>
                      <RemoveButton onClick={() => removeDepartment(departmentIndex)} />
                    </div>

                    {!levelEnabled.line && levelEnabled.station && (
                      <div className="mb-6">
                        <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-3">Department Stations:</h5>
                        {isLoading.stations ? (
                          <div className="text-center py-4 text-gray-500 dark:text-slate-400">Loading...</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {data.stations.map(station => {
                              const planStation = getPlanStation(station.station_id, department.stations);
                              return (
                                <OptionButton
                                  key={station.station_id}
                                  option={station.station_name}
                                  isSelected={!!planStation}
                                  isStation={true}
                                  stationType={planStation?.station_type}
                                  configs={stationConfigs}
                                  onClick={() => handleDepartmentStationSelect(departmentIndex, station.station_id)}
                                  variant="small"
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {levelEnabled.line && (
                      <div className="mb-6">
                        <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-3">Production Lines:</h5>
                        {isLoading.lines ? (
                          <div className="text-center py-4 text-gray-500 dark:text-slate-400">Loading...</div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {data.lines.map(line => (
                              <OptionButton key={line.line_id} option={line.line_name} isSelected={department.lines.some(l => l.line_name === line.line_name)} onClick={() => handleLineSelect(departmentIndex, line.line_name)} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {levelEnabled.line && department.lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="mb-6 p-5 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h6 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                            <Zap className="mr-2 text-purple-600 dark:text-purple-400" size={18} />
                            {line.line_name}
                          </h6>
                          <RemoveButton onClick={() => removeLine(departmentIndex, lineIndex)} />
                        </div>

                        {levelEnabled.subline && (
                          <div className="mb-4">
                            <h6 className="text-md font-medium text-gray-700 dark:text-slate-300 mb-3">Select Sub Lines:</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                              {data.sublines.map(subline => (
                                <OptionButton key={subline.subline_id} option={subline.subline_name} isSelected={line.sublines?.some(s => s.subline_name === subline.subline_name) || false} onClick={() => handleSubLineSelect(departmentIndex, lineIndex, subline.subline_name)} variant="small" />
                              ))}
                            </div>
                          </div>
                        )}

                        {levelEnabled.subline && line.sublines?.map((subline, sublineIndex) => (
                          <div key={sublineIndex} className="mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="text-md font-medium text-gray-800 dark:text-white flex items-center">
                                <Zap className="mr-2 text-orange-600 dark:text-orange-400" size={16} />
                                {subline.subline_name}
                              </h6>
                              <RemoveButton onClick={() => removeSubLine(departmentIndex, lineIndex, sublineIndex)} />
                            </div>

                            {levelEnabled.station && (
                              <div>
                                <h6 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Select Active Stations:</h6>
                                {isLoading.stations ? (
                                  <div className="text-center py-2 text-gray-500 dark:text-slate-400">Loading...</div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {data.stations.map(station => {
                                      const planStation = getPlanStation(station.station_id, subline.stations);
                                      return (
                                        <OptionButton
                                          key={station.station_id}
                                          option={station.station_name}
                                          isSelected={!!planStation}
                                          isStation={true}
                                          stationType={planStation?.station_type}
                                          configs={stationConfigs}
                                          onClick={() => handleStationSelect(departmentIndex, lineIndex, sublineIndex, station.station_id)}
                                          variant="small"
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {!levelEnabled.subline && levelEnabled.station && (
                          <div className="mt-4">
                            <h6 className="text-md font-medium text-gray-700 dark:text-slate-300 mb-3">Select Active Stations:</h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                              {data.stations.map(station => {
                                const planStation = getPlanStation(station.station_id, line.stations);
                                return (
                                  <OptionButton
                                    key={station.station_id}
                                    option={station.station_name}
                                    isSelected={!!planStation}
                                    isStation={true}
                                    stationType={planStation?.station_type}
                                    configs={stationConfigs}
                                    onClick={() => handleStationSelect(departmentIndex, lineIndex, null, station.station_id)}
                                    variant="small"
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </SelectionCard>
            )}

            {hasCompletePlan() && (
              <div className="text-center pb-8">
                <button onClick={() => setShowSummary(true)} className="py-4 px-8 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-green-600 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center mx-auto">
                  <Save className="mr-3" size={24} />
                  Finalize Manufacturing Plan
                  <ArrowRight className="ml-3" size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planning;