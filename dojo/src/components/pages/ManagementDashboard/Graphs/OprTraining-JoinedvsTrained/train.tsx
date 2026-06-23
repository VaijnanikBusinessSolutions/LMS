



// import React, { useState, useEffect } from 'react';
// import LineGraph from '../../LineGraph/linegraph';

// interface TrainingProps {
//   hqId: string;
//   factoryId: string;
//   departmentId: string;
//   lineId: string;
//   sublineId: string;
//   stationId: string;
// }

// const Training: React.FC<TrainingProps> = ({ 
//   hqId, factoryId, departmentId, lineId, sublineId, stationId 
// }) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
    
//     // Chart X-Axis Labels
//     const [labels] = useState<string[]>([
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//     ]);
    
//     const [data1, setData1] = useState<number[]>([]); // Joined
//     const [data2, setData2] = useState<number[]>([]); // Trained

//     // Helper array to map Backend Month Names to Array Index
//     const monthNames = [
//         "January", "February", "March", "April", "May", "June", 
//         "July", "August", "September", "October", "November", "December"
//     ];

//     useEffect(() => {
//         const fetchTrainingData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
                
//                 // 1. Call the new endpoint (No filtering params attached)
//                 const response = await fetch('http://127.0.0.1:8000/operator-analytics/');
                
//                 if (!response.ok) throw new Error('Failed to fetch data');
                
//                 const apiData = await response.json();

//                 // 2. Initialize empty arrays (0 to 11) filled with 0
//                 const filledJoined = new Array(12).fill(0);
//                 const filledTrained = new Array(12).fill(0);

//                 // 3. Process "Operator Joined" Data
//                 // apiData.operator_joined looks like: { "January": 4, "February": 5 }
//                 if (apiData.operator_joined) {
//                     Object.keys(apiData.operator_joined).forEach((monthKey) => {
//                         const index = monthNames.indexOf(monthKey); // Find index (e.g., "January" -> 0)
//                         if (index !== -1) {
//                             filledJoined[index] = apiData.operator_joined[monthKey];
//                         }
//                     });
//                 }

//                 // 4. Process "Operator Trained" Data
//                 if (apiData.operator_trained) {
//                     Object.keys(apiData.operator_trained).forEach((monthKey) => {
//                         const index = monthNames.indexOf(monthKey);
//                         if (index !== -1) {
//                             filledTrained[index] = apiData.operator_trained[monthKey];
//                         }
//                     });
//                 }

//                 // 5. Update State
//                 setData1(filledJoined);
//                 setData2(filledTrained);
                
//             } catch (err: any) {
//                 console.error(err);
//                 setError(err.message);
//                 setData1(new Array(12).fill(0));
//                 setData2(new Array(12).fill(0));
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTrainingData();
//         // We keep the dependency array but ignoring props inside fetch logic as requested
//     }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]); 

//     if (loading) return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;

//     return (
//         <div className="w-full h-full bg-white flex flex-col">
//             <h3 className="text-lg font-medium text-gray-900 p-4 pb-2">Operators Training</h3>
//             <div className="flex-1 w-full px-2">
//                 <LineGraph
//                     labels={labels}
//                     data1={data1} 
//                     data2={data2}  
//                     area={true}
//                     showSecondLine={true}
//                     label1="Operators Joined"
//                     label2="Operators Trained"
//                     line1Color="#4f46e5"
//                     line2Color="#10b981"
//                     area1Color="rgba(79, 70, 229, 0.1)"
//                     area2Color="rgba(16, 185, 129, 0.1)"
//                     maintainAspectRatio={false}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Training;


import React, { useState, useEffect } from 'react';
import LineGraph from '../../LineGraph/linegraph';

interface TrainingProps {
  hqId: string;
  factoryId: string;
  departmentId: string;
  lineId: string;
  sublineId: string;
  stationId: string;
}

const Training: React.FC<TrainingProps> = ({ 
  hqId, factoryId, departmentId, lineId, sublineId, stationId 
}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Chart X-Axis Labels
    const [labels] = useState<string[]>([
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]);
    
    const [data1, setData1] = useState<number[]>([]); // Joined
    const [data2, setData2] = useState<number[]>([]); // Trained

    // --- NEW: Theme State for Chart Colors ---
    const [chartTheme, setChartTheme] = useState({
        textColor: '#6b7280', // default gray-500 (Light Mode)
        gridColor: '#e5e7eb'  // default gray-200 (Light Mode)
    });

    // --- NEW: Effect to detect Dark Mode changes ---
    useEffect(() => {
        const updateChartTheme = () => {
            // Check if 'dark' class exists on the html element
            const isDark = document.documentElement.classList.contains('dark');
            
            if (isDark) {
                setChartTheme({
                    textColor: '#9ca3af', // gray-400 (Visible on dark)
                    gridColor: '#374151'  // gray-700 (Subtle on dark)
                });
            } else {
                setChartTheme({
                    textColor: '#6b7280', // gray-500 (Visible on light)
                    gridColor: '#e5e7eb'  // gray-200 (Subtle on light)
                });
            }
        };

        // Run initially
        updateChartTheme();

        // Watch for class changes on <html> element (standard Tailwind Dark Mode toggle)
        const observer = new MutationObserver(updateChartTheme);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });

        return () => observer.disconnect();
    }, []);

    // Helper array to map Backend Month Names to Array Index
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchTrainingData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('http://127.0.0.1:8000/operator-analytics/');
                
                if (!response.ok) throw new Error('Failed to fetch data');
                
                const apiData = await response.json();

                const filledJoined = new Array(12).fill(0);
                const filledTrained = new Array(12).fill(0);

                if (apiData.operator_joined) {
                    Object.keys(apiData.operator_joined).forEach((monthKey) => {
                        const index = monthNames.indexOf(monthKey);
                        if (index !== -1) {
                            filledJoined[index] = apiData.operator_joined[monthKey];
                        }
                    });
                }

                if (apiData.operator_trained) {
                    Object.keys(apiData.operator_trained).forEach((monthKey) => {
                        const index = monthNames.indexOf(monthKey);
                        if (index !== -1) {
                            filledTrained[index] = apiData.operator_trained[monthKey];
                        }
                    });
                }

                setData1(filledJoined);
                setData2(filledTrained);
                
            } catch (err: any) {
                console.error(err);
                setError(err.message);
                setData1(new Array(12).fill(0));
                setData2(new Array(12).fill(0));
            } finally {
                setLoading(false);
            }
        };

        fetchTrainingData();
    }, [hqId, factoryId, departmentId, lineId, sublineId, stationId]); 

    if (loading) return <div className="flex items-center justify-center h-full text-muted">Loading...</div>;

    return (
        <div className="w-full h-full bg-surface flex flex-col">
            <h3 className="text-lg font-medium text-text p-4 pb-2">Operators Training</h3>
            <div className="flex-1 w-full px-2">
                <LineGraph
                    labels={labels}
                    data1={data1} 
                    data2={data2}  
                    area={true}
                    showSecondLine={true}
                    label1="Operators Joined"
                    label2="Operators Trained"
                    line1Color="#4f46e5"
                    line2Color="#10b981"
                    area1Color="rgba(79, 70, 229, 0.1)"
                    area2Color="rgba(16, 185, 129, 0.1)"
                    maintainAspectRatio={false}
                    
                    // ✅ Pass the dynamic colors here
                    // Note: Ensure your LineGraph component accepts these props
                    // and passes them to the Chart.js options.scales.[x/y].ticks.color
                    textColor={chartTheme.textColor}
                    gridColor={chartTheme.gridColor}
                />
            </div>
        </div>
    );
};

export default Training;