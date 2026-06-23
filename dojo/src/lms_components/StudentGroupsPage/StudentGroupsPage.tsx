


// import React, { useEffect, useState, useMemo } from 'react';
// import { 
//   Plus, Search, MoreVertical, Users, BookOpen, Edit, Trash2, 
//   MessageCircle, Calendar, GraduationCap, Filter, SlidersHorizontal, 
//   ChevronDown, RotateCcw, UserCheck, Sparkles, ArrowRight
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../store/store'; 

// // --- Interfaces ---
// interface UserUI {
//   id: number | string;
//   name: string;
//   role: 'Team Leader' | 'Employee';
//   avatar: string;
//   email?: string | null;
//   profileImage?: string | null;
// }

// interface CourseUI {
//   id: number | string;
//   name: string;
//   description?: string | null;
// }

// interface GroupUI {
//   id: number | string;
//   name: string;
//   teachers: UserUI[];
//   students: UserUI[];
//   assignedCourses: CourseUI[];
//   createdAt: Date;
//   unreadCount?: number; 
//   lastMessage?: string;
//   lastMessageTime?: string;
// }

// const getFullImageUrl = (path?: string | null) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `http://127.0.0.1:8000${path}`; 
// };

// const StudentGroupsListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
  
//   const isAdmin = user?.role === 'admin';
//   const isTeamLead = user?.role === 'team-leader';
//   const canManage = isAdmin || isTeamLead;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [groups, setGroups] = useState<GroupUI[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [filterCourse, setFilterCourse] = useState<string>('all');
//   const [filterLeader, setFilterLeader] = useState<string>('all');

//   useEffect(() => {
//     let mounted = true;
//     const fetchGroups = async () => {
//       setLoading(true);
//       try {
//         const headers: Record<string, string> = { 'Content-Type': 'application/json' };
//         if (token) headers.Authorization = `Bearer ${token}`;

//         const resp = await fetch('http://127.0.0.1:8000/lms/groups/', { method: 'GET', headers });
//         if (!resp.ok) throw new Error(`Failed to load groups`);

//         const json = await resp.json();
//         if (!mounted) return;

//         const mapped: GroupUI[] = (Array.isArray(json) ? json : []).map((g: any, idx: number) => {
//           const mapUser = (u: any, role: 'Team Leader' | 'Employee'): UserUI => ({
//               id: u?.id ?? idx,
//               name: `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || u?.email || 'User',
//               role,
//               avatar: (u?.firstName?.[0] || 'U').toUpperCase(),
//               email: u?.email,
//               profileImage: u?.profileImage || null, 
//           });

//           return {
//             id: g.id ?? idx,
//             name: g.name ?? 'Untitled Group',
//             teachers: (g.team_leaders || []).map((u: any) => mapUser(u, 'Team Leader')),
//             students: (g.employees || []).map((u: any) => mapUser(u, 'Employee')),
//             assignedCourses: g.course_title 
//                 ? [{ id: g.course, name: g.course_title }] 
//                 : [{ id: 0, name: 'No Course Assigned' }],
//             createdAt: g.created_at ? new Date(g.created_at) : new Date(),
//             unreadCount: 0,
//             lastMessage: "Tap here to open the group chat...",
//             lastMessageTime: ""
//           } as GroupUI;
//         });
//         setGroups(mapped);
//       } catch (err) { console.error(err); } finally { if (mounted) setLoading(false); }
//     };
//     fetchGroups();
//     return () => { mounted = false; };
//   }, [token]);

//   const uniqueCourses = useMemo(() => {
//     const allCourses = groups.flatMap(g => g.assignedCourses.map(c => c.name));
//     return Array.from(new Set(allCourses)).sort();
//   }, [groups]);

//   const uniqueLeaders = useMemo(() => {
//     const allLeaders = groups.flatMap(g => g.teachers.map(t => t.name));
//     return Array.from(new Set(allLeaders)).sort();
//   }, [groups]);

//   const filteredGroups = groups.filter(group => {
//     const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const groupCourseName = group.assignedCourses[0]?.name || 'No Course Assigned';
//     const matchesCourse = filterCourse === 'all' || groupCourseName === filterCourse;
//     const matchesLeader = filterLeader === 'all' || group.teachers.some(t => t.name === filterLeader);
//     return matchesSearch && matchesCourse && matchesLeader;
//   });

//   const resetFilters = () => {
//     setFilterCourse('all');
//     setFilterLeader('all');
//     setSearchTerm('');
//   };

//   const handleDeleteGroup = async (groupId: string | number) => {
//     if (!isAdmin) return alert("Only Admins can delete groups.");
//     if (window.confirm("Are you sure?")) {
//       try {
//         const resp = await fetch(`http://127.0.0.1:8000/lms/groups/${groupId}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
//         if(resp.ok) setGroups(prev => prev.filter(g => String(g.id) !== String(groupId)));
//       } catch(e) { alert("Network error"); }
//     }
//   };

//   const activeFiltersCount = (filterCourse !== 'all' ? 1 : 0) + (filterLeader !== 'all' ? 1 : 0);

//   return (
//     <div 
//       className="min-h-screen font-sans pb-8 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 transition-colors duration-500"
//       onClick={() => setFilterOpen(false)}
//     >
//       {/* Subtle Background Accents */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/3 -right-32 w-56 h-56 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
//         {/* Compact Header */}
//         <div className="py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
//                 <Users size={22} className="text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
//                   Employee Groups
//                 </h1>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                   {groups.length} groups total
//                 </p>
//               </div>
//             </div>

//             {isAdmin && (
//               <button
//                 onClick={() => navigate('/lms/groups/create')}
//                 className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-200 dark:shadow-violet-900/30 transition-all duration-300 hover:scale-[1.02]"
//               >
//                 <Plus size={18} />
//                 <span>Create Group</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search & Filter Bar */}
//         <div className="flex flex-col sm:flex-row gap-3 mb-5">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
//             <input
//               type="text"
//               placeholder="Search groups..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
//             />
//           </div>

//           <div className="relative" onClick={(e) => e.stopPropagation()}>
//             <button 
//               onClick={() => setFilterOpen(!filterOpen)}
//               className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
//                 filterOpen 
//                   ? 'bg-violet-600 text-white border-violet-600' 
//                   : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
//               }`}
//             >
//               <SlidersHorizontal size={18} />
//               <span className="hidden sm:inline">Filters</span>
//               {activeFiltersCount > 0 && (
//                 <span className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-500 text-white text-xs font-bold">
//                   {activeFiltersCount}
//                 </span>
//               )}
//               <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {filterOpen && (
//               <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
//                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
//                   <h4 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
//                     <Filter size={16} className="text-violet-500"/>
//                     Filters
//                   </h4>
//                   {(filterCourse !== 'all' || filterLeader !== 'all') && (
//                     <button 
//                       onClick={resetFilters}
//                       className="text-xs font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1"
//                     >
//                       <RotateCcw size={12} /> Reset
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
//                       Course
//                     </label>
//                     <select 
//                       value={filterCourse}
//                       onChange={(e) => setFilterCourse(e.target.value)}
//                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500 transition-colors cursor-pointer"
//                     >
//                       <option value="all">All Courses</option>
//                       {uniqueCourses.map(c => (
//                         <option key={c} value={c}>{c}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5 block">
//                       Team Leader
//                     </label>
//                     <select 
//                       value={filterLeader}
//                       onChange={(e) => setFilterLeader(e.target.value)}
//                       className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500 transition-colors cursor-pointer"
//                     >
//                       <option value="all">All Team Leaders</option>
//                       {uniqueLeaders.map(l => (
//                         <option key={l} value={l}>{l}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[1,2,3,4,5,6].map(i => (
//               <div key={i} className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-64 animate-pulse">
//                 <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-t-2xl"></div>
//                 <div className="p-4 space-y-3">
//                   <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
//                   <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2"></div>
//                   <div className="h-20 bg-slate-100 dark:bg-slate-700/50 rounded-xl mt-4"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredGroups.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredGroups.map((group, idx) => (
//               <GroupCard
//                 key={`${group.id}-${idx}`}
//                 group={group}
//                 onEdit={() => navigate(`/lms/groups/create/${group.id}`)}
//                 onChat={() => navigate(`/lms/groups/view/${group.id}`)}
//                 onDelete={(id) => handleDeleteGroup(id)}
//                 isAdmin={isAdmin}
//                 isTeamLead={isTeamLead}
//                 index={idx}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
//             <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-full mb-4">
//               <Users className="h-10 w-10 text-slate-400 dark:text-slate-500" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Groups Found</h3>
//             <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
//               No groups match your search criteria. Try adjusting your filters.
//             </p>
//             {(filterCourse !== 'all' || filterLeader !== 'all' || searchTerm) && (
//               <button 
//                 onClick={resetFilters}
//                 className="px-5 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2"
//               >
//                 <RotateCcw size={16} />
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- AVATAR COMPONENT ---
// const MemberAvatar: React.FC<{ user: UserUI; gradient: string }> = ({ user, gradient }) => {
//   const imageUrl = getFullImageUrl(user.profileImage);
//   return (
//     <div className="relative group/avatar cursor-pointer transition-all duration-200 hover:z-20 hover:scale-110">
//       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white dark:border-slate-800 shadow-sm ${gradient} overflow-hidden`}>
//         {imageUrl ? (
//           <img src={imageUrl} alt={user.name} className="w-full h-full object-cover" />
//         ) : (
//           user.avatar
//         )}
//       </div>
//       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-max max-w-[140px] bg-slate-900 text-white text-xs font-medium rounded-lg py-1.5 px-2.5 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-150 pointer-events-none z-30 shadow-lg">
//         {user.name}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
//       </div>
//     </div>
//   );
// };

// // --- GROUP CARD COMPONENT ---
// interface GroupCardProps {
//   group: GroupUI;
//   onEdit: () => void;
//   onChat: () => void;
//   onDelete: (groupId: string | number) => void;
//   isAdmin: boolean;
//   isTeamLead: boolean;
//   index: number;
// }

// const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onChat, onDelete, isAdmin, isTeamLead, index }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const hasUnread = (group.unreadCount || 0) > 0;

//   const cardGradients = [
//     'from-violet-500 to-purple-600',
//     'from-cyan-500 to-blue-600',
//     'from-amber-500 to-orange-600',
//     'from-emerald-500 to-teal-600',
//     'from-rose-500 to-pink-600',
//     'from-indigo-500 to-blue-600',
//   ];
//   const gradientClass = cardGradients[index % cardGradients.length];

//   return (
//     <div className="group/card bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
//       {/* Color Bar */}
//       <div className={`h-1.5 bg-gradient-to-r ${gradientClass}`}></div>
      
//       <div className="p-4 flex-1">
//         {/* Header */}
//         <div className="flex justify-between items-start mb-3">
//           <div className="flex-1 min-w-0 pr-2">
//             <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover/card:text-violet-600 dark:group-hover/card:text-violet-400 transition-colors">
//               {group.name}
//             </h3>
//             <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 dark:text-slate-500">
//               <Calendar size={11} />
//               <span>{new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
//             </div>
//           </div>
          
//           {(isAdmin || isTeamLead) && (
//             <div className="relative">
//               <button 
//                 onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }} 
//                 className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//               >
//                 <MoreVertical size={16} />
//               </button>
//               {showDropdown && (
//                 <div 
//                   onMouseLeave={() => setShowDropdown(false)} 
//                   className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-150"
//                 >
//                   <button 
//                     onClick={(e) => { e.stopPropagation(); onEdit(); }} 
//                     className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
//                   >
//                     <Edit size={14} className="text-blue-500" />
//                     {isTeamLead ? 'Assign Courses' : 'Edit Group'}
//                   </button>
//                   {isAdmin && (
//                     <button 
//                       onClick={(e) => { e.stopPropagation(); onDelete(group.id); }} 
//                       className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
//                     >
//                       <Trash2 size={14} />
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Course Badge */}
//         <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${gradientClass} mb-3`}>
//           <BookOpen size={12} className="text-white/80" />
//           <span className="text-xs font-semibold text-white truncate max-w-[180px]">
//             {group.assignedCourses[0]?.name || "No Course"}
//           </span>
//         </div>

//         {/* Members Section */}
//         <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
//           {/* Team Leaders */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1.5">
//               <UserCheck size={12} className="text-blue-500" />
//               <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Leaders</span>
//             </div>
//             <div className="flex -space-x-2"> 
//               {group.teachers.length > 0 ? (
//                 group.teachers.slice(0, 3).map((teacher, i) => (
//                   <MemberAvatar key={i} user={teacher} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
//                 ))
//               ) : (
//                 <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None</span>
//               )}
//             </div>
//           </div>
          
//           {/* Employees */}
//           <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/50">
//             <div className="flex items-center gap-1.5">
//               <GraduationCap size={12} className="text-emerald-500" />
//               <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Employees</span>
//               {group.students.length > 0 && (
//                 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
//                   {group.students.length}
//                 </span>
//               )}
//             </div>
//             <div className="flex -space-x-2">
//               {group.students.slice(0, 4).map((student, i) => (
//                 <MemberAvatar key={i} user={student} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
//               ))}
//               {group.students.length > 4 && (
//                 <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 text-[10px] font-bold border-2 border-white dark:border-slate-800">
//                   +{group.students.length - 4}
//                 </div>
//               )}
//               {group.students.length === 0 && (
//                 <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Footer */}
//       <div 
//         onClick={onChat}
//         className={`bg-gradient-to-r ${gradientClass} px-4 py-3 cursor-pointer transition-all duration-200 group/chat hover:brightness-110`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex-1 min-w-0 pr-2">
//             <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wide flex items-center gap-1">
//               <Sparkles size={10} /> Discussion
//             </span>
//             <p className="text-xs text-white/90 truncate mt-0.5">
//               {group.lastMessage || "Tap to start chatting..."}
//             </p>
//           </div>

//           <div className="relative flex-shrink-0">
//             <div className="w-9 h-9 rounded-xl bg-white/20 group-hover/chat:bg-white group-hover/chat:text-violet-600 flex items-center justify-center text-white transition-all duration-200">
//               <MessageCircle size={18} />
//             </div>
//             {hasUnread && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white">
//                 {group.unreadCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentGroupsListPage;




import React, { useEffect, useState, useMemo, useRef } from 'react';
import { 
  Plus, Search, MoreVertical, Users, BookOpen, Edit, Trash2, 
  MessageCircle, Calendar, GraduationCap, 
  RotateCcw, UserCheck, X, Mail, Grid3X3, List, ChevronDown,
  ArrowUpDown, Eye, TrendingUp, Clock, Star, Sparkles, 
  ChevronRight, User, Building2, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store'; 

// --- Interfaces ---
interface UserUI {
  id: number | string;
  name: string;
  role: 'Team Leader' | 'Employee';
  avatar: string;
  email?: string | null;
  profileImage?: string | null;
}

interface CourseUI {
  id: number | string;
  name: string;
  description?: string | null;
}

interface GroupUI {
  id: number | string;
  name: string;
  teachers: UserUI[];
  students: UserUI[];
  assignedCourses: CourseUI[];
  createdAt: Date;
  unreadCount?: number; 
  lastMessage?: string;
  lastMessageTime?: string;
}

const getFullImageUrl = (path?: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`; 
};

// --- ENHANCED MODAL COMPONENT ---
const MembersModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  groupName: string; 
  leaders: UserUI[]; 
  employees: UserUI[];
  courseName?: string;
}> = ({ isOpen, onClose, groupName, leaders, employees, courseName }) => {
  const [searchMember, setSearchMember] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'leaders' | 'employees'>('all');
  
  if (!isOpen) return null;

  const filteredLeaders = leaders.filter(l => 
    l.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchMember.toLowerCase())
  );
  
  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
      >
        {/* Modal Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          
          <div className="relative px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{groupName}</h3>
                </div>
                {courseName && (
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen size={14} />
                    <span className="text-sm">{courseName}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{leaders.length}</p>
                  <p className="text-xs text-white/70">Leaders</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{employees.length}</p>
                  <p className="text-xs text-white/70">Employees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search members..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              {(['all', 'leaders', 'employees'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-violet-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="p-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {/* Leaders Section */}
          {(activeTab === 'all' || activeTab === 'leaders') && filteredLeaders.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                  <UserCheck size={16} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Team Leaders</h4>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                  {filteredLeaders.length}
                </span>
              </div>
              <div className="grid gap-3">
                {filteredLeaders.map((u) => (
                  <div 
                    key={u.id} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                      {u.profileImage ? (
                        <img src={getFullImageUrl(u.profileImage)!} className="w-full h-full object-cover" alt={u.name} />
                      ) : (
                        u.avatar
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail size={12} className="text-slate-400" />
                        <p className="text-sm text-slate-500 truncate">{u.email || 'No email provided'}</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg">
                      Leader
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employees Section */}
          {(activeTab === 'all' || activeTab === 'employees') && filteredEmployees.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Employees</h4>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                  {filteredEmployees.length}
                </span>
              </div>
              <div className="grid gap-3">
                {filteredEmployees.map((u) => (
                  <div 
                    key={u.id} 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                      {u.profileImage ? (
                        <img src={getFullImageUrl(u.profileImage)!} className="w-full h-full object-cover" alt={u.name} />
                      ) : (
                        u.avatar
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-xs text-slate-500 truncate">{u.email || 'No email provided'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLeaders.length === 0 && filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No members found</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

// --- STATS CARD COMPONENT ---
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: string;
  gradient: string;
}> = ({ icon, label, value, trend, gradient }) => (
  <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-all duration-300 group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
    <div className="relative">
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-2 text-emerald-500">
          <TrendingUp size={14} />
          <span className="text-xs font-medium">{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const StudentGroupsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken: token, user } = useSelector((state: RootState) => state.auth);
  
  const isAdmin = user?.role === 'admin';
  const isTeamLead = user?.role === 'team-leader';

  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState<GroupUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterLeader, setFilterLeader] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'members'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(true);

  // Modal State
  const [modalData, setModalData] = useState<{isOpen: boolean, group?: GroupUI}>({ isOpen: false });

  useEffect(() => {
    let mounted = true;
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const resp = await fetch('http://127.0.0.1:8000/lms/groups/', { method: 'GET', headers });
        const json = await resp.json();
        if (!mounted) return;

        const mapped: GroupUI[] = (Array.isArray(json) ? json : []).map((g: any, idx: number) => {
          const mapUser = (u: any, role: 'Team Leader' | 'Employee'): UserUI => ({
              id: u?.id ?? Math.random(),
              name: `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || u?.email || 'User',
              role,
              avatar: (u?.firstName?.[0] || 'U').toUpperCase(),
              email: u?.email,
              profileImage: u?.profileImage || null, 
          });

          return {
            id: g.id ?? idx,
            name: g.name ?? 'Untitled Group',
            teachers: (g.team_leaders || []).map((u: any) => mapUser(u, 'Team Leader')),
            students: (g.employees || []).map((u: any) => mapUser(u, 'Employee')),
            assignedCourses: g.course_title ? [{ id: g.course, name: g.course_title }] : [{ id: 0, name: 'No Course Assigned' }],
            createdAt: g.created_at ? new Date(g.created_at) : new Date(),
            unreadCount: 0,
            lastMessage: "Tap here to open the group chat...",
            lastMessageTime: ""
          } as GroupUI;
        });
        setGroups(mapped);
      } catch (err) { console.error(err); } finally { if (mounted) setLoading(false); }
    };
    fetchGroups();
    return () => { mounted = false; };
  }, [token]);

  const uniqueCourses = useMemo(() => {
    const allCourses = groups.flatMap(g => g.assignedCourses.map(c => c.name));
    return Array.from(new Set(allCourses)).sort();
  }, [groups]);

  const uniqueLeaders = useMemo(() => {
    const allLeaders = groups.flatMap(g => g.teachers.map(t => t.name));
    return Array.from(new Set(allLeaders)).sort();
  }, [groups]);

  const filteredAndSortedGroups = useMemo(() => {
    let result = groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
      const groupCourseName = group.assignedCourses[0]?.name || 'No Course Assigned';
      const matchesCourse = filterCourse === 'all' || groupCourseName === filterCourse;
      const matchesLeader = filterLeader === 'all' || group.teachers.some(t => t.name === filterLeader);
      return matchesSearch && matchesCourse && matchesLeader;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'members':
          comparison = (a.students.length + a.teachers.length) - (b.students.length + b.teachers.length);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [groups, searchTerm, filterCourse, filterLeader, sortBy, sortOrder]);

  const resetFilters = () => {
    setFilterCourse('all');
    setFilterLeader('all');
    setSearchTerm('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const handleDeleteGroup = async (groupId: string | number) => {
    if (!isAdmin) return alert("Only Admins can delete groups.");
    if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      try {
        const resp = await fetch(`http://127.0.0.1:8000/lms/groups/${groupId}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if(resp.ok) setGroups(prev => prev.filter(g => String(g.id) !== String(groupId)));
      } catch(e) { alert("Network error"); }
    }
  };

  const totalMembers = useMemo(() => {
    return groups.reduce((acc, g) => acc + g.teachers.length + g.students.length, 0);
  }, [groups]);

  const totalCourses = useMemo(() => {
    return new Set(groups.flatMap(g => g.assignedCourses.filter(c => c.name !== 'No Course Assigned').map(c => c.name))).size;
  }, [groups]);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTYgNmgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-12">
        
        {/* Header Section */}
        <div className="pt-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl">
                  <Users size={32} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Employee Groups
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" />
                  Manage and organize your team efficiently
                </p>
              </div>
            </div>

            {isAdmin && (
              <button 
                onClick={() => navigate('/lms/groups/create')} 
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-violet-500/25 transition-all duration-300 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Plus size={22} className="relative" />
                <span className="relative text-lg">Create New Group</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Layers className="w-6 h-6 text-white" />}
            label="Total Groups"
            value={groups.length}
            gradient="from-violet-500 to-purple-600"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-white" />}
            label="Total Members"
            value={totalMembers}
            gradient="from-blue-500 to-cyan-600"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            label="Active Courses"
            value={totalCourses}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<UserCheck className="w-6 h-6 text-white" />}
            label="Team Leaders"
            value={uniqueLeaders.length}
            gradient="from-amber-500 to-orange-600"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                Search Groups
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Type to search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-base"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="min-w-[200px]">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                  Filter by Course
                </label>
                <div className="relative">
                  <select 
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full appearance-none px-4 py-4 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="all">All Courses</option>
                    {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="min-w-[200px]">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                  Filter by Leader
                </label>
                <div className="relative">
                  <select 
                    value={filterLeader}
                    onChange={(e) => setFilterLeader(e.target.value)}
                    className="w-full appearance-none px-4 py-4 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="all">All Leaders</option>
                    {uniqueLeaders.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="min-w-[180px]">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                  Sort By
                </label>
                <div className="relative">
                  <select 
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [by, order] = e.target.value.split('-');
                      setSortBy(by as any);
                      setSortOrder(order as any);
                    }}
                    className="w-full appearance-none px-4 py-4 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="members-desc">Most Members</option>
                    <option value="members-asc">Least Members</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium">{filteredAndSortedGroups.length}</span>
              <span>groups found</span>
              {(searchTerm || filterCourse !== 'all' || filterLeader !== 'all') && (
                <span className="text-violet-500">• Filters active</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={resetFilters} 
                className="flex items-center gap-2 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-medium"
              >
                <RotateCcw size={16} />
                <span>Reset All</span>
              </button>

              {/* View Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Grid3X3 size={18} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-4"}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div 
                key={i} 
                className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden ${
                  viewMode === 'grid' ? 'h-80' : 'h-24'
                }`}
              >
                <div className="animate-pulse h-full">
                  {viewMode === 'grid' ? (
                    <>
                      <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                        <div className="h-20 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-1/4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedGroups.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full blur-2xl opacity-20" />
              <div className="relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                <Users className="w-16 h-16 text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Groups Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {searchTerm || filterCourse !== 'all' || filterLeader !== 'all' 
                ? "Try adjusting your filters or search term to find what you're looking for."
                : "Get started by creating your first employee group."}
            </p>
            {isAdmin && (
              <button 
                onClick={() => navigate('/lms/groups/create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors"
              >
                <Plus size={20} />
                Create First Group
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredAndSortedGroups.map((group, idx) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={() => navigate(`/lms/groups/create/${group.id}`)}
                onChat={() => navigate(`/lms/groups/view/${group.id}`)}
                onDelete={(id) => handleDeleteGroup(id)}
                onViewMembers={() => setModalData({ isOpen: true, group })}
                isAdmin={isAdmin}
                isTeamLead={isTeamLead}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <TableView
            groups={filteredAndSortedGroups}
            onEdit={(id) => navigate(`/lms/groups/create/${id}`)}
            onChat={(id) => navigate(`/lms/groups/view/${id}`)}
            onDelete={handleDeleteGroup}
            onViewMembers={(group) => setModalData({ isOpen: true, group })}
            isAdmin={isAdmin}
            isTeamLead={isTeamLead}
          />
        )}
      </div>

      <MembersModal 
        isOpen={modalData.isOpen} 
        onClose={() => setModalData({ isOpen: false })}
        groupName={modalData.group?.name || ''}
        leaders={modalData.group?.teachers || []}
        employees={modalData.group?.students || []}
        courseName={modalData.group?.assignedCourses[0]?.name}
      />
    </div>
  );
};

// --- TABLE VIEW COMPONENT ---
interface TableViewProps {
  groups: GroupUI[];
  onEdit: (id: string | number) => void;
  onChat: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onViewMembers: (group: GroupUI) => void;
  isAdmin: boolean;
  isTeamLead: boolean;
}

const TableView: React.FC<TableViewProps> = ({ groups, onEdit, onChat, onDelete, onViewMembers, isAdmin, isTeamLead }) => {
  const cardGradients = ['from-violet-500 to-purple-600', 'from-blue-500 to-cyan-600', 'from-amber-500 to-orange-600', 'from-emerald-500 to-teal-600'];

  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      {/* Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <div className="col-span-3">Group Name</div>
        <div className="col-span-2">Course</div>
        <div className="col-span-2">Leaders</div>
        <div className="col-span-2">Members</div>
        <div className="col-span-1">Created</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {groups.map((group, idx) => {
          const gradientClass = cardGradients[idx % cardGradients.length];
          
          return (
            <div 
              key={group.id}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200"
            >
              {/* Group Name */}
              <div className="lg:col-span-3 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{group.name}</h3>
                  <p className="text-sm text-slate-500 lg:hidden flex items-center gap-1 mt-1">
                    <BookOpen size={12} />
                    {group.assignedCourses[0]?.name || 'No Course'}
                  </p>
                </div>
              </div>

              {/* Course */}
              <div className="hidden lg:flex lg:col-span-2 items-center">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${gradientClass} text-white text-xs font-bold`}>
                  <BookOpen size={12} />
                  <span className="truncate max-w-[120px]">{group.assignedCourses[0]?.name || 'No Course'}</span>
                </span>
              </div>

              {/* Leaders */}
              <div className="hidden lg:flex lg:col-span-2 items-center">
                <div className="flex -space-x-2">
                  {group.teachers.slice(0, 3).map((u, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 flex items-center justify-center text-xs text-white font-bold overflow-hidden"
                      title={u.name}
                    >
                      {u.profileImage ? (
                        <img src={getFullImageUrl(u.profileImage)!} className="w-full h-full object-cover" alt={u.name} />
                      ) : (
                        u.avatar
                      )}
                    </div>
                  ))}
                  {group.teachers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-900">
                      +{group.teachers.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Members */}
              <div className="hidden lg:flex lg:col-span-2 items-center gap-3">
                <button
                  onClick={() => onViewMembers(group)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-900/20 rounded-lg transition-colors group/btn"
                >
                  <Users size={14} className="text-slate-500 group-hover/btn:text-violet-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {group.teachers.length + group.students.length} members
                  </span>
                </button>
              </div>

              {/* Created */}
              <div className="hidden lg:flex lg:col-span-1 items-center text-sm text-slate-500">
                {new Date(group.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => onViewMembers(group)}
                  className="lg:hidden p-2.5 text-slate-500 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-colors"
                  title="View Members"
                >
                  <Users size={18} />
                </button>
                <button
                  onClick={() => onChat(group.id)}
                  className="p-2.5 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                  title="Open Chat"
                >
                  <MessageCircle size={18} />
                </button>
                <button
                  onClick={() => onEdit(group.id)}
                  className="p-2.5 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                  title={isTeamLead ? 'Assign Courses' : 'Edit Group'}
                >
                  <Edit size={18} />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(group.id)}
                    className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                    title="Delete Group"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => onChat(group.id)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  <ChevronRight size={16} />
                  <span className="hidden xl:inline">Open</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- GROUP CARD COMPONENT ---
interface GroupCardProps {
  group: GroupUI;
  onEdit: () => void;
  onChat: () => void;
  onDelete: (groupId: string | number) => void;
  onViewMembers: () => void;
  isAdmin: boolean;
  isTeamLead: boolean;
  index: number;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onChat, onDelete, onViewMembers, isAdmin, isTeamLead, index }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const cardGradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600', 
    'from-amber-500 to-orange-600', 
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-indigo-500 to-blue-600'
  ];
  const gradientClass = cardGradients[index % cardGradients.length];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="group/card relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 hover:-translate-y-2 overflow-hidden">
      {/* Gradient Top Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      {/* Decorative Background */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradientClass} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{group.name}</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Calendar size={12} />
                  {new Date(group.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <MoreVertical size={20} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-12 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 py-2 overflow-hidden">
                <button 
                  onClick={() => { onEdit(); setShowDropdown(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Edit size={16} className="text-blue-500" />
                  {isTeamLead ? 'Assign Courses' : 'Edit Details'}
                </button>
                <button 
                  onClick={() => { onViewMembers(); setShowDropdown(false); }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Eye size={16} className="text-violet-500" />
                  View Members
                </button>
                {isAdmin && (
                  <>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <button 
                      onClick={() => { onDelete(group.id); setShowDropdown(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete Group
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Course Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${gradientClass} text-white text-sm font-bold mb-6 shadow-lg`}>
          <BookOpen size={16} />
          <span className="truncate max-w-[180px]">{group.assignedCourses[0]?.name || "No Course Assigned"}</span>
        </div>

        {/* Members Section */}
        <div 
          onClick={onViewMembers}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800 rounded-2xl p-5 cursor-pointer hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/10 dark:hover:to-purple-900/10 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 group/members"
        >
          {/* Leaders Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserCheck size={14} className="text-blue-500" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Leaders</span>
            </div>
            <div className="flex -space-x-2">
              {group.teachers.slice(0, 4).map((u, i) => (
                <div 
                  key={i} 
                  className="w-9 h-9 rounded-xl border-2 border-white dark:border-slate-800 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs text-white font-bold overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform"
                  title={u.name}
                >
                  {u.profileImage ? (
                    <img src={getFullImageUrl(u.profileImage)!} className="w-full h-full object-cover" alt={u.name} />
                  ) : (
                    u.avatar
                  )}
                </div>
              ))}
              {group.teachers.length > 4 && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-white dark:border-slate-800">
                  +{group.teachers.length - 4}
                </div>
              )}
              {group.teachers.length === 0 && (
                <span className="text-xs text-slate-400 italic">None assigned</span>
              )}
            </div>
          </div>

          {/* Employees Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <GraduationCap size={14} className="text-emerald-500" />
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employees</span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                {group.students.length}
              </span>
            </div>
            <div className="flex -space-x-2 items-center">
              {group.students.slice(0, 4).map((u, i) => (
                <div 
                  key={i} 
                  className="w-9 h-9 rounded-xl border-2 border-white dark:border-slate-800 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs text-white font-bold overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform"
                  title={u.name}
                >
                  {u.profileImage ? (
                    <img src={getFullImageUrl(u.profileImage)!} className="w-full h-full object-cover" alt={u.name} />
                  ) : (
                    u.avatar
                  )}
                </div>
              ))}
              {group.students.length > 4 && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-slate-500 dark:text-slate-400 border-2 border-white dark:border-slate-800">
                  +{group.students.length - 4}
                </div>
              )}
              {group.students.length === 0 && (
                <span className="text-xs text-slate-400 italic">None assigned</span>
              )}
            </div>
          </div>

          {/* Click Hint */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <Eye size={14} className="text-violet-500" />
            <p className="text-xs text-violet-500 dark:text-violet-400 font-bold uppercase tracking-wider group-hover/members:underline">
              Click to view all members
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onChat}
        className={`w-full py-5 bg-gradient-to-r ${gradientClass} text-white flex items-center justify-center gap-3 font-bold text-base hover:brightness-110 transition-all duration-300 active:scale-[0.99]`}
      >
        <MessageCircle size={20} />
        <span>Enter Group Chat</span>
        <ChevronRight size={18} className="group-hover/card:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default StudentGroupsListPage;


