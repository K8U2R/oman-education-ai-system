/**
 * Error Routes Metadata - بيانات مسارات الأخطاء
 *
 * Metadata لصفحات الأخطاء (Unauthorized, Forbidden)
 */

import { RouteMetadata } from '../../../types'
import { ROUTES } from '@/domain/constants/routes.constants'

export const errorMetadata: Record<string, RouteMetadata> = {
  [ROUTES.UNAUTHORIZED]: {
    title: 'غير مصرح',
    description: 'ليس لديك الصلاحيات للوصول إلى هذه الصفحة',
    requiresAuth: false,
    breadcrumb: 'غير مصرح',
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.FORBIDDEN]: {
    title: 'محظور',
    description: 'ليس لديك الصلاحيات للوصول إلى هذا المورد',
    requiresAuth: false,
    breadcrumb: 'محظور',
    layout: 'main',
    showInNav: false,
  },
}
