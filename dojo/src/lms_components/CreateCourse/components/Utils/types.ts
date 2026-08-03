// export interface Attachment {
//   id?: number; // Optional because new uploads won't have an ID yet
//   name: string;
//   file?: File; // The physical file object (Video, PDF, etc.)
//   url_link?: string; // The URL string
//   type: 'file' | 'url';
// }

// export interface Lesson {
//   id: number;
//   title: string;
//   duration: string;
//   completed: boolean;
//   sample?: boolean;
//   content: string;
//   order?: number;
//   video?: File | string | null; // Main lesson video
//   videoUrl?: string;
  
//   // === NEW FIELD ===
//   attachments: Attachment[]; 
// }

// export interface CourseStats {
//   accuracy: number;
//   completion: number;
//   enrolled: number;
//   rating: number;
//   duration: string;
// }

// export interface Course {
//   id: number;
//   title: string;
//   instructor_name: string;
//   level: string;
//   duration: string;
//   description: string;
//   department: string;
//   introduction: string;
//   roadmap: Lesson[];
//   stats: CourseStats;
//   tags: string[];
//   questions: number;
//   updated: string;
//   is_published?: boolean;
//   photo?: File | string | null;
//   photoUrl?: string;
//   tests: Test[];
// }

// export type TabType = 'basic' | 'preview' | 'content';
// // === ADDED 'materials' ===
// export type LessonTabType = 'content' | 'video' | 'materials';

// export interface CourseContentManagerProps {
//   courseId?: number | null;
// }

// // Test Related Types
// export interface MCQOption {
//   id: number | string;
//   text: string;
//   isCorrect?: boolean;
//   is_correct?: boolean;
// }

// export interface MCQQuestion {
//   id: number | string;
//   question?: string;
//   question_text?: string;
//   options: MCQOption[];
//   order?: number;
// }

// export interface Test {
//   id: number;
//   title: string;
//   description?: string;
//   questions: MCQQuestion[];
//   order?: number;
//   passing_criteria?: number; 
//   total_time?: number;
// }

// export type ContentType = 'lesson' | 'test';


export interface Attachment {
  id?: number;
  name: string;
  file?: File | string | null;
  url_link?: string;
  type?: 'file' | 'url';
}

// === NEW INTERFACE ===
export interface LessonVideo {
  id?: number;   
  name: string;
  url: string;   
  file?: File;   
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  sample?: boolean;
  content: string;
  order?: number;
  
  // === CHANGED ===
  videos: LessonVideo[];
  
  video?: File | string | null; // Unused but kept for type safety
  videoUrl?: string; // Unused but kept for type safety

  attachments: Attachment[]; 
}

export interface CourseStats {
  accuracy: number;
  completion: number;
  enrolled: number;
  rating: number;
  duration: string;
}

export interface MCQOption {
  id: number | string;
  text: string;
  isCorrect?: boolean;
  is_correct?: boolean;
}

export interface MCQQuestion {
  id: number | string;
  question?: string;
  question_text?: string;
  options: MCQOption[];
  order?: number;
}

export interface Test {
  id: number;
  title: string;
  description?: string;
  questions: MCQQuestion[];
  order?: number;
  passing_criteria?: number; 
  total_time?: number;
}

export interface Course {
  id: number;
  title: string;
  instructor_name: string;
  level: string;
  duration: string;
  description: string;
  department: string;
  introduction: string;
  roadmap: Lesson[];
  stats: CourseStats;
  tags: string[];
  questions: number;
  updated: string;
  is_published?: boolean;
  photo?: File | string | null;
  photoUrl?: string;
  tests: Test[];
}

export type TabType = 'basic' | 'preview' | 'content' | 'review';
export type LessonTabType = 'content' | 'video' | 'materials';

export interface CourseContentManagerProps {
  courseId?: number | null;
  onBack?: () => void;
}
