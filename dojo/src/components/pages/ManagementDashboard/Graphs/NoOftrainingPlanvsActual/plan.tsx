

// import React, { useEffect, useState } from "react";
// import BarChart from "../../Barchart/barchart";

// interface PlanProps {
//   hqId?: string;
//   factoryId?: string;
//   departmentId?: string;
//   lineId?: string;
//   sublineId?: string;
//   stationId?: string;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const Plan: React.FC<PlanProps> = ({ 
//   hqId, factoryId, departmentId, lineId, sublineId, stationId 
// }) => {
//   const [plannedData, setPlannedData] = useState<number[]>([]);
//   const [actualData, setActualData] = useState<number[]>([]);
  
//   // Fixed Labels for Jan-Dec
//   const [labels] = useState<string[]>([
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ]);
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     const fetchTrainingData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const params = new URLSearchParams();
//         params.append('year', '2025'); 

//         // Frontend Logic for "All":
//         // If hqId is "" (empty string), this 'if' is false, so we don't append.
//         // Backend sees missing param -> Skips filter -> Sums everything. Correct.
//         if (hqId) params.append('hq', hqId);
//         if (factoryId) params.append('factory', factoryId);
//         if (departmentId) params.append('department', departmentId);
//         if (lineId) params.append('line', lineId);
//         if (sublineId) params.append('subline', sublineId);
//         if (stationId) params.append('station', stationId);
        
//         const response = await fetch(`${API_BASE_URL}/chart/training-plans/?${params.toString()}`);
        
//         if (!response.ok) {
//             throw new Error("Failed to fetch data");
//         }
        
//         const apiData = await response.json();

//         // Zero-Filling Logic
//         const filledPlans = new Array(12).fill(0);
//         const filledActual = new Array(12).fill(0);

//         if (apiData && apiData.length > 0) {
//           apiData.forEach((item: any) => {
//             const date = new Date(item.month_year);
//             const monthIndex = date.getMonth(); 
            
//             filledPlans[monthIndex] = item.training_plans;
//             filledActual[monthIndex] = item.trainings_actual;
//           });
//         }

//         setPlannedData(filledPlans);
//         setActualData(filledActual);

//       } catch (err) {
//         console.error("Error fetching training data:", err);
//         setError("Failed to load training data");
//         setPlannedData(new Array(12).fill(0));
//         setActualData(new Array(12).fill(0));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrainingData();
//   }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]); 

//   const title = "No of Trainings Plan vs Actual";
  
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
//             <BarChart
//               key={`${hqId}-${factoryId}-${stationId}`} // Forces re-render on filter change
//               labels={labels}
//               data1={plannedData}
//               data2={actualData}
//               groupLabels={["Plan", "Actual"]}  
//               title=""
//               color1="rgba(52, 152, 219, 0.8)"
//               color2="rgba(13, 32, 160, 0.8)" 
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Plan;




import React, { useEffect, useState } from "react";
import BarChart from "../../Barchart/barchart";

interface PlanProps {
  hqId?: string;
  factoryId?: string;
  departmentId?: string;
  lineId?: string;
  sublineId?: string;
  stationId?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const Plan: React.FC<PlanProps> = ({ 
  hqId, factoryId, departmentId, lineId, sublineId, stationId 
}) => {
  const [plannedData, setPlannedData] = useState<number[]>([]);
  const [actualData, setActualData] = useState<number[]>([]);
  
  // Fixed Labels for Jan-Dec
  const [labels] = useState<string[]>([
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. NEW: Theme State for Chart Colors ---
  const [chartTheme, setChartTheme] = useState({
    textColor: '#374151', // default dark gray (Light Mode)
    gridColor: 'rgba(156,163,175,0.2)'  // default subtle gray
  });

  // --- 2. NEW: Effect to detect Dark Mode changes ---
  useEffect(() => {
    const updateChartTheme = () => {
        // Check if 'dark' class exists on the html element
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            setChartTheme({
                textColor: '#e5e7eb', // gray-200 (Bright text for Dark Mode)
                gridColor: 'rgba(255, 255, 255, 0.1)' // subtle white lines
            });
        } else {
            setChartTheme({
                textColor: '#374151', // gray-700 (Dark text for Light Mode)
                gridColor: 'rgba(156,163,175,0.2)' 
            });
        }
    };

    // Run initially
    updateChartTheme();

    // Watch for class changes on <html> element
    const observer = new MutationObserver(updateChartTheme);
    observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('year', '2025'); 

        if (hqId) params.append('hq', hqId);
        if (factoryId) params.append('factory', factoryId);
        if (departmentId) params.append('department', departmentId);
        if (lineId) params.append('line', lineId);
        if (sublineId) params.append('subline', sublineId);
        if (stationId) params.append('station', stationId);
        
        const response = await fetch(`${API_BASE_URL}/chart/training-plans/?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        
        const apiData = await response.json();

        const filledPlans = new Array(12).fill(0);
        const filledActual = new Array(12).fill(0);

        if (apiData && apiData.length > 0) {
          apiData.forEach((item: any) => {
            const date = new Date(item.month_year);
            const monthIndex = date.getMonth(); 
            
            filledPlans[monthIndex] = item.training_plans;
            filledActual[monthIndex] = item.trainings_actual;
          });
        }

        setPlannedData(filledPlans);
        setActualData(filledActual);

      } catch (err) {
        console.error("Error fetching training data:", err);
        setError("Failed to load training data");
        setPlannedData(new Array(12).fill(0));
        setActualData(new Array(12).fill(0));
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]); 

  const title = "No of Trainings Plan vs Actual";
  
  return (
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
            <BarChart
              key={`${hqId}-${factoryId}-${stationId}`} 
              labels={labels}
              data1={plannedData}
              data2={actualData}
              groupLabels={["Plan", "Actual"]}  
              title=""
              color1="rgba(52, 152, 219, 0.8)"
              color2="rgba(13, 32, 160, 0.8)"
              
              // --- 3. PASS THE COLORS HERE ---
              textColor={chartTheme.textColor}
              gridColor={chartTheme.gridColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;