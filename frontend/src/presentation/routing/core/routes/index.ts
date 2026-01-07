/**
 * Routes Index - فهرس المسارات
 *
 * يجمع جميع المسارات و metadata ويصدرهما
 */

import { RouteConfig } from '../../types'
import { publicRoutes } from './public.routes'
import { authRoutes } from './auth.routes'
import { studentRoutes } from './student.routes'
import { teacherRoutes } from './teacher.routes'
import { moderatorRoutes } from './moderator.routes'
import { adminRoutes } from './admin.routes'
import { sharedRoutes } from './shared.routes'
import { errorRoutes } from './error.routes'

import { publicMetadata } from './metadata/public.metadata'
import { authMetadata } from './metadata/auth.metadata'
import { studentMetadata } from './metadata/student.metadata'
import { teacherMetadata } from './metadata/teacher.metadata'
import { moderatorMetadata } from './metadata/moderator.metadata'
import { adminMetadata } from './metadata/admin.metadata'
import { sharedMetadata } from './metadata/shared.metadata'
import { errorMetadata } from './metadata/error.metadata'

/**
 * All Routes - جميع المسارات
 */
export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...moderatorRoutes,
  ...adminRoutes,
  ...sharedRoutes,
  ...errorRoutes,
]

/**
 * Route Metadata - بيانات المسارات
 */
export const routeMetadata = {
  ...publicMetadata,
  ...authMetadata,
  ...studentMetadata,
  ...teacherMetadata,
  ...moderatorMetadata,
  ...adminMetadata,
  ...sharedMetadata,
  ...errorMetadata,
}
