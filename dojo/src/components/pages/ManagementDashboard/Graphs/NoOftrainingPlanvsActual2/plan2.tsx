


// import React, { useEffect, useState } from "react";
// import BarChart from "../../Barchart/barchart";

// // 1. Define Props
// interface PlanTwoProps {
//   hqId?: string;
//   factoryId?: string;
//   departmentId?: string;
//   lineId?: string;
//   sublineId?: string;
//   stationId?: string;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const PlanTwo: React.FC<PlanTwoProps> = ({
//   hqId, factoryId, departmentId, lineId, sublineId, stationId
// }) => {
//   // State for data
//   const [tier1TotalData, setTier1TotalData] = useState<number[]>([]);
//   const [tier1CtqData, setTier1CtqData] = useState<number[]>([]);
  
//   // Standard 12-Month Labels
//   const [labels] = useState<string[]>([
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTier1Data = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Build URL Params
//         const params = new URLSearchParams();
//         params.append('year', '2025'); // Force 2025
        
//         if (hqId) params.append('hq', hqId);
//         if (factoryId) params.append('factory', factoryId);
//         if (departmentId) params.append('department', departmentId);
//         if (lineId) params.append('line', lineId);
//         if (sublineId) params.append('subline', sublineId);
//         if (stationId) params.append('station', stationId);

//         const response = await fetch(`${API_BASE_URL}/chart/tier1-defects/?${params.toString()}`);
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch data");
//         }

//         const apiData = await response.json();

//         // --- ZERO FILLING LOGIC ---
//         const filledTotal = new Array(12).fill(0);
//         const filledCtq = new Array(12).fill(0);

//         if (apiData && apiData.length > 0) {
//           apiData.forEach((item: any) => {
//             // "2025-10" -> Index 9
//             const date = new Date(item.month_year);
//             const monthIndex = date.getMonth(); 
            
//             filledTotal[monthIndex] = item.total_defects_tier1;
//             filledCtq[monthIndex] = item.ctq_defects_tier1;
//           });
//         }

//         setTier1TotalData(filledTotal);
//         setTier1CtqData(filledCtq);

//       } catch (err) {
//         console.error("Error fetching Tier 1 defects:", err);
//         setError("Failed to load data");
//         setTier1TotalData(new Array(12).fill(0));
//         setTier1CtqData(new Array(12).fill(0));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTier1Data();
//   }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]);

//   const title = "Tier 1 Defects Analysis";

//   return (
//     <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
//       <div className="p-4 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//       </div>
//       <div className="p-2 flex-1">
//         {loading ? (
//           <div className="w-full h-full flex items-center justify-center">
//             <p className="text-gray-500">Loading data...</p>
//           </div>
//         ) : (
//           <div className="w-full h-full">
//              {/* Key forces re-render on filter change */}
//             <BarChart
//               key={`${hqId}-${factoryId}-${stationId}`}
//               labels={labels}
//               data1={tier1TotalData}
//               data2={tier1CtqData}
//               groupLabels={["Total Defects", "CTQ Defects"]}
//               title=""
//               color1="rgba(52, 152, 219, 0.8)" // Blue
//               color2="rgba(13, 32, 160, 0.8)" // Dark Blue
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlanTwo;




import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";

// 1. Define Props
interface PlanTwoProps {
  hqId?: string;
  factoryId?: string;
  departmentId?: string;
  lineId?: string;
  sublineId?: string;
  stationId?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const PlanTwo: React.FC<PlanTwoProps> = ({
  hqId, factoryId, departmentId, lineId, sublineId, stationId
}) => {
  // State for data
  const [tier1TotalData, setTier1TotalData] = useState<number[]>([]);
  const [tier1CtqData, setTier1CtqData] = useState<number[]>([]);
  
  // Standard 12-Month Labels
  const [labels] = useState<string[]>([
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. NEW: Theme State for Chart Colors ---
  const [chartTheme, setChartTheme] = useState({
    textColor: '#374151', // default dark gray (Light Mode)
    gridColor: 'rgba(156,163,175,0.2)'
  });

  // --- 2. NEW: Effect to detect Dark Mode changes ---
  useEffect(() => {
    const updateChartTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            setChartTheme({
                textColor: '#e5e7eb', // Bright text for Dark Mode
                gridColor: 'rgba(255, 255, 255, 0.1)'
            });
        } else {
            setChartTheme({
                textColor: '#374151', // Dark text for Light Mode
                gridColor: 'rgba(156,163,175,0.2)' 
            });
        }
    };

    updateChartTheme();

    const observer = new MutationObserver(updateChartTheme);
    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchTier1Data = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build URL Params
        const params = new URLSearchParams();
        params.append('year', '2025'); // Force 2025
        
        if (hqId) params.append('hq', hqId);
        if (factoryId) params.append('factory', factoryId);
        if (departmentId) params.append('department', departmentId);
        if (lineId) params.append('line', lineId);
        if (sublineId) params.append('subline', sublineId);
        if (stationId) params.append('station', stationId);

        const response = await fetch(`${API_BASE_URL}/chart/tier1-defects/?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const apiData = await response.json();

        // --- ZERO FILLING LOGIC ---
        const filledTotal = new Array(12).fill(0);
        const filledCtq = new Array(12).fill(0);

        if (apiData && apiData.length > 0) {
          apiData.forEach((item: any) => {
            // "2025-10" -> Index 9
            const date = new Date(item.month_year);
            const monthIndex = date.getMonth(); 
            
            filledTotal[monthIndex] = item.total_defects_tier1;
            filledCtq[monthIndex] = item.ctq_defects_tier1;
          });
        }

        setTier1TotalData(filledTotal);
        setTier1CtqData(filledCtq);

      } catch (err) {
        console.error("Error fetching Tier 1 defects:", err);
        setError("Failed to load data");
        setTier1TotalData(new Array(12).fill(0));
        setTier1CtqData(new Array(12).fill(0));
      } finally {
        setLoading(false);
      }
    };

    fetchTier1Data();
  }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]);

  const title = "Tier 1 Defects Analysis";

  return (
    // Updated Container with Semantic Tokens
    <div className="bg-surface rounded-lg overflow-hidden h-full flex flex-col shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
      </div>
      <div className="p-2 flex-1">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-muted">Loading data...</p>
          </div>
        ) : (
          <div className="w-full h-full">
             {/* Key forces re-render on filter change */}
            <BarChart
              key={`${hqId}-${factoryId}-${stationId}`}
              labels={labels}
              data1={tier1TotalData}
              data2={tier1CtqData}
              groupLabels={["Total Defects", "CTQ Defects"]}
              title=""
              color1="rgba(52, 152, 219, 0.8)" // Blue
              color2="rgba(13, 32, 160, 0.8)" // Dark Blue
              // --- 3. Pass Dynamic Colors ---
              textColor={chartTheme.textColor}
              gridColor={chartTheme.gridColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanTwo;