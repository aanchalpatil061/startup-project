import { apiClient } from './client';
import type { Batch, BatchScript, BatchAnalytics, TeacherDispute } from '../types/teacher';
import type { TeacherUser } from '../types/auth';
import type { Notification } from '../types/student';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const teacherApi = {
  getProfile: () =>
    apiClient.get<ApiResponse<TeacherUser>>('/teacher/profile').then((r) => r.data),

  updateProfile: (payload: Partial<Pick<TeacherUser, 'name' | 'avatar'>>) =>
    apiClient.patch<ApiResponse<TeacherUser>>('/teacher/profile', payload).then((r) => r.data),

  getDashboard: () =>
    apiClient
      .get<ApiResponse<{
        activeBatches: number;
        pendingEvaluations: number;
        openDisputes: number;
        recentBatches: Batch[];
        totalStudentsEvaluated: number;
      }>>('/teacher/dashboard')
      .then((r) => r.data),

  getBatches: (page = 1) =>
    apiClient
      .get<PaginatedResponse<Batch>>('/teacher/batches', { params: { page } })
      .then((r) => r.data),

  getBatch: (id: string) =>
    apiClient.get<ApiResponse<Batch>>(`/teacher/batches/${id}`).then((r) => r.data),

  getBatchScripts: (batchId: string, page = 1) =>
    apiClient
      .get<PaginatedResponse<BatchScript>>(`/teacher/batches/${batchId}/scripts`, {
        params: { page },
      })
      .then((r) => r.data),

  getBatchAnalytics: (batchId: string) =>
    apiClient.get<ApiResponse<BatchAnalytics>>(`/teacher/batches/${batchId}/analytics`).then((r) => r.data),

  getDisputes: (page = 1) =>
    apiClient
      .get<PaginatedResponse<TeacherDispute>>('/teacher/disputes', { params: { page } })
      .then((r) => r.data),

  getDispute: (id: string) =>
    apiClient.get<ApiResponse<TeacherDispute>>(`/teacher/disputes/${id}`).then((r) => r.data),

  resolveDispute: (
    id: string,
    payload: { action: 'accept' | 'reject'; revisedMarks?: number; comment: string },
  ) =>
    apiClient.patch<ApiResponse<TeacherDispute>>(`/teacher/disputes/${id}/resolve`, payload).then((r) => r.data),

  getNotifications: (page = 1) =>
    apiClient
      .get<PaginatedResponse<Notification>>('/teacher/notifications', { params: { page } })
      .then((r) => r.data),

  markNotificationRead: (id: string) =>
    apiClient.patch<ApiResponse<null>>(`/teacher/notifications/${id}/read`).then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient.post<ApiResponse<null>>('/teacher/change-password', payload).then((r) => r.data),
};
