


// import React, { useEffect, useState } from 'react';
// import {
//   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend,
// } from 'recharts';

// // 1. Update Props Interface
// interface AttritionProps {
//   hqId: number | null;
//   factoryId: number | null;
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
//   selectedYear?: number; 
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const AttritionTrendChart: React.FC<AttritionProps> = ({ 
//   hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear 
// }) => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!factoryId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         const params = new URLSearchParams();
//         params.append('year', selectedYear ? selectedYear.toString() : new Date().getFullYear().toString());

//         // "All" Logic
//         if (hqId) params.append('hq', hqId.toString());
//         if (factoryId) params.append('factory', factoryId.toString());
//         if (departmentId) params.append('department', departmentId.toString());
//         if (lineId) params.append('line', lineId.toString());
//         if (sublineId) params.append('subline', sublineId.toString());
//         if (stationId) params.append('station', stationId.toString());

//         // Call NEW Endpoint
//         const response = await fetch(`${API_BASE_URL}/chart/attrition-trend/?${params.toString()}`);
        
//         if (!response.ok) throw new Error('Failed to fetch data');
        
//         const apiData = await response.json();

//         // Transform & Zero-Fill
//         const fullYearData = Array.from({ length: 12 }, (_, i) => {
//             const monthIndex = i + 1;
//             const found = apiData.find((d: any) => d.month === monthIndex);
//             return {
//                 name: monthNames[i],
//                 attrition: found ? found.attrition_rate : 0,
//             };
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

//   const CustomLegend = () => (
//     <div className="text-sm text-gray-600 text-center mt-2">
//       <span className="inline-flex items-center gap-2">
//         <div className="w-3 h-3 rounded-full bg-[#007bff]" />
//         Attrition Rate
//       </span>
//     </div>
//   );

//   if (loading) return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;
//   if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;

//   return (
//     <div className="w-full h-[350px] bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">
//         Attrition Rate Trend ({selectedYear})
//       </h2>
//       <ResponsiveContainer width="100%" height="90%">
//         <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
//           <defs>
//             <linearGradient id="colorAttrition" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#007bff" stopOpacity={0.8}/>
//               <stop offset="95%" stopColor="#007bff" stopOpacity={0.1}/>
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="name" axisLine={false} tickLine={false} />
//           <YAxis hide domain={[0, 'dataMax + 5']} />
//           <Tooltip formatter={(value: number) => [`${value}%`, 'Attrition']} />
//           <Legend content={<CustomLegend />} verticalAlign="bottom" height={36}/>
          
//           <Area 
//             type="monotone" 
//             dataKey="attrition" 
//             stroke="#007bff" 
//             fillOpacity={1} 
//             fill="url(#colorAttrition)" 
//           >
//             <LabelList dataKey="attrition" position="top" formatter={(val: number) => val > 0 ? `${val}%` : ''} fontSize={12} />
//           </Area>
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default AttritionTrendChart;





import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend,
} from 'recharts';

// 1. Update Props Interface
interface AttritionProps {
  hqId: number | null;
  factoryId: number | null;
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  selectedYear?: number; 
}

const API_BASE_URL = "http://127.0.0.1:8000";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- THEME CONSTANTS ---
// These map to your globals.css variables
const THEME = {
  primary: "rgb(var(--brand-primary))",
  text: "rgb(var(--text-main))",
  muted: "rgb(var(--text-muted))",
  cardBg: "rgb(var(--bg-card))",
  border: "rgb(var(--border-main))"
};

const AttritionTrendChart: React.FC<AttritionProps> = ({ 
  hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear 
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!factoryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('year', selectedYear ? selectedYear.toString() : new Date().getFullYear().toString());

        // "All" Logic
        if (hqId) params.append('hq', hqId.toString());
        if (factoryId) params.append('factory', factoryId.toString());
        if (departmentId) params.append('department', departmentId.toString());
        if (lineId) params.append('line', lineId.toString());
        if (sublineId) params.append('subline', sublineId.toString());
        if (stationId) params.append('station', stationId.toString());

        // Call NEW Endpoint
        const response = await fetch(`${API_BASE_URL}/chart/attrition-trend/?${params.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const apiData = await response.json();

        // Transform & Zero-Fill
        const fullYearData = Array.from({ length: 12 }, (_, i) => {
            const monthIndex = i + 1;
            const found = apiData.find((d: any) => d.month === monthIndex);
            return {
                name: monthNames[i],
                attrition: found ? found.attrition_rate : 0,
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

  const CustomLegend = () => (
    <div className="text-sm text-muted text-center mt-2">
      <span className="inline-flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: THEME.primary }} 
        />
        Attrition Rate
      </span>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-full text-muted">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;

  return (
    // Replaced bg-white with bg-surface and added border
    <div className="w-full h-[350px] bg-surface border border-border rounded-lg shadow-soft p-4 transition-colors duration-300">
      {/* Replaced text-gray-700 with text-text */}
      <h2 className="text-center text-lg font-semibold mb-2 text-text">
        Attrition Rate Trend ({selectedYear})
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAttrition" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={THEME.primary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: THEME.muted }}
          />
          <YAxis hide domain={[0, 'dataMax + 5']} />
          
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Attrition']}
            contentStyle={{ 
              backgroundColor: THEME.cardBg, 
              borderColor: THEME.border, 
              color: THEME.text,
              borderRadius: '8px'
            }}
            itemStyle={{ color: THEME.text }}
          />
          
          <Legend content={<CustomLegend />} verticalAlign="bottom" height={36}/>
          
          <Area 
            type="monotone" 
            dataKey="attrition" 
            stroke={THEME.primary} 
            fillOpacity={1} 
            fill="url(#colorAttrition)" 
          >
            <LabelList 
              dataKey="attrition" 
              position="top" 
              formatter={(val: number) => val > 0 ? `${val}%` : ''} 
              fontSize={12} 
              fill={THEME.text} // Label color adapts to theme
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttritionTrendChart;