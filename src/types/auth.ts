import type { UserRole } from '../constants/config';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface StudentUser {
  id: string;
  role: 'student';
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string;
  section: string;
  college: string;
  avatar?: string;
}

export interface TeacherUser {
  id: string;
  role: 'teacher';
  name: string;
  email: string;
  employeeId: string;
  department: string;
  college: string;
  avatar?: string;
}

export interface AdminUser {
  id: string;
  role: 'admin';
  name: string;
  email: string;
  college: string;
  avatar?: string;
}

export type AppUser = StudentUser | TeacherUser | AdminUser;

export interface LoginStudentPayload {
  identifier: string;
  identifierType: 'email' | 'rollNumber';
  password: string;
}

export interface LoginTeacherPayload {
  identifier: string;
  identifierType: 'email' | 'employeeId';
  password: string;
}

export interface LoginAdminPayload {
  email: string;
  password: string;
}

export interface SignupStudentPayload {
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: string;
  section: string;
  password: string;
  confirmPassword: string;
}

export interface SignupTeacherPayload {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AppUser;
  tokens: AuthTokens;
}
