/**
 * Auth Hooks - TanStack Query Update User Hook
 *
 * @description
 * Update user profile mutation using TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { useAuthStore } from '../store'
import type { UserData } from '@/domain/types/auth.types'
import { queryKeys } from '@/application/shared/api'

/**
 * Hook for updating user profile
 */
export const useUpdateUser = () => {
    const { setUser } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<UserData>) => authService.updateUser(data),
        onSuccess: (updatedUser) => {
            setUser(updatedUser)

            // Invalidate user queries to refetch
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
        },
    })
}
