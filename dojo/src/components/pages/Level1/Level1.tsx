// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { ArrowLeft, Home, User, BookOpen, Loader2, PlusCircle } from 'lucide-react';

// // Define the interfaces
// interface SubTopic {
//     id: number; 
//     title: string; 
//     day: number; 
//     day_name: string; 
//     level_name: string;
//     description?: string;
// }

// interface GroupedSubTopics {
//     [key: string]: SubTopic[];
// }

// interface QuestionPaperLookup {
//     question_paper_id: number;
//     question_paper_name: string;
// }

// const API_BASE = 'http://127.0.0.1:8000';

// // =========================================================================
// // STATIC GLOBAL CONFIGURATION
// const QP_LOOKUP_API = `${API_BASE}/questionpapers/?level=1&department=&line=&subline=&station=`; 
// const FALLBACK_STATION_ID = 1; 
// // =========================================================================

// const Level1 = () => {
//     const navigate = useNavigate();
//     const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
    
//     // --- STATE FOR DYNAMIC QP ID ---
//     const [globalQP, setGlobalQP] = useState<QuestionPaperLookup | null>(null);
    
//     // isDataReady checks if we actually have lessons to show
//     const isDataReady = subtopics.length > 0 && !error;
//     // ------------------------------------

//     useEffect(() => {
//         const fetchGlobalQP = async () => {
//             try {
//                 const qpResponse = await fetch(QP_LOOKUP_API);
//                 if (qpResponse.ok) {
//                     const qpData = await qpResponse.json();
//                     const targetQP = qpData?.results?.[0] || (Array.isArray(qpData) ? qpData[0] : null);

//                     if (targetQP) {
//                         setGlobalQP({
//                             question_paper_id: targetQP.question_paper_id,
//                             question_paper_name: targetQP.question_paper_name,
//                         });
//                     }
//                 }
//             } catch (err: any) {
//                 console.warn('Global Exam config fetch failed silently:', err);
//             }
//         };

//         const fetchSubtopics = async () => {
//             try {
//                 const response = await fetch(`${API_BASE}/subtopics/?level=1`);
//                 if (!response.ok) throw new Error('Failed to load training data');
//                 const jsonData: SubTopic[] = await response.json();
//                 setSubtopics(jsonData);
//             } catch (error: any) {
//                 console.error('Subtopic fetch error:', error);
//                 setError(error.message);
//             }
//         };

//         const initialLoad = async () => {
//             setLoading(true);
//             await Promise.all([fetchGlobalQP(), fetchSubtopics()]);
//             setLoading(false);
//         }

//         initialLoad();
//     }, []);

//     const groupSubtopicsByDay = (subtopicsToGroup: SubTopic[]): GroupedSubTopics => {
//         const grouped: GroupedSubTopics = {};
//         subtopicsToGroup.forEach((subtopic) => {
//             const dayKey = subtopic.day_name || `Day ${subtopic.day}`;
//             if (!grouped[dayKey]) {
//                 grouped[dayKey] = [];
//             }
//             grouped[dayKey].push(subtopic);
//         });
//         return grouped;
//     };

//     const handleLessonClick = (subtopic: SubTopic) => {
//         const normalizedTitle = subtopic.title.toLowerCase();

//         if (normalizedTitle === 'evaluation') {
//             if (!globalQP) {
//                 alert("Cannot start exam: Global Question Paper configuration missing. Please check backend.");
//                 return;
//             }
            
//             navigate('/ExamModeSelector', {
//                 state: {
//                     questionPaperId: globalQP.question_paper_id, 
//                     levelId: 1, 
//                     fromNavigation: true,
//                     skillId: FALLBACK_STATION_ID, 
//                     skillName: 'Global',
//                     stationId: FALLBACK_STATION_ID, 
//                     stationName: 'Global',
//                     departmentId: null, 
//                     departmentName: 'All Departments', 
//                 },
//             });
//         } else if (normalizedTitle === 'handover sheet' || normalizedTitle === 'handover') {
//             navigate('/HandoverSheet');
//         } else if (normalizedTitle === 'feedback form' || normalizedTitle === 'feedback') {
//             navigate('/Level1/feedbackform');
//         } else {
//             navigate(`/level1/${subtopic.id}`);
//         }
//     };

//     const getLessonStyle = (title: string) => {
//         const normalizedTitle = title.toLowerCase();
        
//         if (normalizedTitle === 'evaluation' && !globalQP) {
//              return {
//                 bg: 'bg-gray-100 border-l-4 border-gray-300',
//                 text: 'text-gray-500',
//                 icon: '🚫',
//                 badge: 'bg-gray-200 text-gray-500'
//             };
//         }

//         if (normalizedTitle === 'evaluation') {
//             return {
//                 bg: 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500',
//                 text: 'text-red-700',
//                 icon: '📊',
//                 badge: 'bg-red-100 text-red-700'
//             };
//         } else if (normalizedTitle === 'handover sheet' || normalizedTitle === 'handover') {
//             return {
//                 bg: 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500',
//                 text: 'text-amber-700',
//                 icon: '📋',
//                 badge: 'bg-amber-100 text-amber-700'
//             };
//         } else if (normalizedTitle === 'feedback form' || normalizedTitle === 'feedback') {
//             return {
//                 bg: 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500',
//                 text: 'text-blue-700',
//                 icon: '💬',
//                 badge: 'bg-blue-100 text-blue-700'
//             };
//         } else {
//             return {
//                 bg: 'bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-400',
//                 text: 'text-slate-700',
//                 icon: '📚',
//                 badge: 'bg-slate-100 text-slate-700'
//             };
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//                 <header className="bg-white shadow-lg border-b border-gray-200">
//                     <div className="max-w-7xl mx-auto px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-4">
//                                 <button 
//                                     onClick={() => navigate(-1)}
//                                     className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
//                                 >
//                                     <ArrowLeft className="w-5 h-5 text-gray-600" />
//                                 </button>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
//                                         <span className="text-white font-bold text-sm">NL</span>
//                                     </div>
//                                     <div>
//                                         <h1 className="text-lg font-semibold text-gray-900">NL Technologies Pvt.Ltd Pvt Ltd</h1>
//                                         <p className="text-xs text-gray-500">Training Management System</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <div className="w-full px-6 py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//                     <div className="flex justify-center items-center h-64">
//                         <div className="text-center">
//                             <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6 text-blue-600" />
//                             <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Training Modules...</h3>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // === MODIFIED: Show "Create Days" screen if data is missing or empty ===
//     if (error || !isDataReady) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//                 <header className="bg-white shadow-lg border-b border-gray-200">
//                     <div className="max-w-7xl mx-auto px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-4">
//                                 <button 
//                                     onClick={() => navigate(-1)}
//                                     className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
//                                 >
//                                     <ArrowLeft className="w-5 h-5 text-gray-600" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <div className="w-full px-6 py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//                     <div className="flex justify-center items-center h-64">
//                         <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-lg border border-gray-200">
//                             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                                 <PlusCircle className="w-8 h-8 text-blue-600" />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-800 mb-2">Setup Required</h3>
//                             <p className="text-gray-600 mb-6">
//                                 No training days or modules found for Level 1. You need to configure the curriculum first.
//                             </p>
//                             <button 
//                                 onClick={() => navigate('/methodsettings?tab=Level1-settings')}
//                                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center mx-auto shadow-lg shadow-blue-200"
//                             >
//                                 <PlusCircle className="w-5 h-5 mr-2" />
//                                 Create Training Modules
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//     // ======================================================================

//     const groupedSubtopics = groupSubtopicsByDay(subtopics);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
//             {/* Hero Section */}
//             <div className="bg-white border-b border-gray-200 w-full">
//                 <div className="w-full px-6 py-6">
//                     <div className="text-center">
//                         <div className="flex items-center justify-center space-x-2 mb-4">
//                             <BookOpen className="w-8 h-8 text-blue-600" />
//                             <h1 className="text-4xl font-bold text-gray-900">Basic DOJO Training</h1>
//                         </div>
//                     </div>
//                     <div className='flex justify-end items-center w-full'>
//                         <button
//                             onClick={() => navigate("/level1/attendance")}
//                             className="px-6 py-3 bg-blue-600 text-white rounded-lg flex justify-end hover:bg-blue-700 transition-colors font-medium"
//                         >
//                             Mark Attendance
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Training Content */}
//             <div className="w-full px-6 py-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//                     <div className="p-6">
//                         <div className="space-y-12">
//                             {Object.keys(groupedSubtopics)
//                                 .sort()
//                                 .map((dayName, dayIndex) => {
//                                     const daySubtopics = groupedSubtopics[dayName];
//                                     return (
//                                         <div key={dayName} className="relative">
//                                             <div className="flex items-center mb-6">
//                                                 <div className="flex-shrink-0 mr-8">
//                                                     <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                                                         <div className="text-center">
//                                                             <div className="text-xl font-bold text-white">{dayIndex + 1}</div>
//                                                             <div className="text-xs text-blue-100 font-medium">DAY</div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{dayName}</h2>
//                                                     <p className="text-gray-600">
//                                                         {daySubtopics.length} training modules • 
//                                                         {dayIndex === 0 ? ' Foundation concepts' : ' Advanced topics & assessment'}
//                                                     </p>
//                                                     <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
//                                                 </div>
//                                             </div>

//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-28">
//                                                 {daySubtopics.map((subtopic: SubTopic, index: number) => {
//                                                     const style = getLessonStyle(subtopic.title);
//                                                     return (
//                                                         <div
//                                                             key={subtopic.id}
//                                                             className={`${style.bg} rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group`}
//                                                             onClick={() => handleLessonClick(subtopic)}
//                                                         >
//                                                             <div className="flex items-start justify-between mb-3">
//                                                                 <div className="flex items-center space-x-3">
//                                                                     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
//                                                                         <span className="text-xl">{style.icon}</span>
//                                                                     </div>
//                                                                     <div className="flex-1">
//                                                                         <h3 className={`text-base font-bold ${style.text} group-hover:text-opacity-80 transition-colors`}>
//                                                                             {subtopic.title}
//                                                                         </h3>
//                                                                         <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${style.badge} mt-1`}>
//                                                                             Module {index + 1}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//                                                                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                                                     </svg>
//                                                                 </div>
//                                                             </div>
                                                            
//                                                             {subtopic.description && (
//                                                                 <p className="text-gray-700 text-sm leading-relaxed">
//                                                                     {subtopic.description}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     );
//                                 })}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default Level1;






import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Home, User, BookOpen, Loader2, PlusCircle } from 'lucide-react';

// Define the interfaces
interface SubTopic {
    id: number; 
    title: string; 
    day: number; 
    day_name: string; 
    level_name: string;
    description?: string;
}

interface GroupedSubTopics {
    [key: string]: SubTopic[];
}

interface QuestionPaperLookup {
    question_paper_id: number;
    question_paper_name: string;
}

const API_BASE = 'http://127.0.0.1:8000';

// =========================================================================
// STATIC GLOBAL CONFIGURATION
const QP_LOOKUP_API = `${API_BASE}/questionpapers/?level=1&department=&line=&subline=&station=`; 
const FALLBACK_STATION_ID = 1; 
// =========================================================================

const Level1 = () => {
    const navigate = useNavigate();
    const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // --- STATE FOR DYNAMIC QP ID ---
    const [globalQP, setGlobalQP] = useState<QuestionPaperLookup | null>(null);
    
    // isDataReady checks if we actually have lessons to show
    const isDataReady = subtopics.length > 0 && !error;
    // ------------------------------------

    useEffect(() => {
        const fetchGlobalQP = async () => {
            try {
                const qpResponse = await fetch(QP_LOOKUP_API);
                if (qpResponse.ok) {
                    const qpData = await qpResponse.json();
                    const targetQP = qpData?.results?.[0] || (Array.isArray(qpData) ? qpData[0] : null);

                    if (targetQP) {
                        setGlobalQP({
                            question_paper_id: targetQP.question_paper_id,
                            question_paper_name: targetQP.question_paper_name,
                        });
                    }
                }
            } catch (err: any) {
                console.warn('Global Exam config fetch failed silently:', err);
            }
        };

        const fetchSubtopics = async () => {
            try {
                const response = await fetch(`${API_BASE}/subtopics/?level=1`);
                if (!response.ok) throw new Error('Failed to load training data');
                const jsonData: SubTopic[] = await response.json();
                setSubtopics(jsonData);
            } catch (error: any) {
                console.error('Subtopic fetch error:', error);
                setError(error.message);
            }
        };

        const initialLoad = async () => {
            setLoading(true);
            await Promise.all([fetchGlobalQP(), fetchSubtopics()]);
            setLoading(false);
        }

        initialLoad();
    }, []);

    const groupSubtopicsByDay = (subtopicsToGroup: SubTopic[]): GroupedSubTopics => {
        const grouped: GroupedSubTopics = {};
        subtopicsToGroup.forEach((subtopic) => {
            const dayKey = subtopic.day_name || `Day ${subtopic.day}`;
            if (!grouped[dayKey]) {
                grouped[dayKey] = [];
            }
            grouped[dayKey].push(subtopic);
        });
        return grouped;
    };

    const handleLessonClick = (subtopic: SubTopic) => {
        const normalizedTitle = subtopic.title.toLowerCase();

        if (normalizedTitle === 'evaluation') {
            if (!globalQP) {
                alert("Cannot start exam: Global Question Paper configuration missing. Please check backend.");
                return;
            }
            
            navigate('/ExamModeSelector', {
                state: {
                    questionPaperId: globalQP.question_paper_id, 
                    levelId: 1, 
                    fromNavigation: true,
                    skillId: FALLBACK_STATION_ID, 
                    skillName: 'Global',
                    stationId: FALLBACK_STATION_ID, 
                    stationName: 'Global',
                    departmentId: null, 
                    departmentName: 'All Departments', 
                },
            });
        } else if (normalizedTitle === 'handover sheet' || normalizedTitle === 'handover') {
            navigate('/HandoverSheet');
        } else if (normalizedTitle === 'feedback form' || normalizedTitle === 'feedback') {
            navigate('/Level1/feedbackform');
        } else {
            navigate(`/level1/${subtopic.id}`);
        }
    };

    const getLessonStyle = (title: string) => {
        const normalizedTitle = title.toLowerCase();
        
        // Error state for Evaluation
        if (normalizedTitle === 'evaluation' && !globalQP) {
             return {
                bg: 'bg-background border-l-4 border-muted', // Neutralized error state
                text: 'text-muted',
                icon: '🚫',
                badge: 'bg-background border border-border text-muted'
            };
        }

        // Specific Lesson Types (Retaining color coding for status, but softening backgrounds)
        if (normalizedTitle === 'evaluation') {
            return {
                bg: 'bg-red-50 border-l-4 border-red-500',
                text: 'text-red-700',
                icon: '📊',
                badge: 'bg-red-100 text-red-700'
            };
        } else if (normalizedTitle === 'handover sheet' || normalizedTitle === 'handover') {
            return {
                bg: 'bg-amber-50 border-l-4 border-amber-500',
                text: 'text-amber-700',
                icon: '📋',
                badge: 'bg-amber-100 text-amber-700'
            };
        } else if (normalizedTitle === 'feedback form' || normalizedTitle === 'feedback') {
            return {
                bg: 'bg-blue-50 border-l-4 border-blue-500',
                text: 'text-blue-700',
                icon: '💬',
                badge: 'bg-blue-100 text-blue-700'
            };
        } else {
            // STANDARD LESSON: Updated to use Token System
            return {
                bg: 'bg-background border-l-4 border-border', // Clean look
                text: 'text-text',
                icon: '📚',
                badge: 'bg-surface border border-border text-muted'
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <header className="bg-surface shadow-sm border-b border-border">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => navigate(-1)}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border hover:bg-surface transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-text" />
                                </button>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                        <span className="text-white font-bold text-sm">NL</span>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-semibold text-text">NL Technologies Pvt.Ltd</h1>
                                        <p className="text-xs text-muted">Training Management System</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="w-full px-6 py-12 bg-background">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <Loader2 className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-blue-600 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-muted mb-2">Loading Training Modules...</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // === MODIFIED: Show "Create Days" screen if data is missing or empty ===
    if (error || !isDataReady) {
        return (
            <div className="min-h-screen bg-background">
                <header className="bg-surface shadow-sm border-b border-border">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => navigate(-1)}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-background border border-border hover:bg-surface transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-text" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="w-full px-6 py-12 bg-background">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center bg-surface p-8 rounded-2xl shadow-sm max-w-lg border border-border">
                            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                                <PlusCircle className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-text mb-2">Setup Required</h3>
                            <p className="text-muted mb-6">
                                No training days or modules found for Level 1. You need to configure the curriculum first.
                            </p>
                            <button 
                                onClick={() => navigate('/methodsettings?tab=Level1-settings')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center mx-auto shadow-lg shadow-blue-200"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Create Training Modules
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // ======================================================================

    const groupedSubtopics = groupSubtopicsByDay(subtopics);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-surface border-b border-border w-full">
                <div className="w-full px-6 py-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-4xl font-bold text-text">Basic DOJO Training</h1>
                        </div>
                    </div>
                    <div className='flex justify-end items-center w-full'>
                        <button
                            onClick={() => navigate("/level1/attendance")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex justify-end hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            Mark Attendance
                        </button>
                    </div>
                </div>
            </div>

            {/* Training Content */}
            <div className="w-full px-6 py-6 bg-background min-h-screen">
                <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-6">
                        <div className="space-y-12">
                            {Object.keys(groupedSubtopics)
                                .sort()
                                .map((dayName, dayIndex) => {
                                    const daySubtopics = groupedSubtopics[dayName];
                                    return (
                                        <div key={dayName} className="relative">
                                            <div className="flex items-center mb-6">
                                                <div className="flex-shrink-0 mr-8">
                                                    {/* Day Indicator - Kept gradient as brand accent */}
                                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                        <div className="text-center">
                                                            <div className="text-xl font-bold text-white">{dayIndex + 1}</div>
                                                            <div className="text-xs text-blue-100 font-medium">DAY</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h2 className="text-2xl font-bold text-text mb-2">{dayName}</h2>
                                                    <p className="text-muted">
                                                        {daySubtopics.length} training modules • 
                                                        {dayIndex === 0 ? ' Foundation concepts' : ' Advanced topics & assessment'}
                                                    </p>
                                                    <div className="w-20 h-1 bg-border rounded-full mt-2"></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-28">
                                                {daySubtopics.map((subtopic: SubTopic, index: number) => {
                                                    const style = getLessonStyle(subtopic.title);
                                                    return (
                                                        <div
                                                            key={subtopic.id}
                                                            className={`${style.bg} rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] group border-l-4`}
                                                            onClick={() => handleLessonClick(subtopic)}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-10 h-10 bg-surface border border-border rounded-lg flex items-center justify-center shadow-sm">
                                                                        <span className="text-xl">{style.icon}</span>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className={`text-base font-bold ${style.text} group-hover:opacity-80 transition-opacity`}>
                                                                            {subtopic.title}
                                                                        </h3>
                                                                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${style.badge} mt-1`}>
                                                                            Module {index + 1}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            
                                                            {subtopic.description && (
                                                                <p className="text-muted text-sm leading-relaxed">
                                                                    {subtopic.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Level1;