/**
 * Project Constants - ثوابت المشاريع
 *
 * @description ثوابت ميزة المشاريع
 */

// API Endpoints (مستوردة من Domain)
export { API_ENDPOINTS } from '@/domain/constants/api.constants'

// Project-specific Configuration
export const PROJECT_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,

  // Projects
  PROJECTS: {
    DEFAULT_PROGRESS_UPDATE_INTERVAL: 30 * 1000, // 30 ثانية
    MAX_TITLE_LENGTH: 200,
    MIN_TITLE_LENGTH: 3,
    MAX_DESCRIPTION_LENGTH: 2000,
    MAX_REQUIREMENTS_COUNT: 50,
  } as const,

  // Progress
  PROGRESS: {
    COMPLETION_THRESHOLD: 100, // 100% يعتبر مكتمل
    UPDATE_INTERVAL: 30 * 1000, // تحديث كل 30 ثانية
  } as const,

  // Cache
  CACHE: {
    PROJECTS_TTL: 5 * 60 * 1000, // 5 دقائق
    PROJECT_TTL: 2 * 60 * 1000, // 2 دقيقة
    PROGRESS_TTL: 30 * 1000, // 30 ثانية
    STATS_TTL: 10 * 60 * 1000, // 10 دقائق
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    PROJECT_NOT_FOUND: 'المشروع غير موجود',
    FAILED_TO_LOAD_PROJECTS: 'فشل تحميل المشاريع',
    FAILED_TO_LOAD_PROJECT: 'فشل تحميل المشروع',
    FAILED_TO_CREATE_PROJECT: 'فشل إنشاء المشروع',
    FAILED_TO_UPDATE_PROJECT: 'فشل تحديث المشروع',
    FAILED_TO_DELETE_PROJECT: 'فشل حذف المشروع',
    FAILED_TO_LOAD_PROGRESS: 'فشل تحميل التقدم',
    INVALID_PROJECT_DATA: 'بيانات المشروع غير صحيحة',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    PROJECT_LOADED: 'تم تحميل المشروع بنجاح',
    PROJECTS_LOADED: 'تم تحميل المشاريع بنجاح',
    PROJECT_CREATED: 'تم إنشاء المشروع بنجاح',
    PROJECT_UPDATED: 'تم تحديث المشروع بنجاح',
    PROJECT_DELETED: 'تم حذف المشروع بنجاح',
    PROGRESS_SAVED: 'تم حفظ التقدم بنجاح',
  } as const,

  // Validation Rules
  VALIDATION: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 2000,
    REQUIREMENTS_MAX_COUNT: 50,
  } as const,
} as const

// Project Types
export const PROJECT_TYPES = {
  EDUCATIONAL: 'educational',
  RESEARCH: 'research',
  ASSIGNMENT: 'assignment',
  PRESENTATION: 'presentation',
} as const

export type ProjectTypeValue = (typeof PROJECT_TYPES)[keyof typeof PROJECT_TYPES]

// Project Status
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const

export type ProjectStatusValue = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS]

// Task Priority
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export type TaskPriorityValue = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY]
