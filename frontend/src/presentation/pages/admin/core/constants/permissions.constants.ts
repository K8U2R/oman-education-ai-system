/**
 * Admin Permissions Constants - ثوابت صلاحيات Admin
 *
 * جميع صلاحيات Admin في مكان واحد لسهولة الصيانة
 */

import type { Permission } from '@/domain/types/auth.types'

/**
 * جميع صلاحيات Admin منظمة حسب الفئة
 */
export const ADMIN_PERMISSIONS = {
  USERS: {
    VIEW: 'users.view' as Permission,
    CREATE: 'users.create' as Permission,
    UPDATE: 'users.update' as Permission,
    DELETE: 'users.delete' as Permission,
    MANAGE: 'users.manage' as Permission,
  },
  LESSONS: {
    VIEW: 'lessons.view' as Permission,
    CREATE: 'lessons.create' as Permission,
    UPDATE: 'lessons.update' as Permission,
    DELETE: 'lessons.delete' as Permission,
    MANAGE: 'lessons.manage' as Permission,
  },
  ADMIN: {
    DASHBOARD: 'admin.dashboard' as Permission,
    USERS: 'admin.users' as Permission,
    SETTINGS: 'admin.settings' as Permission,
    REPORTS: 'admin.reports' as Permission,
  },
  DATABASE_CORE: {
    VIEW: 'database-core.view' as Permission,
    METRICS_VIEW: 'database-core.metrics.view' as Permission,
    CONNECTIONS_MANAGE: 'database-core.connections.manage' as Permission,
    CACHE_MANAGE: 'database-core.cache.manage' as Permission,
    EXPLORE: 'database-core.explore' as Permission,
    QUERY_EXECUTE: 'database-core.query.execute' as Permission,
    TRANSACTIONS_VIEW: 'database-core.transactions.view' as Permission,
    AUDIT_VIEW: 'database-core.audit.view' as Permission,
    BACKUPS_MANAGE: 'database-core.backups.manage' as Permission,
    MIGRATIONS_MANAGE: 'database-core.migrations.manage' as Permission,
  },
  WHITELIST: {
    VIEW: 'whitelist.view' as Permission,
    CREATE: 'whitelist.create' as Permission,
    UPDATE: 'whitelist.update' as Permission,
    DELETE: 'whitelist.delete' as Permission,
    MANAGE: 'whitelist.manage' as Permission,
  },
  SYSTEM: {
    VIEW: 'system.view' as Permission,
    MANAGE: 'system.manage' as Permission,
    SETTINGS: 'system.settings' as Permission,
  },
} as const

/**
 * الحصول على جميع صلاحيات Admin
 */
export function getAllAdminPermissions(): Permission[] {
  return Object.values(ADMIN_PERMISSIONS).flatMap(category => Object.values(category))
}

/**
 * الحصول على صلاحيات فئة محددة
 */
export function getPermissionsByCategory(category: keyof typeof ADMIN_PERMISSIONS): Permission[] {
  return Object.values(ADMIN_PERMISSIONS[category])
}
