export interface AssessmentData {
  preTestScore: number;
  postTestScore: number;
  completedDate: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  course: string;
  group: string;
  avatarUrl?: string;
  assessment: AssessmentData;
}