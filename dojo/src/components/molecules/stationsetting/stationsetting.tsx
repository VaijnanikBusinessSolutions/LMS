

import React, { useEffect, useState } from "react";
// IMPORTANT: Update this import to use a single function for fetching all data
import { getHierarchyData, saveStationSettings } from "../../hooks/ServiceApis";
import {
  Building,
  MapPin,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { StationSettingPayload } from "../../constants/types";

// --- Interfaces for our state, matching the desired shape ---
interface Department {
  department_id: number;
  department_name: string;
}

interface Station {
  station_id: number;
  station_name: string;
}

// --- Interface to strongly type the API response for better autocompletion and safety ---
interface HierarchyStructure {
  structure_id: number;
  structure_name: string;
  hq: number;
  factory: number;
  structure_data: {
    hq_name: string;
    factory_name: string;
    departments: Array<{
      id: number;
      department_name: string;
      lines: any[]; // Assuming lines can be any type for now
      stations: Array<{
        id: number;
        station_name: string;
      }>;
    }>;
  };
}


const StationSettings: React.FC = () => {
  // State to hold the raw, strongly-typed data from the API call
  const [hierarchyData, setHierarchyData] = useState<HierarchyStructure[]>([]);

  // State for the processed data used in dropdowns
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  // State for user selections
  const [selectedDept, setSelectedDept] = useState<number | "">("");
  const [selectedStation, setSelectedStation] = useState<number | "">("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // State for UI feedback
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkOptions = ["CTQ", "PDI", "OTHER", "MARU A", "CRITICAL"];

  // --- [CORRECTED] Helper function to extract a unique list of departments ---
  const extractDepartmentsFromHierarchy = (data: HierarchyStructure[]): Department[] => {
    if (!Array.isArray(data)) return [];
    
    const departmentMap = new Map<number, Department>();

    // Iterate through each main structure object
    data.forEach(structure => {
      // Access the nested departments array
      if (structure.structure_data && Array.isArray(structure.structure_data.departments)) {
        structure.structure_data.departments.forEach(dept => {
          // Add to map to ensure uniqueness by department ID
          if (!departmentMap.has(dept.id)) {
            departmentMap.set(dept.id, {
              department_id: dept.id,
              department_name: dept.department_name,
            });
          }
        });
      }
    });

    return Array.from(departmentMap.values());
  };

  // --- [CORRECTED] Helper function to extract stations for a SPECIFIC department ---
  const extractStationsForDepartment = (data: HierarchyStructure[], departmentId: number | ""): Station[] => {
    if (!Array.isArray(data) || !departmentId) return [];

    const stationMap = new Map<number, Station>();

    // Iterate through each main structure object
    data.forEach(structure => {
      if (structure.structure_data && Array.isArray(structure.structure_data.departments)) {
        // Find the specific department by its ID
        const targetDepartment = structure.structure_data.departments.find(
          dept => dept.id === departmentId
        );

        // If the department is found, process its stations
        if (targetDepartment && Array.isArray(targetDepartment.stations)) {
          targetDepartment.stations.forEach(st => {
            // Add to map to ensure station uniqueness
            if (!stationMap.has(st.id)) {
              stationMap.set(st.id, {
                station_id: st.id,
                station_name: st.station_name,
              });
            }
          });
        }
      }
    });

    return Array.from(stationMap.values());
  };

  // --- Single useEffect to load all data at once when the component mounts ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData: HierarchyStructure[] = await getHierarchyData();
        setHierarchyData(rawData); // Store the raw data

        // Process the raw data to get a unique list of departments
        const extractedDepartments = extractDepartmentsFromHierarchy(rawData);
        setDepartments(extractedDepartments);

      } catch (err) {
        console.error("Error loading hierarchy data:", err);
        setError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Empty dependency array ensures this runs only ONCE

  // --- Handler for when the department selection changes ---
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeptId = e.target.value ? Number(e.target.value) : "";
    setSelectedDept(newDeptId);

    // Reset downstream selections
    setSelectedStation("");
    setSelectedOptions([]);

    // Filter the already-loaded data to find stations for the new department.
    // This is instantaneous and requires no new API call.
    const departmentStations = extractStationsForDepartment(hierarchyData, newDeptId);
    setStations(departmentStations);
  };

  // This function logic remains the same
  const resetForm = () => {
    setSelectedDept("");
    setSelectedStation("");
    setSelectedOptions([]);
    setStations([]);
    setMessage(null);
    setError(null);
  };
  
  // This function logic remains the same
  const handleOptionChange = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    );
  };
  
  // This function logic remains the same
  const handleSave = async () => {
    setError(null);
    setMessage(null);
    if (!selectedDept || !selectedStation) {
      setError("Please select Department and Station");
      return;
    }
    if (selectedOptions.length === 0) {
      setError("Please select at least one option");
      return;
    }
    try {
      setSubmitting(true);
      const payload: StationSettingPayload = {
        department_id: selectedDept as number,
        station_id: selectedStation as number,
        options: selectedOptions
      };
      const response = await saveStationSettings(payload);
      if (response.ok) {
        setMessage("Station settings saved successfully");
      } else {
        const errorData = await response.json();
        setError("Failed to save settings: " + JSON.stringify(errorData));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  // The JSX part below remains unchanged as it correctly uses the state variables.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Station Settings
          </h1>
          <p className="text-lg text-gray-600">
            Configure department and station details
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Building className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Update Station Settings
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-600">Loading Data...</div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department Dropdown */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={handleDepartmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Station Dropdown */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Station
                  </label>
                  <select
                    value={selectedStation}
                    onChange={(e) => {
                      setSelectedStation(e.target.value ? Number(e.target.value) : "");
                      setSelectedOptions([]);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedDept}
                  >
                    <option value="">Select Station</option>
                    {stations.map((st) => (
                      <option key={st.station_id} value={st.station_id}>
                        {st.station_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              {selectedDept && selectedStation && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Select Options (You can select multiple)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {checkOptions.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => handleOptionChange(option)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedOptions.join(", ") || "None"}
                  </p>
                </div>
              )}

              {/* Success / Error Messages */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">{message}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={resetForm} className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition">
                  <RotateCcw className="inline h-5 w-5 mr-2" />
                  Reset
                </button>
                <button type="button" onClick={handleSave} disabled={submitting || !selectedDept || !selectedStation || selectedOptions.length === 0} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-lg disabled:opacity-50">
                  {submitting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="inline h-5 w-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationSettings;



