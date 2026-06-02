/**
 * Mock data layer — active when no backend is available.
 * Set MOCK_ENABLED = false in src/api/* files when api.askd.in is live.
 *
 * Demo credentials:
 *   Student  → student@askd.in  / password123  (or roll: 21CS001)
 *   Teacher  → teacher@askd.in  / password123  (or emp:  EMP001)
 *   Admin    → admin@askd.in    / password123
 */

import type { StudentUser, TeacherUser, AdminUser } from '../types/auth';
import type { EvaluatedScript, Dispute, Notification } from '../types/student';
import type { Batch, BatchScript, BatchAnalytics, TeacherDispute } from '../types/teacher';
import type {
  Semester, AdminStudent, GradeResult, Communication, DashboardStats,
} from '../types/admin';
import type { ApiResponse, PaginatedResponse } from '../types/api';

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function paginated<T>(data: T[], page = 1, limit = 20): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const slice = data.slice(start, start + limit);
  return {
    success: true,
    data: slice,
    pagination: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) },
  };
}

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const MOCK_STUDENT: StudentUser = {
  id: 'mock_student_1',
  role: 'student',
  name: 'Rahul Sharma',
  email: 'student@askd.in',
  rollNumber: '21CS001',
  branch: 'Computer Science',
  year: '3rd year',
  section: 'A',
  college: 'IIITDM Kurnool',
};

export const MOCK_TEACHER: TeacherUser = {
  id: 'mock_teacher_1',
  role: 'teacher',
  name: 'Dr. Priya Nair',
  email: 'teacher@askd.in',
  employeeId: 'EMP001',
  department: 'Computer Science',
  college: 'IIITDM Kurnool',
};

export const MOCK_ADMIN: AdminUser = {
  id: 'mock_admin_1',
  role: 'admin',
  name: 'Prof. Ramesh Kumar',
  email: 'admin@askd.in',
  college: 'IIITDM Kurnool',
};

export const MOCK_TOKENS = {
  accessToken: 'mock_access_token_dev',
  refreshToken: 'mock_refresh_token_dev',
};

// ─── Student Data ─────────────────────────────────────────────────────────────

const MOCK_SCRIPTS: EvaluatedScript[] = [
  {
    id: 'script_1',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    examDate: '2024-11-15',
    evaluatedAt: '2024-11-16',
    totalMarks: 100,
    marksObtained: 84,
    percentage: 84,
    grade: 'A',
    status: 'evaluated',
    blockchainHash: 'sha256:a3f8b2c9d1e4f7a0b3c6d9e2f5a8b1c4d7e0f3',
    questions: [
      {
        questionNumber: 1,
        questionText: 'Explain the time complexity of QuickSort with best, worst, and average cases. Derive the recurrence relation.',
        maxMarks: 20,
        marksAwarded: 18,
        confidence: 0.96,
        feedback: 'Excellent derivation of recurrence relations. Minor gap in worst-case pivot analysis with already-sorted input.',
        keyPoints: ['Best/Average: O(n log n)', 'Worst case O(n²) with sorted input', 'Pivot selection determines efficiency'],
      },
      {
        questionNumber: 2,
        questionText: 'Implement a balanced Binary Search Tree and explain AVL rotations.',
        maxMarks: 25,
        marksAwarded: 20,
        confidence: 0.88,
        feedback: 'Good understanding of rotations. Insertion was accurate but deletion missed the double-rotation edge case.',
        keyPoints: ['Left/Right rotations', 'Balance factor maintenance', 'Height recalculation after rotation'],
      },
      {
        questionNumber: 3,
        questionText: "Describe Dijkstra's shortest path algorithm with a worked example on a weighted graph.",
        maxMarks: 20,
        marksAwarded: 18,
        confidence: 0.94,
        feedback: 'Well-explained algorithm with a clear graph traversal example. Priority queue usage correctly identified.',
        keyPoints: ['Greedy approach', 'Priority queue for minimum extraction', 'Relaxation step per edge'],
      },
      {
        questionNumber: 4,
        questionText: 'What is dynamic programming? Solve the 0/1 Knapsack problem using a DP table.',
        maxMarks: 20,
        marksAwarded: 15,
        confidence: 0.82,
        feedback: 'Correct approach but the DP table had minor indexing errors in boundary conditions. Optimal substructure explanation was good.',
        keyPoints: ['Overlapping subproblems', 'Optimal substructure', 'Bottom-up vs top-down'],
      },
      {
        questionNumber: 5,
        questionText: 'Compare B-Trees and B+ Trees. Where is each used in practice?',
        maxMarks: 15,
        marksAwarded: 13,
        confidence: 0.91,
        feedback: 'Clear differentiation with database indexing example. Leaf linking in B+ Trees was accurately described.',
        keyPoints: ['B+ Trees store data only at leaves', 'B-Trees allow data at internal nodes', 'Used in file systems and DB indexes'],
      },
    ],
  },
  {
    id: 'script_2',
    subjectName: 'Operating Systems',
    subjectCode: 'CS302',
    examDate: '2024-11-18',
    evaluatedAt: '2024-11-19',
    totalMarks: 100,
    marksObtained: 72,
    percentage: 72,
    grade: 'B+',
    status: 'disputed',
    questions: [
      {
        questionNumber: 1,
        questionText: 'Explain process scheduling algorithms: FCFS, SJF, Round Robin, and Priority Scheduling.',
        maxMarks: 30,
        marksAwarded: 24,
        confidence: 0.89,
        feedback: 'Good coverage of FCFS and Round Robin. Preemptive SJF was missing from the comparison.',
        keyPoints: ['Burst time estimation', 'Context switching overhead', 'Starvation in Priority Scheduling'],
      },
      {
        questionNumber: 2,
        questionText: "What is deadlock? Explain the Banker's Algorithm for deadlock avoidance.",
        maxMarks: 25,
        marksAwarded: 19,
        confidence: 0.85,
        feedback: "Deadlock conditions correctly listed. Banker's algorithm safe-state check needed more detail.",
        keyPoints: ['Mutual exclusion', 'Hold and Wait', 'Safe state concept'],
      },
      {
        questionNumber: 3,
        questionText: 'Describe virtual memory and compare page replacement algorithms.',
        maxMarks: 25,
        marksAwarded: 18,
        confidence: 0.79,
        feedback: 'LRU and FIFO explained well. Optimal algorithm comparison was incomplete — Belady anomaly not mentioned.',
        keyPoints: ['Page fault handling', 'TLB for address translation', 'Thrashing'],
      },
      {
        questionNumber: 4,
        questionText: 'Explain file system structure and the inode concept in Unix.',
        maxMarks: 20,
        marksAwarded: 11,
        confidence: 0.73,
        feedback: 'Inode structure was partially correct. Hard vs soft links distinction was missing entirely.',
        keyPoints: ['Inode stores metadata', 'Directory as filename-inode mapping', 'Block allocation strategies'],
      },
    ],
  },
  {
    id: 'script_3',
    subjectName: 'Computer Networks',
    subjectCode: 'CS303',
    examDate: '2024-11-22',
    evaluatedAt: '2024-11-23',
    totalMarks: 100,
    marksObtained: 91,
    percentage: 91,
    grade: 'A+',
    status: 'evaluated',
    blockchainHash: 'sha256:b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1',
    questions: [
      {
        questionNumber: 1,
        questionText: 'Describe the OSI model layers with their functions and example protocols.',
        maxMarks: 25,
        marksAwarded: 24,
        confidence: 0.97,
        feedback: 'Outstanding. All 7 layers explained with precise protocols and PDU names at each layer.',
        keyPoints: ['Physical through Application layers', 'PDU at each layer', 'Protocol examples per layer'],
      },
      {
        questionNumber: 2,
        questionText: 'Explain TCP three-way handshake and flow/congestion control mechanisms.',
        maxMarks: 25,
        marksAwarded: 23,
        confidence: 0.95,
        feedback: 'Excellent understanding of the handshake sequence. Sliding window explanation was particularly clear.',
        keyPoints: ['SYN → SYN-ACK → ACK sequence', 'Sliding window protocol', 'Congestion control with AIMD'],
      },
      {
        questionNumber: 3,
        questionText: 'What is subnetting? Calculate subnets for a Class B network with a /26 prefix.',
        maxMarks: 25,
        marksAwarded: 23,
        confidence: 0.93,
        feedback: 'Correct calculation with binary conversion clearly shown. Host range per subnet was accurate.',
        keyPoints: ['CIDR notation', '64 addresses per subnet (62 usable)', '1022 subnets from /16 space'],
      },
      {
        questionNumber: 4,
        questionText: 'Compare IPv4 and IPv6. Explain NAT and its limitations.',
        maxMarks: 25,
        marksAwarded: 21,
        confidence: 0.88,
        feedback: 'Good comparison table. NAT limitations around P2P and end-to-end principle were well-articulated.',
        keyPoints: ['128-bit vs 32-bit addressing', 'IPSec mandatory in IPv6', 'NAT breaks end-to-end transparency'],
      },
    ],
  },
];

const _disputes: Dispute[] = [
  {
    id: 'dispute_1',
    scriptId: 'script_2',
    subjectName: 'Operating Systems',
    questionNumber: 4,
    reason:
      'I clearly covered the inode structure including timestamps, file size, and both direct and indirect block pointers. The hard vs soft link section was on page 2 of my answer which may not have been scanned.',
    status: 'under_review',
    filedAt: '2024-11-21',
    originalMarks: 11,
  },
  {
    id: 'dispute_2',
    scriptId: 'script_1',
    subjectName: 'Data Structures & Algorithms',
    questionNumber: 4,
    reason:
      'The DP table indexing was correct per the textbook formulation. Row 0 and column 0 represent base cases and my solution handled them correctly.',
    status: 'resolved',
    filedAt: '2024-11-18',
    resolvedAt: '2024-11-22',
    originalMarks: 15,
    revisedMarks: 17,
    teacherComment: 'Reviewed the original script. The indexing was indeed correct. Marks revised upward.',
  },
];

const _notifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'Script Evaluated',
    body: 'Your CS303 Computer Networks answer sheet has been evaluated. You scored 91/100.',
    type: 'evaluation',
    read: false,
    createdAt: '2024-11-23T14:30:00Z',
  },
  {
    id: 'notif_2',
    title: 'Dispute Resolved',
    body: 'Your dispute for DSA Q4 has been resolved. Marks revised from 15 to 17.',
    type: 'dispute',
    read: false,
    createdAt: '2024-11-22T10:15:00Z',
  },
  {
    id: 'notif_3',
    title: 'New Announcement',
    body: 'Mid-semester examination results are now available on the Askd portal.',
    type: 'announcement',
    read: true,
    createdAt: '2024-11-20T09:00:00Z',
  },
  {
    id: 'notif_4',
    title: 'Script Evaluated',
    body: 'Your CS302 Operating Systems answer sheet has been evaluated. You scored 72/100.',
    type: 'evaluation',
    read: true,
    createdAt: '2024-11-19T16:45:00Z',
  },
];

// ─── Teacher Data ─────────────────────────────────────────────────────────────

const MOCK_BATCHES: Batch[] = [
  {
    id: 'batch_1',
    name: '3rd Year CS-A · DSA',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    department: 'Computer Science',
    year: '3rd year',
    section: 'A',
    totalStudents: 62,
    evaluatedCount: 58,
    pendingCount: 4,
    status: 'active',
    createdAt: '2024-11-01',
  },
  {
    id: 'batch_2',
    name: '3rd Year CS-A · OS',
    subject: 'Operating Systems',
    subjectCode: 'CS302',
    department: 'Computer Science',
    year: '3rd year',
    section: 'A',
    totalStudents: 62,
    evaluatedCount: 62,
    pendingCount: 0,
    status: 'completed',
    createdAt: '2024-11-10',
  },
  {
    id: 'batch_3',
    name: '2nd Year CS-B · DSA',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS201',
    department: 'Computer Science',
    year: '2nd year',
    section: 'B',
    totalStudents: 58,
    evaluatedCount: 30,
    pendingCount: 28,
    status: 'active',
    createdAt: '2024-11-15',
  },
];

const MOCK_BATCH_SCRIPTS: BatchScript[] = [
  { id: 'bs_1', studentName: 'Rahul Sharma', rollNumber: '21CS001', totalMarks: 100, marksObtained: 84, percentage: 84, status: 'evaluated', evaluatedAt: '2024-11-16' },
  { id: 'bs_2', studentName: 'Priya Patel', rollNumber: '21CS002', totalMarks: 100, marksObtained: 76, percentage: 76, status: 'evaluated', evaluatedAt: '2024-11-16' },
  { id: 'bs_3', studentName: 'Arjun Singh', rollNumber: '21CS003', totalMarks: 100, marksObtained: 91, percentage: 91, status: 'evaluated', evaluatedAt: '2024-11-16' },
  { id: 'bs_4', studentName: 'Divya Reddy', rollNumber: '21CS004', totalMarks: 100, marksObtained: 68, percentage: 68, status: 'disputed' },
  { id: 'bs_5', studentName: 'Karthik Rao', rollNumber: '21CS005', totalMarks: 100, marksObtained: 0, percentage: 0, status: 'pending' },
  { id: 'bs_6', studentName: 'Ananya Krishnan', rollNumber: '21CS006', totalMarks: 100, marksObtained: 88, percentage: 88, status: 'evaluated', evaluatedAt: '2024-11-16' },
];

const MOCK_BATCH_ANALYTICS: BatchAnalytics = {
  batchId: 'batch_1',
  averageScore: 78.4,
  passPercentage: 92.3,
  topScore: 97,
  lowestScore: 41,
  scoreDistribution: { '90-100': 8, '80-89': 18, '70-79': 22, '60-69': 8, '<60': 2 },
  questionAnalytics: [
    { questionNumber: 1, questionText: 'QuickSort time complexity', averageScore: 16.8, maxScore: 20, minScore: 8, correctPercentage: 88 },
    { questionNumber: 2, questionText: 'AVL Tree rotations', averageScore: 18.2, maxScore: 25, minScore: 10, correctPercentage: 72 },
    { questionNumber: 3, questionText: "Dijkstra's algorithm", averageScore: 16.1, maxScore: 20, minScore: 7, correctPercentage: 81, conceptGap: 'Students conflated Dijkstra with Bellman-Ford on negative edge weights.' },
    { questionNumber: 4, questionText: '0/1 Knapsack DP', averageScore: 13.4, maxScore: 20, minScore: 4, correctPercentage: 67, conceptGap: 'Common errors in DP table boundary conditions and 0th row/column initialization.' },
    { questionNumber: 5, questionText: 'B-Trees vs B+ Trees', averageScore: 11.9, maxScore: 15, minScore: 5, correctPercentage: 79 },
  ],
};

const _teacherDisputes: TeacherDispute[] = [
  {
    id: 'td_1',
    studentName: 'Divya Reddy',
    rollNumber: '21CS004',
    subjectName: 'Data Structures & Algorithms',
    questionNumber: 3,
    reason: "My Dijkstra's implementation was correct but the graph traversal order was marked as wrong. The path I chose was equally optimal.",
    status: 'pending',
    filedAt: '2024-11-20',
    originalMarks: 14,
    scriptId: 'script_4',
  },
  {
    id: 'td_2',
    studentName: 'Rahul Sharma',
    rollNumber: '21CS001',
    subjectName: 'Operating Systems',
    questionNumber: 4,
    reason: 'The inode explanation covered all required points including hard/soft links which were on page 2 of my answer.',
    status: 'under_review',
    filedAt: '2024-11-21',
    originalMarks: 11,
    scriptId: 'script_2',
  },
];

const _teacherNotifications: Notification[] = [
  {
    id: 'tnotif_1',
    title: 'New Dispute Filed',
    body: 'Divya Reddy (21CS004) has filed a dispute for DSA Question 3.',
    type: 'dispute',
    read: false,
    createdAt: '2024-11-20T11:00:00Z',
  },
  {
    id: 'tnotif_2',
    title: 'Evaluation Reminder',
    body: '4 scripts in the CS301 batch are still pending evaluation. Deadline: Nov 30.',
    type: 'announcement',
    read: false,
    createdAt: '2024-11-19T09:00:00Z',
  },
  {
    id: 'tnotif_3',
    title: 'Batch Completed',
    body: 'All 62 scripts in the CS302 Operating Systems batch have been evaluated.',
    type: 'evaluation',
    read: true,
    createdAt: '2024-11-18T17:30:00Z',
  },
];

// ─── Admin Data ───────────────────────────────────────────────────────────────

const _semesters: Semester[] = [
  { id: 'sem_1', name: 'Odd Semester 2024-25', startDate: '2024-07-15', endDate: '2024-11-30', status: 'active', totalCourses: 18, totalStudents: 480 },
  { id: 'sem_2', name: 'Even Semester 2023-24', startDate: '2024-01-08', endDate: '2024-05-20', status: 'completed', totalCourses: 16, totalStudents: 460 },
  { id: 'sem_3', name: 'Even Semester 2024-25', startDate: '2025-01-06', endDate: '2025-05-15', status: 'upcoming', totalCourses: 0, totalStudents: 0 },
];

const MOCK_ADMIN_STUDENTS: AdminStudent[] = [
  { id: 's1', name: 'Rahul Sharma', email: 'student@askd.in', rollNumber: '21CS001', branch: 'Computer Science', year: '3rd year', section: 'A', status: 'active', joinedAt: '2021-08-02' },
  { id: 's2', name: 'Priya Patel', email: 'priya@college.edu', rollNumber: '21CS002', branch: 'Computer Science', year: '3rd year', section: 'A', status: 'active', joinedAt: '2021-08-02' },
  { id: 's3', name: 'Arjun Singh', email: 'arjun@college.edu', rollNumber: '21CS003', branch: 'Computer Science', year: '3rd year', section: 'A', status: 'active', joinedAt: '2021-08-02' },
  { id: 's4', name: 'Divya Reddy', email: 'divya@college.edu', rollNumber: '21CS004', branch: 'Computer Science', year: '3rd year', section: 'A', status: 'active', joinedAt: '2021-08-02' },
  { id: 's5', name: 'Karthik Rao', email: 'karthik@college.edu', rollNumber: '21CS005', branch: 'Computer Science', year: '3rd year', section: 'B', status: 'active', joinedAt: '2021-08-02' },
  { id: 's6', name: 'Ananya Krishnan', email: 'ananya@college.edu', rollNumber: '21EC001', branch: 'Electronics', year: '3rd year', section: 'A', status: 'active', joinedAt: '2021-08-02' },
  { id: 's7', name: 'Rohit Verma', email: 'rohit@college.edu', rollNumber: '22CS001', branch: 'Computer Science', year: '2nd year', section: 'B', status: 'active', joinedAt: '2022-08-01' },
  { id: 's8', name: 'Shreya Mishra', email: 'shreya@college.edu', rollNumber: '22CS002', branch: 'Computer Science', year: '2nd year', section: 'B', status: 'inactive', joinedAt: '2022-08-01' },
  { id: 's9', name: 'Vikram Nair', email: 'vikram@college.edu', rollNumber: '22CS003', branch: 'Computer Science', year: '2nd year', section: 'A', status: 'active', joinedAt: '2022-08-01' },
  { id: 's10', name: 'Pooja Iyer', email: 'pooja@college.edu', rollNumber: '22ME001', branch: 'Mechanical', year: '2nd year', section: 'A', status: 'active', joinedAt: '2022-08-01' },
];

const MOCK_GRADES: GradeResult[] = [
  { studentId: 's1', studentName: 'Rahul Sharma', rollNumber: '21CS001', subjectName: 'Data Structures & Algorithms', marksObtained: 84, totalMarks: 100, grade: 'A', percentage: 84 },
  { studentId: 's2', studentName: 'Priya Patel', rollNumber: '21CS002', subjectName: 'Data Structures & Algorithms', marksObtained: 76, totalMarks: 100, grade: 'B+', percentage: 76 },
  { studentId: 's3', studentName: 'Arjun Singh', rollNumber: '21CS003', subjectName: 'Data Structures & Algorithms', marksObtained: 91, totalMarks: 100, grade: 'A+', percentage: 91 },
  { studentId: 's4', studentName: 'Divya Reddy', rollNumber: '21CS004', subjectName: 'Data Structures & Algorithms', marksObtained: 68, totalMarks: 100, grade: 'B', percentage: 68 },
  { studentId: 's1', studentName: 'Rahul Sharma', rollNumber: '21CS001', subjectName: 'Operating Systems', marksObtained: 72, totalMarks: 100, grade: 'B+', percentage: 72 },
  { studentId: 's2', studentName: 'Priya Patel', rollNumber: '21CS002', subjectName: 'Operating Systems', marksObtained: 68, totalMarks: 100, grade: 'B', percentage: 68 },
  { studentId: 's3', studentName: 'Arjun Singh', rollNumber: '21CS003', subjectName: 'Computer Networks', marksObtained: 88, totalMarks: 100, grade: 'A', percentage: 88 },
  { studentId: 's4', studentName: 'Divya Reddy', rollNumber: '21CS004', subjectName: 'Computer Networks', marksObtained: 55, totalMarks: 100, grade: 'C+', percentage: 55 },
];

const _communications: Communication[] = [
  { id: 'comm_1', title: 'Mid-Semester Results Available', body: 'Mid-semester examination results for Odd Semester 2024-25 are now available. Login to view your detailed performance report.', targetRole: 'student', sentAt: '2024-11-23T09:00:00Z', sentBy: 'Prof. Ramesh Kumar' },
  { id: 'comm_2', title: 'Dispute Deadline — Nov 30', body: 'The last date for filing mark disputes is November 30, 2024. Please review your evaluated scripts and raise disputes before the deadline.', targetRole: 'all', sentAt: '2024-11-20T11:00:00Z', sentBy: 'Prof. Ramesh Kumar' },
  { id: 'comm_3', title: 'Pending Evaluations Reminder', body: 'Please complete all pending script evaluations before November 30, 2024 to ensure timely result publication.', targetRole: 'teacher', sentAt: '2024-11-18T10:30:00Z', sentBy: 'Prof. Ramesh Kumar' },
];

const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalStudents: 483,
  totalTeachers: 28,
  activeSemesters: 1,
  pendingEvaluations: 127,
  completedEvaluations: 1842,
  openDisputes: 14,
  averageEvaluationTime: '18 hrs',
  costSaved: '₹2,76,300',
};

// ─── Mock API Implementations ─────────────────────────────────────────────────

export const mockAuth = {
  loginStudent: async (payload: { identifier: string; identifierType: string; password: string }) => {
    await delay();
    const isEmail = payload.identifierType === 'email';
    const validId = isEmail
      ? payload.identifier.toLowerCase() === 'student@askd.in'
      : payload.identifier.toUpperCase() === '21CS001';
    if (!validId || payload.password !== 'password123') {
      throw { response: { data: { message: 'Invalid credentials.\n\nDemo: student@askd.in / password123\n(or roll: 21CS001 / password123)' } } };
    }
    return ok({ user: MOCK_STUDENT, tokens: MOCK_TOKENS });
  },

  loginTeacher: async (payload: { identifier: string; identifierType: string; password: string }) => {
    await delay();
    const isEmail = payload.identifierType === 'email';
    const validId = isEmail
      ? payload.identifier.toLowerCase() === 'teacher@askd.in'
      : payload.identifier.toUpperCase() === 'EMP001';
    if (!validId || payload.password !== 'password123') {
      throw { response: { data: { message: 'Invalid credentials.\n\nDemo: teacher@askd.in / password123\n(or emp ID: EMP001 / password123)' } } };
    }
    return ok({ user: MOCK_TEACHER, tokens: MOCK_TOKENS });
  },

  loginAdmin: async (payload: { email: string; password: string }) => {
    await delay();
    if (payload.email.toLowerCase() !== 'admin@askd.in' || payload.password !== 'password123') {
      throw { response: { data: { message: 'Invalid credentials.\n\nDemo: admin@askd.in / password123' } } };
    }
    return ok({ user: MOCK_ADMIN, tokens: MOCK_TOKENS });
  },

  signupStudent: async () => {
    await delay(800);
    return ok({ user: MOCK_STUDENT, tokens: MOCK_TOKENS });
  },

  signupTeacher: async () => {
    await delay(800);
    return ok({ user: MOCK_TEACHER, tokens: MOCK_TOKENS });
  },

  forgotPassword: async () => { await delay(500); return ok(null); },
  resetPassword: async () => { await delay(); return ok(null); },
  logout: async () => { await delay(200); return ok(null); },
  refreshToken: async () => { await delay(); return ok({ user: MOCK_STUDENT, tokens: MOCK_TOKENS }); },
};

export const mockStudent = {
  getProfile: async () => { await delay(); return ok(MOCK_STUDENT); },
  updateProfile: async (_payload: Partial<Pick<StudentUser, 'name' | 'avatar'>>) => { await delay(); return ok(MOCK_STUDENT); },

  getScripts: async (page = 1, limit = 20) => { await delay(); return paginated(MOCK_SCRIPTS, page, limit); },
  getScript: async (id: string) => { await delay(); return ok(MOCK_SCRIPTS.find((s) => s.id === id) ?? MOCK_SCRIPTS[0]); },

  getDisputes: async (page = 1, limit = 20) => { await delay(); return paginated(_disputes, page, limit); },
  getDispute: async (id: string) => { await delay(); return ok(_disputes.find((d) => d.id === id) ?? _disputes[0]); },

  fileDispute: async (payload: { scriptId: string; questionNumber: number; reason: string }) => {
    await delay(600);
    const script = MOCK_SCRIPTS.find((s) => s.id === payload.scriptId);
    const newDispute: Dispute = {
      id: `dispute_${Date.now()}`,
      scriptId: payload.scriptId,
      subjectName: script?.subjectName ?? 'Unknown Subject',
      questionNumber: payload.questionNumber,
      reason: payload.reason,
      status: 'pending',
      filedAt: new Date().toISOString().split('T')[0],
      originalMarks: script?.questions.find((q) => q.questionNumber === payload.questionNumber)?.marksAwarded ?? 0,
    };
    _disputes.unshift(newDispute);
    return ok(newDispute);
  },

  getNotifications: async (page = 1) => { await delay(); return paginated(_notifications, page); },
  markNotificationRead: async (id: string) => {
    await delay(150);
    const n = _notifications.find((n) => n.id === id);
    if (n) n.read = true;
    return ok(null);
  },
  markAllNotificationsRead: async () => {
    await delay(150);
    _notifications.forEach((n) => { n.read = true; });
    return ok(null);
  },

  getDashboard: async () => {
    await delay();
    return ok({
      recentScripts: MOCK_SCRIPTS,
      pendingDisputes: _disputes.filter((d) => d.status === 'pending' || d.status === 'under_review').length,
      averageScore: Math.round(MOCK_SCRIPTS.reduce((s, r) => s + r.percentage, 0) / MOCK_SCRIPTS.length * 10) / 10,
      totalExams: MOCK_SCRIPTS.length,
      unreadNotifications: _notifications.filter((n) => !n.read).length,
    });
  },

  changePassword: async (_payload: { currentPassword: string; newPassword: string }) => { await delay(); return ok(null); },
};

export const mockTeacher = {
  getProfile: async () => { await delay(); return ok(MOCK_TEACHER); },
  updateProfile: async (_payload: Partial<Pick<TeacherUser, 'name' | 'avatar'>>) => { await delay(); return ok(MOCK_TEACHER); },

  getDashboard: async () => {
    await delay();
    return ok({
      activeBatches: MOCK_BATCHES.filter((b) => b.status === 'active').length,
      pendingEvaluations: MOCK_BATCHES.reduce((s, b) => s + b.pendingCount, 0),
      openDisputes: _teacherDisputes.filter((d) => d.status === 'pending' || d.status === 'under_review').length,
      recentBatches: MOCK_BATCHES,
      totalStudentsEvaluated: MOCK_BATCHES.reduce((s, b) => s + b.evaluatedCount, 0),
    });
  },

  getBatches: async (page = 1) => { await delay(); return paginated(MOCK_BATCHES, page); },
  getBatch: async (id: string) => { await delay(); return ok(MOCK_BATCHES.find((b) => b.id === id) ?? MOCK_BATCHES[0]); },
  getBatchScripts: async (_batchId: string, page = 1) => { await delay(); return paginated(MOCK_BATCH_SCRIPTS, page); },
  getBatchAnalytics: async (_batchId: string) => { await delay(); return ok(MOCK_BATCH_ANALYTICS); },

  getDisputes: async (page = 1) => { await delay(); return paginated(_teacherDisputes, page); },
  getDispute: async (id: string) => { await delay(); return ok(_teacherDisputes.find((d) => d.id === id) ?? _teacherDisputes[0]); },
  resolveDispute: async (id: string, payload: { action: 'accept' | 'reject'; revisedMarks?: number; comment: string }) => {
    await delay(600);
    const d = _teacherDisputes.find((d) => d.id === id);
    if (d) d.status = payload.action === 'accept' ? 'resolved' : 'rejected';
    return ok(d ?? _teacherDisputes[0]);
  },

  getNotifications: async (page = 1) => { await delay(); return paginated(_teacherNotifications, page); },
  markNotificationRead: async (id: string) => {
    await delay(150);
    const n = _teacherNotifications.find((n) => n.id === id);
    if (n) n.read = true;
    return ok(null);
  },

  changePassword: async (_payload: { currentPassword: string; newPassword: string }) => { await delay(); return ok(null); },
};

export const mockAdmin = {
  getDashboard: async () => { await delay(); return ok(MOCK_DASHBOARD_STATS); },

  getSemesters: async () => { await delay(); return ok(_semesters); },
  getSemester: async (id: string) => { await delay(); return ok(_semesters.find((s) => s.id === id) ?? _semesters[0]); },
  createSemester: async (payload: { name: string; startDate: string; endDate: string }) => {
    await delay(600);
    const s: Semester = { id: `sem_${Date.now()}`, ...payload, status: 'upcoming', totalCourses: 0, totalStudents: 0 };
    _semesters.push(s);
    return ok(s);
  },
  updateSemester: async (id: string, payload: Partial<Semester>) => {
    await delay();
    const s = _semesters.find((s) => s.id === id);
    if (s) Object.assign(s, payload);
    return ok(s ?? _semesters[0]);
  },

  getCourses: async (_semesterId?: string) => { await delay(); return ok([] as any[]); },
  createCourse: async (_payload: any) => { await delay(); return ok({} as any); },
  getOfferings: async (_semesterId?: string) => { await delay(); return ok([] as any[]); },
  createOffering: async (_payload: any) => { await delay(); return ok({} as any); },

  getStudents: async (page = 1, search?: string) => {
    await delay();
    const list = search
      ? MOCK_ADMIN_STUDENTS.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()),
        )
      : MOCK_ADMIN_STUDENTS;
    return paginated(list, page);
  },
  getStudent: async (id: string) => { await delay(); return ok(MOCK_ADMIN_STUDENTS.find((s) => s.id === id) ?? MOCK_ADMIN_STUDENTS[0]); },
  updateStudent: async (id: string, payload: Partial<AdminStudent>) => {
    await delay();
    const s = MOCK_ADMIN_STUDENTS.find((s) => s.id === id);
    if (s) Object.assign(s, payload);
    return ok(s ?? MOCK_ADMIN_STUDENTS[0]);
  },

  getGrades: async (_semesterId?: string, page = 1) => { await delay(); return paginated(MOCK_GRADES, page); },

  getCommunications: async () => { await delay(); return ok(_communications); },
  sendCommunication: async (payload: { title: string; body: string; targetRole: 'all' | 'student' | 'teacher' }) => {
    await delay(600);
    const c: Communication = {
      id: `comm_${Date.now()}`,
      ...payload,
      sentAt: new Date().toISOString(),
      sentBy: MOCK_ADMIN.name,
    };
    _communications.unshift(c);
    return ok(c);
  },

  changePassword: async (_payload: { currentPassword: string; newPassword: string }) => { await delay(); return ok(null); },
};
