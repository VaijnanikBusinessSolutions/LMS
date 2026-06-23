// import { useState, useEffect, useCallback } from "react";
// import { ErrorMessage } from "../../molecules/ErrorMessage/ErrorMessage";
// import { Button } from "../../atoms/Buttons/Button";
// import axios from "axios";
// import { API_ENDPOINTS } from "../../constants/api";

// // --- 1. Type Definition ---
// export interface Employee {
//     emp_id: string;
//     first_name: string;
//     last_name: string;
//     date_of_joining: string;
//     birth_date: string | null;
//     sex: 'M' | 'F' | 'O' | null;
//     email: string;
//     phone: string;
//     department: { department_id: number; department_name: string } | null;
//     current_line: { line_id: number; line_name: string } | null;
//     current_station: { station_id: number; station_name: string } | null;
//     photo: string | null;
// }

// // --- Sub-components ---
// const PageHeader = ({ title }: { title: string }) => (
//     <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent py-3">
//         {title}
//     </h1>
// );

// const LoadingState = () => (
//     <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
//                 <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
//             </div>
//             <p className="text-lg text-gray-600">Loading employee data...</p>
//         </div>
//     </div>
// );

// const FilterSelect = ({ value, onChange, options, className = "" }: { value: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; className?: string; }) => (
//     <select value={value} onChange={onChange} className={`px-4 py-3 rounded-xl border-2 border-purple-200 bg-white text-sm md:text-base w-full md:w-auto outline-none shadow-lg hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 ${className}`}> 
//         {options.map((option) => (<option key={option} value={option}>{option}</option>))} 
//     </select>
// );

// const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }) => (
//     <div className="relative">
//         <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-blue-200 bg-white text-sm md:text-base outline-none shadow-lg hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300" />
//         <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//     </div>
// );

// // --- PhotoAvatar Component ---
// const PhotoAvatar = ({ url, alt, size = "md" }: { url: string | null, alt: string, size?: "sm" | "md" }) => {
//     const sizeClasses = size === "sm" ? "w-10 h-10 text-xs" : "w-20 h-20 text-lg";
    
//     // Logic to ensure URL is absolute
//     const imageUrl = url?.startsWith('http') 
//         ? url 
//         : url 
//             ? `${API_ENDPOINTS.BASE_URL}${url}` 
//             : null;

//     if (!imageUrl) {
//         const initials = alt ? alt.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA';
//         return (
//             <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600 flex items-center justify-center font-bold border-2 border-purple-200 shadow-sm mx-auto`}>
//                 {initials}
//             </div>
//         );
//     }

//     return (
//         <img 
//             src={imageUrl} 
//             alt={alt} 
//             className={`${sizeClasses} rounded-full object-cover border-4 border-white shadow-md mx-auto hover:scale-110 transition-transform duration-200 cursor-pointer`}
//             onClick={() => window.open(imageUrl, '_blank')}
//             onError={(e) => {
//                 (e.target as HTMLImageElement).style.display = 'none';
//                 (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="${sizeClasses} rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs border border-gray-200 mx-auto">?</div>`;
//             }}
//         />
//     );
// };

// // --- NEW: Pagination Controls ---
// const PaginationControls = ({ 
//     currentPage, 
//     totalPages, 
//     onPageChange, 
//     totalCount,
//     loading 
// }: { 
//     currentPage: number; 
//     totalPages: number; 
//     onPageChange: (page: number) => void;
//     totalCount: number;
//     loading: boolean;
// }) => (
//     <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-purple-100">
//         <span className="text-sm text-gray-600 order-2 md:order-1">
//             Showing page <span className="font-bold text-purple-700">{currentPage}</span> of <span className="font-bold">{totalPages}</span> 
//             <span className="ml-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Total: {totalCount}</span>
//         </span>
//         <div className="flex gap-2 order-1 md:order-2">
//             <Button 
//                 onClick={() => onPageChange(currentPage - 1)} 
//                 disabled={currentPage === 1 || loading}
//                 variant="secondary"
//                 className="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 Previous
//             </Button>
//             <Button 
//                 onClick={() => onPageChange(currentPage + 1)} 
//                 disabled={currentPage >= totalPages || loading}
//                 variant="secondary"
//                 className="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//                 Next
//             </Button>
//         </div>
//     </div>
// );

// const FilterControls = ({
//     selectedDepartment, onDepartmentChange, departmentOptions,
//     selectedLine, onLineChange, lineOptions,
//     selectedStation, onStationChange, stationOptions,
//     selectedSex, onSexChange, sexOptions,
//     searchQuery, onSearchChange
// }: any) => (
//     <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl shadow-xl mb-6 md:mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//             <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
//                 <FilterSelect value={selectedDepartment} onChange={onDepartmentChange} options={departmentOptions} />
//                 <FilterSelect value={selectedLine} onChange={onLineChange} options={lineOptions} />
//                 <FilterSelect value={selectedStation} onChange={onStationChange} options={stationOptions} />
//                 <FilterSelect value={selectedSex} onChange={onSexChange} options={sexOptions} />
//             </div>
//             <div className="w-full">
//                 <SearchInput value={searchQuery} onChange={onSearchChange} placeholder="Search name, ID, location..." />
//             </div>
//         </div>
//     </div>
// );

// const TableHeader = ({ columns }: { columns: Array<{ key: string; header: string }> }) => (
//     <thead>
//         <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
//             {columns.map(col => (
//                 <th key={col.key} className="p-4 text-center text-sm md:text-base font-semibold border-r border-purple-500 last:border-r-0">
//                     {col.header}
//                 </th>
//             ))}
//         </tr>
//     </thead>
// );

// const MobileTableRow = ({ employee, columns }: { employee: Employee; columns: Array<{ key: string; header: string }>; }) => (
//     <tr className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 even:bg-gradient-to-r even:from-purple-50/50 even:to-blue-50/50 border-b border-purple-100 last:border-b-0 transition-all duration-300">
//         {columns.map(col => (
//             <td key={`${employee.emp_id}-${col.key}`} className="border-r border-purple-100 p-3 text-center text-sm last:border-r-0">
//                 {col.key === 'emp_id' && (
//                     <div className="flex items-center gap-3 justify-center">
//                         <PhotoAvatar url={employee.photo} alt={employee.first_name} size="sm" />
//                         <span className="font-medium">{employee.emp_id}</span>
//                     </div>
//                 )}
//                 {col.key === 'name' && `${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
//                 {col.key === 'location' && (<div className="text-xs text-left"><div><strong>Dept:</strong> {employee.department?.department_name || 'N/A'}</div><div><strong>Line:</strong> {employee.current_line?.line_name || 'N/A'}</div><div><strong>Station:</strong> {employee.current_station?.station_name || 'N/A'}</div></div>)}
//                 {col.key === 'sex' && (employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : 'N/A')}
//             </td>
//         ))}
//     </tr>
// );

// const DesktopTableRow = ({ employee }: { employee: Employee; }) => (
//     <tr className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 even:bg-gradient-to-r even:from-purple-50/50 even:to-blue-50/50 border-b border-purple-100 last:border-b-0 transition-all duration-300">
//         <td className="border-r border-purple-100 p-4 align-middle">
//             <PhotoAvatar url={employee.photo} alt={employee.first_name} size="md" />
//         </td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base font-medium text-purple-700 align-middle">{employee.emp_id}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle">{`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle"><span className="text-purple-700 text-sm">{employee.department?.department_name || 'N/A'}</span></td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle">{employee.current_line?.line_name || 'N/A'}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle">{employee.current_station?.station_name || 'N/A'}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle">{employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base align-middle"><span className={`text-sm ${employee.sex === 'M' ? 'text-blue-700' : employee.sex === 'F' ? 'text-purple-700' : 'text-gray-700'}`}>{employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : 'N/A'}</span></td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base text-blue-600 align-middle">{employee.email}</td>
//         <td className="border-r border-purple-100 p-4 text-center text-sm md:text-base last:border-r-0 align-middle">{employee.phone}</td>
//     </tr>
// );

// const DesktopTableColumns = [
//     { key: 'photo', header: 'Photo' }, 
//     { key: 'emp_id', header: 'Employee ID' }, 
//     { key: 'name', header: 'Name' }, 
//     { key: 'department', header: 'Department' }, 
//     { key: 'current_line', header: 'Line' }, 
//     { key: 'current_station', header: 'Station' }, 
//     { key: 'date_of_joining', header: 'Join Date' }, 
//     { key: 'sex', header: 'Gender' }, 
//     { key: 'email', header: 'Email' }, 
//     { key: 'phone', header: 'Phone' }, 
// ];

// const EmployeeTable = ({ employees, isMobile }: { employees: Employee[]; isMobile: boolean; }) => { 
//     const mobileColumns = [{ key: 'emp_id', header: 'Emp ID' }, { key: 'name', header: 'Name' }, { key: 'location', header: 'Location' }, { key: 'sex', header: 'Gender' }]; 
//     return (
//         <div className="mt-4 md:mt-6 w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
//             <div className="overflow-x-auto">
//                 <table className="w-full border-collapse font-sans">
//                     <TableHeader columns={isMobile ? mobileColumns : DesktopTableColumns} />
//                     <tbody>
//                         {employees.map((emp) => (isMobile 
//                             ? (<MobileTableRow key={`mobile-${emp.emp_id}`} employee={emp} columns={mobileColumns} />) 
//                             : (<DesktopTableRow key={`desktop-${emp.emp_id}`} employee={emp} />)
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     ); 
// };

// const MasterTable = () => {
//     // --- State ---
//     const [employees, setEmployees] = useState<Employee[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [isMobile, setIsMobile] = useState(false);
    
//     // Pagination State
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const [totalCount, setTotalCount] = useState(0);
//     const PAGE_SIZE = 10;

//     // Filter State
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
//     const [selectedSex, setSelectedSex] = useState("All Genders");
//     const [selectedLine, setSelectedLine] = useState("All Lines");
//     const [selectedStation, setSelectedStation] = useState("All Stations");

//     // Option Lists (Ideally, fetch these from a separate API to show ALL available options)
//     // For now, we will just use defaults. 
//     // TODO: Connect this to a backend endpoint like /api/departments/
//     const [departmentOptions, setDepartmentOptions] = useState(["All Departments"]);
//     const [lineOptions, setLineOptions] = useState(["All Lines"]);
//     const [stationOptions, setStationOptions] = useState(["All Stations"]);
//     const sexOptions = ["All Genders", "Male", "Female", "Other"];

//     // --- Load Data Function ---
//     const loadEmployees = useCallback(async (page: number) => {
//         try {
//             setLoading(true);
//             const params = new URLSearchParams();
            
//             // Pagination Params
//             params.append('page', page.toString());
//             params.append('page_size', PAGE_SIZE.toString());

//             // Filter Params (Matches Django Backend logic)
//             if (searchQuery) params.append('search', searchQuery);
//             if (selectedDepartment !== "All Departments") params.append('department', selectedDepartment);
//             if (selectedLine !== "All Lines") params.append('line', selectedLine);
//             if (selectedStation !== "All Stations") params.append('station', selectedStation);
//             if (selectedSex !== "All Genders") params.append('sex', selectedSex);

//             const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES_UI_LIST}?${params.toString()}`;
//             const response = await axios.get(url);
            
//             // Check if response is paginated (has .results) or flat array (old API)
//             if (response.data.results) {
//                 setEmployees(response.data.results);
//                 setTotalCount(response.data.count);
//                 setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
                
//                 // OPTIONAL: If you want to populate dropdowns based on current page data (not perfect but works)
//                 // In a real app, fetch these separately.
//                 if (selectedDepartment === "All Departments") {
//                     const depts = new Set(["All Departments", ...response.data.results.map((e: any) => e.department?.department_name).filter(Boolean)]);
//                     setDepartmentOptions(Array.from(depts) as string[]);
//                 }
//             } else {
//                 // Fallback if backend isn't paginated yet
//                 setEmployees(response.data);
//                 setTotalCount(response.data.length);
//                 setTotalPages(1);
//             }
            
//             setCurrentPage(page);
//             setError("");
//         } catch (err: any) {
//             console.error('Error loading employees:', err);
//             setError(err.message || "Failed to load employee data");
//         } finally {
//             setLoading(false);
//         }
//     }, [searchQuery, selectedDepartment, selectedLine, selectedStation, selectedSex]);

//     // --- Effects ---

//     // 1. Check Screen Size
//     useEffect(() => {
//         const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
//         checkScreenSize();
//         window.addEventListener('resize', checkScreenSize);
//         return () => window.removeEventListener('resize', checkScreenSize);
//     }, []);

//     // 2. Fetch Data (with Debounce for search)
//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             // Reset to page 1 when filters change
//             loadEmployees(1);
//         }, 500); // 500ms delay to stop API spam while typing
//         return () => clearTimeout(timeoutId);
//     }, [loadEmployees]); 
//     // Note: loadEmployees depends on filter states, so this runs when filters change.
    
//     // 3. Handle Pagination Click
//     const handlePageChange = (newPage: number) => {
//         loadEmployees(newPage);
//     };

//     // --- Filter Handlers ---
//     const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedDepartment(event.target.value);
//         setSelectedLine("All Lines"); // Reset line when dept changes
//         setSelectedStation("All Stations"); // Reset station when dept changes
//     };
//     const handleLineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedLine(event.target.value);
//         setSelectedStation("All Stations");
//     };
//     const handleStationChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedStation(event.target.value);
//     const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedSex(event.target.value);
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

//     // --- Render ---
//     if (loading && employees.length === 0) return <LoadingState />;
    
//     if (error) return (
//         <div className="min-h-[400px] flex items-center justify-center p-8">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                 </div>
//                 <ErrorMessage message={error} />
//                 <Button onClick={() => loadEmployees(1)} variant="primary" className="mt-6">Retry</Button>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
//             <div className="w-full px-4 md:px-8 py-4 md:py-8">
//                 <PageHeader title="Employee Master" />
                
//                 <FilterControls 
//                     selectedDepartment={selectedDepartment} onDepartmentChange={handleDepartmentChange} departmentOptions={departmentOptions}
//                     selectedLine={selectedLine} onLineChange={handleLineChange} lineOptions={lineOptions}
//                     selectedStation={selectedStation} onStationChange={handleStationChange} stationOptions={stationOptions}
//                     selectedSex={selectedSex} onSexChange={handleSexChange} sexOptions={sexOptions}
//                     searchQuery={searchQuery} onSearchChange={handleSearchChange} 
//                 />
                
//                 <div className="mb-4 flex items-center justify-between">
//                     <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                         {totalCount} {totalCount === 1 ? 'Employee' : 'Employees'} Found
//                     </p>
//                     <Button onClick={() => loadEmployees(currentPage)} variant="secondary" className="bg-white shadow-sm border border-gray-100">
//                         <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                         Refresh
//                     </Button>
//                 </div>

//                 <EmployeeTable employees={employees} isMobile={isMobile} />
                
//                 {/* Pagination Controls */}
//                 {totalCount > 0 && (
//                     <PaginationControls 
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         totalCount={totalCount}
//                         onPageChange={handlePageChange}
//                         loading={loading}
//                     />
//                 )}

//                 {employees.length === 0 && !loading && (
//                     <div className="text-center mt-12 p-8">
//                         <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
//                             <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                         </div>
//                         <p className="text-xl text-gray-600 mb-6">No employees found matching your criteria.</p>
//                         <Button onClick={() => { 
//                             setSelectedDepartment("All Departments"); 
//                             setSelectedLine("All Lines"); 
//                             setSelectedStation("All Stations"); 
//                             setSelectedSex("All Genders"); 
//                             setSearchQuery(""); 
//                         }} variant="secondary" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
//                             Clear All Filters
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MasterTable;






import { useState, useEffect, useCallback } from "react";
import { ErrorMessage } from "../../molecules/ErrorMessage/ErrorMessage";
import { Button } from "../../atoms/Buttons/Button";
import axios from "axios";
import { API_ENDPOINTS } from "../../constants/api";

// --- 1. Type Definition ---
export interface Employee {
    emp_id: string;
    first_name: string;
    last_name: string;
    date_of_joining: string;
    birth_date: string | null;
    sex: 'M' | 'F' | 'O' | null;
    email: string;
    phone: string;
    department: { department_id: number; department_name: string } | null;
    current_line: { line_id: number; line_name: string } | null;
    current_station: { station_id: number; station_name: string } | null;
    photo: string | null;
}

// --- Sub-components ---
const PageHeader = ({ title }: { title: string }) => (
    <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-text">
        {title}
    </h1>
);

const LoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
            <p className="text-lg text-muted">Loading employee data...</p>
        </div>
    </div>
);

const FilterSelect = ({ value, onChange, options, className = "" }: { value: string; onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; className?: string; }) => (
    <select value={value} onChange={onChange} className={`px-4 py-3 rounded-xl border border-border bg-background text-text text-sm md:text-base w-full md:w-auto outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}> 
        {options.map((option) => (<option key={option} value={option}>{option}</option>))} 
    </select>
);

const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }) => (
    <div className="relative">
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 pl-12 rounded-xl border border-border bg-background text-text placeholder-muted text-sm md:text-base outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </div>
);

// --- PhotoAvatar Component ---
const PhotoAvatar = ({ url, alt, size = "md" }: { url: string | null, alt: string, size?: "sm" | "md" }) => {
    const sizeClasses = size === "sm" ? "w-10 h-10 text-xs" : "w-16 h-16 text-base";
    
    // Logic to ensure URL is absolute
    const imageUrl = url?.startsWith('http') 
        ? url 
        : url 
            ? `${API_ENDPOINTS.BASE_URL}${url}` 
            : null;

    if (!imageUrl) {
        const initials = alt ? alt.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA';
        return (
            <div className={`${sizeClasses} rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 shadow-sm mx-auto`}>
                {initials}
            </div>
        );
    }

    return (
        <img 
            src={imageUrl} 
            alt={alt} 
            className={`${sizeClasses} rounded-full object-cover border-2 border-surface shadow-sm mx-auto hover:scale-105 transition-transform duration-200 cursor-pointer`}
            onClick={() => window.open(imageUrl, '_blank')}
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="${sizeClasses} rounded-full bg-background flex items-center justify-center text-muted text-xs border border-border mx-auto">?</div>`;
            }}
        />
    );
};

// --- Pagination Controls ---
const PaginationControls = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    totalCount,
    loading 
}: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void;
    totalCount: number;
    loading: boolean;
}) => (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 bg-surface p-4 rounded-xl shadow-sm border border-border">
        <span className="text-sm text-muted order-2 md:order-1">
            Showing page <span className="font-bold text-text">{currentPage}</span> of <span className="font-bold">{totalPages}</span> 
            <span className="ml-2 bg-background border border-border text-text px-3 py-1 rounded-full text-xs font-medium">Total: {totalCount}</span>
        </span>
        <div className="flex gap-2 order-1 md:order-2">
            <Button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1 || loading}
                variant="secondary"
                className="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-background border border-border text-text hover:bg-gray-50"
            >
                Previous
            </Button>
            <Button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage >= totalPages || loading}
                variant="secondary"
                className="px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-background border border-border text-text hover:bg-gray-50"
            >
                Next
            </Button>
        </div>
    </div>
);

const FilterControls = ({
    selectedDepartment, onDepartmentChange, departmentOptions,
    selectedLine, onLineChange, lineOptions,
    selectedStation, onStationChange, stationOptions,
    selectedSex, onSexChange, sexOptions,
    searchQuery, onSearchChange
}: any) => (
    <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border mb-6 md:mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
                <FilterSelect value={selectedDepartment} onChange={onDepartmentChange} options={departmentOptions} />
                <FilterSelect value={selectedLine} onChange={onLineChange} options={lineOptions} />
                <FilterSelect value={selectedStation} onChange={onStationChange} options={stationOptions} />
                <FilterSelect value={selectedSex} onChange={onSexChange} options={sexOptions} />
            </div>
            <div className="w-full">
                <SearchInput value={searchQuery} onChange={onSearchChange} placeholder="Search name, ID, location..." />
            </div>
        </div>
    </div>
);

const TableHeader = ({ columns }: { columns: Array<{ key: string; header: string }> }) => (
    <thead className="bg-background">
        <tr>
            {columns.map(col => (
                <th key={col.key} className="p-4 text-center text-sm md:text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
                    {col.header}
                </th>
            ))}
        </tr>
    </thead>
);

const MobileTableRow = ({ employee, columns }: { employee: Employee; columns: Array<{ key: string; header: string }>; }) => (
    <tr className="border-b border-border last:border-b-0 hover:bg-background transition-colors duration-200">
        {columns.map(col => (
            <td key={`${employee.emp_id}-${col.key}`} className="p-3 text-center text-sm text-text">
                {col.key === 'emp_id' && (
                    <div className="flex items-center gap-3 justify-center">
                        <PhotoAvatar url={employee.photo} alt={employee.first_name} size="sm" />
                        <span className="font-medium text-text">{employee.emp_id}</span>
                    </div>
                )}
                {col.key === 'name' && `${employee.first_name || ''} ${employee.last_name || ''}`.trim()}
                {col.key === 'location' && (
                    <div className="text-xs text-left text-muted">
                        <div><strong className="text-text">Dept:</strong> {employee.department?.department_name || 'N/A'}</div>
                        <div><strong className="text-text">Line:</strong> {employee.current_line?.line_name || 'N/A'}</div>
                        <div><strong className="text-text">Station:</strong> {employee.current_station?.station_name || 'N/A'}</div>
                    </div>
                )}
                {col.key === 'sex' && (employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : 'N/A')}
            </td>
        ))}
    </tr>
);

const DesktopTableRow = ({ employee }: { employee: Employee; }) => (
    <tr className="border-b border-border last:border-b-0 hover:bg-background transition-colors duration-200">
        <td className="p-4 align-middle">
            <PhotoAvatar url={employee.photo} alt={employee.first_name} size="md" />
        </td>
        <td className="p-4 text-center text-sm md:text-base font-medium text-text align-middle">{employee.emp_id}</td>
        <td className="p-4 text-center text-sm md:text-base text-text align-middle">{`${employee.first_name || ''} ${employee.last_name || ''}`.trim()}</td>
        <td className="p-4 text-center text-sm md:text-base align-middle"><span className="text-text text-sm bg-background border border-border px-2 py-1 rounded-md">{employee.department?.department_name || 'N/A'}</span></td>
        <td className="p-4 text-center text-sm md:text-base text-muted align-middle">{employee.current_line?.line_name || 'N/A'}</td>
        <td className="p-4 text-center text-sm md:text-base text-muted align-middle">{employee.current_station?.station_name || 'N/A'}</td>
        <td className="p-4 text-center text-sm md:text-base text-muted align-middle">{employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}</td>
        <td className="p-4 text-center text-sm md:text-base align-middle">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                employee.sex === 'M' ? 'bg-blue-50 text-blue-700' : 
                employee.sex === 'F' ? 'bg-purple-50 text-purple-700' : 
                'bg-gray-100 text-gray-700'
            }`}>
                {employee.sex === 'M' ? 'Male' : employee.sex === 'F' ? 'Female' : 'N/A'}
            </span>
        </td>
        <td className="p-4 text-center text-sm md:text-base text-text align-middle">{employee.email}</td>
        <td className="p-4 text-center text-sm md:text-base text-muted align-middle">{employee.phone}</td>
    </tr>
);

const DesktopTableColumns = [
    { key: 'photo', header: 'Photo' }, 
    { key: 'emp_id', header: 'Employee ID' }, 
    { key: 'name', header: 'Name' }, 
    { key: 'department', header: 'Department' }, 
    { key: 'current_line', header: 'Line' }, 
    { key: 'current_station', header: 'Station' }, 
    { key: 'date_of_joining', header: 'Join Date' }, 
    { key: 'sex', header: 'Gender' }, 
    { key: 'email', header: 'Email' }, 
    { key: 'phone', header: 'Phone' }, 
];

const EmployeeTable = ({ employees, isMobile }: { employees: Employee[]; isMobile: boolean; }) => { 
    const mobileColumns = [{ key: 'emp_id', header: 'Emp ID' }, { key: 'name', header: 'Name' }, { key: 'location', header: 'Location' }, { key: 'sex', header: 'Gender' }]; 
    return (
        <div className="mt-4 md:mt-6 w-full rounded-2xl overflow-hidden shadow-sm bg-surface border border-border">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans">
                    <TableHeader columns={isMobile ? mobileColumns : DesktopTableColumns} />
                    <tbody className="bg-surface divide-y divide-border">
                        {employees.map((emp) => (isMobile 
                            ? (<MobileTableRow key={`mobile-${emp.emp_id}`} employee={emp} columns={mobileColumns} />) 
                            : (<DesktopTableRow key={`desktop-${emp.emp_id}`} employee={emp} />)
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ); 
};

const MasterTable = () => {
    // --- State ---
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 10;

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [selectedSex, setSelectedSex] = useState("All Genders");
    const [selectedLine, setSelectedLine] = useState("All Lines");
    const [selectedStation, setSelectedStation] = useState("All Stations");

    // Option Lists
    const [departmentOptions, setDepartmentOptions] = useState(["All Departments"]);
    const [lineOptions, setLineOptions] = useState(["All Lines"]);
    const [stationOptions, setStationOptions] = useState(["All Stations"]);
    const sexOptions = ["All Genders", "Male", "Female", "Other"];

    // --- Load Data Function ---
    const loadEmployees = useCallback(async (page: number) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            // Pagination Params
            params.append('page', page.toString());
            params.append('page_size', PAGE_SIZE.toString());

            // Filter Params
            if (searchQuery) params.append('search', searchQuery);
            if (selectedDepartment !== "All Departments") params.append('department', selectedDepartment);
            if (selectedLine !== "All Lines") params.append('line', selectedLine);
            if (selectedStation !== "All Stations") params.append('station', selectedStation);
            if (selectedSex !== "All Genders") params.append('sex', selectedSex);

            const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES_UI_LIST}?${params.toString()}`;
            const response = await axios.get(url);
            
            if (response.data.results) {
                setEmployees(response.data.results);
                setTotalCount(response.data.count);
                setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
                
                if (selectedDepartment === "All Departments") {
                    const depts = new Set(["All Departments", ...response.data.results.map((e: any) => e.department?.department_name).filter(Boolean)]);
                    setDepartmentOptions(Array.from(depts) as string[]);
                }
            } else {
                setEmployees(response.data);
                setTotalCount(response.data.length);
                setTotalPages(1);
            }
            
            setCurrentPage(page);
            setError("");
        } catch (err: any) {
            console.error('Error loading employees:', err);
            setError(err.message || "Failed to load employee data");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedDepartment, selectedLine, selectedStation, selectedSex]);

    // --- Effects ---

    // 1. Check Screen Size
    useEffect(() => {
        const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 2. Fetch Data (with Debounce for search)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadEmployees(1);
        }, 500); 
        return () => clearTimeout(timeoutId);
    }, [loadEmployees]); 
    
    // 3. Handle Pagination Click
    const handlePageChange = (newPage: number) => {
        loadEmployees(newPage);
    };

    // --- Filter Handlers ---
    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartment(event.target.value);
        setSelectedLine("All Lines");
        setSelectedStation("All Stations");
    };
    const handleLineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLine(event.target.value);
        setSelectedStation("All Stations");
    };
    const handleStationChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedStation(event.target.value);
    const handleSexChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedSex(event.target.value);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    // --- Render ---
    if (loading && employees.length === 0) return <LoadingState />;
    
    if (error) return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="bg-surface rounded-2xl shadow-sm border border-border p-8 max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <ErrorMessage message={error} />
                <Button onClick={() => loadEmployees(1)} variant="primary" className="mt-6">Retry</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-text">
            <div className="w-full px-4 md:px-8 py-4 md:py-8">
                <PageHeader title="Employee Master" />
                
                <FilterControls 
                    selectedDepartment={selectedDepartment} onDepartmentChange={handleDepartmentChange} departmentOptions={departmentOptions}
                    selectedLine={selectedLine} onLineChange={handleLineChange} lineOptions={lineOptions}
                    selectedStation={selectedStation} onStationChange={handleStationChange} stationOptions={stationOptions}
                    selectedSex={selectedSex} onSexChange={handleSexChange} sexOptions={sexOptions}
                    searchQuery={searchQuery} onSearchChange={handleSearchChange} 
                />
                
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-text">
                        {totalCount} {totalCount === 1 ? 'Employee' : 'Employees'} Found
                    </p>
                    <Button onClick={() => loadEmployees(currentPage)} variant="secondary" className="bg-surface shadow-sm border border-border text-muted hover:text-text hover:bg-background">
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Refresh
                    </Button>
                </div>

                <EmployeeTable employees={employees} isMobile={isMobile} />
                
                {/* Pagination Controls */}
                {totalCount > 0 && (
                    <PaginationControls 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalCount={totalCount}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                )}

                {employees.length === 0 && !loading && (
                    <div className="text-center mt-12 p-8 bg-surface rounded-xl border border-border border-dashed">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-background rounded-full mb-6 border border-border">
                            <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-xl text-text mb-6">No employees found matching your criteria.</p>
                        <Button onClick={() => { 
                            setSelectedDepartment("All Departments"); 
                            setSelectedLine("All Lines"); 
                            setSelectedStation("All Stations"); 
                            setSelectedSex("All Genders"); 
                            setSearchQuery(""); 
                        }} variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MasterTable;