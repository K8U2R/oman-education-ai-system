/**
 * Cache Key Utility - أداة مفاتيح Cache
 *
 * أدوات مساعدة لإنشاء مفاتيح Cache متسقة
 */

import { OperationType } from '../../domain/value-objects/OperationType'

/**
 * إنشاء مفتاح Cache من المعاملات
 */
export function generateCacheKey(
  operation: OperationType | string,
  entity: string,
  conditions?: Record<string, unknown>,
  options?: {
    limit?: number
    offset?: number
    orderBy?: { column: string; direction: 'asc' | 'desc' }
  }
): string {
  const parts: string[] = [operation, entity]

  // إضافة الشروط
  if (conditions && Object.keys(conditions).length > 0) {
    const sortedConditions = Object.keys(conditions)
      .sort()
      .map(key => `${key}:${JSON.stringify(conditions[key])}`)
      .join('|')
    parts.push(sortedConditions)
  }

  // إضافة الخيارات
  if (options) {
    if (options.limit) {
      parts.push(`limit:${options.limit}`)
    }
    if (options.offset) {
      parts.push(`offset:${options.offset}`)
    }
    if (options.orderBy) {
      parts.push(`orderBy:${options.orderBy.column}:${options.orderBy.direction}`)
    }
  }

  return parts.join(':')
}

/**
 * إنشاء مفتاح Cache لـ entity معين
 */
export function generateEntityCacheKey(entity: string, id: string): string {
  return `entity:${entity}:${id}`
}

/**
 * إنشاء مفتاح Cache لـ list
 */
export function generateListCacheKey(entity: string, filters?: Record<string, unknown>): string {
  if (filters && Object.keys(filters).length > 0) {
    const sortedFilters = Object.keys(filters)
      .sort()
      .map(key => `${key}:${JSON.stringify(filters[key])}`)
      .join('|')
    return `list:${entity}:${sortedFilters}`
  }
  return `list:${entity}`
}

/**
 * إنشاء pattern لمسح Cache
 */
export function generateCachePattern(entity: string): string {
  return `${entity}:*`
}
