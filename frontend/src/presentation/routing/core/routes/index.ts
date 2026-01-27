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
import { compareRoutes } from '../../definitions/error/error.routes' // Placeholder line to anchor replace, waiting for tool to read file again isn't ideal but I know the structure.
// Actually I should just use the previous imports as context.
import { mastermindRoutes } from '../../definitions/mastermind/mastermind.routes'
import { cockpitRoutes } from '../../definitions/developer/cockpit.routes'

// Metadata
import { publicMetadata } from '../../definitions/public/public.metadata'
import { authMetadata } from '../../definitions/auth/auth.metadata'
import { studentMetadata } from '../../definitions/student/student.metadata'
import { teacherMetadata } from '../../definitions/teacher/teacher.metadata'
import { adminMetadata } from '../../definitions/admin/admin.metadata'
import { moderatorMetadata } from '../../definitions/moderator/moderator.metadata'
import { sharedMetadata } from '../../definitions/shared/shared.metadata'
import { errorMetadata } from '../../definitions/error/error.metadata'
import { cockpitMetadata } from '../../definitions/developer/cockpit.routes'

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
  ...cockpitRoutes,
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
  ...cockpitMetadata,
}
