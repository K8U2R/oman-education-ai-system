/**
 * Auth Routes Metadata - بيانات مسارات المصادقة
 *
 * Metadata لمسارات تسجيل الدخول والتسجيل
 */

import { RouteMetadata } from '../../../types'
import { ROUTES } from '@/domain/constants/routes.constants'

export const authMetadata: Record<string, RouteMetadata> = {
  [ROUTES.LOGIN]: {
    title: 'تسجيل الدخول',
    description: 'تسجيل الدخول إلى حسابك',
    requiresAuth: false,
    breadcrumb: 'تسجيل الدخول',
    layout: 'auth',
    showInNav: false,
  },
  [ROUTES.REGISTER]: {
    title: 'إنشاء حساب',
    description: 'إنشاء حساب جديد',
    requiresAuth: false,
    breadcrumb: 'إنشاء حساب',
    layout: 'auth',
    showInNav: false,
  },
}
