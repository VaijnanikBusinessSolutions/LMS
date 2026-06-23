import React, { useState, useEffect } from "react";
import CardProps from "./AdvanceCard/Cardprops";
import Absenteeism from "./Graphs/Absenteeism/absenteeism";
import AttritionTrendChart from "./Graphs/Attrition/attrition";
import BufferManpowerAvailability from "./Graphs/BufferManpowerAvailability/BufferManpower";
import OperatorStats from "./OperatorStats/OperatorStatsRedirect";
import ManpowerTrendChart from "./Graphs/Manpower/Manpower";
import MyTable from "./Graphs/ActionPlanned/mytable";

// --- Interfaces ---
interface SelectOption {
  id: number;
  name: string;
}

interface Station { id: number; station_name: string; }
interface Subline { id: number; subline_name: string; stations: Station[]; }
interface Line { id: number; line_name: string; sublines: Subline[]; }
interface Department { id: number; department_name: string; lines: Line[]; }
interface StructureData { hq_name: string; factory_name: string; departments: Department[]; }
interface HierarchyNode {
  structure_id: number;
  structure_name: string;
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: StructureData;
}

interface CardData {
  id: number;
  month: number;
  year: number;
  total_stations: number;
  operators_required: number;
  operators_available: number;
  buffer_manpower_required: number;
  buffer_manpower_available: number;
  attrition_rate: string;
  absenteeism_rate: string;
}

const Advance: React.FC = () => {
  // --- HIERARCHY STATE ---
  const [selectedHQ, setSelectedHQ] = useState<string>("");
  const [selectedFactory, setSelectedFactory] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [selectedSubline, setSelectedSubline] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("");

  // --- DATA & OPTIONS ---
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  
  const [hqOptions, setHqOptions] = useState<SelectOption[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<SelectOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<SelectOption[]>([]);
  const [lineOptions, setLineOptions] = useState<SelectOption[]>([]);
  const [sublineOptions, setSublineOptions] = useState<SelectOption[]>([]);
  const [stationOptions, setStationOptions] = useState<SelectOption[]>([]);

  // --- DASHBOARD DATA STATE ---
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isCardDataLoading, setIsCardDataLoading] = useState<boolean>(false);
  const [cardDataError, setCardDataError] = useState<string | null>(null);
  const [stationType] = useState<string>("CTQ"); 

  // 1. Fetch Hierarchy
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

  // --- CASCADING LOGIC ---
  // 2. Load HQs -> Auto Select First
  useEffect(() => {
    if (hierarchyData.length > 0) {
      const uniqueHQs = new Map<number, string>();
      hierarchyData.forEach(item => uniqueHQs.set(item.hq, item.hq_name));
      const options = Array.from(uniqueHQs, ([id, name]) => ({ id, name }));
      setHqOptions(options);

      if (!selectedHQ && options.length > 0) {
        setSelectedHQ(String(options[0].id));
      }
    }
  }, [hierarchyData]);

  // 3. HQ Selected -> Load Factories -> Auto Select First
  useEffect(() => {
    if (!selectedHQ) {
      setFactoryOptions([]);
      return;
    }
    const uniqueFactories = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === parseInt(selectedHQ))
      .forEach(item => uniqueFactories.set(item.factory, item.factory_name));
    
    const options = Array.from(uniqueFactories, ([id, name]) => ({ id, name }));
    setFactoryOptions(options);

    if (options.length > 0) {
      if (!selectedFactory || !options.find(o => String(o.id) === selectedFactory)) {
        setSelectedFactory(String(options[0].id));
      }
    } else {
      setSelectedFactory("");
    }
  }, [selectedHQ, hierarchyData]);

  // 4. Factory Selected -> Load Departments
  useEffect(() => {
    if (!selectedFactory) {
      setDepartmentOptions([]);
      return;
    }
    const uniqueDepts = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === parseInt(selectedHQ) && item.factory === parseInt(selectedFactory))
      .forEach(struct => {
        struct.structure_data.departments.forEach(d => uniqueDepts.set(d.id, d.department_name));
      });
    
    const options = Array.from(uniqueDepts, ([id, name]) => ({ id, name }));
    setDepartmentOptions(options);

    if (selectedDepartment && !options.find(o => String(o.id) === selectedDepartment)) {
      setSelectedDepartment("");
    }
  }, [selectedFactory, selectedHQ, hierarchyData]);

  // 5. Department Selected -> Load Lines
  useEffect(() => {
    if (!selectedDepartment) {
      setLineOptions([]);
      setSelectedLine("");
      return;
    }
    const uniqueLines = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === parseInt(selectedHQ) && item.factory === parseInt(selectedFactory))
      .forEach(struct => {
        struct.structure_data.departments
          .filter(d => d.id === parseInt(selectedDepartment))
          .forEach(dept => dept.lines?.forEach(l => uniqueLines.set(l.id, l.line_name)));
      });

    const options = Array.from(uniqueLines, ([id, name]) => ({ id, name }));
    setLineOptions(options);
    if (selectedLine && !options.find(o => String(o.id) === selectedLine)) setSelectedLine("");
  }, [selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

  // 6. Line Selected -> Load Sublines
  useEffect(() => {
    if (!selectedLine) {
      setSublineOptions([]);
      setSelectedSubline("");
      return;
    }
    const uniqueSublines = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === parseInt(selectedHQ) && item.factory === parseInt(selectedFactory))
      .forEach(struct => {
        struct.structure_data.departments.forEach(dept => {
          if (dept.id === parseInt(selectedDepartment)) {
            dept.lines?.forEach(line => {
              if (line.id === parseInt(selectedLine)) {
                line.sublines?.forEach(sub => uniqueSublines.set(sub.id, sub.subline_name));
              }
            });
          }
        });
      });

    const options = Array.from(uniqueSublines, ([id, name]) => ({ id, name }));
    setSublineOptions(options);
    if (selectedSubline && !options.find(o => String(o.id) === selectedSubline)) setSelectedSubline("");
  }, [selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);

  // 7. Subline Selected -> Load Stations
  useEffect(() => {
    if (!selectedSubline) {
      setStationOptions([]);
      setSelectedStation("");
      return;
    }
    const uniqueStations = new Map<number, string>();
    hierarchyData
      .filter(item => item.hq === parseInt(selectedHQ) && item.factory === parseInt(selectedFactory))
      .forEach(struct => {
        struct.structure_data.departments.forEach(dept => {
          if (dept.id === parseInt(selectedDepartment)) {
            dept.lines?.forEach(line => {
              if (line.id === parseInt(selectedLine)) {
                line.sublines?.forEach(sub => {
                  if (sub.id === parseInt(selectedSubline)) {
                    sub.stations?.forEach(st => uniqueStations.set(st.id, st.station_name));
                  }
                });
              }
            });
          }
        });
      });

    const options = Array.from(uniqueStations, ([id, name]) => ({ id, name }));
    setStationOptions(options);
    if (selectedStation && !options.find(o => String(o.id) === selectedStation)) setSelectedStation("");
  }, [selectedSubline, selectedLine, selectedDepartment, selectedFactory, selectedHQ, hierarchyData]);


  // --- FETCH CARD DATA (UPDATED) ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      // We need at least a Factory to fetch meaningful data
      if (!selectedFactory) {
        setCardData(null);
        return;
      }

      setIsCardDataLoading(true);
      setCardDataError(null);

      try {
        const params = new URLSearchParams();
        
        // Pass Hierarchy Filters
        if (selectedHQ) params.append("hq", selectedHQ.toString());
        if (selectedFactory) params.append("factory", selectedFactory.toString());
        if (selectedDepartment) params.append("department", selectedDepartment.toString());
        if (selectedLine) params.append("line", selectedLine.toString());
        if (selectedSubline) params.append("subline", selectedSubline.toString());
        if (selectedStation) params.append("station", selectedStation.toString());

        const url = `http://127.0.0.1:8000/chart/current-stats/?${params.toString()}`;

        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch current stats");

        const apiData = await response.json();

        setCardData({
             ...apiData,
             attrition_rate: apiData.attrition_rate || "0",
             absenteeism_rate: apiData.absenteeism_rate || "0"
        });

      } catch (err) {
        const message = err instanceof Error ? err.message : "An unknown error occurred";
        setCardDataError(`Failed to fetch dashboard data: ${message}`);
      } finally {
        setIsCardDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedHQ, selectedFactory, selectedDepartment, selectedLine, selectedSubline, selectedStation]);


  // --- HELPERS ---
  const getCardTitle = () => {
    if (selectedStation) return "Station Stats";
    if (selectedSubline) return "Subline Stats";
    if (selectedLine) return "Line Stats";
    if (selectedDepartment) return `Total ${stationType} Stations`;
    return "Total Stations (Factory)";
  };

  const toNum = (val: string) => val ? parseInt(val) : null;

  return (
    <>
      <div className="w-full min-h-screen p-2 sm:p-4 box-border pt-16 bg-background text-text transition-colors duration-300">
        <div className="w-full mx-auto flex flex-col px-2 sm:px-4">
          
          {/* Header - Using Theme Header tokens */}
          <div className="bg-black border border-header-border rounded-lg shadow-soft mb-4 md:mb-6">
            <h4 className="text-2xl md:text-3xl font-bold text-white py-5 text-center">
              Advanced Manpower Planning Dashboard
            </h4>
          </div>

          {/* Cascading Dropdowns - Converted to bg-surface / text-text */}
          <div className="w-full p-4 md:p-6 bg-surface border border-border rounded-lg shadow-soft mb-4 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">

              <div>
                <label className="block font-medium text-text mb-1">Select HQ</label>
                <select
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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
                  className="w-full p-2 border border-border rounded-md bg-background text-text focus:ring-2 focus:ring-primary"
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

          {/* Card Props - Full Width */}
          <div className="w-full mb-4 md:mb-4">
            <CardProps
              data={cardData}
              loading={isCardDataLoading}
              error={cardDataError}
              subtopics={[
                { dataKey: "total_stations", displayText: getCardTitle() },
                { dataKey: "operators_required", displayText: "Operators Required" },
                { dataKey: "operators_available", displayText: "Operators Available" },
                { dataKey: "buffer_manpower_required", displayText: "Buffer Manpower Required" },
                { dataKey: "buffer_manpower_available", displayText: "Buffer Manpower Available" },
              ]}
              // Note: Ideally pass theme variables or context here, but keeping structure as requested
              cardColors={["#1f1f1f", "#0056b3", "#0056b3", "#1f1f1f", "#1f1f1f"]}
            />
          </div>

          {/* Graphs and Sidebar */}
          <div className="w-full flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col lg:flex-row w-full gap-3 md:gap-4">
              
              {/* Graphs Section */}
              <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col gap-3 md:gap-4">
                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                    <ManpowerTrendChart 
                      hqId={toNum(selectedHQ)}
                      factoryId={toNum(selectedFactory)} 
                      departmentId={toNum(selectedDepartment)}
                      lineId={toNum(selectedLine)}
                      sublineId={toNum(selectedSubline)}
                      stationId={toNum(selectedStation)}
                    />
                    <AttritionTrendChart 
                      hqId={toNum(selectedHQ)}
                      factoryId={toNum(selectedFactory)} 
                      departmentId={toNum(selectedDepartment)}
                      lineId={toNum(selectedLine)}
                      sublineId={toNum(selectedSubline)}
                      stationId={toNum(selectedStation)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-3 md:gap-4">
                    <BufferManpowerAvailability 
                      hqId={toNum(selectedHQ)}
                      factoryId={toNum(selectedFactory)} 
                      departmentId={toNum(selectedDepartment)}
                      lineId={toNum(selectedLine)}
                      sublineId={toNum(selectedSubline)}
                      stationId={toNum(selectedStation)}
                    />
                    <Absenteeism 
                      hqId={toNum(selectedHQ)}
                      factoryId={toNum(selectedFactory)} 
                      departmentId={toNum(selectedDepartment)}
                      lineId={toNum(selectedLine)}
                      sublineId={toNum(selectedSubline)}
                      stationId={toNum(selectedStation)}
                    />
                </div>
              </div>

              {/* Sidebar - Operator Stats and Actions */}
              <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-3 md:gap-4">
                  <OperatorStats 
                    hqId={toNum(selectedHQ)}
                    factoryId={toNum(selectedFactory)} 
                    departmentId={toNum(selectedDepartment)}
                    lineId={toNum(selectedLine)}
                    sublineId={toNum(selectedSubline)}
                    stationId={toNum(selectedStation)}
                  />
                <MyTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Advance;