export interface Batch {
  id: string;
  name: string;
  subject: string;
  subjectCode: string;
  department: string;
  year: string;
  section: string;
  totalStudents: number;
  evaluatedCount: number;
  pendingCount: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface BatchScript {
  id: string;
  studentName: string;
  rollNumber: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  status: 'pending' | 'evaluated' | 'disputed';
  evaluatedAt?: string;
}

export interface QuestionAnalytic {
  questionNumber: number;
  questionText: string;
  averageScore: number;
  maxScore: number;
  minScore: number;
  correctPercentage: number;
  conceptGap?: string;
}

export interface BatchAnalytics {
  batchId: string;
  averageScore: number;
  passPercentage: number;
  topScore: number;
  lowestScore: number;
  scoreDistribution: Record<string, number>;
  questionAnalytics: QuestionAnalytic[];
}

export interface TeacherDispute {
  id: string;
  studentName: string;
  rollNumber: string;
  subjectName: string;
  questionNumber: number;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  filedAt: string;
  originalMarks: number;
  scriptId: string;
}
