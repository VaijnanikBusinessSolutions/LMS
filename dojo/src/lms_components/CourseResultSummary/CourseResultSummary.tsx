// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   Trophy, ArrowRight, Home, 
//   Target, Award, Clock, BookOpen, AlertTriangle 
// } from 'lucide-react';

// // --- Types ---
// interface GrowthReport {
//   course_id: number;
//   course_title: string;
//   pre_test_score: number | null;
//   post_test_score: number | null;
//   final_passed: boolean;
//   total_attempts: number;
// }

// export default function CourseResultSummary() {
//   const { courseId } = useParams<{ courseId: string }>();
//   const navigate = useNavigate();
//   const [report, setReport] = useState<GrowthReport | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const authData = localStorage.getItem("auth");
//         const token = authData ? JSON.parse(authData).accessToken : null;
        
//         if (!token) {
//             navigate('/login');
//             return;
//         }

//         const response = await fetch(`http://127.0.0.1:8000/lms/growth/compare/${courseId}/`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });

//         if (!response.ok) throw new Error('Failed to load report');
        
//         const data = await response.json();

//         // 🔒 SECURITY CHECK: MUST HAVE COMPLETED BOTH TESTS
//         if (!data.pre_test || !data.best_post_test) {
//             alert("You must complete both the Pre-Assessment and Final Assessment to view this report.");
//             navigate(`/lms/courses/${courseId}`, { replace: true });
//             return;
//         }

//         const summary: GrowthReport = {
//             course_id: data.course_id,
//             course_title: data.course_title,
//             pre_test_score: data.pre_test ? data.pre_test.percentage : 0,
//             post_test_score: data.best_post_test ? data.best_post_test.percentage : 0,
//             final_passed: data.best_post_test ? data.best_post_test.passed : false,
//             total_attempts: data.post_tests ? data.post_tests.length : 0
//         };

//         setReport(summary);
//       } catch (err) {
//         setError("Could not load your report.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [courseId, navigate]);

//   if (loading) return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//     </div>
//   );

//   if (error || !report) return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
//         <div className="text-center p-8 bg-gray-800 rounded-xl border border-red-500/30">
//             <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//             <p className="text-red-400 mb-4">{error}</p>
//             <button onClick={() => navigate('/lms/courses')} className="bg-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">
//                 Back to Courses
//             </button>
//         </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col items-center justify-center">
      
//       <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
//         {/* Decorative Background Blob */}
//         <div className={`absolute top-0 right-0 w-96 h-96 ${report.final_passed ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

//         {/* Header */}
//         <div className="text-center mb-12 relative z-10">
//           <div className="inline-flex items-center gap-2 bg-gray-700/50 px-4 py-1.5 rounded-full text-sm font-medium text-gray-300 mb-4 border border-gray-600">
//             <BookOpen size={16} />
//             Course Completion Report
//           </div>
//           <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
//             {report.course_title}
//           </h1>
//           <p className="text-gray-400">Here is your performance summary.</p>
//         </div>

//         {/* Comparison Cards (Only Pre & Post) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative z-10">
          
//           {/* 1. Pre-Test Card */}
//           <div className="bg-gray-900/60 border border-gray-700 p-8 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all">
//             <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-400">
//               <Clock size={32} />
//             </div>
//             <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Pre-Test Score</h3>
//             <div className="text-5xl font-bold text-white mb-2">{report.pre_test_score}%</div>
//             <p className="text-sm text-gray-500">Baseline Knowledge</p>
//           </div>

//           {/* 2. Post-Test Card */}
//           <div className={`bg-gray-900/60 border p-8 rounded-2xl flex flex-col items-center justify-center group transition-all ${report.final_passed ? 'border-green-500/30 hover:border-green-500/60' : 'border-red-500/30 hover:border-red-500/60'}`}>
//             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${report.final_passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//               <Target size={32} />
//             </div>
//             <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Final Score</h3>
//             <div className={`text-5xl font-bold mb-2 ${report.final_passed ? 'text-green-400' : 'text-red-400'}`}>
//                 {report.post_test_score}%
//             </div>
//             <p className="text-sm text-gray-500">
//                 {report.final_passed ? 'Passed Successfully' : 'Needs Improvement'}
//             </p>
//           </div>

//         </div>

//         {/* Certificate / Action Section */}
//         {report.final_passed && (
//             <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
//                         <Award size={28} />
//                     </div>
//                     <div>
//                         <h3 className="font-bold text-white text-lg">Certificate Available</h3>
//                         <p className="text-sm text-gray-400">You have successfully completed this course.</p>
//                     </div>
//                 </div>
//                 <button 
//                     onClick={() => navigate(`/lms/courses/${courseId}/certificate`)} 
//                     className="bg-white text-indigo-900 hover:bg-gray-100 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
//                 >
//                     <Trophy size={18} /> View Certificate
//                 </button>
//             </div>
//         )}

//         {/* Footer Actions */}
//         <div className="flex justify-center gap-4">
//           <button 
//             onClick={() => navigate('/lms/courses')}
//             className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
//           >
//             <Home size={18} />
//             Back to Dashboard
//           </button>
          
//           <button 
//             onClick={() => navigate(`/lms/courses/${courseId}`)}
//             className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
//           >
//             Review Lessons
//             <ArrowRight size={18} />
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Trophy, ArrowRight, Home, 
  Target, Award, Clock, BookOpen, AlertTriangle,
  Sparkles, TrendingUp, CheckCircle2, XCircle
} from 'lucide-react';

// --- Types ---
interface GrowthReport {
  course_id: number;
  course_title: string;
  pre_test_score: number | null;
  post_test_score: number | null;
  final_passed: boolean;
  total_attempts: number;
}

export default function CourseResultSummary() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<GrowthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const authData = localStorage.getItem("auth");
        const token = authData ? JSON.parse(authData).accessToken : null;
        
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/lms/growth/compare/${courseId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load report');
        
        const data = await response.json();

        if (!data.pre_test || !data.best_post_test) {
            alert("You must complete both the Pre-Assessment and Final Assessment to view this report.");
            navigate(`/lms/courses/${courseId}`, { replace: true });
            return;
        }

        const summary: GrowthReport = {
            course_id: data.course_id,
            course_title: data.course_title,
            pre_test_score: data.pre_test ? data.pre_test.percentage : 0,
            post_test_score: data.best_post_test ? data.best_post_test.percentage : 0,
            final_passed: data.best_post_test ? data.best_post_test.passed : false,
            total_attempts: data.post_tests ? data.post_tests.length : 0
        };

        setReport(summary);
      } catch (err) {
        setError("Could not load your report.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [courseId, navigate]);

  const getGrowthPercentage = () => {
    if (!report?.pre_test_score || !report?.post_test_score) return 0;
    return report.post_test_score - report.pre_test_score;
  };

  if (loading) return (
    // Dark mode loading background
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your results...</p>
      </div>
    </div>
  );

  if (error || !report) return (
    // Dark mode error background
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-orange-50 dark:from-slate-950 dark:via-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-6 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-rose-100 dark:border-red-900/30 p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
        <button 
          onClick={() => navigate('/lms/courses')} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/50 transition-all duration-300 hover:-translate-y-0.5"
        >
          Back to Courses
        </button>
      </div>
    </div>
  );

  const growth = getGrowthPercentage();

  return (
    // Main Container: dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 transition-colors duration-300">
      
      {/* Decorative Elements - Adjusted for Dark Mode */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        
        {/* Success/Fail Banner */}
        <div className={`mb-6 rounded-2xl p-4 flex items-center justify-center gap-3 ${
          report.final_passed 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
        }`}>
          {report.final_passed ? (
            <>
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Congratulations! You've successfully completed this course!</span>
              <Sparkles className="w-5 h-5" />
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Keep going! You're making progress. Review and try again!</span>
            </>
          )}
        </div>

        {/* Main Card - dark:bg-slate-900/80 dark:border-slate-800 */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-indigo-100/50 dark:shadow-black/50 border border-white/60 dark:border-slate-800 overflow-hidden transition-colors">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-900 p-8 md:p-12 text-white relative overflow-hidden">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-200 dark:text-indigo-300 text-sm font-medium mb-4">
                <BookOpen size={16} />
                <span>Course Completion Report</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                {report.course_title}
              </h1>
              <p className="text-indigo-200 dark:text-indigo-300">Your complete performance analysis and growth summary</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 md:p-10">
            
            {/* Score Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* Pre-Test Card */}
              {/* Card: dark:bg-slate-800 dark:border-slate-700 */}
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/60 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  {/* Badge: dark:bg-slate-700 dark:text-slate-300 */}
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700 px-3 py-1 rounded-full">Before</span>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none group-hover:scale-110 transition-transform">
                    <Clock size={22} />
                  </div>
                </div>
                <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Pre-Test Score</h3>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-slate-800 dark:text-white">{report.pre_test_score}</span>
                  <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500 mb-1">%</span>
                </div>
                <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${report.pre_test_score}%` }}
                  />
                </div>
              </div>

              {/* Growth Card */}
              <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200/60 dark:border-indigo-800/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 rounded-full">Growth</span>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
                    <TrendingUp size={22} />
                  </div>
                </div>
                <h3 className="text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-1">Improvement</h3>
                <div className="flex items-end gap-1">
                  <span className={`text-5xl font-bold ${growth >= 0 ? 'text-indigo-600 dark:text-indigo-300' : 'text-rose-500 dark:text-rose-400'}`}>
                    {growth >= 0 ? '+' : ''}{growth}
                  </span>
                  <span className="text-2xl font-semibold text-indigo-300 dark:text-indigo-500 mb-1">%</span>
                </div>
                <p className="mt-4 text-sm text-indigo-500 dark:text-indigo-400">
                  {growth > 20 ? '🚀 Excellent progress!' : growth > 0 ? '📈 Good improvement!' : '💪 Keep practicing!'}
                </p>
              </div>

              {/* Post-Test Card */}
              <div className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                report.final_passed 
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/60 dark:border-emerald-800/50 hover:shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30' 
                  : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200/60 dark:border-amber-800/50 hover:shadow-xl hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                    report.final_passed 
                      ? 'text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50' 
                      : 'text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50'
                  }`}>After</span>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg dark:shadow-none group-hover:scale-110 transition-transform ${
                    report.final_passed 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-200' 
                      : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-200'
                  }`}>
                    <Target size={22} />
                  </div>
                </div>
                <h3 className={`text-sm font-medium mb-1 ${report.final_passed ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
                  Final Score
                </h3>
                <div className="flex items-end gap-1">
                  <span className={`text-5xl font-bold ${report.final_passed ? 'text-emerald-600 dark:text-emerald-300' : 'text-amber-600 dark:text-amber-300'}`}>
                    {report.post_test_score}
                  </span>
                  <span className={`text-2xl font-semibold mb-1 ${report.final_passed ? 'text-emerald-300 dark:text-emerald-600' : 'text-amber-300 dark:text-amber-600'}`}>%</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {report.final_passed ? (
                    <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="text-amber-500 dark:text-amber-400" />
                  )}
                  <span className={`text-sm font-medium ${report.final_passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {report.final_passed ? 'Passed' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Section */}
            {report.final_passed && (
              <div className="relative bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/10 dark:to-orange-900/20 border-2 border-amber-200/60 dark:border-amber-800/50 rounded-2xl p-8 mb-8 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/50 to-yellow-200/50 dark:from-amber-600/10 dark:to-yellow-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-200/50 to-amber-200/50 dark:from-orange-600/10 dark:to-amber-600/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-200/50 dark:shadow-none rotate-3">
                      <Award size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">🎉 Certificate Earned!</h3>
                      <p className="text-slate-600 dark:text-slate-400">You've earned a certificate for completing this course.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/lms/courses/${courseId}/certificate`)} 
                    className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-amber-200/50 dark:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    <Trophy size={20} />
                    <span>View Certificate</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Attempts Info */}
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-8">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              <span>Total Attempts: <strong className="text-slate-700 dark:text-slate-200">{report.total_attempts}</strong></span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/lms/courses')}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none"
              >
                <Home size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                Back to Dashboard
              </button>
              
              <button 
                onClick={() => navigate(`/lms/courses/${courseId}`)}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-xl shadow-indigo-200/50 dark:shadow-indigo-900/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Review Lessons
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8">
          Keep learning, keep growing! 🌟
        </p>
      </div>
    </div>
  );
}