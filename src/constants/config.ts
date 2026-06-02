export const Config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.askd.in',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  TOKEN_KEY: 'askd_auth_token',
  REFRESH_TOKEN_KEY: 'askd_refresh_token',
  USER_KEY: 'askd_user',
  ROLE_KEY: 'askd_role',
  ONBOARDING_KEY: 'askd_onboarded',
  REQUEST_TIMEOUT: 15000,
} as const;

export const BRANCHES = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Chemical',
  'Mathematics & Computing',
] as const;

export const DEPARTMENTS = [
  'Physics',
  'Mathematics',
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Chemical',
] as const;

export const YEARS = ['1st year', '2nd year', '3rd year', '4th year'] as const;

export const SECTIONS = ['A', 'B', 'C', 'D'] as const;

export type UserRole = 'student' | 'teacher' | 'admin';
