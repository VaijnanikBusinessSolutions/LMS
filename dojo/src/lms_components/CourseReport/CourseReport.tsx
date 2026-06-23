// import React, { useState, useEffect } from 'react';

// // --- Types ---
// interface Course {
//   id: number;
//   name: string;
//   category: string;
//   department: string; // ✅ Direct field from API
//   instructor: string;
//   students: number;
//   completionRate: number;
//   avgScore: number;
//   rating: number;
//   status: 'Active' | 'Draft' | 'Archived';
//   revenue: number;
//   duration: string;
//   createdAt: string;
// }

// interface CategoryData {
//   name: string;
//   count: number;
// }

// interface SummaryData {
//   totalCourses: number;
//   totalEnrollments: number;
//   completionRate: number;
//   avgRating: number;
//   totalRevenue: number;
//   certificatesIssued: number;
//   activeStudents: number;
//   totalInstructors: number;
// }

// const CourseReport: React.FC = () => {
//   // --- State ---
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [summary, setSummary] = useState<SummaryData | null>(null);
//   const [categories, setCategories] = useState<CategoryData[]>([]);
  
//   // Department State
//   const [departments, setDepartments] = useState<string[]>([]);
//   const [departmentFilter, setDepartmentFilter] = useState('all');

//   const [isLoading, setIsLoading] = useState(true);
  
//   // Other Filters
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // --- Fetch Data ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Retrieve token from storage
//         const authData = localStorage.getItem("auth");
//         const token = authData ? JSON.parse(authData).accessToken : "";

//         // Ensure this URL matches your backend
//         const response = await fetch('http://127.0.0.1:8000/lms/api/reports/course-stats/', {
//              headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
        
//         const data = await response.json();
        
//         // 1. Process Courses
//         // The backend now sends 'department' directly (handling the fallback logic server-side)
//         const processedCourses: Course[] = data.courses.map((c: any) => ({
//             ...c,
//             // Ensure department is never null/undefined for filtering
//             department: c.department || 'General' 
//         }));

//         setCourses(processedCourses);
//         setSummary(data.summary);
//         setCategories(data.categories);
        
//         // 2. Extract Unique Departments for Dropdown
//         const uniqueDepts = Array.from(new Set(processedCourses.map((c) => c.department)));
//         const cleanDepts = (uniqueDepts as string[]).filter(d => d && d.trim() !== "").sort();
        
//         setDepartments(cleanDepts);

//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching course report:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // --- Filter Logic ---
//   const filteredCourses = courses.filter(course => {
//     // 1. Department Filter
//     const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter;

//     // 2. Other Filters
//     const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
//     const matchesStatus = statusFilter === 'all' || course.status === statusFilter; 
//     const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
//     return matchesCategory && matchesStatus && matchesSearch && matchesDepartment;
//   });

//   // --- Helper Functions ---
//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'Active': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30';
//       case 'Draft': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30';
//       case 'Archived': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30';
//       default: return 'bg-gray-400 text-white';
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: string } = {
//       'Web Development': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
//       'Data Science': 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
//       'Design': 'bg-gradient-to-r from-purple-400 to-fuchsia-500 text-white',
//       'Marketing': 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
//     };
//     return colors[category] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-800">
//         <div className="text-xl animate-pulse font-semibold">Loading Report Data...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 transition-colors duration-300">
      
//       {/* Header */}
//       <div className="flex flex-col items-center justify-center mb-8 animate-in fade-in slide-in-from-top-2">
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent m-0 drop-shadow-sm">
//             📊 Course Report
//           </h1>
//           <p className="text-gray-500 mt-3 text-lg">Real-time analytics from LMS Database</p>
//         </div>
//       </div>

//       {/* Filters Container */}
//       <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-2 delay-100">
        
//         {/* Category Filter */}
//         <div className="flex flex-col gap-2">
//             <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Category</label>
//             <select 
//                 value={categoryFilter} 
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="px-4 py-3 border border-indigo-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
//             >
//             <option value="all">All Categories</option>
//             {categories.map(cat => (
//                 <option key={cat.name} value={cat.name}>{cat.name} ({cat.count})</option>
//             ))}
//             </select>
//         </div>

//         {/* --- DEPARTMENT FILTER --- */}
//         <div className="flex flex-col gap-2">
//             <label className="text-xs font-bold text-teal-600 uppercase tracking-wider">Department</label>
//             <select 
//                 value={departmentFilter} 
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//                 className="px-4 py-3 border border-teal-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
//             >
//             <option value="all">All Departments</option>
//             {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//             ))}
//             </select>
//         </div>

//         {/* Status Filter */}
//         <div className="flex flex-col gap-2">
//             <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Status</label>
//             <select 
//                 value={statusFilter} 
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-3 border border-blue-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//             >
//             <option value="all">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Draft">Draft</option>
//             </select>
//         </div>

//         {/* Search */}
//         <div className="flex flex-col gap-2 flex-1 min-w-[250px]">
//             <label className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Search</label>
//             <input
//                 type="text"
//                 placeholder="🔍 Search courses or instructors..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="px-4 py-3 border border-cyan-100 rounded-xl text-sm w-full bg-gray-50 text-gray-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all placeholder:text-gray-400"
//             />
//         </div>
//       </div>

//       {/* Summary Cards */}
//       {summary && (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-top-2 delay-200">
//         {/* Card 1: Total Courses */}
//         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
//           <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📚</div>
//           <div>
//             <h3 className="text-3xl font-bold text-white m-0">{summary.totalCourses}</h3>
//             <p className="text-indigo-100 text-sm mt-1 font-medium">Total Courses</p>
//           </div>
//         </div>

//         {/* Card 2: Enrollments */}
//         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
//           <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👥</div>
//           <div>
//             <h3 className="text-3xl font-bold text-white m-0">{summary.totalEnrollments}</h3>
//             <p className="text-emerald-100 text-sm mt-1 font-medium">Total Enrollments</p>
//           </div>
//         </div>

//         {/* Card 3: Completion Rate */}
//         <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
//           <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📈</div>
//           <div>
//             <h3 className="text-3xl font-bold text-white m-0">{summary.completionRate}%</h3>
//             <p className="text-amber-100 text-sm mt-1 font-medium">Avg Completion Rate</p>
//           </div>
//         </div>

//          {/* Card 4: Certificates (Completed Courses) */}
//          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-rose-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
//           <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎓</div>
//           <div>
//             <h3 className="text-3xl font-bold text-white m-0">{summary.certificatesIssued}</h3>
//             <p className="text-rose-100 text-sm mt-1 font-medium">Completed / Certs</p>
//           </div>
//         </div>
//       </div>
//       )}

//       {/* Course Details Table */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-top-2 delay-300">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent m-0 flex items-center gap-2">
//             📚 Course Details
//           </h3>
//           <span className="text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-full font-semibold shadow-md">
//             {filteredCourses.length} courses found
//           </span>
//         </div>
//         <div className="overflow-x-auto rounded-xl scrollbar-thin">
//           <table className="w-full min-w-[900px]">
//             <thead>
//               <tr className="bg-gray-800">
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Course Name</th>
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Category</th>
//                 {/* --- DEPARTMENT HEADER --- */}
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Department</th>
                
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Instructor</th>
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Students</th>
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Completion</th>
//                 <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredCourses.map((course, index) => (
//                 <tr 
//                   key={course.id} 
//                   className={`hover:bg-indigo-50/30 transition-all duration-200 ${
//                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   }`}
//                 >
//                   <td className="px-5 py-5">
//                     <div className="flex flex-col gap-1">
//                       <strong className="text-gray-800 text-base">{course.name}</strong>
//                       <small className="text-gray-500 text-xs font-medium">⏱️ {course.duration}</small>
//                     </div>
//                   </td>
//                   <td className="px-5 py-5">
//                     <span className={`${getCategoryColor(course.category)} px-3 py-1.5 rounded-full text-xs font-bold shadow-sm`}>
//                       {course.category}
//                     </span>
//                   </td>
                  
//                   {/* --- DEPARTMENT DATA --- */}
//                   <td className="px-5 py-5">
//                     <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md border border-teal-100 uppercase tracking-wide">
//                       {course.department}
//                     </span>
//                   </td>

//                   <td className="px-5 py-5">
//                     <div className="flex items-center gap-2">
//                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
//                         {course.instructor ? course.instructor.charAt(0) : '?'}
//                       </div>
//                       <span className="text-sm text-gray-700 font-medium">{course.instructor}</span>
//                     </div>
//                   </td>
//                   <td className="px-5 py-5">
//                     <div className="flex flex-col">
//                       <span className="font-bold text-gray-800 text-lg">{course.students}</span>
//                       <small className="text-emerald-600 text-xs font-medium">enrolled</small>
//                     </div>
//                   </td>
//                   <td className="px-5 py-5">
//                      <div className="w-full bg-gray-200 rounded-full h-2.5">
//                         <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${course.completionRate}%`}}></div>
//                      </div>
//                      <span className="text-xs text-gray-500 mt-1 inline-block">{course.completionRate}% Done</span>
//                   </td>
//                   <td className="px-5 py-5">
//                     <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusBadgeClass(course.status)}`}>
//                       {course.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//               {filteredCourses.length === 0 && (
//                   <tr>
//                       <td colSpan={7} className="text-center py-8 text-gray-500">
//                           No courses match your selected filters.
//                       </td>
//                   </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseReport;


import React, { useState, useEffect } from 'react';
import { Shield, Lock } from 'lucide-react'; // Added icons for role indication

// --- Types ---
interface Course {
  id: number;
  name: string;
  category: string;
  department: string;
  instructor: string;
  students: number;
  completionRate: number;
  avgScore: number;
  rating: number;
  status: 'Active' | 'Draft' | 'Archived';
  revenue: number;
  duration: string;
  createdAt: string;
}

interface CategoryData {
  name: string;
  count: number;
}

interface SummaryData {
  totalCourses: number;
  totalEnrollments: number;
  completionRate: number;
  avgRating: number;
  totalRevenue: number;
  certificatesIssued: number;
  activeStudents: number;
  totalInstructors: number;
}

const CourseReport: React.FC = () => {
  // --- State ---
  const [courses, setCourses] = useState<Course[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  // New State for Role
  const [userRole, setUserRole] = useState<string>('');

  // Department State
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Other Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authData = localStorage.getItem("auth");
        const token = authData ? JSON.parse(authData).accessToken : "";

        const response = await fetch('http://127.0.0.1:8000/lms/api/reports/course-stats/', {
             headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (response.status === 403) {
            setError("You do not have permission to view reports.");
            setIsLoading(false);
            return;
        }

        const data = await response.json();
        
        const processedCourses: Course[] = data.courses.map((c: any) => ({
            ...c,
            department: c.department || 'General' 
        }));

        setCourses(processedCourses);
        setSummary(data.summary);
        setCategories(data.categories);
        setUserRole(data.role); // Set role from backend response

        const uniqueDepts = Array.from(new Set(processedCourses.map((c) => c.department)));
        const cleanDepts = (uniqueDepts as string[]).filter(d => d && d.trim() !== "").sort();
        
        setDepartments(cleanDepts);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course report:", error);
        setError("Failed to load report data.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Filter Logic ---
  const filteredCourses = courses.filter(course => {
    const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter; 
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch && matchesDepartment;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg shadow-emerald-500/30';
      case 'Draft': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30';
      case 'Archived': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Web Development': 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
      'Data Science': 'bg-gradient-to-r from-pink-400 to-rose-500 text-white',
      'Design': 'bg-gradient-to-r from-purple-400 to-fuchsia-500 text-white',
      'Marketing': 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
    };
    return colors[category] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-800">
        <div className="text-xl animate-pulse font-semibold">Loading Report Data...</div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 text-red-600">
          <div className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6" /> {error}
          </div>
        </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 transition-colors duration-300">

      {/* Filters Container */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-2 delay-100">
        
        {/* Category Filter */}
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Category</label>
            <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-indigo-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            >
            <option value="all">All Categories</option>
            {categories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name} ({cat.count})</option>
            ))}
            </select>
        </div>

        {/* --- DEPARTMENT FILTER --- */}
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-teal-600 uppercase tracking-wider">Department</label>
            <select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 border border-teal-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
            >
            <option value="all">All Departments</option>
            {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
            ))}
            </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Status</label>
            <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-blue-100 rounded-xl text-sm min-w-[180px] bg-gray-50 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            </select>
        </div>

        {/* Search */}
        <div className="flex flex-col gap-2 flex-1 min-w-[250px]">
            <label className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Search</label>
            <input
                type="text"
                placeholder="🔍 Search courses or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-cyan-100 rounded-xl text-sm w-full bg-gray-50 text-gray-800 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all placeholder:text-gray-400"
            />
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-top-2 delay-200">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📚</div>
          <div>
            <h3 className="text-3xl font-bold text-white m-0">{summary.totalCourses}</h3>
            <p className="text-indigo-100 text-sm mt-1 font-medium">Total Courses</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👥</div>
          <div>
            <h3 className="text-3xl font-bold text-white m-0">{summary.totalEnrollments}</h3>
            <p className="text-emerald-100 text-sm mt-1 font-medium">Total Enrollments</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📈</div>
          <div>
            <h3 className="text-3xl font-bold text-white m-0">{summary.completionRate}%</h3>
            <p className="text-amber-100 text-sm mt-1 font-medium">Avg Completion Rate</p>
          </div>
        </div>

         <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-rose-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎓</div>
          <div>
            <h3 className="text-3xl font-bold text-white m-0">{summary.certificatesIssued}</h3>
            <p className="text-rose-100 text-sm mt-1 font-medium">Completed / Certs</p>
          </div>
        </div>
      </div>
      )}

      {/* Course Details Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-top-2 delay-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent m-0 flex items-center gap-2">
            📚 Course Details
          </h3>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent m-0 drop-shadow-sm">
             Course Report
          </h1>
          <span className="text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-full font-semibold shadow-md">
            {filteredCourses.length} courses found
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl scrollbar-thin">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-800">
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Course Name</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Instructor</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Students</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Completion</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-white uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCourses.map((course, index) => (
                <tr 
                  key={course.id} 
                  className={`hover:bg-indigo-50/30 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-5 py-5">
                    <div className="flex flex-col gap-1">
                      <strong className="text-gray-800 text-base">{course.name}</strong>
                      <small className="text-gray-500 text-xs font-medium">⏱️ {course.duration}</small>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`${getCategoryColor(course.category)} px-3 py-1.5 rounded-full text-xs font-bold shadow-sm`}>
                      {course.category}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-md border border-teal-100 uppercase tracking-wide">
                      {course.department}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {course.instructor ? course.instructor.charAt(0) : '?'}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{course.instructor}</span>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-lg">{course.students}</span>
                      <small className="text-emerald-600 text-xs font-medium">enrolled</small>
                    </div>
                  </td>
                  <td className="px-5 py-5">
                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: `${course.completionRate}%`}}></div>
                     </div>
                     <span className="text-xs text-gray-500 mt-1 inline-block">{course.completionRate}% Done</span>
                  </td>
                  <td className="px-5 py-5">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusBadgeClass(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                  <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                          No courses match your selected filters.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseReport;