

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Layout, Users, BookOpen, Plus, MoreHorizontal, BarChart3, 
//   Search, Filter, Info, ChevronDown, CheckCircle2, X, RotateCcw, Briefcase, 
//   Building2, Layers, Shield, ChevronRight, Calendar, DollarSign, TrendingUp, 
//   ArrowLeft, Trash2, FileText, HelpCircle, Save, AlertCircle, TrendingDown, AlertTriangle,
//   Target, MapPin, CheckSquare, Square, CheckCircle, Home, Folder, ChevronLeft, CalendarDays,
//   Sparkles, Grip, GraduationCap, Loader2, Zap, Star, Award, Crown
// } from 'lucide-react';

// // Import Rule Setup Component
// import RuleBasedCompetencySetup from './Competencymatrixsetup';
// // Import Assessment System Component
// import CompetencySystem from './CompetencySystem'; 

// // ==========================================
// // 1. CONFIG & UTILS
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

// // ==========================================
// // 2. TYPES
// // ==========================================

// type ViewMode = 'Financial Year' | 'Calendar Year' | 'Half Yearly' | 'Quarterly' | 'Monthly Calendar';

// interface GapDataResponse {
//   employee: any;
//   competency_gaps: any[];
//   stats: { total: number; on_track: number; gaps: number };
// }

// // ==========================================
// // 3. SUB-VIEWS
// // ==========================================

// // --- GAP ANALYSIS VIEW ---
// const GapAnalysisView = () => {
//   const [data, setData] = useState<GapDataResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterDept, setFilterDept] = useState('all');
//   const [departments, setDepartments] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`${API_BASE}/gap-analysis/?department=${filterDept}`, {
//           headers: getAuthHeaders()
//         });
//         if (res.ok) {
//           const json = await res.json();
//           setData(json);
//           if (filterDept === 'all') {
//              const depts = Array.from(new Set(json.map((d: any) => d.employee.department))).filter(Boolean) as string[];
//              setDepartments(depts);
//           }
//         }
//       } catch (err) {
//         console.error("Gap Analysis Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [filterDept]);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center h-[600px] bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-rose-950/20 dark:via-pink-950/20 dark:to-orange-950/20 rounded-[2rem] border-2 border-dashed border-rose-200 dark:border-rose-800">
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//           <Loader2 className="animate-spin w-16 h-16 text-rose-500 dark:text-rose-400 relative z-10"/>
//         </div>
//         <p className="text-rose-600 dark:text-rose-400 font-bold text-xl mt-6">Analyzing skill gaps...</p>
//         <p className="text-rose-400 dark:text-rose-500 text-sm mt-2">Please wait while we crunch the numbers</p>
//     </div>
//   );

//   return (
//     <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-700">
//       {/* Header Section */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
//         <div className="flex items-start gap-5">
//           <div className="relative group">
//             <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
//             <div className="relative p-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-2xl shadow-rose-500/30">
//               <TrendingDown size={32} className="text-white" />
//             </div>
//           </div>
//           <div>
//             <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 dark:from-rose-400 dark:via-pink-400 dark:to-orange-400 tracking-tight">
//               Skill Gap Analysis
//             </h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Compare Actual Assessment vs. Target Rules</p>
//             <div className="flex gap-2 mt-3">
//               <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded-full text-xs font-bold">AI Powered</span>
//               <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 rounded-full text-xs font-bold">Real-time</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-4 rounded-2xl border-2 border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/10 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 hover:-translate-y-1">
//           <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 block">Filter by Department</label>
//           <div className="flex items-center gap-3">
//             <Filter size={18} className="text-rose-400"/>
//             <select 
//               value={filterDept} 
//               onChange={(e) => setFilterDept(e.target.value)} 
//               className="text-base font-bold text-slate-700 dark:text-slate-200 outline-none bg-transparent cursor-pointer min-w-[180px] dark:bg-slate-900"
//             >
//               <option value="all">All Departments</option>
//               {departments.map(d => <option key={d} value={d}>{d}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>
      
//       {data.length === 0 ? (
//          <div className="flex flex-col items-center justify-center h-80 border-3 border-dashed border-rose-200 dark:border-rose-800 rounded-[2rem] bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10">
//             <div className="p-6 bg-white dark:bg-slate-800 rounded-full shadow-xl shadow-rose-200 dark:shadow-none mb-4">
//               <AlertCircle className="w-12 h-12 text-rose-300" />
//             </div>
//             <h3 className="text-2xl font-black text-slate-700 dark:text-slate-200">No Gap Data Found</h3>
//             <p className="text-slate-500 dark:text-slate-400 text-base max-w-md text-center mt-2">
//                 Ensure you have defined <span className="text-rose-600 dark:text-rose-400 font-bold">Competency Rules</span> and conducted <span className="text-pink-600 dark:text-pink-400 font-bold">Assessments</span>.
//             </p>
//          </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-10 pb-12">
//             {data.map((item, idx) => (
//             <div key={idx} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border-2 border-slate-100 dark:border-slate-800 overflow-hidden hover:border-rose-200 dark:hover:border-rose-900/50 hover:shadow-rose-200/30 transition-all duration-500 group">
//                 {/* Employee Header */}
//                 <div className="p-8 bg-gradient-to-r from-slate-50 via-rose-50/30 to-pink-50/30 dark:from-slate-800 dark:via-rose-900/20 dark:to-pink-900/20 border-b-2 border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//                     <div className="flex items-center gap-5">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl blur opacity-40"></div>
//                           <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-xl ring-4 ring-white dark:ring-slate-700">
//                             {item.employee.avatar}
//                           </div>
//                         </div>
//                         <div>
//                           <h3 className="font-black text-slate-800 dark:text-white text-2xl">{item.employee.name}</h3>
//                           <div className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
//                               <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{item.employee.designation}</span>
//                               <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
//                               <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">{item.employee.department}</span>
//                           </div>
//                         </div>
//                     </div>
//                     <div className="flex gap-4 text-base font-bold">
//                         <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-lg shadow-emerald-500/10">
//                             <CheckCircle size={20} className="text-emerald-500" /> 
//                             <span className="text-2xl font-black">{item.stats.on_track}</span>
//                             <span className="text-emerald-600 dark:text-emerald-400">On Track</span>
//                         </div>
//                         {item.stats.gaps > 0 && (
//                             <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-700 dark:text-rose-400 border-2 border-rose-200 dark:border-rose-800 flex items-center gap-3 shadow-lg shadow-rose-500/10">
//                                 <AlertTriangle size={20} className="text-rose-500" /> 
//                                 <span className="text-2xl font-black">{item.stats.gaps}</span>
//                                 <span className="text-rose-600 dark:text-rose-400">Gaps Found</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>
                
//                 {/* Competency Cards */}
//                 <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {item.competency_gaps.map((gap: any, gIdx: number) => (
//                     <div key={gIdx} className={`rounded-2xl p-6 transition-all duration-300 group/card cursor-pointer ${
//                       gap.is_gap 
//                         ? 'bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/20 border-2 border-rose-200 dark:border-rose-800 hover:shadow-2xl hover:shadow-rose-500/20 hover:-translate-y-2' 
//                         : 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2'
//                     }`}>
//                         <div className="flex justify-between items-start mb-5">
//                             <div className="overflow-hidden flex-1">
//                                 <span className="font-black text-slate-800 dark:text-slate-200 text-lg block truncate" title={gap.competency_name}>{gap.competency_name}</span>
//                                 <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-1 block">{gap.category}</span>
//                             </div>
//                             {gap.is_gap ? (
//                                 <span className="text-sm font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl flex-shrink-0 flex items-center gap-2 shadow-lg shadow-rose-500/30">
//                                   <TrendingDown size={14} /> -{gap.gap}
//                                 </span>
//                             ) : (
//                                 <span className="text-sm font-black bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl flex-shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/30">
//                                   <CheckCircle2 size={14} /> OK
//                                 </span>
//                             )}
//                         </div>
                        
//                         {/* Progress Bar */}
//                         <div className="relative pt-6 pb-3">
//                             <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 absolute top-0 w-full font-mono font-bold">
//                               {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
//                             </div>
//                             <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative shadow-inner">
//                                 <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-slate-600 opacity-40 z-10 rounded-full" style={{ width: `${(gap.target / 5) * 100}%` }}></div>
//                                 <div className={`absolute top-0 left-0 h-full rounded-full z-20 transition-all duration-700 ${
//                                   gap.is_gap 
//                                     ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50' 
//                                     : 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/50'
//                                 }`} style={{ width: `${(gap.actual / 5) * 100}%` }}></div>
//                             </div>
//                         </div>
                        
//                         <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t-2 border-slate-100 dark:border-slate-700">
//                             <div className="flex items-center gap-2">
//                               <span className="text-slate-400 font-medium">Actual:</span>
//                               <span className={`font-black text-xl ${gap.is_gap ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{gap.actual}</span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-slate-400 font-medium">Target:</span>
//                               <span className="font-black text-xl text-indigo-600 dark:text-indigo-400">{gap.target}</span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//                 </div>
//             </div>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- COMPETENCY DASHBOARD (MATRIX VIEW) ---
// const CompetencyDashboard = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
//   const [rows, setRows] = useState<any[]>([]);
//   const [competencies, setCompetencies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // Org Data State
//   const [orgData, setOrgData] = useState({ hqs: [], bus: [], depts: [], sections: [] });
  
//   // Filter State
//   const [filters, setFilters] = useState({ hq: '', bu: '', dept: '', section: '' });

//   // 1. Load Hierarchy Dropdowns
//   useEffect(() => {
//     fetch(`${API_BASE}/organization/`, { headers: getAuthHeaders() })
//       .then(r => r.json())
//       .then(data => {
//         const safeData = Array.isArray(data) ? data : []; 
//         setOrgData({
//           hqs: safeData.filter((n: any) => n.org_type === 'hq'),
//           bus: safeData.filter((n: any) => n.org_type === 'bu'),
//           depts: safeData.filter((n: any) => n.org_type === 'dept'),
//           sections: safeData.filter((n: any) => n.org_type === 'section'),
//         });
//       })
//       .catch(err => console.error("Hierarchy Load Error:", err));
//   }, []);

//   // 2. Logic to find IDs based on selected Names
//   const selectedHqId = useMemo(() => {
//     const found = orgData.hqs.find((h: any) => h.name === filters.hq);
//     return found ? (found as any).id : null;
//   }, [filters.hq, orgData.hqs]);

//   const selectedBuId = useMemo(() => {
//     const found = orgData.bus.find((b: any) => b.name === filters.bu);
//     return found ? (found as any).id : null;
//   }, [filters.bu, orgData.bus]);

//   const selectedDeptId = useMemo(() => {
//     const found = orgData.depts.find((d: any) => d.name === filters.dept);
//     return found ? (found as any).id : null;
//   }, [filters.dept, orgData.depts]);


//   // 3. Drill-down Fetch Logic
//   const fetchMatrix = useCallback(async () => {
//     setLoading(true);
//     let level = 'hq';
//     if (filters.section) level = 'employee';
//     else if (filters.dept) level = 'section';
//     else if (filters.bu) level = 'department';
//     else if (filters.hq) level = 'bu';

//     let url = `${API_BASE}/matrix/?view_level=${level}`;
//     if (filters.hq) url += `&hq=${encodeURIComponent(filters.hq)}`;
//     if (filters.bu) url += `&bu=${encodeURIComponent(filters.bu)}`;
//     if (filters.dept) url += `&department=${encodeURIComponent(filters.dept)}`;
//     if (filters.section) url += `&section=${encodeURIComponent(filters.section)}`;

//     try {
//       const res = await fetch(url, { headers: getAuthHeaders() });
//       const data = await res.json();
//       setRows(Array.isArray(data.rows) ? data.rows : []);
//       setCompetencies(Array.isArray(data.competencies) ? data.competencies : []);
//     } catch (e) {
//       console.error("Matrix Fetch Error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => { fetchMatrix(); }, [fetchMatrix]);

//   return (
//     <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
//       {/* FILTER BAR */}
//       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/30 flex flex-wrap gap-6 items-end">
        
//         {/* HQ Filter */}
//         <FilterSelect 
//             label="HQ" 
//             icon={<Building2 size={16}/>} 
//             value={filters.hq} 
//             options={orgData.hqs} 
//             onChange={(v: string) => setFilters({hq: v, bu: '', dept: '', section: ''})} 
//             color="indigo"
//         />
        
//         {/* BU Filter */}
//         <FilterSelect 
//             label="BU" 
//             icon={<Briefcase size={16}/>} 
//             value={filters.bu} 
//             options={orgData.bus.filter((b: any) => b.parent === selectedHqId)} 
//             onChange={(v: string) => setFilters({...filters, bu: v, dept: '', section: ''})} 
//             disabled={!filters.hq}
//             color="violet" 
//         />
        
//         {/* Dept Filter */}
//         <FilterSelect 
//             label="Dept" 
//             icon={<Layers size={16}/>} 
//             value={filters.dept} 
//             options={orgData.depts.filter((d: any) => d.parent === selectedBuId)} 
//             onChange={(v: string) => setFilters({...filters, dept: v, section: ''})} 
//             disabled={!filters.bu}
//             color="fuchsia" 
//         />
        
//         {/* Section Filter */}
//         <FilterSelect 
//             label="Section" 
//             icon={<MapPin size={16}/>} 
//             value={filters.section} 
//             options={orgData.sections.filter((s: any) => s.parent === selectedDeptId)} 
//             onChange={(v: string) => setFilters({...filters, section: v})} 
//             disabled={!filters.dept}
//             color="pink" 
//         />
        
//         <button 
//             onClick={() => setFilters({hq: '', bu: '', dept: '', section: ''})} 
//             className="px-6 py-4 text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:shadow-lg rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-900 flex items-center gap-2"
//         >
//             <RotateCcw size={16}/>
//             Clear All
//         </button>
//       </div>

//       {/* MATRIX TABLE */}
//       <div className="flex-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden relative">
//         {loading && (
//           <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//               <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 w-12 h-12 relative z-10" />
//             </div>
//             <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-4">Loading matrix data...</p>
//           </div>
//         )}
//         <div className="overflow-auto custom-scrollbar h-full">
//           <table className="w-full text-left border-collapse">
//             <thead className="sticky top-0 z-20 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-slate-800 dark:via-indigo-900/20 dark:to-violet-900/20 border-b-2 border-slate-200 dark:border-slate-700">
//               <tr>
//                 <th className="sticky left-0 bg-gradient-to-r from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-6 min-w-[320px] border-r-2 border-slate-200 dark:border-slate-700 font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
//                   <span className="flex items-center gap-2"><Users size={16} className="text-indigo-500"/>Hierarchy Details</span>
//                 </th>
//                 {competencies.map(comp => (
//                   <th key={comp.id} className="p-5 min-w-[150px] text-center border-r border-slate-100 dark:border-slate-700">
//                     <p className="text-sm font-black text-slate-700 dark:text-slate-200">{comp.name}</p>
//                     <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mt-1 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg inline-block">{comp.category}</p>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, idx) => (
//                 <tr key={row.id} className={`border-b-2 border-slate-50 dark:border-slate-800 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-violet-50/30 dark:hover:from-indigo-900/10 dark:hover:to-violet-900/10 transition-all duration-300 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/30 dark:bg-slate-800/30'}`}>
//                   <td className="sticky left-0 bg-white dark:bg-slate-900 p-5 border-r-2 border-slate-200 dark:border-slate-700">
//                     <div className="flex items-center gap-4">
//                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
//                         row.type === 'employee' 
//                           ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30' 
//                           : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-500 dark:text-slate-300 shadow-slate-200/50 dark:shadow-none'
//                       }`}>
//                         {row.type === 'employee' ? row.avatar : row.name[0]}
//                       </div>
//                       <div>
//                         <p className="font-black text-slate-800 dark:text-white text-lg">{row.name}</p>
//                         <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg mt-1 inline-block ${
//                           row.type === 'employee' 
//                             ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
//                             : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
//                         }`}>{row.type}</span>
//                       </div>
//                     </div>
//                   </td>
//                   {competencies.map(comp => {
//                     const cell = row.competencies[comp.id];
//                     return (
//                       <td key={comp.id} className="p-5 text-center border-r border-slate-50 dark:border-slate-800">
//                         {cell ? (
//                           <div className="inline-flex flex-col items-center">
//                             <div className="flex items-center gap-2">
//                                 <span className="text-3xl font-black text-slate-800 dark:text-white">
//                                     {row.type === 'employee' ? cell.actual_level : cell.avg}
//                                 </span>
//                                 {/* PROGRESS TRACKING */}
//                                 {row.type === 'employee' && cell.delta !== 0 && cell.delta !== undefined && (
//                                     <span className={`flex items-center text-xs font-black px-2 py-1 rounded-lg ${
//                                       cell.delta > 0 
//                                         ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
//                                         : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
//                                     }`}>
//                                         {cell.delta > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {Math.abs(cell.delta)}
//                                     </span>
//                                 )}
//                             </div>
//                             {/* GOAL INDICATOR */}
//                             {cell.target_level && (
//                                 <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1 mt-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">
//                                     <Target size={12}/> Goal: {cell.target_level}
//                                 </div>
//                             )}
//                           </div>
//                         ) : <span className="text-slate-300 dark:text-slate-700 text-xl">—</span>}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- REUSABLE DROPDOWN COMPONENT ---
// const FilterSelect = ({ label, icon, value, options, onChange, disabled, color = 'indigo' }: any) => {
//   const colorMap: any = {
//     indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 text-indigo-600 dark:text-indigo-300',
//     violet: 'from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/30 border-violet-200 dark:border-violet-800 focus:ring-violet-500 text-violet-600 dark:text-violet-300',
//     fuchsia: 'from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/30 dark:to-fuchsia-800/30 border-fuchsia-200 dark:border-fuchsia-800 focus:ring-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-300',
//     pink: 'from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-200 dark:border-pink-800 focus:ring-pink-500 text-pink-600 dark:text-pink-300',
//   };
  
//   return (
//     <div className={`space-y-2 flex-1 min-w-[180px] transition-all duration-300 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
//       <label className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ml-1 ${disabled ? 'text-slate-300 dark:text-slate-600' : colorMap[color].split(' ').pop()}`}>
//           {icon} {label}
//       </label>
//       <select 
//           value={value} 
//           onChange={e => onChange(e.target.value)} 
//           className={`w-full bg-gradient-to-r ${colorMap[color]} border-2 rounded-xl px-4 py-3 text-base font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 transition-all cursor-pointer appearance-none hover:shadow-lg dark:bg-slate-900`}
//       >
//         <option value="" className="dark:bg-slate-900">All {label}s</option>
//         {options.map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
//       </select>
//     </div>
//   );
// };

// // --- LIBRARY VIEW ---
// const CompetencyLibraryView = ({ onCreate }: { onCreate: () => void }) => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLibrary = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/skills/`, { headers: getAuthHeaders() });
//         if (res.ok) {
//             const skills = await res.json();
//             const grouped = skills.reduce((acc: any, skill: any) => {
//                 const catName = skill.category_name || 'Uncategorized';
//                 if (!acc[catName]) acc[catName] = { id: skill.category, name: catName, competencies: [] };
//                 acc[catName].competencies.push(skill);
//                 return acc;
//             }, {});
//             setCategories(Object.values(grouped));
//         }
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     };
//     fetchLibrary();
//   }, []);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-[2rem] border-2 border-dashed border-amber-200 dark:border-amber-800">
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//         <Loader2 className="animate-spin w-16 h-16 text-amber-500 relative z-10"/>
//       </div>
//       <p className="text-amber-600 dark:text-amber-400 font-bold text-xl mt-6">Loading library...</p>
//     </div>
//   );

//   return (
//     <div className="space-y-10 animate-in fade-in duration-700 pb-12">
//       {/* Header */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
//           <div className="flex items-start gap-5">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
//               <div className="relative p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-2xl shadow-amber-500/30">
//                 <BookOpen size={32} className="text-white" />
//               </div>
//             </div>
//             <div>
//               <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-500 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 tracking-tight">
//                 Competency Library
//               </h2>
//               <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Define and manage the organization's skill directory</p>
//               <div className="flex gap-2 mt-3">
//                 <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 rounded-full text-xs font-bold flex items-center gap-1"><BookOpen size={12}/>Skills</span>
//                 <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full text-xs font-bold flex items-center gap-1"><Layers size={12}/>Categories</span>
//               </div>
//             </div>
//           </div>
//           <button onClick={onCreate} className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-lg shadow-2xl shadow-orange-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95">
//             <Plus size={24} strokeWidth={3} /> Add Competency
//           </button>
//       </div>
      
//       {/* Categories */}
//       <div className="space-y-12 mt-10">
//           {categories.map((category: any, catIdx: number) => (
//               <div key={category.name} className="animate-in slide-in-from-left duration-500" style={{ animationDelay: `${catIdx * 100}ms` }}>
//                   <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-4">
//                     <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-lg">
//                       <Layers size={20} />
//                     </span> 
//                     {category.name}
//                     <span className="text-sm font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{category.competencies?.length || 0} skills</span>
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                       {category.competencies?.map((comp: any, idx: number) => (
//                           <div 
//                             key={comp.id} 
//                             className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-7 rounded-[1.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-black/30 hover:shadow-2xl hover:shadow-amber-500/20 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer transition-all duration-500 group flex flex-col h-full hover:-translate-y-2"
//                             style={{ animationDelay: `${idx * 50}ms` }}
//                           >
//                               <div className="flex items-start justify-between mb-4">
//                                 <h4 className="font-black text-slate-800 dark:text-slate-100 text-xl group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{comp.title}</h4>
//                                 <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <Sparkles size={16} className="text-amber-500"/>
//                                 </div>
//                               </div>
//                               <p className="text-slate-500 dark:text-slate-400 text-base line-clamp-2 mb-6 flex-1 font-medium">{comp.description}</p>
//                               <div className="pt-5 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
//                                   <span className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
//                                     <Award size={16} className="text-amber-500"/> Skill
//                                   </span>
//                                   <ChevronRight size={20} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"/>
//                               </div>
//                           </div>
//                       ))}
//                   </div>
//               </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// // --- LEVELS VIEW ---
// const LevelsView = () => {
//   const [levels, setLevels] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLevels = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/config/levels/`, { headers: getAuthHeaders() });
//         if (res.ok) setLevels(await res.json());
//       } catch (e) { console.error(e); } finally { setLoading(false); }
//     };
//     fetchLevels();
//   }, []);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 rounded-[2rem] border-2 border-dashed border-violet-200 dark:border-violet-800">
//       <div className="relative">
//         <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//         <Loader2 className="animate-spin w-16 h-16 text-violet-500 relative z-10"/>
//       </div>
//       <p className="text-violet-600 dark:text-violet-400 font-bold text-xl mt-6">Loading levels...</p>
//     </div>
//   );

//   const levelColors = [
//     { bg: 'from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-900', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-600 dark:text-slate-300', icon: 'from-slate-400 to-gray-500' },
//     { bg: 'from-sky-50 to-cyan-100 dark:from-sky-900/30 dark:to-cyan-900/30', border: 'border-sky-300 dark:border-sky-800', text: 'text-sky-600 dark:text-sky-400', icon: 'from-sky-400 to-cyan-500' },
//     { bg: 'from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30', border: 'border-emerald-300 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400', icon: 'from-emerald-400 to-green-500' },
//     { bg: 'from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30', border: 'border-violet-300 dark:border-violet-800', text: 'text-violet-600 dark:text-violet-400', icon: 'from-violet-400 to-purple-500' },
//     { bg: 'from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30', border: 'border-amber-300 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400', icon: 'from-amber-400 to-orange-500' },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-700">
//       <div className="text-center mb-20">
//         <div className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 px-6 py-3 rounded-full mb-6">
//           <Crown size={20} className="text-violet-600 dark:text-violet-400"/>
//           <span className="text-sm font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">Proficiency Framework</span>
//         </div>
//         <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 mb-6 tracking-tight">
//           Proficiency Scale
//         </h2>
//         <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
//           Standardized scale to measure competency mastery across the organization
//         </p>
//       </div>
      
//       <div className="grid gap-8 relative">
//         {/* Connecting Line */}
//         <div className="absolute left-12 top-12 bottom-12 w-1.5 bg-gradient-to-b from-slate-200 via-violet-200 to-amber-200 dark:from-slate-700 dark:via-violet-900 dark:to-amber-900 rounded-full -z-10"></div>
        
//         {levels.map((level, idx) => {
//             const colors = levelColors[idx % levelColors.length];
//             return (
//               <div 
//                 key={level.level} 
//                 className={`bg-gradient-to-r ${colors.bg} p-10 rounded-[2rem] border-2 ${colors.border} shadow-2xl flex items-center gap-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl animate-in slide-in-from-left`}
//                 style={{ animationDelay: `${idx * 100}ms` }}
//               >
//                   <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${colors.icon} flex items-center justify-center text-5xl font-black text-white shadow-2xl ring-4 ring-white dark:ring-slate-800`}>
//                     {level.level}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className={`text-2xl font-black mb-2 ${colors.text}`}>{level.title}</h3>
//                     <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">{level.description}</p>
//                   </div>
//                   <div className={`p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl ${colors.text}`}>
//                     <Star size={28} />
//                   </div>
//               </div>
//             );
//         })}
//       </div>
//     </div>
//   );
// };

// // --- CREATE COMPETENCY VIEW ---
// const CreateCompetencyView = ({ onBack, onSave }: { onBack: () => void, onSave: () => void }) => {
//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('Technical');
//   const [description, setDescription] = useState('');
//   const [questions, setQuestions] = useState([{ id: Date.now(), question_text: '', question_type: 'multiple_choice', points: 10 }]);
//   const [error, setError] = useState('');

//   const CATEGORIES = [{ id: 'Technical', name: 'Technical' }, { id: 'Behavioral', name: 'Behavioral (Soft Skills)' }, { id: 'Functional', name: 'Functional' }, { id: 'Core', name: 'Core' }];

//   const addQuestion = () => setQuestions([...questions, { id: Date.now(), question_text: '', question_type: 'multiple_choice', points: 10 }]);
//   const removeQuestion = (id: number) => { if (questions.length === 1) return; setQuestions(questions.filter(q => q.id !== id)); };
//   const updateQuestionText = (id: number, text: string) => setQuestions(questions.map(q => q.id === id ? { ...q, question_text: text } : q));

//   const handleSave = async () => {
//     if (!title.trim() || !description.trim()) { setError('Please fill in Title and Description.'); return; }
//     const validQuestions = questions.filter(q => q.question_text.trim() !== '');
//     if (validQuestions.length === 0) { setError('Please add at least one question.'); return; }

//     try {
//         const payload = { title, description, category_name: category, questions: validQuestions.map(q => ({ question_text: q.question_text, question_type: q.question_type, points: q.points })) };
//         const res = await fetch(`${API_BASE}/skills/`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
//         if (res.ok) onSave(); else { const errData = await res.json(); setError(errData.detail || 'Failed to save.'); }
//     } catch (e) { setError('Network error'); }
//   };

//   return (
//     <div className="w-full animate-in slide-in-from-right-8 fade-in duration-700 pb-24">
//       {/* Header */}
//       <div className="flex items-center gap-6 mb-12">
//         <button onClick={onBack} className="p-4 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 group">
//           <ArrowLeft size={28} className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
//         </button>
//         <div className="flex items-center gap-5">
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl blur-lg opacity-40"></div>
//             <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-2xl shadow-indigo-500/30">
//               <Plus size={32} className="text-white" />
//             </div>
//           </div>
//           <div>
//             <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 tracking-tight">
//               Create Competency
//             </h1>
//             <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Define skill details and assessment questions</p>
//           </div>
//         </div>
//       </div>
      
//       <div className="grid gap-10">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-center gap-4 text-base font-bold border-2 border-red-200 dark:border-red-800 shadow-xl shadow-red-500/10 animate-in shake duration-300">
//             <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl"><AlertCircle size={24} /></div>
//             {error}
//           </div>
//         )}
        
//         {/* Basic Details Card */}
//         <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
//           <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3 border-b-2 border-slate-100 dark:border-slate-800 pb-6">
//             <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl">
//               <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
//             </div>
//             Basic Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="space-y-3">
//               <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <Sparkles size={14} className="text-amber-500"/>
//                 Competency Title
//               </label>
//               <input 
//                 value={title} 
//                 onChange={(e) => setTitle(e.target.value)} 
//                 type="text" 
//                 placeholder="e.g. Advanced Python Programming" 
//                 className="w-full p-5 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none text-lg font-bold text-slate-800 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <Layers size={14} className="text-violet-500"/>
//                 Category
//               </label>
//               <select 
//                 value={category} 
//                 onChange={(e) => setCategory(e.target.value)} 
//                 className="w-full p-5 bg-gradient-to-r from-slate-50 to-violet-50/30 dark:from-slate-800 dark:to-violet-900/20 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-400 outline-none text-lg font-bold text-slate-800 dark:text-white cursor-pointer transition-all"
//               >
//                 {CATEGORIES.map(c => <option key={c.id} value={c.name} className="dark:bg-slate-900">{c.name}</option>)}
//               </select>
//             </div>
//             <div className="col-span-1 md:col-span-2 space-y-3">
//               <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <FileText size={14} className="text-fuchsia-500"/>
//                 Description
//               </label>
//               <textarea 
//                 value={description} 
//                 onChange={(e) => setDescription(e.target.value)} 
//                 rows={4} 
//                 placeholder="Describe the scope and objectives of this competency..." 
//                 className="w-full p-5 bg-gradient-to-r from-slate-50 to-fuchsia-50/30 dark:from-slate-800 dark:to-fuchsia-900/20 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-400 outline-none text-lg font-medium text-slate-800 dark:text-white resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
//               />
//             </div>
//           </div>
//         </div>
        
//         {/* Questions Card */}
//         <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
//           <div className="flex justify-between items-center mb-8 border-b-2 border-slate-100 dark:border-slate-800 pb-6">
//             <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
//                 <HelpCircle size={24} className="text-emerald-600 dark:text-emerald-400" />
//               </div>
//               Assessment Questions
//             </h3>
//             <button 
//               onClick={addQuestion} 
//               className="text-sm text-emerald-600 dark:text-emerald-400 font-black hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-6 py-3 rounded-xl transition-all border-2 border-emerald-200 dark:border-emerald-800 flex items-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:-translate-y-0.5"
//             >
//               <Plus size={18} strokeWidth={3} /> Add Question
//             </button>
//           </div>
//           <div className="space-y-5">
//             {questions.map((q, index) => (
//               <div key={q.id} className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-gradient-to-r from-slate-50/50 to-emerald-50/30 dark:from-slate-800/50 dark:to-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-xl transition-all duration-300 group relative">
//                 <div className="flex justify-between items-start gap-5">
//                   <span className="text-sm font-black text-emerald-400 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-xl flex items-center justify-center mt-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
//                     Q{index + 1}
//                   </span>
//                   <div className="flex-1 space-y-3">
//                     <input 
//                       type="text" 
//                       value={q.question_text} 
//                       onChange={(e) => updateQuestionText(q.id, e.target.value)} 
//                       placeholder="Enter your question here..." 
//                       className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none text-base font-bold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
//                     />
//                   </div>
//                   <button 
//                     onClick={() => removeQuestion(q.id)} 
//                     className="p-3 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border-2 border-transparent hover:border-red-200 dark:hover:border-red-900"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Action Buttons */}
//         <div className="flex justify-end gap-5 pb-12">
//           <button onClick={onBack} className="px-8 py-4 text-slate-600 dark:text-slate-400 font-black hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-lg border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700">
//             Cancel
//           </button>
//           <button onClick={handleSave} className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-500 dark:via-violet-500 dark:to-purple-500 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 dark:shadow-indigo-900/40 flex items-center gap-3 text-lg transform transition-all hover:scale-105 hover:-translate-y-1 active:scale-95">
//             <Save size={22} /> Save Competency
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


// // ==========================================
// // 4. NAVIGATION HUB COMPONENT
// // ==========================================

// const NavigationHub = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) => {
//     const navItems = [
//         { id: 'matrix', label: 'Matrix Dashboard', icon: <Users size={18} />, color: 'from-indigo-500 to-violet-500' },
//         { id: 'gap-analysis', label: 'Gap Analysis', icon: <TrendingDown size={18} />, color: 'from-rose-500 to-pink-500' },
//         // { id: 'financial', label: 'Financial Planner', icon: <DollarSign size={18} />, color: 'from-emerald-500 to-teal-500' },
//         // { id: 'assessment', label: 'Assessment Wizard', icon: <CheckCircle2 size={18} />, color: 'from-sky-500 to-cyan-500' },
//         { id: 'rule-setup', label: 'Target Rule Setup', icon: <Target size={18} />, color: 'from-orange-500 to-red-500' },
//         { id: 'library', label: 'Competency Library', icon: <BookOpen size={18} />, color: 'from-amber-500 to-orange-500' },
//         // { id: 'levels', label: 'Proficiency Scale', icon: <Sparkles size={18} />, color: 'from-violet-500 to-purple-500' },
//     ];

//     return (
//         <div className="w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b-2 border-slate-200 dark:border-slate-800 pt-10 pb-12 px-12 shadow-xl shadow-slate-200/20 dark:shadow-black/40 sticky top-0 z-50 transition-colors">
//             <div className="w-full">
//                 {/* Logo & Title */}
//                 <div className="flex items-center gap-5 mb-10">
//                     <div className="relative group">
//                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
//                       <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-2xl shadow-indigo-500/40 ring-4 ring-white dark:ring-slate-800">
//                         C
//                       </div>
//                     </div>
//                     <div>
//                         <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 leading-none">
//                           CompMatrix
//                         </h1>
//                         <p className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
//                           <Zap size={12} className="text-amber-500"/>
//                           Enterprise Dashboard
//                         </p>
//                     </div>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <div className="flex flex-wrap gap-4">
//                     {navItems.map((item) => {
//                         const isActive = activeTab === item.id || (item.id === 'library' && activeTab === 'create-competency');
//                         return (
//                             <button
//                                 key={item.id}
//                                 onClick={() => setActiveTab(item.id as any)}
//                                 className={`relative flex items-center gap-3 px-7 py-4 rounded-2xl text-sm font-black transition-all duration-300 border-2 ${
//                                     isActive
//                                     ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-2xl scale-105` 
//                                     : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5'
//                                 }`}
//                             >
//                                 {isActive && (
//                                   <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-lg opacity-40`}></div>
//                                 )}
//                                 <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
//                                     {item.icon}
//                                 </span>
//                                 <span className="relative z-10">{item.label}</span>
//                                 {isActive && (
//                                   <span className="relative z-10 w-2 h-2 bg-white rounded-full animate-pulse"></span>
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };


// // ==========================================
// // 5. MAIN APP CONTAINER
// // ==========================================

// export default function CompetencyManager() {
//   const [activeTab, setActiveTab] = useState<'library' | 'matrix' | 'levels' | 'financial' | 'create-competency' | 'gap-analysis' | 'rule-setup' | 'assessment'>('matrix');

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-200 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500">
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a5b4fc, #818cf8); }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         .animate-float { animation: float 3s ease-in-out infinite; }
//       `}</style>

//       {/* Background Decorations */}
//       <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-full blur-3xl opacity-30 animate-float"></div>
//         <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-20"></div>
//       </div>

//       {/* 1. TOP HUB NAVIGATION */}
//       <NavigationHub activeTab={activeTab} setActiveTab={setActiveTab} />

//       {/* 2. MAIN CONTENT AREA */}
//       <main className="w-full py-12 px-12 relative">
//         <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
//           {activeTab === 'library' && <CompetencyLibraryView onCreate={() => setActiveTab('create-competency')} />}
//           {activeTab === 'create-competency' && <CreateCompetencyView onBack={() => setActiveTab('library')} onSave={() => setActiveTab('library')} />}
//           {activeTab === 'matrix' && <CompetencyDashboard onNavigate={setActiveTab} />}
//           {/* {activeTab === 'financial' && <FinancialCompetencyPlanner />} */}
//           {activeTab === 'levels' && <LevelsView />}
//           {activeTab === 'gap-analysis' && <GapAnalysisView />}
//           {activeTab === 'rule-setup' && <RuleBasedCompetencySetup />}
//           {activeTab === 'assessment' && <CompetencySystem />}
//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, Users, BookOpen, Plus, MoreHorizontal, BarChart3, 
  Search, Filter, Info, ChevronDown, CheckCircle2, X, RotateCcw, Briefcase, 
  Building2, Layers, Shield, ChevronRight, Calendar, DollarSign, TrendingUp, 
  ArrowLeft, Trash2, FileText, HelpCircle, Save, AlertCircle, TrendingDown, AlertTriangle,
  Target, MapPin, CheckSquare, Square, CheckCircle, Home, Folder, ChevronLeft, CalendarDays,
  Sparkles, Grip, GraduationCap, Loader2, Zap, Star, Award, Crown, Gem, Flame, Heart, 
  Diamond, Hexagon, Circle, Triangle, Pentagon
} from 'lucide-react';

// Import Rule Setup Component
import RuleBasedCompetencySetup from './Competencymatrixsetup';
// Import Assessment System Component
import CompetencySystem from './CompetencySystem'; 

// ==========================================
// 1. CONFIG & UTILS
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

// Color utility functions
const getScoreColor = (score: number) => {
  if (score >= 4.5) return { bg: 'from-emerald-400 to-green-500', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-400/30' };
  if (score >= 4) return { bg: 'from-teal-400 to-cyan-500', text: 'text-teal-600 dark:text-teal-400', ring: 'ring-teal-400/30' };
  if (score >= 3) return { bg: 'from-sky-400 to-blue-500', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-400/30' };
  if (score >= 2) return { bg: 'from-amber-400 to-orange-500', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-400/30' };
  return { bg: 'from-rose-400 to-red-500', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-400/30' };
};

const getCategoryColor = (category: string, index: number) => {
  const colors = [
    { bg: 'bg-gradient-to-r from-violet-500 to-purple-600', light: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
    { bg: 'bg-gradient-to-r from-pink-500 to-rose-600', light: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
    { bg: 'bg-gradient-to-r from-cyan-500 to-teal-600', light: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
    { bg: 'bg-gradient-to-r from-amber-500 to-orange-600', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    { bg: 'bg-gradient-to-r from-emerald-500 to-green-600', light: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    { bg: 'bg-gradient-to-r from-blue-500 to-indigo-600', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-gradient-to-r from-fuchsia-500 to-pink-600', light: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', text: 'text-fuchsia-600 dark:text-fuchsia-400', border: 'border-fuchsia-200 dark:border-fuchsia-800' },
    { bg: 'bg-gradient-to-r from-red-500 to-rose-600', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  ];
  return colors[index % colors.length];
};

const getAvatarGradient = (index: number) => {
  const gradients = [
    'from-violet-400 via-purple-500 to-fuchsia-500',
    'from-cyan-400 via-teal-500 to-emerald-500',
    'from-rose-400 via-pink-500 to-red-500',
    'from-amber-400 via-orange-500 to-red-500',
    'from-blue-400 via-indigo-500 to-purple-500',
    'from-emerald-400 via-green-500 to-teal-500',
    'from-pink-400 via-rose-500 to-red-500',
    'from-sky-400 via-blue-500 to-indigo-500',
    'from-lime-400 via-green-500 to-emerald-500',
    'from-fuchsia-400 via-purple-500 to-violet-500',
  ];
  return gradients[index % gradients.length];
};

const getRowTypeStyle = (type: string) => {
  const styles: any = {
    'hq': { 
      bg: 'bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/15 dark:to-fuchsia-900/10',
      icon: 'from-violet-500 to-purple-600',
      badge: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800',
      shadow: 'shadow-violet-200/50 dark:shadow-violet-900/30'
    },
    'bu': { 
      bg: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-violet-900/10',
      icon: 'from-blue-500 to-indigo-600',
      badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      shadow: 'shadow-blue-200/50 dark:shadow-blue-900/30'
    },
    'department': { 
      bg: 'bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 dark:from-cyan-900/20 dark:via-teal-900/15 dark:to-emerald-900/10',
      icon: 'from-cyan-500 to-teal-600',
      badge: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
      shadow: 'shadow-cyan-200/50 dark:shadow-cyan-900/30'
    },
    'section': { 
      bg: 'bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-yellow-900/10',
      icon: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      shadow: 'shadow-amber-200/50 dark:shadow-amber-900/30'
    },
    'employee': { 
      bg: 'bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-900/20 dark:via-pink-900/15 dark:to-fuchsia-900/10',
      icon: 'from-rose-500 to-pink-600',
      badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      shadow: 'shadow-rose-200/50 dark:shadow-rose-900/30'
    },
  };
  return styles[type] || styles['employee'];
};

// ==========================================
// 2. TYPES
// ==========================================

type ViewMode = 'Financial Year' | 'Calendar Year' | 'Half Yearly' | 'Quarterly' | 'Monthly Calendar';

interface GapDataResponse {
  employee: any;
  competency_gaps: any[];
  stats: { total: number; on_track: number; gaps: number };
}

// ==========================================
// 3. SUB-VIEWS
// ==========================================

// --- GAP ANALYSIS VIEW ---
const GapAnalysisView = () => {
  const [data, setData] = useState<GapDataResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/gap-analysis/?department=${filterDept}`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
          if (filterDept === 'all') {
             const depts = Array.from(new Set(json.map((d: any) => d.employee.department))).filter(Boolean) as string[];
             setDepartments(depts);
          }
        }
      } catch (err) {
        console.error("Gap Analysis Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterDept]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[600px] bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-orange-50/40 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-orange-950/10 rounded-[2.5rem] border border-rose-100/60 dark:border-rose-800/30 shadow-inner">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full blur-2xl opacity-25 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-rose-400 rounded-full blur-3xl opacity-15 animate-pulse delay-150"></div>
          <Loader2 className="animate-spin w-14 h-14 text-rose-400 dark:text-rose-300 relative z-10"/>
        </div>
        <p className="text-rose-500 dark:text-rose-300 font-semibold text-lg mt-6 tracking-wide">Analyzing skill gaps...</p>
        <p className="text-rose-300 dark:text-rose-500 text-sm mt-2">Please wait while we crunch the numbers</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
        <div className="flex items-start gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-400 to-red-400 rounded-2xl blur-xl opacity-35 group-hover:opacity-50 transition-all duration-500"></div>
            <div className="relative p-4 bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 rounded-2xl shadow-xl shadow-rose-400/25">
              <TrendingDown size={30} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-red-400 dark:from-rose-300 dark:via-pink-300 dark:to-red-300 tracking-tight">
              Skill Gap Analysis
            </h1>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-base font-medium">Compare Actual Assessment vs. Target Rules</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-500 dark:text-rose-300 rounded-full text-xs font-semibold border border-rose-100 dark:border-rose-800/30">AI Powered</span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-fuchsia-50 dark:from-pink-900/20 dark:to-fuchsia-900/20 text-pink-500 dark:text-pink-300 rounded-full text-xs font-semibold border border-pink-100 dark:border-pink-800/30">Real-time</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl px-6 py-4 rounded-2xl border border-rose-100/50 dark:border-rose-900/30 shadow-lg shadow-rose-100/30 dark:shadow-rose-900/10 hover:shadow-xl hover:shadow-rose-200/40 transition-all duration-500 hover:-translate-y-0.5">
          <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 block">Filter by Department</label>
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-rose-300"/>
            <select 
              value={filterDept} 
              onChange={(e) => setFilterDept(e.target.value)} 
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none bg-transparent cursor-pointer min-w-[180px] dark:bg-slate-900"
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>
      
      {data.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-rose-200/60 dark:border-rose-800/40 rounded-[2.5rem] bg-gradient-to-br from-rose-50/50 to-pink-50/30 dark:from-rose-900/10 dark:to-pink-900/5">
            <div className="p-5 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg shadow-rose-100/50 dark:shadow-none mb-4">
              <AlertCircle className="w-10 h-10 text-rose-300 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">No Gap Data Found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-md text-center mt-2">
                Ensure you have defined <span className="text-rose-500 dark:text-rose-400 font-semibold">Competency Rules</span> and conducted <span className="text-pink-500 dark:text-pink-400 font-semibold">Assessments</span>.
            </p>
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 pb-12">
            {data.map((item, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-100/80 dark:border-slate-800/60 overflow-hidden hover:border-rose-200/60 dark:hover:border-rose-800/40 hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-500 group">
                {/* Employee Header */}
                <div className="p-7 bg-gradient-to-r from-slate-50/80 via-rose-50/40 to-pink-50/30 dark:from-slate-800/80 dark:via-rose-900/15 dark:to-pink-900/10 border-b border-slate-100/60 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-xl blur opacity-35"></div>
                          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/50 dark:ring-slate-700/50">
                            {item.employee.avatar}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-700 dark:text-white text-xl">{item.employee.name}</h3>
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
                              <span className="px-2.5 py-0.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg text-xs">{item.employee.designation}</span>
                              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                              <span className="px-2.5 py-0.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs">{item.employee.department}</span>
                          </div>
                        </div>
                    </div>
                    <div className="flex gap-3 text-sm font-semibold">
                        <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/15 dark:to-teal-900/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-2 shadow-sm">
                            <CheckCircle size={16} className="text-emerald-400" /> 
                            <span className="text-lg font-bold">{item.stats.on_track}</span>
                            <span className="text-emerald-500 dark:text-emerald-400 text-xs">On Track</span>
                        </div>
                        {item.stats.gaps > 0 && (
                            <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/15 dark:to-pink-900/15 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40 flex items-center gap-2 shadow-sm">
                                <AlertTriangle size={16} className="text-rose-400" /> 
                                <span className="text-lg font-bold">{item.stats.gaps}</span>
                                <span className="text-rose-500 dark:text-rose-400 text-xs">Gaps Found</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Competency Cards */}
                <div className="p-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {item.competency_gaps.map((gap: any, gIdx: number) => (
                    <div key={gIdx} className={`rounded-2xl p-5 transition-all duration-500 group/card cursor-pointer ${
                      gap.is_gap 
                        ? 'bg-gradient-to-br from-rose-50/80 via-orange-50/50 to-amber-50/40 dark:from-rose-900/15 dark:via-orange-900/10 dark:to-amber-900/5 border border-rose-200/50 dark:border-rose-800/30 hover:shadow-xl hover:shadow-rose-100/40 hover:-translate-y-1.5' 
                        : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-cyan-50/40 dark:from-emerald-900/15 dark:via-teal-900/10 dark:to-cyan-900/5 border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-xl hover:shadow-emerald-100/40 hover:-translate-y-1.5'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="overflow-hidden flex-1">
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-base block truncate" title={gap.competency_name}>{gap.competency_name}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mt-1 block">{gap.category}</span>
                            </div>
                            {gap.is_gap ? (
                                <span className="text-xs font-bold bg-gradient-to-r from-rose-400 to-pink-400 text-white px-3 py-1.5 rounded-lg flex-shrink-0 flex items-center gap-1.5 shadow-md shadow-rose-400/25">
                                  <TrendingDown size={12} /> -{gap.gap}
                                </span>
                            ) : (
                                <span className="text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-3 py-1.5 rounded-lg flex-shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-400/25">
                                  <CheckCircle2 size={12} /> OK
                                </span>
                            )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative pt-5 pb-2">
                            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 absolute top-0 w-full font-mono font-semibold">
                              {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
                            </div>
                            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                                <div className="absolute top-0 left-0 h-full bg-slate-200/60 dark:bg-slate-700/60 z-10 rounded-full" style={{ width: `${(gap.target / 5) * 100}%` }}></div>
                                <div className={`absolute top-0 left-0 h-full rounded-full z-20 transition-all duration-700 ${
                                  gap.is_gap 
                                    ? 'bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 shadow-sm shadow-amber-400/40' 
                                    : 'bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 shadow-sm shadow-emerald-400/40'
                                }`} style={{ width: `${(gap.actual / 5) * 100}%` }}></div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm mt-4 pt-3 border-t border-slate-100/60 dark:border-slate-800/60">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-xs font-medium">Actual:</span>
                              <span className={`font-bold text-lg ${gap.is_gap ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`}>{gap.actual}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-xs font-medium">Target:</span>
                              <span className="font-bold text-lg text-cyan-500 dark:text-cyan-400">{gap.target}</span>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

// --- COMPETENCY DASHBOARD (MATRIX VIEW) - COLORFUL VERSION ---
const CompetencyDashboard = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Org Data State
  const [orgData, setOrgData] = useState({ hqs: [], bus: [], depts: [], sections: [] });
  
  // Filter State
  const [filters, setFilters] = useState({ hq: '', bu: '', dept: '', section: '' });

  // 1. Load Hierarchy Dropdowns
  useEffect(() => {
    fetch(`${API_BASE}/organization/`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        const safeData = Array.isArray(data) ? data : []; 
        setOrgData({
          hqs: safeData.filter((n: any) => n.org_type === 'hq'),
          bus: safeData.filter((n: any) => n.org_type === 'bu'),
          depts: safeData.filter((n: any) => n.org_type === 'dept'),
          sections: safeData.filter((n: any) => n.org_type === 'section'),
        });
      })
      .catch(err => console.error("Hierarchy Load Error:", err));
  }, []);

  // 2. Logic to find IDs based on selected Names
  const selectedHqId = useMemo(() => {
    const found = orgData.hqs.find((h: any) => h.name === filters.hq);
    return found ? (found as any).id : null;
  }, [filters.hq, orgData.hqs]);

  const selectedBuId = useMemo(() => {
    const found = orgData.bus.find((b: any) => b.name === filters.bu);
    return found ? (found as any).id : null;
  }, [filters.bu, orgData.bus]);

  const selectedDeptId = useMemo(() => {
    const found = orgData.depts.find((d: any) => d.name === filters.dept);
    return found ? (found as any).id : null;
  }, [filters.dept, orgData.depts]);


  // 3. Drill-down Fetch Logic
  const fetchMatrix = useCallback(async () => {
    setLoading(true);
    let level = 'hq';
    if (filters.section) level = 'employee';
    else if (filters.dept) level = 'section';
    else if (filters.bu) level = 'department';
    else if (filters.hq) level = 'bu';

    let url = `${API_BASE}/matrix/?view_level=${level}`;
    if (filters.hq) url += `&hq=${encodeURIComponent(filters.hq)}`;
    if (filters.bu) url += `&bu=${encodeURIComponent(filters.bu)}`;
    if (filters.dept) url += `&department=${encodeURIComponent(filters.dept)}`;
    if (filters.section) url += `&section=${encodeURIComponent(filters.section)}`;

    try {
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      setRows(Array.isArray(data.rows) ? data.rows : []);
      setCompetencies(Array.isArray(data.competencies) ? data.competencies : []);
    } catch (e) {
      console.error("Matrix Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchMatrix(); }, [fetchMatrix]);

  // Category to color mapping
  const categoryColorMap = useMemo(() => {
    const map: Record<string, any> = {};
    const categories = [...new Set(competencies.map(c => c.category))];
    categories.forEach((cat, idx) => {
      map[cat] = getCategoryColor(cat, idx);
    });
    return map;
  }, [competencies]);

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-start gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
            <div className="relative p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl shadow-xl shadow-purple-500/30">
              <Users size={30} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 tracking-tight">
              Competency Matrix
            </h1>
            <p className="text-slate-400 dark:text-slate-500 mt-2 text-base font-medium">Visualize skills across your organization</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/30 flex items-center gap-1"><Layers size={11}/>Multi-Level</span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold border border-purple-200/60 dark:border-purple-800/30 flex items-center gap-1"><Target size={11}/>Goal Tracking</span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-600 dark:text-pink-400 rounded-full text-xs font-semibold border border-pink-200/60 dark:border-pink-800/30 flex items-center gap-1"><TrendingUp size={11}/>Progress</span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 px-5 py-3 rounded-xl text-white shadow-lg shadow-violet-500/30">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Rows</p>
            <p className="text-2xl font-bold">{rows.length}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 px-5 py-3 rounded-xl text-white shadow-lg shadow-cyan-500/30">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Competencies</p>
            <p className="text-2xl font-bold">{competencies.length}</p>
          </div>
        </div>
      </div>

      {/* COLORFUL FILTER BAR */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-100/50 dark:shadow-black/30">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-lg">
            <Filter size={16} className="text-violet-600 dark:text-violet-400"/>
          </div>
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Hierarchy Filters</span>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200 dark:from-violet-800 dark:via-purple-800 dark:to-pink-800"></div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-end">
          {/* HQ Filter - Violet */}
          <div className={`space-y-2 flex-1 min-w-[180px] transition-all duration-300`}>
            <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1 text-violet-500 dark:text-violet-400">
              <Building2 size={12}/> Headquarters
            </label>
            <div className="relative">
              <select 
                value={filters.hq} 
                onChange={e => setFilters({hq: e.target.value, bu: '', dept: '', section: ''})} 
                className="w-full bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-violet-400/40 transition-all cursor-pointer appearance-none hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 dark:bg-slate-900"
              >
                <option value="" className="dark:bg-slate-900">All HQs</option>
                {orgData.hqs.map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-violet-400"/>
              </div>
            </div>
          </div>
          
          {/* BU Filter - Blue */}
          <div className={`space-y-2 flex-1 min-w-[180px] transition-all duration-300 ${!filters.hq ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1 text-blue-500 dark:text-blue-400">
              <Briefcase size={12}/> Business Unit
            </label>
            <div className="relative">
              <select 
                value={filters.bu} 
                onChange={e => setFilters({...filters, bu: e.target.value, dept: '', section: ''})} 
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all cursor-pointer appearance-none hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 dark:bg-slate-900"
              >
                <option value="" className="dark:bg-slate-900">All BUs</option>
                {orgData.bus.filter((b: any) => b.parent === selectedHqId).map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-blue-400"/>
              </div>
            </div>
          </div>
          
          {/* Dept Filter - Teal */}
          <div className={`space-y-2 flex-1 min-w-[180px] transition-all duration-300 ${!filters.bu ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1 text-teal-500 dark:text-teal-400">
              <Layers size={12}/> Department
            </label>
            <div className="relative">
              <select 
                value={filters.dept} 
                onChange={e => setFilters({...filters, dept: e.target.value, section: ''})} 
                className="w-full bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-2 border-teal-200 dark:border-teal-800/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-400/40 transition-all cursor-pointer appearance-none hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700 dark:bg-slate-900"
              >
                <option value="" className="dark:bg-slate-900">All Depts</option>
                {orgData.depts.filter((d: any) => d.parent === selectedBuId).map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-teal-400"/>
              </div>
            </div>
          </div>
          
          {/* Section Filter - Amber */}
          <div className={`space-y-2 flex-1 min-w-[180px] transition-all duration-300 ${!filters.dept ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1 text-amber-500 dark:text-amber-400">
              <MapPin size={12}/> Section
            </label>
            <div className="relative">
              <select 
                value={filters.section} 
                onChange={e => setFilters({...filters, section: e.target.value})} 
                className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-amber-400/40 transition-all cursor-pointer appearance-none hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 dark:bg-slate-900"
              >
                <option value="" className="dark:bg-slate-900">All Sections</option>
                {orgData.sections.filter((s: any) => s.parent === selectedDeptId).map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={16} className="text-amber-400"/>
              </div>
            </div>
          </div>
          
          {/* Clear Button - Rose */}
          <button 
              onClick={() => setFilters({hq: '', bu: '', dept: '', section: ''})} 
              className="px-5 py-3 text-sm font-semibold text-rose-500 dark:text-rose-400 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 border-2 border-rose-200 dark:border-rose-800/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
              <RotateCcw size={14}/>
              Clear
          </button>
        </div>
        
        {/* Active Filter Pills */}
        {(filters.hq || filters.bu || filters.dept || filters.section) && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-400 mr-2">Active:</span>
            {filters.hq && (
              <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-violet-200 dark:border-violet-800/50">
                <Building2 size={10}/> {filters.hq}
                <button onClick={() => setFilters({hq: '', bu: '', dept: '', section: ''})} className="hover:text-violet-800 dark:hover:text-violet-300"><X size={12}/></button>
              </span>
            )}
            {filters.bu && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800/50">
                <Briefcase size={10}/> {filters.bu}
                <button onClick={() => setFilters({...filters, bu: '', dept: '', section: ''})} className="hover:text-blue-800 dark:hover:text-blue-300"><X size={12}/></button>
              </span>
            )}
            {filters.dept && (
              <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-teal-200 dark:border-teal-800/50">
                <Layers size={10}/> {filters.dept}
                <button onClick={() => setFilters({...filters, dept: '', section: ''})} className="hover:text-teal-800 dark:hover:text-teal-300"><X size={12}/></button>
              </span>
            )}
            {filters.section && (
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50">
                <MapPin size={10}/> {filters.section}
                <button onClick={() => setFilters({...filters, section: ''})} className="hover:text-amber-800 dark:hover:text-amber-300"><X size={12}/></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* COLORFUL MATRIX TABLE */}
      <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-cyan-400 via-teal-500 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse delay-150"></div>
              <Loader2 className="animate-spin text-purple-500 dark:text-purple-400 w-12 h-12 relative z-10" />
            </div>
            <p className="text-purple-500 dark:text-purple-400 font-semibold mt-4 text-sm">Loading matrix data...</p>
            <div className="flex gap-1 mt-3">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}
        
        <div className="overflow-auto custom-scrollbar h-full">
          <table className="w-full text-left border-collapse">
            {/* COLORFUL HEADER */}
            <thead className="sticky top-0 z-20">
              <tr>
                {/* First Column Header - Gradient */}
                <th className="sticky left-0 z-30 p-5 min-w-[320px] border-r-2 border-b-2 border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-slate-100 via-violet-50 to-purple-50 dark:from-slate-800 dark:via-violet-900/30 dark:to-purple-900/20">
                  <span className="flex items-center gap-3 font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-lg shadow-violet-500/30">
                      <Users size={14} className="text-white"/>
                    </div>
                    Hierarchy Details
                  </span>
                </th>
                
                {/* Competency Headers - Each with unique color based on category */}
                {competencies.map((comp, idx) => {
                  const catColor = categoryColorMap[comp.category] || getCategoryColor(comp.category, idx);
                  return (
                    <th key={comp.id} className={`p-4 min-w-[160px] text-center border-r border-b-2 border-slate-100/80 dark:border-slate-800/60 ${catColor.light}`}>
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{comp.name}</p>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${catColor.text} ${catColor.light} border ${catColor.border}`}>
                          {comp.category}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            
            <tbody>
              {rows.map((row, idx) => {
                const typeStyle = getRowTypeStyle(row.type);
                const avatarGradient = getAvatarGradient(idx);
                
                return (
                  <tr 
                    key={row.id} 
                    className={`border-b border-slate-100/80 dark:border-slate-800/60 transition-all duration-300 hover:scale-[1.001] hover:shadow-lg ${typeStyle.bg}`}
                  >
                    {/* Row Header Cell - Colorful based on type */}
                    <td className={`sticky left-0 p-5 border-r-2 border-slate-200/60 dark:border-slate-700/60 ${typeStyle.bg} backdrop-blur-xl`}>
                      <div className="flex items-center gap-4">
                        {/* Avatar with gradient */}
                        <div className="relative group/avatar">
                          <div className={`absolute inset-0 bg-gradient-to-br ${avatarGradient} rounded-xl blur opacity-40 group-hover/avatar:opacity-60 transition-opacity`}></div>
                          <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-white shadow-lg ${typeStyle.shadow} ring-2 ring-white/50 dark:ring-slate-700/50`}>
                            {row.type === 'employee' ? row.avatar : row.name[0]}
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-bold text-slate-700 dark:text-white text-base">{row.name}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1 inline-block border ${typeStyle.badge}`}>
                            {row.type === 'hq' && <Building2 size={10} className="inline mr-1"/>}
                            {row.type === 'bu' && <Briefcase size={10} className="inline mr-1"/>}
                            {row.type === 'department' && <Layers size={10} className="inline mr-1"/>}
                            {row.type === 'section' && <MapPin size={10} className="inline mr-1"/>}
                            {row.type === 'employee' && <Users size={10} className="inline mr-1"/>}
                            {row.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Competency Score Cells - Color coded by score */}
                    {competencies.map((comp, compIdx) => {
                      const cell = row.competencies[comp.id];
                      const catColor = categoryColorMap[comp.category] || getCategoryColor(comp.category, compIdx);
                      
                      if (!cell) {
                        return (
                          <td key={comp.id} className="p-4 text-center border-r border-slate-50/80 dark:border-slate-800/40">
                            <span className="text-slate-200 dark:text-slate-700 text-lg">—</span>
                          </td>
                        );
                      }
                      
                      const score = row.type === 'employee' ? cell.actual_level : cell.avg;
                      const scoreColor = getScoreColor(score);
                      
                      return (
                        <td key={comp.id} className={`p-4 text-center border-r border-slate-50/80 dark:border-slate-800/40 hover:${catColor.light} transition-colors`}>
                          <div className="inline-flex flex-col items-center group/cell">
                            {/* Score Circle */}
                            <div className={`relative mb-2`}>
                              <div className={`absolute inset-0 bg-gradient-to-br ${scoreColor.bg} rounded-full blur-md opacity-30 group-hover/cell:opacity-50 transition-opacity`}></div>
                              <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${scoreColor.bg} flex items-center justify-center shadow-lg ring-2 ${scoreColor.ring} transition-transform group-hover/cell:scale-110`}>
                                <span className="text-lg font-bold text-white">{score}</span>
                              </div>
                            </div>
                            
                            {/* Progress Tracking */}
                            {row.type === 'employee' && cell.delta !== 0 && cell.delta !== undefined && (
                              <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                cell.delta > 0 
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                                  : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              }`}>
                                {cell.delta > 0 ? <TrendingUp size={10} className="mr-1"/> : <TrendingDown size={10} className="mr-1"/>} 
                                {cell.delta > 0 ? '+' : ''}{cell.delta}
                              </span>
                            )}
                            
                            {/* Goal Indicator */}
                            {cell.target_level && (
                              <div className={`text-[10px] font-semibold flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md ${catColor.light} ${catColor.text} border ${catColor.border}`}>
                                <Target size={10}/> {cell.target_level}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {/* Empty State */}
          {rows.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-20"></div>
                <div className="relative p-6 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl">
                  <Users className="w-12 h-12 text-violet-500 dark:text-violet-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">No Data Available</h3>
              <p className="text-slate-400 dark:text-slate-500 text-sm max-w-md text-center">
                Try adjusting the filters or add competency assessments to populate the matrix.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* LEGEND */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Score Legend */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score Legend:</span>
            <div className="flex gap-2">
              {[
                { score: '5', color: 'from-emerald-400 to-green-500', label: 'Expert' },
                { score: '4', color: 'from-teal-400 to-cyan-500', label: 'Advanced' },
                { score: '3', color: 'from-sky-400 to-blue-500', label: 'Intermediate' },
                { score: '2', color: 'from-amber-400 to-orange-500', label: 'Basic' },
                { score: '1', color: 'from-rose-400 to-red-500', label: 'Beginner' },
              ].map(item => (
                <div key={item.score} className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {item.score}
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Type Legend */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Types:</span>
            <div className="flex gap-2">
              {[
                { type: 'HQ', icon: Building2, color: 'text-violet-500 bg-violet-100 dark:bg-violet-900/30' },
                { type: 'BU', icon: Briefcase, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                { type: 'Dept', icon: Layers, color: 'text-teal-500 bg-teal-100 dark:bg-teal-900/30' },
                { type: 'Section', icon: MapPin, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
                { type: 'Employee', icon: Users, color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30' },
              ].map(item => (
                <div key={item.type} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${item.color}`}>
                  <item.icon size={12}/>
                  <span className="text-[10px] font-semibold">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- REUSABLE DROPDOWN COMPONENT ---
const FilterSelect = ({ label, icon, value, options, onChange, disabled, color = 'cyan' }: any) => {
  const colorMap: any = {
    cyan: 'from-cyan-50/80 to-cyan-100/60 dark:from-cyan-900/20 dark:to-cyan-800/15 border-cyan-200/60 dark:border-cyan-800/40 focus:ring-cyan-400/30 text-cyan-600 dark:text-cyan-400',
    blue: 'from-blue-50/80 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-800/15 border-blue-200/60 dark:border-blue-800/40 focus:ring-blue-400/30 text-blue-600 dark:text-blue-400',
    indigo: 'from-indigo-50/80 to-indigo-100/60 dark:from-indigo-900/20 dark:to-indigo-800/15 border-indigo-200/60 dark:border-indigo-800/40 focus:ring-indigo-400/30 text-indigo-600 dark:text-indigo-400',
    violet: 'from-violet-50/80 to-violet-100/60 dark:from-violet-900/20 dark:to-violet-800/15 border-violet-200/60 dark:border-violet-800/40 focus:ring-violet-400/30 text-violet-600 dark:text-violet-400',
    fuchsia: 'from-fuchsia-50/80 to-fuchsia-100/60 dark:from-fuchsia-900/20 dark:to-fuchsia-800/15 border-fuchsia-200/60 dark:border-fuchsia-800/40 focus:ring-fuchsia-400/30 text-fuchsia-600 dark:text-fuchsia-400',
    pink: 'from-pink-50/80 to-pink-100/60 dark:from-pink-900/20 dark:to-pink-800/15 border-pink-200/60 dark:border-pink-800/40 focus:ring-pink-400/30 text-pink-600 dark:text-pink-400',
  };
  
  return (
    <div className={`space-y-2 flex-1 min-w-[170px] transition-all duration-300 ${disabled ? 'opacity-30 pointer-events-none' : ''}`}>
      <label className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ml-1 ${disabled ? 'text-slate-300 dark:text-slate-600' : colorMap[color].split(' ').pop()}`}>
          {icon} {label}
      </label>
      <select 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          className={`w-full bg-gradient-to-r ${colorMap[color]} border rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 transition-all cursor-pointer appearance-none hover:shadow-md dark:bg-slate-900`}
      >
        <option value="" className="dark:bg-slate-900">All {label}s</option>
        {options.map((o: any) => <option key={o.id} value={o.name} className="dark:bg-slate-900">{o.name}</option>)}
      </select>
    </div>
  );
};

// --- LIBRARY VIEW ---
const CompetencyLibraryView = ({ onCreate }: { onCreate: () => void }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch(`${API_BASE}/skills/`, { headers: getAuthHeaders() });
        if (res.ok) {
            const skills = await res.json();
            const grouped = skills.reduce((acc: any, skill: any) => {
                const catName = skill.category_name || 'Uncategorized';
                if (!acc[catName]) acc[catName] = { id: skill.category, name: catName, competencies: [] };
                acc[catName].competencies.push(skill);
                return acc;
            }, {});
            setCategories(Object.values(grouped));
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchLibrary();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/40 dark:from-amber-900/20 dark:via-orange-900/15 dark:to-yellow-900/10 rounded-[2.5rem] border border-amber-100/60 dark:border-amber-800/30 shadow-inner">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full blur-2xl opacity-25 animate-pulse"></div>
        <Loader2 className="animate-spin w-14 h-14 text-amber-400 relative z-10"/>
      </div>
      <p className="text-amber-500 dark:text-amber-400 font-semibold text-lg mt-6">Loading library...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="flex items-start gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-orange-400 to-rose-400 rounded-2xl blur-xl opacity-35 group-hover:opacity-50 transition-all duration-500"></div>
              <div className="relative p-4 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-2xl shadow-xl shadow-amber-400/25">
                <BookOpen size={30} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 dark:from-amber-300 dark:via-orange-300 dark:to-rose-300 tracking-tight">
                Competency Library
              </h2>
              <p className="text-slate-400 dark:text-slate-500 mt-2 text-base font-medium">Define and manage the organization's skill directory</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-500 dark:text-amber-300 rounded-full text-xs font-semibold border border-amber-100 dark:border-amber-800/30 flex items-center gap-1"><BookOpen size={11}/>Skills</span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 text-orange-500 dark:text-orange-300 rounded-full text-xs font-semibold border border-orange-100 dark:border-orange-800/30 flex items-center gap-1"><Layers size={11}/>Categories</span>
              </div>
            </div>
          </div>
          <button onClick={onCreate} className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-500 hover:via-orange-600 hover:to-rose-600 text-white px-7 py-4 rounded-2xl flex items-center gap-3 font-bold text-base shadow-xl shadow-orange-400/25 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 active:scale-95">
            <Plus size={22} strokeWidth={2.5} /> Add Competency
          </button>
      </div>
      
      {/* Categories */}
      <div className="space-y-10 mt-8">
          {categories.map((category: any, catIdx: number) => (
              <div key={category.name} className="animate-in slide-in-from-left duration-500" style={{ animationDelay: `${catIdx * 100}ms` }}>
                  <h3 className="text-xl font-bold text-slate-600 dark:text-white mb-5 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100/80 to-orange-100/60 dark:from-amber-900/20 dark:to-orange-900/15 border border-amber-200/60 dark:border-amber-800/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-md">
                      <Layers size={18} />
                    </span> 
                    {category.name}
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full">{category.competencies?.length || 0} skills</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {category.competencies?.map((comp: any, idx: number) => (
                          <div 
                            key={comp.id} 
                            className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-100/40 dark:shadow-black/20 hover:shadow-xl hover:shadow-amber-100/40 hover:border-amber-200/60 dark:hover:border-amber-700/40 cursor-pointer transition-all duration-500 group flex flex-col h-full hover:-translate-y-1"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{comp.title}</h4>
                                <div className="p-1.5 bg-amber-50/80 dark:bg-amber-900/15 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Sparkles size={14} className="text-amber-400"/>
                                </div>
                              </div>
                              <p className="text-slate-400 dark:text-slate-500 text-sm line-clamp-2 mb-5 flex-1 font-medium">{comp.description}</p>
                              <div className="pt-4 border-t border-slate-100/60 dark:border-slate-800/60 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-900/15 px-3 py-1.5 rounded-lg">
                                    <Award size={14} className="text-amber-400"/> Skill
                                  </span>
                                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"/>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

// --- LEVELS VIEW ---
const LevelsView = () => {
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${API_BASE}/config/levels/`, { headers: getAuthHeaders() });
        if (res.ok) setLevels(await res.json());
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchLevels();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-gradient-to-br from-violet-50/80 via-purple-50/60 to-fuchsia-50/40 dark:from-violet-900/20 dark:via-purple-900/15 dark:to-fuchsia-900/10 rounded-[2.5rem] border border-violet-100/60 dark:border-violet-800/30 shadow-inner">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-300 to-purple-400 rounded-full blur-2xl opacity-25 animate-pulse"></div>
        <Loader2 className="animate-spin w-14 h-14 text-violet-400 relative z-10"/>
      </div>
      <p className="text-violet-500 dark:text-violet-400 font-semibold text-lg mt-6">Loading levels...</p>
    </div>
  );

  const levelColors = [
    { bg: 'from-slate-50/90 to-gray-100/80 dark:from-slate-800/80 dark:to-gray-900/60', border: 'border-slate-200/60 dark:border-slate-700/50', text: 'text-slate-500 dark:text-slate-400', icon: 'from-slate-300 to-gray-400' },
    { bg: 'from-sky-50/90 to-cyan-100/80 dark:from-sky-900/20 dark:to-cyan-900/15', border: 'border-sky-200/60 dark:border-sky-800/40', text: 'text-sky-500 dark:text-sky-400', icon: 'from-sky-300 to-cyan-400' },
    { bg: 'from-emerald-50/90 to-teal-100/80 dark:from-emerald-900/20 dark:to-teal-900/15', border: 'border-emerald-200/60 dark:border-emerald-800/40', text: 'text-emerald-500 dark:text-emerald-400', icon: 'from-emerald-300 to-teal-400' },
    { bg: 'from-violet-50/90 to-purple-100/80 dark:from-violet-900/20 dark:to-purple-900/15', border: 'border-violet-200/60 dark:border-violet-800/40', text: 'text-violet-500 dark:text-violet-400', icon: 'from-violet-300 to-purple-400' },
    { bg: 'from-amber-50/90 to-orange-100/80 dark:from-amber-900/20 dark:to-orange-900/15', border: 'border-amber-200/60 dark:border-amber-800/40', text: 'text-amber-500 dark:text-amber-400', icon: 'from-amber-300 to-orange-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-100/80 to-purple-100/60 dark:from-violet-900/20 dark:to-purple-900/15 px-5 py-2.5 rounded-full mb-5 border border-violet-200/60 dark:border-violet-800/30">
          <Crown size={18} className="text-violet-500 dark:text-violet-400"/>
          <span className="text-xs font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest">Proficiency Framework</span>
        </div>
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-300 dark:via-purple-300 dark:to-fuchsia-300 mb-5 tracking-tight">
          Proficiency Scale
        </h2>
        <p className="text-lg text-slate-400 dark:text-slate-500 max-w-xl mx-auto font-medium">
          Standardized scale to measure competency mastery across the organization
        </p>
      </div>
      
      <div className="grid gap-6 relative">
        {/* Connecting Line */}
        <div className="absolute left-10 top-10 bottom-10 w-1 bg-gradient-to-b from-slate-200/80 via-violet-200/60 to-amber-200/50 dark:from-slate-700/60 dark:via-violet-900/40 dark:to-amber-900/30 rounded-full -z-10"></div>
        
        {levels.map((level, idx) => {
            const colors = levelColors[idx % levelColors.length];
            return (
              <div 
                key={level.level} 
                className={`bg-gradient-to-r ${colors.bg} p-8 rounded-2xl border ${colors.border} shadow-lg flex items-center gap-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-in slide-in-from-left`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center text-4xl font-bold text-white shadow-lg ring-2 ring-white/40 dark:ring-slate-800/40`}>
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-1.5 ${colors.text}`}>{level.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-base">{level.description}</p>
                  </div>
                  <div className={`p-3 bg-white/60 dark:bg-slate-800/40 rounded-xl ${colors.text}`}>
                    <Star size={24} />
                  </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

// --- CREATE COMPETENCY VIEW ---
const CreateCompetencyView = ({ onBack, onSave }: { onBack: () => void, onSave: () => void }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ id: Date.now(), question_text: '', question_type: 'multiple_choice', points: 10 }]);
  const [error, setError] = useState('');

  const CATEGORIES = [{ id: 'Technical', name: 'Technical' }, { id: 'Behavioral', name: 'Behavioral (Soft Skills)' }, { id: 'Functional', name: 'Functional' }, { id: 'Core', name: 'Core' }];

  const addQuestion = () => setQuestions([...questions, { id: Date.now(), question_text: '', question_type: 'multiple_choice', points: 10 }]);
  const removeQuestion = (id: number) => { if (questions.length === 1) return; setQuestions(questions.filter(q => q.id !== id)); };
  const updateQuestionText = (id: number, text: string) => setQuestions(questions.map(q => q.id === id ? { ...q, question_text: text } : q));

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) { setError('Please fill in Title and Description.'); return; }
    const validQuestions = questions.filter(q => q.question_text.trim() !== '');
    if (validQuestions.length === 0) { setError('Please add at least one question.'); return; }

    try {
        const payload = { title, description, category_name: category, questions: validQuestions.map(q => ({ question_text: q.question_text, question_type: q.question_type, points: q.points })) };
        const res = await fetch(`${API_BASE}/skills/`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
        if (res.ok) onSave(); else { const errData = await res.json(); setError(errData.detail || 'Failed to save.'); }
    } catch (e) { setError('Network error'); }
  };

  return (
    <div className="w-full animate-in slide-in-from-right-8 fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <button onClick={onBack} className="p-3.5 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg rounded-xl transition-all duration-300 border border-transparent hover:border-cyan-200/60 dark:hover:border-cyan-800/40 group">
          <ArrowLeft size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400" />
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-35"></div>
            <div className="relative p-4 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 rounded-2xl shadow-xl shadow-cyan-400/25">
              <Plus size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-300 dark:via-blue-300 dark:to-indigo-300 tracking-tight">
              Create Competency
            </h1>
            <p className="text-slate-400 dark:text-slate-500 mt-1.5 text-base font-medium">Define skill details and assessment questions</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-8">
        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50/90 to-rose-50/80 dark:from-red-900/20 dark:to-rose-900/15 text-red-500 dark:text-red-400 p-5 rounded-xl flex items-center gap-3 text-sm font-semibold border border-red-200/60 dark:border-red-800/40 shadow-lg shadow-red-100/30 animate-in shake duration-300">
            <div className="p-2.5 bg-red-100/80 dark:bg-red-900/30 rounded-lg"><AlertCircle size={20} /></div>
            {error}
          </div>
        )}
        
        {/* Basic Details Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-100/40 dark:shadow-black/20">
          <h3 className="text-lg font-bold text-slate-600 dark:text-white mb-6 flex items-center gap-3 border-b border-slate-100/60 dark:border-slate-800/60 pb-5">
            <div className="p-2.5 bg-gradient-to-br from-cyan-100/80 to-blue-100/60 dark:from-cyan-900/20 dark:to-blue-900/15 rounded-lg">
              <FileText size={20} className="text-cyan-500 dark:text-cyan-400" />
            </div>
            Basic Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400"/>
                Competency Title
              </label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                type="text" 
                placeholder="e.g. Advanced Python Programming" 
                className="w-full p-4 bg-gradient-to-r from-slate-50/80 to-cyan-50/40 dark:from-slate-800/80 dark:to-cyan-900/15 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300 outline-none text-base font-semibold text-slate-700 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={12} className="text-violet-400"/>
                Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full p-4 bg-gradient-to-r from-slate-50/80 to-violet-50/40 dark:from-slate-800/80 dark:to-violet-900/15 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-violet-400/30 focus:border-violet-300 outline-none text-base font-semibold text-slate-700 dark:text-white cursor-pointer transition-all"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.name} className="dark:bg-slate-900">{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <FileText size={12} className="text-fuchsia-400"/>
                Description
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={4} 
                placeholder="Describe the scope and objectives of this competency..." 
                className="w-full p-4 bg-gradient-to-r from-slate-50/80 to-fuchsia-50/40 dark:from-slate-800/80 dark:to-fuchsia-900/15 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-fuchsia-400/30 focus:border-fuchsia-300 outline-none text-base font-medium text-slate-700 dark:text-white resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
              />
            </div>
          </div>
        </div>
        
        {/* Questions Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-100/40 dark:shadow-black/20">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100/60 dark:border-slate-800/60 pb-5">
            <h3 className="text-lg font-bold text-slate-600 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-100/80 to-emerald-100/60 dark:from-teal-900/20 dark:to-emerald-900/15 rounded-lg">
                <HelpCircle size={20} className="text-teal-500 dark:text-teal-400" />
              </div>
              Assessment Questions
            </h3>
            <button 
              onClick={addQuestion} 
              className="text-sm text-teal-500 dark:text-teal-400 font-semibold hover:bg-teal-50/80 dark:hover:bg-teal-900/15 px-5 py-2.5 rounded-lg transition-all border border-teal-200/60 dark:border-teal-800/40 flex items-center gap-2 shadow-md shadow-teal-100/30 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={16} strokeWidth={2.5} /> Add Question
            </button>
          </div>
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="p-5 border border-slate-200/60 dark:border-slate-700/60 rounded-xl bg-gradient-to-r from-slate-50/60 to-teal-50/30 dark:from-slate-800/60 dark:to-teal-900/10 hover:border-teal-200/60 dark:hover:border-teal-700/40 hover:shadow-lg transition-all duration-300 group relative">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-bold text-teal-400 dark:text-teal-500 bg-teal-100/80 dark:bg-teal-900/20 w-9 h-9 rounded-lg flex items-center justify-center mt-1.5 group-hover:bg-teal-400 group-hover:text-white transition-colors">
                    Q{index + 1}
                  </span>
                  <div className="flex-1 space-y-2.5">
                    <input 
                      type="text" 
                      value={q.question_text} 
                      onChange={(e) => updateQuestionText(q.id, e.target.value)} 
                      placeholder="Enter your question here..." 
                      className="w-full p-3.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-400/20 outline-none text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                    />
                  </div>
                  <button 
                    onClick={() => removeQuestion(q.id)} 
                    className="p-2.5 text-slate-300 dark:text-slate-600 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/15 rounded-lg transition-all border border-transparent hover:border-red-200/60 dark:hover:border-red-900/40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-10">
          <button onClick={onBack} className="px-6 py-3.5 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all text-base border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60">
            Cancel
          </button>
          <button onClick={handleSave} className="px-8 py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 dark:from-cyan-500 dark:via-blue-500 dark:to-indigo-500 hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-cyan-400/25 dark:shadow-cyan-900/30 flex items-center gap-2.5 text-base transform transition-all hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95">
            <Save size={18} /> Save Competency
          </button>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. NAVIGATION HUB COMPONENT
// ==========================================

const NavigationHub = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: any) => void }) => {
    const navItems = [
        { id: 'matrix', label: 'Matrix Dashboard', icon: <Users size={16} />, color: 'from-indigo-500 via-purple-500 to-pink-500', shadowColor: 'shadow-purple-500/30' },
        { id: 'gap-analysis', label: 'Gap Analysis', icon: <TrendingDown size={16} />, color: 'from-rose-400 to-pink-500', shadowColor: 'shadow-rose-400/30' },
        { id: 'rule-setup', label: 'Target Rule Setup', icon: <Target size={16} />, color: 'from-orange-400 to-red-500', shadowColor: 'shadow-orange-400/30' },
        { id: 'library', label: 'Competency Library', icon: <BookOpen size={16} />, color: 'from-amber-400 to-orange-500', shadowColor: 'shadow-amber-400/30' },
    ];

    return (
        <div className="w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/60 pt-8 pb-10 px-10 shadow-lg shadow-slate-100/30 dark:shadow-black/30 sticky top-0 z-50 transition-colors">
            <div className="w-full">
                {/* Logo & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shadow-purple-500/30 ring-2 ring-white/30 dark:ring-slate-800/30">
                        C
                      </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 leading-none">
                          CompMatrix
                        </h1>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.25em] mt-1.5 flex items-center gap-1.5">
                          <Zap size={10} className="text-amber-400"/>
                          Enterprise Dashboard
                        </p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-wrap gap-3">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id || (item.id === 'library' && activeTab === 'create-competency');
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                                    isActive
                                    ? `bg-gradient-to-r ${item.color} text-white border-transparent shadow-lg ${item.shadowColor} scale-[1.02]` 
                                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300/80 dark:hover:border-slate-600/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 hover:shadow-md hover:-translate-y-0.5'
                                }`}
                            >
                                {isActive && (
                                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl blur-md opacity-30`}></div>
                                )}
                                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10">{item.label}</span>
                                {isActive && (
                                  <span className="relative z-10 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// ==========================================
// 5. MAIN APP CONTAINER
// ==========================================

export default function CompetencyManager() {
  const [activeTab, setActiveTab] = useState<'library' | 'matrix' | 'levels' | 'financial' | 'create-competency' | 'gap-analysis' | 'rule-setup' | 'assessment'>('matrix');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-indigo-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/10 font-sans text-slate-900 dark:text-slate-100 selection:bg-purple-200/60 dark:selection:bg-purple-900/60 selection:text-purple-900 dark:selection:text-purple-100 transition-colors duration-500">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c4b5fd, #a78bfa); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a78bfa, #8b5cf6); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #4c1d95, #5b21b6); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #5b21b6, #6d28d9); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-r from-violet-200/40 to-purple-200/30 dark:from-violet-900/15 dark:to-purple-900/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-rose-200/40 to-pink-200/30 dark:from-rose-900/15 dark:to-pink-900/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200/30 to-teal-200/20 dark:from-cyan-900/10 dark:to-teal-900/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-amber-200/35 to-orange-200/25 dark:from-amber-900/12 dark:to-orange-900/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-56 h-56 bg-gradient-to-r from-blue-200/35 to-indigo-200/25 dark:from-blue-900/12 dark:to-indigo-900/8 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* 1. TOP HUB NAVIGATION */}
      <NavigationHub activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. MAIN CONTENT AREA */}
      <main className="w-full py-10 px-10 relative">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeTab === 'library' && <CompetencyLibraryView onCreate={() => setActiveTab('create-competency')} />}
          {activeTab === 'create-competency' && <CreateCompetencyView onBack={() => setActiveTab('library')} onSave={() => setActiveTab('library')} />}
          {activeTab === 'matrix' && <CompetencyDashboard onNavigate={setActiveTab} />}
          {activeTab === 'levels' && <LevelsView />}
          {activeTab === 'gap-analysis' && <GapAnalysisView />}
          {activeTab === 'rule-setup' && <RuleBasedCompetencySetup />}
          {activeTab === 'assessment' && <CompetencySystem />}
        </div>
      </main>
    </div>
  );
}