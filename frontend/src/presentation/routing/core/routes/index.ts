/**
 * Routes Index - فهرس المسارات
 *
 * يجمع جميع المسارات و metadata ويصدرهما
 */

import { RouteConfig } from '../../types'
import { publicRoutes } from '../../definitions/public/public.routes'
import { authRoutes } from '../../definitions/auth/auth.routes'
import { studentRoutes } from '../../definitions/student/student.routes'
import { teacherRoutes } from '../../definitions/teacher/teacher.routes'
import { adminRoutes } from '../../definitions/admin/admin.routes'
import { moderatorRoutes } from '../../definitions/moderator/moderator.routes'
import { sharedRoutes } from '../../definitions/shared/shared.routes'
import { errorRoutes } from '../../definitions/error/error.routes'
import { mastermindRoutes } from '../../definitions/mastermind/mastermind.routes'

// Metadata
import { publicMetadata } from '../../definitions/public/public.metadata'
import { authMetadata } from '../../definitions/auth/auth.metadata'
import { studentMetadata } from '../../definitions/student/student.metadata'
import { teacherMetadata } from '../../definitions/teacher/teacher.metadata'
import { adminMetadata } from '../../definitions/admin/admin.metadata'
import { moderatorMetadata } from '../../definitions/moderator/moderator.metadata'
import { sharedMetadata } from '../../definitions/shared/shared.metadata'
import { errorMetadata } from '../../definitions/error/error.metadata'

/**
 * All Routes - جميع المسارات
 */
export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...authRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...adminRoutes,
  ...moderatorRoutes,
  ...sharedRoutes,
  ...errorRoutes,
  ...mastermindRoutes,
]

/**
 * Route Metadata - بيانات المسارات
 */
export const routeMetadata = {
  ...publicMetadata,
  ...authMetadata,
  ...studentMetadata,
  ...teacherMetadata,
  ...adminMetadata,
  ...moderatorMetadata,
  ...sharedMetadata,
  ...errorMetadata,
}
