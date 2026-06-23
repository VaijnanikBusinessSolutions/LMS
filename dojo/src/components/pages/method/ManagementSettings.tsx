// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp,
//   Calendar, BarChart3, Building, Factory, Briefcase,
//   AlertCircle, Loader2, Layers, Wrench, MapPin, CheckCircle, FileText
// } from "lucide-react";

// // --- CONFIG ---
// const API_BASE_URL = "http://127.0.0.1:8000/";

// // --- INTERFACES ---
// interface ManagementReviewData {
//   id?: number;
//   hq: string;
//   factory: string;
//   department: string;
//   line: string;
//   subline: string;
//   station: string;
//   month_year: string;
//   new_operators_joined: number;
//   new_operators_trained: number;
//   total_training_plans: number;
//   total_trainings_actual: number;
//   total_defects_msil: number;
//   ctq_defects_msil: number;
//   total_defects_tier1: number;
//   ctq_defects_tier1: number;
//   total_internal_rejection: number;
//   ctq_internal_rejection: number;
// }

// interface DropdownOption {
//   id: number;
//   name: string;
// }

// interface HierarchyItem {
//   hq: number;
//   hq_name: string;
//   factory: number;
//   factory_name: string;
//   structure_data: {
//     departments: Array<{
//       id: number;
//       department_name: string;
//       lines?: Array<{
//         id: number;
//         line_name: string;
//         sublines?: Array<{
//           id: number;
//           subline_name: string;
//           stations?: Array<{
//             id: number;
//             station_name: string;
//           }>;
//         }>;
//       }>;
//     }>;
//   };
// }

// const ManagementSettings: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'overview' | 'add-data' | 'upload' | 'data-list'>('overview');
//   const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Upload State
//   const [uploadFile, setUploadFile] = useState<File | null>(null);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   // Form State
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState<ManagementReviewData>({
//     hq: '', factory: '', department: '', line: '', subline: '', station: '', month_year: '',
//     new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
//     total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
//     total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
//     ctq_internal_rejection: 0,
//   });

//   // Full hierarchy from API
//   const [hierarchyData, setHierarchyData] = useState<HierarchyItem[]>([]);

//   // Dropdown Options
//   const [hqOptions, setHqOptions] = useState<DropdownOption[]>([]);
//   const [factoryOptions, setFactoryOptions] = useState<DropdownOption[]>([]);
//   const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);
//   const [lineOptions, setLineOptions] = useState<DropdownOption[]>([]);
//   const [sublineOptions, setSublineOptions] = useState<DropdownOption[]>([]);
//   const [stationOptions, setStationOptions] = useState<DropdownOption[]>([]);

//   // Name ↔ ID Maps
//   const [nameToIdMap, setNameToIdMap] = useState<Record<string, Record<string, number>>>({
//     hq: {}, factory: {}, department: {}, line: {}, subline: {}, station: {}
//   });
//   const [idToNameMap, setIdToNameMap] = useState<Record<string, Record<number, string>>>({
//     hq: {}, factory: {}, department: {}, line: {}, subline: {}, station: {}
//   });

//   const tabs = [
//     { id: 'overview', name: 'Overview', icon: BarChart3 },
//     { id: 'add-data', name: 'Add Data', icon: Plus },
//     { id: 'upload', name: 'Upload Excel', icon: Upload },
//     { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
//   ];

//   // --- BULK ACTION HANDLERS (Place this INSIDE ManagementSettings) ---
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   const toggleSelect = (id: number) => {
//     setSelectedIds(prev => 
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       // We map and filter to ensure we only get valid numbers
//       const allIds = managementReviewData
//         .map((item: ManagementReviewData) => item.id)
//         .filter((id): id is number => id !== undefined);
//       setSelectedIds(allIds);
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedIds.length === 0) return;
    
//     if (confirm(`Are you sure you want to delete ${selectedIds.length} selected records?`)) {
//       try {
//         // Delete all selected IDs concurrently
//         await Promise.all(selectedIds.map(id => axios.delete(`${API_BASE_URL}management-reviews/${id}/`)));
        
//         // Update local state using explicit types to fix "implicit any" errors
//         setManagementReviewData((prev: ManagementReviewData[]) => 
//           prev.filter((item: ManagementReviewData) => item.id !== undefined && !selectedIds.includes(item.id))
//         );
//         setSelectedIds([]); // Clear selection
//       } catch (err) {
//         alert("Error deleting some records.");
//         console.error(err);
//       }
//     }
//   };




//   // --- INITIAL DATA LOAD ---
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
//       try {
//         const [hierarchyRes, reviewsRes] = await Promise.all([
//           axios.get<HierarchyItem[]>(`${API_BASE_URL}hierarchy-simple/`),
//           axios.get(`${API_BASE_URL}management-reviews/`),
//         ]);

//         const data = hierarchyRes.data;
//         setHierarchyData(data);

//         // Build global maps
//         const hqs = new Map<number, string>();
//         const factories = new Map<number, string>();
//         const depts = new Map<number, string>();
//         const lines = new Map<number, string>();
//         const sublines = new Map<number, string>();
//         const stations = new Map<number, string>();

//         data.forEach(item => {
//           hqs.set(item.hq, item.hq_name);
//           factories.set(item.factory, item.factory_name);

//           item.structure_data.departments.forEach(dept => {
//             depts.set(dept.id, dept.department_name);
//             dept.lines?.forEach(line => {
//               lines.set(line.id, line.line_name);
//               line.sublines?.forEach(sub => {
//                 sublines.set(sub.id, sub.subline_name);
//                 sub.stations?.forEach(st => {
//                   stations.set(st.id, st.station_name);
//                 });
//               });
//             });
//           });
//         });

//         const buildMaps = (map: Map<number, string>) => {
//           const options = Array.from(map, ([id, name]) => ({ id, name }));
//           const nameToId = Object.fromEntries(Array.from(map, ([id, name]) => [name, id]));
//           const idToName = Object.fromEntries(Array.from(map, ([id, name]) => [id, name]));
//           return { options, nameToId, idToName };
//         };

//         const hq = buildMaps(hqs);
//         const factory = buildMaps(factories);
//         const dept = buildMaps(depts);
//         const line = buildMaps(lines);
//         const subline = buildMaps(sublines);
//         const station = buildMaps(stations);

//         setHqOptions(hq.options);
//         setFactoryOptions(factory.options);
//         setDepartmentOptions(dept.options);
//         setLineOptions(line.options);
//         setSublineOptions(subline.options);
//         setStationOptions(station.options);

//         setNameToIdMap({
//           hq: hq.nameToId,
//           factory: factory.nameToId,
//           department: dept.nameToId,
//           line: line.nameToId,
//           subline: subline.nameToId,
//           station: station.nameToId,
//         });

//         setIdToNameMap({
//           hq: hq.idToName,
//           factory: factory.idToName,
//           department: dept.idToName,
//           line: line.idToName,
//           subline: subline.idToName,
//           station: station.idToName,
//         });

//         // Transform existing records
//         const transformed = reviewsRes.data.map((item: any) => ({
//           ...item,
//           hq: hq.idToName[item.hq] || 'Unknown',
//           factory: factory.idToName[item.factory] || 'Unknown',
//           department: dept.idToName[item.department] || 'Unknown',
//           line: item.line ? line.idToName[item.line] || '-' : '-',
//           subline: item.subline ? subline.idToName[item.subline] || '-' : '-',
//           station: item.station ? station.idToName[item.station] || '-' : '-',
//           month_year: `${item.year}-${String(item.month).padStart(2, '0')}`,
//         }));

//         setManagementReviewData(transformed);
//       } catch (err) {
//         setError("Failed to load data. Is the backend running?");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeData();
//   }, []);

//   // --- CASCADING LOGIC ---
//   const handleHqChange = (value: string) => {
//     setFormData(prev => ({ ...prev, hq: value, factory: '', department: '', line: '', subline: '', station: '' }));
//     if (!value) {
//       setFactoryOptions([]);
//       return;
//     }
//     const hqId = nameToIdMap.hq[value];
//     const filtered = hierarchyData
//       .filter(item => item.hq === hqId)
//       .map(item => ({ id: item.factory, name: item.factory_name }));
//     const unique = Array.from(new Map(filtered.map(i => [i.id, i])).values());
//     setFactoryOptions(unique);
//   };

//   const handleFactoryChange = (value: string) => {
//     setFormData(prev => ({ ...prev, factory: value, department: '', line: '', subline: '', station: '' }));
//     if (!value || !formData.hq) {
//       setDepartmentOptions([]);
//       return;
//     }
//     const hqId = nameToIdMap.hq[formData.hq];
//     const factoryId = nameToIdMap.factory[value];
//     const depts = new Map<number, string>();
//     hierarchyData
//       .filter(item => item.hq === hqId && item.factory === factoryId)
//       .forEach(item => {
//         item.structure_data.departments.forEach(d => depts.set(d.id, d.department_name));
//       });
//     setDepartmentOptions(Array.from(depts, ([id, name]) => ({ id, name })));
//   };

//   const handleDepartmentChange = (value: string) => {
//     setFormData(prev => ({ ...prev, department: value, line: '', subline: '', station: '' }));
//     if (!value || !formData.hq || !formData.factory) {
//       setLineOptions([]);
//       return;
//     }
//     const hqId = nameToIdMap.hq[formData.hq];
//     const factoryId = nameToIdMap.factory[formData.factory];
//     const deptId = nameToIdMap.department[value];
//     const lines = new Map<number, string>();
//     hierarchyData
//       .filter(item => item.hq === hqId && item.factory === factoryId)
//       .forEach(item => {
//         item.structure_data.departments
//           .filter(d => d.id === deptId)
//           .forEach(d => d.lines?.forEach(l => lines.set(l.id, l.line_name)));
//       });
//     setLineOptions(Array.from(lines, ([id, name]) => ({ id, name })));
//   };

//   const handleLineChange = (value: string) => {
//     setFormData(prev => ({ ...prev, line: value, subline: '', station: '' }));
//     if (!value) {
//       setSublineOptions([]);
//       return;
//     }
//     const hqId = nameToIdMap.hq[formData.hq];
//     const factoryId = nameToIdMap.factory[formData.factory];
//     const deptId = nameToIdMap.department[formData.department];
//     const lineId = nameToIdMap.line[value];
//     const sublines = new Map<number, string>();
//     hierarchyData
//       .filter(item => item.hq === hqId && item.factory === factoryId)
//       .forEach(item => {
//         item.structure_data.departments.forEach(d => {
//           if (d.id === deptId) {
//             d.lines?.forEach(l => {
//               if (l.id === lineId) {
//                 l.sublines?.forEach(s => sublines.set(s.id, s.subline_name));
//               }
//             });
//           }
//         });
//       });
//     setSublineOptions(Array.from(sublines, ([id, name]) => ({ id, name })));
//   };

//   const handleSublineChange = (value: string) => {
//     setFormData(prev => ({ ...prev, subline: value, station: '' }));
//     if (!value) {
//       setStationOptions([]);
//       return;
//     }
//     const hqId = nameToIdMap.hq[formData.hq];
//     const factoryId = nameToIdMap.factory[formData.factory];
//     const deptId = nameToIdMap.department[formData.department];
//     const lineId = nameToIdMap.line[formData.line];
//     const sublineId = nameToIdMap.subline[value];
//     const stations = new Map<number, string>();
//     hierarchyData
//       .filter(item => item.hq === hqId && item.factory === factoryId)
//       .forEach(item => {
//         item.structure_data.departments.forEach(d => {
//           if (d.id === deptId) {
//             d.lines?.forEach(l => {
//               if (l.id === lineId) {
//                 l.sublines?.forEach(s => {
//                   if (s.id === sublineId) {
//                     s.stations?.forEach(st => stations.set(st.id, st.station_name));
//                   }
//                 });
//               }
//             });
//           }
//         });
//       });
//     setStationOptions(Array.from(stations, ([id, name]) => ({ id, name })));
//   };

//     // --- FORM SUBMIT ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const [year, month] = formData.month_year.split('-');

//     // LOGIC: If the form data is an empty string "", we send null.
//     // This tells the backend: "This record applies to ALL [Lines/Stations]"
//     const payload: any = {
//       hq: nameToIdMap.hq[formData.hq],
//       factory: nameToIdMap.factory[formData.factory],
//       department: formData.department ? nameToIdMap.department[formData.department] : null,
      
//       // If formData.line exists, get ID. If empty string, send null (ALL).
//       line: formData.line ? nameToIdMap.line[formData.line] : null,
//       subline: formData.subline ? nameToIdMap.subline[formData.subline] : null,
//       station: formData.station ? nameToIdMap.station[formData.station] : null,
      
//       year: parseInt(year),
//       month: parseInt(month),
      
//       // Metrics
//       new_operators_joined: formData.new_operators_joined,
//       new_operators_trained: formData.new_operators_trained,
//       total_training_plans: formData.total_training_plans,
//       total_trainings_actual: formData.total_trainings_actual,
//       total_defects_msil: formData.total_defects_msil,
//       ctq_defects_msil: formData.ctq_defects_msil,
//       total_defects_tier1: formData.total_defects_tier1,
//       ctq_defects_tier1: formData.ctq_defects_tier1,
//       total_internal_rejection: formData.total_internal_rejection,
//       ctq_internal_rejection: formData.ctq_internal_rejection,
//     };

//     try {
//       const res = await axios.post(`${API_BASE_URL}management-reviews/`, payload);
//       const newItem = res.data;

//       // Helper to safely get name or return '-' for nulls
//       const getName = (map: any, id: number) => (id ? map[id] || '-' : 'All');

//       const transformed = {
//         ...newItem,
//         hq: idToNameMap.hq[newItem.hq],
//         factory: idToNameMap.factory[newItem.factory],
//         department: idToNameMap.department[newItem.department],
//         // Display "All" if the ID came back as null
//         line: getName(idToNameMap.line, newItem.line),
//         subline: getName(idToNameMap.subline, newItem.subline),
//         station: getName(idToNameMap.station, newItem.station),
//         month_year: `${newItem.year}-${String(newItem.month).padStart(2, '0')}`,
//       };

//       setManagementReviewData(prev => [...prev, transformed]);
//       alert("Data added successfully!");
//       setActiveTab('data-list');
      
//       // Reset form
//       setFormData({
//         ...formData,
//         // Keep HQ/Factory/Dept selected for easier data entry
//         line: '', subline: '', station: '', 
//         new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
//         total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
//         total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
//         ctq_internal_rejection: 0,
//       });
//     } catch (err: any) {
//       alert("Error: " + (err.response?.data?.detail || "Failed to submit"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (confirm("Delete this record?")) {
//       await axios.delete(`${API_BASE_URL}management-reviews/${id}/`);
//       setManagementReviewData(prev => prev.filter(x => x.id !== id));
//     }
//   };

//   // 1. ADD THIS NEW FUNCTION
//   const handleDownloadTemplate = () => {
//     // This triggers the browser to download the file from Django
//     window.location.href = `${API_BASE_URL}management/download-template/`;
//   };

//   // --- UPLOAD HANDLER ---
//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!uploadFile) return;

//     setUploadLoading(true);
//     const formData = new FormData();
//     formData.append('file', uploadFile);

//     try {
//       // 2. UPDATE THE URL HERE (Change 'upload-excel/' to 'management/upload-excel/')
//       await axios.post(`${API_BASE_URL}management/upload-excel/`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       alert("File uploaded successfully!");
//       setUploadFile(null);
//       window.location.reload();
//     } catch (err: any) {
//       alert("Upload failed: " + (err.response?.data?.error || "Unknown error"));
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const formatDate = (dateStr: string) => {
//     const [y, m] = dateStr.split('-');
//     return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
//   };

//   // --- CALCULATE OVERVIEW STATS ---
//   const totalRecords = managementReviewData.length;

//   // Training Stats
//   const totalJoined = managementReviewData.reduce((acc, item) => acc + item.new_operators_joined, 0);
//   const totalTrained = managementReviewData.reduce((acc, item) => acc + item.new_operators_trained, 0);
//   const totalPlans = managementReviewData.reduce((acc, item) => acc + item.total_training_plans, 0);
//   const totalActual = managementReviewData.reduce((acc, item) => acc + item.total_trainings_actual, 0);

//   // MSIL Defects
//   const totalDefectsMsil = managementReviewData.reduce((acc, item) => acc + item.total_defects_msil, 0);
//   const totalCtqMsil = managementReviewData.reduce((acc, item) => acc + item.ctq_defects_msil, 0);

//   // Tier 1 Defects
//   const totalDefectsTier1 = managementReviewData.reduce((acc, item) => acc + item.total_defects_tier1, 0);
//   const totalCtqTier1 = managementReviewData.reduce((acc, item) => acc + item.ctq_defects_tier1, 0);

//   // Internal Rejection
//   const totalInternalRej = managementReviewData.reduce((acc, item) => acc + item.total_internal_rejection, 0);
//   const totalCtqRej = managementReviewData.reduce((acc, item) => acc + item.ctq_internal_rejection, 0);

//   // --- RENDER ---
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-xl text-gray-700">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center p-10 bg-white rounded-2xl shadow-lg">
//           <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
//           <h3 className="text-2xl font-bold text-red-800">Error</h3>
//           <p className="text-red-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Review Dashboard</h1>
//         <p className="text-lg text-gray-600 mb-8">Track and manage operational metrics</p>

//         {/* Tabs */}
//         <div className="mb-8 bg-white rounded-t-2xl shadow">
//           <nav className="flex space-x-8 px-6">
//             {tabs.map(tab => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id as any)}
//                   className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-800'
//                     }`}
//                 >
//                   <Icon className="h-5 w-5" />
//                   {tab.name}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         {/* 1. OVERVIEW TAB */}
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             {/* Header Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center border-l-4 border-gray-500">
//                 <div className="bg-gray-100 p-4 rounded-full text-gray-600 mr-4">
//                   <FileSpreadsheet className="h-8 w-8" />
//                 </div>
//                 <div>
//                   <p className="text-gray-500 text-sm font-semibold">Total Records</p>
//                   <h3 className="text-2xl font-bold text-gray-800">{totalRecords}</h3>
//                 </div>
//               </div>
//             </div>

//             <h3 className="text-xl font-bold text-gray-800 mt-8 border-b pb-2">Training Metrics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
//                 <p className="text-gray-500 text-sm mb-1">Operators Joined</p>
//                 <div className="flex items-center text-blue-600">
//                   <Users className="h-6 w-6 mr-2" />
//                   <span className="text-2xl font-bold">{totalJoined}</span>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
//                 <p className="text-gray-500 text-sm mb-1">Operators Trained</p>
//                 <div className="flex items-center text-green-600">
//                   <Users className="h-6 w-6 mr-2" />
//                   <span className="text-2xl font-bold">{totalTrained}</span>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
//                 <p className="text-gray-500 text-sm mb-1">Training Plans</p>
//                 <div className="flex items-center text-purple-600">
//                   <TrendingUp className="h-6 w-6 mr-2" />
//                   <span className="text-2xl font-bold">{totalPlans}</span>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
//                 <p className="text-gray-500 text-sm mb-1">Trainings Actual</p>
//                 <div className="flex items-center text-indigo-600">
//                   <CheckCircle className="h-6 w-6 mr-2" />
//                   <span className="text-2xl font-bold">{totalActual}</span>
//                 </div>
//               </div>
//             </div>

//             <h3 className="text-xl font-bold text-gray-800 mt-8 border-b pb-2">Defects & Rejections</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* MSIL Defects */}
//               <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-500">
//                 <h4 className="font-bold text-gray-700 mb-4 flex items-center"><Factory className="w-4 h-4 mr-2" /> MSIL Defects</h4>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-500">Total</span>
//                   <span className="font-bold text-red-600">{totalDefectsMsil}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">CTQ</span>
//                   <span className="font-bold text-red-800">{totalCtqMsil}</span>
//                 </div>
//               </div>

//               {/* Tier 1 Defects */}
//               <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-orange-500">
//                 <h4 className="font-bold text-gray-700 mb-4 flex items-center"><Layers className="w-4 h-4 mr-2" /> Tier-1 Defects</h4>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-500">Total</span>
//                   <span className="font-bold text-orange-600">{totalDefectsTier1}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">CTQ</span>
//                   <span className="font-bold text-orange-800">{totalCtqTier1}</span>
//                 </div>
//               </div>

//               {/* Internal Rejection */}
//               <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-yellow-500">
//                 <h4 className="font-bold text-gray-700 mb-4 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Internal Rejection</h4>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-500">Total</span>
//                   <span className="font-bold text-yellow-600">{totalInternalRej}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">CTQ</span>
//                   <span className="font-bold text-yellow-800">{totalCtqRej}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* 2. ADD DATA TAB */}
//         {activeTab === 'add-data' && (
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
//               <Plus className="h-8 w-8 text-blue-600 mr-3" />
//               Add New Entry
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-8">
//                             {/* Hierarchy Dropdowns */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {/* HQ (Mandatory) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Building className="h-4 w-4 mr-2" /> HQ <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <select
//                     value={formData.hq}
//                     onChange={(e) => handleHqChange(e.target.value)}
//                     className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select HQ</option>
//                     {hqOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Factory (Mandatory) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Factory className="h-4 w-4 mr-2" /> Factory <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <select
//                     value={formData.factory}
//                     onChange={(e) => handleFactoryChange(e.target.value)}
//                     className="w-full px-4 py-3 border rounded-xl"
//                     disabled={!formData.hq}
//                     required
//                   >
//                     <option value="">Select Factory</option>
//                     {factoryOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Department (Mandatory) */}
//                {/* Department (Optional - Default is ALL) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Briefcase className="h-4 w-4 mr-2" /> Department
//                   </label>
//                   <select
//                     value={formData.department}
//                     onChange={(e) => handleDepartmentChange(e.target.value)}
//                     className="w-full px-4 py-3 border rounded-xl"
//                     disabled={!formData.factory}
//                     // REMOVED 'required' attribute here
//                   >
//                     {/* CHANGED TEXT */}
//                     <option value="">All Departments</option>
//                     {departmentOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Line (Optional - Default is ALL) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Layers className="h-4 w-4 mr-2" /> Line
//                   </label>
//                   <select
//                     value={formData.line}
//                     onChange={(e) => handleLineChange(e.target.value)}
//                     className="w-full px-4 py-3 border rounded-xl"
//                     disabled={!formData.department}
//                   >
//                     {/* THIS IS THE KEY CHANGE */}
//                     <option value="">All Lines</option>
//                     {lineOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Subline (Optional - Disabled if Line is ALL) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <Wrench className="h-4 w-4 mr-2" /> Subline
//                   </label>
//                   <select
//                     value={formData.subline}
//                     onChange={(e) => handleSublineChange(e.target.value)}
//                     className="w-full px-4 py-3 border rounded-xl"
//                     // Disabled if Line is empty (meaning 'All Lines')
//                     disabled={!formData.line} 
//                   >
//                     <option value="">All Sublines</option>
//                     {sublineOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>

//                 {/* Station (Optional - Disabled if Subline is ALL) */}
//                 <div>
//                   <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                     <MapPin className="h-4 w-4 mr-2" /> Station
//                   </label>
//                   <select
//                     value={formData.station}
//                     onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
//                     className="w-full px-4 py-3 border rounded-xl"
//                     // Disabled if Subline is empty (meaning 'All Sublines')
//                     disabled={!formData.subline}
//                   >
//                     <option value="">All Stations</option>
//                     {stationOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               {/* Metrics */}
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//                 {[
//                   { id: 'month_year', label: 'Month/Year', type: 'month', icon: Calendar },
//                   { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', icon: Users },
//                   { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', icon: Users },
//                   { id: 'total_training_plans', label: 'Training Plans', type: 'number', icon: TrendingUp },
//                   { id: 'total_trainings_actual', label: 'Trainings Actual', type: 'number', icon: TrendingUp },
//                   { id: 'total_defects_msil', label: 'Defects MSIL', type: 'number', icon: BarChart3 },
//                   { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', icon: BarChart3 },

//                   // --- Added Fields ---
//                   { id: 'total_defects_tier1', label: 'Total Defects Tier-1', type: 'number', icon: BarChart3 },
//                   { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier-1', type: 'number', icon: BarChart3 },

//                   { id: 'total_internal_rejection', label: 'Internal Rejection', type: 'number', icon: BarChart3 },

//                   // --- Added Field ---
//                   { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', icon: BarChart3 },
//                 ].map(field => {
//                   const Icon = field.icon;
//                   return (
//                     <div key={field.id}>
//                       <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
//                         <Icon className="h-4 w-4 mr-2" /> {field.label}
//                       </label>
//                       <input
//                         type={field.type}
//                         value={formData[field.id as keyof ManagementReviewData] as any}
//                         onChange={(e) => setFormData(prev => ({
//                           ...prev,
//                           [field.id]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
//                         }))}
//                         className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
//                         required
//                       />
//                     </div>
//                   );
//                 })}
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Add Entry'}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* 3. UPLOAD EXCEL TAB */}
//         {activeTab === 'upload' && (
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Bulk Upload Data</h2>
//             <p className="text-gray-600 mb-8">Manage large datasets using Excel templates.</p>

//             {/* STEP 1: DOWNLOAD */}
//             <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
//               <h4 className="font-bold text-blue-800 mb-2 flex items-center justify-center">
//                 <FileSpreadsheet className="h-5 w-5 mr-2" /> Step 1: Get the Template
//               </h4>
//               <p className="text-sm text-blue-600 mb-4">
//                 Download the latest template containing columns for Training, MSIL Defects, Tier-1 Defects, and Internal Rejection.
//               </p>
//               <button
//                 onClick={handleDownloadTemplate}
//                 className="px-6 py-2 bg-white text-blue-700 font-bold rounded-lg border border-blue-200 shadow-sm hover:bg-blue-50 transition-all"
//               >
//                 Download Template.xlsx
//               </button>
//             </div>

//             {/* STEP 2: UPLOAD */}
//             <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
//               <h4 className="font-bold text-gray-700 mb-4">Step 2: Upload Filled File</h4>

//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
//                 className="mb-6 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
//               />

//               {uploadFile && (
//                 <div className="flex items-center text-sm text-green-600 font-medium mb-4 bg-green-50 px-4 py-2 rounded-full">
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   {uploadFile.name} selected
//                 </div>
//               )}

//               <button
//                 onClick={handleUpload}
//                 disabled={!uploadFile || uploadLoading}
//                 className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center shadow-lg disabled:shadow-none transition-all"
//               >
//                 {uploadLoading ? (
//                   <>
//                     <Loader2 className="h-5 w-5 animate-spin mr-2" /> Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="h-5 w-5 mr-2" /> Upload Excel File
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="mt-8 text-left bg-gray-50 p-4 rounded-xl text-xs text-gray-500">
//               <p className="font-semibold mb-1">Note:</p>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Ensure HQ, Factory, and Department names match the "Reference_Data" sheet exactly.</li>
//                 <li>New columns added: <strong>Total Defects Tier1, CTQ Defects Tier1, CTQ Internal Rejection</strong>.</li>
//                 <li>Uploading a row with the same Factory/Month/Year will overwrite the existing record.</li>
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* 4. DATA LIST TAB */}
//             {/* 4. DATA LIST TAB */}
//         {activeTab === 'data-list' && (
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Updated Header with Bulk Delete Button */}
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Data Records ({managementReviewData.length})</h2>
              
//               {selectedIds.length > 0 && (
//                 <button 
//                   onClick={handleDeleteSelected}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Delete Selected ({selectedIds.length})
//                 </button>
//               )}
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {/* Select All Checkbox */}
//                     <th className="px-6 py-3 text-left">
//                       <input 
//                         type="checkbox"
//                         className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
//                         onChange={handleSelectAll}
//                         checked={
//                           managementReviewData.length > 0 && 
//                           selectedIds.length === managementReviewData.length
//                         }
//                       />
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HQ</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factory</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Line</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subline</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {managementReviewData.map((item: ManagementReviewData) => {
//                     const isSelected = item.id !== undefined && selectedIds.includes(item.id);
//                     return (
//                       <tr key={item.id} className={`transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
//                         {/* Individual Checkbox */}
//                         <td className="px-6 py-4">
//                           <input 
//                             type="checkbox"
//                             className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
//                             checked={isSelected}
//                             onChange={() => item.id && toggleSelect(item.id)}
//                           />
//                         </td>
//                         <td className="px-6 py-4 text-sm">{item.hq}</td>
//                         <td className="px-6 py-4 text-sm">{item.factory}</td>
//                         <td className="px-6 py-4 text-sm">{item.department}</td>
//                         <td className="px-6 py-4 text-sm">{item.line}</td>
//                         <td className="px-6 py-4 text-sm">{item.subline}</td>
//                         <td className="px-6 py-4 text-sm">{item.station}</td>
//                         <td className="px-6 py-4 text-sm">{formatDate(item.month_year)}</td>
//                         <td className="px-6 py-4">
//                           <button onClick={() => item.id && handleDelete(item.id)} className="text-red-600 hover:text-red-800">
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagementSettings;






// src/components/pages/ManagementSettings.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload, Plus, Trash2, FileSpreadsheet, Users, TrendingUp,
  Calendar, BarChart3, Building, Factory, Briefcase,
  AlertCircle, Loader2, Layers, Wrench, MapPin, CheckCircle, FileText
} from "lucide-react";

// --- CONFIG ---
const API_BASE_URL = "http://127.0.0.1:8000/";

// --- INTERFACES ---
interface ManagementReviewData {
  id?: number;
  hq: string;
  factory: string;
  department: string;
  line: string;
  subline: string;
  station: string;
  month_year: string;
  new_operators_joined: number;
  new_operators_trained: number;
  total_training_plans: number;
  total_trainings_actual: number;
  total_defects_msil: number;
  ctq_defects_msil: number;
  total_defects_tier1: number;
  ctq_defects_tier1: number;
  total_internal_rejection: number;
  ctq_internal_rejection: number;
}

interface DropdownOption {
  id: number;
  name: string;
}

interface HierarchyItem {
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: {
    departments: Array<{
      id: number;
      department_name: string;
      lines?: Array<{
        id: number;
        line_name: string;
        sublines?: Array<{
          id: number;
          subline_name: string;
          stations?: Array<{
            id: number;
            station_name: string;
          }>;
        }>;
      }>;
    }>;
  };
}

const ManagementSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add-data' | 'upload' | 'data-list'>('overview');
  const [managementReviewData, setManagementReviewData] = useState<ManagementReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ManagementReviewData>({
    hq: '', factory: '', department: '', line: '', subline: '', station: '', month_year: '',
    new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
    total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
    total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
    ctq_internal_rejection: 0,
  });

  // Full hierarchy from API
  const [hierarchyData, setHierarchyData] = useState<HierarchyItem[]>([]);

  // Dropdown Options
  const [hqOptions, setHqOptions] = useState<DropdownOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<DropdownOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<DropdownOption[]>([]);
  const [lineOptions, setLineOptions] = useState<DropdownOption[]>([]);
  const [sublineOptions, setSublineOptions] = useState<DropdownOption[]>([]);
  const [stationOptions, setStationOptions] = useState<DropdownOption[]>([]);

  // Name ↔ ID Maps
  const [nameToIdMap, setNameToIdMap] = useState<Record<string, Record<string, number>>>({
    hq: {}, factory: {}, department: {}, line: {}, subline: {}, station: {}
  });
  const [idToNameMap, setIdToNameMap] = useState<Record<string, Record<number, string>>>({
    hq: {}, factory: {}, department: {}, line: {}, subline: {}, station: {}
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'add-data', name: 'Add Data', icon: Plus },
    { id: 'upload', name: 'Upload Excel', icon: Upload },
    { id: 'data-list', name: 'Data Records', icon: FileSpreadsheet },
  ];

  // --- BULK ACTION HANDLERS ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = managementReviewData
        .map((item: ManagementReviewData) => item.id)
        .filter((id): id is number => id !== undefined);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected records?`)) {
      try {
        await Promise.all(selectedIds.map(id => axios.delete(`${API_BASE_URL}management-reviews/${id}/`)));
        
        setManagementReviewData((prev: ManagementReviewData[]) => 
          prev.filter((item: ManagementReviewData) => item.id !== undefined && !selectedIds.includes(item.id))
        );
        setSelectedIds([]); 
      } catch (err) {
        alert("Error deleting some records.");
        console.error(err);
      }
    }
  };

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const [hierarchyRes, reviewsRes] = await Promise.all([
          axios.get<HierarchyItem[]>(`${API_BASE_URL}hierarchy-simple/`),
          axios.get(`${API_BASE_URL}management-reviews/`),
        ]);

        const data = hierarchyRes.data;
        setHierarchyData(data);

        // Build global maps
        const hqs = new Map<number, string>();
        const factories = new Map<number, string>();
        const depts = new Map<number, string>();
        const lines = new Map<number, string>();
        const sublines = new Map<number, string>();
        const stations = new Map<number, string>();

        data.forEach(item => {
          hqs.set(item.hq, item.hq_name);
          factories.set(item.factory, item.factory_name);

          item.structure_data.departments.forEach(dept => {
            depts.set(dept.id, dept.department_name);
            dept.lines?.forEach(line => {
              lines.set(line.id, line.line_name);
              line.sublines?.forEach(sub => {
                sublines.set(sub.id, sub.subline_name);
                sub.stations?.forEach(st => {
                  stations.set(st.id, st.station_name);
                });
              });
            });
          });
        });

        const buildMaps = (map: Map<number, string>) => {
          const options = Array.from(map, ([id, name]) => ({ id, name }));
          const nameToId = Object.fromEntries(Array.from(map, ([id, name]) => [name, id]));
          const idToName = Object.fromEntries(Array.from(map, ([id, name]) => [id, name]));
          return { options, nameToId, idToName };
        };

        const hq = buildMaps(hqs);
        const factory = buildMaps(factories);
        const dept = buildMaps(depts);
        const line = buildMaps(lines);
        const subline = buildMaps(sublines);
        const station = buildMaps(stations);

        setHqOptions(hq.options);
        setFactoryOptions(factory.options);
        setDepartmentOptions(dept.options);
        setLineOptions(line.options);
        setSublineOptions(subline.options);
        setStationOptions(station.options);

        setNameToIdMap({
          hq: hq.nameToId,
          factory: factory.nameToId,
          department: dept.nameToId,
          line: line.nameToId,
          subline: subline.nameToId,
          station: station.nameToId,
        });

        setIdToNameMap({
          hq: hq.idToName,
          factory: factory.idToName,
          department: dept.idToName,
          line: line.idToName,
          subline: subline.idToName,
          station: station.idToName,
        });

        const transformed = reviewsRes.data.map((item: any) => ({
          ...item,
          hq: hq.idToName[item.hq] || 'Unknown',
          factory: factory.idToName[item.factory] || 'Unknown',
          department: dept.idToName[item.department] || 'Unknown',
          line: item.line ? line.idToName[item.line] || '-' : '-',
          subline: item.subline ? subline.idToName[item.subline] || '-' : '-',
          station: item.station ? station.idToName[item.station] || '-' : '-',
          month_year: `${item.year}-${String(item.month).padStart(2, '0')}`,
        }));

        setManagementReviewData(transformed);
      } catch (err) {
        setError("Failed to load data. Is the backend running?");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // --- CASCADING LOGIC ---
  const handleHqChange = (value: string) => {
    setFormData(prev => ({ ...prev, hq: value, factory: '', department: '', line: '', subline: '', station: '' }));
    if (!value) {
      setFactoryOptions([]);
      return;
    }
    const hqId = nameToIdMap.hq[value];
    const filtered = hierarchyData
      .filter(item => item.hq === hqId)
      .map(item => ({ id: item.factory, name: item.factory_name }));
    const unique = Array.from(new Map(filtered.map(i => [i.id, i])).values());
    setFactoryOptions(unique);
  };

  const handleFactoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, factory: value, department: '', line: '', subline: '', station: '' }));
    if (!value || !formData.hq) {
      setDepartmentOptions([]);
      return;
    }
    const hqId = nameToIdMap.hq[formData.hq];
    const factoryId = nameToIdMap.factory[value];
    const depts = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === hqId && item.factory === factoryId)
      .forEach(item => {
        item.structure_data.departments.forEach(d => depts.set(d.id, d.department_name));
      });
    setDepartmentOptions(Array.from(depts, ([id, name]) => ({ id, name })));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value, line: '', subline: '', station: '' }));
    if (!value || !formData.hq || !formData.factory) {
      setLineOptions([]);
      return;
    }
    const hqId = nameToIdMap.hq[formData.hq];
    const factoryId = nameToIdMap.factory[formData.factory];
    const deptId = nameToIdMap.department[value];
    const lines = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === hqId && item.factory === factoryId)
      .forEach(item => {
        item.structure_data.departments
          .filter(d => d.id === deptId)
          .forEach(d => d.lines?.forEach(l => lines.set(l.id, l.line_name)));
      });
    setLineOptions(Array.from(lines, ([id, name]) => ({ id, name })));
  };

  const handleLineChange = (value: string) => {
    setFormData(prev => ({ ...prev, line: value, subline: '', station: '' }));
    if (!value) {
      setSublineOptions([]);
      return;
    }
    const hqId = nameToIdMap.hq[formData.hq];
    const factoryId = nameToIdMap.factory[formData.factory];
    const deptId = nameToIdMap.department[formData.department];
    const lineId = nameToIdMap.line[value];
    const sublines = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === hqId && item.factory === factoryId)
      .forEach(item => {
        item.structure_data.departments.forEach(d => {
          if (d.id === deptId) {
            d.lines?.forEach(l => {
              if (l.id === lineId) {
                l.sublines?.forEach(s => sublines.set(s.id, s.subline_name));
              }
            });
          }
        });
      });
    setSublineOptions(Array.from(sublines, ([id, name]) => ({ id, name })));
  };

  const handleSublineChange = (value: string) => {
    setFormData(prev => ({ ...prev, subline: value, station: '' }));
    if (!value) {
      setStationOptions([]);
      return;
    }
    const hqId = nameToIdMap.hq[formData.hq];
    const factoryId = nameToIdMap.factory[formData.factory];
    const deptId = nameToIdMap.department[formData.department];
    const lineId = nameToIdMap.line[formData.line];
    const sublineId = nameToIdMap.subline[value];
    const stations = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === hqId && item.factory === factoryId)
      .forEach(item => {
        item.structure_data.departments.forEach(d => {
          if (d.id === deptId) {
            d.lines?.forEach(l => {
              if (l.id === lineId) {
                l.sublines?.forEach(s => {
                  if (s.id === sublineId) {
                    s.stations?.forEach(st => stations.set(st.id, st.station_name));
                  }
                });
              }
            });
          }
        });
      });
    setStationOptions(Array.from(stations, ([id, name]) => ({ id, name })));
  };

  // --- FORM SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const [year, month] = formData.month_year.split('-');

    const payload: any = {
      hq: nameToIdMap.hq[formData.hq],
      factory: nameToIdMap.factory[formData.factory],
      department: formData.department ? nameToIdMap.department[formData.department] : null,
      line: formData.line ? nameToIdMap.line[formData.line] : null,
      subline: formData.subline ? nameToIdMap.subline[formData.subline] : null,
      station: formData.station ? nameToIdMap.station[formData.station] : null,
      year: parseInt(year),
      month: parseInt(month),
      new_operators_joined: formData.new_operators_joined,
      new_operators_trained: formData.new_operators_trained,
      total_training_plans: formData.total_training_plans,
      total_trainings_actual: formData.total_trainings_actual,
      total_defects_msil: formData.total_defects_msil,
      ctq_defects_msil: formData.ctq_defects_msil,
      total_defects_tier1: formData.total_defects_tier1,
      ctq_defects_tier1: formData.ctq_defects_tier1,
      total_internal_rejection: formData.total_internal_rejection,
      ctq_internal_rejection: formData.ctq_internal_rejection,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}management-reviews/`, payload);
      const newItem = res.data;

      const getName = (map: any, id: number) => (id ? map[id] || '-' : 'All');

      const transformed = {
        ...newItem,
        hq: idToNameMap.hq[newItem.hq],
        factory: idToNameMap.factory[newItem.factory],
        department: idToNameMap.department[newItem.department],
        line: getName(idToNameMap.line, newItem.line),
        subline: getName(idToNameMap.subline, newItem.subline),
        station: getName(idToNameMap.station, newItem.station),
        month_year: `${newItem.year}-${String(newItem.month).padStart(2, '0')}`,
      };

      setManagementReviewData(prev => [...prev, transformed]);
      alert("Data added successfully!");
      setActiveTab('data-list');
      
      setFormData({
        ...formData,
        line: '', subline: '', station: '', 
        new_operators_joined: 0, new_operators_trained: 0, total_training_plans: 0,
        total_trainings_actual: 0, total_defects_msil: 0, ctq_defects_msil: 0,
        total_defects_tier1: 0, ctq_defects_tier1: 0, total_internal_rejection: 0,
        ctq_internal_rejection: 0,
      });
    } catch (err: any) {
      alert("Error: " + (err.response?.data?.detail || "Failed to submit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this record?")) {
      await axios.delete(`${API_BASE_URL}management-reviews/${id}/`);
      setManagementReviewData(prev => prev.filter(x => x.id !== id));
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = `${API_BASE_URL}management/download-template/`;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      await axios.post(`${API_BASE_URL}management/upload-excel/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("File uploaded successfully!");
      setUploadFile(null);
      window.location.reload();
    } catch (err: any) {
      alert("Upload failed: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setUploadLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m] = dateStr.split('-');
    return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // --- CALCULATE OVERVIEW STATS ---
  const totalRecords = managementReviewData.length;
  const totalJoined = managementReviewData.reduce((acc, item) => acc + item.new_operators_joined, 0);
  const totalTrained = managementReviewData.reduce((acc, item) => acc + item.new_operators_trained, 0);
  const totalPlans = managementReviewData.reduce((acc, item) => acc + item.total_training_plans, 0);
  const totalActual = managementReviewData.reduce((acc, item) => acc + item.total_trainings_actual, 0);
  const totalDefectsMsil = managementReviewData.reduce((acc, item) => acc + item.total_defects_msil, 0);
  const totalCtqMsil = managementReviewData.reduce((acc, item) => acc + item.ctq_defects_msil, 0);
  const totalDefectsTier1 = managementReviewData.reduce((acc, item) => acc + item.total_defects_tier1, 0);
  const totalCtqTier1 = managementReviewData.reduce((acc, item) => acc + item.ctq_defects_tier1, 0);
  const totalInternalRej = managementReviewData.reduce((acc, item) => acc + item.total_internal_rejection, 0);
  const totalCtqRej = managementReviewData.reduce((acc, item) => acc + item.ctq_internal_rejection, 0);

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-300">Error</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Management Review Dashboard</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Track and manage operational metrics</p>

        {/* Tabs */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-t-2xl shadow transition-colors duration-300">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center border-l-4 border-gray-500 dark:border-gray-600 transition-colors duration-300">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full text-gray-600 dark:text-gray-300 mr-4">
                  <FileSpreadsheet className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total Records</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{totalRecords}</h3>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 border-b border-gray-200 dark:border-gray-700 pb-2">Training Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Operators Joined</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Users className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">{totalJoined}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Operators Trained</p>
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <Users className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">{totalTrained}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Training Plans</p>
                <div className="flex items-center text-purple-600 dark:text-purple-400">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">{totalPlans}</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col transition-colors duration-300">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Trainings Actual</p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">{totalActual}</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 border-b border-gray-200 dark:border-gray-700 pb-2">Defects & Rejections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* MSIL Defects */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-red-500 dark:border-red-600 transition-colors duration-300">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center"><Factory className="w-4 h-4 mr-2" /> MSIL Defects</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{totalDefectsMsil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CTQ</span>
                  <span className="font-bold text-red-800 dark:text-red-300">{totalCtqMsil}</span>
                </div>
              </div>

              {/* Tier 1 Defects */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-orange-500 dark:border-orange-600 transition-colors duration-300">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center"><Layers className="w-4 h-4 mr-2" /> Tier-1 Defects</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{totalDefectsTier1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CTQ</span>
                  <span className="font-bold text-orange-800 dark:text-orange-300">{totalCtqTier1}</span>
                </div>
              </div>

              {/* Internal Rejection */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border-t-4 border-yellow-500 dark:border-yellow-600 transition-colors duration-300">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Internal Rejection</h4>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Total</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">{totalInternalRej}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">CTQ</span>
                  <span className="font-bold text-yellow-800 dark:text-yellow-300">{totalCtqRej}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ADD DATA TAB */}
        {activeTab === 'add-data' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
              <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              Add New Entry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Hierarchy Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* HQ (Mandatory) */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building className="h-4 w-4 mr-2" /> HQ <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={formData.hq}
                    onChange={(e) => handleHqChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select HQ</option>
                    {hqOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* Factory (Mandatory) */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Factory className="h-4 w-4 mr-2" /> Factory <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={formData.factory}
                    onChange={(e) => handleFactoryChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl disabled:opacity-50"
                    disabled={!formData.hq}
                    required
                  >
                    <option value="">Select Factory</option>
                    {factoryOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Briefcase className="h-4 w-4 mr-2" /> Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl disabled:opacity-50"
                    disabled={!formData.factory}
                  >
                    <option value="">All Departments</option>
                    {departmentOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* Line */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Layers className="h-4 w-4 mr-2" /> Line
                  </label>
                  <select
                    value={formData.line}
                    onChange={(e) => handleLineChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl disabled:opacity-50"
                    disabled={!formData.department}
                  >
                    <option value="">All Lines</option>
                    {lineOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* Subline */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Wrench className="h-4 w-4 mr-2" /> Subline
                  </label>
                  <select
                    value={formData.subline}
                    onChange={(e) => handleSublineChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl disabled:opacity-50"
                    disabled={!formData.line} 
                  >
                    <option value="">All Sublines</option>
                    {sublineOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                {/* Station */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-2" /> Station
                  </label>
                  <select
                    value={formData.station}
                    onChange={(e) => setFormData(prev => ({ ...prev, station: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl disabled:opacity-50"
                    disabled={!formData.subline}
                  >
                    <option value="">All Stations</option>
                    {stationOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'month_year', label: 'Month/Year', type: 'month', icon: Calendar },
                  { id: 'new_operators_joined', label: 'New Operators Joined', type: 'number', icon: Users },
                  { id: 'new_operators_trained', label: 'New Operators Trained', type: 'number', icon: Users },
                  { id: 'total_training_plans', label: 'Training Plans', type: 'number', icon: TrendingUp },
                  { id: 'total_trainings_actual', label: 'Trainings Actual', type: 'number', icon: TrendingUp },
                  { id: 'total_defects_msil', label: 'Defects MSIL', type: 'number', icon: BarChart3 },
                  { id: 'ctq_defects_msil', label: 'CTQ Defects MSIL', type: 'number', icon: BarChart3 },
                  { id: 'total_defects_tier1', label: 'Total Defects Tier-1', type: 'number', icon: BarChart3 },
                  { id: 'ctq_defects_tier1', label: 'CTQ Defects Tier-1', type: 'number', icon: BarChart3 },
                  { id: 'total_internal_rejection', label: 'Internal Rejection', type: 'number', icon: BarChart3 },
                  { id: 'ctq_internal_rejection', label: 'CTQ Internal Rejection', type: 'number', icon: BarChart3 },
                ].map(field => {
                  const Icon = field.icon;
                  return (
                    <div key={field.id}>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Icon className="h-4 w-4 mr-2" /> {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.id as keyof ManagementReviewData] as any}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [field.id]: field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                        }))}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Add Entry'}
              </button>
            </form>
          </div>
        )}

        {/* 3. UPLOAD EXCEL TAB */}
        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Bulk Upload Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Manage large datasets using Excel templates.</p>

            {/* STEP 1: DOWNLOAD */}
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 mr-2" /> Step 1: Get the Template
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Download the latest template containing columns for Training, MSIL Defects, Tier-1 Defects, and Internal Rejection.
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="px-6 py-2 bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-bold rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:bg-blue-50 dark:hover:bg-gray-600 transition-all"
              >
                Download Template.xlsx
              </button>
            </div>

            {/* STEP 2: UPLOAD */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Step 2: Upload Filled File</h4>

              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                className="mb-6 text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />

              {uploadFile && (
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium mb-4 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {uploadFile.name} selected
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploadLoading}
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center shadow-lg disabled:shadow-none transition-all"
              >
                {uploadLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" /> Upload Excel File
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 text-left bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">Note:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure HQ, Factory, and Department names match the "Reference_Data" sheet exactly.</li>
                <li>New columns added: <strong>Total Defects Tier1, CTQ Defects Tier1, CTQ Internal Rejection</strong>.</li>
                <li>Uploading a row with the same Factory/Month/Year will overwrite the existing record.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 4. DATA LIST TAB */}
        {activeTab === 'data-list' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
            {/* Updated Header with Bulk Delete Button */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Records ({managementReviewData.length})</h2>
              
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {/* Select All Checkbox */}
                    <th className="px-6 py-3 text-left">
                      <input 
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                        onChange={handleSelectAll}
                        checked={
                          managementReviewData.length > 0 && 
                          selectedIds.length === managementReviewData.length
                        }
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">HQ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Factory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Dept</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Line</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Station</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {managementReviewData.map((item: ManagementReviewData) => {
                    const isSelected = item.id !== undefined && selectedIds.includes(item.id);
                    return (
                      <tr key={item.id} className={`transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}>
                        {/* Individual Checkbox */}
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => item.id && toggleSelect(item.id)}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.hq}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.factory}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.line}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.subline}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{item.station}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{formatDate(item.month_year)}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => item.id && handleDelete(item.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementSettings;