




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Search, Loader2, CheckCircle2, Building2, Briefcase, Layers, 
//   AlertTriangle, UserCheck, Map as MapIcon, ChevronRight, Save, ArrowLeft,
//   LayoutDashboard, Star, TrendingUp, ShieldCheck, History, Calendar,
//   Award, Target, Zap, Users, ChevronDown, Filter, RefreshCw, Download,
//   BarChart3, PieChart, Clock, CheckCheck, XCircle, Info, Sparkles,
//   Trophy, Medal, ArrowRight, Eye, Printer, FileText, TrendingDown,
//   Minus, ChevronUp
// } from 'lucide-react';

// const API_BASE = 'http://127.0.0.1:8000/lms';

// // --- UTILS ---
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

// const getUserRole = (): string => {
//     try {
//         const authData = localStorage.getItem("auth");
//         const user = authData ? JSON.parse(authData).user : null;
//         const role = user?.role_name || user?.role || 'employee'; 
//         return role.toLowerCase();
//     } catch (e) {
//         return 'employee';
//     }
// }

// // Level Configuration with Dark Mode Classes
// const LEVEL_CONFIG = {
//   5: { 
//       title: 'Expert', 
//       color: 'emerald', 
//       bg: 'bg-emerald-500', 
//       bgLight: 'bg-emerald-100 dark:bg-emerald-900/30', 
//       text: 'text-emerald-600 dark:text-emerald-400', 
//       border: 'border-emerald-200 dark:border-emerald-800', 
//       gradient: 'from-emerald-500 to-green-600', 
//       icon: Trophy 
//   },
//   4: { 
//       title: 'Advanced', 
//       color: 'green', 
//       bg: 'bg-green-500', 
//       bgLight: 'bg-green-100 dark:bg-green-900/30', 
//       text: 'text-green-600 dark:text-green-400', 
//       border: 'border-green-200 dark:border-green-800', 
//       gradient: 'from-green-500 to-emerald-600', 
//       icon: Award 
//   },
//   3: { 
//       title: 'Intermediate', 
//       color: 'amber', 
//       bg: 'bg-amber-500', 
//       bgLight: 'bg-amber-100 dark:bg-amber-900/30', 
//       text: 'text-amber-600 dark:text-amber-400', 
//       border: 'border-amber-200 dark:border-amber-800', 
//       gradient: 'from-amber-500 to-yellow-600', 
//       icon: Medal 
//   },
//   2: { 
//       title: 'Basic', 
//       color: 'orange', 
//       bg: 'bg-orange-500', 
//       bgLight: 'bg-orange-100 dark:bg-orange-900/30', 
//       text: 'text-orange-600 dark:text-orange-400', 
//       border: 'border-orange-200 dark:border-orange-800', 
//       gradient: 'from-orange-500 to-amber-600', 
//       icon: Target 
//   },
//   1: { 
//       title: 'Beginner', 
//       color: 'rose', 
//       bg: 'bg-rose-500', 
//       bgLight: 'bg-rose-100 dark:bg-rose-900/30', 
//       text: 'text-rose-600 dark:text-rose-400', 
//       border: 'border-rose-200 dark:border-rose-800', 
//       gradient: 'from-rose-500 to-red-600', 
//       icon: Zap 
//   },
// };

// const getLevelConfig = (level: number) => LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];

// // --- INTERFACES ---
// interface HierarchyNode { id: number; name: string; org_type: string; parent: number | null; }
// interface Rule { 
//   id: number; hq: string; business_unit: string | null; department: string | null; 
//   section: string | null; designation: string | null; is_active: boolean; 
//   rule_competencies: Array<{ competency: number; competency_name: string }>;
// }
// interface Employee { id: number; name: string; email: string; designation: string; }
// interface Question { id: string; question: string; points: number; competency_id: number; }
// interface Category { name: string; questions: Question[]; }

// interface CompetencyRecord {
//     id: number;
//     employee_name: string;
//     competency_id: number; 
//     competency_name: string; 
//     achieved_level: {
//         level: number;
//         title: string;
//         color: string;
//     };
//     score: number;
//     date: string;
// }

// interface CompetencyResult {
//   competency_id: number;
//   competency_name: string;
//   category_name: string;
//   level: number;
//   score: number;
//   total: number;
//   percentage: number;
//   questionsAnswered: number;
//   totalQuestions: number;
// }

// interface AssessmentResult {
//   employeeId: number;
//   employeeName: string;
//   designation: string;
//   date: string;
//   overallScore: number;
//   overallTotal: number;
//   overallPercentage: number;
//   averageLevel: number;
//   competencies: CompetencyResult[];
//   levelDistribution: { [key: number]: number };
// }

// const CompetencySystem: React.FC = () => {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState<string>('employee');
//   const [loading, setLoading] = useState(true);

//   // --- DATA STATES ---
//   const [myCompetencies, setMyCompetencies] = useState<CompetencyRecord[]>([]);
//   const [viewMode, setViewMode] = useState<'cards' | 'history'>('cards');
//   const [levelFilter, setLevelFilter] = useState<number | null>(null);

//   // --- ADMIN STATES ---
//   const [hqs, setHqs] = useState<HierarchyNode[]>([]);
//   const [bus, setBus] = useState<HierarchyNode[]>([]);
//   const [departments, setDepartments] = useState<HierarchyNode[]>([]);
//   const [sections, setSections] = useState<HierarchyNode[]>([]);
//   const [designations, setDesignations] = useState<HierarchyNode[]>([]);
//   const [rules, setRules] = useState<Rule[]>([]);
   
//   const [selectedHQ, setSelectedHQ] = useState<string>('');
//   const [selectedBU, setSelectedBU] = useState<string>('');
//   const [selectedDept, setSelectedDept] = useState<string>('');
//   const [selectedSection, setSelectedSection] = useState<string>('');
//   const [selectedDesignation, setSelectedDesignation] = useState<string>('');

//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
//   const [employeeName, setEmployeeName] = useState<string>('');
//   const [employeeDesignation, setEmployeeDesignation] = useState<string>('');
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
//   const [currentStep, setCurrentStep] = useState(0); 
//   const [showResult, setShowResult] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- RESULT STATES ---
//   const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
//   const [employeeHistory, setEmployeeHistory] = useState<CompetencyRecord[]>([]);
//   const [loadingHistory, setLoadingHistory] = useState(false);
//   const [resultViewTab, setResultViewTab] = useState<'overview' | 'details' | 'history'>('overview');

//   // --- INITIAL LOAD ---
//   useEffect(() => {
//     const role = getUserRole();
//     setUserRole(role);

//     const initData = async () => {
//       setLoading(true);
//       try {
//         if (role === 'employee') {
//             const res = await fetch(`${API_BASE}/assessment-history/`, { headers: getAuthHeaders() });
//             if(res.ok) {
//                 const data = await res.json();
//                 setMyCompetencies(Array.isArray(data) ? data : []);
//             }
//         } else {
//             const fetchSafe = async (url: string) => {
//                 const res = await fetch(url, { headers: getAuthHeaders() });
//                 return res.ok ? res.json() : [];
//             };

//             const [orgData, ruleData, empData, quesData] = await Promise.all([
//                 fetchSafe(`${API_BASE}/organization/`),
//                 fetchSafe(`${API_BASE}/rules/`),
//                 fetchSafe(`${API_BASE}/assignments/employees/`),
//                 fetchSafe(`${API_BASE}/library/assessment_structure/`)
//             ]);

//             if (Array.isArray(orgData)) {
//                 setHqs(orgData.filter((n: any) => n.org_type === 'hq'));
//                 setBus(orgData.filter((n: any) => n.org_type === 'bu'));
//                 setDepartments(orgData.filter((n: any) => n.org_type === 'dept'));
//                 setSections(orgData.filter((n: any) => n.org_type === 'section'));
//                 setDesignations(orgData.filter((n: any) => n.org_type === 'designation'));
//             }

//             if (Array.isArray(ruleData)) setRules(ruleData);
//             if (Array.isArray(quesData)) setCategories(quesData);
//             if (Array.isArray(empData)) {
//                 setEmployees(empData.map((e: any) => ({
//                     id: e.id,
//                     name: e.name || e.email, 
//                     email: e.email,
//                     designation: e.designation || 'Staff'
//                 })));
//             }
//         }
//       } catch (err) { 
//           console.error("Data Load Error:", err); 
//       } finally { 
//           setLoading(false); 
//       }
//     };
//     initData();
//   }, []);

//   // --- DATA PROCESSING ---
//   const sortedHistory = useMemo(() => {
//     return [...myCompetencies].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [myCompetencies]);

//   const uniqueLatestCompetencies = useMemo(() => {
//     const latestMap = new Map();
//     sortedHistory.forEach(record => {
//         const key = record.competency_id || record.competency_name;
//         if (key && !latestMap.has(key)) {
//             latestMap.set(key, record);
//         }
//     });
//     return Array.from(latestMap.values());
//   }, [sortedHistory]);

//   const filteredCompetencies = useMemo(() => {
//     if (levelFilter === null) return uniqueLatestCompetencies;
//     return uniqueLatestCompetencies.filter(c => c.achieved_level.level === levelFilter);
//   }, [uniqueLatestCompetencies, levelFilter]);

//   const stats = useMemo(() => {
//     const total = uniqueLatestCompetencies.length;
//     const expert = uniqueLatestCompetencies.filter(c => c.achieved_level.level >= 4).length;
//     const intermediate = uniqueLatestCompetencies.filter(c => c.achieved_level.level === 3).length;
//     const beginner = uniqueLatestCompetencies.filter(c => c.achieved_level.level <= 2).length;
//     const avgLevel = total > 0 ? (uniqueLatestCompetencies.reduce((sum, c) => sum + c.achieved_level.level, 0) / total).toFixed(1) : '0';
//     return { total, expert, intermediate, beginner, avgLevel };
//   }, [uniqueLatestCompetencies]);

//   // --- ADMIN FILTERING ---
//   const filteredBUs = useMemo(() => bus.filter(b => String(b.parent) === selectedHQ), [selectedHQ, bus]);
//   const filteredDepts = useMemo(() => departments.filter(d => String(d.parent) === selectedBU), [selectedBU, departments]);
//   const filteredSections = useMemo(() => sections.filter(s => String(s.parent) === selectedDept), [selectedDept, sections]);
//   const filteredDesignations = useMemo(() => designations.filter(des => String(des.parent) === selectedSection), [selectedSection, designations]);

//   const { filteredCategories, matchedRule, ruleMatchLevel } = useMemo(() => {
//     if (!selectedHQ) return { filteredCategories: [], matchedRule: null, ruleMatchLevel: '' };
     
//     const hqN = hqs.find(h => String(h.id) === selectedHQ)?.name || null;
//     const buN = selectedBU ? bus.find(b => String(b.id) === selectedBU)?.name : null;
//     const deptN = selectedDept ? departments.find(d => String(d.id) === selectedDept)?.name : null;
//     const secN = selectedSection ? sections.find(s => String(s.id) === selectedSection)?.name : null;
//     const desN = selectedDesignation ? designations.find(des => String(des.id) === selectedDesignation)?.name : null;

//     const findMatchingRule = () => {
//       for (const r of rules) {
//         if (!r.is_active) continue;
//         if (r.hq !== hqN) continue;

//         const ruleHasBU = r.business_unit && r.business_unit.trim() !== '';
//         const ruleHasDept = r.department && r.department.trim() !== '';
//         const ruleHasSection = r.section && r.section.trim() !== '';
//         const ruleHasDesignation = r.designation && r.designation.trim() !== '';

//         if (ruleHasBU && r.business_unit !== buN) continue;
//         if (ruleHasDept && r.department !== deptN) continue;
//         if (ruleHasSection && r.section !== secN) continue;
//         if (ruleHasDesignation && r.designation !== desN) continue;

//         let level = 'HQ';
//         if (ruleHasDesignation) level = 'Designation';
//         else if (ruleHasSection) level = 'Section';
//         else if (ruleHasDept) level = 'Department';
//         else if (ruleHasBU) level = 'Business Unit';

//         return { rule: r, level };
//       }
//       return null;
//     };

//     const match = findMatchingRule();
     
//     if (!match) return { filteredCategories: [], matchedRule: null, ruleMatchLevel: '' };

//     const allowedCompIds = match.rule.rule_competencies.map(rc => rc.competency);
//     const cats = categories.map(cat => ({
//       ...cat,
//       questions: cat.questions.filter(q => allowedCompIds.includes(q.competency_id))
//     })).filter(cat => cat.questions.length > 0);

//     return { 
//       filteredCategories: cats, 
//       matchedRule: match.rule, 
//       ruleMatchLevel: match.level 
//     };
//   }, [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, rules, categories, hqs, bus, departments, sections, designations]);

//   const filteredEmployeesList = useMemo(() => {
//     return employees.filter(emp => (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()));
//   }, [employees, searchQuery]);

//   const totalPoints = useMemo(() => {
//     let total = 0;
//     let achieved = 0;
//     filteredCategories.forEach(cat => cat.questions.forEach(q => {
//       total += q.points;
//       if (checkedItems.has(q.id)) achieved += q.points;
//     }));
//     return { total, achieved, percentage: total > 0 ? Math.round((achieved / total) * 100) : 0 };
//   }, [filteredCategories, checkedItems]);

//   const canSelectEmployees = selectedHQ && filteredCategories.length > 0;

//   const getSelectionSummary = () => {
//     const parts = [];
//     if (selectedHQ) parts.push(hqs.find(h => String(h.id) === selectedHQ)?.name);
//     if (selectedBU) parts.push(bus.find(b => String(b.id) === selectedBU)?.name);
//     if (selectedDept) parts.push(departments.find(d => String(d.id) === selectedDept)?.name);
//     if (selectedSection) parts.push(sections.find(s => String(s.id) === selectedSection)?.name);
//     if (selectedDesignation) parts.push(designations.find(des => String(des.id) === selectedDesignation)?.name);
//     return parts.filter(Boolean).join(' → ');
//   };

//   // --- CALCULATE DETAILED RESULTS ---
//   const calculateResults = (): AssessmentResult => {
//     const competencyMap: { [key: number]: CompetencyResult } = {};
     
//     // Get competency names from the matched rule
//     const competencyNames: { [key: number]: string } = {};
//     if (matchedRule) {
//       matchedRule.rule_competencies.forEach(rc => {
//         competencyNames[rc.competency] = rc.competency_name;
//       });
//     }

//     // Process each category and question
//     filteredCategories.forEach(cat => {
//       cat.questions.forEach(q => {
//         if (!competencyMap[q.competency_id]) {
//           competencyMap[q.competency_id] = {
//             competency_id: q.competency_id,
//             competency_name: competencyNames[q.competency_id] || `Competency ${q.competency_id}`,
//             category_name: cat.name,
//             level: 0,
//             score: 0,
//             total: 0,
//             percentage: 0,
//             questionsAnswered: 0,
//             totalQuestions: 0
//           };
//         }
         
//         competencyMap[q.competency_id].total += q.points;
//         competencyMap[q.competency_id].totalQuestions += 1;
         
//         if (checkedItems.has(q.id)) {
//           competencyMap[q.competency_id].score += q.points;
//           competencyMap[q.competency_id].questionsAnswered += 1;
//         }
//       });
//     });

//     // Calculate levels and percentages
//     const competencies = Object.values(competencyMap).map(comp => {
//       const pct = comp.total > 0 ? (comp.score / comp.total) * 100 : 0;
//       let level = 1;
//       if (pct > 80) level = 5;
//       else if (pct > 60) level = 4;
//       else if (pct > 40) level = 3;
//       else if (pct > 20) level = 2;
       
//       return {
//         ...comp,
//         percentage: Math.round(pct),
//         level
//       };
//     });

//     // Sort by level (highest first), then by score
//     competencies.sort((a, b) => b.level - a.level || b.percentage - a.percentage);

//     // Calculate level distribution
//     const levelDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     competencies.forEach(c => {
//       levelDistribution[c.level] = (levelDistribution[c.level] || 0) + 1;
//     });

//     // Calculate overall stats
//     const overallScore = competencies.reduce((sum, c) => sum + c.score, 0);
//     const overallTotal = competencies.reduce((sum, c) => sum + c.total, 0);
//     const overallPercentage = overallTotal > 0 ? Math.round((overallScore / overallTotal) * 100) : 0;
//     const averageLevel = competencies.length > 0 
//       ? Math.round((competencies.reduce((sum, c) => sum + c.level, 0) / competencies.length) * 10) / 10 
//       : 0;

//     return {
//       employeeId: selectedEmployeeId!,
//       employeeName,
//       designation: employeeDesignation,
//       date: new Date().toISOString(),
//       overallScore,
//       overallTotal,
//       overallPercentage,
//       averageLevel,
//       competencies,
//       levelDistribution
//     };
//   };

//   // --- FETCH EMPLOYEE HISTORY ---
//   const fetchEmployeeHistory = async (employeeId: number) => {
//     setLoadingHistory(true);
//     try {
//       const res = await fetch(`${API_BASE}/employee-history/${employeeId}/`, { 
//         headers: getAuthHeaders() 
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setEmployeeHistory(Array.isArray(data) ? data : []);
//       } else {
//         setEmployeeHistory([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch history:", err);
//       setEmployeeHistory([]);
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedEmployeeId) return alert("Select an employee");
//     setIsSubmitting(true);

//     const perComp: Record<number, { current: number; total: number }> = {};
//     filteredCategories.forEach(cat => cat.questions.forEach(q => {
//       if (!perComp[q.competency_id]) perComp[q.competency_id] = { current: 0, total: 0 };
//       perComp[q.competency_id].total += q.points;
//       if (checkedItems.has(q.id)) perComp[q.competency_id].current += q.points;
//     }));

//     const results = Object.entries(perComp).map(([compId, score]) => {
//       const pct = (score.current / score.total) * 100;
//       let level = pct > 80 ? 5 : pct > 60 ? 4 : pct > 40 ? 3 : pct > 20 ? 2 : 1;
//       return { competency_id: parseInt(compId), level, score: score.current, total: score.total };
//     });

//     try {
//       const res = await fetch(`${API_BASE}/competency/`, { 
//         method: 'POST',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({ userId: selectedEmployeeId, results })
//       });

//       if (res.ok) {
//         // Calculate and set the detailed results
//         const resultData = calculateResults();
//         setAssessmentResult(resultData);
        
//         // Fetch employee history
//         await fetchEmployeeHistory(selectedEmployeeId);
        
//         setShowResult(true);
//       } else {
//           const err = await res.json();
//           alert(`Error: ${err.error || 'Failed to save'}`);
//       }
//     } catch (e) { alert("Network error"); }
//     finally { setIsSubmitting(false); }
//   };

//   const handleSelectAll = () => {
//     if (!currentCategory) return;
//     const allIds = new Set(checkedItems);
//     currentCategory.questions.forEach(q => allIds.add(q.id));
//     setCheckedItems(allIds);
//   };

//   const handleDeselectAll = () => {
//     if (!currentCategory) return;
//     const newSet = new Set(checkedItems);
//     currentCategory.questions.forEach(q => newSet.delete(q.id));
//     setCheckedItems(newSet);
//   };

//   const resetHierarchy = () => {
//     setSelectedHQ('');
//     setSelectedBU('');
//     setSelectedDept('');
//     setSelectedSection('');
//     setSelectedDesignation('');
//   };

//   const startNewAssessment = () => {
//     setShowResult(false);
//     setAssessmentResult(null);
//     setEmployeeHistory([]);
//     setSelectedEmployeeId(null);
//     setEmployeeName('');
//     setEmployeeDesignation('');
//     setCheckedItems(new Set());
//     setCurrentStep(0);
//     setResultViewTab('overview');
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-950 flex flex-col items-center justify-center transition-colors duration-300">
//       <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 text-center">
//         <div className="relative">
//           <Loader2 className="animate-spin text-white w-16 h-16 mx-auto" />
//           <Sparkles className="absolute -top-2 -right-2 text-yellow-300 w-6 h-6 animate-pulse" />
//         </div>
//         <h2 className="text-2xl font-bold text-white mt-6">Loading Your Dashboard</h2>
//         <p className="text-white/60 mt-2">Preparing competency data...</p>
//         <div className="mt-6 flex justify-center gap-1">
//           <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
//           <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
//           <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
//         </div>
//       </div>
//     </div>
//   );

//   // ==========================================
//   // VIEW 1: EMPLOYEE DASHBOARD
//   // ==========================================
//   if (userRole === 'employee') {
//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
//                 <div className="max-w-full mx-auto px-6 py-8">
//                     <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//                         <div className="flex items-center gap-4">
//                             <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
//                                 <ShieldCheck size={32} />
//                             </div>
//                             <div>
//                                 <h1 className="text-3xl font-black tracking-tight">My Competency Profile</h1>
//                                 <p className="text-white/70 mt-1">Track your skills and growth journey</p>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <div className="flex bg-white/10 backdrop-blur rounded-xl p-1">
//                                 <button 
//                                     onClick={() => setViewMode('cards')}
//                                     className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-purple-700 shadow-lg dark:bg-slate-800 dark:text-purple-400' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
//                                 >
//                                     <LayoutDashboard size={16} /> Skills
//                                 </button>
//                                 <button 
//                                     onClick={() => setViewMode('history')}
//                                     className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-white text-purple-700 shadow-lg dark:bg-slate-800 dark:text-purple-400' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
//                                 >
//                                     <History size={16} /> History
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Stats Cards */}
//                     {myCompetencies.length > 0 && (
//                         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
//                             <StatCard icon={<Target />} label="Total Skills" value={stats.total} color="bg-white/10" />
//                             <StatCard icon={<TrendingUp />} label="Avg Level" value={stats.avgLevel} color="bg-white/10" />
//                             <StatCard icon={<Award />} label="Expert (L4-5)" value={stats.expert} color="bg-emerald-500/30" />
//                             <StatCard icon={<Zap />} label="Intermediate (L3)" value={stats.intermediate} color="bg-amber-500/30" />
//                             <StatCard icon={<Clock />} label="Beginner (L1-2)" value={stats.beginner} color="bg-rose-500/30" />
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="max-w-full mx-auto px-6 py-6">
//                 {myCompetencies.length === 0 ? (
//                     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-16 text-center shadow-sm">
//                         <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
//                             <LayoutDashboard size={40} className="text-purple-500" />
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-700 dark:text-white">No Assessment Data Yet</h3>
//                         <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Your administrator hasn't completed your competency assessment. Check back soon!</p>
//                         <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition inline-flex items-center gap-2">
//                             <RefreshCw size={18} /> Refresh Page
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         {/* Filter Pills */}
//                         {viewMode === 'cards' && (
//                             <div className="flex flex-wrap items-center gap-2 mb-6">
//                                 <span className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
//                                     <Filter size={14} /> Filter by Level:
//                                 </span>
//                                 <FilterPill active={levelFilter === null} onClick={() => setLevelFilter(null)} label="All" count={stats.total} />
//                                 <FilterPill active={levelFilter === 5} onClick={() => setLevelFilter(5)} label="Level 5" color="bg-emerald-500" />
//                                 <FilterPill active={levelFilter === 4} onClick={() => setLevelFilter(4)} label="Level 4" color="bg-green-500" />
//                                 <FilterPill active={levelFilter === 3} onClick={() => setLevelFilter(3)} label="Level 3" color="bg-amber-500" />
//                                 <FilterPill active={levelFilter === 2} onClick={() => setLevelFilter(2)} label="Level 2" color="bg-orange-500" />
//                                 <FilterPill active={levelFilter === 1} onClick={() => setLevelFilter(1)} label="Level 1" color="bg-rose-500" />
//                             </div>
//                         )}

//                         {/* --- LATEST CARDS --- */}
//                         {viewMode === 'cards' && (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                                 {filteredCompetencies.map((comp, idx) => (
//                                     <CompetencyCard key={comp.id} comp={comp} index={idx} />
//                                 ))}
//                                 {filteredCompetencies.length === 0 && (
//                                     <div className="col-span-full text-center py-12 text-gray-500 dark:text-slate-400">
//                                         No skills found for this filter.
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* --- HISTORY LIST --- */}
//                         {viewMode === 'history' && (
//                             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
//                                 <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
//                                     <div className="col-span-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2">
//                                         <BarChart3 size={14} /> Competency
//                                     </div>
//                                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Level</div>
//                                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Score</div>
//                                     <div className="col-span-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-right">Date</div>
//                                 </div>
//                                 <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
//                                     {sortedHistory.map((record, idx) => (
//                                         <div 
//                                             key={record.id} 
//                                             className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors group"
//                                             style={{ animationDelay: `${idx * 50}ms` }}
//                                         >
//                                             <div className="col-span-5 flex items-center gap-3">
//                                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getLevelBgColor(record.achieved_level.level)}`}>
//                                                     <Star size={18} className={getLevelTextColor(record.achieved_level.level)} fill="currentColor" />
//                                                 </div>
//                                                 <span className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
//                                                     {record.competency_name || `Skill #${record.competency_id}`}
//                                                 </span>
//                                             </div>
//                                             <div className="col-span-2">
//                                                 <LevelBadge level={record.achieved_level.level} />
//                                             </div>
//                                             <div className="col-span-2">
//                                                 <span className="font-mono font-bold text-gray-700 dark:text-slate-300">{record.score}</span>
//                                                 <span className="text-gray-400 text-sm"> pts</span>
//                                             </div>
//                                             <div className="col-span-3 text-right text-gray-500 dark:text-slate-400 text-sm flex items-center justify-end gap-2">
//                                                 <Calendar size={14} />
//                                                 {new Date(record.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
//   }

//   // ==========================================
//   // VIEW 2: DETAILED RESULT PAGE
//   // ==========================================
//   if (showResult && assessmentResult) {
//     const result = assessmentResult;
//     const overallLevelConfig = getLevelConfig(Math.round(result.averageLevel));
//     const OverallIcon = overallLevelConfig.icon;

//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
//           <div className="max-w-full mx-auto px-6 py-6">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
//                   <CheckCircle2 size={28} />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-black tracking-tight">Assessment Complete</h1>
//                   <p className="text-white/70 text-sm">Detailed results for {result.employeeName}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => window.print()}
//                   className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition flex items-center gap-2"
//                 >
//                   <Printer size={18} /> Print Report
//                 </button>
//                 <button
//                   onClick={startNewAssessment}
//                   className="px-4 py-2.5 bg-white text-purple-700 dark:bg-slate-800 dark:text-purple-400 rounded-xl font-bold hover:bg-white/90 dark:hover:bg-slate-700 transition flex items-center gap-2"
//                 >
//                   <RefreshCw size={18} /> New Assessment
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Employee Summary Card */}
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
//             <div className="p-6 flex flex-col lg:flex-row gap-6">
//               {/* Employee Info */}
//               <div className="flex items-center gap-4 flex-1">
//                 <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
//                   {result.employeeName.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800 dark:text-white">{result.employeeName}</h2>
//                   <p className="text-gray-500 dark:text-slate-400">{result.designation || 'Employee'}</p>
//                   <div className="flex items-center gap-2 mt-1 text-sm text-gray-400 dark:text-slate-500">
//                     <Calendar size={14} />
//                     <span>Assessed on {new Date(result.date).toLocaleDateString(undefined, { 
//                       year: 'numeric', 
//                       month: 'long', 
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Overall Level */}
//               <div className={`p-4 rounded-2xl ${overallLevelConfig.bgLight} ${overallLevelConfig.border} border flex items-center gap-4`}>
//                 <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${overallLevelConfig.gradient} flex items-center justify-center text-white`}>
//                   <OverallIcon size={28} />
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Overall Level</div>
//                   <div className={`text-2xl font-black ${overallLevelConfig.text}`}>
//                     Level {result.averageLevel.toFixed(1)}
//                   </div>
//                   <div className={`text-sm font-medium ${overallLevelConfig.text}`}>
//                     {overallLevelConfig.title}
//                   </div>
//                 </div>
//               </div>

//               {/* Overall Score */}
//               <div className="flex items-center gap-6">
//                 <div className="text-center">
//                   <div className="text-4xl font-black text-gray-800 dark:text-white">{result.overallPercentage}%</div>
//                   <div className="text-sm text-gray-500 dark:text-slate-400">Overall Score</div>
//                 </div>
//                 <div className="h-16 w-px bg-gray-200 dark:bg-slate-700" />
//                 <div className="text-center">
//                   <div className="text-4xl font-black text-purple-600 dark:text-purple-400">{result.overallScore}</div>
//                   <div className="text-sm text-gray-500 dark:text-slate-400">of {result.overallTotal} pts</div>
//                 </div>
//                 <div className="h-16 w-px bg-gray-200 dark:bg-slate-700" />
//                 <div className="text-center">
//                   <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{result.competencies.length}</div>
//                   <div className="text-sm text-gray-500 dark:text-slate-400">Competencies</div>
//                 </div>
//               </div>
//             </div>

//             {/* Level Distribution Bar */}
//             <div className="px-6 pb-6">
//               <div className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Level Distribution</div>
//               <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800">
//                 {[5, 4, 3, 2, 1].map(level => {
//                   const count = result.levelDistribution[level] || 0;
//                   const percentage = result.competencies.length > 0 
//                     ? (count / result.competencies.length) * 100 
//                     : 0;
//                   if (percentage === 0) return null;
//                   const config = getLevelConfig(level);
//                   return (
//                     <div
//                       key={level}
//                       className={`${config.bg} transition-all`}
//                       style={{ width: `${percentage}%` }}
//                       title={`Level ${level}: ${count} competencies`}
//                     />
//                   );
//                 })}
//               </div>
//               <div className="flex gap-4 mt-2 flex-wrap">
//                 {[5, 4, 3, 2, 1].map(level => {
//                   const count = result.levelDistribution[level] || 0;
//                   if (count === 0) return null;
//                   const config = getLevelConfig(level);
//                   return (
//                     <div key={level} className="flex items-center gap-1.5 text-xs">
//                       <div className={`w-2.5 h-2.5 rounded-full ${config.bg}`} />
//                       <span className="text-gray-600 dark:text-slate-400">L{level} ({count})</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="max-w-7xl mx-auto px-6 mt-6">
//           <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-gray-200 dark:border-slate-800 w-fit">
//             <button
//               onClick={() => setResultViewTab('overview')}
//               className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
//                 resultViewTab === 'overview' 
//                   ? 'bg-purple-600 text-white shadow-md' 
//                   : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
//               }`}
//             >
//               <PieChart size={16} /> Overview
//             </button>
//             <button
//               onClick={() => setResultViewTab('details')}
//               className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
//                 resultViewTab === 'details' 
//                   ? 'bg-purple-600 text-white shadow-md' 
//                   : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
//               }`}
//             >
//               <BarChart3 size={16} /> Detailed Breakdown
//             </button>
//             <button
//               onClick={() => setResultViewTab('history')}
//               className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
//                 resultViewTab === 'history' 
//                   ? 'bg-purple-600 text-white shadow-md' 
//                   : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
//               }`}
//             >
//               <History size={16} /> Past Assessments
//               {employeeHistory.length > 0 && (
//                 <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded-full">
//                   {employeeHistory.length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           {/* Overview Tab */}
//           {resultViewTab === 'overview' && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Competency Cards */}
//               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
//                   <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
//                     <Award size={18} className="text-purple-600 dark:text-purple-400" /> Competency Levels
//                   </h3>
//                   <span className="text-sm text-gray-500 dark:text-slate-400">{result.competencies.length} total</span>
//                 </div>
//                 <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
//                   {result.competencies.map((comp, idx) => {
//                     const config = getLevelConfig(comp.level);
//                     const LevelIcon = config.icon;
//                     return (
//                       <div 
//                         key={comp.competency_id} 
//                         className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="flex items-center gap-3">
//                             <div className={`w-10 h-10 rounded-xl ${config.bgLight} flex items-center justify-center`}>
//                               <LevelIcon size={20} className={config.text} />
//                             </div>
//                             <div>
//                               <div className="font-semibold text-gray-800 dark:text-white">{comp.competency_name}</div>
//                               <div className="text-xs text-gray-500 dark:text-slate-400">{comp.category_name}</div>
//                             </div>
//                           </div>
//                           <div className={`px-3 py-1.5 rounded-lg ${config.bgLight} ${config.text} font-bold text-sm`}>
//                             Level {comp.level}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
//                             <div 
//                               className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
//                               style={{ width: `${comp.percentage}%` }}
//                             />
//                           </div>
//                           <span className="text-sm font-medium text-gray-600 dark:text-slate-400 w-12 text-right">
//                             {comp.percentage}%
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-slate-500">
//                           <span>{comp.questionsAnswered} of {comp.totalQuestions} questions</span>
//                           <span>{comp.score} / {comp.total} points</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Stats Summary */}
//               <div className="space-y-6">
//                 {/* Level Cards */}
//                 <div className="grid grid-cols-5 gap-3">
//                   {[5, 4, 3, 2, 1].map(level => {
//                     const config = getLevelConfig(level);
//                     const count = result.levelDistribution[level] || 0;
//                     const LevelIcon = config.icon;
//                     return (
//                       <div 
//                         key={level} 
//                         className={`p-4 rounded-xl ${config.bgLight} ${config.border} border text-center`}
//                       >
//                         <LevelIcon size={24} className={`mx-auto ${config.text}`} />
//                         <div className={`text-2xl font-black mt-2 ${config.text}`}>{count}</div>
//                         <div className="text-xs text-gray-600 dark:text-slate-400 font-medium">L{level}</div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Top Strengths */}
//                 <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
//                   <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/10">
//                     <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
//                       <TrendingUp size={18} /> Top Strengths
//                     </h3>
//                   </div>
//                   <div className="p-4 space-y-3">
//                     {result.competencies.filter(c => c.level >= 4).slice(0, 3).map(comp => {
//                       const config = getLevelConfig(comp.level);
//                       return (
//                         <div key={comp.competency_id} className="flex items-center gap-3">
//                           <CheckCircle2 size={20} className="text-emerald-500" />
//                           <span className="flex-1 font-medium text-gray-700 dark:text-slate-300">{comp.competency_name}</span>
//                           <span className={`px-2 py-1 rounded-lg text-xs font-bold ${config.bgLight} ${config.text}`}>
//                             L{comp.level}
//                           </span>
//                         </div>
//                       );
//                     })}
//                     {result.competencies.filter(c => c.level >= 4).length === 0 && (
//                       <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No advanced level competencies yet</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Areas for Improvement */}
//                 <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
//                   <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-900/10">
//                     <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
//                       <Target size={18} /> Areas for Improvement
//                     </h3>
//                   </div>
//                   <div className="p-4 space-y-3">
//                     {result.competencies.filter(c => c.level <= 2).slice(0, 3).map(comp => {
//                       const config = getLevelConfig(comp.level);
//                       return (
//                         <div key={comp.competency_id} className="flex items-center gap-3">
//                           <AlertTriangle size={20} className="text-amber-500" />
//                           <span className="flex-1 font-medium text-gray-700 dark:text-slate-300">{comp.competency_name}</span>
//                           <span className={`px-2 py-1 rounded-lg text-xs font-bold ${config.bgLight} ${config.text}`}>
//                             L{comp.level}
//                           </span>
//                         </div>
//                       );
//                     })}
//                     {result.competencies.filter(c => c.level <= 2).length === 0 && (
//                       <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No beginner level competencies - Great job!</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Detailed Breakdown Tab */}
//           {resultViewTab === 'details' && (
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
//                 <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Competency</div>
//                 <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Category</div>
//                 <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Level</div>
//                 <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Score</div>
//                 <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Progress</div>
//               </div>
//               <div className="divide-y divide-gray-100 dark:divide-slate-800">
//                 {result.competencies.map((comp, idx) => {
//                   const config = getLevelConfig(comp.level);
//                   return (
//                     <div 
//                       key={comp.competency_id} 
//                       className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
//                     >
//                       <div className="col-span-4">
//                         <div className="font-semibold text-gray-800 dark:text-slate-200">{comp.competency_name}</div>
//                         <div className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
//                           {comp.questionsAnswered}/{comp.totalQuestions} questions answered
//                         </div>
//                       </div>
//                       <div className="col-span-2">
//                         <span className="text-sm text-gray-600 dark:text-slate-400">{comp.category_name}</span>
//                       </div>
//                       <div className="col-span-2 text-center">
//                         <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${config.bgLight} ${config.text} font-bold text-sm`}>
//                           <Star size={14} fill="currentColor" />
//                           Level {comp.level}
//                         </span>
//                       </div>
//                       <div className="col-span-2 text-center">
//                         <span className="font-mono font-bold text-gray-700 dark:text-slate-300">{comp.score}</span>
//                         <span className="text-gray-400 dark:text-slate-500"> / {comp.total}</span>
//                       </div>
//                       <div className="col-span-2">
//                         <div className="flex items-center gap-2">
//                           <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
//                             <div 
//                               className={`h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
//                               style={{ width: `${comp.percentage}%` }}
//                             />
//                           </div>
//                           <span className="text-sm font-bold text-gray-600 dark:text-slate-400 w-10 text-right">
//                             {comp.percentage}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* History Tab */}
//           {resultViewTab === 'history' && (
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
//                 <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
//                   <History size={18} className="text-purple-600 dark:text-purple-400" /> 
//                   Assessment History for {result.employeeName}
//                 </h3>
//                 {loadingHistory && <Loader2 className="animate-spin text-purple-600 dark:text-purple-400" size={20} />}
//               </div>
              
//               {loadingHistory ? (
//                 <div className="p-12 text-center">
//                   <Loader2 className="animate-spin text-purple-600 dark:text-purple-400 mx-auto" size={32} />
//                   <p className="text-gray-500 dark:text-slate-400 mt-4">Loading history...</p>
//                 </div>
//               ) : employeeHistory.length === 0 ? (
//                 <div className="p-12 text-center">
//                   <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <History size={32} className="text-gray-400 dark:text-slate-500" />
//                   </div>
//                   <h4 className="font-bold text-gray-700 dark:text-slate-300">No Previous Assessments</h4>
//                   <p className="text-gray-500 dark:text-slate-400 mt-1">This is the first assessment for this employee.</p>
//                 </div>
//               ) : (
//                 <div className="divide-y divide-gray-100 dark:divide-slate-800">
//                   <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-slate-700">
//                     <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Competency</div>
//                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Previous Level</div>
//                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Current Level</div>
//                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Change</div>
//                     <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-right">Date</div>
//                   </div>
//                   {employeeHistory.map((record, idx) => {
//                     const currentComp = result.competencies.find(c => c.competency_id === record.competency_id);
//                     const currentLevel = currentComp?.level || 0;
//                     const previousLevel = record.achieved_level.level;
//                     const change = currentLevel - previousLevel;
//                     const prevConfig = getLevelConfig(previousLevel);
//                     const currConfig = getLevelConfig(currentLevel);
                    
//                     return (
//                       <div 
//                         key={record.id} 
//                         className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
//                       >
//                         <div className="col-span-4 font-semibold text-gray-800 dark:text-slate-200">
//                           {record.competency_name || `Competency ${record.competency_id}`}
//                         </div>
//                         <div className="col-span-2">
//                           <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${prevConfig.bgLight} ${prevConfig.text}`}>
//                             L{previousLevel}
//                           </span>
//                         </div>
//                         <div className="col-span-2">
//                           {currentLevel > 0 ? (
//                             <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${currConfig.bgLight} ${currConfig.text}`}>
//                               L{currentLevel}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 dark:text-slate-500 text-sm">N/A</span>
//                           )}
//                         </div>
//                         <div className="col-span-2">
//                           {currentLevel > 0 && (
//                             <span className={`inline-flex items-center gap-1 text-sm font-bold ${
//                               change > 0 ? 'text-emerald-600 dark:text-emerald-400' : change < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-slate-400'
//                             }`}>
//                               {change > 0 ? (
//                                 <><ChevronUp size={16} /> +{change}</>
//                               ) : change < 0 ? (
//                                 <><TrendingDown size={16} /> {change}</>
//                               ) : (
//                                 <><Minus size={16} /> No change</>
//                               )}
//                             </span>
//                           )}
//                         </div>
//                         <div className="col-span-2 text-right text-gray-500 dark:text-slate-400 text-sm">
//                           {new Date(record.date).toLocaleDateString(undefined, { 
//                             year: 'numeric', 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="max-w-7xl mx-auto px-6 pb-8">
//           <div className="flex gap-4 justify-center">
//             <button 
//               onClick={startNewAssessment}
//               className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none flex items-center gap-2"
//             >
//               <RefreshCw size={20} /> Start New Assessment
//             </button>
//             <button 
//               onClick={() => navigate('/employees')}
//               className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all flex items-center gap-2"
//             >
//               <Users size={20} /> View All Employees
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const currentCategory = filteredCategories[currentStep - 1];
//   const currentCategoryProgress = currentCategory ? {
//     checked: currentCategory.questions.filter(q => checkedItems.has(q.id)).length,
//     total: currentCategory.questions.length
//   } : { checked: 0, total: 0 };

//   // ==========================================
//   // VIEW 3: ADMIN WIZARD
//   // ==========================================
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
//         <div className="max-w-full mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
//                 <Award size={28} />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-black tracking-tight">Skill Assessment Wizard</h1>
//                 <p className="text-white/70 text-sm">Evaluate employee competencies step by step</p>
//               </div>
//             </div>
            
//             {currentStep === 0 && (
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
//                   <Users size={18} />
//                   <span className="font-bold">{employees.length}</span>
//                   <span className="text-white/70 text-sm">Employees</span>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
//                   <Layers size={18} />
//                   <span className="font-bold">{rules.length}</span>
//                   <span className="text-white/70 text-sm">Rules</span>
//                 </div>
//               </div>
//             )}

//             {currentStep > 0 && (
//               <div className="flex items-center gap-4">
//                 <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
//                   <span className="text-white/70 text-sm">Candidate: </span>
//                   <span className="font-bold">{employeeName}</span>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
//                   <PieChart size={18} />
//                   <span className="font-bold">{totalPoints.percentage}%</span>
//                   <span className="text-white/70 text-sm">Score</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Progress Steps */}
//           {currentStep > 0 && (
//             <div className="mt-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="text-sm text-white/70">Progress:</span>
//                 <span className="text-sm font-bold">Section {currentStep} of {filteredCategories.length}</span>
//               </div>
//               <div className="flex gap-1">
//                 {filteredCategories.map((_, idx) => (
//                   <div 
//                     key={idx} 
//                     className={`h-2 flex-1 rounded-full transition-all duration-300 ${
//                       idx < currentStep ? 'bg-white' : 
//                       idx === currentStep ? 'bg-white/50' : 'bg-white/20'
//                     }`}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-full mx-auto px-6 py-6">
//         {currentStep === 0 ? (
//           <div className="space-y-6">
//             {/* Hierarchy Selection */}
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
//                   <h2 className="font-bold text-gray-800 dark:text-white">Organization Hierarchy</h2>
//                   {selectedHQ && (
//                     <span className="text-sm text-gray-500 dark:text-slate-400 ml-2">
//                       → {getSelectionSummary()}
//                     </span>
//                   )}
//                 </div>
//                 <button 
//                   onClick={resetHierarchy}
//                   className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
//                 >
//                   <RefreshCw size={14} /> Reset
//                 </button>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                   <Dropdown 
//                     label="HQ" 
//                     icon={<Building2 size={14}/>} 
//                     value={selectedHQ} 
//                     options={hqs} 
//                     onChange={(v: string) => { setSelectedHQ(v); setSelectedBU(''); setSelectedDept(''); setSelectedSection(''); setSelectedDesignation(''); }} 
//                     highlight={!!matchedRule && ruleMatchLevel === 'HQ'}
//                   />
//                   <Dropdown 
//                     label="Business Unit" 
//                     icon={<Briefcase size={14}/>} 
//                     value={selectedBU} 
//                     options={filteredBUs} 
//                     onChange={(v: string) => { setSelectedBU(v); setSelectedDept(''); setSelectedSection(''); setSelectedDesignation(''); }} 
//                     disabled={!selectedHQ} 
//                     optional={canSelectEmployees}
//                     highlight={!!matchedRule && ruleMatchLevel === 'Business Unit'}
//                   />
//                   <Dropdown 
//                     label="Department" 
//                     icon={<Layers size={14}/>} 
//                     value={selectedDept} 
//                     options={filteredDepts} 
//                     onChange={(v: string) => { setSelectedDept(v); setSelectedSection(''); setSelectedDesignation(''); }} 
//                     disabled={!selectedBU} 
//                     optional={canSelectEmployees}
//                     highlight={!!matchedRule && ruleMatchLevel === 'Department'}
//                   />
//                   <Dropdown 
//                     label="Section" 
//                     icon={<MapIcon size={14}/>} 
//                     value={selectedSection} 
//                     options={filteredSections} 
//                     onChange={(v: string) => { setSelectedSection(v); setSelectedDesignation(''); }} 
//                     disabled={!selectedDept} 
//                     optional={canSelectEmployees}
//                     highlight={!!matchedRule && ruleMatchLevel === 'Section'}
//                   />
//                   <Dropdown 
//                     label="Designation" 
//                     icon={<UserCheck size={14}/>} 
//                     value={selectedDesignation} 
//                     options={filteredDesignations} 
//                     onChange={setSelectedDesignation} 
//                     disabled={!selectedSection} 
//                     optional={canSelectEmployees}
//                     highlight={!!matchedRule && ruleMatchLevel === 'Designation'}
//                   />
//                 </div>

//                 {/* Rule Status Messages */}
//                 {selectedHQ && !matchedRule && (
//                   <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
//                     <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
//                     <div>
//                       <p className="font-bold text-amber-800 dark:text-amber-400">No Competency Rule Found</p>
//                       <p className="text-amber-700 dark:text-amber-500 text-sm mt-1">There's no active rule matching your current selection. Try selecting more specific hierarchy levels or check if a rule exists for this path.</p>
//                     </div>
//                   </div>
//                 )}

//                 {matchedRule && (
//                   <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-start gap-3">
//                     <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <p className="font-bold text-emerald-800 dark:text-emerald-400">Rule Matched at {ruleMatchLevel} Level</p>
//                         <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded-full">
//                           {filteredCategories.length} Categories • {filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0)} Questions
//                         </span>
//                       </div>
//                       <p className="text-emerald-700 dark:text-emerald-500 text-sm mt-1">
//                         You can now select an employee to begin the assessment. 
//                         {ruleMatchLevel !== 'Designation' && ' You may also continue to narrow down the hierarchy for more specific rules.'}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Employee Selection */}
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
//               <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Users className="text-blue-600 dark:text-blue-400" size={20} />
//                   <h2 className="font-bold text-gray-800 dark:text-white">Select Employee</h2>
//                   <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${canSelectEmployees ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
//                     {filteredEmployeesList.length} available
//                   </span>
//                   {!canSelectEmployees && selectedHQ && (
//                     <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
//                       <AlertTriangle size={12} /> Match a rule first
//                     </span>
//                   )}
//                 </div>
//                 <div className="relative w-72">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
//                   <input 
//                     type="text" 
//                     value={searchQuery} 
//                     onChange={(e) => setSearchQuery(e.target.value)} 
//                     placeholder="Search employees..." 
//                     className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
//                   />
//                 </div>
//               </div>
//               <div className="p-6">
//                 {!selectedHQ ? (
//                   <div className="text-center py-12 text-gray-500 dark:text-slate-400">
//                     <Building2 size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
//                     <p className="font-medium">Select a hierarchy level to see employees</p>
//                     <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Start by selecting at least the HQ</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
//                     {filteredEmployeesList.map(emp => {
//                       const isDisabled = !canSelectEmployees;
//                       return (
//                         <button 
//                           key={emp.id} 
//                           disabled={isDisabled}
//                           onClick={() => { 
//                             setSelectedEmployeeId(emp.id); 
//                             setEmployeeName(emp.name); 
//                             setEmployeeDesignation(emp.designation);
//                             setCurrentStep(1); 
//                           }} 
//                           className={`p-4 rounded-xl border-2 text-left transition-all relative group ${
//                             isDisabled 
//                               ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800' 
//                               : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md active:scale-[0.98]'
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                               {emp.name.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="font-bold text-gray-800 dark:text-white truncate">{emp.name}</div>
//                               <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{emp.designation}</div>
//                             </div>
//                             <ChevronRight className={`text-gray-300 dark:text-slate-600 transition-all ${!isDisabled ? 'group-hover:text-blue-500 group-hover:translate-x-1' : ''}`} size={18} />
//                           </div>
//                         </button>
//                       );
//                     })}
//                     {filteredEmployeesList.length === 0 && (
//                       <div className="col-span-full text-center py-8 text-gray-500 dark:text-slate-400">
//                         No employees found matching your search.
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Assessment Questions
//           <div className="max-w-4xl mx-auto space-y-6">
//             {/* Category Header */}
//             <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
//               <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="bg-white/20 backdrop-blur text-xs font-bold uppercase px-3 py-1 rounded-full">
//                       Section {currentStep} of {filteredCategories.length}
//                     </span>
//                     <h2 className="text-2xl font-black mt-3">{currentCategory?.name}</h2>
//                     <p className="text-white/70 mt-1">{currentCategory?.questions.length} questions to evaluate</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-4xl font-black">{currentCategoryProgress.checked}/{currentCategoryProgress.total}</div>
//                     <div className="text-white/70 text-sm">Completed</div>
//                   </div>
//                 </div>
//                 <div className="mt-4 bg-white/20 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-300"
//                     style={{ width: `${(currentCategoryProgress.checked / currentCategoryProgress.total) * 100}%` }}
//                   />
//                 </div>
//               </div>
//               <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
//                   <UserCheck size={16} />
//                   <span>Evaluating: <strong className="text-gray-800 dark:text-white">{employeeName}</strong></span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button 
//                     onClick={handleSelectAll}
//                     className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
//                   >
//                     <CheckCheck size={14} /> Select All
//                   </button>
//                   <button 
//                     onClick={handleDeselectAll}
//                     className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
//                   >
//                     <XCircle size={14} /> Clear All
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Questions */}
//             <div className="space-y-3">
//               {currentCategory?.questions.map((q, idx) => (
//                 <label 
//                   key={q.id} 
//                   className={`flex items-center gap-5 p-5 rounded-xl cursor-pointer transition-all border-2 group ${
//                     checkedItems.has(q.id) 
//                       ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-400 dark:border-purple-500 shadow-sm' 
//                       : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
//                   }`}
//                   style={{ animationDelay: `${idx * 50}ms` }}
//                 >
//                   <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
//                     checkedItems.has(q.id) 
//                       ? 'bg-purple-600 border-purple-600 dark:bg-purple-500 dark:border-purple-500' 
//                       : 'border-gray-300 dark:border-slate-600 group-hover:border-purple-400'
//                   }`}>
//                     {checkedItems.has(q.id) && <CheckCircle2 size={18} className="text-white" />}
//                   </div>
//                   <input 
//                     type="checkbox" 
//                     checked={checkedItems.has(q.id)} 
//                     onChange={() => {
//                       const n = new Set(checkedItems);
//                       n.has(q.id) ? n.delete(q.id) : n.add(q.id);
//                       setCheckedItems(n);
//                     }} 
//                     className="sr-only" 
//                   />
//                   <span className={`flex-1 font-medium transition-colors ${checkedItems.has(q.id) ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-slate-300'}`}>
//                     {q.question}
//                   </span>
//                   <div className={`text-right px-3 py-1.5 rounded-lg transition-all ${
//                     checkedItems.has(q.id) 
//                       ? 'bg-purple-600 dark:bg-purple-500 text-white' 
//                       : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
//                   }`}>
//                     <span className="font-bold">+{q.points}</span>
//                     <span className="text-xs ml-1">pts</span>
//                   </div>
//                 </label>
//               ))}
//             </div>

//             {/* Navigation */}
//             <div className="flex gap-4 pt-4 sticky bottom-6">
//               <button 
//                 onClick={() => setCurrentStep(s => s - 1)} 
//                 className="px-6 py-4 bg-white dark:bg-slate-900 rounded-xl font-bold border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition flex items-center gap-2 text-gray-700 dark:text-slate-300"
//               >
//                 <ArrowLeft size={18} /> Previous
//               </button>
//               {currentStep < filteredCategories.length ? (
//                 <button 
//                   onClick={() => setCurrentStep(s => s + 1)} 
//                   className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
//                 >
//                   Next Section <ChevronRight size={20} />
//                 </button>
//               ) : (
//                 <button 
//                   onClick={handleSubmit} 
//                   disabled={isSubmitting} 
//                   className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-200 dark:shadow-none"
//                 >
//                   {isSubmitting ? (
//                     <><Loader2 className="animate-spin" size={20} /> Saving...</>
//                   ) : (
//                     <><Save size={20} /> Complete Assessment</>
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- COMPONENTS ---
// const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
//   <div className={`${color} backdrop-blur rounded-xl p-4 flex items-center gap-3`}>
//     <div className="text-white/80">{icon}</div>
//     <div>
//       <div className="text-2xl font-black text-white">{value}</div>
//       <div className="text-xs text-white/70">{label}</div>
//     </div>
//   </div>
// );

// const FilterPill = ({ active, onClick, label, count, color }: { active: boolean; onClick: () => void; label: string; count?: number; color?: string }) => (
//   <button
//     onClick={onClick}
//     className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
//       active 
//         ? 'bg-purple-600 text-white shadow-md' 
//         : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400'
//     }`}
//   >
//     {color && <div className={`w-2 h-2 rounded-full ${color}`} />}
//     {label}
//     {count !== undefined && <span className={`text-xs ${active ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>({count})</span>}
//   </button>
// );

// const CompetencyCard = ({ comp, index }: { comp: CompetencyRecord; index: number }) => {
//   const levelColors = {
//     5: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
//     4: { bg: 'from-green-500 to-emerald-600', light: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
//     3: { bg: 'from-amber-500 to-yellow-600', light: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
//     2: { bg: 'from-orange-500 to-amber-600', light: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
//     1: { bg: 'from-rose-500 to-red-600', light: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
//   };
//   const colors = levelColors[comp.achieved_level.level as keyof typeof levelColors] || levelColors[1];

//   return (
//     <div 
//       className={`bg-white dark:bg-slate-900 rounded-2xl border ${colors.border} overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
//       style={{ animationDelay: `${index * 50}ms` }}
//     >
//       <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
//         <div className="flex items-center justify-between">
//           <div className="p-2 bg-white/20 rounded-lg">
//             <Star size={20} fill="currentColor" />
//           </div>
//           <div className="text-right">
//             <div className="text-3xl font-black">L{comp.achieved_level.level}</div>
//             <div className="text-xs text-white/70 uppercase">{comp.achieved_level.title}</div>
//           </div>
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
//           {comp.competency_name || `Skill #${comp.competency_id}`}
//         </h3>
        
//         <div className="flex items-center gap-1 mb-3">
//           {[1, 2, 3, 4, 5].map((level) => (
//             <div 
//               key={level} 
//               className={`h-2 flex-1 rounded-full transition-all ${
//                 level <= comp.achieved_level.level 
//                   ? `bg-gradient-to-r ${colors.bg}` 
//                   : 'bg-gray-200 dark:bg-slate-700'
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex items-center justify-between text-sm">
//           <div className={`${colors.light} ${colors.text} px-2 py-1 rounded-lg font-medium text-xs`}>
//             {comp.score} points
//           </div>
//           <div className="text-gray-400 dark:text-slate-500 text-xs flex items-center gap-1">
//             <Calendar size={12} />
//             {new Date(comp.date).toLocaleDateString()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LevelBadge = ({ level }: { level: number }) => {
//   const config = getLevelConfig(level);
//   return (
//     <span className={`${config.bgLight} ${config.text} px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-current" />
//       L{level} • {config.title}
//     </span>
//   );
// };

// const Dropdown = ({ label, icon, value, options, onChange, disabled, optional, highlight }: any) => (
//   <div className={`transition-all ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
//     <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
//       {icon} {label}
//       {optional && !disabled && (
//         <span className="text-emerald-500 font-normal lowercase ml-1">(optional)</span>
//       )}
//     </label>
//     <div className="relative">
//       <select 
//         value={value} 
//         onChange={(e) => onChange(e.target.value)} 
//         className={`w-full border rounded-xl px-4 py-3 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none cursor-pointer transition-all appearance-none hover:border-purple-300 dark:hover:border-purple-600 dark:bg-slate-900 ${
//           highlight 
//             ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900/50' 
//             : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
//         }`}
//       >
//         <option value="">Select {label}</option>
//         {options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
//       </select>
//       <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
//       {highlight && (
//         <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500" />
//       )}
//     </div>
//   </div>
// );

// const getLevelBgColor = (level: number) => {
//     if (level >= 4) return "bg-emerald-100 dark:bg-emerald-900/30";
//     if (level >= 3) return "bg-amber-100 dark:bg-amber-900/30";
//     return "bg-rose-100 dark:bg-rose-900/30";
// }

// const getLevelTextColor = (level: number) => {
//     if (level >= 4) return "text-emerald-600 dark:text-emerald-400";
//     if (level >= 3) return "text-amber-600 dark:text-amber-400";
//     return "text-rose-600 dark:text-rose-400";
// }

// export default CompetencySystem;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Loader2, CheckCircle2, Building2, Briefcase, Layers,
  AlertTriangle, UserCheck, Map as MapIcon, ChevronRight, Save, ArrowLeft,
  LayoutDashboard, Star, TrendingUp, ShieldCheck, History, Calendar,
  Award, Target, Zap, Users, ChevronDown, Filter, RefreshCw, Download,
  BarChart3, PieChart, Clock, CheckCheck, XCircle, Info, Sparkles,
  Trophy, Medal, ArrowRight, Eye, Printer, FileText, TrendingDown,
  Minus, ChevronUp
} from 'lucide-react';
import { normalizeListResponse } from '../../utils/api';
import { hasAnyModuleAction } from '../../components/constants/permissions';

const API_BASE = 'http://127.0.0.1:8000/lms';

// --- UTILS ---
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

const getAuthUser = () => {
  try {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).user ?? null : null;
  } catch (e) {
    return null;
  }
};

// Level Configuration with Dark Mode Classes
const LEVEL_CONFIG = {
  5: { 
      title: 'Expert', 
      color: 'emerald', 
      bg: 'bg-emerald-500', 
      bgLight: 'bg-emerald-100 dark:bg-emerald-900/30', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      border: 'border-emerald-200 dark:border-emerald-800', 
      gradient: 'from-emerald-500 to-green-600', 
      icon: Trophy 
  },
  4: { 
      title: 'Advanced', 
      color: 'green', 
      bg: 'bg-green-500', 
      bgLight: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-600 dark:text-green-400', 
      border: 'border-green-200 dark:border-green-800', 
      gradient: 'from-green-500 to-emerald-600', 
      icon: Award 
  },
  3: { 
      title: 'Intermediate', 
      color: 'amber', 
      bg: 'bg-amber-500', 
      bgLight: 'bg-amber-100 dark:bg-amber-900/30', 
      text: 'text-amber-600 dark:text-amber-400', 
      border: 'border-amber-200 dark:border-amber-800', 
      gradient: 'from-amber-500 to-yellow-600', 
      icon: Medal 
  },
  2: { 
      title: 'Basic', 
      color: 'orange', 
      bg: 'bg-orange-500', 
      bgLight: 'bg-orange-100 dark:bg-orange-900/30', 
      text: 'text-orange-600 dark:text-orange-400', 
      border: 'border-orange-200 dark:border-orange-800', 
      gradient: 'from-orange-500 to-amber-600', 
      icon: Target 
  },
  1: { 
      title: 'Beginner', 
      color: 'rose', 
      bg: 'bg-rose-500', 
      bgLight: 'bg-rose-100 dark:bg-rose-900/30', 
      text: 'text-rose-600 dark:text-rose-400', 
      border: 'border-rose-200 dark:border-rose-800', 
      gradient: 'from-rose-500 to-red-600', 
      icon: Zap 
  },
};

const getLevelConfig = (level: number) => LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG[1];
const normalizeValue = (value?: string | null) => (value || '').trim().toLowerCase();

// --- INTERFACES ---
interface HierarchyNode { id: number; name: string; org_type: string; parent: number | null; }
interface Rule { 
  id: number; hq: string; business_unit: string | null; department: string | null; 
  section: string | null; designation: string | null; is_active: boolean; 
  rule_competencies: Array<{ competency: number; competency_name: string }>;
}
interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  hq?: string | null;
  business_unit?: string | null;
  department?: string | null;
  section?: string | null;
}
interface Question { id: string; question: string; points: number; competency_id: number; }
interface Category { name: string; questions: Question[]; }

interface CompetencyRecord {
    id: number;
    employee_name: string;
    competency_id: number; 
    competency_name: string; 
    user_id?: number;
    employee_id?: number;
    achieved_level: {
        level: number;
        title: string;
        color: string;
    };
    score: number;
    date: string;
}

interface CompetencyResult {
  competency_id: number;
  competency_name: string;
  category_name: string;
  level: number;
  score: number;
  total: number;
  percentage: number;
  questionsAnswered: number;
  totalQuestions: number;
}

interface AssessmentResult {
  employeeId: number;
  employeeName: string;
  designation: string;
  date: string;
  overallScore: number;
  overallTotal: number;
  overallPercentage: number;
  averageLevel: number;
  competencies: CompetencyResult[];
  levelDistribution: { [key: number]: number };
}

const CompetencySystem: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const authUser = useMemo(() => getAuthUser(), []);
  const canManageAssessments = useMemo(
    () =>
      hasAnyModuleAction(
        authUser,
        ['level_assessment', 'assessments'],
        ['create', 'update', 'delete', 'approve', 'manage'],
      ),
    [authUser],
  );

  // --- DATA STATES ---
  const [myCompetencies, setMyCompetencies] = useState<CompetencyRecord[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'history'>('cards');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  // --- ADMIN STATES ---
  const [hqs, setHqs] = useState<HierarchyNode[]>([]);
  const [bus, setBus] = useState<HierarchyNode[]>([]);
  const [departments, setDepartments] = useState<HierarchyNode[]>([]);
  const [sections, setSections] = useState<HierarchyNode[]>([]);
  const [designations, setDesignations] = useState<HierarchyNode[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
   
  const [selectedHQ, setSelectedHQ] = useState<string>('');
  const [selectedBU, setSelectedBU] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDesignation, setSelectedDesignation] = useState<string>('');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeDesignation, setEmployeeDesignation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0); 
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- RESULT STATES ---
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [employeeHistory, setEmployeeHistory] = useState<CompetencyRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [resultViewTab, setResultViewTab] = useState<'overview' | 'details' | 'history'>('overview');

  // --- INITIAL LOAD ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        if (!canManageAssessments) {
            const res = await fetch(`${API_BASE}/assessment-history/`, { headers: getAuthHeaders() });
            if(res.ok) {
                const data = await res.json();
                setMyCompetencies(Array.isArray(data) ? data : []);
            }
        } else {
            const fetchSafe = async (url: string) => {
                const res = await fetch(url, { headers: getAuthHeaders() });
                return res.ok ? res.json() : [];
            };

            const [orgData, ruleData, empData, quesData] = await Promise.all([
                fetchSafe(`${API_BASE}/organization/`),
                fetchSafe(`${API_BASE}/rules/`),
                fetchSafe(`${API_BASE}/assignments/employees/`),
                fetchSafe(`${API_BASE}/library/assessment_structure/`)
            ]);

            const safeOrgData = normalizeListResponse<any>(orgData);
            const safeRuleData = normalizeListResponse<any>(ruleData);
            const safeQuestionData = normalizeListResponse<any>(quesData);
            const safeEmployeeData = normalizeListResponse<any>(empData);

            if (safeOrgData.length > 0) {
                setHqs(safeOrgData.filter((n: any) => n.org_type === 'hq'));
                setBus(safeOrgData.filter((n: any) => n.org_type === 'bu'));
                setDepartments(safeOrgData.filter((n: any) => n.org_type === 'dept'));
                setSections(safeOrgData.filter((n: any) => n.org_type === 'section'));
                setDesignations(safeOrgData.filter((n: any) => n.org_type === 'designation'));
            }

            setRules(safeRuleData);
            setCategories(safeQuestionData);
            if (safeEmployeeData.length > 0) {
                setEmployees(safeEmployeeData.map((e: any) => ({
                    id: e.id,
                    name: e.name || e.email, 
                    email: e.email,
                    designation: e.designation || 'Staff',
                    hq: e.hq ?? e.hq_name ?? null,
                    business_unit: e.business_unit ?? e.businessUnit ?? e.bu ?? e.bu_name ?? null,
                    department: e.department ?? e.department_name ?? null,
                    section: e.section ?? e.section_name ?? null
                })));
            } else {
                setEmployees([]);
            }
        }
      } catch (err) { 
          console.error("Data Load Error:", err); 
      } finally { 
          setLoading(false); 
      }
    };
    initData();
  }, [canManageAssessments]);

  // --- DATA PROCESSING ---
  const sortedHistory = useMemo(() => {
    return [...myCompetencies].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [myCompetencies]);

  const uniqueLatestCompetencies = useMemo(() => {
    const latestMap = new Map();
    sortedHistory.forEach(record => {
        const key = record.competency_id || record.competency_name;
        if (key && !latestMap.has(key)) {
            latestMap.set(key, record);
        }
    });
    return Array.from(latestMap.values());
  }, [sortedHistory]);

  const filteredCompetencies = useMemo(() => {
    if (levelFilter === null) return uniqueLatestCompetencies;
    return uniqueLatestCompetencies.filter(c => c.achieved_level.level === levelFilter);
  }, [uniqueLatestCompetencies, levelFilter]);

  const stats = useMemo(() => {
    const total = uniqueLatestCompetencies.length;
    const expert = uniqueLatestCompetencies.filter(c => c.achieved_level.level >= 4).length;
    const intermediate = uniqueLatestCompetencies.filter(c => c.achieved_level.level === 3).length;
    const beginner = uniqueLatestCompetencies.filter(c => c.achieved_level.level <= 2).length;
    const avgLevel = total > 0 ? (uniqueLatestCompetencies.reduce((sum, c) => sum + c.achieved_level.level, 0) / total).toFixed(1) : '0';
    return { total, expert, intermediate, beginner, avgLevel };
  }, [uniqueLatestCompetencies]);

  // --- ADMIN FILTERING ---
  const filteredBUs = useMemo(() => bus.filter(b => String(b.parent) === selectedHQ), [selectedHQ, bus]);
  const filteredDepts = useMemo(() => departments.filter(d => String(d.parent) === selectedBU), [selectedBU, departments]);
  const filteredSections = useMemo(() => sections.filter(s => String(s.parent) === selectedDept), [selectedDept, sections]);
  const filteredDesignations = useMemo(() => designations, [designations]);

  const { filteredCategories, matchedRule, ruleMatchLevel } = useMemo(() => {
    if (!selectedHQ) return { filteredCategories: [], matchedRule: null, ruleMatchLevel: '' };
     
    const hqN = hqs.find(h => String(h.id) === selectedHQ)?.name || null;
    const buN = selectedBU ? bus.find(b => String(b.id) === selectedBU)?.name : null;
    const deptN = selectedDept ? departments.find(d => String(d.id) === selectedDept)?.name : null;
    const secN = selectedSection ? sections.find(s => String(s.id) === selectedSection)?.name : null;
    const desN = selectedDesignation ? designations.find(des => String(des.id) === selectedDesignation)?.name : null;

    const findMatchingRule = () => {
      const matches: Array<{ rule: Rule; level: string; specificity: number }> = [];

      for (const r of rules) {
        if (!r.is_active) continue;
        if (r.hq !== hqN) continue;

        const ruleHasBU = r.business_unit && r.business_unit.trim() !== '';
        const ruleHasDept = r.department && r.department.trim() !== '';
        const ruleHasSection = r.section && r.section.trim() !== '';
        const ruleHasDesignation = r.designation && r.designation.trim() !== '';

        if (ruleHasBU && r.business_unit !== buN) continue;
        if (ruleHasDept && r.department !== deptN) continue;
        if (ruleHasSection && r.section !== secN) continue;
        if (ruleHasDesignation && r.designation !== desN) continue;

        let level = 'HQ';
        if (ruleHasDesignation) level = 'Designation';
        else if (ruleHasSection) level = 'Section';
        else if (ruleHasDept) level = 'Department';
        else if (ruleHasBU) level = 'Business Unit';

        const specificity =
          (ruleHasBU ? 1 : 0) +
          (ruleHasDept ? 1 : 0) +
          (ruleHasSection ? 1 : 0) +
          (ruleHasDesignation ? 1 : 0);

        matches.push({ rule: r, level, specificity });
      }

      if (matches.length === 0) return null;

      matches.sort((a, b) => b.specificity - a.specificity || b.rule.id - a.rule.id);
      return matches[0];
    };

    const match = findMatchingRule();
     
    if (!match) return { filteredCategories: [], matchedRule: null, ruleMatchLevel: '' };

    const allowedCompIds = match.rule.rule_competencies.map(rc => rc.competency);
    const cats = categories.map(cat => ({
      ...cat,
      questions: cat.questions.filter(q => allowedCompIds.includes(q.competency_id))
    })).filter(cat => cat.questions.length > 0);

    return { 
      filteredCategories: cats, 
      matchedRule: match.rule, 
      ruleMatchLevel: match.level 
    };
  }, [selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, rules, categories, hqs, bus, departments, sections, designations]);

  const filteredEmployeesList = useMemo(() => {
    const search = normalizeValue(searchQuery);
    const selectedHQName = hqs.find(h => String(h.id) === selectedHQ)?.name || null;
    const selectedBUName = bus.find(b => String(b.id) === selectedBU)?.name || null;
    const selectedDeptName = departments.find(d => String(d.id) === selectedDept)?.name || null;
    const selectedSectionName = sections.find(s => String(s.id) === selectedSection)?.name || null;
    const selectedDesignationName = designations.find(d => String(d.id) === selectedDesignation)?.name || null;

    return employees.filter(emp => {
      const matchesSearch =
        !search ||
        normalizeValue(emp.name).includes(search) ||
        normalizeValue(emp.email).includes(search) ||
        normalizeValue(emp.designation).includes(search);

      const matchesHQ = !selectedHQName || !emp.hq || normalizeValue(emp.hq) === normalizeValue(selectedHQName);
      const matchesBU = !selectedBUName || !emp.business_unit || normalizeValue(emp.business_unit) === normalizeValue(selectedBUName);
      const matchesDept = !selectedDeptName || !emp.department || normalizeValue(emp.department) === normalizeValue(selectedDeptName);
      const matchesSection = !selectedSectionName || !emp.section || normalizeValue(emp.section) === normalizeValue(selectedSectionName);
      const matchesDesignation =
        !selectedDesignationName ||
        !emp.designation ||
        normalizeValue(emp.designation) === normalizeValue(selectedDesignationName);

      return matchesSearch && matchesHQ && matchesBU && matchesDept && matchesSection && matchesDesignation;
    });
  }, [employees, searchQuery, selectedHQ, selectedBU, selectedDept, selectedSection, selectedDesignation, hqs, bus, departments, sections, designations]);

  const totalPoints = useMemo(() => {
    let total = 0;
    let achieved = 0;
    filteredCategories.forEach(cat => cat.questions.forEach(q => {
      total += q.points;
      if (checkedItems.has(q.id)) achieved += q.points;
    }));
    return { total, achieved, percentage: total > 0 ? Math.round((achieved / total) * 100) : 0 };
  }, [filteredCategories, checkedItems]);

  const canSelectEmployees = selectedHQ && filteredCategories.length > 0;

  const getSelectionSummary = () => {
    const parts = [];
    if (selectedHQ) parts.push(hqs.find(h => String(h.id) === selectedHQ)?.name);
    if (selectedBU) parts.push(bus.find(b => String(b.id) === selectedBU)?.name);
    if (selectedDept) parts.push(departments.find(d => String(d.id) === selectedDept)?.name);
    if (selectedSection) parts.push(sections.find(s => String(s.id) === selectedSection)?.name);
    if (selectedDesignation) parts.push(designations.find(des => String(des.id) === selectedDesignation)?.name);
    return parts.filter(Boolean).join(' → ');
  };

  // --- CALCULATE DETAILED RESULTS ---
  const calculateResults = (): AssessmentResult => {
    const competencyMap: { [key: number]: CompetencyResult } = {};
     
    // Get competency names from the matched rule
    const competencyNames: { [key: number]: string } = {};
    if (matchedRule) {
      matchedRule.rule_competencies.forEach(rc => {
        competencyNames[rc.competency] = rc.competency_name;
      });
    }

    // Process each category and question
    filteredCategories.forEach(cat => {
      cat.questions.forEach(q => {
        if (!competencyMap[q.competency_id]) {
          competencyMap[q.competency_id] = {
            competency_id: q.competency_id,
            competency_name: competencyNames[q.competency_id] || `Competency ${q.competency_id}`,
            category_name: cat.name,
            level: 0,
            score: 0,
            total: 0,
            percentage: 0,
            questionsAnswered: 0,
            totalQuestions: 0
          };
        }
         
        competencyMap[q.competency_id].total += q.points;
        competencyMap[q.competency_id].totalQuestions += 1;
         
        if (checkedItems.has(q.id)) {
          competencyMap[q.competency_id].score += q.points;
          competencyMap[q.competency_id].questionsAnswered += 1;
        }
      });
    });

    // Calculate levels and percentages
    const competencies = Object.values(competencyMap).map(comp => {
      const pct = comp.total > 0 ? (comp.score / comp.total) * 100 : 0;
      let level = 1;
      if (pct > 80) level = 5;
      else if (pct > 60) level = 4;
      else if (pct > 40) level = 3;
      else if (pct > 20) level = 2;
       
      return {
        ...comp,
        percentage: Math.round(pct),
        level
      };
    });

    // Sort by level (highest first), then by score
    competencies.sort((a, b) => b.level - a.level || b.percentage - a.percentage);

    // Calculate level distribution
    const levelDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    competencies.forEach(c => {
      levelDistribution[c.level] = (levelDistribution[c.level] || 0) + 1;
    });

    // Calculate overall stats
    const overallScore = competencies.reduce((sum, c) => sum + c.score, 0);
    const overallTotal = competencies.reduce((sum, c) => sum + c.total, 0);
    const overallPercentage = overallTotal > 0 ? Math.round((overallScore / overallTotal) * 100) : 0;
    const averageLevel = competencies.length > 0 
      ? Math.round((competencies.reduce((sum, c) => sum + c.level, 0) / competencies.length) * 10) / 10 
      : 0;

    return {
      employeeId: selectedEmployeeId!,
      employeeName,
      designation: employeeDesignation,
      date: new Date().toISOString(),
      overallScore,
      overallTotal,
      overallPercentage,
      averageLevel,
      competencies,
      levelDistribution
    };
  };

  // --- FETCH EMPLOYEE HISTORY (UPDATED) ---
  const fetchEmployeeHistory = async (employeeId: number) => {
    setLoadingHistory(true);
    try {
      let url = `${API_BASE}/assessment-history/`;
      if (canManageAssessments) {
          url += `?user_id=${employeeId}`;
      }

      const res = await fetch(url, { 
        headers: getAuthHeaders() 
      });

      if (res.ok) {
        const data = await res.json();
        const historyData = Array.isArray(data) ? data : [];
        
        const filteredHistory = canManageAssessments
            ? historyData.filter((r: any) => r.user_id === employeeId || r.employee_id === employeeId)
            : historyData;

        // Sort new to old
        filteredHistory.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEmployeeHistory(filteredHistory);
      } else {
        setEmployeeHistory([]);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setEmployeeHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId) return alert("Select an employee");
    setIsSubmitting(true);

    const perComp: Record<number, { current: number; total: number }> = {};
    filteredCategories.forEach(cat => cat.questions.forEach(q => {
      if (!perComp[q.competency_id]) perComp[q.competency_id] = { current: 0, total: 0 };
      perComp[q.competency_id].total += q.points;
      if (checkedItems.has(q.id)) perComp[q.competency_id].current += q.points;
    }));

    const results = Object.entries(perComp).map(([compId, score]) => {
      const pct = (score.current / score.total) * 100;
      let level = pct > 80 ? 5 : pct > 60 ? 4 : pct > 40 ? 3 : pct > 20 ? 2 : 1;
      return { competency_id: parseInt(compId), level, score: score.current, total: score.total };
    });

    try {
      const res = await fetch(`${API_BASE}/competency/`, { 
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: selectedEmployeeId, results })
      });

      if (res.ok) {
        // Calculate and set the detailed results
        const resultData = calculateResults();
        setAssessmentResult(resultData);
        
        // IMPORTANT: Fetch updated history immediately so the history tab is populated
        await fetchEmployeeHistory(selectedEmployeeId);
        
        setShowResult(true);
      } else {
          const err = await res.json();
          alert(`Error: ${err.error || 'Failed to save'}`);
      }
    } catch (e) { alert("Network error"); }
    finally { setIsSubmitting(false); }
  };

  const handleSelectAll = () => {
    if (!currentCategory) return;
    const allIds = new Set(checkedItems);
    currentCategory.questions.forEach(q => allIds.add(q.id));
    setCheckedItems(allIds);
  };

  const handleDeselectAll = () => {
    if (!currentCategory) return;
    const newSet = new Set(checkedItems);
    currentCategory.questions.forEach(q => newSet.delete(q.id));
    setCheckedItems(newSet);
  };

  const resetHierarchy = () => {
    setSelectedHQ('');
    setSelectedBU('');
    setSelectedDept('');
    setSelectedSection('');
    setSelectedDesignation('');
  };

  const startNewAssessment = () => {
    setShowResult(false);
    setAssessmentResult(null);
    setEmployeeHistory([]);
    setSelectedEmployeeId(null);
    setEmployeeName('');
    setEmployeeDesignation('');
    setCheckedItems(new Set());
    setCurrentStep(0);
    setResultViewTab('overview');
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-950 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 text-center">
        <div className="relative">
          <Loader2 className="animate-spin text-white w-16 h-16 mx-auto" />
          <Sparkles className="absolute -top-2 -right-2 text-yellow-300 w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mt-6">Loading Your Dashboard</h2>
        <p className="text-white/60 mt-2">Preparing competency data...</p>
        <div className="mt-6 flex justify-center gap-1">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // VIEW 1: EMPLOYEE DASHBOARD
  // ==========================================
  if (!canManageAssessments) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
                <div className="max-w-full mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">My Competency Profile</h1>
                                <p className="text-white/70 mt-1">Track your skills and growth journey</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex bg-white/10 backdrop-blur rounded-xl p-1">
                                <button 
                                    onClick={() => setViewMode('cards')}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-purple-700 shadow-lg dark:bg-slate-800 dark:text-purple-400' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <LayoutDashboard size={16} /> Skills
                                </button>
                                <button 
                                    onClick={() => setViewMode('history')}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'history' ? 'bg-white text-purple-700 shadow-lg dark:bg-slate-800 dark:text-purple-400' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <History size={16} /> History
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {myCompetencies.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
                            <StatCard icon={<Target />} label="Total Skills" value={stats.total} color="bg-white/10" />
                            <StatCard icon={<TrendingUp />} label="Avg Level" value={stats.avgLevel} color="bg-white/10" />
                            <StatCard icon={<Award />} label="Expert (L4-5)" value={stats.expert} color="bg-emerald-500/30" />
                            <StatCard icon={<Zap />} label="Intermediate (L3)" value={stats.intermediate} color="bg-amber-500/30" />
                            <StatCard icon={<Clock />} label="Beginner (L1-2)" value={stats.beginner} color="bg-rose-500/30" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-full mx-auto px-6 py-6">
                {myCompetencies.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LayoutDashboard size={40} className="text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-white">No Assessment Data Yet</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-md mx-auto">Your administrator hasn't completed your competency assessment. Check back soon!</p>
                        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition inline-flex items-center gap-2">
                            <RefreshCw size={18} /> Refresh Page
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Filter Pills */}
                        {viewMode === 'cards' && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                    <Filter size={14} /> Filter by Level:
                                </span>
                                <FilterPill active={levelFilter === null} onClick={() => setLevelFilter(null)} label="All" count={stats.total} />
                                <FilterPill active={levelFilter === 5} onClick={() => setLevelFilter(5)} label="Level 5" color="bg-emerald-500" />
                                <FilterPill active={levelFilter === 4} onClick={() => setLevelFilter(4)} label="Level 4" color="bg-green-500" />
                                <FilterPill active={levelFilter === 3} onClick={() => setLevelFilter(3)} label="Level 3" color="bg-amber-500" />
                                <FilterPill active={levelFilter === 2} onClick={() => setLevelFilter(2)} label="Level 2" color="bg-orange-500" />
                                <FilterPill active={levelFilter === 1} onClick={() => setLevelFilter(1)} label="Level 1" color="bg-rose-500" />
                            </div>
                        )}

                        {/* --- LATEST CARDS --- */}
                        {viewMode === 'cards' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredCompetencies.map((comp, idx) => (
                                    <CompetencyCard key={comp.id} comp={comp} index={idx} />
                                ))}
                                {filteredCompetencies.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-slate-400">
                                        No skills found for this filter.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- HISTORY LIST --- */}
                        {viewMode === 'history' && (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                                    <div className="col-span-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                        <BarChart3 size={14} /> Competency
                                    </div>
                                    <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Level</div>
                                    <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Score</div>
                                    <div className="col-span-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-right">Date</div>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                                    {sortedHistory.map((record, idx) => (
                                        <div 
                                            key={record.id} 
                                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors group"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <div className="col-span-5 flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getLevelBgColor(record.achieved_level.level)}`}>
                                                    <Star size={18} className={getLevelTextColor(record.achieved_level.level)} fill="currentColor" />
                                                </div>
                                                <span className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                                    {record.competency_name || `Skill #${record.competency_id}`}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                <LevelBadge level={record.achieved_level.level} />
                                            </div>
                                            <div className="col-span-2">
                                                <span className="font-mono font-bold text-gray-700 dark:text-slate-300">{record.score}</span>
                                                <span className="text-gray-400 text-sm"> pts</span>
                                            </div>
                                            <div className="col-span-3 text-right text-gray-500 dark:text-slate-400 text-sm flex items-center justify-end gap-2">
                                                <Calendar size={14} />
                                                {new Date(record.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
  }

  // ==========================================
  // VIEW 2: DETAILED RESULT PAGE
  // ==========================================
  if (showResult && assessmentResult) {
    const result = assessmentResult;
    const overallLevelConfig = getLevelConfig(Math.round(result.averageLevel));
    const OverallIcon = overallLevelConfig.icon;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
          <div className="max-w-full mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Assessment Complete</h1>
                  <p className="text-white/70 text-sm">Detailed results for {result.employeeName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition flex items-center gap-2"
                >
                  <Printer size={18} /> Print Report
                </button>
                <button
                  onClick={startNewAssessment}
                  className="px-4 py-2.5 bg-white text-purple-700 dark:bg-slate-800 dark:text-purple-400 rounded-xl font-bold hover:bg-white/90 dark:hover:bg-slate-700 transition flex items-center gap-2"
                >
                  <RefreshCw size={18} /> New Assessment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Summary Card */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col lg:flex-row gap-6">
              {/* Employee Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {result.employeeName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{result.employeeName}</h2>
                  <p className="text-gray-500 dark:text-slate-400">{result.designation || 'Employee'}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-400 dark:text-slate-500">
                    <Calendar size={14} />
                    <span>Assessed on {new Date(result.date).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>

              {/* Overall Level */}
              <div className={`p-4 rounded-2xl ${overallLevelConfig.bgLight} ${overallLevelConfig.border} border flex items-center gap-4`}>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${overallLevelConfig.gradient} flex items-center justify-center text-white`}>
                  <OverallIcon size={28} />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">Overall Level</div>
                  <div className={`text-2xl font-black ${overallLevelConfig.text}`}>
                    Level {result.averageLevel.toFixed(1)}
                  </div>
                  <div className={`text-sm font-medium ${overallLevelConfig.text}`}>
                    {overallLevelConfig.title}
                  </div>
                </div>
              </div>

              {/* Overall Score */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-800 dark:text-white">{result.overallPercentage}%</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Overall Score</div>
                </div>
                <div className="h-16 w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-600 dark:text-purple-400">{result.overallScore}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">of {result.overallTotal} pts</div>
                </div>
                <div className="h-16 w-px bg-gray-200 dark:bg-slate-700" />
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{result.competencies.length}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">Competencies</div>
                </div>
              </div>
            </div>

            {/* Level Distribution Bar */}
            <div className="px-6 pb-6">
              <div className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Level Distribution</div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                {[5, 4, 3, 2, 1].map(level => {
                  const count = result.levelDistribution[level] || 0;
                  const percentage = result.competencies.length > 0 
                    ? (count / result.competencies.length) * 100 
                    : 0;
                  if (percentage === 0) return null;
                  const config = getLevelConfig(level);
                  return (
                    <div
                      key={level}
                      className={`${config.bg} transition-all`}
                      style={{ width: `${percentage}%` }}
                      title={`Level ${level}: ${count} competencies`}
                    />
                  );
                })}
              </div>
              <div className="flex gap-4 mt-2 flex-wrap">
                {[5, 4, 3, 2, 1].map(level => {
                  const count = result.levelDistribution[level] || 0;
                  if (count === 0) return null;
                  const config = getLevelConfig(level);
                  return (
                    <div key={level} className="flex items-center gap-1.5 text-xs">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.bg}`} />
                      <span className="text-gray-600 dark:text-slate-400">L{level} ({count})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="flex gap-2 bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-gray-200 dark:border-slate-800 w-fit">
            <button
              onClick={() => setResultViewTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                resultViewTab === 'overview' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <PieChart size={16} /> Overview
            </button>
            <button
              onClick={() => setResultViewTab('details')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                resultViewTab === 'details' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 size={16} /> Detailed Breakdown
            </button>
            <button
              onClick={() => setResultViewTab('history')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-2 ${
                resultViewTab === 'history' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <History size={16} /> Past Assessments
              {employeeHistory.length > 0 && (
                <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded-full">
                  {employeeHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Overview Tab */}
          {resultViewTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Competency Cards */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Award size={18} className="text-purple-600 dark:text-purple-400" /> Competency Levels
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-slate-400">{result.competencies.length} total</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                  {result.competencies.map((comp, idx) => {
                    const config = getLevelConfig(comp.level);
                    const LevelIcon = config.icon;
                    return (
                      <div 
                        key={comp.competency_id} 
                        className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${config.bgLight} flex items-center justify-center`}>
                              <LevelIcon size={20} className={config.text} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800 dark:text-white">{comp.competency_name}</div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">{comp.category_name}</div>
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-lg ${config.bgLight} ${config.text} font-bold text-sm`}>
                            Level {comp.level}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                              style={{ width: `${comp.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 dark:text-slate-400 w-12 text-right">
                            {comp.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-slate-500">
                          <span>{comp.questionsAnswered} of {comp.totalQuestions} questions</span>
                          <span>{comp.score} / {comp.total} points</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="space-y-6">
                {/* Level Cards */}
                <div className="grid grid-cols-5 gap-3">
                  {[5, 4, 3, 2, 1].map(level => {
                    const config = getLevelConfig(level);
                    const count = result.levelDistribution[level] || 0;
                    const LevelIcon = config.icon;
                    return (
                      <div 
                        key={level} 
                        className={`p-4 rounded-xl ${config.bgLight} ${config.border} border text-center`}
                      >
                        <LevelIcon size={24} className={`mx-auto ${config.text}`} />
                        <div className={`text-2xl font-black mt-2 ${config.text}`}>{count}</div>
                        <div className="text-xs text-gray-600 dark:text-slate-400 font-medium">L{level}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Top Strengths */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/10">
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                      <TrendingUp size={18} /> Top Strengths
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {result.competencies.filter(c => c.level >= 4).slice(0, 3).map(comp => {
                      const config = getLevelConfig(comp.level);
                      return (
                        <div key={comp.competency_id} className="flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-emerald-500" />
                          <span className="flex-1 font-medium text-gray-700 dark:text-slate-300">{comp.competency_name}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${config.bgLight} ${config.text}`}>
                            L{comp.level}
                          </span>
                        </div>
                      );
                    })}
                    {result.competencies.filter(c => c.level >= 4).length === 0 && (
                      <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No advanced level competencies yet</p>
                    )}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-900/10">
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                      <Target size={18} /> Areas for Improvement
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {result.competencies.filter(c => c.level <= 2).slice(0, 3).map(comp => {
                      const config = getLevelConfig(comp.level);
                      return (
                        <div key={comp.competency_id} className="flex items-center gap-3">
                          <AlertTriangle size={20} className="text-amber-500" />
                          <span className="flex-1 font-medium text-gray-700 dark:text-slate-300">{comp.competency_name}</span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${config.bgLight} ${config.text}`}>
                            L{comp.level}
                          </span>
                        </div>
                      );
                    })}
                    {result.competencies.filter(c => c.level <= 2).length === 0 && (
                      <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">No beginner level competencies - Great job!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Breakdown Tab */}
          {resultViewTab === 'details' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Competency</div>
                <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Category</div>
                <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Level</div>
                <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Score</div>
                <div className="col-span-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Progress</div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {result.competencies.map((comp, idx) => {
                  const config = getLevelConfig(comp.level);
                  return (
                    <div 
                      key={comp.competency_id} 
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                    >
                      <div className="col-span-4">
                        <div className="font-semibold text-gray-800 dark:text-slate-200">{comp.competency_name}</div>
                        <div className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                          {comp.questionsAnswered}/{comp.totalQuestions} questions answered
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600 dark:text-slate-400">{comp.category_name}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${config.bgLight} ${config.text} font-bold text-sm`}>
                          <Star size={14} fill="currentColor" />
                          Level {comp.level}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="font-mono font-bold text-gray-700 dark:text-slate-300">{comp.score}</span>
                        <span className="text-gray-400 dark:text-slate-500"> / {comp.total}</span>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
                              style={{ width: `${comp.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-600 dark:text-slate-400 w-10 text-right">
                            {comp.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History Tab - Enhanced Timeline View */}
          {resultViewTab === 'history' && (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    <History size={24} className="text-purple-600 dark:text-purple-400" />
                    Assessment Timeline
                </h3>
                {loadingHistory && (
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                    <Loader2 className="animate-spin" size={16} /> Syncing history...
                    </div>
                )}
                </div>

                {/* Group Logic & Render */}
                {(() => {
                // 1. Group flat history records by Date
                const groupedHistory = employeeHistory.reduce((groups, record) => {
                    const dateKey = new Date(record.date).toLocaleDateString();
                    if (!groups[dateKey]) {
                    groups[dateKey] = {
                        date: record.date,
                        records: [],
                        totalScore: 0,
                        totalLevel: 0,
                        count: 0
                    };
                    }
                    groups[dateKey].records.push(record);
                    groups[dateKey].totalScore += record.score;
                    groups[dateKey].totalLevel += record.achieved_level.level;
                    groups[dateKey].count += 1;
                    return groups;
                }, {} as Record<string, any>);

                // 2. Sort groups by date (Newest first)
                const sortedGroups = Object.values(groupedHistory).sort((a: any, b: any) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                if (sortedGroups.length === 0) {
                    return (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History size={32} className="text-gray-400 dark:text-slate-500" />
                        </div>
                        <h4 className="font-bold text-gray-700 dark:text-slate-300">No History Available</h4>
                        <p className="text-gray-500 dark:text-slate-400 mt-1">
                        This appears to be the first assessment for {result.employeeName}.
                        </p>
                    </div>
                    );
                }

                return (
                    <div className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:inset-0 before:left-4 sm:before:left-8 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-purple-200 before:via-purple-100 before:to-transparent dark:before:from-purple-900 dark:before:via-slate-800">
                    {sortedGroups.map((group: any, groupIdx) => {
                        const avgLevel = (group.totalLevel / group.count).toFixed(1);
                        const levelConfig = getLevelConfig(Math.round(Number(avgLevel)));
                        
                        // Default to open for the latest assessment
                        const isLatest = groupIdx === 0;

                        return (
                        <div key={groupIdx} className="relative">
                            {/* Timeline Dot */}
                            <div className={`absolute left-0 sm:left-0 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 shadow-sm z-10 ${
                            isLatest ? 'bg-purple-600 ring-4 ring-purple-100 dark:ring-purple-900/30' : 'bg-gray-300 dark:bg-slate-600'
                            }`} />

                            {/* Card Container */}
                            <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden ml-6" open={isLatest}>
                            <summary className="list-none cursor-pointer">
                                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                
                                {/* Left: Date & Main Info */}
                                <div className="flex items-start gap-4">
                                    <div className={`hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl ${levelConfig.bgLight} ${levelConfig.text} border ${levelConfig.border}`}>
                                    <span className="text-xs font-bold uppercase">Level</span>
                                    <span className="text-xl font-black">{avgLevel}</span>
                                    </div>
                                    <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                                        {new Date(group.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        {isLatest && (
                                        <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                                            LATEST
                                        </span>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                                        Assessment Round
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">
                                        {group.count} competencies evaluated
                                    </p>
                                    </div>
                                </div>

                                {/* Right: Stats & Toggle Icon */}
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Score</div>
                                    <div className="text-lg font-black text-gray-800 dark:text-white">{group.totalScore} pts</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 group-open:rotate-180 transition-transform">
                                    <ChevronDown size={18} />
                                    </div>
                                </div>
                                </div>
                            </summary>
                            
                            {/* Expanded Content: List of Skills */}
                            <div className="border-t border-gray-100 dark:border-slate-800 px-5 py-4 bg-gray-50/50 dark:bg-slate-800/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {group.records.map((record: any) => {
                                    const recConfig = getLevelConfig(record.achieved_level.level);
                                    return (
                                    <div key={record.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${recConfig.bgLight}`}>
                                        <Star size={16} className={recConfig.text} fill="currentColor" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-gray-800 dark:text-slate-200 truncate">
                                            {record.competency_name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${recConfig.bgLight} ${recConfig.text} border ${recConfig.border}`}>
                                            Level {record.achieved_level.level}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-slate-500">
                                            {record.score} pts
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                    );
                                })}
                                </div>
                            </div>
                            </details>
                        </div>
                        );
                    })}
                    </div>
                );
                })()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="flex gap-4 justify-center">
            <button 
              onClick={startNewAssessment}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none flex items-center gap-2"
            >
              <RefreshCw size={20} /> Start New Assessment
            </button>
            <button 
              onClick={() => navigate('/employees')}
              className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all flex items-center gap-2"
            >
              <Users size={20} /> View All Employees
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategory = filteredCategories[currentStep - 1];
  const currentCategoryProgress = currentCategory ? {
    checked: currentCategory.questions.filter(q => checkedItems.has(q.id)).length,
    total: currentCategory.questions.length
  } : { checked: 0, total: 0 };

  // ==========================================
  // VIEW 3: ADMIN WIZARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 text-white">
        <div className="max-w-full mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                <Award size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Skill Assessment Wizard</h1>
                <p className="text-white/70 text-sm">Evaluate employee competencies step by step</p>
              </div>
            </div>
            
            {currentStep === 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
                  <Users size={18} />
                  <span className="font-bold">{employees.length}</span>
                  <span className="text-white/70 text-sm">Employees</span>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
                  <Layers size={18} />
                  <span className="font-bold">{rules.length}</span>
                  <span className="text-white/70 text-sm">Rules</span>
                </div>
              </div>
            )}

            {currentStep > 0 && (
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl">
                  <span className="text-white/70 text-sm">Candidate: </span>
                  <span className="font-bold">{employeeName}</span>
                </div>
                <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2">
                  <PieChart size={18} />
                  <span className="font-bold">{totalPoints.percentage}%</span>
                  <span className="text-white/70 text-sm">Score</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          {currentStep > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-white/70">Progress:</span>
                <span className="text-sm font-bold">Section {currentStep} of {filteredCategories.length}</span>
              </div>
              <div className="flex gap-1">
                {filteredCategories.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      idx < currentStep ? 'bg-white' : 
                      idx === currentStep ? 'bg-white/50' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto px-6 py-6">
        {currentStep === 0 ? (
          <div className="space-y-6">
            {/* Hierarchy Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="text-purple-600 dark:text-purple-400" size={20} />
                  <h2 className="font-bold text-gray-800 dark:text-white">Organization Hierarchy</h2>
                  {selectedHQ && (
                    <span className="text-sm text-gray-500 dark:text-slate-400 ml-2">
                      → {getSelectionSummary()}
                    </span>
                  )}
                </div>
                <button 
                  onClick={resetHierarchy}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                >
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Dropdown 
                    label="HQ" 
                    icon={<Building2 size={14}/>} 
                    value={selectedHQ} 
                    options={hqs} 
                    onChange={(v: string) => { setSelectedHQ(v); setSelectedBU(''); setSelectedDept(''); setSelectedSection(''); setSelectedDesignation(''); }} 
                    highlight={!!matchedRule && ruleMatchLevel === 'HQ'}
                  />
                  <Dropdown 
                    label="Business Unit" 
                    icon={<Briefcase size={14}/>} 
                    value={selectedBU} 
                    options={filteredBUs} 
                    onChange={(v: string) => { setSelectedBU(v); setSelectedDept(''); setSelectedSection(''); setSelectedDesignation(''); }} 
                    disabled={!selectedHQ} 
                    optional={canSelectEmployees}
                    highlight={!!matchedRule && ruleMatchLevel === 'Business Unit'}
                  />
                  <Dropdown 
                    label="Department" 
                    icon={<Layers size={14}/>} 
                    value={selectedDept} 
                    options={filteredDepts} 
                    onChange={(v: string) => { setSelectedDept(v); setSelectedSection(''); setSelectedDesignation(''); }} 
                    disabled={!selectedBU} 
                    optional={canSelectEmployees}
                    highlight={!!matchedRule && ruleMatchLevel === 'Department'}
                  />
                  <Dropdown 
                    label="Section" 
                    icon={<MapIcon size={14}/>} 
                    value={selectedSection} 
                    options={filteredSections} 
                    onChange={(v: string) => { setSelectedSection(v); setSelectedDesignation(''); }} 
                    disabled={!selectedDept} 
                    optional={canSelectEmployees}
                    highlight={!!matchedRule && ruleMatchLevel === 'Section'}
                  />
                  <Dropdown 
                    label="Designation" 
                    icon={<UserCheck size={14}/>} 
                    value={selectedDesignation} 
                    options={filteredDesignations} 
                    onChange={setSelectedDesignation} 
                    disabled={!selectedHQ} 
                    optional={canSelectEmployees}
                    highlight={!!matchedRule && ruleMatchLevel === 'Designation'}
                  />
                </div>

                {/* Rule Status Messages */}
                {selectedHQ && !matchedRule && (
                  <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-400">No Competency Rule Found</p>
                      <p className="text-amber-700 dark:text-amber-500 text-sm mt-1">There's no active rule matching your current selection. Try selecting more specific hierarchy levels or check if a rule exists for this path.</p>
                    </div>
                  </div>
                )}

                {matchedRule && (
                  <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">Rule Matched at {ruleMatchLevel} Level</p>
                        <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded-full">
                          {filteredCategories.length} Categories • {filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0)} Questions
                        </span>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-500 text-sm mt-1">
                        You can now select an employee to begin the assessment. 
                        {ruleMatchLevel !== 'Designation' && ' You may also continue to narrow down the hierarchy for more specific rules.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Employee Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-600 dark:text-blue-400" size={20} />
                  <h2 className="font-bold text-gray-800 dark:text-white">Select Employee</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${canSelectEmployees ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                    {filteredEmployeesList.length} available
                  </span>
                  {!canSelectEmployees && selectedHQ && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle size={12} /> Match a rule first
                    </span>
                  )}
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search employees..." 
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="p-6">
                {!selectedHQ ? (
                  <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                    <Building2 size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                    <p className="font-medium">Select a hierarchy level to see employees</p>
                    <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Start by selecting at least the HQ</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
                    {filteredEmployeesList.map(emp => {
                      const isDisabled = !canSelectEmployees;
                      return (
                        <button 
                          key={emp.id} 
                          disabled={isDisabled}
                          onClick={() => { 
                            setSelectedEmployeeId(emp.id); 
                            setEmployeeName(emp.name); 
                            setEmployeeDesignation(emp.designation);
                            setCurrentStep(1); 
                          }} 
                          className={`p-4 rounded-xl border-2 text-left transition-all relative group ${
                            isDisabled 
                              ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800' 
                              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-md active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-800 dark:text-white truncate">{emp.name}</div>
                              <div className="text-xs text-gray-500 dark:text-slate-400 truncate">{emp.designation}</div>
                            </div>
                            <ChevronRight className={`text-gray-300 dark:text-slate-600 transition-all ${!isDisabled ? 'group-hover:text-blue-500 group-hover:translate-x-1' : ''}`} size={18} />
                          </div>
                        </button>
                      );
                    })}
                    {filteredEmployeesList.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500 dark:text-slate-400">
                        No employees found matching your search.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Assessment Questions
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Category Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="bg-white/20 backdrop-blur text-xs font-bold uppercase px-3 py-1 rounded-full">
                      Section {currentStep} of {filteredCategories.length}
                    </span>
                    <h2 className="text-2xl font-black mt-3">{currentCategory?.name}</h2>
                    <p className="text-white/70 mt-1">{currentCategory?.questions.length} questions to evaluate</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black">{currentCategoryProgress.checked}/{currentCategoryProgress.total}</div>
                    <div className="text-white/70 text-sm">Completed</div>
                  </div>
                </div>
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(currentCategoryProgress.checked / currentCategoryProgress.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                  <UserCheck size={16} />
                  <span>Evaluating: <strong className="text-gray-800 dark:text-white">{employeeName}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSelectAll}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
                  >
                    <CheckCheck size={14} /> Select All
                  </button>
                  <button 
                    onClick={handleDeselectAll}
                    className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-900/30 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
                  >
                    <XCircle size={14} /> Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {currentCategory?.questions.map((q, idx) => (
                <label 
                  key={q.id} 
                  className={`flex items-center gap-5 p-5 rounded-xl cursor-pointer transition-all border-2 group ${
                    checkedItems.has(q.id) 
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-400 dark:border-purple-500 shadow-sm' 
                      : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/30 dark:hover:bg-purple-900/10'
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                    checkedItems.has(q.id) 
                      ? 'bg-purple-600 border-purple-600 dark:bg-purple-500 dark:border-purple-500' 
                      : 'border-gray-300 dark:border-slate-600 group-hover:border-purple-400'
                  }`}>
                    {checkedItems.has(q.id) && <CheckCircle2 size={18} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={checkedItems.has(q.id)} 
                    onChange={() => {
                      const n = new Set(checkedItems);
                      n.has(q.id) ? n.delete(q.id) : n.add(q.id);
                      setCheckedItems(n);
                    }} 
                    className="sr-only" 
                  />
                  <span className={`flex-1 font-medium transition-colors ${checkedItems.has(q.id) ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-slate-300'}`}>
                    {q.question}
                  </span>
                  <div className={`text-right px-3 py-1.5 rounded-lg transition-all ${
                    checkedItems.has(q.id) 
                      ? 'bg-purple-600 dark:bg-purple-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}>
                    <span className="font-bold">+{q.points}</span>
                    <span className="text-xs ml-1">pts</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4 sticky bottom-6">
              <button 
                onClick={() => setCurrentStep(s => s - 1)} 
                className="px-6 py-4 bg-white dark:bg-slate-900 rounded-xl font-bold border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition flex items-center gap-2 text-gray-700 dark:text-slate-300"
              >
                <ArrowLeft size={18} /> Previous
              </button>
              {currentStep < filteredCategories.length ? (
                <button 
                  onClick={() => setCurrentStep(s => s + 1)} 
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  Next Section <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-200 dark:shadow-none"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} /> Saving...</>
                  ) : (
                    <><Save size={20} /> Complete Assessment</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTS ---
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
  <div className={`${color} backdrop-blur rounded-xl p-4 flex items-center gap-3`}>
    <div className="text-white/80">{icon}</div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  </div>
);

const FilterPill = ({ active, onClick, label, count, color }: { active: boolean; onClick: () => void; label: string; count?: number; color?: string }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
      active 
        ? 'bg-purple-600 text-white shadow-md' 
        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400'
    }`}
  >
    {color && <div className={`w-2 h-2 rounded-full ${color}`} />}
    {label}
    {count !== undefined && <span className={`text-xs ${active ? 'text-white/70' : 'text-gray-400 dark:text-slate-500'}`}>({count})</span>}
  </button>
);

const CompetencyCard = ({ comp, index }: { comp: CompetencyRecord; index: number }) => {
  const levelColors = {
    5: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-50 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    4: { bg: 'from-green-500 to-emerald-600', light: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    3: { bg: 'from-amber-500 to-yellow-600', light: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    2: { bg: 'from-orange-500 to-amber-600', light: 'bg-orange-50 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
    1: { bg: 'from-rose-500 to-red-600', light: 'bg-rose-50 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  };
  const colors = levelColors[comp.achieved_level.level as keyof typeof levelColors] || levelColors[1];

  return (
    <div 
      className={`bg-white dark:bg-slate-900 rounded-2xl border ${colors.border} overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-white/20 rounded-lg">
            <Star size={20} fill="currentColor" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">L{comp.achieved_level.level}</div>
            <div className="text-xs text-white/70 uppercase">{comp.achieved_level.title}</div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
          {comp.competency_name || `Skill #${comp.competency_id}`}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`h-2 flex-1 rounded-full transition-all ${
                level <= comp.achieved_level.level 
                  ? `bg-gradient-to-r ${colors.bg}` 
                  : 'bg-gray-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className={`${colors.light} ${colors.text} px-2 py-1 rounded-lg font-medium text-xs`}>
            {comp.score} points
          </div>
          <div className="text-gray-400 dark:text-slate-500 text-xs flex items-center gap-1">
            <Calendar size={12} />
            {new Date(comp.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const LevelBadge = ({ level }: { level: number }) => {
  const config = getLevelConfig(level);
  return (
    <span className={`${config.bgLight} ${config.text} px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      L{level} • {config.title}
    </span>
  );
};

const Dropdown = ({ label, icon, value, options, onChange, disabled, optional, highlight }: any) => (
  <div className={`transition-all ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
    <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
      {icon} {label}
      {optional && !disabled && (
        <span className="text-emerald-500 font-normal lowercase ml-1">(optional)</span>
      )}
    </label>
    <div className="relative">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={`w-full border rounded-xl px-4 py-3 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none cursor-pointer transition-all appearance-none hover:border-purple-300 dark:hover:border-purple-600 dark:bg-slate-900 ${
          highlight 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900/50' 
            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
      {highlight && (
        <CheckCircle2 size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500" />
      )}
    </div>
  </div>
);

const getLevelBgColor = (level: number) => {
    if (level >= 4) return "bg-emerald-100 dark:bg-emerald-900/30";
    if (level >= 3) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-rose-100 dark:bg-rose-900/30";
}

const getLevelTextColor = (level: number) => {
    if (level >= 4) return "text-emerald-600 dark:text-emerald-400";
    if (level >= 3) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
}

export default CompetencySystem;
