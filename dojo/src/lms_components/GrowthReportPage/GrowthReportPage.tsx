import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  BookOpen, 
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// --- AUTH HELPERS (Self-contained for this component) ---
interface AuthData {
  accessToken: string;
  user: {
    id: number;
    name?: string;
    email: string;
    role?: string;
  };
}

const getToken = (): string | null => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;
    const authData: AuthData = JSON.parse(authDataString);
    return authData.accessToken;
  } catch (error) {
    console.error("Error parsing auth data for token (AdminGrowthReportsPage):", error);
    return null;
  }
};

const getUserRole = (): string | null => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;
    const authData: AuthData = JSON.parse(authDataString);
    return authData.user?.role || null;
  } catch (error) {
    console.error("Error parsing auth data for user role (AdminGrowthReportsPage):", error);
    return null;
  }
};
// --- END AUTH HELPERS ---

const API_URL = 'http://127.0.0.1:8000/lms';

// Define the interfaces for the data structure returned by the admin API
interface AdminCourseGrowthReport {
  course_id: number;
  course_title: string;
  pre_test_percentage: number;
  post_test_percentage: number;
  score_improvement: number;
  growth_percentage: number;
  growth_status: string;
  growth_status_display: string;
  initial_level: string;
  final_passed: boolean;
  total_attempts: number;
  updated_at: string;
}

interface AdminEmployeeData {
  employee: {
    id: number;
    name: string;
    email: string;
  };
  growth_reports: AdminCourseGrowthReport[];
}

export default function AdminGrowthReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<AdminEmployeeData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const userRole = getUserRole();

      // Frontend Authorization Check: Only admins should access this page
      if (!token || !userRole || userRole.toLowerCase() !== 'admin') {
        console.warn("AdminGrowthReportsPage: Attempted to access without admin privileges. Redirecting.");
        navigate('/lms/dashboard', { replace: true }); 
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/growth-reports/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 403) {
            setError(`Permission denied: ${errorText || 'You do not have permission to view this report.'}`);
          } else {
            setError(`Failed to fetch admin growth reports: ${errorText || response.statusText}`);
          }
          return;
        }

        const result: AdminEmployeeData[] = await response.json();
        setReports(result);
      } catch (err) {
        setError(`Failed to load growth reports for employees: ${err instanceof Error ? err.message : String(err)}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Added navigate to dependency array for useEffect safety

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/lms/dashboard')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No employee growth reports available.</p>
          <button 
            onClick={() => navigate('/lms/dashboard')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const toggleEmployeeExpansion = (employeeId: number) => {
    setExpandedEmployeeId(expandedEmployeeId === employeeId ? null : employeeId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/lms/dashboard')}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">All Employee Growth Reports</h1>
            <p className="text-gray-400">Overview of learning progress across the organization</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.map((employeeData) => (
            <div key={employeeData.employee.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleEmployeeExpansion(employeeData.employee.id)}
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h2 className="text-xl font-bold">{employeeData.employee.name}</h2>
                    <p className="text-gray-400 text-sm">{employeeData.employee.email}</p>
                  </div>
                </div>
                {expandedEmployeeId === employeeData.employee.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {expandedEmployeeId === employeeData.employee.id && (
                <div className="mt-6 space-y-4">
                  {employeeData.growth_reports.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No growth reports for this employee yet.</p>
                  ) : (
                    employeeData.growth_reports.map((report) => (
                      <div key={report.course_id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-lg font-semibold">{report.course_title}</h3>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            report.final_passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {report.final_passed ? 'Passed Course' : 'Not Passed Course'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex flex-col">
                            <span className="text-gray-400">Pre-Test:</span>
                            <span className="font-bold text-gray-200">{report.pre_test_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Post-Test:</span>
                            <span className="font-bold text-indigo-300">{report.post_test_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Improvement:</span>
                            <span className={`font-bold ${
                              report.score_improvement > 0 ? 'text-green-400' : report.score_improvement < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {report.score_improvement > 0 ? '+' : ''}{report.score_improvement.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-bold ${
                              report.growth_status === 'exceptional' ? 'text-green-400' :
                              report.growth_status === 'significant' ? 'text-emerald-400' :
                              report.growth_status === 'moderate' ? 'text-yellow-400' :
                              report.growth_status === 'minimal' ? 'text-blue-400' :
                              report.growth_status === 'declined' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {report.growth_status_display}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Initial Level:</span>
                            <span className="font-bold text-gray-200">{report.initial_level}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-gray-400">Attempts:</span>
                            <span className="font-bold text-gray-200">{report.total_attempts}</span>
                          </div>
                          <div className="flex flex-col col-span-2">
                            <button
                                onClick={() => navigate(`/lms/growth/compare/${report.course_id}`)}
                                className="text-indigo-400 hover:text-indigo-300 text-left"
                            >
                                View Detailed Report &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/lms/dashboard')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}