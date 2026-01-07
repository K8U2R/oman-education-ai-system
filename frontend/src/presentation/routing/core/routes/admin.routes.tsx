/**
 * Admin Routes - مسارات المسؤول
 *
 * مسارات خاصة بالمسؤولين والمطورين
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { adminMetadata } from './metadata/admin.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const AdminDashboardPage = lazy(() => import('../../../pages/admin/AdminDashboardPage'))
const UsersManagementPage = lazy(() => import('../../../pages/admin/UsersManagementPage'))
const DeveloperDashboardPage = lazy(() => import('../../../pages/admin/DeveloperDashboardPage'))

// Admin Security Pages
const SecurityDashboardPage = lazy(
  () => import('../../../pages/admin/security/SecurityDashboardPage')
)
const SessionsManagementPage = lazy(
  () => import('../../../pages/admin/security/SessionsManagementPage')
)
const SecurityLogsPage = lazy(() => import('../../../pages/admin/security/SecurityLogsPage'))
const SecuritySettingsPage = lazy(
  () => import('../../../pages/admin/security/SecuritySettingsPage')
)
const RouteProtectionPage = lazy(() => import('../../../pages/admin/security/RouteProtectionPage'))

// Developer Security Pages
const SecurityAnalyticsPage = lazy(
  () => import('../../../pages/developer/security/SecurityAnalyticsPage')
)
const SecurityMonitoringPage = lazy(
  () => import('../../../pages/developer/security/SecurityMonitoringPage')
)

// Analytics Pages
const ErrorDashboardPage = lazy(() => import('../../../pages/admin/analytics/ErrorDashboardPage'))
const PerformanceDashboardPage = lazy(
  () => import('../../../pages/admin/analytics/PerformanceDashboardPage')
)

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
]
