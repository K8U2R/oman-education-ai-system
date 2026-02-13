/**
 * Error Routes Metadata - بيانات مسارات الأخطاء
 *
 * Metadata لصفحات الأخطاء (Unauthorized, Forbidden)
 */

import { RouteMetadata } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'

export const errorMetadata: Record<string, RouteMetadata> = {
  [ROUTES.UNAUTHORIZED]: {
    title: 'غير مصرح',
    description: 'ليس لديك  للوصول إلى هذه الصفحة',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.unauthorized',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.FORBIDDEN]: {
    title: 'محظور',
    description: 'ليس لديك  للوصول إلى هذا المورد',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.forbidden',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.NOT_FOUND]: {
    title: 'الصفحة غير موجودة',
    description: 'الصفحة التي تبحث عنها غير موجودة',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.not_found',
    layout: 'main',
    showInNav: false,
  },
}
