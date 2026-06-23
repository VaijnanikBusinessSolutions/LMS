import { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, CheckCircle, BarChart2, Award, FileBadge2, CirclePlay, Users, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/lms';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  sample?: boolean;
  content: string;
  order: number;
  videoUrl?: string;
}

interface Option {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question: string;
  order: number;
  options: Option[];
}

interface Test {
  id: number;
  title: string;
  passing_criteria: number;
  total_time: number;
  order: number;
  questions: Question[];
}

interface Course {
  id: number;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  description: string;
  introduction: string;
  tags: string[];
  questions: number;
  photo?: string;
  updated: string;
  created: string;
  is_published: boolean;
  stats: {
    accuracy: number;
    completion: number;
    enrolled: number;
    rating: string;
    duration: string;
  };
  roadmap: Lesson[];
  tests?: Test[];
}

type ContentItem =
  | ({ kind: 'lesson' } & Lesson)
  | ({ kind: 'test' } & Test);

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      const courseIdNumber = parseInt(courseId, 10);
      if (isNaN(courseIdNumber)) {
        setError('Invalid course ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_URL}/courses/${courseIdNumber}/`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Course = await response.json();
        setCourse(data);
      } catch (err) {
        setError('Failed to fetch course details. Please check your backend connection.');
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleStartCourse = () => {
    if (!course) return;
    const sortedRoadmap = [...course.roadmap].sort((a, b) => a.order - b.order);
    const firstLesson = sortedRoadmap[0];
    if (firstLesson) {
      navigate(`/lms/courses/${course.id}/lesson/${firstLesson.id}`);
    }
  };

  const handleLessonClick = (lessonId: number) => {
    if (!course) return;
    navigate(`/lms/courses/${course.id}/lesson/${lessonId}`);
  };

  const handleTestClick = (testId: number) => {
    if (!course) return;
    // Navigate to the CourseLessonPage, but use a query param to indicate it's a test to display instructions
    // Assumes there's at least one lesson to act as a base route for CourseLessonPage
    navigate(`/lms/courses/${course.id}/lesson/${course.roadmap[0]?.id || 1}?viewTest=${testId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error</h3>
            <p className="text-red-400 mb-6">{error || 'Course not found'}</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build unified content list (lessons + tests) sorted by "order"
  const lessons: ContentItem[] = course.roadmap.map(l => ({ kind: 'lesson', ...l }));
  const tests: ContentItem[] = (course.tests ?? []).map(t => ({ kind: 'test', ...t }));
  const unifiedContent: ContentItem[] = [...lessons, ...tests].sort((a, b) => a.order - b.order);

  const lessonCount = course.roadmap.length;
  const testCount = (course.tests ?? []).length;
  const rating = Number.parseFloat(course.stats.rating || '0').toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all">
          {/* Cover */}
          {course.photo && (
            <div className="mb-6">
              <img
                src={course.photo}
                alt={course.title}
                className="w-full h-56 object-cover rounded-xl border border-gray-600"
              />
            </div>
          )}

          <div className="flex items-center gap-3 text-sm mb-3">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold">
              {course.level}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock size={14} />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Award size={14} className="text-yellow-400" />
              {rating}/5
            </span>
          </div>

          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-200 mb-4">
            {course.title}
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">{course.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-3 py-1.5 rounded-md font-medium border ${
                  tag === 'Urgent'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : tag === 'Popular'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-gray-700/50 text-gray-300 border-gray-600/30'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction Section */}
            <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <BookOpen size={20} className="text-indigo-400" />
                </div>
                Course Introduction
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{course.introduction}</p>
              <div className="flex items-center gap-6 text-sm text-gray-400 mt-4 pt-4 border-t border-gray-700/50">
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-indigo-400" />
                  {course.stats.duration} total
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-400" />
                  {lessonCount} lessons
                </span>
                {!!testCount && (
                  <span className="flex items-center gap-2">
                    <BarChart2 size={14} className="text-purple-400" />
                    {testCount} tests
                  </span>
                )}
              </div>
            </section>

            {/* Course Content Section */}
            <section className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <path d="M3 3v18h18" />
                    <path d="M18 7V3" />
                    <path d="M12 11V3" />
                    <path d="M8 15V3" />
                    <path d="M3 11h18" />
                  </svg>
                </div>
                Course Content ({unifiedContent.length} items)
              </h2>

              <div className="space-y-3">
                {unifiedContent.map((item) => {
                  if (item.kind === 'lesson') {
                    const lesson = item as Extract<ContentItem, { kind: 'lesson' }>;
                    return (
                      <div
                        key={`lesson-${lesson.id}`}
                        className={`group flex items-center gap-3 p-4 hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-indigo-500/30 ${
                          lesson.completed ? 'bg-green-500/10' : ''
                        }`}
                        onClick={() => handleLessonClick(lesson.id)}
                      >
                        <div className="flex-shrink-0">
                          {lesson.completed ? (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle size={18} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                              <CirclePlay size={14} className="text-gray-400 group-hover:text-indigo-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className={`text-white font-medium group-hover:text-indigo-300 transition-colors ${
                              lesson.completed ? 'text-gray-400' : ''
                            }`}>
                              {lesson.title}
                            </span>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {lesson.sample && (
                              <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/30 font-medium">
                                SAMPLE
                              </span>
                            )}
                            {lesson.completed && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30 font-medium">
                                COMPLETED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const test = item as Extract<ContentItem, { kind: 'test' }>;
                    return (
                      <div
                        key={`test-${test.id}`}
                        className="group flex items-center gap-3 p-4 hover:bg-gray-700/50 rounded-xl cursor-pointer transition-all border border-indigo-500/20 hover:border-indigo-500/40"
                        onClick={() => handleTestClick(test.id)}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                            <FileBadge2 size={14} className="text-indigo-400" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                              Test: {test.title}
                            </span>
                            <span className="text-sm text-gray-500">{test.total_time} min</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>Questions: {test.questions.length}</span>
                            <span>•</span>
                            <span>Pass: {test.passing_criteria}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </section>
          </div>

          {/* Right Column - Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 sticky top-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Users size={16} className="text-indigo-400" />
                    Instructor
                  </span>
                  <span className="font-semibold text-white">{course.instructor_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Clock size={16} className="text-indigo-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-white">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Users size={16} className="text-indigo-400" />
                    Students
                  </span>
                  <span className="font-semibold text-white">{course.stats.enrolled}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Calendar size={16} className="text-indigo-400" />
                    Updated
                  </span>
                  <span className="font-semibold text-white">{formatDate(course.updated)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <BarChart2 size={16} className="text-indigo-400" />
                    Accuracy
                  </span>
                  <span className="font-semibold text-white">{course.stats.accuracy}%</span>
                </div>
              </div>

              <button
                onClick={handleStartCourse}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                <Play size={18} />
                Start Course
              </button>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span className="font-medium">Progress</span>
                  <span className="font-bold text-white">{course.stats.completion}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${course.stats.completion}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <h3 className="font-semibold text-white mb-4">Course Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Items:</span>
                    <span className="font-semibold text-white">{unifiedContent.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Lessons:</span>
                    <span className="font-semibold text-white">{lessonCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tests:</span>
                    <span className="font-semibold text-white">{testCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completed Lessons:</span>
                    <span className="font-semibold text-green-400">
                      {course.roadmap.filter(lesson => lesson.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Remaining Lessons:</span>
                    <span className="font-semibold text-gray-300">
                      {course.roadmap.filter(lesson => !lesson.completed).length}
                    </span>
                  </div>
                </div>
              </div>

              {!course.is_published && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="text-yellow-400 text-sm font-semibold">Draft Course</div>
                  <div className="text-yellow-300/80 text-sm mt-1">
                    This course is still in development
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;