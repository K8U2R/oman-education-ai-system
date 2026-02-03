/**
 * User Authentication Management - Embassy
 *
 * This feature manages all user identity, authentication, and authorization logic.
 *
 * Sovereign Interface:
 * - /hooks: useAuth, useRole
 * - /guards: ProtectedRoute, PublicRoute, GuestRoute
 * - /components: OAuthButtons, etc.
 * - /api: authService
 * - /store: useAuthStore
 */

// Hooks
export * from './hooks/useAuth'
export * from './hooks/useRole'
export * from './hooks/useOAuth'
export * from './hooks/useEmailVerification'
export * from './hooks/useSendVerificationEmail'

// Store
export * from './store/authStore'

// API
export * from './api/auth.service'

// Utils
export * from './utils/auth.utils'

// Types
export * from './types/auth.types'

// Components
export * from './components/OAuthButtons'
export * from './components/ProtectedButton'

// Guards
export * from './guards/ProtectedRoute'
export * from './guards/PublicRoute'
export * from './guards/GuestRoute'
