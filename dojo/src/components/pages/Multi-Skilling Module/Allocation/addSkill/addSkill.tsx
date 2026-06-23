// import { useState, useEffect } from "react";

// interface Employee {
//   emp_id: string;
//   first_name: string;
//   last_name: string;
//   department: string | null;
//   date_of_joining: string;
//   skills: any[];
// }

// interface Department {
//   department_id: number;
//   department_name: string;
// }

// interface Station {
//   station_id: number;
//   station_name: string;
// }

// interface Level {
//   level_id: number;
//   level_name: string;
// }

// interface HierarchyDepartment {
//   department_id: number;
//   department_name: string;
//   lines: {
//     line_id: number;
//     line_name: string;
//     sublines: {
//       subline_id: number;
//       subline_name: string;
//       stations: Station[];
//     }[];
//     stations: Station[];
//   }[];
//   sublines: {
//     subline_id: number;
//     subline_name: string;
//     stations: Station[];
//   }[];
//   stations: Station[];
// }

// interface AddSkillProps {
//   employeeID: string;
//   employee: Employee;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const AddSkill = ({ employeeID, employee }: AddSkillProps) => {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     departmentId: null as number | null,
//     stationId: null as number | null,
//     skillLevel: null as number | null,
//     startDate: "",
//     remarks: "",
//   });

//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [filteredStations, setFilteredStations] = useState<Station[]>([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch initial data when form is shown
//   useEffect(() => {
//     if (!showForm) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       setError("");

//       try {
//         const [levelsRes, departmentsRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/levels/`),
//           fetch(`${API_BASE_URL}/departments/`),
//         ]);

//         if (!levelsRes.ok || !departmentsRes.ok) {
//           throw new Error("Failed to fetch required data");
//         }

//         const [levelsData, departmentsData] = await Promise.all([
//           levelsRes.json(),
//           departmentsRes.json(),
//         ]);

//         console.log("📋 Levels:", levelsData);
//         console.log("🏢 Departments:", departmentsData);

//         setLevels(levelsData);
//         setDepartments(departmentsData);
//       } catch (err) {
//         console.error("❌ Fetch Error:", err);
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [showForm]);

//   // Fetch stations when department changes
//   useEffect(() => {
//     if (!formData.departmentId) {
//       setFilteredStations([]);
//       return;
//     }

//     const fetchDepartmentStations = async () => {
//       try {
//         const response = await fetch(
//           `${API_BASE_URL}/hierarchy/by-department/?department_id=${formData.departmentId}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch department hierarchy");
//         }

//         const hierarchyData: HierarchyDepartment = await response.json();
//         console.log("🏗️ Department hierarchy:", hierarchyData);

//         const allStations: Station[] = [];

//         if (hierarchyData.stations) {
//           allStations.push(...hierarchyData.stations);
//         }

//         if (hierarchyData.sublines) {
//           hierarchyData.sublines.forEach((subline) => {
//             if (subline.stations) {
//               allStations.push(...subline.stations);
//             }
//           });
//         }

//         if (hierarchyData.lines) {
//           hierarchyData.lines.forEach((line) => {
//             if (line.stations) {
//               allStations.push(...line.stations);
//             }
//             if (line.sublines) {
//               line.sublines.forEach((subline) => {
//                 if (subline.stations) {
//                   allStations.push(...subline.stations);
//                 }
//               });
//             }
//           });
//         }

//         const uniqueStations = allStations.filter(
//           (station, index, self) =>
//             index === self.findIndex((s) => s.station_id === station.station_id)
//         );

//         setFilteredStations(uniqueStations);
//         console.log(
//           "🔍 Filtered stations for department",
//           formData.departmentId,
//           ":",
//           uniqueStations
//         );
//       } catch (err) {
//         console.error("❌ Error fetching department stations:", err);
//         setError("Failed to load stations for selected department");
//         setFilteredStations([]);
//       }
//     };

//     fetchDepartmentStations();
//   }, [formData.departmentId]);

//   const handleChange = (field: string, value: string | number | null) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//       ...(field === "departmentId" ? { stationId: null } : {}),
//     }));
//   };

//   const handleSave = async () => {
//     const { departmentId, stationId, skillLevel, startDate } = formData;

//     if (!departmentId || !stationId || !skillLevel || !startDate) {
//       setError("Please fill all required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     setError("");

//     try {
//       console.log("💾 Saving skill with data:", {
//         employee: employeeID,
//         department: departmentId,
//         station: stationId,
//         skill_level: skillLevel,
//         start_date: startDate,
//         remarks: formData.remarks,
//         status: "scheduled",
//       });

//       const response = await fetch(`${API_BASE_URL}/multiskilling/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           employee: employeeID,
//           department: departmentId,
//           station: stationId,
//           skill_level: skillLevel,
//           start_date: startDate,
//           remarks: formData.remarks,
//           status: "scheduled",
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("❌ Save error:", errorData);
//         throw new Error(errorData.detail || "Failed to save skill");
//       }

//       const result = await response.json();
//       console.log("✅ Save success:", result);

//       setSuccess("Skill added successfully!");
//       resetForm();
//     } catch (err) {
//       console.error("❌ Save error:", err);
//       setError(err instanceof Error ? err.message : "Failed to save skill");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       departmentId: null,
//       stationId: null,
//       skillLevel: "",
//       startDate: "",
//       remarks: "",
//     });
//     setShowForm(false);
//     setTimeout(() => setSuccess(""), 3000);
//   };

//   const getSelectedDepartmentName = () => {
//     if (!formData.departmentId) return "";
//     const dept = departments.find(
//       (d) => d.department_id === formData.departmentId
//     );
//     return dept ? dept.department_name : "";
//   };

//   const getSelectedStationName = () => {
//     if (!formData.stationId) return "";
//     const station = filteredStations.find(
//       (s) => s.station_id === formData.stationId
//     );
//     return station ? station.station_name : "";
//   };

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
//       {!showForm ? (
//         <div className="p-8 text-center">
//           <div className="mb-4">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Ready to Add a New Skill?
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Expand {employee.first_name}'s capabilities with new skill
//               allocations
//             </p>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//             Add New Skill
//           </button>
//         </div>
//       ) : (
//         <div className="p-8">
//           <div className="mb-6">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-purple-500 to-red-600 p-2 rounded-full mr-3">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800">
//                 Skill Allocation Form
//               </h3>
//             </div>
//             <p className="text-gray-600 mt-2 ml-10">
//               Assign a new skill to {employee.first_name} {employee.last_name}
//             </p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
//               <p>{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
//               <p>{success}</p>
//             </div>
//           )}

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {/* Department Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-blue-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                     />
//                   </svg>
//                   Department *
//                 </label>
//                 <select
//                   value={formData.departmentId || ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "departmentId",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//                   required
//                 >
//                   <option value="">Select department...</option>
//                   {departments.map((dept) => (
//                     <option key={dept.department_id} value={dept.department_id}>
//                       {dept.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Station Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-purple-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                   Station (Skill) *
//                 </label>
//                 <select
//                   value={formData.stationId || ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "stationId",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium"
//                   required
//                   disabled={!formData.departmentId}
//                 >
//                   <option value="">Select station...</option>
//                   {filteredStations.map((station) => (
//                     <option key={station.station_id} value={station.station_id}>
//                       {station.station_name}
//                     </option>
//                   ))}
//                 </select>
//                 {!formData.departmentId && (
//                   <p className="text-sm text-gray-500 italic">
//                     Please select a department first
//                   </p>
//                 )}
//                 {formData.departmentId && filteredStations.length === 0 && (
//                   <p className="text-sm text-orange-600 italic">
//                     No stations found for this department
//                   </p>
//                 )}
//               </div>

//               {/* Skill Level Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-orange-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                     />
//                   </svg>
//                   Target Skill Level *
//                 </label>
//                 {/* <select
//                   value={formData.skillLevel}
//                   onChange={(e) => handleChange('skillLevel', Number(e.target.value))}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium"
//                   required
//                 >
//                   <option value="">Select target level...</option>
//                   {levels.map((level) => (
//                     <option key={level.level_id} value={level.level_name}>
//                       {level.level_name}
//                     </option>
//                   ))}
//                 </select> */}
//                 <select
//                   value={formData.skillLevel ?? ""} // if null, show empty
//                   onChange={(e) =>
//                     handleChange(
//                       "skillLevel",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium"
//                   required
//                 >
//                   <option value="">Select target level...</option>
//                   {levels.map((level) => (
//                     <option key={level.level_id} value={level.level_id}>
//                       {level.level_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Start Date */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-red-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Start Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => handleChange("startDate", e.target.value)}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-300 focus:border-red-500 transition-all duration-300 font-medium"
//                   required
//                 />
//               </div>

//               {/* Remarks */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-indigo-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                     />
//                   </svg>
//                   Remarks (optional)
//                 </label>
//                 <textarea
//                   placeholder="Add any additional remarks, requirements, or special instructions..."
//                   value={formData.remarks}
//                   onChange={(e) => handleChange("remarks", e.target.value)}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium resize-none"
//                   rows={4}
//                 />
//               </div>

//               {/* Summary Section */}
//               {(formData.departmentId ||
//                 formData.stationId ||
//                 formData.skillLevel) && (
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500">
//                   <h4 className="font-semibold text-gray-800 mb-2">
//                     Assignment Summary:
//                   </h4>
//                   <div className="space-y-1 text-sm text-gray-700">
//                     <p>
//                       <span className="font-medium">Employee:</span>{" "}
//                       {employee.first_name} {employee.last_name} (
//                       {employee.emp_id})
//                     </p>
//                     {formData.departmentId && (
//                       <p>
//                         <span className="font-medium">Department:</span>{" "}
//                         {getSelectedDepartmentName()}
//                       </p>
//                     )}
//                     {formData.stationId && (
//                       <p>
//                         <span className="font-medium">Station:</span>{" "}
//                         {getSelectedStationName()}
//                       </p>
//                     )}
//                     {formData.skillLevel && (
//                       <p>
//                         <span className="font-medium">Target Level:</span>{" "}
//                         {formData.skillLevel}
//                       </p>
//                     )}
//                     {formData.startDate && (
//                       <p>
//                         <span className="font-medium">Start Date:</span>{" "}
//                         {new Date(formData.startDate).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={resetForm}
//                   disabled={isSubmitting}
//                   className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
//                 >
//                   <svg
//                     className="w-4 h-4 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={
//                     isSubmitting ||
//                     isLoading ||
//                     !formData.departmentId ||
//                     !formData.stationId ||
//                     !formData.skillLevel ||
//                     !formData.startDate
//                   }
//                   className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                       Save Allocation
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddSkill;

// =======================================================================================================
// import { useState, useEffect } from "react";

// interface Employee {
//   emp_id: string;
//   first_name: string;
//   last_name: string;
//   department: string | null;
//   date_of_joining: string;
//   skills: any[];
// }

// interface Department {
//   department_id: number;
//   department_name: string;
// }

// interface Station {
//   station_id: number;
//   station_name: string;
// }

// interface Level {
//   level_id: number;
//   level_name: string;
// }

// interface HierarchyDepartment {
//   department_id: number;
//   department_name: string;
//   lines: {
//     line_id: number;
//     line_name: string;
//     sublines: {
//       subline_id: number;
//       subline_name: string;
//       stations: Station[];
//     }[];
//     stations: Station[];
//   }[];
//   sublines: {
//     subline_id: number;
//     subline_name: string;
//     stations: Station[];
//   }[];
//   stations: Station[];
// }

// interface AddSkillProps {
//   employeeID: string;
//   employee: Employee;
// }

// const API_BASE_URL = "http://127.0.0.1:8000";

// const AddSkill = ({ employeeID, employee }: AddSkillProps) => {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     departmentId: null as number | null,
//     stationId: null as number | null,
//     skillLevel: null as number | null,
//     startDate: "",
//     remarks: "",
//   });

//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [levels, setLevels] = useState<Level[]>([]);
//   const [filteredStations, setFilteredStations] = useState<Station[]>([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [eligibilityWarning, setEligibilityWarning] = useState("");

//   // Fetch initial data when form is shown
//   useEffect(() => {
//     if (!showForm) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       setError("");

//       try {
//         const [levelsRes, departmentsRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/levels/`),
//           fetch(`${API_BASE_URL}/departments/`),
//         ]);

//         if (!levelsRes.ok || !departmentsRes.ok) {
//           throw new Error("Failed to fetch required data");
//         }

//         const [levelsData, departmentsData] = await Promise.all([
//           levelsRes.json(),
//           departmentsRes.json(),
//         ]);

//         setLevels(levelsData);
//         setDepartments(departmentsData);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [showForm]);

//   // Check eligibility when form is opened
//   useEffect(() => {
//     if (!showForm) return;

//     const checkEligibility = async () => {
//       setIsCheckingEligibility(true);
//       setEligibilityWarning("");

//       try {
//         const response = await fetch(`${API_BASE_URL}/check-skill-eligibility/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             employee_id: employeeID,
//           }),
//         });

//         if (response.ok) {
//           const result = await response.json();
          
//           if (!result.eligible && result.blocking_skills && result.blocking_skills.length > 0) {
//             const blockingSkill = result.blocking_skills[0];
//             setEligibilityWarning(
//               `⚠️ ${result.message} (Last skill: ${blockingSkill.station_name} completed on ${new Date(blockingSkill.completion_date).toLocaleDateString()}. Next eligible: ${new Date(blockingSkill.next_eligible_date).toLocaleDateString()})`
//             );
//           }
//         }
//       } catch (err) {
//         console.error("Eligibility check error:", err);
//       } finally {
//         setIsCheckingEligibility(false);
//       }
//     };

//     checkEligibility();
//   }, [showForm, employeeID]);

//   // Fetch stations when department changes
//   useEffect(() => {
//     if (!formData.departmentId) {
//       setFilteredStations([]);
//       return;
//     }

//     const fetchDepartmentStations = async () => {
//       try {
//         const response = await fetch(
//           `${API_BASE_URL}/hierarchy/by-department/?department_id=${formData.departmentId}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch department hierarchy");
//         }

//         const hierarchyData: HierarchyDepartment = await response.json();

//         const allStations: Station[] = [];

//         if (hierarchyData.stations) {
//           allStations.push(...hierarchyData.stations);
//         }

//         if (hierarchyData.sublines) {
//           hierarchyData.sublines.forEach((subline) => {
//             if (subline.stations) {
//               allStations.push(...subline.stations);
//             }
//           });
//         }

//         if (hierarchyData.lines) {
//           hierarchyData.lines.forEach((line) => {
//             if (line.stations) {
//               allStations.push(...line.stations);
//             }
//             if (line.sublines) {
//               line.sublines.forEach((subline) => {
//                 if (subline.stations) {
//                   allStations.push(...subline.stations);
//                 }
//               });
//             }
//           });
//         }

//         const uniqueStations = allStations.filter(
//           (station, index, self) =>
//             index === self.findIndex((s) => s.station_id === station.station_id)
//         );

//         setFilteredStations(uniqueStations);
//       } catch (err) {
//         console.error("Error fetching department stations:", err);
//         setError("Failed to load stations for selected department");
//         setFilteredStations([]);
//       }
//     };

//     fetchDepartmentStations();
//   }, [formData.departmentId]);

//   const handleChange = (field: string, value: string | number | null) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//       ...(field === "departmentId" ? { stationId: null } : {}),
//     }));
//   };

//   const handleSave = async () => {
//     const { departmentId, stationId, skillLevel, startDate } = formData;

//     if (!departmentId || !stationId || !skillLevel || !startDate) {
//       setError("Please fill all required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/multiskilling/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           employee: employeeID,
//           department: departmentId,
//           station: stationId,
//           skill_level: skillLevel,
//           start_date: startDate,
//           remarks: formData.remarks,
//           status: "scheduled",
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
        
//         // Handle eligibility errors
//         if (errorData.error && errorData.blocking_skills) {
//           const blockingSkill = errorData.blocking_skills[0];
//           throw new Error(
//             `${errorData.error}\n\nLast completed skill: ${blockingSkill.station_name} (${blockingSkill.level_name})\nCompleted on: ${new Date(blockingSkill.completion_date).toLocaleDateString()}\nNext eligible date: ${new Date(blockingSkill.next_eligible_date).toLocaleDateString()}\nDays remaining: ${blockingSkill.days_remaining} days`
//           );
//         }
        
//         throw new Error(errorData.detail || errorData.error || "Failed to save skill");
//       }

//       const result = await response.json();
//       console.log("Save success:", result);

//       setSuccess("Skill added successfully!");
//       resetForm();
//     } catch (err) {
//       console.error("Save error:", err);
//       setError(err instanceof Error ? err.message : "Failed to save skill");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       departmentId: null,
//       stationId: null,
//       skillLevel: null,
//       startDate: "",
//       remarks: "",
//     });
//     setShowForm(false);
//     setEligibilityWarning("");
//     setTimeout(() => setSuccess(""), 3000);
//   };

//   const getSelectedDepartmentName = () => {
//     if (!formData.departmentId) return "";
//     const dept = departments.find(
//       (d) => d.department_id === formData.departmentId
//     );
//     return dept ? dept.department_name : "";
//   };

//   const getSelectedStationName = () => {
//     if (!formData.stationId) return "";
//     const station = filteredStations.find(
//       (s) => s.station_id === formData.stationId
//     );
//     return station ? station.station_name : "";
//   };

//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
//       {!showForm ? (
//         <div className="p-8 text-center">
//           <div className="mb-4">
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Ready to Add a New Skill?
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Expand {employee.first_name}'s capabilities with new skill
//               allocations
//             </p>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
//           >
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//               />
//             </svg>
//             Add New Skill
//           </button>
//         </div>
//       ) : (
//         <div className="p-8">
//           <div className="mb-6">
//             <div className="flex items-center">
//               <div className="bg-gradient-to-r from-purple-500 to-red-600 p-2 rounded-full mr-3">
//                 <svg
//                   className="w-5 h-5 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800">
//                 Skill Allocation Form
//               </h3>
//             </div>
//             <p className="text-gray-600 mt-2 ml-10">
//               Assign a new skill to {employee.first_name} {employee.last_name}
//             </p>
//           </div>

//           {isCheckingEligibility && (
//             <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3"></div>
//                 <p>Checking eligibility...</p>
//               </div>
//             </div>
//           )}

//           {eligibilityWarning && (
//             <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-700">
//               <div className="flex items-start">
//                 <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-sm">{eligibilityWarning}</p>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
//               <div className="flex items-start">
//                 <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-sm whitespace-pre-line">{error}</p>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
//               <p>{success}</p>
//             </div>
//           )}

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {/* Department Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-blue-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                     />
//                   </svg>
//                   Department *
//                 </label>
//                 <select
//                   value={formData.departmentId || ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "departmentId",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium"
//                   required
//                 >
//                   <option value="">Select department...</option>
//                   {departments.map((dept) => (
//                     <option key={dept.department_id} value={dept.department_id}>
//                       {dept.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Station Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-purple-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                   Station (Skill) *
//                 </label>
//                 <select
//                   value={formData.stationId || ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "stationId",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium"
//                   required
//                   disabled={!formData.departmentId}
//                 >
//                   <option value="">Select station...</option>
//                   {filteredStations.map((station) => (
//                     <option key={station.station_id} value={station.station_id}>
//                       {station.station_name}
//                     </option>
//                   ))}
//                 </select>
//                 {!formData.departmentId && (
//                   <p className="text-sm text-gray-500 italic">
//                     Please select a department first
//                   </p>
//                 )}
//                 {formData.departmentId && filteredStations.length === 0 && (
//                   <p className="text-sm text-orange-600 italic">
//                     No stations found for this department
//                   </p>
//                 )}
//               </div>

//               {/* Skill Level Selection */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-orange-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                     />
//                   </svg>
//                   Target Skill Level *
//                 </label>
//                 <select
//                   value={formData.skillLevel ?? ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "skillLevel",
//                       e.target.value ? Number(e.target.value) : null
//                     )
//                   }
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium"
//                   required
//                 >
//                   <option value="">Select target level...</option>
//                   {levels.map((level) => (
//                     <option key={level.level_id} value={level.level_id}>
//                       {level.level_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Start Date */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-red-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Start Date *
//                 </label>
//                 <input
//                   type="date"
//                   value={formData.startDate}
//                   onChange={(e) => handleChange("startDate", e.target.value)}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-300 focus:border-red-500 transition-all duration-300 font-medium"
//                   required
//                 />
//               </div>

//               {/* Remarks */}
//               <div className="space-y-2">
//                 <label className="flex items-center text-sm font-semibold text-gray-700">
//                   <svg
//                     className="w-4 h-4 mr-2 text-indigo-500"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                     />
//                   </svg>
//                   Remarks (optional)
//                 </label>
//                 <textarea
//                   placeholder="Add any additional remarks, requirements, or special instructions..."
//                   value={formData.remarks}
//                   onChange={(e) => handleChange("remarks", e.target.value)}
//                   className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium resize-none"
//                   rows={4}
//                 />
//               </div>

//               {/* Summary Section */}
//               {(formData.departmentId ||
//                 formData.stationId ||
//                 formData.skillLevel) && (
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500">
//                   <h4 className="font-semibold text-gray-800 mb-2">
//                     Assignment Summary:
//                   </h4>
//                   <div className="space-y-1 text-sm text-gray-700">
//                     <p>
//                       <span className="font-medium">Employee:</span>{" "}
//                       {employee.first_name} {employee.last_name} (
//                       {employee.emp_id})
//                     </p>
//                     {formData.departmentId && (
//                       <p>
//                         <span className="font-medium">Department:</span>{" "}
//                         {getSelectedDepartmentName()}
//                       </p>
//                     )}
//                     {formData.stationId && (
//                       <p>
//                         <span className="font-medium">Station:</span>{" "}
//                         {getSelectedStationName()}
//                       </p>
//                     )}
//                     {formData.skillLevel && (
//                       <p>
//                         <span className="font-medium">Target Level:</span>{" "}
//                         {levels.find(l => l.level_id === formData.skillLevel)?.level_name}
//                       </p>
//                     )}
//                     {formData.startDate && (
//                       <p>
//                         <span className="font-medium">Start Date:</span>{" "}
//                         {new Date(formData.startDate).toLocaleDateString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
//                 <button
//                   onClick={resetForm}
//                   disabled={isSubmitting}
//                   className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
//                 >
//                   <svg
//                     className="w-4 h-4 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={
//                     isSubmitting ||
//                     isLoading ||
//                     !formData.departmentId ||
//                     !formData.stationId ||
//                     !formData.skillLevel ||
//                     !formData.startDate
//                   }
//                   className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                       Save Allocation
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddSkill;

import { useState, useEffect } from "react";

interface Employee {
  emp_id: string;
  first_name: string;
  last_name: string;
  department: string | null;
  date_of_joining: string;
  skills: any[];
}

interface Department {
  department_id: number;
  department_name: string;
}

interface Station {
  station_id: number;
  station_name: string;
}

interface Level {
  level_id: number;
  level_name: string;
}

interface HierarchyDepartment {
  department_id: number;
  department_name: string;
  lines: {
    line_id: number;
    line_name: string;
    sublines: {
      subline_id: number;
      subline_name: string;
      stations: Station[];
    }[];
    stations: Station[];
  }[];
  sublines: {
    subline_id: number;
    subline_name: string;
    stations: Station[];
  }[];
  stations: Station[];
}

interface AddSkillProps {
  employeeID: string;
  employee: Employee;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const AddSkill = ({ employeeID, employee }: AddSkillProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    departmentId: null as number | null,
    stationId: null as number | null,
    skillLevel: null as number | null,
    startDate: "",
    remarks: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEligible, setIsEligible] = useState(true);
  const [eligibilityMessage, setEligibilityMessage] = useState("");

  // Check eligibility when attempting to show form
  const handleAddSkillClick = async () => {
    setIsCheckingEligibility(true);
    setEligibilityMessage("");
    setIsEligible(true);

    try {
      const response = await fetch(`${API_BASE_URL}/check-skill-eligibility/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeID,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (!result.eligible && result.blocking_skills && result.blocking_skills.length > 0) {
          setIsEligible(false);
          
          let warningMessage = `${result.message}\n\n`;
          
          result.blocking_skills.forEach((skill: any, index: number) => {
            if (skill.type === 'active') {
              // Active skill blocking (scheduled or in-progress)
              warningMessage += `🔄 Active Skill in Progress:\n`;
              warningMessage += `   • Station: ${skill.station_name}\n`;
              warningMessage += `   • Level: ${skill.level_name}\n`;
              warningMessage += `   • Status: ${skill.status.toUpperCase()}\n`;
              if (skill.start_date) {
                warningMessage += `   • Start Date: ${new Date(skill.start_date).toLocaleDateString()}\n`;
              }
              warningMessage += `   ℹ️ This skill must be completed before scheduling a new one.\n`;
            } else if (skill.type === 'time_interval') {
              // Time interval restriction
              warningMessage += `⏳ Cooling Period Active:\n`;
              warningMessage += `   • Last Completed Station: ${skill.station_name}\n`;
              warningMessage += `   • Level: ${skill.level_name}\n`;
              warningMessage += `   • Completion Date: ${new Date(skill.completion_date).toLocaleDateString()}\n`;
              warningMessage += `   • Required Interval: ${skill.required_interval_days} days\n`;
              warningMessage += `   • Days Remaining: ${skill.days_remaining} days\n`;
              warningMessage += `   • Next Eligible Date: ${new Date(skill.next_eligible_date).toLocaleDateString()}\n`;
              warningMessage += `   ℹ️ Please wait until the cooling period ends.\n`;
            }
            
            if (index < result.blocking_skills.length - 1) {
              warningMessage += "\n";
            }
          });
          
          setEligibilityMessage(warningMessage);
          // Don't show form if not eligible
        } else {
          // Employee is eligible, show the form
          setShowForm(true);
        }
      } else {
        // If check fails, assume eligible and show form
        setShowForm(true);
      }
    } catch (err) {
      console.error("Eligibility check error:", err);
      // On error, show form but keep eligibility false
      setShowForm(true);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  // Fetch initial data when form is shown
  useEffect(() => {
    if (!showForm) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [levelsRes, departmentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/levels/`),
          fetch(`${API_BASE_URL}/departments/`),
        ]);

        if (!levelsRes.ok || !departmentsRes.ok) {
          throw new Error("Failed to fetch required data");
        }

        const [levelsData, departmentsData] = await Promise.all([
          levelsRes.json(),
          departmentsRes.json(),
        ]);

        setLevels(levelsData);
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showForm]);

  // Re-check eligibility when form is shown (for display purposes)
  useEffect(() => {
    if (!showForm) return;

    const recheckEligibility = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-skill-eligibility/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_id: employeeID,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          
          if (!result.eligible && result.blocking_skills && result.blocking_skills.length > 0) {
            setIsEligible(false);
            
            let warningMessage = `⚠️ ${result.message}\n\n`;
            
            result.blocking_skills.forEach((skill: any, index: number) => {
              if (skill.type === 'active') {
                warningMessage += `Active Skill: ${skill.station_name} (${skill.level_name}) - Status: ${skill.status}`;
                if (skill.start_date) {
                  warningMessage += ` - Started: ${new Date(skill.start_date).toLocaleDateString()}`;
                }
              } else if (skill.type === 'time_interval') {
                warningMessage += `Last Completed: ${skill.station_name} on ${new Date(skill.completion_date).toLocaleDateString()}. `;
                warningMessage += `Next eligible: ${new Date(skill.next_eligible_date).toLocaleDateString()} (${skill.days_remaining} days remaining)`;
              }
              
              if (index < result.blocking_skills.length - 1) {
                warningMessage += "\n";
              }
            });
            
            setEligibilityMessage(warningMessage);
          } else {
            setIsEligible(true);
            setEligibilityMessage("");
          }
        }
      } catch (err) {
        console.error("Eligibility recheck error:", err);
      }
    };

    recheckEligibility();
  }, [showForm, employeeID]);

  // Fetch stations when department changes
  useEffect(() => {
    if (!formData.departmentId) {
      setFilteredStations([]);
      return;
    }

    const fetchDepartmentStations = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/hierarchy/by-department/?department_id=${formData.departmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch department hierarchy");
        }

        const hierarchyData: HierarchyDepartment = await response.json();

        const allStations: Station[] = [];

        if (hierarchyData.stations) {
          allStations.push(...hierarchyData.stations);
        }

        if (hierarchyData.sublines) {
          hierarchyData.sublines.forEach((subline) => {
            if (subline.stations) {
              allStations.push(...subline.stations);
            }
          });
        }

        if (hierarchyData.lines) {
          hierarchyData.lines.forEach((line) => {
            if (line.stations) {
              allStations.push(...line.stations);
            }
            if (line.sublines) {
              line.sublines.forEach((subline) => {
                if (subline.stations) {
                  allStations.push(...subline.stations);
                }
              });
            }
          });
        }

        const uniqueStations = allStations.filter(
          (station, index, self) =>
            index === self.findIndex((s) => s.station_id === station.station_id)
        );

        setFilteredStations(uniqueStations);
      } catch (err) {
        console.error("Error fetching department stations:", err);
        setError("Failed to load stations for selected department");
        setFilteredStations([]);
      }
    };

    fetchDepartmentStations();
  }, [formData.departmentId]);

  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "departmentId" ? { stationId: null } : {}),
    }));
  };

  const handleSave = async () => {
    // Final eligibility check before saving
    if (!isEligible) {
      setError("This employee is not currently eligible to have a new skill scheduled. Please check the eligibility requirements above.");
      return;
    }

    const { departmentId, stationId, skillLevel, startDate } = formData;

    if (!departmentId || !stationId || !skillLevel || !startDate) {
      setError("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/multiskilling/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: employeeID,
          department: departmentId,
          station: stationId,
          skill_level: skillLevel,
          start_date: startDate,
          remarks: formData.remarks,
          status: "scheduled",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle eligibility errors with detailed messages
        if (errorData.error && errorData.blocking_skills) {
          const blockingSkills = errorData.blocking_skills;
          let errorMessage = errorData.error + "\n\n";
          
          blockingSkills.forEach((skill: any, index: number) => {
            if (skill.type === 'active') {
              errorMessage += `Active Skill ${index + 1}:\n`;
              errorMessage += `  • Station: ${skill.station_name}\n`;
              errorMessage += `  • Level: ${skill.level_name}\n`;
              errorMessage += `  • Status: ${skill.status}\n`;
              if (skill.start_date) {
                errorMessage += `  • Start Date: ${new Date(skill.start_date).toLocaleDateString()}\n`;
              }
              errorMessage += `  • Action: Please complete this skill before scheduling a new one.\n\n`;
            } else if (skill.type === 'time_interval') {
              errorMessage += `Recently Completed Skill:\n`;
              errorMessage += `  • Station: ${skill.station_name}\n`;
              errorMessage += `  • Level: ${skill.level_name}\n`;
              errorMessage += `  • Completed: ${new Date(skill.completion_date).toLocaleDateString()}\n`;
              errorMessage += `  • Days since completion: ${skill.days_since_completion}\n`;
              errorMessage += `  • Required interval: ${skill.required_interval_days} days\n`;
              errorMessage += `  • Days remaining: ${skill.days_remaining} days\n`;
              errorMessage += `  • Next eligible date: ${new Date(skill.next_eligible_date).toLocaleDateString()}\n`;
            }
          });
          
          throw new Error(errorMessage);
        }
        
        throw new Error(errorData.detail || errorData.error || "Failed to save skill");
      }

      const result = await response.json();
      console.log("Save success:", result);

      setSuccess("Skill added successfully!");
      resetForm();
    } catch (err) {
      console.error("Save error:", err);
      setError(err instanceof Error ? err.message : "Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      departmentId: null,
      stationId: null,
      skillLevel: null,
      startDate: "",
      remarks: "",
    });
    setShowForm(false);
    setEligibilityMessage("");
    setIsEligible(true);
    setTimeout(() => setSuccess(""), 3000);
  };

  const getSelectedDepartmentName = () => {
    if (!formData.departmentId) return "";
    const dept = departments.find(
      (d) => d.department_id === formData.departmentId
    );
    return dept ? dept.department_name : "";
  };

  const getSelectedStationName = () => {
    if (!formData.stationId) return "";
    const station = filteredStations.find(
      (s) => s.station_id === formData.stationId
    );
    return station ? station.station_name : "";
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
      {!showForm ? (
        <div className="p-8 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Ready to Add a New Skill?
            </h3>
            <p className="text-gray-600 mb-6">
              Expand {employee.first_name}'s capabilities with new skill
              allocations
            </p>
          </div>

          {/* Show eligibility notification if not eligible */}
          {!isEligible && eligibilityMessage && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-300 rounded-2xl text-left">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-bold text-red-800 mb-2 text-lg">⚠️ Cannot Add New Skill</h4>
                  <p className="text-sm text-red-700 whitespace-pre-line font-medium">{eligibilityMessage}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAddSkillClick}
            disabled={isCheckingEligibility}
            className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCheckingEligibility ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Checking Eligibility...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Skill
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-red-600 p-2 rounded-full mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Skill Allocation Form
              </h3>
            </div>
            <p className="text-gray-600 mt-2 ml-10">
              Assign a new skill to {employee.first_name} {employee.last_name}
            </p>
          </div>

          {!isEligible && eligibilityMessage && (
            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold mb-1">Eligibility Warning</p>
                  <p className="text-sm whitespace-pre-line">{eligibilityMessage}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm whitespace-pre-line">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{success}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Department Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Department *
                </label>
                <select
                  value={formData.departmentId || ""}
                  onChange={(e) =>
                    handleChange(
                      "departmentId",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  disabled={!isEligible}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select department...</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Station Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Station (Skill) *
                </label>
                <select
                  value={formData.stationId || ""}
                  onChange={(e) =>
                    handleChange(
                      "stationId",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={!formData.departmentId || !isEligible}
                >
                  <option value="">Select station...</option>
                  {filteredStations.map((station) => (
                    <option key={station.station_id} value={station.station_id}>
                      {station.station_name}
                    </option>
                  ))}
                </select>
                {!formData.departmentId && (
                  <p className="text-sm text-gray-500 italic">
                    Please select a department first
                  </p>
                )}
                {formData.departmentId && filteredStations.length === 0 && (
                  <p className="text-sm text-orange-600 italic">
                    No stations found for this department
                  </p>
                )}
              </div>

              {/* Skill Level Selection */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Target Skill Level *
                </label>
                <select
                  value={formData.skillLevel ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "skillLevel",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  disabled={!isEligible}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-300 focus:border-orange-500 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select target level...</option>
                  {levels.map((level) => (
                    <option key={level.level_id} value={level.level_id}>
                      {level.level_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  disabled={!isEligible}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-300 focus:border-red-500 transition-all duration-300 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg
                    className="w-4 h-4 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Remarks (optional)
                </label>
                <textarea
                  placeholder="Add any additional remarks, requirements, or special instructions..."
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  disabled={!isEligible}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 font-medium resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={4}
                />
              </div>

              {/* Summary Section */}
              {(formData.departmentId ||
                formData.stationId ||
                formData.skillLevel) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Assignment Summary:
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Employee:</span>{" "}
                      {employee.first_name} {employee.last_name} (
                      {employee.emp_id})
                    </p>
                    {formData.departmentId && (
                      <p>
                        <span className="font-medium">Department:</span>{" "}
                        {getSelectedDepartmentName()}
                      </p>
                    )}
                    {formData.stationId && (
                      <p>
                        <span className="font-medium">Station:</span>{" "}
                        {getSelectedStationName()}
                      </p>
                    )}
                    {formData.skillLevel && (
                      <p>
                        <span className="font-medium">Target Level:</span>{" "}
                        {levels.find(l => l.level_id === formData.skillLevel)?.level_name}
                      </p>
                    )}
                    {formData.startDate && (
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {new Date(formData.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    isSubmitting ||
                    isLoading ||
                    !isEligible ||
                    !formData.departmentId ||
                    !formData.stationId ||
                    !formData.skillLevel ||
                    !formData.startDate
                  }
                  className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Allocation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddSkill;