import { apiClient } from './client';
import type {
  AuthResponse,
  LoginStudentPayload,
  LoginTeacherPayload,
  LoginAdminPayload,
  SignupStudentPayload,
  SignupTeacherPayload,
} from '../types/auth';
import type { ApiResponse } from '../types/api';

export const authApi = {
  loginStudent: (payload: LoginStudentPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/student/login', payload).then((r) => r.data),

  loginTeacher: (payload: LoginTeacherPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/teacher/login', payload).then((r) => r.data),

  loginAdmin: (payload: LoginAdminPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/admin/login', payload).then((r) => r.data),

  signupStudent: (payload: SignupStudentPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/student/signup', payload).then((r) => r.data),

  signupTeacher: (payload: SignupTeacherPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/teacher/signup', payload).then((r) => r.data),

  forgotPassword: (email: string, role: 'student' | 'teacher' | 'admin') =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email, role }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password }).then((r) => r.data),

  logout: () =>
    apiClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }).then((r) => r.data),
};
