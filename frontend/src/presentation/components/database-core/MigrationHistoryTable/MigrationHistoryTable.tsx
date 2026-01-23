/**
 * Migration History Table Component - جدول تاريخ Migrations
 *
 * مكون متخصص لعرض تاريخ Migrations
 */

import React from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle, Play, RotateCcw } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { formatDuration, formatDateTime } from '@/application/features/database-core/utils'
import type { Migration } from '@/application/features/database-core/types'
import { Button } from '@/presentation/components/common'

export interface MigrationHistoryTableProps {
  migrations?: Migration[]
  loading?: boolean
  error?: Error | null
  onRun?: (migrationId: string) => void
  onRollback?: (migrationId: string) => void
  className?: string
}

/**
 * Migration History Table - جدول تاريخ Migrations
 *
 * @example
 * ```tsx
 * <MigrationHistoryTable migrations={migrations} onRun={handleRun} />
 * ```
 */
export const MigrationHistoryTable: React.FC<MigrationHistoryTableProps> = ({
  migrations = [],
  loading = false,
  error = null,
  onRun,
  onRollback,
  className = '',
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="migration-history-table__icon--success" />
      case 'failed':
        return <XCircle size={16} className="migration-history-table__icon--danger" />
      case 'running':
        return <Clock size={16} className="migration-history-table__icon--warning" />
      case 'rolled_back':
        return <RotateCcw size={16} className="migration-history-table__icon--info" />
      default:
        return <AlertCircle size={16} className="migration-history-table__icon--default" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'failed':
        return 'فشل'
      case 'running':
        return 'قيد التنفيذ'
      case 'pending':
        return 'قيد الانتظار'
      case 'rolled_back':
        return 'تم التراجع'
      default:
        return status
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'migration-history-table__status--success'
      case 'failed':
        return 'migration-history-table__status--danger'
      case 'running':
        return 'migration-history-table__status--warning'
      case 'rolled_back':
        return 'migration-history-table__status--info'
      default:
        return 'migration-history-table__status--default'
    }
  }

  return (
    <BaseCard
      title="Migration History"
      description="تاريخ Migrations"
      loading={loading}
      error={error?.message}
      className={`migration-history-table ${className}`}
    >
      {migrations.length === 0 ? (
        <div className="migration-history-table__empty">
          <p>لا توجد migrations</p>
        </div>
      ) : (
        <div className="migration-history-table__container">
          <table className="migration-history-table__table">
            <thead>
              <tr>
                <th>الإصدار</th>
                <th>الاسم</th>
                <th>الحالة</th>
                <th>المدة</th>
                <th>الوقت</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {migrations.map(migration => (
                <tr key={migration.id}>
                  <td className="migration-history-table__version-cell">
                    <code>{migration.version}</code>
                  </td>
                  <td className="migration-history-table__name-cell">
                    <strong>{migration.name}</strong>
                  </td>
                  <td>
                    <div className="migration-history-table__status">
                      {getStatusIcon(migration.status)}
                      <span
                        className={`migration-history-table__status-text ${getStatusBadgeClass(migration.status)}`}
                      >
                        {getStatusLabel(migration.status)}
                      </span>
                    </div>
                  </td>
                  <td>{migration.duration ? formatDuration(migration.duration) : '-'}</td>
                  <td>{formatDateTime(migration.timestamp)}</td>
                  <td>
                    <div className="migration-history-table__actions">
                      {migration.status === 'pending' && onRun && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRun(migration.id)}
                          leftIcon={<Play size={14} />}
                        >
                          تشغيل
                        </Button>
                      )}
                      {migration.status === 'completed' && onRollback && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRollback(migration.id)}
                          leftIcon={<RotateCcw size={14} />}
                        >
                          تراجع
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && migrations.length > 0 && (
        <div className="migration-history-table__error-details">
          {migrations
            .filter(m => m.status === 'failed' && m.error)
            .map(migration => (
              <div key={migration.id} className="migration-history-table__error-item">
                <strong>{migration.name}:</strong> {migration.error}
              </div>
            ))}
        </div>
      )}
    </BaseCard>
  )
}
