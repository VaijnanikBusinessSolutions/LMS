


// import React, { useEffect, useState } from 'react';
// import {
//   AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend,
// } from 'recharts';

// interface BufferProps {
//   hqId: number | null;
//   factoryId: number | null;
//   departmentId: number | null;
//   lineId: number | null;
//   sublineId: number | null;
//   stationId: number | null;
//   selectedYear?: number; 
//   // We can ignore startDate/endDate for the monthly trend view usually, 
//   // but you can pass them if needed for filtering. 
//   // For now, we stick to the Year trend logic.
//   startDate?: string | null;
//   endDate?: string | null;
//   timeView?: 'Monthly' | 'Weekly';
//   selectedMonth?: string; 
//   selectedWeek?: string;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// const BufferManpowerAvailability: React.FC<BufferProps> = ({ 
//   hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear 
// }) => {
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [containerWidth, setContainerWidth] = useState<number>(560);

//   useEffect(() => {
//     const handleResize = () => {
//       const container = document.getElementById('buffer-chart-container');
//       if (container) setContainerWidth(container.clientWidth);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

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

//         // All Logic
//         if (hqId) params.append('hq', hqId.toString());
//         if (factoryId) params.append('factory', factoryId.toString());
//         if (departmentId) params.append('department', departmentId.toString());
//         if (lineId) params.append('line', lineId.toString());
//         if (sublineId) params.append('subline', sublineId.toString());
//         if (stationId) params.append('station', stationId.toString());

//         const response = await fetch(`${API_BASE_URL}/chart/buffer-manpower-trend/?${params.toString()}`);
        
//         if (!response.ok) throw new Error('Failed to fetch data');
        
//         const apiData = await response.json();

//         // Transform & Zero-Fill
//         const fullYearData = Array.from({ length: 12 }, (_, i) => {
//             const monthIndex = i + 1;
//             const found = apiData.find((d: any) => d.month === monthIndex);
//             return {
//                 month: monthNames[i],
//                 required: found ? found.buffer_manpower_required : 0,
//                 available: found ? found.buffer_manpower_available : 0,
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
//     <div className="bg-white rounded-full px-3 py-1 inline-flex gap-3 text-xs sm:text-sm shadow-sm">
//       <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#339CFF] rounded-full" /><span>Required</span></div>
//       <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#1a365d] rounded-full" /><span>Available</span></div>
//     </div>
//   );

//   const labelFontSize = containerWidth < 500 ? 10 : 12;
//   const tickFontSize = containerWidth < 500 ? 10 : 12;

//   if (loading) return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;
//   if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;

//   return (
//     <div id="buffer-chart-container" className="relative w-full h-[350px] bg-white rounded-lg shadow-lg p-4">
//       <h2 className="text-center text-lg font-semibold mb-2 text-gray-700">Buffer Manpower Trend ({selectedYear})</h2>
//       <ResponsiveContainer width="100%" height="90%">
//         <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
//           <defs>
//             <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#339CFF" stopOpacity={0.7}/>
//                 <stop offset="95%" stopColor="#339CFF" stopOpacity={0.1}/>
//             </linearGradient>
//             <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#1a365d" stopOpacity={0.7}/>
//                 <stop offset="95%" stopColor="#1a365d" stopOpacity={0.1}/>
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="month" tick={{ fontSize: tickFontSize }} axisLine={false} tickLine={false} />
//           <YAxis hide domain={[0, 'dataMax + 5']} />
//           <Tooltip />
//           <Legend content={<CustomLegend />} verticalAlign="bottom" height={36} />
          
//           <Area type="monotone" dataKey="required" stroke="#339CFF" fill="url(#colorRequired)">
//             <LabelList dataKey="required" position="top" fontSize={labelFontSize} formatter={(v: number) => v > 0 ? v : ''} />
//           </Area>
//           <Area type="monotone" dataKey="available" stroke="#1a365d" fill="url(#colorAvailable)">
//             <LabelList dataKey="available" position="top" fontSize={labelFontSize} formatter={(v: number) => v > 0 ? v : ''} />
//           </Area>
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default BufferManpowerAvailability;






import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend,
} from 'recharts';

interface BufferProps {
  hqId: number | null;
  factoryId: number | null;
  departmentId: number | null;
  lineId: number | null;
  sublineId: number | null;
  stationId: number | null;
  selectedYear?: number; 
  startDate?: string | null;
  endDate?: string | null;
  timeView?: 'Monthly' | 'Weekly';
  selectedMonth?: string; 
  selectedWeek?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- THEME CONSTANTS ---
// Matches the logic used in ManpowerTrendChart for consistency
const THEME = {
  Required: "rgb(var(--brand-primary))",    // Main Brand Color
  Available: "rgb(var(--header-primary))",  // Secondary/Header Color
  Text: "rgb(var(--text-main))",
  Muted: "rgb(var(--text-muted))",
  CardBg: "rgb(var(--bg-card))",
  Border: "rgb(var(--border-main))"
};

const BufferManpowerAvailability: React.FC<BufferProps> = ({ 
  hqId, factoryId, departmentId, lineId, sublineId, stationId, selectedYear 
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(560);

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('buffer-chart-container');
      if (container) setContainerWidth(container.clientWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        if (hqId) params.append('hq', hqId.toString());
        if (factoryId) params.append('factory', factoryId.toString());
        if (departmentId) params.append('department', departmentId.toString());
        if (lineId) params.append('line', lineId.toString());
        if (sublineId) params.append('subline', sublineId.toString());
        if (stationId) params.append('station', stationId.toString());

        const response = await fetch(`${API_BASE_URL}/chart/buffer-manpower-trend/?${params.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const apiData = await response.json();

        const fullYearData = Array.from({ length: 12 }, (_, i) => {
            const monthIndex = i + 1;
            const found = apiData.find((d: any) => d.month === monthIndex);
            return {
                month: monthNames[i],
                required: found ? found.buffer_manpower_required : 0,
                available: found ? found.buffer_manpower_available : 0,
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

  // Updated Legend to use Theme colors and Tailwind classes
  const CustomLegend = () => (
    <div className="bg-background border border-border rounded-full px-3 py-1 inline-flex gap-3 text-xs sm:text-sm shadow-sm">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.Required }} />
        <span className="text-text">Required</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.Available }} />
        <span className="text-text">Available</span>
      </div>
    </div>
  );

  const labelFontSize = containerWidth < 500 ? 10 : 12;
  const tickFontSize = containerWidth < 500 ? 10 : 12;

  if (loading) return <div className="flex items-center justify-center h-full text-muted">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;

  return (
    // Replaced bg-white with bg-surface, text-gray-700 with text-text
    <div id="buffer-chart-container" className="relative w-full h-[350px] bg-surface border border-border rounded-lg shadow-soft p-4 transition-colors duration-300">
      <h2 className="text-center text-lg font-semibold mb-2 text-text">Buffer Manpower Trend ({selectedYear})</h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
          <defs>
            {/* Gradients using Theme Variables */}
            <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={THEME.Required} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={THEME.Required} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={THEME.Available} stopOpacity={0.7}/>
                <stop offset="95%" stopColor={THEME.Available} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: tickFontSize, fill: THEME.Muted }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis hide domain={[0, 'dataMax + 5']} />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: THEME.CardBg, 
              borderColor: THEME.Border, 
              color: THEME.Text,
              borderRadius: '8px' 
            }}
            itemStyle={{ color: THEME.Text }}
          />
          
          <Legend content={<CustomLegend />} verticalAlign="bottom" height={36} />
          
          <Area type="monotone" dataKey="required" stroke={THEME.Required} fill="url(#colorRequired)">
            <LabelList 
              dataKey="required" 
              position="top" 
              fontSize={labelFontSize} 
              formatter={(v: number) => v > 0 ? v : ''}
              fill={THEME.Text} 
            />
          </Area>
          <Area type="monotone" dataKey="available" stroke={THEME.Available} fill="url(#colorAvailable)">
            <LabelList 
              dataKey="available" 
              position="top" 
              fontSize={labelFontSize} 
              formatter={(v: number) => v > 0 ? v : ''}
              fill={THEME.Text} 
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BufferManpowerAvailability;