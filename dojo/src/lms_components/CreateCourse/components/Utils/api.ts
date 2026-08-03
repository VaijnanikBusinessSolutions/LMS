
// // import type { Course, Attachment } from './types';
// // import { API_URL, processCourseForAPI, processCourseFromAPI } from './utils';

// // // Fetch a single course
// // export const fetchCourse = async (courseId: number): Promise<Course> => {
// //   const response = await fetch(`${API_URL}/courses/${courseId}/`);
// //   if (!response.ok) {
// //     throw new Error('Failed to fetch course');
// //   }
// //   const courseData = await response.json();
// //   return processCourseFromAPI(courseData);
// // };

// // // Save (Create or Update) a course
// // export const saveCourse = async (course: Course, isNewCourse: boolean): Promise<Course> => {
// //   const { formData } = processCourseForAPI(course, isNewCourse);

// //   const config = {
// //     method: isNewCourse ? 'POST' : 'PUT',
// //     body: formData
// //   };

// //   const url = isNewCourse 
// //     ? `${API_URL}/courses/` 
// //     : `${API_URL}/courses/${course.id}/`;
  
// //   const response = await fetch(url, config);
  
// //   if (!response.ok) {
// //     const errorData = await response.json();
// //     throw new Error(`Server error: ${JSON.stringify(errorData)}`);
// //   }

// //   const result = await response.json();
// //   return result;
// // };

// // // Refresh course data
// // export const refreshCourseData = async (courseId: number): Promise<Course> => {
// //   const response = await fetch(`${API_URL}/courses/${courseId}/`);
// //   if (!response.ok) {
// //     throw new Error('Failed to refresh course data');
// //   }
// //   const refreshedData = await response.json();
// //   return processCourseFromAPI(refreshedData);
// // };

// // // === FIXED FUNCTION: Generic Attachment Upload ===
// // export const uploadLessonAttachments = async (lessonId: number, attachments: Attachment[]) => {
// //   // 1. Filter: Only upload items that are new (have a File object) or are a new URL without an ID
// //   const pendingItems = attachments.filter(a => !a.id || a.file);
  
// //   // If nothing to upload, return early
// //   if (pendingItems.length === 0) return;

// //   const formData = new FormData();
// //   formData.append('lesson', lessonId.toString());

// //   pendingItems.forEach(att => {
// //     // 2. Add Files (Video, PDF, Doc)
// //     if (att.type === 'file' && att.file) {
// //       formData.append('files', att.file);
// //     } 
// //     // 3. Add URLs
// //     else if (att.type === 'url' && att.url_link) {
// //       formData.append('urls', att.url_link);
// //     }
// //   });

// //   console.log(`Uploading ${pendingItems.length} attachments for lesson ${lessonId}...`);

// //   // 4. Send Request
// //   const response = await fetch(`${API_URL}/lesson-attachments/bulk-upload/`, { 
// //     method: 'POST',
// //     body: formData,
// //   });

// //   // 5. === ERROR HANDLING FIX ===
// //   // This block fixes the "SyntaxError: Unexpected token '<'"
// //   if (!response.ok) {
// //     const responseText = await response.text(); // Read raw text first
    
// //     try {
// //       // Try to parse it as JSON (if it's a validation error)
// //       const errorJson = JSON.parse(responseText);
// //       console.error('Attachment upload failed (JSON):', errorJson);
// //     } catch (e) {
// //       // If parsing fails, it's likely an HTML 404/500 page. Log the raw text/HTML.
// //       console.error('Attachment upload failed (HTML/Text):', responseText);
// //       console.error(`Status Code: ${response.status} ${response.statusText}`);
      
// //       if (response.status === 404) {
// //         console.error('CRITICAL: The URL /lms/lesson-attachments/bulk-upload/ does not exist on the backend. Check urls.py.');
// //       }
// //     }
    
// //     throw new Error(`Failed to upload attachments. Server responded with ${response.status}`);
// //   }
  
// //   // 6. Return success JSON
// //   return await response.json();
// // };


// import type { Course, Attachment } from './types';
// import { API_URL, processCourseFromAPI } from './utils';

// // === HELPER: Get Auth Token ===
// // FIX: Explicitly return Record<string, string> to satisfy HeadersInit
// const getAuthHeaders = (): Record<string, string> => {
//   try {
//     const authData = localStorage.getItem("auth");
//     if (!authData) return {};

//     const parsed = JSON.parse(authData);
//     const token = parsed.accessToken || parsed.token;
    
//     if (token) {
//       return { 'Authorization': `Bearer ${token}` };
//     }
//     return {};
//   } catch (e) {
//     console.error("Error parsing auth token", e);
//     return {};
//   }
// };

// export const fetchCourse = async (courseId: number): Promise<Course> => {
//   const response = await fetch(`${API_URL}/courses/${courseId}/`, {
//     method: 'GET',
//     // FIX: Cast as HeadersInit
//     headers: {
//       ...getAuthHeaders(),
//       'Content-Type': 'application/json',
//     } as HeadersInit
//   });

//   if (!response.ok) {
//     if (response.status === 401) throw new Error("Unauthorized: Please login again.");
//     throw new Error('Failed to fetch course');
//   }
//   const courseData = await response.json();
//   return processCourseFromAPI(courseData);
// };

// export const saveCourse = async (course: Course, isNewCourse: boolean): Promise<Course> => {
//   const { formData } = processCourseForAPI(course, isNewCourse);

//   const config = {
//     method: isNewCourse ? 'POST' : 'PUT',
//     body: formData,
//     // FIX: Cast as HeadersInit
//     headers: {
//       ...getAuthHeaders(),
//       // NOTE: Do NOT set Content-Type manually for FormData
//     } as HeadersInit
//   };

//   const url = isNewCourse 
//     ? `${API_URL}/courses/` 
//     : `${API_URL}/courses/${course.id}/`;
  
//   const response = await fetch(url, config);
  
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(`Server error: ${JSON.stringify(errorData)}`);
//   }

//   const result = await response.json();
//   return result;
// };

// export const refreshCourseData = async (courseId: number): Promise<Course> => {
//   const response = await fetch(`${API_URL}/courses/${courseId}/`, {
//     method: 'GET',
//     // FIX: Cast as HeadersInit
//     headers: {
//       ...getAuthHeaders(),
//       'Content-Type': 'application/json',
//     } as HeadersInit
//   });

//   if (!response.ok) {
//     throw new Error('Failed to refresh course data');
//   }
//   const refreshedData = await response.json();
//   return processCourseFromAPI(refreshedData);
// };

// export const uploadLessonAttachments = async (lessonId: number, attachments: Attachment[]) => {
//   const pendingItems = attachments.filter(a => !a.id || a.file);
  
//   if (pendingItems.length === 0) return;

//   const formData = new FormData();
//   formData.append('lesson', lessonId.toString());

//   pendingItems.forEach(att => {
//     if (att.type === 'file' && att.file) {
//       formData.append('files', att.file);
//     } 
//     else if (att.type === 'url' && att.url_link) {
//       formData.append('urls', att.url_link);
//     }
//   });

//   const response = await fetch(`${API_URL}/lesson-attachments/bulk-upload/`, { 
//     method: 'POST',
//     body: formData,
//     // FIX: Cast as HeadersInit
//     headers: {
//       ...getAuthHeaders(),
//     } as HeadersInit
//   });

//   if (!response.ok) {
//     const responseText = await response.text(); 
//     try {
//       const errorJson = JSON.parse(responseText);
//       console.error('Attachment upload failed (JSON):', errorJson);
//     } catch (e) {
//       console.error('Attachment upload failed (HTML/Text):', responseText);
//     }
//     throw new Error(`Failed to upload attachments. Server responded with ${response.status}`);
//   }
  
//   return await response.json();
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
  
//   // Sort lessons by order
//   const sortedLessons = (course.roadmap || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

//   const roadmapToSend = sortedLessons.map((lesson, index) => ({
//     id: lesson.id,
//     title: lesson.title || 'Untitled Lesson',
//     duration: lesson.duration || '0:00',
//     completed: lesson.completed || false,
//     sample: lesson.sample || false,
//     content: lesson.content || '',
//     order: lesson.order || index + 1,
//   }));
  
//   formData.append('roadmap', JSON.stringify(roadmapToSend));
  
//   if (course.photo instanceof File) {
//     formData.append('photo', course.photo);
//   }
  
//   // === Video Upload Loop using INDEX ===
//   let videoCount = 0;
  
//   sortedLessons.forEach((lesson, lessonIndex) => {
//     if (lesson.videos && lesson.videos.length > 0) {
//       lesson.videos.forEach((vid, vidIndex) => {
//         if (vid.file instanceof File) {
//           // Format: lesson_{LessonIndex}_video_{VideoIndex}
//           const fieldName = `lesson_${lessonIndex}_video_${vidIndex}`;
//           formData.append(fieldName, vid.file);
//           videoCount++;
//         }
//       });
//     }
//   });

//   const testsToSend = (course as any).tests || [];
//   formData.append('tests', JSON.stringify(testsToSend));
  
//   return { formData, videoCount };
// };


import type { Course, Attachment } from './types';
import { API_URL, processCourseFromAPI } from './utils';

// === HELPER: Get Auth Token ===
const getAuthHeaders = (): Record<string, string> => {
  try {
    const authData = localStorage.getItem("auth");
    if (!authData) return {};

    const parsed = JSON.parse(authData);
    const token = parsed.accessToken || parsed.token;
    
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  } catch (e) {
    console.error("Error parsing auth token", e);
    return {};
  }
};

// === HELPER: Clean IDs for Backend ===
const cleanId = (id: any) => {
  if (typeof id === 'string' || (typeof id === 'number' && id < 0)) {
    return undefined; // Remove the ID
  }
  return id; // Keep valid positive integer IDs
};

const cleanTestsForAPI = (tests: any[]) => {
  if (!Array.isArray(tests)) return [];

  return tests.map(test => {
    const cleanTest = { ...test };
    cleanTest.id = cleanId(test.id);

    if (Array.isArray(cleanTest.questions)) {
      cleanTest.questions = cleanTest.questions.map((q: any) => {
        const cleanQ = { ...q };
        cleanQ.id = cleanId(q.id);

        if (Array.isArray(cleanQ.options)) {
          cleanQ.options = cleanQ.options.map((o: any) => {
            const cleanO = { ...o };
            cleanO.id = cleanId(o.id);
            return cleanO;
          });
        }
        return cleanQ;
      });
    }
    return cleanTest;
  });
};

export const fetchCourse = async (courseId: number): Promise<Course> => {
  const response = await fetch(`${API_URL}/courses/${courseId}/`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    } as HeadersInit
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized: Please login again.");
    throw new Error('Failed to fetch course');
  }
  const courseData = await response.json();
  return processCourseFromAPI(courseData);
};

export const saveCourse = async (course: Course, isNewCourse: boolean): Promise<Course> => {
  const { formData } = processCourseForAPI(course, isNewCourse);

  const config = {
    method: isNewCourse ? 'POST' : 'PUT',
    body: formData,
    headers: {
      ...getAuthHeaders(),
    } as HeadersInit
  };

  const url = isNewCourse 
    ? `${API_URL}/courses/` 
    : `${API_URL}/courses/${course.id}/`;
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Backend Validation Error:", errorData);
    throw new Error(`Server error: ${JSON.stringify(errorData)}`);
  }

  const result = await response.json();
  return result;
};

export const refreshCourseData = async (courseId: number): Promise<Course> => {
  const response = await fetch(`${API_URL}/courses/${courseId}/`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    } as HeadersInit
  });

  if (!response.ok) {
    throw new Error('Failed to refresh course data');
  }
  const refreshedData = await response.json();
  return processCourseFromAPI(refreshedData);
};

export const uploadLessonAttachments = async (lessonId: number, attachments: Attachment[]) => {
  // Filter for items that don't have a real ID (unsaved) OR explicitly have a file object
  const pendingItems = attachments.filter(a =>
    !a.id && ((a.file instanceof File) || (a.url_link && a.url_link.trim() !== ''))
  );
  
  if (pendingItems.length === 0) return;

  const formData = new FormData();
  formData.append('lesson', lessonId.toString());

  let hasData = false; // <--- FIX: Track if we actually append data

  pendingItems.forEach(att => {
    // Only append if it's a file type AND has a valid File object
    if ((att.type === 'file' || att.file) && att.file instanceof File) {
      formData.append('files', att.file);
      hasData = true;
    } 
    // Only append if it's a url type AND has a valid string
    else if ((att.type === 'url' || att.url_link) && att.url_link && att.url_link.trim() !== '') {
      formData.append('urls', att.url_link);
      formData.append('url_titles', att.name || '');
      hasData = true;
    }
  });

  // <--- FIX: Stop here if no actual files/urls were added to FormData
  // This prevents the "400 Bad Request: No files or URLs provided" error
  if (!hasData) {
    return null;
  }

  const response = await fetch(`${API_URL}/lesson-attachments/bulk-upload/`, { 
    method: 'POST',
    body: formData,
    headers: {
      ...getAuthHeaders(),
    } as HeadersInit
  });

  if (!response.ok) {
    const responseText = await response.text(); 
    try {
      const errorJson = JSON.parse(responseText);
      console.error('Attachment upload failed (JSON):', errorJson);
    } catch (e) {
      console.error('Attachment upload failed (HTML/Text):', responseText);
    }
    throw new Error(`Failed to upload attachments. Server responded with ${response.status}`);
  }
  
  return await response.json();
};

export const uploadSingleLessonAttachment = async (lessonId: number, attachment: Attachment): Promise<Attachment> => {
  const result = await uploadLessonAttachments(lessonId, [attachment]);
  const uploaded = result?.uploaded?.[0];

  if (!uploaded) {
    throw new Error('Attachment upload did not return a saved material.');
  }

  return {
    ...uploaded,
    type: uploaded.url_link ? 'url' : 'file',
    name: uploaded.name || uploaded.url_link || uploaded.file?.split('/').pop() || attachment.name,
  };
};

export const deleteLessonAttachment = async (attachmentId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/lesson-attachments/${attachmentId}/`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    } as HeadersInit
  });

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const responseText = await response.text();
    console.error('Attachment delete failed:', responseText);
    throw new Error(`Failed to delete attachment. Server responded with ${response.status}`);
  }
};

export const processCourseForAPI = (course: Course, _isNewCourse: boolean = false) => {
  const formData = new FormData();
  
  formData.append('title', course.title);
  formData.append('instructor_name', course.instructor_name);
  formData.append('level', course.level);
  formData.append('duration', course.duration);
  formData.append('description', course.description);
  formData.append('department', course.department || '');
  formData.append('introduction', course.introduction);
  formData.append('questions', course.questions.toString());
  formData.append('is_published', course.is_published ? 'true' : 'false');
  
  const statsToSend = {
    accuracy: course.stats.accuracy || 0,
    completion: course.stats.completion || 0,
    enrolled: course.stats.enrolled || 0,
    rating: course.stats.rating || 0.0,
    duration: course.stats.duration || '0 hours'
  };
  formData.append('stats', JSON.stringify(statsToSend));
  
  const tagsToSend = Array.isArray(course.tags) ? course.tags : [];
  formData.append('tags', JSON.stringify(tagsToSend));
  
  // Sort lessons by order
  const sortedLessons = (course.roadmap || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));

  const roadmapToSend = sortedLessons.map((lesson, index) => ({
    // Clean Lesson ID
    id: cleanId(lesson.id),
    title: lesson.title || 'Untitled Lesson',
    duration: lesson.duration || '0:00',
    completed: lesson.completed || false,
    sample: lesson.sample || false,
    content: lesson.content || '',
    order: lesson.order || index + 1,
  }));
  
  formData.append('roadmap', JSON.stringify(roadmapToSend));
  
  if (course.photo instanceof File) {
    formData.append('photo', course.photo);
  }
  
  // === Video Upload Loop ===
  let videoCount = 0;
  
  sortedLessons.forEach((lesson, lessonIndex) => {
    if (lesson.videos && lesson.videos.length > 0) {
      lesson.videos.forEach((vid, vidIndex) => {
        if (vid.file instanceof File) {
          // Format: lesson_{LessonIndex}_video_{VideoIndex}
          const fieldName = `lesson_${lessonIndex}_video_${vidIndex}`;
          formData.append(fieldName, vid.file);
          videoCount++;
        }
      });
    }
  });

  // === Clean Tests IDs ===
  const testsToSend = cleanTestsForAPI((course as any).tests || []);
  formData.append('tests', JSON.stringify(testsToSend));
  
  return { formData, videoCount };
};
