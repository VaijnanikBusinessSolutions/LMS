// import React, { useState, FormEvent, useEffect } from 'react';
// import axios from 'axios';

// // Interface for a single Role object returned from the API
// interface Role {
//   id: number; // Assuming roles have a unique ID
//   name: string;
//   is_active: boolean; // Assuming roles have an active/inactive status
// }

// const RoleManagement: React.FC = () => {
//   // State for the input field to create a new role
//   const [newRoleName, setNewRoleName] = useState<string>('');
//   // State to store the list of fetched roles
//   const [rolesList, setRolesList] = useState<Role[]>([]);
//   // State for error messages
//   const [error, setError] = useState<string>('');
//   // State for success messages
//   const [success, setSuccess] = useState<string>('');
//   // Loading state for API calls
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   // Function to fetch roles from the API
//   const fetchRoles = async () => {
//     setIsLoading(true);
//     setError(''); // Clear previous errors
//     try {
//       // Adjust the URL if your API endpoint is different
//       const response = await axios.get<{ roles: Role[] }>('http://localhost:8000/roles/');
//       // Assuming the API returns an object with a 'roles' key containing an array
//       // If it returns just the array, use response.data directly
//       setRolesList(response.data.roles || response.data);
//     } catch (err) {
//       console.error("Failed to fetch roles:", err);
//       setError('Failed to load roles. Please try again later.');
//       setRolesList([]); // Clear the list on error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch roles when the component mounts
//   useEffect(() => {
//     fetchRoles();
//   }, []); // Empty dependency array means this runs once on mount

//   // Handler for the new role input change
//   const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewRoleName(e.target.value);
//     // Clear error and success messages when the user types
//     setError('');
//     setSuccess('');
//   };

//   // Handler for form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setIsLoading(true);

//     const trimmedRoleName = newRoleName.trim();

//     // --- Validation ---
//     if (!trimmedRoleName) {
//       setError('Role name cannot be empty.');
//       setIsLoading(false);
//       return;
//     }
//     // Example backend validation check (adjust if needed based on actual backend errors/constraints)
//     if (trimmedRoleName.length > 50) {
//        setError('Role name cannot exceed 50 characters.');
//        setIsLoading(false);
//        return;
//     }
//     // Add more validation as needed (e.g., disallowed characters)


//     // --- API Call ---
//     try {
//       const response = await axios.post('http://localhost:8000/roles/', {
//         name: trimmedRoleName,
//         is_active: true, // Defaulting to active, adjust if your UI needs to control this
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       // Success Feedback
//       setSuccess(`Role "${response.data.name}" created successfully!`);
//       setNewRoleName(''); // Clear the input field
//       await fetchRoles(); // Refresh the list of roles to include the new one

//     } catch (err: any) {
//       console.error("Error creating role:", err);
//       // Attempt to extract a user-friendly error message
//       let message = 'An unexpected error occurred while creating the role.';
//       if (err.response) {
//         // Backend returned an error status code
//         if (err.response.data?.name?.includes('already exists')) { // Example check, adjust based on your backend error format
//           message = `Role "${trimmedRoleName}" already exists.`;
//         } else if (err.response.data?.detail) {
//           message = err.response.data.detail; // Use specific detail if provided
//         } else if (err.response.data) {
//           // Try to get a generic message from the response data
//           const errorMessages = Object.values(err.response.data)
//             .flat() // Flatten potential arrays of errors
//             .join(' '); // Join multiple errors into one string
//           if (errorMessages) message = errorMessages;
//         }
//       } else if (err.request) {
//         // Request was made but no response received
//         message = 'Network error: Could not connect to the server.';
//       }
//       setError(message);
//     } finally {
//       setIsLoading(false); // Ensure loading state is turned off
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl"> {/* Increased max-width */}
//         <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Role Management Settings</h2>

//         {/* Display Error/Success Messages */}
//         {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}
//         {success && <p className="text-green-500 mb-4 text-center font-medium">{success}</p>}

//         {/* --- Create Role Form --- */}
//         <form onSubmit={handleSubmit} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Create New Role</h3>
//           <div className="flex flex-col sm:flex-row items-center gap-4">
//             <div className="flex-grow w-full sm:w-auto">
//               <label htmlFor="newRoleNameInput" className="block text-gray-700 text-sm font-medium mb-1">
//                 Role Name
//               </label>
//               <input
//                 id="newRoleNameInput"
//                 type="text"
//                 name="newRoleName"
//                 value={newRoleName}
//                 onChange={handleRoleNameChange}
//                 className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
//                 placeholder="Enter role name (e.g., Admin, Manager)"
//                 maxLength={50} // Enforce max length client-side
//                 aria-label="New Role Name"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={isLoading || !newRoleName.trim()} // Disable if loading or input is empty after trimming
//             >
//               {isLoading ? 'Creating...' : 'Create Role'}
//             </button>
//           </div>
//         </form>

//         {/* --- Existing Roles List --- */}
//         <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Existing Roles</h3>

//           {isLoading && (
//             <div className="flex justify-center items-center py-8">
//               <p className="text-blue-500 animate-pulse">Loading roles...</p>
//             </div>
//           )}

//           {!isLoading && rolesList.length === 0 && !error && (
//             <p className="text-center text-gray-500 py-8">No roles have been created yet.</p>
//           )}

//           {!isLoading && rolesList.length > 0 && (
//             <table className="min-w-full divide-y divide-gray-200 rounded-md overflow-hidden">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   {/* Add other columns like Actions if needed later */}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {rolesList.map((role) => (
//                   <tr key={role.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span className={`inline-flex px-3 py-1 text-xs font-semibold leading-5 rounded-full ${role.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                         {role.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     {/* Example Action buttons placeholder:
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
//                       <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
//                       <button className="text-red-600 hover:text-red-900">Delete</button>
//                     </td>
//                     */}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RoleManagement;






// src/components/pages/RoleManagement.tsx

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, ShieldCheck, Plus, Check, AlertCircle } from 'lucide-react';

// Interface for a single Role object returned from the API
interface Role {
  id: number; // Assuming roles have a unique ID
  name: string;
  is_active: boolean; // Assuming roles have an active/inactive status
}

const RoleManagement: React.FC = () => {
  // State for the input field to create a new role
  const [newRoleName, setNewRoleName] = useState<string>('');
  // State to store the list of fetched roles
  const [rolesList, setRolesList] = useState<Role[]>([]);
  // State for error messages
  const [error, setError] = useState<string>('');
  // State for success messages
  const [success, setSuccess] = useState<string>('');
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch roles from the API
  const fetchRoles = async () => {
    setIsLoading(true);
    setError(''); // Clear previous errors
    try {
      // Adjust the URL if your API endpoint is different
      const response = await axios.get<{ roles: Role[] }>('http://localhost:8000/roles/');
      // Assuming the API returns an object with a 'roles' key containing an array
      // If it returns just the array, use response.data directly
      setRolesList(response.data.roles || response.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setError('Failed to load roles. Please try again later.');
      setRolesList([]); // Clear the list on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles when the component mounts
  useEffect(() => {
    fetchRoles();
  }, []); // Empty dependency array means this runs once on mount

  // Handler for the new role input change
  const handleRoleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(e.target.value);
    // Clear error and success messages when the user types
    setError('');
    setSuccess('');
  };

  // Handler for form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const trimmedRoleName = newRoleName.trim();

    // --- Validation ---
    if (!trimmedRoleName) {
      setError('Role name cannot be empty.');
      setIsLoading(false);
      return;
    }
    // Example backend validation check (adjust if needed based on actual backend errors/constraints)
    if (trimmedRoleName.length > 50) {
       setError('Role name cannot exceed 50 characters.');
       setIsLoading(false);
       return;
    }
    // Add more validation as needed (e.g., disallowed characters)


    // --- API Call ---
    try {
      const response = await axios.post('http://localhost:8000/roles/', {
        name: trimmedRoleName,
        is_active: true, // Defaulting to active, adjust if your UI needs to control this
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Success Feedback
      setSuccess(`Role "${response.data.name}" created successfully!`);
      setNewRoleName(''); // Clear the input field
      await fetchRoles(); // Refresh the list of roles to include the new one

    } catch (err: any) {
      console.error("Error creating role:", err);
      // Attempt to extract a user-friendly error message
      let message = 'An unexpected error occurred while creating the role.';
      if (err.response) {
        // Backend returned an error status code
        if (err.response.data?.name?.includes('already exists')) { // Example check, adjust based on your backend error format
          message = `Role "${trimmedRoleName}" already exists.`;
        } else if (err.response.data?.detail) {
          message = err.response.data.detail; // Use specific detail if provided
        } else if (err.response.data) {
          // Try to get a generic message from the response data
          const errorMessages = Object.values(err.response.data)
            .flat() // Flatten potential arrays of errors
            .join(' '); // Join multiple errors into one string
          if (errorMessages) message = errorMessages;
        }
      } else if (err.request) {
        // Request was made but no response received
        message = 'Network error: Could not connect to the server.';
      }
      setError(message);
    } finally {
      setIsLoading(false); // Ensure loading state is turned off
    }
  };

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-300 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">Role Management</h1>
            <p className="text-muted mt-1">Define and manage user roles and permissions</p>
          </div>
        </div>

        {/* Display Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* --- Create Role Form --- */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-8">
          <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Create New Role
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-grow w-full">
                <label htmlFor="newRoleNameInput" className="block text-sm font-medium text-text mb-2">
                  Role Name
                </label>
                <input
                  id="newRoleNameInput"
                  type="text"
                  name="newRoleName"
                  value={newRoleName}
                  onChange={handleRoleNameChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary text-text outline-none transition-all duration-200"
                  placeholder="Enter role name (e.g., Admin, Manager)"
                  maxLength={50} // Enforce max length client-side
                  aria-label="New Role Name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                disabled={isLoading || !newRoleName.trim()} 
              >
                {isLoading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full block"></span>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {isLoading ? 'Creating...' : 'Create Role'}
              </button>
            </div>
          </form>
        </div>

        {/* --- Existing Roles List --- */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/5">
            <h3 className="text-xl font-bold text-text flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Existing Roles
            </h3>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full"></div>
            </div>
          )}

          {!isLoading && rolesList.length === 0 && !error && (
            <div className="text-center py-12 text-muted">
              No roles have been created yet.
            </div>
          )}

          {!isLoading && rolesList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/10">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Role Name</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    {/* Add other columns like Actions if needed later */}
                  </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                  {rolesList.map((role) => (
                    <tr key={role.id} className="hover:bg-muted/5 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{role.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold leading-5 rounded-full ${role.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;