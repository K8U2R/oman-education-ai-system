/**
 * Audit Types - أنواع Audit Logs
 */

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  entity: string
  conditions?: Record<string, unknown>
  beforeData?: Record<string, unknown>
  afterData?: Record<string, unknown>
  success: boolean
  error?: string
  executionTime: number
  timestamp: string
}

/**
 * Audit Statistics
 */
export interface AuditStatistics {
  total: number
  successful: number
  failed: number
  byAction: Record<string, number>
  byEntity: Record<string, number>
  byActor: Record<string, number>
  averageExecutionTime: number
}

/**
 * Audit Trend
 */
export interface AuditTrend {
  period: string
  total: number
  successful: number
  failed: number
  averageExecutionTime: number
}

/**
 * Audit Alert
 */
export interface AuditAlert {
  id: string
  type: 'error_rate' | 'slow_operation' | 'unauthorized_access' | 'data_modification'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  count?: number
}

/**
 * Audit Report
 */
export interface AuditReport {
  startDate: string
  endDate: string
  statistics: AuditStatistics
  trends: AuditTrend[]
  alerts: AuditAlert[]
  topActions: Array<{ action: string; count: number }>
  topEntities: Array<{ entity: string; count: number }>
  topActors: Array<{ actor: string; count: number }>
}
