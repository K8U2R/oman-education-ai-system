import type { AuditMetadata, QueryConditions } from '../../shared/types'

/**
 * AuditLog - كيان سجل التدقيق
 *
 * يمثل سجل تدقيق لعملية على قاعدة البيانات
 */
export interface AuditLog {
  id?: string
  actor: string
  action: string
  entity: string
  conditions: QueryConditions
  before?: AuditMetadata
  after?: AuditMetadata
  timestamp: Date
  success: boolean
  error?: string
}

/**
 * إنشاء سجل تدقيق جديد
 */
export function createAuditLog(params: {
  actor: string
  action: string
  entity: string
  conditions: QueryConditions
  before?: AuditMetadata
  after?: AuditMetadata
  success?: boolean
  error?: string
}): AuditLog {
  return {
    actor: params.actor,
    action: params.action,
    entity: params.entity,
    conditions: params.conditions,
    before: params.before,
    after: params.after,
    timestamp: new Date(),
    success: params.success ?? true,
    error: params.error,
  }
}
