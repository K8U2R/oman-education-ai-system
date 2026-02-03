/**
 * Auth Routes Metadata - بيانات مسارات المصادقة
 *
 * Metadata لمسارات تسجيل الدخول والتسجيل
 */

import { RouteMetadata } from '../../types'
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
  [ROUTES.VERIFY_EMAIL]: {
    title: 'التحقق من البريد الإلكتروني',
    description: 'التحقق من بريدك الإلكتروني لتفعيل حسابك',
    requiresAuth: false,
    breadcrumb: 'التحقق من البريد',
    layout: 'auth',
    showInNav: false,
  },
}
