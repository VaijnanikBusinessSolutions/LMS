// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   CheckCircle2, 
//   AlertCircle, 
//   ChevronRight, 
//   ChevronLeft, 
//   Timer, 
//   Save,
//   Loader2,
//   AlertTriangle,
//   RotateCcw
// } from 'lucide-react';

// // --- Types ---
// interface Option {
//   id: number;
//   text: string;
// }

// interface Question {
//   id: number;
//   question: string;
//   question_text?: string; // Backend might send this instead
//   order: number;
//   options: Option[];
// }

// interface TestDetail {
//   id: number;
//   title: string;
//   description: string;
//   total_time: number; // in minutes
//   passing_criteria: number; // percentage
//   questions: Question[];
//   is_pre_test?: boolean;
// }

// interface SubmitResult {
//   passed: boolean;
//   score: number;
//   percentage?: number;
//   message?: string;
//   submissionId?: number; // Added to store the ID of the AnswerSubmission
// }

// interface ApiError {
//   detail?: string;
//   non_field_errors?: string[];
//   test?: string[];
//   answers?: string[];
//   [key: string]: unknown;
// }

// export default function CourseMcqExam() {
//   const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
//   const navigate = useNavigate();
  
//   // State
//   const [test, setTest] = useState<TestDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<number, number>>({}); // { questionId: optionId }
//   const [submitting, setSubmitting] = useState(false);
//   const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // in seconds

//   // --- Helper: Get Token ---
//   const getToken = useCallback((): string | null => {
//     try {
//       const authDataString = localStorage.getItem("auth");
//       if (!authDataString) return null;
//       const authData = JSON.parse(authDataString);
//       return authData.accessToken || authData.access || null;
//     } catch (e) {
//       console.error("Error parsing auth token:", e);
//       return null;
//     }
//   }, []);

//   // --- Helper: Parse API Error ---
//   const parseApiError = (errorData: ApiError): string => {
//     if (errorData.detail) return errorData.detail;
//     if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
//       return errorData.non_field_errors[0];
//     }
//     if (errorData.test && errorData.test.length > 0) {
//       return `Test error: ${errorData.test[0]}`;
//     }
//     if (errorData.answers && errorData.answers.length > 0) {
//       return `Answers error: ${errorData.answers[0]}`;
//     }
//     // Return first error found
//     for (const key in errorData) {
//       if (Array.isArray(errorData[key]) && (errorData[key] as string[]).length > 0) {
//         return `${key}: ${(errorData[key] as string[])[0]}`;
//       }
//     }
//     return "An unknown error occurred";
//   };

//   // --- 6. Submit Answers (MOVED UP) ---
//   // Memoize handleSubmit to prevent unnecessary re-runs of useEffect timer
//   const handleSubmit = useCallback(async (autoSubmit = false) => {
//     const token = getToken();
//     if (!token || !test) {
//       setError("Authentication error. Please log in again.");
//       return;
//     }
    
//     // Check if all questions are answered
//     const answeredCount = Object.keys(answers).length;
//     const totalQuestions = test.questions.length;
    
//     if (!autoSubmit && answeredCount < totalQuestions) {
//       const confirmSubmit = window.confirm(
//         `You have answered ${answeredCount} out of ${totalQuestions} questions. ` +
//         `Unanswered questions will be marked as incorrect. Continue?`
//       );
//       if (!confirmSubmit) return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       // Format answers: ensure keys are strings and values are numbers
//       const formattedAnswers: Record<string, number> = {};
//       Object.entries(answers).forEach(([questionId, optionId]) => {
//         formattedAnswers[String(questionId)] = Number(optionId);
//       });

//       const payload = {
//         test: Number(testId), // Ensure testId is a number
//         answers: formattedAnswers
//       };

//       console.log('📤 Submitting payload:', JSON.stringify(payload, null, 2));

//       const response = await fetch(`http://127.0.0.1:8000/lms/submissions/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response data:', result);

//       if (!response.ok) {
//         const errorMessage = parseApiError(result);
//         console.error("❌ Server error:", errorMessage);
//         throw new Error(errorMessage);
//       }

//       // Success!
//       console.log('✅ Submission successful:', result);
      
//       setSubmitResult({
//         passed: result.passed,
//         score: result.score,
//         percentage: totalQuestions > 0 
//           ? Math.round((result.score / totalQuestions) * 100) 
//           : 0,
//         submissionId: result.id, // CAPTURE THE SUBMISSION ID HERE
//       });

//     } catch (err) {
//       console.error("Submission error:", err);
//       setError(err instanceof Error ? err.message : "Failed to submit test");
//     } finally {
//       setSubmitting(false);
//     }
//   }, [getToken, test, testId, answers, parseApiError]); // Include all dependencies of handleSubmit


//   // --- 1. Fetch Test Data ---
//   useEffect(() => {
//     const fetchTest = async () => {
//       const token = getToken();
//       if (!token) {
//         console.error("No auth token found");
//         navigate('/');
//         return;
//       }

//       // Check for valid courseId and testId from URL params
//       if (!courseId || !testId) {
//         setError("Invalid course or test ID provided in URL.");
//         setLoading(false);
//         return;
//       }
//       const numericTestId = Number(testId);
//       if (isNaN(numericTestId) || numericTestId <= 0) {
//         setError("Test ID in URL is invalid.");
//         setLoading(false);
//         return;
//       }


//       try {
//         console.log(`📥 Fetching test: http://127.0.0.1:8000/lms/courses/${courseId}/tests/${numericTestId}/`);
        
//         const response = await fetch(
//           `http://127.0.0.1:8000/lms/courses/${courseId}/tests/${numericTestId}/`, // Use numericTestId here
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         console.log(`📥 Response status: ${response.status}`);

//         if (response.status === 401) {
//           console.error("Unauthorized - redirecting to login");
//           localStorage.removeItem("auth");
//           navigate('/');
//           return;
//         }

//         if (response.status === 403) {
//           setError("You don't have permission to access this test");
//           setLoading(false);
//           return;
//         }

//         if (response.status === 404) {
//           setError("Test not found for this course or the ID is incorrect.");
//           setLoading(false);
//           return;
//         }

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(parseApiError(errorData));
//         }

//         const data: TestDetail = await response.json();
//         console.log("📥 Test data received:", data);

//         // Validate test data
//         if (!data.questions || data.questions.length === 0) {
//           setError("This test has no questions configured.");
//           setLoading(false);
//           return;
//         }

//         setTest(data);
        
//         // Initialize timer if total_time is set
//         if (data.total_time && data.total_time > 0) {
//           setTimeRemaining(data.total_time * 60); // Convert minutes to seconds
//         }

//       } catch (err) {
//         console.error("Error loading test:", err);
//         setError(err instanceof Error ? err.message : "Failed to load test");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTest();
//   }, [courseId, testId, navigate, getToken, parseApiError]); // Added parseApiError to dependencies


//   // --- 2. Timer Effect ---
//   useEffect(() => {
//     if (timeRemaining === null || timeRemaining <= 0 || submitResult) return;

//     const timer = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev === null || prev <= 1) {
//           clearInterval(timer);
//           // Auto-submit when time runs out
//           if (prev === 1) {
//             handleSubmit(true); // This call is now after handleSubmit's declaration
//           }
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeRemaining, submitResult, handleSubmit]); // Dependency array is now correct


//   // --- 3. Format Time Display ---
//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // --- 4. Handle Answer Selection ---
//   const handleOptionSelect = (questionId: number, optionId: number) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: optionId
//     }));
//   };

//   // --- 5. Navigate Questions ---
//   const goToNextQuestion = () => {
//     if (test && currentQuestionIndex < test.questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const goToPreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const goToQuestion = (index: number) => {
//     setCurrentQuestionIndex(index);
//   };

//   // --- 7. Retry Test ---
//   const handleRetry = () => {
//     setSubmitResult(null);
//     setAnswers({});
//     setCurrentQuestionIndex(0);
//     setError(null);
//     if (test && test.total_time > 0) {
//       setTimeRemaining(test.total_time * 60);
//     }
//   };

//   // --- 8. Return to Course ---
//   const handleReturnToCourse = () => {
//     navigate(`/lms/courses/${courseId}`);
//   };

//   // --- RENDER: Loading State ---
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
//         <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-500" />
//         <p className="text-lg">Loading Exam...</p>
//         <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your test</p>
//       </div>
//     );
//   }

//   // --- RENDER: Error State ---
//   if (error && !test) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30">
//           <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertTriangle className="w-8 h-8 text-red-500" />
//           </div>
//           <h2 className="text-xl font-bold text-white mb-2">Error Loading Test</h2>
//           <p className="text-gray-400 mb-6">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <button 
//               onClick={() => window.location.reload()}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
//             >
//               <RotateCcw className="w-4 h-4" /> Retry
//             </button>
//             <button 
//               onClick={handleReturnToCourse}
//               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
//             >
//               Back to Course
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- RENDER: No Test Found ---
//   if (!test) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
//           <h2 className="text-xl text-white mb-2">Test Not Found</h2>
//           <p className="text-gray-400 mb-6">The requested test could not be loaded.</p>
//           <button 
//             onClick={handleReturnToCourse}
//             className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
//           >
//             Back to Course
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --- RENDER: Result Screen ---
//   if (submitResult) {
//     const percentage = test.questions.length > 0 
//       ? Math.round((submitResult.score / test.questions.length) * 100)
//       : 0;

//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//         <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700 shadow-2xl">
          
//           {/* Result Icon */}
//           {submitResult.passed ? (
//             <div className="bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
//               <CheckCircle2 className="w-12 h-12 text-green-500" />
//             </div>
//           ) : (
//             <div className="bg-red-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//               <AlertCircle className="w-12 h-12 text-red-500" />
//             </div>
//           )}
          
//           {/* Result Title */}
//           <h2 className="text-3xl font-bold text-white mb-2">
//             {submitResult.passed ? "Congratulations! 🎉" : "Keep Trying! 💪"}
//           </h2>
          
//           {/* Result Message */}
//           <p className="text-gray-400 mb-6">
//             {submitResult.passed 
//               ? test.is_pre_test 
//                 ? "You have completed the pre-test. Course content is now unlocked!"
//                 : "You have successfully passed the assessment. Great job!"
//               : `You need ${test.passing_criteria}% to pass. Review the material and try again.`}
//           </p>

//           {/* Score Display */}
//           <div className="bg-gray-900/50 rounded-xl p-6 mb-6">
//             <span className="text-gray-400 text-sm block mb-2">Your Score</span>
//             <div className={`text-5xl font-bold mb-2 ${submitResult.passed ? 'text-green-400' : 'text-red-400'}`}>
//               {submitResult.score}/{test.questions.length}
//             </div>
//             <div className={`text-xl ${submitResult.passed ? 'text-green-300' : 'text-red-300'}`}>
//               {percentage}%
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-700">
//               <span className="text-gray-500 text-sm">
//                 Passing Score: {test.passing_criteria}%
//               </span>
//             </div>

//             {/* Display Submission ID (Exam ID) */}
//             {submitResult.submissionId && (
//               <div className="mt-4 pt-4 border-t border-gray-700">
//                 <span className="text-gray-500 text-sm block">
//                   {test.is_pre_test ? "Pre-Test Submission ID:" : "Post-Test Submission ID:"}
//                 </span>
//                 <span className="text-white text-lg font-bold">{submitResult.submissionId}</span>
//               </div>
//             )}
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
//             <div 
//               className={`h-3 rounded-full transition-all duration-500 ${
//                 submitResult.passed ? 'bg-green-500' : 'bg-red-500'
//               }`}
//               style={{ width: `${percentage}%` }}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col gap-3">
//             <button 
//               onClick={handleReturnToCourse}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition"
//             >
//               {submitResult.passed ? "Continue to Course" : "Return to Course"}
//             </button>
            
//             {!submitResult.passed && (
//               <button 
//                 onClick={handleRetry}
//                 className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
//               >
//                 <RotateCcw className="w-4 h-4" />
//                 Try Again
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- RENDER: Question Screen ---
//   const currentQ = test.questions[currentQuestionIndex];
//   const questionText = currentQ.question || currentQ.question_text || "Question";
//   const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
//   const answeredCount = Object.keys(answers).length;
//   const isTimeWarning = timeRemaining !== null && timeRemaining < 60;

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      
//       {/* Header */}
//       <div className="bg-gray-800 border-b border-gray-700 p-4 shadow-md sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-none">
//               {test.title}
//             </h1>
//             <p className="text-xs text-gray-400">
//               Question {currentQuestionIndex + 1} of {test.questions.length} • 
//               {answeredCount} answered
//             </p>
//           </div>
          
//           {/* Timer */}
//           {timeRemaining !== null && (
//             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
//               isTimeWarning 
//                 ? 'text-red-500 bg-red-500/10 animate-pulse' 
//                 : 'text-yellow-500 bg-yellow-500/10'
//             }`}>
//               <Timer className="w-4 h-4" />
//               <span className="font-mono text-sm font-bold">
//                 {formatTime(timeRemaining)}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="h-1 bg-gray-800 w-full">
//         <div 
//           className="h-full bg-indigo-500 transition-all duration-300" 
//           style={{ width: `${progress}%` }}
//         />
//       </div>

//       {/* Error Banner */}
//       {error && (
//         <div className="bg-red-500/10 border-b border-red-500/30 p-3">
//           <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-400">
//             <AlertCircle className="w-4 h-4 flex-shrink-0" />
//             <span className="text-sm">{error}</span>
//             <button 
//               onClick={() => setError(null)}
//               className="ml-auto text-xs hover:text-red-300"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex items-start justify-center p-4 pt-8">
//         <div className="max-w-3xl w-full">
          
//           {/* Question Card */}
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-gray-700 shadow-xl min-h-[400px] flex flex-col">
            
//             {/* Question Number Badge */}
//             <div className="flex items-center gap-3 mb-6">
//               <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
//                 Q{currentQ.order || currentQuestionIndex + 1}
//               </span>
//               {answers[currentQ.id] && (
//                 <span className="text-green-400 text-xs flex items-center gap-1">
//                   <CheckCircle2 className="w-3 h-3" /> Answered
//                 </span>
//               )}
//             </div>

//             {/* Question Text */}
//             <h2 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
//               {questionText}
//             </h2>

//             {/* Options */}
//             <div className="space-y-3 flex-1">
//               {currentQ.options.map((option, index) => (
//                 <label 
//                   key={option.id}
//                   className={`
//                     flex items-center p-4 rounded-xl border cursor-pointer transition-all
//                     ${answers[currentQ.id] === option.id 
//                       ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500' 
//                       : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700 hover:border-gray-500'}
//                   `}
//                 >
//                   <div className={`
//                     w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0
//                     ${answers[currentQ.id] === option.id 
//                       ? 'border-indigo-500 bg-indigo-500' 
//                       : 'border-gray-500'}
//                   `}>
//                     {answers[currentQ.id] === option.id && (
//                       <div className="w-2 h-2 rounded-full bg-white" />
//                     )}
//                   </div>
//                   <input 
//                     type="radio" 
//                     name={`question-${currentQ.id}`} 
//                     value={option.id}
//                     checked={answers[currentQ.id] === option.id}
//                     onChange={() => handleOptionSelect(currentQ.id, option.id)}
//                     className="sr-only"
//                   />
//                   <span className="text-gray-200 flex-1">
//                     <span className="text-gray-500 mr-2">{String.fromCharCode(65 + index)}.</span>
//                     {option.text}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Question Navigator (Mobile) */}
//           <div className="mt-6 flex flex-wrap gap-2 justify-center md:hidden">
//             {test.questions.map((q, index) => (
//               <button
//                 key={q.id}
//                 onClick={() => goToQuestion(index)}
//                 className={`
//                   w-10 h-10 rounded-lg text-sm font-medium transition-all
//                   ${currentQuestionIndex === index 
//                     ? 'bg-indigo-600 text-white' 
//                     : answers[q.id] 
//                       ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
//                       : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
//                 `}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>

//           {/* Navigation Footer */}
//           <div className="flex justify-between items-center mt-8">
//             <button 
//               onClick={goToPreviousQuestion}
//               disabled={currentQuestionIndex === 0}
//               className="flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               <ChevronLeft className="w-5 h-5" />
//               <span className="hidden sm:inline">Previous</span>
//             </button>

//             {/* Question Navigator (Desktop) */}
//             <div className="hidden md:flex flex-wrap gap-2 justify-center max-w-md">
//               {test.questions.map((q, index) => (
//                 <button
//                   key={q.id}
//                   onClick={() => goToQuestion(index)}
//                   className={`
//                     w-8 h-8 rounded text-xs font-medium transition-all
//                     ${currentQuestionIndex === index 
//                       ? 'bg-indigo-600 text-white' 
//                       : answers[q.id] 
//                         ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
//                         : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}
//                   `}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             {currentQuestionIndex === test.questions.length - 1 ? (
//               <button 
//                 onClick={() => handleSubmit(false)}
//                 disabled={submitting}
//                 className="flex items-center gap-2 px-6 md:px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-green-900/20 transition transform hover:-translate-y-0.5"
//               >
//                 {submitting ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     <span className="hidden sm:inline">Submitting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     <span className="hidden sm:inline">Submit Exam</span>
//                     <span className="sm:hidden">Submit</span>
//                   </>
//                 )}
//               </button>
//             ) : (
//               <button 
//                 onClick={goToNextQuestion}
//                 className="flex items-center gap-2 px-4 md:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-900/20 transition transform hover:-translate-y-0.5"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             )}
//           </div>

//           {/* Status Bar */}
//           <div className="mt-6 flex justify-center">
//             <div className="bg-gray-800 rounded-full px-4 py-2 flex items-center gap-4 text-sm">
//               <span className="text-gray-400">
//                 Answered: <span className="text-white font-medium">{answeredCount}/{test.questions.length}</span>
//               </span>
//               <div className="w-px h-4 bg-gray-600" />
//               <span className="text-gray-400">
//                 Remaining: <span className="text-yellow-400 font-medium">{test.questions.length - answeredCount}</span>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Timer, 
  Save,
  Loader2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react';

// --- Types ---
interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  question_text?: string;
  order: number;
  options: Option[];
}

interface TestDetail {
  id: number;
  title: string;
  description: string;
  total_time: number;
  passing_criteria: number;
  questions: Question[];
  is_pre_test?: boolean;
}

interface SubmitResult {
  passed: boolean;
  score: number;
  percentage?: number;
  message?: string;
  submissionId?: number;
}

interface ApiError {
  detail?: string;
  non_field_errors?: string[];
  test?: string[];
  answers?: string[];
  [key: string]: unknown;
}

export default function CourseMcqExam() {
  const { courseId, testId } = useParams<{ courseId: string; testId: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const getToken = useCallback((): string | null => {
    try {
      const authDataString = localStorage.getItem("auth");
      if (!authDataString) return null;
      const authData = JSON.parse(authDataString);
      return authData.accessToken || authData.access || null;
    } catch (e) {
      console.error("Error parsing auth token:", e);
      return null;
    }
  }, []);

  const parseApiError = (errorData: ApiError): string => {
    if (errorData.detail) return errorData.detail;
    if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
      return errorData.non_field_errors[0];
    }
    if (errorData.test && errorData.test.length > 0) {
      return `Test error: ${errorData.test[0]}`;
    }
    if (errorData.answers && errorData.answers.length > 0) {
      return `Answers error: ${errorData.answers[0]}`;
    }
    for (const key in errorData) {
      if (Array.isArray(errorData[key]) && (errorData[key] as string[]).length > 0) {
        return `${key}: ${(errorData[key] as string[])[0]}`;
      }
    }
    return "An unknown error occurred";
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    const token = getToken();
    if (!token || !test) {
      setError("Authentication error. Please log in again.");
      return;
    }
    
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = test.questions.length;
    
    if (!autoSubmit && answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} out of ${totalQuestions} questions. ` +
        `Unanswered questions will be marked as incorrect. Continue?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formattedAnswers: Record<string, number> = {};
      Object.entries(answers).forEach(([questionId, optionId]) => {
        formattedAnswers[String(questionId)] = Number(optionId);
      });

      const payload = {
        test: Number(testId),
        answers: formattedAnswers
      };

      const response = await fetch(`http://127.0.0.1:8000/lms/submissions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = parseApiError(result);
        throw new Error(errorMessage);
      }

      setSubmitResult({
        passed: result.passed,
        score: result.score,
        percentage: totalQuestions > 0 
          ? Math.round((result.score / totalQuestions) * 100) 
          : 0,
        submissionId: result.id,
      });

    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  }, [getToken, test, testId, answers]);

  useEffect(() => {
    const fetchTest = async () => {
      const token = getToken();
      if (!token) { navigate('/'); return; }

      if (!courseId || !testId) {
        setError("Invalid course or test ID provided in URL.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/lms/courses/${courseId}/tests/${testId}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 401) { navigate('/'); return; }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(parseApiError(errorData));
        }

        const data: TestDetail = await response.json();
        if (!data.questions || data.questions.length === 0) {
          setError("This test has no questions configured.");
          setLoading(false);
          return;
        }

        setTest(data);
        if (data.total_time > 0) setTimeRemaining(data.total_time * 60);

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load test");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [courseId, testId, navigate, getToken]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || submitResult) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (prev === 1) handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRemaining, submitResult, handleSubmit]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const goToNextQuestion = () => {
    if (test && currentQuestionIndex < test.questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleRetry = () => {
    setSubmitResult(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setError(null);
    if (test && test.total_time > 0) setTimeRemaining(test.total_time * 60);
  };

  const handleReturnToCourse = () => navigate(`/lms/courses/${courseId}`);

  // --- RENDER: Loading ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />
        <div className="relative z-10 text-center">
          <div className="relative mb-8 flex justify-center">
            <div className="w-24 h-24 border-4 border-violet-200 dark:border-violet-900/30 rounded-full animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto animate-spin text-violet-500" size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Preparing Exam</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your secure environment...</p>
        </div>
      </div>
    );
  }

  // --- RENDER: Error ---
  if (error && !test) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-red-100 dark:border-red-900/30">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Exam Unavailable</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
          <button onClick={handleReturnToCourse} className="w-full py-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl font-bold transition-transform active:scale-95">
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: Results ---
  if (submitResult && test) {
    const isPassed = submitResult.passed;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden relative">
          <div className={`h-3 w-full ${isPassed ? 'bg-emerald-500' : 'bg-orange-500'}`} />
          
          <div className="p-8 md:p-12 text-center">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg ${isPassed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
              {isPassed ? <Trophy size={48} /> : <Target size={48} />}
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
              {isPassed ? "Excellent Work!" : "Almost There!"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
              {isPassed ? "You've successfully completed the assessment." : "You didn't meet the passing criteria this time."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
                <p className={`text-4xl font-black ${isPassed ? 'text-emerald-500' : 'text-orange-500'}`}>{submitResult.percentage}%</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className={`text-2xl font-black uppercase ${isPassed ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {isPassed ? "Passed" : "Failed"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleReturnToCourse} className="w-full py-5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-200 dark:shadow-none transition-all active:scale-[0.98]">
                Return to Course
              </button>
              {!isPassed && (
                <button onClick={handleRetry} className="w-full py-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98]">
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: Exam Interface ---
  const currentQ = test!.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test!.questions.length) * 100;
  const isTimeWarning = timeRemaining !== null && timeRemaining < 60;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-2xl hidden md:block">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-black text-slate-900 dark:text-white md:text-xl truncate max-w-[200px] md:max-w-md">
                {test!.title}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Question {currentQuestionIndex + 1} of {test!.questions.length}
              </p>
            </div>
          </div>

          {timeRemaining !== null && (
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-mono text-lg font-black border-2 transition-all ${
              isTimeWarning 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 animate-pulse' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              <Timer size={20} />
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full bg-violet-500 transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-8 md:p-12 flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-10 leading-snug">
              {currentQ.question || currentQ.question_text}
            </h2>

            <div className="grid gap-4">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(currentQ.id, option.id)}
                    className={`group flex items-center p-5 rounded-3xl border-2 transition-all text-left relative overflow-hidden ${
                      isSelected 
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 shadow-lg shadow-violet-100 dark:shadow-none' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700'
                    }`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-lg mr-5 transition-colors ${
                      isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={`text-lg font-semibold flex-1 ${isSelected ? 'text-violet-900 dark:text-violet-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {option.text}
                    </span>
                    {isSelected && <CheckCircle2 className="text-violet-500 ml-4" size={24} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-4 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            {currentQuestionIndex === test!.questions.length - 1 ? (
              <button 
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="flex items-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Save />} 
                Submit Exam
              </button>
            ) : (
              <button 
                onClick={goToNextQuestion}
                className="flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
              >
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Question Map */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {test!.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border-2 ${
                currentQuestionIndex === idx 
                  ? 'bg-violet-500 border-violet-500 text-white shadow-lg' 
                  : answers[q.id] 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}