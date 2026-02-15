/**
 * Admin Pages - صفحات الإدارة
 *
 * تصدير مركزي لجميع صفحات Admin
 * تم تحديثه لدعم الهيكل الجديد
 */

/**
 * Admin Pages - صفحات الإدارة
 *
 * تصدير مركزي لجميع صفحات Admin
 * تم تحديثه لدعم الهيكل الجديد
 */

// Features (الهيكل الجديد)
export { AdminDashboardPage } from './features/dashboard'
export { UsersManagementPage } from './features/users'
export { WhitelistManagementPage } from './features/whitelist'
export { DeveloperDashboardPage } from './features/developer'

// Database Core Feature (الهيكل الجديد - مكتمل ✅)
export {
  DatabaseCoreDashboardPage,
  PerformancePage,
  ConnectionsPage,
  CachePage,
  DatabaseExplorerPage,
  QueryBuilderPage,
  TransactionsPage,
  AuditLogsPage,
  BackupsPage,
  MigrationsPage,
} from './features/database-core'

// Security Feature (الهيكل الجديد - مكتمل ✅)
export {
  SecurityDashboardPage,
  SessionsManagementPage,
  SecurityLogsPage,
  SecuritySettingsPage,
  RouteProtectionPage,
} from './features/security'

// Analytics Feature (الهيكل الجديد - مكتمل ✅)
export { ErrorDashboardPage, PerformanceDashboardPage } from './features/analytics'
