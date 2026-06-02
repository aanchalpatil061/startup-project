import { apiClient } from './client';
import type { Semester, Course, CourseOffering, AdminStudent, GradeResult, Communication, DashboardStats } from '../types/admin';
import type { ApiResponse, PaginatedResponse } from '../types/api';

export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard').then((r) => r.data),

  // Semesters
  getSemesters: () =>
    apiClient.get<ApiResponse<Semester[]>>('/admin/semesters').then((r) => r.data),

  getSemester: (id: string) =>
    apiClient.get<ApiResponse<Semester>>(`/admin/semesters/${id}`).then((r) => r.data),

  createSemester: (payload: Omit<Semester, 'id' | 'totalCourses' | 'totalStudents'>) =>
    apiClient.post<ApiResponse<Semester>>('/admin/semesters', payload).then((r) => r.data),

  updateSemester: (id: string, payload: Partial<Semester>) =>
    apiClient.patch<ApiResponse<Semester>>(`/admin/semesters/${id}`, payload).then((r) => r.data),

  // Courses
  getCourses: (semesterId?: string) =>
    apiClient.get<ApiResponse<Course[]>>('/admin/courses', { params: { semesterId } }).then((r) => r.data),

  createCourse: (payload: Omit<Course, 'id'>) =>
    apiClient.post<ApiResponse<Course>>('/admin/courses', payload).then((r) => r.data),

  // Offerings
  getOfferings: (semesterId?: string) =>
    apiClient.get<ApiResponse<CourseOffering[]>>('/admin/offerings', { params: { semesterId } }).then((r) => r.data),

  createOffering: (payload: Omit<CourseOffering, 'id' | 'courseName' | 'teacherName' | 'batchName'>) =>
    apiClient.post<ApiResponse<CourseOffering>>('/admin/offerings', payload).then((r) => r.data),

  // Students
  getStudents: (page = 1, search?: string) =>
    apiClient.get<PaginatedResponse<AdminStudent>>('/admin/students', { params: { page, search } }).then((r) => r.data),

  getStudent: (id: string) =>
    apiClient.get<ApiResponse<AdminStudent>>(`/admin/students/${id}`).then((r) => r.data),

  updateStudent: (id: string, payload: Partial<AdminStudent>) =>
    apiClient.patch<ApiResponse<AdminStudent>>(`/admin/students/${id}`, payload).then((r) => r.data),

  // Grades
  getGrades: (semesterId?: string, page = 1) =>
    apiClient.get<PaginatedResponse<GradeResult>>('/admin/grades', { params: { semesterId, page } }).then((r) => r.data),

  // Communications
  getCommunications: () =>
    apiClient.get<ApiResponse<Communication[]>>('/admin/communications').then((r) => r.data),

  sendCommunication: (payload: Omit<Communication, 'id' | 'sentAt' | 'sentBy'>) =>
    apiClient.post<ApiResponse<Communication>>('/admin/communications', payload).then((r) => r.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    apiClient.post<ApiResponse<null>>('/admin/change-password', payload).then((r) => r.data),
};
