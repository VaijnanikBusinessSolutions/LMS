import React, { useEffect, useState } from "react";
import axios from "axios";
import type { FilterOptions } from "../types/production";

/**
 * Expects the API response shape you pasted.
 * Adjust API_URL if different.
 */
const API_URL = "http://127.0.0.1:8000/hierarchy-simple/";

interface Station { id: number; station_name: string; }
interface Subline { id: number; subline_name: string; stations?: Station[]; }
interface Line { id: number; line_name: string; sublines?: Subline[]; stations?: Station[]; }
interface Dept {
  id: number;
  department_name: string;
  lines?: Line[];
  stations?: Station[]; // if lines absent, stations may be directly on dept
}
interface StructureData {
  hq_name: string;
  factory_name: string;
  departments: Dept[];
}
interface Structure {
  structure_id: number;
  structure_name: string;
  hq: number;
  hq_name: string;
  factory: number;
  factory_name: string;
  structure_data: StructureData;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [hqOptions, setHqOptions] = useState<{ id: number; name: string }[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<Dept[]>([]);
  const [lineOptions, setLineOptions] = useState<Line[]>([]);
  const [sublineOptions, setSublineOptions] = useState<Subline[]>([]);
  const [stationOptions, setStationOptions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Structure[]>(API_URL);
        const data = res.data || [];
        setStructures(data);

        // Extract unique HQs and Factories (by id)
        const hqMap = new Map<number, string>();
        const factoryMap = new Map<number, string>();
        data.forEach(s => {
          hqMap.set(s.hq, s.hq_name);
          factoryMap.set(s.factory, s.factory_name);
        });
        setHqOptions(Array.from(hqMap.entries()).map(([id, name]) => ({ id, name })));
        setFactoryOptions(Array.from(factoryMap.entries()).map(([id, name]) => ({ id, name })));

        // Initialize with first HQ and Factory if none selected
        if (data.length > 0 && (!filters.hq || !filters.factory)) {
          const firstStructure = data[0];
          const newFilters = { ...filters };
          
          if (!filters.hq) {
            newFilters.hq = String(firstStructure.hq);
          }
          if (!filters.factory) {
            newFilters.factory = String(firstStructure.factory);
          }
          
          if (newFilters.hq !== filters.hq || newFilters.factory !== filters.factory) {
            onFilterChange(newFilters);
          }
        }

        initDepartments(data, filters);
      } catch (err) {
        console.error("Failed to fetch hierarchy:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute department/line/subline/station options when filters.hq or filters.factory change
  useEffect(() => {
    initDepartments(structures, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structures, filters.hq, filters.factory]);

  // When department changes, update line/subline/station options
  useEffect(() => {
    if (!filters.department) {
      setLineOptions([]);
      setSublineOptions([]);
      setStationOptions([]);
      return;
    }
    
    const dept = findDepartment(filters.department);
    if (!dept) {
      setLineOptions([]);
      setSublineOptions([]);
      setStationOptions([]);
      return;
    }

    const lines = dept.lines ?? [];
    setLineOptions(lines);

    // If department has no lines but has stations directly
    if (lines.length === 0 && dept.stations && dept.stations.length > 0) {
      console.log("Setting stations from department:", dept.stations);
      setStationOptions(dept.stations);
      setSublineOptions([]);
      
      // Auto-select first station if no station selected
      if (!filters.station) {
        const firstStation = dept.stations[0];
        console.log("Auto-selecting station:", firstStation);
        handleFilterChange("station", String(firstStation.id));
      }
      return;
    }

    // Auto-select first line if no line selected but lines exist
    if (lines.length > 0 && !filters.line) {
      const firstLine = lines[0];
      handleFilterChange("line", String(firstLine.id));
      return;
    }

    // Handle line selection and populate sublines/stations
    if (filters.line) {
      const selectedLine = lines.find(l => String(l.id) === String(filters.line));
      if (selectedLine) {
        const sublines = selectedLine.sublines ?? [];
        setSublineOptions(sublines);

        // Auto-select first subline if no subline selected but sublines exist
        if (sublines.length > 0 && !filters.subline) {
          const firstSubline = sublines[0];
          handleFilterChange("subline", String(firstSubline.id));
          return;
        }

        // If selected line has stations directly (no sublines)
        if (sublines.length === 0 && selectedLine.stations && selectedLine.stations.length > 0) {
          setStationOptions(selectedLine.stations);
          
          // Auto-select first station if no station selected
          if (!filters.station) {
            const firstStation = selectedLine.stations[0];
            handleFilterChange("station", String(firstStation.id));
          }
        } else {
          setStationOptions([]);
        }
      } else {
        setSublineOptions([]);
        setStationOptions([]);
      }
    } else {
      setSublineOptions([]);
      setStationOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.department, filters.line, structures]);

  // When subline changes, populate stations
  useEffect(() => {
    console.log("Subline effect running:", { 
      subline: filters.subline, 
      line: filters.line, 
      department: filters.department,
      lineOptionsLength: lineOptions.length 
    });

    // Skip this effect if department has no lines (stations are directly on department)
    if (lineOptions.length === 0) {
      console.log("No lines in department, skipping subline effect");
      return;
    }

    if (!filters.subline) {
      // if no subline selected, but a line selected that has stations directly, keep them
      if (filters.line) {
        const line = lineOptions.find(l => String(l.id) === String(filters.line));
        if (line && line.stations && line.stations.length > 0) {
          console.log("Setting stations from line:", line.stations);
          setStationOptions(line.stations);
          
          // Auto-select first station if no station selected
          if (!filters.station) {
            const firstStation = line.stations[0];
            handleFilterChange("station", String(firstStation.id));
          }
        } else {
          setStationOptions([]);
        }
      } else {
        setStationOptions([]);
      }
      return;
    }
    
    const sub = sublineOptions.find(s => String(s.id) === String(filters.subline));
    if (sub && sub.stations) {
      console.log("Setting stations from subline:", sub.stations);
      setStationOptions(sub.stations);
      
      // Auto-select first station if no station selected
      if (!filters.station && sub.stations.length > 0) {
        const firstStation = sub.stations[0];
        handleFilterChange("station", String(firstStation.id));
      }
    } else {
      setStationOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.subline, sublineOptions, filters.line, lineOptions]);

  // helper to initialize departments based on filters.hq and filters.factory
  const initDepartments = (data: Structure[], currentFilters: FilterOptions) => {
    if (!data || data.length === 0) {
      setDepartmentOptions([]);
      return;
    }
    
    // choose structures matching selected HQ & Factory
    const matching = data.filter(s => {
      const matchesHq = currentFilters.hq ? String(s.hq) === String(currentFilters.hq) : true;
      const matchesFactory = currentFilters.factory ? String(s.factory) === String(currentFilters.factory) : true;
      return matchesHq && matchesFactory;
    });

    // Collect departments across matching structures
    const deptMap = new Map<string, Dept>();
    matching.forEach(s => {
      const depts = s.structure_data?.departments ?? [];
      depts.forEach(d => {
        const key = `${d.id}::${d.department_name}`;
        if (!deptMap.has(key)) deptMap.set(key, d);
      });
    });

    const deptsArray = Array.from(deptMap.values());
    setDepartmentOptions(deptsArray);

    // Auto-select first department if none selected but departments exist
    if (deptsArray.length > 0 && !filters.department) {
      const firstDept = deptsArray[0];
      handleFilterChange("department", String(firstDept.id));
    }
  };

  const findDepartment = (deptValue: string) => {
    return departmentOptions.find(d =>
      String(d.id) === String(deptValue) || d.department_name === deptValue
    );
  };

  // called on internal changes; will also reset dependent filters where needed
  const handleFilterChange = (key: Exclude<keyof FilterOptions, 'dateRange'>, value: string) => {
    const newFilters = { ...filters };

    // when HQ or Factory changes, reset everything below
    if (key === "hq" || key === "factory") {
      newFilters[key] = value;
      newFilters.department = "";
      newFilters.line = "";
      newFilters.subline = "";
      newFilters.station = "";
    }
    // when dept changes, reset line/subline/station
    else if (key === "department") {
      newFilters.department = value;
      newFilters.line = "";
      newFilters.subline = "";
      newFilters.station = "";
    }
    // when line changes, reset subline/station
    else if (key === "line") {
      newFilters.line = value;
      newFilters.subline = "";
      newFilters.station = "";
    }
    // when subline changes reset station
    else if (key === "subline") {
      newFilters.subline = value;
      newFilters.station = "";
    }
    // normal change for station
    else if (key === "station") {
      newFilters.station = value;
    }

    onFilterChange(newFilters);
  };

  // helpers to create option lists (string value is the id as string)
  const deptOptionsForSelect = departmentOptions.map(d => ({ value: String(d.id), label: d.department_name }));
  const lineOptionsForSelect = lineOptions.map(l => ({ value: String(l.id), label: l.line_name }));
  const sublineOptionsForSelect = sublineOptions.map(s => ({ value: String(s.id), label: s.subline_name }));
  const stationOptionsForSelect = stationOptions.map(s => ({ value: String(s.id), label: s.station_name }));

  return (
    <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
      <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Analytics Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* HQ */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">HQ</label>
          <select
            value={filters.hq ?? ""}
            onChange={(e) => handleFilterChange("hq", e.target.value)}
            className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            {hqOptions.map(h => <option key={h.id} value={String(h.id)}>{h.name}</option>)}
          </select>
        </div>

        {/* Factory */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Factory</label>
          <select
            value={filters.factory ?? ""}
            onChange={(e) => handleFilterChange("factory", e.target.value)}
            className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            {factoryOptions.map(f => <option key={f.id} value={String(f.id)}>{f.name}</option>)}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
          <select
            value={filters.department ?? ""}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
          >
            {deptOptionsForSelect.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        {/* Line (only show if lines exist for selected department) */}
        {lineOptions.length > 0 ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Line</label>
            <select
              value={filters.line ?? ""}
              onChange={(e) => handleFilterChange("line", e.target.value)}
              className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
            >
              {lineOptionsForSelect.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Line</label>
            <select disabled className="w-full rounded-xl border-slate-200 shadow-md bg-white/60">
              <option>No Lines</option>
            </select>
          </div>
        )}

        {/* Subline (only show if sublines exist for selected line) */}
        {sublineOptions.length > 0 ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subline</label>
            <select
              value={filters.subline ?? ""}
              onChange={(e) => handleFilterChange("subline", e.target.value)}
              className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
            >
              {sublineOptionsForSelect.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Subline</label>
            <select disabled className="w-full rounded-xl border-slate-200 shadow-md bg-white/60">
              <option>No Sublines</option>
            </select>
          </div>
        )}

        {/* Station */}
        {stationOptions.length > 0 ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Station</label>
            <select
              value={filters.station ?? ""}
              onChange={(e) => handleFilterChange("station", e.target.value)}
              className="w-full rounded-xl border-slate-200 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 transition-all duration-300 bg-white/90 backdrop-blur-sm"
            >
              {stationOptionsForSelect.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Station</label>
            <select disabled className="w-full rounded-xl border-slate-200 shadow-md bg-white/60">
              <option>No Stations</option>
            </select>
          </div>
        )}
      </div>

      {loading && <p className="text-sm text-slate-400 mt-3">Loading hierarchy...</p>}
    </div>
  );
};