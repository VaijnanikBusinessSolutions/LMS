

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Save,
//   X,
//   Search,
//   Download,
//   Upload,
//   Filter,
//   Users,
//   Calendar,
//   Clock,
//   MapPin,
//   User,
//   Layers,
//   Target,
//   ChevronLeft,
//   ChevronRight,
// } from 'lucide-react';
// import CreatableSelect from 'react-select/creatable';

// const API_BASE = 'http://localhost:8000';

// // --- INTERFACES ---
// interface Department {
//   department_id: number;
//   department_name: string;
// }

// interface Line {
//   line_id: number;
//   line_name: string;
// }

// interface Station {
//   station_id: number;
//   station_name: string;
// }

// interface HierarchyStructure {
//   structure_id: number;
//   structure_name: string;
//   department: number;
//   department_name: string;
//   line: number | null;
//   line_name: string | null;
//   subline: number | null;
//   station: number | null;
//   station_name: string | null;
// }

// interface FilteredEmployee {
//   emp_id: string;
//   first_name: string;
//   last_name: string;
//   department: Department | null;
//   current_line: Line | null;
//   current_station: Station | null;
//   email: string;
//   phone: string;
// }

// interface RecurrenceInterval {
//   id: number;
//   interval_months: number;
//   is_active: boolean;
// }

// interface TrainingCategory {
//   id: string | number;
//   name: string;
// }

// interface TrainingTopic {
//   id: string | number;
//   category: any;
//   topic: string;
//   description: string;
// }

// interface Trainer {
//   id: string | number;
//   name: string;
// }

// interface Venue {
//   id: string | number;
//   name: string;
// }

// interface Employee {
//   id: string;
//   code: string;
//   name: string;
// }

// interface BackendEmployee {
//   id?: string;
//   emp_id?: string;
//   first_name?: string;
//   last_name?: string;
//   full_name?: string;
//   employee_code?: string;
// }

// interface TrainingSession {
//   id: string | number;
//   training_category: TrainingCategory;
//   topics: TrainingTopic[];
//   trainer: Trainer;
//   venue: Venue;
//   status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
//   date: string;
//   time: string;
//   employees: BackendEmployee[];
//   is_recurring?: boolean;
//   recurrence_interval?: RecurrenceInterval;
//   recurring_schedule_created?: boolean;
//   completed_date?: string;
//   next_training_date?: string;
//   next_training_creation_date?: string;
//   parent_schedule?: number | null;
//   recurrence_months?: number | null;
//   training_stage?: number;
//   next_training_date_override?: string | null;
// }

// // --- HELPERS FOR RECURRENCE PREVIEW ---
// function formatDateWithWeekday(dateString: string) {
//   const d = new Date(dateString);
//   if (Number.isNaN(d.getTime())) return dateString;
//   return d.toLocaleDateString('en-US', {
//     weekday: 'long',
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//   });
// }

// function computeDefaultNextDate(baseDate: string, months: number): string | null {
//   if (!baseDate || !months) return null;
//   const d = new Date(baseDate);
//   if (Number.isNaN(d.getTime())) return null;
//   const next = new Date(d);
//   next.setMonth(d.getMonth() + months);
//   const yyyy = next.getFullYear();
//   const mm = String(next.getMonth() + 1).padStart(2, '0');
//   const dd = String(next.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// // --- RECURRENCE CALENDAR MODAL ---
// interface RecurrenceCalendarModalProps {
//   baseDate: string;
//   months: number;
//   currentOverride: string | null;
//   onClose: () => void;
//   onConfirm: (selectedDate: string) => void;
// }

// const RecurrenceCalendarModal: React.FC<RecurrenceCalendarModalProps> = ({
//   baseDate,
//   months,
//   currentOverride,
//   onClose,
//   onConfirm,
// }) => {
//   const defaultDateStr = currentOverride || computeDefaultNextDate(baseDate, months) || baseDate;
//   const initialDate = new Date(defaultDateStr);
//   const initialYear = Number.isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear();
//   const initialMonth = Number.isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth();

//   const [view, setView] = useState({ year: initialYear, month: initialMonth }); // month: 0-11
//   const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);

//   const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
//   const firstDayOfWeek = new Date(view.year, view.month, 1).getDay(); // 0=Sun

//   const goMonth = (delta: number) => {
//     setView(prev => {
//       const d = new Date(prev.year, prev.month + delta, 1);
//       return { year: d.getFullYear(), month: d.getMonth() };
//     });
//   };

//   const handleDayClick = (day: number) => {
//     const yyyy = view.year;
//     const mm = String(view.month + 1).padStart(2, '0');
//     const dd = String(day).padStart(2, '0');
//     const ds = `${yyyy}-${mm}-${dd}`;
//     setSelectedDate(ds);
//   };

//   const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-US', {
//     month: 'long',
//     year: 'numeric',
//   });

//   const renderDays = () => {
//     const cells: JSX.Element[] = [];
//     for (let i = 0; i < firstDayOfWeek; i++) {
//       cells.push(
//         <div key={`empty-${i}`} className="h-12 border border-border bg-background" />
//       );
//     }
//     for (let day = 1; day <= daysInMonth; day++) {
//       const yyyy = view.year;
//       const mm = String(view.month + 1).padStart(2, '0');
//       const dd = String(day).padStart(2, '0');
//       const ds = `${yyyy}-${mm}-${dd}`;
//       const isSelected = selectedDate === ds;
//       const isDefault = defaultDateStr === ds;

//       cells.push(
//         <button
//           type="button"
//           key={day}
//           onClick={() => handleDayClick(day)}
//           className={`h-12 border border-border flex items-center justify-center text-sm font-medium transition-colors
//             ${isSelected ? 'bg-purple-600 text-white' : 'bg-surface text-text hover:bg-purple-50'}
//           `}
//         >
//           <div className="flex flex-col items-center">
//             <span>{day}</span>
//             {isDefault && !isSelected && (
//               <span className="mt-0.5 text-[10px] text-purple-500 font-bold">default</span>
//             )}
//           </div>
//         </button>
//       );
//     }
//     return cells;
//   };

//   const handleConfirm = () => {
//     onConfirm(selectedDate);
//   };

//   return (
//     <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center">
//       <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-bold text-text flex items-center gap-2">
//             <Calendar className="w-5 h-5 text-purple-600" />
//             Adjust Next Recurrence Date
//           </h3>
//           <button
//             type="button"
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-background text-text hover:text-text"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <p className="text-sm text-text mb-2">
//           Base date:&nbsp;
//           <span className="font-semibold">{formatDateWithWeekday(baseDate)}</span>
//         </p>
//         <p className="text-sm text-text mb-4">
//           Interval:&nbsp;
//           <span className="font-semibold">{months} month{months !== 1 ? 's' : ''}</span>
//         </p>

//         <div className="flex items-center justify-between mb-3">
//           <button
//             type="button"
//             onClick={() => goMonth(-1)}
//             className="p-2 rounded-lg hover:bg-background text-text"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <div className="font-semibold text-text">{monthLabel}</div>
//           <button
//             type="button"
//             onClick={() => goMonth(1)}
//             className="p-2 rounded-lg hover:bg-background text-text"
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="grid grid-cols-7 text-xs font-semibold text-text mb-1">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
//             <div key={d} className="h-6 flex items-center justify-center">
//               {d}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden mb-4">
//           {renderDays()}
//         </div>

//         <div className="text-sm text-text mb-4">
//           Selected:&nbsp;
//           <span className="font-semibold">
//             {formatDateWithWeekday(selectedDate)}
//           </span>
//         </div>

//         <div className="flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 rounded-xl border border-border text-text font-semibold hover:bg-background"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleConfirm}
//             className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
//           >
//             Confirm Date
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- STYLES FOR REACT-SELECT ---
// // This overrides the default white background to be transparent
// // so your Tailwind classes can control the colors.
// const customSelectStyles = {
//   control: (base: any, state: any) => ({
//     ...base,
//     backgroundColor: 'transparent',
//     borderColor: 'transparent', 
//     boxShadow: 'none',
//     padding: '4px',
//     '&:hover': {
//       borderColor: 'transparent',
//     }
//   }),
//   menu: (base: any) => ({
//     ...base,
//     backgroundColor: 'transparent', // We rely on classNames for the bg
//     zIndex: 9999,
//   }),
//   option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
//     ...base,
//     // When selected: Purple, When focused/hovered: slight transparency, otherwise transparent
//     backgroundColor: state.isSelected 
//       ? '#9333ea' 
//       : state.isFocused 
//         ? 'rgba(147, 51, 234, 0.1)' 
//         : 'transparent',
//     color: state.isSelected ? 'white' : 'inherit',
//     cursor: 'pointer',
//   }),
//   singleValue: (base: any) => ({
//     ...base,
//     color: 'inherit', // Uses text-text from parent
//   }),
//   input: (base: any) => ({
//     ...base,
//     color: 'inherit',
//   }),
//   placeholder: (base: any) => ({
//     ...base,
//     color: 'inherit',
//     opacity: 0.5,
//   }),
//   multiValue: (base: any) => ({
//     ...base,
//     backgroundColor: 'rgba(147, 51, 234, 0.1)',
//   }),
//   multiValueLabel: (base: any) => ({
//     ...base,
//     color: 'inherit',
//   }),
// };

// // These classes map to the internal elements of React Select
// const customSelectClassNames = {
//   control: (state: any) => 
//     `!bg-background !border-2 ${state.isFocused ? '!border-purple-500' : '!border-border'} !rounded-2xl !text-text !shadow-sm`,
//   menu: () => 
//     "!bg-surface !border !border-border !rounded-xl !mt-2 !shadow-xl !text-text",
//   option: () => 
//     "!text-text",
//   singleValue: () => 
//     "!text-text",
//   input: () => 
//     "!text-text",
//   placeholder: () => 
//     "!text-muted",
// };

// const Scheduling: React.FC = () => {
//   const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
//   const [trainingCategories, setTrainingCategories] = useState<TrainingCategory[]>([]);
//   const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>([]);
//   const [trainers, setTrainers] = useState<Trainer[]>([]);
//   const [venues, setVenues] = useState<Venue[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
//   const [employeeSearch, setEmployeeSearch] = useState('');
//   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  
//   // Filter-related states
//   const [hierarchyData, setHierarchyData] = useState<HierarchyStructure[]>([]);
//   const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  
//   const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
//   const [selectedLine, setSelectedLine] = useState<number | null>(null);
//   const [selectedStation, setSelectedStation] = useState<number | null>(null);

//   const [availableLines, setAvailableLines] = useState<Line[]>([]);
//   const [availableStations, setAvailableStations] = useState<Station[]>([]);
  
//   const [filteredEmployees, setFilteredEmployees] = useState<FilteredEmployee[]>([]);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [selectedFilteredEmployees, setSelectedFilteredEmployees] = useState<string[]>([]);
//   const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);
  
//   const [trainerInput, setTrainerInput] = useState('');
//   const [venueInput, setVenueInput] = useState('');
//   const [showCsvUpload, setShowCsvUpload] = useState(false);
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [uploadErrors, setUploadErrors] = useState<string[]>([]);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const [selectedTrainingNames, setSelectedTrainingNames] = useState<(string | number)[]>([]);

//   const [formData, setFormData] = useState<{
//     trainingCategory: string | number;
//     trainer: string | number;
//     venue: string | number;
//     date: string;
//     time: string;
//     employees: string[];
//     status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
//     recurrenceMonths: number | null;
//     nextRecurrenceOverride: string | null;
//   }>({
//     trainingCategory: '',
//     trainer: '',
//     venue: '',
//     date: '',
//     time: '',
//     employees: [],
//     status: 'scheduled',
//     recurrenceMonths: null,
//     nextRecurrenceOverride: null,
//   });

//   const [showRecurrenceCalendar, setShowRecurrenceCalendar] = useState(false);

//   const trainerOptions = trainers.map(t => ({ value: t.id, label: t.name }));
//   const venueOptions = venues.map(v => ({ value: v.id, label: v.name }));

//   useEffect(() => {
//     const init = async () => {
//       await Promise.all([
//         fetchCategories(),
//         fetchAllTopics(),
//         fetchTrainers(),
//         fetchVenues(),
//         fetchEmployees(),
//         fetchSessions(),
//         fetchHierarchyData()
//       ]);
//     };
//     init();
//   }, []);
  
//   useEffect(() => {
//     if (selectedDepartment) {
//       updateAvailableLines(selectedDepartment);
//     } else {
//       setAvailableLines([]);
//       setSelectedLine(null);
//       setAvailableStations([]);
//       setSelectedStation(null);
//     }
//   }, [selectedDepartment]);

//   useEffect(() => {
//     if (selectedLine && selectedDepartment) {
//       updateAvailableStations(selectedDepartment, selectedLine);
//     } else if (selectedDepartment && !selectedLine) {
//       updateAvailableStationsForDepartment(selectedDepartment);
//     } else {
//       setAvailableStations([]);
//       setSelectedStation(null);
//     }
//   }, [selectedLine, selectedDepartment]);

//   // --- API FETCH FUNCTIONS ---
//   const fetchHierarchyData = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/hierarchy/all-departments/`);
//       if (!res.ok) return;
//       const departments = await res.json();

//       // Set departments list
//       setAllDepartments(
//         (departments || []).map((dept: any) => ({
//           department_id: dept.department_id,
//           department_name: dept.department_name,
//         }))
//       );

//       // Flatten lines / sublines / stations into hierarchyData
//       const flat: HierarchyStructure[] = [];

//       (departments || []).forEach((dept: any) => {
//         const deptId = dept.department_id;
//         const deptName = dept.department_name;

//         // Dept-level stations (if any)
//         (dept.stations || []).forEach((st: any) => {
//           flat.push({
//             structure_id: Number(`${deptId}000${st.station_id}`),
//             structure_name: `${deptName} > ${st.station_name}`,
//             department: deptId,
//             department_name: deptName,
//             line: null,
//             line_name: null,
//             subline: null,
//             station: st.station_id,
//             station_name: st.station_name,
//           });
//         });

//         // Dept-level sublines (if any)
//         (dept.sublines || []).forEach((sub: any) => {
//           (sub.stations || []).forEach((st: any) => {
//             flat.push({
//               structure_id: Number(`${deptId}${sub.subline_id}${st.station_id}`),
//               structure_name: `${deptName} > ${sub.subline_name} > ${st.station_name}`,
//               department: deptId,
//               department_name: deptName,
//               line: null,
//               line_name: null,
//               subline: sub.subline_id,
//               station: st.station_id,
//               station_name: st.station_name,
//             });
//           });
//         });

//         // Lines
//         (dept.lines || []).forEach((line: any) => {
//           const lineId = line.line_id;
//           const lineName = line.line_name;

//           // Line entry (for line dropdown)
//           flat.push({
//             structure_id: Number(`${deptId}${lineId}00`),
//             structure_name: `${deptName} > ${lineName}`,
//             department: deptId,
//             department_name: deptName,
//             line: lineId,
//             line_name: lineName,
//             subline: null,
//             station: null,
//             station_name: null,
//           });

//           // Stations directly under line
//           (line.stations || []).forEach((st: any) => {
//             flat.push({
//               structure_id: Number(`${deptId}${lineId}${st.station_id}`),
//               structure_name: `${deptName} > ${lineName} > ${st.station_name}`,
//               department: deptId,
//               department_name: deptName,
//               line: lineId,
//               line_name: lineName,
//               subline: null,
//               station: st.station_id,
//               station_name: st.station_name,
//             });
//           });

//           // Sublines under line
//           (line.sublines || []).forEach((sub: any) => {
//             (sub.stations || []).forEach((st: any) => {
//               flat.push({
//                 structure_id: Number(`${deptId}${lineId}${st.station_id}`),
//                 structure_name: `${deptName} > ${lineName} > ${sub.subline_name} > ${st.station_name}`,
//                 department: deptId,
//                 department_name: deptName,
//                 line: lineId,
//                 line_name: lineName,
//                 subline: sub.subline_id,
//                 station: st.station_id,
//                 station_name: st.station_name,
//               });
//             });
//           });
//         });
//       });

//       setHierarchyData(flat);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const updateAvailableLines = (departmentId: number) => {
//     const linesInDept = hierarchyData
//       .filter(h => h.department === departmentId && h.line !== null && h.line_name)
//       .map(h => ({ line_id: Number(h.line!), line_name: String(h.line_name!) }));
//     const uniqueLines = Array.from(new Map(linesInDept.map(line => [line.line_id, line])).values());
//     setAvailableLines(uniqueLines as Line[]);
//     setSelectedLine(null);
//     setSelectedStation(null);
//   };
  
//   const updateAvailableStations = (departmentId: number, lineId: number) => {
//     const stationsInLine = hierarchyData
//       .filter(h => h.department === departmentId && h.line === lineId && h.station !== null)
//       .map(h => ({ station_id: h.station!, station_name: h.station_name! }));
//     const uniqueStations = stationsInLine.filter((station, index, self) =>
//       index === self.findIndex(s => s.station_id === station.station_id)
//     );
//     setAvailableStations(uniqueStations);
//     setSelectedStation(null);
//   };

//   const updateAvailableStationsForDepartment = (departmentId: number) => {
//     const stationsInDept = hierarchyData
//       .filter(h => h.department === departmentId && h.station !== null)
//       .map(h => ({ station_id: h.station!, station_name: h.station_name! }));
//     const uniqueStations = stationsInDept.filter((station, index, self) =>
//       index === self.findIndex(s => s.station_id === station.station_id)
//     );
//     setAvailableStations(uniqueStations);
//   };

//   const fetchFilteredEmployees = async () => {
//     if (!selectedDepartment && !selectedLine && !selectedStation) {
//       alert('Please select at least one filter');
//       return;
//     }
//     setIsLoadingFiltered(true);
//     try {
//       const params = new URLSearchParams();
//       if (selectedDepartment) params.append('department_id', String(selectedDepartment));
//       if (selectedLine) params.append('line_id', String(selectedLine));
//       if (selectedStation) params.append('station_id', String(selectedStation));
//       const res = await fetch(`${API_BASE}/employees-by-filters/?${params.toString()}`);
//       if (res.ok) {
//         const data = await res.json();
//         setFilteredEmployees(data.employees || []);
//         setSelectedFilteredEmployees([]);
//       }
//     } catch (error) {
//       alert('Error fetching employees');
//     } finally {
//       setIsLoadingFiltered(false);
//     }
//   };

//   const fetchAllTopics = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/curriculums/`);
//       if (res.ok) setTrainingTopics(await res.json());
//     } catch (error) { console.error(error); }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/training-categories/`);
//       if (res.ok) setTrainingCategories(await res.json());
//     } catch {}
//   };

//   const fetchTrainers = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/trainer_name/`);
//       if (res.ok) setTrainers(await res.json());
//     } catch {}
//   };

//   const fetchVenues = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/venues/`);
//       if (res.ok) setVenues(await res.json());
//     } catch {}
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/mastertable/`);
//       if (!res.ok) return;
//       const raw = await res.json();
//       const rows = Array.isArray(raw) ? raw : raw?.results ?? [];
//       const mapped: Employee[] = rows.map((emp: any) => ({
//         id: String(emp.emp_id),
//         name: [emp.first_name, emp.last_name].filter(Boolean).join(' ').trim() || String(emp.emp_id),
//         code: String(emp.emp_id)
//       }));
//       setEmployees(mapped);
//     } catch {}
//   };

//   const fetchSessions = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/schedules/`);
//       if (res.ok) setTrainingSessions(await res.json());
//     } catch {}
//   };

//   // --- FORM HANDLERS ---
//   const handleDownloadTemplate = () => {
//     window.open(`${API_BASE}/download-employee-template/`, '_blank');
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setCsvFile(e.target.files[0]);
//       setUploadErrors([]);
//       setUploadSuccess(false);
//     }
//   };

//   const handleCsvUpload = async () => {
//     if (!csvFile) return;
//     const formDataUpload = new FormData();
//     formDataUpload.append('file', csvFile);
//     try {
//       const res = await fetch(`${API_BASE}/upload-employees-csv/`, { method: 'POST', body: formDataUpload });
//       const data = await res.json();
//       if (res.ok) {
//         const validIds = data.valid_employees.map((emp: any) => String(emp.id));
//         setFormData(prev => ({ ...prev, employees: Array.from(new Set([...prev.employees, ...validIds])) }));
//         setUploadSuccess(true);
//         setUploadErrors(data.errors || []);
//         if (!data.errors?.length) { setShowCsvUpload(false); setCsvFile(null); }
//       } else {
//         setUploadErrors(data.details || [data.error] || ['Upload failed']);
//         setUploadSuccess(false);
//       }
//     } catch {
//       setUploadErrors(['Failed to upload CSV']);
//       setUploadSuccess(false);
//     }
//   };

//   const getFilteredEmployeesList = () => {
//     const q = employeeSearch.trim().toLowerCase();
//     if (!q) return employees;
//     return employees.filter(
//       emp =>
//         (emp.name || '').toLowerCase().includes(q) ||
//         String(emp.code || '').toLowerCase().includes(q)
//     );
//   };

//   const handleEmployeeSelect = (id: string) => {
//     if (!formData.employees.map(String).includes(String(id))) {
//       setFormData(prev => ({ ...prev, employees: [...prev.employees, String(id)] }));
//     }
//     setEmployeeSearch('');
//     setShowEmployeeDropdown(false);
//   };

//   const handleEmployeeRemove = (id: string) => {
//     setFormData(prev => ({
//       ...prev,
//       employees: prev.employees.filter(eid => String(eid) !== String(id)),
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       trainingCategory: '',
//       trainer: '',
//       venue: '',
//       date: '',
//       time: '',
//       employees: [],
//       status: 'scheduled',
//       recurrenceMonths: null,
//       nextRecurrenceOverride: null,
//     });
//     setSelectedTrainingNames([]);
//     setTrainerInput('');
//     setVenueInput('');
//     setShowForm(false);
//     setEditingSession(null);
//     setEmployeeSearch('');
//     setShowEmployeeDropdown(false);
//     setUploadErrors([]);
//     setUploadSuccess(false);
//   };

//   const getFilteredTopics = () => {
//     if (!formData.trainingCategory) return [];
//     return trainingTopics.filter(topic => String(topic.category?.id) === String(formData.trainingCategory));
//   };

//   const handleSelectAllTopics = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedTrainingNames(getFilteredTopics().map(t => t.id));
//     } else {
//       setSelectedTrainingNames([]);
//     }
//   };

//   const handleTopicToggle = (topicId: string | number) => {
//     setSelectedTrainingNames(prev =>
//       prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
//     );
//   };

//   const handleSelectAllFiltered = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked) {
//       setSelectedFilteredEmployees(filteredEmployees.map(emp => emp.emp_id));
//     } else {
//       setSelectedFilteredEmployees([]);
//     }
//   };

//   const handleToggleFilteredEmployee = (empId: string) => {
//     setSelectedFilteredEmployees(prev =>
//       prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
//     );
//   };

//   const handleAddFilteredEmployees = () => {
//     const currentEmployees = new Set(formData.employees);
//     selectedFilteredEmployees.forEach(empId => currentEmployees.add(empId));
//     setFormData(prev => ({ ...prev, employees: Array.from(currentEmployees) }));
//     setShowFilterModal(false);
//     resetFilterModal();
//   };

//   const resetFilterModal = () => {
//     setShowFilterModal(false);
//     setSelectedDepartment(null);
//     setSelectedLine(null);
//     setSelectedStation(null);
//     setAvailableLines([]);
//     setAvailableStations([]);
//     setFilteredEmployees([]);
//     setSelectedFilteredEmployees([]);
//   };

//   const areAllTopicsSelected = () => {
//     const topics = getFilteredTopics();
//     return topics.length > 0 && topics.every(t => selectedTrainingNames.includes(t.id));
//   };

//   const handleSubmit = async () => {
//     if (
//       !formData.trainingCategory ||
//       selectedTrainingNames.length === 0 ||
//       !formData.trainer ||
//       !formData.venue ||
//       !formData.date ||
//       !formData.time
//     ) {
//       alert('Please fill all required fields');
//       return;
//     }

//     let trainerId = formData.trainer;
//     let venueId = formData.venue;

//     if (!trainers.some(t => String(t.id) === String(formData.trainer))) {
//       try {
//         const res = await fetch(`${API_BASE}/trainer_name/`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: formData.trainer }),
//         });
//         if (res.ok) {
//           const newT = await res.json();
//           setTrainers(p => [...p, newT]);
//           trainerId = newT.id;
//         } else return;
//       } catch {
//         return;
//       }
//     }
//     if (!venues.some(v => String(v.id) === String(formData.venue))) {
//       try {
//         const res = await fetch(`${API_BASE}/venues/`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: formData.venue }),
//         });
//         if (res.ok) {
//           const newV = await res.json();
//           setVenues(p => [...p, newV]);
//           venueId = newV.id;
//         } else return;
//       } catch {
//         return;
//       }
//     }

//     const payload: any = {
//       training_category_id: formData.trainingCategory,
//       topic_ids: selectedTrainingNames,
//       trainer_id: trainerId,
//       venue_id: venueId,
//       status: formData.status,
//       date: formData.date,
//       time: formData.time,
//       employee_ids: formData.employees,
//       recurrence_months: formData.recurrenceMonths ?? null,
//     };

//     if (formData.nextRecurrenceOverride) {
//       payload.next_training_date_override = formData.nextRecurrenceOverride;
//     }

//     try {
//       const method = editingSession ? 'PUT' : 'POST';
//       const url = editingSession
//         ? `${API_BASE}/schedules/${editingSession.id}/`
//         : `${API_BASE}/schedules/`;

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         await fetchSessions();
//         resetForm();
//         alert(`Successfully ${editingSession ? 'updated' : 'created'} training session!`);
//       } else {
//         const err = await res.json();
//         alert('Failed: ' + JSON.stringify(err));
//       }
//     } catch {
//       alert('Error saving training session');
//     }
//   };

//   const handleEdit = (session: TrainingSession) => {
//     setEditingSession(session);
//     setFormData({
//       trainingCategory: session.training_category?.id || '',
//       trainer: session.trainer?.id || session.trainer?.name || '',
//       venue: session.venue?.id || session.venue?.name || '',
//       date: session.date,
//       time: session.time,
//       employees: session.employees.map((emp: any) => String(emp.emp_id ?? emp.id)),
//       status: session.status,
//       recurrenceMonths: session.recurrence_months ?? null,
//       nextRecurrenceOverride: session.next_training_date_override || null,
//     });
//     setSelectedTrainingNames(session.topics.map(t => t.id));
//     setTrainerInput('');
//     setVenueInput('');
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string | number) => {
//     if (!confirm('Delete this training session?')) return;
//     try {
//       const res = await fetch(`${API_BASE}/schedules/${id}/`, { method: 'DELETE' });
//       if (res.ok) await fetchSessions();
//       else alert('Failed to delete');
//     } catch {
//       alert('Error deleting');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-50 text-green-700 border border-green-200';
//       case 'cancelled':
//         return 'bg-red-50 text-red-700 border border-red-200';
//       case 'pending':
//         return 'bg-amber-50 text-amber-700 border border-amber-200';
//       default:
//         return 'bg-blue-50 text-blue-700 border border-blue-200';
//     }
//   };

//   const getRecurrenceMessage = () => {
//     if (!formData.recurrenceMonths || !formData.date) {
//       return 'Select date and recurrence interval (optional)';
//     }

//     const defaultNext = computeDefaultNextDate(formData.date, formData.recurrenceMonths);
//     const override = formData.nextRecurrenceOverride;

//     if (!defaultNext && !override) return 'Select valid date and recurrence interval';

//     if (override) {
//       return (
//         <>
//           <span className="block text-sm text-text">
//             Default next: {defaultNext ? formatDateWithWeekday(defaultNext) : 'N/A'}
//           </span>
//           <span className="block text-sm font-semibold text-purple-700">
//             Using override: {formatDateWithWeekday(override)}
//           </span>
//         </>
//       );
//     }

//     return (
//       <span className="font-semibold text-purple-700">
//         Next recurrence: {formatDateWithWeekday(defaultNext!)}
//       </span>
//     );
//   };

//   const handleRecurrenceChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
//     const value = e.target.value ? Number(e.target.value) : null;
//     setFormData(prev => {
//       const updated = { ...prev, recurrenceMonths: value };
//       if (value && updated.date) {
//         setShowRecurrenceCalendar(true);
//       } else if (value && !updated.date) {
//         alert('Please select a base training date first');
//       }
//       return updated;
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
//         <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">TNI</h1>
//             <p className="text-muted mt-2 text-lg">Organize and manage training sessions</p>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
//           >
//             <Plus className="w-5 h-5 mr-2" /> <span>Create New Training</span>
//           </button>
//         </div>

//         {showForm && (
//           <div className="bg-surface rounded-3xl shadow-xl border border-border mb-8 overflow-hidden animate-fade-in">
//             <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-8 py-6 flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-white flex items-center">
//                 <Calendar className="w-7 h-7 mr-3" /> {editingSession ? 'Edit Session' : 'Create Session'}
//               </h3>
//               <button
//                 onClick={resetForm}
//                 className="text-white/90 hover:text-white p-2 hover:bg-white/20 rounded-xl"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-8 lg:p-10 space-y-8">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <Layers className="w-5 h-5 mr-2 text-purple-600" /> Training Category{' '}
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <select
//                     value={formData.trainingCategory}
//                     onChange={e => {
//                       setFormData(prev => ({ ...prev, trainingCategory: e.target.value }));
//                       setSelectedTrainingNames([]);
//                     }}
//                     className="w-full px-5 py-4 border-2 border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-background text-text shadow-sm"
//                   >
//                     <option value="">Select Category</option>
//                     {trainingCategories.map(cat => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <Target className="w-5 h-5 mr-2 text-purple-600" /> Training Topics{' '}
//                     <span className="text-red-500 ml-1">*</span>{' '}
//                     <span className="ml-auto text-purple-700 text-sm bg-purple-50 px-3 py-1 rounded-full">
//                       {selectedTrainingNames.length} selected
//                     </span>
//                   </label>
//                   <div className="border-2 border-border rounded-2xl p-5 max-h-64 overflow-y-auto bg-background shadow-sm">
//                     {!formData.trainingCategory ? (
//                       <div className="text-center py-8 text-muted">
//                         Select a category first
//                       </div>
//                     ) : getFilteredTopics().length === 0 ? (
//                       <div className="text-center py-8 text-muted">
//                         No topics available
//                       </div>
//                     ) : (
//                       <div className="space-y-2">
//                         <label className="flex items-center space-x-3 p-3 hover:bg-surface rounded-xl cursor-pointer border-b border-border">
//                           <input
//                             type="checkbox"
//                             checked={areAllTopicsSelected()}
//                             onChange={handleSelectAllTopics}
//                             className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
//                           />
//                           <span className="font-bold text-purple-700">Select All</span>
//                         </label>
//                         {getFilteredTopics().map(topic => (
//                           <label
//                             key={topic.id}
//                             className="flex items-center space-x-3 p-3 hover:bg-surface rounded-xl cursor-pointer"
//                           >
//                             <input
//                               type="checkbox"
//                               checked={selectedTrainingNames.includes(topic.id)}
//                               onChange={() => handleTopicToggle(topic.id)}
//                               className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
//                             />
//                             <span className="text-text">{topic.topic}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <User className="w-5 h-5 mr-2 text-purple-600" /> Trainer{' '}
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   {/* Updated CreatableSelect with Styles and ClassNames */}
//                   <CreatableSelect
//                     options={trainerOptions}
//                     value={
//                       trainerOptions.find(o => String(o.value) === String(formData.trainer)) ||
//                       (formData.trainer
//                         ? { label: String(formData.trainer), value: formData.trainer }
//                         : null)
//                     }
//                     onChange={opt =>
//                       setFormData(p => ({ ...p, trainer: opt ? String(opt.value) : '' }))
//                     }
//                     onCreateOption={val => setFormData(p => ({ ...p, trainer: val }))}
//                     styles={customSelectStyles}
//                     classNames={customSelectClassNames}
//                     className="text-text"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <MapPin className="w-5 h-5 mr-2 text-purple-600" /> Venue{' '}
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   {/* Updated CreatableSelect with Styles and ClassNames */}
//                   <CreatableSelect
//                     options={venueOptions}
//                     value={
//                       venueOptions.find(o => String(o.value) === String(formData.venue)) ||
//                       (formData.venue
//                         ? { label: String(formData.venue), value: formData.venue }
//                         : null)
//                     }
//                     onChange={opt =>
//                       setFormData(p => ({ ...p, venue: opt ? String(opt.value) : '' }))
//                     }
//                     onCreateOption={val => setFormData(p => ({ ...p, venue: val }))}
//                     styles={customSelectStyles}
//                     classNames={customSelectClassNames}
//                     className="text-text"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <Calendar className="w-5 h-5 mr-2 text-purple-600" /> Date{' '}
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.date}
//                     onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
//                     className="w-full px-5 py-4 border-2 border-border bg-background text-text rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100"
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <Clock className="w-5 h-5 mr-2 text-purple-600" /> Time{' '}
//                     <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <input
//                     type="time"
//                     value={formData.time}
//                     onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
//                     className="w-full px-5 py-4 border-2 border-border bg-background text-text rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100"
//                   />
//                 </div>
//               </div>

//               <div className="border-t-2 border-border pt-8 space-y-3">
//                 <label className="flex items-center text-sm font-bold text-text">
//                   <Clock className="w-5 h-5 mr-2 text-purple-600" /> Repeat After (Months)
//                 </label>
//                 <select
//                   value={formData.recurrenceMonths ?? ''}
//                   onChange={handleRecurrenceChange}
//                   className="w-full px-5 py-4 border-2 border-border bg-background text-text rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100"
//                 >
//                   <option value="">No Recurrence</option>
//                   {[...Array(10)].map((_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {i + 1} Month{i + 1 !== 1 ? 's' : ''}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-sm text-muted mt-2">{getRecurrenceMessage()}</p>
//               </div>

//               <div className="border-t-2 border-border pt-8">
//                 <div className="flex justify-between items-center mb-6">
//                   <label className="flex items-center text-sm font-bold text-text">
//                     <Users className="w-5 h-5 mr-2 text-purple-600" /> Employees{' '}
//                     <span className="ml-3 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
//                       {formData.employees.length} selected
//                     </span>
//                   </label>
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setShowFilterModal(true)}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
//                     >
//                       <Filter className="w-4 h-4" /> Filter
//                     </button>
//                     <button
//                       onClick={handleDownloadTemplate}
//                       className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 flex items-center gap-2"
//                     >
//                       <Download className="w-4 h-4" /> Template
//                     </button>
//                     <button
//                       onClick={() => setShowCsvUpload(!showCsvUpload)}
//                       className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 flex items-center gap-2"
//                     >
//                       <Upload className="w-4 h-4" /> Upload
//                     </button>
//                   </div>
//                 </div>

//                 {showCsvUpload && (
//                   <div className="mb-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl">
//                     <div className="flex gap-4">
//                       <input
//                         type="file"
//                         ref={fileInputRef}
//                         accept=".csv"
//                         onChange={handleFileSelect}
//                         className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
//                       />
//                       <button
//                         onClick={handleCsvUpload}
//                         disabled={!csvFile}
//                         className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
//                       >
//                         Upload
//                       </button>
//                     </div>
//                     {uploadSuccess && (
//                       <p className="text-green-600 font-bold mt-2">Upload Successful!</p>
//                     )}
//                     {uploadErrors.length > 0 && (
//                       <div className="text-red-600 text-sm mt-2 font-medium">
//                         {uploadErrors.map((e, i) => (
//                           <div key={i}>• {e}</div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
//                   <input
//                     type="text"
//                     value={employeeSearch}
//                     onChange={e => {
//                       setEmployeeSearch(e.target.value);
//                       setShowEmployeeDropdown(true);
//                     }}
//                     onFocus={() => setShowEmployeeDropdown(true)}
//                     placeholder="Search employees..."
//                     className="w-full pl-12 pr-4 py-4 border-2 border-border bg-background text-text rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-100"
//                   />
//                   {showEmployeeDropdown && (
//                     <div className="absolute z-10 w-full mt-2 bg-surface border-2 border-border rounded-2xl shadow-xl max-h-60 overflow-y-auto">
//                       {getFilteredEmployeesList()
//                         .filter(e => !formData.employees.includes(e.id))
//                         .map(emp => (
//                           <div
//                             key={emp.id}
//                             onClick={() => handleEmployeeSelect(emp.id)}
//                             className="px-5 py-3 hover:bg-purple-50 cursor-pointer border-b border-border last:border-0"
//                           >
//                             <div className="font-bold text-text">{emp.name}</div>
//                             <div className="text-xs text-muted">{emp.code}</div>
//                           </div>
//                         ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap gap-2 mt-4">
//                   {formData.employees.map(empId => {
//                     const emp = employees.find(e => String(e.id) === String(empId));
//                     return (
//                       <span
//                         key={empId}
//                         className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2"
//                       >
//                         {emp?.name}{' '}
//                         <button
//                           onClick={() => handleEmployeeRemove(empId)}
//                           className="hover:text-purple-900"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-4 pt-8 border-t-2 border-border">
//                 <button
//                   onClick={resetForm}
//                   className="px-8 py-4 text-text font-bold hover:bg-background rounded-2xl"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
//                 >
//                   <Save className="w-5 h-5" /> {editingSession ? 'Update' : 'Save'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showFilterModal && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-surface rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex justify-between items-center">
//                 <h3 className="text-2xl font-bold text-white flex items-center">
//                   <Filter className="w-6 h-6 mr-2" /> Filter Employees
//                 </h3>
//                 <button
//                   onClick={resetFilterModal}
//                   className="text-white/80 hover:text-white"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//               <div className="p-8 overflow-y-auto flex-1">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div>
//                     <label className="font-bold text-sm mb-2 block text-text">Department</label>
//                     <select
//                       value={selectedDepartment || ''}
//                       onChange={e => setSelectedDepartment(Number(e.target.value))}
//                       className="w-full p-3 border border-border rounded-xl bg-background text-text"
//                     >
//                       <option value="">Select Department</option>
//                       {allDepartments.map(d => (
//                         <option key={d.department_id} value={d.department_id}>
//                           {d.department_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="font-bold text-sm mb-2 block text-text">Line</label>
//                     <select
//                       value={selectedLine || ''}
//                       disabled={!selectedDepartment}
//                       onChange={e => setSelectedLine(Number(e.target.value))}
//                       className="w-full p-3 border border-border rounded-xl bg-background text-text"
//                     >
//                       <option value="">All Lines</option>
//                       {availableLines.map(l => (
//                         <option key={l.line_id} value={l.line_id}>
//                           {l.line_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="font-bold text-sm mb-2 block text-text">Station</label>
//                     <select
//                       value={selectedStation || ''}
//                       disabled={!selectedDepartment}
//                       onChange={e => setSelectedStation(Number(e.target.value))}
//                       className="w-full p-3 border border-border rounded-xl bg-background text-text"
//                     >
//                       <option value="">All Stations</option>
//                       {availableStations.map(s => (
//                         <option key={s.station_id} value={s.station_id}>
//                           {s.station_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button
//                   onClick={fetchFilteredEmployees}
//                   className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 mb-6"
//                 >
//                   {isLoadingFiltered ? 'Loading...' : 'Search'}
//                 </button>

//                 {filteredEmployees.length > 0 && (
//                   <div className="border border-border rounded-xl overflow-hidden">
//                     <table className="w-full text-sm">
//                       <thead className="bg-background text-left text-text">
//                         <tr>
//                           <th className="p-3">
//                             <input
//                               type="checkbox"
//                               onChange={handleSelectAllFiltered}
//                               checked={
//                                 selectedFilteredEmployees.length === filteredEmployees.length &&
//                                 filteredEmployees.length > 0
//                               }
//                             />
//                           </th>
//                           <th className="p-3">ID</th>
//                           <th className="p-3">Name</th>
//                           <th className="p-3">Dept</th>
//                         </tr>
//                       </thead>
//                       <tbody className="text-text">
//                         {filteredEmployees.map(emp => (
//                           <tr
//                             key={emp.emp_id}
//                             className="border-t border-border hover:bg-background cursor-pointer"
//                             onClick={() => handleToggleFilteredEmployee(emp.emp_id)}
//                           >
//                             <td className="p-3">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedFilteredEmployees.includes(emp.emp_id)}
//                                 readOnly
//                               />
//                             </td>
//                             <td className="p-3">{emp.emp_id}</td>
//                             <td className="p-3">
//                               {emp.first_name} {emp.last_name}
//                             </td>
//                             <td className="p-3">{emp.department?.department_name}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//               <div className="p-6 border-t border-border bg-surface flex justify-end gap-4">
//                 <button
//                   onClick={resetFilterModal}
//                   className="px-6 py-3 text-text font-bold"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddFilteredEmployees}
//                   disabled={selectedFilteredEmployees.length === 0}
//                   className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
//                 >
//                   Add Selected ({selectedFilteredEmployees.length})
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showRecurrenceCalendar && formData.date && formData.recurrenceMonths && (
//           <RecurrenceCalendarModal
//             baseDate={formData.date}
//             months={formData.recurrenceMonths}
//             currentOverride={formData.nextRecurrenceOverride}
//             onClose={() => setShowRecurrenceCalendar(false)}
//             onConfirm={newDate => {
//               setFormData(prev => ({ ...prev, nextRecurrenceOverride: newDate }));
//               setShowRecurrenceCalendar(false);
//             }}
//           />
//         )}

//         <div className="bg-surface rounded-3xl shadow-xl border border-border overflow-hidden">
//           <div className="px-8 py-6 bg-surface border-b border-border flex justify-between items-center">
//             <h3 className="text-xl font-bold text-text">Scheduled Sessions</h3>
//             <button
//               onClick={fetchSessions}
//               className="text-text hover:text-muted"
//             >
//               <Upload className="w-5 h-5" />
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-background text-left text-xs font-bold text-text uppercase">
//                 <tr>
//                   <th className="px-6 py-4">Category & Topics</th>
//                   <th className="px-6 py-4">Trainer</th>
//                   <th className="px-6 py-4">Schedule</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-border text-sm bg-surface">
//                 {trainingSessions.map(session => (
//                   <tr key={session.id} className="hover:bg-background transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="font-bold text-purple-600 mb-1">
//                         {session.training_category.name}
//                       </div>
//                       <div className="flex flex-wrap gap-1">                       {session.topics.map(t => (
//                           <span
//                             key={t.id}
//                             className="bg-background text-text px-2 py-0.5 rounded text-xs border border-border"
//                           >
//                             {t.topic}
//                           </span>
//                         ))}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="font-medium text-text">{session.trainer.name}</div>
//                       <div className="text-muted text-xs">{session.venue.name}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="font-medium text-text">{session.date}</div>
//                       <div className="text-muted">{session.time}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
//                           session.status
//                         )}`}
//                       >
//                         {session.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 flex gap-2">
//                       <button
//                         onClick={() => handleEdit(session)}
//                         className="p-2 hover:bg-blue-50 text-blue-600 rounded"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(session.id)}
//                         className="p-2 hover:bg-red-50 text-red-600 rounded"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {trainingSessions.length === 0 && (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-10 text-center text-muted">
//                       No sessions scheduled yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Scheduling;    





import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Search,
  Download,
  Upload,
  Filter,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  Layers,
  Target,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import CreatableSelect from 'react-select/creatable';

const API_BASE = 'http://localhost:8000';

// --- INTERFACES ---
interface Department {
  department_id: number;
  department_name: string;
}

interface Line {
  line_id: number;
  line_name: string;
}

interface Station {
  station_id: number;
  station_name: string;
}

interface HierarchyStructure {
  structure_id: number;
  structure_name: string;
  department: number;
  department_name: string;
  line: number | null;
  line_name: string | null;
  subline: number | null;
  station: number | null;
  station_name: string | null;
}

interface FilteredEmployee {
  emp_id: string;
  first_name: string;
  last_name: string;
  department: Department | null;
  current_line: Line | null;
  current_station: Station | null;
  email: string;
  phone: string;
}

interface RecurrenceInterval {
  id: number;
  interval_months: number;
  is_active: boolean;
}

interface TrainingCategory {
  id: string | number;
  name: string;
}

interface TrainingTopic {
  id: string | number;
  category: any;
  topic: string;
  description: string;
}

interface Trainer {
  id: string | number;
  name: string;
}

interface Venue {
  id: string | number;
  name: string;
}

interface Employee {
  id: string;
  code: string;
  name: string;
}

interface BackendEmployee {
  id?: string;
  emp_id?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  employee_code?: string;
}

interface TrainingSession {
  id: string | number;
  training_category: TrainingCategory;
  topics: TrainingTopic[];
  trainer: Trainer;
  venue: Venue;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  date: string;
  time: string;
  employees: BackendEmployee[];
  is_recurring?: boolean;
  recurrence_months?: number | null;
  next_training_date_override?: string | null;
}

// --- HELPERS ---
function formatDateWithWeekday(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function computeDefaultNextDate(baseDate: string, months: number): string | null {
  if (!baseDate || !months) return null;
  const d = new Date(baseDate);
  if (Number.isNaN(d.getTime())) return null;
  const next = new Date(d);
  next.setMonth(d.getMonth() + months);
  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// --- RECURRENCE CALENDAR MODAL ---
interface RecurrenceCalendarModalProps {
  baseDate: string;
  months: number;
  currentOverride: string | null;
  onClose: () => void;
  onConfirm: (selectedDate: string) => void;
}

const RecurrenceCalendarModal: React.FC<RecurrenceCalendarModalProps> = ({
  baseDate,
  months,
  currentOverride,
  onClose,
  onConfirm,
}) => {
  const defaultDateStr = currentOverride || computeDefaultNextDate(baseDate, months) || baseDate;
  const initialDate = new Date(defaultDateStr);
  const initialYear = Number.isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear();
  const initialMonth = Number.isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth();

  const [view, setView] = useState({ year: initialYear, month: initialMonth });
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(view.year, view.month, 1).getDay();

  const goMonth = (delta: number) => {
    setView(prev => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const handleDayClick = (day: number) => {
    const yyyy = view.year;
    const mm = String(view.month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  };

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const renderDays = () => {
    const cells: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`empty-${i}`} className="h-12 border border-border bg-background" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const yyyy = view.year;
      const mm = String(view.month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const ds = `${yyyy}-${mm}-${dd}`;
      const isSelected = selectedDate === ds;
      const isDefault = defaultDateStr === ds;

      cells.push(
        <button
          type="button"
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-12 border border-border flex items-center justify-center text-sm font-medium transition-colors
            ${isSelected ? 'bg-purple-600 text-white' : 'bg-surface text-text hover:bg-purple-50'}
          `}
        >
          <div className="flex flex-col items-center">
            <span>{day}</span>
            {isDefault && !isSelected && (
              <span className="mt-0.5 text-[10px] text-purple-500 font-bold">default</span>
            )}
          </div>
        </button>
      );
    }
    return cells;
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" /> Adjust Next Recurrence Date
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-background text-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => goMonth(-1)} className="p-2 rounded-lg hover:bg-background text-text"><ChevronLeft /></button>
          <div className="font-semibold text-text">{monthLabel}</div>
          <button onClick={() => goMonth(1)} className="p-2 rounded-lg hover:bg-background text-text"><ChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 border border-border rounded-lg overflow-hidden mb-4">{renderDays()}</div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-border text-text rounded-xl">Cancel</button>
          <button onClick={() => onConfirm(selectedDate)} className="px-5 py-2 bg-purple-600 text-white rounded-xl">Confirm Date</button>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const customSelectStyles = {
  control: (base: any) => ({ ...base, backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none' }),
  menu: (base: any) => ({ ...base, backgroundColor: 'transparent', zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
    color: state.isSelected ? 'white' : 'inherit',
  }),
  singleValue: (base: any) => ({ ...base, color: 'inherit' }),
};

const customSelectClassNames = {
  control: (state: any) => `!bg-background !border-2 ${state.isFocused ? '!border-purple-500' : '!border-border'} !rounded-2xl !text-text`,
  menu: () => "!bg-surface !border !border-border !rounded-xl !mt-2 !shadow-xl !text-text",
  option: () => "!text-text",
  placeholder: () => "!text-muted",
};

const Scheduling: React.FC = () => {
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [trainingCategories, setTrainingCategories] = useState<TrainingCategory[]>([]);
  const [trainingTopics, setTrainingTopics] = useState<TrainingTopic[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  
  // Bulk Excel Upload State
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [excelUploadErrors, setExcelUploadErrors] = useState<string[]>([]);
  const scheduleFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    trainingCategory: '' as string | number,
    trainer: '' as string | number,
    venue: '' as string | number,
    date: '',
    time: '',
    employees: [] as string[],
    status: 'scheduled' as any,
    recurrenceMonths: null as number | null,
    nextRecurrenceOverride: null as string | null,
  });

  const [selectedTrainingNames, setSelectedTrainingNames] = useState<(string | number)[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [showRecurrenceCalendar, setShowRecurrenceCalendar] = useState(false);

  // Hierarchy/Filter States
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [hierarchyData, setHierarchyData] = useState<HierarchyStructure[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [availableLines, setAvailableLines] = useState<Line[]>([]);
  const [availableStations, setAvailableStations] = useState<Station[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<FilteredEmployee[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilteredEmployees, setSelectedFilteredEmployees] = useState<string[]>([]);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchCategories(),
        fetchAllTopics(),
        fetchTrainers(),
        fetchVenues(),
        fetchEmployees(),
        fetchSessions(),
        fetchHierarchyData()
      ]);
    };
    init();
  }, []);

  // --- API FETCHES ---
  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/schedules/`);
      if (res.ok) setTrainingSessions(await res.json());
    } catch {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/training-categories/`);
      if (res.ok) setTrainingCategories(await res.json());
    } catch {}
  };

  const fetchAllTopics = async () => {
    try {
      const res = await fetch(`${API_BASE}/curriculums/`);
      if (res.ok) setTrainingTopics(await res.json());
    } catch {}
  };

  const fetchTrainers = async () => {
    try {
      const res = await fetch(`${API_BASE}/trainer_name/`);
      if (res.ok) setTrainers(await res.json());
    } catch {}
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch(`${API_BASE}/venues/`);
      if (res.ok) setVenues(await res.json());
    } catch {}
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/mastertable/`);
      const raw = await res.json();
      const rows = Array.isArray(raw) ? raw : raw?.results ?? [];
      setEmployees(rows.map((emp: any) => ({
        id: String(emp.emp_id),
        name: `${emp.first_name} ${emp.last_name}`.trim() || String(emp.emp_id),
        code: String(emp.emp_id)
      })));
    } catch {}
  };

  const fetchHierarchyData = async () => {
    try {
      const res = await fetch(`${API_BASE}/hierarchy/all-departments/`);
      if (!res.ok) return;
      const departments = await res.json();
      setAllDepartments(departments.map((d: any) => ({ department_id: d.department_id, department_name: d.department_name })));
      // Note: Flattening logic omitted for brevity, reuse your existing logic here
    } catch {}
  };

  // --- HANDLERS ---
  const handleScheduleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    setIsUploadingExcel(true);
    setExcelUploadErrors([]);

    try {
      const res = await fetch(`${API_BASE}/schedules/upload-excel/`, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      
      if (res.ok || res.status === 207) {
        alert(data.message || 'Schedules processed.');
        if (data.errors) setExcelUploadErrors(data.errors);
        fetchSessions();
      } else {
        alert(`Upload failed: ${data.error}`);
      }
    } catch {
      alert('Error uploading schedules.');
    } finally {
      setIsUploadingExcel(false);
      if (scheduleFileInputRef.current) scheduleFileInputRef.current.value = '';
    }
  };

  const handleDownloadScheduleTemplate = () => {
    window.open(`${API_BASE}/schedules/download-template/`, '_blank');
  };

  const handleSubmit = async () => {
    const payload = {
      training_category_id: formData.trainingCategory,
      topic_ids: selectedTrainingNames,
      trainer_id: formData.trainer,
      venue_id: formData.venue,
      status: formData.status,
      date: formData.date,
      time: formData.time,
      employee_ids: formData.employees,
      recurrence_months: formData.recurrenceMonths,
      next_training_date_override: formData.nextRecurrenceOverride
    };

    try {
      const method = editingSession ? 'PUT' : 'POST';
      const url = editingSession ? `${API_BASE}/schedules/${editingSession.id}/` : `${API_BASE}/schedules/`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Success!');
        resetForm();
        fetchSessions();
      }
    } catch { alert('Error saving.'); }
  };

  const resetForm = () => {
    setFormData({
      trainingCategory: '', trainer: '', venue: '', date: '', time: '',
      employees: [], status: 'scheduled', recurrenceMonths: null, nextRecurrenceOverride: null
    });
    setSelectedTrainingNames([]);
    setShowForm(false);
    setEditingSession(null);
  };

  const handleEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setFormData({
      trainingCategory: session.training_category?.id || '',
      trainer: session.trainer?.id || '',
      venue: session.venue?.id || '',
      date: session.date,
      time: session.time,
      employees: session.employees.map((emp: any) => String(emp.emp_id || emp.id)),
      status: session.status,
      recurrenceMonths: session.recurrence_months || null,
      nextRecurrenceOverride: session.next_training_date_override || null,
    });
    setSelectedTrainingNames(session.topics.map(t => t.id));
    setShowForm(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Delete?')) return;
    await fetch(`${API_BASE}/schedules/${id}/`, { method: 'DELETE' });
    fetchSessions();
  };

  return (
    <div className="min-h-screen bg-background text-text p-6 lg:p-10">
      {/* HEADER */}
      <div className="max-w-[1600px] mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-7xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">TNI</h1>
          <p className="text-muted text-xl mt-2 font-medium">Training Needs Identification & Scheduling</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input type="file" ref={scheduleFileInputRef} onChange={handleScheduleExcelUpload} className="hidden" accept=".xlsx,.xls" />
          
          <button 
            onClick={handleDownloadScheduleTemplate}
            className="px-6 py-4 bg-surface border-2 border-border rounded-2xl font-bold flex items-center gap-2 hover:bg-background transition-all"
          >
            <Download className="w-5 h-5 text-purple-500" /> Template
          </button>

          <button 
            onClick={() => scheduleFileInputRef.current?.click()}
            disabled={isUploadingExcel}
            className="px-6 py-4 bg-surface border-2 border-purple-500 text-purple-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-purple-50 transition-all disabled:opacity-50"
          >
            <Upload className="w-5 h-5" /> {isUploadingExcel ? 'Uploading...' : 'Bulk Upload Excel'}
          </button>

          <button 
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-6 h-6" /> Create New
          </button>
        </div>
      </div>

      {/* EXCEL UPLOAD ERRORS */}
      {excelUploadErrors.length > 0 && (
        <div className="max-w-[1600px] mx-auto mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <AlertCircle className="w-5 h-5" /> Upload Warnings / Errors
          </div>
          <div className="text-sm text-red-600 space-y-1 max-h-32 overflow-y-auto">
            {excelUploadErrors.map((err, i) => <div key={i}>• {err}</div>)}
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      {showForm && (
        <div className="max-w-[1600px] mx-auto mb-12 bg-surface rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 flex justify-between items-center text-white">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8" /> {editingSession ? 'Edit Schedule' : 'New Schedule'}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-white/20 rounded-full"><X className="w-8 h-8" /></button>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2"><Layers className="w-4 h-4 text-purple-500" /> Category</label>
              <select 
                value={formData.trainingCategory} 
                onChange={e => setFormData({...formData, trainingCategory: e.target.value})}
                className="w-full p-4 bg-background border-2 border-border rounded-2xl outline-none focus:border-purple-500"
              >
                <option value="">Select Category</option>
                {trainingCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Topics Multi-Select (Simplified) */}
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2"><Target className="w-4 h-4 text-purple-500" /> Topics</label>
              <div className="p-4 bg-background border-2 border-border rounded-2xl h-40 overflow-y-auto space-y-2">
                {trainingTopics.filter(t => String(t.category?.id) === String(formData.trainingCategory)).map(t => (
                  <label key={t.id} className="flex items-center gap-3 cursor-pointer hover:text-purple-600">
                    <input 
                      type="checkbox" 
                      checked={selectedTrainingNames.includes(t.id)} 
                      onChange={() => setSelectedTrainingNames(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                    />
                    {t.topic}
                  </label>
                ))}
              </div>
            </div>

            {/* Trainer & Venue using React-Select-Creatable */}
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2"><User className="w-4 h-4 text-purple-500" /> Trainer</label>
              <CreatableSelect 
                options={trainers.map(t => ({ value: t.id, label: t.name }))}
                value={formData.trainer ? { value: formData.trainer, label: trainers.find(t => t.id === formData.trainer)?.name || formData.trainer } : null}
                onChange={(opt: any) => setFormData({...formData, trainer: opt?.value})}
                styles={customSelectStyles} classNames={customSelectClassNames}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-500" /> Venue</label>
              <CreatableSelect 
                options={venues.map(v => ({ value: v.id, label: v.name }))}
                value={formData.venue ? { value: formData.venue, label: venues.find(v => v.id === formData.venue)?.name || formData.venue } : null}
                onChange={(opt: any) => setFormData({...formData, venue: opt?.value})}
                styles={customSelectStyles} classNames={customSelectClassNames}
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-bold">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-4 bg-background border-2 border-border rounded-2xl" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold">Time</label>
                <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full p-4 bg-background border-2 border-border rounded-2xl" />
              </div>
            </div>

            {/* Recurrence */}
            <div className="space-y-3">
              <label className="text-sm font-bold">Repeat After (Months)</label>
              <select 
                value={formData.recurrenceMonths || ''} 
                onChange={e => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setFormData({...formData, recurrenceMonths: val});
                  if (val && formData.date) setShowRecurrenceCalendar(true);
                }}
                className="w-full p-4 bg-background border-2 border-border rounded-2xl"
              >
                <option value="">No Recurrence</option>
                {[1,2,3,6,12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          <div className="p-8 bg-background/50 border-t border-border flex justify-end gap-4">
            <button onClick={resetForm} className="px-8 py-3 font-bold text-muted hover:text-text">Cancel</button>
            <button onClick={handleSubmit} className="px-12 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg hover:bg-purple-700">Save Schedule</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="max-w-[1600px] mx-auto bg-surface rounded-3xl shadow-xl border border-border overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-6 text-left text-xs font-black uppercase text-muted tracking-widest">Category & Topics</th>
              <th className="p-6 text-left text-xs font-black uppercase text-muted tracking-widest">Trainer & Venue</th>
              <th className="p-6 text-left text-xs font-black uppercase text-muted tracking-widest">Schedule</th>
              <th className="p-6 text-left text-xs font-black uppercase text-muted tracking-widest">Status</th>
              <th className="p-6 text-right text-xs font-black uppercase text-muted tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {trainingSessions.map(session => (
              <tr key={session.id} className="hover:bg-background/50 transition-colors group">
                <td className="p-6">
                  <div className="font-bold text-purple-600 mb-2">{session.training_category.name}</div>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map(t => (
                      <span key={t.id} className="px-2 py-1 bg-background border border-border rounded-md text-[10px] font-bold">{t.topic}</span>
                    ))}
                  </div>
                </td>
                <td className="p-6">
                  <div className="font-bold">{session.trainer.name}</div>
                  <div className="text-sm text-muted">{session.venue.name}</div>
                </td>
                <td className="p-6">
                  <div className="font-bold">{session.date}</div>
                  <div className="text-sm text-muted">{session.time}</div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {session.status}
                  </span>
                </td>
                <td className="p-6 text-right space-x-2">
                  <button onClick={() => handleEdit(session)} className="p-2 hover:bg-purple-100 rounded-lg text-purple-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(session.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recurrence Modal */}
      {showRecurrenceCalendar && formData.date && formData.recurrenceMonths && (
        <RecurrenceCalendarModal 
          baseDate={formData.date} 
          months={formData.recurrenceMonths} 
          currentOverride={formData.nextRecurrenceOverride}
          onClose={() => setShowRecurrenceCalendar(false)}
          onConfirm={d => { setFormData({...formData, nextRecurrenceOverride: d}); setShowRecurrenceCalendar(false); }}
        />
      )}
    </div>
  );
};

export default Scheduling;