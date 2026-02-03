/**
 * OperationType - نوع العملية على قاعدة البيانات
 *
 * Value Object يمثل أنواع العمليات المتاحة
 */
export enum OperationType {
  FIND = 'FIND',
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  COUNT = 'COUNT',
}

/**
 * التحقق من صحة نوع العملية
 */
export function isValidOperationType(value: string): value is OperationType {
  return Object.values(OperationType).includes(value as OperationType)
}

/**
 * الحصول على جميع أنواع العمليات
 */
export function getAllOperationTypes(): OperationType[] {
  return Object.values(OperationType)
}
