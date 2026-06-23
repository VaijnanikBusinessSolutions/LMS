

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// interface WorkflowProgress {
//   completed: number;
//   total: number;
//   percentage: number;
// }

// interface WorkflowStatus {
//   code: string;
//   message: string;
//   can_view_lessons: boolean;
//   action_required: string;
//   progress?: WorkflowProgress;
// }

// interface WorkflowData {
//   id: number;
//   title: string;
//   description: string;
//   user_status: WorkflowStatus;
//   test_id: number | null;
//   lessons_completed_count: number;
//   total_lessons: number;
//   roadmap: any[];
// }

// export default function CoursePage() {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
//   const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // State for the join request button
//   const [requestLoading, setRequestLoading] = useState(false);

//   useEffect(() => {
//     const fetchWorkflow = async () => {
//       const authData = localStorage.getItem("auth");
//       const token = authData ? JSON.parse(authData).accessToken : "";
      
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await fetch(
//           `http://127.0.0.1:8000/lms/courses/${courseId}/workflow/`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!response.ok) {
//           if (response.status === 401) {
//             navigate('/login');
//             return;
//           }
//           throw new Error('Failed to fetch course workflow');
//         }

//         const data = await response.json();
//         setWorkflow(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWorkflow();
//   }, [courseId, navigate]);

//   const handleJoinRequest = async () => {
//     const authData = localStorage.getItem("auth");
//     const token = authData ? JSON.parse(authData).accessToken : "";
    
//     setRequestLoading(true);

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/lms/courses/${courseId}/request-access/`, 
//         {
//           method: 'POST',
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (!response.ok) throw new Error("Failed to send request");

//       if (workflow) {
//         setWorkflow({
//           ...workflow,
//           user_status: {
//             ...workflow.user_status,
//             code: "PENDING_APPROVAL",
//             message: "Request sent. Waiting for Admin approval."
//           }
//         });
//       }

//     } catch (err) {
//       alert("Could not send join request. Please try again.");
//     } finally {
//       setRequestLoading(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-400">Loading course...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error || !workflow) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-red-500/30">
//           <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
//           <p className="mb-6 text-red-400">{error || "Course not found"}</p>
//           <button
//             onClick={() => navigate('/lms/courses')}
//             className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
//           >
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { user_status, test_id } = workflow;
//   const statusCode = user_status.code;

//   const goToTest = () => {
//     if (test_id) navigate(`/lms/courses/${courseId}/test/${test_id}`);
//   };

//   const goToLessons = () => {
//     const firstLesson = workflow.roadmap?.[0];
//     if (firstLesson) navigate(`/lms/courses/${courseId}/lesson/${firstLesson.id}`);
//   };

//   // --- NEW FUNCTION: Go to Results Page ---
//   const goToResults = () => {
//     // Make sure this path matches your router configuration for CourseResultSummary
//     navigate(`/lms/courses/${courseId}/results`);
//   };

//   // ========== RENDER BASED ON STATUS ==========

//   // 1. Pre-Test Required
//   if (statusCode === "PRETEST_REQUIRED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-indigo-500/30">
//           <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">{workflow.title}</h2>
//           <h3 className="text-lg text-indigo-400 mb-4">Pre-Assessment Required</h3>
//           <p className="mb-6 text-gray-300">{user_status.message}</p>
          
//           {test_id ? (
//             <button
//               onClick={goToTest}
//               className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
//             >
//               Start Pre-Assessment
//             </button>
//           ) : (
//             <p className="text-yellow-400">No assessment configured for this course.</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // 2. No Test Configured
//   if (statusCode === "NO_TEST_CONFIGURED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-gray-700">
//           <h2 className="text-2xl font-bold text-white mb-4">{workflow.title}</h2>
//           <p className="mb-6 text-gray-300">{user_status.message}</p>
//           <button
//             onClick={goToLessons}
//             className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
//           >
//             Start Learning
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 3. In Progress
//   if (statusCode === "IN_PROGRESS") {
//     const progress = user_status.progress;
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
//           <h2 className="text-2xl font-bold text-white mb-2">{workflow.title}</h2>
//           <h3 className="text-lg text-blue-400 mb-4">Continue Learning</h3>
//           <p className="mb-6 text-gray-300">{user_status.message}</p>
          
//           {progress && (
//             <div className="mb-6">
//               <div className="flex justify-between text-sm text-gray-400 mb-2">
//                 <span>Progress</span>
//                 <span className="font-bold text-white">{progress.percentage}%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
//                 <div 
//                   className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
//                   style={{ width: `${progress.percentage}%` }}
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-2">
//                 {progress.completed} of {progress.total} lessons completed
//               </p>
//             </div>
//           )}
          
//           <button
//             onClick={goToLessons}
//             className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition"
//           >
//             Continue Lessons
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 4. Ready for Post-Test / Retry
//   if (statusCode === "POSTTEST_REQUIRED" || statusCode === "POSTTEST_RETRY") {
//     const isRetry = statusCode === "POSTTEST_RETRY";
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className={`bg-gray-800 rounded-2xl p-8 max-w-md text-center border ${isRetry ? 'border-yellow-500/30' : 'border-green-500/30'}`}>
//           <div className={`w-20 h-20 ${isRetry ? 'bg-yellow-500/20' : 'bg-green-500/20'} rounded-full flex items-center justify-center mx-auto mb-6`}>
//             <svg className={`w-10 h-10 ${isRetry ? 'text-yellow-400' : 'text-green-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">{workflow.title}</h2>
//           <h3 className={`text-lg ${isRetry ? 'text-yellow-400' : 'text-green-400'} mb-4`}>
//             {isRetry ? 'Retry Final Assessment' : 'Final Assessment'}
//           </h3>
//           <p className="mb-6 text-gray-300">{user_status.message}</p>
          
//           {test_id ? (
//             <button
//               onClick={goToTest}
//               className={`w-full px-6 py-3 ${isRetry ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-semibold transition mb-3`}
//             >
//               {isRetry ? 'Retry Assessment' : 'Start Final Assessment'}
//             </button>
//           ) : (
//             <p className="text-yellow-400">No assessment configured.</p>
//           )}
          
//           {user_status.can_view_lessons && (
//             <button
//               onClick={goToLessons}
//               className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
//             >
//               Review Lessons
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // 5. Completed
//   if (statusCode === "COMPLETED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-green-500/50">
//           <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-3xl font-bold text-white mb-2">🎉 Congratulations!</h2>
//           <h3 className="text-xl text-green-400 mb-4">{workflow.title}</h3>
//           <p className="mb-6 text-gray-300">{user_status.message}</p>
          
//           <div className="space-y-3">
//             {/* --- ADDED: View Results Button --- */}
//             <button
//               onClick={goToResults}
//               className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
//               </svg>
//               View Results & Report
//             </button>

//             <button
//               onClick={goToLessons}
//               className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
//             >
//               Review Lessons
//             </button>
//             <button
//               onClick={() => navigate('/lms/courses')}
//               className="w-full px-6 py-3 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
//             >
//               Browse More Courses
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // 6. Not Enrolled
//   if (statusCode === "NOT_ENROLLED") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-indigo-500/30 shadow-2xl">
//           <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
//              <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//              </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-4">{workflow.title}</h2>
//           <p className="mb-8 text-gray-300">
//             {workflow.description || "You are not currently enrolled in this course. Click below to request access from the administrator."}
//           </p>
          
//           <button
//             onClick={handleJoinRequest}
//             disabled={requestLoading}
//             className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
//               requestLoading 
//                 ? 'bg-gray-600 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg hover:shadow-indigo-500/30'
//             }`}
//           >
//             {requestLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Sending Request...
//               </>
//             ) : (
//               <>
//                 <span>👋</span> Request to Join Course
//               </>
//             )}
//           </button>
          
//           <button
//             onClick={() => navigate('/lms/courses')}
//             className="mt-4 text-gray-500 hover:text-white transition-colors text-sm"
//           >
//             Cancel and go back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // 7. Pending Approval
//   if (statusCode === "PENDING_APPROVAL") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center border border-yellow-500/30">
//           <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
//             <svg className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">{workflow.title}</h2>
//           <h3 className="text-lg text-yellow-500 mb-4">Request Sent</h3>
//           <p className="mb-6 text-gray-300">
//             We have notified the administrator. You will receive a notification once your enrollment is approved.
//           </p>
//           <button
//             onClick={() => navigate('/lms/courses')}
//             className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
//           >
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Fallback
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//       <p className="text-gray-400">Unknown status: {statusCode}</p>
//       <button
//         onClick={() => navigate('/lms/courses')}
//         className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg"
//       >
//         Back to Courses
//       </button>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface WorkflowProgress {
  completed: number;
  total: number;
  percentage: number;
}

interface WorkflowStatus {
  code: string;
  message: string;
  can_view_lessons: boolean;
  action_required: string;
  progress?: WorkflowProgress;
}

interface WorkflowData {
  id: number;
  title: string;
  description: string;
  user_status: WorkflowStatus;
  test_id: number | null;
  lessons_completed_count: number;
  total_lessons: number;
  roadmap: any[];
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const fetchWorkflow = async () => {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : "";
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/lms/courses/${courseId}/workflow/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch course workflow');
        }

        const data = await response.json();
        setWorkflow(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflow();
  }, [courseId, navigate]);

  const handleJoinRequest = async () => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : "";
    
    setRequestLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/lms/courses/${courseId}/request-access/`, 
        {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error("Failed to send request");

      if (workflow) {
        setWorkflow({
          ...workflow,
          user_status: {
            ...workflow.user_status,
            code: "PENDING_APPROVAL",
            message: "Request sent. Waiting for Admin approval."
          }
        });
      }

    } catch (err) {
      alert("Could not send join request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      // Background: dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl" />
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-indigo-200 dark:border-indigo-900 rounded-full mx-auto mb-6" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-transparent border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 tracking-tight">Loading Course</h2>
          <p className="text-gray-500 dark:text-slate-400 text-lg">Preparing your learning experience...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !workflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-orange-50 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-100/60 dark:bg-red-900/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-100/60 dark:bg-orange-900/10 rounded-full blur-3xl" />
        </div>

        {/* Card: dark:bg-slate-900/80 dark:border-slate-800 */}
        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-12 max-w-lg w-full text-center border border-red-100 dark:border-red-900/30 shadow-2xl shadow-red-100/50 dark:shadow-none">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-8 ring-4 ring-red-50 dark:ring-red-900/20">
            <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-4 tracking-tight">Oops! Something went wrong</h2>
          <p className="text-lg text-red-500 dark:text-red-400 mb-8 leading-relaxed">{error || "Course not found"}</p>
          <button
            onClick={() => navigate('/lms/courses')}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    );
  }

  const { user_status, test_id } = workflow;
  const statusCode = user_status.code;

  const goToTest = () => {
    if (test_id) navigate(`/lms/courses/${courseId}/test/${test_id}`);
  };

  const goToLessons = () => {
    const firstLesson = workflow.roadmap?.[0];
    if (firstLesson) navigate(`/lms/courses/${courseId}/lesson/${firstLesson.id}`);
  };

  const goToResults = () => {
    navigate(`/lms/courses/${courseId}/results`);
  };

  // 1. Pre-Test Required
  if (statusCode === "PRETEST_REQUIRED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/30 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-indigo-300/50 dark:bg-indigo-600/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Main Card */}
        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-indigo-100 dark:border-indigo-900/30 shadow-2xl shadow-indigo-100/50 dark:shadow-none">
          <div className="relative mb-10">
            <div className="absolute inset-0 w-28 h-28 bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full blur-xl mx-auto" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto ring-4 ring-indigo-50 dark:ring-indigo-900/30">
              <svg className="w-14 h-14 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 tracking-tight">{workflow.title}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Pre-Assessment Required</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">{user_status.message}</p>
          
          {test_id ? (
            <button
              onClick={goToTest}
              className="group relative w-full px-8 py-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Start Pre-Assessment
                <svg className="w-6 h-6 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ) : (
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-amber-600 dark:text-amber-400 font-medium">No assessment configured for this course.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. No Test Configured
  if (statusCode === "NO_TEST_CONFIGURED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-teal-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-emerald-200/40 dark:bg-emerald-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-teal-200/40 dark:bg-teal-900/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-100/50 dark:shadow-none">
          <div className="relative mb-10">
            <div className="absolute inset-0 w-28 h-28 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full blur-xl mx-auto" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-50 dark:ring-emerald-900/30">
              <svg className="w-14 h-14 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-4 tracking-tight">{workflow.title}</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">{user_status.message}</p>
          
          <button
            onClick={goToLessons}
            className="group relative w-full px-8 py-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Learning
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    );
  }

  // 3. In Progress
  if (statusCode === "IN_PROGRESS") {
    const progress = user_status.progress;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-cyan-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full border border-blue-100 dark:border-blue-900/30 shadow-2xl shadow-blue-100/50 dark:shadow-none">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Course In Progress</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 tracking-tight">{workflow.title}</h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">{user_status.message}</p>
          </div>
          
          {progress && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 dark:text-slate-400 font-medium">Your Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    {progress.percentage}%
                  </span>
                </div>
              </div>
              
              <div className="relative w-full h-4 bg-white dark:bg-slate-700 rounded-full overflow-hidden mb-4 shadow-inner">
                <div 
                  className="relative h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-slate-500">Lessons Completed</span>
                <span className="text-gray-700 dark:text-slate-300 font-semibold">{progress.completed} of {progress.total}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={goToLessons}
            className="group relative w-full px-8 py-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200 dark:hover:shadow-blue-900/50"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue Learning
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Ready for Post-Test / Retry
  if (statusCode === "POSTTEST_REQUIRED" || statusCode === "POSTTEST_RETRY") {
    const isRetry = statusCode === "POSTTEST_RETRY";
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden transition-colors duration-300
        ${isRetry 
          ? 'bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-slate-950 dark:via-amber-950/20 dark:to-orange-950/20' 
          : 'bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-green-950/20'}
      `}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-[500px] h-[500px] ${isRetry ? 'bg-amber-200/40 dark:bg-amber-900/20' : 'bg-emerald-200/40 dark:bg-emerald-900/20'} rounded-full blur-3xl animate-pulse`} />
          <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] ${isRetry ? 'bg-orange-200/40 dark:bg-orange-900/20' : 'bg-green-200/40 dark:bg-green-900/20'} rounded-full blur-3xl animate-pulse delay-700`} />
        </div>

        <div className={`relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border shadow-2xl dark:shadow-none
          ${isRetry 
            ? 'border-amber-100 dark:border-amber-900/30 shadow-amber-100/50' 
            : 'border-emerald-100 dark:border-emerald-900/30 shadow-emerald-100/50'}
        `}>
          <div className="relative mb-10">
            <div className={`absolute inset-0 w-28 h-28 ${isRetry ? 'bg-amber-200/50 dark:bg-amber-900/50' : 'bg-emerald-200/50 dark:bg-emerald-900/50'} rounded-full blur-xl mx-auto`} />
            <div className={`relative w-28 h-28 bg-gradient-to-br rounded-full flex items-center justify-center mx-auto ring-4
              ${isRetry 
                ? 'from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 ring-amber-50 dark:ring-amber-900/30' 
                : 'from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 ring-emerald-50 dark:ring-emerald-900/30'}
            `}>
              {isRetry ? (
                <svg className="w-14 h-14 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-14 h-14 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 tracking-tight">{workflow.title}</h2>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
            ${isRetry ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-emerald-50 dark:bg-emerald-900/30'}
          `}>
            <div className={`w-2 h-2 rounded-full animate-pulse
              ${isRetry ? 'bg-amber-500' : 'bg-emerald-500'}
            `} />
            <span className={`font-semibold ${isRetry ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {isRetry ? 'Retry Assessment' : 'Final Assessment Ready'}
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">{user_status.message}</p>
          
          <div className="space-y-4">
            {test_id ? (
              <button
                onClick={goToTest}
                className={`group relative w-full px-8 py-5 bg-gradient-to-r text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                  ${isRetry 
                    ? 'from-amber-500 via-amber-500 to-orange-500 hover:shadow-amber-200 dark:hover:shadow-amber-900/50' 
                    : 'from-emerald-600 via-emerald-500 to-green-600 hover:shadow-emerald-200 dark:hover:shadow-emerald-900/50'}
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {isRetry ? 'Retry Assessment' : 'Start Final Assessment'}
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3 px-6 py-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-amber-600 dark:text-amber-400 font-medium">No assessment configured.</p>
              </div>
            )}
            
            {user_status.can_view_lessons && (
              <button
                onClick={goToLessons}
                className="group w-full px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-semibold text-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Review Lessons
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 5. Completed
  if (statusCode === "COMPLETED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-yellow-50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-yellow-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        {/* Celebration background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-green-200/50 dark:bg-green-900/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-yellow-200/40 dark:bg-yellow-900/10 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        {/* Confetti particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full animate-bounce ${
                ['bg-emerald-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-blue-400'][i % 5]
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                opacity: 0.7
              }}
            />
          ))}
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-emerald-200 dark:border-emerald-900/30 shadow-2xl shadow-emerald-100/50 dark:shadow-none">
          {/* Trophy icon with glow */}
          <div className="relative mb-10">
            <div className="absolute inset-0 w-32 h-32 bg-emerald-200/50 dark:bg-emerald-900/50 rounded-full blur-2xl mx-auto animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-100 via-green-100 to-yellow-100 dark:from-emerald-900/40 dark:to-yellow-900/40 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-100 dark:ring-emerald-900/30">
              <span className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🏆</span>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-yellow-500 dark:from-emerald-400 dark:via-green-400 dark:to-yellow-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Congratulations!
          </h2>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mb-3">{workflow.title}</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-full mb-6">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Course Completed Successfully</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed">{user_status.message}</p>
          
          <div className="space-y-4">
            <button
              onClick={goToResults}
              className="group relative w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-200 dark:hover:shadow-purple-900/50"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                View Results & Report
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={goToLessons}
              className="group w-full px-8 py-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-semibold text-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Review Lessons
              </span>
            </button>

            <button
              onClick={() => navigate('/lms/courses')}
              className="group w-full px-8 py-4 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-2xl font-semibold text-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse More Courses
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Not Enrolled
  if (statusCode === "NOT_ENROLLED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-indigo-100 dark:border-indigo-900/30 shadow-2xl shadow-indigo-100/50 dark:shadow-none">
          <div className="relative mb-10">
            <div className="absolute inset-0 w-28 h-28 bg-indigo-200/50 dark:bg-indigo-900/50 rounded-full blur-xl mx-auto" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto ring-4 ring-indigo-50 dark:ring-indigo-900/30">
              <svg className="w-14 h-14 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-4 tracking-tight">{workflow.title}</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">
            {workflow.description || "You are not currently enrolled in this course. Click below to request access from the administrator."}
          </p>
          
          <button
            onClick={handleJoinRequest}
            disabled={requestLoading}
            className={`group relative w-full px-8 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 ${
              requestLoading 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50'
            } text-white`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {requestLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Request...
                </>
              ) : (
                <>
                  <span className="text-2xl">👋</span>
                  Request to Join Course
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            {!requestLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
          
          <button
            onClick={() => navigate('/lms/courses')}
            className="mt-6 flex items-center justify-center gap-2 mx-auto text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors text-base group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cancel and go back
          </button>
        </div>
      </div>
    );
  }

  // 7. Pending Approval
  if (statusCode === "PENDING_APPROVAL") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-50 dark:from-slate-950 dark:via-amber-950/20 dark:to-yellow-950/20 p-6 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-200/40 dark:bg-amber-900/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-amber-100 dark:border-amber-900/30 shadow-2xl shadow-amber-100/50 dark:shadow-none">
          {/* Animated clock icon */}
          <div className="relative mb-10">
            <div className="absolute inset-0 w-28 h-28 bg-amber-200/50 dark:bg-amber-900/50 rounded-full blur-xl mx-auto animate-pulse" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-50 dark:ring-amber-900/30">
              <svg className="w-14 h-14 text-amber-600 dark:text-amber-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 w-36 h-36 mx-auto -top-4 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-slate-100 mb-3 tracking-tight">{workflow.title}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 rounded-full mb-6">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Request Pending</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">
            We have notified the administrator. You will receive a notification once your enrollment is approved.
          </p>

          {/* Status timeline */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Requested</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
              </div>
              <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">Pending</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200 dark:bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-400 dark:text-slate-500 text-sm font-medium">Approved</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/lms/courses')}
            className="group w-full px-8 py-5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-bold text-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm"
          >
            <span className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-gray-900 p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-200/50 dark:bg-gray-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-10 md:p-14 max-w-xl w-full text-center border border-gray-200 dark:border-slate-800 shadow-2xl shadow-gray-100/50 dark:shadow-none">
        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xl text-gray-500 dark:text-slate-400 mb-8">Unknown status: <span className="text-gray-800 dark:text-slate-200 font-mono">{statusCode}</span></p>
        <button
          onClick={() => navigate('/lms/courses')}
          className="group relative w-full px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </span>
        </button>
      </div>
    </div>
  );
}