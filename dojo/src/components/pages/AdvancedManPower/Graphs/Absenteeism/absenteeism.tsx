

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
// } from 'recharts';

// // --- CONFIGURATION ---
// const API_BASE_URL = 'http://127.0.0.1:8000';
// const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// // --- INTERFACES ---
// interface HiringGapData {
//   name: string;
//   L1: number;
//   L2: number;
//   L3: number;
//   L4: number;
// }

// // --- PROPS INTERFACE (UPDATED) ---
// // This is the primary fix for the TypeScript error.
// interface Props {
//   selectedHqId: number | null;
//   selectedFactoryId: number | null;
//   selectedDepartmentId: number | null;
//   selectedLineId: number | null;
//   selectedSublineId: number | null;
//   selectedStationId: number | null;
//   selectedMonth: string | null;
//   selectedYear: number | null;
//   timeView: 'Monthly' | 'Weekly';
//   selectedWeek: string | null;
// }

// const Absenteeism: React.FC<Props> = ({
//   // Updated function signature to destructure new props
//   selectedHqId,
//   selectedFactoryId,
//   selectedDepartmentId,
//   selectedLineId,
//   selectedSublineId,
//   selectedStationId,
//   selectedMonth,
//   selectedYear,
//   timeView,
//   selectedWeek,
// }) => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartData, setChartData] = useState<HiringGapData[]>([]);

//   // This logic for calculating the target date is correct and does not need changes.
//   const targetDate = useMemo(() => {
//     if (timeView === 'Weekly' && selectedWeek) {
//       return selectedWeek;
//     }
//     if (timeView === 'Monthly' && selectedYear && selectedMonth) {
//       const monthIndex = MONTHS.indexOf(selectedMonth);
//       if (monthIndex >= 0) {
//         return `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-01`;
//       }
//     }
//     return null;
//   }, [timeView, selectedWeek, selectedMonth, selectedYear]);

//   const fetchData = useCallback(async () => {
//     if (!selectedFactoryId || !targetDate) {
//       setChartData([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // --- API CALL LOGIC (UPDATED) ---
//       // Now includes all new filter parameters.
//       const params = new URLSearchParams({
//         factory: String(selectedFactoryId),
//         start_date: targetDate,
//       });
//       if (selectedHqId) params.set('hq', String(selectedHqId));
//       if (selectedDepartmentId) params.set('department', String(selectedDepartmentId));
//       if (selectedLineId) params.set('line', String(selectedLineId));
//       if (selectedSublineId) params.set('subline', String(selectedSublineId));
//       if (selectedStationId) params.set('station', String(selectedStationId));

//       const response = await fetch(`${API_BASE_URL}/production-data/gap-volume-analysis/?${params.toString()}`);

//       if (!response.ok) {
//         const errData = await response.json().catch(() => ({}));
//         throw new Error(errData.error || `Failed to fetch hiring gap data`);
//       }

//       const result = await response.json();
      
//       const chartName = timeView === 'Weekly' 
//         ? `Week of ${new Date(targetDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}`
//         : new Date(targetDate).toLocaleString('default', { timeZone: 'UTC', month: 'long' });

//       const transformedData: HiringGapData = {
//         name: chartName,
//         L1: result.L1 || 0,
//         L2: result.L2 || 0,
//         L3: result.L3 || 0,
//         L4: result.L4 || 0,
//       };

//       setChartData([transformedData]);

//     } catch (err: any) {
//       setError(err.message || 'An unknown error occurred.');
//       setChartData([]);
//     } finally {
//       setLoading(false);
//     }
//     // --- DEPENDENCY ARRAY (UPDATED) ---
//     // Added all new props to ensure data re-fetches on any filter change.
//   }, [selectedHqId, selectedFactoryId, selectedDepartmentId, selectedLineId, selectedSublineId, selectedStationId, targetDate, timeView]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const seriesStyleMap: { [key: string]: string } = { L1: '#dc92ebff', L2: '#e6eba6ff', L3: '#f7b2c3ff', L4: '#7cbbe0ff' };

//   // No changes needed for CustomTooltip, CustomLegend, or renderContent.
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl text-sm">
//           <p className="font-semibold text-gray-800 mb-3 text-base">{label}</p>
//           <div className="space-y-1">
//             {payload.map((entry: any, index: number) => {
//               if (entry.value === 0) return null;
//               const color = seriesStyleMap[entry.dataKey] || '#ccc';
//               return (
//                 <p key={index} className="flex justify-between w-40">
//                   <span className="flex items-center gap-2">
//                     <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></span>
//                     <span>{entry.name}:</span>
//                   </span>
//                   <span className="font-medium">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
//                 </p>
//               );
//             })}
//           </div>
//           <hr className="my-2 border-gray-100" />
//           <div className="text-xs text-gray-500">
//             <p>Hiring gap after attrition & absenteeism.</p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomLegend = () => (
//     <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700 mt-4">
//       <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L1}} /><span>L1 Gap</span></span>
//       <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L2}} /><span>L2 Gap</span></span>
//       <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L3}} /><span>L3 Gap</span></span>
//       <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L4}} /><span>L4 Gap</span></span>
//     </div>
//   );

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="h-full flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
//             <p className="text-gray-500">Loading Hiring Gap Data...</p>
//           </div>
//         </div>
//       );
//     }
//     if (error) {
//       return (
//         <div className="h-full flex items-center justify-center">
//           <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
//             <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//             <p>{error}</p>
//           </div>
//         </div>
//       );
//     }
//     if (chartData.length > 0 && chartData.some(d => d.L1 > 0 || d.L2 > 0 || d.L3 > 0 || d.L4 > 0)) {
//       return (
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
//             <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 14, fontWeight: 500 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} dy={10}/>
//             <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}/>
//             <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.1)', radius: 4 }} />
//             <Legend verticalAlign="bottom" height={50} content={<CustomLegend />} />
//             <Bar dataKey="L1" fill={seriesStyleMap.L1} name="L1 Gap" />
//             <Bar dataKey="L2" fill={seriesStyleMap.L2} name="L2 Gap" />
//             <Bar dataKey="L3" fill={seriesStyleMap.L3} name="L3 Gap" />
//             <Bar dataKey="L4" fill={seriesStyleMap.L4} name="L4 Gap" radius={[6, 6, 0, 0]}/>
//           </BarChart>
//         </ResponsiveContainer>
//       );
//     }
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-gray-400 text-center">
//           <p className="text-lg">No hiring gap for this period.</p>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="relative w-full h-[500px] bg-white rounded-xl shadow-lg p-6 flex flex-col">
//       <div className="flex items-center justify-center mb-4 sm:mb-6">
//         <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg px-4 sm:px-6 py-2 sm:py-3">
//           <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
//             <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
//             Level Wise Hiring Required
//           </h2>
//         </div>
//       </div>
//       <div className="flex-grow">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default Absenteeism;





import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';

// --- CONFIGURATION ---
const API_BASE_URL = 'http://127.0.0.1:8000';
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// --- THEME CONSTANTS ---
const THEME = {
  grid: "rgb(var(--border-main))",
  axis: "rgb(var(--text-muted))",
  tooltipBg: "rgb(var(--bg-card))",
  tooltipBorder: "rgb(var(--border-main))",
  tooltipText: "rgb(var(--text-main))",
  legendText: "rgb(var(--text-muted))"
};

// --- DATA COLORS ---
// Keeping specific pastel colors for Levels as they provide good contrast in both modes
const seriesStyleMap: { [key: string]: string } = { 
  L1: '#dc92eb', 
  L2: '#e6eba6', 
  L3: '#f7b2c3', 
  L4: '#7cbbe0' 
};

// --- INTERFACES ---
interface HiringGapData {
  name: string;
  L1: number;
  L2: number;
  L3: number;
  L4: number;
}

// --- PROPS INTERFACE ---
interface Props {
  selectedHqId: number | null;
  selectedFactoryId: number | null;
  selectedDepartmentId: number | null;
  selectedLineId: number | null;
  selectedSublineId: number | null;
  selectedStationId: number | null;
  selectedMonth: string | null;
  selectedYear: number | null;
  timeView: 'Monthly' | 'Weekly';
  selectedWeek: string | null;
}

const Absenteeism: React.FC<Props> = ({
  selectedHqId,
  selectedFactoryId,
  selectedDepartmentId,
  selectedLineId,
  selectedSublineId,
  selectedStationId,
  selectedMonth,
  selectedYear,
  timeView,
  selectedWeek,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<HiringGapData[]>([]);

  const targetDate = useMemo(() => {
    if (timeView === 'Weekly' && selectedWeek) {
      return selectedWeek;
    }
    if (timeView === 'Monthly' && selectedYear && selectedMonth) {
      const monthIndex = MONTHS.indexOf(selectedMonth);
      if (monthIndex >= 0) {
        return `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}-01`;
      }
    }
    return null;
  }, [timeView, selectedWeek, selectedMonth, selectedYear]);

  const fetchData = useCallback(async () => {
    if (!selectedFactoryId || !targetDate) {
      setChartData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        factory: String(selectedFactoryId),
        start_date: targetDate,
      });
      if (selectedHqId) params.set('hq', String(selectedHqId));
      if (selectedDepartmentId) params.set('department', String(selectedDepartmentId));
      if (selectedLineId) params.set('line', String(selectedLineId));
      if (selectedSublineId) params.set('subline', String(selectedSublineId));
      if (selectedStationId) params.set('station', String(selectedStationId));

      const response = await fetch(`${API_BASE_URL}/production-data/gap-volume-analysis/?${params.toString()}`);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch hiring gap data`);
      }

      const result = await response.json();
      
      const chartName = timeView === 'Weekly' 
        ? `Week of ${new Date(targetDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}`
        : new Date(targetDate).toLocaleString('default', { timeZone: 'UTC', month: 'long' });

      const transformedData: HiringGapData = {
        name: chartName,
        L1: result.L1 || 0,
        L2: result.L2 || 0,
        L3: result.L3 || 0,
        L4: result.L4 || 0,
      };

      setChartData([transformedData]);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedHqId, selectedFactoryId, selectedDepartmentId, selectedLineId, selectedSublineId, selectedStationId, targetDate, timeView]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- UI COMPONENTS ---
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        // Updated: bg-surface, border-border, text-text
        <div className="bg-surface p-4 border border-border rounded-lg shadow-soft text-sm min-w-[180px]">
          <p className="font-semibold text-text mb-3 text-base">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              if (entry.value === 0) return null;
              const color = seriesStyleMap[entry.dataKey] || '#ccc';
              return (
                <p key={index} className="flex justify-between items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></span>
                    <span className="text-muted">{entry.name}:</span>
                  </span>
                  <span className="font-medium text-text">{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}</span>
                </p>
              );
            })}
          </div>
          <hr className="my-2 border-border" />
          <div className="text-xs text-muted">
            <p>Hiring gap after attrition & absenteeism.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    // Updated: text-muted
    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm text-muted mt-4">
      <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L1}} /><span>L1 Gap</span></span>
      <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L2}} /><span>L2 Gap</span></span>
      <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L3}} /><span>L3 Gap</span></span>
      <span className="inline-flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{backgroundColor: seriesStyleMap.L4}} /><span>L4 Gap</span></span>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            {/* Updated: border-primary, text-muted */}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading Hiring Gap Data...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          {/* Updated: bg-red-500/10, text-red-600/400 */}
          <div className="text-red-600 dark:text-red-400 text-center p-4 bg-red-500/10 rounded-lg">
            <svg className="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        </div>
      );
    }
    if (chartData.length > 0 && chartData.some(d => d.L1 > 0 || d.L2 > 0 || d.L3 > 0 || d.L4 > 0)) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
            {/* Updated: stroke from THEME */}
            <CartesianGrid strokeDasharray="3 3" stroke={THEME.grid} vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: THEME.axis, fontSize: 14, fontWeight: 500 }} 
              axisLine={{ stroke: THEME.grid }} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: THEME.axis, fontSize: 12 }} 
              tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.1)', radius: 4 }} />
            <Legend verticalAlign="bottom" height={50} content={<CustomLegend />} />
            <Bar dataKey="L1" fill={seriesStyleMap.L1} name="L1 Gap" />
            <Bar dataKey="L2" fill={seriesStyleMap.L2} name="L2 Gap" />
            <Bar dataKey="L3" fill={seriesStyleMap.L3} name="L3 Gap" />
            <Bar dataKey="L4" fill={seriesStyleMap.L4} name="L4 Gap" radius={[6, 6, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return (
      <div className="h-full flex items-center justify-center">
        {/* Updated: text-muted */}
        <div className="text-muted text-center">
          <p className="text-lg">No hiring gap for this period.</p>
        </div>
      </div>
    );
  };

  return (
    // Updated: bg-surface, border-border, shadow-soft
    <div className="relative w-full h-[500px] bg-surface border border-border rounded-xl shadow-soft p-6 flex flex-col transition-colors duration-300">
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        {/* Updated: bg-primary/10 */}
        <div className="bg-primary/10 rounded-lg px-4 sm:px-6 py-2 sm:py-3">
          <h2 className="text-base sm:text-lg font-bold text-text flex items-center gap-2">
            {/* Updated: text-primary */}
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            Level Wise Hiring Required
          </h2>
        </div>
      </div>
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default Absenteeism;