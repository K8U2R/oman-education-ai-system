/**
 * Admin Users Hooks - Hooks إدارة المستخدمين
 *
 * @description
 * Custom Hooks لإدارة المستخدمين باستخدام TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { queryKeys } from '@/application/shared/api'
import type { SearchUsersRequest, UpdateUserRequest } from '../types'

/**
 * Hook للبحث عن المستخدمين
 */
export const useAdminUsers = (filters?: SearchUsersRequest) => {
    return useQuery({
        queryKey: queryKeys.admin.users.list(filters),
        queryFn: () => adminService.searchUsers(filters || {}),
        staleTime: 1000 * 30, // 30 seconds
    })
}

/**
 * Hook لجلب أنشطة المستخدمين
 */
export const useUserActivities = () => {
    return useQuery({
        queryKey: queryKeys.admin.users.activities(),
        queryFn: () => adminService.getUserActivities(),
        staleTime: 1000 * 60, // 1 minute
    })
}

/**
 * Hook لتحديث مستخدم
 */
export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateUserRequest }) =>
            adminService.updateUser(userId, data),
        onSuccess: (updatedUser) => {
            // إبطال قائمة المستخدمين لإعادة جلبها
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() })
            // تحديث تفاصيل المستخدم المحدد (Optimistic Update)
            queryClient.setQueryData(queryKeys.admin.users.detail(updatedUser.id), updatedUser)
        },
    })
}

/**
 * Hook لحذف مستخدم
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userId: string) => adminService.deleteUser(userId),
        onSuccess: () => {
            // إبطال قائمة المستخدمين
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() })
        },
    })
}
