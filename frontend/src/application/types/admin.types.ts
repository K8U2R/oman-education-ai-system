/**
 * Admin Types - أنواع الإدارة
 *
 * تعريفات موحدة للأنواع المستخدمة في صفحات الإدارة
 * يقلل التكرار ويوحد التعريفات عبر المشروع
 */

import type { AdminUserInfo, UpdateUserRequest } from '@/application/features/admin/types'

/**
 * Dashboard Stats - إحصائيات لوحة التحكم
 */
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalLessons: number
  systemHealth: 'healthy' | 'warning' | 'error'
}

/**
 * Re-export Admin Types
 */
export type { AdminUserInfo, UpdateUserRequest }
