


// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store"; 
// import { useLocation } from "react-router-dom"; 

// // --- Types ---
// interface AllocationRecord {
//     id: number;
//     employee_name: string;
//     employee_lastname: string;
//     employee_id_card: string;
//     supervisor_name: string;
//     supervisor_id: number; // <--- FIXED: Added this so we can filter by ID
//     department_name: string;
//     line_name: string;
//     subline_name: string;
//     station_name: string;
//     handover_date: string;
//     is_training_completed: boolean;
// }

// interface GroupedData {
//     [supervisor: string]: AllocationRecord[];
// }

// const SupervisorDashboard: React.FC = () => {
//     const [rawData, setRawData] = useState<AllocationRecord[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
    
//     // Filters
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedMonth, setSelectedMonth] = useState(""); 
//     const [sortBy, setSortBy] = useState<"date" | "name" | "dept">("date");
//     const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//     const [filterById, setFilterById] = useState<string | null>(null);
    
//     const location = useLocation(); 
//     const [expandedSupervisors, setExpandedSupervisors] = useState<Set<string>>(new Set());

//     const accessToken = useSelector((state: RootState) => state.auth.accessToken);

//     // --- 1. Fetch Data ---
//     useEffect(() => {
//         const fetchData = async () => {
//             if (!accessToken) return;
//             try {
//                 const response = await fetch("http://127.0.0.1:8000/reports/supervisor-allocations/", {
//                     headers: { "Authorization": `Bearer ${accessToken}` }
//                 });
//                 const data = await response.json();
//                 setRawData(data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching report:", error);
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [accessToken]);

//     // --- 2. Read URL Logic ---
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const idParam = params.get("supervisor_id"); // Look for "15"
        
//         if (idParam) {
//             setFilterById(idParam); 
//         } else {
//             setFilterById(null);
//         }
//     }, [location]);

//     // --- 3. Filter & Sort Logic ---
//     const processedData = useMemo(() => {
//         let data = [...rawData];

//         // --- FIXED: ACTUAL ID FILTERING LOGIC START ---
//         // If we have an ID from the URL, show ONLY that supervisor's data
//         if (filterById) {
//             data = data.filter(item => String(item.supervisor_id) === filterById);
//         }
//         // --- FIXED END ---

//         // A. Filter by Search (Text)
//         if (searchTerm) {
//             const lowerTerm = searchTerm.toLowerCase();
//             data = data.filter(item => 
//                 item.employee_name.toLowerCase().includes(lowerTerm) ||
//                 item.employee_id_card.toLowerCase().includes(lowerTerm) ||
//                 item.supervisor_name.toLowerCase().includes(lowerTerm) ||
//                 (item.line_name && item.line_name.toLowerCase().includes(lowerTerm))
//             );
//         }

//         // B. Filter by Month/Year
//         if (selectedMonth) {
//             data = data.filter(item => item.handover_date.startsWith(selectedMonth));
//         }

//         // C. Sort
//         data.sort((a, b) => {
//             let valA, valB;
//             if (sortBy === "date") {
//                 valA = new Date(a.handover_date).getTime();
//                 valB = new Date(b.handover_date).getTime();
//             } else if (sortBy === "name") {
//                 valA = a.employee_name;
//                 valB = b.employee_name;
//             } else {
//                 valA = a.department_name || "";
//                 valB = b.department_name || "";
//             }

//             if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//             if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//             return 0;
//         });

//         return data;
//     }, [rawData, searchTerm, selectedMonth, sortBy, sortOrder, filterById]); // Added filterById dependency

//     // --- FIXED: AUTO EXPAND LOGIC START ---
//     // If we filtered by ID, automatically open the accordion for that supervisor
//     useEffect(() => {
//         if (filterById && processedData.length > 0) {
//             // Since we filtered by ID, all rows belong to the same supervisor. 
//             // Just grab the name from the first row.
//             const nameToExpand = processedData[0].supervisor_name;
//             setExpandedSupervisors(new Set([nameToExpand]));
//         }
//     }, [filterById, processedData]);
//     // --- FIXED END ---

//     // --- 4. Group by Supervisor ---
//     const groupedData: GroupedData = useMemo(() => {
//         return processedData.reduce((groups, item) => {
//             const key = item.supervisor_name || "Unassigned";
//             if (!groups[key]) groups[key] = [];
//             groups[key].push(item);
//             return groups;
//         }, {} as GroupedData);
//     }, [processedData]);

//     const toggleExpand = (supervisor: string) => {
//         const newSet = new Set(expandedSupervisors);
//         if (newSet.has(supervisor)) newSet.delete(supervisor);
//         else newSet.add(supervisor);
//         setExpandedSupervisors(newSet);
//     };

//     // --- STYLES ---
//     const s = {
//         container: { padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" },
//         header: { marginBottom: "30px", textAlign: "center" as const },
//         title: { fontSize: "28px", fontWeight: "bold", color: "#1f2937", marginBottom: "10px" },
//         stats: { fontSize: "16px", color: "#6b7280" },
        
//         controls: { display: "flex", gap: "15px", flexWrap: "wrap" as const, marginBottom: "30px", backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
//         input: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", flex: 1, minWidth: "200px" },
//         select: { padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" },
        
//         supCard: { backgroundColor: "white", borderRadius: "12px", marginBottom: "20px", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" },
//         supHeader: { padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", backgroundColor: "#f9fafb" },
//         supName: { fontSize: "18px", fontWeight: "600", color: "#111827", display: "flex", alignItems: "center", gap: "10px" },
//         badge: { backgroundColor: "#2563eb", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" },
//         toggleIcon: { color: "#6b7280", fontSize: "14px" },
        
//         tableContainer: { overflowX: "auto" as const, borderTop: "1px solid #e5e7eb" },
//         table: { width: "100%", borderCollapse: "collapse" as const, fontSize: "14px" },
//         th: { textAlign: "left" as const, padding: "12px 15px", backgroundColor: "#f3f4f6", color: "#374151", fontWeight: "600", borderBottom: "1px solid #e5e7eb" },
//         td: { padding: "12px 15px", borderBottom: "1px solid #f3f4f6", color: "#4b5563" },
//         tr: { transition: "background-color 0.2s" },
        
//         noData: { textAlign: "center" as const, padding: "40px", color: "#9ca3af" }
//     };

//     if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Report...</div>;

//     return (
//         <div style={s.container}>
//             <div style={s.header}>
//                 <h1 style={s.title}>Supervisor Assignment Dashboard</h1>
//                 <p style={s.stats}>
//                     Total Allocations: <b>{processedData.length}</b> | 
//                     Active Supervisors: <b>{Object.keys(groupedData).length}</b>
//                 </p>
//             </div>

//             {/* Controls */}
//             <div style={s.controls}>
//                 <input 
//                     type="text" 
//                     placeholder="Search Employee, Supervisor, or Line..." 
//                     value={searchTerm} 
//                     onChange={e => setSearchTerm(e.target.value)} 
//                     style={s.input}
//                 />
//                 <input 
//                     type="month" 
//                     value={selectedMonth} 
//                     onChange={e => setSelectedMonth(e.target.value)} 
//                     style={s.select}
//                 />
//                 <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={s.select}>
//                     <option value="date">Sort by Date</option>
//                     <option value="name">Sort by Name</option>
//                     <option value="dept">Sort by Department</option>
//                 </select>
//                 <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} style={s.select}>
//                     <option value="desc">Desc (Newest/Z-A)</option>
//                     <option value="asc">Asc (Oldest/A-Z)</option>
//                 </select>
//             </div>

//             {/* Grouped List */}
//             {Object.keys(groupedData).length === 0 ? (
//                 <div style={s.noData}>No records found matching your criteria.</div>
//             ) : (
//                 Object.entries(groupedData).map(([supervisor, employees]) => (
//                     <div key={supervisor} style={s.supCard}>
//                         {/* Supervisor Header */}
//                         <div style={s.supHeader} onClick={() => toggleExpand(supervisor)}>
//                             <div style={s.supName}>
//                                 Supervisor Name : {supervisor} 
//                                 <span style={s.badge}>{employees.length} Assigned</span>
//                             </div>
//                             <div style={s.toggleIcon}>
//                                 {expandedSupervisors.has(supervisor) ? "▼ Collapse" : "▶ Expand"}
//                             </div>
//                         </div>

//                         {/* Employee Table (Collapsible) */}
//                         {expandedSupervisors.has(supervisor) && (
//                             <div style={s.tableContainer}>
//                                 <table style={s.table}>
//                                     <thead>
//                                         <tr>
//                                             <th style={s.th}>Date</th>
//                                             <th style={s.th}>Employee</th>
//                                             <th style={s.th}>Dept</th>
//                                             <th style={s.th}>Allocated Line</th>
//                                             <th style={s.th}>Subline</th>
//                                             <th style={s.th}>Station</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {employees.map((emp) => (
//                                             <tr key={emp.id} style={s.tr}>
//                                                 <td style={s.td}>{emp.handover_date}</td>
//                                                 <td style={s.td}>
//                                                     <strong>{emp.employee_name} {emp.employee_lastname}</strong>
//                                                     <br/>
//                                                     <span style={{fontSize: '12px', color:'#9ca3af'}}>{emp.employee_id_card}</span>
//                                                 </td>
//                                                 <td style={s.td}>{emp.department_name}</td>
//                                                 <td style={s.td}>{emp.line_name || "-"}</td>
//                                                 <td style={s.td}>{emp.subline_name || "-"}</td>
//                                                 <td style={s.td}>{emp.station_name || "-"}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 ))
//             )}
//         </div>
//     );
// };

// export default SupervisorDashboard;



import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router-dom";

// --- Types ---
interface AllocationRecord {
    id: number;
    employee_name: string;
    employee_lastname: string;
    employee_id_card: string;
    supervisor_name: string;
    supervisor_id: number;
    department_name: string;
    line_name: string;
    subline_name: string;
    station_name: string;
    handover_date: string;
    is_training_completed: boolean;
}

interface GroupedData {
    [supervisor: string]: AllocationRecord[];
}

// NEW: Interface for per-supervisor filters
interface SupervisorFilters {
    employeeSearch: string;
    selectedDepartment: string;
    selectedLine: string;
    trainingFilter: "all" | "completed" | "pending";
}

const SupervisorDashboard: React.FC = () => {
    const [rawData, setRawData] = useState<AllocationRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [hoveredStat, setHoveredStat] = useState<string | null>(null);

    // Global Filters (for supervisor level)
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "name" | "dept">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filterById, setFilterById] = useState<string | null>(null);

    // NEW: Per-supervisor filters stored in a map
    const [supervisorFilters, setSupervisorFilters] = useState<{ [supervisor: string]: SupervisorFilters }>({});

    const location = useLocation();
    const [expandedSupervisors, setExpandedSupervisors] = useState<Set<string>>(new Set());

    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    // Helper to get or create default filters for a supervisor
    const getFiltersForSupervisor = (supervisor: string): SupervisorFilters => {
        return supervisorFilters[supervisor] || {
            employeeSearch: "",
            selectedDepartment: "",
            selectedLine: "",
            trainingFilter: "all",
        };
    };

    // Helper to update filters for a specific supervisor
    const updateSupervisorFilter = (supervisor: string, key: keyof SupervisorFilters, value: string) => {
        setSupervisorFilters(prev => ({
            ...prev,
            [supervisor]: {
                ...getFiltersForSupervisor(supervisor),
                [key]: value,
            }
        }));
    };

    // Clear filters for a specific supervisor
    const clearSupervisorFilters = (supervisor: string) => {
        setSupervisorFilters(prev => ({
            ...prev,
            [supervisor]: {
                employeeSearch: "",
                selectedDepartment: "",
                selectedLine: "",
                trainingFilter: "all",
            }
        }));
    };

    // Check if a supervisor has active filters
    const hasSupervisorActiveFilters = (supervisor: string): boolean => {
        const filters = getFiltersForSupervisor(supervisor);
        return filters.employeeSearch !== "" ||
            filters.selectedDepartment !== "" ||
            filters.selectedLine !== "" ||
            filters.trainingFilter !== "all";
    };

    // --- 1. Fetch Data ---
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;
            try {
                const response = await fetch("http://127.0.0.1:8000/reports/supervisor-allocations/", {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
                const data = await response.json();
                setRawData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken]);

    // --- 2. Read URL Logic ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idParam = params.get("supervisor_id");

        if (idParam) {
            setFilterById(idParam);
        } else {
            setFilterById(null);
        }
    }, [location]);

    // --- Get unique values for dropdowns (per supervisor) ---
    const getUniqueDepartmentsForSupervisor = (employees: AllocationRecord[]) => {
        const depts = [...new Set(employees.map(item => item.department_name).filter(Boolean))];
        return depts.sort();
    };

    const getUniqueLinesForSupervisor = (employees: AllocationRecord[]) => {
        const lines = [...new Set(employees.map(item => item.line_name).filter(Boolean))];
        return lines.sort();
    };

    // --- 3. Filter & Sort Logic (Supervisor Level) ---
    const processedData = useMemo(() => {
        let data = [...rawData];

        // Filter by supervisor ID (from URL)
        if (filterById) {
            data = data.filter(item => String(item.supervisor_id) === filterById);
        }

        // Filter by supervisor search term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.supervisor_name.toLowerCase().includes(lowerTerm)
            );
        }

        // Filter by month
        if (selectedMonth) {
            data = data.filter(item => item.handover_date.startsWith(selectedMonth));
        }

        // Sort
        data.sort((a, b) => {
            let valA, valB;
            if (sortBy === "date") {
                valA = new Date(a.handover_date).getTime();
                valB = new Date(b.handover_date).getTime();
            } else if (sortBy === "name") {
                valA = a.employee_name;
                valB = b.employee_name;
            } else {
                valA = a.department_name || "";
                valB = b.department_name || "";
            }

            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return data;
    }, [rawData, searchTerm, selectedMonth, sortBy, sortOrder, filterById]);

    useEffect(() => {
        if (filterById && processedData.length > 0) {
            const nameToExpand = processedData[0].supervisor_name;
            setExpandedSupervisors(new Set([nameToExpand]));
        }
    }, [filterById, processedData]);

    // --- 4. Group by Supervisor ---
    const groupedData: GroupedData = useMemo(() => {
        return processedData.reduce((groups, item) => {
            const key = item.supervisor_name || "Unassigned";
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
            return groups;
        }, {} as GroupedData);
    }, [processedData]);

    // --- 5. Filter employees within a supervisor (using per-supervisor filters) ---
    const getFilteredEmployees = (supervisor: string, employees: AllocationRecord[]): AllocationRecord[] => {
        const filters = getFiltersForSupervisor(supervisor);
        let filtered = [...employees];

        // Filter by employee search
        if (filters.employeeSearch) {
            const lowerTerm = filters.employeeSearch.toLowerCase();
            filtered = filtered.filter(item =>
                item.employee_name.toLowerCase().includes(lowerTerm) ||
                item.employee_lastname.toLowerCase().includes(lowerTerm) ||
                item.employee_id_card.toLowerCase().includes(lowerTerm) ||
                `${item.employee_name} ${item.employee_lastname}`.toLowerCase().includes(lowerTerm)
            );
        }

        // Filter by department
        if (filters.selectedDepartment) {
            filtered = filtered.filter(item => item.department_name === filters.selectedDepartment);
        }

        // Filter by line
        if (filters.selectedLine) {
            filtered = filtered.filter(item => item.line_name === filters.selectedLine);
        }

        // Filter by training status
        if (filters.trainingFilter !== "all") {
            filtered = filtered.filter(item =>
                filters.trainingFilter === "completed" ? item.is_training_completed : !item.is_training_completed
            );
        }

        return filtered;
    };

    const toggleExpand = (supervisor: string) => {
        const newSet = new Set(expandedSupervisors);
        if (newSet.has(supervisor)) newSet.delete(supervisor);
        else newSet.add(supervisor);
        setExpandedSupervisors(newSet);
    };

    // Clear global filters
    const clearAllFilters = () => {
        setSearchTerm("");
        setSelectedMonth("");
        setSortBy("date");
        setSortOrder("desc");
    };

    const hasActiveFilters = searchTerm || selectedMonth;

    const globalStyles = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        @keyframes slideDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 2000px; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes countUp {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        .glass-effect {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
    `;

    const inputStyle = {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "2px solid #e8ecf4",
        fontSize: "13px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: "#f8fafc",
        color: "#1a1a2e",
        fontWeight: "500",
        outline: "none",
        boxSizing: "border-box" as const,
    };

    const selectStyle = {
        ...inputStyle,
        cursor: "pointer",
        appearance: "none" as const,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "16px",
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#ffffff",
                gap: "30px",
            }}>
                <style>{globalStyles}</style>
                <div style={{
                    width: "100px",
                    height: "80px",
                    border: "4px solid #f3f4f6",
                    borderTopColor: "#8b5cf6",
                    borderRightColor: "#06b6d4",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                }}></div>
                <div style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "pulse 1.5s ease-in-out infinite",
                }}>
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            position: "relative",
            overflow: "hidden",
        }}>
            <style>{globalStyles}</style>

            {/* Decorative Background Elements */}
            <div style={{
                position: "fixed",
                top: "-200px",
                right: "-200px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }}></div>
            <div style={{
                position: "fixed",
                bottom: "-150px",
                left: "-150px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
            }}></div>

            <div style={{
                padding: "30px 30px 40px",
                maxWidth: "1500px",
                margin: "0 auto",
                fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
                position: "relative",
                zIndex: 1,
            }}>
                {/* Compact Header */}
                <div style={{
                    marginBottom: "30px",
                    textAlign: "center",
                    padding: "35px 30px",
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)",
                    borderRadius: "24px",
                    boxShadow: "0 15px 50px rgba(79, 70, 229, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>

                    <h1 style={{
                        fontSize: "32px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "10px",
                        textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        position: "relative",
                        zIndex: 1,
                        letterSpacing: "-0.5px",
                    }}>
                        Supervisor Assignment Dashboard
                    </h1>
                    <p style={{
                        fontSize: "16px",
                        color: "rgba(255,255,255,0.85)",
                        maxWidth: "500px",
                        margin: "0 auto",
                        position: "relative",
                        zIndex: 1,
                        lineHeight: "1.5",
                    }}>
                        Manage and track all supervisor allocations in one place
                    </p>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}>
                    {/* Total Allocations Card */}
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "24px 28px",
                            borderRadius: "18px",
                            boxShadow: hoveredStat === "allocations"
                                ? "0 20px 50px rgba(139, 92, 246, 0.2)"
                                : "0 4px 20px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(139, 92, 246, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: hoveredStat === "allocations" ? "translateY(-4px)" : "translateY(0)",
                            cursor: "default",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredStat("allocations")}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #8b5cf6, #a855f7)",
                        }}></div>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.35)",
                            flexShrink: 0,
                        }}>
                            📊
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: "13px",
                                color: "#8b5cf6",
                                marginBottom: "6px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                            }}>
                                Total Allocations
                            </div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                            }}>
                                {processedData.length}
                            </div>
                        </div>
                    </div>

                    {/* Active Supervisors Card */}
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "24px 28px",
                            borderRadius: "18px",
                            boxShadow: hoveredStat === "supervisors"
                                ? "0 20px 50px rgba(6, 182, 212, 0.2)"
                                : "0 4px 20px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(6, 182, 212, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: hoveredStat === "supervisors" ? "translateY(-4px)" : "translateY(0)",
                            cursor: "default",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredStat("supervisors")}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #06b6d4, #0891b2)",
                        }}></div>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            boxShadow: "0 8px 25px rgba(6, 182, 212, 0.35)",
                            flexShrink: 0,
                        }}>
                            👥
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: "13px",
                                color: "#0891b2",
                                marginBottom: "6px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                            }}>
                                Active Supervisors
                            </div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                            }}>
                                {Object.keys(groupedData).length}
                            </div>
                        </div>
                    </div>

                    {/* Total Operators Card */}
                    {/* <div
                        style={{
                            background: "#ffffff",
                            padding: "24px 28px",
                            borderRadius: "18px",
                            boxShadow: hoveredStat === "operators"
                                ? "0 20px 50px rgba(16, 185, 129, 0.2)"
                                : "0 4px 20px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(16, 185, 129, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: hoveredStat === "operators" ? "translateY(-4px)" : "translateY(0)",
                            cursor: "default",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredStat("operators")}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #10b981, #059669)",
                        }}></div>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.35)",
                            flexShrink: 0,
                        }}>
                            🔧
                        </div> */}
                        {/* <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: "13px",
                                color: "#059669",
                                marginBottom: "6px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                            }}>
                                Total Operators
                            </div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                            }}>
                                {new Set(rawData.map(item => item.employee_id_card)).size}
                            </div>
                        </div> */}
                    {/* </div> */}

                    {/* Training Status Card */}
                    {/* <div
                        style={{
                            background: "#ffffff",
                            padding: "24px 28px",
                            borderRadius: "18px",
                            boxShadow: hoveredStat === "training"
                                ? "0 20px 50px rgba(245, 158, 11, 0.2)"
                                : "0 4px 20px rgba(0,0,0,0.06)",
                            border: "1px solid rgba(245, 158, 11, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: hoveredStat === "training" ? "translateY(-4px)" : "translateY(0)",
                            cursor: "default",
                            position: "relative",
                            overflow: "hidden",
                        }}
                        onMouseEnter={() => setHoveredStat("training")}
                        onMouseLeave={() => setHoveredStat(null)}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: "linear-gradient(90deg, #f59e0b, #d97706)",
                        }}></div>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #f59e0b, #d97706)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            boxShadow: "0 8px 25px rgba(245, 158, 11, 0.35)",
                            flexShrink: 0,
                        }}>
                            🎓
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: "13px",
                                color: "#d97706",
                                marginBottom: "6px",
                                fontWeight: "700",
                                textTransform: "uppercase",
                                letterSpacing: "0.8px",
                            }}>
                                Training Completed
                            </div>
                            <div style={{
                                fontSize: "36px",
                                fontWeight: "900",
                                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                lineHeight: 1,
                            }}>
                                {rawData.filter(item => item.is_training_completed).length}
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Global Filter Controls - Supervisor Level Only */}
                <div style={{
                    backgroundColor: "#ffffff",
                    padding: "28px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    border: "1px solid #e5e7eb",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: "30px",
                }}>
                    {/* Top gradient line */}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: "linear-gradient(90deg, #8b5cf6, #06b6d4, #10b981, #f59e0b)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 3s linear infinite",
                    }}></div>

                    {/* Filter Header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                        flexWrap: "wrap",
                        gap: "16px",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}>
                            <span style={{ fontSize: "24px" }}>🔍</span>
                            <h3 style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#1a1a2e",
                                margin: 0,
                            }}>
                                Global Filters
                            </h3>
                            {hasActiveFilters && (
                                <span style={{
                                    backgroundColor: "#8b5cf6",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                }}>
                                    Filters Active
                                </span>
                            )}
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    border: "2px solid #ef4444",
                                    backgroundColor: "transparent",
                                    color: "#ef4444",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#ef4444";
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "#ef4444";
                                }}
                            >
                                ✕ Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Supervisor Search Section */}
                    {/* <div style={{
                        marginBottom: "24px",
                        padding: "20px",
                        backgroundColor: "#faf5ff",
                        borderRadius: "14px",
                        border: "1px solid rgba(139, 92, 246, 0.15)",
                    }}>
                        <div style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#7c3aed",
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <span style={{ fontSize: "18px" }}>👔</span>
                            Supervisor Filters
                        </div> */}
                        {/* <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "16px",
                        }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#8b5cf6",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Search Supervisor
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter supervisor name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#8b5cf6";
                                        e.target.style.boxShadow = "0 0 0 4px rgba(139, 92, 246, 0.12)";
                                        e.target.style.backgroundColor = "#ffffff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e8ecf4";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.backgroundColor = "#f8fafc";
                                    }}
                                />
                            </div>
                        </div> */}
                    {/* </div> */}

                    {/* Date & Sort Section */}
                    <div style={{
                        padding: "20px",
                        backgroundColor: "#fefce8",
                        borderRadius: "14px",
                        border: "1px solid rgba(245, 158, 11, 0.15)",
                    }}>
                        <div style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#d97706",
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <span style={{ fontSize: "18px" }}>📅</span>
                            Date & Sorting
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "16px",
                        }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#d97706",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Filter by Month
                                </label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={e => setSelectedMonth(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#f59e0b";
                                        e.target.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.12)";
                                        e.target.style.backgroundColor = "#ffffff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e8ecf4";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.backgroundColor = "#f8fafc";
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#d97706",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as "date" | "name" | "dept")}
                                    style={{
                                        ...selectStyle,
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23d97706' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#f59e0b";
                                        e.target.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.12)";
                                        e.target.style.backgroundColor = "#ffffff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e8ecf4";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.backgroundColor = "#f8fafc";
                                    }}
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="name">Sort by Name</option>
                                    <option value="dept">Sort by Department</option>
                                </select>
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#d97706",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Order
                                </label>
                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value as "asc" | "desc")}
                                    style={{
                                        ...selectStyle,
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23d97706' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#f59e0b";
                                        e.target.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.12)";
                                        e.target.style.backgroundColor = "#ffffff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e8ecf4";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.backgroundColor = "#f8fafc";
                                    }}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "16px",
                        }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#e49227ff",
                                    marginBottom: "8px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}>
                                    Search Supervisor
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter supervisor name..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={inputStyle}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#8b5cf6";
                                        e.target.style.boxShadow = "0 0 0 4px rgba(139, 92, 246, 0.12)";
                                        e.target.style.backgroundColor = "#ffffff";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e8ecf4";
                                        e.target.style.boxShadow = "none";
                                        e.target.style.backgroundColor = "#f8fafc";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supervisor Cards */}
                {Object.keys(groupedData).length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 40px",
                        color: "#9ca3af",
                        fontSize: "18px",
                        backgroundColor: "#ffffff",
                        borderRadius: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    }}>
                        <div style={{ fontSize: "64px", marginBottom: "20px", animation: "float 3s ease-in-out infinite" }}>🔍</div>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: "#4b5563", marginBottom: "8px" }}>No Records Found</div>
                        <div style={{ marginBottom: "20px" }}>Try adjusting your search criteria</div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                style={{
                                    padding: "12px 24px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    Object.entries(groupedData).map(([supervisor, employees], index) => {
                        const isExpanded = expandedSupervisors.has(supervisor);
                        const isHovered = hoveredCard === supervisor;
                        const filteredEmployees = getFilteredEmployees(supervisor, employees);
                        const supervisorFilterState = getFiltersForSupervisor(supervisor);
                        const hasLocalFilters = hasSupervisorActiveFilters(supervisor);

                        return (
                            <div
                                key={supervisor}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: "20px",
                                    marginBottom: "20px",
                                    overflow: "hidden",
                                    boxShadow: isHovered
                                        ? "0 20px 50px rgba(139, 92, 246, 0.15)"
                                        : "0 4px 20px rgba(0,0,0,0.04)",
                                    border: isExpanded
                                        ? "2px solid transparent"
                                        : "1px solid #e8ecf4",
                                    background: isExpanded
                                        ? "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, #8b5cf6, #06b6d4) border-box"
                                        : "#ffffff",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                                }}
                                onMouseEnter={() => setHoveredCard(supervisor)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Supervisor Header */}
                                <div
                                    style={{
                                        padding: "22px 28px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        background: isExpanded
                                            ? "linear-gradient(135deg, #667eea 0%, #8b5cf6 50%, #06b6d4 100%)"
                                            : "#fafbfc",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        flexWrap: "wrap",
                                        gap: "16px",
                                    }}
                                    onClick={() => toggleExpand(supervisor)}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        flexWrap: "wrap",
                                    }}>
                                        <div style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: isExpanded
                                                ? "rgba(255,255,255,0.2)"
                                                : "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                                            color: "#ffffff",
                                            fontSize: "24px",
                                            boxShadow: isExpanded
                                                ? "0 4px 12px rgba(0,0,0,0.1)"
                                                : "0 6px 20px rgba(139, 92, 246, 0.3)",
                                            transition: "all 0.3s ease",
                                        }}>
                                            👤
                                        </div>

                                        <div>
                                            <div style={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                color: isExpanded ? "#ffffff" : "#1a1a2e",
                                                marginBottom: "4px",
                                                transition: "color 0.3s ease",
                                            }}>
                                                {supervisor}
                                            </div>
                                            <div style={{
                                                fontSize: "13px",
                                                color: isExpanded ? "rgba(255,255,255,0.8)" : "#6b7280",
                                                fontWeight: "500",
                                            }}>
                                                Supervisor
                                            </div>
                                        </div>

                                        <div style={{
                                            background: isExpanded
                                                ? "rgba(255,255,255,0.2)"
                                                : "linear-gradient(135deg, #8b5cf6, #a855f7)",
                                            color: "white",
                                            padding: "8px 18px",
                                            borderRadius: "30px",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            boxShadow: isExpanded
                                                ? "0 2px 10px rgba(0,0,0,0.1)"
                                                : "0 4px 15px rgba(139, 92, 246, 0.35)",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}>
                                            <span>👥</span>
                                            {employees.length} Operators
                                        </div>
                                    </div>

                                    <button
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "12px 24px",
                                            borderRadius: "12px",
                                            border: "none",
                                            fontSize: "14px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            background: isExpanded
                                                ? "rgba(255,255,255,0.2)"
                                                : "linear-gradient(135deg, #06b6d4, #0891b2)",
                                            color: "#ffffff",
                                            boxShadow: isExpanded
                                                ? "0 2px 10px rgba(0,0,0,0.1)"
                                                : "0 6px 20px rgba(6, 182, 212, 0.35)",
                                        }}
                                    >
                                        {isExpanded ? "▲ Collapse" : "▼ Expand"}
                                    </button>
                                </div>

                                {/* Expanded Content - Employee Filters + Table */}
                                {isExpanded && (
                                    <div style={{
                                        animation: "slideDown 0.3s ease-out",
                                    }}>
                                        {/* Employee/Operator Filter Section - INSIDE EXPANDED CARD */}
                                        <div style={{
                                            padding: "20px 28px",
                                            backgroundColor: "#f0fdfa",
                                            borderBottom: "1px solid #e0f2fe",
                                        }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                                flexWrap: "wrap",
                                                gap: "12px",
                                            }}>
                                                <div style={{
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    color: "#0891b2",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}>
                                                    <span style={{ fontSize: "18px" }}>🔧</span>
                                                    Filter Operators
                                                    {hasLocalFilters && (
                                                        <span style={{
                                                            backgroundColor: "#06b6d4",
                                                            color: "white",
                                                            padding: "2px 8px",
                                                            borderRadius: "12px",
                                                            fontSize: "11px",
                                                            fontWeight: "600",
                                                        }}>
                                                            Active
                                                        </span>
                                                    )}
                                                </div>
                                                {hasLocalFilters && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearSupervisorFilters(supervisor);
                                                        }}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "6px",
                                                            padding: "6px 14px",
                                                            borderRadius: "8px",
                                                            border: "1px solid #ef4444",
                                                            backgroundColor: "transparent",
                                                            color: "#ef4444",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#ef4444";
                                                            e.currentTarget.style.color = "white";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = "transparent";
                                                            e.currentTarget.style.color = "#ef4444";
                                                        }}
                                                    >
                                                        ✕ Clear
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                                gap: "14px",
                                            }}>
                                                <div>
                                                    <label style={{
                                                        display: "block",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        color: "#0891b2",
                                                        marginBottom: "6px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                    }}>
                                                        Search Employee
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Name or ID..."
                                                        value={supervisorFilterState.employeeSearch}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            updateSupervisorFilter(supervisor, "employeeSearch", e.target.value);
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={inputStyle}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#06b6d4";
                                                            e.target.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.12)";
                                                            e.target.style.backgroundColor = "#ffffff";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e8ecf4";
                                                            e.target.style.boxShadow = "none";
                                                            e.target.style.backgroundColor = "#f8fafc";
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{
                                                        display: "block",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        color: "#0891b2",
                                                        marginBottom: "6px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                    }}>
                                                        Department
                                                    </label>
                                                    <select
                                                        value={supervisorFilterState.selectedDepartment}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            updateSupervisorFilter(supervisor, "selectedDepartment", e.target.value);
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            ...selectStyle,
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230891b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#06b6d4";
                                                            e.target.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.12)";
                                                            e.target.style.backgroundColor = "#ffffff";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e8ecf4";
                                                            e.target.style.boxShadow = "none";
                                                            e.target.style.backgroundColor = "#f8fafc";
                                                        }}
                                                    >
                                                        <option value="">All Departments</option>
                                                        {getUniqueDepartmentsForSupervisor(employees).map(dept => (
                                                            <option key={dept} value={dept}>{dept}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{
                                                        display: "block",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        color: "#0891b2",
                                                        marginBottom: "6px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                    }}>
                                                        Line
                                                    </label>
                                                    <select
                                                        value={supervisorFilterState.selectedLine}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            updateSupervisorFilter(supervisor, "selectedLine", e.target.value);
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            ...selectStyle,
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230891b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#06b6d4";
                                                            e.target.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.12)";
                                                            e.target.style.backgroundColor = "#ffffff";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e8ecf4";
                                                            e.target.style.boxShadow = "none";
                                                            e.target.style.backgroundColor = "#f8fafc";
                                                        }}
                                                    >
                                                        <option value="">All Lines</option>
                                                        {getUniqueLinesForSupervisor(employees).map(line => (
                                                            <option key={line} value={line}>{line}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* <div>
                                                    <label style={{
                                                        display: "block",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        color: "#0891b2",
                                                        marginBottom: "6px",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px",
                                                    }}>
                                                        Training Status
                                                    </label>
                                                    <select
                                                        value={supervisorFilterState.trainingFilter}
                                                        onChange={e => {
                                                            e.stopPropagation();
                                                            updateSupervisorFilter(supervisor, "trainingFilter", e.target.value);
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                        style={{
                                                            ...selectStyle,
                                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230891b2' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#06b6d4";
                                                            e.target.style.boxShadow = "0 0 0 3px rgba(6, 182, 212, 0.12)";
                                                            e.target.style.backgroundColor = "#ffffff";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e8ecf4";
                                                            e.target.style.boxShadow = "none";
                                                            e.target.style.backgroundColor = "#f8fafc";
                                                        }}
                                                    >
                                                        <option value="all">All Status</option>
                                                        <option value="completed">✅ Completed</option>
                                                        <option value="pending">⏳ Pending</option>
                                                    </select>
                                                </div> */}
                                            </div>

                                            {/* Results count for this supervisor */}
                                            {hasLocalFilters && (
                                                <div style={{
                                                    marginTop: "14px",
                                                    padding: "10px 14px",
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "8px",
                                                    border: "1px solid #e0f2fe",
                                                    fontSize: "13px",
                                                    color: "#4b5563",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}>
                                                    <span>📋</span>
                                                    Showing <strong style={{ color: "#06b6d4" }}>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> operators
                                                </div>
                                            )}
                                        </div>

                                        {/* Employee Table */}
                                        <div style={{ overflowX: "auto" }}>
                                            {filteredEmployees.length === 0 ? (
                                                <div style={{
                                                    textAlign: "center",
                                                    padding: "40px 20px",
                                                    color: "#9ca3af",
                                                }}>
                                                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                                                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>
                                                        No matching operators found
                                                    </div>
                                                    <div style={{ fontSize: "13px" }}>
                                                        Try adjusting your filter criteria
                                                    </div>
                                                </div>
                                            ) : (
                                                <table style={{
                                                    width: "100%",
                                                    borderCollapse: "collapse",
                                                    fontSize: "14px",
                                                }}>
                                                    <thead>
                                                        <tr>
                                                            {["Date", "Employee/Operator", "Department", "Line", "Subline", "Station"].map((header, i) => (
                                                                <th key={i} style={{
                                                                    textAlign: "left",
                                                                    padding: "16px 20px",
                                                                    background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                                                                    color: "#ffffff",
                                                                    fontWeight: "600",
                                                                    fontSize: "12px",
                                                                    textTransform: "uppercase",
                                                                    letterSpacing: "0.5px",
                                                                }}>
                                                                    {header}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredEmployees.map((emp, empIndex) => (
                                                            <tr
                                                                key={emp.id}
                                                                style={{
                                                                    backgroundColor: hoveredRow === emp.id
                                                                        ? "rgba(139, 92, 246, 0.04)"
                                                                        : empIndex % 2 === 0 ? "#ffffff" : "#fafaff",
                                                                    transition: "all 0.2s ease",
                                                                }}
                                                                onMouseEnter={() => setHoveredRow(emp.id)}
                                                                onMouseLeave={() => setHoveredRow(null)}
                                                            >
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                }}>
                                                                    <span style={{
                                                                        background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
                                                                        WebkitBackgroundClip: "text",
                                                                        WebkitTextFillColor: "transparent",
                                                                        fontWeight: "600",
                                                                        fontSize: "14px",
                                                                    }}>
                                                                        {emp.handover_date}
                                                                    </span>
                                                                </td>
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                }}>
                                                                    <div style={{
                                                                        fontWeight: "600",
                                                                        color: "#1a1a2e",
                                                                        fontSize: "14px",
                                                                        marginBottom: "3px",
                                                                    }}>
                                                                        {emp.employee_name} {emp.employee_lastname}
                                                                    </div>
                                                                    <div style={{
                                                                        fontSize: "12px",
                                                                        color: "#9ca3af",
                                                                    }}>
                                                                        <span style={{
                                                                            backgroundColor: "#f3f4f6",
                                                                            padding: "2px 6px",
                                                                            borderRadius: "4px",
                                                                            fontFamily: "monospace",
                                                                            fontSize: "11px",
                                                                        }}>
                                                                            {emp.employee_id_card}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                    color: "#4b5563",
                                                                    fontWeight: "500",
                                                                }}>
                                                                    {emp.department_name}
                                                                </td>
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                }}>
                                                                    <span style={{
                                                                        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.08))",
                                                                        color: "#7c3aed",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "8px",
                                                                        fontWeight: "600",
                                                                        fontSize: "12px",
                                                                        border: "1px solid rgba(139, 92, 246, 0.15)",
                                                                    }}>
                                                                        {emp.line_name || "—"}
                                                                    </span>
                                                                </td>
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                    color: "#4b5563",
                                                                    fontWeight: "500",
                                                                }}>
                                                                    {emp.subline_name || "—"}
                                                                </td>
                                                                <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                    color: "#4b5563",
                                                                    fontWeight: "500",
                                                                }}>
                                                                    {emp.station_name || "—"}
                                                                </td>
                                                                {/* <td style={{
                                                                    padding: "16px 20px",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                }}>
                                                                    <span style={{
                                                                        display: "inline-flex",
                                                                        alignItems: "center",
                                                                        gap: "6px",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "20px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "600",
                                                                        backgroundColor: emp.is_training_completed
                                                                            ? "rgba(16, 185, 129, 0.1)"
                                                                            : "rgba(245, 158, 11, 0.1)",
                                                                        color: emp.is_training_completed
                                                                            ? "#059669"
                                                                            : "#d97706",
                                                                        border: `1px solid ${emp.is_training_completed ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                                                                    }}>
                                                                        {emp.is_training_completed ? "✅ Completed" : "⏳ Pending"}
                                                                    </span>
                                                                </td> */}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SupervisorDashboard;