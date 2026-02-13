/**
 * Auth Hooks - TanStack Query Register Hook
 *
 * @description
 * Register mutation using TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { useAuthStore } from '../store'
import type { RegisterRequest } from '@/domain/types/auth.types'
import { queryKeys } from '@/application/shared/api'

/**
 * Hook for user registration
 */
export const useRegister = () => {
    const navigate = useNavigate()
    const { setUser } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: (newUser) => {
            setUser(newUser)

            // Invalidate auth queries
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })

            navigate('/dashboard')
        },
    })
}
