/**
 * Auth Hooks - TanStack Query Update Password Hook
 *
 * @description
 * Update password mutation using TanStack Query
 */

import { useMutation } from '@tanstack/react-query'
import { authService } from '@/presentation/features/user-authentication-management/api/auth.service'

/**
 * Hook for updating user password
 */
export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string
            newPassword: string
        }) => authService.updatePassword(currentPassword, newPassword),
    })
}
