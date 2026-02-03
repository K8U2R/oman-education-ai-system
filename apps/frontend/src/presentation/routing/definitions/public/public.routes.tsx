/**
 * Public Routes - المسارات العامة
 *
 * مسارات عامة لا تحتاج مصادقة
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import PublicLayout from '@/presentation/layouts/PublicLayout'
import { PublicRoute } from '../../guards'
import { publicMetadata } from './public.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const HomePage = lazy(() => import('@/presentation/pages/public/HomePage'))
const TermsPage = lazy(() => import('@/presentation/pages/public/legal/TermsPage'))
const PrivacyPolicyPage = lazy(() => import('@/presentation/pages/public/legal/PrivacyPolicyPage'))

export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: (
      // الصفحة الرئيسية متاحة للجميع بدون مصادقة (مستخدمين مصادق عليهم وغير مصادق عليهم)
      <PublicRoute allowAuthenticated={true}>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <HomePage />
          </React.Suspense>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: publicMetadata[ROUTES.HOME],
  },
  {
    path: ROUTES.TERMS,
    element: (
      <PublicRoute allowAuthenticated={true}>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <TermsPage />
          </React.Suspense>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: publicMetadata[ROUTES.TERMS],
  },
  {
    path: ROUTES.PRIVACY,
    element: (
      <PublicRoute allowAuthenticated={true}>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <PrivacyPolicyPage />
          </React.Suspense>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: publicMetadata[ROUTES.PRIVACY],
  },
]
