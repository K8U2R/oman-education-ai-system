/**
 * Moderator Routes - مسارات المشرف
 *
 * مسارات خاصة بالمشرفين (Support Security)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { ProtectedRoute } from '../../guards'
import { moderatorMetadata } from './metadata/moderator.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const QuickActionsPage = lazy(() => import('../../../pages/support/security/QuickActionsPage'))
const UserSupportPage = lazy(() => import('../../../pages/support/security/UserSupportPage'))

export const moderatorRoutes: RouteConfig[] = [
  {
    path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
    element: (
      <ProtectedRoute requiredRole="moderator">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <QuickActionsPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: moderatorMetadata[ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS],
  },
  {
    path: ROUTES.SUPPORT_SECURITY_USER_SUPPORT_PATTERN,
    element: (
      <ProtectedRoute requiredRole="moderator">
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <UserSupportPage />
          </React.Suspense>
        </MainLayout>
      </ProtectedRoute>
    ),
    metadata: moderatorMetadata[ROUTES.SUPPORT_SECURITY_USER_SUPPORT],
  },
]
