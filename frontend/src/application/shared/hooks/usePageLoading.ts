/**
 * usePageLoading Hook - Hook لحالة التحميل في الصفحات
 *
 * Hook موحد لإدارة حالة التحميل في الصفحات
 * يقلل التكرار في كود loading states
 *
 * **العلاقة مع hooks أخرى:**
 * - يستخدمه `usePageAuth` داخلياً لإدارة حالة التحميل
 * - لا يعتمد على presentation layer (لا يعيد React components)
 * - يعيد `shouldShowLoading` و `loadingMessage` للاستخدام في presentation layer
 *
 * **متى نستخدم:**
 * - لإدارة حالة التحميل في الصفحات
 * - للتحقق من الحاجة لعرض LoadingState
 *
 * **ملاحظات:**
 * - لا يعيد `LoadingComponent` (يجب استخدام `LoadingState` مباشرة في presentation layer)
 * - متوافق مع Clean Architecture (لا يعتمد على presentation)
 */

import { useMemo } from 'react'

export interface UsePageLoadingOptions {
  /**
   * حالة التحميل الرئيسية
   */
  isLoading?: boolean

  /**
   * حالات التحميل الإضافية
   */
  loadingStates?: boolean[]

  /**
   * رسالة التحميل
   */
  message?: string

  /**
   * هل يجب عرض LoadingState فقط عند عدم وجود بيانات؟
   */
  showOnlyWhenEmpty?: boolean

  /**
   * البيانات للتحقق من وجودها
   */
  data?: unknown
}

export interface UsePageLoadingReturn {
  /**
   * حالة التحميل الموحدة
   */
  isLoading: boolean

  /**
   * هل يجب عرض LoadingState؟
   */
  shouldShowLoading: boolean

  /**
   * رسالة التحميل (للاستخدام في presentation layer)
   */
  loadingMessage: string
}

/**
 * Hook لحالة التحميل في الصفحات
 *
 * @param options - خيارات التحميل
 * @returns معلومات حالة التحميل
 *
 * @example
 * ```tsx
 * const { isLoading, shouldShowLoading, loadingMessage } = usePageLoading({
 *   isLoading: loading,
 *   message: 'جاري التحميل...',
 * })
 *
 * if (shouldShowLoading) {
 *   return <LoadingState fullScreen message={loadingMessage} />
 * }
 * ```
 */
export function usePageLoading(options: UsePageLoadingOptions = {}): UsePageLoadingReturn {
  const {
    isLoading: mainLoading = false,
    loadingStates = [],
    message = 'جاري التحميل...',
    showOnlyWhenEmpty = false,
    data,
  } = options

  // حساب حالة التحميل الموحدة
  const isLoading = useMemo(() => {
    if (mainLoading) return true
    return loadingStates.some(loading => loading === true)
  }, [mainLoading, loadingStates])

  // تحديد ما إذا كان يجب عرض LoadingState
  const shouldShowLoading = useMemo(() => {
    if (!isLoading) return false

    if (showOnlyWhenEmpty) {
      // عرض فقط عند عدم وجود بيانات
      return data === null || data === undefined || (Array.isArray(data) && data.length === 0)
    }

    return true
  }, [isLoading, showOnlyWhenEmpty, data])

  return {
    isLoading,
    shouldShowLoading,
    loadingMessage: message,
  }
}
