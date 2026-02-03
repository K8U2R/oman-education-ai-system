/**
 * useErrorRefresh Hook - Hook لتحديث البيانات
 *
 * Custom Hook لتحديث بيانات المستخدم في صفحات الأخطاء
 */

import { useState, useCallback } from 'react'
import { useAuth } from '@/features/user-authentication-management'
import { loggingService } from '@/infrastructure/services'

interface UseErrorRefreshReturn {
  /** حالة التحديث */
  isRefreshing: boolean
  /** دالة تحديث البيانات */
  refresh: () => Promise<void>
  /** خطأ التحديث */
  error: Error | null
}

/**
 * Hook لتحديث بيانات المستخدم
 */
export function useErrorRefresh(): UseErrorRefreshReturn {
  const { refreshUser, isAuthenticated } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      return
    }

    setIsRefreshing(true)
    setError(null)

    try {
      await refreshUser()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('فشل تحديث البيانات')
      setError(error)
      loggingService.error('Failed to refresh user', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshUser, isAuthenticated])

  return {
    isRefreshing,
    refresh,
    error,
  }
}
