


// import React, { useEffect, useState } from "react";
// import LineGraph from "../../LineGraph/linegraph";

// // 1. Define Props
// interface DefectsRejectedProps {
//   hqId?: string;
//   factoryId?: string;
//   departmentId?: string;
//   lineId?: string;
//   sublineId?: string;
//   stationId?: string;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const DefectsRejected: React.FC<DefectsRejectedProps> = ({
//   hqId, factoryId, departmentId, lineId, sublineId, stationId
// }) => {
//     // Default to 0s
//     const [data1, setData1] = useState<number[]>([]);
//     const [data2, setData2] = useState<number[]>([]);
    
//     // Standard 12-Month Labels
//     const [labels] = useState<string[]>([
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ]);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchRejectionData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 // Build URL Params
//                 const params = new URLSearchParams();
//                 params.append('year', '2025'); // Force 2025
                
//                 if (hqId) params.append('hq', hqId);
//                 if (factoryId) params.append('factory', factoryId);
//                 if (departmentId) params.append('department', departmentId);
//                 if (lineId) params.append('line', lineId);
//                 if (sublineId) params.append('subline', sublineId);
//                 if (stationId) params.append('station', stationId);

//                 const response = await fetch(`${API_BASE_URL}/chart/internal-rejection/?${params.toString()}`);
                
//                 if (!response.ok) {
//                     throw new Error("Failed to fetch data");
//                 }

//                 const apiData = await response.json();

//                 // --- ZERO FILLING LOGIC ---
//                 const filledTotal = new Array(12).fill(0);
//                 const filledCtq = new Array(12).fill(0);

//                 if (apiData && apiData.length > 0) {
//                     apiData.forEach((item: any) => {
//                         // "2025-10" -> Index 9
//                         const date = new Date(item.month_year);
//                         const monthIndex = date.getMonth();
                        
//                         filledTotal[monthIndex] = item.total_internal_rejection;
//                         filledCtq[monthIndex] = item.ctq_internal_rejection;
//                     });
//                 }

//                 setData1(filledTotal);
//                 setData2(filledCtq);

//             } catch (err: any) {
//                 console.error("Error fetching rejection data:", err);
//                 setError("Failed to load data");
//                 setData1(new Array(12).fill(0));
//                 setData2(new Array(12).fill(0));
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRejectionData();
//     }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]);

//     const title = "Total Rejections - MSIL";

//     return (
//         <div style={{ width: "100%", height: "100%", margin: "auto", display: "flex", flexDirection: "column" }}>
//             <h5 style={{
//                 color: "black",
//                 margin: "0",
//                 padding: "10px 15px",
//                 fontSize: "16px",
//                 fontFamily: "Arial, sans-serif",
//                 fontWeight: "bold"
//             }}>
//                 {title}
//             </h5>

//             <div style={{ flex: 1, padding: "0 10px 10px 10px", minHeight: "0" }}>
//                 {loading ? (
//                     <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                         <p style={{ color: "#6b7280" }}>Loading rejection data...</p>
//                     </div>
//                 ) : (
//                     // Added key to force refresh
//                     <LineGraph
//                         key={`${hqId}-${factoryId}-${stationId}`}
//                         labels={labels}
//                         data1={data1}
//                         data2={data2}
//                         area={false}
//                         showSecondLine={true}
//                         label1="Total Internal Rejection"
//                         label2="CTQ Internal Rejection"
//                         maintainAspectRatio={false}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DefectsRejected;



import React, { useEffect, useState } from "react";
import LineGraph from "../../LineGraph/linegraph";

// 1. Define Props
interface DefectsRejectedProps {
  hqId?: string;
  factoryId?: string;
  departmentId?: string;
  lineId?: string;
  sublineId?: string;
  stationId?: string;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const DefectsRejected: React.FC<DefectsRejectedProps> = ({
  hqId, factoryId, departmentId, lineId, sublineId, stationId
}) => {
    // Default to 0s
    const [data1, setData1] = useState<number[]>([]);
    const [data2, setData2] = useState<number[]>([]);
    
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
        const fetchRejectionData = async () => {
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

                const response = await fetch(`${API_BASE_URL}/chart/internal-rejection/?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const apiData = await response.json();

                // --- ZERO FILLING LOGIC ---
                const filledTotal = new Array(12).fill(0);
                const filledCtq = new Array(12).fill(0);

                if (apiData && apiData.length > 0) {
                    apiData.forEach((item: any) => {
                        const date = new Date(item.month_year);
                        const monthIndex = date.getMonth();
                        
                        filledTotal[monthIndex] = item.total_internal_rejection;
                        filledCtq[monthIndex] = item.ctq_internal_rejection;
                    });
                }

                setData1(filledTotal);
                setData2(filledCtq);

            } catch (err: any) {
                console.error("Error fetching rejection data:", err);
                setError("Failed to load data");
                setData1(new Array(12).fill(0));
                setData2(new Array(12).fill(0));
            } finally {
                setLoading(false);
            }
        };

        fetchRejectionData();
    }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]);

    const title = "Total Rejections - MSIL";

    return (
        // Updated Container with Semantic Tokens
        <div className="w-full h-full bg-surface rounded-lg shadow-sm flex flex-col overflow-hidden">
            <h5 className="text-lg font-semibold text-text p-4 border-b border-border m-0">
                {title}
            </h5>

            <div className="flex-1 w-full p-2 min-h-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-muted">Loading rejection data...</p>
                    </div>
                ) : (
                    <LineGraph
                        key={`${hqId}-${factoryId}-${stationId}`}
                        labels={labels}
                        data1={data1}
                        data2={data2}
                        area={false}
                        showSecondLine={true}
                        label1="Total Internal Rejection"
                        label2="CTQ Internal Rejection"
                        maintainAspectRatio={false}
                        // --- 3. Pass Dynamic Colors ---
                        textColor={chartTheme.textColor}
                        gridColor={chartTheme.gridColor}
                    />
                )}
            </div>
        </div>
    );
};

export default DefectsRejected;