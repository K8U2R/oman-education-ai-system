/**
 * useAsyncOperation Hook - Hook للعمليات غير المتزامنة
 *
 * Hook قابل لإعادة الاستخدام لجميع العمليات غير المتزامنة
 * يطبق DRY Principle لتجنب تكرار كود معالجة الحالة والأخطاء
 *
 * **الميزات:**
 * - العمليات العادية (execute) - مع أو بدون params
 * - جلب البيانات التلقائي (autoFetch) - للعمليات بدون params
 * - Polling (interval) - لإعادة الجلب التلقائي
 * - Cancellation (AbortController) - لإلغاء العمليات الجارية
 *
 * **العلاقة مع hooks أخرى:**
 * - دمج `useApiState` السابق (الآن جزء من `useAsyncOperation`)
 * - يستخدم `ErrorHandler` لمعالجة الأخطاء بشكل موحد
 *
 * **متى نستخدم:**
 * - للعمليات غير المتزامنة (API calls, async operations)
 * - لجلب البيانات مع دعم polling
 * - للعمليات التي تحتاج cancellation support
 *
 * **الفرق بين execute و fetch:**
 * - `execute`: للعمليات مع params (مثل: `execute(userId)`)
 * - `fetch`: للعمليات بدون params (مثل: `fetch()`)
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { ErrorHandler } from '../utils/errorHandler'

export interface UseAsyncOperationOptions<T> {
  /**
   * جلب البيانات تلقائياً عند التحميل (للاستخدام مع fetchFn بدون params)
   */
  autoFetch?: boolean

  /**
   * فاصل زمني لإعادة الجلب (polling) بالمللي ثانية
   */
  interval?: number

  /**
   * Callback يتم استدعاؤه عند نجاح العملية
   */
  onSuccess?: (data: T) => void

  /**
   * Callback يتم استدعاؤه عند فشل العملية
   */
  onError?: (error: Error) => void

  /**
   * رسالة الخطأ الافتراضية
   */
  defaultErrorMessage?: string

  /**
   * إعادة تعيين البيانات عند بدء عملية جديدة
   */
  resetOnExecute?: boolean
}

export interface UseAsyncOperationReturn<T, P = void> {
  /**
   * البيانات الناتجة من العملية
   */
  data: T | null

  /**
   * حالة التحميل
   */
  isLoading: boolean

  /**
   * الخطأ إن وجد
   */
  error: Error | null

  /**
   * تنفيذ العملية (مع params)
   */
  execute: (params: P) => Promise<T>

  /**
   * جلب البيانات (بدون params - للتوافق مع useApiState)
   */
  fetch?: () => Promise<void>

  /**
   * إلغاء العملية الجارية
   */
  cancel: () => void

  /**
   * إعادة تعيين الحالة
   */
  reset: () => void

  /**
   * مسح الخطأ
   */
  clearError: () => void
}

/**
 * Hook للعمليات غير المتزامنة
 *
 * @param operation - العملية المراد تنفيذها (يمكن أن تكون بدون params)
 * @param options - خيارات إضافية
 * @returns UseAsyncOperationReturn
 *
 * @example
 * ```typescript
 * // استخدام مع params
 * const { data, isLoading, error, execute } = useAsyncOperation(
 *   async (userId: string) => {
 *     const response = await apiClient.get(`/api/users/${userId}`)
 *     return response.data
 *   },
 *   {
 *     onSuccess: (user) => console.log('User loaded:', user),
 *     onError: (err) => console.error('Error:', err),
 *   }
 * )
 * await execute('user-123')
 * ```
 *
 * @example
 * ```typescript
 * // استخدام بدون params (مع autoFetch و interval)
 * const { data, isLoading, error, fetch } = useAsyncOperation(
 *   async () => {
 *     const response = await apiClient.get('/api/data')
 *     return response.data
 *   },
 *   {
 *     autoFetch: true,
 *     interval: 5000, // Refresh every 5 seconds
 *   }
 * )
 * ```
 */
export function useAsyncOperation<T, P = void>(
  operation: (params: P) => Promise<T>,
  options: UseAsyncOperationOptions<T> = {}
): UseAsyncOperationReturn<T, P> {
  const {
    autoFetch = false,
    interval,
    onSuccess,
    onError,
    defaultErrorMessage = 'فشلت العملية',
    resetOnExecute = false,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const execute = useCallback(
    async (params: P): Promise<T> => {
      // إلغاء العملية السابقة إن وجدت
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // إنشاء AbortController جديد
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsLoading(true)
      setError(null)

      if (resetOnExecute) {
        setData(null)
      }

      try {
        const result = await operation(params)

        // التحقق من عدم إلغاء العملية
        if (abortController.signal.aborted) {
          throw new Error('تم إلغاء العملية')
        }

        setData(result)
        onSuccess?.(result)
        return result
      } catch (err) {
        // تجاهل خطأ الإلغاء
        if (err instanceof Error && err.message === 'تم إلغاء العملية') {
          throw err
        }

        const handledError = ErrorHandler.handle(err, defaultErrorMessage)
        setError(handledError)
        onError?.(handledError)
        throw handledError
      } finally {
        // تنظيف AbortController فقط إذا كانت هذه هي العملية الحالية
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null
        }
        setIsLoading(false)
      }
    },
    [operation, onSuccess, onError, defaultErrorMessage, resetOnExecute]
  )

  // دالة fetch للتوافق مع useApiState (بدون params)
  const fetch = useCallback(async (): Promise<void> => {
    if (operation.length === 0) {
      // العملية لا تأخذ params
      await execute(undefined as P)
      return
    }
    throw new Error('لا يمكن استخدام fetch مع عملية تتطلب params. استخدم execute بدلاً من ذلك.')
  }, [execute, operation])

  // Auto-fetch on mount (للاستخدام مع fetch)
  useEffect(() => {
    if (autoFetch && operation.length === 0) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]) // لا نضيف fetch و operation للـ deps لتجنب re-fetch غير ضروري

  // Polling interval
  useEffect(() => {
    if (interval && interval > 0 && operation.length === 0) {
      intervalRef.current = setInterval(() => {
        fetch()
      }, interval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]) // لا نضيف fetch للـ deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
    cancel()
  }, [cancel])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    isLoading,
    error,
    execute,
    ...(operation.length === 0 && { fetch }), // إضافة fetch فقط إذا كانت العملية بدون params
    cancel,
    reset,
    clearError,
  }
}
