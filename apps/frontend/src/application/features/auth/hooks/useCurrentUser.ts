/**
 * Auth Hooks - TanStack Query Current User Hook
 *
 * @description
 * Fetch current user using TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'
import { queryKeys } from '@/application/shared/api'

/**
 * Hook for fetching current user (me endpoint)
 */
export const useCurrentUser = () => {
    return useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: () => authService.getCurrentUser(),
        enabled: authService.isAuthenticated(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    })
}
