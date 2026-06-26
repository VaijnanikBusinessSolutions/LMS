



// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Save, Plus, Trash2, Building, Layers, 
//   Briefcase, Search, CheckSquare, Square, 
//   AlertCircle, CheckCircle, Loader2, MapPin, 
//   Grid, BadgeCheck, X, Users, Sparkles, Target,
//   Zap, Award, Star, ChevronRight, Shield, Crown,
//   BookOpen, TrendingUp, Filter, RotateCcw, Info
// } from 'lucide-react';

// // ==========================================
// // 1. TYPES & INTERFACES
// // ==========================================

// interface DropdownOption {
//   id: number; 
//   name: string;
//   parent: number | null;
// }

// interface OrgNode {
//   id: number;
//   name: string;
//   org_type: 'hq' | 'bu' | 'dept' | 'section' | 'designation'; 
//   parent: number | null;
// }

// interface Group {
//   id: number;
//   name: string;
// }

// interface ProcessedData {
//   hqs: DropdownOption[];
//   bus: DropdownOption[];
//   departments: DropdownOption[];
//   sections: DropdownOption[];
//   designations: DropdownOption[];
// }

// interface LibrarySkill {
//   id: number;
//   name: string;
//   category: string; 
//   description: string;
// }

// interface AssignedSkill extends LibrarySkill {
//   targetLevel: number; 
// }

// interface ToastState {
//   show: boolean;
//   type: 'success' | 'error';
//   message: string;
// }

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
// // 2. REUSABLE COMPONENTS
// // ==========================================

// // Enhanced Select Component
// const EnhancedSelect = ({ 
//   label, 
//   icon: Icon, 
//   value, 
//   onChange, 
//   options, 
//   placeholder, 
//   color = 'indigo',
//   disabled = false 
// }: {
//   label: string;
//   icon: any;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   options: DropdownOption[];
//   placeholder: string;
//   color?: string;
//   disabled?: boolean;
// }) => {
//   const colorMap: Record<string, string> = {
//     indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 focus-within:ring-indigo-500 focus-within:border-indigo-400',
//     violet: 'from-violet-50 to-violet-100 border-violet-200 focus-within:ring-violet-500 focus-within:border-violet-400',
//     fuchsia: 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200 focus-within:ring-fuchsia-500 focus-within:border-fuchsia-400',
//     pink: 'from-pink-50 to-pink-100 border-pink-200 focus-within:ring-pink-500 focus-within:border-pink-400',
//     emerald: 'from-emerald-50 to-emerald-100 border-emerald-200 focus-within:ring-emerald-500 focus-within:border-emerald-400',
//     amber: 'from-amber-50 to-amber-100 border-amber-200 focus-within:ring-amber-500 focus-within:border-amber-400',
//   };

//   const iconColorMap: Record<string, string> = {
//     indigo: 'text-indigo-500',
//     violet: 'text-violet-500',
//     fuchsia: 'text-fuchsia-500',
//     pink: 'text-pink-500',
//     emerald: 'text-emerald-500',
//     amber: 'text-amber-500',
//   };

//   return (
//     <div className={`space-y-3 transition-all duration-300 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
//       <label className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${iconColorMap[color]}`}>
//         <Icon size={16} />
//         {label}
//       </label>
//       <div className={`relative bg-gradient-to-r ${colorMap[color]} rounded-2xl border-2 focus-within:ring-4 focus-within:ring-opacity-20 transition-all duration-300 hover:shadow-lg group`}>
//         <select 
//           value={value} 
//           onChange={onChange} 
//           className="w-full px-5 py-4 bg-transparent rounded-2xl text-base font-bold text-slate-700 outline-none cursor-pointer appearance-none"
//         >
//           <option value="">{placeholder}</option>
//           {options.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//         </select>
//         <ChevronRight size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 ${iconColorMap[color]} rotate-90 transition-transform group-hover:translate-y-[-40%]`} />
//       </div>
//     </div>
//   );
// };

// // Level Badge Component
// const LevelBadge = ({ level }: { level: number }) => {
//   const configs = [
//     { bg: 'from-slate-100 to-gray-200', text: 'text-slate-700', label: 'Novice', icon: Star },
//     { bg: 'from-sky-100 to-cyan-200', text: 'text-sky-700', label: 'Beginner', icon: TrendingUp },
//     { bg: 'from-indigo-100 to-violet-200', text: 'text-indigo-700', label: 'Competent', icon: Target },
//     { bg: 'from-purple-100 to-fuchsia-200', text: 'text-purple-700', label: 'Proficient', icon: Award },
//     { bg: 'from-amber-100 to-orange-200', text: 'text-amber-700', label: 'Expert', icon: Crown },
//   ];
//   const config = configs[level - 1] || configs[0];
//   const IconComponent = config.icon;
  
//   return (
//     <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.bg} ${config.text} font-bold text-sm shadow-sm`}>
//       <IconComponent size={16} />
//       <span>Level {level}</span>
//       <span className="opacity-60">•</span>
//       <span>{config.label}</span>
//     </div>
//   );
// };

// // ==========================================
// // 3. MAIN COMPONENT
// // ==========================================

// const RuleBasedCompetencySetup: React.FC = () => {

//   // -- State: Filters --
//   const [financialYear, setFinancialYear] = useState<string>('FY 2024-25');
  
//   // Hierarchy Selections
//   const [selectedHQ, setSelectedHQ] = useState<string>('');
//   const [selectedBU, setSelectedBU] = useState<string>('');
//   const [selectedDept, setSelectedDept] = useState<string>('');
//   const [selectedSection, setSelectedSection] = useState<string>('');
//   const [selectedDesignation, setSelectedDesignation] = useState<string>('');
//   const [selectedGroup, setSelectedGroup] = useState<string>('');

//   // -- State: Data --
//   const [orgData, setOrgData] = useState<ProcessedData>({
//       hqs: [], bus: [], departments: [], sections: [], designations: []
//   });
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [libraryData, setLibraryData] = useState<LibrarySkill[]>([]);
  
//   // -- State: Loading --
//   const [loadingHierarchy, setLoadingHierarchy] = useState<boolean>(true);
//   const [loadingLibrary, setLoadingLibrary] = useState<boolean>(false);
//   const [savingRule, setSavingRule] = useState<boolean>(false);
//   const [fetchingRule, setFetchingRule] = useState<boolean>(false); 

//   // -- State: Competencies --
//   const [assignedSkills, setAssignedSkills] = useState<AssignedSkill[]>([]);
  
//   // -- State: Modal --
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalSearch, setModalSearch] = useState('');
//   const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
//   const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' });
//   const [activeCategory, setActiveCategory] = useState<string>('all');

//   // ----------------------------------------------------------------
//   // 1. DATA FETCHING AND PROCESSING
//   // ----------------------------------------------------------------
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoadingHierarchy(true);
//       try {
//         const [orgRes, libRes, grpRes] = await Promise.all([
//             fetch(`${API_BASE}/organization/`, { headers: getAuthHeaders() }),
//             fetch(`${API_BASE}/library/for_rules/`, { headers: getAuthHeaders() }),
//             fetch(`${API_BASE}/groups/`, { headers: getAuthHeaders() })
//         ]);
        
//         if (orgRes.ok) {
//             const nodes: OrgNode[] = await orgRes.json();
//             processHierarchyData(nodes);
//         }
//         if (libRes.ok) setLibraryData(await libRes.json());
//         if (grpRes.ok) setGroups(await grpRes.json());

//       } catch (error) {
//         console.error("Failed to load data:", error);
//         showToast('error', "Failed to load data from server.");
//       } finally {
//         setLoadingHierarchy(false);
//         setLoadingLibrary(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const processHierarchyData = (nodes: OrgNode[]) => {
//     const data: ProcessedData = {
//         hqs: [], bus: [], departments: [], sections: [], designations: []
//     };

//     const toOption = (n: OrgNode) => ({ id: n.id, name: n.name, parent: n.parent });

//     nodes.forEach(node => {
//         switch(node.org_type) {
//             case 'hq': data.hqs.push(toOption(node)); break;
//             case 'bu': data.bus.push(toOption(node)); break;
//             case 'dept': data.departments.push(toOption(node)); break;
//             case 'section': data.sections.push(toOption(node)); break;
//             case 'designation': data.designations.push(toOption(node)); break;
//         }
//     });

//     setOrgData(data);
//   };

//   // ----------------------------------------------------------------
//   // 2. DYNAMIC DROPDOWN OPTIONS (CASCADING)
//   // ----------------------------------------------------------------

//   const filteredBUs = useMemo(() => {
//     if (!selectedHQ) return orgData.bus;
//     return orgData.bus.filter(bu => String(bu.parent) === selectedHQ);
//   }, [selectedHQ, orgData.bus]);

//   const filteredDepts = useMemo(() => {
//     if (!selectedBU) return orgData.departments;
//     return orgData.departments.filter(d => String(d.parent) === selectedBU);
//   }, [selectedBU, orgData.departments]);

//   const filteredSections = useMemo(() => {
//     if (!selectedDept) return orgData.sections;
//     return orgData.sections.filter(s => String(s.parent) === selectedDept);
//   }, [selectedDept, orgData.sections]);

//   const filteredDesignations = useMemo(() => orgData.designations, [orgData.designations]);

//   // Get unique categories from library
//   const categories = useMemo(() => {
//     const cats = Array.from(new Set(libraryData.map(s => s.category)));
//     return ['all', ...cats];
//   }, [libraryData]);

//   // ----------------------------------------------------------------
//   // 3. FETCH RULE SKILLS
//   // ----------------------------------------------------------------
//   useEffect(() => {
//     const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;

//     if (!hasSelection) {
//         setAssignedSkills([]);
//         return;
//     }

//     const fetchExistingRule = async () => {
//         setFetchingRule(true);
//         try {
//             const getName = (list: DropdownOption[], id: string) => list.find(x => String(x.id) === id)?.name || '';

//             const params = new URLSearchParams();
//             if (selectedHQ) params.append('hq', getName(orgData.hqs, selectedHQ));
//             if (selectedBU) params.append('business_unit', getName(orgData.bus, selectedBU));
//             if (selectedDept) params.append('department', getName(orgData.departments, selectedDept));
//             if (selectedSection) params.append('section', getName(orgData.sections, selectedSection));
//             if (selectedDesignation) params.append('designation', getName(orgData.designations, selectedDesignation));
//             if (selectedGroup) params.append('group', selectedGroup);

//             params.append('financial_year', financialYear);

//             const res = await fetch(`${API_BASE}/rules/fetch_rule/?${params.toString()}`, { 
//                 headers: getAuthHeaders() 
//             });
            
//             if (res.ok) {
//                 const data = await res.json();
//                 if (data.found) {
//                     setAssignedSkills(data.competencies);
//                 } else {
//                     setAssignedSkills([]); 
//                 }
//             }
//         } catch (e) {
//             console.error("Failed to fetch rule", e);
//         } finally {
//             setFetchingRule(false);
//         }
//     };

//     const timer = setTimeout(() => {
//         fetchExistingRule();
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, selectedGroup, financialYear]); 


//   // ----------------------------------------------------------------
//   // 4. HANDLERS
//   // ----------------------------------------------------------------

//   const handleHQChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newVal = e.target.value;
//     setSelectedHQ(newVal);
//     if (newVal === '') {
//         setSelectedBU(''); setSelectedDept(''); setSelectedSection('');
//     } else {
//         const currentBU = orgData.bus.find(b => String(b.id) === selectedBU);
//         if (currentBU && String(currentBU.parent) !== newVal) {
//              setSelectedBU(''); setSelectedDept(''); setSelectedSection('');
//         }
//     }
//   };

//   const handleBUChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newVal = e.target.value;
//     setSelectedBU(newVal);
//     if (newVal === '') {
//          setSelectedDept(''); setSelectedSection('');
//     } else {
//         const currentDept = orgData.departments.find(d => String(d.id) === selectedDept);
//         if (currentDept && String(currentDept.parent) !== newVal) {
//             setSelectedDept(''); setSelectedSection('');
//         }
//     }
//   };

//   const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newVal = e.target.value;
//     setSelectedDept(newVal);
//     if (newVal === '') {
//         setSelectedSection('');
//     } else {
//         const currentSec = orgData.sections.find(s => String(s.id) === selectedSection);
//         if (currentSec && String(currentSec.parent) !== newVal) {
//             setSelectedSection('');
//         }
//     }
//   };

//   const clearAllFilters = () => {
//     setSelectedHQ('');
//     setSelectedBU('');
//     setSelectedDept('');
//     setSelectedSection('');
//     setSelectedDesignation('');
//     setSelectedGroup('');
//     setAssignedSkills([]);
//   };

//   const openLibrary = () => {
//     setTempSelectedIds(assignedSkills.map(s => s.id));
//     setModalSearch('');
//     setActiveCategory('all');
//     setIsModalOpen(true);
//   };

//   const toggleModalItem = (id: number) => {
//     setTempSelectedIds(prev => 
//       prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//     );
//   };

//   const commitModalSelection = () => {
//     const newSkillList: AssignedSkill[] = [];
//     tempSelectedIds.forEach(id => {
//       const existing = assignedSkills.find(s => s.id === id);
//       if (existing) {
//         newSkillList.push(existing);
//       } else {
//         const libItem = libraryData.find(l => l.id === id);
//         if (libItem) {
//           newSkillList.push({ ...libItem, targetLevel: 3 }); 
//         }
//       }
//     });
//     setAssignedSkills(newSkillList);
//     setIsModalOpen(false);
//     showToast('success', `${newSkillList.length} competencies assigned successfully!`);
//   };

//   const changeLevel = (skillId: number, newLevel: number) => {
//     setAssignedSkills(prev => prev.map(s => 
//       s.id === skillId ? { ...s, targetLevel: newLevel } : s
//     ));
//   };

//   const removeSkill = (skillId: number) => {
//     setAssignedSkills(prev => prev.filter(s => s.id !== skillId));
//     showToast('success', 'Competency removed from rule.');
//   };

//   const saveConfiguration = async () => {
//     const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;

//     if (!hasSelection) {
//       showToast('error', 'Please select at least one organization level (e.g., HQ, Dept, or Group).');
//       return;
//     }
//     if (assignedSkills.length === 0) {
//       showToast('error', 'Please add at least one competency.');
//       return;
//     }

//     setSavingRule(true);

//     const getName = (list: DropdownOption[], id: string) => list.find(x => String(x.id) === id)?.name || null;

//     const payload = {
//       meta: { financialYear },
//       hierarchy: {
//         hq: getName(orgData.hqs, selectedHQ),
//         bu: getName(orgData.bus, selectedBU),
//         department: getName(orgData.departments, selectedDept),
//         section: getName(orgData.sections, selectedSection),
//         designation: getName(orgData.designations, selectedDesignation),
//         group: selectedGroup || null
//       },
//       competencies: assignedSkills.map(s => ({
//         skillId: s.id, 
//         name: s.name,
//         targetLevel: s.targetLevel
//       }))
//     };

//     try {
//         const response = await fetch(`${API_BASE}/rules/`, {
//             method: 'POST',
//             headers: getAuthHeaders(),
//             body: JSON.stringify(payload)
//         });

//         if (response.ok) {
//             showToast('success', 'Rule Saved Successfully! 🎉');
//         } else {
//             const err = await response.json();
//             showToast('error', err.error || 'Failed to save rule.');
//         }
//     } catch (e) {
//         showToast('error', 'Network error.');
//     } finally {
//         setSavingRule(false);
//     }
//   };

//   const showToast = (type: 'success' | 'error', message: string) => {
//     setToast({ show: true, type, message });
//     setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
//   };

//   const filteredLibrary = useMemo(() => {
//     return libraryData.filter(item => {
//       const matchesSearch = item.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
//         item.category.toLowerCase().includes(modalSearch.toLowerCase());
//       const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
//       return matchesSearch && matchesCategory;
//     });
//   }, [modalSearch, libraryData, activeCategory]);

//   const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;
//   const selectionCount = [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, selectedGroup].filter(Boolean).length;

//   // ----------------------------------------------------------------
//   // RENDER
//   // ----------------------------------------------------------------

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 font-sans text-slate-800 p-8 animate-in fade-in duration-700">
      
//       {/* Custom Styles */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a5b4fc, #818cf8); }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         @keyframes shimmer {
//           0% { background-position: -200% 0; }
//           100% { background-position: 200% 0; }
//         }
        
//         .animate-float { animation: float 3s ease-in-out infinite; }
//         .animate-shimmer { animation: shimmer 2s linear infinite; }
//       `}</style>

//       {/* Background Decorations */}
//       <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-200 to-rose-200 rounded-full blur-3xl opacity-30 animate-float"></div>
//         <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-20"></div>
//       </div>

//       {/* Toast Notification */}
//       {toast.show && (
//         <div className={`fixed top-8 right-8 z-[100] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 text-white animate-in slide-in-from-top-6 duration-500 ${
//           toast.type === 'error' 
//             ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30' 
//             : 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30'
//         }`}>
//           <div className="p-2 bg-white/20 rounded-xl">
//             {toast.type === 'error' ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
//           </div>
//           <div>
//             <p className="font-black text-lg">{toast.type === 'error' ? 'Error' : 'Success'}</p>
//             <p className="font-medium opacity-90">{toast.message}</p>
//           </div>
//           <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-4 p-2 hover:bg-white/20 rounded-xl transition">
//             <X size={20} />
//           </button>
//         </div>
//       )}

//       <div className="w-full space-y-10">
        
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
//           <div className="flex items-start gap-5">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
//               <div className="relative p-5 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl shadow-2xl shadow-orange-500/30">
//                 <Target size={36} className="text-white" />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 tracking-tight">
//                 Competency Rule Engine
//               </h1>
//               <p className="text-slate-500 mt-2 text-lg font-medium">Configure skill requirements by organizational hierarchy</p>
//               <div className="flex gap-2 mt-3">
//                 <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center gap-1.5">
//                   <Zap size={14}/>Smart Rules
//                 </span>
//                 <span className="px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-bold flex items-center gap-1.5">
//                   <Shield size={14}/>Auto-Cascade
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* Fiscal Year Selector */}
//           <div className="bg-white/80 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-xl shadow-slate-200/30 border-2 border-slate-200 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 min-w-[260px]">
//             <label className="text-xs uppercase font-black text-orange-500 tracking-widest mb-2 block flex items-center gap-2">
//               <Sparkles size={14}/>
//               Fiscal Year
//             </label>
//             <select 
//               value={financialYear}
//               onChange={(e) => setFinancialYear(e.target.value)}
//               className="bg-transparent font-black text-2xl text-slate-800 outline-none cursor-pointer w-full"
//             >
//               {['FY 2023-24', 'FY 2024-25', 'FY 2025-26'].map(y => <option key={y} value={y}>{y}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* HIERARCHY SELECTOR */}
//         <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/40 border-2 border-slate-200 p-10 relative overflow-hidden">
          
//           {/* Loading Animation */}
//           {loadingHierarchy && (
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-200 via-rose-300 to-pink-200 overflow-hidden">
//               <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
//             </div>
//           )}
          
//           {/* Header with Info */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b-2 border-slate-100 pb-8">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl">
//                 <Building className="text-indigo-600" size={28} />
//               </div>
//               <div>
//                 <h2 className="font-black text-2xl text-slate-800">Define Target Context</h2>
//                 <p className="text-slate-500 font-medium mt-1">Select hierarchy levels to apply competency rules</p>
//               </div>
//             </div>
            
//             {/* Selection Stats & Clear Button */}
//             <div className="flex items-center gap-4">
//               {selectionCount > 0 && (
//                 <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border-2 border-indigo-200">
//                   <span className="text-indigo-600 font-black text-lg">{selectionCount}</span>
//                   <span className="text-slate-500 font-medium ml-2">filter{selectionCount > 1 ? 's' : ''} active</span>
//                 </div>
//               )}
//               <button 
//                 onClick={clearAllFilters}
//                 disabled={!hasSelection}
//                 className="flex items-center gap-2 px-5 py-3 text-rose-500 hover:bg-rose-50 hover:shadow-lg rounded-xl transition-all duration-300 font-bold border-2 border-transparent hover:border-rose-200 disabled:opacity-30 disabled:pointer-events-none"
//               >
//                 <RotateCcw size={18}/>
//                 Clear All
//               </button>
//             </div>
//           </div>

//           {/* Dropdowns Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            
//             <EnhancedSelect 
//               label="Headquarters" 
//               icon={MapPin} 
//               value={selectedHQ} 
//               onChange={handleHQChange} 
//               options={orgData.hqs} 
//               placeholder="All Locations"
//               color="indigo"
//             />

//             <EnhancedSelect 
//               label="Business Unit" 
//               icon={Briefcase} 
//               value={selectedBU} 
//               onChange={handleBUChange} 
//               options={filteredBUs} 
//               placeholder="All Units"
//               color="violet"
//             />

//             <EnhancedSelect 
//               label="Department" 
//               icon={Layers} 
//               value={selectedDept} 
//               onChange={handleDeptChange} 
//               options={filteredDepts} 
//               placeholder="All Departments"
//               color="fuchsia"
//             />

//             <EnhancedSelect 
//               label="Section" 
//               icon={Grid} 
//               value={selectedSection} 
//               onChange={(e) => setSelectedSection(e.target.value)} 
//               options={filteredSections} 
//               placeholder="All Sections"
//               color="pink"
//             />

//             <EnhancedSelect 
//               label="Designation / Role" 
//               icon={BadgeCheck} 
//               value={selectedDesignation} 
//               onChange={(e) => setSelectedDesignation(e.target.value)} 
//               options={filteredDesignations} 
//               placeholder="All Designations"
//               color="emerald"
//             />

//             <EnhancedSelect 
//               label="Group / Team" 
//               icon={Users} 
//               value={selectedGroup} 
//               onChange={(e) => setSelectedGroup(e.target.value)} 
//               options={groups.map(g => ({ id: g.id, name: g.name, parent: null }))} 
//               placeholder="All Groups"
//               color="amber"
//             />

//           </div>

//           {/* Quick Info */}
//           {!hasSelection && (
//             <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 flex items-start gap-4">
//               <div className="p-3 bg-amber-100 rounded-xl">
//                 <Info className="text-amber-600" size={24} />
//               </div>
//               <div>
//                 <h4 className="font-bold text-amber-800 text-lg">How it works</h4>
//                 <p className="text-amber-700 mt-1 font-medium">
//                   Select one or more filters above to define the target context. Then add competencies and set required proficiency levels. 
//                   Rules cascade down the hierarchy automatically!
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* SKILL ASSIGNMENT AREA */}
//         <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/40 border-2 border-slate-200 flex flex-col min-h-[600px] relative overflow-hidden">
          
//           {/* Loading Overlay */}
//           {fetchingRule && (
//              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md flex items-center justify-center rounded-[2rem] animate-in fade-in">
//                  <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-2xl border-2 border-indigo-100">
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//                       <Loader2 className="w-14 h-14 text-indigo-600 animate-spin relative z-10" />
//                     </div>
//                     <span className="text-lg font-black text-indigo-800 mt-6">Fetching existing rules...</span>
//                     <span className="text-slate-500 mt-2">This won't take long</span>
//                  </div>
//              </div>
//           )}
          
//           {/* Header */}
//           <div className="px-10 py-8 border-b-2 border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-50/50 via-indigo-50/30 to-violet-50/30">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl">
//                 <BookOpen className="text-emerald-600" size={28} />
//               </div>
//               <div>
//                 <h3 className="font-black text-2xl text-slate-800">Competency Requirements</h3>
//                 <p className="text-slate-500 font-medium mt-1">
//                   {assignedSkills.length > 0 
//                     ? <><span className="text-emerald-600 font-bold">{assignedSkills.length}</span> skills assigned to this rule</>
//                     : 'No skills assigned yet'
//                   }
//                 </p>
//               </div>
//             </div>
//             <button 
//               onClick={openLibrary}
//               disabled={loadingLibrary || !hasSelection}
//               className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:-translate-y-1 transform active:scale-95 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:translate-y-0"
//             >
//               {loadingLibrary ? <Loader2 size={22} className="animate-spin"/> : <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />}
//               Add From Library
//             </button>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 overflow-x-auto custom-scrollbar">
//             {assignedSkills.length === 0 ? (
//               <div className="h-full flex flex-col items-center justify-center text-center p-12">
//                 <div className="relative mb-6">
//                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-full blur-2xl opacity-50"></div>
//                   <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 p-10 rounded-full">
//                     <Layers size={64} className="text-indigo-400" />
//                   </div>
//                 </div>
//                 <h4 className="text-slate-800 font-black text-2xl">No Competencies Defined</h4>
//                 <p className="max-w-lg mx-auto mt-4 text-lg text-slate-500 font-medium">
//                     {!hasSelection 
//                         ? "Select at least one organization filter above to start defining competency requirements."
//                         : "No rules found for this selection. Click 'Add From Library' to create one."
//                     }
//                 </p>
//                 {!hasSelection && (
//                   <div className="flex items-center gap-3 mt-6 px-6 py-3 bg-indigo-50 rounded-xl text-indigo-600 font-bold">
//                     <ChevronRight size={20} className="animate-pulse"/>
//                     <span>Start by selecting filters above</span>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-b-2 border-slate-100 text-xs font-black text-slate-500 uppercase tracking-widest">
//                     <th className="px-10 py-6 w-[35%]">Competency</th>
//                     <th className="px-6 py-6 w-[15%]">Category</th>
//                     <th className="px-6 py-6 w-[35%]">Required Proficiency Level</th>
//                     <th className="px-6 py-6 w-[15%] text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y-2 divide-slate-50">
//                   {assignedSkills.map((skill, idx) => (
//                     <tr 
//                       key={skill.id} 
//                       className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-violet-50/30 transition-all duration-300 group animate-in slide-in-from-left"
//                       style={{ animationDelay: `${idx * 50}ms` }}
//                     >
//                       <td className="px-10 py-6">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
//                             {skill.name.charAt(0)}
//                           </div>
//                           <div>
//                             <p className="font-bold text-slate-800 text-lg">{skill.name}</p>
//                             <p className="text-sm text-slate-400 mt-1 truncate max-w-xs font-medium">{skill.description}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-6">
//                         <span className="inline-flex px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-200">
//                           {skill.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-6">
//                         <div className="flex items-center gap-4">
//                           <div className="flex gap-2">
//                             {[1, 2, 3, 4, 5].map(level => (
//                               <button
//                                 key={level}
//                                 onClick={() => changeLevel(skill.id, level)}
//                                 className={`w-12 h-12 rounded-xl font-black text-lg transition-all duration-300 border-2 ${
//                                   skill.targetLevel === level
//                                     ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-500/40 scale-110'
//                                     : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300 hover:text-indigo-500'
//                                 }`}
//                               >
//                                 {level}
//                               </button>
//                             ))}
//                           </div>
//                           <LevelBadge level={skill.targetLevel} />
//                         </div>
//                       </td>
//                       <td className="px-6 py-6 text-right">
//                         <button 
//                           onClick={() => removeSkill(skill.id)}
//                           className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border-2 border-transparent hover:border-rose-200"
//                           title="Remove Skill"
//                         >
//                           <Trash2 size={22} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Footer / Save Button */}
//           <div className="p-8 border-t-2 border-slate-100 bg-gradient-to-r from-slate-50/50 to-emerald-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <div className="text-slate-500 font-medium">
//               {assignedSkills.length > 0 && (
//                 <span>Total competencies: <strong className="text-slate-800">{assignedSkills.length}</strong></span>
//               )}
//             </div>
//             <button 
//               onClick={saveConfiguration}
//               disabled={assignedSkills.length === 0 || savingRule}
//               className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all duration-300 ${
//                 assignedSkills.length === 0 || savingRule 
//                   ? 'bg-slate-300 cursor-not-allowed shadow-none' 
//                   : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-emerald-500/30 hover:shadow-2xl hover:-translate-y-1 transform active:scale-95'
//               }`}
//             >
//               {savingRule ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
//               {savingRule ? 'Saving Rule...' : 'Save Competency Rule'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
//           <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500">
            
//             {/* Modal Header */}
//             <div className="px-10 py-8 border-b-2 border-slate-100 flex justify-between items-center bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30">
//               <div className="flex items-center gap-5">
//                 <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl">
//                   <BookOpen className="text-emerald-600" size={28} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-black text-slate-800">Competency Library</h3>
//                   <p className="text-slate-500 font-medium mt-1">Select skills to add to this rule</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsModalOpen(false)} 
//                 className="p-3 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 rounded-2xl text-slate-500 transition-all duration-300"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             {/* Search & Filter */}
//             <div className="px-10 py-6 bg-slate-50/50 border-b-2 border-slate-100 space-y-4">
//               <div className="relative group">
//                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition" size={24} />
//                 <input 
//                   type="text" 
//                   placeholder="Search competencies by name or category..." 
//                   value={modalSearch} 
//                   onChange={(e) => setModalSearch(e.target.value)} 
//                   className="w-full pl-14 pr-6 py-5 border-2 border-slate-200 rounded-2xl outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition text-lg font-medium" 
//                   autoFocus 
//                 />
//               </div>
              
//               {/* Category Tabs */}
//               <div className="flex flex-wrap gap-2">
//                 {categories.map(cat => (
//                   <button
//                     key={cat}
//                     onClick={() => setActiveCategory(cat)}
//                     className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
//                       activeCategory === cat
//                         ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
//                         : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
//                     }`}
//                   >
//                     {cat === 'all' ? '🏷️ All Categories' : cat}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Items List */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white custom-scrollbar">
//               {filteredLibrary.length > 0 ? (
//                 filteredLibrary.map((item, idx) => { 
//                   const isSelected = tempSelectedIds.includes(item.id); 
//                   return (
//                     <div 
//                       key={item.id} 
//                       onClick={() => toggleModalItem(item.id)} 
//                       className={`flex items-start gap-5 p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 select-none animate-in slide-in-from-bottom ${
//                         isSelected 
//                           ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-lg shadow-emerald-500/10' 
//                           : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
//                       }`}
//                       style={{ animationDelay: `${idx * 30}ms` }}
//                     >
//                       <div className={`mt-1 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
//                         {isSelected 
//                           ? <CheckSquare size={28} className="text-emerald-600 fill-emerald-100" /> 
//                           : <Square size={28} className="text-slate-300" />
//                         }
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex justify-between items-start gap-4">
//                           <h4 className={`font-bold text-lg ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>{item.name}</h4>
//                           <span className={`text-xs uppercase font-black tracking-wider px-3 py-1.5 rounded-lg ${
//                             isSelected 
//                               ? 'bg-emerald-100 text-emerald-700' 
//                               : 'bg-slate-100 text-slate-500'
//                           }`}>
//                             {item.category}
//                           </span>
//                         </div>
//                         <p className="text-slate-500 mt-2 line-clamp-2 font-medium">{item.description}</p>
//                       </div>
//                     </div>
//                   ); 
//                 })
//               ) : (
//                 <div className="py-20 text-center">
//                   <div className="bg-slate-100 p-8 rounded-full inline-block mb-4">
//                     <Search size={48} className="text-slate-300" />
//                   </div>
//                   <p className="text-slate-500 text-lg font-medium">No skills found matching your search.</p>
//                 </div>
//               )}
//             </div>
            
//             {/* Modal Footer */}
//             <div className="px-10 py-6 border-t-2 border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
//                   tempSelectedIds.length > 0 
//                     ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30' 
//                     : 'bg-slate-200 text-slate-500'
//                 }`}>
//                   {tempSelectedIds.length}
//                 </div>
//                 <span className="text-slate-600 font-bold text-lg">skills selected</span>
//               </div>
//               <div className="flex gap-4">
//                 <button 
//                   onClick={() => setIsModalOpen(false)} 
//                   className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition text-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={commitModalSelection}
//                   disabled={tempSelectedIds.length === 0}
//                   className={`px-10 py-4 font-black rounded-2xl text-lg transition-all duration-300 ${
//                     tempSelectedIds.length > 0
//                       ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:-translate-y-1'
//                       : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Add Selected Skills
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RuleBasedCompetencySetup;






import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, Plus, Trash2, Building, Layers, 
  Briefcase, Search, CheckSquare, Square, 
  AlertCircle, CheckCircle, Loader2, MapPin, 
  Grid, BadgeCheck, X, Users, Sparkles, Target,
  Zap, Award, Star, ChevronRight, Shield, Crown,
  BookOpen, TrendingUp, Filter, RotateCcw, Info
} from 'lucide-react';
import { normalizeListResponse } from '../../utils/api';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface DropdownOption {
  id: number; 
  name: string;
  parent: number | null;
}

interface OrgNode {
  id: number;
  name: string;
  org_type: 'hq' | 'bu' | 'dept' | 'section' | 'designation'; 
  parent: number | null;
}

interface Group {
  id: number;
  name: string;
}

interface ProcessedData {
  hqs: DropdownOption[];
  bus: DropdownOption[];
  departments: DropdownOption[];
  sections: DropdownOption[];
  designations: DropdownOption[];
}

interface LibrarySkill {
  id: number;
  name: string;
  category: string; 
  description: string;
}

interface AssignedSkill extends LibrarySkill {
  targetLevel: number; 
}

interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

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

// ==========================================
// 2. REUSABLE COMPONENTS
// ==========================================

// Enhanced Select Component
const EnhancedSelect = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  options, 
  placeholder, 
  color = 'indigo',
  disabled = false 
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: DropdownOption[];
  placeholder: string;
  color?: string;
  disabled?: boolean;
}) => {
  const colorMap: Record<string, string> = {
    indigo: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-800 focus-within:ring-indigo-500 focus-within:border-indigo-400',
    violet: 'from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/30 border-violet-200 dark:border-violet-800 focus-within:ring-violet-500 focus-within:border-violet-400',
    fuchsia: 'from-fuchsia-50 to-fuchsia-100 dark:from-fuchsia-900/30 dark:to-fuchsia-800/30 border-fuchsia-200 dark:border-fuchsia-800 focus-within:ring-fuchsia-500 focus-within:border-fuchsia-400',
    pink: 'from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-200 dark:border-pink-800 focus-within:ring-pink-500 focus-within:border-pink-400',
    emerald: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800 focus-within:ring-emerald-500 focus-within:border-emerald-400',
    amber: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-800 focus-within:ring-amber-500 focus-within:border-amber-400',
  };

  const iconColorMap: Record<string, string> = {
    indigo: 'text-indigo-500 dark:text-indigo-400',
    violet: 'text-violet-500 dark:text-violet-400',
    fuchsia: 'text-fuchsia-500 dark:text-fuchsia-400',
    pink: 'text-pink-500 dark:text-pink-400',
    emerald: 'text-emerald-500 dark:text-emerald-400',
    amber: 'text-amber-500 dark:text-amber-400',
  };

  return (
    <div className={`space-y-3 transition-all duration-300 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <label className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${iconColorMap[color]}`}>
        <Icon size={16} />
        {label}
      </label>
      <div className={`relative bg-gradient-to-r ${colorMap[color]} rounded-2xl border-2 focus-within:ring-4 focus-within:ring-opacity-20 transition-all duration-300 hover:shadow-lg group`}>
        <select 
          value={value} 
          onChange={onChange} 
          className="w-full px-5 py-4 bg-transparent rounded-2xl text-base font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none"
        >
          <option value="" className="dark:bg-slate-900">{placeholder}</option>
          {options.map(d => <option key={d.id} value={d.id} className="dark:bg-slate-900">{d.name}</option>)}
        </select>
        <ChevronRight size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 ${iconColorMap[color]} rotate-90 transition-transform group-hover:translate-y-[-40%]`} />
      </div>
    </div>
  );
};

// Level Badge Component
const LevelBadge = ({ level }: { level: number }) => {
  const configs = [
    { bg: 'from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-900', text: 'text-slate-700 dark:text-slate-300', label: 'Novice', icon: Star },
    { bg: 'from-sky-100 to-cyan-200 dark:from-sky-900/30 dark:to-cyan-900/30', text: 'text-sky-700 dark:text-sky-300', label: 'Beginner', icon: TrendingUp },
    { bg: 'from-indigo-100 to-violet-200 dark:from-indigo-900/30 dark:to-violet-900/30', text: 'text-indigo-700 dark:text-indigo-300', label: 'Competent', icon: Target },
    { bg: 'from-purple-100 to-fuchsia-200 dark:from-purple-900/30 dark:to-fuchsia-900/30', text: 'text-purple-700 dark:text-purple-300', label: 'Proficient', icon: Award },
    { bg: 'from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30', text: 'text-amber-700 dark:text-amber-300', label: 'Expert', icon: Crown },
  ];
  const config = configs[level - 1] || configs[0];
  const IconComponent = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${config.bg} ${config.text} font-bold text-sm shadow-sm`}>
      <IconComponent size={16} />
      <span>Level {level}</span>
      <span className="opacity-60">•</span>
      <span>{config.label}</span>
    </div>
  );
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

const RuleBasedCompetencySetup: React.FC = () => {

  // -- State: Filters --
  const [financialYear, setFinancialYear] = useState<string>('FY 2024-25');
  
  // Hierarchy Selections
  const [selectedHQ, setSelectedHQ] = useState<string>('');
  const [selectedBU, setSelectedBU] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  // -- State: Data --
  const [orgData, setOrgData] = useState<ProcessedData>({
      hqs: [], bus: [], departments: [], sections: [], designations: []
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [libraryData, setLibraryData] = useState<LibrarySkill[]>([]);
  
  // -- State: Loading --
  const [loadingHierarchy, setLoadingHierarchy] = useState<boolean>(true);
  const [loadingLibrary, setLoadingLibrary] = useState<boolean>(false);
  const [savingRule, setSavingRule] = useState<boolean>(false);
  const [fetchingRule, setFetchingRule] = useState<boolean>(false); 

  // -- State: Competencies --
  const [assignedSkills, setAssignedSkills] = useState<AssignedSkill[]>([]);
  
  // -- State: Modal --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' });
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ----------------------------------------------------------------
  // 1. DATA FETCHING AND PROCESSING
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoadingHierarchy(true);
      try {
        const [orgRes, libRes, grpRes] = await Promise.all([
            fetch(`${API_BASE}/organization/`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/library/for_rules/`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/groups/`, { headers: getAuthHeaders() })
        ]);
        
        if (orgRes.ok) {
            const nodes = normalizeListResponse<OrgNode>(await orgRes.json());
            processHierarchyData(nodes);
        }
        if (libRes.ok) setLibraryData(normalizeListResponse<LibrarySkill>(await libRes.json()));
        if (grpRes.ok) setGroups(normalizeListResponse<Group>(await grpRes.json()));

      } catch (error) {
        console.error("Failed to load data:", error);
        showToast('error', "Failed to load data from server.");
      } finally {
        setLoadingHierarchy(false);
        setLoadingLibrary(false);
      }
    };
    fetchData();
  }, []);

  const processHierarchyData = (nodes: OrgNode[]) => {
    const data: ProcessedData = {
        hqs: [], bus: [], departments: [], sections: [], designations: []
    };

    const toOption = (n: OrgNode) => ({ id: n.id, name: n.name, parent: n.parent });

    nodes.forEach(node => {
        switch(node.org_type) {
            case 'hq': data.hqs.push(toOption(node)); break;
            case 'bu': data.bus.push(toOption(node)); break;
            case 'dept': data.departments.push(toOption(node)); break;
            case 'section': data.sections.push(toOption(node)); break;
            case 'designation': data.designations.push(toOption(node)); break;
        }
    });

    setOrgData(data);
  };

  // ----------------------------------------------------------------
  // 2. DYNAMIC DROPDOWN OPTIONS (CASCADING)
  // ----------------------------------------------------------------

  const filteredBUs = useMemo(() => {
    if (!selectedHQ) return orgData.bus;
    return orgData.bus.filter(bu => String(bu.parent) === selectedHQ);
  }, [selectedHQ, orgData.bus]);

  const filteredDepts = useMemo(() => {
    if (!selectedBU) return orgData.departments;
    return orgData.departments.filter(d => String(d.parent) === selectedBU);
  }, [selectedBU, orgData.departments]);

  const filteredSections = useMemo(() => {
    if (!selectedDept) return orgData.sections;
    return orgData.sections.filter(s => String(s.parent) === selectedDept);
  }, [selectedDept, orgData.sections]);

  const filteredDesignations = useMemo(() => orgData.designations, [orgData.designations]);

  // Get unique categories from library
  const categories = useMemo(() => {
    const cats = Array.from(new Set(libraryData.map(s => s.category)));
    return ['all', ...cats];
  }, [libraryData]);

  // ----------------------------------------------------------------
  // 3. FETCH RULE SKILLS
  // ----------------------------------------------------------------
  useEffect(() => {
    const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;

    if (!hasSelection) {
        setAssignedSkills([]);
        return;
    }

    const fetchExistingRule = async () => {
        setFetchingRule(true);
        try {
            const getName = (list: DropdownOption[], id: string) => list.find(x => String(x.id) === id)?.name || '';

            const params = new URLSearchParams();
            if (selectedHQ) params.append('hq', getName(orgData.hqs, selectedHQ));
            if (selectedBU) params.append('business_unit', getName(orgData.bus, selectedBU));
            if (selectedDept) params.append('department', getName(orgData.departments, selectedDept));
            if (selectedSection) params.append('section', getName(orgData.sections, selectedSection));
            if (selectedDesignation) params.append('designation', getName(orgData.designations, selectedDesignation));
            if (selectedGroup) params.append('group', selectedGroup);

            params.append('financial_year', financialYear);

            const res = await fetch(`${API_BASE}/rules/fetch_rule/?${params.toString()}`, { 
                headers: getAuthHeaders() 
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.found) {
                    setAssignedSkills(data.competencies);
                } else {
                    setAssignedSkills([]); 
                }
            }
        } catch (e) {
            console.error("Failed to fetch rule", e);
        } finally {
            setFetchingRule(false);
        }
    };

    const timer = setTimeout(() => {
        fetchExistingRule();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, selectedGroup, financialYear]); 


  // ----------------------------------------------------------------
  // 4. HANDLERS
  // ----------------------------------------------------------------

  const handleHQChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setSelectedHQ(newVal);
    if (newVal === '') {
        setSelectedBU(''); setSelectedDept(''); setSelectedSection('');
    } else {
        const currentBU = orgData.bus.find(b => String(b.id) === selectedBU);
        if (currentBU && String(currentBU.parent) !== newVal) {
             setSelectedBU(''); setSelectedDept(''); setSelectedSection('');
        }
    }
  };

  const handleBUChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setSelectedBU(newVal);
    if (newVal === '') {
         setSelectedDept(''); setSelectedSection('');
    } else {
        const currentDept = orgData.departments.find(d => String(d.id) === selectedDept);
        if (currentDept && String(currentDept.parent) !== newVal) {
            setSelectedDept(''); setSelectedSection('');
        }
    }
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = e.target.value;
    setSelectedDept(newVal);
    if (newVal === '') {
        setSelectedSection('');
    } else {
        const currentSec = orgData.sections.find(s => String(s.id) === selectedSection);
        if (currentSec && String(currentSec.parent) !== newVal) {
            setSelectedSection('');
        }
    }
  };

  const clearAllFilters = () => {
    setSelectedHQ('');
    setSelectedBU('');
    setSelectedDept('');
    setSelectedSection('');
    setSelectedDesignation('');
    setSelectedGroup('');
    setAssignedSkills([]);
  };

  const openLibrary = () => {
    setTempSelectedIds(assignedSkills.map(s => s.id));
    setModalSearch('');
    setActiveCategory('all');
    setIsModalOpen(true);
  };

  const toggleModalItem = (id: number) => {
    setTempSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const commitModalSelection = () => {
    const newSkillList: AssignedSkill[] = [];
    tempSelectedIds.forEach(id => {
      const existing = assignedSkills.find(s => s.id === id);
      if (existing) {
        newSkillList.push(existing);
      } else {
        const libItem = libraryData.find(l => l.id === id);
        if (libItem) {
          newSkillList.push({ ...libItem, targetLevel: 3 }); 
        }
      }
    });
    setAssignedSkills(newSkillList);
    setIsModalOpen(false);
    showToast('success', `${newSkillList.length} competencies assigned successfully!`);
  };

  const changeLevel = (skillId: number, newLevel: number) => {
    setAssignedSkills(prev => prev.map(s => 
      s.id === skillId ? { ...s, targetLevel: newLevel } : s
    ));
  };

  const removeSkill = (skillId: number) => {
    setAssignedSkills(prev => prev.filter(s => s.id !== skillId));
    showToast('success', 'Competency removed from rule.');
  };

  const saveConfiguration = async () => {
    const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;

    if (!hasSelection) {
      showToast('error', 'Please select at least one organization level (e.g., HQ, Dept, or Group).');
      return;
    }
    if (assignedSkills.length === 0) {
      showToast('error', 'Please add at least one competency.');
      return;
    }

    setSavingRule(true);

    const getName = (list: DropdownOption[], id: string) => list.find(x => String(x.id) === id)?.name || null;

    const payload = {
      meta: { financialYear },
      hierarchy: {
        hq: getName(orgData.hqs, selectedHQ),
        bu: getName(orgData.bus, selectedBU),
        department: getName(orgData.departments, selectedDept),
        section: getName(orgData.sections, selectedSection),
        designation: getName(orgData.designations, selectedDesignation),
        group: selectedGroup || null
      },
      competencies: assignedSkills.map(s => ({
        skillId: s.id, 
        name: s.name,
        targetLevel: s.targetLevel
      }))
    };

    try {
        const response = await fetch(`${API_BASE}/rules/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast('success', 'Rule Saved Successfully! 🎉');
        } else {
            const err = await response.json();
            showToast('error', err.error || 'Failed to save rule.');
        }
    } catch (e) {
        showToast('error', 'Network error.');
    } finally {
        setSavingRule(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const filteredLibrary = useMemo(() => {
    return libraryData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(modalSearch.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [modalSearch, libraryData, activeCategory]);

  const hasSelection = selectedHQ || selectedBU || selectedDept || selectedSection || selectedDesignation || selectedGroup;
  const selectionCount = [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, selectedGroup].filter(Boolean).length;

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-violet-950/20 font-sans text-slate-800 dark:text-slate-100 p-8 animate-in fade-in duration-700 transition-colors duration-300">
      
      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a5b4fc, #818cf8); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-200 to-rose-200 dark:from-orange-900/10 dark:to-rose-900/10 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900/10 dark:to-violet-900/10 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-[100] px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 text-white animate-in slide-in-from-top-6 duration-500 ${
          toast.type === 'error' 
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30' 
            : 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30'
        }`}>
          <div className="p-2 bg-white/20 rounded-xl">
            {toast.type === 'error' ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
          </div>
          <div>
            <p className="font-black text-lg">{toast.type === 'error' ? 'Error' : 'Success'}</p>
            <p className="font-medium opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-4 p-2 hover:bg-white/20 rounded-xl transition">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="w-full space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative p-5 bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl shadow-2xl shadow-orange-500/30">
                <Target size={36} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 dark:from-orange-400 dark:via-rose-400 dark:to-pink-400 tracking-tight">
                Competency Rule Engine
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Configure skill requirements by organizational hierarchy</p>
              <div className="flex gap-2 mt-3">
                <span className="px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Zap size={14}/>Smart Rules
                </span>
                <span className="px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Shield size={14}/>Auto-Cascade
                </span>
              </div>
            </div>
          </div>
          
          {/* Fiscal Year Selector */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-8 py-5 rounded-2xl shadow-xl shadow-slate-200/30 dark:shadow-black/30 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 min-w-[260px]">
            <label className="text-xs uppercase font-black text-orange-500 dark:text-orange-400 tracking-widest mb-2 block flex items-center gap-2">
              <Sparkles size={14}/>
              Fiscal Year
            </label>
            <select 
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="bg-transparent font-black text-2xl text-slate-800 dark:text-slate-200 outline-none cursor-pointer w-full dark:bg-slate-900"
            >
              {['FY 2023-24', 'FY 2024-25', 'FY 2025-26'].map(y => <option key={y} value={y} className="dark:bg-slate-900">{y}</option>)}
            </select>
          </div>
        </div>

        {/* HIERARCHY SELECTOR */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/40 dark:shadow-black/40 border-2 border-slate-200 dark:border-slate-800 p-10 relative overflow-hidden transition-colors">
          
          {/* Loading Animation */}
          {loadingHierarchy && (
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-200 via-rose-300 to-pink-200 dark:from-orange-900 dark:via-rose-900 dark:to-pink-900 overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
          )}
          
          {/* Header with Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b-2 border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl">
                <Building className="text-indigo-600 dark:text-indigo-400" size={28} />
              </div>
              <div>
                <h2 className="font-black text-2xl text-slate-800 dark:text-white">Define Target Context</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Select hierarchy levels to apply competency rules</p>
              </div>
            </div>
            
            {/* Selection Stats & Clear Button */}
            <div className="flex items-center gap-4">
              {selectionCount > 0 && (
                <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                  <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{selectionCount}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium ml-2">filter{selectionCount > 1 ? 's' : ''} active</span>
                </div>
              )}
              <button 
                onClick={clearAllFilters}
                disabled={!hasSelection}
                className="flex items-center gap-2 px-5 py-3 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:shadow-lg rounded-xl transition-all duration-300 font-bold border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-800 disabled:opacity-30 disabled:pointer-events-none"
              >
                <RotateCcw size={18}/>
                Clear All
              </button>
            </div>
          </div>

          {/* Dropdowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            
            <EnhancedSelect 
              label="Headquarters" 
              icon={MapPin} 
              value={selectedHQ} 
              onChange={handleHQChange} 
              options={orgData.hqs} 
              placeholder="All Locations"
              color="indigo"
            />

            <EnhancedSelect 
              label="Business Unit" 
              icon={Briefcase} 
              value={selectedBU} 
              onChange={handleBUChange} 
              options={filteredBUs} 
              placeholder="All Units"
              color="violet"
            />

            <EnhancedSelect 
              label="Department" 
              icon={Layers} 
              value={selectedDept} 
              onChange={handleDeptChange} 
              options={filteredDepts} 
              placeholder="All Departments"
              color="fuchsia"
            />

            <EnhancedSelect 
              label="Section" 
              icon={Grid} 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)} 
              options={filteredSections} 
              placeholder="All Sections"
              color="pink"
            />

            <EnhancedSelect 
              label="Designation / Role" 
              icon={BadgeCheck} 
              value={selectedDesignation} 
              onChange={(e) => setSelectedDesignation(e.target.value)} 
              options={filteredDesignations} 
              placeholder="All Designations"
              color="emerald"
            />

            <EnhancedSelect 
              label="Group / Team" 
              icon={Users} 
              value={selectedGroup} 
              onChange={(e) => setSelectedGroup(e.target.value)} 
              options={groups.map(g => ({ id: g.id, name: g.name, parent: null }))} 
              placeholder="All Groups"
              color="amber"
            />

          </div>

          {/* Quick Info */}
          {!hasSelection && (
            <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
                <Info className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-400 text-lg">How it works</h4>
                <p className="text-amber-700 dark:text-amber-500 mt-1 font-medium">
                  Select one or more filters above to define the target context. Then add competencies and set required proficiency levels. 
                  Rules cascade down the hierarchy automatically!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SKILL ASSIGNMENT AREA */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/40 dark:shadow-black/40 border-2 border-slate-200 dark:border-slate-800 flex flex-col min-h-[600px] relative overflow-hidden transition-colors">
          
          {/* Loading Overlay */}
          {fetchingRule && (
             <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center rounded-[2rem] animate-in fade-in">
                 <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border-2 border-indigo-100 dark:border-indigo-900">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <Loader2 className="w-14 h-14 text-indigo-600 dark:text-indigo-400 animate-spin relative z-10" />
                    </div>
                    <span className="text-lg font-black text-indigo-800 dark:text-indigo-300 mt-6">Fetching existing rules...</span>
                    <span className="text-slate-500 dark:text-slate-400 mt-2">This won't take long</span>
                 </div>
             </div>
          )}
          
          {/* Header */}
          <div className="px-10 py-8 border-b-2 border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-50/50 via-indigo-50/30 to-violet-50/30 dark:from-slate-900/50 dark:via-indigo-900/20 dark:to-violet-900/20">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl">
                <BookOpen className="text-emerald-600 dark:text-emerald-400" size={28} />
              </div>
              <div>
                <h3 className="font-black text-2xl text-slate-800 dark:text-white">Competency Requirements</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {assignedSkills.length > 0 
                    ? <><span className="text-emerald-600 dark:text-emerald-400 font-bold">{assignedSkills.length}</span> skills assigned to this rule</>
                    : 'No skills assigned yet'
                  }
                </p>
              </div>
            </div>
            <button 
              onClick={openLibrary}
              disabled={loadingLibrary || !hasSelection}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/30 hover:shadow-2xl hover:-translate-y-1 transform active:scale-95 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loadingLibrary ? <Loader2 size={22} className="animate-spin"/> : <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />}
              Add From Library
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            {assignedSkills.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900 dark:to-violet-900 rounded-full blur-2xl opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 p-10 rounded-full">
                    <Layers size={64} className="text-indigo-400 dark:text-indigo-500" />
                  </div>
                </div>
                <h4 className="text-slate-800 dark:text-white font-black text-2xl">No Competencies Defined</h4>
                <p className="max-w-lg mx-auto mt-4 text-lg text-slate-500 dark:text-slate-400 font-medium">
                    {!hasSelection 
                        ? "Select at least one organization filter above to start defining competency requirements."
                        : "No rules found for this selection. Click 'Add From Library' to create one."
                    }
                </p>
                {!hasSelection && (
                  <div className="flex items-center gap-3 mt-6 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold">
                    <ChevronRight size={20} className="animate-pulse"/>
                    <span>Start by selecting filters above</span>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 border-b-2 border-slate-100 dark:border-slate-800 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <th className="px-10 py-6 w-[35%]">Competency</th>
                    <th className="px-6 py-6 w-[15%]">Category</th>
                    <th className="px-6 py-6 w-[35%]">Required Proficiency Level</th>
                    <th className="px-6 py-6 w-[15%] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-50 dark:divide-slate-800">
                  {assignedSkills.map((skill, idx) => (
                    <tr 
                      key={skill.id} 
                      className="hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-violet-50/30 dark:hover:from-indigo-900/10 dark:hover:to-violet-900/10 transition-all duration-300 group animate-in slide-in-from-left"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg shadow-sm">
                            {skill.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{skill.name}</p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 truncate max-w-xs font-medium">{skill.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(level => (
                              <button
                                key={level}
                                onClick={() => changeLevel(skill.id, level)}
                                className={`w-12 h-12 rounded-xl font-black text-lg transition-all duration-300 border-2 ${
                                  skill.targetLevel === level
                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-500/40 scale-110'
                                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                          <LevelBadge level={skill.targetLevel} />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => removeSkill(skill.id)}
                          className="p-3 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                          title="Remove Skill"
                        >
                          <Trash2 size={22} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer / Save Button */}
          <div className="p-8 border-t-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-emerald-50/30 dark:from-slate-900/50 dark:to-emerald-900/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 dark:text-slate-400 font-medium">
              {assignedSkills.length > 0 && (
                <span>Total competencies: <strong className="text-slate-800 dark:text-slate-200">{assignedSkills.length}</strong></span>
              )}
            </div>
            <button 
              onClick={saveConfiguration}
              disabled={assignedSkills.length === 0 || savingRule}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all duration-300 ${
                assignedSkills.length === 0 || savingRule 
                  ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-emerald-500/30 dark:shadow-emerald-900/30 hover:shadow-2xl hover:-translate-y-1 transform active:scale-95'
              }`}
            >
              {savingRule ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {savingRule ? 'Saving Rule...' : 'Save Competency Rule'}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="px-10 py-8 border-b-2 border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-white via-emerald-50/30 to-green-50/30 dark:from-slate-900 dark:via-emerald-900/10 dark:to-green-900/10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-2xl">
                  <BookOpen className="text-emerald-600 dark:text-emerald-400" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Competency Library</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Select skills to add to this rule</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 rounded-2xl text-slate-500 dark:text-slate-400 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Search & Filter */}
            <div className="px-10 py-6 bg-slate-50/50 dark:bg-slate-800/50 border-b-2 border-slate-100 dark:border-slate-800 space-y-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition" size={24} />
                <input 
                  type="text" 
                  placeholder="Search competencies by name or category..." 
                  value={modalSearch} 
                  onChange={(e) => setModalSearch(e.target.value)} 
                  className="w-full pl-14 pr-6 py-5 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-500/20 transition text-lg font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                  autoFocus 
                />
              </div>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeCategory === cat
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    {cat === 'all' ? '🏷️ All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white dark:bg-slate-900 custom-scrollbar">
              {filteredLibrary.length > 0 ? (
                filteredLibrary.map((item, idx) => { 
                  const isSelected = tempSelectedIds.includes(item.id); 
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => toggleModalItem(item.id)} 
                      className={`flex items-start gap-5 p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 select-none animate-in slide-in-from-bottom ${
                        isSelected 
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-300 dark:border-emerald-600 shadow-lg shadow-emerald-500/10' 
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div className={`mt-1 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                        {isSelected 
                          ? <CheckSquare size={28} className="text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/50" /> 
                          : <Square size={28} className="text-slate-300 dark:text-slate-600" />
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className={`font-bold text-lg ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-300'}`}>{item.name}</h4>
                          <span className={`text-xs uppercase font-black tracking-wider px-3 py-1.5 rounded-lg ${
                            isSelected 
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 font-medium">{item.description}</p>
                      </div>
                    </div>
                  ); 
                })
              ) : (
                <div className="py-20 text-center">
                  <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full inline-block mb-4">
                    <Search size={48} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No skills found matching your search.</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-10 py-6 border-t-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-900 to-emerald-900/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                  tempSelectedIds.length > 0 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {tempSelectedIds.length}
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-bold text-lg">skills selected</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-4 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition text-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={commitModalSelection}
                  disabled={tempSelectedIds.length === 0}
                  className={`px-10 py-4 font-black rounded-2xl text-lg transition-all duration-300 ${
                    tempSelectedIds.length > 0
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:-translate-y-1'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Add Selected Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleBasedCompetencySetup;
