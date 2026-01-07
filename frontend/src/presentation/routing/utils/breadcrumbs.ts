/**
 * Breadcrumbs Utilities - أدوات مساعدة للـ Breadcrumbs
 *
 * وظائف مساعدة لإنشاء وإدارة عناصر التنقل الهرمي (Breadcrumbs)
 * بناءً على المسار الحالي وبيانات وصفية للمسارات.
 */

import { RouteMetadata, BreadcrumbItem } from '../types'
import { ROUTES } from '@/domain/constants/routes.constants'

/**
 * خريطة ثابتة لتسميات الـ Breadcrumbs للمسارات الرئيسية
 */
const routeBreadcrumbMap: Record<string, string> = {
  [ROUTES.HOME]: 'الرئيسية',
  [ROUTES.DASHBOARD]: 'لوحة التحكم',
  [ROUTES.LESSONS]: 'الدروس',
  [ROUTES.STORAGE]: 'التخزين السحابي',
  [ROUTES.PROFILE]: 'الملف الشخصي',
  [ROUTES.SETTINGS]: 'الإعدادات',
  [ROUTES.SUBSCRIPTION]: 'الاشتراك',
  [ROUTES.LOGIN]: 'تسجيل الدخول',
  [ROUTES.REGISTER]: 'إنشاء حساب',
}

/**
 * توليد قائمة الـ Breadcrumbs بناءً على المسار الحالي
 *
 * @param pathname - المسار الحالي (مثل: /lessons/123/unit-1)
 * @param routeMetadata - خريطة بيانات وصفية للمسارات (اختياري)
 * @returns مصفوفة من عناصر الـ Breadcrumb
 */
export const generateBreadcrumbs = (
  pathname: string,
  routeMetadata?: Record<string, RouteMetadata>
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []

  // دائماً إضافة الصفحة الرئيسية كأول عنصر
  breadcrumbs.push({
    label: routeBreadcrumbMap[ROUTES.HOME] ?? 'الرئيسية',
    path: ROUTES.HOME,
  })

  // تقسيم المسار إلى أجزاء (تجاهل الأجزاء الفارغة)
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return breadcrumbs
  }

  let currentPath = ''

  segments.forEach(segment => {
    currentPath += `/${segment}`

    // تجاهل المعلمات الديناميكية (مثل :id أو :slug)
    if (segment.startsWith(':')) {
      return
    }

    // جلب بيانات المسار الوصفية إن وجدت
    const metadata = routeMetadata?.[currentPath]

    // تحديد التسمية: الأولوية لـ metadata → routeBreadcrumbMap → تنسيق الـ segment
    const label =
      metadata?.breadcrumb ?? routeBreadcrumbMap[currentPath] ?? formatSegmentLabel(segment)

    breadcrumbs.push({
      label,
      path: currentPath,
      icon: metadata?.icon,
    })
  })

  return breadcrumbs
}

/**
 * تنسيق جزء من المسار ليصبح تسمية قابلة للعرض
 *
 * مثال: 'my-lessons' → 'دروسي'
 *        'unit-1'     → 'الوحدة 1'
 */
const formatSegmentLabel = (segment: string): string => {
  // إزالة الشرطات وتقسيم الكلمات
  return segment
    .split('-')
    .map(word => {
      // تحويل أول حرف إلى كبير
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1)

      // إضافة ترجمات شائعة إذا أمكن (يمكن توسيع القاموس)
      const commonTranslations: Record<string, string> = {
        unit: 'الوحدة',
        lesson: 'الدرس',
        my: 'دروسي',
        shared: 'المشتركة',
        files: 'الملفات',
        folders: 'المجلدات',
      }

      return commonTranslations[word.toLowerCase()] ?? capitalized
    })
    .join(' ')
}

/**
 * جلب تسمية الـ Breadcrumb لمسار معين
 *
 * @param path - المسار
 * @param metadata - بيانات وصفية للمسار (اختياري)
 * @returns التسمية المناسبة
 */
export const getBreadcrumbLabel = (path: string, metadata?: RouteMetadata): string => {
  return (
    metadata?.breadcrumb ??
    routeBreadcrumbMap[path] ??
    formatSegmentLabel(path.split('/').pop() ?? path)
  )
}
