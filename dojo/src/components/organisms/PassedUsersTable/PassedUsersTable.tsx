
// import React, { useEffect, useState } from 'react';
// import { Filter, Calendar, Users, AlertCircle, UserPlus, ClipboardCheck } from 'lucide-react';
// import type { User } from '../../constants/types';
// import { API_ENDPOINTS } from '../../constants/api';
// import { ErrorDisplay } from '../../molecules/ErrorDisplay/ErrorDisplay';
// import Level0Nav from '../../molecules/Level0Nav/Level0Nav';
// import { SearchBar } from '../../molecules/SearchBar/SearchBar';
// import { FilterDropdown } from '../../molecules/FilterDropdown/FilterDropdown';
// import { UserTableRow } from '../../molecules/UserTableRow/UserTableRow';
// import { EmptyState } from '../../molecules/EmptyState/EmptyState';
// import OrientationFeedbackModal from '../OrientationFeedbackModal/OrientationFeedbackModal';
// import { PageHeader } from '../../atoms/PageHeader/PageHeader';
// import EditUserModal from './EditUserModalProps';

// const PassedUsersTable: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [dateFilter, setDateFilter] = useState<string>('all');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [showDateDropdown, setShowDateDropdown] = useState(false);
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDetailLoading, setIsDetailLoading] = useState(false);

//   const statusOptions = [
//     { value: 'all', label: 'All Status' },
//     { value: 'added', label: 'Added to Master' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'eligible', label: 'Eligible' },
//     { value: 'not_eligible', label: 'Not Eligible' }
//   ];

//   const dateOptions = [
//     { value: 'all', label: 'All Time' },
//     { value: 'today', label: 'Today' },
//     { value: 'week', label: 'This Week' },
//     { value: 'month', label: 'This Month' },
//     { value: 'year', label: 'This Year' }
//   ];

//   const fetchData = async (tempId?: string) => {
//     try {
//       let url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ALL_PASSED_USERS}`;
//       if (tempId) {
//         url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PASSED_USER_BY_ID(tempId)}`;
//       }
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const data = await response.json();
//       const userArray = Array.isArray(data) ? data : [data];
//       setUsers(userArray);
//       setFilteredUsers(userArray);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const now = new Date();
//     let filtered = [...users];

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(user => {
//         const latestCheck = user.body_checks?.length > 0 ? user.body_checks[user.body_checks.length - 1] : null;

//         if (statusFilter === 'added') {
//           return user.is_added_to_master === true;
//         }

//         if (user.is_added_to_master === true) {
//           return false;
//         }

//         if (!latestCheck) return false;
//         return latestCheck.overall_status === statusFilter;
//       });
//     }

//     switch (dateFilter) {
//       case 'today':
//         filtered = filtered.filter(user => {
//           const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
//           if (!latestBodyCheck) return false;
//           const checkDate = new Date(latestBodyCheck.check_date);
//           return (
//             checkDate.getDate() === now.getDate() &&
//             checkDate.getMonth() === now.getMonth() &&
//             checkDate.getFullYear() === now.getFullYear()
//           );
//         });
//         break;
//       case 'week':
//         const startOfWeek = new Date(now);
//         startOfWeek.setDate(now.getDate() - now.getDay());
//         filtered = filtered.filter(user => {
//           const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
//           if (!latestBodyCheck) return false;
//           const checkDate = new Date(latestBodyCheck.check_date);
//           return checkDate >= startOfWeek && checkDate <= now;
//         });
//         break;
//       case 'month':
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//         filtered = filtered.filter(user => {
//           const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
//           if (!latestBodyCheck) return false;
//           const checkDate = new Date(latestBodyCheck.check_date);
//           return checkDate >= startOfMonth && checkDate <= now;
//         });
//         break;
//       case 'year':
//         const startOfYear = new Date(now.getFullYear(), 0, 1);
//         filtered = filtered.filter(user => {
//           const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
//           if (!latestBodyCheck) return false;
//           const checkDate = new Date(latestBodyCheck.check_date);
//           return checkDate >= startOfYear && checkDate <= now;
//         });
//         break;
//       default:
//         break;
//     }

//     if (searchTerm.trim() !== '') {
//       filtered = filtered.filter(user =>
//         user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredUsers(filtered);
//   }, [dateFilter, statusFilter, users, searchTerm]);

//   const handleRowClick = (user: User) => {
//     console.log("Row clicked", user);
//   };

//   const handleOpenFeedbackModal = (user: User) => {
//     const latestCheck = user.body_checks?.[user.body_checks.length - 1];

//     if (latestCheck?.overall_status === 'eligible' && !user.is_added_to_master) {
//       setSelectedUser(user);
//       setShowModal(true);
//     } else if (user.is_added_to_master) {
//       alert("This user is already added to the Master list.");
//     } else {
//       alert("Only eligible candidates can proceed to orientation/feedback.");
//     }
//   };

//   const handleEditUser = async (userToEdit: User) => {
//     const idToFetch = userToEdit.temp_id;
//     if (!idToFetch) return;

//     setIsDetailLoading(true);
//     setIsEditModalOpen(true);
//     setSelectedUser(userToEdit);
//     try {
//       const response = await fetch(`${API_ENDPOINTS.BASE_URL}/users/${idToFetch}/`);
//       if (!response.ok) throw new Error('Failed to fetch user details.');
//       const apiResponseData: any = await response.json();

//       const formattedUser: User = {
//         ...apiResponseData,
//         first_name: apiResponseData.firstName || apiResponseData.first_name,
//         last_name: apiResponseData.lastName || apiResponseData.last_name,
//         phone_number: apiResponseData.phoneNumber || apiResponseData.phone_number,
//         emergency_phone_number: apiResponseData.emergencyPhoneNumber || apiResponseData.emergency_phone_number, //new
//         sex: apiResponseData.sex,
//         aadharNumber: apiResponseData.aadharNumber,
//         employment_type: apiResponseData.employmentType || apiResponseData.employment_type,
//         hasExperience: apiResponseData.hasExperience,
//         experienceYears: apiResponseData.experienceYears,
//         companyOfExperience: apiResponseData.companyOfExperience,
//         temp_id: apiResponseData.tempId || apiResponseData.temp_id
//       };
//       setSelectedUser(formattedUser);
//     } catch (err) {
//       console.error(err);
//       setIsEditModalOpen(false);
//     } finally {
//       setIsDetailLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         const response = await fetch(`${API_ENDPOINTS.BASE_URL}/users/${userId}/`, {
//           method: 'DELETE',
//         });
//         if (!response.ok) throw new Error('Failed to delete user.');
//         setUsers(currentUsers => currentUsers.filter(user => user.temp_id !== userId));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Could not delete user.');
//       }
//     }
//   };

//   const getUserStatus = (user: User) => {
//     const latestCheck = user.body_checks?.length > 0 ? user.body_checks[user.body_checks.length - 1] : null;

//     if (user.is_added_to_master) {
//       return 'added';
//     }

//     if (!latestCheck) {
//       return 'pending';
//     }

//     return latestCheck.overall_status;
//   };

//   const pendingCount = users.filter(u => !u.body_checks || u.body_checks.length === 0).length;
//   const eligibleCount = users.filter(u => {
//     const latestCheck = u.body_checks?.length > 0 ? u.body_checks[u.body_checks.length - 1] : null;
//     return latestCheck?.overall_status === 'eligible' && !u.is_added_to_master;
//   }).length;

//   if (loading) return <div className="p-10 text-center">Loading...</div>;
//   if (error) return <ErrorDisplay error={error} />;

//   return (
//     <>
//       <Level0Nav />
//       <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-full mx-auto px-4">
//           {/* Reminder Cards & Status Legend - Side by Side */}
//           {(pendingCount > 0 || eligibleCount > 0) && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
//               {/* Pending Card */}
//               {pendingCount > 0 && (
//                 <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
//                       <ClipboardCheck className="h-6 w-6 text-orange-600" />
//                     </div>
//                     <div className="ml-4">
//                       <h3 className="text-base font-bold text-orange-900">⚠️ Body Check Pending</h3>
//                       <p className="text-sm text-orange-800 mt-1">
//                         <span className="font-bold text-lg">{pendingCount}</span> user{pendingCount !== 1 ? 's' : ''} waiting for body check completion
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Eligible Card */}
//               {eligibleCount > 0 && (
//                 <div className="bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 border-l-4 border-indigo-700 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0 bg-indigo-200 rounded-full p-2">
//                       <UserPlus className="h-6 w-6 text-indigo-700" />
//                     </div>
//                     <div className="ml-4">
//                       <h3 className="text-base font-bold text-white">🎯 Ready to Add to Master</h3>
//                       <p className="text-sm text-white mt-1">
//                         <span className="font-bold text-lg">{eligibleCount}</span> eligible user{eligibleCount !== 1 ? 's' : ''} ready to be added
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Enhanced Color Legend - Same Row */}
//               <div className={`bg-white shadow-md rounded-lg border border-gray-200 p-5 ${(pendingCount > 0 && eligibleCount > 0) ? 'lg:col-span-1' : 'lg:col-span-2'
//                 }`}>
//                 <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
//                   <span className="mr-2">🎨</span> Status Guide
//                 </h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-300">
//                     <div className="w-4 h-4 bg-indigo-600 rounded-full shadow-sm flex-shrink-0"></div>
//                     <div>
//                       <span className="text-xs font-bold text-indigo-900 block">Eligible</span>
//                       <p className="text-xs text-indigo-700">Ready</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300">
//                     <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm flex-shrink-0"></div>
//                     <div>
//                       <span className="text-xs font-bold text-orange-900 block">Pending</span>
//                       <p className="text-xs text-orange-700">Check</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-emerald-50 to-green-100 border border-green-300">
//                     <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
//                     <div>
//                       <span className="text-xs font-bold text-green-900 block">Added</span>
//                       <p className="text-xs text-green-700">Master</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-100 border border-red-300">
//                     <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm flex-shrink-0"></div>
//                     <div>
//                       <span className="text-xs font-bold text-red-900 block">Not Eligible</span>
//                       <p className="text-xs text-red-700">Rejected</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
          
//           <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
//             {/* Enhanced Blue & Purple Header */}
//             <div className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 border-b-4 border-indigo-100 shadow-xl">
//               <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-blue-800 backdrop-blur-sm p-3 rounded-lg shadow-lg">
//                     <Users className="h-7 w-7 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-blue-700 drop-shadow-lg">Employee Details</h2>
//                     <p className="text-blue-700 text-sm mt-1">Manage and view employee information</p>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
//                   {/* Enhanced Search Bar Container */}
//                   <div className="relative">
//                     <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//                   </div>
                  
//                   {/* Enhanced Status Filter */}
//                   <div className="relative">
//                     <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg hover:shadow-xl transition-all p-0.5">
//                       <div className="bg-white rounded-lg">
//                         <FilterDropdown
//                           title="Status Filter"
//                           currentValue={statusFilter}
//                           options={statusOptions}
//                           onSelect={setStatusFilter}
//                           isOpen={showStatusDropdown}
//                           setIsOpen={setShowStatusDropdown}
//                           icon={Filter}
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Enhanced Date Filter */}
//                   <div className="relative">
//                     <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg hover:shadow-xl transition-all p-0.5">
//                       <div className="bg-white rounded-lg">
//                         <FilterDropdown
//                           title="Date Filter"
//                           currentValue={dateFilter}
//                           options={dateOptions}
//                           onSelect={setDateFilter}
//                           isOpen={showDateDropdown}
//                           setIsOpen={setShowDateDropdown}
//                           icon={Calendar}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto w-full">
//               <table className="min-w-full w-full table-fixed">
//                 <thead className="bg-gradient-to-r from-purple-800 to-blue-800 border-b-2 border-indigo-800">
//                   <tr>
//                     <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">User</th>
//                     <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Sex</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Aadhaar</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Emp. Type</th>
//                     <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Exp.</th>
//                     <th className="w-16 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Yrs</th>
//                     {/* <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Company</th> */}
//                     <th className="w-48 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Emergency Phone Number</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Check Date</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Created</th>
//                     <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
//                     <th className="w-48 px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredUsers.map((user) => {
//                     const userStatus = getUserStatus(user);
//                     let rowClassName = 'transition-all duration-200';

//                     // Vibrant color coding based on status
//                     if (userStatus === 'eligible') {
//                       rowClassName = 'bg-gradient-to-r from-indigo-100 via-blue-100 to-purple-100 hover:from-indigo-200 hover:via-blue-200 hover:to-purple-200 border-l-4 border-l-indigo-600 shadow-sm hover:shadow-md';
//                     } else if (userStatus === 'pending') {
//                       rowClassName = 'bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 border-l-4 border-l-orange-500 shadow-sm hover:shadow-md';
//                     } else if (userStatus === 'added') {
//                       rowClassName = 'bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-l-4 border-l-green-500';
//                     } else if (userStatus === 'not_eligible') {
//                       rowClassName = 'bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-l-4 border-l-red-500';
//                     }

//                     return (
//                       <tr key={user.temp_id} className={rowClassName}>
//                         <UserTableRow
//                           user={user}
//                           onRowClick={handleRowClick}
//                           onEdit={handleEditUser}
//                           onDelete={handleDeleteUser}
//                           onFeedback={() => handleOpenFeedbackModal(user)}
//                         />
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {filteredUsers.length === 0 && (
//               <EmptyState hasUsers={users.length > 0} />
//             )}
//           </div>


//           {showModal && selectedUser && (
//             <OrientationFeedbackModal
//               user={selectedUser}
//               onClose={() => setShowModal(false)}
//               onSave={() => {
//                 setShowModal(false);
//                 fetchData();
//               }}
//             />
//           )}
//           {isEditModalOpen && (
//             <EditUserModal
//               isLoading={isDetailLoading}
//               user={selectedUser}
//               onClose={() => setIsEditModalOpen(false)}
//               onSave={() => {
//                 fetchData();
//                 setIsEditModalOpen(false);
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default PassedUsersTable;



import React, { useEffect, useState } from 'react';
import { Filter, Calendar, Users, AlertCircle, UserPlus, ClipboardCheck } from 'lucide-react';
import type { User } from '../../constants/types';
import { API_ENDPOINTS } from '../../constants/api';
import { ErrorDisplay } from '../../molecules/ErrorDisplay/ErrorDisplay';
import Level0Nav from '../../molecules/Level0Nav/Level0Nav';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { FilterDropdown } from '../../molecules/FilterDropdown/FilterDropdown';
import { UserTableRow } from '../../molecules/UserTableRow/UserTableRow';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import OrientationFeedbackModal from '../OrientationFeedbackModal/OrientationFeedbackModal';
import EditUserModal from './EditUserModalProps';

const PassedUsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'added', label: 'Added to Master' },
    { value: 'pending', label: 'Pending' },
    { value: 'eligible', label: 'Eligible' },
    { value: 'not_eligible', label: 'Not Eligible' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const fetchData = async (tempId?: string) => {
    try {
      let url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ALL_PASSED_USERS}`;
      if (tempId) {
        url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PASSED_USER_BY_ID(tempId)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const userArray = Array.isArray(data) ? data : [data];
      setUsers(userArray);
      setFilteredUsers(userArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    let filtered = [...users];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        const latestCheck = user.body_checks?.length > 0 ? user.body_checks[user.body_checks.length - 1] : null;

        if (statusFilter === 'added') {
          return user.is_added_to_master === true;
        }

        if (user.is_added_to_master === true) {
          return false;
        }

        if (!latestCheck) return false;
        return latestCheck.overall_status === statusFilter;
      });
    }

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(user => {
          const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
          if (!latestBodyCheck) return false;
          const checkDate = new Date(latestBodyCheck.check_date);
          return (
            checkDate.getDate() === now.getDate() &&
            checkDate.getMonth() === now.getMonth() &&
            checkDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(user => {
          const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
          if (!latestBodyCheck) return false;
          const checkDate = new Date(latestBodyCheck.check_date);
          return checkDate >= startOfWeek && checkDate <= now;
        });
        break;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(user => {
          const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
          if (!latestBodyCheck) return false;
          const checkDate = new Date(latestBodyCheck.check_date);
          return checkDate >= startOfMonth && checkDate <= now;
        });
        break;
      case 'year':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filtered = filtered.filter(user => {
          const latestBodyCheck = user.body_checks?.[user.body_checks.length - 1];
          if (!latestBodyCheck) return false;
          const checkDate = new Date(latestBodyCheck.check_date);
          return checkDate >= startOfYear && checkDate <= now;
        });
        break;
      default:
        break;
    }

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [dateFilter, statusFilter, users, searchTerm]);

  const handleRowClick = (user: User) => {
    console.log("Row clicked", user);
  };

  const handleOpenFeedbackModal = (user: User) => {
    const latestCheck = user.body_checks?.[user.body_checks.length - 1];

    if (latestCheck?.overall_status === 'eligible' && !user.is_added_to_master) {
      setSelectedUser(user);
      setShowModal(true);
    } else if (user.is_added_to_master) {
      alert("This user is already added to the Master list.");
    } else {
      alert("Only eligible candidates can proceed to orientation/feedback.");
    }
  };

  const handleEditUser = async (userToEdit: User) => {
    const idToFetch = userToEdit.temp_id;
    if (!idToFetch) return;

    setIsDetailLoading(true);
    setIsEditModalOpen(true);
    setSelectedUser(userToEdit);
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USER_BY_TEMP_ID(idToFetch)}`);
      if (!response.ok) throw new Error('Failed to fetch user details.');
      const apiResponseData: any = await response.json();

      const formattedUser: User = {
        ...apiResponseData,
        first_name: apiResponseData.firstName || apiResponseData.first_name,
        last_name: apiResponseData.lastName || apiResponseData.last_name,
        phone_number: apiResponseData.phoneNumber || apiResponseData.phone_number,
        emergency_phone_number: apiResponseData.emergencyPhoneNumber || apiResponseData.emergency_phone_number,
        sex: apiResponseData.sex,
        aadharNumber: apiResponseData.aadharNumber,
        employment_type: apiResponseData.employmentType || apiResponseData.employment_type,
        hasExperience: apiResponseData.hasExperience,
        experienceYears: apiResponseData.experienceYears,
        companyOfExperience: apiResponseData.companyOfExperience,
        temp_id: apiResponseData.tempId || apiResponseData.temp_id
      };
      setSelectedUser(formattedUser);
    } catch (err) {
      console.error(err);
      setIsEditModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USER_BY_TEMP_ID(userId)}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user.');
        setUsers(currentUsers => currentUsers.filter(user => user.temp_id !== userId));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete user.');
      }
    }
  };

  const getUserStatus = (user: User) => {
    const latestCheck = user.body_checks?.length > 0 ? user.body_checks[user.body_checks.length - 1] : null;

    if (user.is_added_to_master) {
      return 'added';
    }

    if (!latestCheck) {
      return 'pending';
    }

    return latestCheck.overall_status;
  };

  const pendingCount = users.filter(u => !u.body_checks || u.body_checks.length === 0).length;
  const eligibleCount = users.filter(u => {
    const latestCheck = u.body_checks?.length > 0 ? u.body_checks[u.body_checks.length - 1] : null;
    return latestCheck?.overall_status === 'eligible' && !u.is_added_to_master;
  }).length;

  if (loading) return <div className="p-10 text-center bg-background text-text dark:text-white">Loading...</div>;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <>
      <Level0Nav />
      {/* Main Container - Added dark:bg-gray-950 */}
      <div className="min-h-screen bg-background dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full mx-auto px-4">
          
          {/* Status Cards */}
          {(pendingCount > 0 || eligibleCount > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {pendingCount > 0 && (
                <div className="bg-surface dark:bg-gray-800 border border-orange-200 dark:border-orange-900/50 border-l-4 border-l-orange-500 p-5 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/20 rounded-full p-2">
                      <ClipboardCheck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-bold text-orange-700 dark:text-orange-400">⚠️ Body Check Pending</h3>
                      <p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
                        <span className="font-bold text-lg">{pendingCount}</span> user{pendingCount !== 1 ? 's' : ''} waiting
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {eligibleCount > 0 && (
                <div className="bg-surface dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900/50 border-l-4 border-l-indigo-600 p-5 rounded-lg shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-full p-2">
                      <UserPlus className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-400">🎯 Ready to Add</h3>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">
                        <span className="font-bold text-lg">{eligibleCount}</span> eligible user{eligibleCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Guide */}
              <div className={`bg-surface dark:bg-gray-800 shadow-sm rounded-lg border border-border dark:border-gray-700 p-5 ${(pendingCount > 0 && eligibleCount > 0) ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
                <h3 className="text-sm font-bold text-text dark:text-gray-200 mb-3 flex items-center">
                  <span className="mr-2">🎨</span> Status Guide
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Eligible</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-bold text-orange-900 dark:text-orange-300">Pending</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-bold text-green-900 dark:text-green-300">Added</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-bold text-red-900 dark:text-red-300">Rej.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-surface dark:bg-gray-900 shadow-md rounded-lg border border-border dark:border-gray-700 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 bg-background dark:bg-gray-900 border-b border-border dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg shadow-sm">
                    <Users className="h-7 w-7 text-blue-700 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text dark:text-white">Employee Details</h2>
                    <p className="text-muted dark:text-gray-400 text-sm mt-1">Manage and view employee information</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                  {/* Search Bar Wrapper with Deep Overrides */}
                  <div className="relative bg-background dark:bg-gray-800 rounded-md 
                    [&_input]:dark:bg-gray-800 
                    [&_input]:dark:text-white 
                    [&_input]:dark:border-gray-600 
                    [&_input]:dark:placeholder-gray-400
                    [&_svg]:dark:text-gray-400">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                  </div>
                  
                  {/* Status Filter Wrapper with Deep Overrides */}
                  <div className="relative">
                    <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm transition-all text-gray-700 dark:text-gray-200
                      [&_button]:dark:text-gray-200
                      [&_button]:dark:bg-transparent">
                      <FilterDropdown
                        title="Status Filter"
                        currentValue={statusFilter}
                        options={statusOptions}
                        onSelect={setStatusFilter}
                        isOpen={showStatusDropdown}
                        setIsOpen={setShowStatusDropdown}
                        icon={Filter}
                      />
                    </div>
                  </div>
                  
                  {/* Date Filter Wrapper with Deep Overrides */}
                  <div className="relative">
                    <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm transition-all text-gray-700 dark:text-gray-200
                      [&_button]:dark:text-gray-200
                      [&_button]:dark:bg-transparent">
                      <FilterDropdown
                        title="Date Filter"
                        currentValue={dateFilter}
                        options={dateOptions}
                        onSelect={setDateFilter}
                        isOpen={showDateDropdown}
                        setIsOpen={setShowDateDropdown}
                        icon={Calendar}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="min-w-full w-full table-fixed divide-y divide-border dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="w-48 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="w-20 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Sex</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Aadhaar</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Emp. Type</th>
                    <th className="w-20 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Exp.</th>
                    <th className="w-16 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Yrs</th>
                    <th className="w-48 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Phone</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Emergency Phone Number</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Check Date</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Created</th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="w-48 px-6 py-4 text-center text-xs font-bold text-muted dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-surface dark:bg-gray-900 divide-y divide-border dark:divide-gray-700">
                  {filteredUsers.map((user) => {
                    const userStatus = getUserStatus(user);
                    
                    let rowClassName = 'transition-all duration-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800';

                    if (userStatus === 'eligible') {
                      rowClassName = 'bg-surface dark:bg-gray-900 border-l-4 border-l-indigo-500 hover:bg-indigo-50/10 dark:hover:bg-indigo-900/10';
                    } else if (userStatus === 'pending') {
                      rowClassName = 'bg-surface dark:bg-gray-900 border-l-4 border-l-orange-500 hover:bg-orange-50/10 dark:hover:bg-orange-900/10';
                    } else if (userStatus === 'added') {
                      rowClassName = 'bg-surface dark:bg-gray-900 border-l-4 border-l-green-500 hover:bg-green-50/10 dark:hover:bg-green-900/10';
                    } else if (userStatus === 'not_eligible') {
                      rowClassName = 'bg-surface dark:bg-gray-900 border-l-4 border-l-red-500 hover:bg-red-50/10 dark:hover:bg-red-900/10';
                    }

                    return (
                      <tr key={user.temp_id} className={rowClassName}>
                        <UserTableRow
                          user={user}
                          onRowClick={handleRowClick}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          onFeedback={() => handleOpenFeedbackModal(user)}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty State Wrapper with Deep Overrides */}
            {filteredUsers.length === 0 && (
              <div className="w-full bg-white dark:bg-gray-900 
                [&>div]:dark:bg-gray-900 
                [&_div]:dark:bg-gray-900 
                [&_h3]:dark:text-gray-200 
                [&_p]:dark:text-gray-400
                [&_svg]:dark:text-gray-500">
                <EmptyState hasUsers={users.length > 0} />
              </div>
            )}
          </div>


          {showModal && selectedUser && (
            <OrientationFeedbackModal
              user={selectedUser}
              onClose={() => setShowModal(false)}
              onSave={() => {
                setShowModal(false);
                fetchData();
              }}
            />
          )}
          {isEditModalOpen && (
            <EditUserModal
              isLoading={isDetailLoading}
              user={selectedUser}
              onClose={() => setIsEditModalOpen(false)}
              onSave={() => {
                fetchData();
                setIsEditModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PassedUsersTable;
