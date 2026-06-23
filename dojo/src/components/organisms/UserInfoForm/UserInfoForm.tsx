

// import React, { useState } from 'react';
// import {
//   User,
//   Mail,
//   Phone,
//   IdCard,
//   Building2,
//   Briefcase,
//   Calendar,
//   Badge,
//   CalendarPlus,
//   PhoneCall, // Added a specific icon for emergency if needed, or reuse Phone
// } from 'lucide-react';
// import { Input } from '../../atoms/Inputs/Inputs';
// import SelectField from '../../atoms/Select/select';
// import { saveUserInfo } from '../../hooks/ServiceApis';
// import { PhotoUpload } from '../../molecules/PhotoUpload/PhotoUpload';
// import { ProgressBar } from '../../atoms/ProgressBarPercentage/ProgressBarPercentage';
// import { FormActions } from '../../molecules/FormAction/FormAction';
// import { StatusAlert } from '../../molecules/StatusAlert/StatusAlert';
// import { useNavigate } from 'react-router-dom';
// import { CameraModal } from '../../molecules/PhotoUpload/CameraModal';

// interface UserInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   emergency_phone_number: string; // 1. Added Field Type
//   sex: string;
//   photo: File | null;
//   dateOfBirth: string | null;
//   aadharNumber: string;
//   employmentType: 'contractual' | 'permanent' | '';
//   hasExperience: boolean;
//   experienceYears: string;
//   companyOfExperience: string;
//   dateOfJoining: string;
//   employeeId: string;
// }

// export const UserInfoForm: React.FC = () => {
//   const navigate = useNavigate();

//   const initialUserInfo: UserInfo = {
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     emergency_phone_number: '', // 2. Added Initial State
//     sex: 'M',
//     photo: null,
//     dateOfBirth: null,
//     aadharNumber: '',
//     employmentType: '',
//     hasExperience: false,
//     experienceYears: '',
//     companyOfExperience: '',
//     dateOfJoining: '',
//     employeeId: '',
//   };

//   const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
//   const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

//   // 🔹 Validation Regex
//   const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+){0,2}$/;
//   const repeatingDigitsRegex = /^(\d)\1+$/;
//   const companyNameRegex = /^[A-Za-z0-9\s]+$/;
//   const validPhoneCharsRegex = /^\+?\d+$/;

//   const handleInputChange = (field: keyof UserInfo, value: any) => {
//     setUserInfo((prev) => ({ ...prev, [field]: value }));

//     if (errors[field]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (!file) return;

//     if (!file.type.startsWith('image/')) {
//       setErrors((prev) => ({ ...prev, photo: 'Please select an image file.' }));
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setErrors((prev) => ({ ...prev, photo: 'Image must be less than 5MB.' }));
//       return;
//     }

//     handleInputChange('photo', file);

//     const reader = new FileReader();
//     reader.onload = () => setPhotoPreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };
//  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;

//     // 1. Remove any non-digit characters
//     const cleanValue = value.replace(/\D/g, '');

//     // 2. Limit to 12 digits
//     const truncatedValue = cleanValue.slice(0, 12);

//     // 3. Add spaces after every 4 digits
//     let formattedValue = truncatedValue;
//     if (truncatedValue.length > 4) {
//       formattedValue = `${truncatedValue.slice(0, 4)} ${truncatedValue.slice(4)}`;
//     }
//     if (truncatedValue.length > 8) {
//       formattedValue = `${formattedValue.slice(0, 9)} ${truncatedValue.slice(8)}`;
//     }

//     // 4. Update state
//     handleInputChange('aadharNumber', formattedValue);
//   };
//   const handlePhotoCapture = (file: File) => {
//     if (!file) return;

//     handleInputChange('photo', file);

//     const reader = new FileReader();
//     reader.onload = () => setPhotoPreview(reader.result as string);
//     reader.readAsDataURL(file);

//     setIsCameraModalOpen(false);
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof UserInfo, string>> = {};

//     const trimmedFirstName = userInfo.firstName.trim();
//     if (!trimmedFirstName) {
//       newErrors.firstName = "First Name is required.";
//     } else if (trimmedFirstName.length < 3) {
//       newErrors.firstName = "First Name must be at least 3 characters long.";
//     } else if (!nameRegex.test(trimmedFirstName)) {
//       newErrors.firstName = "Only alphabets and spaces are allowed.";
//     }

//     if (userInfo.lastName && !nameRegex.test(userInfo.lastName.trim())) {
//       newErrors.lastName = "Only alphabets and up to two spaces are allowed.";
//     }

//     if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
//       newErrors.email = "Please enter a valid email address.";
//     }

//     // Primary Phone Validation
//     const phoneInput = userInfo.phoneNumber.trim();
//     if (phoneInput) {
//       if (!validPhoneCharsRegex.test(phoneInput)) {
//         newErrors.phoneNumber = "Phone number can only contain digits and '+' sign.";
//       } else {
//         const cleanedPhone = phoneInput.replace('+', '');
//         if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
//           newErrors.phoneNumber = "Enter a valid phone number (10-15 digits).";
//         } else if (repeatingDigitsRegex.test(cleanedPhone)) {
//           newErrors.phoneNumber = "Invalid phone number (all repeating digits).";
//         }
//       }
//     }

//     // 3. Emergency Phone Validation
//     // const emergencyPhoneInput = userInfo.emergency_phone_number.trim();
//     // if (!emergencyPhoneInput) {
//     //     newErrors.emergency_phone_number = "Emergency phone number is required.";
//     // } else {
//     //   if (!validPhoneCharsRegex.test(emergencyPhoneInput)) {
//     //     newErrors.emergency_phone_number = "Digits and '+' sign only.";
//     //   } else {
//     //     const cleanedEmPhone = emergencyPhoneInput.replace('+', '');
//     //     if (cleanedEmPhone.length < 10 || cleanedEmPhone.length > 15) {
//     //       newErrors.emergency_phone_number = "Enter valid number (10-15 digits).";
//     //     } else if (repeatingDigitsRegex.test(cleanedEmPhone)) {
//     //       newErrors.emergency_phone_number = "Invalid phone number.";
//     //     } else if (emergencyPhoneInput === phoneInput) {
//     //        // Optional: warning if same as main phone
//     //        newErrors.emergency_phone_number = "Emergency number should be different.";
//     //     }
//     //   }
//     // }
//      const emergencyPhoneInput = userInfo.emergency_phone_number.trim();
//     if (emergencyPhoneInput) {
//       // Only validate if the user has entered something
//       if (!validPhoneCharsRegex.test(emergencyPhoneInput)) {
//         newErrors.emergency_phone_number = "Digits and '+' sign only.";
//       } else {
//         const cleanedEmPhone = emergencyPhoneInput.replace('+', '');
//         if (cleanedEmPhone.length < 10 || cleanedEmPhone.length > 15) {
//           newErrors.emergency_phone_number = "Enter valid number (10-15 digits).";
//         } else if (repeatingDigitsRegex.test(cleanedEmPhone)) {
//           newErrors.emergency_phone_number = "Invalid phone number.";
//         }
//       }
//     }

//    const rawAadhaar = userInfo.aadharNumber.replace(/\s/g, ''); 
    
//     // Only check if user has entered something
//     if (rawAadhaar.length > 0) {
//         if (rawAadhaar.length < 12) {
//             newErrors.aadharNumber = "Aadhaar number is not correct (must be 12 digits).";
//         } else if (repeatingDigitsRegex.test(rawAadhaar)) {
//             newErrors.aadharNumber = "Invalid Aadhaar number (repeating digits).";
//         }
//     }

//     if (userInfo.hasExperience) {
//       if (!userInfo.experienceYears.trim()) {
//         newErrors.experienceYears = "Experience years are required.";
//       } else if (parseFloat(userInfo.experienceYears) < 0) {
//         newErrors.experienceYears = "Experience years cannot be negative.";
//       }

//       if (!userInfo.companyOfExperience.trim()) {
//         newErrors.companyOfExperience = "Company name is required.";
//       } else if (!companyNameRegex.test(userInfo.companyOfExperience)) {
//         newErrors.companyOfExperience = 'Company name can only contain letters, numbers, and spaces.';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       console.log('❌ Validation failed:', errors);
//       return;
//     }

//     setFormStatus('submitting');
//     setIsSubmitting(true);
//     setSubmitError(null);
//     setErrors({});

//     const formData = new FormData();
//     formData.append('firstName', userInfo.firstName);
//     formData.append('lastName', userInfo.lastName);
//     formData.append('email', userInfo.email || '');
//     formData.append('phoneNumber', userInfo.phoneNumber);
//     // 4. Append to FormData
//     formData.append('emergency_phone_number', userInfo.emergency_phone_number); 
//     formData.append('sex', userInfo.sex);
//     formData.append('dateOfBirth', userInfo.dateOfBirth || '');
//     formData.append('aadharNumber', userInfo.aadharNumber.replace(/\s/g, ''));
//     formData.append('employment_type', userInfo.employmentType || '');
//     formData.append('hasExperience', String(userInfo.hasExperience));
//     formData.append('experienceYears', userInfo.experienceYears || '');
//     formData.append('companyOfExperience', userInfo.companyOfExperience || '');
//     if (userInfo.photo instanceof File) formData.append('photo', userInfo.photo);
//     formData.append('employeeId', userInfo.employeeId || '');
//     formData.append('dateOfJoining', userInfo.dateOfJoining || '');

//     try {
//       const response = await saveUserInfo(formData);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Backend error response:', errorData);

//         if (response.status === 400 && typeof errorData === 'object') {
//           const formattedErrors: Partial<Record<keyof UserInfo, string>> = {};
//           Object.keys(errorData).forEach((key) => {
//             const msgs = errorData[key];
//             if (Array.isArray(msgs) && msgs.length > 0) {
//               formattedErrors[key as keyof UserInfo] = msgs[0];
//             }
//           });
//           setErrors(formattedErrors);
//           setSubmitError('Please correct the highlighted fields.');
//         } else {
//           setSubmitError('Unexpected error occurred.');
//         }
//         setFormStatus('error');
//         return;
//       }

//       const newEmployee = await response.json();
//       console.log("✅ SERVER RESPONSE JSON:", newEmployee);
//       const newEmployeeId = newEmployee.temp_id || newEmployee.tempId || newEmployee.id;

//       if (!newEmployeeId) {
//         console.error("❌ ID not found in response. Keys available:", Object.keys(newEmployee));
//         setFormStatus('error');
//         setSubmitError(`Profile created, but ID missing. Server sent: ${JSON.stringify(newEmployee)}`);
//         setIsSubmitting(false);
//         return;
//       }

//       setFormStatus('success');
//       setTimeout(() => {
//         navigate(`/human-body-checkpoint/${newEmployeeId}`);
//       }, 1500);

//     } catch (error: unknown) {
//       console.error('❌ Submission failed:', error);
//       setFormStatus('error');
//       setSubmitError('Network or server error.');
//     } finally {
//       if (formStatus !== 'success') setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setUserInfo(initialUserInfo);
//     setErrors({});
//     setPhotoPreview(null);
//     setSubmitError(null);
//     setFormStatus('idle');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50  py-10 px-4 sm:px-2 lg:px-2">
//       <CameraModal
//         isOpen={isCameraModalOpen}
//         onClose={() => setIsCameraModalOpen(false)}
//         onCapture={handlePhotoCapture}
//       />

//       <div className="w-full mx-auto animate-slideUp px-8">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5">

//           {/* Header */}
//           <div className="relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
//             <div className="absolute inset-0 bg-black/10" />
//             <div className="relative px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-3xl font-bold text-white flex items-center gap-3">
//                     <div className="relative inline-flex items-center justify-center p-1">
//                       <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-75"></div>
//                       <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-2xl shadow-2xl">
//                         <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                             d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                         </svg>
//                       </div>
//                     </div>
//                     ✨ Create Employee Profile ✨
//                   </h2>
//                   <p className="mt-1 text-blue-100 text-sm">Fill in the employee information below</p>
//                 </div>
//               </div>
//             </div>
//             <ProgressBar progress={33} />
//           </div>

//           {/* Content */}
//           <div className="p-8 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
//             <form onSubmit={handleSubmit} noValidate className="space-y-6">

//               {/* Success Message */}
//               {formStatus === 'success' && (
//                 <div className="animate-slideDown bg-green-50 border border-green-200 rounded-2xl p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
//                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-green-700 font-medium">Profile Created Successfully!</p>
//                       <p className="text-green-600 text-sm">Redirecting you to the employee list...</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Error Message */}
//               {formStatus === 'error' && submitError && (
//                 <div className="animate-shake bg-red-50 border border-red-200 rounded-2xl p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
//                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                           d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <p className="text-red-700 text-sm">{submitError}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Personal Information Section */}
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg 
//                                  flex items-center justify-center">
//                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </span>
//                   Personal Information
//                 </h3>

//                 <div className="space-y-4">
//                   {/* Name Fields - 3 columns */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <Input
//                       label="First Name"
//                       placeholder="Enter your first name"
//                       type="text"
//                       id="firstName"
//                       value={userInfo.firstName}
//                       onChange={(e) => handleInputChange('firstName', e.target.value)}
//                       required
//                       error={errors.firstName}
//                       icon={<User />}
//                     />
//                     <Input
//                       label="Last Name"
//                       placeholder="Enter your last name"
//                       type="text"
//                       id="lastName"
//                       value={userInfo.lastName}
//                       onChange={(e) => handleInputChange('lastName', e.target.value)}
//                       error={errors.lastName}
//                       icon={<User />}
//                     />
//                     <Input
//                       label="Date of Birth"
//                       type="date"
//                       id="dateOfBirth"
//                       value={userInfo.dateOfBirth || ''}
//                       onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
//                       error={errors.dateOfBirth}
//                       icon={<Calendar />}
//                     />
//                   </div>

//                   {/* Contact Info - Changed to 2 columns to accommodate 4 items neatly */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Input
//                       label="Email Address"
//                       type="email"
//                       placeholder="example@email.com"
//                       id="email"
//                       value={userInfo.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       error={errors.email}
//                       icon={<Mail />}
//                     />
//                     <Input
//                       label="Phone Number"
//                       type="tel"
//                       placeholder="Enter your number"
//                       id="phoneNumber"
//                       value={userInfo.phoneNumber}
//                       onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
//                       error={errors.phoneNumber}
//                       icon={<Phone />}
//                     />
//                     {/* 5. Added Input UI Component */}
//                     <Input
//                       label="Emergency Phone Number"
//                       type="tel"
//                       placeholder="Emergency Contact"
//                       id="emergency_phone_number"
//                       value={userInfo.emergency_phone_number}
//                       onChange={(e) => handleInputChange('emergency_phone_number', e.target.value)}
//                       error={errors.emergency_phone_number}
//                       icon={<PhoneCall />} // Or <Phone />
//                       // required
//                     />
//                       <Input
//                       label="Aadhaar Number"
//                       type="text"
//                       id="aadharNumber"
//                       placeholder="XXXX XXXX XXXX"
//                       value={userInfo.aadharNumber}
//                       onChange={handleAadhaarChange} // Using specific handler
//                       maxLength={14} // 12 digits + 2 spaces
//                       error={errors.aadharNumber}
//                       icon={<IdCard />}
//                     />
//                   </div>

//                   {/* Gender and Photo - 3 columns */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2 md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Gender <span className="text-red-500">*</span>
//                       </label>
//                       <div className="flex gap-4">
//                         {['M', 'F', 'O'].map((gender) => (
//                           <label key={gender} className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-xl 
//                                                          bg-white/50 border border-blue-200 hover:bg-white 
//                                                          hover:border-blue-400 transition-all duration-200">
//                             <input
//                               type="radio"
//                               name="gender"
//                               value={gender}
//                               checked={userInfo.sex === gender}
//                               onChange={(e) => handleInputChange('sex', e.target.value)}
//                               className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                             />
//                             <span className="text-gray-700 text-sm">
//                               {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                       {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
//                     </div>

//                     <PhotoUpload
//                       photoPreview={photoPreview}
//                       error={errors.photo}
//                       onChange={handlePhotoChange}
//                       currentFileName={userInfo.photo?.name}
//                       onOpenCameraClick={() => setIsCameraModalOpen(true)}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Official Details Section */}
//               <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg 
//                                  flex items-center justify-center">
//                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                   </span>
//                   Official Details
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Employment Type in 3rd column */}
//                   <div className="space-y-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Employment Type
//                     </label>
//                     <div className="flex flex-col gap-2">
//                       {[
//                         { value: 'contractual', label: 'Contractual' },
//                         { value: 'permanent', label: 'Permanent' }
//                       ].map((type) => (
//                         <label key={type.value} className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-xl 
//                                                            bg-white/50 border border-cyan-200 hover:bg-white 
//                                                            hover:border-cyan-400 transition-all duration-200">
//                           <input
//                             type="radio"
//                             name="employmentType"
//                             value={type.value}
//                             checked={userInfo.employmentType === type.value}
//                             onChange={(e) => handleInputChange('employmentType', e.target.value)}
//                             className="form-radio h-4 w-4 text-cyan-600 border-gray-300 focus:ring-cyan-500"
//                           />
//                           <span className="text-gray-700 text-sm">{type.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Employment Information Section */}
//               <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                   <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg 
//                                  flex items-center justify-center">
//                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </span>
//                   Employment Details
//                 </h3>

//                 {/* Experience Checkbox */}
//                 <div className="flex items-center p-4 bg-white/50 rounded-xl border border-purple-200 
//                               hover:bg-white transition-all duration-200 mb-4">
//                   <input
//                     type="checkbox"
//                     name="hasExperience"
//                     id="hasExperience"
//                     checked={userInfo.hasExperience}
//                     onChange={(e) => handleInputChange('hasExperience', e.target.checked)}
//                     className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 
//                              cursor-pointer"
//                   />
//                   <label htmlFor="hasExperience" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
//                     Has Prior Experience?
//                   </label>
//                 </div>

//                 {/* Experience Fields - 3 columns */}
//                 {userInfo.hasExperience && (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideDown">
//                     <Input
//                       label="Years of Experience"
//                       type="number"
//                       id="experienceYears"
//                       min="0"
//                       value={userInfo.experienceYears}
//                       onKeyDown={(e) => {
//                         if (['e', 'E', '+', '-'].includes(e.key)) {
//                           e.preventDefault();
//                         }
//                       }}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (value === '' || parseFloat(value) >= 0) {
//                           handleInputChange('experienceYears', value);
//                         }
//                       }}
//                       required
//                       error={errors.experienceYears}
//                       icon={<Briefcase />}
//                     />
//                     <div className="md:col-span-2">
//                       <Input
//                         label="Company of Experience"
//                         type="text"
//                         id="companyOfExperience"
//                         value={userInfo.companyOfExperience}
//                         onChange={(e) => handleInputChange('companyOfExperience', e.target.value)}
//                         required
//                         error={errors.companyOfExperience}
//                         icon={<Building2 />}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl
//                            hover:bg-gray-200 hover:shadow-md transform hover:-translate-y-0.5
//                            transition-all duration-200"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
//                            text-white font-medium rounded-xl hover:from-indigo-700 
//                            hover:to-purple-700 shadow-lg hover:shadow-xl 
//                            transform hover:-translate-y-0.5 transition-all duration-200
//                            disabled:opacity-50 disabled:cursor-not-allowed 
//                            disabled:transform-none relative overflow-hidden group"
//                 >
//                   <span className={`flex items-center gap-2 ${isSubmitting ? 'opacity-0' : ''}`}>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                         d="M5 13l4 4L19 7" />
//                     </svg>
//                     Create Profile
//                   </span>
//                   {isSubmitting && (
//                     <span className="absolute inset-0 flex items-center justify-center">
//                       <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10"
//                           stroke="currentColor" strokeWidth="4" />
//                         <path className="opacity-75" fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slideUp {
//           from { 
//             opacity: 0;
//             transform: translateY(20px) scale(0.95);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }
        
//         @keyframes slideDown {
//           from { 
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
//           20%, 40%, 60%, 80% { transform: translateX(2px); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
        
//         .animate-slideUp {
//           animation: slideUp 0.4s ease-out;
//         }
        
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
        
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 100px;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #6366f1, #a855f7);
//           border-radius: 100px;
//           border: 2px solid #f1f5f9;
//         }
        
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #4f46e5, #9333ea);
//         }

//         .radio-group label {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .radio-group label:hover {
//           transform: translateX(2px);
//         }
//         .radio-group input[type="radio"] {
//           transition: all 0.2s ease;
//         }
//         .radio-group input[type="radio"]:checked {
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }
//         .form-radio, .form-checkbox {
//           transition: all 0.2s ease;
//         }
//         .form-radio:checked, .form-checkbox:checked {
//           animation: pulse 0.3s ease;
//         }
//         @keyframes pulse {
//           0% { transform: scale(1); }
//           50% { transform: scale(1.1); }
//           100% { transform: scale(1); }
//         }
//       `}</style>
//     </div>
//   );
// };



import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  IdCard,
  Building2,
  Briefcase,
  Calendar,
  PhoneCall, 
} from 'lucide-react';
import { Input } from '../../atoms/Inputs/Inputs';
import { saveUserInfo } from '../../hooks/ServiceApis';
import { PhotoUpload } from '../../molecules/PhotoUpload/PhotoUpload';
import { ProgressBar } from '../../atoms/ProgressBarPercentage/ProgressBarPercentage';
import { useNavigate } from 'react-router-dom';
import { CameraModal } from '../../molecules/PhotoUpload/CameraModal';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergency_phone_number: string; 
  sex: string;
  photo: File | null;
  dateOfBirth: string | null;
  aadharNumber: string;
  employmentType: 'contractual' | 'permanent' | '';
  hasExperience: boolean;
  experienceYears: string;
  companyOfExperience: string;
  dateOfJoining: string;
  employeeId: string;
}

export const UserInfoForm: React.FC = () => {
  const navigate = useNavigate();

  const initialUserInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    emergency_phone_number: '', 
    sex: 'M',
    photo: null,
    dateOfBirth: null,
    aadharNumber: '',
    employmentType: '',
    hasExperience: false,
    experienceYears: '',
    companyOfExperience: '',
    dateOfJoining: '',
    employeeId: '',
  };

  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  // 🔹 Validation Regex
  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+){0,2}$/;
  const repeatingDigitsRegex = /^(\d)\1+$/;
  const companyNameRegex = /^[A-Za-z0-9\s]+$/;
  const validPhoneCharsRegex = /^\+?\d+$/;

  const handleInputChange = (field: keyof UserInfo, value: any) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please select an image file.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be less than 5MB.' }));
      return;
    }

    handleInputChange('photo', file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

 const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    const truncatedValue = cleanValue.slice(0, 12);
    let formattedValue = truncatedValue;
    if (truncatedValue.length > 4) {
      formattedValue = `${truncatedValue.slice(0, 4)} ${truncatedValue.slice(4)}`;
    }
    if (truncatedValue.length > 8) {
      formattedValue = `${formattedValue.slice(0, 9)} ${truncatedValue.slice(8)}`;
    }
    handleInputChange('aadharNumber', formattedValue);
  };

  const handlePhotoCapture = (file: File) => {
    if (!file) return;
    handleInputChange('photo', file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setIsCameraModalOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};

    const trimmedFirstName = userInfo.firstName.trim();
    if (!trimmedFirstName) {
      newErrors.firstName = "First Name is required.";
    } else if (trimmedFirstName.length < 3) {
      newErrors.firstName = "First Name must be at least 3 characters long.";
    } else if (!nameRegex.test(trimmedFirstName)) {
      newErrors.firstName = "Only alphabets and spaces are allowed.";
    }

    if (userInfo.lastName && !nameRegex.test(userInfo.lastName.trim())) {
      newErrors.lastName = "Only alphabets and up to two spaces are allowed.";
    }

    if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phoneInput = userInfo.phoneNumber.trim();
    if (phoneInput) {
      if (!validPhoneCharsRegex.test(phoneInput)) {
        newErrors.phoneNumber = "Phone number can only contain digits and '+' sign.";
      } else {
        const cleanedPhone = phoneInput.replace('+', '');
        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
          newErrors.phoneNumber = "Enter a valid phone number (10-15 digits).";
        } else if (repeatingDigitsRegex.test(cleanedPhone)) {
          newErrors.phoneNumber = "Invalid phone number (all repeating digits).";
        }
      }
    }

     const emergencyPhoneInput = userInfo.emergency_phone_number.trim();
    if (emergencyPhoneInput) {
      if (!validPhoneCharsRegex.test(emergencyPhoneInput)) {
        newErrors.emergency_phone_number = "Digits and '+' sign only.";
      } else {
        const cleanedEmPhone = emergencyPhoneInput.replace('+', '');
        if (cleanedEmPhone.length < 10 || cleanedEmPhone.length > 15) {
          newErrors.emergency_phone_number = "Enter valid number (10-15 digits).";
        } else if (repeatingDigitsRegex.test(cleanedEmPhone)) {
          newErrors.emergency_phone_number = "Invalid phone number.";
        }
      }
    }

   const rawAadhaar = userInfo.aadharNumber.replace(/\s/g, ''); 
    if (rawAadhaar.length > 0) {
        if (rawAadhaar.length < 12) {
            newErrors.aadharNumber = "Aadhaar number is not correct (must be 12 digits).";
        } else if (repeatingDigitsRegex.test(rawAadhaar)) {
            newErrors.aadharNumber = "Invalid Aadhaar number (repeating digits).";
        }
    }

    if (userInfo.hasExperience) {
      if (!userInfo.experienceYears.trim()) {
        newErrors.experienceYears = "Experience years are required.";
      } else if (parseFloat(userInfo.experienceYears) < 0) {
        newErrors.experienceYears = "Experience years cannot be negative.";
      }

      if (!userInfo.companyOfExperience.trim()) {
        newErrors.companyOfExperience = "Company name is required.";
      } else if (!companyNameRegex.test(userInfo.companyOfExperience)) {
        newErrors.companyOfExperience = 'Company name can only contain letters, numbers, and spaces.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setFormStatus('submitting');
    setIsSubmitting(true);
    setSubmitError(null);
    setErrors({});

    const formData = new FormData();
    formData.append('firstName', userInfo.firstName);
    formData.append('lastName', userInfo.lastName);
    formData.append('email', userInfo.email || '');
    formData.append('phoneNumber', userInfo.phoneNumber);
    formData.append('emergency_phone_number', userInfo.emergency_phone_number); 
    formData.append('sex', userInfo.sex);
    formData.append('dateOfBirth', userInfo.dateOfBirth || '');
    formData.append('aadharNumber', userInfo.aadharNumber.replace(/\s/g, ''));
    formData.append('employment_type', userInfo.employmentType || '');
    formData.append('hasExperience', String(userInfo.hasExperience));
    formData.append('experienceYears', userInfo.experienceYears || '');
    formData.append('companyOfExperience', userInfo.companyOfExperience || '');
    if (userInfo.photo instanceof File) formData.append('photo', userInfo.photo);
    formData.append('employeeId', userInfo.employeeId || '');
    formData.append('dateOfJoining', userInfo.dateOfJoining || '');

    try {
      const response = await saveUserInfo(formData);

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && typeof errorData === 'object') {
          const formattedErrors: Partial<Record<keyof UserInfo, string>> = {};
          Object.keys(errorData).forEach((key) => {
            const msgs = errorData[key];
            if (Array.isArray(msgs) && msgs.length > 0) {
              formattedErrors[key as keyof UserInfo] = msgs[0];
            }
          });
          setErrors(formattedErrors);
          setSubmitError('Please correct the highlighted fields.');
        } else {
          setSubmitError('Unexpected error occurred.');
        }
        setFormStatus('error');
        return;
      }

      const newEmployee = await response.json();
      const newEmployeeId = newEmployee.temp_id || newEmployee.tempId || newEmployee.id;

      if (!newEmployeeId) {
        setFormStatus('error');
        setSubmitError(`Profile created, but ID missing.`);
        setIsSubmitting(false);
        return;
      }

      setFormStatus('success');
      setTimeout(() => {
        navigate(`/human-body-checkpoint/${newEmployeeId}`);
      }, 1500);

    } catch (error: unknown) {
      setFormStatus('error');
      setSubmitError('Network or server error.');
    } finally {
      if (formStatus !== 'success') setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserInfo(initialUserInfo);
    setErrors({});
    setPhotoPreview(null);
    setSubmitError(null);
    setFormStatus('idle');
  };

  // Shared classes for input fields to ensure consistency
  // Uses bg-surface (darker than white) instead of default white
  const inputClass = "bg-background border-border text-text placeholder-muted focus:ring-blue-500 focus:border-blue-500 rounded-lg transition-all duration-200";

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-2 lg:px-2">
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handlePhotoCapture}
      />

      <div className="w-full mx-auto animate-slideUp px-8">
        <div className="bg-surface rounded-3xl shadow-xl overflow-hidden ring-1 ring-black/5 border border-border">

          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="relative inline-flex items-center justify-center p-1">
                      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 p-4 rounded-2xl shadow-lg">
                        <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                    </div>
                    Create Employee Profile
                  </h2>
                  <p className="mt-1 text-blue-100 text-sm">Fill in the employee information below</p>
                </div>
              </div>
            </div>
            <ProgressBar progress={33} />
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar bg-surface">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Success Message */}
              {formStatus === 'success' && (
                <div className="animate-slideDown bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">Profile Created Successfully!</p>
                      <p className="text-green-500/80 text-sm">Redirecting you to the employee list...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {formStatus === 'error' && submitError && (
                <div className="animate-shake bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded-lg 
                                 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Personal Information
                </h3>

                <div className="space-y-4">
                  {/* Name Fields - 3 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1">First Name <span className="text-red-500">*</span></label>
                      <Input
                        placeholder="Enter your first name"
                        type="text"
                        id="firstName"
                        value={userInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        error={errors.firstName}
                        icon={<User />}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1">Last Name</label>
                      <Input
                        placeholder="Enter your last name"
                        type="text"
                        id="lastName"
                        value={userInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        error={errors.lastName}
                        icon={<User />}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-text mb-1">Date of Birth</label>
                      <Input
                        type="date"
                        id="dateOfBirth"
                        value={userInfo.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        error={errors.dateOfBirth}
                        icon={<Calendar />}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email Address</label>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        id="email"
                        value={userInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errors.email}
                        icon={<Mail />}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-text mb-1">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="Enter your number"
                        id="phoneNumber"
                        value={userInfo.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        error={errors.phoneNumber}
                        icon={<Phone />}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergency_phone_number" className="block text-sm font-medium text-text mb-1">Emergency Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="Emergency Contact"
                        id="emergency_phone_number"
                        value={userInfo.emergency_phone_number}
                        onChange={(e) => handleInputChange('emergency_phone_number', e.target.value)}
                        error={errors.emergency_phone_number}
                        icon={<PhoneCall />}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="aadharNumber" className="block text-sm font-medium text-text mb-1">Aadhaar Number</label>
                      <Input
                        type="text"
                        id="aadharNumber"
                        placeholder="XXXX XXXX XXXX"
                        value={userInfo.aadharNumber}
                        onChange={handleAadhaarChange}
                        maxLength={14}
                        error={errors.aadharNumber}
                        icon={<IdCard />}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Gender and Photo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        {['M', 'F', 'O'].map((gender) => (
                          <label key={gender} className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-xl 
                                                         bg-surface border border-border hover:bg-background 
                                                         hover:border-blue-500 transition-all duration-200">
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={userInfo.sex === gender}
                              onChange={(e) => handleInputChange('sex', e.target.value)}
                              className="form-radio h-4 w-4 text-blue-500 border-gray-500 focus:ring-blue-500 bg-background"
                            />
                            <span className="text-text text-sm">
                              {gender === 'M' ? 'Male' : gender === 'F' ? 'Female' : 'Other'}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                    </div>

                    <PhotoUpload
                      photoPreview={photoPreview}
                      error={errors.photo}
                      onChange={handlePhotoChange}
                      currentFileName={userInfo.photo?.name}
                      onOpenCameraClick={() => setIsCameraModalOpen(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Official Details Section */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-teal-500/10 text-teal-500 rounded-lg 
                                 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Official Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text mb-2">
                      Employment Type
                    </label>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: 'contractual', label: 'Contractual' },
                        { value: 'permanent', label: 'Permanent' }
                      ].map((type) => (
                        <label key={type.value} className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded-xl 
                                                           bg-surface border border-border hover:bg-background 
                                                           hover:border-teal-500 transition-all duration-200">
                          <input
                            type="radio"
                            name="employmentType"
                            value={type.value}
                            checked={userInfo.employmentType === type.value}
                            onChange={(e) => handleInputChange('employmentType', e.target.value)}
                            className="form-radio h-4 w-4 text-teal-500 border-gray-500 focus:ring-teal-500 bg-background"
                          />
                          <span className="text-text text-sm">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Information Section */}
              <div className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded-lg 
                                 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Employment Details
                </h3>

                {/* Experience Checkbox */}
                <div className="flex items-center p-4 bg-surface rounded-xl border border-border 
                              hover:bg-background transition-all duration-200 mb-4">
                  <input
                    type="checkbox"
                    name="hasExperience"
                    id="hasExperience"
                    checked={userInfo.hasExperience}
                    onChange={(e) => handleInputChange('hasExperience', e.target.checked)}
                    className="h-5 w-5 text-purple-500 border-gray-500 rounded focus:ring-purple-500 bg-background cursor-pointer"
                  />
                  <label htmlFor="hasExperience" className="ml-3 text-sm font-medium text-text cursor-pointer">
                    Has Prior Experience?
                  </label>
                </div>

                {/* Experience Fields */}
                {userInfo.hasExperience && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideDown">
                    <div>
                      <label htmlFor="experienceYears" className="block text-sm font-medium text-text mb-1">Years of Experience <span className="text-red-500">*</span></label>
                      <Input
                        type="number"
                        id="experienceYears"
                        min="0"
                        value={userInfo.experienceYears}
                        onKeyDown={(e) => {
                          if (['e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || parseFloat(value) >= 0) {
                            handleInputChange('experienceYears', value);
                          }
                        }}
                        required
                        error={errors.experienceYears}
                        icon={<Briefcase />}
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="companyOfExperience" className="block text-sm font-medium text-text mb-1">Company of Experience <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        id="companyOfExperience"
                        value={userInfo.companyOfExperience}
                        onChange={(e) => handleInputChange('companyOfExperience', e.target.value)}
                        required
                        error={errors.companyOfExperience}
                        icon={<Building2 />}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-background border border-border text-text font-medium rounded-xl
                           hover:bg-surface hover:shadow-sm transform hover:-translate-y-0.5
                           transition-all duration-200"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700
                           shadow-md hover:shadow-lg 
                           transform hover:-translate-y-0.5 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed 
                           disabled:transform-none relative overflow-hidden group"
                >
                  <span className={`flex items-center gap-2 ${isSubmitting ? 'opacity-0' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5 13l4 4L19 7" />
                    </svg>
                    Create Profile
                  </span>
                  {isSubmitting && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); } 20%, 40%, 60%, 80% { transform: translateX(2px); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 100px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1, #a855f7); border-radius: 100px; border: 2px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #4f46e5, #9333ea); }
        .form-radio { transition: all 0.2s ease; }
        .form-radio:checked { animation: pulse 0.3s ease; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
};

