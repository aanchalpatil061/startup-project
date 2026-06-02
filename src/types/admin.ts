export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  totalCourses: number;
  totalStudents: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  semesterId: string;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherId: string;
  teacherName: string;
  batchId: string;
  batchName: string;
  semesterId: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string;
  section: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface GradeResult {
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  percentage: number;
}

export interface Communication {
  id: string;
  title: string;
  body: string;
  targetRole: 'all' | 'student' | 'teacher';
  sentAt: string;
  sentBy: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeSemesters: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  openDisputes: number;
  averageEvaluationTime: string;
  costSaved: string;
}
