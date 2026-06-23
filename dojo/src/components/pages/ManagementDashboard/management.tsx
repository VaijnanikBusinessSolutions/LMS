// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import TrainingSummaryCard from "./Card/Cardprops";
// import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
// import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
// import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
// import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
// import MyTable from "./Graphs/ActionPlanned/mytable";
// import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";

// // Types
// interface SelectOption {
//   id: number;
//   name: string;
// }

// interface Station {
//   id: number;
//   station_name: string;
// }

// interface Subline {
//   id: number;
//   subline_name: string;
//   stations: Station[];
// }

// interface Line {
//   id: number;
//   line_name: string;
//   sublines: Subline[];
// }

// interface Department {
//   id: number;
//   department_name: string;
//   lines?: Line[];
// }

// interface StructureData {
//   hq_name: string;
//   factory_name: string;
//   departments: Department[];
// }

// interface HierarchyNode {
//   structure_id: number;
//   structure_name: string;
//   hq: number;
//   hq_name: string;
//   factory: number;
//   factory_name: string;
//   structure_data: StructureData;
// }

// const Management: React.FC = () => {
//   const location = useLocation();

//   // Selected values
//   const [selectedHQ, setSelectedHQ] = useState<string>("");
//   const [selectedFactory, setSelectedFactory] = useState<string>("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedLine, setSelectedLine] = useState<string>("");
//   const [selectedSubline, setSelectedSubline] = useState<string>("");
//   const [selectedStation, setSelectedStation] = useState<string>("");

//   // Full hierarchy data
//   const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);

//   // Dropdown options
//   const [hqOptions, setHqOptions] = useState<SelectOption[]>([]);
//   const [factoryOptions, setFactoryOptions] = useState<SelectOption[]>([]);
//   const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
//   const [lineOptions, setLineOptions] = useState<SelectOption[]>([]);
//   const [sublineOptions, setSublineOptions] = useState<SelectOption[]>([]);
//   const [stationOptions, setStationOptions] = useState<SelectOption[]>([]);

//   // 1. Fetch hierarchy data
//   useEffect(() => {
//     const fetchHierarchyData = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/hierarchy-simple/");
//         if (!response.ok) throw new Error("Failed to fetch hierarchy");
//         const data: HierarchyNode[] = await response.json();
//         setHierarchyData(data);
//       } catch (error) {
//         console.error("Failed to fetch hierarchy data:", error);
//       }
//     };
//     fetchHierarchyData();
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);

//   // --- CASCADING EFFECTS (The Fix) ---

//   // 2. Data Loaded -> Set HQ Options & Auto-select First
//   useEffect(() => {
//     if (hierarchyData.length > 0) {
//       const uniqueHQs = new Map<number, string>();
//       hierarchyData.forEach((item) => uniqueHQs.set(item.hq, item.hq_name));
//       const options = Array.from(uniqueHQs, ([id, name]) => ({ id, name }));
//       setHqOptions(options);

//       // Auto-select first HQ if none selected
//       if (!selectedHQ && options.length > 0) {
//         setSelectedHQ(String(options[0].id));
//       }
//     }
//   }, [hierarchyData]); // Dependency: Only when data loads

//   // 3. HQ Selected -> Set Factory Options & Auto-select First
//   useEffect(() => {
//     if (!selectedHQ) {
//       setFactoryOptions([]);
//       return;
//     }

//     const uniqueFactories = new Map<number, string>();
//     hierarchyData
//       .filter((item) => item.hq === parseInt(selectedHQ))
//       .forEach((item) => uniqueFactories.set(item.factory, item.factory_name));

//     const options = Array.from(uniqueFactories, ([id, name]) => ({ id, name }));
//     setFactoryOptions(options);

//     // Auto-select first Factory (Always, because "All" is not allowed for Factory)
//     if (options.length > 0) {
//         // Check if current selection is valid for this HQ, if not, pick the first one
//         const currentIsValid = options.find(o => String(o.id) === selectedFactory);
//         if (!currentIsValid) {
//             setSelectedFactory(String(options[0].id));
//         }
//     } else {
//         setSelectedFactory("");
//     }
//   }, [selectedHQ, hierarchyData]);

//   // 4. Factory Selected -> Set Department Options (Default to All)
//   useEffect(() => {
//     // Reset child selections when Factory changes
//     // We do this here to ensure clean state transitions
//     if(selectedFactory) {
//         // Only clear children if the Department is no longer valid (handled by user or logic below)
//         // But for simplicity, when factory switches, we usually want to reset to "All Departments"
//         // unless we want sticky selection. Let's reset to be safe.
//         // Note: We check if the current dept is valid inside the filtering logic usually, 
//         // but setting options is safe.
//     } else {
//         setDepartmentOptions([]);
//         return;
//     }

//     const relevant = hierarchyData.filter(
//       (item) =>
//         item.hq === parseInt(selectedHQ) &&
//         item.factory === parseInt(selectedFactory)
//     );

//     const uniqueDepts = new Map<number, string>();
//     relevant.forEach((struct) => {
//       struct.structure_data.departments.forEach((dept) => {
//         uniqueDepts.set(dept.id, dept.department_name);
//       });
//     });

//     const options = Array.from(uniqueDepts, ([id, name]) => ({ id, name }));
//     setDepartmentOptions(options);
    
//     // If the currently selected department isn't in the new list, reset to "" (All)
//     if (selectedDepartment && !options.find(o => String(o.id) === selectedDepartment)) {
//         setSelectedDepartment("");
//     }

//   }, [selectedFactory, selectedHQ, hierarchyData]);

//   // 5. Department Selected -> Set Line Options
//   useEffect(() => {
//     if (!selectedDepartment || !selectedFactory || !selectedHQ) {
//       setLineOptions([]);
//       setSelectedLine(""); // Reset Line to All
//       return;
//     }

//     const relevant = hierarchyData.filter(
//       (item) =>
//         item.hq === parseInt(selectedHQ) &&
//         item.factory === parseInt(selectedFactory)
//     );

//     const uniqueLines = new Map<number, string>();
//     relevant.forEach((struct) => {
//       struct.structure_data.departments
//         .filter((d) => d.id === parseInt(selectedDepartment))
//         .forEach((dept) => {
//           dept.lines?.forEach((line) => {
//             uniqueLines.set(line.id, line.line_name);
//           });
//         });
//     });

//     const options = Array.from(uniqueLines, ([id, name]) => ({ id, name }));
//     setLineOptions(options);
    
//     if (selectedLine && !options.find(o => String(o.id) === selectedLine)) {
//         setSelectedLine("");
//     }
//   }, [selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

//   // 6. Line Selected -> Set Subline Options
//   useEffect(() => {
//     if (!selectedLine) {
//       setSublineOptions([]);
//       setSelectedSubline("");
//       return;
//     }

//     const relevant = hierarchyData.filter(
//       (item) =>
//         item.hq === parseInt(selectedHQ) &&
//         item.factory === parseInt(selectedFactory)
//     );

//     const uniqueSublines = new Map<number, string>();
//     relevant.forEach((struct) => {
//       struct.structure_data.departments.forEach((dept) => {
//         if (dept.id === parseInt(selectedDepartment)) {
//           dept.lines?.forEach((line) => {
//             if (line.id === parseInt(selectedLine)) {
//               line.sublines?.forEach((sub) => {
//                 uniqueSublines.set(sub.id, sub.subline_name);
//               });
//             }
//           });
//         }
//       });
//     });

//     const options = Array.from(uniqueSublines, ([id, name]) => ({ id, name }));
//     setSublineOptions(options);

//     if (selectedSubline && !options.find(o => String(o.id) === selectedSubline)) {
//         setSelectedSubline("");
//     }
//   }, [selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

//   // 7. Subline Selected -> Set Station Options
//   useEffect(() => {
//     if (!selectedSubline) {
//       setStationOptions([]);
//       setSelectedStation("");
//       return;
//     }

//     const relevant = hierarchyData.filter(
//       (item) =>
//         item.hq === parseInt(selectedHQ) &&
//         item.factory === parseInt(selectedFactory)
//     );

//     const uniqueStations = new Map<number, string>();
//     relevant.forEach((struct) => {
//       struct.structure_data.departments.forEach((dept) => {
//         if (dept.id === parseInt(selectedDepartment)) {
//           dept.lines?.forEach((line) => {
//             if (line.id === parseInt(selectedLine)) {
//               line.sublines?.forEach((sub) => {
//                 if (sub.id === parseInt(selectedSubline)) {
//                   sub.stations?.forEach((station) => {
//                     uniqueStations.set(station.id, station.station_name);
//                   });
//                 }
//               });
//             }
//           });
//         }
//       });
//     });

//     const options = Array.from(uniqueStations, ([id, name]) => ({ id, name }));
//     setStationOptions(options);

//     if (selectedStation && !options.find(o => String(o.id) === selectedStation)) {
//         setSelectedStation("");
//     }
//   }, [selectedSubline, selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);


//   return (
//     <>
//       <div className="w-full min-h-screen p-2 sm:p-4 box-border pt-16 bg-gray-50">
//         <div className="w-full mx-auto flex flex-col px-2 sm:px-4">
          
//           {/* Header */}
//           <div className="bg-black mb-4 md:mb-6">
//             <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
//               Management Review Dashboard
//             </h4>
//           </div>

//           {/* Cascading Dropdowns - Full Width */}
//           <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md mb-4 md:mb-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select HQ</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//                   value={selectedHQ}
//                   onChange={(e) => setSelectedHQ(e.target.value)}
//                 >
//                   {/* Auto-selected, no 'All' option needed */}
//                   {hqOptions.map(hq => (
//                     <option key={hq.id} value={hq.id}>{hq.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select Factory</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={selectedFactory}
//                   onChange={(e) => setSelectedFactory(e.target.value)}
//                   disabled={!selectedHQ}
//                 >
//                   {/* Auto-selected, no 'All' option needed */}
//                   {factoryOptions.map(f => (
//                     <option key={f.id} value={f.id}>{f.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select Department</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={selectedDepartment}
//                   onChange={(e) => setSelectedDepartment(e.target.value)}
//                   disabled={!selectedFactory}
//                 >
//                   <option value="">All Departments</option>
//                   {departmentOptions.map(d => (
//                     <option key={d.id} value={d.id}>{d.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select Line</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={selectedLine}
//                   onChange={(e) => setSelectedLine(e.target.value)}
//                   disabled={!selectedDepartment}
//                 >
//                   <option value="">All Lines</option>
//                   {lineOptions.map(l => (
//                     <option key={l.id} value={l.id}>{l.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select Subline</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={selectedSubline}
//                   onChange={(e) => setSelectedSubline(e.target.value)}
//                   disabled={!selectedLine}
//                 >
//                   <option value="">All Sublines</option>
//                   {sublineOptions.map(s => (
//                     <option key={s.id} value={s.id}>{s.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block font-medium text-gray-700 mb-1">Select Station</label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   value={selectedStation}
//                   onChange={(e) => setSelectedStation(e.target.value)}
//                   disabled={!selectedSubline}
//                 >
//                   <option value="">All Stations</option>
//                   {stationOptions.map(st => (
//                     <option key={st.id} value={st.id}>{st.name}</option>
//                   ))}
//                 </select>
//               </div>

//             </div>
//           </div>

//           {/* Graphs and Summary Cards */}
//           <div className="w-full flex flex-col gap-3 md:gap-4">
//             <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4">
              
//               {/* Graphs Section */}
//               <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
//                 <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
//                   <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Training
//                       hqId={selectedHQ}
//                       factoryId={selectedFactory}
//                       departmentId={selectedDepartment}
//                       lineId={selectedLine}
//                       sublineId={selectedSubline}
//                       stationId={selectedStation}
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Plan 
//                       hqId={selectedHQ}
//                       factoryId={selectedFactory}
//                       departmentId={selectedDepartment}
//                       lineId={selectedLine}
//                       sublineId={selectedSubline}
//                       stationId={selectedStation}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <Defects 
//                       hqId={selectedHQ}
//                       factoryId={selectedFactory}
//                       departmentId={selectedDepartment}
//                       lineId={selectedLine}
//                       sublineId={selectedSubline}
//                       stationId={selectedStation}
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <DefectsRejected 
//                       hqId={selectedHQ}
//                       factoryId={selectedFactory}
//                       departmentId={selectedDepartment}
//                       lineId={selectedLine}
//                       sublineId={selectedSubline}
//                       stationId={selectedStation}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <MyTable />
//                   </div>
//                   <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-white p-1">
//                     <PlanTwo 
//                       hqId={selectedHQ}
//                       factoryId={selectedFactory}
//                       departmentId={selectedDepartment}
//                       lineId={selectedLine}
//                       sublineId={selectedSubline}
//                       stationId={selectedStation}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Summary Cards */}
//               <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 md:gap-4">
//                 <TrainingSummaryCard
//                   title="Training Summary"
//                   getUrl="http://127.0.0.1:8000/current-month/training-data/"
//                   hqId={selectedHQ}
//                   factoryId={selectedFactory}
//                   departmentId={selectedDepartment}
//                   lineId={selectedLine}
//                   sublineId={selectedSubline}
//                   stationId={selectedStation}
//                   cardColors={["#3498db", "#3498db", "#8e44ad", "#8e44ad"]}
//                   subtopics={[
//                     { dataKey: "new_operators_joined", displayText: "New Operators Joined" },
//                     { dataKey: "new_operators_trained", displayText: "New Opr. Trained" },
//                     { dataKey: "total_training_plans", displayText: "Total Trainings Plan" },
//                     { dataKey: "total_trainings_actual", displayText: "Total Trainings Act" }
//                   ]}
//                 />

//                 <TrainingSummaryCard
//                   title="Man Related Defects"
//                   getUrl="http://127.0.0.1:8000/current-month/defects-data/"
//                   hqId={selectedHQ}
//                   factoryId={selectedFactory}
//                   departmentId={selectedDepartment}
//                   lineId={selectedLine}
//                   sublineId={selectedSubline}
//                   stationId={selectedStation}
//                   cardColors={["#143555", "#143555", "#6c6714", "#6c6714", "#5d255d", "#5d255d"]}
//                   subtopics={[
//                     { dataKey: "total_defects_msil", displayText: "Total Defects at MSIL" },
//                     { dataKey: "ctq_defects_msil", displayText: "CTQ Defects at MSIL" },
//                     { dataKey: "total_defects_tier1", displayText: "Total Defects at Tier-1" },
//                     { dataKey: "ctq_defects_tier1", displayText: "CTQ Defects at Tier-1" },
//                     { dataKey: "total_internal_rejection", displayText: "Total Internal Rejection" },
//                     { dataKey: "ctq_internal_rejection", displayText: "CTQ Internal Rejection" }
//                   ]}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Management;





import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TrainingSummaryCard from "./Card/Cardprops";
import Training from "./Graphs/OprTraining-JoinedvsTrained/train";
import Plan from "./Graphs/NoOftrainingPlanvsActual/plan";
import Defects from "./Graphs/ManRelatedDefectsTrend/defects";
import DefectsRejected from "./Graphs/ManRelatedDefectsInternal/defectsRejected";
import MyTable from "./Graphs/ActionPlanned/mytable";
import PlanTwo from "./Graphs/NoOftrainingPlanvsActual2/plan2";

// Types
interface SelectOption {
  id: number;
  name: string;
}

interface Station {
  id: number;
  station_name: string;
}

interface Subline {
  id: number;
  subline_name: string;
  stations: Station[];
}

interface Line {
  id: number;
  line_name: string;
  sublines: Subline[];
}

interface Department {
  id: number;
  department_name: string;
  lines?: Line[];
}

interface StructureData {
  hq_name: string;
  factory_name: string;
  departments: Department[];
}

interface HierarchyNode {
  structure_id: number;
  structure_name: string;
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: StructureData;
}

const Management: React.FC = () => {
  const location = useLocation();

  // Selected values
  const [selectedHQ, setSelectedHQ] = useState<string>("");
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [selectedSubline, setSelectedSubline] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");

  // Full hierarchy data
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);

  // Dropdown options
  const [hqOptions, setHqOptions] = useState<SelectOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
  const [lineOptions, setLineOptions] = useState<SelectOption[]>([]);
  const [sublineOptions, setSublineOptions] = useState<SelectOption[]>([]);
  const [stationOptions, setStationOptions] = useState<SelectOption[]>([]);

  // 1. Fetch hierarchy data
  useEffect(() => {
    const fetchHierarchyData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/hierarchy-simple/");
        if (!response.ok) throw new Error("Failed to fetch hierarchy");
        const data: HierarchyNode[] = await response.json();
        setHierarchyData(data);
      } catch (error) {
        console.error("Failed to fetch hierarchy data:", error);
      }
    };
    fetchHierarchyData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // --- CASCADING EFFECTS ---

  // 2. Data Loaded -> Set HQ Options & Auto-select First
  useEffect(() => {
    if (hierarchyData.length > 0) {
      const uniqueHQs = new Map<number, string>();
      hierarchyData.forEach((item) => uniqueHQs.set(item.hq, item.hq_name));
      const options = Array.from(uniqueHQs, ([id, name]) => ({ id, name }));
      setHqOptions(options);

      if (!selectedHQ && options.length > 0) {
        setSelectedHQ(String(options[0].id));
      }
    }
  }, [hierarchyData]);

  // 3. HQ Selected -> Set Factory Options & Auto-select First
  useEffect(() => {
    if (!selectedHQ) {
      setFactoryOptions([]);
      return;
    }

    const uniqueFactories = new Map<number, string>();
    hierarchyData
      .filter((item) => item.hq === parseInt(selectedHQ))
      .forEach((item) => uniqueFactories.set(item.factory, item.factory_name));

    const options = Array.from(uniqueFactories, ([id, name]) => ({ id, name }));
    setFactoryOptions(options);

    if (options.length > 0) {
        const currentIsValid = options.find(o => String(o.id) === selectedFactory);
        if (!currentIsValid) {
            setSelectedFactory(String(options[0].id));
        }
    } else {
        setSelectedFactory("");
    }
  }, [selectedHQ, hierarchyData]);

  // 4. Factory Selected -> Set Department Options (Default to All)
  useEffect(() => {
    if(selectedFactory) {
        // Logic continues
    } else {
        setDepartmentOptions([]);
        return;
    }

    const relevant = hierarchyData.filter(
      (item) =>
        item.hq === parseInt(selectedHQ) &&
        item.factory === parseInt(selectedFactory)
    );

    const uniqueDepts = new Map<number, string>();
    relevant.forEach((struct) => {
      struct.structure_data.departments.forEach((dept) => {
        uniqueDepts.set(dept.id, dept.department_name);
      });
    });

    const options = Array.from(uniqueDepts, ([id, name]) => ({ id, name }));
    setDepartmentOptions(options);
    
    if (selectedDepartment && !options.find(o => String(o.id) === selectedDepartment)) {
        setSelectedDepartment("");
    }

  }, [selectedFactory, selectedHQ, hierarchyData]);

  // 5. Department Selected -> Set Line Options
  useEffect(() => {
    if (!selectedDepartment || !selectedFactory || !selectedHQ) {
      setLineOptions([]);
      setSelectedLine(""); 
      return;
    }

    const relevant = hierarchyData.filter(
      (item) =>
        item.hq === parseInt(selectedHQ) &&
        item.factory === parseInt(selectedFactory)
    );

    const uniqueLines = new Map<number, string>();
    relevant.forEach((struct) => {
      struct.structure_data.departments
        .filter((d) => d.id === parseInt(selectedDepartment))
        .forEach((dept) => {
          dept.lines?.forEach((line) => {
            uniqueLines.set(line.id, line.line_name);
          });
        });
    });

    const options = Array.from(uniqueLines, ([id, name]) => ({ id, name }));
    setLineOptions(options);
    
    if (selectedLine && !options.find(o => String(o.id) === selectedLine)) {
        setSelectedLine("");
    }
  }, [selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

  // 6. Line Selected -> Set Subline Options
  useEffect(() => {
    if (!selectedLine) {
      setSublineOptions([]);
      setSelectedSubline("");
      return;
    }

    const relevant = hierarchyData.filter(
      (item) =>
        item.hq === parseInt(selectedHQ) &&
        item.factory === parseInt(selectedFactory)
    );

    const uniqueSublines = new Map<number, string>();
    relevant.forEach((struct) => {
      struct.structure_data.departments.forEach((dept) => {
        if (dept.id === parseInt(selectedDepartment)) {
          dept.lines?.forEach((line) => {
            if (line.id === parseInt(selectedLine)) {
              line.sublines?.forEach((sub) => {
                uniqueSublines.set(sub.id, sub.subline_name);
              });
            }
          });
        }
      });
    });

    const options = Array.from(uniqueSublines, ([id, name]) => ({ id, name }));
    setSublineOptions(options);

    if (selectedSubline && !options.find(o => String(o.id) === selectedSubline)) {
        setSelectedSubline("");
    }
  }, [selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

  // 7. Subline Selected -> Set Station Options
  useEffect(() => {
    if (!selectedSubline) {
      setStationOptions([]);
      setSelectedStation("");
      return;
    }

    const relevant = hierarchyData.filter(
      (item) =>
        item.hq === parseInt(selectedHQ) &&
        item.factory === parseInt(selectedFactory)
    );

    const uniqueStations = new Map<number, string>();
    relevant.forEach((struct) => {
      struct.structure_data.departments.forEach((dept) => {
        if (dept.id === parseInt(selectedDepartment)) {
          dept.lines?.forEach((line) => {
            if (line.id === parseInt(selectedLine)) {
              line.sublines?.forEach((sub) => {
                if (sub.id === parseInt(selectedSubline)) {
                  sub.stations?.forEach((station) => {
                    uniqueStations.set(station.id, station.station_name);
                  });
                }
              });
            }
          });
        }
      });
    });

    const options = Array.from(uniqueStations, ([id, name]) => ({ id, name }));
    setStationOptions(options);

    if (selectedStation && !options.find(o => String(o.id) === selectedStation)) {
        setSelectedStation("");
    }
  }, [selectedSubline, selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);


  return (
    <>
      <div className="w-full min-h-screen p-2 sm:p-4 box-border pt-16 bg-background">
        <div className="w-full mx-auto flex flex-col px-2 sm:px-4">
          
          {/* Header */}
          <div className="bg-black mb-4 md:mb-6 rounded-lg">
            <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
              Management Review Dashboard
            </h4>
          </div>

          {/* Cascading Dropdowns - Full Width */}
          <div className="w-full p-4 md:p-6 bg-surface border border-border rounded-lg shadow-md mb-4 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">

              <div>
                <label className="block font-medium text-text mb-1">Select HQ</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md focus:ring-2 focus:ring-blue-500 text-text"
                  value={selectedHQ}
                  onChange={(e) => setSelectedHQ(e.target.value)}
                >
                  {hqOptions.map(hq => (
                    <option key={hq.id} value={hq.id}>{hq.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Select Factory</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md text-text"
                  value={selectedFactory}
                  onChange={(e) => setSelectedFactory(e.target.value)}
                  disabled={!selectedHQ}
                >
                  {factoryOptions.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Select Department</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md text-text"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  disabled={!selectedFactory}
                >
                  <option value="">All Departments</option>
                  {departmentOptions.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Select Line</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md text-text"
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  disabled={!selectedDepartment}
                >
                  <option value="">All Lines</option>
                  {lineOptions.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Select Subline</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md text-text"
                  value={selectedSubline}
                  onChange={(e) => setSelectedSubline(e.target.value)}
                  disabled={!selectedLine}
                >
                  <option value="">All Sublines</option>
                  {sublineOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-text mb-1">Select Station</label>
                <select
                  className="w-full p-2 border border-border bg-background rounded-md text-text"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  disabled={!selectedSubline}
                >
                  <option value="">All Stations</option>
                  {stationOptions.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Graphs and Summary Cards */}
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4">
              
              {/* Graphs Section */}
              <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <Training
                      hqId={selectedHQ}
                      factoryId={selectedFactory}
                      departmentId={selectedDepartment}
                      lineId={selectedLine}
                      sublineId={selectedSubline}
                      stationId={selectedStation}
                    />
                  </div>
                  <div className="flex-1 min-w-0 h-100 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <Plan 
                      hqId={selectedHQ}
                      factoryId={selectedFactory}
                      departmentId={selectedDepartment}
                      lineId={selectedLine}
                      sublineId={selectedSubline}
                      stationId={selectedStation}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <Defects 
                      hqId={selectedHQ}
                      factoryId={selectedFactory}
                      departmentId={selectedDepartment}
                      lineId={selectedLine}
                      sublineId={selectedSubline}
                      stationId={selectedStation}
                    />
                  </div>
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <DefectsRejected 
                      hqId={selectedHQ}
                      factoryId={selectedFactory}
                      departmentId={selectedDepartment}
                      lineId={selectedLine}
                      sublineId={selectedSubline}
                      stationId={selectedStation}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <MyTable />
                  </div>
                  <div className="flex-1 min-w-0 h-60 sm:h-[260px] shadow-lg rounded-lg overflow-hidden bg-surface border border-border p-1">
                    <PlanTwo 
                      hqId={selectedHQ}
                      factoryId={selectedFactory}
                      departmentId={selectedDepartment}
                      lineId={selectedLine}
                      sublineId={selectedSubline}
                      stationId={selectedStation}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 md:gap-4">
                <TrainingSummaryCard
                  title="Training Summary"
                  getUrl="http://127.0.0.1:8000/current-month/training-data/"
                  hqId={selectedHQ}
                  factoryId={selectedFactory}
                  departmentId={selectedDepartment}
                  lineId={selectedLine}
                  sublineId={selectedSubline}
                  stationId={selectedStation}
                  cardColors={["#3498db", "#3498db", "#8e44ad", "#8e44ad"]}
                  subtopics={[
                    { dataKey: "new_operators_joined", displayText: "New Operators Joined" },
                    { dataKey: "new_operators_trained", displayText: "New Opr. Trained" },
                    { dataKey: "total_training_plans", displayText: "Total Trainings Plan" },
                    { dataKey: "total_trainings_actual", displayText: "Total Trainings Act" }
                  ]}
                />

                <TrainingSummaryCard
                  title="Man Related Defects"
                  getUrl="http://127.0.0.1:8000/current-month/defects-data/"
                  hqId={selectedHQ}
                  factoryId={selectedFactory}
                  departmentId={selectedDepartment}
                  lineId={selectedLine}
                  sublineId={selectedSubline}
                  stationId={selectedStation}
                  cardColors={["#143555", "#143555", "#6c6714", "#6c6714", "#5d255d", "#5d255d"]}
                  subtopics={[
                    { dataKey: "total_defects_msil", displayText: "Total Defects at MSIL" },
                    { dataKey: "ctq_defects_msil", displayText: "CTQ Defects at MSIL" },
                    { dataKey: "total_defects_tier1", displayText: "Total Defects at Tier-1" },
                    { dataKey: "ctq_defects_tier1", displayText: "CTQ Defects at Tier-1" },
                    { dataKey: "total_internal_rejection", displayText: "Total Internal Rejection" },
                    { dataKey: "ctq_internal_rejection", displayText: "CTQ Internal Rejection" }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Management;



