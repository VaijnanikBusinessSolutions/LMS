


// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { DUMMY_DATA } from './data';
// import type { Employee } from './types';

// export default function AssessmentTable() {
//   const navigate = useNavigate();
//   const [filterText, setFilterText] = useState("");
//   const [selectedGroup, setSelectedGroup] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [selectedCourse, setSelectedCourse] = useState("All");
//   const [scoreRange, setScoreRange] = useState("All");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
//   const [viewMode, setViewMode] = useState<"table" | "grid">("table");
//   const itemsPerPage = 10;

//   const uniqueGroups = ["All", ...Array.from(new Set(DUMMY_DATA.map(item => item.group)))];
//   const uniqueCourses = ["All", ...Array.from(new Set(DUMMY_DATA.map(item => item.course)))];

//   const filteredData = useMemo(() => {
//     let result = DUMMY_DATA.filter(employee => {
//       const matchesText = 
//         employee.name.toLowerCase().includes(filterText.toLowerCase()) || 
//         employee.email.toLowerCase().includes(filterText.toLowerCase()) ||
//         employee.id.toLowerCase().includes(filterText.toLowerCase());
//       const matchesGroup = selectedGroup === "All" || employee.group === selectedGroup;
//       const matchesCourse = selectedCourse === "All" || employee.course === selectedCourse;
      
//       const isPassed = employee.assessment.postTestScore >= 75;
//       const matchesStatus = selectedStatus === "All" || 
//         (selectedStatus === "Passed" && isPassed) || 
//         (selectedStatus === "Failed" && !isPassed);

//       let matchesScore = true;
//       if (scoreRange === "0-25") matchesScore = employee.assessment.postTestScore <= 25;
//       else if (scoreRange === "26-50") matchesScore = employee.assessment.postTestScore > 25 && employee.assessment.postTestScore <= 50;
//       else if (scoreRange === "51-75") matchesScore = employee.assessment.postTestScore > 50 && employee.assessment.postTestScore <= 75;
//       else if (scoreRange === "76-100") matchesScore = employee.assessment.postTestScore > 75;

//       return matchesText && matchesGroup && matchesCourse && matchesStatus && matchesScore;
//     });

//     // Sorting
//     result.sort((a, b) => {
//       let comparison = 0;
//       if (sortBy === "name") comparison = a.name.localeCompare(b.name);
//       else if (sortBy === "preScore") comparison = a.assessment.preTestScore - b.assessment.preTestScore;
//       else if (sortBy === "postScore") comparison = a.assessment.postTestScore - b.assessment.postTestScore;
//       else if (sortBy === "improvement") {
//         const impA = a.assessment.postTestScore - a.assessment.preTestScore;
//         const impB = b.assessment.postTestScore - b.assessment.preTestScore;
//         comparison = impA - impB;
//       }
//       return sortOrder === "asc" ? comparison : -comparison;
//     });

//     return result;
//   }, [filterText, selectedGroup, selectedCourse, selectedStatus, scoreRange, sortBy, sortOrder]);

//   // Pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handleViewReport = (employeeId: string) => {
//     navigate(`/lms/AnalysisSheet?id=${employeeId}`);
//   };

//   const toggleSelectAll = () => {
//     if (selectedEmployees.length === paginatedData.length) {
//       setSelectedEmployees([]);
//     } else {
//       setSelectedEmployees(paginatedData.map(emp => emp.id));
//     }
//   };

//   const toggleSelectEmployee = (id: string) => {
//     setSelectedEmployees(prev => 
//       prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
//     );
//   };

//   const clearAllFilters = () => {
//     setFilterText("");
//     setSelectedGroup("All");
//     setSelectedCourse("All");
//     setSelectedStatus("All");
//     setScoreRange("All");
//     setSortBy("name");
//     setSortOrder("asc");
//   };

//   const hasActiveFilters = filterText || selectedGroup !== "All" || selectedCourse !== "All" || selectedStatus !== "All" || scoreRange !== "All";

//   // Stats calculation
//   const totalEmployees = DUMMY_DATA.length;
//   const avgPreScore = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + emp.assessment.preTestScore, 0) / totalEmployees);
//   const avgPostScore = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + emp.assessment.postTestScore, 0) / totalEmployees);
//   const passedCount = DUMMY_DATA.filter(emp => emp.assessment.postTestScore >= 75).length;
//   const failedCount = totalEmployees - passedCount;
//   const avgImprovement = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + (emp.assessment.postTestScore - emp.assessment.preTestScore), 0) / totalEmployees);

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Top Navigation Bar */}
//       <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
//         <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//                 </svg>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Assessment Dashboard
//                 </h1>
//                 <p className="text-sm text-slate-500">Track and analyze employee performance</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-3">
//               {/* View Toggle */}
//               <div className="hidden md:flex items-center bg-slate-100 rounded-xl p-1">
//                 <button
//                   onClick={() => setViewMode("table")}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     viewMode === "table" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-600 hover:text-slate-900"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                   </svg>
//                 </button>
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                     viewMode === "grid" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-600 hover:text-slate-900"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Export Button */}
//               <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                 </svg>
//                 Export
//               </button>

//               {/* Add New Button */}
//               <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                 </svg>
//                 <span className="hidden sm:inline">Add Employee</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
//         {/* Stats Cards Row */}
//         <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//           {/* Total Employees */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Total</p>
//                 <p className="text-2xl font-bold text-slate-800">{totalEmployees}</p>
//               </div>
//             </div>
//           </div>

//           {/* Passed */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Passed</p>
//                 <p className="text-2xl font-bold text-emerald-600">{passedCount}</p>
//               </div>
//             </div>
//           </div>

//           {/* Failed */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Failed</p>
//                 <p className="text-2xl font-bold text-rose-600">{failedCount}</p>
//               </div>
//             </div>
//           </div>

//           {/* Avg Pre-Test */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Avg Pre</p>
//                 <p className="text-2xl font-bold text-amber-600">{avgPreScore}%</p>
//               </div>
//             </div>
//           </div>

//           {/* Avg Post-Test */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Avg Post</p>
//                 <p className="text-2xl font-bold text-violet-600">{avgPostScore}%</p>
//               </div>
//             </div>
//           </div>

//           {/* Improvement */}
//           <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 font-medium">Avg Growth</p>
//                 <p className="text-2xl font-bold text-cyan-600">+{avgImprovement}%</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Progress Overview */}
//         <div className="w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
//             <h3 className="text-lg font-bold text-slate-800">Performance Overview</h3>
//             <div className="flex items-center gap-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
//                 <span className="text-slate-600">Passed ({passedCount})</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-rose-500"></span>
//                 <span className="text-slate-600">Failed ({failedCount})</span>
//               </div>
//             </div>
//           </div>
//           <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
//             <div className="h-full flex">
//               <div 
//                 className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
//                 style={{ width: `${(passedCount / totalEmployees) * 100}%` }}
//               ></div>
//               <div 
//                 className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-500"
//                 style={{ width: `${(failedCount / totalEmployees) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//           <div className="flex justify-between mt-2 text-sm text-slate-500">
//             <span>Pass Rate: {Math.round((passedCount / totalEmployees) * 100)}%</span>
//             <span>Fail Rate: {Math.round((failedCount / totalEmployees) * 100)}%</span>
//           </div>
//         </div>

//         {/* Main Content Card */}
//         <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
//           {/* Filters Section */}
//           <div className="w-full p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
//             {/* Search and Quick Filters Row */}
//             <div className="flex flex-col xl:flex-row gap-4 mb-4">
//               {/* Search Input */}
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 shadow-sm"
//                   placeholder="Search by name, email, or employee ID..."
//                   value={filterText}
//                   onChange={(e) => setFilterText(e.target.value)}
//                 />
//                 {filterText && (
//                   <button 
//                     onClick={() => setFilterText("")}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 )}
//               </div>

//               {/* Filter Dropdowns */}
//               <div className="flex flex-wrap items-center gap-3">
//                 {/* Group Filter */}
//                 <div className="relative">
//                   <select
//                     value={selectedGroup}
//                     onChange={(e) => setSelectedGroup(e.target.value)}
//                     className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
//                   >
//                     {uniqueGroups.map(group => (
//                       <option key={group} value={group}>
//                         {group === "All" ? "📁 All Groups" : `📁 ${group}`}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Course Filter */}
//                 <div className="relative">
//                   <select
//                     value={selectedCourse}
//                     onChange={(e) => setSelectedCourse(e.target.value)}
//                     className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
//                   >
//                     {uniqueCourses.map(course => (
//                       <option key={course} value={course}>
//                         {course === "All" ? "📚 All Courses" : `📚 ${course}`}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Status Filter */}
//                 <div className="relative">
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="appearance-none block w-full sm:w-40 py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
//                   >
//                     <option value="All">🎯 All Status</option>
//                     <option value="Passed">✅ Passed</option>
//                     <option value="Failed">❌ Failed</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>

//                 {/* Score Range Filter */}
//                 <div className="relative">
//                   <select
//                     value={scoreRange}
//                     onChange={(e) => setScoreRange(e.target.value)}
//                     className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
//                   >
//                     <option value="All">📊 All Scores</option>
//                     <option value="0-25">📉 0-25%</option>
//                     <option value="26-50">📈 26-50%</option>
//                     <option value="51-75">📊 51-75%</option>
//                     <option value="76-100">🏆 76-100%</option>
//                   </select>
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Sort and Results Row */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//               <div className="flex flex-wrap items-center gap-3">
//                 {/* Sort By */}
//                 <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
//                   <span className="text-sm text-slate-500 font-medium">Sort:</span>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="appearance-none bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer pr-6"
//                   >
//                     <option value="name">Name</option>
//                     <option value="preScore">Pre-Test</option>
//                     <option value="postScore">Post-Test</option>
//                     <option value="improvement">Improvement</option>
//                   </select>
//                   <button
//                     onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
//                     className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
//                   >
//                     {sortOrder === "asc" ? (
//                       <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
//                       </svg>
//                     ) : (
//                       <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>

//                 {/* Clear Filters */}
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors border border-rose-200"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Clear Filters
//                   </button>
//                 )}
//               </div>

//               {/* Results Count */}
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/30">
//                   <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
//                   <span className="text-sm font-bold">{filteredData.length} Results</span>
//                 </div>
//                 {selectedEmployees.length > 0 && (
//                   <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl shadow-lg shadow-violet-500/30">
//                     <span className="text-sm font-bold">{selectedEmployees.length} Selected</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Bulk Actions */}
//           {selectedEmployees.length > 0 && (
//             <div className="w-full px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200 flex items-center justify-between">
//               <span className="text-sm font-medium text-violet-700">
//                 {selectedEmployees.length} employee(s) selected
//               </span>
//               <div className="flex items-center gap-2">
//                 <button className="px-4 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors">
//                   📧 Send Email
//                 </button>
//                 <button className="px-4 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors">
//                   📥 Export Selected
//                 </button>
//                 <button className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors">
//                   🗑️ Delete
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Table View */}
//           {viewMode === "table" ? (
//             <div className="w-full overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
//                     <th className="px-6 py-4 text-left">
//                       <input
//                         type="checkbox"
//                         checked={selectedEmployees.length === paginatedData.length && paginatedData.length > 0}
//                         onChange={toggleSelectAll}
//                         className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                       />
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
//                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Group</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Pre-Test</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Post-Test</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Growth</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedData.length === 0 ? (
//                     <tr>
//                       <td colSpan={10} className="px-6 py-20 text-center">
//                         <div className="flex flex-col items-center">
//                           <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//                             <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </div>
//                           <p className="text-xl font-bold text-slate-800">No employees found</p>
//                           <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
//                           <button
//                             onClick={clearAllFilters}
//                             className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
//                           >
//                             Clear All Filters
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     paginatedData.map((emp) => {
//                       const improvement = emp.assessment.postTestScore - emp.assessment.preTestScore;
//                       const isPassed = emp.assessment.postTestScore >= 75;
//                       const isSelected = selectedEmployees.includes(emp.id);
                      
//                       return (
//                         <tr 
//                           key={emp.id} 
//                           className={`hover:bg-blue-50/50 transition-all duration-200 group ${isSelected ? 'bg-violet-50' : ''}`}
//                         >
//                           <td className="px-6 py-5">
//                             <input
//                               type="checkbox"
//                               checked={isSelected}
//                               onChange={() => toggleSelectEmployee(emp.id)}
//                               className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                             />
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap">
//                             <span className="text-sm text-slate-600 font-mono bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
//                               {emp.id}
//                             </span>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap">
//                             <div className="flex items-center gap-4">
//                               <div className="relative">
//                                 <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
//                                   isPassed 
//                                     ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-500/30' 
//                                     : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30'
//                                 }`}>
//                                   {emp.name.charAt(0)}
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
//                                   {emp.name}
//                                 </div>
//                                 <div className="text-sm text-slate-500">{emp.email}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <span className="text-lg">📚</span>
//                               <span className="text-sm text-slate-700 font-medium">{emp.course}</span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap">
//                             <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200">
//                               {emp.group}
//                             </span>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap text-center">
//                             <div className="inline-flex flex-col items-center">
//                               <span className="text-lg font-bold text-amber-600">{emp.assessment.preTestScore}%</span>
//                               <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
//                                 <div 
//                                   className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
//                                   style={{ width: `${emp.assessment.preTestScore}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap text-center">
//                             <div className="inline-flex flex-col items-center">
//                               <span className={`text-lg font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
//                                 {emp.assessment.postTestScore}%
//                               </span>
//                               <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
//                                 <div 
//                                   className={`h-full rounded-full ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`}
//                                   style={{ width: `${emp.assessment.postTestScore}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap text-center">
//                             <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold ${
//                               improvement >= 0 
//                                 ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' 
//                                 : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200'
//                             }`}>
//                               {improvement >= 0 ? (
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
//                                 </svg>
//                               ) : (
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                                 </svg>
//                               )}
//                               {improvement >= 0 ? '+' : ''}{improvement}%
//                             </span>
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap text-center">
//                             {isPassed ? (
//                               <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                 </svg>
//                                 Passed
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-500/30">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                                 Failed
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-6 py-5 whitespace-nowrap text-center">
//                             <div className="flex items-center justify-center gap-2">
//                               <button
//                                 onClick={() => handleViewReport(emp.id)}
//                                 className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
//                               >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                 </svg>
//                                 View
//                               </button>
//                               <button className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             /* Grid View */
//             <div className="w-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {paginatedData.length === 0 ? (
//                 <div className="col-span-full py-20 text-center">
//                   <div className="flex flex-col items-center">
//                     <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
//                       <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <p className="text-xl font-bold text-slate-800">No employees found</p>
//                     <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
//                   </div>
//                 </div>
//               ) : (
//                 paginatedData.map((emp) => {
//                   const improvement = emp.assessment.postTestScore - emp.assessment.preTestScore;
//                   const isPassed = emp.assessment.postTestScore >= 75;
                  
//                   return (
//                     <div 
//                       key={emp.id}
//                       className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                           <div className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ${
//                             isPassed 
//                               ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-500/30' 
//                               : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30'
//                           }`}>
//                             {emp.name.charAt(0)}
//                           </div>
//                           <div>
//                             <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{emp.name}</h3>
//                             <p className="text-sm text-slate-500">{emp.id}</p>
//                           </div>
//                         </div>
//                         {isPassed ? (
//                           <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">✓ Passed</span>
//                         ) : (
//                           <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold">✗ Failed</span>
//                         )}
//                       </div>
                      
//                       <div className="space-y-3 mb-4">
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                           <span>📧</span>
//                           <span className="truncate">{emp.email}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                           <span>📚</span>
//                           <span>{emp.course}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className="px-2 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
//                             {emp.group}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-2 mb-4">
//                         <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-200">
//                           <p className="text-xs text-amber-600 font-medium">Pre</p>
//                           <p className="text-lg font-bold text-amber-700">{emp.assessment.preTestScore}%</p>
//                         </div>
//                         <div className={`rounded-lg p-2 text-center border ${isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
//                           <p className={`text-xs font-medium ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>Post</p>
//                           <p className={`text-lg font-bold ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>{emp.assessment.postTestScore}%</p>
//                         </div>
//                         <div className={`rounded-lg p-2 text-center border ${improvement >= 0 ? 'bg-cyan-50 border-cyan-200' : 'bg-rose-50 border-rose-200'}`}>
//                           <p className={`text-xs font-medium ${improvement >= 0 ? 'text-cyan-600' : 'text-rose-600'}`}>Growth</p>
//                           <p className={`text-lg font-bold ${improvement >= 0 ? 'text-cyan-700' : 'text-rose-700'}`}>
//                             {improvement >= 0 ? '+' : ''}{improvement}%
//                           </p>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() => handleViewReport(emp.id)}
//                         className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
//                       >
//                         View Report →
//                       </button>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           )}

//           {/* Pagination */}
//           {filteredData.length > 0 && (
//             <div className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
//               <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <p className="text-sm text-slate-600">
//                     Showing <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
//                     <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
//                     <span className="font-bold text-slate-800">{filteredData.length}</span> results
//                   </p>
//                   <div className="hidden sm:flex items-center gap-2">
//                     <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
//                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                       Passed ≥75%
//                     </span>
//                     <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
//                       <span className="w-2 h-2 rounded-full bg-rose-500"></span>
//                       Failed &lt;75%
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setCurrentPage(1)}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//                     </svg>
//                   </button>
                  
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
//                             currentPage === pageNum
//                               ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
//                               : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>
                  
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage(totalPages)}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="w-full text-center mt-8">
//           <p className="text-sm text-slate-500">
//             Assessment Management System • Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_DATA } from './data';
import type { Employee } from './types';

export default function AssessmentTable() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [scoreRange, setScoreRange] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const itemsPerPage = 10;

  const uniqueGroups = ["All", ...Array.from(new Set(DUMMY_DATA.map(item => item.group)))];
  const uniqueCourses = ["All", ...Array.from(new Set(DUMMY_DATA.map(item => item.course)))];

  const filteredData = useMemo(() => {
    let result = DUMMY_DATA.filter(employee => {
      const matchesText = 
        employee.name.toLowerCase().includes(filterText.toLowerCase()) || 
        employee.email.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.id.toLowerCase().includes(filterText.toLowerCase());
      const matchesGroup = selectedGroup === "All" || employee.group === selectedGroup;
      const matchesCourse = selectedCourse === "All" || employee.course === selectedCourse;
      
      const isPassed = employee.assessment.postTestScore >= 75;
      const matchesStatus = selectedStatus === "All" || 
        (selectedStatus === "Passed" && isPassed) || 
        (selectedStatus === "Failed" && !isPassed);

      let matchesScore = true;
      if (scoreRange === "0-25") matchesScore = employee.assessment.postTestScore <= 25;
      else if (scoreRange === "26-50") matchesScore = employee.assessment.postTestScore > 25 && employee.assessment.postTestScore <= 50;
      else if (scoreRange === "51-75") matchesScore = employee.assessment.postTestScore > 50 && employee.assessment.postTestScore <= 75;
      else if (scoreRange === "76-100") matchesScore = employee.assessment.postTestScore > 75;

      return matchesText && matchesGroup && matchesCourse && matchesStatus && matchesScore;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name.localeCompare(b.name);
      else if (sortBy === "preScore") comparison = a.assessment.preTestScore - b.assessment.preTestScore;
      else if (sortBy === "postScore") comparison = a.assessment.postTestScore - b.assessment.postTestScore;
      else if (sortBy === "improvement") {
        const impA = a.assessment.postTestScore - a.assessment.preTestScore;
        const impB = b.assessment.postTestScore - b.assessment.preTestScore;
        comparison = impA - impB;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [filterText, selectedGroup, selectedCourse, selectedStatus, scoreRange, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleViewReport = (employeeId: string) => {
    navigate(`/lms/AnalysisSheet?id=${employeeId}`);
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === paginatedData.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedData.map(emp => emp.id));
    }
  };

  const toggleSelectEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setFilterText("");
    setSelectedGroup("All");
    setSelectedCourse("All");
    setSelectedStatus("All");
    setScoreRange("All");
    setSortBy("name");
    setSortOrder("asc");
  };

  const hasActiveFilters = filterText || selectedGroup !== "All" || selectedCourse !== "All" || selectedStatus !== "All" || scoreRange !== "All";

  // Stats calculation
  const totalEmployees = DUMMY_DATA.length;
  const avgPreScore = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + emp.assessment.preTestScore, 0) / totalEmployees);
  const avgPostScore = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + emp.assessment.postTestScore, 0) / totalEmployees);
  const passedCount = DUMMY_DATA.filter(emp => emp.assessment.postTestScore >= 75).length;
  const failedCount = totalEmployees - passedCount;
  const avgImprovement = Math.round(DUMMY_DATA.reduce((acc, emp) => acc + (emp.assessment.postTestScore - emp.assessment.preTestScore), 0) / totalEmployees);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Assessment Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Track and analyze employee performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 transition-colors duration-300">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "table" 
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>

              {/* Export Button */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>

              {/* Add New Button */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Employee</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards Row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {/* Total Employees */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{totalEmployees}</p>
              </div>
            </div>
          </div>

          {/* Passed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Passed</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedCount}</p>
              </div>
            </div>
          </div>

          {/* Failed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Failed</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{failedCount}</p>
              </div>
            </div>
          </div>

          {/* Avg Pre-Test */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Pre</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{avgPreScore}%</p>
              </div>
            </div>
          </div>

          {/* Avg Post-Test */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Post</p>
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{avgPostScore}%</p>
              </div>
            </div>
          </div>

          {/* Improvement */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Growth</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">+{avgImprovement}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Performance Overview</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Passed ({passedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Failed ({failedCount})</span>
              </div>
            </div>
          </div>
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                style={{ width: `${(passedCount / totalEmployees) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-red-500 transition-all duration-500"
                style={{ width: `${(failedCount / totalEmployees) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Pass Rate: {Math.round((passedCount / totalEmployees) * 100)}%</span>
            <span>Fail Rate: {Math.round((failedCount / totalEmployees) * 100)}%</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          {/* Filters Section */}
          <div className="w-full p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border-b border-slate-200 dark:border-slate-700">
            {/* Search and Quick Filters Row */}
            <div className="flex flex-col xl:flex-row gap-4 mb-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 shadow-sm"
                  placeholder="Search by name, email, or employee ID..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                {filterText && (
                  <button 
                    onClick={() => setFilterText("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Group Filter */}
                <div className="relative">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
                  >
                    {uniqueGroups.map(group => (
                      <option key={group} value={group} className="dark:bg-slate-800">
                        {group === "All" ? "📁 All Groups" : `📁 ${group}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Course Filter */}
                <div className="relative">
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
                  >
                    {uniqueCourses.map(course => (
                      <option key={course} value={course} className="dark:bg-slate-800">
                        {course === "All" ? "📚 All Courses" : `📚 ${course}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="appearance-none block w-full sm:w-40 py-3.5 pl-4 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
                  >
                    <option value="All" className="dark:bg-slate-800">🎯 All Status</option>
                    <option value="Passed" className="dark:bg-slate-800">✅ Passed</option>
                    <option value="Failed" className="dark:bg-slate-800">❌ Failed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Score Range Filter */}
                <div className="relative">
                  <select
                    value={scoreRange}
                    onChange={(e) => setScoreRange(e.target.value)}
                    className="appearance-none block w-full sm:w-44 py-3.5 pl-4 pr-10 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 cursor-pointer shadow-sm text-sm font-medium"
                  >
                    <option value="All" className="dark:bg-slate-800">📊 All Scores</option>
                    <option value="0-25" className="dark:bg-slate-800">📉 0-25%</option>
                    <option value="26-50" className="dark:bg-slate-800">📈 26-50%</option>
                    <option value="51-75" className="dark:bg-slate-800">📊 51-75%</option>
                    <option value="76-100" className="dark:bg-slate-800">🏆 76-100%</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort and Results Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Sort By */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-sm">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-6 dark:bg-slate-800"
                  >
                    <option value="name" className="dark:bg-slate-800">Name</option>
                    <option value="preScore" className="dark:bg-slate-800">Pre-Test</option>
                    <option value="postScore" className="dark:bg-slate-800">Post-Test</option>
                    <option value="improvement" className="dark:bg-slate-800">Improvement</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {sortOrder === "asc" ? (
                      <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors border border-rose-200 dark:border-rose-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-sm font-bold">{filteredData.length} Results</span>
                </div>
                {selectedEmployees.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600 text-white rounded-xl shadow-lg shadow-violet-500/30 dark:shadow-violet-900/30">
                    <span className="text-sm font-bold">{selectedEmployees.length} Selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedEmployees.length > 0 && (
            <div className="w-full px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {selectedEmployees.length} employee(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors">
                  📧 Send Email
                </button>
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors">
                  📥 Export Selected
                </button>
                <button className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors">
                  🗑️ Delete
                </button>
              </div>
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.length === paginatedData.length && paginatedData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer dark:bg-slate-700"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pre-Test</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Post-Test</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Growth</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-200">No employees found</p>
                          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters</p>
                          <button
                            onClick={clearAllFilters}
                            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 hover:shadow-xl transition-all"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((emp) => {
                      const improvement = emp.assessment.postTestScore - emp.assessment.preTestScore;
                      const isPassed = emp.assessment.postTestScore >= 75;
                      const isSelected = selectedEmployees.includes(emp.id);
                      
                      return (
                        <tr 
                          key={emp.id} 
                          className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 group ${isSelected ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}
                        >
                          <td className="px-6 py-5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectEmployee(emp.id)}
                              className="w-5 h-5 rounded-md border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer dark:bg-slate-700"
                            />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                              {emp.id}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                                  isPassed 
                                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-500/30 dark:shadow-emerald-900/30' 
                                    : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30 dark:shadow-amber-900/30'
                                }`}>
                                  {emp.name.charAt(0)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {emp.name}
                                </div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📚</span>
                              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{emp.course}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {emp.group}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{emp.assessment.preTestScore}%</span>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                  style={{ width: `${emp.assessment.preTestScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className={`text-lg font-bold ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {emp.assessment.postTestScore}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
                                <div 
                                  className={`h-full rounded-full ${isPassed ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`}
                                  style={{ width: `${emp.assessment.postTestScore}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold ${
                              improvement >= 0 
                                ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                                : 'bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            }`}>
                              {improvement >= 0 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                              )}
                              {improvement >= 0 ? '+' : ''}{improvement}%
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            {isPassed ? (
                              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/30">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-500/30 dark:shadow-rose-900/30">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewReport(emp.id)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View
                              </button>
                              <button className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="w-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedData.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">No employees found</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                paginatedData.map((emp) => {
                  const improvement = emp.assessment.postTestScore - emp.assessment.preTestScore;
                  const isPassed = emp.assessment.postTestScore >= 75;
                  
                  return (
                    <div 
                      key={emp.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-blue-100 dark:hover:shadow-blue-900/20 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-14 w-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ${
                            isPassed 
                              ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-500/30 dark:shadow-emerald-900/30' 
                              : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30 dark:shadow-amber-900/30'
                          }`}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{emp.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{emp.id}</p>
                          </div>
                        </div>
                        {isPassed ? (
                          <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">✓ Passed</span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-bold">✗ Failed</span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>📧</span>
                          <span className="truncate">{emp.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>📚</span>
                          <span>{emp.course}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            {emp.group}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 text-center border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Pre</p>
                          <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{emp.assessment.preTestScore}%</p>
                        </div>
                        <div className={`rounded-lg p-2 text-center border ${isPassed ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}>
                          <p className={`text-xs font-medium ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>Post</p>
                          <p className={`text-lg font-bold ${isPassed ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{emp.assessment.postTestScore}%</p>
                        </div>
                        <div className={`rounded-lg p-2 text-center border ${improvement >= 0 ? 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'}`}>
                          <p className={`text-xs font-medium ${improvement >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-600 dark:text-rose-400'}`}>Growth</p>
                          <p className={`text-lg font-bold ${improvement >= 0 ? 'text-cyan-700 dark:text-cyan-300' : 'text-rose-700 dark:text-rose-300'}`}>
                            {improvement >= 0 ? '+' : ''}{improvement}%
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewReport(emp.id)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 dark:shadow-blue-900/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                      >
                        View Report →
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800/50 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of{' '}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{filteredData.length}</span> results
                  </p>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Passed ≥75%
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Failed &lt;75%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Assessment Management System • Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}


