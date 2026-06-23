
// import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import {
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   BookOpen,
//   CirclePlay,
//   Trophy,
//   Paperclip,
//   FileText,
//   Link as LinkIcon,
//   Download,
//   GraduationCap,
//   ExternalLink,
//   FolderOpen,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';

// const API_URL = 'http://127.0.0.1:8000/lms';

// // --- Types ---

// interface Attachment {
//   id: number;
//   name: string;
//   file?: string;
//   url_link?: string;
//   type: 'file' | 'url';
//   created_at?: string;
// }

// interface Lesson {
//   id: number;
//   title: string;
//   duration: string;
//   completed: boolean;
//   sample?: boolean;
//   content: string;
//   videoUrl?: string;
//   order: number;
//   attachments?: Attachment[];
// }

// interface Test {
//   id: number;
//   title: string;
// }

// interface Course {
//   id: number;
//   title: string;
//   instructor_name: string;
//   level: string;
//   duration: string;
//   roadmap: Lesson[];
//   tests?: Test[];
// }

// interface LessonProgressData {
//   lesson: number;
//   completed: boolean;
// }

// const CourseLessonPage = () => {
//   const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const [course, setCourse] = useState<Course | null>(null);
//   const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
//   const [lessonLoading, setLessonLoading] = useState(false);

//   const [canMarkComplete, setCanMarkComplete] = useState(false);
//   const [videoProgress, setVideoProgress] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.7);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showControls, setShowControls] = useState(false);
  
//   const [textLessonStartTime, setTextLessonStartTime] = useState<number | null>(null);
//   const [textLessonTimeRemaining, setTextLessonTimeRemaining] = useState(10);
//   const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

//   // Toggle for description
//   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

//   const TEXT_LESSON_REQUIRED_TIME = 5;
//   const VIDEO_COMPLETION_THRESHOLD = 0.90;
  
//   const anonProgressKey = useMemo(() => `progress_course_${courseId}`, [courseId]);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchCourseAndProgress = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         const authData = localStorage.getItem("auth");
//         const token = authData ? JSON.parse(authData).accessToken : null;

//         if (!token) {
//             setError("You must be logged in to view this course.");
//             setLoading(false);
//             return;
//         }

//         const courseRes = await fetch(`${API_URL}/courses/${courseId}/`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         if (!courseRes.ok) throw new Error('Failed to fetch course');
//         const courseData: Course = await courseRes.json();

//         const progressRes = await fetch(`${API_URL}/progress/`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         if (isMounted) {
//             setCourse(courseData);

//             if (progressRes.ok) {
//                 const progressData = await progressRes.json();
//                 const completedIds = new Set<number>();
                
//                 if (progressData.lessons) {
//                     progressData.lessons.forEach((p: LessonProgressData) => {
//                         if (p.completed) completedIds.add(p.lesson);
//                     });
//                 } 
//                 else if (progressData.completed_lesson_ids) {
//                     progressData.completed_lesson_ids.forEach((id: number) => completedIds.add(id));
//                 }

//                 setCompletedLessons(completedIds);
//             }
//         }

//       } catch (err) {
//         if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load data');
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     if (courseId) fetchCourseAndProgress();

//     return () => { isMounted = false; };
//   }, [courseId]);

//   useEffect(() => {
//     if (!course) return;

//     const lid = parseInt(lessonId || '', 10);
//     const lesson = course.roadmap.find((l) => l.id === lid);

//     if (lesson) {
//         setLessonLoading(true);
//         setTimeout(() => {
//             setCurrentLesson(lesson);
//             setLessonLoading(false);
//         }, 100);
//     } else if (course.roadmap.length > 0 && !lessonId) {
//         const sorted = [...course.roadmap].sort((a, b) => a.order - b.order);
//         navigate(`/lms/courses/${courseId}/lesson/${sorted[0].id}`, { replace: true });
//     }
//   }, [course, lessonId, courseId, navigate]);

//   useEffect(() => {
//     if (!currentLesson) return;

//     setHasReachedThreshold(false);
//     setVideoProgress(0);
    
//     const isDone = completedLessons.has(currentLesson.id);
    
//     if (isDone) {
//         setCanMarkComplete(true);
//         setTextLessonStartTime(null);
//     } else {
//         setCanMarkComplete(false);
        
//         if (currentLesson.videoUrl) {
//             setTextLessonStartTime(null);
//             try {
//                 const raw = sessionStorage.getItem(anonProgressKey);
//                 if (raw) {
//                     const parsed = JSON.parse(raw);
//                     const p = parsed[String(currentLesson.id)];
//                     if (typeof p === 'number') setVideoProgress(p);
//                 }
//             } catch {}
//         } else {
//             setTextLessonStartTime(Date.now());
//             setTextLessonTimeRemaining(TEXT_LESSON_REQUIRED_TIME);
//         }
//     }
//   }, [currentLesson, completedLessons, anonProgressKey]);

//   useEffect(() => {
//     if (!currentLesson || currentLesson.videoUrl || canMarkComplete || !textLessonStartTime) return;

//     const interval = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - textLessonStartTime) / 1000);
//       const remaining = Math.max(0, TEXT_LESSON_REQUIRED_TIME - elapsed);
//       setTextLessonTimeRemaining(remaining);

//       if (remaining === 0) {
//         setCanMarkComplete(true);
//         clearInterval(interval);
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [currentLesson, textLessonStartTime, canMarkComplete]);

//   const onVideoTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
//     const video = e.currentTarget;
//     if (!video.duration) return;
    
//     const percent = (video.currentTime / video.duration) * 100;
//     setVideoProgress(percent);

//     try {
//         const raw = sessionStorage.getItem(anonProgressKey);
//         const parsed = raw ? JSON.parse(raw) : {};
//         parsed[String(currentLesson?.id)] = percent;
//         sessionStorage.setItem(anonProgressKey, JSON.stringify(parsed));
//     } catch {}

//     if (!canMarkComplete && !completedLessons.has(currentLesson!.id)) {
//         if (percent >= VIDEO_COMPLETION_THRESHOLD * 100) {
//             setCanMarkComplete(true);
//             setHasReachedThreshold(true);
//         }
//     }
//   }, [canMarkComplete, completedLessons, currentLesson, anonProgressKey]);

//   const markLessonAsCompleted = async (lessonIdToComplete: number) => {
//     const authData = localStorage.getItem("auth");
//     const token = authData ? JSON.parse(authData).accessToken : null;

//     if (!token) {
//         alert("Session expired. Please login again.");
//         return;
//     }

//     try {
//         setCompletedLessons(prev => new Set(prev).add(lessonIdToComplete));
        
//         const response = await fetch(`${API_URL}/mark-lesson-complete/`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ 
//                 course_id: courseId, 
//                 lesson_id: lessonIdToComplete 
//             })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             setCompletedLessons(prev => {
//                 const newSet = new Set(prev);
//                 newSet.delete(lessonIdToComplete);
//                 return newSet;
//             });
//             alert(data.error || "Failed to mark complete");
//         } 

//     } catch (err) {
//         console.error("Network error marking lesson complete");
//         setCompletedLessons(prev => {
//             const newSet = new Set(prev);
//             newSet.delete(lessonIdToComplete);
//             return newSet;
//         });
//     }
//   };

//   const handleNavigation = (direction: 'next' | 'prev') => {
//     if (!course || !currentLesson) return;
//     const sorted = [...course.roadmap].sort((a, b) => a.order - b.order);
//     const idx = sorted.findIndex(l => l.id === currentLesson.id);
    
//     if (direction === 'next' && idx < sorted.length - 1) {
//         navigate(`/lms/courses/${courseId}/lesson/${sorted[idx + 1].id}`);
//     } else if (direction === 'prev' && idx > 0) {
//         navigate(`/lms/courses/${courseId}/lesson/${sorted[idx - 1].id}`);
//     }
//   };

//   const isLessonDone = (id: number) => completedLessons.has(id);

//   const allLessonsDone = useMemo(() => {
//      if (!course || course.roadmap.length === 0) return false;
//      return course.roadmap.every(l => completedLessons.has(l.id));
//   }, [course, completedLessons]);

//   const finalExam = course?.tests && course.tests.length > 0 ? course.tests[0] : null;
//   const hasResources = currentLesson?.attachments && currentLesson.attachments.length > 0;

//   // Loading State
//   if (loading) return (
//     <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors">
//         <div className="flex flex-col items-center gap-4">
//             <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
//             <p className="text-gray-500 dark:text-slate-400 animate-pulse">Loading course...</p>
//         </div>
//     </div>
//   );

//   // Error State
//   if (error || !course) return (
//     <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors">
//         <div className="text-center max-w-md mx-auto p-8">
//             <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
//                 <span className="text-4xl">😕</span>
//             </div>
//             <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Something went wrong</h2>
//             <p className="text-gray-500 dark:text-slate-400 mb-8">{error || 'Course not found'}</p>
//             <button 
//                 onClick={() => navigate('/lms/courses')} 
//                 className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
//             >
//                 Back to Courses
//             </button>
//         </div>
//     </div>
//   );

//   const sortedLessons = [...course.roadmap].sort((a, b) => a.order - b.order);
//   const currentIdx = currentLesson ? sortedLessons.findIndex(l => l.id === currentLesson.id) : -1;
//   const progressPercent = Math.round((completedLessons.size / course.roadmap.length) * 100);

//   return (
//     // Main Container: dark:bg-slate-950 dark:text-white
//     <div className="flex h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      
//       {/* ============== LEFT SIDEBAR - Course Navigation ============== */}
//       {/* Sidebar: dark:bg-slate-900 dark:border-slate-800 */}
//       <aside className="w-[260px] flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors">
        
//         {/* Course Header */}
//         <div className="p-5 border-b border-gray-100 dark:border-slate-800">
//           <div className="flex items-start gap-3 mb-4">
//             {/* Icon Box: dark:shadow-none */}
//             <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-violet-200 dark:shadow-none">
//               <GraduationCap size={18} />
//             </div>
//             <div className="flex-1 min-w-0">
//               {/* Title: dark:text-white */}
//               <h1 className="font-bold text-sm leading-tight text-gray-900 dark:text-white line-clamp-2">
//                 {course.title}
//               </h1>
//               <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{course.instructor_name}</p>
//             </div>
//           </div>
          
//           {/* Progress Bar */}
//           <div className="flex items-center gap-3">
//             {/* Track: dark:bg-slate-700 */}
//             <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-700" 
//                 style={{ width: `${progressPercent}%` }}
//               />
//             </div>
//             <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{progressPercent}%</span>
//           </div>
//         </div>

//         {/* Lesson List */}
//         <div className="flex-1 overflow-y-auto p-3">
//             <div className="space-y-1">
//               {sortedLessons.map((lesson, idx) => {
//                   const active = currentLesson?.id === lesson.id;
//                   const done = isLessonDone(lesson.id);
                  
//                   return (
//                       <button
//                           key={lesson.id}
//                           onClick={() => navigate(`/lms/courses/${courseId}/lesson/${lesson.id}`)}
//                           className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
//                               active 
//                                 ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none' 
//                                 : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
//                           }`}
//                       >
//                           <div className="flex-shrink-0">
//                               {done ? (
//                                   <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
//                                     active ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30'
//                                   }`}>
//                                     <CheckCircle size={14} className={active ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'} />
//                                   </div>
//                               ) : (
//                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
//                                       active 
//                                         ? 'border-white/40 text-white' 
//                                         : 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500'
//                                   }`}>
//                                       {idx + 1}
//                                   </div>
//                               )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                               <p className={`text-xs font-medium truncate ${active ? 'text-white' : 'text-gray-700 dark:text-slate-300'}`}>
//                                 {lesson.title}
//                               </p>
//                           </div>
//                       </button>
//                   );
//               })}
//             </div>
//         </div>

//         {/* Final Exam Button */}
//         {allLessonsDone && finalExam && (
//             <div className="p-3 border-t border-gray-100 dark:border-slate-800">
//                 <button 
//                     onClick={() => navigate(`/lms/courses/${courseId}/test/${finalExam.id}`)}
//                     className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-[1.02] transition-all"
//                 >
//                     <Trophy size={16} /> Final Exam
//                 </button>
//             </div>
//         )}
//       </aside>


//       {/* ============== MAIN CONTENT AREA ============== */}
//       <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
//         {/* Loading Overlay */}
//         {lessonLoading && (
//             <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
//                 <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//         )}

//         {currentLesson ? (
//             <>
//                 {/* ===== Top Header ===== */}
//                 {/* Header: dark:bg-slate-900 dark:border-slate-800 */}
//                 <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
//                     <div className="flex items-center gap-4">
//                         <div>
//                             <div className="flex items-center gap-2 mb-0.5">
//                                 <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
//                                     Lesson {currentIdx + 1} / {sortedLessons.length}
//                                 </span>
//                                 {currentLesson.videoUrl && (
//                                     <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold flex items-center gap-1">
//                                         <Play size={8} fill="currentColor" /> VIDEO
//                                     </span>
//                                 )}
//                             </div>
//                             <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentLesson.title}</h2>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         {/* Navigation - dark:border-slate-700 */}
//                         <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
//                             <button 
//                                 onClick={() => handleNavigation('prev')}
//                                 disabled={currentIdx === 0}
//                                 className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border-r border-gray-200 dark:border-slate-700"
//                             >
//                                 <ChevronLeft size={18} />
//                             </button>
//                             <button 
//                                 onClick={() => handleNavigation('next')}
//                                 disabled={currentIdx === sortedLessons.length - 1}
//                                 className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//                             >
//                                 <ChevronRight size={18} />
//                             </button>
//                         </div>

//                         {!isLessonDone(currentLesson.id) ? (
//                             <>
//                                 {!canMarkComplete && (
//                                     <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
//                                         <Clock size={14} className="text-amber-500" />
//                                         <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
//                                             {currentLesson.videoUrl 
//                                                 ? 'Watch 90%' 
//                                                 : `${textLessonTimeRemaining}s`
//                                             }
//                                         </span>
//                                     </div>
//                                 )}

//                                 <button
//                                     onClick={() => markLessonAsCompleted(currentLesson.id)}
//                                     disabled={!canMarkComplete}
//                                     className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
//                                         canMarkComplete 
//                                           ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-400 hover:scale-105' 
//                                           : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
//                                     }`}
//                                 >
//                                     <CheckCircle size={16} />
//                                     Complete
//                                 </button>
//                             </>
//                         ) : (
//                             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
//                                 <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
//                                 <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Done</span>
//                             </div>
//                         )}
//                     </div>
//                 </header>

//                 {/* ===== Main Content Split ===== */}
//                 <div className="flex-1 flex overflow-hidden">
                    
//                     {/* LEFT: Video + Collapsible Description */}
//                     <div className="flex-1 overflow-y-auto p-6">
//                         <div className="space-y-4">
                            
//                             {/* Video Player */}
//                             {currentLesson.videoUrl && (
//                                 <section 
//                                     className="relative rounded-xl overflow-hidden bg-gray-900 shadow-lg ring-1 ring-gray-200 dark:ring-slate-700 group"
//                                     onMouseEnter={() => setShowControls(true)}
//                                     onMouseLeave={() => setShowControls(false)}
//                                 >
//                                     <video
//                                         ref={videoRef}
//                                         src={currentLesson.videoUrl}
//                                         className="w-full aspect-video"
//                                         onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()}
//                                         onTimeUpdate={onVideoTimeUpdate}
//                                         onPlay={() => setIsPlaying(true)}
//                                         onPause={() => setIsPlaying(false)}
//                                         onLoadedMetadata={() => {
//                                             if (videoRef.current) {
//                                                 videoRef.current.volume = volume;
//                                                 if (videoProgress > 0) {
//                                                     videoRef.current.currentTime = (videoProgress / 100) * videoRef.current.duration;
//                                                 }
//                                             }
//                                         }}
//                                     />
                                    
//                                     {!isPlaying && (
//                                         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                                             <button 
//                                                 onClick={() => videoRef.current?.play()}
//                                                 className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
//                                             >
//                                                 <Play size={28} fill="white" className="text-white ml-1" />
//                                             </button>
//                                         </div>
//                                     )}
                                    
//                                     <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-10 transition-all duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
//                                         <div 
//                                             className="h-1 bg-white/20 rounded-full cursor-pointer mb-3 relative group/bar"
//                                             onClick={(e) => {
//                                                 if (!videoRef.current) return;
//                                                 const rect = e.currentTarget.getBoundingClientRect();
//                                                 const pos = (e.clientX - rect.left) / rect.width;
//                                                 videoRef.current.currentTime = pos * videoRef.current.duration;
//                                             }}
//                                         >
//                                             <div className="absolute h-full bg-violet-500 rounded-full" style={{ width: `${videoProgress}%` }}></div>
//                                         </div>

//                                         <div className="flex items-center justify-between text-white">
//                                             <div className="flex items-center gap-3">
//                                                 <button 
//                                                     onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} 
//                                                     className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
//                                                 >
//                                                     {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" className="ml-0.5"/>}
//                                                 </button>
                                                
//                                                 <div className="flex items-center gap-2 group/vol">
//                                                     <button 
//                                                         onClick={() => {
//                                                             const newMute = !isMuted;
//                                                             setIsMuted(newMute);
//                                                             if(videoRef.current) videoRef.current.muted = newMute;
//                                                         }}
//                                                         className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
//                                                     >
//                                                         {isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>}
//                                                     </button>
//                                                     <input 
//                                                         type="range" min="0" max="1" step="0.1" 
//                                                         value={isMuted ? 0 : volume}
//                                                         onChange={(e) => {
//                                                             const val = parseFloat(e.target.value);
//                                                             setVolume(val);
//                                                             setIsMuted(val === 0);
//                                                             if(videoRef.current) {
//                                                                 videoRef.current.volume = val;
//                                                                 videoRef.current.muted = val === 0;
//                                                             }
//                                                         }}
//                                                         className="w-0 overflow-hidden group-hover/vol:w-16 transition-all h-1 accent-violet-500"
//                                                     />
//                                                 </div>
//                                             </div>
                                            
//                                             <button 
//                                                 onClick={() => {
//                                                     if(!document.fullscreenElement) videoRef.current?.requestFullscreen();
//                                                     else document.exitFullscreen();
//                                                 }}
//                                                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
//                                             >
//                                                 <Maximize size={14} />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </section>
//                             )}

//                             {/* Collapsible Description */}
//                             {/* Card: dark:bg-slate-900 dark:border-slate-800 */}
//                             <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
//                                 <button 
//                                     onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
//                                     // Button: dark:bg-slate-800 dark:hover:bg-slate-700
//                                     className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
//                                             <BookOpen className="text-violet-600 dark:text-violet-400" size={16}/>
//                                         </div>
//                                         <span className="font-semibold text-gray-900 dark:text-white">Description</span>
//                                     </div>
//                                     {isDescriptionExpanded ? (
//                                         <ChevronUp size={18} className="text-gray-400 dark:text-slate-500" />
//                                     ) : (
//                                         <ChevronDown size={18} className="text-gray-400 dark:text-slate-500" />
//                                     )}
//                                 </button>
                                
//                                 {isDescriptionExpanded && (
//                                     <div className="p-5 max-h-[300px] overflow-y-auto">
//                                         {/* Prose: dark:text-slate-300 */}
//                                         <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
//                                             {currentLesson.content}
//                                         </div>
//                                     </div>
//                                 )}
//                             </section>
//                         </div>
//                     </div>

//                     {/* RIGHT: Resources Panel - WIDER */}
//                     {/* Panel: dark:bg-slate-900 dark:border-slate-800 */}
//                     <aside className="w-[400px] border-l border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-hidden transition-colors">
                        
//                         {/* Resources Header */}
//                         {/* Header: dark:from-slate-900 dark:to-slate-800 dark:border-slate-800 */}
//                         <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
//                                     <FolderOpen className="text-amber-600 dark:text-amber-400" size={20} />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-gray-900 dark:text-white">Lesson Resources</h3>
//                                     <p className="text-xs text-gray-500 dark:text-slate-400">
//                                         {hasResources 
//                                             ? `${currentLesson.attachments!.length} item${currentLesson.attachments!.length !== 1 ? 's' : ''} available`
//                                             : 'No files attached'
//                                         }
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Resources List */}
//                         <div className="flex-1 overflow-y-auto p-5">
//                             {hasResources ? (
//                                 <div className="space-y-3">
//                                     {currentLesson.attachments!.map((att, index) => {
//                                         const href = att.file || att.url_link || '#';
//                                         const isFile = att.type === 'file' || att.file;
                                        
//                                         return (
//                                             <a 
//                                                 key={index}
//                                                 href={href}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 // Resource Card: dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700
//                                                 className="group block p-4 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md rounded-xl transition-all duration-200"
//                                             >
//                                                 <div className="flex items-start gap-4">
//                                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
//                                                         isFile 
//                                                             ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
//                                                             : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                                                     }`}>
//                                                         {isFile ? <FileText size={22} /> : <LinkIcon size={22} />}
//                                                     </div>
                                                    
//                                                     <div className="flex-1 min-w-0">
//                                                         <p className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
//                                                             {att.name || 'Untitled Resource'}
//                                                         </p>
//                                                         <p className="text-xs text-gray-400 dark:text-slate-500">
//                                                             {isFile ? 'Click to download' : 'Opens in new tab'}
//                                                         </p>
//                                                     </div>
                                                    
//                                                     {/* Icon Button: dark:bg-slate-700 dark:border-slate-600 */}
//                                                     <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:border-violet-300 dark:group-hover:border-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-all flex-shrink-0">
//                                                         {isFile ? <Download size={16} /> : <ExternalLink size={16} />}
//                                                     </div>
//                                                 </div>
                                                
//                                                 {/* Resource Type Badge */}
//                                                 <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
//                                                     <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
//                                                         isFile 
//                                                             ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
//                                                             : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
//                                                     }`}>
//                                                         {isFile ? 'Downloadable File' : 'External Link'}
//                                                     </span>
//                                                     <span className="text-xs text-gray-400 dark:text-slate-500">
//                                                         Resource {index + 1}
//                                                     </span>
//                                                 </div>
//                                             </a>
//                                         );
//                                     })}
//                                 </div>
//                             ) : (
//                                 <div className="flex flex-col items-center justify-center h-full text-center py-16">
//                                     <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-5">
//                                         <Paperclip size={36} className="text-gray-300 dark:text-slate-600" />
//                                     </div>
//                                     <p className="text-gray-600 dark:text-slate-400 font-semibold mb-1">No Resources</p>
//                                     <p className="text-gray-400 dark:text-slate-500 text-sm max-w-[200px]">
//                                         This lesson doesn't have any attached materials
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Resources Footer - Tips */}
//                         {hasResources && (
//                             <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
//                                 <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
//                                     💡 Tip: Download resources before starting the lesson
//                                 </p>
//                             </div>
//                         )}
//                     </aside>
//                 </div>
//             </>
//         ) : (
//             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
//                 <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
//                     <CirclePlay size={48} className="text-gray-300 dark:text-slate-600"/>
//                 </div>
//                 <p className="text-lg text-gray-500 dark:text-slate-400">Select a lesson to begin</p>
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseLessonPage;


import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
  CirclePlay,
  Trophy,
  Paperclip,
  FileText,
  Link as LinkIcon,
  Download,
  GraduationCap,
  ExternalLink,
  FolderOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000/lms';

// --- Types ---

interface Attachment {
  id: number;
  name: string;
  file?: string;
  url_link?: string;
  type: 'file' | 'url';
  created_at?: string;
}

interface LessonVideo {
  id: number;
  name: string;
  url: string;
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  sample?: boolean;
  content: string;
  
  // === UPDATED: Support multiple videos ===
  videos: LessonVideo[]; 
  
  // Legacy support
  videoUrl?: string; 
  
  order: number;
  attachments?: Attachment[];
}

interface Test {
  id: number;
  title: string;
}

interface Course {
  id: number;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  roadmap: Lesson[];
  tests?: Test[];
}

interface LessonProgressData {
  lesson: number;
  completed: boolean;
}

const CourseLessonPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const [textLessonStartTime, setTextLessonStartTime] = useState<number | null>(null);
  const [textLessonTimeRemaining, setTextLessonTimeRemaining] = useState(10);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);

  // Toggle for description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  // State to switch active video if multiple
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const TEXT_LESSON_REQUIRED_TIME = 5;
  const VIDEO_COMPLETION_THRESHOLD = 0.90;
  
  const anonProgressKey = useMemo(() => `progress_course_${courseId}`, [courseId]);

  // === HELPER: Get Current Video URL ===
  const getCurrentVideoUrl = (lesson: Lesson | null, index: number) => {
    if (!lesson) return null;
    if (lesson.videos && lesson.videos.length > 0) {
        // Return selected video or first one
        const vid = lesson.videos[index] || lesson.videos[0];
        return vid.url;
    }
    return lesson.videoUrl;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCourseAndProgress = async () => {
      try {
        setLoading(true);
        setError('');
        
        const authData = localStorage.getItem("auth");
        const token = authData ? JSON.parse(authData).accessToken : null;

        if (!token) {
            setError("You must be logged in to view this course.");
            setLoading(false);
            return;
        }

        const courseRes = await fetch(`${API_URL}/courses/${courseId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!courseRes.ok) throw new Error('Failed to fetch course');
        const courseData: Course = await courseRes.json();

        const progressRes = await fetch(`${API_URL}/progress/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (isMounted) {
            setCourse(courseData);

            if (progressRes.ok) {
                const progressData = await progressRes.json();
                const completedIds = new Set<number>();
                
                if (progressData.lessons) {
                    progressData.lessons.forEach((p: LessonProgressData) => {
                        if (p.completed) completedIds.add(p.lesson);
                    });
                } 
                else if (progressData.completed_lesson_ids) {
                    progressData.completed_lesson_ids.forEach((id: number) => completedIds.add(id));
                }

                setCompletedLessons(completedIds);
            }
        }

      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (courseId) fetchCourseAndProgress();

    return () => { isMounted = false; };
  }, [courseId]);

  useEffect(() => {
    if (!course) return;

    const lid = parseInt(lessonId || '', 10);
    const lesson = course.roadmap.find((l) => l.id === lid);

    if (lesson) {
        setLessonLoading(true);
        setTimeout(() => {
            setCurrentLesson(lesson);
            setActiveVideoIndex(0); // Reset video selection on lesson change
            setLessonLoading(false);
        }, 100);
    } else if (course.roadmap.length > 0 && !lessonId) {
        const sorted = [...course.roadmap].sort((a, b) => a.order - b.order);
        navigate(`/lms/courses/${courseId}/lesson/${sorted[0].id}`, { replace: true });
    }
  }, [course, lessonId, courseId, navigate]);

  const activeUrl = getCurrentVideoUrl(currentLesson, activeVideoIndex);

  useEffect(() => {
    if (!currentLesson) return;

    setHasReachedThreshold(false);
    setVideoProgress(0);
    
    const isDone = completedLessons.has(currentLesson.id);
    
    if (isDone) {
        setCanMarkComplete(true);
        setTextLessonStartTime(null);
    } else {
        setCanMarkComplete(false);
        
        if (activeUrl) {
            setTextLessonStartTime(null);
            try {
                const raw = sessionStorage.getItem(anonProgressKey);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    // Key can include video index to track progress per video if needed
                    const p = parsed[`${currentLesson.id}_${activeVideoIndex}`];
                    if (typeof p === 'number') setVideoProgress(p);
                }
            } catch {}
        } else {
            setTextLessonStartTime(Date.now());
            setTextLessonTimeRemaining(TEXT_LESSON_REQUIRED_TIME);
        }
    }
  }, [currentLesson, completedLessons, anonProgressKey, activeUrl, activeVideoIndex]);

  useEffect(() => {
    if (!currentLesson || activeUrl || canMarkComplete || !textLessonStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - textLessonStartTime) / 1000);
      const remaining = Math.max(0, TEXT_LESSON_REQUIRED_TIME - elapsed);
      setTextLessonTimeRemaining(remaining);

      if (remaining === 0) {
        setCanMarkComplete(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentLesson, textLessonStartTime, canMarkComplete, activeUrl]);

  const onVideoTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.duration) return;
    
    const percent = (video.currentTime / video.duration) * 100;
    setVideoProgress(percent);

    try {
        const raw = sessionStorage.getItem(anonProgressKey);
        const parsed = raw ? JSON.parse(raw) : {};
        parsed[`${currentLesson?.id}_${activeVideoIndex}`] = percent;
        sessionStorage.setItem(anonProgressKey, JSON.stringify(parsed));
    } catch {}

    if (!canMarkComplete && !completedLessons.has(currentLesson!.id)) {
        if (percent >= VIDEO_COMPLETION_THRESHOLD * 100) {
            setCanMarkComplete(true);
            setHasReachedThreshold(true);
        }
    }
  }, [canMarkComplete, completedLessons, currentLesson, anonProgressKey, activeVideoIndex]);

  const markLessonAsCompleted = async (lessonIdToComplete: number) => {
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).accessToken : null;

    if (!token) {
        alert("Session expired. Please login again.");
        return;
    }

    try {
        setCompletedLessons(prev => new Set(prev).add(lessonIdToComplete));
        
        const response = await fetch(`${API_URL}/mark-lesson-complete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                course_id: courseId, 
                lesson_id: lessonIdToComplete 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setCompletedLessons(prev => {
                const newSet = new Set(prev);
                newSet.delete(lessonIdToComplete);
                return newSet;
            });
            alert(data.error || "Failed to mark complete");
        } 

    } catch (err) {
        console.error("Network error marking lesson complete");
        setCompletedLessons(prev => {
            const newSet = new Set(prev);
            newSet.delete(lessonIdToComplete);
            return newSet;
        });
    }
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (!course || !currentLesson) return;
    const sorted = [...course.roadmap].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(l => l.id === currentLesson.id);
    
    if (direction === 'next' && idx < sorted.length - 1) {
        navigate(`/lms/courses/${courseId}/lesson/${sorted[idx + 1].id}`);
    } else if (direction === 'prev' && idx > 0) {
        navigate(`/lms/courses/${courseId}/lesson/${sorted[idx - 1].id}`);
    }
  };

  const isLessonDone = (id: number) => completedLessons.has(id);

  const allLessonsDone = useMemo(() => {
     if (!course || course.roadmap.length === 0) return false;
     return course.roadmap.every(l => completedLessons.has(l.id));
  }, [course, completedLessons]);

  const finalExam = course?.tests && course.tests.length > 0 ? course.tests[0] : null;
  const hasResources = currentLesson?.attachments && currentLesson.attachments.length > 0;

  // Loading State
  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-slate-400 animate-pulse">Loading course...</p>
        </div>
    </div>
  );

  // Error State
  if (error || !course) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors">
        <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Something went wrong</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8">{error || 'Course not found'}</p>
            <button 
                onClick={() => navigate('/lms/courses')} 
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
            >
                Back to Courses
            </button>
        </div>
    </div>
  );

  const sortedLessons = [...course.roadmap].sort((a, b) => a.order - b.order);
  const currentIdx = currentLesson ? sortedLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const progressPercent = Math.round((completedLessons.size / course.roadmap.length) * 100);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* ============== LEFT SIDEBAR ============== */}
      <aside className="w-[260px] flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-colors">
        <div className="p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-violet-200 dark:shadow-none">
              <GraduationCap size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-sm leading-tight text-gray-900 dark:text-white line-clamp-2">
                {course.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{course.instructor_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-700" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{progressPercent}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {sortedLessons.map((lesson, idx) => {
                  const active = currentLesson?.id === lesson.id;
                  const done = isLessonDone(lesson.id);
                  
                  return (
                      <button
                          key={lesson.id}
                          onClick={() => navigate(`/lms/courses/${courseId}/lesson/${lesson.id}`)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              active 
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-none' 
                                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                      >
                          <div className="flex-shrink-0">
                              {done ? (
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    active ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-900/30'
                                  }`}>
                                    <CheckCircle size={14} className={active ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'} />
                                  </div>
                              ) : (
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                                      active 
                                        ? 'border-white/40 text-white' 
                                        : 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500'
                                  }`}>
                                      {idx + 1}
                                  </div>
                              )}
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${active ? 'text-white' : 'text-gray-700 dark:text-slate-300'}`}>
                                {lesson.title}
                              </p>
                          </div>
                      </button>
                  );
              })}
            </div>
        </div>

        {allLessonsDone && finalExam && (
            <div className="p-3 border-t border-gray-100 dark:border-slate-800">
                <button 
                    onClick={() => navigate(`/lms/courses/${courseId}/test/${finalExam.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-[1.02] transition-all"
                >
                    <Trophy size={16} /> Final Exam
                </button>
            </div>
        )}
      </aside>

      {/* ============== MAIN CONTENT ============== */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        {/* Loading Overlay */}
        {lessonLoading && (
            <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {currentLesson ? (
            <>
                {/* Header */}
                <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                                    Lesson {currentIdx + 1} / {sortedLessons.length}
                                </span>
                                {activeUrl && (
                                    <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold flex items-center gap-1">
                                        <Play size={8} fill="currentColor" /> VIDEO
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentLesson.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                            <button 
                                onClick={() => handleNavigation('prev')}
                                disabled={currentIdx === 0}
                                className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border-r border-gray-200 dark:border-slate-700"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                onClick={() => handleNavigation('next')}
                                disabled={currentIdx === sortedLessons.length - 1}
                                className="px-3 py-2 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {!isLessonDone(currentLesson.id) ? (
                            <>
                                {!canMarkComplete && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                        <Clock size={14} className="text-amber-500" />
                                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                                            {activeUrl 
                                                ? 'Watch 90%' 
                                                : `${textLessonTimeRemaining}s`
                                            }
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={() => markLessonAsCompleted(currentLesson.id)}
                                    disabled={!canMarkComplete}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                        canMarkComplete 
                                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-400 hover:scale-105' 
                                          : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                                    }`}
                                >
                                    <CheckCircle size={16} />
                                    Complete
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
                                <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Done</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    
                    {/* LEFT CONTENT */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-4">
                            
                            {/* VIDEO PLAYER */}
                            {activeUrl && (
                                <section 
                                    className="relative rounded-xl overflow-hidden bg-gray-900 shadow-lg ring-1 ring-gray-200 dark:ring-slate-700 group"
                                    onMouseEnter={() => setShowControls(true)}
                                    onMouseLeave={() => setShowControls(false)}
                                >
                                    <video
                                        ref={videoRef}
                                        src={activeUrl}
                                        className="w-full aspect-video"
                                        onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()}
                                        onTimeUpdate={onVideoTimeUpdate}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onLoadedMetadata={() => {
                                            if (videoRef.current) {
                                                videoRef.current.volume = volume;
                                                if (videoProgress > 0) {
                                                    videoRef.current.currentTime = (videoProgress / 100) * videoRef.current.duration;
                                                }
                                            }
                                        }}
                                    />
                                    
                                    {!isPlaying && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <button 
                                                onClick={() => videoRef.current?.play()}
                                                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
                                            >
                                                <Play size={28} fill="white" className="text-white ml-1" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-10 transition-all duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                                        <div 
                                            className="h-1 bg-white/20 rounded-full cursor-pointer mb-3 relative group/bar"
                                            onClick={(e) => {
                                                if (!videoRef.current) return;
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const pos = (e.clientX - rect.left) / rect.width;
                                                videoRef.current.currentTime = pos * videoRef.current.duration;
                                            }}
                                        >
                                            <div className="absolute h-full bg-violet-500 rounded-full" style={{ width: `${videoProgress}%` }}></div>
                                        </div>

                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} 
                                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                                                >
                                                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" className="ml-0.5"/>}
                                                </button>
                                                
                                                <div className="flex items-center gap-2 group/vol">
                                                    <button 
                                                        onClick={() => {
                                                            const newMute = !isMuted;
                                                            setIsMuted(newMute);
                                                            if(videoRef.current) videoRef.current.muted = newMute;
                                                        }}
                                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                                                    >
                                                        {isMuted ? <VolumeX size={14}/> : <Volume2 size={14}/>}
                                                    </button>
                                                    <input 
                                                        type="range" min="0" max="1" step="0.1" 
                                                        value={isMuted ? 0 : volume}
                                                        onChange={(e) => {
                                                            const val = parseFloat(e.target.value);
                                                            setVolume(val);
                                                            setIsMuted(val === 0);
                                                            if(videoRef.current) {
                                                                videoRef.current.volume = val;
                                                                videoRef.current.muted = val === 0;
                                                            }
                                                        }}
                                                        className="w-0 overflow-hidden group-hover/vol:w-16 transition-all h-1 accent-violet-500"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={() => {
                                                    if(!document.fullscreenElement) videoRef.current?.requestFullscreen();
                                                    else document.exitFullscreen();
                                                }}
                                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                                            >
                                                <Maximize size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* PLAYLIST FOR MULTIPLE VIDEOS */}
                            {currentLesson.videos && currentLesson.videos.length > 1 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">In this lesson:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {currentLesson.videos.map((vid, idx) => (
                                            <button
                                                key={vid.id || idx}
                                                onClick={() => setActiveVideoIndex(idx)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                                    activeVideoIndex === idx
                                                        ? 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800'
                                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    activeVideoIndex === idx 
                                                        ? 'bg-violet-500 text-white' 
                                                        : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                                                }`}>
                                                    {activeVideoIndex === idx ? <Play size={16} fill="white"/> : <Play size={16} />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-semibold truncate ${
                                                        activeVideoIndex === idx ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {vid.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">Video {idx + 1}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* DESCRIPTION */}
                            <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
                                <button 
                                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                                            <BookOpen className="text-violet-600 dark:text-violet-400" size={16}/>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">Description</span>
                                    </div>
                                    {isDescriptionExpanded ? (
                                        <ChevronUp size={18} className="text-gray-400 dark:text-slate-500" />
                                    ) : (
                                        <ChevronDown size={18} className="text-gray-400 dark:text-slate-500" />
                                    )}
                                </button>
                                
                                {isDescriptionExpanded && (
                                    <div className="p-5 max-h-[300px] overflow-y-auto">
                                        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {currentLesson.content}
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>

                    {/* RIGHT: Resources Panel */}
                    <aside className="w-[400px] border-l border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col overflow-hidden transition-colors">
                        <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                                    <FolderOpen className="text-amber-600 dark:text-amber-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Lesson Resources</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                        {hasResources 
                                            ? `${currentLesson.attachments!.length} item${currentLesson.attachments!.length !== 1 ? 's' : ''} available`
                                            : 'No files attached'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {hasResources ? (
                                <div className="space-y-3">
                                    {currentLesson.attachments!.map((att, index) => {
                                        const href = att.file || att.url_link || '#';
                                        const isFile = att.type === 'file' || att.file;
                                        
                                        return (
                                            <a 
                                                key={index}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block p-4 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-md rounded-xl transition-all duration-200"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                                                        isFile 
                                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                                                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                        {isFile ? <FileText size={22} /> : <LinkIcon size={22} />}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-1">
                                                            {att.name || 'Untitled Resource'}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-slate-500">
                                                            {isFile ? 'Click to download' : 'Opens in new tab'}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:border-violet-300 dark:group-hover:border-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 transition-all flex-shrink-0">
                                                        {isFile ? <Download size={16} /> : <ExternalLink size={16} />}
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                                        <Paperclip size={36} className="text-gray-300 dark:text-slate-600" />
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-400 font-semibold mb-1">No Resources</p>
                                    <p className="text-gray-400 dark:text-slate-500 text-sm max-w-[200px]">
                                        This lesson doesn't have any attached materials
                                    </p>
                                </div>
                            )}
                        </div>

                        {hasResources && (
                            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                                <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
                                    💡 Tip: Download resources before starting the lesson
                                </p>
                            </div>
                        )}
                    </aside>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                    <CirclePlay size={48} className="text-gray-300 dark:text-slate-600"/>
                </div>
                <p className="text-lg text-gray-500 dark:text-slate-400">Select a lesson to begin</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessonPage;