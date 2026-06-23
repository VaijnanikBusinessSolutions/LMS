


// import React, { useState, useMemo, useEffect } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../store/store";

// // --- INTERFACES ---
// interface Station { id: number; station_name: string; }
// interface Subline { id: number; subline_name: string; stations: Station[]; }
// interface Line { id: number; line_name: string; stations: Station[]; sublines: Subline[]; }
// interface Department { id: number; department_name: string; lines: Line[]; stations: Station[]; }
// interface HierarchyStructure { structure_id: number; structure_name: string; structure_data: { departments: Department[] }; }
// interface ApiScoreData { id: number; employee_details: string; skill_name: string; marks: number; percentage: number; created_at: string; }

// interface SystemUser {
//     id: string;
//     first_name: string;
//     last_name: string;
//     employeeid: string;
//     role_name: string;
// }

// interface EmployeeMasterData {
//     emp_id: string;
//     first_name: string;
//     last_name: string;
//     department: { department_id: number, department_name: string } | null;
//     current_line: { line_id: number, line_name: string } | null;
//     current_subline?: { subline_id: number, subline_name: string } | null;
//     current_station: { station_id: number, station_name: string } | null;
// }

// interface HandoverFormData {
//     name: string;
//     currentDepartment: string;
//     currentLine: string;
//     currentSubline: string;
//     currentStation: string;
//     distributedDepartment: string;
//     selectedLineId: string;
//     selectedSublineId: string;
//     selectedStationId: string;
//     handoverDate: string;
//     assignedTo: string;
//     isTrainingCompleted: "yes" | "no" | "";
//     gojoInchargeName: string;
// }

// interface HandOverFormModalProps {
//     hierarchy: HierarchyStructure[];
//     users: SystemUser[];
//     onClose: () => void;
//     onSubmit: (formData: HandoverFormData) => void;
//     employeeDetails: EmployeeMasterData | null;
//     isLoading: boolean;
//     error: string | null;
//     initialFormData: HandoverFormData | null;
//     isEditing: boolean;
// }

// // --- MODAL COMPONENT ---
// const HandOverFormModal: React.FC<HandOverFormModalProps> = ({ hierarchy, users, onClose, onSubmit, employeeDetails, isLoading, error, initialFormData, isEditing }) => {
//     const [formData, setFormData] = useState<HandoverFormData>(initialFormData || {
//         name: "", currentDepartment: "", currentLine: "", currentSubline: "", currentStation: "",
//         distributedDepartment: "", selectedLineId: "", selectedSublineId: "", selectedStationId: "",
//         handoverDate: new Date().toISOString().split("T")[0],
//         assignedTo: "", isTrainingCompleted: "", gojoInchargeName: ""
//     });

//     const [lineOptions, setLineOptions] = useState<Line[]>([]);
//     const [sublineOptions, setSublineOptions] = useState<Subline[]>([]);
//     const [stationOptions, setStationOptions] = useState<Station[]>([]);

//     useEffect(() => { if (initialFormData) { setFormData(initialFormData); } }, [initialFormData]);

//     // --- Hierarchy Logic ---
//     useEffect(() => {
//         if (formData.distributedDepartment) {
//             let selectedDept: Department | undefined;
//             for (const structure of hierarchy) {
//                 selectedDept = structure.structure_data.departments.find(d => d.department_name === formData.distributedDepartment);
//                 if (selectedDept) break;
//             }
//             if (selectedDept) {
//                 setLineOptions(selectedDept.lines || []);
//                 setStationOptions(selectedDept.stations || []);
//             } else {
//                 setLineOptions([]); setStationOptions([]);
//             }
//             if (initialFormData?.distributedDepartment !== formData.distributedDepartment) {
//                 setFormData(prev => ({ ...prev, selectedLineId: "", selectedSublineId: "", selectedStationId: "" }));
//                 setSublineOptions([]);
//             }
//         }
//     }, [formData.distributedDepartment, hierarchy, initialFormData]);

//     useEffect(() => {
//         let currentStations: Station[] = [];
//         let selectedDept: Department | undefined;
//         for (const structure of hierarchy) {
//             selectedDept = structure.structure_data.departments.find(d => d.department_name === formData.distributedDepartment);
//             if (selectedDept) break;
//         }
//         if (selectedDept) currentStations = selectedDept.stations || [];

//         if (formData.selectedLineId) {
//             const selectedLine = lineOptions.find(l => String(l.id) === formData.selectedLineId);
//             if (selectedLine) {
//                 setSublineOptions(selectedLine.sublines || []);
//                 if (selectedLine.stations?.length > 0) currentStations = selectedLine.stations;
//                 else if (selectedLine.sublines?.length > 0) currentStations = [];
//             }
//             if (initialFormData?.selectedLineId !== formData.selectedLineId) {
//                 setFormData(prev => ({ ...prev, selectedSublineId: "", selectedStationId: "" }));
//             }
//         } else {
//             setSublineOptions([]);
//         }
//         setStationOptions(currentStations);
//     }, [formData.selectedLineId, lineOptions, formData.distributedDepartment, hierarchy, initialFormData]);

//     useEffect(() => {
//         if (formData.selectedSublineId) {
//             const selectedSubline = sublineOptions.find(s => String(s.id) === formData.selectedSublineId);
//             if (selectedSubline?.stations?.length > 0) setStationOptions(selectedSubline.stations);
//             if (initialFormData?.selectedSublineId !== formData.selectedSublineId) {
//                 setFormData(prev => ({ ...prev, selectedStationId: "" }));
//             }
//         } else if (formData.selectedLineId) {
//             const selectedLine = lineOptions.find(l => String(l.id) === formData.selectedLineId);
//             if (selectedLine?.stations?.length > 0) setStationOptions(selectedLine.stations);
//         }
//     }, [formData.selectedSublineId, sublineOptions, formData.selectedLineId, lineOptions, initialFormData]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };

//     const modalStyles: { [key: string]: React.CSSProperties } = {
//         backdrop: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(17, 24, 39, 0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
//         content: { backgroundColor: "white", padding: "30px 40px", borderRadius: "20px", width: "100%", maxWidth: "1000px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative", display: "flex", flexDirection: "column" },
//         closeButton: { position: "absolute", top: "15px", right: "20px", background: "transparent", border: "none", fontSize: "28px", cursor: "pointer", color: "#9ca3af" },
//         header: { textAlign: "center", marginBottom: "30px", borderBottom: "1px solid #e5e7eb", paddingBottom: "20px" },
//         title: { fontSize: "22px", fontWeight: "700", color: "#1f2937" },
//         formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
//         formField: { display: "flex", flexDirection: "column" as const },
//         label: { marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" },
//         input: { padding: "10px 12px", fontSize: "14px", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
//         readOnlyInput: { backgroundColor: "#f3f4f6", cursor: "not-allowed", color: "#4b5563" },
//         submitButton: { gridColumn: "1 / -1", marginTop: "20px", padding: "12px 20px", fontSize: "16px", fontWeight: "600", color: "#ffffff", background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", border: "none", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)" },
//         updateButton: { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)" },
//         centeredStatus: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#6b7280" }
//     };

//     return (
//         <div style={modalStyles.backdrop} onClick={onClose}>
//             <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
//                 <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
//                 <div style={modalStyles.header}> <h2 style={modalStyles.title}>{isEditing ? "Edit Dojo Handover" : "Dojo Handover Form"}</h2> </div>
//                 {isLoading && <div style={modalStyles.centeredStatus}>Loading Details...</div>}
//                 {error && <div style={{ ...modalStyles.centeredStatus, color: "red" }}>{error}</div>}
//                 {!isLoading && !error && employeeDetails && (
//                     <form onSubmit={handleSubmit}>
//                         <div style={modalStyles.formGrid}>
//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Name</label><input type="text" style={{ ...modalStyles.input, ...modalStyles.readOnlyInput }} value={formData.name} readOnly /></div>
//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Current Department</label><input type="text" style={{ ...modalStyles.input, ...modalStyles.readOnlyInput }} value={formData.currentDepartment} readOnly /></div>
//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Current Line</label><input type="text" style={{ ...modalStyles.input, ...modalStyles.readOnlyInput }} value={formData.currentLine} readOnly /></div>
//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Current Subline</label><input type="text" style={{ ...modalStyles.input, ...modalStyles.readOnlyInput }} value={formData.currentSubline} readOnly /></div>
//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Current Station</label><input type="text" style={{ ...modalStyles.input, ...modalStyles.readOnlyInput }} value={formData.currentStation} readOnly /></div>

//                             <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#e5e7eb', margin: '10px 0' }}></div>

//                             <div style={modalStyles.formField}>
//                                 <label style={modalStyles.label}>Distributed Department *</label>
//                                 <select name="distributedDepartment" value={formData.distributedDepartment} onChange={handleChange} style={modalStyles.input as React.CSSProperties} required>
//                                     <option value="" disabled>Select department</option>
//                                     {hierarchy.flatMap(s => s.structure_data.departments).map((dept, idx) => (
//                                         <option key={dept.id || `dept-${idx}`} value={dept.department_name}>{dept.department_name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             {lineOptions.length > 0 && (
//                                 <div style={modalStyles.formField}>
//                                     <label style={modalStyles.label}>Line (Optional)</label>
//                                     <select name="selectedLineId" value={formData.selectedLineId} onChange={handleChange} style={modalStyles.input as React.CSSProperties}>
//                                         <option value="">-- None --</option>
//                                         {lineOptions.map((line, idx) => (
//                                             <option key={line.id || `line-${idx}`} value={line.id}>{line.line_name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}

//                             {sublineOptions.length > 0 && (
//                                 <div style={modalStyles.formField}>
//                                     <label style={modalStyles.label}>Subline (Optional)</label>
//                                     <select name="selectedSublineId" value={formData.selectedSublineId} onChange={handleChange} style={modalStyles.input as React.CSSProperties}>
//                                         <option value="">-- None --</option>
//                                         {sublineOptions.map((subline, idx) => (
//                                             <option key={subline.id || `sub-${idx}`} value={subline.id}>{subline.subline_name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             )}

//                             <div style={modalStyles.formField}>
//                                 <label style={modalStyles.label}>Station (Required)</label>
//                                 <select name="selectedStationId" value={formData.selectedStationId} onChange={handleChange} style={modalStyles.input as React.CSSProperties} required>
//                                     <option value="">-- Select Station --</option>
//                                     {stationOptions.map((station, idx) => (
//                                         <option key={station.id || `stn-${idx}`} value={station.id}>{station.station_name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Date</label><input type="date" name="handoverDate" style={modalStyles.input} value={formData.handoverDate} onChange={handleChange} required /></div>

//                             {/* --- FIXED USER DROPDOWN --- */}
//                             <div style={modalStyles.formField}>
//                                 <label style={modalStyles.label}>Assign To (Supervisor)</label>
//                                 <select
//                                     name="assignedTo"
//                                     value={String(formData.assignedTo || "")}
//                                     onChange={handleChange}
//                                     style={modalStyles.input as React.CSSProperties}
//                                 >
//                                     <option value="">-- Select User --</option>
//                                     {users.length > 0 ? (
//                                         users.map((user) => {
//                                             // FIX: ONLY use the Database ID. Backend creates a relation via ID, not EmployeeID string.
//                                             if (!user.id || user.id === "undefined") return null;

//                                             return (
//                                                 <option key={user.id} value={user.id}>
//                                                     {user.first_name} {user.last_name}
//                                                     {user.role_name ? ` - ${user.role_name}` : ''} ({user.employeeid})
//                                                 </option>
//                                             );
//                                         })
//                                     ) : (
//                                         <option value="" disabled>No users available</option>
//                                     )}
//                                 </select>
//                             </div>

//                             <div style={modalStyles.formField}><label style={modalStyles.label}>Dojo Incharge</label><input type="text" name="gojoInchargeName" style={modalStyles.input} value={formData.gojoInchargeName} onChange={handleChange} required /></div>
//                             <div style={{ ...modalStyles.formField, gridColumn: 'span 2' }}><label style={modalStyles.label}>Training Completed?</label><select name="isTrainingCompleted" value={formData.isTrainingCompleted} style={modalStyles.input as React.CSSProperties} onChange={handleChange} required><option value="" disabled>Select</option><option value="yes">Yes</option><option value="no">No</option></select></div>
//                         </div>
//                         <button type="submit" style={{ ...modalStyles.submitButton, ...(isEditing ? modalStyles.updateButton : {}) }}>{isEditing ? "Update Handover" : "Submit Handover"}</button>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// const HandOverSheet: React.FC = () => {
//     const [scores, setScores] = useState<ApiScoreData[]>([]);
//     const [hierarchy, setHierarchy] = useState<HierarchyStructure[]>([]);
//     const [userList, setUserList] = useState<SystemUser[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedMonth, setSelectedMonth] = useState("");
//     const [hoveredCard, setHoveredCard] = useState<number | null>(null);
//     const [employeesWithHandover, setEmployeesWithHandover] = useState<Set<string>>(new Set());
//     const [employeeDetailsMap, setEmployeeDetailsMap] = useState<{ [key: string]: EmployeeMasterData }>({});
//     const [refreshKey, setRefreshKey] = useState(0);
//     const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//     const [selectedScore, setSelectedScore] = useState<ApiScoreData | null>(null);
//     const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
//     const [modalError, setModalError] = useState<string | null>(null);
//     const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<EmployeeMasterData | null>(null);
//     const [initialFormData, setInitialFormData] = useState<HandoverFormData | null>(null);
//     const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

//     const accessToken = useSelector((state: RootState) => state.auth.accessToken);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!accessToken) return;
//             try {
//                 setLoading(true);
//                 const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };

//                 const [scoresResponse, handoversResponse, hierarchyResponse, usersResponse] = await Promise.all([
//                     fetch("http://127.0.0.1:8000/scores/passed/level-1/", { headers }),
//                     fetch("http://127.0.0.1:8000/handovers/", { headers }),
//                     fetch("http://127.0.0.1:8000/hierarchy-simple/", { headers }),
//                     fetch("http://127.0.0.1:8000/users-list/", { headers }),
//                 ]);

//                 if (!scoresResponse.ok) throw new Error("Scores API failed");
//                 if (!handoversResponse.ok) throw new Error("Handovers API failed");
//                 if (!hierarchyResponse.ok) throw new Error("Hierarchy API failed");
//                 if (!usersResponse.ok) throw new Error("Users API failed");

//                 const usersDataRaw = await usersResponse.json();
//                 // Inside the useEffect where you fetch users:
//                 const formattedUsers: SystemUser[] = usersDataRaw.map((u: any) => ({
//                     id: String(u.id), // The new API guarantees 'id' is present
//                     first_name: u.first_name,
//                     last_name: u.last_name,
//                     employeeid: u.employeeid,
//                     role_name: u.role_name || ""
//                 }));
//                 const scoresData = await scoresResponse.json();
//                 const handoversData = await handoversResponse.json();
//                 const hierarchyData = await hierarchyResponse.json();

//                 setScores(scoresData);
//                 setHierarchy(hierarchyData);
//                 setUserList(formattedUsers);
//                 setEmployeesWithHandover(new Set(handoversData.map((h: any) => h.employee)));
//                 setError(null);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : "Unknown error");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [refreshKey, accessToken]);

//     useEffect(() => {
//         if (scores.length === 0 || !accessToken) return;
//         const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };
//         const fetchEmployeeDetails = async () => {
//             const empIds = scores.map(score => score.employee_details.split("(").pop()?.replace(")", "")).filter(Boolean) as string[];
//             const promises = empIds.map(id => fetch(`http://127.0.0.1:8000/mastertable-handover-details/${id}/`, { headers }).then(res => res.ok ? res.json() : null));
//             try {
//                 const results = await Promise.all(promises);
//                 const detailsMap: { [key: string]: EmployeeMasterData } = {};
//                 results.forEach(detail => { if (detail && detail.emp_id) { detailsMap[detail.emp_id] = detail; } });
//                 setEmployeeDetailsMap(detailsMap);
//             } catch (error) { console.error("Failed to fetch details", error); }
//         };
//         fetchEmployeeDetails();
//     }, [scores, accessToken]);

//     const uniqueMonths = useMemo(() => { const m = new Set<string>(); scores.forEach(s => m.add(s.created_at.substring(0, 7))); return Array.from(m).sort().reverse(); }, [scores]);
//     useEffect(() => { if (uniqueMonths.length > 0 && !selectedMonth) { setSelectedMonth(uniqueMonths[0]); } }, [uniqueMonths, selectedMonth]);
//     const filteredEmployees = useMemo(() => { let e = [...scores]; if (selectedMonth && selectedMonth !== "all") { e = e.filter(emp => emp.created_at.startsWith(selectedMonth)); } if (searchTerm.trim() !== "") { const l = searchTerm.toLowerCase(); e = e.filter(emp => emp.employee_details.toLowerCase().includes(l)); } return e.sort((a, b) => b.percentage - a.percentage); }, [scores, selectedMonth, searchTerm]);

//     const handleOpenModal = async (score: ApiScoreData) => {
//         const empId = score?.employee_details?.split('(')?.pop()?.replace(')', '') || null;
//         if (!empId || !accessToken) return;

//         setIsModalOpen(true);
//         setSelectedScore(score);
//         setIsModalLoading(true);
//         const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };

//         try {
//             const response = await fetch(`http://127.0.0.1:8000/mastertable-handover-details/${empId}/`, { headers });
//             const data: EmployeeMasterData = await response.json();
//             setSelectedEmployeeDetails(data);

//             const handResp = await fetch(`http://127.0.0.1:8000/handovers/${empId}/`, { headers });

//             const baseFormData = {
//                 name: `${data.first_name} ${data.last_name}`,
//                 currentDepartment: data.department?.department_name || "N/A",
//                 currentLine: data.current_line?.line_name || "N/A",
//                 currentSubline: data.current_subline?.subline_name || "N/A",
//                 currentStation: data.current_station?.station_name || "N/A",
//                 handoverDate: new Date().toISOString().split("T")[0],
//                 assignedTo: "",
//                 isTrainingCompleted: "" as const,
//                 gojoInchargeName: "",
//                 distributedDepartment: "",
//                 selectedLineId: "",
//                 selectedSublineId: "",
//                 selectedStationId: ""
//             };

//             if (handResp.ok) {
//                 setIsEditingMode(true);
//                 const handData = await handResp.json();

//                 const deptId = handData.distributed_department_after_dojo;
//                 let deptName = "";
//                 if (deptId) { for (const s of hierarchy) { const d = s.structure_data.departments.find(d => d.id === deptId); if (d) { deptName = d.department_name; break; } } }

//                 setInitialFormData({
//                     ...baseFormData,
//                     distributedDepartment: deptName,
//                     selectedLineId: handData.allocated_line ? String(handData.allocated_line) : "",
//                     selectedSublineId: handData.allocated_subline ? String(handData.allocated_subline) : "",
//                     selectedStationId: handData.allocated_station ? String(handData.allocated_station) : "",
//                     handoverDate: handData.handover_date || baseFormData.handoverDate,
//                     assignedTo: handData.assigned_to ? String(handData.assigned_to) : "",
//                     isTrainingCompleted: handData.is_training_completed ? "yes" : "no",
//                     gojoInchargeName: handData.gojo_incharge_name || ""
//                 });
//             } else {
//                 setIsEditingMode(false);
//                 setInitialFormData(baseFormData);
//             }
//         } catch (err) {
//             setModalError(err instanceof Error ? err.message : "Error");
//         } finally {
//             setIsModalLoading(false);
//         }
//     };

//     const handleCloseModal = () => { setIsModalOpen(false); setSelectedScore(null); setInitialFormData(null); setIsEditingMode(false); };

//     const handleFormSubmit = async (formData: HandoverFormData) => {
//         if (!selectedEmployeeDetails || !accessToken) return;

//         const payload = {
//             emp_id: selectedEmployeeDetails.emp_id,
//             required_department_at_handover: formData.currentDepartment,
//             distributed_department_name: formData.distributedDepartment,
//             line_id: formData.selectedLineId || null,
//             subline_id: formData.selectedSublineId || null,
//             station_id: formData.selectedStationId || null,
//             handover_date: formData.handoverDate,

//             // --- FIX START ---
//             // Convert the string value from the <select> to a Number (Integer)
//             // If empty string, send null.
//             assigned_to: formData.assignedTo ? Number(formData.assignedTo) : null,
//             // --- FIX END ---

//             is_training_completed: formData.isTrainingCompleted === 'yes',
//             gojo_incharge_name: formData.gojoInchargeName
//         };

//         const method = isEditingMode ? "PUT" : "POST";
//         const url = isEditingMode ? `http://127.0.0.1:8000/handovers/${selectedEmployeeDetails.emp_id}/` : "http://127.0.0.1:8000/handovers/";

//         try {
//             const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
//             if (!response.ok) { const err = await response.json(); throw new Error(JSON.stringify(err)); }
//             alert(`Handover saved!`);
//             handleCloseModal();
//             setRefreshKey(p => p + 1);
//         } catch (error) { alert(error instanceof Error ? error.message : "Error saving form"); }
//     };

//     const getScoreBarWidth = (p: number) => `${p}%`;
//     const styles: { [key: string]: React.CSSProperties } = { container: { minHeight: "100vh", backgroundColor: "#ffffffff", padding: "40px 20px" }, header: { textAlign: "center" as const, marginBottom: "50px" }, title: { fontSize: "32px", fontWeight: "800", background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "10px" }, subtitle: { fontSize: "18px", color: "#6b7280", fontWeight: "400" }, controlsContainer: { maxWidth: "1000px", margin: "0 auto 40px", display: "flex", gap: "20px", justifyContent: "space-between" }, searchInput: { flex: 1, padding: "12px 16px", fontSize: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", outline: "none", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }, monthSelect: { padding: "12px 16px", fontSize: "16px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "white", cursor: "pointer", outline: "none", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }, resultsContainer: { maxWidth: "1000px", margin: "0 auto" }, noResults: { textAlign: "center", padding: "50px", backgroundColor: "#ffffff", borderRadius: "16px", color: "#6b7280", fontSize: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)" }, resultCard: { backgroundColor: "#ffffff", borderRadius: "16px", padding: "30px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "25px", transition: "all 0.3s ease" }, resultCardHover: { boxShadow: "0 10px 25px rgba(124, 58, 237, 0.1)", borderColor: "#e0e7ff", transform: "translateY(-2px)" }, rankCircle: { width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", flexShrink: 0, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)" }, mainInfo: { flex: 1 }, name: { fontSize: "20px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }, details: { display: "flex", gap: "15px", color: "#6b7280", fontSize: "14px", marginBottom: "15px", flexWrap: "wrap" as const, alignItems: "center" }, scoreSection: { marginTop: "15px" }, scoreBar: { width: "100%", height: "10px", backgroundColor: "#f3f4f6", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }, scoreProgress: { height: "100%", background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)", borderRadius: "10px", transition: "width 1s ease", boxShadow: "0 2px 4px rgba(124, 58, 237, 0.2)" }, scoreText: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6b7280" }, badge: { display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: "#f3f4f6", color: "#4b5563", border: "1px solid #e5e7eb" }, statusPill: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0" }, detailsButton: { padding: "10px 20px", fontSize: "14px", fontWeight: "600", color: "#ffffff", background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", border: "none", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)" }, editButton: { background: "#6b7280", boxShadow: "0 4px 10px rgba(107, 114, 128, 0.2)" }, handoverSubmittedBadge: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", backgroundColor: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe" } };

//     return (
//         <div style={styles.container}>
//             <div style={styles.header}><h1 style={styles.title}>Level 1 Passed Users</h1><p style={styles.subtitle}>Employee Assessment Outcomes</p></div>
//             <div style={styles.controlsContainer}>
//                 <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
//                 <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={styles.monthSelect}><option value="all">All Months</option>{uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}</select>
//             </div>
//             <div style={styles.resultsContainer}>
//                 {filteredEmployees.map((score, index) => {
//                     const empId = score.employee_details.split("(").pop()?.replace(")", "") || null;
//                     const hasHandover = empId ? employeesWithHandover.has(empId) : false;
//                     return (
//                         <div key={score.id || `score-${index}`} style={styles.resultCard}>
//                             <div style={styles.rankCircle}>{index + 1}</div>
//                             <div style={styles.mainInfo}>
//                                 <h3 style={styles.name}>{score.employee_details}</h3>
//                                 <div style={styles.scoreSection}><div style={styles.scoreBar}><div style={{ ...styles.scoreProgress, width: getScoreBarWidth(score.percentage) }} /></div><div style={styles.scoreText}><span>{score.percentage.toFixed(1)}%</span></div></div>
//                             </div>
//                             <button style={{ ...styles.detailsButton, ...(hasHandover ? styles.editButton : {}) }} onClick={() => handleOpenModal(score)}>{hasHandover ? "Edit Handover" : "Create Handover"}</button>
//                         </div>
//                     );
//                 })}
//             </div>
//             {isModalOpen && selectedScore && (
//                 <HandOverFormModal
//                     hierarchy={hierarchy}
//                     users={userList}
//                     onClose={handleCloseModal}
//                     onSubmit={handleFormSubmit}
//                     isLoading={isModalLoading}
//                     error={modalError}
//                     employeeDetails={selectedEmployeeDetails}
//                     initialFormData={initialFormData}
//                     isEditing={isEditingMode}
//                 />
//             )}
//         </div>
//     );
// };

// export default HandOverSheet;





import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { 
  Search, Calendar, X, User, CheckCircle, AlertCircle, 
  ChevronDown, MapPin, Briefcase, Award 
} from "lucide-react";

// --- INTERFACES ---
interface Station { id: number; station_name: string; }
interface Subline { id: number; subline_name: string; stations: Station[]; }
interface Line { id: number; line_name: string; stations: Station[]; sublines: Subline[]; }
interface Department { id: number; department_name: string; lines: Line[]; stations: Station[]; }
interface HierarchyStructure { structure_id: number; structure_name: string; structure_data: { departments: Department[] }; }
interface ApiScoreData { id: number; employee_details: string; skill_name: string; marks: number; percentage: number; created_at: string; }

interface SystemUser {
    id: string;
    first_name: string;
    last_name: string;
    employeeid: string;
    role_name: string;
}

interface EmployeeMasterData {
    emp_id: string;
    first_name: string;
    last_name: string;
    department: { department_id: number, department_name: string } | null;
    current_line: { line_id: number, line_name: string } | null;
    current_subline?: { subline_id: number, subline_name: string } | null;
    current_station: { station_id: number, station_name: string } | null;
}

interface HandoverFormData {
    name: string;
    currentDepartment: string;
    currentLine: string;
    currentSubline: string;
    currentStation: string;
    distributedDepartment: string;
    selectedLineId: string;
    selectedSublineId: string;
    selectedStationId: string;
    handoverDate: string;
    assignedTo: string;
    isTrainingCompleted: "yes" | "no" | "";
    gojoInchargeName: string;
}

interface HandOverFormModalProps {
    hierarchy: HierarchyStructure[];
    users: SystemUser[];
    onClose: () => void;
    onSubmit: (formData: HandoverFormData) => void;
    employeeDetails: EmployeeMasterData | null;
    isLoading: boolean;
    error: string | null;
    initialFormData: HandoverFormData | null;
    isEditing: boolean;
}

// --- MODAL COMPONENT ---
const HandOverFormModal: React.FC<HandOverFormModalProps> = ({ hierarchy, users, onClose, onSubmit, employeeDetails, isLoading, error, initialFormData, isEditing }) => {
    const [formData, setFormData] = useState<HandoverFormData>(initialFormData || {
        name: "", currentDepartment: "", currentLine: "", currentSubline: "", currentStation: "",
        distributedDepartment: "", selectedLineId: "", selectedSublineId: "", selectedStationId: "",
        handoverDate: new Date().toISOString().split("T")[0],
        assignedTo: "", isTrainingCompleted: "", gojoInchargeName: ""
    });

    const [lineOptions, setLineOptions] = useState<Line[]>([]);
    const [sublineOptions, setSublineOptions] = useState<Subline[]>([]);
    const [stationOptions, setStationOptions] = useState<Station[]>([]);

    useEffect(() => { if (initialFormData) { setFormData(initialFormData); } }, [initialFormData]);

    // --- Hierarchy Logic ---
    useEffect(() => {
        if (formData.distributedDepartment) {
            let selectedDept: Department | undefined;
            for (const structure of hierarchy) {
                selectedDept = structure.structure_data.departments.find(d => d.department_name === formData.distributedDepartment);
                if (selectedDept) break;
            }
            if (selectedDept) {
                setLineOptions(selectedDept.lines || []);
                setStationOptions(selectedDept.stations || []);
            } else {
                setLineOptions([]); setStationOptions([]);
            }
            if (initialFormData?.distributedDepartment !== formData.distributedDepartment) {
                setFormData(prev => ({ ...prev, selectedLineId: "", selectedSublineId: "", selectedStationId: "" }));
                setSublineOptions([]);
            }
        }
    }, [formData.distributedDepartment, hierarchy, initialFormData]);

    useEffect(() => {
        let currentStations: Station[] = [];
        let selectedDept: Department | undefined;
        for (const structure of hierarchy) {
            selectedDept = structure.structure_data.departments.find(d => d.department_name === formData.distributedDepartment);
            if (selectedDept) break;
        }
        if (selectedDept) currentStations = selectedDept.stations || [];

        if (formData.selectedLineId) {
            const selectedLine = lineOptions.find(l => String(l.id) === formData.selectedLineId);
            if (selectedLine) {
                setSublineOptions(selectedLine.sublines || []);
                if (selectedLine.stations?.length > 0) currentStations = selectedLine.stations;
                else if (selectedLine.sublines?.length > 0) currentStations = [];
            }
            if (initialFormData?.selectedLineId !== formData.selectedLineId) {
                setFormData(prev => ({ ...prev, selectedSublineId: "", selectedStationId: "" }));
            }
        } else {
            setSublineOptions([]);
        }
        setStationOptions(currentStations);
    }, [formData.selectedLineId, lineOptions, formData.distributedDepartment, hierarchy, initialFormData]);

    useEffect(() => {
        if (formData.selectedSublineId) {
            const selectedSubline = sublineOptions.find(s => String(s.id) === formData.selectedSublineId);
            if (selectedSubline?.stations?.length > 0) setStationOptions(selectedSubline.stations);
            if (initialFormData?.selectedSublineId !== formData.selectedSublineId) {
                setFormData(prev => ({ ...prev, selectedStationId: "" }));
            }
        } else if (formData.selectedLineId) {
            const selectedLine = lineOptions.find(l => String(l.id) === formData.selectedLineId);
            if (selectedLine?.stations?.length > 0) setStationOptions(selectedLine.stations);
        }
    }, [formData.selectedSublineId, sublineOptions, formData.selectedLineId, lineOptions, initialFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-surface w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-border bg-background flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-text">
                            {isEditing ? "Edit Dojo Handover" : "Dojo Handover Form"}
                        </h2>
                        <p className="text-sm text-muted">Complete the transition details below</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-surface text-muted hover:text-text transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-border border-t-indigo-600 mb-4"></div>
                            <p>Loading Employee Details...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="flex flex-col items-center justify-center py-12 text-red-500">
                            <AlertCircle className="w-12 h-12 mb-3" />
                            <p>{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && employeeDetails && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* Section 1: Current Status */}
                            <div className="bg-background rounded-xl p-6 border border-border">
                                <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Current Assignment
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-muted mb-1.5">Employee Name</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-surface border-0 rounded-lg text-text text-sm font-medium focus:ring-0 cursor-not-allowed opacity-80" value={formData.name} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted mb-1.5">Department</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-surface border-0 rounded-lg text-text text-sm font-medium focus:ring-0 cursor-not-allowed opacity-80" value={formData.currentDepartment} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted mb-1.5">Station</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-surface border-0 rounded-lg text-text text-sm font-medium focus:ring-0 cursor-not-allowed opacity-80" value={formData.currentStation} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted mb-1.5">Line</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-surface border-0 rounded-lg text-text text-sm font-medium focus:ring-0 cursor-not-allowed opacity-80" value={formData.currentLine} readOnly />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-muted mb-1.5">Subline</label>
                                        <input type="text" className="w-full px-4 py-2.5 bg-surface border-0 rounded-lg text-text text-sm font-medium focus:ring-0 cursor-not-allowed opacity-80" value={formData.currentSubline} readOnly />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: New Assignment */}
                            <div>
                                <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> New Allocation Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Distributed Department <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select name="distributedDepartment" value={formData.distributedDepartment} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all" required>
                                                <option value="" disabled>Select department</option>
                                                {hierarchy.flatMap(s => s.structure_data.departments).map((dept, idx) => (
                                                    <option key={dept.id || `dept-${idx}`} value={dept.department_name}>{dept.department_name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                        </div>
                                    </div>

                                    {lineOptions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-text mb-2">Line (Optional)</label>
                                            <div className="relative">
                                                <select name="selectedLineId" value={formData.selectedLineId} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all">
                                                    <option value="">-- None --</option>
                                                    {lineOptions.map((line, idx) => (
                                                        <option key={line.id || `line-${idx}`} value={line.id}>{line.line_name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                            </div>
                                        </div>
                                    )}

                                    {sublineOptions.length > 0 && (
                                        <div>
                                            <label className="block text-sm font-semibold text-text mb-2">Subline (Optional)</label>
                                            <div className="relative">
                                                <select name="selectedSublineId" value={formData.selectedSublineId} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all">
                                                    <option value="">-- None --</option>
                                                    {sublineOptions.map((subline, idx) => (
                                                        <option key={subline.id || `sub-${idx}`} value={subline.id}>{subline.subline_name}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Station <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select name="selectedStationId" value={formData.selectedStationId} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all" required>
                                                <option value="">-- Select Station --</option>
                                                {stationOptions.map((station, idx) => (
                                                    <option key={station.id || `stn-${idx}`} value={station.id}>{station.station_name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Verification */}
                            <div>
                                <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Handover & Verification
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Assign To (Supervisor)</label>
                                        <div className="relative">
                                            <select name="assignedTo" value={String(formData.assignedTo || "")} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all">
                                                <option value="">-- Select User --</option>
                                                {users.length > 0 ? (
                                                    users.map((user) => {
                                                        if (!user.id || user.id === "undefined") return null;
                                                        return (
                                                            <option key={user.id} value={user.id}>
                                                                {user.first_name} {user.last_name} {user.role_name ? `- ${user.role_name}` : ''} ({user.employeeid})
                                                            </option>
                                                        );
                                                    })
                                                ) : (
                                                    <option value="" disabled>No users available</option>
                                                )}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Dojo Incharge Name</label>
                                        <input type="text" name="gojoInchargeName" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" value={formData.gojoInchargeName} onChange={handleChange} required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Handover Date</label>
                                        <input type="date" name="handoverDate" className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" value={formData.handoverDate} onChange={handleChange} required />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text mb-2">Training Completed?</label>
                                        <div className="relative">
                                            <select name="isTrainingCompleted" value={formData.isTrainingCompleted} className="w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all" onChange={handleChange} required>
                                                <option value="" disabled>Select Status</option>
                                                <option value="yes">Yes, Completed</option>
                                                <option value="no">No, Pending</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Footer Action */}
                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    className={`
                                        px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
                                        ${isEditing 
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200" 
                                            : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-indigo-200"
                                        }
                                    `}
                                >
                                    {isEditing ? "Update Handover" : "Submit Handover"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const HandOverSheet: React.FC = () => {
    const [scores, setScores] = useState<ApiScoreData[]>([]);
    const [hierarchy, setHierarchy] = useState<HierarchyStructure[]>([]);
    const [userList, setUserList] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [employeesWithHandover, setEmployeesWithHandover] = useState<Set<string>>(new Set());
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedScore, setSelectedScore] = useState<ApiScoreData | null>(null);
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<EmployeeMasterData | null>(null);
    const [initialFormData, setInitialFormData] = useState<HandoverFormData | null>(null);
    const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;
            try {
                setLoading(true);
                const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };

                const [scoresResponse, handoversResponse, hierarchyResponse, usersResponse] = await Promise.all([
                    fetch("http://127.0.0.1:8000/scores/passed/level-1/", { headers }),
                    fetch("http://127.0.0.1:8000/handovers/", { headers }),
                    fetch("http://127.0.0.1:8000/hierarchy-simple/", { headers }),
                    fetch("http://127.0.0.1:8000/users-list/", { headers }),
                ]);

                if (!scoresResponse.ok) throw new Error("Scores API failed");
                if (!handoversResponse.ok) throw new Error("Handovers API failed");
                if (!hierarchyResponse.ok) throw new Error("Hierarchy API failed");
                if (!usersResponse.ok) throw new Error("Users API failed");

                const usersDataRaw = await usersResponse.json();
                const formattedUsers: SystemUser[] = usersDataRaw.map((u: any) => ({
                    id: String(u.id),
                    first_name: u.first_name,
                    last_name: u.last_name,
                    employeeid: u.employeeid,
                    role_name: u.role_name || ""
                }));
                const scoresData = await scoresResponse.json();
                const handoversData = await handoversResponse.json();
                const hierarchyData = await hierarchyResponse.json();

                setScores(scoresData);
                setHierarchy(hierarchyData);
                setUserList(formattedUsers);
                setEmployeesWithHandover(new Set(handoversData.map((h: any) => h.employee)));
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshKey, accessToken]);

    const uniqueMonths = useMemo(() => { const m = new Set<string>(); scores.forEach(s => m.add(s.created_at.substring(0, 7))); return Array.from(m).sort().reverse(); }, [scores]);
    useEffect(() => { if (uniqueMonths.length > 0 && !selectedMonth) { setSelectedMonth(uniqueMonths[0]); } }, [uniqueMonths, selectedMonth]);
    const filteredEmployees = useMemo(() => { let e = [...scores]; if (selectedMonth && selectedMonth !== "all") { e = e.filter(emp => emp.created_at.startsWith(selectedMonth)); } if (searchTerm.trim() !== "") { const l = searchTerm.toLowerCase(); e = e.filter(emp => emp.employee_details.toLowerCase().includes(l)); } return e.sort((a, b) => b.percentage - a.percentage); }, [scores, selectedMonth, searchTerm]);

    const handleOpenModal = async (score: ApiScoreData) => {
        const empId = score?.employee_details?.split('(')?.pop()?.replace(')', '') || null;
        if (!empId || !accessToken) return;

        setIsModalOpen(true);
        setSelectedScore(score);
        setIsModalLoading(true);
        const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` };

        try {
            const response = await fetch(`http://127.0.0.1:8000/mastertable-handover-details/${empId}/`, { headers });
            const data: EmployeeMasterData = await response.json();
            setSelectedEmployeeDetails(data);

            const handResp = await fetch(`http://127.0.0.1:8000/handovers/${empId}/`, { headers });

            const baseFormData = {
                name: `${data.first_name} ${data.last_name}`,
                currentDepartment: data.department?.department_name || "N/A",
                currentLine: data.current_line?.line_name || "N/A",
                currentSubline: data.current_subline?.subline_name || "N/A",
                currentStation: data.current_station?.station_name || "N/A",
                handoverDate: new Date().toISOString().split("T")[0],
                assignedTo: "",
                isTrainingCompleted: "" as const,
                gojoInchargeName: "",
                distributedDepartment: "",
                selectedLineId: "",
                selectedSublineId: "",
                selectedStationId: ""
            };

            if (handResp.ok) {
                setIsEditingMode(true);
                const handData = await handResp.json();

                const deptId = handData.distributed_department_after_dojo;
                let deptName = "";
                if (deptId) { for (const s of hierarchy) { const d = s.structure_data.departments.find(d => d.id === deptId); if (d) { deptName = d.department_name; break; } } }

                setInitialFormData({
                    ...baseFormData,
                    distributedDepartment: deptName,
                    selectedLineId: handData.allocated_line ? String(handData.allocated_line) : "",
                    selectedSublineId: handData.allocated_subline ? String(handData.allocated_subline) : "",
                    selectedStationId: handData.allocated_station ? String(handData.allocated_station) : "",
                    handoverDate: handData.handover_date || baseFormData.handoverDate,
                    assignedTo: handData.assigned_to ? String(handData.assigned_to) : "",
                    isTrainingCompleted: handData.is_training_completed ? "yes" : "no",
                    gojoInchargeName: handData.gojo_incharge_name || ""
                });
            } else {
                setIsEditingMode(false);
                setInitialFormData(baseFormData);
            }
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Error");
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleCloseModal = () => { setIsModalOpen(false); setSelectedScore(null); setInitialFormData(null); setIsEditingMode(false); };

    const handleFormSubmit = async (formData: HandoverFormData) => {
        if (!selectedEmployeeDetails || !accessToken) return;

        const payload = {
            emp_id: selectedEmployeeDetails.emp_id,
            required_department_at_handover: formData.currentDepartment,
            distributed_department_name: formData.distributedDepartment,
            line_id: formData.selectedLineId || null,
            subline_id: formData.selectedSublineId || null,
            station_id: formData.selectedStationId || null,
            handover_date: formData.handoverDate,
            assigned_to: formData.assignedTo ? Number(formData.assignedTo) : null,
            is_training_completed: formData.isTrainingCompleted === 'yes',
            gojo_incharge_name: formData.gojoInchargeName
        };

        const method = isEditingMode ? "PUT" : "POST";
        const url = isEditingMode ? `http://127.0.0.1:8000/handovers/${selectedEmployeeDetails.emp_id}/` : "http://127.0.0.1:8000/handovers/";

        try {
            const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            if (!response.ok) { const err = await response.json(); throw new Error(JSON.stringify(err)); }
            alert(`Handover saved!`);
            handleCloseModal();
            setRefreshKey(p => p + 1);
        } catch (error) { alert(error instanceof Error ? error.message : "Error saving form"); }
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-10 font-sans">
            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Level 1 Passed Users
                </h1>
                <p className="text-muted text-lg">Employee Assessment & Handover Management</p>
            </div>

            {/* Controls */}
            <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search employees..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all" 
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)} 
                        className="w-full pl-12 pr-10 py-3 bg-surface border border-border rounded-xl text-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none shadow-sm cursor-pointer"
                    >
                        <option value="all">All Months</option>
                        {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="max-w-5xl mx-auto text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-indigo-600 mx-auto mb-4"></div>
                    <p className="text-muted">Loading assessments...</p>
                </div>
            )}

            {/* Results Grid */}
            {!loading && (
                <div className="max-w-5xl mx-auto space-y-4">
                    {filteredEmployees.length === 0 ? (
                        <div className="bg-surface rounded-2xl p-12 text-center border border-border shadow-sm">
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-muted" />
                            </div>
                            <h3 className="text-xl font-bold text-text mb-2">No employees found</h3>
                            <p className="text-muted">Try adjusting your search criteria or selected month.</p>
                        </div>
                    ) : (
                        filteredEmployees.map((score, index) => {
                            const empId = score.employee_details.split("(").pop()?.replace(")", "") || null;
                            const hasHandover = empId ? employeesWithHandover.has(empId) : false;
                            
                            return (
                                <div 
                                    key={score.id || `score-${index}`} 
                                    className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
                                >
                                    {/* Rank Circle */}
                                    <div className="flex-shrink-0 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-text truncate mb-3">{score.employee_details}</h3>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background border border-border text-muted">
                                                <Award className="w-3.5 h-3.5" /> {score.skill_name || 'Level 1'}
                                            </span>
                                            {hasHandover && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Handover Complete
                                                </span>
                                            )}
                                        </div>

                                        {/* Score Bar */}
                                        <div className="w-full max-w-md">
                                            <div className="flex justify-between text-xs font-medium text-muted mb-1.5">
                                                <span>Assessment Score</span>
                                                <span className="text-indigo-600">{score.percentage.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-2.5 bg-background rounded-full overflow-hidden border border-border">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000" 
                                                    style={{ width: `${score.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex-shrink-0 pt-4 md:pt-0">
                                        <button 
                                            onClick={() => handleOpenModal(score)}
                                            className={`
                                                w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all transform active:scale-95 shadow-lg
                                                ${hasHandover 
                                                    ? "bg-surface border border-border text-muted hover:text-text hover:bg-background shadow-none" 
                                                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-200"
                                                }
                                            `}
                                        >
                                            {hasHandover ? "Edit Details" : "Create Handover"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {isModalOpen && selectedScore && (
                <HandOverFormModal
                    hierarchy={hierarchy}
                    users={userList}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                    isLoading={isModalLoading}
                    error={modalError}
                    employeeDetails={selectedEmployeeDetails}
                    initialFormData={initialFormData}
                    isEditing={isEditingMode}
                />
            )}
        </div>
    );
};

export default HandOverSheet;