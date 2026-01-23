/**
 * DatabaseResponse - عقد استجابة قاعدة البيانات
 */
export interface DatabaseResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  auditId?: string
}

/**
 * إنشاء استجابة ناجحة
 */
export function createSuccessResponse<T = unknown>(data: T, auditId?: string): DatabaseResponse<T> {
  return {
    success: true,
    data,
    auditId,
  }
}

/**
 * إنشاء استجابة خطأ
 */
export function createErrorResponse(error: string): DatabaseResponse {
  return {
    success: false,
    error,
  }
}
