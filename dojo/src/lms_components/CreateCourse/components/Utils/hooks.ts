// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import type { Course, Lesson, CourseStats, TabType, LessonTabType, Test, MCQQuestion } from './types';
// // import { createNewCourseTemplate, createNewLesson, generateLessonId } from './utils';
// // import { fetchCourse, saveCourse, refreshCourseData, uploadLessonAttachments } from './api';

// // export const useCourseManager = (courseId?: number | null) => {
// //   const [course, setCourse] = useState<Course | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [activeTab, setActiveTab] = useState<TabType>('basic');
// //   const [selectedLesson, setSelectedLesson] = useState<number>(0);
// //   const [editingLesson, setEditingLesson] = useState<number | null>(null);
// //   const [isNewCourse, setIsNewCourse] = useState(!courseId);
// //   const [lessonTab, setLessonTab] = useState<LessonTabType>('content');

// //   // Test-related state
// //   const [tests, setTests] = useState<Test[]>([]);
// //   const [selectedTest, setSelectedTest] = useState<number | null>(null);
// //   const [editingTest, setEditingTest] = useState<number | null>(null);

// //   const courseRef = useRef<Course | null>(null);
// //   const testsRef = useRef<Test[]>([]);

// //   useEffect(() => {
// //     courseRef.current = course;
// //   }, [course]);

// //   useEffect(() => {
// //     testsRef.current = tests;
// //   }, [tests]);

// //   // Initialize
// //   useEffect(() => {
// //     const initializeCourse = async () => {
// //       try {
// //         if (courseId) {
// //           const courseData = await fetchCourse(courseId);
// //           setCourse(courseData);
// //           setTests(courseData.tests || []);
// //           if (courseData.roadmap?.[0]?.id) setSelectedLesson(courseData.roadmap[0].id);
// //         } else {
// //           const newCourse = createNewCourseTemplate();
// //           setCourse(newCourse);
// //           setTests([]);
// //           setIsNewCourse(true);
// //         }
// //       } catch (error) {
// //         setError('Failed to initialize course');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     initializeCourse();
// //   }, [courseId]);

// //   // Reorder
// //   const handleReorder = (reorderedItems: any[]) => {
// //     const reorderedLessons: Lesson[] = [];
// //     const reorderedTests: Test[] = [];

// //     reorderedItems.forEach(item => {
// //       if (item.type === 'lesson' && item.raw) {
// //         reorderedLessons.push({ ...item.raw, order: item.order });
// //       } else if (item.type === 'test' && item.raw) {
// //         reorderedTests.push({ ...item.raw, order: item.order });
// //       }
// //     });

// //     setCourse(prev => prev ? { ...prev, roadmap: reorderedLessons } : null);
// //     setTests(reorderedTests);
// //   };

// //   // Attachments
// //   const addAttachment = (lessonId: number, file: File | null, url: string = '') => {
// //     if (!course) return;
// //     setCourse(prev => {
// //       if (!prev) return null;
// //       const updatedRoadmap = prev.roadmap.map(lesson => {
// //         if (lesson.id === lessonId) {
// //           const newAtt: any = {
// //             name: file ? file.name : url,
// //             type: file ? 'file' : 'url',
// //             file: file || undefined,
// //             url_link: url || undefined
// //           };
// //           return { ...lesson, attachments: [...(lesson.attachments || []), newAtt] };
// //         }
// //         return lesson;
// //       });
// //       return { ...prev, roadmap: updatedRoadmap };
// //     });
// //   };

// //   const removeAttachment = (lessonId: number, index: number) => {
// //     if (!course) return;
// //     setCourse(prev => {
// //       if (!prev) return null;
// //       const updatedRoadmap = prev.roadmap.map(lesson => {
// //         if (lesson.id === lessonId) {
// //           const newAtts = [...(lesson.attachments || [])];
// //           newAtts.splice(index, 1);
// //           return { ...lesson, attachments: newAtts };
// //         }
// //         return lesson;
// //       });
// //       return { ...prev, roadmap: updatedRoadmap };
// //     });
// //   };

// //   // Save Course
// //   const handleSaveCourse = useCallback(async () => {
// //   const currentCourse = courseRef.current;
// //   if (!currentCourse) return;

// //   try {
// //     const result = await saveCourse({ ...currentCourse, tests: testsRef.current }, isNewCourse);

// //     if (result && result.roadmap) {
// //       // Loop through the lessons the server just sent back
// //       for (let i = 0; i < result.roadmap.length; i++) {
// //         const savedLesson = result.roadmap[i];
        
// //         // Match the local lesson by its index/order to find the physical files
// //         const localLesson = currentCourse.roadmap[i];

// //         if (localLesson?.attachments) {
// //           const pending = localLesson.attachments.filter(a => !a.id || a.file);
// //           if (pending.length > 0) {
// //             // This now calls the updated api.ts with the token!
// //             await uploadLessonAttachments(savedLesson.id, pending);
// //           }
// //         }
// //       }
// //     }

// //     alert('Course and materials saved successfully!');
// //     const refreshed = await refreshCourseData(result.id);
// //     setCourse(refreshed);
// //     setTests(refreshed.tests || []);
// //     setIsNewCourse(false);
// //   } catch (error) {
// //     console.error(error);
// //     alert('Failed to save course.');
// //   }
// // }, [isNewCourse]);

// //   // Lessons
// //   const addLesson = () => {
// //     if (!course) return;
// //     const newId = generateLessonId(course.roadmap, isNewCourse);
// //     const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
// //     const newLesson = createNewLesson(newId, maxOrder);
// //     setCourse(prev => prev ? { ...prev, roadmap: [...prev.roadmap, newLesson] } : null);
// //     setSelectedLesson(newId);
// //     setEditingLesson(newId);
// //   };

// //   const updateLesson = (lessonId: number, field: keyof Lesson, value: any) => {
// //     setCourse(prev => {
// //       if (!prev) return null;
// //       const updatedRoadmap = prev.roadmap.map(l => l.id === lessonId ? { ...l, [field]: value } : l);
// //       return { ...prev, roadmap: updatedRoadmap };
// //     });
// //   };

// //   const deleteLesson = async (lessonId: number) => {
// //     if (!window.confirm("Delete this lesson?")) return;
// //     setCourse(prev => prev ? { ...prev, roadmap: prev.roadmap.filter(l => l.id !== lessonId) } : null);
// //   };

// //   const saveLesson = () => setEditingLesson(null);

// //   // Tests
// //   const addTest = () => {
// //     if (!course) return;
// //     const tempId = -Date.now();
// //     const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
// //     const newTest: Test = { id: tempId, title: 'New Test', order: maxOrder, questions: [] };
// //     setTests(prev => [...prev, newTest]);
// //     setSelectedTest(tempId);
// //     setEditingTest(tempId);
// //   };

// //   const updateTest = (id: number, p: Partial<Test>) => setTests(prev => prev.map(t => t.id === id ? { ...t, ...p } : t));
  
// //   const updateTestQuestion = (tid: number, qid: number | string, f: string, v: any) => {
// //     setTests(prev => prev.map(t => t.id !== tid ? t : {
// //       ...t, questions: t.questions.map(q => String(q.id) === String(qid) ? (f === 'options' ? { ...q, options: v } : { ...q, question: v, question_text: v }) : q)
// //     }));
// //   };

// //   const deleteTest = (id: number) => {
// //     if (window.confirm("Delete test?")) {
// //       setTests(prev => prev.filter(t => t.id !== id));
// //       if (selectedTest === id) setSelectedTest(null);
// //       if (editingTest === id) setEditingTest(null);
// //     }
// //   };

// //   const saveTest = (testId?: number) => setEditingTest(null);

// //   // Info
// //   const updateBasicInfo = (f: string, v: any) => setCourse(prev => prev ? { ...prev, [f]: v } : null);
// //   const updateStats = (f: keyof CourseStats, v: any) => setCourse(prev => prev ? { ...prev, stats: { ...prev.stats, [f]: v } } : null);
// //   const updateTags = (tags: string) => setCourse(prev => prev ? { ...prev, tags: tags.split(',').filter(t => t.trim()) } : null);
// //   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const f = e.target.files?.[0];
// //     if (f && course) setCourse({ ...course, photo: f, photoUrl: URL.createObjectURL(f) });
// //   };
// //   const removePhoto = () => course && setCourse({ ...course, photo: null, photoUrl: '' });
// //   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
// //     const f = e.target.files?.[0];
// //     if (f && course) setCourse({ ...course, roadmap: course.roadmap.map(l => l.id === id ? { ...l, video: f, videoUrl: URL.createObjectURL(f) } : l) });
// //   };
// //   const removeVideo = (id: number) => {
// //     if (course) setCourse({ ...course, roadmap: course.roadmap.map(l => l.id === id ? { ...l, video: null, videoUrl: '' } : l) });
// //   };
  
// //   const getCurrentLesson = () => course?.roadmap.find(l => l.id === selectedLesson) || null;

// //   return {
// //     course, loading, error, activeTab, selectedLesson, editingLesson, isNewCourse, lessonTab,
// //     tests, selectedTest, editingTest,
// //     setActiveTab, setSelectedLesson, setEditingLesson, setLessonTab,
// //     updateBasicInfo, updateStats, updateTags, handlePhotoUpload, removePhoto,
// //     handleVideoUpload, removeVideo, addLesson, updateLesson, deleteLesson, getCurrentLesson, 
// //     // Test Actions
// //     addTest, updateTest, updateTestQuestion, deleteTest, setSelectedTest, setEditingTest, 
// //     saveTest, // FIXED: Return function directly
// //     saveLesson, // FIXED: Return function directly
// //     handleSaveCourse, handleReorder,
// //     addAttachment, removeAttachment
// //   };
// // };


// import { useState, useEffect, useCallback, useRef } from 'react';
// import type { Course, Lesson, CourseStats, TabType, LessonTabType, Test } from './types';
// import { createNewCourseTemplate, createNewLesson, generateLessonId, API_URL } from './utils';
// import { fetchCourse, saveCourse, refreshCourseData, uploadLessonAttachments } from './api';

// export const useCourseManager = (courseId?: number | null) => {
//   const [course, setCourse] = useState<Course | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState<TabType>('basic');
//   const [selectedLesson, setSelectedLesson] = useState<number>(0);
//   const [editingLesson, setEditingLesson] = useState<number | null>(null);
//   const [isNewCourse, setIsNewCourse] = useState(!courseId);
//   const [lessonTab, setLessonTab] = useState<LessonTabType>('content');

//   const [tests, setTests] = useState<Test[]>([]);
//   const [selectedTest, setSelectedTest] = useState<number | null>(null);
//   const [editingTest, setEditingTest] = useState<number | null>(null);

//   const courseRef = useRef<Course | null>(null);
//   const testsRef = useRef<Test[]>([]);

//   useEffect(() => {
//     courseRef.current = course;
//   }, [course]);

//   useEffect(() => {
//     testsRef.current = tests;
//   }, [tests]);

//   useEffect(() => {
//     const initializeCourse = async () => {
//       try {
//         if (courseId) {
//           const courseData = await fetchCourse(courseId);
//           setCourse(courseData);
//           setTests(courseData.tests || []);
//           if (courseData.roadmap?.[0]?.id) setSelectedLesson(courseData.roadmap[0].id);
//         } else {
//           const newCourse = createNewCourseTemplate();
//           setCourse(newCourse);
//           setTests([]);
//           setIsNewCourse(true);
//         }
//       } catch (error) {
//         setError('Failed to initialize course');
//       } finally {
//         setLoading(false);
//       }
//     };
//     initializeCourse();
//   }, [courseId]);

//   const handleReorder = (reorderedItems: any[]) => {
//     const reorderedLessons: Lesson[] = [];
//     const reorderedTests: Test[] = [];

//     reorderedItems.forEach(item => {
//       if (item.type === 'lesson' && item.raw) {
//         reorderedLessons.push({ ...item.raw, order: item.order });
//       } else if (item.type === 'test' && item.raw) {
//         reorderedTests.push({ ...item.raw, order: item.order });
//       }
//     });

//     setCourse(prev => prev ? { ...prev, roadmap: reorderedLessons } : null);
//     setTests(reorderedTests);
//   };

//   const addAttachment = (lessonId: number, file: File | null, url: string = '') => {
//     if (!course) return;
//     setCourse(prev => {
//       if (!prev) return null;
//       const updatedRoadmap = prev.roadmap.map(lesson => {
//         if (lesson.id === lessonId) {
//           const newAtt: any = {
//             name: file ? file.name : url,
//             type: file ? 'file' : 'url',
//             file: file || undefined,
//             url_link: url || undefined
//           };
//           return { ...lesson, attachments: [...(lesson.attachments || []), newAtt] };
//         }
//         return lesson;
//       });
//       return { ...prev, roadmap: updatedRoadmap };
//     });
//   };

//   const removeAttachment = (lessonId: number, index: number) => {
//     if (!course) return;
//     setCourse(prev => {
//       if (!prev) return null;
//       const updatedRoadmap = prev.roadmap.map(lesson => {
//         if (lesson.id === lessonId) {
//           const newAtts = [...(lesson.attachments || [])];
//           newAtts.splice(index, 1);
//           return { ...lesson, attachments: newAtts };
//         }
//         return lesson;
//       });
//       return { ...prev, roadmap: updatedRoadmap };
//     });
//   };

//   const handleSaveCourse = useCallback(async () => {
//     const currentCourse = courseRef.current;
//     if (!currentCourse) return;

//     try {
//       const result = await saveCourse({ ...currentCourse, tests: testsRef.current }, isNewCourse);

//       if (result && result.roadmap) {
//         for (let i = 0; i < result.roadmap.length; i++) {
//           const savedLesson = result.roadmap[i];
//           const localLesson = currentCourse.roadmap[i];

//           if (localLesson?.attachments) {
//             const pending = localLesson.attachments.filter(a => !a.id || a.file);
//             if (pending.length > 0) {
//               await uploadLessonAttachments(savedLesson.id, pending);
//             }
//           }
//         }
//       }

//       alert('Course saved successfully!');
//       const refreshed = await refreshCourseData(result.id);
//       setCourse(refreshed);
//       setTests(refreshed.tests || []);
//       setIsNewCourse(false);
//     } catch (error) {
//       console.error(error);
//       alert('Failed to save course.');
//     }
//   }, [isNewCourse]);

//   const addLesson = () => {
//     if (!course) return;
//     const newId = generateLessonId(course.roadmap, isNewCourse);
//     const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
//     const newLesson = createNewLesson(newId, maxOrder);
//     setCourse(prev => prev ? { ...prev, roadmap: [...prev.roadmap, newLesson] } : null);
//     setSelectedLesson(newId);
//     setEditingLesson(newId);
//   };

//   const updateLesson = (lessonId: number, field: keyof Lesson, value: any) => {
//     setCourse(prev => {
//       if (!prev) return null;
//       const updatedRoadmap = prev.roadmap.map(l => l.id === lessonId ? { ...l, [field]: value } : l);
//       return { ...prev, roadmap: updatedRoadmap };
//     });
//   };

//   const deleteLesson = async (lessonId: number) => {
//     if (!window.confirm("Delete this lesson?")) return;
//     setCourse(prev => prev ? { ...prev, roadmap: prev.roadmap.filter(l => l.id !== lessonId) } : null);
//   };

//   const saveLesson = () => setEditingLesson(null);

//   const updateBasicInfo = (f: string, v: any) => setCourse(prev => prev ? { ...prev, [f]: v } : null);
//   const updateStats = (f: keyof CourseStats, v: any) => setCourse(prev => prev ? { ...prev, stats: { ...prev.stats, [f]: v } } : null);
//   const updateTags = (tags: string) => setCourse(prev => prev ? { ...prev, tags: tags.split(',').filter(t => t.trim()) } : null);
  
//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f && course) setCourse({ ...course, photo: f, photoUrl: URL.createObjectURL(f) });
//   };
//   const removePhoto = () => course && setCourse({ ...course, photo: null, photoUrl: '' });

//   // === CHANGED: MULTIPLE VIDEO UPLOAD ===
//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, lessonId: number) => {
//     const files = e.target.files;
//     if (files && files.length > 0 && course) {
//       const newVideos = Array.from(files).map(file => ({
//         name: file.name,
//         url: URL.createObjectURL(file),
//         file: file
//       }));

//       setCourse({
//         ...course,
//         roadmap: course.roadmap.map(l => 
//           l.id === lessonId 
//             ? { ...l, videos: [...(l.videos || []), ...newVideos] } 
//             : l
//         )
//       });
//     }
//   };

//   // === CHANGED: REMOVE SPECIFIC VIDEO ===
//   const removeVideo = async (lessonId: number, videoIndex: number) => {
//     if (!course) return;

//     const lesson = course.roadmap.find(l => l.id === lessonId);
//     if (!lesson || !lesson.videos) return;

//     const videoToRemove = lesson.videos[videoIndex];

//     if (videoToRemove.id) {
//         if(!window.confirm("Delete this video permanently?")) return;
//         try {
//             // Get auth headers for DELETE
//             const authData = localStorage.getItem("auth");
//             const token = authData ? JSON.parse(authData).accessToken : null;
//             const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

//             await fetch(`${API_URL}/courses/${courseId}/lessons/videos/${videoToRemove.id}/`, {
//                 method: 'DELETE',
//                 headers: headers as any
//             });
//         } catch (e) {
//             console.error("Failed to delete video", e);
//             alert("Failed to delete video from server");
//             return;
//         }
//     }

//     const updatedVideos = [...lesson.videos];
//     updatedVideos.splice(videoIndex, 1);

//     setCourse({
//       ...course,
//       roadmap: course.roadmap.map(l => 
//         l.id === lessonId 
//           ? { ...l, videos: updatedVideos } 
//           : l
//       )
//     });
//   };

//   const addTest = () => {
//     if (!course) return;
//     const tempId = -Date.now();
//     const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
//     const newTest: Test = { id: tempId, title: 'New Test', order: maxOrder, questions: [] };
//     setTests(prev => [...prev, newTest]);
//     setSelectedTest(tempId);
//     setEditingTest(tempId);
//   };

//   const updateTest = (id: number, p: Partial<Test>) => setTests(prev => prev.map(t => t.id === id ? { ...t, ...p } : t));
//   const updateTestQuestion = (tid: number, qid: number | string, f: string, v: any) => {
//     setTests(prev => prev.map(t => t.id !== tid ? t : {
//       ...t, questions: t.questions.map(q => String(q.id) === String(qid) ? (f === 'options' ? { ...q, options: v } : { ...q, question: v, question_text: v }) : q)
//     }));
//   };
//   const deleteTest = (id: number) => {
//     if (window.confirm("Delete test?")) {
//       setTests(prev => prev.filter(t => t.id !== id));
//       if (selectedTest === id) setSelectedTest(null);
//       if (editingTest === id) setEditingTest(null);
//     }
//   };
//   const saveTest = (testId?: number) => setEditingTest(null);

//   const getCurrentLesson = () => course?.roadmap.find(l => l.id === selectedLesson) || null;

//   return {
//     course, loading, error, activeTab, selectedLesson, editingLesson, isNewCourse, lessonTab,
//     tests, selectedTest, editingTest,
//     setActiveTab, setSelectedLesson, setEditingLesson, setLessonTab,
//     updateBasicInfo, updateStats, updateTags, handlePhotoUpload, removePhoto,
    
//     // === EXPORT UPDATED HANDLERS ===
//     handleVideoUpload, 
//     removeVideo: (lessonId: number, index?: number) => removeVideo(lessonId, index || 0),
    
//     addLesson, updateLesson, deleteLesson, getCurrentLesson, 
//     addTest, updateTest, updateTestQuestion, deleteTest, setSelectedTest, setEditingTest, 
//     saveTest, saveLesson, handleSaveCourse, handleReorder,
//     addAttachment, removeAttachment
//   };
// };

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Course, Lesson, CourseStats, TabType, LessonTabType, Test } from './types';
import { createNewCourseTemplate, createNewLesson, generateLessonId, API_URL } from './utils';
import { fetchCourse, saveCourse, refreshCourseData, uploadLessonAttachments } from './api';

export const useCourseManager = (courseId?: number | null) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [isNewCourse, setIsNewCourse] = useState(!courseId);
  const [lessonTab, setLessonTab] = useState<LessonTabType>('content');

  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [editingTest, setEditingTest] = useState<number | null>(null);

  const courseRef = useRef<Course | null>(null);
  const testsRef = useRef<Test[]>([]);

  useEffect(() => {
    courseRef.current = course;
  }, [course]);

  useEffect(() => {
    testsRef.current = tests;
  }, [tests]);

  useEffect(() => {
    const initializeCourse = async () => {
      try {
        if (courseId) {
          const courseData = await fetchCourse(courseId);
          setCourse(courseData);
          setTests(courseData.tests || []);
          if (courseData.roadmap?.[0]?.id) setSelectedLesson(courseData.roadmap[0].id);
        } else {
          const newCourse = createNewCourseTemplate();
          setCourse(newCourse);
          setTests([]);
          setIsNewCourse(true);
        }
      } catch (error) {
        setError('Failed to initialize course');
      } finally {
        setLoading(false);
      }
    };
    initializeCourse();
  }, [courseId]);

  const handleReorder = (reorderedItems: any[]) => {
    const reorderedLessons: Lesson[] = [];
    const reorderedTests: Test[] = [];

    reorderedItems.forEach(item => {
      if (item.type === 'lesson' && item.raw) {
        reorderedLessons.push({ ...item.raw, order: item.order });
      } else if (item.type === 'test' && item.raw) {
        reorderedTests.push({ ...item.raw, order: item.order });
      }
    });

    setCourse(prev => prev ? { ...prev, roadmap: reorderedLessons } : null);
    setTests(reorderedTests);
  };

  const addAttachment = (lessonId: number, file: File | null, url: string = '') => {
    if (!course) return;
    setCourse(prev => {
      if (!prev) return null;
      const updatedRoadmap = prev.roadmap.map(lesson => {
        if (lesson.id === lessonId) {
          const newAtt: any = {
            name: file ? file.name : url,
            type: file ? 'file' : 'url',
            file: file || undefined,
            url_link: url || undefined
          };
          return { ...lesson, attachments: [...(lesson.attachments || []), newAtt] };
        }
        return lesson;
      });
      return { ...prev, roadmap: updatedRoadmap };
    });
  };

  const removeAttachment = (lessonId: number, index: number) => {
    if (!course) return;
    setCourse(prev => {
      if (!prev) return null;
      const updatedRoadmap = prev.roadmap.map(lesson => {
        if (lesson.id === lessonId) {
          const newAtts = [...(lesson.attachments || [])];
          newAtts.splice(index, 1);
          return { ...lesson, attachments: newAtts };
        }
        return lesson;
      });
      return { ...prev, roadmap: updatedRoadmap };
    });
  };

  const handleSaveCourse = useCallback(async () => {
    const currentCourse = courseRef.current;
    if (!currentCourse) return;

    try {
      const result = await saveCourse({ ...currentCourse, tests: testsRef.current }, isNewCourse);

      if (result && result.roadmap) {
        // Sort both arrays to ensure indices match (since order is preserved)
        const sortedOldLessons = (currentCourse.roadmap || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const sortedNewLessons = (result.roadmap || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

        for (let i = 0; i < sortedNewLessons.length; i++) {
          const savedLesson = sortedNewLessons[i];
          const localLesson = sortedOldLessons[i];

          if (localLesson?.attachments) {
            const pending = localLesson.attachments.filter(a => !a.id || a.file);
            if (pending.length > 0) {
              // Upload using the REAL ID from the saved lesson
              await uploadLessonAttachments(savedLesson.id, pending);
            }
          }
        }
      }

      alert('Course saved successfully!');
      const refreshed = await refreshCourseData(result.id);
      setCourse(refreshed);
      setTests(refreshed.tests || []);
      setIsNewCourse(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save course.');
    }
  }, [isNewCourse]);

  const addLesson = () => {
    if (!course) return;
    const newId = generateLessonId(course.roadmap, isNewCourse);
    const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
    const newLesson = createNewLesson(newId, maxOrder);
    setCourse(prev => prev ? { ...prev, roadmap: [...prev.roadmap, newLesson] } : null);
    setSelectedLesson(newId);
    setEditingLesson(newId);
  };

  const updateLesson = (lessonId: number, field: keyof Lesson, value: any) => {
    setCourse(prev => {
      if (!prev) return null;
      const updatedRoadmap = prev.roadmap.map(l => l.id === lessonId ? { ...l, [field]: value } : l);
      return { ...prev, roadmap: updatedRoadmap };
    });
  };

  const deleteLesson = async (lessonId: number) => {
    if (!window.confirm("Delete this lesson?")) return;
    setCourse(prev => prev ? { ...prev, roadmap: prev.roadmap.filter(l => l.id !== lessonId) } : null);
  };

  const saveLesson = () => setEditingLesson(null);

  const updateBasicInfo = (f: string, v: any) => setCourse(prev => prev ? { ...prev, [f]: v } : null);
  const updateStats = (f: keyof CourseStats, v: any) => setCourse(prev => prev ? { ...prev, stats: { ...prev.stats, [f]: v } } : null);
  const updateTags = (tags: string) => setCourse(prev => prev ? { ...prev, tags: tags.split(',').filter(t => t.trim()) } : null);
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && course) setCourse({ ...course, photo: f, photoUrl: URL.createObjectURL(f) });
  };
  const removePhoto = () => course && setCourse({ ...course, photo: null, photoUrl: '' });

  // === CHANGED: MULTIPLE VIDEO UPLOAD ===
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>, lessonId: number) => {
    const files = e.target.files;
    if (files && files.length > 0 && course) {
      const newVideos = Array.from(files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file: file
      }));

      setCourse({
        ...course,
        roadmap: course.roadmap.map(l => 
          l.id === lessonId 
            ? { ...l, videos: [...(l.videos || []), ...newVideos] } 
            : l
        )
      });
    }
  };

  // === CHANGED: REMOVE SPECIFIC VIDEO ===
  const removeVideo = async (lessonId: number, videoIndex: number) => {
    if (!course) return;

    const lesson = course.roadmap.find(l => l.id === lessonId);
    if (!lesson || !lesson.videos) return;

    const videoToRemove = lesson.videos[videoIndex];

    if (videoToRemove.id) {
        if(!window.confirm("Delete this video permanently?")) return;
        try {
            // Get auth headers for DELETE
            const authData = localStorage.getItem("auth");
            const token = authData ? JSON.parse(authData).accessToken : null;
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            await fetch(`${API_URL}/courses/${courseId}/lessons/videos/${videoToRemove.id}/`, {
                method: 'DELETE',
                headers: headers as any
            });
        } catch (e) {
            console.error("Failed to delete video", e);
            alert("Failed to delete video from server");
            return;
        }
    }

    const updatedVideos = [...lesson.videos];
    updatedVideos.splice(videoIndex, 1);

    setCourse({
      ...course,
      roadmap: course.roadmap.map(l => 
        l.id === lessonId 
          ? { ...l, videos: updatedVideos } 
          : l
      )
    });
  };

  const addTest = () => {
    if (!course) return;
    const tempId = -Date.now();
    const maxOrder = Math.max(...course.roadmap.map(l => l.order || 0), ...tests.map(t => t.order || 0), 0) + 1;
    const newTest: Test = { id: tempId, title: 'New Test', order: maxOrder, questions: [] };
    setTests(prev => [...prev, newTest]);
    setSelectedTest(tempId);
    setEditingTest(tempId);
  };

  const updateTest = (id: number, p: Partial<Test>) => setTests(prev => prev.map(t => t.id === id ? { ...t, ...p } : t));
  const updateTestQuestion = (tid: number, qid: number | string, f: string, v: any) => {
    setTests(prev => prev.map(t => t.id !== tid ? t : {
      ...t, questions: t.questions.map(q => String(q.id) === String(qid) ? (f === 'options' ? { ...q, options: v } : { ...q, question: v, question_text: v }) : q)
    }));
  };
  const deleteTest = (id: number) => {
    if (window.confirm("Delete test?")) {
      setTests(prev => prev.filter(t => t.id !== id));
      if (selectedTest === id) setSelectedTest(null);
      if (editingTest === id) setEditingTest(null);
    }
  };
  const saveTest = (testId?: number) => setEditingTest(null);

  const getCurrentLesson = () => course?.roadmap.find(l => l.id === selectedLesson) || null;

  return {
    course, loading, error, activeTab, selectedLesson, editingLesson, isNewCourse, lessonTab,
    tests, selectedTest, editingTest,
    setActiveTab, setSelectedLesson, setEditingLesson, setLessonTab,
    updateBasicInfo, updateStats, updateTags, handlePhotoUpload, removePhoto,
    
    // === EXPORT UPDATED HANDLERS ===
    handleVideoUpload, 
    removeVideo: (lessonId: number, index?: number) => removeVideo(lessonId, index || 0),
    
    addLesson, updateLesson, deleteLesson, getCurrentLesson, 
    addTest, updateTest, updateTestQuestion, deleteTest, setSelectedTest, setEditingTest, 
    saveTest, saveLesson, handleSaveCourse, handleReorder,
    addAttachment, removeAttachment
  };
};