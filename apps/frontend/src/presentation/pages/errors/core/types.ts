/**
 * Error Types - أنواع الأخطاء
 *
 * Types و Interfaces لنظام الأخطاء الموحد
 */

import type { LucideIcon } from 'lucide-react'

/**
 * أنواع الأخطاء المتاحة
 */
export type ErrorType =
  | 'forbidden'
  | 'unauthorized'
  | 'not-found'
  | 'server-error'
  | 'network-error'
  | 'maintenance'

/**
 * ألوان الأيقونات
 */
export type ErrorIconColor = 'error' | 'warning' | 'info' | 'success'

/**
 * إعدادات صفحة خطأ
 */
export interface ErrorPageConfig {
  /** نوع الخطأ */
  type: ErrorType
  /** العنوان الرئيسي */
  title: string
  /** الرسالة الأساسية */
  message: string
  /** الرسالة الثانوية */
  secondaryMessage?: string
  /** الأيقونة */
  icon: LucideIcon
  /** لون الأيقونة */
  iconColor: ErrorIconColor
  /** عرض زر تحديث  */
  showRefreshButton?: boolean
  /** عرض زر تسجيل الدخول */
  showLoginButton?: boolean
  /** عرض زر العودة */
  showBackButton?: boolean
  /** عرض زر الصفحة الرئيسية */
  showHomeButton?: boolean
}

/**
 * معلومات الخطأ من API
 */
export interface APIErrorInfo {
  message?: string
  code?: string
  status?: number
  details?: Record<string, unknown>
}

/**
 * معلومات تفصيلية عن الخطأ
 */
export interface ErrorDetails {
  userRole?: string
  requiredRole?: string
  requiredRoles?: string[]
  requiredPermission?: string
  requiredPermissions?: string[]
  userPermissions?: string[]
  routeTitle?: string
  path?: string
  method?: string
  isActive?: boolean
  isVerified?: boolean
  [key: string]: unknown
}
