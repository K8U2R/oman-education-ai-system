/**
 * Admin Routes - مسارات المسؤول
 *
 * مسارات خاصة بالمسؤولين والمطورين
 */

import React from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '@/presentation/layouts/MainLayout'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { adminMetadata } from './admin.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Internal Feature Page
import { KnowledgePage } from '@/presentation/pages/admin/KnowledgePage';

// Feature Imports (Sovereign Architecture)
import {
  AdminDashboardPage,
  UsersManagementPage,
  WhitelistManagementPage,
  DeveloperDashboardPage,
  SecurityDashboardPage,
  SessionsManagementPage,
  SecurityLogsPage,
  SecuritySettingsPage,
  RouteProtectionPage,
  SecurityAnalyticsPage,
  SecurityMonitoringPage,
  ErrorDashboardPage,
  PerformanceDashboardPage,
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
} from '@/features/system-administration-portal'

export const adminRoutes: RouteConfig[] = [
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AdminDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DASHBOARD],
  },
  {
    path: ROUTES.ADMIN_KNOWLEDGE,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <KnowledgePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: {
      title: 'إدارة المعرفة',
      description: 'تغذية الذكاء الاصطناعي بالمصادر',
    },
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <UsersManagementPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_USERS],
  },
  {
    path: ROUTES.ADMIN_WHITELIST,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['whitelist.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <WhitelistManagementPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_WHITELIST],
  },
  {
    path: ROUTES.DEVELOPER_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="developer">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <DeveloperDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.DEVELOPER_DASHBOARD],
  },
  // Admin Security Routes
  {
    path: ROUTES.ADMIN_SECURITY_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SecurityDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_SECURITY_DASHBOARD],
  },
  {
    path: ROUTES.ADMIN_SECURITY_SESSIONS,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SessionsManagementPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_SECURITY_SESSIONS],
  },
  {
    path: ROUTES.ADMIN_SECURITY_LOGS,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SecurityLogsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_SECURITY_LOGS],
  },
  {
    path: ROUTES.ADMIN_SECURITY_SETTINGS,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SecuritySettingsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_SECURITY_SETTINGS],
  },
  {
    path: ROUTES.ADMIN_SECURITY_ROUTES,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <RouteProtectionPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_SECURITY_ROUTES],
  },
  // Developer Security Routes
  {
    path: ROUTES.DEVELOPER_SECURITY_ANALYTICS,
    element: (
      <ProtectedRoute requiredRole="developer">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SecurityAnalyticsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.DEVELOPER_SECURITY_ANALYTICS],
  },
  {
    path: ROUTES.DEVELOPER_SECURITY_MONITORING,
    element: (
      <ProtectedRoute requiredRole="developer">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SecurityMonitoringPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.DEVELOPER_SECURITY_MONITORING],
  },
  // Analytics Routes
  {
    path: ROUTES.ADMIN_ANALYTICS_ERRORS,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ErrorDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_ANALYTICS_ERRORS],
  },
  {
    path: ROUTES.ADMIN_ANALYTICS_PERFORMANCE,
    element: (
      <ProtectedRoute requiredRole="admin">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <PerformanceDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_ANALYTICS_PERFORMANCE],
  },
  // Database Core Routes
  {
    path: ROUTES.ADMIN_DATABASE_CORE_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <DatabaseCoreDashboardPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_DASHBOARD],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_PERFORMANCE,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.metrics.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <PerformancePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_PERFORMANCE],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_CONNECTIONS,
    element: (
      <ProtectedRoute
        requiredRole="admin"
        requiredPermissions={['database-core.connections.manage']}
      >
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ConnectionsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_CONNECTIONS],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_CACHE,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.cache.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <CachePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_CACHE],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_EXPLORER,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.explore']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <DatabaseExplorerPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_EXPLORER],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_QUERY_BUILDER,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.query.execute']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <QueryBuilderPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_QUERY_BUILDER],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_TRANSACTIONS,
    element: (
      <ProtectedRoute
        requiredRole="admin"
        requiredPermissions={['database-core.transactions.view']}
      >
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <TransactionsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_TRANSACTIONS],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_AUDIT,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.audit.view']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AuditLogsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_AUDIT],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_BACKUPS,
    element: (
      <ProtectedRoute requiredRole="admin" requiredPermissions={['database-core.backups.manage']}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <BackupsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_BACKUPS],
  },
  {
    path: ROUTES.ADMIN_DATABASE_CORE_MIGRATIONS,
    element: (
      <ProtectedRoute
        requiredRole="admin"
        requiredPermissions={['database-core.migrations.manage']}
      >
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <MigrationsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: adminMetadata[ROUTES.ADMIN_DATABASE_CORE_MIGRATIONS],
  },
]
