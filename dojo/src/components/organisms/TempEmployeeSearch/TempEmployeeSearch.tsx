// import { useState, useEffect } from "react";

// import Level0Nav from "../../molecules/Level0Nav/Level0Nav";
// import HumanBodyCheckSheet from "../HumanBodyCheckSheet/HumanBodyCheckSheet";
// import { humanBodyCheckService } from "../../hooks/ServiceApis";
// import type { UserInfo } from "../../constants/types";

// const TempEmployeeSearch = () => {
//     // State for data
//     const [allUsers, setAllUsers] = useState<UserInfo[]>([]); // Stores the full list
//     const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]); // Stores what is shown in table
    
//     // State for UI
//     const [searchTerm, setSearchTerm] = useState("");
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState("");
    
//     // State for Modal
//     const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

//     // 1. Fetch all users on component mount
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setIsLoading(true);
//                 const data = await humanBodyCheckService.fetchTempUsers();
//                 setAllUsers(data);
//                 setFilteredUsers(data); // Initially, show everyone
//             } catch (err) {
//                 console.error("Error fetching users:", err);
//                 setError("Failed to load employee list.");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchUsers();
//     }, []);

//     // 2. Handle Filtering locally
//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const term = e.target.value;
//         setSearchTerm(term);

//         if (term === "") {
//             setFilteredUsers(allUsers);
//             return;
//         }

//         const lowerCaseTerm = term.toLowerCase();
//         const filtered = allUsers.filter((user) => {
//             const firstName = (user.firstName ?? "").toLowerCase();
//             const email = (user.email ?? "").toLowerCase();
//             const phoneNumber = (user.phoneNumber ?? "").toLowerCase();
//             const tempId = (user.tempId ?? "").toLowerCase();

//             return (
//                 firstName.includes(lowerCaseTerm) ||
//                 email.includes(lowerCaseTerm) ||
//                 phoneNumber.includes(lowerCaseTerm) ||
//                 tempId.includes(lowerCaseTerm)
//             );
//         });

//         setFilteredUsers(filtered);
//     };

//     // 3. Modal Actions
//     const openAssessmentModal = (user: UserInfo) => {
//         setSelectedUser(user);
//     };

//     const closeAssessmentModal = () => {
//         setSelectedUser(null);
//     };

//     const handleAssessmentComplete = () => {
//         alert("Assessment completed successfully!");
//         closeAssessmentModal();
//         // Optional: Refresh list if assessment status changes need to be reflected
//     };

//     // Helper function to check if check sheet is completed
//     const isCheckSheetCompleted = (user: UserInfo) => {
//         // Adjust this based on your actual data structure
//         // Examples: user.checkSheetStatus === 'completed' or user.isCompleted === true
//         return user.checkSheetStatus === 'completed' || user.isCompleted === true;
//     };

//     return (
//         <>
//             <Level0Nav />
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8">
//                 <div className="w-full px-6 lg:px-12">
                    
//                     {/* Page Header & Controls */}
//                     <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
//                         <div>
//                             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                 Human Body CheckSheet List
//                             </h1>
//                             <p className="text-sm text-gray-600 mt-1">Manage medical assessments for all employees</p>
//                         </div>

//                         {/* Search Bar */}
//                         <div className="relative w-full md:w-96">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                             </div>
//                             <input
//                                 type="text"
//                                 className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out shadow-sm"
//                                 placeholder="Search by name, ID, email, phone..."
//                                 value={searchTerm}
//                                 onChange={handleSearch}
//                             />
//                         </div>
//                     </div>

//                     {/* Main Content Area */}
//                     {error && (
//                         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
//                             <p className="text-red-700 font-medium">{error}</p>
//                         </div>
//                     )}

//                     <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
//                         {isLoading ? (
//                             <div className="p-16 flex flex-col items-center justify-center text-gray-500">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//                                 <p className="text-lg font-medium">Loading employees...</p>
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
//                                         <tr>
//                                             <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
//                                                 Employee Details
//                                             </th>
//                                             <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
//                                                 Temp ID
//                                             </th>
//                                             <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
//                                                 Email Address
//                                             </th>
//                                             <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
//                                                 Phone Number
//                                             </th>
//                                             {/* <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
//                                                 Status
//                                             </th> */}
//                                             <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
//                                                 Actions
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {filteredUsers.length > 0 ? (
//                                             filteredUsers.map((user) => {
//                                                 const isCompleted = isCheckSheetCompleted(user);
//                                                 return (
//                                                     <tr 
//                                                         key={user.tempId} 
//                                                         className={`transition-all duration-200 ${
//                                                             isCompleted 
//                                                                 ? 'hover:bg-green-50 bg-white' 
//                                                                 : 'hover:bg-amber-50 bg-amber-25'
//                                                         }`}
//                                                     >
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="flex items-center">
//                                                                 <div className="flex-shrink-0 h-12 w-12">
//                                                                     <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
//                                                                         isCompleted 
//                                                                             ? 'bg-gradient-to-br from-green-400 to-green-600' 
//                                                                             : 'bg-gradient-to-br from-amber-400 to-orange-500'
//                                                                     }`}>
//                                                                         {user.firstName?.charAt(0).toUpperCase() || "?"}
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="ml-4">
//                                                                     <div className="text-sm font-semibold text-gray-900">
//                                                                         {[user.firstName, user.lastName].filter(Boolean).join(" ")}
//                                                                     </div>
//                                                                     <div className="text-xs text-gray-500">
//                                                                         {/* Employee */}
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
//                                                                 {user.tempId}
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="flex items-center text-sm text-gray-900">
//                                                                 <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                                                 </svg>
//                                                                 {user.email || 'N/A'}
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="flex items-center text-sm text-gray-900">
//                                                                 <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                                                 </svg>
//                                                                 {user.phoneNumber || 'N/A'}
//                                                             </div>
//                                                         </td>
//                                                         {/* <td className="px-6 py-4 whitespace-nowrap text-center">
//                                                             {isCompleted ? (
//                                                                 <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
//                                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                                     </svg>
//                                                                     Completed
//                                                                 </span>
//                                                             ) : (
//                                                                 <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
//                                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                                                                     </svg>
//                                                                     Pending
//                                                                 </span>
//                                                             )}
//                                                         </td> */}
//                                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                                             <button
//                                                                 onClick={() => openAssessmentModal(user)}
//                                                                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
//                                                             >
//                                                                 <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                                                 </svg>
//                                                                 Open Check Sheet
//                                                             </button>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={6} className="px-6 py-12 text-center">
//                                                     <div className="flex flex-col items-center justify-center text-gray-500">
//                                                         <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                                                         </svg>
//                                                         <p className="text-lg font-medium">No employees found</p>
//                                                         {searchTerm && (
//                                                             <p className="text-sm mt-1">No results matching "{searchTerm}"</p>
//                                                         )}
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>

//                     {/* Summary Stats */}
//                     {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//                             <p className="text-sm text-gray-600">Total Employees</p>
//                             <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
//                         </div>
//                         <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//                             <p className="text-sm text-gray-600">Completed</p>
//                             <p className="text-2xl font-bold text-green-600">
//                                 {filteredUsers.filter(user => isCheckSheetCompleted(user)).length}
//                             </p>
//                         </div>
//                         <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
//                             <p className="text-sm text-gray-600">Pending</p>
//                             <p className="text-2xl font-bold text-amber-600">
//                                 {filteredUsers.filter(user => !isCheckSheetCompleted(user)).length}
//                             </p>
//                         </div>
//                     </div> */}
//                 </div>
//             </div>

//             {/* Assessment Modal */}
//             {selectedUser && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//                     {/* Backdrop */}
//                     <div 
//                         className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
//                         onClick={closeAssessmentModal}
//                     ></div>

//                     {/* Modal Panel */}
//                     <div className="flex items-center justify-center min-h-screen p-4">
//                         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl transform transition-all flex flex-col max-h-[90vh]">
                            
//                             {/* Header */}
//                             <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-white">
//                                         Medical Assessment Check Sheet
//                                     </h3>
//                                     <p className="text-sm text-blue-100 mt-1">
//                                         Employee: <span className="font-semibold text-white">{selectedUser.firstName}</span> • ID: {selectedUser.tempId}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={closeAssessmentModal}
//                                     className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/20 transition-colors"
//                                 >
//                                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             {/* Scrollable Body */}
//                             <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//                                 <HumanBodyCheckSheet
//                                     tempId={selectedUser.tempId}
//                                     userDetails={selectedUser}
//                                     onNext={handleAssessmentComplete}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default TempEmployeeSearch;




import { useState, useEffect } from "react";

import Level0Nav from "../../molecules/Level0Nav/Level0Nav";
import HumanBodyCheckSheet from "../HumanBodyCheckSheet/HumanBodyCheckSheet";
import { humanBodyCheckService } from "../../hooks/ServiceApis";
import type { UserInfo } from "../../constants/types";

const TempEmployeeSearch = () => {
    // State for data
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]); // Stores the full list
    const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]); // Stores what is shown in table
    
    // State for UI
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    
    // State for Modal
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

    // 1. Fetch all users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const data = await humanBodyCheckService.fetchTempUsers();
                setAllUsers(data);
                setFilteredUsers(data); // Initially, show everyone
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load employee list.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 2. Handle Filtering locally
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term === "") {
            setFilteredUsers(allUsers);
            return;
        }

        const lowerCaseTerm = term.toLowerCase();
        const filtered = allUsers.filter((user) => {
            const firstName = (user.firstName ?? "").toLowerCase();
            const email = (user.email ?? "").toLowerCase();
            const phoneNumber = (user.phoneNumber ?? "").toLowerCase();
            const tempId = (user.tempId ?? "").toLowerCase();

            return (
                firstName.includes(lowerCaseTerm) ||
                email.includes(lowerCaseTerm) ||
                phoneNumber.includes(lowerCaseTerm) ||
                tempId.includes(lowerCaseTerm)
            );
        });

        setFilteredUsers(filtered);
    };

    // 3. Modal Actions
    const openAssessmentModal = (user: UserInfo) => {
        setSelectedUser(user);
    };

    const closeAssessmentModal = () => {
        setSelectedUser(null);
    };

    const handleAssessmentComplete = () => {
        alert("Assessment completed successfully!");
        closeAssessmentModal();
        // Optional: Refresh list if assessment status changes need to be reflected
    };

    // Helper function to check if check sheet is completed
    const isCheckSheetCompleted = (user: UserInfo) => {
        // Adjust this based on your actual data structure
        // Examples: user.checkSheetStatus === 'completed' or user.isCompleted === true
        return user.checkSheetStatus === 'completed' || user.isCompleted === true;
    };

    return (
        <>
            <Level0Nav />
            <div className="min-h-screen bg-background py-8">
                <div className="w-full px-6 lg:px-12">
                    
                    {/* Page Header & Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-text">
                                Human Body CheckSheet List
                            </h1>
                            <p className="text-sm text-muted mt-1">Manage medical assessments for all employees</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg leading-5 bg-surface text-text placeholder-muted focus:outline-none focus:placeholder-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out shadow-sm"
                                placeholder="Search by name, ID, email, phone..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="bg-surface shadow-sm rounded-2xl overflow-hidden border border-border">
                        {isLoading ? (
                            <div className="p-16 flex flex-col items-center justify-center text-muted">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-lg font-medium">Loading employees...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-background">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                                Employee Details
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                                Temp ID
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                                Email Address
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">
                                                Phone Number
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-muted uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-surface divide-y divide-border">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => {
                                                const isCompleted = isCheckSheetCompleted(user);
                                                return (
                                                    <tr 
                                                        key={user.tempId} 
                                                        className={`transition-all duration-200 hover:bg-background`}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                                                                        isCompleted 
                                                                            ? 'bg-green-500' 
                                                                            : 'bg-blue-500'
                                                                    }`}>
                                                                        {user.firstName?.charAt(0).toUpperCase() || "?"}
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-semibold text-text">
                                                                        {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                                                                    </div>
                                                                    <div className="text-xs text-muted">
                                                                        {/* Employee */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                                {user.tempId}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center text-sm text-text">
                                                                <svg className="w-4 h-4 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                {user.email || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center text-sm text-text">
                                                                <svg className="w-4 h-4 mr-2 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                {user.phoneNumber || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => openAssessmentModal(user)}
                                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all duration-200"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                Open Check Sheet
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center text-muted">
                                                        <svg className="w-16 h-16 mb-4 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                        <p className="text-lg font-medium text-text">No employees found</p>
                                                        {searchTerm && (
                                                            <p className="text-sm mt-1">No results matching "{searchTerm}"</p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assessment Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm"
                        onClick={closeAssessmentModal}
                    ></div>

                    {/* Modal Panel */}
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-6xl transform transition-all flex flex-col max-h-[90vh] border border-border">
                            
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-blue-600 rounded-t-2xl">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Medical Assessment Check Sheet
                                    </h3>
                                    <p className="text-sm text-blue-100 mt-1">
                                        Employee: <span className="font-semibold text-white">{selectedUser.firstName}</span> • ID: {selectedUser.tempId}
                                    </p>
                                </div>
                                <button
                                    onClick={closeAssessmentModal}
                                    className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-background">
                                <HumanBodyCheckSheet
                                    tempId={selectedUser.tempId}
                                    userDetails={selectedUser}
                                    onNext={handleAssessmentComplete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TempEmployeeSearch;