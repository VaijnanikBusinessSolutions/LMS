// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   User, BookOpen, CheckCircle, XCircle, ArrowLeft, 
//   Calendar, Briefcase, Shield, Clock, AlertCircle, Sparkles, GraduationCap,
//   BarChart2, Trophy, Target
// } from 'lucide-react';

// // --- Interfaces ---

// interface RequestDetails {
//   id: number;
//   status: string;
//   requested_at: string;
//   user: {
//     id: number;
//     first_name: string;
//     last_name: string;
//     email: string;
//     designation?: string;
//     department?: string;
//   };
//   course: {
//     id: number;
//     title: string;
//     description: string;
//     instructor_name?: string;
//   };
// }

// // Interface for the Competency Data
// interface CompetencyRecord {
//   id: number;
//   score: number;
//   total_possible: number;
//   date: string;
//   achieved_level: {
//     level: string;      // e.g., "L2"
//     title: string;      // e.g., "Mid-Level Developer"
//     color: string;      // e.g., "text-green-400"
//     bgColor: string;    // e.g., "bg-green-500"
//     borderColor: string;
//   } | null;
// }

// export default function RequestReviewPage() {
//   const { requestId } = useParams<{ requestId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const notificationContext = location.state?.notification;

//   const [requestData, setRequestData] = useState<RequestDetails | null>(null);
//   const [competencyData, setCompetencyData] = useState<CompetencyRecord | null>(null);
  
//   const [loading, setLoading] = useState(true);
//   const [loadingCompetency, setLoadingCompetency] = useState(false);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const API_BASE_URL = 'http://127.0.0.1:8000/lms';

//   const getAuthHeaders = () => {
//     const authData = localStorage.getItem("auth");
//     const token = authData ? JSON.parse(authData).accessToken : "";
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   };

//   // 1. Fetch Request Details
//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (!requestId || requestId === ':requestId') {
//         setError("Invalid Request ID provided.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/`, {
//           headers: getAuthHeaders()
//         });
        
//         if (response.status === 404) throw new Error("Request not found (404)");
//         if (!response.ok) throw new Error("Failed to load details");

//         const data = await response.json();
//         setRequestData(data);
        
//         // Once we have the user ID, fetch their competency
//         if(data.user && data.user.id) {
//             fetchCompetency(data.user.id);
//         }

//       } catch (err) {
//         console.error(err);
//         setError(err instanceof Error ? err.message : "Could not load request details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDetails();
//   }, [requestId]);

//   // 2. Fetch Competency Data for the specific User
//   const fetchCompetency = async (userId: number) => {
//     setLoadingCompetency(true);
//     try {
//         // Fetch all competency records (or filtered by user if your API supports ?user_id=X)
//         const response = await fetch(`${API_BASE_URL}/competency/`, {
//             headers: getAuthHeaders()
//         });
//         if(response.ok) {
//             const data = await response.json();
            
//             // Filter for this user and find the latest record
//             const userRecords = data
//                 .filter((r: any) => r.user === userId)
//                 .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
//             if (userRecords.length > 0) {
//                 const latest = userRecords[0];
                
//                 // Normalize the nested level object structure depending on API response
//                 let levelData = latest.level || latest.achieved_level;
                
//                 setCompetencyData({
//                     id: latest.id,
//                     score: latest.score,
//                     total_possible: latest.totalPossible || latest.total_possible,
//                     date: latest.date,
//                     achieved_level: levelData
//                 });
//             }
//         }
//     } catch (e) {
//         console.error("Failed to fetch competency", e);
//     } finally {
//         setLoadingCompetency(false);
//     }
//   };

//   const handleAction = async (action: 'approve' | 'reject') => {
//     if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
//     setProcessing(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/${action}/`, {
//         method: 'POST',
//         headers: getAuthHeaders()
//       });

//       if (!response.ok) throw new Error("Action failed");

//       alert(`Request ${action}ed successfully!`);
//       navigate('/lms/notifications'); 
//     } catch (err) {
//       alert(`Failed to ${action} request. Check console for details.`);
//       console.error(err);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Loading State
//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center items-center transition-colors duration-300">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-gray-500 dark:text-slate-400">Loading Request...</p>
//       </div>
//     </div>
//   );

//   // Error State
//   if (error || !requestData) return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
//         <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl text-center max-w-md">
//             <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
//             <p className="text-gray-500 dark:text-slate-400 mb-6">{error || "Data not available"}</p>
//             <button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-800 text-white rounded-lg">Go Back</button>
//         </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 pb-12">
      
//       {/* Decorative Background */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
//         <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
//       </div>

//       <div className="relative py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
          
//           {/* Header Navigation */}
//           <button 
//             onClick={() => navigate('/lms/notifications')} 
//             className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-all duration-300 font-medium bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl"
//           >
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
//             Back to Notifications
//           </button>

//           {/* Page Title */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
//                   Request #{requestId}
//                 </span>
//               </div>
//               <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
//                 Review Enrollment Request
//               </h1>
//             </div>
            
//             <div className={`px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-wider backdrop-blur-sm shadow-lg
//               ${requestData.status === 'PENDING' ? 'bg-amber-500 text-white' : 
//                 requestData.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`
//             }>
//               <span className="flex items-center gap-2">
//                 {requestData.status === 'PENDING' && <Clock className="w-4 h-4" />}
//                 {requestData.status === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
//                 {requestData.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
//                 {requestData.status}
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
//             {/* LEFT COLUMN: User Profile & Competency */}
//             <div className="lg:col-span-1 space-y-6">
              
//               {/* 1. User Profile Card */}
//               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 p-8">
//                 <div className="flex flex-col items-center text-center">
//                   {/* Avatar */}
//                   <div className="relative mb-6">
//                     <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl rotate-3 flex items-center justify-center shadow-lg text-3xl font-bold text-white">
//                       {requestData.user.first_name[0]}{requestData.user.last_name[0]}
//                     </div>
//                   </div>
                  
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                     {requestData.user.first_name} {requestData.user.last_name}
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-6 bg-gray-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
//                     {requestData.user.email}
//                   </p>
                  
//                   <div className="w-full border-t border-gray-100 dark:border-slate-800 pt-6 space-y-4 text-left">
//                     <div className="flex items-center gap-3">
//                         <Briefcase className="w-4 h-4 text-indigo-500" />
//                         <div>
//                             <p className="text-xs text-gray-400 font-bold uppercase">Designation</p>
//                             <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{requestData.user.designation || "Employee"}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <Shield className="w-4 h-4 text-blue-500" />
//                         <div>
//                             <p className="text-xs text-gray-400 font-bold uppercase">Department</p>
//                             <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{requestData.user.department || "General"}</p>
//                         </div>
//                     </div>
//                   </div>

//                   {/* Report Button */}
//                   <button
//                       onClick={() => navigate(`/EmployeeReport/${requestData.user.id}`)}
//                       className="w-full mt-6 flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
//                     >
//                       <BarChart2 className="w-4 h-4" />
//                       <span className="text-sm font-bold">View Full Report</span>
//                   </button>
//                 </div>
//               </div>

//               {/* 2. Competency Widget (New Addition) */}
//               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 p-6">
//                 <div className="flex items-center gap-2 mb-4">
//                     <Trophy className="w-5 h-5 text-yellow-500" />
//                     <h3 className="font-bold text-gray-900 dark:text-white">Competency Status</h3>
//                 </div>

//                 {loadingCompetency ? (
//                     <div className="flex justify-center py-6">
//                         <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                 ) : competencyData && competencyData.achieved_level ? (
//                     <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
//                         {/* Header: Level & Score */}
//                         <div className="flex justify-between items-start mb-3">
//                             <div>
//                                 <span className={`text-2xl font-black ${competencyData.achieved_level.color}`}>
//                                     {competencyData.achieved_level.level}
//                                 </span>
//                                 <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mt-1">Current Level</p>
//                             </div>
//                             <div className="text-right">
//                                 <span className="text-xl font-bold text-gray-800 dark:text-white">
//                                     {competencyData.score}
//                                 </span>
//                                 <span className="text-xs text-gray-400">/{competencyData.total_possible}</span>
//                                 <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase mt-1">Score</p>
//                             </div>
//                         </div>

//                         {/* Title Badge */}
//                         <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-3 ${competencyData.achieved_level.bgColor} text-white`}>
//                             {competencyData.achieved_level.title}
//                         </div>

//                         {/* Date */}
//                         <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs text-gray-400">
//                             <Clock className="w-3 h-3" />
//                             Assessed: {new Date(competencyData.date).toLocaleDateString()}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-center py-6 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl">
//                         <Target className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
//                         <p className="text-sm text-gray-500 dark:text-slate-400">No competency data found</p>
//                     </div>
//                 )}
//               </div>

//             </div>

//             {/* RIGHT COLUMN: Course & Actions (Same as before) */}
//             <div className="lg:col-span-2 space-y-6">
              
//               {/* Course Card */}
//               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 overflow-hidden">
//                 <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-5 flex justify-between items-center">
//                   <h3 className="font-bold text-white flex items-center gap-3 text-lg">
//                     <BookOpen className="w-5 h-5" /> Course Details
//                   </h3>
//                   <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
//                     {new Date(requestData.requested_at).toLocaleDateString()}
//                   </div>
//                 </div>
                
//                 <div className="p-8">
//                   <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//                     {requestData.course.title}
//                   </h4>
//                   <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
//                     {requestData.course.description}
//                   </p>
//                 </div>
//               </div>

//               {/* Action Area */}
//               {requestData.status === 'PENDING' ? (
//                 <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 p-8">
//                   <div className="flex items-center gap-3 mb-6">
//                     <Sparkles className="w-5 h-5 text-indigo-500" />
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">Take Action</h3>
//                   </div>
                  
//                   <div className="flex gap-4">
//                     <button
//                       onClick={() => handleAction('approve')}
//                       disabled={processing}
//                       className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all hover:-translate-y-1"
//                     >
//                       {processing ? "Processing..." : <><CheckCircle className="w-5 h-5" /> Approve</>}
//                     </button>
                    
//                     <button
//                       onClick={() => handleAction('reject')}
//                       disabled={processing}
//                       className="flex-1 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
//                     >
//                       {processing ? "Processing..." : <><XCircle className="w-5 h-5" /> Reject</>}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700">
//                     <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Request Processed</h3>
//                     <p className="text-slate-500 mt-1">Status: {requestData.status}</p>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, BookOpen, CheckCircle, XCircle, ArrowLeft, 
  Calendar, Briefcase, Shield, Clock, AlertCircle, Sparkles, GraduationCap,
  BarChart2, Trophy, Target, X
} from 'lucide-react';

// --- Interfaces ---

interface RequestDetails {
  id: number;
  status: string;
  requested_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    designation?: string;
    department?: string;
  };
  course: {
    id: number;
    title: string;
    description: string;
    instructor_name?: string;
  };
}

// Interface for the Competency Data
interface CompetencyRecord {
  id: number;
  score: number;
  total_possible: number;
  date: string;
  achieved_level: {
    level: string;      // e.g., "L2"
    title: string;      // e.g., "Mid-Level Developer"
    color: string;      // e.g., "text-green-400"
    bgColor: string;    // e.g., "bg-green-500"
    borderColor: string;
  } | null;
}

export default function RequestReviewPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const notificationContext = location.state?.notification;

  const [requestData, setRequestData] = useState<RequestDetails | null>(null);
  const [competencyData, setCompetencyData] = useState<CompetencyRecord | null>(null);
  
  // Modal State
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [loadingCompetency, setLoadingCompetency] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/lms';

  const getAuthHeaders = () => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // 1. Fetch Request Details
  useEffect(() => {
    const fetchDetails = async () => {
      if (!requestId || requestId === ':requestId') {
        setError("Invalid Request ID provided.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/`, {
          headers: getAuthHeaders()
        });
        
        if (response.status === 404) throw new Error("Request not found (404)");
        if (!response.ok) throw new Error("Failed to load details");

        const data = await response.json();
        setRequestData(data);
        
        // Once we have the user ID, fetch their competency
        if(data.user && data.user.id) {
            fetchCompetency(data.user.id);
        }

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Could not load request details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]);

  // 2. Fetch Competency Data for the specific User
  const fetchCompetency = async (userId: number) => {
    setLoadingCompetency(true);
    try {
        const response = await fetch(`${API_BASE_URL}/competency/`, {
            headers: getAuthHeaders()
        });
        if(response.ok) {
            const data = await response.json();
            
            // Filter for this user and find the latest record
            const userRecords = data
                .filter((r: any) => r.user === userId)
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            if (userRecords.length > 0) {
                const latest = userRecords[0];
                let levelData = latest.level || latest.achieved_level;
                
                setCompetencyData({
                    id: latest.id,
                    score: latest.score,
                    total_possible: latest.totalPossible || latest.total_possible,
                    date: latest.date,
                    achieved_level: levelData
                });
            }
        }
    } catch (e) {
        console.error("Failed to fetch competency", e);
    } finally {
        setLoadingCompetency(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/enrollment-requests/${requestId}/${action}/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Action failed");

      alert(`Request ${action}ed successfully!`);
      navigate('/lms/notifications'); 
    } catch (err) {
      alert(`Failed to ${action} request. Check console for details.`);
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center items-center transition-colors duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-slate-400">Loading Request...</p>
      </div>
    </div>
  );

  // Error State
  if (error || !requestData) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">{error || "Data not available"}</p>
            <button onClick={() => navigate(-1)} className="px-6 py-2 bg-slate-800 text-white rounded-lg">Go Back</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300 pb-12 relative">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* --- COMPETENCY MODAL --- */}
      {showCompetencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700 transform scale-100 transition-all">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Competency Status</h3>
                    </div>
                    <button 
                        onClick={() => setShowCompetencyModal(false)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {loadingCompetency ? (
                        <div className="flex justify-center py-6">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : competencyData && competencyData.achieved_level ? (
                        <div className="text-center">
                             {/* Level Badge */}
                             <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${competencyData.achieved_level.borderColor} ${competencyData.achieved_level.bgColor} shadow-lg mb-4`}>
                                 <span className="text-3xl font-black text-white">{competencyData.achieved_level.level}</span>
                             </div>
                             
                             <h4 className={`text-xl font-bold mb-1 ${competencyData.achieved_level.color}`}>
                                {competencyData.achieved_level.title}
                             </h4>
                             <p className="text-xs text-slate-400 uppercase font-semibold mb-6">Current Level</p>

                             {/* Stats Grid */}
                             <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                <div>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{competencyData.score}</p>
                                    <p className="text-xs text-slate-500 uppercase">Score</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{competencyData.total_possible}</p>
                                    <p className="text-xs text-slate-500 uppercase">Total</p>
                                </div>
                             </div>

                             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />
                                Assessed on {new Date(competencyData.date).toLocaleDateString()}
                             </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Target className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-600 dark:text-slate-400 font-medium">No assessment data available</p>
                            <p className="text-xs text-slate-400 mt-1">This employee hasn't taken a competency test yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}


      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Navigation */}
          <button 
            onClick={() => navigate('/lms/notifications')} 
            className="group inline-flex items-center gap-2 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-all duration-300 font-medium bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Notifications
          </button>

          {/* Page Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                  Request #{requestId}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Review Enrollment Request
              </h1>
            </div>
            
            <div className={`px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-wider backdrop-blur-sm shadow-lg
              ${requestData.status === 'PENDING' ? 'bg-amber-500 text-white' : 
                requestData.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`
            }>
              <span className="flex items-center gap-2">
                {requestData.status === 'PENDING' && <Clock className="w-4 h-4" />}
                {requestData.status === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
                {requestData.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                {requestData.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: User Profile & Competency */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* 1. User Profile Card */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 p-8">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl rotate-3 flex items-center justify-center shadow-lg text-3xl font-bold text-white">
                      {requestData.user.first_name[0]}{requestData.user.last_name[0]}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {requestData.user.first_name} {requestData.user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-6 bg-gray-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">
                    {requestData.user.email}
                  </p>
                  
                  <div className="w-full border-t border-gray-100 dark:border-slate-800 pt-6 space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <Briefcase className="w-4 h-4 text-indigo-500" />
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Designation</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{requestData.user.designation || "Employee"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Department</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{requestData.user.department || "General"}</p>
                        </div>
                    </div>
                  </div>

                  {/* --- BUTTONS SECTION --- */}
                  <div className="w-full mt-6 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate(`/EmployeeReport/${requestData.user.id}`)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                      >
                        <BarChart2 className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">Reports</span>
                    </button>
                    
                    {/* COMPETENCY BUTTON (NO REDIRECT, OPENS MODAL) */}
                    {/* <button
                        onClick={() => setShowCompetencyModal(true)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                      >
                        <Target className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">Competency</span>
                    </button> */}
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Course & Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Course Card */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-5 flex justify-between items-center">
                  <h3 className="font-bold text-white flex items-center gap-3 text-lg">
                    <BookOpen className="w-5 h-5" /> Course Details
                  </h3>
                  <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                    {new Date(requestData.requested_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {requestData.course.title}
                  </h4>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    {requestData.course.description}
                  </p>
                </div>
              </div>

              {/* Action Area */}
              {requestData.status === 'PENDING' ? (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Take Action</h3>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={processing}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all hover:-translate-y-1"
                    >
                      {processing ? "Processing..." : <><CheckCircle className="w-5 h-5" /> Approve</>}
                    </button>
                    
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={processing}
                      className="flex-1 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                    >
                      {processing ? "Processing..." : <><XCircle className="w-5 h-5" /> Reject</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Request Processed</h3>
                    <p className="text-slate-500 mt-1">Status: {requestData.status}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}