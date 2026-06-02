/**
 * Admin API — currently backed by mock data.
 * To switch to real backend: replace `mockAdmin` with the real implementations below.
 */

import { mockAdmin } from '../mocks';

export const adminApi = mockAdmin;

/* ── Real implementation (restore when api.askd.in is live) ──────────────────
import { apiClient } from './client';
import type { Semester, Course, CourseOffering, AdminStudent, GradeResult, Communication, DashboardStats } from '../types/admin';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const adminApi = {
  getDashboard:       () => apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard').then(r => r.data),
  getSemesters:       () => apiClient.get<ApiResponse<Semester[]>>('/admin/semesters').then(r => r.data),
  getSemester:        (id: string) => apiClient.get<ApiResponse<Semester>>(`/admin/semesters/${id}`).then(r => r.data),
  createSemester:     (p: Omit<Semester, 'id' | 'totalCourses' | 'totalStudents'>) => apiClient.post<ApiResponse<Semester>>('/admin/semesters', p).then(r => r.data),
  updateSemester:     (id: string, p: Partial<Semester>) => apiClient.patch<ApiResponse<Semester>>(`/admin/semesters/${id}`, p).then(r => r.data),
  getCourses:         (semesterId?: string) => apiClient.get<ApiResponse<Course[]>>('/admin/courses', { params: { semesterId } }).then(r => r.data),
  createCourse:       (p: Omit<Course, 'id'>) => apiClient.post<ApiResponse<Course>>('/admin/courses', p).then(r => r.data),
  getOfferings:       (semesterId?: string) => apiClient.get<ApiResponse<CourseOffering[]>>('/admin/offerings', { params: { semesterId } }).then(r => r.data),
  createOffering:     (p: Omit<CourseOffering, 'id' | 'courseName' | 'teacherName' | 'batchName'>) => apiClient.post<ApiResponse<CourseOffering>>('/admin/offerings', p).then(r => r.data),
  getStudents:        (page = 1, search?: string) => apiClient.get<PaginatedResponse<AdminStudent>>('/admin/students', { params: { page, search } }).then(r => r.data),
  getStudent:         (id: string) => apiClient.get<ApiResponse<AdminStudent>>(`/admin/students/${id}`).then(r => r.data),
  updateStudent:      (id: string, p: Partial<AdminStudent>) => apiClient.patch<ApiResponse<AdminStudent>>(`/admin/students/${id}`, p).then(r => r.data),
  getGrades:          (semesterId?: string, page = 1) => apiClient.get<PaginatedResponse<GradeResult>>('/admin/grades', { params: { semesterId, page } }).then(r => r.data),
  getCommunications:  () => apiClient.get<ApiResponse<Communication[]>>('/admin/communications').then(r => r.data),
  sendCommunication:  (p: Omit<Communication, 'id' | 'sentAt' | 'sentBy'>) => apiClient.post<ApiResponse<Communication>>('/admin/communications', p).then(r => r.data),
  changePassword:     (p: { currentPassword: string; newPassword: string }) => apiClient.post<ApiResponse<null>>('/admin/change-password', p).then(r => r.data),
};
──────────────────────────────────────────────────────────────────────────── */
