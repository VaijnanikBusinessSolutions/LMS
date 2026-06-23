// import React, { useState } from 'react';
// import { 
//   Download, RefreshCw, Filter, ChevronDown, 
//   Search, Calendar, Info
// } from 'lucide-react';

// // --- 1. THE PIE CHART ICON COMPONENT (Crucial) ---
// const PieLevelIcon = ({ level, size = 28 }: { level: number; size?: number }) => {
//   // Config for colors based on ILUO standard
//   const config = [
//     { color: 'text-slate-200', fill: 'transparent' },       // 0 - Empty
//     { color: 'text-red-500', fill: 'fill-red-500' },        // 1 - 1/4 (Learner)
//     { color: 'text-amber-400', fill: 'fill-amber-400' },    // 2 - 1/2 (Practitioner)
//     { color: 'text-emerald-500', fill: 'fill-emerald-500' },// 3 - 3/4 (Expert)
//     { color: 'text-blue-600', fill: 'fill-blue-600' }      // 4 - Full (Master)
//   ];

//   const current = config[level] || config[0];
//   const center = size / 2;
//   const radius = (size / 2) - 2; // slight padding for stroke

//   // Helper to calculate SVG Path for segments (Pie slices)
//   const getPath = (lvl: number) => {
//     if (lvl === 0) return "";
//     if (lvl === 4) return `M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`; // Full circle
    
//     // Angles for 1/4, 1/2, 3/4
//     const endAngle = lvl === 1 ? 0 : lvl === 2 ? 90 : 180; 
//     // Note: SVG coordinates are rotated, so we adjust path logic manually for cleanliness:
    
//     // Level 1 (Top Right Quadrant)
//     if (lvl === 1) return `M${center},${center} L${center},2 A${radius},${radius} 0 0,1 ${size-2},${center} Z`;
    
//     // Level 2 (Right Half)
//     if (lvl === 2) return `M${center},${center} L${center},2 A${radius},${radius} 0 0,1 ${center},${size-2} Z`;
    
//     // Level 3 (Right Half + Bottom Left)
//     if (lvl === 3) return `M${center},${center} L${center},2 A${radius},${radius} 0 1,1 2,${center} Z`;
    
//     return "";
//   };

//   return (
//     <div className="relative inline-block" style={{ width: size, height: size }}>
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-0">
//         {/* Background Empty Circle Border */}
//         <circle
//           cx={center} cy={center} r={radius}
//           fill="white"
//           stroke="#e2e8f0" // slate-200
//           strokeWidth="1"
//         />
//         {/* The Filled Slice */}
//         <path d={getPath(level)} className={current.fill} />
//         {/* Outer Border Ring (optional, makes it pop) */}
//         <circle cx={center} cy={center} r={radius} fill="none" stroke="#cbd5e1" strokeWidth="1" />
//       </svg>
//     </div>
//   );
// };

// // --- MOCK DATA ---
// const SKILLS = ["Station A", "Station B", "Welding", "Assembly", "Quality Check"];
// const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

// const EMPLOYEES = [
//   { id: 101, code: "EMP001", name: "Amit Kumar", doj: "12-Jan-22", skills: { "Station A": 4, "Station B": 3, "Welding": 0, "Assembly": 2, "Quality Check": 1 } },
//   { id: 102, code: "EMP002", name: "Sarah Singh", doj: "05-Mar-23", skills: { "Station A": 2, "Station B": 4, "Welding": 3, "Assembly": 4, "Quality Check": 2 } },
//   { id: 103, code: "EMP003", name: "Rahul Verma", doj: "20-Jun-23", skills: { "Station A": 1, "Station B": 1, "Welding": 0, "Assembly": 2, "Quality Check": 4 } },
//   { id: 104, code: "EMP004", name: "John Doe",   doj: "15-Aug-23", skills: { "Station A": 3, "Station B": 3, "Welding": 3, "Assembly": 3, "Quality Check": 3 } },
// ];

// export default function IndustrialSkillMatrix() {
  
//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-6 animate-in fade-in">
      
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//             <span className="p-2 bg-blue-600 text-white rounded-lg"><Filter size={20}/></span>
//             Skill Matrix & Upgradation Plan
//           </h1>
//           <p className="text-slate-500 text-sm mt-1 ml-11">Monitor station-wise competency and schedule training.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
//             <Download size={18} /> Report
//           </button>
//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
//             <RefreshCw size={18} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* --- LEGEND (THE PIE CHARTS) --- */}
//       <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
//         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Proficiency Levels</div>
//         <div className="flex flex-wrap gap-6 md:gap-10">
//           <LegendItem level={0} label="0 = Beginner" />
//           <LegendItem level={1} label="1 = Learner" />
//           <LegendItem level={2} label="2 = Practitioner" />
//           <LegendItem level={3} label="3 = Expert" />
//           <LegendItem level={4} label="4 = Master" />
//         </div>
//       </div>

//       {/* --- FILTERS --- */}
//       <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-100 mb-6 flex flex-wrap gap-4 items-end">
//         <FilterSelect label="Department" />
//         <FilterSelect label="Line" />
//         <FilterSelect label="Sub Line" />
//         <FilterSelect label="Station" />
//         <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all">
//           Apply
//         </button>
//       </div>

//       {/* --- MAIN MATRIX TABLE --- */}
//       <div className="bg-white border border-slate-300 shadow-lg rounded-xl overflow-hidden overflow-x-auto">
//         <table className="w-full border-collapse min-w-[1400px]">
//           <thead>
//             {/* 1. TOP HEADER (GROUPINGS) */}
//             <tr className="text-white text-[11px] font-bold uppercase tracking-wide">
//               {/* Employee Info Block */}
//               <th className="bg-white border-b border-r border-slate-200 min-w-[50px]"></th>
//               <th className="bg-white border-b border-r border-slate-200 min-w-[100px]"></th>
//               <th className="bg-white border-b border-r border-slate-200 min-w-[200px]"></th>
//               <th className="bg-white border-b border-r border-slate-200 min-w-[100px]"></th>
              
//               {/* Matrix Header (Blue) */}
//               <th colSpan={SKILLS.length} className="bg-blue-600 border-r border-blue-500 py-3">
//                 Training Points (Stations)
//               </th>
              
//               {/* Plan Header (Green) */}
//               <th colSpan={MONTHS.length} className="bg-emerald-600 border-r border-emerald-500 py-3">
//                 Skill Upgradation Plan (FY 2024-25)
//               </th>
              
//               <th className="bg-white border-b border-l border-slate-200 min-w-[100px]"></th>
//             </tr>

//             {/* 2. SUB HEADER (COLUMNS) */}
//             <tr className="text-[11px] font-bold uppercase text-slate-600 bg-slate-50">
//               {/* Fixed Left Columns */}
//               <th className="p-3 border-b border-r border-slate-200 w-12">#</th>
//               <th className="p-3 border-b border-r border-slate-200 w-24">Code</th>
//               <th className="p-3 border-b border-r border-slate-200 w-48 text-left">Employee Name</th>
//               <th className="p-3 border-b border-r border-slate-200 w-24">DOJ</th>

//               {/* Station Columns (Yellow Header Background in screenshot, converted to readable Amber) */}
//               {SKILLS.map((station, idx) => (
//                 <th key={idx} className="p-2 border-b border-r border-amber-200 bg-amber-100 text-amber-900 w-24 text-center">
//                   <div className="flex flex-col items-center gap-1">
//                     <span>{station}</span>
//                   </div>
//                 </th>
//               ))}

//               {/* Months (Green Sub-header) */}
//               {MONTHS.map(m => (
//                 <th key={m} className="p-1 border-b border-r border-emerald-200 bg-emerald-50 text-emerald-800 w-10 text-center rotate-0">
//                   <span className="writing-vertical-lr text-[10px]">{m}</span>
//                 </th>
//               ))}

//               <th className="p-3 border-b border-l border-slate-200">Remarks</th>
//             </tr>
//           </thead>

//           <tbody className="text-sm text-slate-700">
//             {EMPLOYEES.map((emp, idx) => (
//               <tr key={emp.id} className="hover:bg-slate-50 transition-colors border-b border-slate-200 group">
//                 <td className="p-3 text-center border-r border-slate-200 text-slate-500 font-mono">{idx + 1}</td>
//                 <td className="p-3 text-center border-r border-slate-200 font-mono text-slate-500 bg-slate-50/50">{emp.code}</td>
//                 <td className="p-3 border-r border-slate-200 font-bold text-slate-800 sticky left-0 z-10 bg-inherit group-hover:bg-slate-50">
//                   {emp.name}
//                 </td>
//                 <td className="p-3 text-center border-r border-slate-200 text-xs text-slate-500">{emp.doj}</td>

//                 {/* SKILLS DATA (THE PIE CHARTS) */}
//                 {SKILLS.map((station) => (
//                   <td key={station} className="p-2 border-r border-slate-200 text-center cursor-pointer hover:bg-white transition-all">
//                     <div className="flex justify-center transform hover:scale-110 transition-transform">
//                       {/* THIS IS THE COMPONENT YOU WANTED */}
//                       <PieLevelIcon level={(emp.skills as any)[station]} size={26} />
//                     </div>
//                   </td>
//                 ))}

//                 {/* PLAN DATA (GRID) */}
//                 {MONTHS.map((m) => (
//                   <td key={m} className="p-0 border-r border-slate-200 bg-white relative hover:bg-slate-100 cursor-pointer">
//                     {/* Example: Add logic here to show a coloured block if training is planned */}
//                   </td>
//                 ))}

//                 <td className="p-3 border-l border-slate-200"></td>
//               </tr>
//             ))}

//             {/* FOOTER: TARGETS */}
//             <tr className="bg-slate-50 font-bold text-[11px] border-t-2 border-slate-300">
//               <td colSpan={4} className="p-2 text-right text-slate-500 uppercase border-r border-slate-200 tracking-wider">Required Level</td>
//               {SKILLS.map((s) => (
//                 <td key={s} className="p-2 text-center border-r border-slate-200 text-slate-800">3</td>
//               ))}
//               <td colSpan={MONTHS.length + 1} className="bg-slate-100"></td>
//             </tr>
//             <tr className="bg-slate-50 font-bold text-[11px] border-b border-slate-300">
//               <td colSpan={4} className="p-2 text-right text-slate-500 uppercase border-r border-slate-200 tracking-wider">Min Operators</td>
//               {SKILLS.map((s) => (
//                 <td key={s} className="p-2 text-center border-r border-slate-200 text-slate-800">2</td>
//               ))}
//               <td colSpan={MONTHS.length + 1} className="bg-slate-100"></td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // --- SUB COMPONENTS ---

// const LegendItem = ({ level, label }: { level: number; label: string }) => (
//   <div className="flex items-center gap-3">
//     <PieLevelIcon level={level} size={24} />
//     <span className="text-xs font-semibold text-slate-600">{label}</span>
//   </div>
// );

// const FilterSelect = ({ label }: { label: string }) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-[11px] font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1">
//       {label}
//     </label>
//     <div className="relative">
//       <select className="appearance-none bg-white border border-blue-200 text-slate-700 text-sm rounded-lg py-2.5 pl-3 pr-10 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
//         <option>Select {label}</option>
//       </select>
//       <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//     </div>
//   </div>
// );


import React, { useState } from 'react';
import { 
  Download, RefreshCw, Filter, ChevronDown, 
  Search, Layers, MoreHorizontal // Added MoreHorizontal here
} from 'lucide-react';

// --- 1. PIE ICON COMPONENT (Fixed Name) ---
const PieLevelIcon = ({ level, size = 24 }: { level: number; size?: number }) => {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  
  // LMS Palette: 0=Gray, 1=Red, 2=Amber, 3=Blue, 4=Violet (Master)
  const config = [
    { pct: 0, color: 'text-slate-200 dark:text-slate-700', fill: 'transparent' },      
    { pct: 0.25, color: 'text-rose-500', fill: 'fill-rose-500' },    
    { pct: 0.50, color: 'text-amber-400', fill: 'fill-amber-400' },
    { pct: 0.75, color: 'text-blue-500', fill: 'fill-blue-500' }, 
    { pct: 1, color: 'text-violet-600', fill: 'fill-violet-600' }      
  ];

  const current = config[level] || config[0];
  const strokeDashoffset = circumference - (current.pct * circumference);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        {level > 0 && (
          <circle
            className={`${current.color} transition-all duration-500 ease-out`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
        )}
      </svg>
    </div>
  );
};

// --- MOCK DATA ---
const SKILLS = ["React", "Node.js", "Python", "DevOps", "Design"];
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const EMPLOYEES = [
  { id: 101, code: "EMP001", name: "Amit Kumar", doj: "Jan 22", avatar: "AK", skills: { "React": 4, "Node.js": 3, "Python": 0, "DevOps": 2, "Design": 1 } },
  { id: 102, code: "EMP002", name: "Sarah Singh", doj: "Mar 23", avatar: "SS", skills: { "React": 2, "Node.js": 4, "Python": 3, "DevOps": 4, "Design": 2 } },
  { id: 103, code: "EMP003", name: "Rahul Verma", doj: "Jun 23", avatar: "RV", skills: { "React": 1, "Node.js": 1, "Python": 0, "DevOps": 2, "Design": 4 } },
];

export default function SkillMatrixDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-sans transition-colors duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <Layers size={24} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skill Matrix & Planner</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Competency Audit vs. Training Schedule</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-md text-sm">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search employee..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>
        <FilterSelect label="Department" />
        <FilterSelect label="Role" />
      </div>

      {/* --- LEGEND --- */}
      <div className="flex flex-wrap gap-6 mb-6 px-2">
        <LegendItem level={0} label="Beginner" />
        <LegendItem level={1} label="Learner" />
        <LegendItem level={2} label="Practitioner" />
        <LegendItem level={3} label="Expert" />
        <LegendItem level={4} label="Master" />
      </div>

      {/* --- MATRIX TABLE --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1400px]">
            <thead>
              {/* 1. TOP HEADER (GROUPINGS) */}
              <tr className="text-[10px] font-bold uppercase tracking-wider text-white">
                <th className="bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 min-w-[50px]"></th>
                <th className="bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 min-w-[80px]"></th>
                <th className="bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 min-w-[200px]"></th>
                <th className="bg-slate-50 dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 min-w-[80px]"></th>
                
                {/* Blue Header: Skills */}
                <th colSpan={SKILLS.length} className="bg-violet-600 border-r border-violet-500 py-2">
                  Current Skill Levels
                </th>
                
                {/* Green Header: Plan */}
                <th colSpan={MONTHS.length} className="bg-emerald-600 border-r border-emerald-500 py-2">
                  Training Plan (FY 24-25)
                </th>
                
                <th className="bg-slate-50 dark:bg-slate-900 border-b border-l border-slate-200 dark:border-slate-800 min-w-[100px]"></th>
              </tr>

              {/* 2. SUB HEADER (COLUMNS) */}
              <tr className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="p-3 border-b border-r border-slate-200 dark:border-slate-800">#</th>
                <th className="p-3 border-b border-r border-slate-200 dark:border-slate-800">ID</th>
                <th className="p-3 border-b border-r border-slate-200 dark:border-slate-800 text-left">Employee</th>
                <th className="p-3 border-b border-r border-slate-200 dark:border-slate-800">DOJ</th>

                {/* Skills */}
                {SKILLS.map((skill, idx) => (
                  <th key={idx} className="p-2 border-b border-r border-violet-100 dark:border-violet-900/30 bg-violet-50/50 dark:bg-violet-900/10 text-violet-700 dark:text-violet-300 w-24 text-center">
                    {skill}
                  </th>
                ))}

                {/* Months */}
                {MONTHS.map(m => (
                  <th key={m} className="p-1 border-b border-r border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 w-10 text-center">
                    <span className="writing-vertical-lr rotate-180 h-16 flex items-center justify-center mx-auto">{m}</span>
                  </th>
                ))}

                <th className="p-3 border-b border-l border-slate-200 dark:border-slate-800">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-700 dark:text-slate-300">
              {EMPLOYEES.map((emp, idx) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                  <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 font-mono text-xs">{emp.code}</td>
                  
                  {/* Sticky Employee Name */}
                  <td className="p-3 border-r border-slate-100 dark:border-slate-800 sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                        {emp.avatar}
                      </div>
                      <span className="font-semibold">{emp.name}</span>
                    </div>
                  </td>
                  
                  <td className="p-3 text-center border-r border-slate-100 dark:border-slate-800 text-xs text-slate-400">{emp.doj}</td>

                  {/* SKILLS DATA */}
                  {SKILLS.map((skill) => (
                    <td key={skill} className="p-2 border-r border-slate-100 dark:border-slate-800 text-center">
                      <div className="flex justify-center">
                        <PieLevelIcon level={(emp.skills as any)[skill]} size={22} />
                      </div>
                    </td>
                  ))}

                  {/* PLAN DATA */}
                  {MONTHS.map((m) => (
                    <td key={m} className="p-0 border-r border-slate-100 dark:border-slate-800 relative hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group/cell">
                      {/* Hover effect to show "Add" button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                      </div>
                    </td>
                  ))}

                  <td className="p-3 border-l border-slate-100 dark:border-slate-800 text-center">
                    <button className="text-slate-400 hover:text-violet-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {/* FOOTER: TARGETS */}
              <tr className="bg-slate-50 dark:bg-slate-950 font-bold text-xs border-t-2 border-slate-200 dark:border-slate-800">
                <td colSpan={4} className="p-3 text-right border-r border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-950 z-10">
                  Required Level
                </td>
                {SKILLS.map((s) => (
                  <td key={s} className="p-3 text-center border-r border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
                    3
                  </td>
                ))}
                <td colSpan={MONTHS.length + 1}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const LegendItem = ({ level, label }: { level: number; label: string }) => (
  <div className="flex items-center gap-2">
    <PieLevelIcon level={level} size={18} />
    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
  </div>
);

const FilterSelect = ({ label }: { label: string }) => (
  <div className="relative">
    <select className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
      <option>{label}</option>
    </select>
    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);