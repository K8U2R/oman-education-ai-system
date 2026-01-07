/**
 * Routing System - نظام التوجيه
 *
 * تصدير جميع مكونات نظام التوجيه
 */

// Guards
export * from './guards'

// Middleware
export * from './middleware/RouteMiddleware'

// Hooks
export * from './hooks'

// Components
export * from './components'

// Utils
export * from './utils'

// Types
export * from './types'

// Routes - Export directly from core/routes
export { allRoutes, routeMetadata } from './core/routes'

// Provider
export { RouteProvider } from './RouteProvider'

// Analytics
export { routeAnalytics } from './analytics/RouteAnalytics'

// History
export { routeHistory } from './history/RouteHistory'

// Preloader
export { routePreloader } from './preloading/RoutePreloader'

// Errors
export { RouteErrorBoundary } from './errors/RouteErrorBoundary'

// Transitions
export { RouteTransition } from './transitions/RouteTransition'
