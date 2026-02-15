/**
 * AdminDashboard.hooks.ts
 *
 * Hook موحد يجمع:
 * - Authentication check
 * - Data fetching
 * - Loading state
 * - Error handling
 */

import { useAdminPage, useAdminDataFetch } from '../../core/hooks'
import { adminDashboardService } from '@/application/features/admin/services/admin-dashboard.service'
import { ADMIN_REFRESH_INTERVALS } from '../../core/constants'
import type { DashboardStats } from './AdminDashboard.types'

export interface UseAdminDashboardReturn {
    canAccess: boolean
    loading: boolean
    error: string | null
    stats: DashboardStats | null
    refresh: () => Promise<void>
}

export function useAdminDashboard(): UseAdminDashboardReturn {
    const { canAccess, loading: authLoading } = useAdminPage({
        requiredRole: 'admin',
        autoFetch: false,
    })

    // استخدام useAdminDataFetch لجلب البيانات
    const {
        data: stats,
        loading: statsLoading,
        error: statsError,
        refresh,
    } = useAdminDataFetch(() => adminDashboardService.getStats(), {
        interval: ADMIN_REFRESH_INTERVALS.DASHBOARD,
        autoFetch: canAccess,
        defaultErrorMessage: 'فشل تحميل إحصائيات لوحة التحكم',
    })

    return {
        canAccess,
        loading: authLoading || statsLoading,
        error: statsError,
        stats,
        refresh,
    }
}
