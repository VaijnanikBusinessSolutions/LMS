// import React, { useState, useMemo, useEffect } from "react";
// import type { RootState } from "../../../store/store";
// import {
//   Search,
//   Plus,
//   Mail,
//   Users,
//   Shield,
//   Star,
//   X,
//   BadgeCheck,
//   Briefcase,
//   LayoutGrid,
//   Building2,
//   Loader2,
//   Sparkles,
//   UserPlus,
//   ChevronRight,
//   Check,
//   Lock,
//   User,
//   Hash,
//   MapPin,
//   Layers,
//   Crown,
//   Zap,
//   Filter,
//   RotateCcw,
//   UserCircle,
//   Building,
//   Award,
//   Download,
//   FileUp
// } from "lucide-react";
// import { useSelector } from "react-redux";

// // --- INTERFACES ---
// interface Employee {
//   id: string;
//   first_name: string;
//   last_name?: string; // Optional
//   employeeid: string;
//   email: string;
//   business_unit: string;
//   department: string;
//   section?: string;
//   role_name: string;
//   hq?: string;
//   designation?: string;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// interface OrgItem {
//   id: number;
//   name: string;
//   org_type: 'hq' | 'bu' | 'dept' | 'section' | 'designation';
//   location: string;
//   parent: number | null;
//   parent_name?: string;
// }

// // Enhanced Select Component
// const EnhancedFormSelect = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
//   placeholder,
//   icon: Icon,
//   required = false,
//   disabled = false,
//   hint = ""
// }: {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   options: { id: number | string; name: string }[];
//   placeholder: string;
//   icon: any;
//   required?: boolean;
//   disabled?: boolean;
//   hint?: string;
// }) => (
//   <div className={`transition-all duration-300 ${disabled ? 'opacity-50' : ''}`}>
//     <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
//       <Icon size={16} className="text-indigo-500" />
//       {label}
//       {required && <span className="text-rose-500">*</span>}
//       {hint && <span className="text-slate-400 text-xs font-normal">({hint})</span>}
//     </label>
//     <div className="relative group">
//       <select
//         name={name}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required={required}
//         className={`w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 appearance-none font-medium cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 disabled:cursor-not-allowed disabled:hover:border-slate-200`}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((opt) => (
//           <option key={opt.id} value={opt.name}>{opt.name}</option>
//         ))}
//       </select>
//       <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none group-hover:text-indigo-500 transition-colors" />
//     </div>
//   </div>
// );

// // Enhanced Input Component
// const EnhancedFormInput = ({
//   label,
//   name,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   icon: Icon,
//   required = false
// }: {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   placeholder: string;
//   icon: any;
//   required?: boolean;
// }) => (
//   <div>
//     <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
//       <Icon size={16} className="text-indigo-500" />
//       {label}
//       {required && <span className="text-rose-500">*</span>}
//     </label>
//     <div className="relative group">
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={placeholder}
//         className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 font-medium placeholder:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
//       />
//     </div>
//   </div>
// );

// const EmployeeTable: React.FC = () => {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);

//   // Org Structure State
//   const [orgHqs, setOrgHqs] = useState<OrgItem[]>([]);
//   const [orgBusinessUnits, setOrgBusinessUnits] = useState<OrgItem[]>([]);
//   const [orgDepartments, setOrgDepartments] = useState<OrgItem[]>([]);
//   const [orgSections, setOrgSections] = useState<OrgItem[]>([]);
//   const [orgDesignations, setOrgDesignations] = useState<OrgItem[]>([]);
  
//   // Loading States
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false); // FIXED: Added submitting state
//   const [isUploading, setIsUploading] = useState(false);

//   const accessToken = useSelector((state: RootState) => state.auth.accessToken);

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Form Data
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     employeeid: "",
//     email: "",
//     role: "",
//     hq: "",
//     business_unit: "",
//     department: "",
//     section: "",
//     designation: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   // --- FETCH DATA ---
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = { Authorization: `Bearer ${accessToken}` };

//         const [rolesRes, usersRes, orgRes] = await Promise.all([
//           fetch("http://127.0.0.1:8000/roles/", { headers }),
//           fetch("http://127.0.0.1:8000/users/", { headers }),
//           fetch("http://127.0.0.1:8000/lms/organization/", { headers })
//         ]);

//         if (rolesRes.ok) setRoles(await rolesRes.json());

//         if (usersRes.ok) {
//           const users = await usersRes.json();
//           const formattedUsers = users.map((u: any) => ({
//             id: String(u.id),
//             first_name: u.first_name,
//             last_name: u.last_name || "",
//             employeeid: u.employeeid,
//             email: u.email,
//             role_name: u.role_name || u.role?.name || (typeof u.role === 'string' ? u.role : ""),
//             business_unit: u.business_unit || "",
//             department: u.department?.department_name || u.department || "",
//             section: u.section || "",
//             designation: u.designation || ""
//           }));
//           setEmployees(formattedUsers);
//         }

//         // Process Org Structure
//         if (orgRes.ok) {
//           const orgData: OrgItem[] = await orgRes.json();

//           setOrgHqs(orgData.filter(item => item.org_type === 'hq'));
//           setOrgBusinessUnits(orgData.filter(item => item.org_type === 'bu'));
//           setOrgDepartments(orgData.filter(item => item.org_type === 'dept'));
//           setOrgSections(orgData.filter(item => item.org_type === 'section'));
//           setOrgDesignations(orgData.filter(item => item.org_type === 'designation'));
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     if (accessToken) {
//       fetchData();
//     }
//   }, [accessToken]);

//   // --- EXCEL ACTIONS ---
//   const downloadTemplate = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/bulk-employees/", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = "Employee_Import_Template.xlsx";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       alert("Error downloading template");
//     }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const fileFormData = new FormData();
//     fileFormData.append('file', file);

//     try {
//       setIsUploading(true);
//       const response = await fetch("http://127.0.0.1:8000/bulk-employees/", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${accessToken}` },
//         body: fileFormData,
//       });
//       const result = await response.json();
//       if (response.ok) {
//         alert(result.message);
//         window.location.reload();
//       } else {
//         alert("Import failed. Check console for details.");
//         console.error(result.errors);
//       }
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // --- CASCADING LOGIC (HIERARCHY) ---
//   const selectedHqId = useMemo(() => {
//     const hq = orgHqs.find(h => h.name === formData.hq);
//     return hq ? hq.id : null;
//   }, [formData.hq, orgHqs]);

//   const availableBusinessUnits = useMemo(() => {
//     if (!selectedHqId) return orgBusinessUnits;
//     return orgBusinessUnits.filter(bu => bu.parent === selectedHqId);
//   }, [selectedHqId, orgBusinessUnits]);

//   const selectedBuId = useMemo(() => {
//     const bu = orgBusinessUnits.find(b => b.name === formData.business_unit);
//     return bu ? bu.id : null;
//   }, [formData.business_unit, orgBusinessUnits]);

//   const availableDepartments = useMemo(() => {
//     if (!selectedBuId) return [];
//     return orgDepartments.filter(dept => dept.parent === selectedBuId);
//   }, [selectedBuId, orgDepartments]);

//   const selectedDeptId = useMemo(() => {
//     const dept = orgDepartments.find(d => d.name === formData.department);
//     return dept ? dept.id : null;
//   }, [formData.department, orgDepartments]);

//   const availableSections = useMemo(() => {
//     if (!selectedDeptId) return [];
//     return orgSections.filter(sec => sec.parent === selectedDeptId);
//   }, [selectedDeptId, orgSections]);


//   // --- TABLE FILTERING LOGIC ---
//   const uniqueDepartments = useMemo(() => [...new Set(employees.map((emp) => emp.department))].filter(Boolean).sort(), [employees]);
//   const uniqueBusinessUnits = useMemo(() => [...new Set(employees.map((emp) => emp.business_unit))].filter(Boolean).sort(), [employees]);

//   const filteredEmployees = useMemo(() => {
//     return employees.filter((employee) => {
//       const matchesSearch =
//         searchTerm === "" ||
//         employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (employee.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.employeeid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         `${employee.first_name} ${employee.last_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.role_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         employee.designation?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesDepartment = selectedDepartment === "" || employee.department === selectedDepartment;
//       const matchesBusinessUnit = selectedBusinessUnit === "" || employee.business_unit === selectedBusinessUnit;
//       const matchesRole = selectedRole === "" || employee.role_name === selectedRole;

//       return matchesSearch && matchesDepartment && matchesBusinessUnit && matchesRole;
//     });
//   }, [employees, searchTerm, selectedDepartment, selectedBusinessUnit, selectedRole]);

//   const activeFiltersCount = [selectedDepartment, selectedBusinessUnit, selectedRole].filter(Boolean).length;

//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setSelectedDepartment("");
//     setSelectedBusinessUnit("");
//     setSelectedRole("");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     setFormData((prev) => {
//       const newData = { ...prev, [name]: value };

//       // Cascading Resets
//       if (name === 'hq') {
//         newData.business_unit = "";
//         newData.department = "";
//         newData.section = "";
//       } else if (name === 'business_unit') {
//         newData.department = "";
//         newData.section = "";
//       } else if (name === 'department') {
//         newData.section = "";
//       }

//       return newData;
//     });

//     if (formErrors[name]) {
//       setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // --- SUBMIT LOGIC WITH VALIDATION (FIXED) ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // FIXED: Prevent double submission
//     if (isSubmitting) return;

//     // 1. Password Check
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // 2. MANDATORY FIELDS VALIDATION
//     const errors: Record<string, string> = {};
//     let hasError = false;

//     if (!formData.role) {
//       errors.role = "System Role is required.";
//       hasError = true;
//     }
//     if (!formData.hq) {
//       errors.hq = "HQ Location is required.";
//       hasError = true;
//     }
//     if (!formData.business_unit) {
//       errors.business_unit = "Business Unit is required.";
//       hasError = true;
//     }
//     if (!formData.department) {
//       errors.department = "Department is required.";
//       hasError = true;
//     }

//     if (hasError) {
//       setFormErrors(errors);
//       alert("Please fill in all mandatory fields: Role, HQ, Business Unit, and Department.");
//       return; 
//     }

//     // FIXED: Start loading
//     setIsSubmitting(true);

//     // 3. Prepare Payload
//     const payload = {
//       ...formData,
//       hq: formData.hq, 
//       // Ensure last_name is an empty string if undefined (Matches backend allow_blank=True)
//       last_name: formData.last_name || "" 
//     };

//     console.log("Submitting Payload:", payload);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/register/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const formattedUser: Employee = {
//           id: data.id ? String(data.id) : formData.employeeid,
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           employeeid: formData.employeeid,
//           email: formData.email,
//           role_name: roles.find(r => r.name === formData.role)?.name || formData.role,
//           business_unit: formData.business_unit,
//           department: formData.department,
//           section: formData.section,
//           designation: formData.designation
//         };

//         setEmployees((prev) => [...prev, formattedUser]);
//         setIsModalOpen(false);
//         setFormData({
//           first_name: "", last_name: "", employeeid: "", email: "", role: "", hq: "",
//           business_unit: "", department: "", section: "", designation: "", password: "", confirmPassword: ""
//         });
//         setFormErrors({});
//         alert("Employee added successfully!");
//       } else {
//         console.error("Registration Failed:", data);
//         setFormErrors(data.errors || {});
//         // Create a readable error message from the object
//         let errorMsg = "Registration Failed";
//         if (data.errors) {
//             errorMsg = Object.entries(data.errors)
//                 .map(([key, val]) => `${key}: ${val}`)
//                 .join('\n');
//         } else if (data.message) {
//             errorMsg = data.message;
//         }
//         alert(errorMsg);
//       }
//     } catch (error) {
//       console.error("Error adding employee:", error);
//       alert("Something went wrong while adding employee.");
//     } finally {
//       // FIXED: Stop loading
//       setIsSubmitting(false);
//     }
//   };

//   const getInitials = (firstName: string, lastName?: string) => {
//     return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
//   };

//   const getAvatarGradient = (name: string) => {
//     const gradients = [
//       "from-indigo-500 to-violet-600",
//       "from-rose-500 to-pink-600",
//       "from-emerald-500 to-teal-600",
//       "from-amber-500 to-orange-600",
//       "from-sky-500 to-cyan-600",
//       "from-fuchsia-500 to-purple-600",
//     ];
//     const index = (name?.length || 0) % gradients.length;
//     return gradients[index];
//   };

//   const getDepartmentColor = (department: string) => {
//     const colors = [
//       "from-blue-100 to-indigo-100 text-blue-700 border-blue-200 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 dark:border-blue-700",
//       "from-purple-100 to-violet-100 text-purple-700 border-purple-200 dark:from-purple-900/40 dark:to-violet-900/40 dark:text-purple-300 dark:border-purple-700",
//       "from-pink-100 to-rose-100 text-pink-700 border-pink-200 dark:from-pink-900/40 dark:to-rose-900/40 dark:text-pink-300 dark:border-pink-700",
//       "from-orange-100 to-amber-100 text-orange-700 border-orange-200 dark:from-orange-900/40 dark:to-amber-900/40 dark:text-orange-300 dark:border-orange-700",
//       "from-green-100 to-emerald-100 text-green-700 border-green-200 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300 dark:border-green-700",
//       "from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200 dark:from-indigo-900/40 dark:to-blue-900/40 dark:text-indigo-300 dark:border-indigo-700",
//     ];
//     if (!department) return "from-slate-100 to-gray-100 text-slate-500 border-slate-200 dark:from-slate-800 dark:to-gray-800 dark:text-slate-400 dark:border-slate-700";
//     const index = department.length % colors.length;
//     return colors[index];
//   };

//   // --- LOADING STATE ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center transition-colors">
//         <div className="text-center">
//           <div className="relative mb-8">
//             <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//             <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl">
//               <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
//             </div>
//           </div>
//           <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Loading Organization</h3>
//           <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching employee data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-100/50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-violet-950/50 transition-colors duration-500">

//       {/* Custom Styles */}
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a5b4fc, #818cf8); }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float { animation: float 3s ease-in-out infinite; }
//       `}</style>

//       {/* Background Decorations */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-full blur-3xl opacity-40 animate-float"></div>
//         <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-30"></div>
//       </div>

//       <div className="relative z-10 p-4 md:p-4 lg:p-4">
//         <div className="w-full space-y-10">

//           {/* HEADER SECTION */}
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//             <div>
//               <h1 className="text-4xl font-black text-slate-900 dark:text-white">Employee Directory</h1>
//               <p className="text-slate-500 font-medium mt-2">Manage your organization's workforce</p>
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={downloadTemplate}
//                 className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold shadow-sm hover:bg-indigo-50 transition-all"
//               >
//                 <Download size={20} /> Template
//               </button>

//               <label className="cursor-pointer flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
//                 <FileUp size={20} /> {isUploading ? "Uploading..." : "Import Excel"}
//                 <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} />
//               </label>

//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
//               >
//                 <UserPlus size={20} /> Add Employee
//               </button>
//             </div>
//           </div>

//           {/* SEARCH AND FILTER SECTION */}
//           <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border-2 border-white/50 dark:border-slate-800 p-4 transition-colors">

//             {/* Search Bar */}
//             <div className="mb-8">
//               <div className="relative group">
//                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
//                 <div className="relative">
//                   <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-7 h-7 group-focus-within:text-indigo-500 transition-colors duration-200" />
//                   <input
//                     type="text"
//                     placeholder="Search by name, ID, role, designation..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-16 pr-8 py-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all duration-300 text-xl font-medium placeholder-slate-400 dark:placeholder-slate-500 shadow-xl hover:shadow-2xl"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Filter Section */}
//             <div className="flex flex-col lg:flex-row gap-6 items-end">
//               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">

//                 {/* Business Unit Filter */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
//                     <Briefcase size={16} className="text-orange-500" />
//                     Business Unit
//                   </label>
//                   <div className="relative group">
//                     <select
//                       value={selectedBusinessUnit}
//                       onChange={(e) => setSelectedBusinessUnit(e.target.value)}
//                       className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium cursor-pointer appearance-none"
//                     >
//                       <option value="">All Business Units</option>
//                       {uniqueBusinessUnits.map((bu, i) => <option key={i} value={bu}>{bu}</option>)}
//                     </select>
//                     <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 rotate-90 pointer-events-none" />
//                   </div>
//                 </div>

//                 {/* Department Filter */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
//                     <Layers size={16} className="text-violet-500" />
//                     Department
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={selectedDepartment}
//                       onChange={(e) => setSelectedDepartment(e.target.value)}
//                       className="w-full p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium cursor-pointer appearance-none"
//                     >
//                       <option value="">All Departments</option>
//                       {uniqueDepartments.map((d, i) => <option key={i} value={d}>{d}</option>)}
//                     </select>
//                     <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 rotate-90 pointer-events-none" />
//                   </div>
//                 </div>

//                 {/* Role Filter */}
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
//                     <Shield size={16} className="text-emerald-500" />
//                     System Role
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={selectedRole}
//                       onChange={(e) => setSelectedRole(e.target.value)}
//                       className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium cursor-pointer appearance-none"
//                     >
//                       <option value="">All Roles</option>
//                       {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
//                     </select>
//                     <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 rotate-90 pointer-events-none" />
//                   </div>
//                 </div>
//               </div>

//               {/* Filter Stats & Clear */}
//               <div className="flex items-center gap-4">
//                 {activeFiltersCount > 0 && (
//                   <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
//                     <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{activeFiltersCount}</span>
//                     <span className="text-slate-500 dark:text-slate-400 font-medium ml-2">active</span>
//                   </div>
//                 )}
//                 <button
//                   onClick={clearAllFilters}
//                   disabled={!searchTerm && activeFiltersCount === 0}
//                   className="flex items-center gap-2 px-6 py-4 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-bold border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-800 disabled:opacity-30 disabled:pointer-events-none"
//                 >
//                   <RotateCcw size={18} />
//                   Clear All
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* STATS ROW */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//               { label: 'Total Employees', value: employees.length, icon: Users, color: 'indigo' },
//               { label: 'Departments', value: uniqueDepartments.length, icon: Layers, color: 'violet' },
//               { label: 'Business Units', value: uniqueBusinessUnits.length, icon: Briefcase, color: 'amber' },
//               { label: 'Roles', value: roles.length, icon: Shield, color: 'emerald' },
//             ].map((stat, idx) => (
//               <div key={idx} className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-${stat.color}-100 dark:border-${stat.color}-900/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
//                 <div className="flex items-center gap-4">
//                   <div className={`p-4 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 dark:from-${stat.color}-900/50 dark:to-${stat.color}-800/50 rounded-2xl`}>
//                     <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
//                   </div>
//                   <div>
//                     <p className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</p>
//                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* TABLE SECTION */}
//           <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border-2 border-white/50 dark:border-slate-800 overflow-hidden transition-colors">

//             {/* Table Header Info */}
//             <div className="px-8 py-6 border-b-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/50 flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-xl">
//                   <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-black text-slate-800 dark:text-white">Employee List</h3>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
//                     Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredEmployees.length}</span> of {employees.length} employees
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto custom-scrollbar">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/30 border-b-2 border-slate-100 dark:border-slate-800">
//                   <tr>
//                     <th className="px-8 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Employee Profile</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">ID</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Business Unit</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Department</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Section</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Designation</th>
//                     <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Role</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-slate-900 divide-y-2 divide-slate-50 dark:divide-slate-800">
//                   {filteredEmployees.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="py-20 text-center">
//                         <div className="flex flex-col items-center">
//                           <div className="p-6 bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-900/50 rounded-full mb-4">
//                             <Users className="w-12 h-12 text-slate-400" />
//                           </div>
//                           <h4 className="text-xl font-bold text-slate-700 dark:text-slate-300">No employees found</h4>
//                           <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters</p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredEmployees.map((employee, idx) => (
//                       <tr
//                         key={employee.employeeid}
//                         className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-violet-50/50 dark:hover:from-indigo-900/20 dark:hover:to-violet-900/20 transition-all duration-300 group animate-in slide-in-from-left"
//                         style={{ animationDelay: `${idx * 30}ms` }}
//                       >
//                         <td className="px-8 py-6 whitespace-nowrap">
//                           <div className="flex items-center gap-4">
//                             <div className="relative">
//                               <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(employee.first_name)} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}>
//                                 <span className="text-white font-black text-lg">{getInitials(employee.first_name, employee.last_name)}</span>
//                               </div>
//                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center">
//                                 <Check size={10} className="text-white" />
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//                                 {employee.first_name} {employee.last_name}
//                               </div>
//                               <div className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2">
//                                 <Mail className="w-4 h-4" />
//                                 {employee.email}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
//                             {employee.employeeid}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-800 shadow-sm">
//                             <Briefcase size={14} />
//                             {employee.business_unit || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getDepartmentColor(employee.department)} border-2 shadow-sm`}>
//                             <Layers size={14} />
//                             {employee.department || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-700 dark:text-teal-300 border-2 border-teal-200 dark:border-teal-800 shadow-sm">
//                             <LayoutGrid size={14} />
//                             {employee.section || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/40 text-sky-700 dark:text-sky-300 border-2 border-sky-200 dark:border-sky-800 shadow-sm">
//                             <Award size={14} />
//                             {employee.designation || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-6 whitespace-nowrap">
//                           <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
//                             <Shield size={14} />
//                             {employee.role_name}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ADD EMPLOYEE MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
//           <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden transition-colors animate-in zoom-in-95 duration-500">

//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-white via-indigo-50/30 to-violet-50/30 dark:from-slate-900 dark:via-indigo-950/30 dark:to-violet-950/30 border-b-2 border-slate-100 dark:border-slate-800 px-10 py-8 flex items-center justify-between z-10">
//               <div className="flex items-center gap-5">
//                 <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/30">
//                   <UserPlus className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-black text-slate-900 dark:text-white">Add New Employee</h2>
//                   <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Fill in the details to create a new user account</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-slate-500 transition-all"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[calc(92vh-140px)] custom-scrollbar">

//               {/* Personal Information Section */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
//                     <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
//                   </div>
//                   <h3 className="text-lg font-black text-slate-800 dark:text-white">Personal Information</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormInput
//                     label="First Name"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     placeholder="Enter first name"
//                     icon={User}
//                     required
//                   />
//                   <EnhancedFormInput
//                     label="Last Name"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     placeholder="Enter last name"
//                     icon={User}
//                     required={false}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormInput
//                     label="Employee ID"
//                     name="employeeid"
//                     value={formData.employeeid}
//                     onChange={handleInputChange}
//                     placeholder="Enter employee ID"
//                     icon={Hash}
//                     required
//                   />
//                   <EnhancedFormInput
//                     label="Email Address"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     type="email"
//                     placeholder="Enter email address"
//                     icon={Mail}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Role & Position Section */}
//               <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
//                     <Crown className="w-5 h-5 text-violet-600 dark:text-violet-400" />
//                   </div>
//                   <h3 className="text-lg font-black text-slate-800 dark:text-white">Role & Position</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormSelect
//                     label="System Role"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleInputChange}
//                     options={roles}
//                     placeholder="Select role"
//                     icon={Shield}
//                     required={true}
//                   />
//                   <EnhancedFormSelect
//                     label="Designation"
//                     name="designation"
//                     value={formData.designation}
//                     onChange={handleInputChange}
//                     options={orgDesignations}
//                     placeholder="Select designation"
//                     icon={BadgeCheck}
//                   />
//                 </div>
//               </div>

//               {/* Organization Section */}
//               <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
//                     <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
//                   </div>
//                   <h3 className="text-lg font-black text-slate-800 dark:text-white">Organization Structure</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormSelect
//                     label="HQ Location"
//                     name="hq"
//                     value={formData.hq}
//                     onChange={handleInputChange}
//                     options={orgHqs}
//                     placeholder="Select HQ"
//                     icon={MapPin}
//                     required={true}
//                   />
//                   <EnhancedFormSelect
//                     label="Business Unit"
//                     name="business_unit"
//                     value={formData.business_unit}
//                     onChange={handleInputChange}
//                     options={availableBusinessUnits}
//                     placeholder={availableBusinessUnits.length > 0 ? "Select BU" : "No BUs available"}
//                     icon={Briefcase}
//                     required={true}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormSelect
//                     label="Department"
//                     name="department"
//                     value={formData.department}
//                     onChange={handleInputChange}
//                     options={availableDepartments}
//                     placeholder={formData.business_unit ? "Select Department" : "Select BU first"}
//                     icon={Layers}
//                     required={true}
//                     disabled={!formData.business_unit}
//                   />
//                   <EnhancedFormSelect
//                     label="Section"
//                     name="section"
//                     value={formData.section}
//                     onChange={handleInputChange}
//                     options={availableSections}
//                     placeholder={formData.department ? "Select Section" : "Select Dept first"}
//                     icon={LayoutGrid}
//                     hint="Optional"
//                     disabled={!formData.department}
//                   />
//                 </div>
//               </div>

//               {/* Security Section */}
//               <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
//                     <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
//                   </div>
//                   <h3 className="text-lg font-black text-slate-800 dark:text-white">Security Credentials</h3>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <EnhancedFormInput
//                     label="Password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     type="password"
//                     placeholder="Enter password"
//                     icon={Lock}
//                     required
//                   />
//                   <EnhancedFormInput
//                     label="Confirm Password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     type="password"
//                     placeholder="Confirm password"
//                     icon={Lock}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-4 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-8 py-4 text-base font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting} // Disable button when submitting
//                   className={`px-10 py-4 text-base font-black text-white rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-3
//                     ${isSubmitting 
//                       ? "bg-slate-400 cursor-not-allowed" 
//                       : "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 active:scale-95"
//                     }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <UserPlus size={20} />
//                       Create Employee
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeTable;

import React, { useState, useMemo, useEffect } from "react";
import type { RootState } from "../../../store/store";
import {
  Search,
  Mail,
  Users,
  Shield,
  X,
  BadgeCheck,
  Briefcase,
  LayoutGrid,
  Loader2,
  UserPlus,
  ChevronRight,
  Check,
  Lock,
  User,
  Hash,
  MapPin,
  Layers,
  Crown,
  RotateCcw,
  Building,
  Award,
  Download,
  FileUp
} from "lucide-react";
import { useSelector } from "react-redux";
import { normalizeListResponse } from "../../../utils/api";

// --- INTERFACES ---
interface Employee {
  id: string;
  first_name: string;
  last_name?: string; // Optional
  employeeid: string;
  email: string;
  business_unit: string;
  department: string;
  section?: string;
  role_name: string;
  hq?: string;
  designation?: string;
}

interface Role {
  id: number;
  name: string;
  permissions?: Array<{
    module_slug: string;
    module_name: string;
    view?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    approve?: boolean;
    export?: boolean;
    manage?: boolean;
  }>;
}

interface OrgItem {
  id: number;
  name: string;
  org_type: 'hq' | 'bu' | 'dept' | 'section' | 'designation';
  location: string;
  parent: number | null;
  parent_name?: string;
}

// Enhanced Select Component
const EnhancedFormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  hint = ""
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number | string; name: string }[];
  placeholder: string;
  icon: any;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
}) => (
  <div className={`transition-all duration-300 ${disabled ? 'opacity-50' : ''}`}>
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
      <Icon size={16} className="text-indigo-500" />
      {label}
      {required && <span className="text-rose-500">*</span>}
      {hint && <span className="text-slate-400 text-xs font-normal">({hint})</span>}
    </label>
    <div className="relative group">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 appearance-none font-medium cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 disabled:cursor-not-allowed disabled:hover:border-slate-200`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.name}>{opt.name}</option>
        ))}
      </select>
      <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none group-hover:text-indigo-500 transition-colors" />
    </div>
  </div>
);

// Enhanced Input Component
const EnhancedFormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  required = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  icon: any;
  required?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
      <Icon size={16} className="text-indigo-500" />
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-900/20 text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 font-medium placeholder:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600"
      />
    </div>
  </div>
);

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Org Structure State
  const [orgHqs, setOrgHqs] = useState<OrgItem[]>([]);
  const [orgBusinessUnits, setOrgBusinessUnits] = useState<OrgItem[]>([]);
  const [orgDepartments, setOrgDepartments] = useState<OrgItem[]>([]);
  const [orgSections, setOrgSections] = useState<OrgItem[]>([]);
  const [orgDesignations, setOrgDesignations] = useState<OrgItem[]>([]);
  
  // Loading States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isUploading, setIsUploading] = useState(false);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    employeeid: "",
    email: "",
    role: "",
    hq: "",
    business_unit: "",
    department: "",
    section: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };

        const [rolesRes, usersRes, orgRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/roles/", { headers }),
          fetch("http://127.0.0.1:8000/users/", { headers }),
          fetch("http://127.0.0.1:8000/lms/organization/", { headers }),
        ]);

        if (rolesRes.ok) {
          setRoles(normalizeListResponse<Role>(await rolesRes.json()));
        }

        if (usersRes.ok) {
          const users = normalizeListResponse<any>(await usersRes.json());
          const formattedUsers = users.map((u: any) => ({
            id: String(u.id),
            first_name: u.first_name,
            last_name: u.last_name || "",
            employeeid: u.employeeid,
            email: u.email,
            role_name: u.role_name || u.role?.name || (typeof u.role === 'string' ? u.role : ""),
            business_unit: u.business_unit || "",
            department: u.department?.department_name || u.department || "",
            section: u.section || "",
            designation: u.designation || ""
          }));
          setEmployees(formattedUsers);
        }

        // Process Org Structure
        if (orgRes.ok) {
          const orgData = normalizeListResponse<OrgItem>(await orgRes.json());

          setOrgHqs(orgData.filter(item => item.org_type === 'hq'));
          setOrgBusinessUnits(orgData.filter(item => item.org_type === 'bu'));
          setOrgDepartments(orgData.filter(item => item.org_type === 'dept'));
          setOrgSections(orgData.filter(item => item.org_type === 'section'));
          setOrgDesignations(orgData.filter(item => item.org_type === 'designation'));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  // --- EXCEL ACTIONS ---
  const downloadTemplate = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/bulk-employees/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Employee_Import_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("Error downloading template");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('file', file);

    try {
      setIsUploading(true);
      const response = await fetch("http://127.0.0.1:8000/bulk-employees/", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: fileFormData,
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.reload();
      } else {
        alert("Import failed. Check console for details.");
        console.error(result.errors);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // --- CASCADING LOGIC (HIERARCHY) ---
  const selectedHqId = useMemo(() => {
    const hq = orgHqs.find(h => h.name === formData.hq);
    return hq ? hq.id : null;
  }, [formData.hq, orgHqs]);

  const availableBusinessUnits = useMemo(() => {
    if (!selectedHqId) return orgBusinessUnits;
    return orgBusinessUnits.filter(bu => bu.parent === selectedHqId);
  }, [selectedHqId, orgBusinessUnits]);

  const selectedBuId = useMemo(() => {
    const bu = orgBusinessUnits.find(b => b.name === formData.business_unit);
    return bu ? bu.id : null;
  }, [formData.business_unit, orgBusinessUnits]);

  const availableDepartments = useMemo(() => {
    if (!selectedBuId) return [];
    return orgDepartments.filter(dept => dept.parent === selectedBuId);
  }, [selectedBuId, orgDepartments]);

  const selectedDeptId = useMemo(() => {
    const dept = orgDepartments.find(d => d.name === formData.department);
    return dept ? dept.id : null;
  }, [formData.department, orgDepartments]);

  const availableSections = useMemo(() => {
    if (!selectedDeptId) return [];
    return orgSections.filter(sec => sec.parent === selectedDeptId);
  }, [selectedDeptId, orgSections]);


  // --- TABLE FILTERING LOGIC ---
  const uniqueDepartments = useMemo(() => [...new Set(employees.map((emp) => emp.department))].filter(Boolean).sort(), [employees]);
  const uniqueBusinessUnits = useMemo(() => [...new Set(employees.map((emp) => emp.business_unit))].filter(Boolean).sort(), [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        searchTerm === "" ||
        employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${employee.first_name} ${employee.last_name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.designation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === "" || employee.department === selectedDepartment;
      const matchesBusinessUnit = selectedBusinessUnit === "" || employee.business_unit === selectedBusinessUnit;
      const matchesRole = selectedRole === "" || employee.role_name === selectedRole;

      return matchesSearch && matchesDepartment && matchesBusinessUnit && matchesRole;
    });
  }, [employees, searchTerm, selectedDepartment, selectedBusinessUnit, selectedRole]);

  const activeFiltersCount = [selectedDepartment, selectedBusinessUnit, selectedRole].filter(Boolean).length;

  const selectedRoleDefinition = useMemo(
    () => roles.find((role) => role.name === formData.role) || null,
    [roles, formData.role]
  );

  const selectedRoleModules = useMemo(() => {
    if (!selectedRoleDefinition?.permissions) return [];

    return selectedRoleDefinition.permissions
      .map((permission) => {
        const actions = ['view', 'create', 'update', 'delete', 'approve', 'export', 'manage']
          .filter((action) => (permission as Record<string, unknown>)[action]);
        return {
          module_name: permission.module_name,
          actions,
        };
      })
      .filter((permission) => permission.actions.length > 0);
  }, [selectedRoleDefinition]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedBusinessUnit("");
    setSelectedRole("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Cascading Resets
      if (name === 'hq') {
        newData.business_unit = "";
        newData.department = "";
        newData.section = "";
      } else if (name === 'business_unit') {
        newData.department = "";
        newData.section = "";
      } else if (name === 'department') {
        newData.section = "";
      }

      return newData;
    });

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // --- SUBMIT LOGIC (OPTIMIZED FOR SPEED) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 1. Validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const errors: Record<string, string> = {};
    let hasError = false;

    if (!formData.role) { errors.role = "System Role is required."; hasError = true; }
    if (!formData.hq) { errors.hq = "HQ Location is required."; hasError = true; }
    if (!formData.business_unit) { errors.business_unit = "Business Unit is required."; hasError = true; }
    if (!formData.department) { errors.department = "Department is required."; hasError = true; }

    if (hasError) {
      setFormErrors(errors);
      alert("Please fill in all mandatory fields.");
      return; 
    }

    // --- OPTIMISTIC UI START ---
    setIsSubmitting(true);

    // 2. Create Temp Object for Instant Display
    const tempId = `temp-${Date.now()}`;
    const optimisticEmployee: Employee = {
        id: tempId,
        first_name: formData.first_name,
        last_name: formData.last_name || "",
        employeeid: formData.employeeid,
        email: formData.email,
        role_name: roles.find(r => r.name === formData.role)?.name || formData.role,
        business_unit: formData.business_unit,
        department: formData.department,
        section: formData.section || "",
        designation: formData.designation || "",
        hq: formData.hq
    };

    // 3. Update UI Immediately (Add to bottom)
    setEmployees((prev) => [...prev, optimisticEmployee]);
    
    // 4. Close Modal Immediately
    setIsModalOpen(false); 
    
    // 5. Reset Form Immediately
    setFormData({
      first_name: "", last_name: "", employeeid: "", email: "", role: "", hq: "",
      business_unit: "", department: "", section: "", designation: "", password: "", confirmPassword: ""
    });
    setFormErrors({});

    // 6. SHOW ALERT IMMEDIATELY (Simulating instant success)
    // We use setTimeout to ensure the modal visual close happens first
    setTimeout(() => {
        alert("Employee added successfully!");
    }, 100);
    
    // --- OPTIMISTIC UI END ---

    // 7. Send to Server in Background
    try {
      const payload = {
        ...formData,
        hq: optimisticEmployee.hq, 
        last_name: optimisticEmployee.last_name,
        role: formData.role,
        department: formData.department,
        business_unit: formData.business_unit
      };

      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data.errors) || "Registration Failed");
      }

      // 8. Success: Update Temp ID to Real ID silently
      setEmployees(prev => prev.map(emp => 
        emp.id === tempId ? { ...emp, id: String(data.id) } : emp
      ));

    } catch (error: any) {
      console.error("Error adding employee:", error);
      
      // 9. Failure: Rollback UI (Remove the user and show error)
      setEmployees(prev => prev.filter(emp => emp.id !== tempId));
      alert(`Failed to save employee to database: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-indigo-500 to-violet-600",
      "from-rose-500 to-pink-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-sky-500 to-cyan-600",
      "from-fuchsia-500 to-purple-600",
    ];
    const index = (name?.length || 0) % gradients.length;
    return gradients[index];
  };

  const getDepartmentColor = (department: string) => {
    const colors = [
      "from-blue-100 to-indigo-100 text-blue-700 border-blue-200 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-300 dark:border-blue-700",
      "from-purple-100 to-violet-100 text-purple-700 border-purple-200 dark:from-purple-900/40 dark:to-violet-900/40 dark:text-purple-300 dark:border-purple-700",
      "from-pink-100 to-rose-100 text-pink-700 border-pink-200 dark:from-pink-900/40 dark:to-rose-900/40 dark:text-pink-300 dark:border-pink-700",
      "from-orange-100 to-amber-100 text-orange-700 border-orange-200 dark:from-orange-900/40 dark:to-amber-900/40 dark:text-orange-300 dark:border-orange-700",
      "from-green-100 to-emerald-100 text-green-700 border-green-200 dark:from-green-900/40 dark:to-emerald-900/40 dark:text-green-300 dark:border-green-700",
      "from-indigo-100 to-blue-100 text-indigo-700 border-indigo-200 dark:from-indigo-900/40 dark:to-blue-900/40 dark:text-indigo-300 dark:border-indigo-700",
    ];
    if (!department) return "from-slate-100 to-gray-100 text-slate-500 border-slate-200 dark:from-slate-800 dark:to-gray-800 dark:text-slate-400 dark:border-slate-700";
    const index = department.length % colors.length;
    return colors[index];
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Loading Organization</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-violet-100/50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-violet-950/50 transition-colors duration-500">

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #c7d2fe, #a5b4fc); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #a5b4fc, #818cf8); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-violet-200 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-full blur-3xl opacity-40 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 dark:from-rose-900/30 dark:to-pink-900/30 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 p-4 md:p-4 lg:p-4">
        <div className="w-full space-y-10">

          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">Employee Directory</h1>
              <p className="text-slate-500 font-medium mt-2">Manage your organization's workforce</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold shadow-sm hover:bg-indigo-50 transition-all"
              >
                <Download size={20} /> Template
              </button>

              <label className="cursor-pointer flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all">
                <FileUp size={20} /> {isUploading ? "Uploading..." : "Import Excel"}
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} />
              </label>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all"
              >
                <UserPlus size={20} /> Add Employee
              </button>
            </div>
          </div>

          {/* SEARCH AND FILTER SECTION */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border-2 border-white/50 dark:border-slate-800 p-4 transition-colors">

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-7 h-7 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search by name, ID, role, designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-8 py-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-800 dark:text-slate-100 transition-all duration-300 text-xl font-medium placeholder-slate-400 dark:placeholder-slate-500 shadow-xl hover:shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-end">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Business Unit Filter */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Briefcase size={16} className="text-orange-500" />
                    Business Unit
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedBusinessUnit}
                      onChange={(e) => setSelectedBusinessUnit(e.target.value)}
                      className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium cursor-pointer appearance-none"
                    >
                      <option value="">All Business Units</option>
                      {uniqueBusinessUnits.map((bu, i) => <option key={i} value={bu}>{bu}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Department Filter */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Layers size={16} className="text-violet-500" />
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium cursor-pointer appearance-none"
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map((d, i) => <option key={i} value={d}>{d}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Shield size={16} className="text-emerald-500" />
                    System Role
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium cursor-pointer appearance-none"
                    >
                      <option value="">All Roles</option>
                      {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Filter Stats & Clear */}
              <div className="flex items-center gap-4">
                {activeFiltersCount > 0 && (
                  <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                    <span className="text-indigo-600 dark:text-indigo-400 font-black text-lg">{activeFiltersCount}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium ml-2">active</span>
                  </div>
                )}
                <button
                  onClick={clearAllFilters}
                  disabled={!searchTerm && activeFiltersCount === 0}
                  className="flex items-center gap-2 px-6 py-4 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all font-bold border-2 border-transparent hover:border-rose-200 dark:hover:border-rose-800 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <RotateCcw size={18} />
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Employees', value: employees.length, icon: Users, color: 'indigo' },
              { label: 'Departments', value: uniqueDepartments.length, icon: Layers, color: 'violet' },
              { label: 'Business Units', value: uniqueBusinessUnits.length, icon: Briefcase, color: 'amber' },
              { label: 'Roles', value: roles.length, icon: Shield, color: 'emerald' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border-2 border-${stat.color}-100 dark:border-${stat.color}-900/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 dark:from-${stat.color}-900/50 dark:to-${stat.color}-800/50 rounded-2xl`}>
                    <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 border-2 border-white/50 dark:border-slate-800 overflow-hidden transition-colors">

            {/* Table Header Info */}
            <div className="px-8 py-6 border-b-2 border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50/50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white">Employee List</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Showing <span className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredEmployees.length}</span> of {employees.length} employees
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/30 border-b-2 border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Employee Profile</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Business Unit</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Department</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Section</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Designation</th>
                    <th className="px-6 py-6 text-left text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y-2 divide-slate-50 dark:divide-slate-800">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center">
                          <div className="p-6 bg-gradient-to-br from-slate-100 to-indigo-100 dark:from-slate-800 dark:to-indigo-900/50 rounded-full mb-4">
                            <Users className="w-12 h-12 text-slate-400" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-700 dark:text-slate-300">No employees found</h4>
                          <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee, idx) => (
                      <tr
                        key={employee.employeeid}
                        className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-violet-50/50 dark:hover:from-indigo-900/20 dark:hover:to-violet-900/20 transition-all duration-300 group animate-in slide-in-from-left"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(employee.first_name)} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}>
                                <span className="text-white font-black text-lg">{getInitials(employee.first_name, employee.last_name)}</span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                <Check size={10} className="text-white" />
                              </div>
                            </div>
                            <div>
                              <div className="text-base font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {employee.first_name} {employee.last_name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono tracking-wider bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg">
                            {employee.employeeid}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-800 shadow-sm">
                            <Briefcase size={14} />
                            {employee.business_unit || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getDepartmentColor(employee.department)} border-2 shadow-sm`}>
                            <Layers size={14} />
                            {employee.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/40 dark:to-cyan-900/40 text-teal-700 dark:text-teal-300 border-2 border-teal-200 dark:border-teal-800 shadow-sm">
                            <LayoutGrid size={14} />
                            {employee.section || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/40 text-sky-700 dark:text-sky-300 border-2 border-sky-200 dark:border-sky-800 shadow-sm">
                            <Award size={14} />
                            {employee.designation || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
                            <Shield size={14} />
                            {employee.role_name}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden transition-colors animate-in zoom-in-95 duration-500">

            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-white via-indigo-50/30 to-violet-50/30 dark:from-slate-900 dark:via-indigo-950/30 dark:to-violet-950/30 border-b-2 border-slate-100 dark:border-slate-800 px-10 py-8 flex items-center justify-between z-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/30">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">Add New Employee</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Fill in the details to create a new user account</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-slate-500 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[calc(92vh-140px)] custom-scrollbar">

              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormInput
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    icon={User}
                    required
                  />
                  <EnhancedFormInput
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    icon={User}
                    required={false}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormInput
                    label="Employee ID"
                    name="employeeid"
                    value={formData.employeeid}
                    onChange={handleInputChange}
                    placeholder="Enter employee ID"
                    icon={Hash}
                    required
                  />
                  <EnhancedFormInput
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="Enter email address"
                    icon={Mail}
                    required
                  />
                </div>
              </div>

              {/* Role & Position Section */}
              <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                    <Crown className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Role & Position</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormSelect
                    label="System Role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    options={roles}
                    placeholder="Select role"
                    icon={Shield}
                    required={true}
                  />
                  <EnhancedFormSelect
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    options={orgDesignations}
                    placeholder="Select designation"
                    icon={BadgeCheck}
                  />
                </div>

                {formData.role && (
                  <div className="rounded-2xl border-2 border-violet-100 dark:border-violet-900/50 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 p-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-300">
                          Account Access Preview
                        </div>
                        <h4 className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                          {formData.role}
                        </h4>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          This account will inherit the permissions configured for the selected role.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {selectedRoleModules.slice(0, 8).map((item: any) => (
                          <div
                            key={item.module_name}
                            className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-violet-100 dark:border-slate-800 p-3"
                          >
                            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
                              {item.module_name}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {(item.actions || []).map((action: string) => (
                                <span
                                  key={action}
                                  className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300"
                                >
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {!selectedRoleModules.length && (
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          No active permissions are configured for this role yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Organization Section */}
              <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Organization Structure</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormSelect
                    label="HQ Location"
                    name="hq"
                    value={formData.hq}
                    onChange={handleInputChange}
                    options={orgHqs}
                    placeholder="Select HQ"
                    icon={MapPin}
                    required={true}
                  />
                  <EnhancedFormSelect
                    label="Business Unit"
                    name="business_unit"
                    value={formData.business_unit}
                    onChange={handleInputChange}
                    options={availableBusinessUnits}
                    placeholder={availableBusinessUnits.length > 0 ? "Select BU" : "No BUs available"}
                    icon={Briefcase}
                    required={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormSelect
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    options={availableDepartments}
                    placeholder={formData.business_unit ? "Select Department" : "Select BU first"}
                    icon={Layers}
                    required={true}
                    disabled={!formData.business_unit}
                  />
                  <EnhancedFormSelect
                    label="Section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    options={availableSections}
                    placeholder={formData.department ? "Select Section" : "Select Dept first"}
                    icon={LayoutGrid}
                    hint="Optional"
                    disabled={!formData.department}
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6 pt-6 border-t-2 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                    <Lock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Security Credentials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedFormInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Enter password"
                    icon={Lock}
                    required
                  />
                  <EnhancedFormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    type="password"
                    placeholder="Confirm password"
                    icon={Lock}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 text-base font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting} // Disable button when submitting
                  className={`px-10 py-4 text-base font-black text-white rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center gap-3
                    ${isSubmitting 
                      ? "bg-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 active:scale-95"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Create Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
