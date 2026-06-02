/**
 * Teacher API — currently backed by mock data.
 * To switch to real backend: replace `mockTeacher` with the real implementations below.
 */

import { mockTeacher } from '../mocks';

export const teacherApi = mockTeacher;

/* ── Real implementation (restore when api.askd.in is live) ──────────────────
import { apiClient } from './client';
import type { Batch, BatchScript, BatchAnalytics, TeacherDispute } from '../types/teacher';
import type { TeacherUser } from '../types/auth';
import type { Notification } from '../types/student';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const teacherApi = {
  getProfile:       () => apiClient.get<ApiResponse<TeacherUser>>('/teacher/profile').then(r => r.data),
  updateProfile:    (p: Partial<Pick<TeacherUser, 'name' | 'avatar'>>) => apiClient.patch<ApiResponse<TeacherUser>>('/teacher/profile', p).then(r => r.data),
  getDashboard:     () => apiClient.get<ApiResponse<{ activeBatches: number; pendingEvaluations: number; openDisputes: number; recentBatches: Batch[]; totalStudentsEvaluated: number }>>('/teacher/dashboard').then(r => r.data),
  getBatches:       (page = 1) => apiClient.get<PaginatedResponse<Batch>>('/teacher/batches', { params: { page } }).then(r => r.data),
  getBatch:         (id: string) => apiClient.get<ApiResponse<Batch>>(`/teacher/batches/${id}`).then(r => r.data),
  getBatchScripts:  (batchId: string, page = 1) => apiClient.get<PaginatedResponse<BatchScript>>(`/teacher/batches/${batchId}/scripts`, { params: { page } }).then(r => r.data),
  getBatchAnalytics:(batchId: string) => apiClient.get<ApiResponse<BatchAnalytics>>(`/teacher/batches/${batchId}/analytics`).then(r => r.data),
  getDisputes:      (page = 1) => apiClient.get<PaginatedResponse<TeacherDispute>>('/teacher/disputes', { params: { page } }).then(r => r.data),
  getDispute:       (id: string) => apiClient.get<ApiResponse<TeacherDispute>>(`/teacher/disputes/${id}`).then(r => r.data),
  resolveDispute:   (id: string, p: { action: 'accept' | 'reject'; revisedMarks?: number; comment: string }) => apiClient.patch<ApiResponse<TeacherDispute>>(`/teacher/disputes/${id}/resolve`, p).then(r => r.data),
  getNotifications: (page = 1) => apiClient.get<PaginatedResponse<Notification>>('/teacher/notifications', { params: { page } }).then(r => r.data),
  markNotificationRead: (id: string) => apiClient.patch<ApiResponse<null>>(`/teacher/notifications/${id}/read`).then(r => r.data),
  changePassword:   (p: { currentPassword: string; newPassword: string }) => apiClient.post<ApiResponse<null>>('/teacher/change-password', p).then(r => r.data),
};
──────────────────────────────────────────────────────────────────────────── */
