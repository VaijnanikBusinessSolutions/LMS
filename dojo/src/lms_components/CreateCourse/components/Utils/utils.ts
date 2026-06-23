
// import type { Course, Lesson } from './types';

// export const API_URL = 'http://localhost:8000/lms';

// export const createNewCourseTemplate = (): Course => ({
//   id: 0,
//   title: 'New Course',
//   instructor_name: '',
//   level: 'Beginner',
//   duration: '6 weeks',
//   description: '',
//   department: '',
//   introduction: '',
//   roadmap: [],
//   stats: {
//     accuracy: 0,
//     completion: 0,
//     enrolled: 0,
//     rating: 0,
//     duration: '0 hours'
//   },
//   tags: [],
//   questions: 0,
//   updated: new Date().toISOString(),
//   is_published: false,
//   photo: null,
//   photoUrl: '',
//   tests: []
// });

// export const generateLessonId = (existingLessons: Lesson[], isNewCourse: boolean): number => {
//   if (isNewCourse) {
//     return Math.min(-1, ...existingLessons.filter(l => l.id < 0).map(l => l.id)) - 1;
//   } else {
//     const maxId = Math.max(0, ...existingLessons.map(l => l.id));
//     return maxId + 1;
//   }
// };

// export const createNewLesson = (id: number, order: number): Lesson => ({
//   id,
//   title: 'New Lesson',
//   duration: '0:00',
//   completed: false,
//   content: 'Enter your lesson content here.',
//   order,
//   video: null,
//   videoUrl: '',
//   // === NEW: Initialize empty attachments ===
//   attachments: []
// });

// export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
//   if (!file.type.startsWith('image/')) {
//     return { isValid: false, error: 'Please select a valid image file (JPG, PNG, GIF).' };
//   }
//   if (file.size > 5 * 1024 * 1024) {
//     return { isValid: false, error: 'Image size should be less than 5MB.' };
//   }
//   return { isValid: true };
// };

// export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
//   if (!file.type.startsWith('video/')) {
//     return { isValid: false, error: 'Please upload a valid video file' };
//   }
//   // Increased limit for large videos (500MB)
//   if (file.size > 500 * 1024 * 1024) {
//     return { isValid: false, error: 'Video size should be less than 500MB.' };
//   }
//   return { isValid: true };
// };

// const normalizeTests = (testsInput: any[] = []) => {
//   return (testsInput || []).map((t) => {
//     const testOut: any = {
//       title: t.title ?? t.name ?? 'Untitled Test',
//       order: typeof t.order !== 'undefined' ? t.order : 0,
//     };
//     if (typeof t.id === 'number' && t.id > 0) testOut.id = t.id;
//     if (typeof t.passing_criteria === 'number') testOut.passing_criteria = t.passing_criteria;
//     if (typeof t.total_time === 'number') testOut.total_time = t.total_time;

//     testOut.questions = (t.questions || []).map((q: any) => {
//       const qText = (q.question ?? q.question_text ?? '').toString();
//       const qOut: any = {
//         order: typeof q.order !== 'undefined' ? q.order : 0,
//         question: qText,
//         question_text: qText,
//       };
//       if (typeof q.id === 'number' && q.id > 0) qOut.id = q.id;

//       qOut.options = (q.options || []).map((opt: any) => {
//         const optOut: any = {
//           text: opt.text ?? '',
//           is_correct: typeof opt.is_correct !== 'undefined' ? !!opt.is_correct : !!opt.isCorrect
//         };
//         if (typeof opt.id === 'number' && opt.id > 0) optOut.id = opt.id;
//         return optOut;
//       });
//       return qOut;
//     });
//     return testOut;
//   });
// };

// export const processCourseForAPI = (course: Course, isNewCourse: boolean = false) => {
//   const formData = new FormData();
  
//   formData.append('title', course.title);
//   formData.append('instructor_name', course.instructor_name);
//   formData.append('level', course.level);
//   formData.append('duration', course.duration);
//   formData.append('description', course.description);
//   formData.append('department', course.department || '');
//   formData.append('introduction', course.introduction);
//   formData.append('questions', course.questions.toString());
//   formData.append('is_published', course.is_published ? 'true' : 'false');
  
//   const statsToSend = {
//     accuracy: course.stats.accuracy || 0,
//     completion: course.stats.completion || 0,
//     enrolled: course.stats.enrolled || 0,
//     rating: course.stats.rating || 0.0,
//     duration: course.stats.duration || '0 hours'
//   };
//   formData.append('stats', JSON.stringify(statsToSend));
  
//   const tagsToSend = Array.isArray(course.tags) ? course.tags : [];
//   formData.append('tags', JSON.stringify(tagsToSend));
  
//   const sortedLessons = (course.roadmap || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

//   const roadmapToSend = sortedLessons.map((lesson, index) => ({
//     id: lesson.id,
//     title: lesson.title || 'Untitled Lesson',
//     duration: lesson.duration || '0:00',
//     completed: lesson.completed || false,
//     sample: lesson.sample || false,
//     content: lesson.content || '',
//     order: lesson.order || index + 1,
//     hasVideo: lesson.video instanceof File
//     // Note: We don't send attachments JSON here; we upload them separately
//   }));
  
//   formData.append('roadmap', JSON.stringify(roadmapToSend));
  
//   if (course.photo instanceof File) {
//     formData.append('photo', course.photo);
//   }
  
//   let videoCount = 0;
  
//   sortedLessons.forEach((lesson, index) => {
//     if (lesson.video instanceof File) {
//       let fieldName: string;
//       if (isNewCourse) {
//         fieldName = `lesson_${index}_video`;
//       } else {
//         fieldName = `lesson_${lesson.id}_video`;
//       }
//       formData.append(fieldName, lesson.video);
//       videoCount++;
//     }
//   });

//   const testsToSend = normalizeTests((course as any).tests || []);
//   formData.append('tests', JSON.stringify(testsToSend));
  
//   return { formData, videoCount };
// };

// export const processCourseFromAPI = (courseData: any): Course => {
//   courseData = courseData || {};
//   courseData.tests = Array.isArray(courseData.tests) ? courseData.tests : [];

//   if (courseData.photo) {
//     courseData.photoUrl = courseData.photo;
//     courseData.photo = null; 
//   } else {
//     courseData.photo = null;
//     courseData.photoUrl = courseData.photoUrl || '';
//   }
  
//   courseData.roadmap = Array.isArray(courseData.roadmap) ? courseData.roadmap : [];
//   courseData.roadmap = courseData.roadmap.map((lesson: any) => ({
//     ...lesson,
//     videoUrl: lesson.videoUrl || '',
//     video: null,
//     // === NEW: Ensure attachments array exists ===
//     attachments: Array.isArray(lesson.attachments) ? lesson.attachments : []
//   }));
  
//   return courseData;
// };

// export const reorderLessons = (lessons: Lesson[]): Lesson[] => {
//   return lessons.map((lesson, index) => ({
//     ...lesson,
//     order: index + 1
//   }));
// };


// components/Utils/utils.ts

import type { Course, Lesson } from './types';

export const API_URL = 'http://localhost:8000/lms';

export const createNewCourseTemplate = (): Course => ({
  id: 0,
  title: 'New Course',
  instructor_name: '',
  level: 'Beginner',
  duration: '6 weeks',
  description: '',
  department: '',
  introduction: '',
  roadmap: [],
  stats: {
    accuracy: 0,
    completion: 0,
    enrolled: 0,
    rating: 0,
    duration: '0 hours'
  },
  tags: [],
  questions: 0,
  updated: new Date().toISOString(),
  is_published: false,
  photo: null,
  photoUrl: '',
  tests: []
});

export const generateLessonId = (existingLessons: Lesson[], isNewCourse: boolean): number => {
  if (isNewCourse) {
    return Math.min(-1, ...existingLessons.filter(l => l.id < 0).map(l => l.id)) - 1;
  } else {
    const maxId = Math.max(0, ...existingLessons.map(l => l.id));
    return maxId + 1;
  }
};

export const createNewLesson = (id: number, order: number): Lesson => ({
  id,
  title: 'New Lesson',
  duration: '0:00',
  completed: false,
  content: 'Enter your lesson content here.',
  order,
  // === CHANGED: Initialize empty video array ===
  videos: [], 
  video: null,
  videoUrl: '',
  attachments: []
});

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file (JPG, PNG, GIF).' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Image size should be less than 5MB.' };
  }
  return { isValid: true };
};

export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('video/')) {
    return { isValid: false, error: 'Please upload a valid video file' };
  }
  if (file.size > 500 * 1024 * 1024) {
    return { isValid: false, error: 'Video size should be less than 500MB.' };
  }
  return { isValid: true };
};

// Helper for Test normalization (unchanged logic)
const normalizeTests = (testsInput: any[] = []) => {
  return (testsInput || []).map((t) => {
    const testOut: any = {
      title: t.title ?? t.name ?? 'Untitled Test',
      order: typeof t.order !== 'undefined' ? t.order : 0,
    };
    if (typeof t.id === 'number' && t.id > 0) testOut.id = t.id;
    if (typeof t.passing_criteria === 'number') testOut.passing_criteria = t.passing_criteria;
    if (typeof t.total_time === 'number') testOut.total_time = t.total_time;

    testOut.questions = (t.questions || []).map((q: any) => {
      const qText = (q.question ?? q.question_text ?? '').toString();
      const qOut: any = {
        order: typeof q.order !== 'undefined' ? q.order : 0,
        question: qText,
        question_text: qText,
      };
      if (typeof q.id === 'number' && q.id > 0) qOut.id = q.id;

      qOut.options = (q.options || []).map((opt: any) => {
        const optOut: any = {
          text: opt.text ?? '',
          is_correct: typeof opt.is_correct !== 'undefined' ? !!opt.is_correct : !!opt.isCorrect
        };
        if (typeof opt.id === 'number' && opt.id > 0) optOut.id = opt.id;
        return optOut;
      });
      return qOut;
    });
    return testOut;
  });
};

export const processCourseFromAPI = (courseData: any): Course => {
  courseData = courseData || {};
  courseData.tests = Array.isArray(courseData.tests) ? courseData.tests : [];

  if (courseData.photo) {
    courseData.photoUrl = courseData.photo;
    courseData.photo = null; 
  } else {
    courseData.photo = null;
    courseData.photoUrl = courseData.photoUrl || '';
  }
  
  courseData.roadmap = Array.isArray(courseData.roadmap) ? courseData.roadmap : [];
  courseData.roadmap = courseData.roadmap.map((lesson: any) => ({
    ...lesson,
    
    // === CHANGED: Map backend video objects to frontend structure ===
    videos: Array.isArray(lesson.videos) ? lesson.videos.map((v: any) => ({
      id: v.id,
      name: v.name || 'Untitled Video',
      url: v.url || '', // API should return the full URL
    })) : [],

    // Maintain fallback for legacy single video fields if needed, but primary is now 'videos'
    videoUrl: lesson.videoUrl || '',
    video: null,
    
    attachments: Array.isArray(lesson.attachments) ? lesson.attachments : []
  }));
  
  return courseData;
};

export const reorderLessons = (lessons: Lesson[]): Lesson[] => {
  return lessons.map((lesson, index) => ({
    ...lesson,
    order: index + 1
  }));
};