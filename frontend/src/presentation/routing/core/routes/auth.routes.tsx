/**
 * Auth Routes - مسارات المصادقة
 *
 * مسارات تسجيل الدخول والتسجيل و OAuth
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import AuthLayout from '../../../layouts/AuthLayout'
import { PublicRoute } from '../../guards'
import { authMetadata } from './metadata/auth.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const LoginPage = lazy(() => import('../../../pages/LoginPage'))
const RegisterPage = lazy(() => import('../../../pages/RegisterPage'))
const OAuthCallback = lazy(() => import('../../OAuthCallback'))

export const authRoutes: RouteConfig[] = [
  {
    path: ROUTES.OAUTH_CALLBACK,
    element: (
      <PublicRoute>
        <React.Suspense fallback={<DefaultRouteLoader />}>
          <OAuthCallback />
        </React.Suspense>
      </PublicRoute>
    ),
    metadata: {
      title: 'معالجة تسجيل الدخول',
      requiresAuth: false,
      layout: 'minimal',
      showInNav: false,
    },
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <AuthLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <LoginPage />
          </React.Suspense>
        </AuthLayout>
      </PublicRoute>
    ),
    metadata: authMetadata[ROUTES.LOGIN],
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <PublicRoute>
        <AuthLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <RegisterPage />
          </React.Suspense>
        </AuthLayout>
      </PublicRoute>
    ),
    metadata: authMetadata[ROUTES.REGISTER],
  },
]
