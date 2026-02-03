/**
 * Auth Constants - ثوابت المصادقة
 *
 * المركز الرئيسي لجميع الثوابت المتعلقة بالمصادقة والأدوار و
 */

import { UserRole } from '../types/auth.types'

/**
 * أدوار المستخدمين
 */
export const ROLES: Record<string, UserRole> = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
  PARENT: 'parent',
  MODERATOR: 'moderator',
  DEVELOPER: 'developer',
  GUEST: 'guest',
} as const

/**
 * مستويات الوصول (Hierarchy)
 */
export const ROLE_LEVELS: Record<UserRole, number> = {
  guest: 0,
  student: 1,
  parent: 1,
  teacher: 2,
  moderator: 3,
  admin: 4,
  developer: 5,
} as const

/**
 * مفاتيح التخزين
 */
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  AUTH_STORE: 'auth-storage',
} as const

/**
 * حالات التهيئة
 */
export const AUTH_INITIAL_STATE = {
  IS_INITIALIZED: false,
  IS_LOADING: false,
  IS_AUTHENTICATED: false,
} as const

/**
 * إعدادات المصادقة (AUTH_CONFIG)
 */
export const AUTH_CONFIG = {
  VALIDATION: {
    EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 50,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
  },
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  DEFAULT_SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  ERROR_MESSAGES: {
    UNKNOWN_ERROR: 'حدث خطأ غير معروف',
  },
} as const
