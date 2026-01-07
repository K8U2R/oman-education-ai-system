/**
 * Shared Routes - المسارات المشتركة
 *
 * مسارات مشتركة بين جميع المستخدمين (Profile, Settings, Subscription, User Security)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { sharedMetadata } from './metadata/shared.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const ProfilePage = lazy(() => import('../../../pages/user/ProfilePage'))
const SettingsPage = lazy(() => import('../../../pages/user/SettingsPage'))
const SubscriptionPage = lazy(() => import('../../../pages/user/SubscriptionPage'))

export const sharedRoutes: RouteConfig[] = [
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <ProfilePage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.PROFILE],
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SettingsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.SETTINGS],
  },
  {
    path: ROUTES.SUBSCRIPTION,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SubscriptionPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.SUBSCRIPTION],
  },
  {
    path: ROUTES.USER_SECURITY_SETTINGS,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <SettingsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: sharedMetadata[ROUTES.USER_SECURITY_SETTINGS],
  },
]
