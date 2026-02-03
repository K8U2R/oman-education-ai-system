/**
 * AuditAnalytics - تحليلات Audit Logs
 *
 * تحليل وإحصائيات Audit Logs مع:
 * - Dashboard Data
 * - Reports
 * - Alerts
 * - Trends Analysis
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { logger } from '../../shared/utils/logger'

/**
 * Audit Analytics Configuration
 */
export interface AuditAnalyticsConfig {
  auditTableName?: string
  timeWindow?: number // Time window in milliseconds for analysis
}

/**
 * Audit Statistics
 */
export interface AuditStatistics {
  totalLogs: number
  logsByAction: Record<string, number>
  logsByEntity: Record<string, number>
  logsByActor: Record<string, number>
  successRate: number
  errorRate: number
  averageExecutionTime: number
  recentErrors: Array<{
    timestamp: Date
    actor: string
    action: string
    entity: string
    error: string
  }>
}

/**
 * Audit Trends
 */
export interface AuditTrends {
  period: string
  totalLogs: number
  successCount: number
  errorCount: number
  averageExecutionTime: number
  topActions: Array<{ action: string; count: number }>
  topEntities: Array<{ entity: string; count: number }>
  topActors: Array<{ actor: string; count: number }>
}

/**
 * Audit Alert
 */
export interface AuditAlert {
  id: string
  type: 'error_rate' | 'suspicious_activity' | 'unauthorized_access' | 'performance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

/**
 * Audit Analytics Service
 */
export class AuditAnalytics {
  private readonly adapter: IDatabaseAdapter
  private readonly auditTableName: string
  private readonly timeWindow: number

  constructor(adapter: IDatabaseAdapter, config: AuditAnalyticsConfig = {}) {
    this.adapter = adapter
    this.auditTableName = config.auditTableName || 'audit_logs'
    this.timeWindow = config.timeWindow || 24 * 60 * 60 * 1000 // 24 hours default
  }

  /**
   * الحصول على إحصائيات Audit Logs
   */
  async getStatistics(timeWindow?: number): Promise<AuditStatistics> {
    const window = timeWindow || this.timeWindow
    const cutoff = new Date(Date.now() - window)

    try {
      // الحصول على جميع الـ Logs في الفترة الزمنية
      // Note: Date range queries require executeRaw for most adapters
      let logs: any[]
      try {
        // Try executeRaw first (for SQL databases)
        logs = await this.adapter.executeRaw<any[]>(
          `SELECT * FROM ${this.auditTableName} WHERE timestamp >= :cutoff ORDER BY timestamp DESC`,
          { cutoff: cutoff.toISOString() }
        )
      } catch {
        // Fallback: get all logs and filter in memory
        const allLogs = await this.adapter.find(this.auditTableName, {})
        logs = allLogs.filter((log: any) => {
          const logDate = new Date(log.timestamp)
          return logDate >= cutoff
        })
      }

      const totalLogs = logs.length
      const logsByAction: Record<string, number> = {}
      const logsByEntity: Record<string, number> = {}
      const logsByActor: Record<string, number> = {}
      let successCount = 0
      let errorCount = 0
      let totalExecutionTime = 0
      const recentErrors: AuditStatistics['recentErrors'] = []

      for (const log of logs) {
        const action = (log as any).action || 'unknown'
        const entity = (log as any).entity || 'unknown'
        const actor = (log as any).actor || 'unknown'
        const success = (log as any).success !== false
        const executionTime = (log as any).executionTime || 0
        const error = (log as any).error

        // Count by action
        logsByAction[action] = (logsByAction[action] || 0) + 1

        // Count by entity
        logsByEntity[entity] = (logsByEntity[entity] || 0) + 1

        // Count by actor
        logsByActor[actor] = (logsByActor[actor] || 0) + 1

        // Count success/error
        if (success) {
          successCount++
        } else {
          errorCount++
          if (error && recentErrors.length < 10) {
            recentErrors.push({
              timestamp: new Date((log as any).timestamp),
              actor,
              action,
              entity,
              error: error instanceof Error ? error.message : String(error),
            })
          }
        }

        totalExecutionTime += executionTime
      }

      const successRate = totalLogs > 0 ? successCount / totalLogs : 0
      const errorRate = totalLogs > 0 ? errorCount / totalLogs : 0
      const averageExecutionTime = totalLogs > 0 ? totalExecutionTime / totalLogs : 0

      return {
        totalLogs,
        logsByAction,
        logsByEntity,
        logsByActor,
        successRate: Math.round(successRate * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        averageExecutionTime: Math.round(averageExecutionTime),
        recentErrors: recentErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      }
    } catch (error) {
      logger.error('Failed to get audit statistics', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * الحصول على Trends
   */
  async getTrends(period: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<AuditTrends[]> {
    const periods: AuditTrends[] = []
    const now = Date.now()
    let periodMs: number
    let periodCount: number

    switch (period) {
      case 'hour':
        periodMs = 60 * 60 * 1000
        periodCount = 24
        break
      case 'day':
        periodMs = 24 * 60 * 60 * 1000
        periodCount = 7
        break
      case 'week':
        periodMs = 7 * 24 * 60 * 60 * 1000
        periodCount = 4
        break
      case 'month':
        periodMs = 30 * 24 * 60 * 60 * 1000
        periodCount = 12
        break
    }

    try {
      for (let i = periodCount - 1; i >= 0; i--) {
        const periodStart = new Date(now - (i + 1) * periodMs)
        const periodEnd = new Date(now - i * periodMs)

        // Note: Date range queries require executeRaw for most adapters
        let logs: any[]
        try {
          // Try executeRaw first (for SQL databases)
          logs = await this.adapter.executeRaw<any[]>(
            `SELECT * FROM ${this.auditTableName} WHERE timestamp >= :start AND timestamp <= :end ORDER BY timestamp DESC`,
            {
              start: periodStart.toISOString(),
              end: periodEnd.toISOString(),
            }
          )
        } catch {
          // Fallback: get all logs and filter in memory
          const allLogs = await this.adapter.find(this.auditTableName, {})
          logs = allLogs.filter((log: any) => {
            const logDate = new Date(log.timestamp)
            return logDate >= periodStart && logDate <= periodEnd
          })
        }

        const totalLogs = logs.length
        let successCount = 0
        let errorCount = 0
        let totalExecutionTime = 0
        const actionCounts: Record<string, number> = {}
        const entityCounts: Record<string, number> = {}
        const actorCounts: Record<string, number> = {}

        for (const log of logs) {
          const action = (log as any).action || 'unknown'
          const entity = (log as any).entity || 'unknown'
          const actor = (log as any).actor || 'unknown'
          const success = (log as any).success !== false
          const executionTime = (log as any).executionTime || 0

          actionCounts[action] = (actionCounts[action] || 0) + 1
          entityCounts[entity] = (entityCounts[entity] || 0) + 1
          actorCounts[actor] = (actorCounts[actor] || 0) + 1

          if (success) {
            successCount++
          } else {
            errorCount++
          }

          totalExecutionTime += executionTime
        }

        const topActions = Object.entries(actionCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([action, count]) => ({ action, count }))

        const topEntities = Object.entries(entityCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([entity, count]) => ({ entity, count }))

        const topActors = Object.entries(actorCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([actor, count]) => ({ actor, count }))

        periods.push({
          period: periodStart.toISOString(),
          totalLogs,
          successCount,
          errorCount,
          averageExecutionTime: totalLogs > 0 ? Math.round(totalExecutionTime / totalLogs) : 0,
          topActions,
          topEntities,
          topActors,
        })
      }

      return periods
    } catch (error) {
      logger.error('Failed to get audit trends', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * الحصول على Alerts
   */
  async getAlerts(timeWindow?: number): Promise<AuditAlert[]> {
    const window = timeWindow || this.timeWindow
    const stats = await this.getStatistics(window)
    const alerts: AuditAlert[] = []

    // Error Rate Alert
    if (stats.errorRate > 0.1) {
      alerts.push({
        id: `error_rate_${Date.now()}`,
        type: 'error_rate',
        severity: stats.errorRate > 0.3 ? 'critical' : stats.errorRate > 0.2 ? 'high' : 'medium',
        message: `High error rate detected: ${(stats.errorRate * 100).toFixed(2)}%`,
        timestamp: new Date(),
        metadata: { errorRate: stats.errorRate },
      })
    }

    // Performance Alert
    if (stats.averageExecutionTime > 2000) {
      alerts.push({
        id: `performance_${Date.now()}`,
        type: 'performance',
        severity: stats.averageExecutionTime > 5000 ? 'high' : 'medium',
        message: `High average execution time: ${stats.averageExecutionTime}ms`,
        timestamp: new Date(),
        metadata: { averageExecutionTime: stats.averageExecutionTime },
      })
    }

    // Suspicious Activity Alert (many operations from same actor)
    const topActor = Object.entries(stats.logsByActor).sort(([, a], [, b]) => b - a)[0]

    if (topActor && topActor[1] > 1000) {
      alerts.push({
        id: `suspicious_${Date.now()}`,
        type: 'suspicious_activity',
        severity: topActor[1] > 5000 ? 'high' : 'medium',
        message: `Suspicious activity detected: ${topActor[0]} performed ${topActor[1]} operations`,
        timestamp: new Date(),
        metadata: { actor: topActor[0], count: topActor[1] },
      })
    }

    return alerts
  }

  /**
   * إنشاء Report
   */
  async generateReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    period: { start: Date; end: Date }
    statistics: AuditStatistics
    trends: AuditTrends[]
    alerts: AuditAlert[]
  }> {
    const timeWindow = endDate.getTime() - startDate.getTime()
    const statistics = await this.getStatistics(timeWindow)
    const trends = await this.getTrends('day')
    const alerts = await this.getAlerts(timeWindow)

    return {
      period: { start: startDate, end: endDate },
      statistics,
      trends,
      alerts,
    }
  }
}
