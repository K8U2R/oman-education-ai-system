/**
 * Auth Hooks - TanStack Query Logout Hook
 *
 * @description
 * Logout mutation using TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { useAuthStore } from '../store'

/**
 * Hook for user logout
 */
export const useLogout = () => {
    const navigate = useNavigate()
    const { logout: logoutStore } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            logoutStore()

            // Clear all queries
            queryClient.clear()

            navigate('/')
        },
        onError: (error: unknown) => {
            console.error('Logout error:', error)
            // Clear store even if API call fails
            logoutStore()
            queryClient.clear()
        },
    })
}
