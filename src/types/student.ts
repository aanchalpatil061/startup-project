export interface QuestionScore {
  questionNumber: number;
  questionText: string;
  maxMarks: number;
  marksAwarded: number;
  confidence: number;
  feedback: string;
  keyPoints: string[];
}

export interface EvaluatedScript {
  id: string;
  subjectName: string;
  subjectCode: string;
  examDate: string;
  evaluatedAt: string;
  totalMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  status: 'pending' | 'evaluated' | 'disputed' | 'resolved';
  questions: QuestionScore[];
  blockchainHash?: string;
  scriptImageUrl?: string;
}

export interface Dispute {
  id: string;
  scriptId: string;
  subjectName: string;
  questionNumber: number;
  reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  filedAt: string;
  resolvedAt?: string;
  originalMarks: number;
  revisedMarks?: number;
  teacherComment?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'evaluation' | 'dispute' | 'announcement' | 'result';
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}
