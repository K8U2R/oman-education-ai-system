/**
 * Error Pages - صفحات الأخطاء
 *
 * Export جميع صفحات الأخطاء من مكان واحد
 */

// Core Components
export { BaseErrorPage } from './BaseErrorPage'
export type { BaseErrorPageProps } from './BaseErrorPage'
export { ErrorPageFactory } from './core/ErrorPageFactory'

// Error Pages
export { ForbiddenPage } from './pages/ForbiddenPage'
export { UnauthorizedPage } from './pages/UnauthorizedPage'
export { NotFoundPage } from './pages/NotFoundPage'
export { ServerErrorPage } from './pages/ServerErrorPage'
export { NetworkErrorPage } from './pages/NetworkErrorPage'
export { MaintenancePage } from './pages/MaintenancePage'

// Components
export { ErrorDetailsPanel } from './components/ErrorDetailsPanel'
export { ErrorIcon } from './components/ErrorIcon'
export { ErrorActions } from './components/ErrorActions'
export { ErrorMessage } from './components/ErrorMessage'

// Hooks
export { useErrorDetails } from './hooks/useErrorDetails'
export { useErrorNavigation } from './hooks/useErrorNavigation'
export { useErrorRefresh } from './hooks/useErrorRefresh'
export { useErrorPageSetup } from './hooks/useErrorPageSetup'

// Types
export type * from './core/types'

// Config
export { ERROR_CONFIG, getErrorConfig, hasErrorConfig } from './config/error-config'

// Utils
export * from './utils/error-constants'
export * from './utils/error-mapper'
export * from './utils/error-formatter'
