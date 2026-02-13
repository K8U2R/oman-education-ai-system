/**
 * Admin Stats Hooks - Hooks إحصائيات الإدارة
 *
 * @description
 * Custom Hooks لجلب إحصائيات الإدارة باستخدام TanStack Query
 */

import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { queryKeys } from '@/application/shared/api'

/**
 * Hook لجلب إحصائيات النظام
 */
export const useSystemStats = () => {
    return useQuery({
        queryKey: queryKeys.admin.stats.system(),
        queryFn: () => adminService.getSystemStats(),
        staleTime: 1000 * 60, // 1 minute
    })
}

/**
 * Hook لجلب إحصائيات المستخدمين
 */
export const useUserStats = () => {
    return useQuery({
        queryKey: queryKeys.admin.stats.users(),
        queryFn: () => adminService.getUserStats(),
        staleTime: 1000 * 60,
    })
}

/**
 * Hook لجلب إحصائيات المحتوى
 */
export const useContentStats = () => {
    return useQuery({
        queryKey: queryKeys.admin.stats.content(),
        queryFn: () => adminService.getContentStats(),
        staleTime: 1000 * 60,
    })
}

/**
 * Hook لجلب إحصائيات الاستخدام
 */
export const useUsageStats = () => {
    return useQuery({
        queryKey: queryKeys.admin.stats.usage(),
        queryFn: () => adminService.getUsageStats(),
        staleTime: 1000 * 60,
    })
}

/**
 * Hook مركب لجلب جميع الإحصائيات
 *
 * @description
 * يجلب جميع الإحصائيات بشكل متوازي ويعيد حالة واحدة موحدة
 */
export const useAllStats = () => {
    const systemStats = useSystemStats()
    const userStats = useUserStats()
    const contentStats = useContentStats()
    const usageStats = useUsageStats()

    return {
        systemStats: systemStats.data,
        userStats: userStats.data,
        contentStats: contentStats.data,
        usageStats: usageStats.data,
        isLoading:
            systemStats.isLoading ||
            userStats.isLoading ||
            contentStats.isLoading ||
            usageStats.isLoading,
        error:
            systemStats.error ||
            userStats.error ||
            contentStats.error ||
            usageStats.error,
        refetchAll: () => {
            systemStats.refetch()
            userStats.refetch()
            contentStats.refetch()
            usageStats.refetch()
        },
    }
}
