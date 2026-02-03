/**
 * Operations Constants - ثوابت العمليات
 *
 * ثوابت متعلقة بعمليات قاعدة البيانات
 */

import { OperationType } from '../value-objects/OperationType'

/**
 * أسماء العمليات بالعربية
 */
export const OPERATION_NAMES: Record<OperationType, string> = {
  [OperationType.FIND]: 'البحث',
  [OperationType.INSERT]: 'الإدراج',
  [OperationType.UPDATE]: 'التحديث',
  [OperationType.DELETE]: 'الحذف',
  [OperationType.COUNT]: 'العد',
}

/**
 * عمليات القراءة
 */
export const READ_OPERATIONS: OperationType[] = [OperationType.FIND, OperationType.COUNT]

/**
 * عمليات الكتابة
 */
export const WRITE_OPERATIONS: OperationType[] = [
  OperationType.INSERT,
  OperationType.UPDATE,
  OperationType.DELETE,
]

/**
 * الحد الأقصى لعدد السجلات في الاستعلام
 */
export const MAX_QUERY_LIMIT = 1000

/**
 * الحد الأدنى لعدد السجلات في الاستعلام
 */
export const MIN_QUERY_LIMIT = 1

/**
 * الحد الافتراضي لعدد السجلات
 */
export const DEFAULT_QUERY_LIMIT = 100
