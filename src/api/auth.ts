/**
 * Auth API — currently backed by mock data (no backend required).
 * To switch to real backend: set MOCK_ENABLED = false and uncomment the real implementations.
 *
 * Demo credentials:
 *   Student  → student@askd.in / password123  (or roll 21CS001)
 *   Teacher  → teacher@askd.in / password123  (or emp  EMP001)
 *   Admin    → admin@askd.in   / password123
 */

import { mockAuth } from '../mocks';

export const authApi = mockAuth;

/* ── Real implementation (restore when api.askd.in is live) ──────────────────
import { apiClient } from './client';
import type { AuthResponse, LoginStudentPayload, LoginTeacherPayload, LoginAdminPayload, SignupStudentPayload, SignupTeacherPayload } from '../types/auth';
import type { ApiResponse } from '../types/api';

export const authApi = {
  loginStudent:   (p: LoginStudentPayload)  => apiClient.post<ApiResponse<AuthResponse>>('/auth/student/login', p).then(r => r.data),
  loginTeacher:   (p: LoginTeacherPayload)  => apiClient.post<ApiResponse<AuthResponse>>('/auth/teacher/login', p).then(r => r.data),
  loginAdmin:     (p: LoginAdminPayload)    => apiClient.post<ApiResponse<AuthResponse>>('/auth/admin/login', p).then(r => r.data),
  signupStudent:  (p: SignupStudentPayload) => apiClient.post<ApiResponse<AuthResponse>>('/auth/student/signup', p).then(r => r.data),
  signupTeacher:  (p: SignupTeacherPayload) => apiClient.post<ApiResponse<AuthResponse>>('/auth/teacher/signup', p).then(r => r.data),
  forgotPassword: (email: string, role: string) => apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email, role }).then(r => r.data),
  resetPassword:  (token: string, password: string) => apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password }).then(r => r.data),
  logout:         () => apiClient.post<ApiResponse<null>>('/auth/logout').then(r => r.data),
  refreshToken:   (refreshToken: string) => apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }).then(r => r.data),
};
──────────────────────────────────────────────────────────────────────────── */
