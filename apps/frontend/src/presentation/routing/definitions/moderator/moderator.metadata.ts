/**
 * Moderator Routes Metadata - بيانات مسارات المشرف
 *
 * Metadata للمسارات الخاصة بالمشرفين (Support Security)
 */

import { RouteMetadata } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Zap, User } from 'lucide-react'

export const moderatorMetadata: Record<string, RouteMetadata> = {
  [ROUTES.SUPPORT_SECURITY_QUICK_ACTIONS]: {
    title: 'الإجراءات السريعة',
    description: 'أدوات سريعة لحل المشاكل وإدارة المستخدمين',
    requiresAuth: true,
    requiredRole: 'moderator',
    breadcrumb: 'الإجراءات السريعة',
    icon: Zap,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.SUPPORT_SECURITY_USER_SUPPORT]: {
    title: 'دعم المستخدم',
    description: 'عرض وإدارة معلومات المستخدم وجلساته',
    requiresAuth: true,
    requiredRole: 'moderator',
    breadcrumb: 'دعم المستخدم',
    icon: User,
    layout: 'main',
    showInNav: false,
  },
}
