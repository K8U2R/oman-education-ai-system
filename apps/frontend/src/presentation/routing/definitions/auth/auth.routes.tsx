/**
 * Auth Routes - مسارات المصادقة
 *
 * مسارات تسجيل الدخول والتسجيل و OAuth
 */

import React from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { AuthLayout } from '@/presentation/pages/auth/shared'
import { PublicRoute } from '../../guards'
import { authMetadata } from './auth.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
// Feature Imports (Sovereign Architecture)
// Feature Imports (Sovereign Architecture)

import LoginPage from '@/presentation/pages/auth/login/LoginPage'
import RegisterPage from '@/presentation/pages/auth/register/RegisterPage'
import VerifyEmailPage from '@/presentation/pages/auth/verification/VerifyEmailPage'
import AuthSuccessPage from '@/presentation/pages/auth/verification/AuthSuccessPage'
import ForgotPasswordPage from '@/presentation/pages/auth/forgot-password/ForgotPasswordPage'
import OAuthCallback from '@/presentation/pages/auth/callback/OAuthCallbackPage'

import { PublicLayout } from '@/presentation/layouts/PublicLayout'

export const authRoutes: RouteConfig[] = [
  {
    path: ROUTES.OAUTH_SUCCESS,
    element: (
      <PublicRoute>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AuthSuccessPage />
          </React.Suspense>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: {
      title: 'تم تسجيل الدخول',
      requiresAuth: false,
      layout: 'minimal',
      showInNav: false,
    },
  },
  {
    path: ROUTES.OAUTH_CALLBACK,
    element: (
      <PublicRoute>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <OAuthCallback />
          </React.Suspense>
        </PublicLayout>
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
        <PublicLayout>
          <AuthLayout>
            <React.Suspense fallback={<DefaultRouteLoader />}>
              <LoginPage />
            </React.Suspense>
          </AuthLayout>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: authMetadata[ROUTES.LOGIN],
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: (
      <PublicRoute>
        <PublicLayout>
          <AuthLayout>
            <React.Suspense fallback={<DefaultRouteLoader />}>
              <ForgotPasswordPage />
            </React.Suspense>
          </AuthLayout>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: {
      title: 'استعادة كلمة المرور',
      requiresAuth: false,
      layout: 'auth',
      showInNav: false,
    },
  },

  {
    path: ROUTES.REGISTER,
    element: (
      <PublicRoute>
        <PublicLayout>
          <AuthLayout>
            <React.Suspense fallback={<DefaultRouteLoader />}>
              <RegisterPage />
            </React.Suspense>
          </AuthLayout>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: authMetadata[ROUTES.REGISTER],
  },
  {
    path: ROUTES.VERIFY_EMAIL,
    element: (
      <PublicRoute allowAuthenticated={true}>
        <PublicLayout>
          <AuthLayout>
            <React.Suspense fallback={<DefaultRouteLoader />}>
              <VerifyEmailPage />
            </React.Suspense>
          </AuthLayout>
        </PublicLayout>
      </PublicRoute>
    ),
    metadata: {
      title: 'التحقق من البريد الإلكتروني',
      requiresAuth: false,
      layout: 'auth',
      showInNav: false,
    },
  },
]
