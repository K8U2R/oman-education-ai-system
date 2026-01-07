/**
 * Error Routes - مسارات الأخطاء
 *
 * صفحات الأخطاء (Unauthorized, Forbidden)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import MainLayout from '../../../layouts/MainLayout'
import { errorMetadata } from './metadata/error.metadata'
import { DefaultRouteLoader } from '../../../components/common'

// Lazy load pages
const UnauthorizedPage = lazy(() =>
  import('../../../pages/UnauthorizedPage').then(module => ({
    default: module.UnauthorizedPage,
  }))
)
const ForbiddenPage = lazy(() =>
  import('../../../pages/ForbiddenPage').then(module => ({
    default: module.ForbiddenPage,
  }))
)

export const errorRoutes: RouteConfig[] = [
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <MainLayout>
        <React.Suspense fallback={<DefaultRouteLoader />}>
          <UnauthorizedPage />
        </React.Suspense>
      </MainLayout>
    ),
    metadata: errorMetadata[ROUTES.UNAUTHORIZED],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: (
      <MainLayout>
        <React.Suspense fallback={<DefaultRouteLoader />}>
          <ForbiddenPage />
        </React.Suspense>
      </MainLayout>
    ),
    metadata: errorMetadata[ROUTES.FORBIDDEN],
  },
]
