/**
 * Public Routes Metadata - بيانات المسارات العامة
 *
 * Metadata للمسارات العامة (غير محمية)
 */

import { RouteMetadata } from '../../types'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Home, FileText, Shield } from 'lucide-react'

export const publicMetadata: Record<string, RouteMetadata> = {
  [ROUTES.HOME]: {
    title: 'الرئيسية - Oman Education AI',
    description: 'نظام التعليم الذكي',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.home',
    icon: Home,
    layout: 'main',
    showInNav: true,
    navOrder: 1,
  },
  [ROUTES.TERMS]: {
    title: 'شروط الاستخدام',
    description: 'شروط استخدام الخدمة',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.terms',
    icon: FileText,
    layout: 'main',
    showInNav: false,
  },
  [ROUTES.PRIVACY]: {
    title: 'سياسة الخصوصية',
    description: 'سياسة الخصوصية',
    requiresAuth: false,
    breadcrumb: 'breadcrumbs.privacy',
    icon: Shield,
    layout: 'main',
    showInNav: false,
  },
}
