/**
 * useAuth - Composite Auth Hook
 *
 * @description
 * Backward-compatible composite hook that combines all TanStack Query auth hooks.
 * Provides same interface as old useAuth but uses modern architecture underneath.
 */

import { useEffect } from 'react'
import { useAuthStore } from '../store'
import { useLogin } from './useLogin'
import { useRegister } from './useRegister'
import { useCurrentUser } from './useCurrentUser'
import { useLogout } from './useLogout'
import { useUpdateUser } from './useUpdateUser'
import { useUpdatePassword } from './useUpdatePassword'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'

interface UseAuthReturn {
    // State
    user: ReturnType<typeof useCurrentUser>['data']
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null

    // Mutations
    login: ReturnType<typeof useLogin>['mutate']
    register: ReturnType<typeof useRegister>['mutate']
    logout: ReturnType<typeof useLogout>['mutate']
    updateUser: ReturnType<typeof useUpdateUser>['mutate']
    updatePassword: ReturnType<typeof useUpdatePassword>['mutate']

    // Utilities
    refreshUser: () => Promise<void>
    clearError: () => void
}

/**
 * Main auth hook - combines all TanStack Query hooks into single interface
 */
export const useAuth = (): UseAuthReturn => {
    const { user, isAuthenticated, login: loginStore } = useAuthStore()

    // TanStack Query Hooks
    const loginMutation = useLogin()
    const registerMutation = useRegister()
    const logoutMutation = useLogout()
    const updateUserMutation = useUpdateUser()
    const updatePasswordMutation = useUpdatePassword()
    const currentUserQuery = useCurrentUser()

    // Sync TanStack Query user data with Zustand store
    useEffect(() => {
        if (currentUserQuery.data && !user && authService.isAuthenticated()) {
            // Query has fresh user data but store doesn't - sync it
            const tokens = {
                access_token: authService.getAccessToken()!,
                refresh_token: authService.getRefreshToken()!,
                token_type: 'Bearer' as const,
                expires_in: 3600,
            }
            loginStore(currentUserQuery.data, tokens)
        }
    }, [currentUserQuery.data, user, loginStore])

    // Aggregate loading states
    const isLoading =
        loginMutation.isPending ||
        registerMutation.isPending ||
        logoutMutation.isPending ||
        updateUserMutation.isPending ||
        updatePasswordMutation.isPending ||
        currentUserQuery.isLoading

    // Aggregate error states
    const error =
        (loginMutation.error as Error | null)?.message ||
        (registerMutation.error as Error | null)?.message ||
        (logoutMutation.error as Error | null)?.message ||
        (updateUserMutation.error as Error | null)?.message ||
        (updatePasswordMutation.error as Error | null)?.message ||
        (currentUserQuery.error as Error | null)?.message ||
        null

    // Refresh user manually
    const refreshUser = async () => {
        await currentUserQuery.refetch()
    }

    // Clear all errors
    const clearError = () => {
        loginMutation.reset()
        registerMutation.reset()
        logoutMutation.reset()
        updateUserMutation.reset()
        updatePasswordMutation.reset()
    }

    return {
        // State
        user: user || currentUserQuery.data || undefined,
        isLoading,
        isAuthenticated,
        error,

        // Mutations
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        updateUser: updateUserMutation.mutate,
        updatePassword: updatePasswordMutation.mutate,

        // Utilities
        refreshUser,
        clearError,
    }
}
