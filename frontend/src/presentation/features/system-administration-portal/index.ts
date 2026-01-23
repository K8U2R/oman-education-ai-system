import { lazy } from 'react'

// Core Admin Pages
export const AdminDashboardPage = lazy(
  () => import('@/presentation/pages/admin/AdminDashboardPage')
)
export const UsersManagementPage = lazy(
  () => import('@/presentation/pages/admin/UsersManagementPage')
)
export const WhitelistManagementPage = lazy(
  () => import('@/presentation/pages/admin/WhitelistManagementPage')
)
export const DeveloperDashboardPage = lazy(
  () => import('@/presentation/pages/admin/DeveloperDashboardPage')
)

// Security Pages
export const SecurityDashboardPage = lazy(
  () => import('@/presentation/pages/admin/features/security/pages/SecurityDashboardPage')
)
export const SessionsManagementPage = lazy(
  () => import('@/presentation/pages/admin/features/security/pages/SessionsManagementPage')
)
export const SecurityLogsPage = lazy(
  () => import('@/presentation/pages/admin/features/security/pages/SecurityLogsPage')
)
export const SecuritySettingsPage = lazy(
  () => import('@/presentation/pages/admin/features/security/pages/SecuritySettingsPage')
)
export const RouteProtectionPage = lazy(
  () => import('@/presentation/pages/admin/features/security/pages/RouteProtectionPage')
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
  () => import('@/presentation/pages/admin/features/analytics/pages/ErrorDashboardPage')
)
export const PerformanceDashboardPage = lazy(
  () => import('@/presentation/pages/admin/features/analytics/pages/PerformanceDashboardPage')
)

// Database Core Pages
export const DatabaseCoreDashboardPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/DatabaseCoreDashboardPage')
)
export const PerformancePage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/PerformancePage')
)
export const ConnectionsPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/ConnectionsPage')
)
export const CachePage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/CachePage')
)
export const DatabaseExplorerPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/DatabaseExplorerPage')
)
export const QueryBuilderPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/QueryBuilderPage')
)
export const TransactionsPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/TransactionsPage')
)
export const AuditLogsPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/AuditLogsPage')
)
export const BackupsPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/BackupsPage')
)
export const MigrationsPage = lazy(
  () => import('@/presentation/pages/admin/features/database-core/pages/MigrationsPage')
)

// Feature Modules
export * from './modules/security'
