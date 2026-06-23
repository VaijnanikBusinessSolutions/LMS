


// import React from 'react';
// import { Mail, Phone, User as UserIcon, Pencil, Trash2, ClipboardList } from 'lucide-react';
// import type { User } from '../../constants/types';
// import { Icon } from '../../atoms/LucidIcons/LucidIcons';
// import { StatusBadge } from '../../atoms/StatusBadge/StatusBadge';
// import { API_ENDPOINTS } from '../../constants/api';

// interface UserTableRowProps {
//   user: User;
//   onRowClick: (user: User) => void;
//   onEdit: (user: User) => void;
//   onDelete: (userId: string) => void;
//   onFeedback?: (user: User) => void;
// }

// export const UserTableRow: React.FC<UserTableRowProps> = ({
//   user,
//   onRowClick,
//   onEdit,
//   onDelete,
//   onFeedback
// }) => {

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   const formatTime = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
//     } catch (error) {
//       return 'Invalid time';
//     }
//   };

//   const latestCheck = user.body_checks && user.body_checks.length > 0
//     ? user.body_checks[user.body_checks.length - 1]
//     : null;

//   const isEligible = latestCheck && (latestCheck.overall_status === 'eligible' || latestCheck.overall_status === 'pass');
//   const hasChecks = latestCheck !== null;
//   const isAddedToMaster = user.is_added_to_master;

//   const handleEditClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onEdit(user);
//   };

//   const handleDeleteClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onDelete(user.temp_id);
//   };

//   const handleFeedbackClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (onFeedback) {
//       onFeedback(user);
//     }
//   };

//   return (
//     <>
//       {/* 1. USER COLUMN */}
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center">
//           {user.photo ? (
//             <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
//               <img
//                 src={`${API_ENDPOINTS.BASE_URL}${user.photo}`}
//                 alt={`${user.first_name}`}
//                 className="h-full w-full object-cover"
//               />
//             </div>
//           ) : (
//             <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <UserIcon className="h-5 w-5 text-blue-700" />
//             </div>
//           )}
//           <div className="ml-4">
//             <div className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
//             <div className="text-xs text-gray-500">{user.temp_id}</div>
//           </div>
//         </div>
//       </td>

//       {/* 2. SEX */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.sex || '-'}
//       </td>

//       {/* 3. AADHAR NUMBER */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.aadharNumber || '-'}
//       </td>

//       {/* 4. EMPLOYMENT TYPE */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
//         {user.employment_type ? user.employment_type.replace('_', ' ') : '-'}
//       </td>

//       {/* 5. HAS EXPERIENCE */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.hasExperience ? (
//           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//             Yes
//           </span>
//         ) : (
//           <span className="text-gray-400">No</span>
//         )}
//       </td>

//       {/* 6. EXPERIENCE YEARS */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.experienceYears ? `${user.experienceYears} Yrs` : '-'}
//       </td>

//       {/* 7. COMPANY OF EXPERIENCE */}
//       {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={user.companyOfExperience || ''}>
//         {user.companyOfExperience || '-'}
//       </td> */}

//       {/* 8. EMAIL */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.email ? (
//           <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline flex items-center" onClick={(e) => e.stopPropagation()}>
//             <Icon icon={Mail} size={14} className="mr-1" />
//             {user.email}
//           </a>
//         ) : (
//           <span className="text-gray-400">-</span>
//         )}
//       </td>

//       {/* 9. PHONE */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         <a href={`tel:${user.phone_number}`} className="hover:text-blue-600 flex items-center" onClick={(e) => e.stopPropagation()}>
//           <Icon icon={Phone} size={14} className="mr-1" />
//           {user.phone_number}
//         </a>
//       </td>
//        {/* NEW: EMERGENCY PHONE */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {user.emergency_phone_number ? (
//           <a href={`tel:${user.emergency_phone_number}`} className="hover:text-blue-600 flex items-center" onClick={(e) => e.stopPropagation()}>
//             {/* You can use the same Phone icon or import PhoneCall/AlertCircle if you prefer */}
//             <Icon icon={Phone} size={14} className="mr-1 text-red-400" />
//             {user.emergency_phone_number}
//           </a>
//         ) : (
//           <span className="text-gray-400">-</span>
//         )}
//       </td>

//       {/* 10. CHECK DATE */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         {hasChecks ? (
//           <div>
//             <div className="font-medium">{formatDate(latestCheck.check_date)}</div>
//             <div className="text-xs text-gray-500">{formatTime(latestCheck.check_date)}</div>
//           </div>
//         ) : (<span className="text-gray-400">No checks</span>)}
//       </td>

//       {/* 11. CREATED AT */}
//       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//         <div>
//           <div className="font-medium">{formatDate(user.created_at)}</div>
//           <div className="text-xs text-gray-500">{formatTime(user.created_at)}</div>
//         </div>
//       </td>

//       {/* 12. STATUS */}
//       <td className="px-6 py-4 whitespace-nowrap">
//         {isAddedToMaster ? (
//           <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
//             ✓ ADDED
//           </span>
//         ) : hasChecks ? (
//           // Check the status and apply colors
//           latestCheck.overall_status === 'eligible' || latestCheck.overall_status === 'pass' ? (
//             <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
//               ✓ ELIGIBLE
//             </span>
//           ) : latestCheck.overall_status === 'not_eligible' || latestCheck.overall_status === 'fail' ? (
//             <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
//               ✗ NOT ELIGIBLE
//             </span>
//           ) : (
//             <StatusBadge status={latestCheck.overall_status} />
//           )
//         ) : (
//           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
//             ⏳ PENDING
//           </span>
//         )}
//       </td>

//       {/* 13. ACTIONS - ENHANCED */}
//       <td className="px-6 py-4 whitespace-nowrap">
//         <div className="flex items-center justify-end gap-2">
          
//           {isEligible && !isAddedToMaster && onFeedback && (
//             <button
//               onClick={handleFeedbackClick}
//               className="group relative px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
//               title="Open Orientation Feedback"
//             >
//               <ClipboardList className="h-4 w-4" />
//               <span className="text-xs">Add To Matertable</span>
//             </button>
//           )}

//           {/* Edit Button - Enhanced with disabled state */}
//           {/* <button
//             onClick={handleEditClick}
//             disabled={isAddedToMaster}
//             className={`group relative px-4 py-2 font-semibold rounded-lg shadow-md hover:shadow-xl transform transition-all duration-200 flex items-center gap-2 ${
//               isAddedToMaster
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105"
//             }`}
//             title={isAddedToMaster ? "Cannot edit a user that has been added" : "Edit User"}
//           >
//             <Pencil className="h-4 w-4" />
//             <span className="text-xs">Edit</span>
//           </button> */}

//           {/* Delete Button - Enhanced */}
//           {/* <button
//             onClick={handleDeleteClick}
//             className="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
//             title="Delete User"
//           >
//             <Trash2 className="h-4 w-4" />
//             <span className="text-xs">Delete</span>
//           </button> */}
//         </div>
//       </td>
//     </>
//   );
// };



import React from 'react';
import { Mail, Phone, User as UserIcon, Pencil, Trash2, ClipboardList } from 'lucide-react';
import type { User } from '../../constants/types';
import { Icon } from '../../atoms/LucidIcons/LucidIcons';
import { StatusBadge } from '../../atoms/StatusBadge/StatusBadge';
import { API_ENDPOINTS } from '../../constants/api';

interface UserTableRowProps {
  user: User;
  onRowClick: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onFeedback?: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onRowClick,
  onEdit,
  onDelete,
  onFeedback
}) => {

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const latestCheck = user.body_checks && user.body_checks.length > 0
    ? user.body_checks[user.body_checks.length - 1]
    : null;

  const isEligible = latestCheck && (latestCheck.overall_status === 'eligible' || latestCheck.overall_status === 'pass');
  const hasChecks = latestCheck !== null;
  const isAddedToMaster = user.is_added_to_master;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(user);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(user.temp_id);
  };

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFeedback) {
      onFeedback(user);
    }
  };

  return (
    <>
      {/* 1. USER COLUMN */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {user.photo ? (
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-border">
              <img
                src={`${API_ENDPOINTS.BASE_URL}${user.photo}`}
                alt={`${user.first_name}`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div className="ml-4">
            <div className="text-sm font-semibold text-text">{user.first_name} {user.last_name}</div>
            <div className="text-xs text-muted">{user.temp_id}</div>
          </div>
        </div>
      </td>

      {/* 2. SEX */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.sex || '-'}
      </td>

      {/* 3. AADHAR NUMBER */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.aadharNumber || '-'}
      </td>

      {/* 4. EMPLOYMENT TYPE */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text capitalize">
        {user.employment_type ? user.employment_type.replace('_', ' ') : '-'}
      </td>

      {/* 5. HAS EXPERIENCE */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.hasExperience ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            Yes
          </span>
        ) : (
          <span className="text-muted">No</span>
        )}
      </td>

      {/* 6. EXPERIENCE YEARS */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.experienceYears ? `${user.experienceYears} Yrs` : '-'}
      </td>

      {/* 8. EMAIL */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.email ? (
          <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline flex items-center" onClick={(e) => e.stopPropagation()}>
            <Icon icon={Mail} size={14} className="mr-1 text-muted" />
            {user.email}
          </a>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>

      {/* 9. PHONE */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        <a href={`tel:${user.phone_number}`} className="hover:text-blue-600 flex items-center" onClick={(e) => e.stopPropagation()}>
          <Icon icon={Phone} size={14} className="mr-1 text-muted" />
          {user.phone_number}
        </a>
      </td>
       {/* NEW: EMERGENCY PHONE */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {user.emergency_phone_number ? (
          <a href={`tel:${user.emergency_phone_number}`} className="hover:text-blue-600 flex items-center" onClick={(e) => e.stopPropagation()}>
            <Icon icon={Phone} size={14} className="mr-1 text-red-400" />
            {user.emergency_phone_number}
          </a>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>

      {/* 10. CHECK DATE */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        {hasChecks ? (
          <div>
            <div className="font-medium text-text">{formatDate(latestCheck.check_date)}</div>
            <div className="text-xs text-muted">{formatTime(latestCheck.check_date)}</div>
          </div>
        ) : (<span className="text-muted">No checks</span>)}
      </td>

      {/* 11. CREATED AT */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
        <div>
          <div className="font-medium text-text">{formatDate(user.created_at)}</div>
          <div className="text-xs text-muted">{formatTime(user.created_at)}</div>
        </div>
      </td>

      {/* 12. STATUS */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isAddedToMaster ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
            ✓ ADDED
          </span>
        ) : hasChecks ? (
          // Check the status and apply colors
          latestCheck.overall_status === 'eligible' || latestCheck.overall_status === 'pass' ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
              ✓ ELIGIBLE
            </span>
          ) : latestCheck.overall_status === 'not_eligible' || latestCheck.overall_status === 'fail' ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
              ✗ NOT ELIGIBLE
            </span>
          ) : (
            <StatusBadge status={latestCheck.overall_status} />
          )
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            ⏳ PENDING
          </span>
        )}
      </td>

      {/* 13. ACTIONS */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          
          {isEligible && !isAddedToMaster && onFeedback && (
            <button
              onClick={handleFeedbackClick}
              className="group relative px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              title="Add To Master Table"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="text-xs">Add To Master</span>
            </button>
          )}

          {/* Edit Button - Commented out in original, kept for structure if needed */}
          {/* <button
            onClick={handleEditClick}
            disabled={isAddedToMaster}
            className={`group relative px-4 py-2 font-semibold rounded-lg shadow-sm hover:shadow-md transform transition-all duration-200 flex items-center gap-2 ${
              isAddedToMaster
                ? "bg-gray-100 text-muted cursor-not-allowed border border-border"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
            }`}
            title={isAddedToMaster ? "Cannot edit a user that has been added" : "Edit User"}
          >
            <Pencil className="h-4 w-4" />
            <span className="text-xs">Edit</span>
          </button> */}

          {/* Delete Button - Commented out in original */}
          {/* <button
            onClick={handleDeleteClick}
            className="group relative px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-xs">Delete</span>
          </button> */}
        </div>
      </td>
    </>
  );
};