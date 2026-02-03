/**
 * useAdminDataFetch Hook - Hook موحد لجلب البيانات
 *
 * Hook موحد لجلب البيانات في صفحات Admin مع:
 * - Auto-refresh support
 * - Error handling
 * - Loading state
 * - Caching (optional)
 *
 * **Clean Architecture:**
 * - لا يعتمد على Presentation Layer
 * - يستخدم Application Layer hooks
 * - يعيد state فقط (لا components)
 */

import { useCallback } from 'react'
import { useAsyncOperation } from '@/application/shared/hooks'
import type { UseAsyncOperationOptions } from '@/application/shared/hooks/useAsyncOperation'

export interface UseAdminDataFetchOptions<T> extends UseAsyncOperationOptions<T> {
  /**
   * فاصل زمني لإعادة الجلب التلقائي (polling)
   */
  interval?: number

  /**
   * هل يجب جلب البيانات تلقائياً؟
   */
  autoFetch?: boolean
}

export interface UseAdminDataFetchReturn<T> {
  /**
   * البيانات
   */
  data: T | null

  /**
   * حالة التحميل
   */
  loading: boolean

  /**
   * الخطأ (إن وجد)
   */
  error: string | null

  /**
   * تحديث البيانات
   */
  refresh: () => Promise<void>
}

/**
 * Hook موحد لجلب البيانات
 *
 * @param fetchFn - دالة جلب البيانات
 * @param options - خيارات الجلب
 * @returns معلومات البيانات والحالة
 *
 * @example
 * ```tsx
 * const { data, loading, error, refresh } = useAdminDataFetch(
 *   () => adminDashboardService.getStats(),
 *   { interval: 30000, autoFetch: true }
 * )
 * ```
 */
export function useAdminDataFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseAdminDataFetchOptions<T> = {}
): UseAdminDataFetchReturn<T> {
  const {
    interval,
    autoFetch = true,
    onSuccess,
    onError,
    defaultErrorMessage = 'فشل جلب البيانات',
  } = options

  // استخدام useAsyncOperation للعمليات غير المتزامنة
  const { data, isLoading, error, fetch } = useAsyncOperation(fetchFn, {
    autoFetch,
    interval,
    onSuccess,
    onError,
    defaultErrorMessage,
  })

  // دالة التحديث
  const refresh = useCallback(async () => {
    if (fetch) {
      await fetch()
    }
  }, [fetch])

  return {
    data,
    loading: isLoading,
    error: error ? error.message : null,
    refresh,
  }
}
