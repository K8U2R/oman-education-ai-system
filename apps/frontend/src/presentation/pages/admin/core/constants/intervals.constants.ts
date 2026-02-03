/**
 * Admin Refresh Intervals Constants - ثوابت فترات التحديث
 *
 * جميع فترات التحديث التلقائي لصفحات Admin
 */

/**
 * فترات التحديث التلقائي (بالميلي ثانية)
 */
export const ADMIN_REFRESH_INTERVALS = {
  /**
   * Dashboard - لوحة التحكم
   */
  DASHBOARD: 30000, // 30 seconds

  /**
   * Database Core - قاعدة البيانات
   */
  DATABASE_CORE: 5000, // 5 seconds

  /**
   * Security - الأمان
   */
  SECURITY: 10000, // 10 seconds

  /**
   * Analytics - التحليلات
   */
  ANALYTICS: 30000, // 30 seconds

  /**
   * Users Management - إدارة المستخدمين
   */
  USERS: 15000, // 15 seconds

  /**
   * Whitelist - القائمة البيضاء
   */
  WHITELIST: 20000, // 20 seconds

  /**
   * Developer Dashboard - لوحة تحكم المطور
   */
  DEVELOPER: 30000, // 30 seconds
} as const

/**
 * نوع فترات التحديث
 */
export type AdminRefreshInterval = keyof typeof ADMIN_REFRESH_INTERVALS

/**
 * الحصول على فترة تحديث محددة
 */
export function getRefreshInterval(interval: AdminRefreshInterval): number {
  return ADMIN_REFRESH_INTERVALS[interval]
}
