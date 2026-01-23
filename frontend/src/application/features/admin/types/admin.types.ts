/**
 * Admin Types - أنواع الإدارة
 *
 * @description أنواع TypeScript الخاصة بميزة الإدارة
 * تجميع جميع الأنواع من Service
 */

// Re-export from Service
import type {
  SystemStats,
  UserStats,
  ContentStats,
  UsageStats,
  AdminUserInfo,
  UpdateUserRequest,
  SearchUsersRequest,
} from '../services/admin.service'

export type {
  SystemStats,
  UserStats,
  ContentStats,
  UsageStats,
  AdminUserInfo,
  UpdateUserRequest,
  SearchUsersRequest,
}

// Application-specific Types

/**
 * حالة تحميل الإدارة
 */
export type AdminLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * حالة صحة النظام
 */
export type SystemHealthStatus = 'healthy' | 'warning' | 'error'

/**
 * حالة قاعدة البيانات
 */
export type DatabaseStatus = 'connected' | 'disconnected'

/**
 * حالة الخادم
 */
export type ServerStatus = 'active' | 'inactive'

/**
 * معلومات نشاط المستخدم
 */
export interface UserActivity {
  userId: string
  email: string
  lastLogin?: string
  loginCount: number
  lastActivity?: string
  endpointsUsed: string[]
  totalRequests: number
}

/**
 * إحصائيات شاملة للإدارة
 */
export interface AdminDashboardStats {
  system: SystemStats
  users: UserStats
  content: ContentStats
  usage: UsageStats
}

/**
 * خيارات البحث عن المستخدمين
 */
export interface SearchUsersOptions {
  query?: string
  role?: string
  isActive?: boolean
  isVerified?: boolean
  page?: number
  perPage?: number
}

/**
 * نتيجة البحث عن المستخدمين
 */
export interface SearchUsersResult {
  users: AdminUserInfo[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

/**
 * خطأ الإدارة
 */
export interface AdminError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}
