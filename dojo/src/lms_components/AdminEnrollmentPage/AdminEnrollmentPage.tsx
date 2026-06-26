

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, Search, CheckCircle2, Loader2, X,
  UserPlus, ChevronDown, ChevronLeft, ChevronRight, UserCheck, 
  Building2, RotateCcw, Shield, Eye, Briefcase,
  ChevronsLeft, ChevronsRight, Calendar, CheckSquare,
  Square, MinusSquare, Sparkles, TrendingUp, UserMinus, Filter
} from 'lucide-react';
import { normalizeListResponse } from '../../utils/api';

// --- Types ---
interface Course {
  id: number;
  title: string;
}

interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  designation: string;
  department: string;
  role: string;
  enrolledCourseIds: number[]; 
}

export default function AdminEnrollmentPage() {
  const navigate = useNavigate();

  // --- Data State ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [excludedEmployeeIds, setExcludedEmployeeIds] = useState<Set<number>>(new Set());
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  
  // --- Filter States ---
  const [filterDesignation, setFilterDesignation] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  
  // --- Submission State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const getToken = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (!authData) return null;
      return JSON.parse(authData).accessToken;
    } catch { return null; }
  };

  // --- Helper function to get initials ---
  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) { navigate('/'); return; }

      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/lms/assignments/employees/', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          }),
          fetch('http://127.0.0.1:8000/lms/courses/', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          })
        ]);

        if (usersRes.ok) {
          const rawData = await usersRes.json();
          const cleanData: Employee[] = rawData.map((item: any) => {
            let rawRole = item.userType || 'employee'; 
            let displayRole = 'Employee';
            if (rawRole === 'team-leader') displayRole = 'Team Leader';
            else if (rawRole === 'admin') displayRole = 'Admin';
            
            return {
              id: item.id,
              email: item.email,
              firstName: item.firstName || 'Unknown',
              lastName: item.lastName || 'User',
              avatar: item.avatar,
              designation: (item.designation || 'N/A').toString().trim(),
              department: (item.department || 'General').toString().trim(),
              role: displayRole,
              enrolledCourseIds: item.enrolled_courses || [] 
            };
          });
          setEmployees(cleanData);
        }

        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(normalizeListResponse<Course>(data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // --- 2. Derived Data ---
  const uniqueDesignations = useMemo(() => {
    const list = employees.map(e => e.designation).filter(d => d && d !== 'N/A');
    return Array.from(new Set(list)).sort();
  }, [employees]);

  const uniqueDepartments = useMemo(() => {
    const list = employees.map(e => e.department).filter(d => d && d !== 'General');
    return Array.from(new Set(list)).sort();
  }, [employees]);

  const availableRoles = ['Employee', 'Team Leader'];

  // --- 3. Filtering Logic ---
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => {
        const term = searchQuery.toLowerCase().trim();
        const fullName = (emp.firstName + ' ' + emp.lastName).toLowerCase();
        const matchesSearch = !term || fullName.includes(term) || emp.email.toLowerCase().includes(term);
        
        const matchesDesignation = filterDesignation === 'all' || 
          (emp.designation || 'N/A').toLowerCase() === filterDesignation.toLowerCase();
        
        const matchesDepartment = filterDepartment === 'all' || 
          (emp.department || 'General').toLowerCase() === filterDepartment.toLowerCase();
        
        const matchesRole = filterRole === 'all' || emp.role === filterRole;

        return matchesSearch && matchesDesignation && matchesDepartment && matchesRole;
      })
      .sort((a, b) => (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName));
  }, [employees, searchQuery, filterDesignation, filterDepartment, filterRole]);

  // --- Selected employees (all filtered minus excluded) ---
  const selectedEmployeeIds = useMemo(() => {
    return filteredEmployees
      .map(e => e.id)
      .filter(id => !excludedEmployeeIds.has(id));
  }, [filteredEmployees, excludedEmployeeIds]);

  // Reset excluded when filters change
  useEffect(() => {
    setExcludedEmployeeIds(new Set());
  }, [searchQuery, filterDesignation, filterDepartment, filterRole]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDesignation, filterDepartment, filterRole, itemsPerPage]);

  // --- 4. Course Filtering ---
  const assignableCourses = useMemo(() => {
    if (selectedEmployeeIds.length === 0) return courses;
    return courses.filter(course => {
      const allSelectedHaveIt = selectedEmployeeIds.every(empId => {
        const emp = employees.find(e => e.id === empId);
        return emp?.enrolledCourseIds.includes(course.id);
      });
      return !allSelectedHaveIt;
    });
  }, [courses, selectedEmployeeIds, employees]);

  // --- Handlers ---
  const toggleExclusion = (id: number) => {
    setExcludedEmployeeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const excludeAll = () => {
    setExcludedEmployeeIds(new Set(filteredEmployees.map(e => e.id)));
  };

  const includeAll = () => {
    setExcludedEmployeeIds(new Set());
  };

  const togglePageSelection = () => {
    const pageIds = paginatedEmployees.map(e => e.id);
    const allPageExcluded = pageIds.every(id => excludedEmployeeIds.has(id));
    
    setExcludedEmployeeIds(prev => {
      const newSet = new Set(prev);
      if (allPageExcluded) {
        pageIds.forEach(id => newSet.delete(id));
      } else {
        pageIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setFilterDesignation('all');
    setFilterDepartment('all');
    setFilterRole('all');
    setSearchQuery('');
    setExcludedEmployeeIds(new Set());
  };

  const handleEnroll = async () => {
    if (!selectedCourseId || selectedEmployeeIds.length === 0) {
      setNotification({ type: 'error', message: 'Please select a course and ensure at least one employee is included.' });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);
    const token = getToken();

    try {
      const response = await fetch('http://127.0.0.1:8000/lms/assignments/bulk-assign/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: Number(selectedCourseId),
          employee_ids: selectedEmployeeIds,
          due_date: dueDate || null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Assignment failed');

      setNotification({ 
        type: 'success', 
        message: 'Successfully enrolled ' + data.created + ' employees in the course.'
      });

      setEmployees(prev => prev.map(emp => {
        if (selectedEmployeeIds.includes(emp.id)) {
          return {
            ...emp,
            enrolledCourseIds: [...emp.enrolledCourseIds, Number(selectedCourseId)]
          };
        }
        return emp;
      }));

      setDueDate("");
      setSelectedCourseId("");
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Failed to enroll employees.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnrolledCourseDetails = (emp: Employee) => {
    return courses.filter(c => emp.enrolledCourseIds.includes(c.id));
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const isFilterActive = filterDesignation !== 'all' || filterDepartment !== 'all' || filterRole !== 'all' || searchQuery !== '';
  
  // Page selection state
  const pageIds = paginatedEmployees.map(e => e.id);
  const allPageExcluded = pageIds.length > 0 && pageIds.every(id => excludedEmployeeIds.has(id));
  const somePageExcluded = pageIds.some(id => excludedEmployeeIds.has(id));
  const nonePageExcluded = !somePageExcluded;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse mx-auto mb-6 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-30 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Enrollment Manager</h2>
          <p className="text-purple-300">Preparing employee directory...</p>
        </div>
      </div>
    );
  }

  return (
    // Main Container: dark:bg-slate-950 dark:via-slate-900 dark:to-indigo-950
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 transition-colors duration-300">
      
      {/* --- Enrolled Courses Modal --- */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200 dark:border-slate-700">
            <div className="p-6 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
              <div className="relative flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl ring-4 ring-white/30">
                    {viewingEmployee.avatar ? (
                      <img src={viewingEmployee.avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
                    ) : (
                      getInitials(viewingEmployee.firstName, viewingEmployee.lastName)
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {viewingEmployee.firstName} {viewingEmployee.lastName}
                    </h3>
                    <p className="text-purple-200 text-sm">{viewingEmployee.email}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                      <Briefcase className="w-3 h-3" />
                      {viewingEmployee.designation}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingEmployee(null)} 
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" /> Enrolled Courses 
                <span className="ml-auto bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full text-xs font-bold">
                  {viewingEmployee.enrolledCourseIds.length}
                </span>
              </h4>
              
              {viewingEmployee.enrolledCourseIds.length > 0 ? (
                <div className="space-y-3">
                  {getEnrolledCourseDetails(viewingEmployee).map((course, index) => (
                    <div 
                      key={course.id} 
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{course.title}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Course #{index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border-2 border-dashed border-purple-200 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">No active enrollments</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">This employee has not been enrolled in any courses yet</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setViewingEmployee(null)} 
                className="px-6 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white rounded-xl text-sm font-semibold hover:from-slate-700 hover:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50">
          <div className={
            'px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 backdrop-blur-sm ' +
            (notification.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30' 
              : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30')
          }>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </div>
            <p className="text-sm font-medium pr-2">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)} 
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors ml-auto"
            >
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-8 py-6 transition-colors">
            {/* Title Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                      Enrollment Manager
                    </h1>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Manage course enrollments for your team
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* Total Employees */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</span>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-400/30">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">{employees.length.toLocaleString()}</div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All employees</p>
              </div>

              {/* Filtered */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Filtered</span>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-300">{filteredEmployees.length.toLocaleString()}</div>
                <p className="text-xs text-cyan-500 dark:text-cyan-400/70 mt-1">Match current filters</p>
              </div>

              {/* Excluded */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-rose-200 dark:border-rose-800 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Excluded</span>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-400/30">
                    <UserMinus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-rose-600 dark:text-rose-300">{excludedEmployeeIds.size.toLocaleString()}</div>
                <p className="text-xs text-rose-400 dark:text-rose-400/70 mt-1">Manually removed</p>
              </div>

              {/* To Enroll */}
              <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-2xl p-4 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 ring-2 ring-purple-300/50 dark:ring-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-wider">To Enroll</span>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-400/30">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-200">{selectedEmployeeIds.length.toLocaleString()}</div>
                <p className="text-xs text-purple-500 dark:text-purple-400/70 mt-1">Ready for enrollment</p>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px] max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-10 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 text-slate-800 dark:text-white transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                )}
              </div>

              <div className="h-10 w-px bg-gradient-to-b from-transparent via-purple-200 dark:via-slate-700 to-transparent" />

              {/* Department Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:border-purple-300 dark:hover:border-purple-500 transition-colors">
                <Building2 className="w-4 h-4 text-purple-500" />
                <select 
                  value={filterDepartment} 
                  onChange={(e) => setFilterDepartment(e.target.value)} 
                  className="bg-transparent text-sm focus:outline-none min-w-[130px] text-slate-700 dark:text-slate-300 cursor-pointer dark:bg-slate-800"
                >
                  <option value="all" className="dark:bg-slate-800">All Departments</option>
                  {uniqueDepartments.map(d => (
                    <option key={d} value={d} className="dark:bg-slate-800">{d}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:border-purple-300 dark:hover:border-purple-500 transition-colors">
                <Briefcase className="w-4 h-4 text-fuchsia-500" />
                <select 
                  value={filterDesignation} 
                  onChange={(e) => setFilterDesignation(e.target.value)} 
                  className="bg-transparent text-sm focus:outline-none min-w-[130px] text-slate-700 dark:text-slate-300 cursor-pointer dark:bg-slate-800"
                >
                  <option value="all" className="dark:bg-slate-800">All Designations</option>
                  {uniqueDesignations.map(d => (
                    <option key={d} value={d} className="dark:bg-slate-800">{d}</option>
                  ))}
                </select>
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:border-purple-300 dark:hover:border-purple-500 transition-colors">
                <Shield className="w-4 h-4 text-amber-500" />
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)} 
                  className="bg-transparent text-sm focus:outline-none min-w-[110px] text-slate-700 dark:text-slate-300 cursor-pointer dark:bg-slate-800"
                >
                  <option value="all" className="dark:bg-slate-800">All Roles</option>
                  {availableRoles.map(r => (
                    <option key={r} value={r} className="dark:bg-slate-800">{r}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              {isFilterActive && (
                <button 
                  onClick={resetFilters} 
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All
                </button>
              )}

              <div className="flex-1" />

              {/* Items per page */}
              <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
                <span className="font-medium">Show:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                  className="bg-transparent focus:outline-none text-slate-700 dark:text-slate-300 font-semibold cursor-pointer dark:bg-slate-800"
                >
                  <option value={25} className="dark:bg-slate-800">25</option>
                  <option value={50} className="dark:bg-slate-800">50</option>
                  <option value={100} className="dark:bg-slate-800">100</option>
                  <option value={200} className="dark:bg-slate-800">200</option>
                </select>
              </div>
            </div>
          </div>

          {/* Selection Info Bar */}
          <div className="mx-5  rounded-2xl py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-xs uppercase tracking-wider font-medium">Selected Employees</div>
                  <div className="text-white font-bold text-2xl">
                    {selectedEmployeeIds.length.toLocaleString()}
                    <span className="text-white/60 text-sm font-normal ml-2">
                      of {filteredEmployees.length.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {excludedEmployeeIds.size > 0 && (
                <div className="pl-6 border-l border-white/20">
                  <span className="text-white/90 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full">
                    {excludedEmployeeIds.size.toLocaleString()} excluded
                  </span>
                </div>
              )}

              <span className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm hidden lg:inline-block">
                Click any row to toggle
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={includeAll}
                disabled={excludedEmployeeIds.size === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-700 dark:text-purple-900 bg-white rounded-xl hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <CheckSquare className="w-4 h-4" />
                Include All
              </button>
              <button 
                onClick={excludeAll}
                disabled={selectedEmployeeIds.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="w-4 h-4" />
                Exclude All
              </button>
            </div>
          </div>

          {/* Employee Table */}
          <div className="px-8 flex-1 overflow-auto bg-white/50 dark:bg-slate-900/50">
            <table className="w-full">
              <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-800 shadow-sm bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700  top-0 z-10">
                <tr>
                  <th className="w-16 px-6 py-4 text-left">
                    <button 
                      onClick={togglePageSelection}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-all duration-200"
                      title={nonePageExcluded ? "Exclude all on this page" : "Include all on this page"}
                    >
                      {nonePageExcluded ? (
                        <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : allPageExcluded ? (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      ) : (
                        <MinusSquare className="w-5 h-5 text-purple-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Courses</th>
                  <th className="w-20 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedEmployees.map((emp) => {
                  const isExcluded = excludedEmployeeIds.has(emp.id);
                  const initials = getInitials(emp.firstName, emp.lastName);

                  return (
                    <tr 
                      key={emp.id}
                      onClick={() => toggleExclusion(emp.id)}
                      className={
                        'cursor-pointer transition-all duration-200 select-none group ' +
                        (isExcluded 
                          ? 'bg-slate-50/50 dark:bg-slate-800/30 opacity-50 hover:opacity-70 hover:bg-slate-100/50 dark:hover:bg-slate-800/50' 
                          : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50 dark:hover:from-purple-900/10 dark:hover:to-fuchsia-900/10 active:from-purple-100 active:to-fuchsia-100 dark:active:from-purple-900/20')
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="p-1">
                          {isExcluded ? (
                            <Square className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                          ) : (
                            <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 transition-all duration-200 shadow-md ' +
                            (isExcluded 
                              ? 'bg-slate-400 dark:bg-slate-600' 
                              : 'bg-gradient-to-br from-violet-500 to-fuchsia-500 group-hover:shadow-lg group-hover:shadow-purple-500/30')
                          }>
                            {emp.avatar ? (
                              <img src={emp.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              initials
                            )}
                          </div>
                          <span className={'font-semibold whitespace-nowrap transition-colors ' + (isExcluded ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200')}>
                            {emp.firstName} {emp.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'text-sm transition-colors ' + (isExcluded ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400')}>
                          {emp.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ' +
                          (isExcluded 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' 
                            : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30')
                        }>
                          <Building2 className="w-3 h-3" />
                          {emp.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'text-sm font-medium transition-colors ' + (isExcluded ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400')}>
                          {emp.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ' +
                          (isExcluded 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            : emp.role === 'Team Leader' 
                              ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30' 
                              : 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700')
                        }>
                          <Shield className="w-3 h-3" />
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={
                          'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ' +
                          (isExcluded
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                            : emp.enrolledCourseIds.length > 0 
                              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')
                        }>
                          <BookOpen className="w-3 h-3" />
                          {emp.enrolledCourseIds.length}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingEmployee(emp);
                          }}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-all duration-200 hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paginatedEmployees.length === 0 && (
              <div className="py-20 text-center bg-white dark:bg-slate-900">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/20 dark:to-fuchsia-900/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No employees found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search query</p>
                {isFilterActive && (
                  <button 
                    onClick={resetFilters}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-purple-100 dark:border-slate-700 px-8 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Showing <span className="text-purple-600 dark:text-purple-400 font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="text-purple-600 dark:text-purple-400 font-bold">{Math.min(currentPage * itemsPerPage, filteredEmployees.length)}</span> of <span className="font-bold">{filteredEmployees.length.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-slate-600 dark:text-slate-400"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-slate-600 dark:text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-3">
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
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          'w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ' +
                          (currentPage === pageNum 
                            ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300')
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-slate-600 dark:text-slate-400"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Course Assignment */}
        <div className="w-96 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex flex-col relative overflow-hidden border-l border-white/10">
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Assign Course</h2>
                <p className="text-purple-300 text-sm">Bulk enrollment wizard</p>
              </div>
            </div>
          </div>

          <div className="relative flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Selection Summary */}
            <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-purple-200">Employees to Enroll</span>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-fuchsia-400" />
                </div>
              </div>
              <div className="text-5xl font-bold text-white mb-1">
                {selectedEmployeeIds.length.toLocaleString()}
              </div>
              <p className="text-sm text-purple-300">
                from {filteredEmployees.length.toLocaleString()} filtered employees
              </p>
              
              {excludedEmployeeIds.size > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <p className="text-sm text-rose-300">
                    <span className="font-bold">{excludedEmployeeIds.size}</span> manually excluded
                  </p>
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Select Course
              </label>
              <div className="relative">
                <select 
                  value={selectedCourseId} 
                  onChange={(e) => setSelectedCourseId(e.target.value)} 
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-4 pr-12 text-sm font-medium appearance-none focus:outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20 transition-all duration-200 text-white"
                >
                  <option value="" className="bg-slate-900">Choose a course...</option>
                  {assignableCourses.map(c => (
                    <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
              </div>
              {selectedEmployeeIds.length > 0 && assignableCourses.length === 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <p className="text-xs text-amber-300 flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    All selected employees are already enrolled in available courses.
                  </p>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Due Date <span className="font-normal text-purple-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]} 
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all duration-200 text-white dark:[color-scheme:dark]" 
                />
              </div>
            </div>

            {/* Enroll Button */}
            <button 
              onClick={handleEnroll} 
              disabled={isSubmitting || selectedEmployeeIds.length === 0 || !selectedCourseId}
              className={
                'w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ' +
                (selectedEmployeeIds.length > 0 && selectedCourseId 
                  ? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500 hover:from-fuchsia-400 hover:via-purple-400 hover:to-violet-400 text-white shadow-2xl shadow-purple-500/40 active:scale-[0.98] hover:-translate-y-0.5' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed')
              }
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <UserPlus className="w-6 h-6" />
              )}
              {isSubmitting ? 'Enrolling...' : 'Save and Enroll ' + selectedEmployeeIds.length.toLocaleString() + ' Employees'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

