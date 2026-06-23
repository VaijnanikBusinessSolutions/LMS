
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList,
// } from 'recharts';



// import type { LegendProps } from 'recharts';

// // Custom legend: Required first, then Available
// const renderCustomLegend = (props: LegendProps) => {
//   const { payload } = props;
//   if (!payload) return null;

//   const order: Record<string, number> = { Required: 0, Available: 1 };

//   const sorted = [...payload].sort((a, b) => {
//     const aKey = String(a.value);
//     const bKey = String(b.value);
//     return (order[aKey] ?? 99) - (order[bKey] ?? 99);
//   });

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
//       {sorted.map((entry, index) => (
//         <div
//           key={`item-${index}`}
//           style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
//         >
//           <span
//             style={{
//               display: 'inline-block',
//               width: 13,
//               height: 13,
//               marginRight: 4,
//               backgroundColor: entry.color || '#000',
//               borderRadius: 8,
//             }}
//           />
//           <span style={{ fontSize: 12, color: '#374151' }}>
//             {entry.value}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };



// interface ManpowerTrendProps {
//   hqId: number | null;
//   factoryId: number | null;
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
//   selectedYear?: number;
// }

// const API_BASE_URL = "http://localhost:8000";

// const financialYearConfig = [
//   { name: "Apr", id: 4 },
//   { name: "May", id: 5 },
//   { name: "Jun", id: 6 },
//   { name: "Jul", id: 7 },
//   { name: "Aug", id: 8 },
//   { name: "Sep", id: 9 },
//   { name: "Oct", id: 10 },
//   { name: "Nov", id: 11 },
//   { name: "Dec", id: 12 },
//   { name: "Jan", id: 1 },
//   { name: "Feb", id: 2 },
//   { name: "Mar", id: 3 },
// ];

// // 1. Define Colors Constants so they match in Bars and Legend
// const COLORS = {
//   Required: "#3B82F6", // example: dark blue
//   Available: "#1E3A8A", // example: light blue
// };

// const ManpowerTrendChart: React.FC<ManpowerTrendProps> = ({
//   hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear
// }) => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const params = new URLSearchParams();
//         const yearToSend = selectedYear || new Date().getFullYear();
//         params.append('year', yearToSend.toString());
//         if (hqId) params.append('hq', hqId.toString());
//         if (factoryId) params.append('factory', factoryId.toString());
//         if (departmentId) params.append('department', departmentId.toString());
//         if (lineId) params.append('line', lineId.toString());
//         if (sublineId) params.append('subline', sublineId.toString());
//         if (stationId) params.append('station', stationId.toString());

//         const response = await fetch(`${API_BASE_URL}/chart/total-stats/?${params.toString()}`);
//         if (!response.ok) throw new Error('Failed to fetch data');
//         const apiData = await response.json();

//         const fullYearData = financialYearConfig.map((config) => {
//           const monthData = apiData.find((d: any) => d.month === config.id);
//           return {
//             name: config.name,
//             Required: monthData ? monthData.total_required : 0,
//             Available: monthData ? monthData.total_available : 0,
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

//   if (loading) return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;
//   if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>;

//   // 2. CUSTOM LEGEND CONFIGURATION
//   // This forces the Legend to show "Available" first, then "Required", 
//   // regardless of the Bar order below.
//   const customLegendData = [
//     { id: 'Required', value: 'Required', type: 'square', color: COLORS.Required },
//     { id: 'Available', value: 'Available', type: 'square', color: COLORS.Available },
//   ];

//   return (
//     <div className="w-full h-[350px] bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
//         Manpower Availability Trend
//       </h2>
//       <ResponsiveContainer width="100%" height="80%">
//         <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//           <XAxis dataKey="name" axisLine={false} tickLine={false} />
//           <YAxis hide />
//           <Tooltip
//             cursor={{ fill: '#f3f4f6' }}
//             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//           />

//           {/* 3. Pass the custom payload to the Legend */}
//           <Legend
//             verticalAlign="top"
//             iconType="circle"
//             align="center"
//             wrapperStyle={{ paddingBottom: '20px' }}
//             content={renderCustomLegend}
//           />

//           {/* 4. Bars: You can keep "Required" first here so it stays on the Left side of the cluster */}
//           {/* 4. Bars: Required first (left side), Available second (right side) */}
//           <Bar
//             dataKey="Required"
//             fill={COLORS.Required}
//             radius={[4, 4, 0, 0]}
//             barSize={20}
//             name="Required"
//           >
//             <LabelList
//               dataKey="Required"
//               position="top"
//               fontSize={10}
//               formatter={(label: React.ReactNode) => {
//                 const value = Number(label);
//                 return value > 0 ? label : '';
//               }}
//             />
//           </Bar>

//           <Bar
//             dataKey="Available"
//             fill={COLORS.Available}
//             radius={[4, 4, 0, 0]}
//             barSize={20}
//             name="Available"
//           >
//             <LabelList
//               dataKey="Available"
//               position="top"
//               fontSize={10}
//               formatter={(label: React.ReactNode) => {
//                 const value = Number(label);
//                 return value > 0 ? label : '';
//               }}
//             />
//           </Bar>

//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ManpowerTrendChart;





import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';

import type { LegendProps } from 'recharts';

// --- THEME COLORS ---
// Using CSS variables so they switch automatically between Light/Dark modes
const THEME_COLORS = {
  Required: "rgb(var(--brand-primary))",    // Light: Dark Blue, Dark: Cyan
  Available: "rgb(var(--header-primary))",  // Light: Purple, Dark: Purple (Distinct contrast)
  Text: "rgb(var(--text-main))",
  Muted: "rgb(var(--text-muted))",
  CardBg: "rgb(var(--bg-card))",
  Border: "rgb(var(--border-main))"
};

// Custom legend: Required first, then Available
const renderCustomLegend = (props: LegendProps) => {
  const { payload } = props;
  if (!payload) return null;

  const order: Record<string, number> = { Required: 0, Available: 1 };

  const sorted = [...payload].sort((a, b) => {
    const aKey = String(a.value);
    const bKey = String(b.value);
    return (order[aKey] ?? 99) - (order[bKey] ?? 99);
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
      {sorted.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 13,
              height: 13,
              marginRight: 4,
              backgroundColor: entry.color || '#000',
              borderRadius: 8,
            }}
          />
          {/* Updated text color to theme variable */}
          <span style={{ fontSize: 12, color: THEME_COLORS.Text }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

interface ManpowerTrendProps {
  hqId: number | null;
  factoryId: number | null;
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  selectedYear?: number;
}

const API_BASE_URL = "http://localhost:8000";

const financialYearConfig = [
  { name: "Apr", id: 4 },
  { name: "May", id: 5 },
  { name: "Jun", id: 6 },
  { name: "Jul", id: 7 },
  { name: "Aug", id: 8 },
  { name: "Sep", id: 9 },
  { name: "Oct", id: 10 },
  { name: "Nov", id: 11 },
  { name: "Dec", id: 12 },
  { name: "Jan", id: 1 },
  { name: "Feb", id: 2 },
  { name: "Mar", id: 3 },
];

const ManpowerTrendChart: React.FC<ManpowerTrendProps> = ({
  hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        const yearToSend = selectedYear || new Date().getFullYear();
        params.append('year', yearToSend.toString());
        if (hqId) params.append('hq', hqId.toString());
        if (factoryId) params.append('factory', factoryId.toString());
        if (departmentId) params.append('department', departmentId.toString());
        if (lineId) params.append('line', lineId.toString());
        if (sublineId) params.append('subline', sublineId.toString());
        if (stationId) params.append('station', stationId.toString());

        const response = await fetch(`${API_BASE_URL}/chart/total-stats/?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const apiData = await response.json();

        const fullYearData = financialYearConfig.map((config) => {
          const monthData = apiData.find((d: any) => d.month === config.id);
          return {
            name: config.name,
            Required: monthData ? monthData.total_required : 0,
            Available: monthData ? monthData.total_available : 0,
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

  if (loading) return <div className="flex items-center justify-center h-full text-muted">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>;

  return (
    // Replaced bg-white with bg-surface, added border
    <div className="w-full h-[350px] bg-surface border border-border rounded-lg shadow-soft p-4 transition-colors duration-300">
      {/* Replaced text-gray-700 with text-text */}
      <h2 className="text-lg font-semibold mb-4 text-center text-text">
        Manpower Availability Trend
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          {/* Axis stroke uses muted color */}
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: THEME_COLORS.Muted }}
          />
          <YAxis hide />
          {/* Custom Tooltip Styling for Dark Mode */}
          <Tooltip
            cursor={{ fill: 'rgba(var(--text-muted), 0.1)' }}
            contentStyle={{ 
              backgroundColor: THEME_COLORS.CardBg, 
              borderColor: THEME_COLORS.Border, 
              color: THEME_COLORS.Text,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: THEME_COLORS.Text }}
          />

          <Legend
            verticalAlign="top"
            iconType="circle"
            align="center"
            wrapperStyle={{ paddingBottom: '20px' }}
            content={renderCustomLegend}
          />

          <Bar
            dataKey="Required"
            fill={THEME_COLORS.Required}
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="Required"
          >
            <LabelList
              dataKey="Required"
              position="top"
              fontSize={10}
              fill={THEME_COLORS.Text} // Label color matches text
              formatter={(label: React.ReactNode) => {
                const value = Number(label);
                return value > 0 ? label : '';
              }}
            />
          </Bar>

          <Bar
            dataKey="Available"
            fill={THEME_COLORS.Available}
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="Available"
          >
            <LabelList
              dataKey="Available"
              position="top"
              fontSize={10}
              fill={THEME_COLORS.Text} // Label color matches text
              formatter={(label: React.ReactNode) => {
                const value = Number(label);
                return value > 0 ? label : '';
              }}
            />
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManpowerTrendChart;