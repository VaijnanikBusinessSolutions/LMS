


// import React, { useEffect, useState } from 'react';
// import { Building, User as UserIcon, Calendar } from 'lucide-react';
// import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
// import { Input } from '../../atoms/Inputs/Inputs';
// import { Icon } from '../../atoms/LucidIcons/LucidIcons';
// import SelectField from '../../atoms/Select/select';
// import axios from 'axios';
// import { API_ENDPOINTS } from '../../constants/api';

// interface OrientationFields {
//   emp_id: string;
//   date_of_joining: string;
//   department: string;
// }

// interface Department {
//   id: number;
//   name: string;
// }

// interface OrientationFormProps {
//   orientationFields: OrientationFields;
//   setOrientationFields: (fields: OrientationFields) => void;
//   error?: string;
//   // userCreationDate is no longer needed
// }

// export const OrientationForm: React.FC<OrientationFormProps> = ({
//   orientationFields,
//   setOrientationFields,
//   error
// }) => {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // --- DATE LIMITS STATE ---
//   const [dateLimits, setDateLimits] = useState({ min: '', max: '' });

//   useEffect(() => {
//     // 1. Get Today
//     const today = new Date();

//     // 2. Calculate 4 Days Ago
//     const fourDaysAgo = new Date(today);
//     fourDaysAgo.setDate(today.getDate() - 4);

//     // 3. Helper function to format as YYYY-MM-DD
//     // We use manual formatting to respect local timezone vs UTC issues
//     const formatDate = (date: Date) => {
//       const year = date.getFullYear();
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const day = String(date.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     };

//     setDateLimits({
//       min: formatDate(fourDaysAgo), // The 21st (if today is 25th)
//       max: formatDate(today)        // The 25th
//     });
//   }, []);

//   // --- FETCH DEPARTMENTS ---
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DEPARTMENT}`);
//         if (Array.isArray(response.data)) {
//           const deptData: Department[] = response.data.map((dept: any) => ({
//             id: dept.department_id,
//             name: dept.department_name
//           }));
//           setDepartments(deptData);
//         }
//       } catch (error) {
//         console.error('Error fetching departments:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDepartments();
//   }, []);

//   const handleInputChange = (field: keyof OrientationFields, value: string) => {
//     setOrientationFields({ ...orientationFields, [field]: value });
//   };

//   const departmentOptions = [
//     { value: '', label: loading ? 'Loading...' : 'Select Department' },
//     ...departments.map(dept => ({ value: dept.id.toString(), label: dept.name }))
//   ];

//   return (
//     <div>
//       <h4 className="text-lg font-medium text-text mb-4">Additional Employee Details</h4>
//       {error && <ErrorMessage message={error} />}
//       <div className="space-y-4">
//          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <SelectField
//             label="Department"
//             id="department"
//             options={departmentOptions}
//             value={orientationFields.department || ''}
//             onChange={(e) => handleInputChange('department', e.target.value)}
//             icon={<Icon icon={Building} className="text-muted" />}
//             required
//           />
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             label="Employee ID"
//             type="text"
//             id="empId"
//             value={orientationFields.emp_id}
//             onChange={(e) => handleInputChange('emp_id', e.target.value)}
//             placeholder="Enter employee ID"
//             required
//             icon={<Icon icon={UserIcon} className="text-muted" />}
//           />

//           <Input
//             label="Date of Joining"
//             type="date"
//             id="dateOfJoining"
//             value={orientationFields.date_of_joining}
//             onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
//             required
//             min={dateLimits.min} // 4 days ago
//             max={dateLimits.max} // Today
//             icon={<Icon icon={Calendar} className="text-muted" />}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Building, User as UserIcon, Calendar } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Input } from '../../atoms/Inputs/Inputs';
import { Icon } from '../../atoms/LucidIcons/LucidIcons';
import SelectField from '../../atoms/Select/select';
import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/api';

interface OrientationFields {
  emp_id: string;
  date_of_joining: string;
  department: string;
}

interface Department {
  id: number;
  name: string;
}

interface OrientationFormProps {
  orientationFields: OrientationFields;
  setOrientationFields: (fields: OrientationFields) => void;
  error?: string;
}

export const OrientationForm: React.FC<OrientationFormProps> = ({
  orientationFields,
  setOrientationFields,
  error
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [dateLimits, setDateLimits] = useState({ min: '', max: '' });

  useEffect(() => {
    const today = new Date();
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(today.getDate() - 4);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setDateLimits({
      min: formatDate(fourDaysAgo),
      max: formatDate(today)
    });
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DEPARTMENT}`);
        if (Array.isArray(response.data)) {
          const deptData: Department[] = response.data.map((dept: any) => ({
            id: dept.department_id,
            name: dept.department_name
          }));
          setDepartments(deptData);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (field: keyof OrientationFields, value: string) => {
    setOrientationFields({ ...orientationFields, [field]: value });
  };

  const departmentOptions = [
    { value: '', label: loading ? 'Loading...' : 'Select Department' },
    ...departments.map(dept => ({ value: dept.id.toString(), label: dept.name }))
  ];

  // Dark theme input styles
  const inputClass = "bg-background border border-border text-text placeholder-muted focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg w-full transition-colors duration-200";

  return (
    <div>
      <h4 className="text-lg font-medium text-text mb-4">Additional Employee Details</h4>
      {error && <ErrorMessage message={error} />}
      <div className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="custom-select-wrapper bg-background border border-border rounded-lg text-text p-4">
              <SelectField
                label="Department"
                id="department"
                options={departmentOptions}
                value={orientationFields.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                icon={<Icon icon={Building} className="text-text" />}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="empId" className="block text-sm font-medium text-text mb-1">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="empId"
              value={orientationFields.emp_id}
              onChange={(e) => handleInputChange('emp_id', e.target.value)}
              placeholder="Enter employee ID"
              required
              icon={<Icon icon={UserIcon} className="text-muted" />}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="dateOfJoining" className="block text-sm font-medium text-text mb-1">
              Date of Joining <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              id="dateOfJoining"
              value={orientationFields.date_of_joining}
              onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
              required
              min={dateLimits.min}
              max={dateLimits.max}
              icon={<Icon icon={Calendar} className="text-muted" />}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Force SelectField internals to match dark theme */}
      <style>{`
        .custom-select-wrapper select {
          background-color: transparent !important;
          color: inherit !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        /* Fallback for options dropdown background in dark mode */
        .custom-select-wrapper option {
          background-color: #1e293b; 
          color: #f8fafc;
        }
      `}</style>
    </div>
  );
};