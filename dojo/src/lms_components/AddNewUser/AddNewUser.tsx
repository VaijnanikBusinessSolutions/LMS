

import React, { useState, type ChangeEvent } from 'react';
import { ChevronDown, User, Upload, Trash2, Mail, Phone, Briefcase, Lock, UserPlus, Camera } from 'lucide-react';
import { API_ENDPOINTS } from '../../components/constants/api';
import { normalizeListResponse } from '../../utils/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  username: string;
  password: string;
  userType: string;
  companyName: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
}

interface RoleOption {
  id: number;
  name: string;
}

const AddUserForm = () => {
  const auth = (() => {
    try {
      return JSON.parse(localStorage.getItem('auth') || '{}');
    } catch {
      return {};
    }
  })();
  const accessToken = auth?.accessToken || localStorage.getItem('access_token') || '';

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    username: '',
    password: '',
    userType: '',
    companyName: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = React.useState<RoleOption[]>([]);

  React.useEffect(() => {
    fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ROLES}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const roles = normalizeListResponse<RoleOption>(data).filter((role) => Boolean(role?.name));
        setRoleOptions(roles);
        if (roles[0]?.name) {
          setFormData((prev) => ({
            ...prev,
            userType: prev.userType || roles[0].name,
          }));
        }
      })
      .catch((error) => {
        console.error('Failed to load roles:', error);
        setRoleOptions([]);
      });
  }, [accessToken]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.firstName.trim());
    formDataToSend.append('last_name', formData.lastName.trim());
    formDataToSend.append('email', formData.email.trim().toLowerCase());
    formDataToSend.append('phone_number', formData.phoneNumber.trim());
    formDataToSend.append('bio', formData.bio.trim());
    formDataToSend.append('password', formData.password);
    formDataToSend.append('role', formData.userType);
    formDataToSend.append('business_unit', formData.companyName.trim());
    if (profileImage) {
      formDataToSend.append('profile_image', profileImage);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.message ||
          errorData?.detail ||
          JSON.stringify(errorData?.errors || errorData) ||
          'Registration failed. Check your inputs.';
        console.error('Registration Error:', errorData);
        alert(errorMessage);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Registration Error:', errorData);
        alert('❌ Registration failed. Check your inputs.');
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('✅ User created successfully:', result);
      alert('✅ User created successfully!');

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        bio: '',
        password: '',
        username: '',
        userType: roleOptions[0]?.name || '',
        companyName: '',
      });
      setProfileImage(null);
      setImagePreview(null);
      const fileInput = document.getElementById('profileImage') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('⚠️ Network Error:', error);
      alert('⚠️ Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <UserPlus className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text">Add New User</h2>
              <p className="text-muted mt-1">Create a new user account with role assignment</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Personal Info */}
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              <h3 className="text-xl font-bold text-text">Personal Info</h3>
            </div>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text mb-3">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-border">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <User className="text-gray-300" size={32} />
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <label
                    htmlFor="profileImage"
                    className="px-4 py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Upload
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text mb-2">Name</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="Last Name"
                />
              </div>
              {(errors.firstName || errors.lastName) && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  {errors.firstName || errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
                <Mail size={16} className="text-blue-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
                placeholder="you@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              <p className="text-xs text-muted mt-2">We'll never share your details.</p>
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
                <Phone size={16} className="text-green-500" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.phoneNumber ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Phone Number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-2">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-text mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="A bit about yourself and your role"
              />
            </div>

            {/* Company Info Section */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <Briefcase size={18} />
                </div>
                <h3 className="text-lg font-bold text-text">Company Info</h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-text mb-2">
                  Company name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="UserActive"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-text mb-2">Role</label>
                <div className="relative">
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none pr-10 cursor-pointer"
                  >
                    {roleOptions.map((type) => (
                      <option key={type.id} value={type.name} className="bg-white">
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Account Settings */}
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="bg-green-100 p-2.5 rounded-lg text-green-600">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-bold text-text">Account Settings</h3>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
                <User size={16} className="text-purple-500" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.username ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-2">{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text mb-2 flex items-center gap-2">
                <Lock size={16} className="text-orange-500" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password}</p>}
              <p className="text-xs text-muted mt-2">Minimum 6 characters</p>
            </div>

            <div className="space-y-3 mt-8">
              <button
                type="button"
                onClick={handleCreateUser}
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
