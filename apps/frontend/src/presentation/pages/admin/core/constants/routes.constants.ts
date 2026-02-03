/**
 * Admin Routes Constants - ثوابت مسارات Admin
 *
 * جميع مسارات صفحات Admin في مكان واحد
 */

/**
 * مسارات صفحات Admin
 */
export const ADMIN_ROUTES = {
  /**
   * Dashboard - لوحة التحكم
   */
  DASHBOARD: '/admin/dashboard',

  /**
   * Users Management - إدارة المستخدمين
   */
  USERS: '/admin/users',

  /**
   * Whitelist Management - إدارة القائمة البيضاء
   */
  WHITELIST: '/admin/whitelist',

  /**
   * Developer Dashboard - لوحة تحكم المطور
   */
  DEVELOPER: '/admin/developer',

  /**
   * Database Core - قاعدة البيانات
   */
  DATABASE_CORE: {
    DASHBOARD: '/admin/database-core',
    CONNECTIONS: '/admin/database-core/connections',
    CACHE: '/admin/database-core/cache',
    EXPLORER: '/admin/database-core/explorer',
    QUERY_BUILDER: '/admin/database-core/query-builder',
    TRANSACTIONS: '/admin/database-core/transactions',
    AUDIT_LOGS: '/admin/database-core/audit-logs',
    BACKUPS: '/admin/database-core/backups',
    MIGRATIONS: '/admin/database-core/migrations',
    PERFORMANCE: '/admin/database-core/performance',
  },

  /**
   * Security - الأمان
   */
  SECURITY: {
    DASHBOARD: '/admin/security',
    SESSIONS: '/admin/security/sessions',
    LOGS: '/admin/security/logs',
    SETTINGS: '/admin/security/settings',
    ROUTE_PROTECTION: '/admin/security/route-protection',
  },

  /**
   * Analytics - التحليلات
   */
  ANALYTICS: {
    ERRORS: '/admin/analytics/errors',
    PERFORMANCE: '/admin/analytics/performance',
  },
} as const
