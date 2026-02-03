/**
 * createAsyncStore - Factory لإنشاء Async Stores
 *
 * Factory function لإنشاء Zustand stores للعمليات غير المتزامنة
 * يطبق DRY Principle لتجنب تكرار كود الـ stores
 */

import { create, StateCreator } from 'zustand'
import { ErrorHandler } from '../utils/errorHandler'

export interface AsyncStoreState<T> {
  /**
   * البيانات
   */
  data: T | null

  /**
   * حالة التحميل
   */
  isLoading: boolean

  /**
   * الخطأ إن وجد
   */
  error: string | null

  /**
   * جلب البيانات
   */
  fetchData: () => Promise<void>

  /**
   * إعادة تعيين الحالة
   */
  reset: () => void

  /**
   * مسح الخطأ
   */
  clearError: () => void
}

export interface CreateAsyncStoreOptions<T> {
  /**
   * دالة جلب البيانات
   */
  fetchFn: () => Promise<T>

  /**
   * رسالة الخطأ الافتراضية
   */
  defaultErrorMessage?: string

  /**
   * Callback يتم استدعاؤه عند نجاح العملية
   */
  onSuccess?: (data: T) => void

  /**
   * Callback يتم استدعاؤه عند فشل العملية
   */
  onError?: (error: Error) => void

  /**
   * اسم الـ store (للتسجيل)
   */
  name?: string
}

/**
 * إنشاء Async Store
 *
 * @param options - خيارات إنشاء الـ store
 * @returns Zustand store
 *
 * @example
 * ```typescript
 * const useUserStore = createAsyncStore({
 *   fetchFn: async () => {
 *     const response = await apiClient.get('/api/users')
 *     return response.data
 *   },
 *   defaultErrorMessage: 'فشل جلب المستخدمين',
 *   name: 'UserStore',
 * })
 *
 * // الاستخدام
 * const { data, isLoading, error, fetchData } = useUserStore()
 * ```
 */
export function createAsyncStore<T>(options: CreateAsyncStoreOptions<T>): () => AsyncStoreState<T> {
  const { fetchFn, defaultErrorMessage = 'فشلت العملية', onSuccess, onError } = options

  const storeCreator: StateCreator<AsyncStoreState<T>> = set => ({
    data: null,
    isLoading: false,
    error: null,

    fetchData: async () => {
      set({ isLoading: true, error: null })

      try {
        const data = await fetchFn()
        set({ data, isLoading: false })
        onSuccess?.(data)
      } catch (err) {
        const error = ErrorHandler.handle(err, defaultErrorMessage)
        const errorMessage = error.message
        set({ error: errorMessage, isLoading: false })
        onError?.(error)
      }
    },

    reset: () => {
      set({
        data: null,
        isLoading: false,
        error: null,
      })
    },

    clearError: () => {
      set({ error: null })
    },
  })

  return create<AsyncStoreState<T>>(storeCreator)
}
