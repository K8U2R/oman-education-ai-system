import { lazy } from 'react'

// Core Admin Pages
export const AdminDashboardPage = lazy(
  () => import('@/presentation/pages/admin/AdminDashboard/AdminDashboard').then(module => ({ default: module.AdminDashboard }))
)
export const UsersManagementPage = lazy(
  () => import('@/presentation/pages/admin/UsersManagement/UsersManagement').then(module => ({ default: module.UsersManagement }))
)
export const WhitelistManagementPage = lazy(
  () => import('@/presentation/pages/admin/WhitelistManagement/WhitelistManagement').then(module => ({ default: module.WhitelistManagement }))
)
export const DeveloperDashboardPage = lazy(
  () => import('@/presentation/pages/admin/DeveloperDashboard/DeveloperDashboard').then(module => ({ default: module.DeveloperDashboard }))
)

// Security Pages
export const SecurityDashboardPage = lazy(
  () => import('@/presentation/pages/admin/SecurityDashboard/SecurityDashboard').then(module => ({ default: module.SecurityDashboard }))
)
export const SessionsManagementPage = lazy(
  () => import('@/presentation/pages/admin/SessionsManagement/SessionsManagement').then(module => ({ default: module.SessionsManagement }))
)
export const SecurityLogsPage = lazy(
  () => import('@/presentation/pages/admin/SecurityLogs/SecurityLogs').then(module => ({ default: module.SecurityLogs }))
)
export const SecuritySettingsPage = lazy(
  () => import('@/presentation/pages/admin/SecuritySettings/SecuritySettings').then(module => ({ default: module.SecuritySettings }))
)
export const RouteProtectionPage = lazy(
  () => import('@/presentation/pages/admin/RouteProtection/RouteProtection').then(module => ({ default: module.RouteProtection }))
)

// Developer Security Pages
export const SecurityAnalyticsPage = lazy(
  () => import('@/presentation/pages/developer/security/SecurityAnalyticsPage')
)
export const SecurityMonitoringPage = lazy(
  () => import('@/presentation/pages/developer/security/SecurityMonitoringPage')
)

// Analytics Pages
export const ErrorDashboardPage = lazy(
  () => import('@/presentation/pages/admin/ErrorDashboard/ErrorDashboard').then(module => ({ default: module.ErrorDashboard }))
)
export const PerformanceDashboardPage = lazy(
  () => import('@/presentation/pages/admin/PerformanceDashboard/PerformanceDashboard').then(module => ({ default: module.PerformanceDashboard }))
)

// Database Core Pages
export const DatabaseCoreDashboardPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseCoreDashboard/DatabaseCoreDashboard').then(module => ({ default: module.DatabaseCoreDashboard }))
)
export const PerformancePage = lazy(
  () => import('@/presentation/pages/admin/DatabasePerformance/DatabasePerformance').then(module => ({ default: module.DatabasePerformance }))
)
export const ConnectionsPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseConnections/DatabaseConnections').then(module => ({ default: module.DatabaseConnections }))
)
export const CachePage = lazy(
  () => import('@/presentation/pages/admin/DatabaseCache/DatabaseCache').then(module => ({ default: module.DatabaseCache }))
)
export const DatabaseExplorerPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseExplorer/DatabaseExplorer').then(module => ({ default: module.DatabaseExplorer }))
)
export const QueryBuilderPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseQueryBuilder/DatabaseQueryBuilder').then(module => ({ default: module.DatabaseQueryBuilder }))
)
export const TransactionsPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseTransactions/DatabaseTransactions').then(module => ({ default: module.DatabaseTransactions }))
)
export const AuditLogsPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseAuditLogs/DatabaseAuditLogs').then(module => ({ default: module.DatabaseAuditLogs }))
)
export const BackupsPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseBackups/DatabaseBackups').then(module => ({ default: module.DatabaseBackups }))
)
export const MigrationsPage = lazy(
  () => import('@/presentation/pages/admin/DatabaseMigrations/DatabaseMigrations').then(module => ({ default: module.DatabaseMigrations }))
)

// Feature Modules
export * from './modules/security'
