/**
 * Auth Hooks - TanStack Query Login Hook
 *
 * @description
 * Login mutation using TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { useAuthStore } from '../store'
import { User } from '@/domain/entities/User'
import type { LoginRequest } from '@/domain/types/auth.types'
import { queryKeys } from '@/application/shared/api'

/**
 * Hook for user login
 */
export const useLogin = () => {
    const navigate = useNavigate()
    const { login: loginStore } = useAuthStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: (response) => {
            const userData = User.fromData(response.user)
            loginStore(userData, response.tokens)

            // Invalidate and refetch user data
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })

            navigate('/dashboard')
        },
    })
}
