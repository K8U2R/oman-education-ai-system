/**
 * Routing Types - أنواع التوجيه
 *
 * يحتوي هذا الملف على جميع الأنواع (Types) والواجهات (Interfaces) المتعلقة بنظام التوجيه
 * في التطبيق، بما في ذلك بيانات المسارات الوصفية، التكوينات، وعناصر الـ Breadcrumbs.
 */

import React from 'react'
import { UserRole, Permission } from '@/domain/types/auth.types'

/** أنواع الأدوار و المستخدمة في التحكم بالوصول للمسارات */
export type RouteRole = UserRole
export type RoutePermission = Permission

/**
 * بيانات وصفية للمسار (Route Metadata)
 *
 * تُستخدم لتحديد سلوك المسار، التحكم بالوصول، العرض في التنقل،
 * والمعلومات الإضافية مثل العنوان، الوصف، والـ breadcrumb.
 */
export interface RouteMetadata {
  /** عنوان الصفحة (يظهر في <title> أو شريط العنوان) */
  title?: string

  /** وصف الصفحة (لأغراض SEO أو وصف في التنقل) */
  description?: string

  /** هل يتطلب المسار مصادقة المستخدم؟ */
  requiresAuth?: boolean

  /** دور واحد مطلوب للوصول إلى المسار */
  requiredRole?: UserRole

  /** قائمة أدوار، يكفي وجود أحدها للوصول */
  requiredRoles?: UserRole[]

  /** قائمة  المطلوبة للوصول */
  requiredPermissions?: Permission[]

  /** تسمية مخصصة للـ Breadcrumb */
  breadcrumb?: string

  /** أيقونة المسار (تُستخدم في التنقل أو الـ Breadcrumbs) */
  icon?: React.ComponentType<{ className?: string }>

  /** نوع التخطيط (Layout) المستخدم للصفحة */
  layout?: 'main' | 'auth' | 'minimal' | 'docs'

  /** هل يتم عرض المسار في شريط التنقل أو القوائم الرئيسية؟ */
  showInNav?: boolean

  /** ترتيب المسار في القوائم (الأصغر يظهر أولاً) */
  navOrder?: number

  /** هل يجب تحميل المسار مسبقاً (preloading) لتحسين الأداء؟ */
  preload?: boolean

  /** إعدادات التحليلات (Analytics) عند زيارة المسار */
  analytics?: {
    category?: string
    action?: string
  }
}

/**
 * تكوين مسار واحد في نظام التوجيه
 */
export interface RouteConfig {
  /** المسار (path) مثل: '/dashboard' أو '/lessons/:id' */
  path: string

  /** العنصر React المرتبط بالمسار (للـ eager loading) */
  element?: React.ReactElement

  /** بيانات وصفية للمسار */
  metadata?: RouteMetadata

  /** مسارات فرعية (children) لدعم الـ nested routes */
  children?: RouteConfig[]

  /** دالة للتحميل الكسول (lazy loading) - تُستخدم مع React.lazy */
  lazy?: () => Promise<{ default: React.ComponentType<unknown> }>
}

/**
 * عنصر واحد في الـ Breadcrumbs
 *
 * يُستخدم لعرض مسار التنقل الهرمي في أعلى الصفحة
 */
export interface BreadcrumbItem {
  /** التسمية المعروضة */
  label: string

  /** المسار الكامل لهذا العنصر */
  path: string

  /** أيقونة اختيارية تُعرض بجانب التسمية */
  icon?: React.ComponentType<{ className?: string }>
}
