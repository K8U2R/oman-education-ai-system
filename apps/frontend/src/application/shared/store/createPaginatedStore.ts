/**
 * createPaginatedStore - Factory لإنشاء Paginated Stores
 *
 * Factory function لإنشاء Zustand stores للبيانات المقسمة على صفحات
 */

import { create, StateCreator } from 'zustand'
import { ErrorHandler } from '../utils/errorHandler'

export interface PaginationParams {
  /**
   * رقم الصفحة
   */
  page: number

  /**
   * عدد العناصر في الصفحة
   */
  perPage: number
}

export interface PaginationMeta {
  /**
   * رقم الصفحة الحالية
   */
  currentPage: number

  /**
   * عدد العناصر في الصفحة
   */
  perPage: number

  /**
   * إجمالي العناصر
   */
  total: number

  /**
   * إجمالي الصفحات
   */
  totalPages: number

  /**
   * هل هناك صفحة سابقة؟
   */
  hasPreviousPage: boolean

  /**
   * هل هناك صفحة تالية؟
   */
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  /**
   * البيانات
   */
  data: T[]

  /**
   * معلومات الصفحات
   */
  meta: PaginationMeta
}

export interface PaginatedStoreState<T> {
  /**
   * البيانات
   */
  data: T[]

  /**
   * معلومات الصفحات
   */
  meta: PaginationMeta | null

  /**
   * حالة التحميل
   */
  isLoading: boolean

  /**
   * الخطأ إن وجد
   */
  error: string | null

  /**
   * معاملات الصفحات الحالية
   */
  params: PaginationParams

  /**
   * جلب البيانات
   */
  fetchData: (params?: Partial<PaginationParams>) => Promise<void>

  /**
   * الانتقال إلى الصفحة التالية
   */
  nextPage: () => Promise<void>

  /**
   * الانتقال إلى الصفحة السابقة
   */
  previousPage: () => Promise<void>

  /**
   * الانتقال إلى صفحة محددة
   */
  goToPage: (page: number) => Promise<void>

  /**
   * تغيير عدد العناصر في الصفحة
   */
  setPerPage: (perPage: number) => Promise<void>

  /**
   * إعادة تعيين الحالة
   */
  reset: () => void

  /**
   * مسح الخطأ
   */
  clearError: () => void
}

export interface CreatePaginatedStoreOptions<T> {
  /**
   * دالة جلب البيانات
   */
  fetchFn: (params: PaginationParams) => Promise<PaginatedResponse<T>>

  /**
   * رسالة الخطأ الافتراضية
   */
  defaultErrorMessage?: string

  /**
   * عدد العناصر الافتراضي في الصفحة
   */
  defaultPerPage?: number

  /**
   * Callback يتم استدعاؤه عند نجاح العملية
   */
  onSuccess?: (data: PaginatedResponse<T>) => void

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
 * إنشاء Paginated Store
 *
 * @param options - خيارات إنشاء الـ store
 * @returns Zustand store
 *
 * @example
 * ```typescript
 * const useUsersStore = createPaginatedStore({
 *   fetchFn: async (params) => {
 *     const response = await apiClient.get('/api/users', { params })
 *     return {
 *       data: response.data.users,
 *       meta: response.data.meta,
 *     }
 *   },
 *   defaultPerPage: 10,
 *   name: 'UsersStore',
 * })
 *
 * // الاستخدام
 * const { data, meta, isLoading, nextPage, previousPage } = useUsersStore()
 * ```
 */
export function createPaginatedStore<T>(
  options: CreatePaginatedStoreOptions<T>
): () => PaginatedStoreState<T> {
  const {
    fetchFn,
    defaultErrorMessage = 'فشل جلب البيانات',
    defaultPerPage = 10,
    onSuccess,
    onError,
  } = options

  const storeCreator: StateCreator<PaginatedStoreState<T>> = (set, get) => ({
    data: [],
    meta: null,
    isLoading: false,
    error: null,
    params: {
      page: 1,
      perPage: defaultPerPage,
    },

    fetchData: async (newParams?: Partial<PaginationParams>) => {
      const currentParams = get().params
      const params: PaginationParams = {
        ...currentParams,
        ...newParams,
      }

      set({ isLoading: true, error: null, params })

      try {
        const response = await fetchFn(params)
        set({
          data: response.data,
          meta: response.meta,
          isLoading: false,
          params,
        })
        onSuccess?.(response)
      } catch (err) {
        const error = ErrorHandler.handle(err, defaultErrorMessage)
        const errorMessage = error.message
        set({ error: errorMessage, isLoading: false })
        onError?.(error)
      }
    },

    nextPage: async () => {
      const { meta, params } = get()
      if (meta && meta.hasNextPage) {
        await get().fetchData({ page: params.page + 1 })
      }
    },

    previousPage: async () => {
      const { meta, params } = get()
      if (meta && meta.hasPreviousPage) {
        await get().fetchData({ page: params.page - 1 })
      }
    },

    goToPage: async (page: number) => {
      const { meta } = get()
      if (meta && page >= 1 && page <= meta.totalPages) {
        await get().fetchData({ page })
      }
    },

    setPerPage: async (perPage: number) => {
      await get().fetchData({ page: 1, perPage })
    },

    reset: () => {
      set({
        data: [],
        meta: null,
        isLoading: false,
        error: null,
        params: {
          page: 1,
          perPage: defaultPerPage,
        },
      })
    },

    clearError: () => {
      set({ error: null })
    },
  })

  return create<PaginatedStoreState<T>>(storeCreator)
}
