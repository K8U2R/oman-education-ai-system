import type { QueryConditions } from '../../shared/types'

/**
 * QueryCondition - شروط الاستعلام
 *
 * Value Object يمثل شروط البحث في قاعدة البيانات
 */
export type QueryCondition = QueryConditions

/**
 * بناء شروط الاستعلام من كائن
 */
export function createQueryCondition(conditions: QueryConditions): QueryCondition {
  return { ...conditions }
}

/**
 * التحقق من صحة شروط الاستعلام
 */
export function isValidQueryCondition(condition: unknown): condition is QueryCondition {
  return typeof condition === 'object' && condition !== null && !Array.isArray(condition)
}
