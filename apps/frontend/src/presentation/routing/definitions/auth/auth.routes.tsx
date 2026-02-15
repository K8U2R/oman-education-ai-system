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

import { Login } from '@/presentation/pages/auth/Login/Login.index'
import { Register } from '@/presentation/pages/auth/Register/Register.index'
import { ForgotPassword } from '@/presentation/pages/auth/ForgotPassword/ForgotPassword.index'
import { VerifyEmail } from '@/presentation/pages/auth/VerifyEmail/VerifyEmail.index'
import { AuthSuccess } from '@/presentation/pages/auth/AuthSuccess/AuthSuccess.index'
import { OAuthCallback } from '@/presentation/pages/auth/OAuthCallback/OAuthCallback.index'

import { PublicLayout } from '@/presentation/layouts/PublicLayout'

export const authRoutes: RouteConfig[] = [
  {
    path: ROUTES.OAUTH_SUCCESS,
    element: (
      <PublicRoute>
        <PublicLayout>
          <React.Suspense fallback={<DefaultRouteLoader />}>
            <AuthSuccess />
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
              <Login />
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
              <ForgotPassword />
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
              <Register />
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
              <VerifyEmail />
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
