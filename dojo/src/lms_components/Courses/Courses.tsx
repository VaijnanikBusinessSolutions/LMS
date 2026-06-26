

// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { X, Filter, Search, ChevronRight, Sparkles, TrendingUp, BookOpen, Clock, Users, Star, ArrowRight, Play, Bookmark, GraduationCap, Briefcase, BarChart, CheckCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_URL = 'http://127.0.0.1:8000/lms';

// interface Course {
//   id: number;
//   title: string;
//   instructor_name: string;
//   level: string;
//   duration: string;
//   description: string;
//   introduction: string;
//   tags: string[];
//   department?: string; 
//   questions: number;
//   updated: string;
//   created: string;
//   is_published: boolean;
//   photo?: string;
//   stats: {
//     accuracy: number;
//     completion: number;
//     enrolled: number;
//     rating: string;
//     duration: string;
//   };
//   roadmap: {
//     id: number;
//     title: string;
//     duration: string;
//     completed: boolean;
//     sample?: boolean;
//     content: string;
//     order: number;
//   }[];
// }

// // --- SUB-COMPONENTS (UNTOUCHED UI) ---

// // 1. Elegant Course Card
// interface ElegantCourseCardProps {
//   course: Course;
//   index: number;
//   hoveredCourse: number | null;
//   setHoveredCourse: (id: number | null) => void;
//   onClick: (id: number) => void;
// }

// const ElegantCourseCard: React.FC<ElegantCourseCardProps> = ({ course, index, hoveredCourse, setHoveredCourse, onClick }) => {
//   const isHovered = hoveredCourse === course.id;
  
//   return (
//     <div
//       onClick={() => onClick(course.id)}
//       onMouseEnter={() => setHoveredCourse(course.id)}
//       onMouseLeave={() => setHoveredCourse(null)}
//       className="group relative cursor-pointer"
//       style={{
//         animation: `fadeSlideUp 0.6s ease-out ${index * 0.1}s both`
//       }}
//     >
//       <div className={`
//         relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 ease-out border border-transparent dark:border-slate-800
//         ${isHovered ? 'shadow-2xl shadow-slate-300/50 dark:shadow-black/50 -translate-y-2' : 'shadow-lg shadow-slate-200/50 dark:shadow-none'}
//       `}>
//         {/* Image Container */}
//         <div className="relative h-48 overflow-hidden">
//           {course.photo ? (
//             <img 
//               src={course.photo} 
//               alt={course.title}
//               className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
//               <BookOpen size={48} className="text-slate-300 dark:text-slate-600" />
//             </div>
//           )}
          
//           <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
//           <div className="absolute top-4 left-4">
//             <span className={`
//               px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-sm
//               ${course.level === 'Beginner' ? 'bg-emerald-500/90 text-white' : 
//                 course.level === 'Intermediate' ? 'bg-amber-500/90 text-white' : 
//                 'bg-rose-500/90 text-white'}
//             `}>
//               {course.level}
//             </span>
//           </div>

//           {course.department && (
//              <div className="absolute top-4 right-4">
//                <span className="px-3 py-1.5 bg-black/50 text-white text-xs font-medium rounded-full backdrop-blur-md">
//                  {course.department}
//                </span>
//              </div>
//           )}

//           <div className={`
//             absolute inset-0 flex items-center justify-center transition-all duration-300
//             ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
//           `}>
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
//               <Play size={24} className="text-slate-800 fill-slate-800 ml-1" />
//             </div>
//           </div>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <div className="flex flex-wrap gap-2">
//             {course.tags.slice(0, 2).map((tag, idx) => (
//               <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
//                 {tag}
//               </span>
//             ))}
//           </div>
          
//           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
//             {course.title}
//           </h3>
          
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//               {course.instructor_name?.charAt(0)}
//             </div>
//             <span className="text-sm text-slate-500 dark:text-slate-400">{course.instructor_name}</span>
//           </div>
          
//           <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
//             <div className="flex items-center gap-1.5">
//               <Star size={14} className="text-amber-500 fill-amber-500" />
//               <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{course.stats.rating}</span>
//             </div>
//             <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
//               <Clock size={14} />
//               <span className="text-sm">{course.duration}</span>
//             </div>
//             <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
//               <Users size={14} />
//               <span className="text-sm">{course.stats.enrolled}</span>
//             </div>
//           </div>
//         </div>
        
//         {course.stats.completion > 0 && (
//           <div className="px-6 pb-4">
//             <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//               <div 
//                 className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
//                 style={{ width: `${course.stats.completion}%` }}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // 2. Featured Hero
// const FeaturedHero = ({ course, onClick }: { course: Course, onClick: (id: number) => void }) => {
//   if (!course) return null;
  
//   return (
//     <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:border dark:border-slate-800 p-1 mb-12 shadow-2xl">
//       <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-600/20" />
//       <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
//       <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[1.8rem] p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center">
//         <div className="flex-1 space-y-6">
//           <div className="flex items-center gap-3">
//             <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/25">
//               <Star size={12} className="fill-white" />
//               FEATURED
//             </span>
//             <span className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
//               {course.level}
//             </span>
//             {course.department && (
//                <span className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
//                  {course.department}
//                </span>
//             )}
//           </div>
          
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
//             {course.title}
//           </h1>
          
//           <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
//             {course.description?.slice(0, 150)}...
//           </p>
          
//           <div className="flex flex-wrap items-center gap-6 text-slate-400">
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                 {course.instructor_name?.charAt(0)}
//               </div>
//               <span className="text-white font-medium">{course.instructor_name}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock size={18} />
//               <span>{course.duration}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Users size={18} />
//               <span>{course.stats.enrolled.toLocaleString()} enrolled</span>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4 pt-4">
//             <button 
//               onClick={() => onClick(course.id)}
//               className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-3"
//             >
//               <Play size={20} className="fill-white" />
//               Start Learning
//               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//             <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all duration-300">
//               <Bookmark size={20} />
//             </button>
//           </div>
//         </div>
        
//         <div className="relative w-full lg:w-96 h-64 lg:h-80">
//           <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 rounded-2xl" />
//           {course.photo ? (
//             <img 
//               src={course.photo} 
//               alt={course.title}
//               className="w-full h-full object-cover rounded-2xl shadow-2xl"
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center">
//               <GraduationCap size={80} className="text-white/20" />
//             </div>
//           )}
//           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 w-max">
//             <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
//               <Star size={18} className="text-amber-500 fill-amber-500" />
//               <span className="font-bold text-slate-800 dark:text-slate-100">{course.stats.rating}</span>
//             </div>
//             <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
//               <TrendingUp size={18} className="text-emerald-500" />
//               <span className="font-bold text-slate-800 dark:text-slate-100">{course.stats.completion}%</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // 3. Horizontal Section
// interface HorizontalSectionProps {
//   courses: Course[];
//   title: string;
//   subtitle: string;
//   icon: React.ElementType;
//   hoveredCourse: number | null;
//   setHoveredCourse: (id: number | null) => void;
//   onCourseClick: (id: number) => void;
// }

// const HorizontalSection: React.FC<HorizontalSectionProps> = ({ 
//   courses, title, subtitle, icon: Icon, hoveredCourse, setHoveredCourse, onCourseClick 
// }) => {
//   const scrollRef = useRef<HTMLDivElement>(null);
  
//   const scroll = (direction: 'left' | 'right') => {
//     if (scrollRef.current) {
//       const scrollAmount = 340;
//       scrollRef.current.scrollBy({
//         left: direction === 'left' ? -scrollAmount : scrollAmount,
//         behavior: 'smooth'
//       });
//     }
//   };

//   if (courses.length === 0) return null;

//   return (
//     <div className="mb-16">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/25">
//             <Icon size={24} className="text-white" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
//             <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <button 
//             onClick={() => scroll('left')}
//             className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
//           >
//             <ChevronRight size={20} className="rotate-180" />
//           </button>
//           <button 
//             onClick={() => scroll('right')}
//             className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
//           >
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>
      
//       <div 
//         ref={scrollRef}
//         className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth -mx-2 px-2"
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//       >
//         {courses.map((course, index) => (
//           <div key={course.id} className="flex-shrink-0 w-80">
//             <ElegantCourseCard 
//               course={course} 
//               index={index} 
//               hoveredCourse={hoveredCourse}
//               setHoveredCourse={setHoveredCourse}
//               onClick={onCourseClick}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// // --- MAIN COMPONENT ---

// const CoursesView = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [assignedCourses, setAssignedCourses] = useState<Course[]>([]); // <--- NEW STATE
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   // Filtering States
//   const [search, setSearch] = useState('');
//   const [tagSearch, setTagSearch] = useState('');
//   const [availableTags, setAvailableTags] = useState<string[]>([]);
  
//   // Filters
//   const [filterTags, setFilterTags] = useState<string[]>([]);
//   const [filterDepartment, setFilterDepartment] = useState('all');
//   const [filterLevel, setFilterLevel] = useState('all');

//   const [showTagDropdown, setShowTagDropdown] = useState(false);
//   const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         // 1. Fetch All Courses (Public)
//         const coursesResponse = await fetch(`${API_URL}/courses/`);
//         if (!coursesResponse.ok) throw new Error(`HTTP error! status: ${coursesResponse.status}`);
//         const coursesData: Course[] = await coursesResponse.json();
//         setCourses(coursesData);
        
//         const allTags: string[] = coursesData.flatMap((course: Course) => course.tags);
//         const uniqueTags: string[] = Array.from(new Set(allTags));
//         setAvailableTags(uniqueTags);

//         // 2. Fetch Assigned Courses (Protected)
//         // Get Token
//         let token = null;
//         try {
//             const authData = localStorage.getItem('auth');
//             if(authData) token = JSON.parse(authData).accessToken;
//         } catch (e) { console.log("No auth token found"); }

//         if (token) {
//             const assignedResponse = await fetch(`${API_URL}/assignments/my-courses/`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
            
//             if (assignedResponse.ok) {
//                 const assignedData = await assignedResponse.json();
//                 // Map the response: sometimes endpoint returns assignment object wrapper, sometimes course direct
//                 // Ensure we get the Course object
//                 const normalizedAssigned = assignedData.map((item: any) => item.course ? item.course : item);
//                 setAssignedCourses(normalizedAssigned);
//             }
//         }

//       } catch (err) {
//         setError('Failed to fetch courses. Please check your backend connection.');
//         console.error('Failed to fetch courses:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter Actions
//   const toggleTag = (tag: string) => {
//     if (filterTags.includes(tag)) {
//         setFilterTags(prev => prev.filter(t => t !== tag));
//     } else {
//         setFilterTags(prev => [...prev, tag]);
//     }
//     setTagSearch('');
//   };

//   const clearAllFilters = () => {
//       setFilterTags([]);
//       setFilterDepartment('all');
//       setFilterLevel('all');
//       setSearch('');
//   };

//   const uniqueDepartments = useMemo(() => {
//       const depts = courses.map(c => c.department).filter(Boolean) as string[];
//       return Array.from(new Set(depts));
//   }, [courses]);

//   const uniqueLevels = useMemo(() => {
//       const levels = courses.map(c => c.level).filter(Boolean);
//       return Array.from(new Set(levels));
//   }, [courses]);

//   // Main Filter Logic
//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
//     const matchesTags = filterTags.length === 0 || filterTags.some(t => course.tags.includes(t));
//     const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment;
//     const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
//     return matchesSearch && matchesTags && matchesDepartment && matchesLevel;
//   });

//   const filteredTags = availableTags.filter(tag =>
//     tag.toLowerCase().includes(tagSearch.toLowerCase()) && !filterTags.includes(tag)
//   );

//   const handleCourseClick = (courseId: number) => navigate(`/lms/courses/${courseId}`);

//   // Use the most enrolled course as Featured
//   const featuredCourse = [...courses].sort((a, b) => b.stats.enrolled - a.stats.enrolled)[0];
  
//   const isSearching = search.trim() !== '' || filterTags.length > 0 || filterDepartment !== 'all' || filterLevel !== 'all';

//   const categories = [
//     { id: 'all', label: 'All Courses', icon: BookOpen },
//     { id: 'Beginner', label: 'Beginner', icon: Sparkles },
//     { id: 'Intermediate', label: 'Intermediate', icon: TrendingUp },
//     { id: 'Advanced', label: 'Advanced', icon: GraduationCap },
//   ];

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
//       <div className="relative">
//         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse" />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <GraduationCap size={40} className="text-white" />
//         </div>
//       </div>
//       <div className="mt-8 space-y-2 text-center">
//         <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">Loading your courses</p>
//         <p className="text-slate-400 dark:text-slate-500">Preparing your learning experience...</p>
//       </div>
//     </div>
//   );
  
//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
//       <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md">
//         <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
//           <X size={32} className="text-rose-500" />
//         </div>
//         <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Connection Error</h2>
//         <p className="text-slate-500 dark:text-slate-400">{error}</p>
//       </div>
//     </div>
//   );

//   const activeFiltersCount = (filterDepartment !== 'all' ? 1 : 0) + (filterLevel !== 'all' ? 1 : 0) + filterTags.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
//       <style>{`
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//       `}</style>

//       {/* Sticky Header */}
//       <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
//         <div className="w-full px-6 px-6 py-4">
//           <div className="flex items-center gap-4">
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search for courses..."
//                 className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 border-2 border-transparent focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl pl-12 pr-6 py-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300"
//               />
//               <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//             </div>
            
//             <div className="relative">
//               <button
//                 onClick={() => setShowTagDropdown(!showTagDropdown)}
//                 className={`
//                   flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300
//                   ${activeFiltersCount > 0 
//                     ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' 
//                     : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}
//                 `}
//               >
//                 <Filter size={18} />
//                 Filters
//                 {activeFiltersCount > 0 && (
//                   <span className="bg-white text-violet-600 w-5 h-5 flex items-center justify-center text-xs rounded-full font-bold">
//                     {activeFiltersCount}
//                   </span>
//                 )}
//               </button>
              
//               {showTagDropdown && (
//                 <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  
//                   <div className="p-4 border-b border-slate-100 dark:border-slate-800">
//                     <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
//                       <Briefcase size={14} className="text-violet-500"/> Department
//                     </label>
//                     <select 
//                       value={filterDepartment}
//                       onChange={(e) => setFilterDepartment(e.target.value)}
//                       className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-violet-500 focus:outline-none transition-colors"
//                     >
//                       <option value="all">All Departments</option>
//                       {uniqueDepartments.map(d => (
//                         <option key={d} value={d}>{d}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="p-4 border-b border-slate-100 dark:border-slate-800">
//                     <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
//                       <BarChart size={14} className="text-emerald-500"/> Difficulty Level
//                     </label>
//                     <select 
//                       value={filterLevel}
//                       onChange={(e) => setFilterLevel(e.target.value)}
//                       className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-violet-500 focus:outline-none transition-colors"
//                     >
//                       <option value="all">All Levels</option>
//                       {uniqueLevels.map(l => (
//                         <option key={l} value={l}>{l}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="p-4 border-b border-slate-100 dark:border-slate-800">
//                     <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Filter by Tags</label>
//                     <input
//                       type="text"
//                       value={tagSearch}
//                       onChange={(e) => setTagSearch(e.target.value)}
//                       placeholder="Search tags..."
//                       className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:placeholder-slate-500"
//                     />
//                   </div>
                  
//                   <div className="max-h-48 overflow-y-auto p-3">
//                     <div className="flex flex-wrap gap-2">
//                       {filteredTags.map(tag => (
//                         <button
//                           key={tag}
//                           onClick={() => toggleTag(tag)}
//                           className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 text-slate-600 dark:text-slate-300 text-xs rounded-lg transition-all duration-200 font-medium border border-slate-100 dark:border-slate-700"
//                         >
//                           {tag}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {activeFiltersCount > 0 && (
//             <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
//               {filterDepartment !== 'all' && (
//                 <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in">
//                   Dept: {filterDepartment}
//                   <button onClick={() => setFilterDepartment('all')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
//                     <X size={14} />
//                   </button>
//                 </span>
//               )}

//               {filterLevel !== 'all' && (
//                 <span className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in">
//                   Level: {filterLevel}
//                   <button onClick={() => setFilterLevel('all')} className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5">
//                     <X size={14} />
//                   </button>
//                 </span>
//               )}

//               {filterTags.map((tag) => (
//                 <span 
//                   key={tag}
//                   className="flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in"
//                 >
//                   {tag}
//                   <button onClick={() => toggleTag(tag)} className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5">
//                     <X size={14} />
//                   </button>
//                 </span>
//               ))}
              
//               <button 
//                 onClick={clearAllFilters}
//                 className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium whitespace-nowrap ml-2"
//               >
//                 Clear all
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="w-full px-6 py-8">
//         {isSearching ? (
//           <div>
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Search Results</h1>
//                 <p className="text-slate-500 dark:text-slate-400">{filteredCourses.length} courses found</p>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredCourses.map((course, index) => (
//                 <ElegantCourseCard 
//                   key={course.id} 
//                   course={course} 
//                   index={index} 
//                   hoveredCourse={hoveredCourse}
//                   setHoveredCourse={setHoveredCourse}
//                   onClick={handleCourseClick}
//                 />
//               ))}
//             </div>
//             {filteredCourses.length === 0 && (
//                 <div className="text-center py-20">
//                     <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
//                         <Search size={32} className="text-slate-400"/>
//                     </div>
//                     <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No courses match your filters</h3>
//                     <p className="text-slate-500 mt-2">Try adjusting your department, level, or search terms.</p>
//                     <button onClick={clearAllFilters} className="mt-6 text-violet-600 font-bold hover:underline">Clear all filters</button>
//                 </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {featuredCourse && <FeaturedHero course={featuredCourse} onClick={handleCourseClick} />}
            
//             {/* Horizontal Category Pills */}
//             <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
//               {categories.map((cat) => (
//                 <button
//                   key={cat.id}
//                   onClick={() => setFilterLevel(cat.id === 'all' ? 'all' : cat.id)}
//                   className={`
//                     flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300
//                     ${(filterLevel === 'all' && cat.id === 'all') || filterLevel === cat.id
//                       ? 'bg-slate-900 dark:bg-violet-600 text-white shadow-lg' 
//                       : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}
//                   `}
//                 >
//                   <cat.icon size={18} />
//                   {cat.label}
//                 </button>
//               ))}
//             </div>
            
//             {/* REPLACED "Trending Now" with "My Assigned Courses" */}
//             {assignedCourses.length > 0 && (
//                 <HorizontalSection 
//                 courses={assignedCourses} 
//                 title="My Assigned Courses" 
//                 subtitle="Continue your specific training path"
//                 icon={CheckCircle}
//                 hoveredCourse={hoveredCourse}
//                 setHoveredCourse={setHoveredCourse}
//                 onCourseClick={handleCourseClick}
//                 />
//             )}
            
//             {/* All Courses Grid */}
//             <div className="pt-8">
//               <div className="flex items-center gap-4 mb-8">
//                 <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-violet-600 dark:to-indigo-600 rounded-2xl">
//                   <BookOpen size={24} className="text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-800 dark:text-white">All Courses</h2>
//                   <p className="text-slate-500 dark:text-slate-400">Browse our complete collection</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredCourses.map((course, index) => (
//                   <ElegantCourseCard 
//                     key={course.id} 
//                     course={course} 
//                     index={index}
//                     hoveredCourse={hoveredCourse}
//                     setHoveredCourse={setHoveredCourse}
//                     onClick={handleCourseClick}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesView;




import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Filter, Search, ChevronRight, Sparkles, TrendingUp, BookOpen, Clock, Users, Star, ArrowRight, Play, Bookmark, GraduationCap, Briefcase, BarChart, CheckCircle, LayoutGrid, List, Table2, ChevronUp, ChevronDown, Eye, Grid3X3, Columns } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { normalizeListResponse } from '../../utils/api';

const API_URL = 'http://127.0.0.1:8000/lms';

interface Course {
  id: number;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  description: string;
  introduction: string;
  tags: string[];
  department?: string; 
  questions: number;
  updated: string;
  created: string;
  is_published: boolean;
  photo?: string;
  stats: {
    accuracy: number;
    completion: number;
    enrolled: number;
    rating: string;
    duration: string;
  };
  roadmap: {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
    sample?: boolean;
    content: string;
    order: number;
  }[];
}

type ViewMode = 'card' | 'list' | 'table';
type CardsPerRow = 2 | 3 | 4 | 5 | 6;
type SortField = 'title' | 'instructor_name' | 'level' | 'duration' | 'rating' | 'enrolled';
type SortDirection = 'asc' | 'desc';

// --- UTILITY COMPONENTS ---

// View Toggle Component
interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const views = [
    { id: 'card' as ViewMode, icon: LayoutGrid, label: 'Cards' },
    { id: 'list' as ViewMode, icon: List, label: 'List' },
    { id: 'table' as ViewMode, icon: Table2, label: 'Table' },
  ];

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => setViewMode(view.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
            ${viewMode === view.id 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
          `}
          title={view.label}
        >
          <view.icon size={18} />
          <span className="hidden md:inline">{view.label}</span>
        </button>
      ))}
    </div>
  );
};

// Cards Per Row Selector
interface CardsPerRowSelectorProps {
  cardsPerRow: CardsPerRow;
  setCardsPerRow: (count: CardsPerRow) => void;
}

const CardsPerRowSelector: React.FC<CardsPerRowSelectorProps> = ({ cardsPerRow, setCardsPerRow }) => {
  const options: CardsPerRow[] = [2, 3, 4, 5, 6];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <Columns size={16} />
        <span className="text-sm font-medium hidden sm:inline">Columns:</span>
      </div>
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
        {options.map((count) => (
          <button
            key={count}
            onClick={() => setCardsPerRow(count)}
            className={`
              w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200
              ${cardsPerRow === count 
                ? 'bg-violet-600 text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}
            `}
            title={`${count} cards per row`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
};

// Get grid classes based on cards per row
const getGridClasses = (cardsPerRow: CardsPerRow): string => {
  const gridMap: Record<CardsPerRow, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  };
  return gridMap[cardsPerRow];
};

// --- VIEW COMPONENTS ---

// 1. Elegant Course Card (unchanged)
interface ElegantCourseCardProps {
  course: Course;
  index: number;
  hoveredCourse: number | null;
  setHoveredCourse: (id: number | null) => void;
  onClick: (id: number) => void;
}

const ElegantCourseCard: React.FC<ElegantCourseCardProps> = ({ course, index, hoveredCourse, setHoveredCourse, onClick }) => {
  const isHovered = hoveredCourse === course.id;
  
  return (
    <div
      onClick={() => onClick(course.id)}
      onMouseEnter={() => setHoveredCourse(course.id)}
      onMouseLeave={() => setHoveredCourse(null)}
      className="group relative cursor-pointer"
      style={{
        animation: `fadeSlideUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      <div className={`
        relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden transition-all duration-500 ease-out border border-transparent dark:border-slate-800
        ${isHovered ? 'shadow-2xl shadow-slate-300/50 dark:shadow-black/50 -translate-y-2' : 'shadow-lg shadow-slate-200/50 dark:shadow-none'}
      `}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {course.photo ? (
            <img 
              src={course.photo} 
              alt={course.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
              <BookOpen size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
          )}
          
          <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="absolute top-4 left-4">
            <span className={`
              px-3 py-1.5 text-xs font-bold rounded-full backdrop-blur-md shadow-sm
              ${course.level === 'Beginner' ? 'bg-emerald-500/90 text-white' : 
                course.level === 'Intermediate' ? 'bg-amber-500/90 text-white' : 
                'bg-rose-500/90 text-white'}
            `}>
              {course.level}
            </span>
          </div>

          {course.department && (
             <div className="absolute top-4 right-4">
               <span className="px-3 py-1.5 bg-black/50 text-white text-xs font-medium rounded-full backdrop-blur-md">
                 {course.department}
               </span>
             </div>
          )}

          <div className={`
            absolute inset-0 flex items-center justify-center transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Play size={24} className="text-slate-800 fill-slate-800 ml-1" />
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {course.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {course.title}
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {course.instructor_name?.charAt(0)}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{course.instructor_name}</span>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{course.stats.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Clock size={14} />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Users size={14} />
              <span className="text-sm">{course.stats.enrolled}</span>
            </div>
          </div>
        </div>
        
        {course.stats.completion > 0 && (
          <div className="px-6 pb-4">
            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${course.stats.completion}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. List View Component
interface ListViewProps {
  courses: Course[];
  onCourseClick: (id: number) => void;
}

const ListView: React.FC<ListViewProps> = ({ courses, onCourseClick }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'Intermediate':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Advanced':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
          <Search size={32} className="text-slate-400"/>
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No courses found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course, index) => (
        <div
          key={course.id}
          onClick={() => onCourseClick(course.id)}
          onMouseEnter={() => setHoveredId(course.id)}
          onMouseLeave={() => setHoveredId(null)}
          className={`
            group flex items-center gap-6 p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 cursor-pointer
            ${hoveredId === course.id 
              ? 'border-violet-400 dark:border-violet-600 shadow-xl shadow-violet-500/10 -translate-y-0.5' 
              : 'border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700'}
          `}
          style={{ animation: `fadeSlideUp 0.4s ease-out ${index * 0.05}s both` }}
        >
          {/* Thumbnail */}
          <div className="relative w-36 h-24 rounded-xl overflow-hidden flex-shrink-0">
            {course.photo ? (
              <img 
                src={course.photo} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <BookOpen size={28} className="text-white/50" />
              </div>
            )}
            <div className={`
              absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300
              ${hoveredId === course.id ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Play size={16} className="text-slate-800 fill-slate-800 ml-0.5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getLevelBadgeClass(course.level)}`}>
                    {course.level}
                  </span>
                  {course.department && (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {course.department}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {course.description || course.introduction}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {course.instructor_name?.charAt(0)}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">{course.instructor_name}</span>
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{course.stats.rating}</span>
              </div>
              
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
              
              <div className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Users size={14} />
                <span>{course.stats.enrolled.toLocaleString()}</span>
              </div>
              
              {course.stats.completion > 0 && (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${course.stats.completion === 100 ? 'bg-emerald-500' : 'bg-violet-500'}`}
                      style={{ width: `${course.stats.completion}%` }} 
                    />
                  </div>
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{course.stats.completion}%</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {course.tags.slice(0, 4).map((tag, idx) => (
                <span key={idx} className="text-xs text-violet-600 dark:text-violet-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0">
            <ArrowRight 
              size={24} 
              className={`
                transition-all duration-300
                ${hoveredId === course.id 
                  ? 'text-violet-500 translate-x-1' 
                  : 'text-slate-300 dark:text-slate-600'}
              `}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Table View Component
interface TableViewProps {
  courses: Course[];
  onCourseClick: (id: number) => void;
}

const TableView: React.FC<TableViewProps> = ({ courses, onCourseClick }) => {
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'instructor_name':
          aValue = a.instructor_name.toLowerCase();
          bValue = b.instructor_name.toLowerCase();
          break;
        case 'level':
          const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          aValue = levelOrder[a.level as keyof typeof levelOrder] || 0;
          bValue = levelOrder[b.level as keyof typeof levelOrder] || 0;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'rating':
          aValue = parseFloat(a.stats.rating) || 0;
          bValue = parseFloat(b.stats.rating) || 0;
          break;
        case 'enrolled':
          aValue = a.stats.enrolled;
          bValue = b.stats.enrolled;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [courses, sortField, sortDirection]);

  const SortHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({ field, label, className = '' }) => (
    <th 
      className={`px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col">
          <ChevronUp 
            size={12} 
            className={`${sortField === field && sortDirection === 'asc' ? 'text-violet-600' : 'text-slate-300 dark:text-slate-600'}`} 
          />
          <ChevronDown 
            size={12} 
            className={`-mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-violet-600' : 'text-slate-300 dark:text-slate-600'}`} 
          />
        </div>
      </div>
    </th>
  );

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'Intermediate':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'Advanced':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
          <Search size={32} className="text-slate-400"/>
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No courses found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">
                #
              </th>
              <SortHeader field="title" label="Course" className="min-w-[280px]" />
              <SortHeader field="instructor_name" label="Instructor" />
              <SortHeader field="level" label="Level" />
              <SortHeader field="duration" label="Duration" />
              <SortHeader field="rating" label="Rating" />
              <SortHeader field="enrolled" label="Enrolled" />
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-20">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedCourses.map((course, index) => (
              <tr 
                key={course.id}
                className={`
                  transition-all duration-200 cursor-pointer
                  ${hoveredRow === course.id 
                    ? 'bg-violet-50 dark:bg-violet-900/10' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
                onMouseEnter={() => setHoveredRow(course.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onCourseClick(course.id)}
              >
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      {course.photo ? (
                        <img 
                          src={course.photo} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                          <BookOpen size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[220px]">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {course.department && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {course.department}
                          </span>
                        )}
                        {course.tags.slice(0, 1).map((tag, idx) => (
                          <span key={idx} className="text-xs text-violet-600 dark:text-violet-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {course.instructor_name?.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
                      {course.instructor_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getLevelBadgeClass(course.level)}`}>
                    {course.level}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-sm">{course.duration}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {course.stats.rating}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users size={14} className="text-slate-400" />
                    <span className="text-sm">{course.stats.enrolled.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="w-20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {course.stats.completion}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.stats.completion === 100 
                            ? 'bg-emerald-500' 
                            : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                        }`}
                        style={{ width: `${course.stats.completion}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCourseClick(course.id);
                    }}
                    className="flex items-center justify-center w-9 h-9 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-800/50 text-violet-600 dark:text-violet-400 rounded-xl transition-all duration-200"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>Click column headers to sort • Click row to view details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Featured Hero (unchanged)
const FeaturedHero = ({ course, onClick }: { course: Course, onClick: (id: number) => void }) => {
  if (!course) return null;
  
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:border dark:border-slate-800 p-1 mb-12 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-cyan-600/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-[1.8rem] p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/25">
              <Star size={12} className="fill-white" />
              FEATURED
            </span>
            <span className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
              {course.level}
            </span>
            {course.department && (
               <span className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm">
                 {course.department}
               </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {course.title}
          </h1>
          
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            {course.description?.slice(0, 150)}...
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {course.instructor_name?.charAt(0)}
              </div>
              <span className="text-white font-medium">{course.instructor_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{course.stats.enrolled.toLocaleString()} enrolled</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => onClick(course.id)}
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center gap-3"
            >
              <Play size={20} className="fill-white" />
              Start Learning
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all duration-300">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative w-full lg:w-96 h-64 lg:h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 rounded-2xl" />
          {course.photo ? (
            <img 
              src={course.photo} 
              alt={course.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <GraduationCap size={80} className="text-white/20" />
            </div>
          )}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 w-max">
            <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800 dark:text-slate-100">{course.stats.rating}</span>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl px-6 py-3 shadow-xl flex items-center gap-2 border border-slate-100 dark:border-slate-700">
              <TrendingUp size={18} className="text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-100">{course.stats.completion}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Horizontal Section - Updated with all view modes
interface HorizontalSectionProps {
  courses: Course[];
  title: string;
  subtitle: string;
  icon: React.ElementType;
  hoveredCourse: number | null;
  setHoveredCourse: (id: number | null) => void;
  onCourseClick: (id: number) => void;
  viewMode: ViewMode;
  cardsPerRow: CardsPerRow;
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({ 
  courses, title, subtitle, icon: Icon, hoveredCourse, setHoveredCourse, onCourseClick, viewMode, cardsPerRow
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/25">
            <Icon size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
          </div>
        </div>
        
        {viewMode === 'card' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      {viewMode === 'card' && (
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth -mx-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {courses.map((course, index) => (
            <div key={course.id} className="flex-shrink-0 w-80">
              <ElegantCourseCard 
                course={course} 
                index={index} 
                hoveredCourse={hoveredCourse}
                setHoveredCourse={setHoveredCourse}
                onClick={onCourseClick}
              />
            </div>
          ))}
        </div>
      )}
      
      {viewMode === 'list' && (
        <ListView courses={courses} onCourseClick={onCourseClick} />
      )}
      
      {viewMode === 'table' && (
        <TableView courses={courses} onCourseClick={onCourseClick} />
      )}
    </div>
  );
};


// --- MAIN COMPONENT ---

const CoursesView = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // View Mode State
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [cardsPerRow, setCardsPerRow] = useState<CardsPerRow>(3);
  
  // Filtering States
  const [search, setSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Filters
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const coursesResponse = await fetch(`${API_URL}/courses/`);
        if (!coursesResponse.ok) throw new Error(`HTTP error! status: ${coursesResponse.status}`);
        const coursesData = normalizeListResponse<Course>(await coursesResponse.json());
        setCourses(coursesData);
        
        const allTags: string[] = coursesData.flatMap((course: Course) => course.tags);
        const uniqueTags: string[] = Array.from(new Set(allTags));
        setAvailableTags(uniqueTags);

        let token = null;
        try {
            const authData = localStorage.getItem('auth');
            if(authData) token = JSON.parse(authData).accessToken;
        } catch (e) { console.log("No auth token found"); }

        if (token) {
            const assignedResponse = await fetch(`${API_URL}/assignments/my-courses/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (assignedResponse.ok) {
                const assignedData = normalizeListResponse<any>(await assignedResponse.json());
                const normalizedAssigned = assignedData.map((item: any) => item.course ? item.course : item);
                setAssignedCourses(normalizedAssigned);
            }
        }

      } catch (err) {
        setError('Failed to fetch courses. Please check your backend connection.');
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTag = (tag: string) => {
    if (filterTags.includes(tag)) {
        setFilterTags(prev => prev.filter(t => t !== tag));
    } else {
        setFilterTags(prev => [...prev, tag]);
    }
    setTagSearch('');
  };

  const clearAllFilters = () => {
      setFilterTags([]);
      setFilterDepartment('all');
      setFilterLevel('all');
      setSearch('');
  };

  const uniqueDepartments = useMemo(() => {
      const depts = courses.map(c => c.department).filter(Boolean) as string[];
      return Array.from(new Set(depts));
  }, [courses]);

  const uniqueLevels = useMemo(() => {
      const levels = courses.map(c => c.level).filter(Boolean);
      return Array.from(new Set(levels));
  }, [courses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesTags = filterTags.length === 0 || filterTags.some(t => course.tags.includes(t));
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesTags && matchesDepartment && matchesLevel;
  });

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase()) && !filterTags.includes(tag)
  );

  const handleCourseClick = (courseId: number) => navigate(`/lms/courses/${courseId}`);

  const featuredCourse = [...courses].sort((a, b) => b.stats.enrolled - a.stats.enrolled)[0];
  
  const isSearching = search.trim() !== '' || filterTags.length > 0 || filterDepartment !== 'all' || filterLevel !== 'all';

  const categories = [
    { id: 'all', label: 'All Courses', icon: BookOpen },
    { id: 'Beginner', label: 'Beginner', icon: Sparkles },
    { id: 'Intermediate', label: 'Intermediate', icon: TrendingUp },
    { id: 'Advanced', label: 'Advanced', icon: GraduationCap },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap size={40} className="text-white" />
        </div>
      </div>
      <div className="mt-8 space-y-2 text-center">
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">Loading your courses</p>
        <p className="text-slate-400 dark:text-slate-500">Preparing your learning experience...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <X size={32} className="text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Connection Error</h2>
        <p className="text-slate-500 dark:text-slate-400">{error}</p>
      </div>
    </div>
  );

  const activeFiltersCount = (filterDepartment !== 'all' ? 1 : 0) + (filterLevel !== 'all' ? 1 : 0) + filterTags.length;

  // Render courses based on view mode
  const renderCourses = (coursesToRender: Course[]) => {
    switch (viewMode) {
      case 'card':
        return (
          <div className={`grid ${getGridClasses(cardsPerRow)} gap-6`}>
            {coursesToRender.map((course, index) => (
              <ElegantCourseCard 
                key={course.id} 
                course={course} 
                index={index} 
                hoveredCourse={hoveredCourse}
                setHoveredCourse={setHoveredCourse}
                onClick={handleCourseClick}
              />
            ))}
          </div>
        );
      case 'list':
        return <ListView courses={coursesToRender} onCourseClick={handleCourseClick} />;
      case 'table':
        return <TableView courses={coursesToRender} onCourseClick={handleCourseClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full px-6 py-4">
          {/* First Row: Search, View Toggle, Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for courses..."
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 focus:bg-white dark:focus:bg-slate-800 border-2 border-transparent focus:border-violet-500 dark:focus:border-violet-500 rounded-2xl pl-12 pr-6 py-3.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300"
              />
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
            
            {/* View Toggle */}
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            
            {/* Cards Per Row Selector - Only show in card view */}
            {viewMode === 'card' && (
              <CardsPerRowSelector cardsPerRow={cardsPerRow} setCardsPerRow={setCardsPerRow} />
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className={`
                  flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300
                  ${activeFiltersCount > 0 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}
                `}
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-violet-600 w-5 h-5 flex items-center justify-center text-xs rounded-full font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {showTagDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Briefcase size={14} className="text-violet-500"/> Department
                    </label>
                    <select 
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-violet-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All Departments</option>
                      {uniqueDepartments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BarChart size={14} className="text-emerald-500"/> Difficulty Level
                    </label>
                    <select 
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:border-violet-500 focus:outline-none transition-colors"
                    >
                      <option value="all">All Levels</option>
                      {uniqueLevels.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Filter by Tags</label>
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Search tags..."
                      className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 dark:placeholder-slate-500"
                    />
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto p-3">
                    <div className="flex flex-wrap gap-2">
                      {filteredTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 text-slate-600 dark:text-slate-300 text-xs rounded-lg transition-all duration-200 font-medium border border-slate-100 dark:border-slate-700"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Active Filters Row */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {filterDepartment !== 'all' && (
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in">
                  Dept: {filterDepartment}
                  <button onClick={() => setFilterDepartment('all')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </span>
              )}

              {filterLevel !== 'all' && (
                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in">
                  Level: {filterLevel}
                  <button onClick={() => setFilterLevel('all')} className="hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </span>
              )}

              {filterTags.map((tag) => (
                <span 
                  key={tag}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium whitespace-nowrap animate-in fade-in zoom-in"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5">
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              <button 
                onClick={clearAllFilters}
                className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 text-sm font-medium whitespace-nowrap ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        {isSearching ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Search Results</h1>
                <p className="text-slate-500 dark:text-slate-400">{filteredCourses.length} courses found</p>
              </div>
            </div>
            
            {renderCourses(filteredCourses)}
            
            {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                        <Search size={32} className="text-slate-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No courses match your filters</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your department, level, or search terms.</p>
                    <button onClick={clearAllFilters} className="mt-6 text-violet-600 font-bold hover:underline">Clear all filters</button>
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {featuredCourse && <FeaturedHero course={featuredCourse} onClick={handleCourseClick} />}
            
            {/* Horizontal Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterLevel(cat.id === 'all' ? 'all' : cat.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300
                    ${(filterLevel === 'all' && cat.id === 'all') || filterLevel === cat.id
                      ? 'bg-slate-900 dark:bg-violet-600 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}
                  `}
                >
                  <cat.icon size={18} />
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* My Assigned Courses */}
            {assignedCourses.length > 0 && (
                <HorizontalSection 
                  courses={assignedCourses} 
                  title="My Assigned Courses" 
                  subtitle="Continue your specific training path"
                  icon={CheckCircle}
                  hoveredCourse={hoveredCourse}
                  setHoveredCourse={setHoveredCourse}
                  onCourseClick={handleCourseClick}
                  viewMode={viewMode}
                  cardsPerRow={cardsPerRow}
                />
            )}
            
            {/* All Courses */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-violet-600 dark:to-indigo-600 rounded-2xl">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">All Courses</h2>
                    <p className="text-slate-500 dark:text-slate-400">Browse our complete collection ({filteredCourses.length} courses)</p>
                  </div>
                </div>
              </div>
              
              {renderCourses(filteredCourses)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
