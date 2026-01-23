/**
 * Error Routes - مسارات الأخطاء
 *
 * صفحات الأخطاء (Unauthorized, Forbidden)
 */

import React, { lazy } from 'react'
import { RouteConfig } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { errorMetadata } from './error.metadata'
import { DefaultRouteLoader } from '@/presentation/components/common'

// Lazy load pages
const UnauthorizedPage = lazy(() =>
  import('@/presentation/pages/errors/pages/UnauthorizedPage').then(module => ({
    default: module.UnauthorizedPage,
  }))
)
const ForbiddenPage = lazy(() =>
  import('@/presentation/pages/errors/pages/ForbiddenPage').then(module => ({
    default: module.ForbiddenPage,
  }))
)
const NotFoundPage = lazy(() =>
  import('@/presentation/pages/errors/pages/NotFoundPage').then(module => ({
    default: module.NotFoundPage,
  }))
)

export const errorRoutes: RouteConfig[] = [
  {
    path: ROUTES.UNAUTHORIZED,
    element: (
      <React.Suspense fallback={<DefaultRouteLoader />}>
        <UnauthorizedPage />
      </React.Suspense>
    ),
    metadata: errorMetadata[ROUTES.UNAUTHORIZED],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: (
      <React.Suspense fallback={<DefaultRouteLoader />}>
        <ForbiddenPage />
      </React.Suspense>
    ),
    metadata: errorMetadata[ROUTES.FORBIDDEN],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <React.Suspense fallback={<DefaultRouteLoader />}>
        <NotFoundPage />
      </React.Suspense>
    ),
    metadata: errorMetadata[ROUTES.NOT_FOUND],
  },
]
