// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//     ArrowLeft,
//     Loader2,
//     BookOpen,
//     Award,
//     ClipboardCheck,
//     TrendingUp,
//     User,
//     Mail,
//     Calendar,
//     GraduationCap,
//     FileText
// } from 'lucide-react';

// // Define interfaces for the data structure
// interface UserInfo {
//     name: string;
//     email: string;
//     joined: string;
// }

// interface OverallStats {
//     total_courses: number;
//     tests_passed: number;
//     total_tests: number;
// }

// interface CourseDetail {
//     title: string;
//     progress: number;
//     status: string;
// }

// interface WorkflowStat {
//     course_title: string;
//     course_id: number;
//     instructor_name: string;
//     current_status: string;
//     assigned_level: string;
//     pre_test_score: number | null;
//     pre_test_submitted_at: string | null;
//     post_test_score: number | null;
//     post_test_submitted_at: string | null;
// }

// interface EmployeeDetailedReport {
//     id: number;
//     user_info: UserInfo;
//     overall_stats: OverallStats;
//     course_details: CourseDetail[];
//     workflow_stats: WorkflowStat[];
// }

// const EmployeeReport: React.FC = () => {
//     const { employeeId } = useParams<{ employeeId: string }>();
//     const navigate = useNavigate();
//     const [reportData, setReportData] = useState<EmployeeDetailedReport | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     const API_BASE_URL = 'http://127.0.0.1:8000/lms';

//     useEffect(() => {
//         const fetchReport = async () => {
//             if (!employeeId) {
//                 setError("Employee ID not provided.");
//                 setLoading(false);
//                 return;
//             }

//             setLoading(true);
//             setError(null);

//             const authData = localStorage.getItem("auth");
//             const token = authData ? JSON.parse(authData).accessToken : "";

//             if (!token) {
//                 navigate('/login');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/generate_report/`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 setReportData(response.data);
//             } catch (err) {
//                 console.error("Failed to fetch employee report:", err);
//                 if (axios.isAxiosError(err) && err.response?.status === 401) {
//                     navigate('/login');
//                 } else {
//                     setError("Failed to load report. Please try again.");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReport();
//     }, [employeeId, navigate]);

//     const formatDateTime = (isoString: string | null | undefined): string => {
//         if (!isoString) return "N/A";
//         try {
//             const date = new Date(isoString);
//             return date.toLocaleString('en-US', {
//                 year: 'numeric',
//                 month: 'short',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true
//             });
//         } catch {
//             return "N/A";
//         }
//     };

//     const getStatusColor = (status: string | null | undefined): string => {
//         if (!status) {
//             return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
//         }

//         const statusLower = status.toLowerCase();

//         if (statusLower.includes('complete') || statusLower.includes('passed')) {
//             return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
//         }
//         if (statusLower.includes('progress') || statusLower.includes('ongoing')) {
//             return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
//         }
//         if (statusLower.includes('failed') || statusLower.includes('incomplete')) {
//             return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
//         }
//         if (statusLower.includes('pending') || statusLower.includes('waiting')) {
//             return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
//         }

//         return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
//     };

//     const getProgressColor = (progress: number | null | undefined): string => {
//         if (progress == null) return 'bg-gradient-to-r from-slate-400 to-slate-500';

//         if (progress >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
//         if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600';
//         if (progress >= 25) return 'bg-gradient-to-r from-amber-500 to-amber-600';
//         return 'bg-gradient-to-r from-rose-500 to-rose-600';
//     };

//     const getStatusText = (status: string | null | undefined): string => {
//         return status || 'Unknown';
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
//                 <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
//                     <Loader2 className="relative h-12 w-12 animate-spin text-violet-600 dark:text-violet-400" />
//                 </div>
//                 <p className="mt-6 text-slate-700 dark:text-slate-300 text-lg font-medium">Loading report...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
//                 <div className="max-w-lg mx-auto">
//                     <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-8 text-center">
//                         <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                             <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                             </svg>
//                         </div>
//                         <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Report</h2>
//                         <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
//                         <button
//                             onClick={() => navigate(-1)}
//                             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 text-white rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg shadow-slate-500/20"
//                         >
//                             <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employee List
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (!reportData) {
//         return (
//             <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
//                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-md">
//                     <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
//                         <FileText className="w-8 h-8 text-slate-400" />
//                     </div>
//                     <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">No report data found for this employee.</p>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 text-white rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg shadow-slate-500/20"
//                     >
//                         <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employee List
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const { user_info, overall_stats, course_details, workflow_stats } = reportData;

//     const passRate = overall_stats?.total_tests > 0
//         ? Math.round((overall_stats.tests_passed / overall_stats.total_tests) * 100)
//         : 0;

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="mb-6 group inline-flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
//                 >
//                     <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
//                     Back to Employee List
//                 </button>

//                 {/* Page Header - Enhanced with Background */}
//                 <div className="mb-8 text-center relative">
//                     <div className="absolute inset-0 -top-8 -bottom-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-3xl blur-2xl"></div>
//                     <div className="relative bg-blue-to-r from-gray/100 via-white/60 to-white/80 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 backdrop-blur-sm rounded-2xl py-8 px-6 border border-white/50 dark:border-slate-700/50 shadow-xl shadow-purple-500/10">
//                         <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm mb-4">
//                             Performance Report
//                         </h1>
//                         <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
//                             Detailed analytics for{' '}
//                             <span
//                                 className="relative font-bold text-emerald-600 dark:text-emerald-400 
//                        cursor-pointer transition-colors duration-300
//                        hover:text-emerald-700 dark:hover:text-emerald-300
//                        after:content-[''] after:absolute after:left-0 after:bottom-0 
//                        after:w-0 after:h-0.5 after:bg-emerald-500 dark:after:bg-emerald-400
//                        after:transition-all after:duration-300
//                        hover:after:w-full"
//                             >
//                                 {user_info?.name || 'Unknown'}
//                             </span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Employee Info Card - Enhanced with Hover */}
//                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 mb-8 overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/70 hover:-translate-y-1">
//                     <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-teal-500/10 dark:from-violet-500/5 dark:via-blue-500/5 dark:to-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

//                     <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
//                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-500/30">
//                             <User className="w-5 h-5 text-white" />
//                         </div>
//                         Employee Information
//                     </h2>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
//                         <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
//                             <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
//                                 <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Full Name</p>
//                                 <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.name || 'N/A'}</p>
//                             </div>
//                         </div>

//                         <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
//                             <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
//                                 <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
//                                 <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.email || 'N/A'}</p>
//                             </div>
//                         </div>

//                         <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
//                             <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
//                                 <Calendar className="w-6 h-6 text-slate-600 dark:text-slate-400" />
//                             </div>
//                             <div>
//                                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Date Joined</p>
//                                 <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.joined || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Statistics Cards - Enhanced Hover Effects */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     {/* Card 1 - Purple/Violet */}
//                     <div className="relative group cursor-pointer">
//                         <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
//                         <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 rounded-2xl p-6 shadow-lg shadow-violet-500/25 dark:shadow-violet-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-violet-500/40 group-hover:-translate-y-2">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="relative">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
//                                     <BookOpen className="w-6 h-6 text-white" />
//                                 </div>
//                                 <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.total_courses ?? 0}</p>
//                                 <p className="text-violet-100 font-medium">Courses Assigned</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Card 2 - Emerald/Green */}
//                     <div className="relative group cursor-pointer">
//                         <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
//                         <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl p-6 shadow-lg shadow-emerald-500/25 dark:shadow-emerald-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-500/40 group-hover:-translate-y-2">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="relative">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
//                                     <Award className="w-6 h-6 text-white" />
//                                 </div>
//                                 <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.tests_passed ?? 0}</p>
//                                 <p className="text-emerald-100 font-medium">Tests Passed</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Card 3 - Blue/Sky */}
//                     <div className="relative group cursor-pointer">
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
//                         <div className="relative bg-gradient-to-br from-blue-500 to-sky-600 dark:from-blue-600 dark:to-sky-700 rounded-2xl p-6 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/40 group-hover:-translate-y-2">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="relative">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
//                                     <ClipboardCheck className="w-6 h-6 text-white" />
//                                 </div>
//                                 <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.total_tests ?? 0}</p>
//                                 <p className="text-blue-100 font-medium">Total Tests Attempted</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Card 4 - Amber/Orange */}
//                     <div className="relative group cursor-pointer">
//                         <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
//                         <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-6 shadow-lg shadow-amber-500/25 dark:shadow-amber-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-amber-500/40 group-hover:-translate-y-2">
//                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
//                             <div className="relative">
//                                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
//                                     <TrendingUp className="w-6 h-6 text-white" />
//                                 </div>
//                                 <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{passRate}%</p>
//                                 <p className="text-amber-100 font-medium">Pass Rate</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Course Progress Overview Section */}
//                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
//                     {/* Section Header - Enhanced Gradient Background */}
//                     <div className="relative overflow-hidden">
//                         <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:via-cyan-500/10 dark:to-emerald-500/10"></div>
//                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent"></div>
//                         <div className="relative bg-gradient-to-r from-slate-50/90 via-white/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 backdrop-blur-sm px-6 py-5 border-b border-teal-200/50 dark:border-teal-700/30">
//                             <div className="flex items-center">
//                                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-teal-500/40 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
//                                     <GraduationCap className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-700 via-cyan-600 to-emerald-600 dark:from-teal-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
//                                         Course Progress Overview
//                                     </h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
//                                         Track learning progress across all assigned courses
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="min-w-full">
//                             <thead>
//                                 <tr className="bg-slate-50 dark:bg-slate-800/50">
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Course Title
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Progress
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//                                 {!course_details || course_details.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={3} className="px-6 py-12 text-center">
//                                             <div className="flex flex-col items-center">
//                                                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
//                                                     <BookOpen className="w-8 h-8 text-slate-400" />
//                                                 </div>
//                                                 <p className="text-slate-500 dark:text-slate-400 font-medium">No course details available</p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     course_details.map((course, index) => (
//                                         <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
//                                             <td className="px-6 py-4">
//                                                 <span className="font-semibold text-slate-900 dark:text-white">
//                                                     {course?.title || 'Untitled Course'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
//                                                         <div
//                                                             className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(course?.progress)}`}
//                                                             style={{ width: `${course?.progress ?? 0}%` }}
//                                                         ></div>
//                                                     </div>
//                                                     <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-[3rem]">
//                                                         {course?.progress ?? 0}%
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(course?.status)}`}>
//                                                     {getStatusText(course?.status)}
//                                                 </span>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Course Specific Reports Section */}
//                 <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
//                     {/* Section Header - Enhanced Gradient Background */}
//                     <div className="relative overflow-hidden">
//                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10"></div>
//                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-400/10 via-transparent to-transparent"></div>
//                         <div className="relative bg-gradient-to-r from-indigo-50/90 via-violet-50/80 to-purple-50/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 backdrop-blur-sm px-6 py-5 border-b border-indigo-200/50 dark:border-indigo-700/30">
//                             <div className="flex items-center">
//                                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/40 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
//                                     <FileText className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
//                                         Course Specific Reports
//                                     </h2>
//                                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
//                                         Pre-test & Post-test performance analysis
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="min-w-full">
//                             <thead>
//                                 <tr className="bg-slate-50 dark:bg-slate-800/50">
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Course Title
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Instructor
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Level
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Pre-Test
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
//                                         Post-Test
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
//                                 {!workflow_stats || workflow_stats.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={6} className="px-6 py-12 text-center">
//                                             <div className="flex flex-col items-center">
//                                                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
//                                                     <ClipboardCheck className="w-8 h-8 text-slate-400" />
//                                                 </div>
//                                                 <p className="text-slate-500 dark:text-slate-400 font-medium">No course specific reports available</p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     workflow_stats.map((stat, index) => (
//                                         <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
//                                             <td className="px-6 py-4">
//                                                 <span className="font-semibold text-slate-900 dark:text-white">
//                                                     {stat?.course_title || 'Untitled Course'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className="text-slate-600 dark:text-slate-400">
//                                                     {stat?.instructor_name || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
//                                                     {stat?.assigned_level || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(stat?.current_status)}`}>
//                                                     {getStatusText(stat?.current_status)}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="space-y-1">
//                                                     <div className="flex items-center">
//                                                         {stat?.pre_test_score != null ? (
//                                                             <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${stat.pre_test_score >= 70
//                                                                     ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
//                                                                     : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
//                                                                 }`}>
//                                                                 {stat.pre_test_score}%
//                                                             </span>
//                                                         ) : (
//                                                             <span className="text-slate-400 dark:text-slate-500 text-sm">Not taken</span>
//                                                         )}
//                                                     </div>
//                                                     {stat?.pre_test_submitted_at && (
//                                                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                                                             {formatDateTime(stat.pre_test_submitted_at)}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4">
//                                                 <div className="space-y-1">
//                                                     <div className="flex items-center">
//                                                         {stat?.post_test_score != null ? (
//                                                             <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${stat.post_test_score >= 70
//                                                                     ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
//                                                                     : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
//                                                                 }`}>
//                                                                 {stat.post_test_score}%
//                                                             </span>
//                                                         ) : (
//                                                             <span className="text-slate-400 dark:text-slate-500 text-sm">Not taken</span>
//                                                         )}
//                                                     </div>
//                                                     {stat?.post_test_submitted_at && (
//                                                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                                                             {formatDateTime(stat.post_test_submitted_at)}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Footer Spacing */}
//                 <div className="h-8"></div>
//             </div>
//         </div>
//     );
// };

// export default EmployeeReport;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    Loader2,
    BookOpen,
    Award,
    ClipboardCheck,
    TrendingUp,
    User,
    Mail,
    Calendar,
    GraduationCap,
    FileText,
    RefreshCcw // Imported icon for attempts
} from 'lucide-react';

// Define interfaces for the data structure
interface UserInfo {
    name: string;
    email: string;
    joined: string;
}

interface OverallStats {
    total_courses: number;
    tests_passed: number;
    total_tests: number;
}

interface CourseDetail {
    title: string;
    progress: number;
    status: string;
}

interface WorkflowStat {
    course_title: string;
    course_id: number;
    instructor_name: string;
    current_status: string;
    assigned_level: string;
    pre_test_score: number | null;
    pre_test_submitted_at: string | null;
    post_test_score: number | null;
    post_test_submitted_at: string | null;
    attempts: number; // <--- NEW FIELD ADDED HERE
}

interface EmployeeDetailedReport {
    id: number;
    user_info: UserInfo;
    overall_stats: OverallStats;
    course_details: CourseDetail[];
    workflow_stats: WorkflowStat[];
}

const EmployeeReport: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState<EmployeeDetailedReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = 'http://127.0.0.1:8000/lms';

    useEffect(() => {
        const fetchReport = async () => {
            if (!employeeId) {
                setError("Employee ID not provided.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const authData = localStorage.getItem("auth");
            const token = authData ? JSON.parse(authData).accessToken : "";

            if (!token) {
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/generate_report/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReportData(response.data);
            } catch (err) {
                console.error("Failed to fetch employee report:", err);
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError("Failed to load report. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [employeeId, navigate]);

    const formatDateTime = (isoString: string | null | undefined): string => {
        if (!isoString) return "N/A";
        try {
            const date = new Date(isoString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return "N/A";
        }
    };

    const getStatusColor = (status: string | null | undefined): string => {
        if (!status) {
            return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }

        const statusLower = status.toLowerCase();

        if (statusLower.includes('complete') || statusLower.includes('passed')) {
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        }
        if (statusLower.includes('progress') || statusLower.includes('ongoing')) {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
        if (statusLower.includes('failed') || statusLower.includes('incomplete')) {
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        }
        if (statusLower.includes('pending') || statusLower.includes('waiting')) {
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    };

    const getProgressColor = (progress: number | null | undefined): string => {
        if (progress == null) return 'bg-gradient-to-r from-slate-400 to-slate-500';

        if (progress >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
        if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600';
        if (progress >= 25) return 'bg-gradient-to-r from-amber-500 to-amber-600';
        return 'bg-gradient-to-r from-rose-500 to-rose-600';
    };

    const getStatusText = (status: string | null | undefined): string => {
        return status || 'Unknown';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <Loader2 className="relative h-12 w-12 animate-spin text-violet-600 dark:text-violet-400" />
                </div>
                <p className="mt-6 text-slate-700 dark:text-slate-300 text-lg font-medium">Loading report...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
                <div className="max-w-lg mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Report</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 text-white rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg shadow-slate-500/20"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employee List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-lg mb-6">No report data found for this employee.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 text-white rounded-xl font-medium hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-lg shadow-slate-500/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Employee List
                    </button>
                </div>
            </div>
        );
    }

    const { user_info, overall_stats, course_details, workflow_stats } = reportData;

    const passRate = overall_stats?.total_tests > 0
        ? Math.round((overall_stats.tests_passed / overall_stats.total_tests) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 group inline-flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Employee List
                </button>

                {/* Page Header */}
                <div className="mb-8 text-center relative">
                    <div className="absolute inset-0 -top-8 -bottom-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-blue-to-r from-gray/100 via-white/60 to-white/80 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 backdrop-blur-sm rounded-2xl py-8 px-6 border border-white/50 dark:border-slate-700/50 shadow-xl shadow-purple-500/10">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-sm mb-4">
                            Performance Report
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-400 text-lg">
                            Detailed analytics for{' '}
                            <span
                                className="relative font-bold text-emerald-600 dark:text-emerald-400 
                       cursor-pointer transition-colors duration-300
                       hover:text-emerald-700 dark:hover:text-emerald-300
                       after:content-[''] after:absolute after:left-0 after:bottom-0 
                       after:w-0 after:h-0.5 after:bg-emerald-500 dark:after:bg-emerald-400
                       after:transition-all after:duration-300
                       hover:after:w-full"
                            >
                                {user_info?.name || 'Unknown'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Employee Info Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 mb-8 overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-slate-900/70 hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-teal-500/10 dark:from-violet-500/5 dark:via-blue-500/5 dark:to-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mr-3 shadow-lg shadow-violet-500/30">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Employee Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Full Name</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Date Joined</p>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">{user_info?.joined || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
                        <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 rounded-2xl p-6 shadow-lg shadow-violet-500/25 dark:shadow-violet-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-violet-500/40 group-hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.total_courses ?? 0}</p>
                                <p className="text-violet-100 font-medium">Courses Assigned</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
                        <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl p-6 shadow-lg shadow-emerald-500/25 dark:shadow-emerald-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-emerald-500/40 group-hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.tests_passed ?? 0}</p>
                                <p className="text-emerald-100 font-medium">Tests Passed</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-sky-600 dark:from-blue-600 dark:to-sky-700 rounded-2xl p-6 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/40 group-hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <ClipboardCheck className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{overall_stats?.total_tests ?? 0}</p>
                                <p className="text-blue-100 font-medium">Total Tests Attempted</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:blur-2xl"></div>
                        <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl p-6 shadow-lg shadow-amber-500/25 dark:shadow-amber-900/30 overflow-hidden transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-amber-500/40 group-hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-white mb-1 transform transition-all duration-500 group-hover:scale-105">{passRate}%</p>
                                <p className="text-amber-100 font-medium">Pass Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Progress Overview Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
                    {/* Section Header */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-emerald-500/20 dark:from-teal-500/10 dark:via-cyan-500/10 dark:to-emerald-500/10"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent"></div>
                        <div className="relative bg-gradient-to-r from-slate-50/90 via-white/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 backdrop-blur-sm px-6 py-5 border-b border-teal-200/50 dark:border-teal-700/30">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center mr-4 shadow-lg shadow-teal-500/40 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-700 via-cyan-600 to-emerald-600 dark:from-teal-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                        Course Progress Overview
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        Track learning progress across all assigned courses
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Course Title
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {!course_details || course_details.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                                    <BookOpen className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium">No course details available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    course_details.map((course, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {course?.title || 'Untitled Course'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                                        <div
                                                            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(course?.progress)}`}
                                                            style={{ width: `${course?.progress ?? 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-[3rem]">
                                                        {course?.progress ?? 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(course?.status)}`}>
                                                    {getStatusText(course?.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Course Specific Reports Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                    {/* Section Header */}
                    <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-400/10 via-transparent to-transparent"></div>
                        <div className="relative bg-gradient-to-r from-indigo-50/90 via-violet-50/80 to-purple-50/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 backdrop-blur-sm px-6 py-5 border-b border-indigo-200/50 dark:border-indigo-700/30">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-500/40 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-700 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        Course Specific Reports
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        Pre-test & Post-test performance analysis
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Course Title
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Instructor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    {/* NEW ATTEMPTS COLUMN HEADER */}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Attempts
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Pre-Test
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Post-Test
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {!workflow_stats || workflow_stats.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                                    <ClipboardCheck className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium">No course specific reports available</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    workflow_stats.map((stat, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {stat?.course_title || 'Untitled Course'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {stat?.instructor_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                                    {stat?.assigned_level || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(stat?.current_status)}`}>
                                                    {getStatusText(stat?.current_status)}
                                                </span>
                                            </td>
                                            {/* NEW ATTEMPTS DATA CELL */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                   <RefreshCcw className="w-3 h-3 mr-1" />
                                                   {stat?.attempts || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center">
                                                        {stat?.pre_test_score != null ? (
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${stat.pre_test_score >= 70
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                }`}>
                                                                {stat.pre_test_score}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 text-sm">Not taken</span>
                                                        )}
                                                    </div>
                                                    {stat?.pre_test_submitted_at && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDateTime(stat.pre_test_submitted_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center">
                                                        {stat?.post_test_score != null ? (
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${stat.post_test_score >= 70
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                }`}>
                                                                {stat.post_test_score}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 text-sm">Not taken</span>
                                                        )}
                                                    </div>
                                                    {stat?.post_test_submitted_at && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {formatDateTime(stat.post_test_submitted_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Spacing */}
                <div className="h-8"></div>
            </div>
        </div>
    );
};

export default EmployeeReport;