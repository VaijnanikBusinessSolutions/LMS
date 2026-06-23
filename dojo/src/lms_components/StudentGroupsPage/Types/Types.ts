export interface User {
  id: string;
  name: string;
  role: 'Team Leader' | 'Employee';
  avatar: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
}

export interface Group {
  id: string;
  name: string;
  teachers: User[];
  students: User[];
  assignedCourses: Course[];
  createdAt: Date;
}