/**
 * Errors Constants - ثوابت الأخطاء
 *
 * ثوابت متعلقة برسائل الأخطاء
 */

/**
 * رموز الأخطاء
 */
export const ERROR_CODES = {
  DATABASE_ERROR: 'DATABASE_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  QUERY_ERROR: 'QUERY_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const

/**
 * رسائل الأخطاء
 */
export const ERROR_MESSAGES = {
  DATABASE_ERROR: 'حدث خطأ في قاعدة البيانات',
  PERMISSION_DENIED: 'لا توجد صلاحية لتنفيذ هذه العملية',
  QUERY_ERROR: 'حدث خطأ في تنفيذ الاستعلام',
  VALIDATION_ERROR: 'خطأ في التحقق من البيانات',
  NOT_FOUND: 'المورد غير موجود',
  CONNECTION_ERROR: 'فشل الاتصال بقاعدة البيانات',
  TIMEOUT_ERROR: 'انتهت مهلة الاتصال',
} as const
