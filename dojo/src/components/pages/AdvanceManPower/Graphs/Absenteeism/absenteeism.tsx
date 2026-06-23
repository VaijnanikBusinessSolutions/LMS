
// import React, { useEffect, useState } from 'react';
// import {
//   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, CartesianGrid
// } from 'recharts';

// interface AbsenteeismProps {
//   hqId: number | null;
//   factoryId: number | null;
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
//   selectedYear?: number;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// // FISCAL YEAR ORDER
// const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

// const Absenteeism: React.FC<AbsenteeismProps> = ({
//   hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear
// }) => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       // Prevent fetching if no filters are applied (optional)
//       if (!factoryId && !hqId) {
//         // setLoading(false); return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const today = new Date();
//         const currentMonth = today.getMonth() + 1;
//         const currentYear = today.getFullYear();
        
//         // Auto-detect Fiscal Year (e.g., If today is Feb 2025, FY is 2024)
//         const fiscalStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
//         const targetYear = selectedYear || fiscalStartYear;

//         // 1. Helper to build params
//         const getParams = (year: number) => {
//           const params = new URLSearchParams();
//           params.append('year', year.toString());
//           if (hqId) params.append('hq', hqId.toString());
//           if (factoryId) params.append('factory', factoryId.toString());
//           if (departmentId) params.append('department', departmentId.toString());
//           if (lineId) params.append('line', lineId.toString());
//           if (sublineId) params.append('subline', sublineId.toString());
//           if (stationId) params.append('station', stationId.toString());
//           return params;
//         };

//         // 2. Fetch Year 1 (Apr-Dec) and Year 2 (Jan-Mar)
//         // Note: Ensure the endpoint matches your Django urls.py
//         const [res1, res2] = await Promise.all([
//           fetch(`${API_BASE_URL}/chart/absenteeism-trendlive/?${getParams(targetYear)}`),
//           fetch(`${API_BASE_URL}/chart/absenteeism-trendlive/?${getParams(targetYear + 1)}`)
//         ]);

//         if (!res1.ok || !res2.ok) throw new Error("Failed to fetch data");

//         const dataYear1 = await res1.json();
//         const dataYear2 = await res2.json();

//         const allData = [...dataYear1, ...dataYear2];

//         // 3. Map to Fiscal Year Labels
//         const fullYearData = monthNames.map((month, idx) => {
//           let calendarMonth, calendarYear;

//           if (idx <= 8) { // Apr–Dec
//             calendarMonth = idx + 4;
//             calendarYear = targetYear;
//           } else { // Jan–Mar
//             calendarMonth = idx - 8;
//             calendarYear = targetYear + 1;
//           }

//           const found = allData.find((d: any) => d.year === calendarYear && d.month === calendarMonth);

//           return {
//             month, // "Apr", "May"...
//             // The backend logic (Hybrid) puts the correct number in 'absenteeism_rate'
//             absenteeism: found ? found.absenteeism_rate : 0,
//             // Optional: you can check found.is_live if you want to debug
//           };
//         });

//         setData(fullYearData);

//       } catch (err: any) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear]);

//   if (loading) return <div className="h-[350px] flex items-center justify-center text-gray-500 animate-pulse">Loading Chart...</div>;
//   if (error) return <div className="h-[350px] flex items-center justify-center text-red-500">Error loading data</div>;

//   return (
//     // <div id="absentee-chart-container" className="w-full h-[350px] bg-white rounded-lg shadow-md p-4 border border-gray-100 flex flex-col">
//     <div id="absentee-chart-container" className="w-full h-[350px] bg-white rounded-lg shadow-md p-4 border border-gray-100 flex flex-col">

//       {/* Header & Legend */}
//       {/* <div className="flex flex-col items-start mb-4 px-2 gap-1"> */}
//       <div className="flex flex-col items-center justify-center mb-4 px-2 w-full gap-1">
        
//         {/* Title */}
//         <h2 className="text-lg font-semibold text-gray-700">
//           Absenteeism Rate Trend
//         </h2>
        
//         {/* Legend (Stacked under title) */}
//         <div className="text-xs sm:text-sm text-gray-600">
//           <span className="inline-flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-[#007bff]" />
//             Absenteeism Rate 
//           </span>
//         </div>
//       </div>

//       {/* Chart Area */}
//       <div className="flex-1">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
//             <defs>
//               <linearGradient id="colorAbsentee" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#007bff" stopOpacity={0.6} />
//                 <stop offset="95%" stopColor="#007bff" stopOpacity={0.05} />
//               </linearGradient>
//             </defs>
            
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

//             <XAxis
//               dataKey="month"
//               axisLine={false}
//               tickLine={false}
//               interval={0} 
//               padding={{ left: 20, right: 20 }}
//               // tick={{ fill: '#6b7280', fontSize: 12 }} 
//               dy={10}
//             />
//             {/* <YAxis 
//               axisLine={false} 
//               tickLine={false} 
//               tick={{ fill: '#6b7280', fontSize: 12 }} 
//               domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.2)]} // Add 20% headroom
//             /> */}
            
//             <Tooltip 
//               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//               formatter={(value: number) => [`${value}%`, 'Absentee Rate']} 
//               cursor={{ stroke: '#007bff', strokeWidth: 1, strokeDasharray: '5 5' }}
//             />

//             <Area
//               type="monotone"
//               dataKey="absenteeism"
//               stroke="#007bff"
//               strokeWidth={2}
//               fill="url(#colorAbsentee)"
//               animationDuration={1500}
//             >
//               <LabelList
//                 dataKey="absenteeism"
//                 position="top"
//                 offset={10}
//                 fontSize={11}
//                 fill="#007bff"
//                 formatter={(v: number) => v > 0 ? `${v}%` : ''}
//               />
//             </Area>
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default Absenteeism;



import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, CartesianGrid
} from 'recharts';

interface AbsenteeismProps {
  hqId: number | null;
  factoryId: number | null;
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  selectedYear?: number;
}

const API_BASE_URL = "http://127.0.0.1:8000";

// FISCAL YEAR ORDER
const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

// --- THEME CONSTANTS ---
// Dynamic CSS variables for Recharts
const THEME = {
  primary: "rgb(var(--brand-primary))",
  text: "rgb(var(--text-main))",
  muted: "rgb(var(--text-muted))",
  cardBg: "rgb(var(--bg-card))",
  border: "rgb(var(--border-main))"
};

const Absenteeism: React.FC<AbsenteeismProps> = ({
  hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Prevent fetching if no filters are applied (optional)
      if (!factoryId && !hqId) {
        // setLoading(false); return;
      }

      try {
        setLoading(true);
        setError(null);

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        
        // Auto-detect Fiscal Year
        const fiscalStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
        const targetYear = selectedYear || fiscalStartYear;

        const getParams = (year: number) => {
          const params = new URLSearchParams();
          params.append('year', year.toString());
          if (hqId) params.append('hq', hqId.toString());
          if (factoryId) params.append('factory', factoryId.toString());
          if (departmentId) params.append('department', departmentId.toString());
          if (lineId) params.append('line', lineId.toString());
          if (sublineId) params.append('subline', sublineId.toString());
          if (stationId) params.append('station', stationId.toString());
          return params;
        };

        const [res1, res2] = await Promise.all([
          fetch(`${API_BASE_URL}/chart/absenteeism-trendlive/?${getParams(targetYear)}`),
          fetch(`${API_BASE_URL}/chart/absenteeism-trendlive/?${getParams(targetYear + 1)}`)
        ]);

        if (!res1.ok || !res2.ok) throw new Error("Failed to fetch data");

        const dataYear1 = await res1.json();
        const dataYear2 = await res2.json();

        const allData = [...dataYear1, ...dataYear2];

        // Map to Fiscal Year Labels
        const fullYearData = monthNames.map((month, idx) => {
          let calendarMonth, calendarYear;

          if (idx <= 8) { // Apr–Dec
            calendarMonth = idx + 4;
            calendarYear = targetYear;
          } else { // Jan–Mar
            calendarMonth = idx - 8;
            calendarYear = targetYear + 1;
          }

          const found = allData.find((d: any) => d.year === calendarYear && d.month === calendarMonth);

          return {
            month, 
            absenteeism: found ? found.absenteeism_rate : 0,
          };
        });

        setData(fullYearData);

      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear]);

  // Loading/Error states using theme colors
  if (loading) return <div className="h-[350px] flex items-center justify-center text-muted animate-pulse">Loading Chart...</div>;
  if (error) return <div className="h-[350px] flex items-center justify-center text-red-500">Error loading data</div>;

  return (
    // Container: bg-surface, border-border, text-text
    <div id="absentee-chart-container" className="w-full h-[350px] bg-surface rounded-lg shadow-soft p-4 border border-border flex flex-col transition-colors duration-300">

      {/* Header & Legend */}
      <div className="flex flex-col items-center justify-center mb-4 px-2 w-full gap-1">
        
        {/* Title */}
        <h2 className="text-lg font-semibold text-text">
          Absenteeism Rate Trend
        </h2>
        
        {/* Legend */}
        <div className="text-xs sm:text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: THEME.primary }}
            />
            Absenteeism Rate 
          </span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorAbsentee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.6} />
                <stop offset="95%" stopColor={THEME.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            {/* Grid uses theme border color */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.border} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              interval={0} 
              padding={{ left: 20, right: 20 }}
              tick={{ fill: THEME.muted, fontSize: 12 }} 
              dy={10}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: THEME.cardBg, 
                borderColor: THEME.border, 
                color: THEME.text,
                borderRadius: '8px', 
                border: '1px solid ' + THEME.border,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
              itemStyle={{ color: THEME.text }}
              formatter={(value: number) => [`${value}%`, 'Absentee Rate']} 
              cursor={{ stroke: THEME.primary, strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            <Area
              type="monotone"
              dataKey="absenteeism"
              stroke={THEME.primary}
              strokeWidth={2}
              fill="url(#colorAbsentee)"
              animationDuration={1500}
            >
              <LabelList
                dataKey="absenteeism"
                position="top"
                offset={10}
                fontSize={11}
                fill={THEME.text} // Changed to text color for better dark mode visibility
                formatter={(v: number) => v > 0 ? `${v}%` : ''}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Absenteeism;