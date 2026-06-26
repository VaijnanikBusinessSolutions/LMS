


// // import React, { useEffect, useState, useMemo } from 'react';
// // import { 
// //   ArrowLeft, BookOpen, Users, UserCheck, GraduationCap, 
// //   MessageSquare, Settings, Filter, X, CheckCircle2, Search,
// //   Briefcase, Building2, ChevronDown
// // } from 'lucide-react';
// // import { useNavigate, useParams } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // import type { RootState } from '../../../store/store';
// // import type { ChatMember } from '../GroupChat';
// // import GroupChat from '../GroupChat';

// // const API_BASE = 'http://127.0.0.1:8000/lms';

// // interface ApiUser { 
// //   id: number; 
// //   email: string; 
// //   first_name?: string; 
// //   last_name?: string; 
// //   role?: string; 
// //   profile_image?: string; 
// //   firstName?: string; 
// //   lastName?: string;
// //   designation?: string;
// //   department?: string;
// // }

// // interface ApiCourse { 
// //   id: number; 
// //   title: string; 
// //   description?: string; 
// // }

// // const CreateGroupPage: React.FC = () => {
// //   const navigate = useNavigate();
// //   const { groupId } = useParams<{ groupId?: string }>();
// //   const isEditMode = Boolean(groupId);

// //   const [activeTab, setActiveTab] = useState<'settings' | 'chat'>('settings');
// //   const [groupName, setGroupName] = useState('');
  
// //   // Data State
// //   const [selectedTeachers, setSelectedTeachers] = useState<ApiUser[]>([]);
// //   const [selectedStudents, setSelectedStudents] = useState<ApiUser[]>([]);
// //   const [selectedCourses, setSelectedCourses] = useState<ApiCourse[]>([]);
// //   const [teamLeaders, setTeamLeaders] = useState<ApiUser[]>([]);
// //   const [employees, setEmployees] = useState<ApiUser[]>([]);
// //   const [courses, setCourses] = useState<ApiCourse[]>([]);
  
// //   // Filter States
// //   const [filterDesignation, setFilterDesignation] = useState<string>('all');
// //   const [filterDepartment, setFilterDepartment] = useState<string>('all');
// //   const [searchQuery, setSearchQuery] = useState('');

// //   const [chatMembers, setChatMembers] = useState<ChatMember[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);

// //   const { accessToken: token, user: currentUser } = useSelector((state: RootState) => state.auth);
// //   const isAdmin = currentUser?.role === 'admin';
// //   const isTeamLead = currentUser?.role === 'team-leader';

// //   const buildHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
// //   const getDisplayName = (u: ApiUser) => (u.first_name || u.firstName || '') + ' ' + (u.last_name || u.lastName || '');

// //   // --- Effects ---
// //   useEffect(() => {
// //     const leaders: ChatMember[] = selectedTeachers.map(u => ({ id: u.id, name: getDisplayName(u), role: 'team-leader', email: u.email, avatar: u.profile_image }));
// //     const students: ChatMember[] = selectedStudents.map(u => ({ id: u.id, name: getDisplayName(u), role: 'employee', email: u.email, avatar: u.profile_image }));
// //     setChatMembers([...leaders, ...students]);
// //   }, [selectedTeachers, selectedStudents]);

// //   useEffect(() => {
// //     let mounted = true;
// //     const fetchAll = async () => {
// //       setLoading(true);
// //       try {
// //         const headers = buildHeaders();
// //         const commonPromises = [fetch(`${API_BASE}/users/employees/`, { headers }), fetch(`${API_BASE}/courses/`, { headers })];
// //         if (isAdmin) commonPromises.push(fetch(`${API_BASE}/users/team_leaders/`, { headers }));

// //         const responses = await Promise.all(commonPromises);
// //         const [empJson, courseJson] = [await responses[0].json(), await responses[1].json()];
// //         const tlJson = isAdmin ? await responses[2].json() : [];

// //         if (!mounted) return;
// //         setEmployees(empJson || []); setCourses(courseJson || []); if (isAdmin) setTeamLeaders(tlJson || []);

// //         if (isEditMode && groupId) {
// //           const groupResp = await fetch(`${API_BASE}/groups/${groupId}/`, { headers });
// //           if (!groupResp.ok) throw new Error("Failed");
// //           const groupData = await groupResp.json();
// //           if (!mounted) return;

// //           setGroupName(groupData.name || '');
// //           const mapIds = (l: any[]) => l.map((x: any) => typeof x === 'number' ? x : x.id);
          
// //           if (isAdmin) setSelectedTeachers(tlJson.filter((u: ApiUser) => mapIds(groupData.team_leaders || []).includes(u.id)));
// //           else if (isTeamLead && currentUser) setSelectedTeachers([{ id: currentUser.id!, email: currentUser.email, role: currentUser.role, first_name: currentUser.first_name, last_name: currentUser.last_name } as ApiUser]);

// //           setSelectedStudents(empJson.filter((u: ApiUser) => mapIds(groupData.employees || []).includes(u.id)));
// //           if (groupData.course) {
// //              const cId = typeof groupData.course === 'number' ? groupData.course : groupData.course.id;
// //              setSelectedCourses(courseJson.filter((c: ApiCourse) => c.id === cId));
// //           }
// //         }
// //       } catch (err: any) { console.error(err); } finally { if(mounted) setLoading(false); }
// //     };
// //     if (isAdmin || isTeamLead) fetchAll(); else setLoading(false);
// //     return () => { mounted = false; };
// //   }, [groupId, isEditMode, token, isAdmin, isTeamLead, currentUser]);

// //   // --- Handlers ---
// //   const toggleUser = (user: ApiUser, list: ApiUser[], setList: any) => setList((prev: any[]) => prev.find(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user]);
// //   const toggleCourse = (course: ApiCourse) => setSelectedCourses(prev => prev.find(c => c.id === course.id) ? [] : [course]);
  
// //   const handleSubmit = async () => {
// //     if (!groupName.trim()) return;
// //     setSaving(true);
// //     const payload: any = { name: groupName.trim(), employees: selectedStudents.map(s => s.id), course: selectedCourses[0]?.id || null };
// //     if (isAdmin) payload.team_leaders = selectedTeachers.map(t => t.id);
// //     else if (isTeamLead && !isEditMode && currentUser?.id) payload.team_leaders = [currentUser.id];

// //     try {
// //       const url = isEditMode ? `${API_BASE}/groups/${groupId}/` : `${API_BASE}/groups/`;
// //       const method = isEditMode ? 'PATCH' : 'POST';
// //       const resp = await fetch(url, { method, headers: buildHeaders(), body: JSON.stringify(payload) });
// //       if (resp.ok) navigate("/lms/groups");
// //     } catch (e) { alert("Network error"); } finally { setSaving(false); }
// //   };

// //   // --- Filtering Logic ---
// //   const uniqueDesignations = useMemo(() => {
// //     const list = [...teamLeaders, ...employees].map(u => u.designation).filter(Boolean);
// //     return Array.from(new Set(list)).sort();
// //   }, [teamLeaders, employees]);

// //   const uniqueDepartments = useMemo(() => {
// //     const list = [...teamLeaders, ...employees].map(u => u.department).filter(Boolean);
// //     return Array.from(new Set(list)).sort();
// //   }, [teamLeaders, employees]);

// //   const filterUsers = (users: ApiUser[]) => {
// //     return users.filter(u => {
// //       const nameMatch = getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
// //       const desigMatch = filterDesignation === 'all' || u.designation === filterDesignation;
// //       const deptMatch = filterDepartment === 'all' || u.department === filterDepartment;
// //       return nameMatch && desigMatch && deptMatch;
// //     });
// //   };

// //   const filteredTeamLeaders = filterUsers(teamLeaders);
// //   const filteredEmployees = filterUsers(employees);

// //   if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading Configuration...</div>;

// //   return (
// //     <div className="bg-slate-50 text-slate-900 min-h-screen font-sans pb-24">
      
// //       {/* --- Sticky Header --- */}
// //       <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
// //         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <button onClick={() => navigate('/lms/groups')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
// //               <ArrowLeft size={20} />
// //             </button>
// //             <div>
// //               <h1 className="text-lg font-bold text-slate-900 tracking-tight">{isEditMode ? 'Manage Group' : 'Create New Group'}</h1>
// //               <p className="text-xs text-slate-500 font-medium">LMS Administration</p>
// //             </div>
// //           </div>
          
// //           {/* Tabs */}
// //           {isEditMode && (
// //             <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
// //               <button onClick={() => setActiveTab('settings')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Settings</button>
// //               <button onClick={() => setActiveTab('chat')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeTab === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Discussion</button>
// //             </div>
// //           )}

// //           <div className="flex items-center gap-3">
// //             <button onClick={() => navigate('/lms/groups')} className="hidden md:inline-flex px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
// //             <button onClick={handleSubmit} disabled={saving || !groupName.trim()} className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all ${saving || !groupName.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}>
// //                 {saving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Group')}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 py-8">
        
// //         {(activeTab === 'settings' || !isEditMode) && (
// //           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
// //             {/* --- LEFT COLUMN (Configuration) --- */}
// //             <div className="lg:col-span-4 space-y-6">
                
// //                 {/* 1. Group Details Input */}
// //                 <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
// //                     <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
// //                         <Settings size={16} className="text-slate-400" /> Group Details
// //                     </h2>
// //                     <div>
// //                         <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Group Name</label>
// //                         <input 
// //                             type="text" 
// //                             value={groupName} 
// //                             onChange={(e) => setGroupName(e.target.value)} 
// //                             className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
// //                             placeholder="e.g. Frontend Cohort 2024" 
// //                             disabled={saving} 
// //                         />
// //                     </div>
// //                 </div>

// //                 {/* 2. Course Selection List */}
// //                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
// //                     <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
// //                         <h2 className="font-bold text-slate-800 flex items-center gap-2">
// //                             <BookOpen size={18} className="text-purple-600" /> Select Course
// //                         </h2>
// //                         <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{selectedCourses.length}</span>
// //                     </div>
// //                     <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
// //                         {courses.map(c => {
// //                             const isSelected = selectedCourses.some(x => x.id === c.id);
// //                             return (
// //                                 <div 
// //                                     key={c.id} 
// //                                     onClick={() => toggleCourse(c)}
// //                                     className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-purple-500 bg-purple-50/30' : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'}`}
// //                                 >
// //                                     <div className="flex justify-between items-start mb-1">
// //                                         <h3 className={`font-bold text-sm ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>{c.title}</h3>
// //                                         {isSelected && <CheckCircle2 size={16} className="text-purple-600 fill-purple-100" />}
// //                                     </div>
// //                                     <p className="text-xs text-slate-500 line-clamp-2">{c.description || "No description."}</p>
// //                                 </div>
// //                             );
// //                         })}
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* --- RIGHT COLUMN (Member Management) --- */}
// //             <div className="lg:col-span-8 space-y-6">
                
// //                 {/* 1. Global Member Filter Bar */}
// //                 <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
// //                     <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between mb-4">
// //                         <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
// //                             <Users size={16} className="text-slate-400"/> Filter Members
// //                         </h2>
// //                         {(filterDesignation !== 'all' || filterDepartment !== 'all' || searchQuery) && (
// //                             <button onClick={() => { setFilterDesignation('all'); setFilterDepartment('all'); setSearchQuery(''); }} className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1">
// //                                 <X size={12} /> Clear Filters
// //                             </button>
// //                         )}
// //                     </div>
                    
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                         {/* Search */}
// //                         <div className="relative">
// //                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
// //                             <input 
// //                                 type="text" 
// //                                 placeholder="Search Name/Email..." 
// //                                 value={searchQuery} 
// //                                 onChange={(e) => setSearchQuery(e.target.value)} 
// //                                 className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
// //                             />
// //                         </div>
// //                         {/* Designation */}
// //                         <div className="relative">
// //                             <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
// //                             <select value={filterDesignation} onChange={(e) => setFilterDesignation(e.target.value)} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
// //                                 <option value="all">All Designations</option>
// //                                 {uniqueDesignations.map((d:any) => <option key={d} value={d}>{d}</option>)}
// //                             </select>
// //                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
// //                         </div>
// //                         {/* Department */}
// //                         <div className="relative">
// //                             <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
// //                             <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
// //                                 <option value="all">All Departments</option>
// //                                 {uniqueDepartments.map((d:any) => <option key={d} value={d}>{d}</option>)}
// //                             </select>
// //                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* 2. TEAM LEADERS LIST (Admin Only) */}
// //                 {isAdmin && (
// //                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
// //                         <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
// //                             <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
// //                                 <UserCheck size={16} className="text-blue-600" /> Select Team Leaders
// //                             </h2>
// //                             <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{selectedTeachers.length}</span>
// //                         </div>
// //                         <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto scrollbar-thin">
// //                             {filteredTeamLeaders.map(l => {
// //                                 const isSelected = selectedTeachers.some(t => t.id === l.id);
// //                                 return (
// //                                     <div key={l.id} onClick={() => toggleUser(l, selectedTeachers, setSelectedTeachers)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
// //                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
// //                                             {l.profile_image ? <img src={l.profile_image} className="w-full h-full rounded-full object-cover" /> : (l.first_name?.[0] || 'U')}
// //                                         </div>
// //                                         <div className="flex-1 min-w-0">
// //                                             <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{getDisplayName(l)}</p>
// //                                             <div className="flex items-center gap-2 text-[11px] text-slate-500">
// //                                                 <span className="truncate">{l.designation || 'Leader'}</span>
// //                                                 <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
// //                                                 <span className="truncate">{l.department || 'General'}</span>
// //                                             </div>
// //                                         </div>
// //                                         {isSelected && <CheckCircle2 size={18} className="text-blue-600" />}
// //                                     </div>
// //                                 );
// //                             })}
// //                             {filteredTeamLeaders.length === 0 && <div className="col-span-2 text-center py-6 text-slate-400 text-sm">No leaders found matching filters.</div>}
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* 3. STUDENTS LIST */}
// //                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
// //                     <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
// //                         <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
// //                             <GraduationCap size={16} className="text-emerald-600" /> Select Students
// //                         </h2>
// //                         <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{selectedStudents.length}</span>
// //                     </div>
// //                     <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto scrollbar-thin">
// //                         {filteredEmployees.map(s => {
// //                             const isSelected = selectedStudents.some(x => x.id === s.id);
// //                             return (
// //                                 <div key={s.id} onClick={() => toggleUser(s, selectedStudents, setSelectedStudents)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
// //                                     <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
// //                                         {s.profile_image ? <img src={s.profile_image} className="w-full h-full rounded-full object-cover" /> : (s.first_name?.[0] || 'U')}
// //                                     </div>
// //                                     <div className="flex-1 min-w-0">
// //                                         <p className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{getDisplayName(s)}</p>
// //                                         <div className="text-[10px] text-slate-500 truncate">{s.department || 'General'}</div>
// //                                     </div>
// //                                     {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
// //                                 </div>
// //                             );
// //                         })}
// //                         {filteredEmployees.length === 0 && <div className="col-span-3 text-center py-6 text-slate-400 text-sm">No students found matching filters.</div>}
// //                     </div>
// //                 </div>

// //             </div>
// //           </div>
// //         )}

// //         {/* --- CHAT TAB --- */}
// //         {activeTab === 'chat' && isEditMode && currentUser && groupId && (
// //            <div className="h-[calc(100vh-180px)] w-full rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-white">
// //               <GroupChat 
// //                 groupId={groupId}
// //                 groupName={groupName}
// //                 members={chatMembers}
// //                 token={token}
// //                 currentUser={{ id: currentUser.id || 0, name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`, role: currentUser.role }} 
// //               />
// //            </div>
// //         )}
// //       </div>
      
// //       {/* Scrollbar Utility */}
// //       <style>{`
// //         .scrollbar-thin::-webkit-scrollbar { width: 5px; }
// //         .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
// //         .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
// //         .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default CreateGroupPage;




// import React, { useEffect, useState, useMemo } from 'react';
// import { 
//   ArrowLeft, BookOpen, Users, UserCheck, GraduationCap, 
//   MessageSquare, Settings, X, CheckCircle2, Search,
//   Briefcase, Building2, ChevronDown, Sparkles, Save,
//   Layers, Clock, Check, AlertCircle, Eye, EyeOff,
//   ChevronRight, Mail, Hash, Zap, Target, Award
// } from 'lucide-react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../store/store';
// import type { ChatMember } from '../GroupChat';
// import GroupChat from '../GroupChat';

// const API_BASE = 'http://127.0.0.1:8000/lms';

// interface ApiUser { 
//   id: number; 
//   email: string; 
//   first_name?: string; 
//   last_name?: string; 
//   role?: string; 
//   profile_image?: string; 
//   firstName?: string; 
//   lastName?: string;
//   designation?: string;
//   department?: string;
// }

// interface ApiCourse { 
//   id: number; 
//   title: string; 
//   description?: string; 
// }

// // --- SELECTED PREVIEW COMPONENT ---
// const SelectedPreview: React.FC<{
//   title: string;
//   items: { id: number; name: string; subtitle?: string; image?: string }[];
//   onRemove: (id: number) => void;
//   icon: React.ReactNode;
//   emptyMessage: string;
//   gradient: string;
// }> = ({ title, items, onRemove, icon, emptyMessage, gradient }) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
//       <button
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//       >
//         <div className="flex items-center gap-3">
//           <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
//             {icon}
//           </div>
//           <div className="text-left">
//             <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
//             <p className="text-xs text-slate-500">{items.length} selected</p>
//           </div>
//         </div>
//         <ChevronDown 
//           size={18} 
//           className={`text-slate-400 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} 
//         />
//       </button>
      
//       {!isCollapsed && (
//         <div className="p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
//           {items.length === 0 ? (
//             <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
//               {emptyMessage}
//             </div>
//           ) : (
//             <div className="flex flex-wrap gap-2">
//               {items.map(item => (
//                 <div
//                   key={item.id}
//                   className="group flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//                 >
//                   <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
//                     {item.image ? (
//                       <img src={item.image} className="w-full h-full object-cover" alt="" />
//                     ) : (
//                       item.name.charAt(0).toUpperCase()
//                     )}
//                   </div>
//                   <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
//                     {item.name}
//                   </span>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
//                     className="p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-full transition-colors"
//                   >
//                     <X size={12} className="text-slate-400 group-hover:text-rose-500" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- PROGRESS INDICATOR ---
// const FormProgress: React.FC<{
//   steps: { label: string; completed: boolean }[];
// }> = ({ steps }) => {
//   const completedCount = steps.filter(s => s.completed).length;
//   const percentage = (completedCount / steps.length) * 100;

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-bold text-slate-900 dark:text-white">Setup Progress</h3>
//         <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{completedCount}/{steps.length}</span>
//       </div>
//       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
//         <div 
//           className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//       <div className="space-y-2">
//         {steps.map((step, idx) => (
//           <div key={idx} className="flex items-center gap-2">
//             <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
//               step.completed 
//                 ? 'bg-emerald-500' 
//                 : 'bg-slate-200 dark:bg-slate-700'
//             }`}>
//               {step.completed ? (
//                 <Check size={12} className="text-white" />
//               ) : (
//                 <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
//               )}
//             </div>
//             <span className={`text-xs font-medium ${
//               step.completed 
//                 ? 'text-emerald-600 dark:text-emerald-400' 
//                 : 'text-slate-500 dark:text-slate-400'
//             }`}>
//               {step.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const CreateGroupPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { groupId } = useParams<{ groupId?: string }>();
//   const isEditMode = Boolean(groupId);

//   const [activeTab, setActiveTab] = useState<'settings' | 'chat'>('settings');
//   const [groupName, setGroupName] = useState('');
  
//   // Data State
//   const [selectedTeachers, setSelectedTeachers] = useState<ApiUser[]>([]);
//   const [selectedStudents, setSelectedStudents] = useState<ApiUser[]>([]);
//   const [selectedCourses, setSelectedCourses] = useState<ApiCourse[]>([]);
//   const [teamLeaders, setTeamLeaders] = useState<ApiUser[]>([]);
//   const [employees, setEmployees] = useState<ApiUser[]>([]);
//   const [courses, setCourses] = useState<ApiCourse[]>([]);
  
//   // Filter States
//   const [filterDesignation, setFilterDesignation] = useState<string>('all');
//   const [filterDepartment, setFilterDepartment] = useState<string>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [courseSearch, setCourseSearch] = useState('');
  

//   // View States
//   const [showSelectedOnly, setShowSelectedOnly] = useState(false);

//   const [chatMembers, setChatMembers] = useState<ChatMember[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const { accessToken: token, user: currentUser } = useSelector((state: RootState) => state.auth);
//   const isAdmin = currentUser?.role === 'admin';
//   const isTeamLead = currentUser?.role === 'team-leader';

//   const buildHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
//   const getDisplayName = (u: ApiUser) => (u.first_name || u.firstName || '') + ' ' + (u.last_name || u.lastName || '');

//   // Progress Steps
//   const progressSteps = useMemo(() => [
//     { label: 'Group name entered', completed: groupName.trim().length > 0 },
//     { label: 'Course selected', completed: selectedCourses.length > 0 },
//     { label: 'Team leaders assigned', completed: selectedTeachers.length > 0 || isTeamLead },
//     { label: 'Employees added', completed: selectedStudents.length > 0 },
//   ], [groupName, selectedCourses, selectedTeachers, selectedStudents, isTeamLead]);

//   // --- Effects ---
//   useEffect(() => {
//     const leaders: ChatMember[] = selectedTeachers.map(u => ({ id: u.id, name: getDisplayName(u), role: 'team-leader', email: u.email, avatar: u.profile_image }));
//     const students: ChatMember[] = selectedStudents.map(u => ({ id: u.id, name: getDisplayName(u), role: 'employee', email: u.email, avatar: u.profile_image }));
//     setChatMembers([...leaders, ...students]);
//   }, [selectedTeachers, selectedStudents]);

//   useEffect(() => {
//     let mounted = true;
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const headers = buildHeaders();
//         const commonPromises = [fetch(`${API_BASE}/users/employees/`, { headers }), fetch(`${API_BASE}/courses/`, { headers })];
//         if (isAdmin) commonPromises.push(fetch(`${API_BASE}/users/team_leaders/`, { headers }));

//         const responses = await Promise.all(commonPromises);
//         const [empJson, courseJson] = [await responses[0].json(), await responses[1].json()];
//         const tlJson = isAdmin ? await responses[2].json() : [];

//         if (!mounted) return;
//         setEmployees(empJson || []); setCourses(courseJson || []); if (isAdmin) setTeamLeaders(tlJson || []);

//         if (isEditMode && groupId) {
//           const groupResp = await fetch(`${API_BASE}/groups/${groupId}/`, { headers });
//           if (!groupResp.ok) throw new Error("Failed");
//           const groupData = await groupResp.json();
//           if (!mounted) return;

//           setGroupName(groupData.name || '');
//           const mapIds = (l: any[]) => l.map((x: any) => typeof x === 'number' ? x : x.id);
          
//           if (isAdmin) setSelectedTeachers(tlJson.filter((u: ApiUser) => mapIds(groupData.team_leaders || []).includes(u.id)));
//           else if (isTeamLead && currentUser) setSelectedTeachers([{ id: currentUser.id!, email: currentUser.email, role: currentUser.role, first_name: currentUser.first_name, last_name: currentUser.last_name } as ApiUser]);

//           setSelectedStudents(empJson.filter((u: ApiUser) => mapIds(groupData.employees || []).includes(u.id)));
//           if (groupData.course) {
//              const cId = typeof groupData.course === 'number' ? groupData.course : groupData.course.id;
//              setSelectedCourses(courseJson.filter((c: ApiCourse) => c.id === cId));
//           }
//         }
//       } catch (err: any) { console.error(err); } finally { if(mounted) setLoading(false); }
//     };
//     if (isAdmin || isTeamLead) fetchAll(); else setLoading(false);
//     return () => { mounted = false; };
//   }, [groupId, isEditMode, token, isAdmin, isTeamLead, currentUser]);

//   // --- Handlers ---
//   const toggleUser = (user: ApiUser, list: ApiUser[], setList: any) => setList((prev: any[]) => prev.find(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user]);
//   const toggleCourse = (course: ApiCourse) => setSelectedCourses(prev => prev.find(c => c.id === course.id) ? [] : [course]);
  
//   const handleSubmit = async () => {
//     if (!groupName.trim()) return;
//     setSaving(true);
//     const payload: any = { name: groupName.trim(), employees: selectedStudents.map(s => s.id), course: selectedCourses[0]?.id || null };
//     if (isAdmin) payload.team_leaders = selectedTeachers.map(t => t.id);
//     else if (isTeamLead && !isEditMode && currentUser?.id) payload.team_leaders = [currentUser.id];

//     try {
//       const url = isEditMode ? `${API_BASE}/groups/${groupId}/` : `${API_BASE}/groups/`;
//       const method = isEditMode ? 'PATCH' : 'POST';
//       const resp = await fetch(url, { method, headers: buildHeaders(), body: JSON.stringify(payload) });
//       if (resp.ok) navigate("/lms/groups");
//     } catch (e) { alert("Network error"); } finally { setSaving(false); }
//   };

//   const selectAllEmployees = () => {
//     setSelectedStudents(filteredEmployees);
//   };

//   const deselectAllEmployees = () => {
//     setSelectedStudents([]);
//   };

//   // --- Filtering Logic ---
//   const uniqueDesignations = useMemo(() => {
//     const list = [...teamLeaders, ...employees].map(u => u.designation).filter(Boolean);
//     return Array.from(new Set(list)).sort();
//   }, [teamLeaders, employees]);

//   const uniqueDepartments = useMemo(() => {
//     const list = [...teamLeaders, ...employees].map(u => u.department).filter(Boolean);
//     return Array.from(new Set(list)).sort();
//   }, [teamLeaders, employees]);

//   const filterUsers = (users: ApiUser[]) => {
//     return users.filter(u => {
//       const nameMatch = getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
//       const desigMatch = filterDesignation === 'all' || u.designation === filterDesignation;
//       const deptMatch = filterDepartment === 'all' || u.department === filterDepartment;
//       const selectedMatch = !showSelectedOnly || selectedStudents.some(s => s.id === u.id) || selectedTeachers.some(t => t.id === u.id);
//       return nameMatch && desigMatch && deptMatch && selectedMatch;
//     });
//   };

//   const filteredTeamLeaders = filterUsers(teamLeaders);
//   const filteredEmployees = filterUsers(employees);
//   const filteredCourses = courses.filter(c => 
//     c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
//     c.description?.toLowerCase().includes(courseSearch.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
//         <div className="text-center">
//           <div className="relative w-20 h-20 mx-auto mb-6">
//             <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
//             <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
//               <Layers className="w-10 h-10 text-white animate-pulse" />
//             </div>
//           </div>
//           <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Configuration...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans transition-colors duration-500">
//       {/* Background Pattern */}
//       <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTYgNmgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none" />
      
//       {/* --- Sticky Header --- */}
//       <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50">
//         <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
//           <div className="h-20 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button 
//                 onClick={() => navigate('/lms/groups')} 
//                 className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
//               >
//                 <ArrowLeft size={22} />
//               </button>
//               <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700" />
//               <div className="flex items-center gap-3">
//                 <div className="relative hidden sm:block">
//                   <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-40" />
//                   <div className="relative p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
//                     {isEditMode ? <Settings size={20} className="text-white" /> : <Sparkles size={20} className="text-white" />}
//                   </div>
//                 </div>
//                 <div>
//                   <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
//                     {isEditMode ? 'Manage Group' : 'Create New Group'}
//                   </h1>
//                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
//                     {isEditMode ? 'Update group settings and members' : 'Set up a new employee learning group'}
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Tabs */}
//             {isEditMode && (
//               <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
//                 <button 
//                   onClick={() => setActiveTab('settings')} 
//                   className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
//                     activeTab === 'settings' 
//                       ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md' 
//                       : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
//                   }`}
//                 >
//                   <Settings size={16} />
//                   Settings
//                 </button>
//                 <button 
//                   onClick={() => setActiveTab('chat')} 
//                   className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
//                     activeTab === 'chat' 
//                       ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md' 
//                       : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
//                   }`}
//                 >
//                   <MessageSquare size={16} />
//                   Discussion
//                 </button>
//               </div>
//             )}

//             <div className="flex items-center gap-3">
//               <button 
//                 onClick={() => navigate('/lms/groups')} 
//                 className="hidden md:inline-flex px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleSubmit} 
//                 disabled={saving || !groupName.trim()} 
//                 className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
//                   saving || !groupName.trim() 
//                     ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
//                     : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/25 active:scale-95'
//                 }`}
//               >
//                 {saving ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     <span>Saving...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Save size={16} />
//                     <span>{isEditMode ? 'Save Changes' : 'Create Group'}</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 pb-24">
        
//         {(activeTab === 'settings' || !isEditMode) && (
//           <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
//             {/* --- LEFT SIDEBAR (Configuration) --- */}
//             <div className="xl:col-span-3 space-y-6">
              
//               {/* Progress Card */}
//               <FormProgress steps={progressSteps} />
                
//               {/* Group Details Input */}
//               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
//                 <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
//                   <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
//                     <Target size={14} className="text-violet-600 dark:text-violet-400" />
//                   </div>
//                   Group Details
//                 </h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
//                       Group Name <span className="text-rose-500">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       value={groupName} 
//                       onChange={(e) => setGroupName(e.target.value)} 
//                       className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none placeholder-slate-400" 
//                       placeholder="e.g. Frontend Cohort 2024" 
//                       disabled={saving} 
//                     />
//                   </div>
//                   {groupName.trim() && (
//                     <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
//                       <CheckCircle2 size={14} />
//                       <span>Group name looks good!</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Selected Items Preview */}
//               <SelectedPreview
//                 title="Selected Leaders"
//                 items={selectedTeachers.map(t => ({ id: t.id, name: getDisplayName(t), image: t.profile_image }))}
//                 onRemove={(id) => setSelectedTeachers(prev => prev.filter(t => t.id !== id))}
//                 icon={<UserCheck size={16} className="text-white" />}
//                 emptyMessage="No leaders selected"
//                 gradient="from-blue-500 to-cyan-500"
//               />

//               <SelectedPreview
//                 title="Selected Employees"
//                 items={selectedStudents.map(s => ({ id: s.id, name: getDisplayName(s), image: s.profile_image }))}
//                 onRemove={(id) => setSelectedStudents(prev => prev.filter(s => s.id !== id))}
//                 icon={<GraduationCap size={16} className="text-white" />}
//                 emptyMessage="No employees selected"
//                 gradient="from-emerald-500 to-teal-500"
//               />

//               <SelectedPreview
//                 title="Selected Course"
//                 items={selectedCourses.map(c => ({ id: c.id, name: c.title }))}
//                 onRemove={(id) => setSelectedCourses(prev => prev.filter(c => c.id !== id))}
//                 icon={<BookOpen size={16} className="text-white" />}
//                 emptyMessage="No course selected"
//                 gradient="from-purple-500 to-pink-500"
//               />
//             </div>

//             {/* --- MAIN CONTENT AREA --- */}
//             <div className="xl:col-span-9 space-y-6">
              
//               {/* Global Filter Bar */}
//               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
//                 <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-5">
//                   <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
//                     <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//                       <Search size={14} className="text-blue-600 dark:text-blue-400" />
//                     </div>
//                     Filter & Search Members
//                   </h2>
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => setShowSelectedOnly(!showSelectedOnly)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                         showSelectedOnly
//                           ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800'
//                           : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
//                       }`}
//                     >
//                       {showSelectedOnly ? <Eye size={16} /> : <EyeOff size={16} />}
//                       {showSelectedOnly ? 'Showing Selected' : 'Show Selected Only'}
//                     </button>
//                     {(filterDesignation !== 'all' || filterDepartment !== 'all' || searchQuery) && (
//                       <button 
//                         onClick={() => { setFilterDesignation('all'); setFilterDepartment('all'); setSearchQuery(''); setShowSelectedOnly(false); }} 
//                         className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
//                       >
//                         <X size={14} /> Clear Filters
//                       </button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Search */}
//                   <div className="relative">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                     <input 
//                       type="text" 
//                       placeholder="Search name or email..." 
//                       value={searchQuery} 
//                       onChange={(e) => setSearchQuery(e.target.value)} 
//                       className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
//                     />
//                   </div>
//                   {/* Designation */}
//                   <div className="relative">
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                     <select 
//                       value={filterDesignation} 
//                       onChange={(e) => setFilterDesignation(e.target.value)} 
//                       className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none cursor-pointer transition-all"
//                     >
//                       <option value="all">All Designations</option>
//                       {uniqueDesignations.map((d: any) => <option key={d} value={d}>{d}</option>)}
//                     </select>
//                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
//                   </div>
//                   {/* Department */}
//                   <div className="relative">
//                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                     <select 
//                       value={filterDepartment} 
//                       onChange={(e) => setFilterDepartment(e.target.value)} 
//                       className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none cursor-pointer transition-all"
//                     >
//                       <option value="all">All Departments</option>
//                       {uniqueDepartments.map((d: any) => <option key={d} value={d}>{d}</option>)}
//                     </select>
//                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
//                   </div>
//                 </div>
//               </div>

//               {/* Two Column Layout for Lists */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
//                 {/* TEAM LEADERS LIST (Admin Only) */}
//                 {isAdmin && (
//                   <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//                     <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
//                             <UserCheck size={18} className="text-white" />
//                           </div>
//                           <div>
//                             <h2 className="font-bold text-slate-900 dark:text-white">Team Leaders</h2>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">{filteredTeamLeaders.length} available</p>
//                           </div>
//                         </div>
//                         <span className="px-3 py-1 text-sm font-bold bg-blue-500 text-white rounded-full shadow-md">
//                           {selectedTeachers.length}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar space-y-3">
//                       {filteredTeamLeaders.map(l => {
//                         const isSelected = selectedTeachers.some(t => t.id === l.id);
//                         return (
//                           <div 
//                             key={l.id} 
//                             onClick={() => toggleUser(l, selectedTeachers, setSelectedTeachers)} 
//                             className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                               isSelected 
//                                 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
//                                 : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
//                             }`}
//                           >
//                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden transition-all ${
//                               isSelected 
//                                 ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' 
//                                 : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
//                             }`}>
//                               {l.profile_image ? (
//                                 <img src={l.profile_image} className="w-full h-full object-cover" alt="" />
//                               ) : (
//                                 (l.first_name?.[0] || 'U')
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
//                                 {getDisplayName(l)}
//                               </p>
//                               <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
//                                 <span className="truncate">{l.designation || 'Leader'}</span>
//                                 <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
//                                 <span className="truncate">{l.department || 'General'}</span>
//                               </div>
//                               <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1 flex items-center gap-1">
//                                 <Mail size={10} />
//                                 {l.email}
//                               </p>
//                             </div>
//                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                               isSelected 
//                                 ? 'bg-blue-500 border-blue-500' 
//                                 : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
//                             }`}>
//                               {isSelected && <Check size={14} className="text-white" />}
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {filteredTeamLeaders.length === 0 && (
//                         <div className="text-center py-12">
//                           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                             <UserCheck className="w-8 h-8 text-slate-400" />
//                           </div>
//                           <p className="text-slate-500 dark:text-slate-400 text-sm">No leaders match your filters</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* COURSES LIST */}
//                 <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${!isAdmin ? 'lg:col-span-2' : ''}`}>
//                   <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
//                     <div className="flex justify-between items-center mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
//                           <BookOpen size={18} className="text-white" />
//                         </div>
//                         <div>
//                           <h2 className="font-bold text-slate-900 dark:text-white">Assign Course</h2>
//                           <p className="text-xs text-slate-500 dark:text-slate-400">{courses.length} courses available</p>
//                         </div>
//                       </div>
//                       <span className="px-3 py-1 text-sm font-bold bg-purple-500 text-white rounded-full shadow-md">
//                         {selectedCourses.length}
//                       </span>
//                     </div>
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                       <input
//                         type="text"
//                         placeholder="Search courses..."
//                         value={courseSearch}
//                         onChange={(e) => setCourseSearch(e.target.value)}
//                         className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
//                       />
//                     </div>
//                   </div>
//                   <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
//                     {filteredCourses.map(c => {
//                       const isSelected = selectedCourses.some(x => x.id === c.id);
//                       return (
//                         <div 
//                           key={c.id} 
//                           onClick={() => toggleCourse(c)}
//                           className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
//                             isSelected 
//                               ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
//                               : 'border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
//                           }`}
//                         >
//                           <div className="flex justify-between items-start gap-4">
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <Award size={14} className={isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'} />
//                                 <h3 className={`font-bold text-sm ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-slate-800 dark:text-slate-200'}`}>
//                                   {c.title}
//                                 </h3>
//                               </div>
//                               <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
//                                 {c.description || "No description available for this course."}
//                               </p>
//                             </div>
//                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
//                               isSelected 
//                                 ? 'bg-purple-500 border-purple-500' 
//                                 : 'border-slate-300 dark:border-slate-600'
//                             }`}>
//                               {isSelected && <Check size={14} className="text-white" />}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {filteredCourses.length === 0 && (
//                       <div className="text-center py-12">
//                         <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                           <BookOpen className="w-8 h-8 text-slate-400" />
//                         </div>
//                         <p className="text-slate-500 dark:text-slate-400 text-sm">No courses found</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* EMPLOYEES LIST - Full Width */}
//               <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
//                         <GraduationCap size={18} className="text-white" />
//                       </div>
//                       <div>
//                         <h2 className="font-bold text-slate-900 dark:text-white">Select Employees</h2>
//                         <p className="text-xs text-slate-500 dark:text-slate-400">
//                           {filteredEmployees.length} employees available • {selectedStudents.length} selected
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={selectAllEmployees}
//                         className="px-4 py-2 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
//                       >
//                         Select All ({filteredEmployees.length})
//                       </button>
//                       <button
//                         onClick={deselectAllEmployees}
//                         className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//                       >
//                         Deselect All
//                       </button>
//                       <span className="px-3 py-1.5 text-sm font-bold bg-emerald-500 text-white rounded-full shadow-md">
//                         {selectedStudents.length}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//                     {filteredEmployees.map(s => {
//                       const isSelected = selectedStudents.some(x => x.id === s.id);
//                       return (
//                         <div 
//                           key={s.id} 
//                           onClick={() => toggleUser(s, selectedStudents, setSelectedStudents)} 
//                           className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                             isSelected 
//                               ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' 
//                               : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
//                           }`}
//                         >
//                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden transition-all ${
//                             isSelected 
//                               ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg' 
//                               : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
//                           }`}>
//                             {s.profile_image ? (
//                               <img src={s.profile_image} className="w-full h-full object-cover" alt="" />
//                             ) : (
//                               (s.first_name?.[0] || 'U')
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'}`}>
//                               {getDisplayName(s)}
//                             </p>
//                             <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
//                               {s.department || 'General Department'}
//                             </p>
//                           </div>
//                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
//                             isSelected 
//                               ? 'bg-emerald-500 border-emerald-500' 
//                               : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-400'
//                           }`}>
//                             {isSelected && <Check size={12} className="text-white" />}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   {filteredEmployees.length === 0 && (
//                     <div className="text-center py-16">
//                       <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
//                         <GraduationCap className="w-10 h-10 text-slate-400" />
//                       </div>
//                       <p className="text-slate-500 dark:text-slate-400">No employees match your current filters</p>
//                       <button
//                         onClick={() => { setFilterDesignation('all'); setFilterDepartment('all'); setSearchQuery(''); }}
//                         className="mt-4 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
//                       >
//                         Clear all filters
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* --- CHAT TAB --- */}
//         {activeTab === 'chat' && isEditMode && currentUser && groupId && (
//           <div className="h-[calc(100vh-180px)] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
//             <GroupChat 
//               groupId={groupId}
//               groupName={groupName}
//               members={chatMembers}
//               token={token}
//               currentUser={{ id: currentUser.id || 0, name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`, role: currentUser.role }} 
//             />
//           </div>
//         )}
//       </div>
      
//       {/* Custom Scrollbar Styles */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #475569;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #64748b;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CreateGroupPage;




import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowLeft, BookOpen, Users, UserCheck, GraduationCap, 
  MessageSquare, Settings, X, CheckCircle2, Search,
  Briefcase, Building2, ChevronDown, Sparkles, Save,
  Layers, Clock, Check, AlertCircle, Eye, EyeOff,
  ChevronRight, Mail, Hash, Zap, Target, Award
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import type { ChatMember } from '../GroupChat';
import GroupChat from '../GroupChat';
import { normalizeListResponse } from '../../../utils/api';

const API_BASE = 'http://127.0.0.1:8000/lms';

interface ApiUser { 
  id: number; 
  email: string; 
  first_name?: string; 
  last_name?: string; 
  role?: string; 
  profile_image?: string; 
  firstName?: string; 
  lastName?: string;
  designation?: string;
  department?: string;
}

interface ApiCourse { 
  id: number; 
  title: string; 
  description?: string; 
}

// --- SELECTED PREVIEW COMPONENT ---
const SelectedPreview: React.FC<{
  title: string;
  items: { id: number; name: string; subtitle?: string; image?: string }[];
  onRemove: (id: number) => void;
  icon: React.ReactNode;
  emptyMessage: string;
  gradient: string;
}> = ({ title, items, onRemove, icon, emptyMessage, gradient }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient}`}>
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{items.length} selected</p>
          </div>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} 
        />
      </button>
      
      {!isCollapsed && (
        <div className="p-4 max-h-[200px] overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-sm">
              {emptyMessage}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                      item.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {item.name}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                    className="p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-full transition-colors"
                  >
                    <X size={12} className="text-slate-400 group-hover:text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- PROGRESS INDICATOR ---
const FormProgress: React.FC<{
  steps: { label: string; completed: boolean }[];
}> = ({ steps }) => {
  const completedCount = steps.filter(s => s.completed).length;
  const percentage = (completedCount / steps.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Setup Progress</h3>
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{completedCount}/{steps.length}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-emerald-500' 
                : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              {step.completed ? (
                <Check size={12} className="text-white" />
              ) : (
                <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
              )}
            </div>
            <span className={`text-xs font-medium ${
              step.completed 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId?: string }>();
  const isEditMode = Boolean(groupId);

  const [activeTab, setActiveTab] = useState<'settings' | 'chat'>('settings');
  const [groupName, setGroupName] = useState('');
  
  // Data State
  const [selectedTeachers, setSelectedTeachers] = useState<ApiUser[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<ApiUser[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ApiCourse[]>([]);
  const [teamLeaders, setTeamLeaders] = useState<ApiUser[]>([]);
  const [employees, setEmployees] = useState<ApiUser[]>([]);
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  
  // Filter States
  const [filterDesignation, setFilterDesignation] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [teamLeaderSearch, setTeamLeaderSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  

  // View States
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const [chatMembers, setChatMembers] = useState<ChatMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { accessToken: token, user: currentUser } = useSelector((state: RootState) => state.auth);
  const isAdmin = currentUser?.role === 'admin';
  const isTeamLead = currentUser?.role === 'team-leader';

  const buildHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  const getDisplayName = (u: ApiUser) => (u.first_name || u.firstName || '') + ' ' + (u.last_name || u.lastName || '');

  // Progress Steps
  const progressSteps = useMemo(() => [
    { label: 'Group name entered', completed: groupName.trim().length > 0 },
    { label: 'Course selected', completed: selectedCourses.length > 0 },
    { label: 'Team leaders assigned', completed: selectedTeachers.length > 0 || isTeamLead },
    { label: 'Employees added', completed: selectedStudents.length > 0 },
  ], [groupName, selectedCourses, selectedTeachers, selectedStudents, isTeamLead]);

  // --- Effects ---
  useEffect(() => {
    const leaders: ChatMember[] = selectedTeachers.map(u => ({ id: u.id, name: getDisplayName(u), role: 'team-leader', email: u.email, avatar: u.profile_image }));
    const students: ChatMember[] = selectedStudents.map(u => ({ id: u.id, name: getDisplayName(u), role: 'employee', email: u.email, avatar: u.profile_image }));
    setChatMembers([...leaders, ...students]);
  }, [selectedTeachers, selectedStudents]);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const headers = buildHeaders();
        const commonPromises = [fetch(`${API_BASE}/users/employees/`, { headers }), fetch(`${API_BASE}/courses/`, { headers })];
        if (isAdmin) commonPromises.push(fetch(`${API_BASE}/users/team_leaders/`, { headers }));

        const responses = await Promise.all(commonPromises);
        const empJson = normalizeListResponse<ApiUser>(await responses[0].json());
        const courseJson = normalizeListResponse<ApiCourse>(await responses[1].json());
        const tlJson = isAdmin ? normalizeListResponse<ApiUser>(await responses[2].json()) : [];

        if (!mounted) return;
        setEmployees(empJson || []); setCourses(courseJson || []); if (isAdmin) setTeamLeaders(tlJson || []);

        if (isEditMode && groupId) {
          const groupResp = await fetch(`${API_BASE}/groups/${groupId}/`, { headers });
          if (!groupResp.ok) throw new Error("Failed");
          const groupData = await groupResp.json();
          if (!mounted) return;

          setGroupName(groupData.name || '');
          const mapIds = (l: any[]) => l.map((x: any) => typeof x === 'number' ? x : x.id);
          
          if (isAdmin) setSelectedTeachers(tlJson.filter((u: ApiUser) => mapIds(groupData.team_leaders || []).includes(u.id)));
          else if (isTeamLead && currentUser) setSelectedTeachers([{ id: currentUser.id!, email: currentUser.email, role: currentUser.role, first_name: currentUser.first_name, last_name: currentUser.last_name } as ApiUser]);

          setSelectedStudents(empJson.filter((u: ApiUser) => mapIds(groupData.employees || []).includes(u.id)));
          if (groupData.course) {
             const cId = typeof groupData.course === 'number' ? groupData.course : groupData.course.id;
             setSelectedCourses(courseJson.filter((c: ApiCourse) => c.id === cId));
          }
        }
      } catch (err: any) { console.error(err); } finally { if(mounted) setLoading(false); }
    };
    if (isAdmin || isTeamLead) fetchAll(); else setLoading(false);
    return () => { mounted = false; };
  }, [groupId, isEditMode, token, isAdmin, isTeamLead, currentUser]);

  // --- Handlers ---
  const toggleUser = (user: ApiUser, list: ApiUser[], setList: any) => setList((prev: any[]) => prev.find(u => u.id === user.id) ? prev.filter(u => u.id !== user.id) : [...prev, user]);
  const toggleCourse = (course: ApiCourse) => setSelectedCourses(prev => prev.find(c => c.id === course.id) ? [] : [course]);
  
  const handleSubmit = async () => {
    if (!groupName.trim()) return;
    setSaving(true);
    const payload: any = { name: groupName.trim(), employees: selectedStudents.map(s => s.id), course: selectedCourses[0]?.id || null };
    if (isAdmin) payload.team_leaders = selectedTeachers.map(t => t.id);
    else if (isTeamLead && !isEditMode && currentUser?.id) payload.team_leaders = [currentUser.id];

    try {
      const url = isEditMode ? `${API_BASE}/groups/${groupId}/` : `${API_BASE}/groups/`;
      const method = isEditMode ? 'PATCH' : 'POST';
      const resp = await fetch(url, { method, headers: buildHeaders(), body: JSON.stringify(payload) });
      if (resp.ok) navigate("/lms/groups");
    } catch (e) { alert("Network error"); } finally { setSaving(false); }
  };

  const selectAllEmployees = () => {
    setSelectedStudents(filteredEmployees);
  };

  const deselectAllEmployees = () => {
    setSelectedStudents([]);
  };

  // --- Filtering Logic ---
  const uniqueDesignations = useMemo(() => {
    const list = [...teamLeaders, ...employees].map(u => u.designation).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [teamLeaders, employees]);

  const uniqueDepartments = useMemo(() => {
    const list = [...teamLeaders, ...employees].map(u => u.department).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [teamLeaders, employees]);

  const filterUsers = (users: ApiUser[]) => {
    return users.filter(u => {
      const nameMatch = getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const desigMatch = filterDesignation === 'all' || u.designation === filterDesignation;
      const deptMatch = filterDepartment === 'all' || u.department === filterDepartment;
      const selectedMatch = !showSelectedOnly || selectedStudents.some(s => s.id === u.id) || selectedTeachers.some(t => t.id === u.id);
      return nameMatch && desigMatch && deptMatch && selectedMatch;
    });
  };

  const filteredTeamLeaders = filterUsers(teamLeaders).filter(u => {
    const localMatch = getDisplayName(u).toLowerCase().includes(teamLeaderSearch.toLowerCase()) || 
                       u.email.toLowerCase().includes(teamLeaderSearch.toLowerCase()) ||
                       u.designation?.toLowerCase().includes(teamLeaderSearch.toLowerCase()) ||
                       u.department?.toLowerCase().includes(teamLeaderSearch.toLowerCase());
    return localMatch;
  });
  
  const filteredEmployees = filterUsers(employees).filter(u => {
    const localMatch = getDisplayName(u).toLowerCase().includes(employeeSearch.toLowerCase()) || 
                       u.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                       u.designation?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                       u.department?.toLowerCase().includes(employeeSearch.toLowerCase());
    return localMatch;
  });
  
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.description?.toLowerCase().includes(courseSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Layers className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans transition-colors duration-500">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC02di00aC0ydjRoMnptLTYgNmgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none" />
      
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/lms/groups')} 
                className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ArrowLeft size={22} />
              </button>
              <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-40" />
                  <div className="relative p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    {isEditMode ? <Settings size={20} className="text-white" /> : <Sparkles size={20} className="text-white" />}
                  </div>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {isEditMode ? 'Manage Group' : 'Create New Group'}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    {isEditMode ? 'Update group settings and members' : 'Set up a new employee learning group'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            {isEditMode && (
              <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  onClick={() => setActiveTab('chat')} 
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'chat' 
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquare size={16} />
                  Discussion
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/lms/groups')} 
                className="hidden md:inline-flex px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={saving || !groupName.trim()} 
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
                  saving || !groupName.trim() 
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/25 active:scale-95'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEditMode ? 'Save Changes' : 'Create Group'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 pb-24">
        
        {(activeTab === 'settings' || !isEditMode) && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* --- LEFT SIDEBAR (Configuration) --- */}
            <div className="xl:col-span-3 space-y-6">
              
              {/* Progress Card */}
              <FormProgress steps={progressSteps} />
                
              {/* Group Details Input */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                  <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                    <Target size={14} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  Group Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">
                      Group Name <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={groupName} 
                      onChange={(e) => setGroupName(e.target.value)} 
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all outline-none placeholder-slate-400" 
                      placeholder="e.g. Frontend Cohort 2024" 
                      disabled={saving} 
                    />
                  </div>
                  {groupName.trim() && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={14} />
                      <span>Group name looks good!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Items Preview */}
              <SelectedPreview
                title="Selected Leaders"
                items={selectedTeachers.map(t => ({ id: t.id, name: getDisplayName(t), image: t.profile_image }))}
                onRemove={(id) => setSelectedTeachers(prev => prev.filter(t => t.id !== id))}
                icon={<UserCheck size={16} className="text-white" />}
                emptyMessage="No leaders selected"
                gradient="from-blue-500 to-cyan-500"
              />

              <SelectedPreview
                title="Selected Employees"
                items={selectedStudents.map(s => ({ id: s.id, name: getDisplayName(s), image: s.profile_image }))}
                onRemove={(id) => setSelectedStudents(prev => prev.filter(s => s.id !== id))}
                icon={<GraduationCap size={16} className="text-white" />}
                emptyMessage="No employees selected"
                gradient="from-emerald-500 to-teal-500"
              />

              <SelectedPreview
                title="Selected Course"
                items={selectedCourses.map(c => ({ id: c.id, name: c.title }))}
                onRemove={(id) => setSelectedCourses(prev => prev.filter(c => c.id !== id))}
                icon={<BookOpen size={16} className="text-white" />}
                emptyMessage="No course selected"
                gradient="from-purple-500 to-pink-500"
              />
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="xl:col-span-9 space-y-6">
              
              {/* Global Filter Bar */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Search size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Filter & Search Members
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        showSelectedOnly
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {showSelectedOnly ? <Eye size={16} /> : <EyeOff size={16} />}
                      {showSelectedOnly ? 'Showing Selected' : 'Show Selected Only'}
                    </button>
                    {(filterDesignation !== 'all' || filterDepartment !== 'all' || searchQuery) && (
                      <button 
                        onClick={() => { setFilterDesignation('all'); setFilterDepartment('all'); setSearchQuery(''); setShowSelectedOnly(false); }} 
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                      >
                        <X size={14} /> Clear Filters
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search name or email..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                    />
                  </div>
                  {/* Designation */}
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={filterDesignation} 
                      onChange={(e) => setFilterDesignation(e.target.value)} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none cursor-pointer transition-all"
                    >
                      <option value="all">All Designations</option>
                      {uniqueDesignations.map((d: any) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                  {/* Department */}
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={filterDepartment} 
                      onChange={(e) => setFilterDepartment(e.target.value)} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white appearance-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none cursor-pointer transition-all"
                    >
                      <option value="all">All Departments</option>
                      {uniqueDepartments.map((d: any) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* TEAM LEADERS LIST (Admin Only) */}
                {isAdmin && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                            <UserCheck size={18} className="text-white" />
                          </div>
                          <div>
                            <h2 className="font-bold text-slate-900 dark:text-white">Team Leaders</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{filteredTeamLeaders.length} available</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 text-sm font-bold bg-blue-500 text-white rounded-full shadow-md">
                          {selectedTeachers.length}
                        </span>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search team leaders..."
                          value={teamLeaderSearch}
                          onChange={(e) => setTeamLeaderSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar space-y-3">
                      {filteredTeamLeaders.map(l => {
                        const isSelected = selectedTeachers.some(t => t.id === l.id);
                        return (
                          <div 
                            key={l.id} 
                            onClick={() => toggleUser(l, selectedTeachers, setSelectedTeachers)} 
                            className={`group flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                                : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden transition-all ${
                              isSelected 
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {l.profile_image ? (
                                <img src={l.profile_image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                (l.first_name?.[0] || 'U')
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
                                {getDisplayName(l)}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="truncate">{l.designation || 'Leader'}</span>
                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                                <span className="truncate">{l.department || 'General'}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1 flex items-center gap-1">
                                <Mail size={10} />
                                {l.email}
                              </p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-slate-300 dark:border-slate-600 group-hover:border-blue-400'
                            }`}>
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          </div>
                        );
                      })}
                      {filteredTeamLeaders.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <UserCheck className="w-8 h-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">No leaders match your filters</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* COURSES LIST */}
                <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden ${!isAdmin ? 'lg:col-span-2' : ''}`}>
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                          <BookOpen size={18} className="text-white" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900 dark:text-white">Assign Course</h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{courses.length} courses available</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-sm font-bold bg-purple-500 text-white rounded-full shadow-md">
                        {selectedCourses.length}
                      </span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                    {filteredCourses.map(c => {
                      const isSelected = selectedCourses.some(x => x.id === c.id);
                      return (
                        <div 
                          key={c.id} 
                          onClick={() => toggleCourse(c)}
                          className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
                              : 'border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Award size={14} className={isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'} />
                                <h3 className={`font-bold text-sm ${isSelected ? 'text-purple-900 dark:text-purple-100' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {c.title}
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {c.description || "No description available for this course."}
                              </p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected 
                                ? 'bg-purple-500 border-purple-500' 
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {filteredCourses.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">No courses found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EMPLOYEES LIST - Full Width */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                        <GraduationCap size={18} className="text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 dark:text-white">Select Employees</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {filteredEmployees.length} employees available • {selectedStudents.length} selected
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={selectAllEmployees}
                        className="px-4 py-2 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        Select All ({filteredEmployees.length})
                      </button>
                      <button
                        onClick={deselectAllEmployees}
                        className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        Deselect All
                      </button>
                      <span className="px-3 py-1.5 text-sm font-bold bg-emerald-500 text-white rounded-full shadow-md">
                        {selectedStudents.length}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredEmployees.map(s => {
                      const isSelected = selectedStudents.some(x => x.id === s.id);
                      return (
                        <div 
                          key={s.id} 
                          onClick={() => toggleUser(s, selectedStudents, setSelectedStudents)} 
                          className={`group flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' 
                              : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}>
                            {s.profile_image ? (
                              <img src={s.profile_image} className="w-full h-full object-cover" alt="" />
                            ) : (
                              (s.first_name?.[0] || 'U')
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'}`}>
                              {getDisplayName(s)}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {s.department || 'General Department'}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-400'
                          }`}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {filteredEmployees.length === 0 && (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">No employees match your current filters</p>
                      <button
                        onClick={() => { setFilterDesignation('all'); setFilterDepartment('all'); setSearchQuery(''); setEmployeeSearch(''); }}
                        className="mt-4 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CHAT TAB --- */}
        {activeTab === 'chat' && isEditMode && currentUser && groupId && (
          <div className="h-[calc(100vh-180px)] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
            <GroupChat 
              groupId={groupId}
              groupName={groupName}
              members={chatMembers}
              token={token}
              currentUser={{ id: currentUser.id || 0, name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`, role: currentUser.role }} 
            />
          </div>
        )}
      </div>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
};

export default CreateGroupPage;
