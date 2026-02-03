/**
 * Audit Logs Table Component - جدول Audit Logs
 *
 * مكون متخصص لعرض Audit Logs
 */

import React from 'react'
import { BaseCard } from '../BaseCard'
import { formatDuration, formatDateTime } from '@/application/features/database-core/utils'
import type { AuditLogEntry } from '@/application/features/database-core/types'

export interface AuditLogsTableProps {
  logs?: AuditLogEntry[]
  loading?: boolean
  error?: Error | null
  maxRows?: number
  onRowClick?: (log: AuditLogEntry) => void
  className?: string
}

/**
 * Audit Logs Table - جدول Audit Logs
 *
 * @example
 * ```tsx
 * <AuditLogsTable logs={logs} loading={loading} />
 * ```
 */
export const AuditLogsTable: React.FC<AuditLogsTableProps> = ({
  logs = [],
  loading = false,
  error = null,
  maxRows = 100,
  onRowClick,
  className = '',
}) => {
  const displayedLogs = logs.slice(0, maxRows)

  return (
    <BaseCard
      title="Audit Logs"
      description="سجل العمليات والأنشطة"
      loading={loading}
      error={error?.message}
      className={`audit-logs-table ${className}`}
    >
      {displayedLogs.length === 0 ? (
        <div className="audit-logs-table__empty">
          <p>لا توجد سجلات</p>
        </div>
      ) : (
        <div className="audit-logs-table__container">
          <table className="audit-logs-table__table">
            <thead>
              <tr>
                <th>الوقت</th>
                <th>الممثل</th>
                <th>الإجراء</th>
                <th>الكيان</th>
                <th>الحالة</th>
                <th>المدة</th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map(log => (
                <tr
                  key={log.id}
                  className={`audit-logs-table__row ${
                    onRowClick ? 'audit-logs-table__row--clickable' : ''
                  } ${!log.success ? 'audit-logs-table__row--error' : ''}`}
                  onClick={() => onRowClick?.(log)}
                >
                  <td>{formatDateTime(log.timestamp)}</td>
                  <td>{log.actor}</td>
                  <td>
                    <span className="audit-logs-table__action">{log.action}</span>
                  </td>
                  <td>{log.entity}</td>
                  <td>
                    <span
                      className={`audit-logs-table__status ${
                        log.success
                          ? 'audit-logs-table__status--success'
                          : 'audit-logs-table__status--danger'
                      }`}
                    >
                      {log.success ? 'نجح' : 'فشل'}
                    </span>
                  </td>
                  <td>{formatDuration(log.executionTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </BaseCard>
  )
}
