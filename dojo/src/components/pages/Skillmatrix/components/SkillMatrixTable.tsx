
import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, RefreshCw, ChevronDown, Building, GitBranch, Layers, Cpu, Download, Hexagon } from 'lucide-react';
import type { SkillMatrix, Operation, Section, MonthlySkill, OperatorLevel, Month } from '../api/types';
import LevelBlock from './shapes/Levelblocks';
import PieChart from './shapes/piechart';
import axios from 'axios';
import MonthlySkillDisplay from './MonthlySkillDisplay';

// --- Interfaces ---


// interface StationRequirement {
//     id: number;
//     station_id: number;
//     station_name: string;
//     department_id: number;
//     department_name: string;
//     minimum_operators: number;
//     minimum_level_required: string;
//     minimum_level_name: number;
//     // minimum_level_number: number;
// }

interface SkillMatrixApiData {
  station_id: number;
  id: number;
  employee_name: string;
  emp_id: string;
  doj: string;
  updated_at: string;
  employee: string;
  level: number;
  skill: number;
}

interface MultiSkillingData {
  id?: number;
  emp_id: string;
  // Fix: Explicit union type requires checking type before access
  station: { station_id: number; station_name?: string } | number;
  skill_level: { level_number: number } | number;
  start_date: string;
  status: string;
  current_status: string;
  department?: number;
  department_name?: string;
}

interface StationTypeConfig {
  type_id: number;
  code: string;
  name: string;
  icon: string | null;
  icon_url: string | null;
  color: string;
}

// Internal Interface used by the Component State
interface HierarchyStation {
  station_id: number;
  station_name: string;
  station_type?: string;
  station_type_name?: string;
}
interface HierarchySubline {
  subline_id: number;
  subline_name: string;
  stations: HierarchyStation[];
}
interface HierarchyLine {
  line_id: number;
  line_name: string;
  sublines: HierarchySubline[];
  stations: HierarchyStation[];
}
interface HierarchyDepartment {
  department_id: number;
  department_name: string;
  lines: HierarchyLine[];
  sublines: HierarchySubline[];
  stations: HierarchyStation[];
}

// Interface for the incoming specific JSON Structure
interface JsonStation {
  id: number;
  station_name: string;
  station_type?: string;
  station_type_name?: string;
}
interface JsonSubline {
  id: number;
  subline_name: string;
  stations: JsonStation[];
}
interface JsonLine {
  id: number;
  line_name: string;
  sublines: JsonSubline[];
  stations: JsonStation[];
}
interface JsonDepartment {
  id: number;
  department_name: string;
  lines: JsonLine[];
  stations: JsonStation[];
}
interface JsonStructureData {
  hq_name: string;
  factory_name: string;
  departments: JsonDepartment[];
}

interface StationRequirement {
  id: number;
  station_id?: number;
  station_name: string;
  department_id: number;
  department_name: string;
  minimum_operators: number;
  minimum_level_required: string;
  minimum_level_number: number;
}

interface SkillMatrixTableProps {
  skillMatrices: SkillMatrix[];
  selectedMatrix: SkillMatrix | null;
  employees: any[];
  operations: Operation[]; // Kept to match interface, even if unused in logic
  sections: Section[];
  monthlySkills: MonthlySkill[];
  operatorLevels: OperatorLevel[];
  months: Month[];
  isLoading: boolean;
  error: string | null;
  onMatrixChange: (matrix: SkillMatrix) => void;
  onRefresh: () => Promise<void>;
  stationRequirements: StationRequirement[];
}

const SkillMatrixTable: React.FC<SkillMatrixTableProps> = ({
  skillMatrices,
  selectedMatrix,
  monthlySkills,
  operatorLevels,
  months,
  isLoading,
  error,
  onMatrixChange,
  onRefresh,
  stationRequirements,
}) => {
  // --- State Declarations ---
  const [hierarchyData, setHierarchyData] = useState<HierarchyDepartment[]>([]);
  const [availableLines, setAvailableLines] = useState<HierarchyLine[]>([]);
  const [availableSublines, setAvailableSublines] = useState<HierarchySubline[]>([]);
  const [availableStations, setAvailableStations] = useState<HierarchyStation[]>([]);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);
  const [selectedSublineId, setSelectedSublineId] = useState<number | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);

  const [multiSkillingsData, setMultiSkillingsData] = useState<MultiSkillingData[]>([]);
  const [levelColors, setLevelColors] = useState<{ 1: string; 2: string; 3: string; 4: string }>({
    1: '#ef4444',
    2: '#f59e0b',
    3: '#10b981',
    4: '#3b82f6'
  });
  const [displayShape, setDisplayShape] = useState<'piechart' | 'levelblock'>('piechart');

  const [skillMatrixData, setSkillMatrixData] = useState<SkillMatrixApiData[]>([]);
  const [skillMatrixLoading, setSkillMatrixLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState<string | null>(null);
  const [skillMatrixError, setSkillMatrixError] = useState<string | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<'template' | 'report' | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const [stationTypeMap, setStationTypeMap] = useState<Record<string, StationTypeConfig>>({});

  const getStationMinOperators = (stationId: number): number | string => {
    // Find the requirement specifically for this station
    const requirement = stationRequirements.find(req =>
      req.station_id === stationId
    );
    return requirement ? requirement.minimum_operators : '-';
  };
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // --- Initial Data Loading ---

  useEffect(() => {
    const fetchStationTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/station-types/`);
        const types: StationTypeConfig[] = response.data;
        const typeMap: Record<string, StationTypeConfig> = {};
        types.forEach(t => { typeMap[t.code] = t; });
        setStationTypeMap(typeMap);
      } catch (err) {
        console.error('Error fetching station types:', err);
      }
    };
    fetchStationTypes();
  }, []);

  // Load hierarchy data with support for the specific nested JSON structure
  const loadHierarchyData = async () => {
    try {
      setHierarchyError(null);
      // NOTE: Adjust endpoint if needed to match the source of the provided JSON
      const response = await axios.get(`${API_BASE_URL}/hierarchy/all-departments/`);
      const rawData = response.data;

      // Handle the provided nested JSON structure: [ { structure_data: { departments: [] } } ]
      if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].structure_data) {
        const structureData = rawData[0].structure_data as JsonStructureData;

        // Map the JSON structure to the component's internal interface
        const mappedData: HierarchyDepartment[] = structureData.departments.map(dept => ({
          department_id: dept.id,
          department_name: dept.department_name,
          lines: (dept.lines || []).map(line => ({
            line_id: line.id,
            line_name: line.line_name,
            sublines: (line.sublines || []).map(sub => ({
              subline_id: sub.id,
              subline_name: sub.subline_name,
              stations: (sub.stations || []).map(st => ({
                station_id: st.id,
                station_name: st.station_name,
                station_type: st.station_type
              }))
            })),
            stations: (line.stations || []).map(st => ({
              station_id: st.id,
              station_name: st.station_name,
              station_type: st.station_type
            }))
          })),
          sublines: [], // Direct sublines under dept not shown in example, but kept for interface consistency
          stations: (dept.stations || []).map(st => ({
            station_id: st.id,
            station_name: st.station_name,
            station_type: st.station_type
          }))
        }));

        setHierarchyData(mappedData);

      } else if (Array.isArray(rawData)) {
        // Fallback for standard flat format if API didn't change
        setHierarchyData(rawData);
      } else {
        throw new Error("Invalid Data Format");
      }

    } catch (err) {
      console.error('Failed to load hierarchy data:', err);
      setHierarchyError('Could not load organization structure. Please check the network connection.');
      setHierarchyData([]);
    }
  };

  // Load skill matrix data
  const loadSkillMatrixData = async (stationId?: number | null) => {
    try {
      setSkillMatrixLoading(true);
      setSkillMatrixError(null);
      let url = `${API_BASE_URL}/skill-matrix/`;
      if (stationId) {
        url = `${API_BASE_URL}/skill-matrix/by_station/?station_id=${stationId}`;
      }
      const response = await axios.get(url);
      setSkillMatrixData(response.data || []);
    } catch (err) {
      console.error('Failed to load skill matrix data:', err);
      setSkillMatrixError('Failed to retrieve employee skills. Please try refreshing.');
      setSkillMatrixData([]);
    } finally {
      setSkillMatrixLoading(false);
    }
  };

  const loadMultiSkillingsData = async (departmentId?: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/multiskilling/`);
      let filteredData = response.data || [];
      if (departmentId) {
        filteredData = filteredData.filter((ms: any) =>
          ms.department === departmentId ||
          ms.department_name === selectedMatrix?.department
        );
      }
      setMultiSkillingsData(filteredData);
    } catch (err) {
      console.error('Failed to load multiskilling data:', err);
      setMultiSkillingsData([]);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const colorsResponse = await axios.get(`${API_BASE_URL}/levelcolours/`);
        if (colorsResponse.data && Array.isArray(colorsResponse.data)) {
          const colorsFromBackend: { 1?: string; 2?: string; 3?: string; 4?: string } = {};
          colorsResponse.data.forEach((item: any) => {
            if (item.level_number && [1, 2, 3, 4].includes(item.level_number)) {
              colorsFromBackend[item.level_number as 1 | 2 | 3 | 4] = item.colour_code;
            }
          });
          setLevelColors(prev => ({
            1: colorsFromBackend[1] || prev[1],
            2: colorsFromBackend[2] || prev[2],
            3: colorsFromBackend[3] || prev[3],
            4: colorsFromBackend[4] || prev[4]
          }));
        }
        const shapeResponse = await axios.get(`${API_BASE_URL}/displaysetting/`);
        if (shapeResponse.data && shapeResponse.data.display_shape) {
          setDisplayShape(shapeResponse.data.display_shape);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
  }, []);

  // --- Hierarchy Selection Logic ---

  useEffect(() => {
    if (!selectedMatrix || hierarchyData.length === 0) return;
    const targetDepartment = (selectedMatrix.department || '').toString().trim().toLowerCase();
    const matchingDept = hierarchyData.find((dept) =>
      dept.department_name.toLowerCase().trim() === targetDepartment
    );
    if (matchingDept && matchingDept.department_id !== selectedDepartmentId) {
      setSelectedDepartmentId(matchingDept.department_id);
    }
  }, [selectedMatrix, hierarchyData]);

  // Default selection
  useEffect(() => {
    if (hierarchyData.length > 0 && selectedDepartmentId === null) {
      setSelectedDepartmentId(hierarchyData[0].department_id);
    }
  }, [hierarchyData, selectedDepartmentId]);

  // Dept change -> Reset Line
  useEffect(() => {
    if (!selectedDepartmentId) {
      setAvailableLines([]);
      setAvailableSublines([]);
      setAvailableStations([]);
      return;
    }
    const selectedDepartment = hierarchyData.find(dept => dept.department_id === selectedDepartmentId);
    if (selectedDepartment) {
      setAvailableLines(selectedDepartment.lines || []);
      setSelectedLineId(null);
      setSelectedSublineId(null);
      setSelectedStationId(null);
      setAvailableSublines([]);
      setAvailableStations([]);
    }
  }, [selectedDepartmentId, hierarchyData]);

  // Auto-select first line
  useEffect(() => {
    if (availableLines.length > 0 && selectedLineId === null) {
      setSelectedLineId(availableLines[0].line_id);
    }
  }, [availableLines, selectedLineId]);

  // Line change -> Reset Subline/Station
  useEffect(() => {
    if (!selectedLineId) {
      setAvailableSublines([]);
      setAvailableStations([]);
      return;
    }
    const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
    if (selectedLine) {
      setAvailableSublines(selectedLine.sublines || []);
      // If no sublines, show stations immediately
      if (!selectedLine.sublines || selectedLine.sublines.length === 0) {
        setAvailableStations(selectedLine.stations || []);
      } else {
        setAvailableStations([]);
      }
      setSelectedSublineId(null);
      setSelectedStationId(null);
    }
  }, [selectedLineId, availableLines]);

  // Auto-select first subline
  useEffect(() => {
    if (availableSublines.length > 0 && selectedSublineId === null) {
      setSelectedSublineId(availableSublines[0].subline_id);
    }
  }, [availableSublines, selectedSublineId]);

  // Subline change -> Update Stations
  useEffect(() => {
    if (!selectedSublineId) {
      if (selectedLineId) {
        const selectedLine = availableLines.find(line => line.line_id === selectedLineId);
        if (selectedLine && (!selectedLine.sublines || selectedLine.sublines.length === 0)) {
          setAvailableStations(selectedLine.stations || []);
        }
      }
      return;
    }
    const selectedSubline = availableSublines.find(subline => subline.subline_id === selectedSublineId);
    if (selectedSubline) {
      setAvailableStations(selectedSubline.stations || []);
    }
    setSelectedStationId(null);
  }, [selectedSublineId, availableSublines, selectedLineId, availableLines]);

  // Fetch Matrix when Station changes
  useEffect(() => {
    if (selectedStationId) {
      loadSkillMatrixData(selectedStationId);
    } else {
      loadSkillMatrixData();
    }
  }, [selectedStationId]);

  // Initial loads
  useEffect(() => {
    loadHierarchyData();
    loadSkillMatrixData();
  }, []);

  useEffect(() => {
    if (selectedMatrix) {
      loadMultiSkillingsData();
    }
  }, [selectedMatrix]);


  // --- Helper Functions ---

  const handleDownload = async (type: 'template' | 'report') => {
    try {
      setDownloadLoading(type);
      setDownloadError(null);
      const filters: { [key: string]: number | undefined } = {};
      if (selectedDepartmentId) filters.department_id = selectedDepartmentId;
      if (selectedLineId) filters.main_line_id = selectedLineId;
      if (selectedSublineId) filters.sub_line_id = selectedSublineId;
      const url = type === 'template'
        ? `${API_BASE_URL}/skill-matrix/template/download/`
        : `${API_BASE_URL}/skill-matrix/report/download/`;
      const response = await axios.post(url, filters, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      const filename = type === 'template'
        ? `skill_matrix_template.xlsx`
        : `skill_matrix_report.xlsx`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Failed to download ${type}:`, err);
      setDownloadError(`Failed to download ${type}. Please try again.`);
    } finally {
      setDownloadLoading(null);
    }
  };

  // Logic to determine which columns (stations) to show based on filters
  //  const getRelevantStations = (): HierarchyStation[] => {
  //     if (!selectedDepartmentId || hierarchyData.length === 0) return [];

  //     const dept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
  //     if (!dept) return [];

  //     const stationMap = new Map<number, HierarchyStation>();

  //     const add = (stations: HierarchyStation[]) => {
  //       stations.forEach(s => stationMap.set(s.station_id, s));
  //     };

  //     // 1. Single station selected
  //     if (selectedStationId) {
  //       const all = [
  //         ...dept.stations,
  //         ...dept.lines.flatMap(l => [...l.stations, ...l.sublines.flatMap(sl => sl.stations)])
  //       ];
  //       const found = all.find(s => s.station_id === selectedStationId);
  //       return found ? [found] : [];
  //     }

  //     // 2. Subline selected
  //     if (selectedSublineId) {
  //       const subline = dept.lines
  //         .flatMap(l => l.sublines)
  //         .find(sl => sl.subline_id === selectedSublineId);
  //       return subline?.stations || [];
  //     }

  //     // 3. Line selected → line stations + all subline stations
  //     if (selectedLineId) {
  //       const line = dept.lines.find(l => l.line_id === selectedLineId);
  //       if (!line) return [];
  //       add(line.stations);
  //       line.sublines.forEach(sl => add(sl.stations));
  //       return Array.from(stationMap.values());
  //     }

  //     // 4. Only department → ALL stations under department (no duplicates)
  //     add(dept.stations);
  //     dept.lines.forEach(line => {
  //       add(line.stations);
  //       line.sublines.forEach(sl => add(sl.stations));
  //     });

  //     return Array.from(stationMap.values());
  //   };

  //   const stationHeaders = getRelevantStations();

  // 1. Keep your PERFECT logic for the TABLE (unchanged)
  const getRelevantStations = (): HierarchyStation[] => {
    if (!selectedDepartmentId || hierarchyData.length === 0) return [];

    const dept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
    if (!dept) return [];

    const stationMap = new Map<number, HierarchyStation>();
    const add = (stations: HierarchyStation[]) => {
      stations.forEach(s => stationMap.set(s.station_id, s));
    };

    // If a specific station is selected → show only that one in the TABLE
    if (selectedStationId) {
      const all = [
        ...dept.stations,
        ...dept.lines.flatMap(l => [...l.stations, ...l.sublines.flatMap(sl => sl.stations)])
      ];
      const found = all.find(s => s.station_id === selectedStationId);
      return found ? [found] : [];
    }

    // Subline selected
    if (selectedSublineId) {
      const subline = dept.lines.flatMap(l => l.sublines).find(sl => sl.subline_id === selectedSublineId);
      return subline?.stations || [];
    }

    // Line selected
    if (selectedLineId) {
      const line = dept.lines.find(l => l.line_id === selectedLineId);
      if (!line) return [];
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
      return Array.from(stationMap.values());
    }

    // Only department → all stations
    add(dept.stations);
    dept.lines.forEach(line => {
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
    });

    return Array.from(stationMap.values());
  };

  // 2. NEW: This one is for the DROPDOWN ONLY – always shows full list
  const getDropdownStations = (): HierarchyStation[] => {
    if (!selectedDepartmentId || hierarchyData.length === 0) return [];

    const dept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
    if (!dept) return [];

    const stationMap = new Map<number, HierarchyStation>();
    const add = (stations: HierarchyStation[]) => {
      stations.forEach(s => stationMap.set(s.station_id, s));
    };

    // Always collect ALL stations under current filter (ignore selectedStationId)
    if (selectedSublineId) {
      const subline = dept.lines.flatMap(l => l.sublines).find(sl => sl.subline_id === selectedSublineId);
      return subline?.stations || [];
    }

    if (selectedLineId) {
      const line = dept.lines.find(l => l.line_id === selectedLineId);
      if (!line) return [];
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
      return Array.from(stationMap.values());
    }

    // Department only
    add(dept.stations);
    dept.lines.forEach(line => {
      add(line.stations);
      line.sublines.forEach(sl => add(sl.stations));
    });

    return Array.from(stationMap.values());
  };

  // Use correct list for table
  const stationHeaders = getRelevantStations();

  // Use FULL list for dropdown
  const dropdownStations = getDropdownStations();

  // *** KEY FILTER LOGIC ***
  // Modified to select department/line/subline/station and ONLY show employees relevant to that filter
  const getDepartmentEmployees = (): any[] => {
    const departmentName = hierarchyData.find(d => d.department_id === selectedDepartmentId)?.department_name;
    if (!departmentName) return [];

    // 1. Identify which Stations are currently active/visible in the table
    const relevantStationIds = stationHeaders.map(s => s.station_id);

    // 2. Filter employees from Skill Matrix Data who have skills in the relevant stations
    const filteredSkillMatrixEmployees = skillMatrixData
      .filter(sm => relevantStationIds.includes(sm.station_id))
      .map(sm => ({
        emp_id: sm.emp_id,
        full_name: sm.employee_name,
        date_of_join: sm.doj,
      }));

    // 3. Filter employees from Operator Levels (fallback/additional data) who match relevant stations
    const filteredOperatorLevelEmployees = operatorLevels
      .filter(ol =>
        ol.skill_matrix.department.toLowerCase() === departmentName.toLowerCase() &&
        relevantStationIds.includes(Number(ol.operation.id))
      )
      .map(ol => ({
        emp_id: ol.employee.employee_code,
        full_name: ol.employee.full_name,
        date_of_join: ol.employee.date_of_join,
      }));

    // 4. Combine and deduplicate
    const allEmployees = [
      ...filteredSkillMatrixEmployees,
      ...filteredOperatorLevelEmployees
    ];

    return allEmployees.filter((emp, index, self) =>
      emp.emp_id && index === self.findIndex(e => e.emp_id === emp.emp_id)
    );
  };

  const departmentEmployees = getDepartmentEmployees();

  // Pagination
  const totalPages = Math.ceil(departmentEmployees.length / itemsPerPage);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentEmployees = departmentEmployees.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepartmentId, selectedLineId, selectedSublineId, selectedStationId]);

  const getEmployeeMonthlySkills = (employeeCode: string): MonthlySkill[] => {
    if (!selectedMatrix) return [];
    return monthlySkills.filter(ms =>
      ms.employee_code === employeeCode &&
      ms.department === selectedMatrix.department
    );
  };

  const getEmployeeMultiSkills = (employeeCode: string): MultiSkillingData[] => {
    return multiSkillingsData.filter(ms =>
      ms.emp_id === employeeCode &&
      ms.status !== 'completed'
    );
  };

  const getOperatorSkillLevel = (employeeCode: string, stationId: number | string): number => {
    const skillRecord = skillMatrixData.find(skill =>
      skill.emp_id === employeeCode &&
      skill.station_id === parseInt(stationId.toString())
    );
    if (skillRecord) return skillRecord.level;
    const operatorLevel = operatorLevels.find(ol =>
      ol.employee.employee_code === employeeCode &&
      ol.operation.id.toString() === stationId.toString()
    );
    return operatorLevel ? parseInt(operatorLevel.level?.toString() || '0') : 0;
  };

  // const getStationMinimumLevel = (stationId: number): number | null => {
  //   const requirementsForStation = stationRequirements.filter(req => req.station_id === stationId);
  //   if (requirementsForStation.length === 0) return null;
  //   const maxLevel = Math.max(...requirementsForStation.map(r => r.minimum_level_name));
  //   return isFinite(maxLevel) ? maxLevel : null;
  // };
  const getStationMinimumLevel = (stationId: number): number => {
    const requirement = stationRequirements.find(
      req => req.station_id === stationId
    );
    return requirement?.minimum_level_number ?? 0;
  };

  const renderStationIcon = (station: HierarchyStation) => {
    const typeConfig = station.station_type ? stationTypeMap[station.station_type] : null;
    if (typeConfig && typeConfig.icon_url) {
      const imageUrl = typeConfig.icon_url.startsWith('http')
        ? typeConfig.icon_url
        : `${API_BASE_URL}${typeConfig.icon_url}`;
      return (
        <img
          src={imageUrl}
          alt={typeConfig.name}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      );
    }
    if (typeConfig) {
      return (
        <span className="text-[9px] font-extrabold text-muted uppercase">
          {typeConfig.code.substring(0, 3)}
        </span>
      );
    }
    return <Hexagon size={16} className="text-muted" />;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB');
    } catch { return '-'; }
  };

  const SkillDisplay: React.FC<{ level: number }> = ({ level }) => {
    const safeLevel = Math.max(0, Math.min(4, level || 0));
    if (displayShape === 'levelblock') {
      return <LevelBlock level={safeLevel} colors={levelColors} />;
    }
    return <PieChart level={safeLevel} colors={levelColors} size={32} />;
  };

  const handleRefresh = async () => {
    setSkillMatrixLoading(true);
    await Promise.all([
      onRefresh(),
      loadSkillMatrixData(selectedStationId),
      loadHierarchyData(),
      loadMultiSkillingsData()
    ]);
    setSkillMatrixLoading(false);
  };

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
    if (departmentId) {
      const selectedDept = hierarchyData.find(d => d.department_id === departmentId);
      if (selectedDept) {
        const matrix = skillMatrices.find(m =>
          (m.department || '').toString().trim().toLowerCase() ===
          selectedDept.department_name.toLowerCase().trim()
        );
        if (matrix) onMatrixChange(matrix);
      }
    }
  };

  const handleStationChange = (stationId: number | null) => {
    setSelectedStationId(stationId);
  };

  const showLoading = (isLoading || skillMatrixLoading) && skillMatrices.length === 0;
  const showErrorBanner = error || hierarchyError || skillMatrixError || downloadError;

  if (showLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-blue-600 animate-pulse">Loading skill matrix data...</div>
      </div>
    );
  }

  return (
    <div className="bg-background text-text min-h-screen pt-16">
      <div className="bg-background rounded-lg shadow-lg overflow-hidden border border-border">
        {/* Error Banner */}
        {showErrorBanner && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Attention Needed</h3>
                <p className="text-sm mt-1">
                  {error || hierarchyError || skillMatrixError || downloadError}
                </p>
              </div>
              <button
                onClick={() => { setHierarchyError(null); setSkillMatrixError(null); setDownloadError(null); }}
                className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 p-1 rounded"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      

        {/* Header */}
        <div className="border-b-2 border-blue-200 p-6 flex justify-between items-center bg-background from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20">
        <h1 className="text-2xl font-bold text-text flex items-center">
            <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Skill Matrix & Skill Upgradation Plan
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDownload('report')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
              title="Download skill matrix report"
              disabled={downloadLoading === 'report' || !selectedDepartmentId}
            >
              <Download className="w-4 h-4" />
              <span>{downloadLoading === 'report' ? 'Downloading...' : 'Download Report'}</span>
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              title="Refresh skill matrix data"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-b border-border bg-background">
         <div className="text-md font-semibold mb-3 text-text flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Legend
          </div>
          <div className="mb-3">
            <div className="text-sm font-semibold mb-2 text-muted">Skill Level Scale:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-sm flex items-center space-x-2 bg-surface p-2 rounded-md">
                <SkillDisplay level={0} />
                <span>0 = Beginner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-surface p-2 rounded-md">
                <SkillDisplay level={1} />
                <span>1 = Learner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-surface p-2 rounded-md">
                <SkillDisplay level={2} />
                <span>2 = Practitioner</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-surface p-2 rounded-md">
                <SkillDisplay level={3} />
                <span>3 = Expert</span>
              </div>
              <div className="text-sm flex items-center space-x-1 bg-surface p-2 rounded-md">
                <SkillDisplay level={4} />
                <span>4 = Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Info + Dropdown Row */}
         <div className="border-b border-border p-5 bg-surface">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center space-x-2 bg-background rounded-lg px-3 py-2 shadow-sm">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-text">Department:</span>
              <select
                value={selectedDepartmentId ?? ''}
                onChange={(e) => handleDepartmentChange(e.target.value ? Number(e.target.value) : null)}
                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
              >
                <option value="">Select Department</option>
                {hierarchyData.map((dept) => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted" />
            </div>
            <div className="flex items-center space-x-2 bg-background rounded-lg px-3 py-2 shadow-sm">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-text">Line:</span>
              <select
                value={selectedLineId ?? ''}
                onChange={(e) => setSelectedLineId(e.target.value ? Number(e.target.value) : null)}
                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                disabled={!selectedDepartmentId || availableLines.length === 0}
              >
                <option value="">Select Line</option>
                {availableLines.map((line) => (
                  <option key={line.line_id} value={line.line_id}>
                    {line.line_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted" />
            </div>
            <div className="flex items-center space-x-2 bg-background rounded-lg px-3 py-2 shadow-sm">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-text">Sub Line:</span>
              <select
                value={selectedLineId ?? ''}
                onChange={(e) => setSelectedLineId(e.target.value ? Number(e.target.value) : null)}
                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
                disabled={!selectedDepartmentId || availableLines.length === 0}
              >
                <option value="">
                  {availableSublines.length === 0 ? 'No Sub Lines' : 'Select Sub Line'}
                </option>
                {availableSublines.map((subline) => (
                  <option key={subline.subline_id} value={subline.subline_id}>
                    {subline.subline_name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text" />
            </div>
            {/* <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 shadow-sm">
    <Cpu className="w-4 h-4 text-blue-600" />
    <span className="font-semibold text-gray-700">Station:</span>
    <select
      value={selectedStationId ?? ''}
      onChange={(e) => setSelectedStationId(e.target.value ? Number(e.target.value) : null)}
      className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium"
    >
      <option value="">All Stations</option>
      {stationHeaders.map((station) => (
        <option key={station.station_id} value={station.station_id}>
          {station.station_name}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </div> */}
            <div className="flex items-center space-x-2 bg-background rounded-lg px-3 py-2 shadow-sm">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-muted">Station:</span>
              <select
                value={selectedStationId ?? ''}
                onChange={(e) => setSelectedStationId(e.target.value ? Number(e.target.value) : null)}
                className="border-0 bg-transparent rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-medium min-w-[220px]"
              >
                <option value="">All Stations ({dropdownStations.length})</option>
                {dropdownStations
                  .sort((a, b) => a.station_name.localeCompare(b.station_name))
                  .map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted" />
            </div>
          </div>

          {/* Context Info Box */}
          {/* <div className="mt-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg"> */}
          <div className="mt-3 text-sm text-text bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200/50 dark:border-blue-500/20">
            {(() => {
              const selectedDept = hierarchyData.find(d => d.department_id === selectedDepartmentId);
              const selectedLine = availableLines.find(l => l.line_id === selectedLineId);
              const selectedSubline = availableSublines.find(sl => sl.subline_id === selectedSublineId);
              const selectedStation = availableStations.find(st => st.station_id === selectedStationId);
              const depName = selectedDept?.department_name || '-';
              const lineName = selectedLine?.line_name || '-';
              const sublineName = selectedSubline?.subline_name || '-';
              const stationName = selectedStation?.station_name || 'All Stations';
              return (
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Department:</span> {depName}
                  </span>
                  <span className="flex items-center">
                    <GitBranch className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Line:</span> {lineName}
                  </span>
                  <span className="flex items-center">
                    <Layers className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Sub Line:</span> {sublineName}
                  </span>
                  <span className="flex items-center">
                    <Cpu className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold mr-1">Station:</span> {stationName}
                  </span>
                  <span className="flex items-center ml-4 text-green-700">
                    <span className="font-semibold mr-1">Showing:</span> {stationHeaders.length} station(s)
                  </span>
                </div>
              );
            })()}
          </div>

          {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Updated:</span>
              <span className="text-gray-600">{selectedMatrix ? formatDate(selectedMatrix.updated_on) : '-'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Next Review:</span>
              <span className="text-gray-600">{selectedMatrix ? formatDate(selectedMatrix.next_review) : '-'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Prepared By:</span>
              <span className="text-gray-600">{selectedMatrix?.prepared_by || 'Department Manager'}</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">Doc No:</span>
              <span className="text-gray-600">{selectedMatrix?.doc_no || '-'}</span>
            </div>
          </div> */}
        </div>

        {/* Employee Count Bar */}
        {/* <div className="px-5 py-3 bg-blue-50 text-sm text-blue-700 flex items-center"> */}
        <div className="px-5 py-3 bg-blue-50 dark:bg-blue-950/30 text-sm text-blue-700 dark:text-blue-200 flex items-center border-y border-blue-200/50 dark:border-blue-500/20">
          <Users className="w-4 h-4 mr-2" />
          <span className="font-semibold">{departmentEmployees.length} employees</span>
          <span className="ml-1">found matching current filters</span>
          {selectedStationId && (
            <span className="ml-4 text-purple-700 border-l border-blue-200 pl-4">
              Filtered by station: {availableStations.find(s => s.station_id === selectedStationId)?.station_name}
            </span>
          )}
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border border-border p-2 w-12 bg-background" rowSpan={3}>Sl. No.</th>
                <th className="border border-border p-2 w-16 bg-background" rowSpan={3}>CC No/EMP Code</th>
                <th className="border border-border p-2 w-32 bg-background" rowSpan={3}>Employee Name</th>
                <th className="border border-border p-2 w-24 bg-background" rowSpan={3}>DOJ</th>
                <th
                  className="border border-border p-2 text-center font-bold bg-blue-500"
                  colSpan={Math.max(1, stationHeaders.length)}
                >
                  Training Points (Stations)
                </th>
                <th
                  className="border border-border p-2 text-center font-bold bg-green-500"
                  colSpan={months.length}
                >
                  Skill Matrix & Skill Upgradation Plan
                </th>
                <th className="border border-border p-2 text-center font-bold bg-background" rowSpan={3}>
                  Remarks
                </th>
              </tr>
              <tr>
                {stationHeaders.length > 0 ? stationHeaders.map(st => {
                  const typeConfig = st.station_type ? stationTypeMap[st.station_type] : null;
                  return (
                    <th
                      key={st.station_id}
                      className="border border-border p-1 text-center text-xs font-bold bg-yellow-500"
                      title={typeConfig ? typeConfig.name : 'Standard Station'}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{st.station_id}</span>
                      </div>
                    </th>
                  );
                }) : <th className="border border-border p-1 bg-yellow-500"></th>}

                {/* Monthly Plan Header */}
                <th className="border border-border p-2 text-center font-bold bg-green-500" colSpan={months.length}>
                  Monthly Plan
                </th>
              </tr>
              <tr>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const typeConfig = st.station_type ? stationTypeMap[st.station_type] : null;
                    return (
                      <th
                        key={st.station_id}
                        className="border border-border p-1 text-center text-xs font-bold h-20 bg-blue-500"
                        title={typeConfig ? `${typeConfig.name} ` : 'Standard Station'}
                      >
                        <div className="flex flex-col items-center justify-center h-full gap-1">
                          {renderStationIcon(st)}
                          <span className="text-xs">{st.station_name}</span>
                        </div>
                      </th>
                    );
                  })
                ) : (
                  <th className="border border-border p-1 text-center text-xs font-bold bg-surface h-20">
                    <div className="flex flex-col items-center justify-center h-full text-muted">
                      No Stations
                    </div>
                  </th>
                )}
                {months.map(month => (
                  <th
                    key={month.id}
                    className="border border-border p-1 text-center text-xs font-bold bg-green-500"
                    style={{ height: '80px', width: '24px' }}
                  >
                    <div
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {month.displayName}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className="bg-background">
                <td className="border border-border p-2 text-center font-bold" colSpan={4}>Required Level</td>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const requiredLevel = getStationMinimumLevel(st.station_id) || 0;
                    return (
                      <td key={st.station_id} className="border border-border p-1 text-center font-bold">
                        <div className="flex items-center justify-center">
                          <SkillDisplay level={requiredLevel} />
                        </div>
                      </td>
                    );
                  })
                ) : (
                  <td className="border border-border p-1 text-center font-bold">-</td>
                )}
                <td className="border border-border p-1 text-center font-bold bg-background" colSpan={months.length + 1}>
                </td>
              </tr>
              {/* --- NEW ROW STARTS HERE --- */}

              <tr className="bg-surface">
                <td className="border border-border p-2 text-center font-bold text-text" colSpan={4}>
                  Min Operators
                </td>
                {stationHeaders.length > 0 ? (
                  stationHeaders.map(st => {
                    const minOps = getStationMinOperators(st.station_id);
                    return (
                      <td key={st.station_id} className="border border-border p-1 text-center font-bold text-blue-800">
                        {minOps}
                      </td>
                    );
                  })
                ) : (
                  <td className="border border-border p-1 text-center font-bold">-</td>
                )}
                {/* Empty cell for calendar columns */}
                <td className="border border-border p-1 text-center font-bold bg-surface" colSpan={months.length + 1}></td>
              </tr>
              {/* --- NEW ROW ENDS HERE --- */}
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee, index) => {
                  const employeeMonthlySkills = getEmployeeMonthlySkills(employee.emp_id || employee.employee_code);
                  return (
                    <tr key={employee.emp_id || employee.employee_code} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface'}>
                      <td className="border border-border p-2 text-center">{firstItemIndex + index + 1}</td>
                      <td className="border border-border p-2 text-center font-mono">{employee.emp_id || employee.employee_code || '-'}</td>
                      <td className="border border-border p-2">{employee.full_name || '-'}</td>
                      <td className="border border-border p-2 text-center">{formatDate(employee.date_of_join)}</td>
                      {stationHeaders.length > 0 ? (
                        stationHeaders.map(st => {
                          const skillLevel = getOperatorSkillLevel(
                            employee.emp_id || employee.employee_code,
                            st.station_id
                          );
                          const skillRecord = skillMatrixData.find(skill =>
                            skill.emp_id === (employee.emp_id || employee.employee_code) &&
                            skill.station_id === st.station_id
                          );
                          const updatedDate = skillRecord?.updated_at ? formatDate(skillRecord.updated_at) : null;
                          return (
                            <td
                              key={st.station_id}
                              className="border border-border p-1 text-center"
                              title={`${employee.full_name} - ${st.station_name}: Level ${skillLevel}${updatedDate ? ` (Updated: ${updatedDate})` : ''}`}
                            >
                              <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="flex items-center justify-center">
                                  <SkillDisplay level={skillLevel} />
                                </div>
                                {updatedDate && (
                                  <div className="text-xs text-muted font-mono leading-tight">
                                    {updatedDate}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })
                      ) : (
                        <td className="border border-border p-1 text-center">
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-muted">No stations</span>
                          </div>
                        </td>
                      )}
                      {months.map(month => {
                        const employeeMultiSkills = getEmployeeMultiSkills(employee.emp_id || employee.employee_code);
                        const monthMultiSkills = employeeMultiSkills.filter(ms => {
                          if (!ms.start_date) return false;
                          try {
                            const startDate = new Date(ms.start_date);
                            return startDate.getMonth() + 1 === month.id &&
                              startDate.getFullYear() === month.year;
                          } catch {
                            return false;
                          }
                        });
                        return (
                          <td
                            key={month.id}
                            className="border border-border p-1 text-center"
                            style={{ width: '24px' }}
                          >
                            {monthMultiSkills.length > 0 ? (
                              <div className="flex flex-col items-center justify-center h-full space-y-1">
                                {monthMultiSkills.map(ms => {
                                  // FIX: Handle both object and number types safely
                                  const stationId = (typeof ms.station === 'object' && ms.station !== null)
                                    ? ms.station.station_id
                                    : (ms.station as number);

                                  let stationName = (typeof ms.station === 'object' && ms.station !== null)
                                    ? ms.station.station_name
                                    : undefined;

                                  if (!stationName) {
                                    const foundStation = availableStations.find(st =>
                                      st.station_id === parseInt(stationId.toString())
                                    );
                                    stationName = foundStation?.station_name;
                                  }
                                  if (!stationName) {
                                    // Fallback: search in all hierarchy
                                    const allStations = hierarchyData.flatMap(dept => [
                                      ...(dept.stations || []),
                                      ...(dept.lines || []).flatMap(line => [
                                        ...(line.stations || []),
                                        ...(line.sublines || []).flatMap(sl => sl.stations || [])
                                      ]),
                                      ...(dept.sublines || []).flatMap(sl => sl.stations || [])
                                    ]);
                                    const foundInAll = allStations.find(st =>
                                      st.station_id === parseInt(stationId.toString())
                                    );
                                    stationName = foundInAll?.station_name;
                                  }
                                  if (!stationName) {
                                    stationName = `Station ${stationId}`;
                                  }

                                  // FIX: Handle both object and number types safely for skill level
                                  const skillLevel = (typeof ms.skill_level === 'object' && ms.skill_level !== null)
                                    ? ms.skill_level.level_number
                                    : Number(ms.skill_level);

                                  const isCompleted = ms.status === 'completed';
                                  const isInProgress = ms.current_status === 'in-progress';
                                  return (
                                    <div
                                      key={ms.id || `${ms.emp_id}-${stationId}-${ms.start_date}`}
                                      className="flex flex-col items-center space-y-1"
                                    >
                                      {isCompleted ? (
                                        <div
                                          className="flex items-center justify-center w-6 h-6 bg-green-500 text-white rounded-full text-sm font-bold"
                                          title={`Station ${stationId} (${stationName}) - Level ${skillLevel} - Completed`}
                                        >
                                          ✓
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center space-y-1">
                                          <MonthlySkillDisplay
                                            stationId={stationId}
                                            stationName={stationName}
                                            skillLevel={skillLevel}
                                            size={24}
                                            colors={levelColors}
                                            title={`Station ${stationId} (${stationName}) - Level ${skillLevel} - ${isInProgress ? 'In Progress' : 'Scheduled'}`}
                                          />
                                          <div className="text-xs text-muted font-sans leading-tight truncate w-20">
                                            {stationName}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-xs text-muted">-</div>
                            )}
                          </td>
                        );
                      })}
                      <td className="border border-border p-2 text-xs">
                        {employeeMonthlySkills.length > 0
                          ? employeeMonthlySkills[0].remarks || '-'
                          : '-'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7 + stationHeaders.length + months.length} className="p-8 text-center text-muted">
                    <div className="text-lg font-semibold mb-2">No Employees Found</div>
                    <div className="text-sm max-w-md mx-auto">
                      No employees have been assigned to
                      {selectedStationId ? ' this specific station ' :
                        selectedSublineId ? ' this specific subline ' :
                          selectedLineId ? ' this specific line ' : ' this department '}
                      yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-surface text-sm">
          <div>
            Showing{' '}
            <span className="font-semibold">{departmentEmployees.length > 0 ? firstItemIndex + 1 : 0}</span> to{' '}
            <span className="font-semibold">{Math.min(lastItemIndex, departmentEmployees.length)}</span> of{' '}
            <span className="font-semibold">{departmentEmployees.length}</span> employees
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-3 py-1 border rounded-md bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >Previous</button>
            <span>
              Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages || 1}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded-md bg-surface hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatrixTable;