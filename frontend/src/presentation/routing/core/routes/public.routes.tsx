/**
 * Public Routes - المسارات العامة
 *
 * مسارات عامة لا تحتاج مصادقة
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { PublicRoute } from '../../guards'
import { publicMetadata } from './metadata/public.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const HomePage = lazy(() => import('../../../pages/HomePage'))
const TermsPage = lazy(() => import('../../../pages/TermsPage'))
const PrivacyPolicyPage = lazy(() => import('../../../pages/PrivacyPolicyPage'))

export const publicRoutes: RouteConfig[] = [
  {
    path: ROUTES.HOME,
    element: (
      <PublicRoute allowAuthenticated={false}>
        <MainLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <HomePage />
          </React.Suspense>
        </MainLayout>
      </PublicRoute>
    ),
    metadata: publicMetadata[ROUTES.HOME],
  },
  {
    path: ROUTES.TERMS,
    element: (
      <MainLayout>
        <React.Suspense fallback={<DefaultRouteLoader />}>
          <TermsPage />
        </React.Suspense>
      </MainLayout>
    ),
    metadata: publicMetadata[ROUTES.TERMS],
  },
  {
    path: ROUTES.PRIVACY,
    element: (
      <MainLayout>
        <React.Suspense fallback={<DefaultRouteLoader />}>
          <PrivacyPolicyPage />
        </React.Suspense>
      </MainLayout>
    ),
    metadata: publicMetadata[ROUTES.PRIVACY],
  },
]
