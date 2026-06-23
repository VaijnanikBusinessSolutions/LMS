


// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useSelector } from 'react-redux';
// import { 
//   BookOpen, Clock, Award, Bell, CheckCircle2, ChevronRight, 
//   TrendingUp, AlertCircle, Target, BarChart2, Play, Calendar,
//   Layers, ArrowUpRight, Flame
// } from 'lucide-react';
// import { 
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
//   XAxis, YAxis, AreaChart, Area, CartesianGrid, BarChart, Bar
// } from 'recharts';

// import type { RootState } from '../../store/store'; 

// // (Types and Interfaces kept exactly as your original)

// export default function DashboardView() {
//   const { accessToken, user } = useSelector((state: RootState) => state.auth);
  
//   const [dashboardData, setDashboardData] = useState<DashboardAPIResponse | null>(null);
//   const [competencyData, setCompetencyData] = useState<CompetencyAssessment[]>([]);
//   const [latestCompetency, setLatestCompetency] = useState<CompetencyAssessment | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'Current' | 'Completed' | 'Mandatory'>('Current');

//   // (Fetch logic kept exactly as your original)
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!accessToken) {
//         setError("No access token found. Please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const dashRes = await fetch('http://127.0.0.1:8000/lms/dashboard/', {
//           method: 'GET',
//           headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
//         });

//         if (!dashRes.ok) throw new Error("Failed to load dashboard data");
//         const dashResult: DashboardAPIResponse = await dashRes.json();
//         setDashboardData(dashResult);

//         const compRes = await fetch('http://127.0.0.1:8000/lms/competency/', {
//             method: 'GET',
//             headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
//         });

//         if (compRes.ok) {
//             const compResult: CompetencyAssessment[] = await compRes.json();
//             setCompetencyData(compResult);
//             if (compResult.length > 0) setLatestCompetency(compResult[0]);
//         }
//         setError(null);
//       } catch (err: any) {
//         setError("Failed to load dashboard data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [accessToken]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4">
//         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-muted font-medium animate-pulse">Syncing with LMS...</p>
//       </div>
//     );
//   }

//   if (error || !dashboardData) {
//     return (
//       <div className="min-h-screen bg-background flex justify-center items-center">
//         <div className="text-center bg-surface p-8 rounded-2xl shadow-sm border border-border">
//             <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
//             <h2 className="text-xl font-bold text-text mb-2">Something went wrong</h2>
//             <p className="text-muted mb-6">{error || "No data received"}</p>
//             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-xl font-semibold">Retry</button>
//         </div>
//       </div>
//     );
//   }

//   // (Data processing logic kept exactly as your original)
//   const filteredCourses = dashboardData.courses.filter(c => c.type === activeTab);

//   const pieChartData = [
//     { name: 'Completed', value: dashboardData.stats.completed, color: '#10b981' }, 
//     { name: 'In Progress', value: dashboardData.courses.filter(c => c.type === 'Current').length, color: 'rgb(var(--brand-primary))' }, 
//     { name: 'Mandatory', value: dashboardData.courses.filter(c => c.type === 'Mandatory').length, color: '#f59e0b' } 
//   ].filter(item => item.value > 0);

//   const growthChartData = [...competencyData].reverse().map((item, index) => ({
//       name: `#${index + 1}`,
//       score: item.score,
//       total: item.totalPossible
//   }));

//   const weeklyData = [
//     { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 3 }, { day: 'Wed', hours: 1 },
//     { day: 'Thu', hours: 4 }, { day: 'Fri', hours: 2 }, { day: 'Sat', hours: 5 }, { day: 'Sun', hours: 3 },
//   ];

//   return (
//     <div className="min-h-screen bg-background text-text transition-colors duration-300">
      
//       {/* ================= HEADER ================= */}
//       <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border px-6 py-4">
//         <div className="max-w-[1800px] mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-4">
//              <div className="bg-primary text-white p-2.5 rounded-xl shadow-lg">
//                 <BookOpen size={22} />
//              </div>
//              <div>
//                 <span className="font-bold text-xl text-text tracking-tight">Welcome back, {user?.first_name}!</span>
//              </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="hidden md:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
//                <Flame size={16} className="text-orange-500" />
//                <span className="text-sm font-semibold text-text">5 Day Streak!</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ================= BENTO GRID ================= */}
//       <div className="max-w-[1800px] mx-auto p-6">
//         <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
          
//           {/* Stats Cards */}
//           {[
//             { label: 'Total Courses', val: dashboardData.stats.total_courses, icon: BookOpen, bg: 'bg-blue-500/10', text: 'text-blue-500' },
//             { label: 'Completed', val: dashboardData.stats.completed, icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
//             { label: 'Certificates', val: dashboardData.stats.certificates, icon: Award, bg: 'bg-violet-500/10', text: 'text-violet-500' },
//             { label: 'Hours Spent', val: `${dashboardData.stats.hours_spent}h`, icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-500' }
//           ].map((stat, i) => (
//             <div key={i} className="col-span-6 md:col-span-3 row-span-1 bg-surface rounded-3xl p-5 border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start">
//                    <div className={`p-2.5 ${stat.bg} rounded-xl`}><stat.icon size={18} className={stat.text} /></div>
//                    {i === 0 && <ArrowUpRight size={16} className="text-emerald-500" />}
//                    {i === 1 && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">+2 this week</span>}
//                 </div>
//                 <div>
//                    <h4 className="text-3xl font-extrabold text-text">{stat.val}</h4>
//                    <p className="text-xs font-medium text-muted">{stat.label}</p>
//                 </div>
//             </div>
//           ))}

//           {/* Growth Chart */}
//           <div className="col-span-12 md:col-span-6 row-span-2 bg-surface rounded-3xl p-6 border border-border shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                  <div className="flex items-center gap-2">
//                     <div className="p-2 bg-emerald-500/10 rounded-xl"><BarChart2 size={18} className="text-emerald-500" /></div>
//                     <div>
//                         <h3 className="text-sm font-bold text-text">Growth Trajectory</h3>
//                         <p className="text-[10px] text-muted">Score progression</p>
//                     </div>
//                  </div>
//               </div>
//               <div className="h-[180px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={growthChartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
//                     <defs>
//                       <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" vertical={false} />
//                     <XAxis dataKey="name" tick={{fontSize: 10, fill: 'currentColor'}} className="text-muted" axisLine={false} tickLine={false} />
//                     <YAxis tick={{fontSize: 10, fill: 'currentColor'}} className="text-muted" axisLine={false} tickLine={false} />
//                     <RechartsTooltip contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: '12px', color: 'var(--text-main)'}} />
//                     <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fill="url(#colorScore)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//           </div>

//           {/* This Week */}
//           <div className="col-span-12 md:col-span-6 row-span-2 bg-surface rounded-3xl p-5 border border-border shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                  <div className="p-2 bg-violet-500/10 rounded-xl"><TrendingUp size={16} className="text-violet-600" /></div>
//                  <h3 className="text-sm font-bold text-text">This Week</h3>
//               </div>
//               <div className="h-[160px] w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={weeklyData}>
//                     <XAxis dataKey="day" tick={{fontSize: 9, fill: 'currentColor'}} className="text-muted" axisLine={false} tickLine={false} />
//                     <YAxis hide />
//                     <Bar dataKey="hours" fill="rgb(var(--brand-primary))" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <div className="text-center mt-2">
//                  <span className="text-2xl font-extrabold text-text">20h</span>
//                  <p className="text-[10px] text-muted">Total this week</p>
//               </div>
//           </div>

//           {/* (Overview, Deadlines, Calendar, Continue Learning logic and layout preserved with surface/border/text classes) */}
//           <div className="col-span-6 md:col-span-3 row-span-2 bg-surface rounded-3xl p-5 border border-border shadow-sm">
//               <h3 className="text-sm font-bold text-text mb-2">Overview</h3>
//               <div className="h-[140px] w-full relative">
//                  <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                        <Pie data={pieChartData} innerRadius={40} outerRadius={55} dataKey="value" stroke="none">
//                           {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
//                        </Pie>
//                     </PieChart>
//                  </ResponsiveContainer>
//                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-extrabold text-text">{dashboardData.stats.total_courses}</div>
//               </div>
//           </div>

//           <div className="col-span-6 md:col-span-3 row-span-2 bg-surface rounded-3xl p-5 border border-border shadow-sm">
//               <h3 className="text-sm font-bold text-text mb-3">Deadlines</h3>
//               <div className="space-y-2">
//                 {dashboardData.deadlines.map(item => (
//                   <div key={item.id} className="flex gap-2 items-center p-2 hover:bg-background rounded-xl">
//                     <div className="bg-background border border-border text-center p-1 rounded-lg min-w-[36px]">
//                       <span className="block text-[8px] font-bold text-muted">{new Date(item.date).getDate()}</span>
//                     </div>
//                     <p className="text-xs font-semibold text-text truncate">{item.course}</p>
//                   </div>
//                 ))}
//               </div>
//           </div>

//           <div className="col-span-12 md:col-span-3 row-span-2 bg-surface rounded-3xl p-5 border border-border shadow-sm">
//               <h3 className="text-sm font-bold text-text mb-3">Calendar</h3>
//               <MiniCalendar />
//           </div>

//           <div className="col-span-12 md:col-span-3 flex flex-col gap-4 row-span-2">
//             <div className="bg-slate-900 rounded-3xl p-5 text-white flex items-center justify-between cursor-pointer hover:shadow-lg transition-all border border-white/5">
//                <div>
//                   <p className="text-xs text-slate-400 mb-1">Continue Learning</p>
//                   <h3 className="text-sm font-bold">React Advanced Patterns</h3>
//                   <div className="flex items-center gap-2 mt-2">
//                      <div className="h-1 w-16 bg-white/20 rounded-full"><div className="h-full w-[65%] bg-emerald-400 rounded-full"></div></div>
//                      <span className="text-[10px] text-slate-400">65%</span>
//                   </div>
//                </div>
//                <div className="p-3 bg-white/10 rounded-xl"><Play size={20} /></div>
//             </div>

//             <div className="flex-1 bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
//                <div className="relative z-10 flex flex-col justify-between h-full">
//                   <div>
//                     <div className="flex items-center gap-2 mb-2"><Target size={18}/><span className="text-xs font-semibold opacity-80 uppercase">Competency</span></div>
//                     <h2 className="text-2xl font-bold leading-tight">{latestCompetency?.level?.title || "Start Assessment"}</h2>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-[10px] font-bold opacity-80"><span>Progress</span><span>{latestCompetency ? Math.round((latestCompetency.score/latestCompetency.totalPossible)*100) : 0}%</span></div>
//                     <div className="h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style={{width: `${latestCompetency ? (latestCompetency.score/latestCompetency.totalPossible)*100 : 0}%`}}></div></div>
//                   </div>
//                </div>
//             </div>
//           </div>

//           {/* Table preserved exactly as original with theme classes */}
//           <div className="col-span-12 row-span-3 bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
//              <div className="p-5 border-b border-border flex justify-between items-center bg-surface">
//                 <div className="flex items-center gap-2">
//                    <div className="p-2 bg-primary/10 rounded-xl"><Layers size={16} className="text-primary" /></div>
//                    <h3 className="text-sm font-bold text-text">My Courses</h3>
//                 </div>
//                 <div className="flex bg-background p-1 rounded-xl border border-border">
//                   {(['Current', 'Mandatory', 'Completed'] as const).map((tab) => (
//                     <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-surface text-primary shadow-sm' : 'text-muted'}`}>{tab}</button>
//                   ))}
//                 </div>
//              </div>
//              <div className="overflow-auto max-h-[340px]">
//                 <table className="w-full text-left">
//                   <thead className="bg-background text-[10px] font-bold text-muted uppercase tracking-wider sticky top-0 border-b border-border">
//                     <tr><th className="px-5 py-3">Course</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3 hidden md:table-cell">Lessons</th><th className="px-5 py-3 text-right">Action</th></tr>
//                   </thead>
//                   <tbody className="divide-y divide-border">
//                     {filteredCourses.map((course) => (
//                       <tr key={course.id} className="hover:bg-muted/5 transition-colors">
//                         <td className="px-5 py-4"><p className="font-semibold text-text text-sm">{course.name}</p></td>
//                         <td className="px-5 py-4"><div className="h-1.5 w-24 bg-background border border-border rounded-full overflow-hidden"><div style={{width: `${course.progress}%`}} className="h-full bg-primary transition-all"></div></div></td>
//                         <td className="px-5 py-4 hidden md:table-cell text-sm font-semibold text-muted">{course.lessons}</td>
//                         <td className="px-5 py-4 text-right"><button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"><ChevronRight size={16} /></button></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//              </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// // ================= MINI CALENDAR (Theme Aligned) =================

// const MiniCalendar = () => {
//    const today = new Date();
//    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
//    const currentDay = today.getDate();
//    const month = today.toLocaleString('default', { month: 'short' });
//    const year = today.getFullYear();
   
//    const firstDay = new Date(year, today.getMonth(), 1).getDay();
//    const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
   
//    const calendarDays: (number | null)[] = [];
//    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
//    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

//    return (
//       <div>
//          <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-text">{month} {year}</span></div>
//          <div className="grid grid-cols-7 gap-1 text-center">
//             {days.map((day, i) => <span key={i} className="text-[9px] font-bold text-muted py-1">{day}</span>)}
//             {calendarDays.slice(0, 35).map((day, i) => (
//                <span key={i} className={`text-[10px] py-1 rounded-md transition-colors ${day === currentDay ? 'bg-primary text-white font-bold' : day ? 'text-text hover:bg-primary/10 cursor-pointer' : ''}`}>{day}</span>
//             ))}
//          </div>
//       </div>
//    );
// };





import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BookOpen, Clock, Award, CheckCircle2, ChevronRight,
  TrendingUp, AlertCircle, Target, BarChart2, Play,
  Layers, ArrowUpRight, Flame
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  XAxis, YAxis, AreaChart, Area, CartesianGrid, BarChart, Bar
} from 'recharts';

import type { RootState } from '../../store/store';

// --- Types ---
interface DashboardStats {
  total_courses: number;
  completed: number;
  certificates: number;
  hours_spent: number;
}

interface Deadline {
  id: number;
  course: string;
  date: string;
}

interface Course {
  id: number;
  name: string;
  progress: number;
  lessons: number;
  type: 'Current' | 'Completed' | 'Mandatory';
}

interface DashboardAPIResponse {
  stats: DashboardStats;
  deadlines: Deadline[];
  courses: Course[];
}

interface CompetencyAssessment {
  id: number;
  score: number;
  totalPossible: number;
  level: { title: string };
}

// --- DUMMY DATA ---
const DUMMY_DASHBOARD: DashboardAPIResponse = {
  stats: {
    total_courses: 12,
    completed: 8,
    certificates: 5,
    hours_spent: 42
  },
  deadlines: [
    { id: 1, course: "React Advanced Patterns", date: "2026-02-15" },
    { id: 2, course: "UI/UX Case Studies", date: "2026-02-20" },
    { id: 3, course: "Backend Node.js API", date: "2026-03-01" },
  ],
  courses: [
    { id: 1, name: "React Advanced Patterns", progress: 65, lessons: 12, type: 'Current' },
    { id: 2, name: "State Management Redux", progress: 40, lessons: 8, type: 'Current' },
    { id: 3, name: "Compliance & Safety", progress: 0, lessons: 4, type: 'Mandatory' },
    { id: 4, name: "Data Structures 101", progress: 100, lessons: 15, type: 'Completed' },
    { id: 5, name: "Introduction to CSS", progress: 100, lessons: 10, type: 'Completed' },
  ]
};

const DUMMY_COMPETENCY: CompetencyAssessment[] = [
  { id: 1, score: 85, totalPossible: 100, level: { title: "Professional" } },
  { id: 2, score: 72, totalPossible: 100, level: { title: "Intermediate" } },
  { id: 3, score: 60, totalPossible: 100, level: { title: "Beginner" } },
  { id: 4, score: 45, totalPossible: 100, level: { title: "Novice" } },
];

export default function DashboardView() {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);

  const [dashboardData, setDashboardData] = useState<DashboardAPIResponse | null>(null);
  const [competencyData, setCompetencyData] = useState<CompetencyAssessment[]>([]);
  const [latestCompetency, setLatestCompetency] = useState<CompetencyAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Current' | 'Completed' | 'Mandatory'>('Current');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setDashboardData(DUMMY_DASHBOARD);
        setCompetencyData(DUMMY_COMPETENCY);
        setLatestCompetency(DUMMY_COMPETENCY[0]);
        setError(null);
      } catch {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgb(var(--brand-primary))', borderTopColor: 'transparent' }} />
        <p className="font-medium animate-pulse" style={{ color: 'rgb(var(--text-muted))' }}>Syncing with LMS...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: 'rgb(var(--bg-main))' }}>
        <div className="text-center p-8 rounded-2xl shadow-sm border" style={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'rgb(var(--border-main))' }}>
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'rgb(var(--text-main))' }}>Something went wrong</h2>
          <p className="mb-6" style={{ color: 'rgb(var(--text-muted))' }}>{error || "No data received"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 text-white rounded-xl font-semibold" style={{ backgroundColor: 'rgb(var(--brand-primary))' }}>Retry</button>
        </div>
      </div>
    );
  }

  const filteredCourses = dashboardData.courses.filter(c => c.type === activeTab);

  const pieChartData = [
    { name: 'Completed', value: dashboardData.stats.completed, color: '#10b981' },
    { name: 'In Progress', value: dashboardData.courses.filter(c => c.type === 'Current').length, color: '#3b82f6' },
    { name: 'Mandatory', value: dashboardData.courses.filter(c => c.type === 'Mandatory').length, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  const growthChartData = [...competencyData].reverse().map((item, index) => ({
    name: `#${index + 1}`,
    score: item.score,
    total: item.totalPossible
  }));

  const weeklyData = [
    { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 3 }, { day: 'Wed', hours: 1 },
    { day: 'Thu', hours: 4 }, { day: 'Fri', hours: 2 }, { day: 'Sat', hours: 5 }, { day: 'Sun', hours: 3 },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'rgb(var(--bg-main))', color: 'rgb(var(--text-main))' }}>

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4"
        style={{ backgroundColor: 'rgba(var(--bg-card), 0.8)', borderColor: 'rgb(var(--border-main))' }}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl shadow-lg text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight" style={{ color: 'rgb(var(--text-main))' }}>
                Welcome back, {user?.first_name || 'Student'}!
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))',
                borderColor: 'rgba(245,158,11,0.3)',
              }}>
              <Flame size={16} className="text-orange-500" />
              <span className="text-sm font-semibold" style={{ color: 'rgb(var(--text-main))' }}>5 Day Streak!</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= BENTO GRID ================= */}
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">

          {/* ========== BOLD STAT CARDS ========== */}
          {[
            {
              label: 'Total Courses', val: dashboardData.stats.total_courses, icon: BookOpen,
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              shadow: 'rgba(59, 130, 246, 0.35)',
              badge: <ArrowUpRight size={14} />
            },
            {
              label: 'Completed', val: dashboardData.stats.completed, icon: CheckCircle2,
              gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              shadow: 'rgba(16, 185, 129, 0.35)',
              badge: <span className="text-[9px] font-bold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md">+2 this week</span>
            },
            {
              label: 'Certificates', val: dashboardData.stats.certificates, icon: Award,
              gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              shadow: 'rgba(139, 92, 246, 0.35)',
              badge: null
            },
            {
              label: 'Hours Spent', val: `${dashboardData.stats.hours_spent}h`, icon: Clock,
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              shadow: 'rgba(245, 158, 11, 0.35)',
              badge: null
            }
          ].map((stat, i) => (
            <div
              key={i}
              className="col-span-6 md:col-span-3 row-span-1 rounded-2xl p-5 flex flex-col justify-between group cursor-default relative overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: stat.gradient,
                boxShadow: `0 10px 30px -8px ${stat.shadow}`,
                color: '#fff',
              }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-125"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full opacity-10 pointer-events-none transition-transform duration-700 group-hover:scale-150"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

              {/* Shine on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 50%, transparent 55%)' }} />

              <div className="flex justify-between items-start relative z-10">
                <div className="p-2 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                  <stat.icon size={18} className="text-white drop-shadow-sm" />
                </div>
                {stat.badge && <div className="text-white/80">{stat.badge}</div>}
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-extrabold text-white drop-shadow-sm">{stat.val}</h4>
                <p className="text-[11px] font-semibold text-white/70 mt-0.5">{stat.label}</p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1), transparent)' }} />
            </div>
          ))}

          {/* ========== GROWTH CHART ========== */}
          <div className="col-span-12 md:col-span-6 row-span-2 rounded-2xl p-6 border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))' }}>
                  <BarChart2 size={18} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--text-main))' }}>Growth Trajectory</h3>
                  <p className="text-[10px]" style={{ color: 'rgb(var(--text-muted))' }}>Score progression</p>
                </div>
              </div>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border-main))" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgb(var(--text-muted))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'rgb(var(--text-muted))' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(var(--bg-card), 0.95)',
                      border: '1px solid rgba(var(--border-main), 0.5)',
                      borderRadius: '12px',
                      color: 'rgb(var(--text-main))',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)'
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="url(#lineStroke)" strokeWidth={3} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ========== THIS WEEK ========== */}
          <div className="col-span-12 md:col-span-6 row-span-2 rounded-2xl p-5 border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' }}>
                <TrendingUp size={16} className="text-violet-500" />
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--text-main))' }}>This Week</h3>
            </div>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'rgb(var(--text-muted))' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(var(--bg-card), 0.95)',
                      borderRadius: '12px',
                      border: 'none',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)'
                    }}
                  />
                  <Bar dataKey="hours" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2 relative z-10">
              <span className="text-2xl font-extrabold" style={{ color: 'rgb(var(--text-main))' }}>20h</span>
              <p className="text-[10px]" style={{ color: 'rgb(var(--text-muted))' }}>Total this week</p>
            </div>
          </div>

          {/* ========== OVERVIEW PIE ========== */}
          <div className="col-span-6 md:col-span-3 row-span-2 rounded-2xl p-5 border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

            <h3 className="text-sm font-bold mb-2 relative z-10" style={{ color: 'rgb(var(--text-main))' }}>Overview</h3>
            <div className="h-[140px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieChartData} innerRadius={40} outerRadius={55} dataKey="value" stroke="none" animationDuration={1200}>
                    {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-extrabold"
                style={{ color: 'rgb(var(--text-main))' }}>
                {dashboardData.stats.total_courses}
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 mt-1 relative z-10">
              {pieChartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}50` }} />
                    <span style={{ color: 'rgb(var(--text-muted))' }}>{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: 'rgb(var(--text-main))' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ========== DEADLINES ========== */}
          <div className="col-span-6 md:col-span-3 row-span-2 rounded-2xl p-5 border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />

            <h3 className="text-sm font-bold mb-3 relative z-10 flex items-center gap-2" style={{ color: 'rgb(var(--text-main))' }}>
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping absolute" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </div>
              Deadlines
            </h3>
            <div className="space-y-2 relative z-10">
              {dashboardData.deadlines.map((item, index) => {
                const deadlineColors = ['#ef4444', '#f59e0b', '#3b82f6'];
                const deadlineBgs = ['rgba(239,68,68,0.1)', 'rgba(245,158,11,0.1)', 'rgba(59,130,246,0.1)'];
                return (
                  <div key={item.id}
                    className="flex gap-3 items-center p-2.5 rounded-xl transition-all duration-300 group cursor-default hover:translate-x-1"
                    style={{ backgroundColor: deadlineBgs[index % 3] }}>
                    <div className="text-center p-1.5 rounded-lg min-w-[38px] border"
                      style={{
                        background: deadlineColors[index % 3],
                        borderColor: 'transparent',
                        color: '#fff',
                      }}>
                      <span className="block text-[10px] font-extrabold">{new Date(item.date).getDate()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'rgb(var(--text-main))' }}>{item.course}</p>
                      <p className="text-[9px] font-medium" style={{ color: 'rgb(var(--text-muted))' }}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========== CALENDAR ========== */}
          <div className="col-span-12 md:col-span-3 row-span-2 rounded-2xl p-5 border backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>
            <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
            <h3 className="text-sm font-bold mb-3 relative z-10 flex items-center gap-2" style={{ color: 'rgb(var(--text-main))' }}>
              <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' }}>
                <Clock size={14} className="text-amber-500" />
              </div>
              Calendar
            </h3>
            <MiniCalendar />
          </div>

          {/* ========== RIGHT COLUMN ACTION CARDS ========== */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4 row-span-2">

            {/* Continue Learning - Dark Card */}
            <div className="rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl border relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderColor: 'rgba(255,255,255,0.08)',
                color: '#fff',
                boxShadow: '0 10px 30px -8px rgba(15,23,42,0.5)',
              }}>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: 'rgba(59,130,246,0.3)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.03) 50%, transparent 55%)' }} />

              <div className="relative z-10">
                <p className="text-[10px] text-slate-400 mb-1 font-medium">Continue Learning</p>
                <h3 className="text-sm font-bold text-white">React Advanced Patterns</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] rounded-full" style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">65%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl relative z-10 transition-all duration-500 group-hover:scale-110"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))', backdropFilter: 'blur(8px)' }}>
                <Play size={20} className="text-blue-400" />
              </div>
            </div>

            {/* Competency Card */}
            <div className="flex-1 rounded-2xl p-6 text-white relative overflow-hidden cursor-default group transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
                boxShadow: '0 10px 30px -8px rgba(236, 72, 153, 0.35)',
              }}>
              {/* Decorative */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-125"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)' }} />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                      <Target size={16} />
                    </div>
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Competency</span>
                  </div>
                  <h2 className="text-2xl font-extrabold leading-tight drop-shadow-sm">{latestCompetency?.level?.title || "Start Assessment"}</h2>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-[10px] font-bold opacity-80">
                    <span>Progress</span>
                    <span>{latestCompetency ? Math.round((latestCompetency.score / latestCompetency.totalPossible) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${latestCompetency ? (latestCompetency.score / latestCompetency.totalPossible) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== COURSE TABLE ========== */}
          <div className="col-span-12 row-span-3 rounded-2xl border backdrop-blur-xl overflow-hidden"
            style={{ backgroundColor: 'rgba(var(--bg-card), 0.7)', borderColor: 'rgba(var(--border-main), 0.5)' }}>

            <div className="p-5 border-b flex justify-between items-center"
              style={{ borderColor: 'rgb(var(--border-main))' }}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))' }}>
                  <Layers size={16} className="text-blue-500" />
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--text-main))' }}>My Courses</h3>
              </div>
              <div className="flex p-1 rounded-xl border backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(var(--bg-main), 0.6)', borderColor: 'rgba(var(--border-main), 0.4)' }}>
                {(['Current', 'Mandatory', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                    style={activeTab === tab
                      ? { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }
                      : { color: 'rgb(var(--text-muted))' }
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-auto max-h-[340px]">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold uppercase tracking-wider sticky top-0 border-b"
                  style={{ backgroundColor: 'rgba(var(--bg-main), 0.8)', borderColor: 'rgb(var(--border-main))', color: 'rgb(var(--text-muted))' }}>
                  <tr>
                    <th className="px-5 py-3">Course</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3 hidden md:table-cell">Lessons</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'rgba(var(--border-main), 0.5)' }}>
                  {filteredCourses.map((course) => {
                    const progressColor = course.progress === 100
                      ? 'linear-gradient(90deg, #10b981, #059669)'
                      : course.progress > 50
                        ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                        : 'linear-gradient(90deg, #f59e0b, #ef4444)';
                    return (
                      <tr key={course.id} className="transition-colors duration-200 group"
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(var(--bg-main), 0.3)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-sm" style={{ color: 'rgb(var(--text-main))' }}>{course.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full overflow-hidden"
                              style={{ backgroundColor: 'rgba(var(--border-main), 0.3)' }}>
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${course.progress}%`, background: progressColor }} />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: 'rgb(var(--text-muted))' }}>{course.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-sm font-semibold" style={{ color: 'rgb(var(--text-muted))' }}>
                          {course.lessons}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
                            style={{
                              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
                              color: '#3b82f6',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                              (e.currentTarget as HTMLElement).style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))';
                              (e.currentTarget as HTMLElement).style.color = '#3b82f6';
                            }}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen size={32} style={{ color: 'rgb(var(--text-muted))' }} className="opacity-30" />
                          <p className="text-sm font-medium" style={{ color: 'rgb(var(--text-muted))' }}>No {activeTab.toLowerCase()} courses found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- CALENDAR SUB-COMPONENT ---
const MiniCalendar = () => {
  const today = new Date();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const currentDay = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' });
  const year = today.getFullYear();

  const firstDay = new Date(year, today.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // Some "active" days for visual interest
  const activeDays = [3, 7, 12, 15, 18, 22, 25];

  return (
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold" style={{ color: 'rgb(var(--text-main))' }}>{month} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => (
          <span key={i} className="text-[9px] font-bold py-1" style={{ color: 'rgb(var(--text-muted))' }}>{day}</span>
        ))}
        {calendarDays.slice(0, 35).map((day, i) => {
          const isToday = day === currentDay;
          const isActive = day !== null && activeDays.includes(day);

          let bg = 'transparent';
          let color = 'rgb(var(--text-main))';
          let shadow = 'none';
          let fontWeight = '500';

          if (isToday) {
            bg = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            color = '#fff';
            shadow = '0 4px 12px rgba(59,130,246,0.4)';
            fontWeight = '800';
          } else if (isActive) {
            bg = 'rgba(59, 130, 246, 0.12)';
            color = '#3b82f6';
            fontWeight = '700';
          }

          return (
            <span
              key={i}
              className={`text-[10px] py-1.5 rounded-lg transition-all duration-200 ${day ? 'cursor-pointer hover:scale-110' : ''}`}
              style={{
                background: bg,
                color: day ? color : 'transparent',
                boxShadow: shadow,
                fontWeight: fontWeight,
              }}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};