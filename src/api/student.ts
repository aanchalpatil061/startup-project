/**
 * Student API — currently backed by mock data.
 * To switch to real backend: replace `mockStudent` with the real implementations below.
 */

import { mockStudent } from '../mocks';

export const studentApi = mockStudent;

/* ── Real implementation (restore when api.askd.in is live) ──────────────────
import { apiClient } from './client';
import type { EvaluatedScript, Dispute, Notification } from '../types/student';
import type { StudentUser } from '../types/auth';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const studentApi = {
  getProfile:    () => apiClient.get<ApiResponse<StudentUser>>('/student/profile').then(r => r.data),
  updateProfile: (p: Partial<Pick<StudentUser, 'name' | 'avatar'>>) => apiClient.patch<ApiResponse<StudentUser>>('/student/profile', p).then(r => r.data),
  getScripts:    (page = 1, limit = 20) => apiClient.get<PaginatedResponse<EvaluatedScript>>('/student/scripts', { params: { page, limit } }).then(r => r.data),
  getScript:     (id: string) => apiClient.get<ApiResponse<EvaluatedScript>>(`/student/scripts/${id}`).then(r => r.data),
  getDisputes:   (page = 1, limit = 20) => apiClient.get<PaginatedResponse<Dispute>>('/student/disputes', { params: { page, limit } }).then(r => r.data),
  getDispute:    (id: string) => apiClient.get<ApiResponse<Dispute>>(`/student/disputes/${id}`).then(r => r.data),
  fileDispute:   (p: { scriptId: string; questionNumber: number; reason: string }) => apiClient.post<ApiResponse<Dispute>>('/student/disputes', p).then(r => r.data),
  getNotifications:        (page = 1) => apiClient.get<PaginatedResponse<Notification>>('/student/notifications', { params: { page } }).then(r => r.data),
  markNotificationRead:    (id: string) => apiClient.patch<ApiResponse<null>>(`/student/notifications/${id}/read`).then(r => r.data),
  markAllNotificationsRead: () => apiClient.patch<ApiResponse<null>>('/student/notifications/read-all').then(r => r.data),
  getDashboard:  () => apiClient.get<ApiResponse<{ recentScripts: EvaluatedScript[]; pendingDisputes: number; averageScore: number; totalExams: number; unreadNotifications: number }>>('/student/dashboard').then(r => r.data),
  changePassword: (p: { currentPassword: string; newPassword: string }) => apiClient.post<ApiResponse<null>>('/student/change-password', p).then(r => r.data),
};
──────────────────────────────────────────────────────────────────────────── */
