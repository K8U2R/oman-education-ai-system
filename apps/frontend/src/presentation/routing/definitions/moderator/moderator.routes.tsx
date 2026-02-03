/**
 * Moderator Routes - مسارات المشرف
 *
 * مسارات خاصة بالمشرفين (Support Security)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import DashboardLayout from '@/presentation/layouts/DashboardLayout'
import { ProtectedRoute } from '@/features/user-authentication-management'
import { moderatorMetadata } from './moderator.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const QuickActionsPage = lazy(() => import('@/presentation/pages/support/security/QuickActionsPage'))
const UserSupportPage = lazy(() => import('@/presentation/pages/support/security/UserSupportPage'))

export const moderatorRoutes: RouteConfig[] = [
  {
    path: ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS,
    element: (
      <ProtectedRoute requiredRole="moderator">
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <QuickActionsPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: moderatorMetadata[ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS],
  },
  {
    path: ROUTES.SUPPORT_SECURITY_USER_SUPPORT_PATTERN,
    element: (
      <ProtectedRoute requiredRole="moderator">
        <DashboardLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <UserSupportPage />
          </React.Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    ),
    metadata: moderatorMetadata[ROUTES.SUPPORT_SECURITY_USER_SUPPORT],
  },
]
