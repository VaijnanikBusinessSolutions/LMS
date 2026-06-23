// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Search, X, User } from "lucide-react";
// import { API_ENDPOINTS } from "../../constants/api";

// // ✅ Types
// interface Employee {
//   emp_id: string;
//   first_name: string;
//   last_name: string;
//   department_name: string;
// }

// interface EmployeeWithEligibility extends Employee {
//   eligible: boolean;
//   eligibilityMessage: string;
// }

// interface LocationState {
//   stationId?: number;
//   stationName?: string;
//   sublineId?: number;
//   sublineName?: string;
//   lineId?: number;
//   lineName?: string;
//   departmentId?: number;
//   departmentName?: string;
//   levelId?: number;
//   levelName?: string;
// }

// const OjtSearch: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     stationId,
//     stationName,
//     sublineId,
//     sublineName,
//     lineId,
//     lineName,
//     departmentId,
//     departmentName,
//     levelId,
//     levelName,
//   } = (location.state as LocationState) || {};

//   const [query, setQuery] = useState("");
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   // const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [filteredEmployees, setFilteredEmployees] = useState<
//     EmployeeWithEligibility[]
//   >([]);

//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
//     null
//   );
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

//   const inputRef = useRef<HTMLInputElement>(null);
//   const suggestionsRef = useRef<HTMLDivElement>(null);

//   // ✅ Fetch Employees
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch(
//           `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES}`
//         );
//         if (!response.ok)
//           throw new Error(`Error fetching employees: ${response.statusText}`);
//         const data: Employee[] = await response.json();
//         setEmployees(data);
//         setFilteredEmployees(data);
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // ✅ Debounce Search
//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     if (query.trim() && employees.length > 0) {
//   //       const filtered = employees.filter(
//   //         (emp) =>
//   //           `${emp.first_name} ${emp.last_name}`
//   //             .toLowerCase()
//   //             .includes(query.toLowerCase()) ||
//   //           emp.emp_id.toLowerCase().includes(query.toLowerCase())
//   //       );
//   //       // setFilteredEmployees(filtered.slice(0, 10));
//   //       const filteredWithEligibility = await Promise.all(
//   //         filtered.slice(0, 10).map(async (emp) => {
//   //           if (!levelId) return { ...emp, eligible: true }; // If no level → always eligible

//   //           const eligibility = await checkEligibility(emp.emp_id, levelId);
//   //           return {
//   //             ...emp,
//   //             eligible: eligibility.eligible,
//   //             eligibilityMessage: eligibility.message,
//   //           };
//   //         })
//   //       );

//   //       setFilteredEmployees(filteredWithEligibility);

//   //       setShowSuggestions(true);
//   //     } else {
//   //       setFilteredEmployees([]);
//   //       setShowSuggestions(false);
//   //     }
//   //   }, 200);
//   //   return () => clearTimeout(timer);
//   // }, [query, employees]);

//   // ✅ Debounce Search + Check Eligibility
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const runFilter = async () => {
//         if (query.trim() && employees.length > 0) {
//           const filtered = employees.filter(
//             (emp) =>
//               `${emp.first_name} ${emp.last_name}`
//                 .toLowerCase()
//                 .includes(query.toLowerCase()) ||
//               emp.emp_id.toLowerCase().includes(query.toLowerCase())
//           );

//           // When NO LEVEL → no eligibility check required
//           if (!levelId) {
//             setFilteredEmployees(filtered.slice(0, 10));
//             setShowSuggestions(true);
//             return;
//           }

//           //  With LEVEL → check eligibility for each employee
//           const filteredWithEligibility = await Promise.all(
//             filtered.slice(0, 10).map(async (emp) => {
//               const eligibility = await checkEligibility(emp.emp_id, levelId);

//               return {
//                 ...emp,
//                 eligible: eligibility.eligible,
//                 eligibilityMessage: eligibility.message,
//               };
//             })
//           );

//           setFilteredEmployees(filteredWithEligibility);
//           setShowSuggestions(true);
//         } else {
//           setFilteredEmployees([]);
//           setShowSuggestions(false);
//         }
//       };

//       runFilter(); // Run the async function
//     }, 200);

//     return () => clearTimeout(timer);
//   }, [query, employees, levelId]);

//   // ✅ Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(event.target as Node) &&
//         inputRef.current &&
//         !inputRef.current.contains(event.target as Node)
//       ) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Navigate to OJT Form
//   // const handleNavigation = (employee: Employee) => {
//   //   navigate("/OJTForm", {
//   //     state: {
//   //       ...location.state,
//   //       employeeId: employee.emp_id,
//   //       employeeName: `${employee.first_name} ${employee.last_name}`,
//   //     },
//   //   });
//   // };

//   const handleNavigation = (employee: Employee) => {
//     const { nextpage } = location.state || {};

//     if (nextpage === "tencycle") {
//       navigate("/TenCyclePage", {
//         // Replace with your actual Ten Cycle page route
//         state: {
//           ...location.state,
//           employeeId: employee.emp_id,
//           employeeName: `${employee.first_name} ${employee.last_name}`,
//         },
//       });
      
//     }else if (nextpage === "skillevaluation") {
//       navigate("/SkillEvaluationleveltwo", {
//         state: {
//           ...location.state,
//           employeeId: employee.emp_id,
//           employeeName: `${employee.first_name} ${employee.last_name}`,
//         },
//       }); }
//      else {
//       navigate("/OJTForm", {
//         state: {
//           ...location.state,
//           employeeId: employee.emp_id,
//           employeeName: `${employee.first_name} ${employee.last_name}`,
//         },
//       });
//     }
//   };

//   // new function
//   const checkEligibility = async (empId: string, targetLevel: number) => {
//     try {
//       const res = await fetch(
//         `${API_ENDPOINTS.BASE_URL}/skill-matrix/check-eligibility/?emp_id=${empId}&target_level=${targetLevel}`
//       );

//       const data = await res.json();
//       return data; // { eligible: true/false, message: "" }
//     } catch (err) {
//       console.error("Eligibility API Error:", err);
//       return { eligible: false, message: "Unable to check eligibility" };
//     }
//   };

//   // ✅ Select Employee
//   const handleEmployeeSelect = async (employee: EmployeeWithEligibility) => {
//     // 1️⃣ If levelId is provided (Level 1,2,3,4)
//     if (levelId) {
//       const eligibility = await checkEligibility(employee.emp_id, levelId);

//       if (!eligibility.eligible) {
//         alert(eligibility.message); // ❌ Not eligible → block navigation
//         return;
//       }
//     }

//     // 2️⃣ If eligible → continue
//     setSelectedEmployee(employee);
//     setQuery(`${employee.first_name} ${employee.last_name}`);
//     setShowSuggestions(false);
//     handleNavigation(employee);
//   };

//   // const handleEmployeeSelect = (employee: Employee) => {
//   //   setSelectedEmployee(employee);
//   //   setQuery(`${employee.first_name} ${employee.last_name}`);
//   //   setShowSuggestions(false);
//   //   handleNavigation(employee);
//   // };

//   const clearSearch = () => {
//     setQuery("");
//     setSelectedEmployee(null);
//     setShowSuggestions(false);
//     inputRef.current?.focus();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//       {/* ✅ Floating Shapes Background */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//         <div className="absolute w-72 h-72 bg-blue-100 rounded-full top-10 left-10 opacity-30 animate-pulse"></div>
//         <div className="absolute w-56 h-56 bg-purple-100 rounded-full bottom-20 right-20 opacity-30 animate-pulse"></div>
//       </div>

//       <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
//         {/* ✅ Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
//             <User className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold gradient-text mb-2">
//             {/* OJT Training -  */}Select Employee
//           </h1>
//           <p className="text-lg text-gray-600">
//             Search for an employee to start their session
//             {/* OJT */}
//           </p>
//         </div>

//         {/* ✅ Location Info */}
//         {(departmentName ||
//           lineName ||
//           sublineName ||
//           stationName ||
//           levelName) && (
//           <div className="glass-card rounded-xl p-6 mb-8 shadow-lg">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">
//               Training Location
//             </h2>
//             <div className="flex flex-wrap gap-2">
//               {departmentName && (
//                 <span className="px-3 py-1 bg-blue-100 rounded-full">
//                   {departmentName}
//                 </span>
//               )}
//               {lineName && (
//                 <span className="px-3 py-1 bg-purple-100 rounded-full">
//                   {lineName}
//                 </span>
//               )}
//               {sublineName && (
//                 <span className="px-3 py-1 bg-indigo-100 rounded-full">
//                   {sublineName}
//                 </span>
//               )}
//               {stationName && (
//                 <span className="px-3 py-1 bg-green-100 rounded-full">
//                   {stationName}
//                 </span>
//               )}
//               {levelName && (
//                 <span className="px-3 py-1 bg-yellow-100 rounded-full">
//                   {levelName}
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ✅ Error State */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         {/* ✅ Search Box */}
//         <div className="glass-card rounded-xl p-6 shadow-lg relative">
//           <div className="relative mb-4">
//             <input
//               ref={inputRef}
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search by name or employee ID..."
//               className="w-full px-12 py-4 glass-input rounded-xl text-lg text-gray-800 placeholder-gray-500"
//               onFocus={() => query && setShowSuggestions(true)}
//             />
//             <Search className="absolute left-4 top-4 text-gray-400" size={22} />
//             {query && (
//               <button
//                 onClick={clearSearch}
//                 className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={20} />
//               </button>
//             )}
//           </div>

//           {/* ✅ Suggestions Dropdown */}
//           {showSuggestions && (
//             <div
//               ref={suggestionsRef}
//               className="absolute w-full mt-2 bg-white rounded-xl shadow-lg max-h-80 overflow-y-auto z-50"
//             >
//               {loading ? (
//                 <div className="p-4 text-center text-gray-500">
//                   Loading employees...
//                 </div>
//               ) : filteredEmployees.length > 0 ? (
//                 filteredEmployees.map((employee) => (
//                   // <div
//                   //   key={employee.emp_id}
//                   //   className="p-4 flex justify-between items-center hover:bg-indigo-50 cursor-pointer transition"
//                   //   onClick={() => handleEmployeeSelect(employee)}
//                   // >
//                   <div
//                     key={employee.emp_id}
//                     title={employee.eligible ? "" : employee.eligibilityMessage}
//                     className={`p-4 flex flex-col gap-1 
//                     ${
//                       employee.eligible === false
//                         ? "bg-gray-100 opacity-80 cursor-not-allowed"
//                         : "hover:bg-indigo-50 cursor-pointer"
//                     }
//                     first:transition`}
//                     onClick={() => {
//                       if (employee.eligible === false) return; // disable click
//                       handleEmployeeSelect(employee);
//                     }}
//                   >
//                     <div>
//                       <div className="font-semibold text-gray-800">
//                         {employee.first_name} {employee.last_name}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {employee.emp_id}
//                       </div>
//                     </div>

//                     <span className="text-sm text-gray-400">
//                       {employee.department_name}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-4 text-center text-gray-500">
//                   No employees found
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OjtSearch;






import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, User, AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "../../constants/api";

// ✅ Types
interface Employee {
  emp_id: string;
  first_name: string;
  last_name: string;
  department_name: string;
}

interface EmployeeWithEligibility extends Employee {
  eligible: boolean;
  eligibilityMessage: string;
}

interface LocationState {
  stationId?: number;
  stationName?: string;
  sublineId?: number;
  sublineName?: string;
  lineId?: number;
  lineName?: string;
  departmentId?: number;
  departmentName?: string;
  levelId?: number;
  levelName?: string;
  nextpage?: string;
}

const OjtSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    stationId,
    stationName,
    sublineId,
    sublineName,
    lineId,
    lineName,
    departmentId,
    departmentName,
    levelId,
    levelName,
  } = (location.state as LocationState) || {};

  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithEligibility[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES}`);
        if (!response.ok) throw new Error(`Error fetching employees: ${response.statusText}`);
        const data: Employee[] = await response.json();
        setEmployees(data);
        setFilteredEmployees(data.map(emp => ({ ...emp, eligible: true, eligibilityMessage: "" })));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Debounce Search + Check Eligibility
  useEffect(() => {
    const timer = setTimeout(() => {
      const runFilter = async () => {
        if (query.trim() && employees.length > 0) {
          const filtered = employees.filter(
            (emp) =>
              `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
              emp.emp_id.toLowerCase().includes(query.toLowerCase())
          );

          if (!levelId) {
            setFilteredEmployees(filtered.slice(0, 10).map(emp => ({ ...emp, eligible: true, eligibilityMessage: "" })));
            setShowSuggestions(true);
            return;
          }

          const filteredWithEligibility = await Promise.all(
            filtered.slice(0, 10).map(async (emp) => {
              const eligibility = await checkEligibility(emp.emp_id, levelId);
              return {
                ...emp,
                eligible: eligibility.eligible,
                eligibilityMessage: eligibility.message,
              };
            })
          );

          setFilteredEmployees(filteredWithEligibility);
          setShowSuggestions(true);
        } else {
          setFilteredEmployees([]);
          setShowSuggestions(false);
        }
      };
      runFilter();
    }, 200);
    return () => clearTimeout(timer);
  }, [query, employees, levelId]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkEligibility = async (empId: string, targetLevel: number) => {
    try {
      const res = await fetch(
        `${API_ENDPOINTS.BASE_URL}/skill-matrix/check-eligibility/?emp_id=${empId}&target_level=${targetLevel}`
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Eligibility API Error:", err);
      return { eligible: false, message: "Unable to check eligibility" };
    }
  };

  const handleNavigation = (employee: Employee) => {
    const { nextpage } = location.state || {};
    const state = {
      ...location.state,
      employeeId: employee.emp_id,
      employeeName: `${employee.first_name} ${employee.last_name}`,
    };

    if (nextpage === "tencycle") navigate("/TenCyclePage", { state });
    else if (nextpage === "skillevaluation") navigate("/SkillEvaluationleveltwo", { state });
    else if (nextpage === "marua") navigate("/MaruA", { state });
    else if (nextpage === "others") navigate("/Others", { state });
    else navigate("/OJTForm", { state });
  };

  const handleEmployeeSelect = async (employee: EmployeeWithEligibility) => {
    if (levelId) {
      const eligibility = await checkEligibility(employee.emp_id, levelId);
      if (!eligibility.eligible) {
        alert(eligibility.message);
        return;
      }
    }
    setSelectedEmployee(employee);
    setQuery(`${employee.first_name} ${employee.last_name}`);
    setShowSuggestions(false);
    handleNavigation(employee);
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedEmployee(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    // Replaced generic gray-50 gradient with bg-background, but kept the gradient flow using tokens if your tailwind supports it, 
    // otherwise falling back to standard class structure but keeping your layout.
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      {/* ✅ Floating Shapes Background - KEPT EXACTLY AS REQUESTED */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute w-72 h-72 bg-blue-100/30 rounded-full top-10 left-10 animate-pulse blur-3xl"></div>
        <div className="absolute w-56 h-56 bg-purple-100/30 rounded-full bottom-20 right-20 animate-pulse blur-3xl"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* ✅ Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">
            Select Employee
          </h1>
          <p className="text-lg text-muted">
            Search for an employee to start their session
          </p>
        </div>

        {/* ✅ Location Info - Swapped 'glass-card' for tokenized classes that mimic the look */}
        {(departmentName || lineName || sublineName || stationName || levelName) && (
          <div className="bg-surface/80 backdrop-blur-md border border-border rounded-xl p-6 mb-8 shadow-lg">
            <h2 className="text-lg font-semibold text-text mb-4">
              Training Location
            </h2>
            <div className="flex flex-wrap gap-2">
              {departmentName && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm">{departmentName}</span>}
              {lineName && <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm">{lineName}</span>}
              {sublineName && <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-sm">{sublineName}</span>}
              {stationName && <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm">{stationName}</span>}
              {levelName && <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full text-sm">{levelName}</span>}
            </div>
          </div>
        )}

        {/* ✅ Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* ✅ Search Box - Replaced 'glass-card' with tokenized equivalents */}
        <div className="bg-surface/80 backdrop-blur-md border border-border rounded-xl p-6 shadow-lg relative">
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or employee ID..."
              // Replaced 'glass-input' with specific token classes
              className="w-full px-12 py-4 bg-background/50 border border-border rounded-xl text-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              onFocus={() => query && setShowSuggestions(true)}
            />
            <Search className="absolute left-4 top-4 text-muted" size={22} />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-4 text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* ✅ Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute w-full mt-2 bg-surface border border-border rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 left-0"
            >
              {loading ? (
                <div className="p-4 text-center text-muted">
                  Loading employees...
                </div>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.emp_id}
                    title={employee.eligible ? "" : employee.eligibilityMessage}
                    className={`p-4 flex flex-col gap-1 border-b border-border last:border-0 transition-colors
                    ${
                      employee.eligible === false
                        ? "bg-background/50 opacity-60 cursor-not-allowed"
                        : "hover:bg-indigo-50/50 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (employee.eligible === false) return;
                      handleEmployeeSelect(employee);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-text">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="text-sm text-muted">
                          {employee.emp_id}
                        </div>
                      </div>
                      
                      {employee.eligible === false && (
                         <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                           <AlertCircle size={12} /> Not Eligible
                         </span>
                      )}
                    </div>

                    <span className="text-sm text-muted">
                      {employee.department_name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted">
                  No employees found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OjtSearch;