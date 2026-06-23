import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  CircleCheck,
  Clock,
  MoreHorizontal,
  User,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const courseData = [
  { id: 1, title: 'UI Design Basics', enrolled: 18, completed: 15 },
  { id: 2, title: 'React Essentials', enrolled: 12, completed: 9 },
  { id: 3, title: 'UX Research', enrolled: 7, completed: 4 },
];

const graphData = courseData.map(course => ({
  name: course.title,
  Participated: course.enrolled,
  Completed: course.completed,
}));

const AdminContent = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Main Content - Left Side */}
      <div className="lg:flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Welcome to the LMS Dashboard
        </h2>

        {/* Courses Overview */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Courses Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {courseData.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Participation vs Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Participated" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">My Courses</h3>
        <div className="space-y-4">
          {courseData.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <h4 className="text-sm font-medium text-gray-800 mb-1">{course.title}</h4>
              <p className="text-xs text-gray-500">{course.enrolled} Enrolled / {course.completed} Completed</p>
            </div>
          ))}
        </div>

        {/* Placeholder Calendar */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Calendar</h4>
          <div className="text-center text-gray-400 text-sm">[Calendar Component Here]</div>
        </div>
      </div>
    </div>
  );
};

interface CourseCardProps {
  id: number;
  title: string;
  enrolled: number;
  completed: number;
}

const CourseCard = ({ title, enrolled, completed }: CourseCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="relative bg-indigo-100 rounded-t-xl h-32 flex items-center justify-center">
        <span className="text-4xl text-indigo-400"><BookOpen /></span>
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
          {enrolled} Enrolled
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-snug">{title}</h3>
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <CircleCheck size={14} className="text-green-500" />
            Completed {completed}
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            Enrolled {enrolled}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;



// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import {
//   BookOpen,
//   CircleCheck,
//   User,
//   TrendingUp,
//   RefreshCw,
//   Search,
// } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
// import type { RootState } from '../../store/store';

// // --- API Configuration ---
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// // --- Interfaces ---
// interface CourseReportData {
//   id: number;
//   name: string;
//   category: string;
//   instructor: string;
//   students: number;
//   completionRate: number;
//   avgScore: number;
//   status: string;
//   department: string;
// }

// interface CourseReportResponse {
//   role: string;
//   summary: {
//     totalCourses: number;
//     totalEnrollments: number;
//     completionRate: number;
//     avgRating: number;
//     certificatesIssued: number;
//     activeStudents: number;
//     totalInstructors: number;
//   };
//   courses: CourseReportData[];
//   categories: { name: string; count: number }[];
// }

// const AdminContent = () => {
//   const { accessToken: token } = useSelector((state: RootState) => state.auth);

//   // State
//   const [data, setData] = useState<CourseReportResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   // Fetch Logic
//   const fetchData = async () => {
//     if (!token) return;
    
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${API_BASE_URL}/lms/api/reports/course-stats/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setData(response.data);
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.response?.data?.error || 'Failed to load course data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [token]);

//   // Filtering Logic
//   const filteredCourses = data?.courses.filter(course => {
//     const term = searchTerm.toLowerCase();
//     const nameMatch = course.name.toLowerCase().includes(term);
//     const instructorMatch = course.instructor.toLowerCase().includes(term);
//     const catMatch = selectedCategory === 'all' || course.category === selectedCategory;
//     return (nameMatch || instructorMatch) && catMatch;
//   }) || [];

//   // Graph Data (Enrollment vs Completion for Top 10)
//   const graphData = filteredCourses.slice(0, 10).map(course => ({
//     name: course.name.length > 15 ? course.name.substring(0, 15) + '...' : course.name,
//     Enrolled: course.students,
//     'Completion %': course.completionRate,
//   }));

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <RefreshCw className="animate-spin text-indigo-500" size={32} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
//         <p className="text-red-500">{error}</p>
//         <button 
//           onClick={fetchData}
//           className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 p-6" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
//       {/* Main Content - Left Side */}
//       <div className="lg:flex-1 space-y-6">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h2 className="text-2xl font-semibold" style={{ color: 'rgb(var(--text-main))' }}>
//               Course Management
//             </h2>
//             <p className="text-sm opacity-60">
//               {data?.role === 'team-leader' ? 'Your assigned courses' : 'All platform courses'}
//             </p>
//           </div>
          
//           <div className="flex gap-3">
//             {/* Search */}
//             <div className="relative">
//               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 pr-4 py-2 rounded-lg border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] text-sm w-48"
//                 style={{ color: 'rgb(var(--text-main))' }}
//               />
//             </div>
            
//             {/* Category Filter */}
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="px-3 py-2 rounded-lg border bg-[rgb(var(--bg-card))] border-[rgb(var(--border-main))] text-sm"
//               style={{ color: 'rgb(var(--text-main))' }}
//             >
//               <option value="all">All Categories</option>
//               {data?.categories.map(cat => (
//                 <option key={cat.name} value={cat.name}>{cat.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         {data && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <SummaryCard label="Total Courses" value={data.summary.totalCourses} icon={BookOpen} />
//             <SummaryCard label="Total Enrollments" value={data.summary.totalEnrollments} icon={User} />
//             <SummaryCard label="Completion Rate" value={`${data.summary.completionRate}%`} icon={CircleCheck} />
//             <SummaryCard label="Certificates" value={data.summary.certificatesIssued} icon={TrendingUp} />
//           </div>
//         )}

//         {/* Courses Grid */}
//         <div>
//           <h3 className="text-xl font-semibold mb-4" style={{ color: 'rgb(var(--text-main))' }}>
//             Courses ({filteredCourses.length})
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredCourses.map((course) => (
//               <CourseCard key={course.id} course={course} />
//             ))}
//           </div>
          
//           {filteredCourses.length === 0 && (
//             <div className="text-center py-12 opacity-50">
//               <BookOpen size={48} className="mx-auto mb-4" />
//               <p>No courses found matching your criteria</p>
//             </div>
//           )}
//         </div>

//         {/* Graph */}
//         {graphData.length > 0 && (
//           <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'rgb(var(--border-main))' }}>
//             <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--text-main))' }}>
//               Enrollment vs Completion
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={graphData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                 <XAxis 
//                   dataKey="name" 
//                   angle={-45}
//                   textAnchor="end"
//                   interval={0}
//                   height={80}
//                   tick={{ fontSize: 11, fill: 'rgb(var(--text-muted))' }}
//                 />
//                 <YAxis tick={{ fill: 'rgb(var(--text-muted))' }} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: 'rgb(var(--bg-card))',
//                     borderColor: 'rgb(var(--border-main))',
//                     borderRadius: '8px'
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="Enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="Completion %" fill="#10b981" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* Right Side Panel */}
//       <div 
//         className="lg:w-80 rounded-xl shadow-sm border p-6 h-fit lg:sticky lg:top-6"
//         style={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'rgb(var(--border-main))' }}
//       >
//         <h3 className="text-lg font-semibold mb-4" style={{ color: 'rgb(var(--text-main))' }}>
//           Quick Stats
//         </h3>
        
//         {/* Category Breakdown */}
//         <div className="space-y-4 mb-8">
//           <h4 className="text-sm font-medium opacity-60">By Category</h4>
//           {data?.categories.map((cat, index) => (
//             <div key={index} className="flex items-center justify-between">
//               <span className="text-sm">{cat.name}</span>
//               <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-[rgba(var(--brand-primary),0.1)]">
//                 {cat.count}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Top Performers */}
//         <div className="space-y-4">
//           <h4 className="text-sm font-medium opacity-60">Top Performers</h4>
//           {filteredCourses
//             .sort((a, b) => b.completionRate - a.completionRate)
//             .slice(0, 3)
//             .map((course) => (
//               <div key={course.id} className="p-3 border rounded-lg hover:bg-[rgb(var(--bg-main))] transition-colors" style={{ borderColor: 'rgb(var(--border-main))' }}>
//                 <h4 className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--text-main))' }}>
//                   {course.name}
//                 </h4>
//                 <div className="flex justify-between text-xs opacity-60">
//                   <span>{course.students} Enrolled</span>
//                   <span className="text-emerald-500 font-bold">{course.completionRate}% Complete</span>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Sub-components ---

// interface SummaryCardProps {
//   label: string;
//   value: string | number;
//   icon: React.ComponentType<{ size?: number }>;
// }

// const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon: Icon }) => (
//   <div 
//     className="p-4 rounded-xl border"
//     style={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'rgb(var(--border-main))' }}
//   >
//     <div className="flex items-center gap-3">
//       <div className="p-2 rounded-lg bg-[rgba(var(--brand-primary),0.1)]">
//         <Icon size={20} />
//       </div>
//       <div>
//         <p className="text-xl font-bold" style={{ color: 'rgb(var(--text-main))' }}>{value}</p>
//         <p className="text-xs opacity-50">{label}</p>
//       </div>
//     </div>
//   </div>
// );

// interface CourseCardProps {
//   course: CourseReportData;
// }

// const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
//   const statusColors: Record<string, string> = {
//     'Active': 'bg-emerald-500',
//     'Draft': 'bg-amber-500',
//     'Archived': 'bg-gray-500'
//   };

//   return (
//     <div 
//       className="rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition"
//       style={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'rgb(var(--border-main))' }}
//     >
//       <div className="relative bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 h-32 flex items-center justify-center">
//         <BookOpen size={40} className="text-indigo-400" />
//         <div className={`absolute top-2 left-2 ${statusColors[course.status] || 'bg-gray-500'} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
//           {course.status}
//         </div>
//         <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 backdrop-blur text-xs font-semibold px-2 py-0.5 rounded">
//           {course.category}
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: 'rgb(var(--text-main))' }}>
//           {course.name}
//         </h3>
//         <p className="text-xs opacity-50 mb-3">{course.instructor}</p>
//         <div className="flex justify-between text-xs opacity-70">
//           <div className="flex items-center gap-1">
//             <CircleCheck size={14} className="text-green-500" />
//             {course.completionRate}% Complete
//           </div>
//           <div className="flex items-center gap-1">
//             <User size={14} />
//             {course.students} Enrolled
//           </div>
//         </div>
//         {/* Progress bar */}
//         <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
//             style={{ width: `${course.completionRate}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminContent;