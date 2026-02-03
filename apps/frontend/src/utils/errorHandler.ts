/**
 * Error Handler Utility - أداة التعامل مع الأخطاء
 *
 * أداة موحدة للتعامل مع الأخطاء
 * يوفر error handling و logging موحد
 */

import { loggingService } from '@/infrastructure/services'

export interface ErrorHandlerOptions {
  /**
   * رسالة خطأ مخصصة
   */
  message?: string

  /**
   * سياق الخطأ (مثل اسم الدالة أو الصفحة)
   */
  context?: string

  /**
   * هل يجب إظهار toast notification؟
   */
  showToast?: boolean

  /**
   * دالة callback عند حدوث خطأ
   */
  onError?: (error: Error) => void
}

/**
 * معالج الأخطاء الموحد
 *
 * @param error - الخطأ الذي حدث
 * @param options - خيارات معالجة الخطأ
 *
 * @example
 * ```tsx
 * try {
 *   await deleteLesson(id)
 * } catch (error) {
 *   handleError(error, {
 *     message: 'فشل حذف الدرس',
 *     context: 'LessonsManagementPage',
 *   })
 * }
 * ```
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const { message = 'حدث خطأ غير متوقع', context, showToast = false, onError } = options

  const errorInstance = error instanceof Error ? error : new Error(String(error))
  const errorMessage = context ? `[${context}] ${message}` : message

  // تسجيل الخطأ
  loggingService.error(errorMessage, errorInstance)

  // إظهار toast notification (سيتم إضافته لاحقاً)
  if (showToast) {
    // TODO: إضافة toast notification system
    // toast.error(errorMessage)
  }

  // استدعاء callback إذا كان موجوداً
  if (onError) {
    onError(errorInstance)
  }
}

/**
 * معالج الأخطاء للعمليات غير المتزامنة
 *
 * @param promise - Promise المراد معالجته
 * @param options - خيارات معالجة الخطأ
 * @returns Promise مع معالجة الأخطاء
 *
 * @example
 * ```tsx
 * const result = await handleAsyncError(
 *   apiClient.get('/lessons'),
 *   { message: 'فشل تحميل الدروس' }
 * )
 * ```
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | null> {
  try {
    return await promise
  } catch (error) {
    handleError(error, options)
    return null
  }
}
