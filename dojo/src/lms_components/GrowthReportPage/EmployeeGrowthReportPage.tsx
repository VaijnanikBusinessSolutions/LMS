import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Loader2
} from 'lucide-react';

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
    console.error("Error parsing auth data for token (EmployeeGrowthReportsPage):", error);
    return null;
  }
};

const getCurrentUserName = (): string | null => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;
    const authData: AuthData = JSON.parse(authDataString);
    return authData.user?.name || authData.user?.email || null;
  } catch (error) {
    console.error("Error parsing auth data for user name (EmployeeGrowthReportsPage):", error);
    return null;
  }
};
// --- END AUTH HELPERS ---

const API_URL = 'http://127.0.0.1:8000/lms';

// Re-use the same interface for individual course growth reports
interface CourseGrowthReport { 
  course_id: number;
  course_title: string;
  pre_test_percentage: number | null; // Allow null
  post_test_percentage: number | null; // Allow null
  score_improvement: number | null; // Allow null
  growth_percentage: number | null; // Allow null
  growth_status: string;
  growth_status_display: string;
  initial_level: string;
  final_passed: boolean;
  total_attempts: number;
  updated_at: string;
}

export default function EmployeeGrowthReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<CourseGrowthReport[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employeeDisplayName, setEmployeeDisplayName] = useState<string>('My');

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();

      if (!token) {
        console.warn("EmployeeGrowthReportsPage: Attempted to access without authentication. Redirecting to login.");
        navigate('/lms/login', { replace: true }); 
        return;
      }
      
      // Get the current user's name for display
      const name = getCurrentUserName();
      if (name) {
        setEmployeeDisplayName(name);
      }

      try {
        const response = await fetch(`${API_URL}/my-growth-reports/`, { // NEW ENDPOINT
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 403) {
            setError(`Permission denied: ${errorText || 'You do not have permission to view your reports.'}`);
          } else {
            setError(`Failed to fetch your growth reports: ${errorText || response.statusText}`);
          }
          return;
        }

        const result: CourseGrowthReport[] = await response.json(); 
        setReports(result);
      } catch (err) {
        setError(`Failed to load your growth reports: ${err instanceof Error ? err.message : String(err)}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
          <p className="text-gray-400 mb-4">No growth reports available for {employeeDisplayName}.</p>
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

  // Helper function to format percentages and handle null values
  const formatPercentage = (value: number | null): string => {
    return value != null ? Number(value).toFixed(1) : 'N/A';
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
            <h1 className="text-2xl font-bold">{employeeDisplayName}'s Growth Reports</h1>
            <p className="text-gray-400">Your personal learning progress overview</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {reports.map((report) => (
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
                  {/* Fixed: Use formatPercentage helper */}
                  <span className="font-bold text-gray-200">{formatPercentage(report.pre_test_percentage)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400">Post-Test:</span>
                  {/* Fixed: Use formatPercentage helper */}
                  <span className="font-bold text-indigo-300">{formatPercentage(report.post_test_percentage)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-400">Improvement:</span>
                  <span className={`font-bold ${
                    // Fixed: Use nullish coalescing (??) for comparison to treat null as 0
                    (report.score_improvement ?? 0) > 0 ? 'text-green-400' : (report.score_improvement ?? 0) < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {/* Fixed: Conditional '+' sign for positive improvement */}
                    {report.score_improvement != null && report.score_improvement > 0 ? '+' : ''}
                    {formatPercentage(report.score_improvement)}%
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