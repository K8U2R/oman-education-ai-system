/**
 * Admin Core - Core Infrastructure
 *
 * نقطة الدخول الموحدة لجميع مكونات Admin Core
 */

// Hooks
export * from './hooks'

// Components
export * from './components'

// Utils (with explicit exports to avoid conflicts)
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getAllPermissions,
  getPermissionsByCategory,
  validatePermission,
} from './utils/permissions.util'
export * from './utils/formatting.util'
export {
  validateEmail,
  validateAdminInput,
  validateRole,
  validatePermission as validatePermissionInput,
} from './utils/validation.util'

// Types
export * from './types'

// Constants
export * from './constants'
