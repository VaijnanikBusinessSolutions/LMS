import { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock,
  FileQuestion,
  Target,
  AlertTriangle,
  Play,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

// --- Types for Pre-test (matching your backend response structure) ---
interface PreTestDetails {
  id: number;
  title: string;
  description: string; // Assuming pre-test can have a description
  total_time: number; // in minutes
  questions_count: number;
  // Add other fields you expect from the API
}

const mockCourse = {
  id: 1, // This ID is primarily for display; the actual courseId comes from useParams
  title: "Complete Python Bootcamp",
  description: "From zero to hero in Python programming with real-world projects and best practices.",
  instructor_name: "John Doe",
  level: "Beginner",
  duration: "12 weeks",
  photo: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
};

// Helper function to get token (copy from CourseMcqExam or a shared utility)
const getToken = () => {
  try {
    const authDataString = localStorage.getItem("auth");
    if (!authDataString) return null;
    const authData = JSON.parse(authDataString);
    return authData.accessToken;
  } catch (e) { return null; }
};

const PreTestStartPageSimple = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [preTest, setPreTest] = useState<PreTestDetails | null>(null); // State for fetched pre-test
  const [isLoadingPreTest, setIsLoadingPreTest] = useState(true); // Loading state for pre-test data
  const [error, setError] = useState<string | null>(null); // Error state for fetching pre-test
  const [isStarting, setIsStarting] = useState(false); // State for starting the test button

  // --- Fetch Pre-test Details ---
  useEffect(() => {
    const fetchPreTest = async () => {
      if (!courseId) {
        setError("Course ID is missing from URL.");
        setIsLoadingPreTest(false);
        return;
      }
      const token = getToken();
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        // ASSUMPTION: Your backend has an endpoint like this to get a course's pre-test details
        // Adjust the URL if your actual API endpoint is different
        const response = await fetch(`http://127.0.0.1:8000/lms/courses/${courseId}/pre-test/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) { // Unauthorized, token expired or invalid
          navigate('/');
          return;
        }
        if (response.status === 404) { // No pre-test found for this course
            setError("No pre-test found for this course. You might not need one, or it's not set up yet.");
            setPreTest(null); // Explicitly set to null
            setIsLoadingPreTest(false);
            return;
        }
        if (!response.ok) {
          throw new Error(`Failed to load pre-test details: ${response.statusText}`);
        }

        const data: PreTestDetails = await response.json();
        setPreTest(data);
      } catch (err) {
        console.error("Error loading pre-test:", err);
        setError("Failed to load pre-test information. Please try again.");
      } finally {
        setIsLoadingPreTest(false);
      }
    };

    fetchPreTest();
  }, [courseId, navigate]); // Re-run effect if courseId changes

  const handleStartTest = () => {
    if (!preTest) return; // Should not happen if button is disabled, but good safeguard
    setIsStarting(true);
    // Fake delay for better UX
    setTimeout(() => {
      // Navigate to the CourseMcqExam route, passing both courseId and the fetched preTest.id
      navigate(`/lms/courses/${courseId}/tests/${preTest.id}`);
    }, 800);
  };

  const handleGoBack = () => {
    // Assuming '/courses' is the route to your main course list
    navigate('/courses');
  };

  // --- Render Loading State ---
  if (isLoadingPreTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="ml-4 text-xl">Loading Pre-Test Info...</p>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-md bg-red-900/30 border border-red-700/40 rounded-2xl p-8 text-center">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-2">Error</h2>
          <p className="text-red-200">{error}</p>
          <button
            onClick={handleGoBack}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- Render Main Content (if preTest is available) ---
  // If `preTest` is null after loading and no error, it means no pre-test was found.
  // We can show a different message or just disable the start button.
  // For now, let's assume `error` covers the "not found" case.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Courses</span>
        </button>

        {/* Course Info Card (using mockCourse for display, as actual course details might be more complex) */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={mockCourse.photo} // Assuming you'd fetch real course photo here
              alt={mockCourse.title}
              className="w-32 h-32 object-cover rounded-xl border border-slate-600 shadow-lg"
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
                  {mockCourse.level}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1.5">
                  <Clock size={15} />
                  {mockCourse.duration}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{mockCourse.title}</h1>
              <p className="text-gray-400 mb-2">by {mockCourse.instructor_name}</p>
              <p className="text-gray-300 line-clamp-3">{mockCourse.description}</p>
            </div>
          </div>
        </div>

        {/* Pre-test Required Notice */}
        <div className="bg-amber-900/30 border border-amber-700/40 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-800/30 rounded-lg">
              <AlertTriangle size={28} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-300 mb-2">
                Pre-Test Required
              </h2>
              <p className="text-amber-200/90">
                Please complete this quick assessment before starting the course.
                It helps us understand your current level.
              </p>
            </div>
          </div>
        </div>

        {/* Test Card - Only render if preTest data is available */}
        {preTest && (
          <div className="bg-slate-800/70 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-700/40 to-purple-700/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600/30 rounded-xl">
                  <FileQuestion size={36} className="text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{preTest.title}</h2>
                  <p className="text-indigo-300/80">Pre-Assessment</p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6">
              <div className="bg-slate-700/40 rounded-xl p-5 text-center">
                <Clock size={28} className="mx-auto mb-2 text-cyan-400" />
                <p className="text-gray-400 text-sm mb-1">Time</p>
                <p className="text-3xl font-bold">{preTest.total_time} min</p>
              </div>

              <div className="bg-slate-700/40 rounded-xl p-5 text-center">
                <FileQuestion size={28} className="mx-auto mb-2 text-violet-400" />
                <p className="text-gray-400 text-sm mb-1">Questions</p>
                <p className="text-3xl font-bold">{preTest.questions_count}</p>
              </div>

              <div className="bg-slate-700/40 rounded-xl p-5 text-center">
                <Target size={28} className="mx-auto mb-2 text-emerald-400" />
                <p className="text-gray-400 text-sm mb-1">Purpose</p>
                <p className="text-2xl font-bold">Level Check</p>
              </div>
            </div>

            {/* Start Button */}
            <div className="p-6 pt-2 border-t border-slate-700">
              <button
                onClick={handleStartTest}
                disabled={isStarting || !preTest} // Disable if starting or no preTest data
                className={`
                  w-full py-5 px-8 rounded-xl font-bold text-lg
                  transition-all flex items-center justify-center gap-3
                  ${
                    isStarting
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-700/30'
                  }
                `}
              >
                {isStarting ? (
                  <>
                    <Loader2 size={26} className="animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play size={26} />
                    Start Pre-Test
                  </>
                )}
              </button>
            </div>
          </div>
        )}


        {/* Tiny footer note */}
        {preTest && (
            <p className="text-center text-slate-500 text-sm mt-10">
                Make sure you have ~{preTest.total_time} minutes of focus time
            </p>
        )}
      </div>
    </div>
  );
};

export default PreTestStartPageSimple;