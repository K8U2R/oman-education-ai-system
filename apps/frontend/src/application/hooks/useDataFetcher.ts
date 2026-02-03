/**
 * useDataFetcher Hook - Hook لجلب البيانات
 *
 * Hook موحد لجلب البيانات من API
 * يقلل التكرار في كود fetching ويوفر error handling موحد
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useDataFetcher<Lesson>(
 *   API_ENDPOINTS.CONTENT.LESSONS
 * )
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/infrastructure/services/api'
import { loggingService } from '@/infrastructure/services'

export interface UseDataFetcherOptions {
  /**
   * هل يتم الجلب تلقائياً عند mount؟
   */
  autoFetch?: boolean

  /**
   * دالة للتحقق من صحة البيانات قبل setState
   */
  validateData?: (data: unknown) => boolean

  /**
   * دالة لتحويل البيانات قبل setState
   */
  transformData?: <T>(data: unknown) => T[]

  /**
   * رسالة خطأ مخصصة
   */
  errorMessage?: string
}

export interface UseDataFetcherReturn<T> {
  /**
   * البيانات المحملة
   */
  data: T[]

  /**
   * حالة التحميل
   */
  loading: boolean

  /**
   * رسالة الخطأ
   */
  error: string | null

  /**
   * إعادة جلب البيانات
   */
  refetch: () => Promise<void>

  /**
   * تحديث البيانات يدوياً
   */
  setData: (data: T[]) => void

  /**
   * مسح الخطأ
   */
  clearError: () => void
}

/**
 * Hook لجلب البيانات من API
 *
 * @param endpoint - مسار API endpoint
 * @param options - خيارات إضافية
 * @returns حالة البيانات ووظائف التحكم
 */
export function useDataFetcher<T>(
  endpoint: string,
  options: UseDataFetcherOptions = {}
): UseDataFetcherReturn<T> {
  const {
    autoFetch = true,
    validateData,
    transformData,
    errorMessage = 'فشل تحميل البيانات',
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiClient.get<{ success: boolean; data: T[] }>(endpoint)

      if (!response.success) {
        throw new Error('فشل تحميل البيانات')
      }

      let responseData = response.data || []

      // التحقق من صحة البيانات
      if (validateData && !validateData(responseData)) {
        throw new Error('البيانات غير صحيحة')
      }

      // تحويل البيانات إذا لزم الأمر
      if (transformData) {
        responseData = transformData<T>(responseData) as T[]
      }

      setData(responseData)
    } catch (err) {
      const errorMessage_final = err instanceof Error ? err.message : errorMessage
      setError(errorMessage_final)
      loggingService.error(`Failed to fetch data from ${endpoint}`, err as Error)
    } finally {
      setLoading(false)
    }
  }, [endpoint, validateData, transformData, errorMessage])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [autoFetch, fetchData])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    clearError,
  }
}
