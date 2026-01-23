/**
 * Routing System - نظام التوجيه المركزي
 *
 * تصدير جميع مكونات نظام التوجيه بهيكل خوارزمي منظم
 */

// Guards - حراس المسارات
export * from './guards'

// Middleware - طبقة البرمجيات الوسيطة
export * from './middleware/RouteMiddleware'

// Hooks - خطافات التوجيه
export * from './hooks'

// Components - مكونات التوجيه
export * from './components'

// Core Components - المكونات الأساسية
// (OAuthCallback has been evicted to presentation/pages/auth/callback)

// Utils - أدوات مساعدة
export * from './utils'

// Types - أنواع البيانات
export * from './types'

// Routes - تصدير المسارات من core
export { allRoutes, routeMetadata } from './core/routes'

// Provider - موفر السياق (من providers/)
export { RouteProvider } from './providers/RouteProvider'
export { useRouteContext } from './providers/RouteContext'

// Analytics - تحليلات المسارات
export { routeAnalytics } from './analytics/RouteAnalytics'

// History - سجل المسارات
export { routeHistory } from './history/RouteHistory'

// Preloader - التحميل المسبق
export { routePreloader } from './preloading/RoutePreloader'

// Errors - معالجة الأخطاء
// (Evicted to presentation/components/ui/feedback)

// Transitions - تحولات المسارات
export { RouteTransition } from './transitions/RouteTransition'
