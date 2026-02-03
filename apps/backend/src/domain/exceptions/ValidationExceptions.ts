/**
 * Validation Exceptions - استثناءات التحقق
 *
 * Custom error classes لأخطاء التحقق من البيانات
 */

/**
 * ValidationError - خطأ التحقق
 *
 * يُستخدم عندما تكون البيانات المدخلة غير صحيحة
 */
export class ValidationError extends Error {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;

  constructor(message: string = "بيانات غير صحيحة") {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
