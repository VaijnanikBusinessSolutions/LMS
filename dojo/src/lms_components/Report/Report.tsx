// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//     Search, FileText, Loader2, Sparkles, TrendingUp, Calendar, Users, 
//     Grid3X3, List, LayoutGrid, Filter, ChevronDown, X, ArrowUpDown,
//     Briefcase, Mail, BookOpen, Clock, CheckCircle2, AlertCircle,
//     SlidersHorizontal, RefreshCw, Download, Eye, BarChart3, Award,
//     Zap, Star, Building2, UserCheck, UserX, Activity, Layers
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// interface Employee {
//     id: number;
//     name: string;
//     email: string;
//     position: string;
//     department: string;
//     courses: number;
//     status: 'active' | 'on-leave';
//     lastActive: string;
// }

// type ViewMode = 'table' | 'cards' | 'compact';
// type SortField = 'name' | 'department' | 'courses' | 'status';
// type SortOrder = 'asc' | 'desc';

// const EmployeeList: React.FC = () => {
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [nameFilter, setNameFilter] = useState('');
//     const [viewMode, setViewMode] = useState<ViewMode>('table');
//     const [departmentFilter, setDepartmentFilter] = useState<string>('all');
//     const [statusFilter, setStatusFilter] = useState<string>('all');
//     const [courseFilter, setCourseFilter] = useState<string>('all');
//     const [sortField, setSortField] = useState<SortField>('name');
//     const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
//     const [showFilters, setShowFilters] = useState(true);
//     const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
//     const [hoveredCard, setHoveredCard] = useState<number | null>(null);
//     const navigate = useNavigate();

//     const API_BASE_URL = 'http://127.0.0.1:8000/lms';

//     useEffect(() => {
//         const fetchEmployees = async () => {
//             setLoading(true);
//             setError(null);
//             const authData = localStorage.getItem("auth");
//             const token = authData ? JSON.parse(authData).accessToken : "";
            
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             try {
//                 const response = await axios.get<Employee[]>(`${API_BASE_URL}/employees/`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setEmployees(response.data);
//             } catch (err) {
//                 if (axios.isAxiosError(err) && err.response?.status === 401) {
//                     navigate('/login');
//                 } else {
//                     setError("Failed to load data.");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchEmployees();
//     }, [navigate]);

//     // Get unique departments
//     const departments = useMemo(() => {
//         const depts = [...new Set(employees.map(e => e.department))];
//         return depts.sort();
//     }, [employees]);

//     // Statistics
//     const stats = useMemo(() => {
//         const active = employees.filter(e => e.status === 'active').length;
//         const onLeave = employees.filter(e => e.status === 'on-leave').length;
//         const totalCourses = employees.reduce((sum, e) => sum + e.courses, 0);
//         const avgCourses = employees.length ? (totalCourses / employees.length).toFixed(1) : 0;
//         const topPerformer = employees.reduce((max, e) => e.courses > (max?.courses || 0) ? e : max, employees[0]);
//         return { active, onLeave, totalCourses, avgCourses, topPerformer };
//     }, [employees]);

//     // Filtered and sorted employees
//     const filteredEmployees = useMemo(() => {
//         let result = employees.filter(employee => {
//             const matchesSearch = employee.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
//                 employee.email.toLowerCase().includes(nameFilter.toLowerCase()) ||
//                 employee.position.toLowerCase().includes(nameFilter.toLowerCase());
//             const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
//             const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
            
//             let matchesCourse = true;
//             if (courseFilter === 'low') matchesCourse = employee.courses < 3;
//             else if (courseFilter === 'medium') matchesCourse = employee.courses >= 3 && employee.courses <= 6;
//             else if (courseFilter === 'high') matchesCourse = employee.courses > 6;
            
//             return matchesSearch && matchesDepartment && matchesStatus && matchesCourse;
//         });

//         // Sort
//         result.sort((a, b) => {
//             let comparison = 0;
//             switch (sortField) {
//                 case 'name':
//                     comparison = a.name.localeCompare(b.name);
//                     break;
//                 case 'department':
//                     comparison = a.department.localeCompare(b.department);
//                     break;
//                 case 'courses':
//                     comparison = a.courses - b.courses;
//                     break;
//                 case 'status':
//                     comparison = a.status.localeCompare(b.status);
//                     break;
//             }
//             return sortOrder === 'asc' ? comparison : -comparison;
//         });

//         return result;
//     }, [employees, nameFilter, departmentFilter, statusFilter, courseFilter, sortField, sortOrder]);

//     const clearAllFilters = () => {
//         setNameFilter('');
//         setDepartmentFilter('all');
//         setStatusFilter('all');
//         setCourseFilter('all');
//     };

//     const hasActiveFilters = nameFilter || departmentFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all';

//     const toggleEmployeeSelection = (id: number) => {
//         setSelectedEmployees(prev => 
//             prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
//         );
//     };

//     const getProgressColor = (courses: number) => {
//         if (courses >= 7) return 'from-emerald-500 to-teal-600';
//         if (courses >= 4) return 'from-blue-500 to-indigo-600';
//         if (courses >= 2) return 'from-violet-500 to-purple-600';
//         return 'from-slate-400 to-slate-500';
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
//                 <div className="absolute inset-0">
//                     <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 dark:bg-blue-900/30 rounded-full blur-3xl animate-pulse" />
//                     <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/50 dark:bg-indigo-900/30 rounded-full blur-3xl animate-pulse delay-1000" />
//                 </div>
//                 <div className="relative z-10 flex flex-col items-center gap-6">
//                     <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse" />
//                         <Loader2 className="h-20 w-20 animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
//                     </div>
//                     <div className="text-center">
//                         <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Loading Employees</h2>
//                         <p className="text-slate-500 dark:text-slate-400">Fetching your team data...</p>
//                     </div>
//                     <div className="flex gap-1">
//                         {[0, 1, 2, 3, 4].map(i => (
//                             <div key={i} className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans transition-colors duration-300">

//             <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8">
                
//                 {/* Header Section */}
                

//                 {/* Colorful Statistics Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//                     {/* Blue Card - Total Team */}
//                     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
//                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
//                                 <Users className="h-6 w-6 text-white" />
                                
//                             </div>
//                             <p className="text-3xl font-bold text-white">{employees.length}</p>
//                             <p className="text-sm text-blue-100">Total Team</p>
//                         </div>
//                     </div>

//                     {/* Green Card - Active */}
//                     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
//                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
//                                 <UserCheck className="h-6 w-6 text-white" />
//                             </div>
//                             <p className="text-3xl font-bold text-white">{stats.active}</p>
//                             <p className="text-sm text-emerald-100">Active</p>
//                         </div>
//                     </div>

//                     {/* Purple Card - Total Courses */}
//                     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 p-5 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
//                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
//                                 <BookOpen className="h-6 w-6 text-white" />
//                             </div>
//                             <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
//                             <p className="text-sm text-purple-100">Total Courses</p>
//                         </div>
//                     </div>

//                     {/* Orange Card - Avg. Courses */}
//                     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
//                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
//                                 <BarChart3 className="h-6 w-6 text-white" />
//                             </div>
//                             <p className="text-3xl font-bold text-white">{stats.avgCourses}</p>
//                             <p className="text-sm text-orange-100">Avg. Courses</p>
//                         </div>
//                     </div>

//                     {/* Yellow Card - Top Performer */}
//                     <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-5 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
//                         <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
//                         <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
//                         <div className="relative">
//                             <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
//                                 <Award className="h-6 w-6 text-white" />
//                             </div>
//                             <p className="text-lg font-bold text-white truncate">{stats.topPerformer?.name || 'N/A'}</p>
//                             <p className="text-sm text-amber-100">Top Performer</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Search and Controls Bar - Teal/Cyan themed */}
//                 <div className="bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-900 dark:to-cyan-900 rounded-2xl shadow-lg shadow-teal-500/20 dark:shadow-none p-6 mb-6">
                    
//                     {/* Main Search */}
//                     <div className="relative mb-6">
//                         <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
//                             <div className="pl-5 pr-3">
//                                 <Search className="h-5 w-5 text-teal-500 dark:text-teal-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 className="flex-1 py-4 bg-transparent text-gray-800 dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
//                                 placeholder="Search by name, email, or position..."
//                                 value={nameFilter}
//                                 onChange={(e) => setNameFilter(e.target.value)}
//                             />
//                             {nameFilter && (
//                                 <button 
//                                     onClick={() => setNameFilter('')} 
//                                     className="mr-3 p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
//                                 >
//                                     <X className="h-4 w-4" />
//                                 </button>
//                             )}
//                         </div>
//                     </div>
                    

//                     {/* Filter Toggle and View Controls */}
//                     <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//                         <div className="flex items-center justify-between gap-3">
//                             <button
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
//                                     showFilters 
//                                         ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg' 
//                                         : 'bg-white/20 dark:bg-black/20 text-white hover:bg-white/30 dark:hover:bg-black/30'
//                                 }`}
//                             >
//                                 <SlidersHorizontal className="h-5 w-5" />
//                                 Filters
//                                 {hasActiveFilters && (
//                                     <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
//                                         showFilters ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400' : 'bg-white/30 text-white'
//                                     }`}>
//                                         {[departmentFilter !== 'all', statusFilter !== 'all', courseFilter !== 'all'].filter(Boolean).length}
//                                     </span>
//                                 )}
//                             </button> 
                            
//                             {hasActiveFilters && (
//                                 <button
//                                     onClick={clearAllFilters}
//                                     className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all font-medium shadow-lg"
//                                 >
//                                     <RefreshCw className="h-4 w-4" />
//                                     Clear All
//                                 </button>
//                             )}
//                         </div>


//                         <div className="text-center">
//                             <h1 className="text-4xl md:text-5xl font-black tracking-tight">
//                                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
//                                     Employee Directory
//                                 </span>
//                             </h1>       
//                         </div>

//                         {/* View Mode Toggle */}
//                         <div className="flex items-center gap-1 p-1.5 bg-white/20 dark:bg-black/20 rounded-xl">
//                             <button
//                                 onClick={() => setViewMode('cards')}
//                                 className={`p-3 rounded-lg transition-all ${
//                                     viewMode === 'cards' 
//                                         ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
//                                         : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
//                                 }`}
//                                 title="Card View"
//                             >
//                                 <LayoutGrid className="h-5 w-5" />
//                             </button>
//                             <button
//                                 onClick={() => setViewMode('table')}
//                                 className={`p-3 rounded-lg transition-all ${
//                                     viewMode === 'table' 
//                                         ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
//                                         : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
//                                 }`}
//                                 title="Table View"
//                             >
//                                 <List className="h-5 w-5" />
//                             </button>
//                             <button
//                                 onClick={() => setViewMode('compact')}
//                                 className={`p-3 rounded-lg transition-all ${
//                                     viewMode === 'compact' 
//                                         ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
//                                         : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
//                                 }`}
//                                 title="Compact View"
//                             >
//                                 <Grid3X3 className="h-5 w-5" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Advanced Filters */}
//                     {showFilters && (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/20 dark:border-white/10">
                            
//                             {/* Department Filter */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center gap-2 text-sm font-medium text-white/90">
//                                     <Building2 className="h-4 w-4" />
//                                     Department
//                                 </label>
//                                 <div className="relative">
//                                     <select
//                                         value={departmentFilter}
//                                         onChange={(e) => setDepartmentFilter(e.target.value)}
//                                         className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
//                                     >
//                                         <option value="all">All Departments</option>
//                                         {departments.map(dept => (
//                                             <option key={dept} value={dept}>{dept}</option>
//                                         ))}
//                                     </select>
//                                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
//                                 </div>
//                             </div>

//                             {/* Status Filter */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center gap-2 text-sm font-medium text-white/90">
//                                     <Activity className="h-4 w-4" />
//                                     Status
//                                 </label>
//                                 <div className="relative">
//                                     <select
//                                         value={statusFilter}
//                                         onChange={(e) => setStatusFilter(e.target.value)}
//                                         className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
//                                     >
//                                         <option value="all">All Status</option>
//                                         <option value="active">Active</option>
//                                         <option value="on-leave">On Leave</option>
//                                     </select>
//                                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
//                                 </div>
//                             </div>

//                             {/* Course Progress Filter */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center gap-2 text-sm font-medium text-white/90">
//                                     <Layers className="h-4 w-4" />
//                                     Course Progress
//                                 </label>
//                                 <div className="relative">
//                                     <select
//                                         value={courseFilter}
//                                         onChange={(e) => setCourseFilter(e.target.value)}
//                                         className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
//                                     >
//                                         <option value="all">All Progress</option>
//                                         <option value="low">Beginner (0-2)</option>
//                                         <option value="medium">Intermediate (3-6)</option>
//                                         <option value="high">Advanced (7+)</option>
//                                     </select>
//                                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
//                                 </div>
//                             </div>

//                             {/* Sort By */}
//                             <div className="space-y-2">
//                                 <label className="flex items-center gap-2 text-sm font-medium text-white/90">
//                                     <ArrowUpDown className="h-4 w-4" />
//                                     Sort By
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <div className="relative flex-1">
//                                         <select
//                                             value={sortField}
//                                             onChange={(e) => setSortField(e.target.value as SortField)}
//                                             className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
//                                         >
//                                             <option value="name">Name</option>
//                                             <option value="department">Department</option>
//                                             <option value="courses">Courses</option>
//                                             <option value="status">Status</option>
//                                         </select>
//                                         <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
//                                     </div>
//                                     <button
//                                         onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                                         className="p-3 bg-white dark:bg-slate-800 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
//                                     >
//                                         <ArrowUpDown className={`h-5 w-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
                
//                 {/* Content Area */}
//                 {filteredEmployees.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
//                         <div className="relative mb-8">
//                             <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-2xl" />
//                             <div className="relative w-24 h-24 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
//                                 <Sparkles className="h-12 w-12 text-blue-400 dark:text-blue-500" />
//                             </div>
//                         </div>
//                         <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Results Found</h3>
//                         <p className="text-gray-500 dark:text-slate-400 text-center max-w-md mb-6">
//                             We couldn't find any employees matching your search criteria. Try adjusting your filters.
//                         </p>
//                         <button
//                             onClick={clearAllFilters}
//                             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all"
//                         >
//                             <RefreshCw className="h-5 w-5" />
//                             Clear All Filters
//                         </button>
//                     </div>
//                 ) : viewMode === 'cards' ? (
//                     /* Card View */
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {filteredEmployees.map((employee, index) => (
//                             <div
//                                 key={employee.id}
//                                 className="group relative"
//                                 onMouseEnter={() => setHoveredCard(employee.id)}
//                                 onMouseLeave={() => setHoveredCard(null)}
//                                 style={{ animationDelay: `${index * 50}ms` }}
//                             >
//                                 <div className="relative h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
                                    
//                                     {/* Card Header */}
//                                     <div className={`h-24 bg-gradient-to-br ${getProgressColor(employee.courses)} relative overflow-hidden`}>
//                                         <div className="absolute inset-0 bg-black/10" />
//                                         <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full" />
//                                         <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
                                        
//                                         {/* Status Badge */}
//                                         <div className="absolute top-4 right-4">
//                                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
//                                                 employee.status === 'active'
//                                                     ? 'bg-white/90 text-emerald-600 dark:bg-slate-900/90 dark:text-emerald-400'
//                                                     : 'bg-white/90 text-amber-600 dark:bg-slate-900/90 dark:text-amber-400'
//                                             }`}>
//                                                 {employee.status === 'active' ? (
//                                                     <CheckCircle2 className="h-3 w-3" />
//                                                 ) : (
//                                                     <Clock className="h-3 w-3" />
//                                                 )}
//                                                 {employee.status === 'active' ? 'Active' : 'Leave'}
//                                             </span>
//                                         </div>

//                                         {/* Selection Checkbox */}
//                                         <button
//                                             onClick={() => toggleEmployeeSelection(employee.id)}
//                                             className={`absolute top-4 left-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
//                                                 selectedEmployees.includes(employee.id)
//                                                     ? 'bg-white border-white text-blue-600 dark:bg-slate-800 dark:border-slate-800 dark:text-blue-400'
//                                                     : 'border-white/70 hover:border-white bg-white/20'
//                                             }`}
//                                         >
//                                             {selectedEmployees.includes(employee.id) && (
//                                                 <CheckCircle2 className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                     </div>

//                                     {/* Avatar */}
//                                     <div className="flex justify-center -mt-10 relative z-10">
//                                         <div className="relative">
//                                             <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-900`}>
//                                                 {employee.name.charAt(0).toUpperCase()}
//                                             </div>
//                                             <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
//                                                 employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
//                                             }`} />
//                                         </div>
//                                     </div>

//                                     {/* Card Body */}
//                                     <div className="p-6 pt-4">
//                                         <div className="text-center mb-4">
//                                             <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                                 {employee.name}
//                                             </h3>
//                                             <p className="text-sm text-gray-400 dark:text-slate-500 truncate">{employee.email}</p>
//                                         </div>

//                                         <div className="space-y-3 mb-5">
//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
//                                                     <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.position}</p>
//                                                     <p className="text-xs text-gray-400 dark:text-slate-500">{employee.department}</p>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                                                     <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <div className="flex justify-between items-center mb-1">
//                                                         <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.courses} Courses</p>
//                                                         <span className="text-xs text-gray-400 dark:text-slate-500">{Math.min(employee.courses * 10, 100)}%</span>
//                                                     </div>
//                                                     <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                                                         <div 
//                                                             className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full transition-all duration-500`}
//                                                             style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex items-center gap-3 text-sm">
//                                                 <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
//                                                     <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
//                                                 </div>
//                                                 <p className="text-gray-500 dark:text-slate-400">Last active: {employee.lastActive}</p>
//                                             </div>
//                                         </div>

//                                         {/* Action Button */}
//                                         <button
//                                             onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
//                                             className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group/btn"
//                                         >
//                                             <FileText className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
//                                             View Report
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : viewMode === 'table' ? (
//                     /* Table View with Blue Header */
//                     <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead>
//                                     <tr className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
//                                         <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
//                                             <div className="flex items-center gap-2">
//                                                 <Users className="h-4 w-4" />
//                                                 Employee
//                                             </div>
//                                         </th>
//                                         <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
//                                             <div className="flex items-center gap-2">
//                                                 <Briefcase className="h-4 w-4" />
//                                                 Role
//                                             </div>
//                                         </th>
//                                         <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
//                                             <div className="flex items-center gap-2">
//                                                 <Building2 className="h-4 w-4" />
//                                                 Department
//                                             </div>
//                                         </th>
//                                         <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
//                                             <div className="flex items-center gap-2">
//                                                 <BookOpen className="h-4 w-4" />
//                                                 Progress
//                                             </div>
//                                         </th>
//                                         <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-white">
//                                             <div className="flex items-center justify-center gap-2">
//                                                 <Activity className="h-4 w-4" />
//                                                 Status
//                                             </div>
//                                         </th>
//                                         <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-white">
//                                             Action
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
//                                     {filteredEmployees.map((employee, index) => (
//                                         <tr 
//                                             key={employee.id} 
//                                             className="group hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all"
//                                             style={{ animationDelay: `${index * 30}ms` }}
//                                         >
//                                             <td className="px-6 py-5">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="relative flex-shrink-0">
//                                                         <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
//                                                             {employee.name.charAt(0).toUpperCase()}
//                                                         </div>
//                                                         <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
//                                                             employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
//                                                         }`} />
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <p className="text-base font-semibold text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
//                                                             {employee.name}
//                                                         </p>
//                                                         <p className="text-sm text-gray-400 dark:text-slate-500 truncate flex items-center gap-1">
//                                                             <Mail className="h-3 w-3" />
//                                                             {employee.email}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5">
//                                                 <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.position}</p>
//                                             </td>
//                                             <td className="px-6 py-5">
//                                                 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800/50">
//                                                     <Building2 className="h-3.5 w-3.5" />
//                                                     {employee.department}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-5">
//                                                 <div className="w-32">
//                                                     <div className="flex justify-between items-center mb-1.5">
//                                                         <span className="text-sm font-bold text-gray-700 dark:text-slate-300">{employee.courses}</span>
//                                                         <span className="text-xs text-gray-400 dark:text-slate-500">courses</span>
//                                                     </div>
//                                                     <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                                                         <div 
//                                                             className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full`}
//                                                             style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5 text-center">
//                                                 <div className="flex flex-col items-center gap-1">
//                                                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
//                                                         employee.status === 'active'
//                                                             ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
//                                                             : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
//                                                     }`}>
//                                                         {employee.status === 'active' ? (
//                                                             <CheckCircle2 className="h-3 w-3" />
//                                                         ) : (
//                                                             <Clock className="h-3 w-3" />
//                                                         )}
//                                                         {employee.status === 'active' ? 'Active' : 'On Leave'}
//                                                     </span>
//                                                     <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
//                                                         <Calendar className="h-2.5 w-2.5" />
//                                                         {employee.lastActive}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5 text-right">
//                                                 <button
//                                                     onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
//                                                     className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all hover:-translate-y-0.5"
//                                                 >
//                                                     <FileText className="h-4 w-4" />
//                                                     Report
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 ) : (
//                     /* Compact View */
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
//                         {filteredEmployees.map((employee, index) => (
//                             <div
//                                 key={employee.id}
//                                 className="group relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all cursor-pointer hover:-translate-y-1"
//                                 onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
//                                 style={{ animationDelay: `${index * 30}ms` }}
//                             >
//                                 <div className="flex items-center gap-3 mb-3">
//                                     <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white font-bold shadow-md`}>
//                                         {employee.name.charAt(0).toUpperCase()}
//                                         <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
//                                             employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
//                                         }`} />
//                                     </div>
//                                     <div className="min-w-0 flex-1">
//                                         <p className="text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                                             {employee.name}
//                                         </p>
//                                         <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{employee.position}</p>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center justify-between text-xs">
//                                     <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1">
//                                         <BookOpen className="h-3 w-3" />
//                                         {employee.courses}
//                                     </span>
//                                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
//                                         employee.status === 'active'
//                                             ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
//                                             : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
//                                     }`}>
//                                         {employee.status === 'active' ? 'Active' : 'Leave'}
//                                     </span>
//                                 </div>
                                
//                                 <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                                     <div 
//                                         className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full`}
//                                         style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
//                                     />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className="mt-12 flex flex-wrap items-center justify-center gap-4 pb-8">
//                     <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
//                         <TrendingUp className="h-5 w-5 text-emerald-500" />
//                         <span className="text-gray-600 dark:text-slate-400">
//                             <span className="font-bold text-gray-800 dark:text-white">{filteredEmployees.length}</span> employees displayed
//                         </span>
//                     </div>
                    
//                     <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
//                         <Zap className="h-5 w-5 text-amber-500" />
//                         <span className="text-gray-600 dark:text-slate-400">
//                             <span className="font-bold text-gray-800 dark:text-white">{stats.totalCourses}</span> total courses completed
//                         </span>
//                     </div>
                    
//                     <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30">
//                         <Star className="h-5 w-5 text-white" />
//                         <span className="text-white">
//                             Powered by <span className="font-bold">LMS Analytics</span>
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeList;




import React, { useState, useEffect, useMemo } from 'react';
import { 
    Search, FileText, Loader2, Sparkles, TrendingUp, Calendar, Users, 
    Grid3X3, List, LayoutGrid, Filter, ChevronDown, X, ArrowUpDown,
    Briefcase, Mail, BookOpen, Clock, CheckCircle2, AlertCircle,
    SlidersHorizontal, RefreshCw, Download, Eye, BarChart3, Award,
    Zap, Star, Building2, UserCheck, UserX, Activity, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    department: string;
    courses: number;
    status: 'active' | 'on-leave';
    lastActive: string;
}

type ViewMode = 'table' | 'cards' | 'compact';
// Added 'lastActive' to SortField type
type SortField = 'name' | 'department' | 'courses' | 'status' | 'lastActive';
type SortOrder = 'asc' | 'desc';

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nameFilter, setNameFilter] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [courseFilter, setCourseFilter] = useState<string>('all');
    // Changed default sort to 'lastActive' with 'desc' order
    const [sortField, setSortField] = useState<SortField>('lastActive');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const navigate = useNavigate();

    const API_BASE_URL = 'http://127.0.0.1:8000/lms';

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            const authData = localStorage.getItem("auth");
            const token = authData ? JSON.parse(authData).accessToken : "";
            
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get<Employee[]>(`${API_BASE_URL}/employees/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(response.data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError("Failed to load data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [navigate]);

    // Get unique departments
    const departments = useMemo(() => {
        const depts = [...new Set(employees.map(e => e.department))];
        return depts.sort();
    }, [employees]);

    // Statistics
    const stats = useMemo(() => {
        const active = employees.filter(e => e.status === 'active').length;
        const onLeave = employees.filter(e => e.status === 'on-leave').length;
        const totalCourses = employees.reduce((sum, e) => sum + e.courses, 0);
        const avgCourses = employees.length ? (totalCourses / employees.length).toFixed(1) : 0;
        const topPerformer = employees.reduce((max, e) => e.courses > (max?.courses || 0) ? e : max, employees[0]);
        return { active, onLeave, totalCourses, avgCourses, topPerformer };
    }, [employees]);

    // Helper function to parse date strings
    const parseDate = (dateStr: string): Date => {
        // Handle various date formats
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
        // If parsing fails, return a very old date
        return new Date(0);
    };

    // Filtered and sorted employees
    const filteredEmployees = useMemo(() => {
        let result = employees.filter(employee => {
            const matchesSearch = employee.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
                employee.email.toLowerCase().includes(nameFilter.toLowerCase()) ||
                employee.position.toLowerCase().includes(nameFilter.toLowerCase());
            const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
            const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
            
            let matchesCourse = true;
            if (courseFilter === 'low') matchesCourse = employee.courses < 3;
            else if (courseFilter === 'medium') matchesCourse = employee.courses >= 3 && employee.courses <= 6;
            else if (courseFilter === 'high') matchesCourse = employee.courses > 6;
            
            return matchesSearch && matchesDepartment && matchesStatus && matchesCourse;
        });

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'department':
                    comparison = a.department.localeCompare(b.department);
                    break;
                case 'courses':
                    comparison = a.courses - b.courses;
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'lastActive':
                    // Parse dates and compare timestamps
                    const dateA = parseDate(a.lastActive);
                    const dateB = parseDate(b.lastActive);
                    comparison = dateA.getTime() - dateB.getTime();
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [employees, nameFilter, departmentFilter, statusFilter, courseFilter, sortField, sortOrder]);

    const clearAllFilters = () => {
        setNameFilter('');
        setDepartmentFilter('all');
        setStatusFilter('all');
        setCourseFilter('all');
    };

    const hasActiveFilters = nameFilter || departmentFilter !== 'all' || statusFilter !== 'all' || courseFilter !== 'all';

    const toggleEmployeeSelection = (id: number) => {
        setSelectedEmployees(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getProgressColor = (courses: number) => {
        if (courses >= 7) return 'from-emerald-500 to-teal-600';
        if (courses >= 4) return 'from-blue-500 to-indigo-600';
        if (courses >= 2) return 'from-violet-500 to-purple-600';
        return 'from-slate-400 to-slate-500';
    };

    // Helper function to format relative time
    const getRelativeTime = (dateStr: string): string => {
        const date = parseDate(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return dateStr;
    };

    // Check if employee was recently active (within last 24 hours)
    const isRecentlyActive = (dateStr: string): boolean => {
        const date = parseDate(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = diffMs / 3600000;
        return diffHours < 24;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/50 dark:bg-blue-900/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/50 dark:bg-indigo-900/30 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse" />
                        <Loader2 className="h-20 w-20 animate-spin text-indigo-600 dark:text-indigo-400 relative z-10" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Loading Employees</h2>
                        <p className="text-slate-500 dark:text-slate-400">Fetching your team data...</p>
                    </div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans transition-colors duration-300">

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Colorful Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {/* Blue Card - Total Team */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white">{employees.length}</p>
                            <p className="text-sm text-blue-100">Total Team</p>
                        </div>
                    </div>

                    {/* Green Card - Active */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <UserCheck className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.active}</p>
                            <p className="text-sm text-emerald-100">Active</p>
                        </div>
                    </div>

                    {/* Purple Card - Total Courses */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 p-5 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                            <p className="text-sm text-purple-100">Total Courses</p>
                        </div>
                    </div>

                    {/* Orange Card - Avg. Courses */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white">{stats.avgCourses}</p>
                            <p className="text-sm text-orange-100">Avg. Courses</p>
                        </div>
                    </div>

                    {/* Yellow Card - Top Performer */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-5 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <Award className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-lg font-bold text-white truncate">{stats.topPerformer?.name || 'N/A'}</p>
                            <p className="text-sm text-amber-100">Top Performer</p>
                        </div>
                    </div>
                </div>

                {/* Search and Controls Bar */}
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-900 dark:to-cyan-900 rounded-2xl shadow-lg shadow-teal-500/20 dark:shadow-none p-6 mb-6">
                    
                    {/* Main Search */}
                    <div className="relative mb-6">
                        <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm">
                            <div className="pl-5 pr-3">
                                <Search className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                            </div>
                            <input
                                type="text"
                                className="flex-1 py-4 bg-transparent text-gray-800 dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                                placeholder="Search by name, email, or position..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                            {nameFilter && (
                                <button 
                                    onClick={() => setNameFilter('')} 
                                    className="mr-3 p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Toggle and View Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center justify-between gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                                    showFilters 
                                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-lg' 
                                        : 'bg-white/20 dark:bg-black/20 text-white hover:bg-white/30 dark:hover:bg-black/30'
                                }`}
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                                Filters
                                {hasActiveFilters && (
                                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs ${
                                        showFilters ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400' : 'bg-white/30 text-white'
                                    }`}>
                                        {[departmentFilter !== 'all', statusFilter !== 'all', courseFilter !== 'all'].filter(Boolean).length}
                                    </span>
                                )}
                            </button> 
                            
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all font-medium shadow-lg"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white">
                                    Employee Directory
                                </span>
                            </h1>       
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 p-1.5 bg-white/20 dark:bg-black/20 rounded-xl">
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`p-3 rounded-lg transition-all ${
                                    viewMode === 'cards' 
                                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
                                        : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
                                }`}
                                title="Card View"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-3 rounded-lg transition-all ${
                                    viewMode === 'table' 
                                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
                                        : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
                                }`}
                                title="Table View"
                            >
                                <List className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('compact')}
                                className={`p-3 rounded-lg transition-all ${
                                    viewMode === 'compact' 
                                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm' 
                                        : 'text-white hover:bg-white/20 dark:hover:bg-black/20'
                                }`}
                                title="Compact View"
                            >
                                <Grid3X3 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/20 dark:border-white/10">
                            
                            {/* Department Filter */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                    <Building2 className="h-4 w-4" />
                                    Department
                                </label>
                                <div className="relative">
                                    <select
                                        value={departmentFilter}
                                        onChange={(e) => setDepartmentFilter(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
                                    >
                                        <option value="all">All Departments</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                    <Activity className="h-4 w-4" />
                                    Status
                                </label>
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="on-leave">On Leave</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Course Progress Filter */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                    <Layers className="h-4 w-4" />
                                    Course Progress
                                </label>
                                <div className="relative">
                                    <select
                                        value={courseFilter}
                                        onChange={(e) => setCourseFilter(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
                                    >
                                        <option value="all">All Progress</option>
                                        <option value="low">Beginner (0-2)</option>
                                        <option value="medium">Intermediate (3-6)</option>
                                        <option value="high">Advanced (7+)</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Sort By - Updated with Last Active option */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-white/90">
                                    <ArrowUpDown className="h-4 w-4" />
                                    Sort By
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select
                                            value={sortField}
                                            onChange={(e) => setSortField(e.target.value as SortField)}
                                            className="w-full appearance-none bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-3 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer shadow-sm"
                                        >
                                            <option value="lastActive">Last Active</option>
                                            <option value="name">Name</option>
                                            <option value="department">Department</option>
                                            <option value="courses">Courses</option>
                                            <option value="status">Status</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-3 bg-white dark:bg-slate-800 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                        title={sortOrder === 'desc' ? 'Most Recent First' : 'Oldest First'}
                                    >
                                        <ArrowUpDown className={`h-5 w-5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Content Area */}
                {filteredEmployees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-2xl" />
                            <div className="relative w-24 h-24 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                                <Sparkles className="h-12 w-12 text-blue-400 dark:text-blue-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Results Found</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-center max-w-md mb-6">
                            We couldn't find any employees matching your search criteria. Try adjusting your filters.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Clear All Filters
                        </button>
                    </div>
                ) : viewMode === 'cards' ? (
                    /* Card View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEmployees.map((employee, index) => (
                            <div
                                key={employee.id}
                                className="group relative"
                                onMouseEnter={() => setHoveredCard(employee.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="relative h-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
                                    
                                    {/* Card Header */}
                                    <div className={`h-24 bg-gradient-to-br ${getProgressColor(employee.courses)} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full" />
                                        <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full" />
                                        
                                        {/* Recently Active Badge */}
                                        {isRecentlyActive(employee.lastActive) && (
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-500 text-white animate-pulse">
                                                    <Zap className="h-2.5 w-2.5" />
                                                    Recently Active
                                                </span>
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                employee.status === 'active'
                                                    ? 'bg-white/90 text-emerald-600 dark:bg-slate-900/90 dark:text-emerald-400'
                                                    : 'bg-white/90 text-amber-600 dark:bg-slate-900/90 dark:text-amber-400'
                                            }`}>
                                                {employee.status === 'active' ? (
                                                    <CheckCircle2 className="h-3 w-3" />
                                                ) : (
                                                    <Clock className="h-3 w-3" />
                                                )}
                                                {employee.status === 'active' ? 'Active' : 'Leave'}
                                            </span>
                                        </div>

                                        {/* Selection Checkbox */}
                                        <button
                                            onClick={() => toggleEmployeeSelection(employee.id)}
                                            className={`absolute bottom-4 left-4 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                                selectedEmployees.includes(employee.id)
                                                    ? 'bg-white border-white text-blue-600 dark:bg-slate-800 dark:border-slate-800 dark:text-blue-400'
                                                    : 'border-white/70 hover:border-white bg-white/20'
                                            }`}
                                        >
                                            {selectedEmployees.includes(employee.id) && (
                                                <CheckCircle2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex justify-center -mt-10 relative z-10">
                                        <div className="relative">
                                            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-900`}>
                                                {employee.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                                                employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                                            }`} />
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 pt-4">
                                        <div className="text-center mb-4">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {employee.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 dark:text-slate-500 truncate">{employee.email}</p>
                                        </div>

                                        <div className="space-y-3 mb-5">
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                    <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.position}</p>
                                                    <p className="text-xs text-gray-400 dark:text-slate-500">{employee.department}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.courses} Courses</p>
                                                        <span className="text-xs text-gray-400 dark:text-slate-500">{Math.min(employee.courses * 10, 100)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full transition-all duration-500`}
                                                            style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-sm">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                    isRecentlyActive(employee.lastActive) 
                                                        ? 'bg-green-100 dark:bg-green-900/30' 
                                                        : 'bg-teal-100 dark:bg-teal-900/30'
                                                }`}>
                                                    <Calendar className={`h-4 w-4 ${
                                                        isRecentlyActive(employee.lastActive)
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-teal-600 dark:text-teal-400'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className={`font-medium ${
                                                        isRecentlyActive(employee.lastActive)
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-gray-500 dark:text-slate-400'
                                                    }`}>
                                                        {getRelativeTime(employee.lastActive)}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-slate-500">Last active</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group/btn"
                                        >
                                            <FileText className="h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : viewMode === 'table' ? (
                    /* Table View with Blue Header */
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-colors duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Employee
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4" />
                                                Role
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                Department
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                Progress
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center justify-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Last Active
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-white">
                                            <div className="flex items-center justify-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Status
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-white">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {filteredEmployees.map((employee, index) => (
                                        <tr 
                                            key={employee.id} 
                                            className={`group hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-all ${
                                                isRecentlyActive(employee.lastActive) ? 'bg-green-50/30 dark:bg-green-900/10' : ''
                                            }`}
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                                                            {employee.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                                            employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                                                        }`} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-base font-semibold text-gray-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                                                {employee.name}
                                                            </p>
                                                            {isRecentlyActive(employee.lastActive) && (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-green-500 text-white">
                                                                    <Zap className="h-2 w-2 mr-0.5" />
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-400 dark:text-slate-500 truncate flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {employee.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-700 dark:text-slate-300 font-medium">{employee.position}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800/50">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    {employee.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="w-32">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-sm font-bold text-gray-700 dark:text-slate-300">{employee.courses}</span>
                                                        <span className="text-xs text-gray-400 dark:text-slate-500">courses</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full`}
                                                            style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                        isRecentlyActive(employee.lastActive)
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50'
                                                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                                                    }`}>
                                                        <Clock className="h-3 w-3" />
                                                        {getRelativeTime(employee.lastActive)}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                                                        {employee.lastActive}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                    employee.status === 'active'
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                                                }`}>
                                                    {employee.status === 'active' ? (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    ) : (
                                                        <Clock className="h-3 w-3" />
                                                    )}
                                                    {employee.status === 'active' ? 'Active' : 'On Leave'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all hover:-translate-y-0.5"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Report
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Compact View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {filteredEmployees.map((employee, index) => (
                            <div
                                key={employee.id}
                                className={`group relative bg-white dark:bg-slate-900 border rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all cursor-pointer hover:-translate-y-1 ${
                                    isRecentlyActive(employee.lastActive) 
                                        ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10' 
                                        : 'border-gray-200 dark:border-slate-800'
                                }`}
                                onClick={() => navigate(`/EmployeeReport/${employee.id}`)}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                {/* Recently Active Indicator */}
                                {isRecentlyActive(employee.lastActive) && (
                                    <div className="absolute -top-1 -right-1">
                                        <span className="flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${getProgressColor(employee.courses)} flex items-center justify-center text-white font-bold shadow-md`}>
                                        {employee.name.charAt(0).toUpperCase()}
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                            employee.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                                        }`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {employee.name}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 truncate">{employee.position}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        {employee.courses}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        employee.status === 'active'
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    }`}>
                                        {employee.status === 'active' ? 'Active' : 'Leave'}
                                    </span>
                                </div>

                                {/* Last Active Time */}
                                <div className={`text-[10px] text-center py-1 rounded-lg mb-2 ${
                                    isRecentlyActive(employee.lastActive)
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold'
                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                                }`}>
                                    <Clock className="h-2.5 w-2.5 inline mr-1" />
                                    {getRelativeTime(employee.lastActive)}
                                </div>
                                
                                <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-gradient-to-r ${getProgressColor(employee.courses)} rounded-full`}
                                        style={{ width: `${Math.min(employee.courses * 10, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4 pb-8">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                            <span className="font-bold text-gray-800 dark:text-white">{filteredEmployees.length}</span> employees displayed
                        </span>
                    </div>
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <span className="text-gray-600 dark:text-slate-400">
                            <span className="font-bold text-gray-800 dark:text-white">{stats.totalCourses}</span> total courses completed
                        </span>
                    </div>
                    
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30">
                        <Star className="h-5 w-5 text-white" />
                        <span className="text-white">
                            Powered by <span className="font-bold">LMS Analytics</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;