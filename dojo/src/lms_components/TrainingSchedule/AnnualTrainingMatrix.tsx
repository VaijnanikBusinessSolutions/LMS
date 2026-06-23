



// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { 
//   Loader2, ChevronLeft, ChevronRight, CheckCircle, 
//   Trophy, Upload, Download, Plus, ChevronDown 
// } from 'lucide-react';

// const API_URL = 'http://127.0.0.1:8000/lms';

// interface MatrixProps {
//   groupId: number | null;
//   onCellClick?: (date: Date, topic?: string) => void;
//   refreshTrigger?: number;
// }

// const QUARTERS = [
//   { id: 1, label: 'Q1', subLabel: 'Apr - Jun', monthIndices: [3, 4, 5], months: ['April', 'May', 'June'] },
//   { id: 2, label: 'Q2', subLabel: 'Jul - Sep', monthIndices: [6, 7, 8], months: ['July', 'August', 'September'] },
//   { id: 3, label: 'Q3', subLabel: 'Oct - Dec', monthIndices: [9, 10, 11], months: ['October', 'November', 'December'] },
//   { id: 4, label: 'Q4', subLabel: 'Jan - Mar', monthIndices: [0, 1, 2], months: ['January', 'February', 'March'] },
// ];

// const AnnualTrainingMatrix: React.FC<MatrixProps> = ({ groupId, onCellClick, refreshTrigger }) => {
//   const [schedules, setSchedules] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   // State for Year Selector
//   const [selectedYear, setSelectedYear] = useState(2026); 
//   const [activeQuarter, setActiveQuarter] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Generate Year Options
//   const years = Array.from({ length: 7 }, (_, i) => 2023 + i);

//   const getToken = () => {
//     try {
//       const auth = localStorage.getItem("auth");
//       const parsed = JSON.parse(auth || "{}");
//       return parsed.access || parsed.accessToken || parsed.token || null;
//     } catch (e) { return null; }
//   };

//   const fetchAnnualData = async () => {
//     if (!groupId) return;
//     const token = getToken();
//     setLoading(true);
//     try {
//       // Fetching based on selectedYear
//       const res = await fetch(`${API_URL}/schedules/?group_id=${groupId}&year=${selectedYear}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setSchedules(Array.isArray(data) ? data : data.results || []);
//       }
//     } catch (e) { console.error(e); } finally { setLoading(false); }
//   };

//   useEffect(() => {
//     fetchAnnualData();
//   }, [groupId, selectedYear, refreshTrigger]);

//   const handleDownloadWeeklyTemplate = async () => {
//     const token = getToken();
//     try {
//       const response = await fetch(`${API_URL}/schedules/download-weekly-template/?year=${selectedYear}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Weekly_Matrix_Template_${selectedYear}.xlsx`;
//       a.click();
//     } catch (e) { alert("Download failed"); }
//   };

//   const handleWeeklyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !groupId) return;
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('group_id', groupId.toString());
//     formData.append('year', selectedYear.toString());

//     try {
//       const res = await fetch(`${API_URL}/schedules/upload-weekly-template/`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${getToken()}` },
//         body: formData
//       });
//       if (res.ok) { alert("Matrix Uploaded!"); fetchAnnualData(); }
//     } catch (e) { alert("Upload failed"); }
//   };

//   // Grouping by unique topics only to avoid duplicates
//   const uniqueTopics = useMemo(() => {
//     return Array.from(new Set(schedules.map(s => s.topic))).sort();
//   }, [schedules]);

//   return (
//     <div className="mt-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
      
//       {/* HEADER WITH YEAR SELECTOR */}
//       <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30">
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//           <div>
//             <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
//               <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Trophy size={20} /></div>
//               Annual Training Matrix
//             </h2>
            
//             {/* Year Selector Dropdown */}
//             <div className="flex items-center gap-2 mt-2">
//               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fiscal Year</label>
//               <div className="relative">
//                 <select 
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(Number(e.target.value))}
//                   className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 pr-8 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-violet-400 transition-all cursor-pointer"
//                 >
//                   {years.map(y => (
//                     <option key={y} value={y}>{y} - {y + 1}</option>
//                   ))}
//                 </select>
//                 <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={handleDownloadWeeklyTemplate} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50">
//               <Download size={16} /> Template
//             </button>
//             <input type="file" ref={fileInputRef} onChange={handleWeeklyUpload} className="hidden" accept=".xlsx" />
//             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-[#00cba9] text-white rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
//               <Upload size={16} /> Weekly Upload
//             </button>
//           </div>
//         </div>

//         {/* QUARTER TABS */}
//         <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl max-w-2xl">
//           {QUARTERS.map((q, idx) => (
//             <button key={q.id} onClick={() => setActiveQuarter(idx)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeQuarter === idx ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400'}`}>
//               {q.label}
//               <span className="block text-[10px] opacity-60 font-normal">{q.subLabel}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* MATRIX GRID */}
//       <div className="overflow-x-auto flex-1">
//         {loading ? (
//           <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-violet-500" size={32} /></div>
//         ) : (
//           <table className="w-full border-collapse min-w-[1200px]">
//             <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-bold sticky top-0 z-20">
//               <tr>
//                 <th className="p-4 text-left border-b w-64 bg-slate-50 dark:bg-slate-800 sticky left-0 z-30">Training Topic</th>
//                 {QUARTERS[activeQuarter].months.map(m => (
//                   <th key={m} colSpan={4} className="p-2 text-center border-b border-l border-slate-200 dark:border-slate-700">{m}</th>
//                 ))}
//               </tr>
//               <tr>
//                 <th className="border-b bg-slate-50 dark:bg-slate-800 sticky left-0 z-30"></th>
//                 {QUARTERS[activeQuarter].months.map((_, i) => [1, 2, 3, 4].map(w => (
//                   <th key={`${i}-${w}`} className="p-1.5 text-[9px] border-b border-l border-slate-100 dark:border-slate-700 text-center w-12">W{w}</th>
//                 )))}
//               </tr>
//             </thead>
//             <tbody>
//               {uniqueTopics.map((topic, tIdx) => (
//                 <tr key={tIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 transition-colors">
//                   <td className="p-3 text-xs font-medium text-slate-600 dark:text-slate-400 border-r dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-900 z-10">{topic as string}</td>
//                   {QUARTERS[activeQuarter].monthIndices.map(mIdx => [1, 2, 3, 4].map(w => {
//                     // Finding records for the specific month/week slot
//                     const record = schedules.find(s => 
//                       s.topic === topic && 
//                       new Date(s.date).getMonth() === mIdx && 
//                       Math.ceil(new Date(s.date).getDate() / 7) === w
//                     );

//                     return (
//                       <td 
//                         key={`${mIdx}-${w}`} 
//                         className={`border-r dark:border-slate-700 p-1 text-center h-12 cursor-pointer transition-colors ${!record ? 'hover:bg-violet-50 dark:hover:bg-violet-900/20' : ''}`}
//                         onClick={() => {
//                           if (!record && onCellClick) {
//                             const targetYear = (mIdx <= 2) ? selectedYear + 1 : selectedYear;
//                             const day = (w - 1) * 7 + 1;
//                             const selectedDate = new Date(targetYear, mIdx, day);
//                             onCellClick(selectedDate, topic as string);
//                           }
//                         }}
//                       >
//                         {record?.status === 'Planned' && (
//                           <div className="bg-[#00a3e0] text-white text-[9px] font-bold py-1 px-1 rounded shadow-sm">PLANNED</div>
//                         )}
//                         {record?.status === 'Actual' && (
//                           <div className="bg-emerald-500 text-white text-[9px] font-bold py-1 px-1 rounded shadow-sm">ACTUAL</div>
//                         )}
//                         {!record && (
//                           <div className="opacity-0 hover:opacity-100 flex justify-center items-center text-slate-300">
//                             <Plus size={14} />
//                           </div>
//                         )}
//                       </td>
//                     );
//                   }))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnnualTrainingMatrix;





import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Loader2, CheckCircle, Upload, Download, Plus, ChevronDown,
  Calendar, Target, Sparkles, TrendingUp, BookOpen, Users
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/lms';

interface MatrixProps {
  groupId: number | null;
  onCellClick?: (date: Date, topic?: string) => void;
  refreshTrigger?: number;
}

interface TrainingSchedule {
  id: number;
  date: string;
  topic: string;
  status: 'Planned' | 'Actual' | 'Cancelled';
}

const QUARTERS = [
  { id: 1, label: 'Q1', subLabel: 'Apr - Jun', monthIndices: [3, 4, 5], months: ['April', 'May', 'June'], color: 'from-violet-500 to-purple-600' },
  { id: 2, label: 'Q2', subLabel: 'Jul - Sep', monthIndices: [6, 7, 8], months: ['July', 'August', 'September'], color: 'from-blue-500 to-cyan-600' },
  { id: 3, label: 'Q3', subLabel: 'Oct - Dec', monthIndices: [9, 10, 11], months: ['October', 'November', 'December'], color: 'from-orange-500 to-amber-600' },
  { id: 4, label: 'Q4', subLabel: 'Jan - Mar', monthIndices: [0, 1, 2], months: ['January', 'February', 'March'], color: 'from-emerald-500 to-teal-600' },
];

const AnnualTrainingMatrix: React.FC<MatrixProps> = ({ groupId, onCellClick, refreshTrigger }) => {
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026); 
  const [activeQuarter, setActiveQuarter] = useState(0);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = Array.from({ length: 7 }, (_, i) => 2023 + i);

  const getToken = () => {
    try {
      const auth = localStorage.getItem("auth");
      const parsed = JSON.parse(auth || "{}");
      return parsed.access || parsed.accessToken || parsed.token || null;
    } catch (e) { return null; }
  };

  const fetchAnnualData = async () => {
    if (!groupId) return;
    const token = getToken();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/schedules/?group_id=${groupId}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(Array.isArray(data) ? data : data.results || []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAnnualData();
  }, [groupId, selectedYear, refreshTrigger]);

  const handleDownloadWeeklyTemplate = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/schedules/download-weekly-template/?year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Weekly_Matrix_Template_${selectedYear}.xlsx`;
      a.click();
    } catch (e) { alert("Download failed"); }
  };

  const handleWeeklyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !groupId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('group_id', groupId.toString());
    formData.append('year', selectedYear.toString());

    try {
      const res = await fetch(`${API_URL}/schedules/upload-weekly-template/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      if (res.ok) { alert("Matrix Uploaded!"); fetchAnnualData(); }
    } catch (e) { alert("Upload failed"); }
  };

  const uniqueTopics = useMemo(() => {
    return Array.from(new Set(schedules.map(s => s.topic))).sort();
  }, [schedules]);

  const prioritizedScheduleMap = useMemo(() => {
    const map = new Map<string, TrainingSchedule>();

    schedules.forEach((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const week = Math.ceil(scheduleDate.getDate() / 7);
      const key = `${schedule.topic}-${scheduleDate.getMonth()}-${week}`;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, schedule);
        return;
      }

      const priority = { Actual: 3, Planned: 2, Cancelled: 1 } as const;
      if (priority[schedule.status] > priority[existing.status]) {
        map.set(key, schedule);
      }
    });

    return map;
  }, [schedules]);

  // Stats calculation
  const stats = useMemo(() => {
    const planned = schedules.filter(s => s.status === 'Planned').length;
    const actual = schedules.filter(s => s.status === 'Actual').length;
    return { planned, actual, total: schedules.length, topics: uniqueTopics.length };
  }, [schedules, uniqueTopics]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Main Container */}
      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="relative overflow-hidden">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${QUARTERS[activeQuarter].color} opacity-5`} />
          
          <div className="relative p-8 lg:p-10">
            {/* Top Row - Title & Actions */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
              
              {/* Title Section */}
              {/* <div className="flex items-start gap-5">
                <div className={`p-4 bg-gradient-to-br ${QUARTERS[activeQuarter].color} rounded-2xl shadow-lg shadow-violet-500/20`}>
                  <Trophy size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                    Annual Training Matrix
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Plan and track your team's learning journey</span>
                  </p>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Year Selector */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FY</span>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="appearance-none bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-6"
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y} - {y + 1}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Download Button */}
                <button 
                  onClick={handleDownloadWeeklyTemplate} 
                  className="group relative flex items-center gap-2.5 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                >
                  <Download size={18} className="text-slate-500 group-hover:text-violet-500 transition-colors" />
                  <span className="text-slate-700 dark:text-slate-200">Template</span>
                </button>

                {/* Upload Button */}
                <input type="file" ref={fileInputRef} onChange={handleWeeklyUpload} className="hidden" accept=".xlsx" />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="group relative flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <Upload size={18} />
                  <span>Upload Matrix</span>
                  <Sparkles size={14} className="opacity-60" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Topics', value: stats.topics, icon: BookOpen, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-500/10' },
                { label: 'Planned Sessions', value: stats.planned, icon: Target, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { label: 'Completed', value: stats.actual, icon: CheckCircle, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                { label: 'Completion Rate', value: stats.total > 0 ? Math.round((stats.actual / stats.total) * 100) + '%' : '0%', icon: TrendingUp, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`${stat.bg} rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all duration-300 cursor-default`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <span className={`text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Quarter Tabs */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl">
              {QUARTERS.map((q, idx) => (
                <button 
                  key={q.id} 
                  onClick={() => setActiveQuarter(idx)} 
                  className={`flex-1 py-4 px-4 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                    activeQuarter === idx 
                      ? 'text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {activeQuarter === idx && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${q.color}`} />
                  )}
                  <span className="relative z-10">
                    <span className="text-lg font-black">{q.label}</span>
                    <span className="block text-xs opacity-80 font-medium mt-0.5">{q.subLabel}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 lg:px-10 py-4 border-t border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center gap-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-blue-500 to-cyan-500 shadow-sm" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-dashed border-slate-300 dark:border-slate-600" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Available</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${QUARTERS[activeQuarter].color} rounded-full blur-xl opacity-30 animate-pulse`} />
                <Loader2 className={`relative animate-spin text-violet-500`} size={48} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading training matrix...</p>
            </div>
          ) : uniqueTopics.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-96 gap-4">
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full">
                <BookOpen size={48} className="text-slate-400" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Training Topics Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Upload a template to get started</p>
              </div>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                {/* Month Headers */}
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80">
                  <th className="p-5 text-left border-b border-slate-200 dark:border-slate-700 min-w-[280px] lg:min-w-[320px] bg-white dark:bg-slate-900 sticky left-0 z-30 shadow-[2px_0_10px_-3px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${QUARTERS[activeQuarter].color}`}>
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        Training Topics
                      </span>
                    </div>
                  </th>
                  {QUARTERS[activeQuarter].months.map((m) => (
                    <th 
                      key={m} 
                      colSpan={4} 
                      className="p-4 text-center border-b border-l border-slate-200 dark:border-slate-700"
                    >
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${QUARTERS[activeQuarter].color} text-white text-sm font-bold shadow-sm`}>
                        <Calendar size={14} />
                        {m}
                      </div>
                    </th>
                  ))}
                </tr>
                
                {/* Week Headers */}
                <tr className="bg-white dark:bg-slate-900">
                  <th className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky left-0 z-30 shadow-[2px_0_10px_-3px_rgba(0,0,0,0.1)]" />
                  {QUARTERS[activeQuarter].months.map((_, monthIdx) => 
                    [1, 2, 3, 4].map(w => (
                      <th 
                        key={`${monthIdx}-${w}`} 
                        className="p-3 text-center border-b border-l border-slate-100 dark:border-slate-800 min-w-[70px] lg:min-w-[90px]"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                          W{w}
                        </span>
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              
              <tbody>
                {uniqueTopics.map((topic, tIdx) => (
                  <tr 
                    key={tIdx} 
                    className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-slate-800/50"
                  >
                    {/* Topic Name */}
                    <td className="p-4 lg:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky left-0 z-10 shadow-[2px_0_10px_-3px_rgba(0,0,0,0.05)] group-hover:shadow-[2px_0_15px_-3px_rgba(0,0,0,0.1)] transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${QUARTERS[activeQuarter].color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                        <div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                            {topic as string}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {schedules.filter(s => s.topic === topic).length} sessions
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Week Cells */}
                    {QUARTERS[activeQuarter].monthIndices.map((mIdx) => 
                      [1, 2, 3, 4].map(w => {
                        const cellKey = `${topic}-${mIdx}-${w}`;
                        const record = prioritizedScheduleMap.get(`${topic}-${mIdx}-${w}`);

                        return (
                          <td 
                            key={cellKey}
                            onMouseEnter={() => setHoveredCell(cellKey)}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`relative border-b border-l border-slate-100 dark:border-slate-800 p-2 text-center h-16 lg:h-20 transition-all duration-300 cursor-pointer ${
                              !record 
                                ? 'hover:bg-violet-50 dark:hover:bg-violet-900/20' 
                                : ''
                            }`}
                            onClick={() => {
                              if (!record && onCellClick) {
                                const targetYear = (mIdx <= 2) ? selectedYear + 1 : selectedYear;
                                const day = (w - 1) * 7 + 1;
                                const selectedDate = new Date(targetYear, mIdx, day);
                                onCellClick(selectedDate, topic as string);
                              }
                            }}
                          >
                            {record?.status === 'Planned' && (
                              <div className="group/badge relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover/badge:opacity-50 transition-opacity" />
                                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] lg:text-xs font-bold py-2 px-2 lg:px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transform hover:scale-105 transition-transform">
                                  <Target size={12} />
                                  <span className="hidden lg:inline">PLANNED</span>
                                </div>
                              </div>
                            )}
                            
                            {record?.status === 'Actual' && (
                              <div className="group/badge relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover/badge:opacity-50 transition-opacity" />
                                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] lg:text-xs font-bold py-2 px-2 lg:px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transform hover:scale-105 transition-transform">
                                  <CheckCircle size={12} />
                                  <span className="hidden lg:inline">DONE</span>
                                </div>
                              </div>
                            )}
                            
                            {!record && (
                              <div className={`flex justify-center items-center transition-all duration-300 ${
                                hoveredCell === cellKey ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                              }`}>
                                <div className="p-2 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-600 text-violet-400 hover:border-violet-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all">
                                  <Plus size={18} />
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 lg:p-8 border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Users size={16} />
              <span>Click on any empty cell to schedule a training session</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </span>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${QUARTERS[activeQuarter].color} animate-pulse`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualTrainingMatrix;
