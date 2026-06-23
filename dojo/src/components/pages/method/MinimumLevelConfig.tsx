// // MinimumLevelConfig.tsx
// import { useState, useEffect } from 'react';

// interface Level {
//   level_id: number;
//   level_name: string;
// }

// interface Config {
//   id: number;
//   minimum_level: number;
//   minimum_level_id: number;
//   minimum_level_name: string;
//   updated_by: string | null;
//   created_at: string;
//   updated_at: string;
// }

// const API_BASE_URL = 'http://127.0.0.1:8000';

// const MinimumLevelConfig = () => {
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [currentConfig, setCurrentConfig] = useState<Config | null>(null);
//   const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
//   const [updatedBy, setUpdatedBy] = useState('');
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Fetch levels and current config on mount
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     setIsLoading(true);
//     setError('');

//     try {
//       // Fetch all levels
//       const levelsRes = await fetch(`${API_BASE_URL}/levels/`);
//       if (!levelsRes.ok) throw new Error('Failed to fetch levels');
//       const levelsData = await levelsRes.json();
//       setLevels(levelsData);

//       // Fetch current config
//       const configRes = await fetch(`${API_BASE_URL}/multiskilling-config/current/`);
//       if (configRes.ok) {
//         const configData = await configRes.json();
//         setCurrentConfig(configData);
//         setSelectedLevel(configData.minimum_level);
//       } else if (configRes.status === 404) {
//         // No config set yet
//         setCurrentConfig(null);
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err instanceof Error ? err.message : 'Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedLevel) {
//       setError('Please select a minimum level');
//       return;
//     }

//     setIsSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch(`${API_BASE_URL}/multiskilling-config/set_minimum_level/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           minimum_level: selectedLevel,
//           updated_by: updatedBy || 'Admin'
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save configuration');
//       }

//       const result = await response.json();
//       setCurrentConfig(result.config);
//       setSuccess(result.message || 'Configuration saved successfully!');
      
//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error saving config:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save configuration');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
//       <div className="flex items-center mb-6">
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
//           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">MultiSkilling Configuration</h2>
//           <p className="text-sm text-gray-600 mt-1">Set minimum skill level required for employee search</p>
//         </div>
//       </div>

//       {/* Current Configuration Display */}
//       {currentConfig && (
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500 mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-gray-700">Current Minimum Level</p>
//               <p className="text-2xl font-bold text-blue-600 mt-1">Level {currentConfig.minimum_level_name}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-xs text-gray-600">Last updated</p>
//               <p className="text-sm font-medium text-gray-800">
//                 {new Date(currentConfig.updated_at).toLocaleDateString()} at{' '}
//                 {new Date(currentConfig.updated_at).toLocaleTimeString()}
//               </p>
//               {currentConfig.updated_by && (
//                 <p className="text-xs text-gray-500 mt-1">by {currentConfig.updated_by}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             {error}
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             {success}
//           </div>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {/* Level Selection */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-semibold text-gray-700">
//               <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//               </svg>
//               Select Minimum Level *
//             </label>
//             <select
//               value={selectedLevel || ''}
//               onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
//               className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium"
//               disabled={isSaving}
//             >
//               <option value="">Select minimum level...</option>
//               {levels.map((level) => (
//                 <option key={level.level_id} value={level.level_id}>
//                   Level {level.level_name}
//                 </option>
//               ))}
//             </select>
//             <p className="text-sm text-gray-600 italic">
//               Only employees with skills at or above this level will appear in search results
//             </p>
//           </div>

//           {/* Updated By Field */}
//           <div className="space-y-2">
//             <label className="flex items-center text-sm font-semibold text-gray-700">
//               <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               Your Name (optional)
//             </label>
//             <input
//               type="text"
//               value={updatedBy}
//               onChange={(e) => setUpdatedBy(e.target.value)}
//               placeholder="Enter your name for tracking..."
//               className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//               disabled={isSaving}
//             />
//           </div>

//           {/* Info Box */}
//           <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border-l-4 border-yellow-500">
//             <div className="flex items-start">
//               <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//               <div>
//                 <p className="text-sm font-semibold text-yellow-800">Important</p>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   Changing the minimum level will immediately affect which employees appear in the search results. 
//                   Only employees with at least one skill at or above the selected level will be searchable.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="flex justify-end pt-4 border-t border-gray-200">
//             <button
//               onClick={handleSave}
//               disabled={isSaving || !selectedLevel}
//               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {isSaving ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   Save Configuration
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MinimumLevelConfig;
// ==============------------------------------------------------------------------------------------------------================
// import { useState, useEffect } from 'react';

// interface Level {
//   level_id: number;
//   level_name: string;
// }

// interface Config {
//   id: number;
//   minimum_level: number;
//   minimum_level_name: string;
//   updated_by: string | null;
//   created_at: string;
//   updated_at: string;
// }

// interface Department {
//   id: number;
//   department_name: string;
//   lines: Line[];
//   stations: Station[];
// }

// interface Line {
//   id: number;
//   line_name: string;
//   sublines: Subline[];
//   stations: Station[];
// }

// interface Subline {
//   id: number;
//   subline_name: string;
//   stations: Station[];
// }

// interface Station {
//   id: number;
//   station_name: string;
// }

// interface TimeInterval {
//   id: number;
//   department: number | null;
//   department_name: string | null;
//   line: number | null;
//   line_name: string | null;
//   subline: number | null;
//   subline_name: string | null;
//   station: number;
//   station_name: string;
//   time_interval_months: number;
//   is_enabled: boolean;
//   updated_by: string | null;
//   created_at: string;
//   updated_at: string;
// }

// const API_BASE_URL = 'http://127.0.0.1:8000';

// const MinimumLevelConfig = () => {
//   const [activeTab, setActiveTab] = useState<'level' | 'interval'>('level');

//   // Level Config States
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [currentConfig, setCurrentConfig] = useState<Config | null>(null);
//   const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
//   const [updatedBy, setUpdatedBy] = useState('');

//   // Time Interval States
//   const [hierarchyData, setHierarchyData] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
//   const [selectedLine, setSelectedLine] = useState<number | null>(null);
//   const [selectedSubline, setSelectedSubline] = useState<number | null>(null);
//   const [selectedStation, setSelectedStation] = useState<number | null>(null);
//   const [timeIntervalMonths, setTimeIntervalMonths] = useState<number>(1);
//   const [intervalUpdatedBy, setIntervalUpdatedBy] = useState('');
//   const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([]);
//   const [isIntervalEnabled, setIsIntervalEnabled] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Fetch initial data on mount
//   useEffect(() => {
//     fetchLevelData();
//     fetchHierarchyData();
//     fetchTimeIntervals();
//     checkGlobalStatus();
//   }, []);

//   const fetchLevelData = async () => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const levelsRes = await fetch(`${API_BASE_URL}/levels/`);
//       if (!levelsRes.ok) throw new Error('Failed to fetch levels');
//       const levelsData = await levelsRes.json();
//       setLevels(levelsData);

//       const configRes = await fetch(`${API_BASE_URL}/multiskilling-config/current/`);
//       if (configRes.ok) {
//         const configData = await configRes.json();
//         setCurrentConfig(configData);
//         setSelectedLevel(configData.minimum_level);
//       }
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err instanceof Error ? err.message : 'Failed to load data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchHierarchyData = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/hierarchy-simple/`);
//       if (!response.ok) throw new Error('Failed to fetch hierarchy');
//       const data = await response.json();
//       setHierarchyData(data);

//       if (data.length > 0 && data[0].structure_data) {
//         setDepartments(data[0].structure_data.departments || []);
//       }
//     } catch (err) {
//       console.error('Error fetching hierarchy:', err);
//     }
//   };

//   const fetchTimeIntervals = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/`);
//       if (response.ok) {
//         const data = await response.json();
//         setTimeIntervals(data);
//       }
//     } catch (err) {
//       console.error('Error fetching time intervals:', err);
//     }
//   };

//   const checkGlobalStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/check_global_status/`);
//       if (response.ok) {
//         const data = await response.json();
//         setIsIntervalEnabled(data.is_enabled);
//       }
//     } catch (err) {
//       console.error('Error checking global status:', err);
//     }
//   };

//   const handleSaveLevel = async () => {
//     if (!selectedLevel) {
//       setError('Please select a minimum level');
//       return;
//     }

//     setIsSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch(`${API_BASE_URL}/multiskilling-config/set_minimum_level/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           minimum_level: selectedLevel,
//           updated_by: updatedBy || 'Admin'
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save configuration');
//       }

//       const result = await response.json();
//       setCurrentConfig(result.config);
//       setSuccess(result.message || 'Configuration saved successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error saving config:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save configuration');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSaveInterval = async () => {
//     if (!selectedStation) {
//       setError('Please select a station/skill');
//       return;
//     }

//     if (timeIntervalMonths < 1) {
//       setError('Time interval must be at least 1 month');
//       return;
//     }

//     setIsSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/set_interval/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           department: selectedDepartment,
//           line: selectedLine,
//           subline: selectedSubline,
//           station: selectedStation,
//           time_interval_months: timeIntervalMonths,
//           is_enabled: isIntervalEnabled,
//           updated_by: intervalUpdatedBy || 'Admin'
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save time interval');
//       }

//       const result = await response.json();
//       setSuccess(result.message || 'Time interval saved successfully!');
      
//       // Reset form
//       setSelectedDepartment(null);
//       setSelectedLine(null);
//       setSelectedSubline(null);
//       setSelectedStation(null);
//       setTimeIntervalMonths(1);
      
//       // Refresh intervals
//       fetchTimeIntervals();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error saving interval:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save time interval');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleToggleGlobalStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/toggle_global_status/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_enabled: !isIntervalEnabled }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setIsIntervalEnabled(!isIntervalEnabled);
//         setSuccess(result.message);
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       console.error('Error toggling status:', err);
//       setError('Failed to update status');
//     }
//   };

//   const handleDeleteInterval = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this time interval?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/${id}/`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setSuccess('Time interval deleted successfully!');
//         fetchTimeIntervals();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       console.error('Error deleting interval:', err);
//       setError('Failed to delete time interval');
//     }
//   };

//   // Get available lines based on selected department
//   const getAvailableLines = () => {
//     if (!selectedDepartment) return [];
//     const dept = departments.find(d => d.id === selectedDepartment);
//     return dept?.lines || [];
//   };

//   // Get available sublines based on selected line
//   const getAvailableSublines = () => {
//     if (!selectedLine) return [];
//     const lines = getAvailableLines();
//     const line = lines.find(l => l.id === selectedLine);
//     return line?.sublines || [];
//   };

//   // Get available stations based on selections
//   const getAvailableStations = () => {
//     const stations: Station[] = [];

//     if (selectedSubline) {
//       const sublines = getAvailableSublines();
//       const subline = sublines.find(sl => sl.id === selectedSubline);
//       if (subline) stations.push(...subline.stations);
//     } else if (selectedLine) {
//       const lines = getAvailableLines();
//       const line = lines.find(l => l.id === selectedLine);
//       if (line) stations.push(...line.stations);
//     } else if (selectedDepartment) {
//       const dept = departments.find(d => d.id === selectedDepartment);
//       if (dept) stations.push(...dept.stations);
//     } else {
//       // All departments - collect all stations
//       departments.forEach(dept => {
//         stations.push(...dept.stations);
//         dept.lines.forEach(line => {
//           stations.push(...line.stations);
//           line.sublines.forEach(subline => {
//             stations.push(...subline.stations);
//           });
//         });
//       });
//     }

//     // Remove duplicates
//     return stations.filter((station, index, self) =>
//       index === self.findIndex(s => s.id === station.id)
//     );
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
//       {/* Tabs */}
//       <div className="flex space-x-4 mb-6 border-b border-gray-200">
//         <button
//           onClick={() => setActiveTab('level')}
//           className={`px-6 py-3 font-semibold transition-all duration-300 ${
//             activeTab === 'level'
//               ? 'border-b-4 border-indigo-600 text-indigo-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             Minimum Level Configuration
//           </div>
//         </button>
//         <button
//           onClick={() => setActiveTab('interval')}
//           className={`px-6 py-3 font-semibold transition-all duration-300 ${
//             activeTab === 'interval'
//               ? 'border-b-4 border-purple-600 text-purple-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Skill Time Interval Configuration
//           </div>
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             {error}
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             {success}
//           </div>
//         </div>
//       )}

//       {/* Tab Content */}
//       {activeTab === 'level' ? (
//         // Level Configuration Tab
//         <div>
//           <div className="flex items-center mb-6">
//             <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">MultiSkilling Configuration</h2>
//               <p className="text-sm text-gray-600 mt-1">Set minimum skill level required for employee search</p>
//             </div>
//           </div>

//           {currentConfig && (
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500 mb-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-700">Current Minimum Level</p>
//                   <p className="text-2xl font-bold text-blue-600 mt-1">Level {currentConfig.minimum_level_name}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-600">Last updated</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     {new Date(currentConfig.updated_at).toLocaleDateString()} at{' '}
//                     {new Date(currentConfig.updated_at).toLocaleTimeString()}
//                   </p>
//                   {currentConfig.updated_by && (
//                     <p className="text-xs text-gray-500 mt-1">by {currentConfig.updated_by}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                   </svg>
//                   Select Minimum Level *
//                 </label>
//                 <select
//                   value={selectedLevel || ''}
//                   onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium"
//                   disabled={isSaving}
//                 >
//                   <option value="">Select minimum level...</option>
//                   {levels.map((level) => (
//                     <option key={level.level_id} value={level.level_id}>
//                       Level {level.level_name}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-sm text-gray-600 italic">
//                   Only employees with skills at or above this level will appear in search results
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   Your Name (optional)
//                 </label>
//                 <input
//                   type="text"
//                   value={updatedBy}
//                   onChange={(e) => setUpdatedBy(e.target.value)}
//                   placeholder="Enter your name for tracking..."
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//                   disabled={isSaving}
//                 />
//               </div>

//               <div className="flex justify-end pt-4 border-t border-gray-200">
//                 <button
//                   onClick={handleSaveLevel}
//                   disabled={isSaving || !selectedLevel}
//                   className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isSaving ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Save Configuration
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         // Time Interval Configuration Tab
//         <div>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full mr-4">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">Skill Time Interval Configuration</h2>
//                 <p className="text-sm text-gray-600 mt-1">Set time intervals required to complete each skill</p>
//               </div>
//             </div>
            
//             {/* Enable/Disable Toggle */}
//             <div className="flex items-center space-x-3">
//               <span className={`text-sm font-semibold ${isIntervalEnabled ? 'text-green-600' : 'text-gray-500'}`}>
//                 {isIntervalEnabled ? 'Enabled' : 'Disabled'}
//               </span>
//               <button
//                 onClick={handleToggleGlobalStatus}
//                 className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
//                   isIntervalEnabled ? 'bg-green-600' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
//                     isIntervalEnabled ? 'translate-x-7' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {!isIntervalEnabled && (
//             <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl mb-6">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-yellow-800 font-medium">
//                   Time interval checking is currently disabled. Enable it to enforce time intervals for skills.
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-6">
//             {/* Configuration Form */}
//             <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
//               <h3 className="text-lg font-bold text-gray-800 mb-4">Add/Update Time Interval</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Department */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Department</label>
//                   <select
//                     value={selectedDepartment || ''}
//                     onChange={(e) => {
//                       setSelectedDepartment(e.target.value ? Number(e.target.value) : null);
//                       setSelectedLine(null);
//                       setSelectedSubline(null);
//                       setSelectedStation(null);
//                     }}
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                   >
//                     <option value="">All Departments</option>
//                     {departments.map((dept) => (
//                       <option key={dept.id} value={dept.id}>
//                         {dept.department_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Line */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Line</label>
//                   <select
//                     value={selectedLine || ''}
//                     onChange={(e) => {
//                       setSelectedLine(e.target.value ? Number(e.target.value) : null);
//                       setSelectedSubline(null);
//                       setSelectedStation(null);
//                     }}
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                     disabled={!selectedDepartment}
//                   >
//                     <option value="">All Lines</option>
//                     {getAvailableLines().map((line) => (
//                       <option key={line.id} value={line.id}>
//                         {line.line_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Subline */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Subline</label>
//                   <select
//                     value={selectedSubline || ''}
//                     onChange={(e) => {
//                       setSelectedSubline(e.target.value ? Number(e.target.value) : null);
//                       setSelectedStation(null);
//                     }}
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                     disabled={!selectedLine}
//                   >
//                     <option value="">All Sublines</option>
//                     {getAvailableSublines().map((subline) => (
//                       <option key={subline.id} value={subline.id}>
//                         {subline.subline_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Station/Skill */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Station/Skill *</label>
//                   <select
//                     value={selectedStation || ''}
//                     onChange={(e) => setSelectedStation(e.target.value ? Number(e.target.value) : null)}
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                   >
//                     <option value="">Select station/skill...</option>
//                     {getAvailableStations().map((station) => (
//                       <option key={station.id} value={station.id}>
//                         {station.station_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Time Interval */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Time Interval (Months) *</label>
//                   <input
//                     type="number"
//                     min="1"
//                     value={timeIntervalMonths}
//                     onChange={(e) => setTimeIntervalMonths(Number(e.target.value))}
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                   />
//                 </div>

//                 {/* Updated By */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-semibold text-gray-700">Your Name (optional)</label>
//                   <input
//                     type="text"
//                     value={intervalUpdatedBy}
//                     onChange={(e) => setIntervalUpdatedBy(e.target.value)}
//                     placeholder="Enter your name..."
//                     className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={handleSaveInterval}
//                   disabled={isSaving || !selectedStation}
//                   className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isSaving ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                       Save Time Interval
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Saved Intervals Table */}
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
//                 <h3 className="text-lg font-bold text-white">Configured Time Intervals</h3>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Line</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subline</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Station/Skill</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interval (Months)</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
//                       <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {timeIntervals.length > 0 ? (
//                       timeIntervals.map((interval) => (
//                         <tr key={interval.id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {interval.department_name || 'All Departments'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {interval.line_name || 'All Lines'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {interval.subline_name || 'All Sublines'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {interval.station_name}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
//                               {interval.time_interval_months} {interval.time_interval_months === 1 ? 'month' : 'months'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <span className={`px-3 py-1 rounded-full font-semibold ${
//                               interval.is_enabled 
//                                 ? 'bg-green-100 text-green-800' 
//                                 : 'bg-gray-100 text-gray-800'
//                             }`}>
//                               {interval.is_enabled ? 'Active' : 'Inactive'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm">
//                             <button
//                               onClick={() => handleDeleteInterval(interval.id)}
//                               className="text-red-600 hover:text-red-800 font-medium transition-colors"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={7} className="px-6 py-12 text-center">
//                           <div className="flex flex-col items-center">
//                             <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <p className="text-gray-500 font-medium">No time intervals configured yet</p>
//                             <p className="text-gray-400 text-sm mt-1">Add your first time interval above</p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MinimumLevelConfig;

// =====================================================================================================================
// import { useState, useEffect } from 'react';

// interface Level {
//   level_id: number;
//   level_name: string;
// }

// interface Config {
//   id: number;
//   minimum_level: number;
//   minimum_level_name: string;
//   updated_by: string | null;
//   created_at: string;
//   updated_at: string;
// }

// interface Station {
//   id: number;
//   station_name: string;
//   department_id?: number;
//   department_name?: string;
//   line_id?: number;
//   line_name?: string;
//   subline_id?: number;
//   subline_name?: string;
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
//   stations?: Station[];
// }

// interface DepartmentAPI {
//   department_id: number;
//   department_name: string;
//   lines?: Line[];
//   sublines?: Subline[];
//   stations?: Station[];
// }

// interface HierarchyStructure {
//   id: number;
//   department: DepartmentAPI;
// }

// interface TimeInterval {
//   id: number;
//   department: number | null;
//   department_name: string | null;
//   line: number | null;
//   line_name: string | null;
//   subline: number | null;
//   subline_name: string | null;
//   station: number | null;
//   station_name: string | null;
//   time_interval_months: number;
//   is_enabled: boolean;
//   updated_by: string | null;
//   created_at: string;
//   updated_at: string;
// }

// const API_BASE_URL = 'http://127.0.0.1:8000';

// const MinimumLevelConfig = () => {
//   const [activeTab, setActiveTab] = useState<'level' | 'interval'>('level');

//   // Level Config States
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [currentConfig, setCurrentConfig] = useState<Config | null>(null);
//   const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
//   const [updatedBy, setUpdatedBy] = useState('');

//   // Time Interval States
//   const [departments, setDepartments] = useState<DepartmentAPI[]>([]);
//   const [allHierarchies, setAllHierarchies] = useState<Map<number, HierarchyStructure>>(new Map());
//   const [selectedDepartment, setSelectedDepartment] = useState<number | string | null>(null);
//   const [selectedLine, setSelectedLine] = useState<number | null>(null);
//   const [selectedSubline, setSelectedSubline] = useState<number | null>(null);
//   const [selectedStation, setSelectedStation] = useState<number | string | null>(null);
//   const [timeIntervalMonths, setTimeIntervalMonths] = useState<number>(1);
//   const [intervalUpdatedBy, setIntervalUpdatedBy] = useState('');
//   const [timeIntervals, setTimeIntervals] = useState<TimeInterval[]>([]);
//   const [isIntervalEnabled, setIsIntervalEnabled] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Helper normalization functions
//   const normalizeStation = (raw: any, deptId?: number, lineId?: number, sublineId?: number): Station => ({
//     id: raw.station_id ?? raw.id,
//     station_name: String(raw.station_name ?? raw.name ?? `Station-${raw.station_id ?? raw.id}`).trim(),
//     department_id: deptId,
//     line_id: lineId,
//     subline_id: sublineId,
//   });

//   const normalizeSubline = (raw: any, deptId?: number, lineId?: number): Subline => ({
//     id: raw.subline_id ?? raw.id,
//     subline_name: String(raw.subline_name ?? raw.name ?? `Subline-${raw.subline_id ?? raw.id}`).trim(),
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, lineId, raw.subline_id ?? raw.id)) : [],
//   });

//   const normalizeLine = (raw: any, deptId?: number): Line => ({
//     id: raw.line_id ?? raw.id,
//     line_name: String(raw.line_name ?? raw.name ?? `Line-${raw.line_id ?? raw.id}`).trim(),
//     sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, deptId, raw.line_id ?? raw.id)) : [],
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, deptId, raw.line_id ?? raw.id)) : [],
//   });

//   const normalizeDepartment = (raw: any): DepartmentAPI => ({
//     department_id: raw.department_id ?? raw.id ?? 0,
//     department_name: String(raw.department_name ?? raw.name ?? `Dept-${raw.department_id ?? raw.id}`).trim(),
//     lines: Array.isArray(raw.lines) ? raw.lines.map((l: any) => normalizeLine(l, raw.department_id ?? raw.id)) : [],
//     sublines: Array.isArray(raw.sublines) ? raw.sublines.map((sl: any) => normalizeSubline(sl, raw.department_id ?? raw.id)) : [],
//     stations: Array.isArray(raw.stations) ? raw.stations.map((s: any) => normalizeStation(s, raw.department_id ?? raw.id)) : [],
//   });

//   const normalizeHierarchyResponse = (res: any): HierarchyStructure | null => {
//     if (!res) return null;
//     const first = Array.isArray(res) ? res[0] : res;

//     if (first && (first.department_id || first.department_name) && (first.lines || first.sublines || first.stations)) {
//       return {
//         id: first.id || 0,
//         department: normalizeDepartment(first)
//       };
//     }

//     if (first && first.department) {
//       return {
//         id: first.id || 0,
//         department: normalizeDepartment(first.department)
//       };
//     }

//     return null;
//   };

//   // API Service - Adapted from QuestionPaperManager pattern
//   const fetchHierarchy = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/hierarchy-simple/`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       if (!response.ok) throw new Error('Failed to fetch hierarchy');
//       return response.json();
//     } catch (err) {
//       console.error('Error fetching hierarchy:', err);
//       return [];
//     }
//   };

//   // Get all stations from all departments
//   const getAllStationsFromAllDepartments = (): Station[] => {
//     const allStations: Station[] = [];
    
//     departments.forEach(dept => {
//       const hierarchy = allHierarchies.get(dept.department_id);
//       const sourceDept = hierarchy?.department || dept;
      
//       // Department level stations
//       if (sourceDept.stations) {
//         sourceDept.stations.forEach(s => {
//           allStations.push({
//             ...s,
//             department_id: dept.department_id,
//             department_name: dept.department_name,
//           });
//         });
//       }
      
//       // Line level stations
//       if (sourceDept.lines) {
//         sourceDept.lines.forEach(line => {
//           if (line.stations) {
//             line.stations.forEach(s => {
//               allStations.push({
//                 ...s,
//                 department_id: dept.department_id,
//                 department_name: dept.department_name,
//                 line_id: line.id,
//                 line_name: line.line_name,
//               });
//             });
//           }
          
//           // Subline level stations
//           if (line.sublines) {
//             line.sublines.forEach(subline => {
//               if (subline.stations) {
//                 subline.stations.forEach(s => {
//                   allStations.push({
//                     ...s,
//                     department_id: dept.department_id,
//                     department_name: dept.department_name,
//                     line_id: line.id,
//                     line_name: line.line_name,
//                     subline_id: subline.id,
//                     subline_name: subline.subline_name,
//                   });
//                 });
//               }
//             });
//           }
//         });
//       }
      
//       // Department level sublines
//       if (sourceDept.sublines) {
//         sourceDept.sublines.forEach(subline => {
//           if (subline.stations) {
//             subline.stations.forEach(s => {
//               allStations.push({
//                 ...s,
//                 department_id: dept.department_id,
//                 department_name: dept.department_name,
//                 subline_id: subline.id,
//                 subline_name: subline.subline_name,
//               });
//             });
//           }
//         });
//       }
//     });
    
//     return allStations;
//   };

//   // Get available stations based on selection
//   const getAvailableStations = (): Station[] => {
//     // All departments and all stations selected
//     if (selectedDepartment === 'all') {
//       return getAllStationsFromAllDepartments();
//     }
    
//     // Single department selected
//     if (!selectedDepartment) return [];

//     const hierarchy = allHierarchies.get(selectedDepartment as number);
//     const sourceDept: DepartmentAPI | undefined =
//       hierarchy?.department || departments.find(d => d.department_id === selectedDepartment);

//     if (!sourceDept) return [];

//     if (selectedSubline) {
//       const lineSublines = (sourceDept.lines || []).flatMap(l => l.sublines || []);
//       const deptSublines = sourceDept.sublines || [];
//       const allSublines = [...lineSublines, ...deptSublines];
//       const sub = allSublines.find(s => s.id === selectedSubline);
//       return sub ? (sub.stations || []) : [];
//     }

//     if (selectedLine) {
//       const lineMatch = (sourceDept.lines || []).find(l => l.id === selectedLine);
//       if (!lineMatch) return [];
//       if (lineMatch.stations && lineMatch.stations.length > 0) return lineMatch.stations;
//       return (lineMatch.sublines || []).flatMap(sl => sl.stations || []);
//     }

//     return sourceDept.stations || [];
//   };

//   // Fetch initial data on mount
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       setIsLoading(true);
//       setError('');

//       try {
//         // Fetch levels
//         const levelsRes = await fetch(`${API_BASE_URL}/levels/`);
//         if (!levelsRes.ok) throw new Error('Failed to fetch levels');
//         const levelsData = await levelsRes.json();
//         setLevels(levelsData);

//         // Fetch current config
//         const configRes = await fetch(`${API_BASE_URL}/multiskilling-config/current/`);
//         if (configRes.ok) {
//           const configData = await configRes.json();
//           setCurrentConfig(configData);
//           setSelectedLevel(configData.minimum_level);
//         }

//         // Fetch hierarchy data and build department structure
//         const hierarchyData = await fetchHierarchy();
        
//         // Build departments from hierarchy data
//         const departmentsMap = new Map<number, DepartmentAPI>();
        
//         hierarchyData.forEach((item: any) => {
//           if (!item.structure_data?.departments) return;
          
//           item.structure_data.departments.forEach((deptData: any) => {
//             if (!deptData.id || !deptData.department_name) return;
            
//             let department = departmentsMap.get(deptData.id);
//             if (!department) {
//               department = {
//                 department_id: deptData.id,
//                 department_name: deptData.department_name,
//                 lines: [],
//                 sublines: [],
//                 stations: [],
//               };
//               departmentsMap.set(deptData.id, department);
//             }
            
//             // Add department-level stations
//             if (deptData.stations) {
//               deptData.stations.forEach((stationData: any) => {
//                 if (!department!.stations.some(s => s.id === stationData.id)) {
//                   department!.stations.push(normalizeStation(stationData, deptData.id));
//                 }
//               });
//             }
            
//             // Add lines
//             if (deptData.lines) {
//               deptData.lines.forEach((lineData: any) => {
//                 if (!lineData.id || !lineData.line_name) return;
                
//                 let line = department!.lines.find(l => l.id === lineData.id);
//                 if (!line) {
//                   line = {
//                     id: lineData.id,
//                     line_name: lineData.line_name,
//                     sublines: [],
//                     stations: [],
//                   };
//                   department!.lines.push(line);
//                 }
                
//                 // Add line-level stations
//                 if (lineData.stations) {
//                   lineData.stations.forEach((stationData: any) => {
//                     if (!line!.stations.some(s => s.id === stationData.id)) {
//                       line!.stations.push(normalizeStation(stationData, deptData.id, lineData.id));
//                     }
//                   });
//                 }
                
//                 // Add sublines
//                 if (lineData.sublines) {
//                   lineData.sublines.forEach((sublineData: any) => {
//                     if (!sublineData.id || !sublineData.subline_name) return;
                    
//                     let subline = line!.sublines.find(sl => sl.id === sublineData.id);
//                     if (!subline) {
//                       subline = {
//                         id: sublineData.id,
//                         subline_name: sublineData.subline_name,
//                         stations: [],
//                       };
//                       line!.sublines.push(subline);
//                     }
                    
//                     // Add subline-level stations
//                     if (sublineData.stations) {
//                       sublineData.stations.forEach((stationData: any) => {
//                         if (!subline!.stations.some(s => s.id === stationData.id)) {
//                           subline!.stations.push(normalizeStation(stationData, deptData.id, lineData.id, sublineData.id));
//                         }
//                       });
//                     }
//                   });
//                 }
//               });
//             }
            
//             // Add department-level sublines (if any)
//             if (deptData.sublines) {
//               deptData.sublines.forEach((sublineData: any) => {
//                 if (!sublineData.id || !sublineData.subline_name) return;
                
//                 let subline = department!.sublines!.find(sl => sl.id === sublineData.id);
//                 if (!subline) {
//                   subline = {
//                     id: sublineData.id,
//                     subline_name: sublineData.subline_name,
//                     stations: [],
//                   };
//                   department!.sublines!.push(subline);
//                 }
                
//                 // Add subline-level stations
//                 if (sublineData.stations) {
//                   sublineData.stations.forEach((stationData: any) => {
//                     if (!subline!.stations.some(s => s.id === stationData.id)) {
//                       subline!.stations.push(normalizeStation(stationData, deptData.id, undefined, sublineData.id));
//                     }
//                   });
//                 }
//               });
//             }
//           });
//         });
        
//         const depts = Array.from(departmentsMap.values());
//         setDepartments(depts);
        
//         // Store all departments in hierarchies map for consistency
//         const hierarchyMap = new Map<number, HierarchyStructure>();
//         depts.forEach(dept => {
//           hierarchyMap.set(dept.department_id, {
//             id: dept.department_id,
//             department: dept,
//           });
//         });
//         setAllHierarchies(hierarchyMap);

//         // Fetch time intervals
//         await fetchTimeIntervals();
//         await checkGlobalStatus();
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const fetchTimeIntervals = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/`);
//       if (response.ok) {
//         const data = await response.json();
//         setTimeIntervals(data);
//       }
//     } catch (err) {
//       console.error('Error fetching time intervals:', err);
//     }
//   };

//   const checkGlobalStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/check_global_status/`);
//       if (response.ok) {
//         const data = await response.json();
//         setIsIntervalEnabled(data.is_enabled);
//       }
//     } catch (err) {
//       console.error('Error checking global status:', err);
//     }
//   };

//   const handleDepartmentChange = (value: string) => {
//     if (value === 'all') {
//       setSelectedDepartment('all');
//     } else {
//       setSelectedDepartment(value ? Number(value) : null);
//     }
//     setSelectedLine(null);
//     setSelectedSubline(null);
//     setSelectedStation(null);
//   };

//   const handleSaveLevel = async () => {
//     if (!selectedLevel) {
//       setError('Please select a minimum level');
//       return;
//     }

//     setIsSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await fetch(`${API_BASE_URL}/multiskilling-config/set_minimum_level/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           minimum_level: selectedLevel,
//           updated_by: updatedBy || 'Admin'
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save configuration');
//       }

//       const result = await response.json();
//       setCurrentConfig(result.config);
//       setSuccess(result.message || 'Configuration saved successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error saving config:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save configuration');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSaveInterval = async () => {
//     // Validation for "All Stations" mode
//     if (selectedStation === 'all') {
//       if (selectedDepartment === 'all') {
//         // Apply to all stations in all departments
//         if (!confirm(`This will set ${timeIntervalMonths} month(s) interval for ALL stations across ALL departments. Continue?`)) {
//           return;
//         }
//       } else if (selectedDepartment) {
//         // Apply to all stations in selected scope
//         if (!confirm(`This will set ${timeIntervalMonths} month(s) interval for ALL stations in the selected scope. Continue?`)) {
//           return;
//         }
//       }
//     } else if (!selectedStation) {
//       setError('Please select a station/skill');
//       return;
//     }

//     if (timeIntervalMonths < 1) {
//       setError('Time interval must be at least 1 month');
//       return;
//     }

//     setIsSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       // If "All Stations" is selected, we need to save for each station
//       if (selectedStation === 'all') {
//         const stationsToUpdate = getAvailableStations();
        
//         const savePromises = stationsToUpdate.map(station => 
//           fetch(`${API_BASE_URL}/skill-time-intervals/set_interval/`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               department: station.department_id || null,
//               line: station.line_id || null,
//               subline: station.subline_id || null,
//               station: station.id,
//               time_interval_months: timeIntervalMonths,
//               is_enabled: isIntervalEnabled,
//               updated_by: intervalUpdatedBy || 'Admin'
//             }),
//           })
//         );

//         await Promise.all(savePromises);
//         setSuccess(`Time interval set for ${stationsToUpdate.length} stations successfully!`);
//       } else {
//         // Single station
//         const response = await fetch(`${API_BASE_URL}/skill-time-intervals/set_interval/`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             department: selectedDepartment === 'all' ? null : selectedDepartment,
//             line: selectedLine,
//             subline: selectedSubline,
//             station: selectedStation,
//             time_interval_months: timeIntervalMonths,
//             is_enabled: isIntervalEnabled,
//             updated_by: intervalUpdatedBy || 'Admin'
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to save time interval');
//         }

//         const result = await response.json();
//         setSuccess(result.message || 'Time interval saved successfully!');
//       }
      
//       // Reset form
//       setSelectedDepartment(null);
//       setSelectedLine(null);
//       setSelectedSubline(null);
//       setSelectedStation(null);
//       setTimeIntervalMonths(1);
      
//       // Refresh intervals
//       fetchTimeIntervals();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       console.error('Error saving interval:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save time interval');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleToggleGlobalStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/toggle_global_status/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_enabled: !isIntervalEnabled }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setIsIntervalEnabled(!isIntervalEnabled);
//         setSuccess(result.message);
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       console.error('Error toggling status:', err);
//       setError('Failed to update status');
//     }
//   };

//   const handleDeleteInterval = async (id: number) => {
//     if (!confirm('Are you sure you want to delete this time interval?')) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/skill-time-intervals/${id}/`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setSuccess('Time interval deleted successfully!');
//         fetchTimeIntervals();
//         setTimeout(() => setSuccess(''), 3000);
//       }
//     } catch (err) {
//       console.error('Error deleting interval:', err);
//       setError('Failed to delete time interval');
//     }
//   };

//   // Get available lines based on selected department
//   const getAvailableLines = () => {
//     if (!selectedDepartment || selectedDepartment === 'all') return [];
//     const hierarchy = allHierarchies.get(selectedDepartment as number);
//     const dept = hierarchy?.department || departments.find(d => d.department_id === selectedDepartment);
//     return dept?.lines || [];
//   };

//   // Get available sublines based on selected line
//   const getAvailableSublines = () => {
//     if (!selectedLine) return [];
//     const lines = getAvailableLines();
//     const line = lines.find(l => l.id === selectedLine);
    
//     if (!line) return [];
    
//     // Also include department-level sublines if no line-specific sublines exist
//     if (selectedDepartment && selectedDepartment !== 'all') {
//       const hierarchy = allHierarchies.get(selectedDepartment as number);
//       const dept = hierarchy?.department || departments.find(d => d.department_id === selectedDepartment);
//       const deptSublines = dept?.sublines || [];
//       return [...(line.sublines || []), ...deptSublines];
//     }
    
//     return line.sublines || [];
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
//           {/* Tabs */}
//           <div className="flex space-x-4 mb-6 border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('level')}
//               className={`px-6 py-3 font-semibold transition-all duration-300 ${
//                 activeTab === 'level'
//                   ? 'border-b-4 border-indigo-600 text-indigo-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 Minimum Level Configuration
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('interval')}
//               className={`px-6 py-3 font-semibold transition-all duration-300 ${
//                 activeTab === 'interval'
//                   ? 'border-b-4 border-purple-600 text-purple-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Skill Time Interval Configuration
//               </div>
//             </button>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 {error}
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 {success}
//               </div>
//             </div>
//           )}

//           {/* Tab Content */}
//           {activeTab === 'level' ? (
//             // Level Configuration Tab
//             <div>
//               <div className="flex items-center mb-6">
//                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">MultiSkilling Configuration</h2>
//                   <p className="text-sm text-gray-600 mt-1">Set minimum skill level required for employee search</p>
//                 </div>
//               </div>

//               {currentConfig && (
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500 mb-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-semibold text-gray-700">Current Minimum Level</p>
//                       <p className="text-2xl font-bold text-blue-600 mt-1">Level {currentConfig.minimum_level_name}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-600">Last updated</p>
//                       <p className="text-sm font-medium text-gray-800">
//                         {new Date(currentConfig.updated_at).toLocaleDateString()} at{' '}
//                         {new Date(currentConfig.updated_at).toLocaleTimeString()}
//                       </p>
//                       {currentConfig.updated_by && (
//                         <p className="text-xs text-gray-500 mt-1">by {currentConfig.updated_by}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {isLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="space-y-2">
//                     <label className="flex items-center text-sm font-semibold text-gray-700">
//                       <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//                       </svg>
//                       Select Minimum Level *
//                     </label>
//                     <select
//                       value={selectedLevel || ''}
//                       onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
//                       className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium"
//                       disabled={isSaving}
//                     >
//                       <option value="">Select minimum level...</option>
//                       {levels.map((level) => (
//                         <option key={level.level_id} value={level.level_id}>
//                           Level {level.level_name}
//                         </option>
//                       ))}
//                     </select>
//                     <p className="text-sm text-gray-600 italic">
//                       Only employees with skills at or above this level will appear in search results
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="flex items-center text-sm font-semibold text-gray-700">
//                       <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Your Name (optional)
//                     </label>
//                     <input
//                       type="text"
//                       value={updatedBy}
//                       onChange={(e) => setUpdatedBy(e.target.value)}
//                       placeholder="Enter your name for tracking..."
//                       className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//                       disabled={isSaving}
//                     />
//                   </div>

//                   <div className="flex justify-end pt-4 border-t border-gray-200">
//                     <button
//                       onClick={handleSaveLevel}
//                       disabled={isSaving || !selectedLevel}
//                       className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       {isSaving ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           Save Configuration
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             // Time Interval Configuration Tab
//             <div>
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full mr-4">
//                     <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-800">Skill Time Interval Configuration</h2>
//                     <p className="text-sm text-gray-600 mt-1">Set time intervals required to complete each skill</p>
//                   </div>
//                 </div>
                
//                 {/* Enable/Disable Toggle */}
//                 <div className="flex items-center space-x-3">
//                   <span className={`text-sm font-semibold ${isIntervalEnabled ? 'text-green-600' : 'text-gray-500'}`}>
//                     {isIntervalEnabled ? 'Enabled' : 'Disabled'}
//                   </span>
//                   <button
//                     onClick={handleToggleGlobalStatus}
//                     className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
//                       isIntervalEnabled ? 'bg-green-600' : 'bg-gray-300'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
//                         isIntervalEnabled ? 'translate-x-7' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>

//               {!isIntervalEnabled && (
//                 <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl mb-6">
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                     <p className="text-yellow-800 font-medium">
//                       Time interval checking is currently disabled. Enable it to enforce time intervals for skills.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-6">
//                 {/* Configuration Form */}
//                 <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
//                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Add/Update Time Interval
//                   </h3>
                  
//                   {selectedDepartment === 'all' && (
//                     <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 mb-4 shadow-lg">
//                       <div className="flex items-center gap-3 text-white">
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <div>
//                           <h4 className="font-bold text-lg">All Departments Mode</h4>
//                           <p className="text-indigo-100 text-sm">Configuring across all departments</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Department */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                         </svg>
//                         Department *
//                       </label>
//                       <select
//                         value={selectedDepartment ?? ''}
//                         onChange={(e) => handleDepartmentChange(e.target.value)}
//                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium"
//                       >
//                         <option value="">Select Department</option>
//                         <option value="all" className="font-bold text-indigo-600">🌐 All Departments</option>
//                         {departments.map((dept) => (
//                           <option key={dept.department_id} value={dept.department_id}>
//                             {dept.department_name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Line - Hidden when All Departments selected */}
//                     {selectedDepartment !== 'all' && (
//                       <div className="space-y-2">
//                         <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                           <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                           </svg>
//                           Line
//                         </label>
//                         <select
//                           value={selectedLine ?? ''}
//                           onChange={(e) => {
//                             setSelectedLine(e.target.value ? Number(e.target.value) : null);
//                             setSelectedSubline(null);
//                             setSelectedStation(null);
//                           }}
//                           className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-300 font-medium"
//                           disabled={!selectedDepartment}
//                         >
//                           <option value="">Select Line</option>
//                           {getAvailableLines().map((line) => (
//                             <option key={line.id} value={line.id}>
//                               {line.line_name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {/* Subline - Hidden when All Departments selected */}
//                     {selectedDepartment !== 'all' && (
//                       <div className="space-y-2">
//                         <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                           <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//                           </svg>
//                           Subline
//                         </label>
//                         <select
//                           value={selectedSubline ?? ''}
//                           onChange={(e) => {
//                             setSelectedSubline(e.target.value ? Number(e.target.value) : null);
//                             setSelectedStation(null);
//                           }}
//                           className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium"
//                           disabled={!selectedLine}
//                         >
//                           <option value="">Select Subline</option>
//                           {getAvailableSublines().map((subline) => (
//                             <option key={subline.id} value={subline.id}>
//                               {subline.subline_name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {/* Station/Skill - Always shown with All Stations option */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                         Station/Skill *
//                       </label>
//                       <select
//                         value={selectedStation ?? ''}
//                         onChange={(e) => setSelectedStation(e.target.value === 'all' ? 'all' : (e.target.value ? Number(e.target.value) : null))}
//                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium"
//                       >
//                         <option value="">Select station/skill...</option>
//                         <option value="all" className="font-bold text-indigo-600">⭐ All Stations ({getAvailableStations().length} stations)</option>
//                         {getAvailableStations().map((station) => (
//                           <option key={station.id} value={station.id}>
//                             {station.station_name}
//                             {selectedDepartment === 'all' && station.department_name && ` - ${station.department_name}`}
//                             {selectedDepartment === 'all' && station.line_name && ` > ${station.line_name}`}
//                             {selectedDepartment === 'all' && station.subline_name && ` > ${station.subline_name}`}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Time Interval */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         Time Interval (Months) *
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={timeIntervalMonths}
//                         onChange={(e) => setTimeIntervalMonths(Number(e.target.value))}
//                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition-all duration-300 font-medium"
//                       />
//                     </div>

//                     {/* Updated By */}
//                     <div className="space-y-2">
//                       <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                         Your Name (optional)
//                       </label>
//                       <input
//                         type="text"
//                         value={intervalUpdatedBy}
//                         onChange={(e) => setIntervalUpdatedBy(e.target.value)}
//                         placeholder="Enter your name..."
//                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//                       />
//                     </div>
//                   </div>

//                   {selectedStation === 'all' && (
//                     <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-xl">
//                       <div className="flex items-center">
//                         <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                         </svg>
//                         <p className="text-blue-800 font-medium">
//                           You've selected "All Stations" - This will set {timeIntervalMonths} month(s) interval for {getAvailableStations().length} stations.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="mt-6 flex justify-end">
//                     <button
//                       onClick={handleSaveInterval}
//                       disabled={isSaving || !selectedStation}
//                       className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                     >
//                       {isSaving ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                           </svg>
//                           {selectedStation === 'all' ? `Save for ${getAvailableStations().length} Stations` : 'Save Time Interval'}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Saved Intervals Table */}
//                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
//                   <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
//                     <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       Configured Time Intervals
//                     </h3>
//                   </div>
                  
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Line</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subline</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Station/Skill</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Interval (Months)</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
//                           <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {timeIntervals.length > 0 ? (
//                           timeIntervals.map((interval) => (
//                             <tr key={interval.id} className="hover:bg-gray-50 transition-colors">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {interval.department_name || 'All Departments'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {interval.line_name || '-'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 {interval.subline_name || '-'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {interval.station_name || 'All Stations'}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                 <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
//                                   {interval.time_interval_months} {interval.time_interval_months === 1 ? 'month' : 'months'}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <span className={`px-3 py-1 rounded-full font-semibold ${
//                                   interval.is_enabled 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : 'bg-gray-100 text-gray-800'
//                                 }`}>
//                                   {interval.is_enabled ? 'Active' : 'Inactive'}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                 <button
//                                   onClick={() => handleDeleteInterval(interval.id)}
//                                   className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1"
//                                 >
//                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                   </svg>
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={7} className="px-6 py-12 text-center">
//                               <div className="flex flex-col items-center">
//                                 <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <p className="text-gray-500 font-medium">No time intervals configured yet</p>
//                                 <p className="text-gray-400 text-sm mt-1">Add your first time interval above</p>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MinimumLevelConfig;

import { useState, useEffect } from 'react';

interface Level {
  level_id: number;
  level_name: string;
}

interface Config {
  id: number;
  minimum_level: number;
  minimum_level_name: string;
  minimum_level_value: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

interface TimeIntervalConfig {
  id: number;
  time_interval_days: number;
  is_enabled: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

const MinimumLevelConfig = () => {
  const [activeTab, setActiveTab] = useState<'level' | 'interval'>('level');

  // Level Config States
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentConfig, setCurrentConfig] = useState<Config | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [updatedBy, setUpdatedBy] = useState('');

  // Time Interval States
  const [timeIntervalDays, setTimeIntervalDays] = useState<number>(30);
  const [intervalUpdatedBy, setIntervalUpdatedBy] = useState('');
  const [currentIntervalConfig, setCurrentIntervalConfig] = useState<TimeIntervalConfig | null>(null);
  const [isIntervalEnabled, setIsIntervalEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch levels
        const levelsRes = await fetch(`${API_BASE_URL}/levels/`);
        if (!levelsRes.ok) throw new Error('Failed to fetch levels');
        const levelsData = await levelsRes.json();
        setLevels(levelsData);

        // Fetch current level config
        const configRes = await fetch(`${API_BASE_URL}/multiskilling-config/current/`);
        if (configRes.ok) {
          const configData = await configRes.json();
          setCurrentConfig(configData);
          setSelectedLevel(configData.minimum_level);
        }

        // Fetch current time interval config
        const intervalRes = await fetch(`${API_BASE_URL}/global-skill-time-interval/current/`);
        if (intervalRes.ok) {
          const intervalData = await intervalRes.json();
          setCurrentIntervalConfig(intervalData);
          setTimeIntervalDays(intervalData.time_interval_days);
          setIsIntervalEnabled(intervalData.is_enabled);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSaveLevel = async () => {
    if (!selectedLevel) {
      setError('Please select a minimum level');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/multiskilling-config/set_minimum_level/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minimum_level: selectedLevel,
          updated_by: updatedBy || 'Admin'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      const result = await response.json();
      setCurrentConfig(result.config);
      setSuccess(result.message || 'Configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving config:', err);
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveInterval = async () => {
    if (timeIntervalDays < 1) {
      setError('Time interval must be at least 1 day');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/global-skill-time-interval/set_interval/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time_interval_days: timeIntervalDays,
          is_enabled: isIntervalEnabled,
          updated_by: intervalUpdatedBy || 'Admin'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save time interval');
      }

      const result = await response.json();
      setCurrentIntervalConfig(result.config);
      setSuccess(result.message || 'Time interval saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving interval:', err);
      setError(err instanceof Error ? err.message : 'Failed to save time interval');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleIntervalStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/global-skill-time-interval/toggle_status/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_enabled: !isIntervalEnabled,
          updated_by: intervalUpdatedBy || 'System'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsIntervalEnabled(!isIntervalEnabled);
        setCurrentIntervalConfig(result.config);
        setSuccess(result.message);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      setError('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('level')}
              className={`px-8 py-4 font-bold text-lg transition-all duration-300 ${
                activeTab === 'level'
                  ? 'border-b-4 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Minimum Level Configuration
              </div>
            </button>
            <button
              onClick={() => setActiveTab('interval')}
              className={`px-8 py-4 font-bold text-lg transition-all duration-300 ${
                activeTab === 'interval'
                  ? 'border-b-4 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Global Time Interval
              </div>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-base">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-5 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-base">{success}</span>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'level' ? (
            // Level Configuration Tab
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">MultiSkilling Configuration</h2>
                  <p className="text-base text-gray-600 mt-1">Set minimum skill level required for employee search</p>
                </div>
              </div>

              {currentConfig && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-gray-700">Current Minimum Level</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{currentConfig.minimum_level_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last updated</p>
                      <p className="text-base font-medium text-gray-800">
                        {new Date(currentConfig.updated_at).toLocaleDateString()} at{' '}
                        {new Date(currentConfig.updated_at).toLocaleTimeString()}
                      </p>
                      {currentConfig.updated_by && (
                        <p className="text-sm text-gray-500 mt-1">by {currentConfig.updated_by}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center text-base font-semibold text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Select Minimum Level *
                    </label>
                    <select
                      value={selectedLevel || ''}
                      onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
                      className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium text-base"
                      disabled={isSaving}
                    >
                      <option value="">Select minimum level...</option>
                      {levels.map((level) => (
                        <option key={level.level_id} value={level.level_id}>
                          {level.level_name}
                        </option>
                      ))}
                    </select>
                    <p className="text-base text-gray-600 italic">
                      Only employees with skills at or above this level will appear in search results
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center text-base font-semibold text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      value={updatedBy}
                      onChange={(e) => setUpdatedBy(e.target.value)}
                      placeholder="Enter your name for tracking..."
                      className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium text-base"
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveLevel}
                      disabled={isSaving || !selectedLevel}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Configuration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Time Interval Configuration Tab
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Global Time Interval</h2>
                    <p className="text-base text-gray-600 mt-1">Set universal time interval for all skill assignments</p>
                  </div>
                </div>
                
                {/* Enable/Disable Toggle */}
                <div className="flex items-center space-x-4">
                  <span className={`text-base font-bold ${isIntervalEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                    {isIntervalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    onClick={handleToggleIntervalStatus}
                    className={`relative inline-flex h-10 w-18 items-center rounded-full transition-colors duration-300 ${
                      isIntervalEnabled ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        isIntervalEnabled ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {!isIntervalEnabled && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-xl mb-6">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-yellow-800 font-medium text-base">
                      Time interval checking is currently disabled. Enable it to enforce time intervals for skill assignments.
                    </p>
                  </div>
                </div>
              )}

              {currentIntervalConfig && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-gray-700">Current Time Interval</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">{currentIntervalConfig.time_interval_days} Days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Last updated</p>
                      <p className="text-base font-medium text-gray-800">
                        {new Date(currentIntervalConfig.updated_at).toLocaleDateString()} at{' '}
                        {new Date(currentIntervalConfig.updated_at).toLocaleTimeString()}
                      </p>
                      {currentIntervalConfig.updated_by && (
                        <p className="text-sm text-gray-500 mt-1">by {currentIntervalConfig.updated_by}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Explanation Card */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-xl">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-blue-800 font-bold text-base mb-2">How it works:</p>
                      <p className="text-blue-700 text-base">
                        This setting applies a universal time interval for ALL skill assignments. After completing any skill, 
                        employees must wait the specified number of days before being assigned a new skill. This helps ensure 
                        adequate training time and prevents skill assignment overload.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Time Interval Input */}
                <div className="space-y-3">
                  <label className="flex items-center text-base font-semibold text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Time Interval (Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={timeIntervalDays}
                    onChange={(e) => setTimeIntervalDays(Number(e.target.value))}
                    className="w-full p-5 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-300 focus:border-pink-500 transition-all duration-300 font-medium text-xl"
                    disabled={isSaving}
                  />
                  <p className="text-base text-gray-600 italic">
                    Number of days employees must wait after completing a skill before being assigned another
                  </p>
                </div>

                {/* Updated By */}
                <div className="space-y-3">
                  <label className="flex items-center text-base font-semibold text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={intervalUpdatedBy}
                    onChange={(e) => setIntervalUpdatedBy(e.target.value)}
                    placeholder="Enter your name for tracking..."
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium text-base"
                    disabled={isSaving}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveInterval}
                    disabled={isSaving || timeIntervalDays < 1}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Time Interval
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimumLevelConfig;