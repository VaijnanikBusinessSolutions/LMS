import type  { Employee } from './types';

export const DUMMY_DATA: Employee[] = [
  {
    id: "EMP-001",
    name: "Sarah Connor",
    email: "sarah.c@skynet.com",
    course: "Cybersecurity Basics",
    group: "Engineering",
    assessment: { preTestScore: 45, postTestScore: 92, completedDate: "2023-10-25" }
  },
  {
    id: "EMP-002",
    name: "John Wick",
    email: "john@continental.com",
    course: "Conflict Resolution",
    group: "Operations",
    assessment: { preTestScore: 30, postTestScore: 88, completedDate: "2023-10-26" }
  },
  {
    id: "EMP-003",
    name: "Ellen Ripley",
    email: "ripley@nostromo.space",
    course: "Safety Protocol Level 5",
    group: "Logistics",
    assessment: { preTestScore: 60, postTestScore: 95, completedDate: "2023-10-27" }
  },
  {
    id: "EMP-004",
    name: "Tony Stark",
    email: "tony@stark.com",
    course: "Advanced Robotics",
    group: "R&D",
    assessment: { preTestScore: 90, postTestScore: 98, completedDate: "2023-10-24" }
  },
  {
    id: "EMP-005",
    name: "Walter White",
    email: "heisenberg@chem.net",
    course: "Chemical Safety",
    group: "Chemistry",
    assessment: { preTestScore: 50, postTestScore: 85, completedDate: "2023-10-28" }
  },
];