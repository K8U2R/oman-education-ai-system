import { useState, useEffect } from 'react'
import { developerService } from '@/application'
import { loggingService } from '@/infrastructure/services'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { DeveloperStats } from '@/domain/types/developer.types'

export const useDeveloperDashboard = () => {
    const { user, canAccess } = usePageAuth({
        requireAuth: true,
        requiredRole: 'developer',
        redirectTo: '/forbidden',
    })

    // إحصائيات المطور
    const [devStats, setDevStats] = useState<DeveloperStats | null>(null)
    const [isLoadingStats, setIsLoadingStats] = useState(true)

    // جلب إحصائيات المطور
    useEffect(() => {
        const fetchDeveloperStats = async () => {
            if (!canAccess) return

            try {
                setIsLoadingStats(true)
                const stats = await developerService.getDeveloperStats()
                setDevStats(stats)
            } catch (error) {
                loggingService.error('Failed to fetch developer stats', error as Error)
                // في حالة الخطأ، نستخدم قيم افتراضية
                setDevStats({
                    total_commits: 0,
                    active_branches: 0,
                    test_coverage: 0,
                    build_status: 'pending',
                    api_endpoints_count: 0,
                    services_count: 0,
                    error_rate: 0,
                })
            } finally {
                setIsLoadingStats(false)
            }
        }

        if (canAccess) {
            fetchDeveloperStats()
        }
    }, [canAccess])

    const { isLoading, shouldShowLoading, loadingMessage } = usePageLoading({
        isLoading: !canAccess || isLoadingStats || !devStats,
        message: 'جاري تحميل لوحة تحكم المطور...',
    })

    return {
        user,
        canAccess,
        devStats,
        isLoading,
        shouldShowLoading,
        loadingMessage,
    }
}
