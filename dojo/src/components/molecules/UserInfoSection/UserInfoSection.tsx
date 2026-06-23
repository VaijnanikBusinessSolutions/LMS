


// import React, { useState, useEffect } from 'react';
// import { User as UserIcon, Mail, Phone, Calendar, CreditCard, Award, Building, Briefcase, Clock } from 'lucide-react';
// import type { User } from '../../constants/types';
// import { Icon } from '../../atoms/LucidIcons/LucidIcons';

// // --- CHANGE 1: Define the shape of our form data (camelCase for consistency) ---
// interface UserFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   aadharNumber: string;
//   employmentType: string;
//   hasExperience: boolean;
//   experienceYears: number;
//   companyOfExperience: string;
// }

// // --- CHANGE 2: Update the props interface ---
// interface UserInfoSectionProps {
//   user: User;
//   onFormUpdate: (updatedData: UserFormData) => void;
// }

// export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user, onFormUpdate }) => {
//   // --- CHANGE 3: Create internal state to manage the form ---
//   const [formData, setFormData] = useState<UserFormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     aadharNumber: '',
//     employmentType: 'contractual',
//     hasExperience: false,
//     experienceYears: 0,
//     companyOfExperience: '',
//   });

//   // --- CHANGE 4: Use useEffect to populate the form with initial user data ---
//   useEffect(() => {
//     if (user) {
//       const initialFormData: UserFormData = {
//         firstName: user.first_name || '',
//         lastName: user.last_name || '',
//         email: user.email || '',
//         phoneNumber: user.phone_number || '',
//         aadharNumber: user.aadharNumber || '',
//         employmentType: user.employment_type || 'contractual',
//         hasExperience: user.hasExperience || false,
//         experienceYears: user.experienceYears || 0,
//         companyOfExperience: user.companyOfExperience || '',
//       };
//       setFormData(initialFormData);
//       onFormUpdate(initialFormData); // Send initial state to parent
//     }
//   }, [user]); // This runs only when the user prop changes

//   // --- CHANGE 5: A single, powerful handler for all inputs ---
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;

//     const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
//     const newFormData = {
//       ...formData,
//       [name]: isCheckbox ? e.target.checked : value,
//     };

//     setFormData(newFormData);
//     onFormUpdate(newFormData); // Notify the parent of the change
//   };

//   return (
//     <div>
//       <h4 className="text-lg font-medium text-purple-100 mb-4">User Information</h4>
//       <div className="space-y-6 p-4 from-purple-100 to-purple-100 rounded-lg">
//         {/* --- CHANGE 6: Update all inputs to be editable and controlled --- */}
        
//         {/* Basic Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//             <input 
//               id="firstName" 
//               name="firstName" 
//               type="text" 
//               value={formData.firstName} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//               placeholder="Enter first name"
//             />
//           </div>
//           <div>
//             <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//             <input 
//               id="lastName" 
//               name="lastName" 
//               type="text" 
//               value={formData.lastName} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//               placeholder="Enter last name"
//             />
//           </div>
//         </div>
        
//         {/* Temp ID (disabled) */}
//         <div>
//           <label htmlFor="tempId" className="block text-sm font-medium text-gray-700 mb-2">Temp ID</label>
//           <input 
//             id="tempId" 
//             name="tempId" 
//             type="text" 
//             value={user.temp_id || ''} 
//             readOnly 
//             disabled 
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm" 
//           />
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input 
//               id="email" 
//               name="email" 
//               type="email" 
//               value={formData.email} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//               placeholder="user@example.com"
//             />
//           </div>
//           <div>
//             <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//             <input 
//               id="phoneNumber" 
//               name="phoneNumber" 
//               type="tel" 
//               value={formData.phoneNumber} 
//               onChange={handleChange} 
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//               placeholder="+91 XXXXX XXXXX"
//             />
//           </div>
//         </div>

//         {/* Identity */}
//         <div>
//           <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
//           <input 
//             id="aadharNumber" 
//             name="aadharNumber" 
//             type="text" 
//             value={formData.aadharNumber} 
//             onChange={handleChange} 
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//             placeholder="XXXX XXXX XXXX"
//           />
//         </div>

//         {/* Employment Type */}
//         <div>
//           <label htmlFor="employmentType" className="font-medium text-gray-700 mb-2 block">Employment Type</label>
//           <select 
//             id="employmentType" 
//             name="employmentType" 
//             value={formData.employmentType} 
//             onChange={handleChange} 
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400 cursor-pointer"
//           >
//             <option value="contractual">Contractual</option>
//             <option value="permanent">Permanent</option>
//           </select>
//         </div>

//         {/* Experience Section */}
//         <div className="border-t pt-4">
//           <label className="flex items-center gap-2 mb-4">
//             <input 
//               type="checkbox" 
//               id="hasExperience" 
//               name="hasExperience" 
//               checked={formData.hasExperience} 
//               onChange={handleChange} 
//               className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
//             />
//             <span className="font-medium text-gray-900">Has Prior Experience?</span>
//           </label>

//           {formData.hasExperience && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
//                 <input 
//                   id="experienceYears" 
//                   name="experienceYears" 
//                   type="number" 
//                   value={formData.experienceYears} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//                   placeholder="0"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="companyOfExperience" className="block text-sm font-medium text-gray-700 mb-2">Previous Company</label>
//                 <input 
//                   id="companyOfExperience" 
//                   name="companyOfExperience" 
//                   type="text" 
//                   value={formData.companyOfExperience} 
//                   onChange={handleChange} 
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:border-purple-400" 
//                   placeholder="Company name"
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };





import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, CreditCard, Award, Building, Briefcase, Clock } from 'lucide-react';
import type { User } from '../../constants/types';
import { Icon } from '../../atoms/LucidIcons/LucidIcons';

// --- CHANGE 1: Define the shape of our form data (camelCase for consistency) ---
interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  aadharNumber: string;
  employmentType: string;
  hasExperience: boolean;
  experienceYears: number;
  companyOfExperience: string;
}

// --- CHANGE 2: Update the props interface ---
interface UserInfoSectionProps {
  user: User;
  onFormUpdate: (updatedData: UserFormData) => void;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ user, onFormUpdate }) => {
  // --- CHANGE 3: Create internal state to manage the form ---
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    employmentType: 'contractual',
    hasExperience: false,
    experienceYears: 0,
    companyOfExperience: '',
  });

  // --- CHANGE 4: Use useEffect to populate the form with initial user data ---
  useEffect(() => {
    if (user) {
      const initialFormData: UserFormData = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        aadharNumber: user.aadharNumber || '',
        employmentType: user.employment_type || 'contractual',
        hasExperience: user.hasExperience || false,
        experienceYears: user.experienceYears || 0,
        companyOfExperience: user.companyOfExperience || '',
      };
      setFormData(initialFormData);
      onFormUpdate(initialFormData); // Send initial state to parent
    }
  }, [user]); // This runs only when the user prop changes

  // --- CHANGE 5: A single, powerful handler for all inputs ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
    const newFormData = {
      ...formData,
      [name]: isCheckbox ? e.target.checked : value,
    };

    setFormData(newFormData);
    onFormUpdate(newFormData); // Notify the parent of the change
  };

  return (
    <div>
      <h4 className="text-lg font-medium text-text mb-4">User Information</h4>
      <div className="space-y-6 p-4 bg-background rounded-lg border border-border">
        {/* --- CHANGE 6: Update all inputs to be editable and controlled --- */}
        
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text mb-2">First Name</label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              value={formData.firstName} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text mb-2">Last Name</label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              value={formData.lastName} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
              placeholder="Enter last name"
            />
          </div>
        </div>
        
        {/* Temp ID (disabled) */}
        <div>
          <label htmlFor="tempId" className="block text-sm font-medium text-text mb-2">Temp ID</label>
          <input 
            id="tempId" 
            name="tempId" 
            type="text" 
            value={user.temp_id || ''} 
            readOnly 
            disabled 
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-muted cursor-not-allowed shadow-sm" 
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-2">Phone Number</label>
            <input 
              id="phoneNumber" 
              name="phoneNumber" 
              type="tel" 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        {/* Identity */}
        <div>
          <label htmlFor="aadharNumber" className="block text-sm font-medium text-text mb-2">Aadhar Number</label>
          <input 
            id="aadharNumber" 
            name="aadharNumber" 
            type="text" 
            value={formData.aadharNumber} 
            onChange={handleChange} 
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
            placeholder="XXXX XXXX XXXX"
          />
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="font-medium text-text mb-2 block">Employment Type</label>
          <select 
            id="employmentType" 
            name="employmentType" 
            value={formData.employmentType} 
            onChange={handleChange} 
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="contractual">Contractual</option>
            <option value="permanent">Permanent</option>
          </select>
        </div>

        {/* Experience Section */}
        <div className="border-t border-border pt-4">
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input 
              type="checkbox" 
              id="hasExperience" 
              name="hasExperience" 
              checked={formData.hasExperience} 
              onChange={handleChange} 
              className="h-4 w-4 text-blue-600 bg-surface border-border rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="font-medium text-text">Has Prior Experience?</span>
          </label>

          {formData.hasExperience && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideDown">
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-text mb-2">Years of Experience</label>
                <input 
                  id="experienceYears" 
                  name="experienceYears" 
                  type="number" 
                  value={formData.experienceYears} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="companyOfExperience" className="block text-sm font-medium text-text mb-2">Previous Company</label>
                <input 
                  id="companyOfExperience" 
                  name="companyOfExperience" 
                  type="text" 
                  value={formData.companyOfExperience} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-text focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm" 
                  placeholder="Company name"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};