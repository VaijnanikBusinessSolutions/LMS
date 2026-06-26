import React, { useState, useEffect, type ChangeEvent } from "react";
import { 
  ChevronDown, User, Upload, Trash2, Mail, Phone, Briefcase, Lock, 
  UserPlus, Camera, X, ShieldCheck, BadgeCheck, Building2, FileText,
  Sparkles, Users, Search, Filter, MoreHorizontal, Eye, Edit2, AlertCircle,
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, LayoutGrid, List,
  SlidersHorizontal, RefreshCw, Download, ArrowUpDown, TrendingUp, Clock, Zap
} from 'lucide-react';
import { normalizeListResponse } from "../utils/api";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  phoneNumber: string | null;
  bio: string | null;
  companyName: string | null;
  profileImage: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  designation: string;
  department: string;
}

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

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<string>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    username: '',
    password: '',
    userType: 'employee',
    companyName: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const userTypes = [
    { value: 'admin', label: 'Admin', color: 'from-purple-500 to-pink-500', icon: ShieldCheck },
    { value: 'team-leader', label: 'Team Leader', color: 'from-blue-500 to-cyan-500', icon: Users },
    { value: 'employee', label: 'Employee', color: 'from-emerald-500 to-teal-500', icon: Briefcase },
    { value: 'user', label: 'User', color: 'from-gray-500 to-slate-500', icon: User },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/lms/users/")
      .then((response) => response.json())
      .then((data) => {
        setUsers(normalizeListResponse<User>(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstName: '', lastName: '', email: '', phoneNumber: '',
      bio: '', username: '', password: '', userType: 'employee', companyName: '',
    });
    setProfileImage(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImagePreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password.trim() || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    if (profileImage) formDataToSend.append('profileImage', profileImage);

    try {
      const response = await fetch('http://127.0.0.1:8000/lms/users/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('✅ User created successfully!');
        fetchUsers();
        closeModal();
      } else {
        alert('❌ Registration failed.');
      }
    } catch (error) {
      alert('⚠️ Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  const filteredUsers = users
    .filter(user => 
      `${user.firstName} ${user.lastName} ${user.email} ${user.department}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => filterRole === 'all' || user.userType === filterRole)
    .filter(user => filterStatus === 'all' || (filterStatus === 'active' ? user.is_active : !user.is_active))
    .filter(user => filterDepartment === 'all' || user.department === filterDepartment)
    .sort((a, b) => {
      const aVal = a[sortField as keyof User] || '';
      const bVal = b[sortField as keyof User] || '';
      if (sortDirection === 'asc') {
        return String(aVal).localeCompare(String(bVal));
      }
      return String(bVal).localeCompare(String(aVal));
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectUser = (id: number) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const clearFilters = () => {
    setFilterRole('all');
    setFilterStatus('all');
    setFilterDepartment('all');
    setSearchTerm('');
  };

  const activeFiltersCount = [filterRole !== 'all', filterStatus !== 'all', filterDepartment !== 'all'].filter(Boolean).length;

  const getRoleStyles = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/30';
      case 'team-leader': return 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/30';
      case 'employee': return 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/30';
      default: return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-gray-600 dark:text-gray-400 border-gray-200/50 dark:border-gray-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <ShieldCheck className="w-3 h-3" />;
      case 'team-leader': return <Users className="w-3 h-3" />;
      case 'employee': return <Briefcase className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-800 dark:text-slate-100 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-purple-400/10 dark:from-cyan-600/5 dark:to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 lg:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                User Directory
              </h1>
              <p className="text-gray-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Manage your team effortlessly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchUsers}
              className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none hover:scale-105">
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={openModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-300/50 dark:shadow-indigo-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">Add User</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50', trend: '+12%', trendUp: true },
            { label: 'Active Now', value: users.filter(u => u.is_active).length, icon: Zap, gradient: 'from-emerald-500 to-green-500', bg: 'from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50', trend: '+8%', trendUp: true },
            { label: 'Administrators', value: users.filter(u => u.userType === 'admin').length, icon: ShieldCheck, gradient: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50', trend: '0%', trendUp: null },
            { label: 'Team Leaders', value: users.filter(u => u.userType === 'team-leader').length, icon: TrendingUp, gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50', trend: '+3%', trendUp: true },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`relative group p-5 bg-gradient-to-br ${stat.bg} backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 dark:opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${stat.trendUp === true ? 'text-emerald-600 dark:text-emerald-400' : stat.trendUp === false ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-slate-400'}`}>
                      {stat.trendUp !== null && <TrendingUp className={`w-3 h-3 ${stat.trendUp ? '' : 'rotate-180'}`} />}
                      {stat.trend} this month
                    </div>
                  )}
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl shadow-gray-200/30 dark:shadow-none">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${showFilters ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-transparent hover:border-gray-200 dark:hover:border-slate-700'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
              {/* Role Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Role</label>
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  >
                    <option value="all">All Roles</option>
                    {userTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Status</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Department Filter */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Department</label>
                <div className="relative">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="sm:col-span-3 flex justify-end">
                  <button 
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Users className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700 dark:text-slate-200">Loading users...</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Please wait a moment</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/30 dark:shadow-none">
            {/* Table Header Info */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80">
              <div className="flex items-center gap-4">
                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{selectedUsers.length} selected</span>
                    <button className="p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Showing <span className="font-bold text-gray-800 dark:text-white">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}</span> - <span className="font-bold text-gray-800 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-gray-800 dark:text-white">{filteredUsers.length}</span> users
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 transition-all"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Sort {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox"
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 rounded-md border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Designation</th>
                    {/* <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {paginatedUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/20 transition-all duration-300 ${selectedUsers.includes(user.id) ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-5 h-5 rounded-md border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {user.profileImage ? (
                              <img 
                                src={user.profileImage} 
                                className="h-12 w-12 rounded-xl object-cover border-2 border-gray-100 dark:border-slate-700 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors shadow-md" 
                                alt="" 
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200/50 dark:shadow-none">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                            )}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${user.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                              <Mail className="w-3.5 h-3.5" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase rounded-lg border ${getRoleStyles(user.userType)}`}>
                          {getRoleIcon(user.userType)}
                          {user.userType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${user.is_active ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                          <span className="text-xs font-semibold">{user.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
                            <Building2 className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                          </div>
                          <span className="text-gray-700 dark:text-slate-300 font-medium">{user.department || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 dark:text-slate-300 font-medium">{user.designation || '—'}</span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                  <div className="relative p-6 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl shadow-inner">
                    <Users className="w-16 h-16 text-gray-400 dark:text-slate-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-6">No users found</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2 text-center max-w-md">
                  We couldn't find any users matching your criteria. Try adjusting your filters or search term.
                </p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedUsers.map((user, index) => (
              <div 
                key={user.id} 
                className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        className="h-16 w-16 rounded-xl object-cover border-2 border-gray-100 dark:border-slate-700 shadow-md" 
                        alt="" 
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200/50 dark:shadow-none">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center ${user.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                      {user.is_active && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase rounded-lg border ${getRoleStyles(user.userType)}`}>
                    {getRoleIcon(user.userType)}
                    {user.userType}
                  </span>
                  {user.is_staff && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-lg">
                      <BadgeCheck className="w-3 h-3" />
                      Staff
                    </span>
                  )}
                </div>

                {(user.department || user.designation) && (
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                    {user.department && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-slate-300">{user.department}</span>
                      </div>
                    )}
                    {user.designation && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-slate-300">{user.designation}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <button className="flex-1 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors">
                    View Profile
                  </button>
                  <button className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 px-6 py-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-200/50 dark:shadow-none">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Add a new team member</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6 space-y-6">
              {/* Profile Image Upload */}
              <div className="flex justify-center">
                <div className="relative group">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} className="w-28 h-28 rounded-2xl object-cover border-4 border-gray-100 dark:border-slate-700 shadow-xl" alt="Preview" />
                      <button
                        onClick={handleDeleteImage}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 hover:bg-red-600 rounded-xl text-white shadow-lg transition-all hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-28 h-28 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl cursor-pointer transition-all group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 shadow-inner">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                        <Camera className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium">Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* User Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Select Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {userTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.userType === type.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                    >
                      {formData.userType === type.value && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      <div className={`p-2.5 bg-gradient-to-br ${type.color} rounded-xl`}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-xs font-semibold ${formData.userType === type.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-slate-300'}`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <User className="w-4 h-4 text-gray-400" />
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 ${errors.firstName ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500'} rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.firstName && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <User className="w-4 h-4 text-gray-400" />
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 ${errors.lastName ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500'} rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.lastName && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@company.com"
                    className={`w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 ${errors.email ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500'} rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                  </label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    className="w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <Lock className="w-4 h-4 text-gray-400" />
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    className={`w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 ${errors.password ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500'} rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all`}
                  />
                  {errors.password && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`flex-1 h-1.5 rounded-full ${formData.password.length >= 2 ? 'bg-red-400' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
                    <div className={`flex-1 h-1.5 rounded-full ${formData.password.length >= 4 ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
                    <div className={`flex-1 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
                    <div className={`flex-1 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Bio <span className="text-gray-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us a bit about this user..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200/50 dark:shadow-none transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
