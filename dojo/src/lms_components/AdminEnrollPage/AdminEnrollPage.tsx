import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  X,
  Mail,
  User,
  Calendar,
  Filter
} from 'lucide-react';

// --- Types ---
interface Course {
  id: number;
  title: string;
}

// Normalized Employee Type for Frontend
interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export default function AdminEnrollmentPage() {
  const navigate = useNavigate();

  // --- Data State ---
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  
  // --- Submission State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // --- Helper: Get Token ---
  const getToken = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (!authData) return null;
      return JSON.parse(authData).accessToken;
    } catch { return null; }
  };

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) { navigate('/'); return; }

      try {
        const [usersRes, coursesRes] = await Promise.all([
          // NEW ENDPOINT: Get specifically assignable employees
          fetch('http://127.0.0.1:8000/lms/assignments/employees/', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          }),
          fetch('http://127.0.0.1:8000/lms/courses/', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          })
        ]);

        if (usersRes.ok) {
          const rawData = await usersRes.json();
          // Transform backend flat values() format to clean frontend objects
          const cleanData: Employee[] = rawData.map((item: any) => ({
            id: item.id,
            email: item.email,
            // Handle the double underscore syntax from Django .values()
            firstName: item.lms_profile__firstName || 'Unknown',
            lastName: item.lms_profile__lastName || 'User',
            avatar: item.lms_profile__profileImage
          }));
          setEmployees(cleanData);
        }

        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // --- 2. Selection Logic ---
  const filteredEmployees = employees.filter(emp => {
    const term = searchQuery.toLowerCase();
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return fullName.includes(term) || emp.email.toLowerCase().includes(term);
  });

  const toggleSelection = (id: number) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedEmployeeIds.length === filteredEmployees.length) {
      setSelectedEmployeeIds([]); // Deselect all
    } else {
      setSelectedEmployeeIds(filteredEmployees.map(e => e.id)); // Select all visible
    }
  };

  // --- 3. Submit Enrollment ---
  const handleEnroll = async () => {
    if (!selectedCourseId || selectedEmployeeIds.length === 0) {
      setNotification({ type: 'error', message: 'Select a course and at least one user.' });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);
    const token = getToken();

    try {
      const response = await fetch('http://127.0.0.1:8000/lms/assignments/bulk-assign/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
        message: `Success: ${data.created} enrolled, ${data.skipped_already_enrolled} already in course.` 
      });
      
      // Optional: Clear selection after success
      setSelectedEmployeeIds([]);
      setDueDate("");
      
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Failed to enroll.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Enrollment Manager</h1>
          <p className="text-gray-400">View employees and assign courses in bulk.</p>
        </div>

        {/* --- Notification Toast --- */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="hover:text-white"><X className="w-4 h-4"/></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          
          {/* --- LEFT COLUMN: Employee List (Tables) --- */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search & Toolbar */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search employees..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {selectedEmployeeIds.length} selected
                </span>
                <button 
                  onClick={toggleSelectAll}
                  className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  {selectedEmployeeIds.length === filteredEmployees.length && filteredEmployees.length > 0 ? "Deselect All" : "Select All"}
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg min-h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 w-12 text-center">
                        <div className="w-4 h-4 border border-gray-500 rounded inline-block"></div>
                      </th>
                      <th className="px-6 py-4 font-medium">Employee</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => {
                        const isSelected = selectedEmployeeIds.includes(emp.id);
                        return (
                          <tr 
                            key={emp.id} 
                            onClick={() => toggleSelection(emp.id)}
                            className={`cursor-pointer transition hover:bg-gray-700/40 ${isSelected ? 'bg-indigo-900/20' : ''}`}
                          >
                            <td className="px-6 py-4 text-center">
                              <div className={`w-5 h-5 rounded border inline-flex items-center justify-center transition ${
                                isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500 bg-gray-800'
                              }`}>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold text-xs shrink-0">
                                  {emp.firstName?.[0] || <User className="w-4 h-4"/>}
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-indigo-200' : 'text-white'}`}>
                                  {emp.firstName} {emp.lastName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gray-500" />
                                {emp.email}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                Employee
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          <p>No employees found matching "{searchQuery}"</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="text-right text-xs text-gray-500 px-2">
              Showing {filteredEmployees.length} employees
            </div>
          </div>

          {/* --- RIGHT COLUMN: Actions Sidebar (Sticky) --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              
              {/* Assignment Card */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Assign Course
                </h2>

                <div className="space-y-4">
                  {/* Stats */}
                  <div className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center text-sm border border-gray-700">
                    <span className="text-gray-400">Selected Users</span>
                    <span className="font-bold text-white text-lg">{selectedEmployeeIds.length}</span>
                  </div>

                  {/* 1. Select Course */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Course</label>
                    <select 
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                    >
                      <option value="">Select a Course...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Due Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Due Date (Optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input 
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleEnroll}
                    disabled={isSubmitting || selectedEmployeeIds.length === 0 || !selectedCourseId}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Enroll Users
                      </>
                    )}
                  </button>
                  
                  {selectedEmployeeIds.length === 0 && (
                     <p className="text-xs text-center text-gray-500 italic mt-2">
                       Select users from the list to enable.
                     </p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}