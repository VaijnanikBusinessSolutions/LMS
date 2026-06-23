



// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Loader2,
//   Award,
//   AlertCircle,
//   FileText,
//   Trophy,
//   GraduationCap,
//   Calendar,
//   User,
//   Sparkles,
//   Medal,
//   Star,
//   ArrowRight,
//   RefreshCw
// } from 'lucide-react';
// import { API_URL } from '../CreateCourse/components/Utils/utils';

// interface CourseAssignment {
//   id: number;           // This seems to be the Course ID based on your log
//   title: string;        // Changed from course_title
//   instructor_name: string;
//   status?: string;      // Made optional
//   updated_at?: string;  // Made optional
// }


// const CertificateHome: React.FC = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<CourseAssignment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getToken = useCallback((): string | null => {
//     try {
//       const authDataString = localStorage.getItem("auth");
//       if (!authDataString) return null;
//       const authData = JSON.parse(authDataString);
//       return authData.accessToken || authData.access || null;
//     } catch (e) {
//       console.error("Error parsing auth token:", e);
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     const fetchCompletedCourses = async () => {
//       const token = getToken();
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/assignments/my-courses/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch courses. Status: ${response.status}`);
//         }

//         const data: CourseAssignment[] = await response.json();
//         console.log("All My Courses:", data);

//         // Safe filtering: only filter if 'status' exists
//         const completedOnly = data.filter((item) => {
//           // If status is missing, we might assume it's completed if it's in this list,
//           // or you can check for item.status?.toLowerCase() === 'completed'
//           return item.status ? item.status.toLowerCase() === 'completed' : true;
//         });

//         setCourses(completedOnly);
//       } catch (err) {
//         console.error("Error loading certificates:", err);
//         setError("Unable to load your certificates at this time.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompletedCourses();
//   }, [getToken]);

//   const handleViewCertificate = (courseId: number) => {
//     navigate(`/lms/courses/${courseId}/certificate`);
//   };

//   const stats = [
//     {
//       icon: Trophy,
//       label: 'Certificates Earned',
//       value: courses.length.toString(),
//       color: 'from-amber-500 to-yellow-500'
//     },
//     {
//       icon: GraduationCap,
//       label: 'Courses Completed',
//       value: courses.length.toString(),
//       color: 'from-blue-500 to-cyan-500'
//     },
//     {
//       icon: Star,
//       label: 'Achievement Level',
//       value: courses.length >= 5 ? 'Expert' : courses.length >= 3 ? 'Advanced' : 'Rising Star',
//       color: 'from-purple-500 to-pink-500'
//     },
//     {
//       icon: Medal,
//       label: 'Success Rate',
//       value: '100%',
//       color: 'from-green-500 to-emerald-500'
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-purple-500 to-pink-500"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-cyan-500 to-blue-500"></div>
//         </div>

//         <div className="relative z-10 text-center">
//           <div className="relative w-24 h-24 mx-auto mb-6">
//             <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-spin opacity-30"></div>
//             <div className="absolute inset-2 bg-surface rounded-full flex items-center justify-center shadow-lg">
//               <Loader2 className="w-10 h-10 text-primary animate-spin" />
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-text">Loading Your Achievements</h2>
//           <p className="text-muted mt-2">Fetching your certificates...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">
//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-red-500 to-orange-500"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-pink-500 to-red-500"></div>
//         </div>

//         <div className="relative z-10 bg-surface rounded-3xl p-8 border border-border shadow-soft max-w-md w-full text-center">
//           <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
//             <AlertCircle className="w-10 h-10 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-text mb-2">Something Went Wrong</h2>
//           <p className="text-muted mb-6">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-text relative overflow-hidden transition-colors duration-300">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-amber-500 to-yellow-500"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-gradient-to-br from-cyan-500 to-blue-500" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse bg-gradient-to-br from-purple-500 to-pink-500" style={{ animationDelay: '2s' }}></div>

//         {/* Floating particles */}
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 rounded-full opacity-20 animate-float bg-accent"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`
//             }}
//           ></div>
//         ))}
//       </div>

//       <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">

//         {/* Hero Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 backdrop-blur-sm bg-surface/50 border-border">
//             <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
//             <span className="text-muted text-sm font-medium">Your Learning Journey</span>
//           </div>

//           <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tight gradient-text">
//             My Certificates
//           </h1>
//           <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
//             Celebrate your achievements and showcase your
//             <span className="text-primary font-semibold"> hard-earned credentials.</span>
//           </p>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className="relative group"
//             >
//               <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
//               <div className="relative bg-surface backdrop-blur-xl rounded-2xl p-6 border border-border hover:border-primary/50 transition-all hover:scale-105 hover:-translate-y-1 shadow-soft">
//                 <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
//                   <stat.icon className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-3xl font-bold text-text">{stat.value}</div>
//                 <div className="text-muted text-sm">{stat.label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Certificates Section */}
//         <div className="relative group">
//           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
//           <div className="relative bg-surface backdrop-blur-xl rounded-3xl border border-border shadow-soft overflow-hidden">

//             {/* Section Header */}
//             <div className="p-6 lg:p-8 border-b border-border">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
//                   <Award className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-text">Completed Courses</h2>
//                   <p className="text-muted text-sm">Click on any certificate to view and download</p>
//                 </div>
//               </div>
//             </div>

//             {courses.length > 0 ? (
//               <div className="divide-y divide-border">
//                 {courses.map((assignment, index) => (
//                   <div
//                     key={assignment.id}
//                     className="p-6 lg:p-8 hover:bg-primary/5 transition-all group/item"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
//                       {/* Certificate Icon */}
//                       <div className="flex-shrink-0">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl blur-lg opacity-30 group-hover/item:opacity-50 transition-opacity"></div>
//                           <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover/item:scale-110 group-hover/item:rotate-3 transition-all">
//                             <Award className="w-8 h-8 text-white" />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Course Info */}
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-xl font-bold text-text group-hover/item:text-primary transition-colors truncate">
//                           {assignment.title}
//                         </h3>
//                         <div className="flex flex-wrap gap-4 mt-2">
//                           <div className="flex items-center gap-2 text-muted text-sm">
//                             <User className="w-4 h-4" />
//                             <span>{assignment.instructor_name || "Unknown Instructor"}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-muted text-sm">
//                             <Calendar className="w-4 h-4" />
//                             <span>
//                               {new Date(assignment.updated_at).toLocaleDateString('en-IN', {
//                                 day: 'numeric',
//                                 month: 'long',
//                                 year: 'numeric',
//                               })}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Completion Badge */}
//                       <div className="flex-shrink-0 hidden lg:block">
//                         <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
//                           <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
//                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                             Completed
//                           </span>
//                         </div>
//                       </div>

//                       {/* Action Button */}
//                       <div className="flex-shrink-0">
//                         <button
//                           onClick={() => handleViewCertificate(assignment.id)}
//                           className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
//                         >
//                           <FileText className="w-5 h-5" />
//                           View Certificate
//                           <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               /* Empty State */
//               <div className="p-12 lg:p-16 text-center">
//                 <div className="relative w-32 h-32 mx-auto mb-6">
//                   <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full blur-xl opacity-30"></div>
//                   <div className="relative w-full h-full bg-surface border-2 border-dashed border-border rounded-full flex items-center justify-center">
//                     <Trophy className="w-12 h-12 text-muted" />
//                   </div>
//                 </div>
//                 <h3 className="text-2xl font-bold text-text mb-2">No Certificates Yet</h3>
//                 <p className="text-muted max-w-md mx-auto mb-6">
//                   Complete a course and pass the final exam to earn your first certificate.
//                   Your achievements will appear here!
//                 </p>
//                 <button
//                   onClick={() => navigate('/lms/courses')}
//                   className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
//                 >
//                   <GraduationCap className="w-5 h-5" />
//                   Browse Courses
//                   <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Motivation Section */}
//         {courses.length > 0 && (
//           <div className="mt-8 relative group">
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <div className="relative bg-surface backdrop-blur-xl rounded-3xl p-8 border border-border shadow-soft">
//               <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
//                 <div className="flex-shrink-0">
//                   <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
//                     <Sparkles className="w-8 h-8 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-bold text-text mb-1">Keep Up the Great Work!</h3>
//                   <p className="text-muted">
//                     You've earned {courses.length} certificate{courses.length > 1 ? 's' : ''}!
//                     Continue learning to unlock more achievements and advance your career.
//                   </p>
//                 </div>
//                 <div className="flex-shrink-0">
//                   <button
//                     onClick={() => navigate('/lms/courses')}
//                     className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background hover:bg-primary/10 text-text rounded-xl font-semibold border border-border hover:border-primary transition-all"
//                   >
//                     <GraduationCap className="w-5 h-5" />
//                     Explore More Courses
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-12 text-center">
//           <p className="text-muted text-sm">
//             Made with 🏆 for celebrating your achievements
//           </p>
//         </div>
//       </div>

//       {/* CSS for animations */}
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
//           50% { transform: translateY(-20px) rotate(180deg); opacity: 0.5; }
//         }
        
//         .animate-float {
//           animation: float 4s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CertificateHome;




import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  Award, 
  AlertCircle, 
  FileText, 
  Trophy,
  GraduationCap,
  Calendar,
  User,
  Sparkles,
  Medal,
  Star,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { API_URL } from '../CreateCourse/components/Utils/utils';

// Interface matching your CourseSerializer JSON output
interface CourseAssignment {
  id: number;
  title: string;
  instructor_name: string;
  updated: string; // Using 'updated' as per your JSON
  stats: {
    completion: number;
    accuracy: number;
  };
}

const CertificateHome: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback((): string | null => {
    try {
      const authDataString = localStorage.getItem("auth");
      if (!authDataString) return null;
      const authData = JSON.parse(authDataString);
      return authData.accessToken || authData.access || null;
    } catch (e) {
      console.error("Error parsing auth token:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Calling the new specific endpoint that only returns is_course_completed=True
        const response = await fetch(`${API_URL}/assignments/completed-courses/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch certificates. Status: ${response.status}`);
        }

        const data: CourseAssignment[] = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error loading certificates:", err);
        setError("Unable to load your certificates at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCourses();
  }, [getToken]);

  const handleViewCertificate = (courseId: number) => {
    navigate(`/lms/courses/${courseId}/certificate`);
  };

  // Dynamic Stats based on actual completed courses length
  const statsSummary = [
    { 
      icon: Trophy, 
      label: 'Certificates Earned', 
      value: courses.length.toString(), 
      color: 'from-amber-500 to-yellow-500' 
    },
    { 
      icon: GraduationCap, 
      label: 'Courses Completed', 
      value: courses.length.toString(), 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: Star, 
      label: 'Achievement Level', 
      value: courses.length > 0 ? (courses.length >= 3 ? 'Expert' : 'Rising Star') : 'Beginner', 
      color: 'from-purple-500 to-pink-500' 
    },
    { 
      icon: Medal, 
      label: 'Success Rate', 
      value: courses.length > 0 ? '100%' : '0%', 
      color: 'from-green-500 to-emerald-500' 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-3xl p-8 border border-border shadow-soft max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something Went Wrong</h2>
          <p className="text-muted mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text relative overflow-hidden transition-colors duration-300">
      <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 bg-surface/50 border-border">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-muted text-sm font-medium">Your Learning Journey</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tight gradient-text">
            My Certificates
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Celebrate your achievements and showcase your <span className="text-primary font-semibold">hard-earned credentials.</span>
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {statsSummary.map((stat, index) => (
            <div key={index} className="bg-surface rounded-2xl p-6 border border-border shadow-soft hover:scale-105 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-muted text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Certificates Section */}
        <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-border flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Completed Courses</h2>
              <p className="text-muted text-sm">Click on any certificate to view and download</p>
            </div>
          </div>

          {courses.length > 0 ? (
            <div className="divide-y divide-border">
              {courses.map((course) => (
                <div key={course.id} className="p-6 lg:p-8 hover:bg-primary/5 transition-all group">
                  <div className="flex flex-col lg:row lg:flex-row lg:items-center gap-6">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Award className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-2 text-muted text-sm">
                          <User className="w-4 h-4" />
                          <span>{course.instructor_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {course.updated ? (
                                new Date(course.updated).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })
                            ) : "Recently Completed"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                            <span className="text-green-600 text-sm font-semibold flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Completed
                            </span>
                        </div>
                        <button
                            onClick={() => handleViewCertificate(course.id)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            <FileText className="w-5 h-5" />
                            View Certificate
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <Trophy className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Certificates Yet</h3>
              <p className="text-muted max-w-md mx-auto mb-8">
                Complete your assigned courses and pass the final exams to earn your certificates.
              </p>
              <button
                onClick={() => navigate('/lms/courses')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg"
              >
                <GraduationCap size={20} /> Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateHome;