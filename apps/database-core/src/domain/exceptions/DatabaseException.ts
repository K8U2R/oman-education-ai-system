/**
 * DatabaseException - استثناء قاعدة البيانات الأساسي
 *
 * الاستثناء الأساسي لجميع أخطاء قاعدة البيانات
 */

export class DatabaseException extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    code: string = 'DATABASE_ERROR',
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'DatabaseException'
    this.code = code
    this.statusCode = statusCode
    this.details = details

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseException)
    }
  }
}
