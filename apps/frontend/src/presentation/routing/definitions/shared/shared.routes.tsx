/**
 * Shared Routes - المسارات المشتركة
 *
 * مسارات مشتركة بين جميع المستخدمين (Profile, Settings, Subscription, User Security)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import DashboardLayout from '@/presentation/layouts/DashboardLayout'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { sharedMetadata } from './shared.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const ProfilePage = lazy(() => import('@/presentation/pages/user/profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/presentation/pages/user/settings/SettingsPage'))
const SubscriptionPage = lazy(() => import('@/presentation/pages/user/subscription/SubscriptionPage'))
const UserSecuritySettingsPage = lazy(
  () => import('@/presentation/pages/user/security/UserSecuritySettingsPage')
)

export const sharedRoutes: RouteConfig[] = [
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProfilePage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.PROFILE],
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SettingsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.SETTINGS],
  },
  {
    path: ROUTES.SUBSCRIPTION,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SubscriptionPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.SUBSCRIPTION],
  },
  {
    path: ROUTES.USER_SECURITY_SETTINGS,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <UserSecuritySettingsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.USER_SECURITY_SETTINGS],
  },
]
