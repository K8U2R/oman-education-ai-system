/**
 * Backup List Table Component - جدول قائمة النسخ الاحتياطي
 *
 * مكون متخصص لعرض قائمة النسخ الاحتياطي
 */

import React from 'react'
import { Download, Trash2, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { formatDateTime, formatBytes } from '@/application/features/database-core/utils'
import type { Backup } from '@/application/features/database-core/types'
import { Button } from '@/presentation/components/common'

export interface BackupListTableProps {
  backups?: Backup[]
  loading?: boolean
  error?: Error | null
  onRestore?: (backupId: string) => void
  onDelete?: (backupId: string) => void
  onDownload?: (backupId: string) => void
  className?: string
}

/**
 * Backup List Table - جدول قائمة النسخ الاحتياطي
 *
 * @example
 * ```tsx
 * <BackupListTable backups={backups} onRestore={handleRestore} />
 * ```
 */
export const BackupListTable: React.FC<BackupListTableProps> = ({
  backups = [],
  loading = false,
  error = null,
  onRestore,
  onDelete,
  onDownload,
  className = '',
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="backup-list-table__icon--success" />
      case 'failed':
        return <XCircle size={16} className="backup-list-table__icon--danger" />
      case 'in_progress':
        return <Clock size={16} className="backup-list-table__icon--warning" />
      case 'pending':
        return <AlertCircle size={16} className="backup-list-table__icon--info" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'failed':
        return 'فشل'
      case 'in_progress':
        return 'قيد التنفيذ'
      case 'pending':
        return 'قيد الانتظار'
      default:
        return status
    }
  }

  return (
    <BaseCard
      title="Backup List"
      description="قائمة النسخ الاحتياطي"
      loading={loading}
      error={error?.message}
      className={`backup-list-table ${className}`}
    >
      {backups.length === 0 ? (
        <div className="backup-list-table__empty">
          <p>لا توجد نسخ احتياطية</p>
        </div>
      ) : (
        <div className="backup-list-table__container">
          <table className="backup-list-table__table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>النوع</th>
                <th>الحالة</th>
                <th>الحجم</th>
                <th>تاريخ الإنشاء</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(backup => (
                <tr key={backup.id}>
                  <td className="backup-list-table__name-cell">
                    <strong>{backup.name}</strong>
                  </td>
                  <td>
                    <span className="backup-list-table__type-badge">
                      {backup.type === 'full' ? 'كامل' : 'تدريجي'}
                    </span>
                  </td>
                  <td>
                    <div className="backup-list-table__status">
                      {getStatusIcon(backup.status)}
                      <span
                        className={`backup-list-table__status-text backup-list-table__status-text--${backup.status}`}
                      >
                        {getStatusLabel(backup.status)}
                      </span>
                    </div>
                  </td>
                  <td>{backup.sizeFormatted || formatBytes(backup.size)}</td>
                  <td>{formatDateTime(backup.createdAt)}</td>
                  <td>
                    <div className="backup-list-table__actions">
                      {backup.status === 'completed' && onRestore && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRestore(backup.id)}
                          leftIcon={<RotateCcw size={14} />}
                        >
                          استعادة
                        </Button>
                      )}
                      {backup.status === 'completed' && onDownload && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(backup.id)}
                          leftIcon={<Download size={14} />}
                        >
                          تحميل
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(backup.id)}
                          leftIcon={<Trash2 size={14} />}
                        >
                          حذف
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
    </BaseCard>
  )
}
