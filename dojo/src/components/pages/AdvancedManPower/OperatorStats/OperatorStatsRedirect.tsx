

// import React, { useState, useEffect, useCallback } from 'react';

// // --- INTERFACES ---
// type OperatorStats = {
//   id: number;
//   level: number;
//   operator_required: number;
//   operator_available: number;
// };

// type Employee = {
//   id: number;
//   name: string;
//   level: number;
//   advancementDate?: string;
// };

// interface LevelSummaryResponse {
//   [key: string]: number; // e.g., "ctq_plan_l1": 10
// }

// // --- CONSTANTS ---
// const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// const PASTEL_COLORS = ['#FFD6E8', '#D4E5FF', '#E8D5FF', '#D5FFE4', '#FFE5D6', '#FFFFD6'];

// // --- PROPS INTERFACE (UPDATED) ---
// interface Props {
//   hqId: number | null;
//   factoryId: number | null;
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
//   selectedMonth: string;
//   selectedYear: number;
// }

// const OperatorStatsRedirect: React.FC<Props> = ({
//   // Updated function signature
//   hqId,
//   factoryId,
//   departmentId,
//   lineId,
//   sublineId,
//   stationId,
//   selectedMonth,
//   selectedYear,
// }) => {
//   const [data, setData] = useState<OperatorStats[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState<OperatorStats | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [showRequired, setShowRequired] = useState(true);

//   // --- Data Fetching Logic (UPDATED) ---
//   const fetchData = useCallback(async () => {
//     if (!factoryId || !selectedYear || !selectedMonth) {
//       setData([]);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const monthNumber = MONTHS.indexOf(selectedMonth) + 1;
//       if (monthNumber === 0) throw new Error("Invalid month name provided");

//       // Updated params to include all new filters
//       const params = new URLSearchParams({
//         factory: factoryId.toString(),
//         year: selectedYear.toString(),
//         month: monthNumber.toString(),
//       });
//       if (hqId) params.append('hq', hqId.toString());
//       if (departmentId) params.append('department', departmentId.toString());
//       if (lineId) params.append('line', lineId.toString());
//       if (sublineId) params.append('subline', sublineId.toString());
//       if (stationId) params.append('station', stationId.toString());

//       const url = `http://127.0.0.1:8000/production-data/weekly-summary/?${params.toString()}`;
//       const response = await fetch(url);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || errorData.detail || `Failed to fetch operator stats: ${response.status}`);
//       }

//       const summary: LevelSummaryResponse = await response.json();
//       if (!summary) throw new Error('API returned an empty response.');

//       // The transformation logic below is now simpler. It always sums all departments
//       // because the backend has already filtered the data to the correct scope.
//       const transformedData: OperatorStats[] = [];
//       for (let level = 1; level <= 4; level++) {
//         const required = (summary[`ctq_plan_l${level}`] ?? 0) + (summary[`pdi_plan_l${level}`] ?? 0) + (summary[`other_plan_l${level}`] ?? 0);
//         const available = (summary[`ctq_actual_l${level}`] ?? 0) + (summary[`pdi_actual_l${level}`] ?? 0) + (summary[`other_actual_l${level}`] ?? 0);
//         transformedData.push({ id: level, level, operator_required: required, operator_available: available });
//       }
//       setData(transformedData);
//     } catch (err) {
//       console.error('Error fetching operator requirements:', err);
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//     // Updated dependency array
//   }, [hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedMonth, selectedYear]);
  
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // --- Helper Functions (Updated) ---
//   const fetchEmployees = async (level: number) => {
//     try {
//         setEmployees([]);
//         const params = new URLSearchParams({ level: level.toString() });
//         // Update employee fetch to use new filters
//         if (factoryId) params.append('factory_id', factoryId.toString());
//         if (departmentId) params.append('department_id', departmentId.toString());
//         if (lineId) params.append('line_id', lineId.toString());
//         if (sublineId) params.append('subline_id', sublineId.toString());
//         if (stationId) params.append('station_id', stationId.toString());

//         const url = `http://127.0.0.1:8000/employees/?${params.toString()}`;
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`Failed to fetch employees: ${response.status}`);
//         const employeesData = await response.json();
//         setEmployees(employeesData);
//       } catch (err) {
//         console.error('Failed to fetch employees:', err);
//         setEmployees([]);
//       }
//   };

//   // --- No changes needed for the functions below ---
//   const handleClick = (stat: OperatorStats) => { setSelected(stat); fetchEmployees(stat.level); };
//   const getStatus = (available: number, required: number) => {
//     if (required === 0 && available === 0) return { text: 'No Data', color: '#9CA3AF' };
//     if (required === 0) return { text: 'No Requirement', color: '#6B7280' };
//     if (available === required) return { text: 'Optimal', color: '#10B981' };
//     if (available > required) return { text: 'Surplus', color: '#8B5CF6' };
//     if (available / required >= 0.95) return { text: 'Near Optimal', color: '#F59E0B' };
//     return { text: 'Shortage', color: '#EF4444' };
//   };

//   const getPieChartData = () => {
//     const values = data.map(d => showRequired ? d.operator_required : d.operator_available);
//     const total = values.reduce((sum, val) => sum + val, 0);
//     if (total === 0) return [];
//     let currentAngle = 0;
//     return data.map((stat, index) => {
//       const value = showRequired ? stat.operator_required : stat.operator_available;
//       const percentage = (value / total) * 100;
//       const angle = (value / total) * 360;
//       const startAngle = currentAngle;
//       currentAngle += angle;
//       return { ...stat, value, percentage, startAngle, endAngle: currentAngle, color: PASTEL_COLORS[index % PASTEL_COLORS.length] };
//     });
//   };

//   const createPieSlice = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
//     const startAngleRad = (startAngle * Math.PI) / 180;
//     const endAngleRad = (endAngle * Math.PI) / 180;
//     const x1 = centerX + radius * Math.cos(startAngleRad);
//     const y1 = centerY + radius * Math.sin(startAngleRad);
//     const x2 = centerX + radius * Math.cos(endAngleRad);
//     const y2 = centerY + radius * Math.sin(endAngleRad);
//     const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
//     return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
//   };

//   // --- Render Logic ---
//   const renderContent = () => {
//     if (loading) {
//       return (
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading operator stats...</p>
//         </div>
//       );
//     }
//     if (error) {
//       return <p className="text-red-500 font-medium text-center">Error: {error}</p>;
//     }
//     if (data.length === 0 || data.every(d => d.operator_required === 0 && d.operator_available === 0)) {
//       return <p className="text-gray-600 text-center">No operator stats available for the selected criteria.</p>;
//     }

//     const pieData = getPieChartData();
//     const total = pieData.reduce((sum, d) => sum + d.value, 0);

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-center gap-2">
//           <button onClick={() => setShowRequired(true)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ showRequired ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }`}>Required</button>
//           <button onClick={() => setShowRequired(false)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ !showRequired ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200' }`}>Available</button>
//         </div>
//         <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
//           <div className="relative">
//             <svg width="300" height="300" className="drop-shadow-lg">
//               <circle cx="150" cy="150" r="120" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2"/>
//               {pieData.map((slice) => (
//                 <g key={slice.id}>
//                   <path d={createPieSlice(150, 150, 120, slice.startAngle - 90, slice.endAngle - 90)} fill={slice.color} stroke="white" strokeWidth="2" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleClick(slice)} />
//                   {slice.percentage > 5 && (
//                     <text x={150 + 80 * Math.cos(((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180)} y={150 + 80 * Math.sin(((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180)} textAnchor="middle" dominantBaseline="middle" className="fill-gray-700 text-sm font-semibold pointer-events-none">L{slice.level}</text>
//                   )}
//                 </g>
//               ))}
//               <circle cx="150" cy="150" r="60" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
//               <text x="150" y="140" textAnchor="middle" className="fill-gray-700 text-2xl font-bold">{total}</text>
//               <text x="150" y="165" textAnchor="middle" className="fill-gray-500 text-sm">Total {showRequired ? 'Required' : 'Available'}</text>
//             </svg>
//           </div>
//           <div className="space-y-3">
//             {pieData.map((item) => {
//               const status = getStatus(item.operator_available, item.operator_required);
//               return (
//                 <div key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => handleClick(item)}>
//                   <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}/>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium text-gray-700">Level {item.level}</span>
//                       <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: status.color + '20', color: status.color }}>{status.text}</span>
//                     </div>
//                     <div className="text-sm text-gray-500">{item.value} operators ({item.percentage.toFixed(1)}%)</div>
//                     <div className="text-xs text-gray-400">Required: {item.operator_required} | Available: {item.operator_available}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full bg-white rounded-lg p-5">
//       <div className="flex items-center justify-center mb-6">
//         <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg px-6 py-3">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
//             Operators Required Vs Available
//           </h2>
//         </div>
//       </div>
//       <div className="flex justify-center items-center min-h-[200px]">
//           {renderContent()}
//       </div>
//       {selected && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setSelected(null)}>
//           <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
//             <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
//             <h3 className="text-xl font-bold mb-4">Employees for Level {selected.level}</h3>
//             {employees.length === 0 ? ( <p className="text-gray-600">No employees found for this level and criteria.</p> ) : ( <ul className="space-y-2"> {employees.map((employee) => ( <li key={employee.id} className="p-3 bg-gray-50 rounded-md border"> <span className="font-semibold">{employee.name}</span> {employee.advancementDate && <span className="text-sm text-gray-500 block">Advanced: {employee.advancementDate}</span>} </li> ))} </ul> )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OperatorStatsRedirect;





import React, { useState, useEffect, useCallback } from 'react';

// --- INTERFACES ---
type OperatorStats = {
  id: number;
  level: number;
  operator_required: number;
  operator_available: number;
};

type Employee = {
  id: number;
  name: string;
  level: number;
  advancementDate?: string;
};

interface LevelSummaryResponse {
  [key: string]: number; 
}

// --- CONSTANTS ---
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PASTEL_COLORS = ['#FFD6E8', '#D4E5FF', '#E8D5FF', '#D5FFE4', '#FFE5D6', '#FFFFD6'];

// --- PROPS INTERFACE ---
interface Props {
  hqId: number | null;
  factoryId: number | null;
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  selectedMonth: string;
  selectedYear: number;
}

const OperatorStatsRedirect: React.FC<Props> = ({
  hqId,
  factoryId,
  departmentId,
  lineId,
  sublineId,
  stationId,
  selectedMonth,
  selectedYear,
}) => {
  const [data, setData] = useState<OperatorStats[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<OperatorStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRequired, setShowRequired] = useState(true);

  // --- Data Fetching Logic ---
  const fetchData = useCallback(async () => {
    if (!factoryId || !selectedYear || !selectedMonth) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const monthNumber = MONTHS.indexOf(selectedMonth) + 1;
      if (monthNumber === 0) throw new Error("Invalid month name provided");

      const params = new URLSearchParams({
        factory: factoryId.toString(),
        year: selectedYear.toString(),
        month: monthNumber.toString(),
      });
      if (hqId) params.append('hq', hqId.toString());
      if (departmentId) params.append('department', departmentId.toString());
      if (lineId) params.append('line', lineId.toString());
      if (sublineId) params.append('subline', sublineId.toString());
      if (stationId) params.append('station', stationId.toString());

      const url = `http://127.0.0.1:8000/production-data/weekly-summary/?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `Failed to fetch operator stats: ${response.status}`);
      }

      const summary: LevelSummaryResponse = await response.json();
      if (!summary) throw new Error('API returned an empty response.');

      const transformedData: OperatorStats[] = [];
      for (let level = 1; level <= 4; level++) {
        const required = (summary[`ctq_plan_l${level}`] ?? 0) + (summary[`pdi_plan_l${level}`] ?? 0) + (summary[`other_plan_l${level}`] ?? 0);
        const available = (summary[`ctq_actual_l${level}`] ?? 0) + (summary[`pdi_actual_l${level}`] ?? 0) + (summary[`other_actual_l${level}`] ?? 0);
        transformedData.push({ id: level, level, operator_required: required, operator_available: available });
      }
      setData(transformedData);
    } catch (err) {
      console.error('Error fetching operator requirements:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedMonth, selectedYear]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchEmployees = async (level: number) => {
    try {
        setEmployees([]);
        const params = new URLSearchParams({ level: level.toString() });
        if (factoryId) params.append('factory_id', factoryId.toString());
        if (departmentId) params.append('department_id', departmentId.toString());
        if (lineId) params.append('line_id', lineId.toString());
        if (sublineId) params.append('subline_id', sublineId.toString());
        if (stationId) params.append('station_id', stationId.toString());

        const url = `http://127.0.0.1:8000/employees/?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch employees: ${response.status}`);
        const employeesData = await response.json();
        setEmployees(employeesData);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setEmployees([]);
      }
  };

  const handleClick = (stat: OperatorStats) => { setSelected(stat); fetchEmployees(stat.level); };
  const getStatus = (available: number, required: number) => {
    if (required === 0 && available === 0) return { text: 'No Data', color: '#9CA3AF' };
    if (required === 0) return { text: 'No Requirement', color: '#6B7280' };
    if (available === required) return { text: 'Optimal', color: '#10B981' };
    if (available > required) return { text: 'Surplus', color: '#8B5CF6' };
    if (available / required >= 0.95) return { text: 'Near Optimal', color: '#F59E0B' };
    return { text: 'Shortage', color: '#EF4444' };
  };

  const getPieChartData = () => {
    const values = data.map(d => showRequired ? d.operator_required : d.operator_available);
    const total = values.reduce((sum, val) => sum + val, 0);
    if (total === 0) return [];
    let currentAngle = 0;
    return data.map((stat, index) => {
      const value = showRequired ? stat.operator_required : stat.operator_available;
      const percentage = (value / total) * 100;
      const angle = (value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;
      return { ...stat, value, percentage, startAngle, endAngle: currentAngle, color: PASTEL_COLORS[index % PASTEL_COLORS.length] };
    });
  };

  const createPieSlice = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          {/* Updated: border-primary, text-muted */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted">Loading operator stats...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500 font-medium text-center">Error: {error}</p>;
    }
    if (data.length === 0 || data.every(d => d.operator_required === 0 && d.operator_available === 0)) {
      // Updated: text-muted
      return <p className="text-muted text-center">No operator stats available for the selected criteria.</p>;
    }

    const pieData = getPieChartData();
    const total = pieData.reduce((sum, d) => sum + d.value, 0);

    return (
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {/* Updated Buttons */}
          <button 
            onClick={() => setShowRequired(true)} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ showRequired ? 'bg-primary text-white shadow-brand' : 'bg-surface text-muted hover:bg-muted/10 border border-border' }`}
          >
            Required
          </button>
          <button 
            onClick={() => setShowRequired(false)} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ !showRequired ? 'bg-header-primary text-white shadow-brand' : 'bg-surface text-muted hover:bg-muted/10 border border-border' }`}
          >
            Available
          </button>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="relative">
            <svg width="300" height="300" className="drop-shadow-lg">
              {/* Pie Background: bg-surface, stroke-border */}
              <circle cx="150" cy="150" r="120" className="fill-surface stroke-border" strokeWidth="2"/>
              {pieData.map((slice) => (
                <g key={slice.id}>
                  {/* Note: Colors are hardcoded pastels, stroke matches surface for separation */}
                  <path 
                    d={createPieSlice(150, 150, 120, slice.startAngle - 90, slice.endAngle - 90)} 
                    fill={slice.color} 
                    stroke="rgb(var(--bg-card))" 
                    strokeWidth="2" 
                    className="cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => handleClick(slice)} 
                  />
                  {slice.percentage > 5 && (
                    <text 
                      x={150 + 80 * Math.cos(((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180)} 
                      y={150 + 80 * Math.sin(((slice.startAngle + slice.endAngle) / 2 - 90) * Math.PI / 180)} 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="fill-gray-800 text-sm font-semibold pointer-events-none" // Kept gray-800 for contrast on pastel
                    >
                      L{slice.level}
                    </text>
                  )}
                </g>
              ))}
              {/* Inner Circle: bg-surface, stroke-border */}
              <circle cx="150" cy="150" r="60" className="fill-surface stroke-border" strokeWidth="2"/>
              {/* Center Text: text-text, text-muted */}
              <text x="150" y="140" textAnchor="middle" className="fill-text text-2xl font-bold">{total}</text>
              <text x="150" y="165" textAnchor="middle" className="fill-muted text-sm">Total {showRequired ? 'Required' : 'Available'}</text>
            </svg>
          </div>
          <div className="space-y-3">
            {pieData.map((item) => {
              const status = getStatus(item.operator_available, item.operator_required);
              return (
                // List Item: hover:bg-muted/10
                <div key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/10 p-2 rounded-lg transition-colors" onClick={() => handleClick(item)}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}/>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text">Level {item.level}</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: status.color + '20', color: status.color }}>{status.text}</span>
                    </div>
                    <div className="text-sm text-muted">{item.value} operators ({item.percentage.toFixed(1)}%)</div>
                    <div className="text-xs text-muted/70">Required: {item.operator_required} | Available: {item.operator_available}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    // Updated: bg-surface, border-border (implicit via layout container usually)
    <div className="w-full bg-surface rounded-lg p-5 transition-colors duration-300">
      <div className="flex items-center justify-center mb-6">
        {/* Updated: bg-primary/10 */}
        <div className="bg-primary/10 rounded-lg px-6 py-3">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Operators Required Vs Available
          </h2>
        </div>
      </div>
      <div className="flex justify-center items-center min-h-[200px]">
          {renderContent()}
      </div>
      {selected && (
        // Modal Overlay
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={() => setSelected(null)}>
          {/* Modal Content: bg-surface, text-text */}
          <div className="bg-surface p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative shadow-hard" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-muted hover:text-text transition-colors" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <h3 className="text-xl font-bold mb-4 text-text">Employees for Level {selected.level}</h3>
            {employees.length === 0 ? ( <p className="text-muted">No employees found for this level and criteria.</p> ) : ( 
              <ul className="space-y-2"> 
                {employees.map((employee) => ( 
                  // Employee Item: bg-background, border-border
                  <li key={employee.id} className="p-3 bg-background rounded-md border border-border"> 
                    <span className="font-semibold text-text">{employee.name}</span> 
                    {employee.advancementDate && <span className="text-sm text-muted block">Advanced: {employee.advancementDate}</span>} 
                  </li> 
                ))} 
              </ul> 
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorStatsRedirect;