/**
 * Error Handler Utility - أداة معالجة الأخطاء
 *
 * Utility functions لمعالجة الأخطاء بشكل موحد
 * يطبق DRY Principle لتجنب تكرار كود معالجة الأخطاء
 */

/**
 * معالجة الأخطاء وتحويلها إلى Error object
 */
export class ErrorHandler {
  /**
   * تحويل أي خطأ إلى Error object
   *
   * @param error - الخطأ المراد معالجته
   * @param defaultMessage - الرسالة الافتراضية في حالة عدم وجود رسالة
   * @returns Error object
   *
   * @example
   * ```typescript
   * try {
   *   await someOperation()
   * } catch (err) {
   *   const error = ErrorHandler.handle(err, 'فشلت العملية')
   *   console.error(error.message)
   * }
   * ```
   */
  static handle(error: unknown, defaultMessage: string = 'حدث خطأ غير متوقع'): Error {
    if (error instanceof Error) {
      return error
    }

    if (typeof error === 'string') {
      return new Error(error)
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return new Error(String(error.message))
    }

    return new Error(defaultMessage)
  }

  /**
   * معالجة عملية async مع معالجة الأخطاء التلقائية
   *
   * @param operation - العملية المراد تنفيذها
   * @param defaultMessage - الرسالة الافتراضية في حالة الخطأ
   * @returns Promise مع النتيجة
   *
   * @example
   * ```typescript
   * const result = await ErrorHandler.handleAsync(
   *   () => apiClient.get('/api/data'),
   *   'فشل جلب البيانات'
   * )
   * ```
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    defaultMessage: string = 'فشلت العملية'
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw this.handle(error, defaultMessage)
    }
  }

  /**
   * استخراج رسالة الخطأ
   *
   * @param error - الخطأ
   * @param defaultMessage - الرسالة الافتراضية
   * @returns رسالة الخطأ
   */
  static getMessage(error: unknown, defaultMessage: string = 'حدث خطأ غير متوقع'): string {
    const handledError = this.handle(error, defaultMessage)
    return handledError.message
  }

  /**
   * التحقق من نوع الخطأ
   *
   * @param error - الخطأ المراد التحقق منه
   * @param errorType - نوع الخطأ المطلوب
   * @returns true إذا كان الخطأ من النوع المحدد
   */
  static isInstanceOf<T extends Error>(
    error: unknown,
    errorType: new (...args: any[]) => T
  ): error is T {
    return error instanceof errorType
  }

  /**
   * إنشاء خطأ مخصص مع سياق إضافي
   *
   * @param message - رسالة الخطأ
   * @param context - السياق الإضافي
   * @returns Error object مع معلومات إضافية
   */
  static createError(message: string, context?: Record<string, unknown>): Error {
    const error = new Error(message)
    if (context) {
      Object.assign(error, { context })
    }
    return error
  }
}
