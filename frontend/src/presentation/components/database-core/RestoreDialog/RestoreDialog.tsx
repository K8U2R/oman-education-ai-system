/**
 * Restore Dialog Component - حوار استعادة النسخ الاحتياطي
 *
 * مكون متخصص لاستعادة النسخ الاحتياطي
 */

import React, { useState } from 'react'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { Button, Checkbox } from '@/presentation/components/common'
import type { Backup, RestoreOptions } from '@/application/features/database-core/types'

export interface RestoreDialogProps {
  backup: Backup | null
  open: boolean
  loading?: boolean
  error?: Error | null
  onClose: () => void
  onConfirm: (options: RestoreOptions) => void
  className?: string
}

/**
 * Restore Dialog - حوار استعادة النسخ الاحتياطي
 *
 * @example
 * ```tsx
 * <RestoreDialog backup={backup} open={isOpen} onClose={handleClose} onConfirm={handleRestore} />
 * ```
 */
export const RestoreDialog: React.FC<RestoreDialogProps> = ({
  backup,
  open,
  loading = false,
  error = null,
  onClose,
  onConfirm,
  className = '',
}) => {
  const [dropExisting, setDropExisting] = useState(false)
  const [selectedTables, setSelectedTables] = useState<string[]>([])

  if (!open || !backup) {
    return null
  }

  const handleConfirm = () => {
    if (!backup) return

    onConfirm({
      backupId: backup.id,
      tables: selectedTables.length > 0 ? selectedTables : undefined,
      dropExisting,
    })
  }

  const toggleTable = (table: string) => {
    setSelectedTables(prev =>
      prev.includes(table) ? prev.filter(t => t !== table) : [...prev, table]
    )
  }

  return (
    <div className={`restore-dialog ${className}`}>
      <div className="restore-dialog__overlay" onClick={onClose} />
      <div className="restore-dialog__content">
        <BaseCard
          title="Restore Backup"
          icon={<RotateCcw />}
          loading={loading}
          error={error?.message}
          className="restore-dialog__card"
        >
          <div className="restore-dialog__warning">
            <AlertTriangle size={20} className="restore-dialog__warning-icon" />
            <p className="restore-dialog__warning-text">
              تحذير: استعادة النسخ الاحتياطي سيستبدل البيانات الحالية. تأكد من أنك تريد المتابعة.
            </p>
          </div>

          <div className="restore-dialog__info">
            <div className="restore-dialog__info-row">
              <span className="restore-dialog__info-label">النسخ الاحتياطي:</span>
              <span className="restore-dialog__info-value">{backup.name}</span>
            </div>
            <div className="restore-dialog__info-row">
              <span className="restore-dialog__info-label">النوع:</span>
              <span className="restore-dialog__info-value">
                {backup.type === 'full' ? 'كامل' : 'تدريجي'}
              </span>
            </div>
            <div className="restore-dialog__info-row">
              <span className="restore-dialog__info-label">الحجم:</span>
              <span className="restore-dialog__info-value">{backup.sizeFormatted}</span>
            </div>
          </div>

          {backup.tables && backup.tables.length > 0 && (
            <div className="restore-dialog__tables">
              <label className="restore-dialog__tables-label">اختر الجداول (اختياري):</label>
              <div className="restore-dialog__tables-list">
                {backup.tables.map(table => (
                  <label key={table} className="restore-dialog__table-item">
                    <Checkbox
                      checked={selectedTables.includes(table)}
                      onChange={() => toggleTable(table)}
                    />
                    <span>{table}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="restore-dialog__options">
            <label className="restore-dialog__option-item">
              <Checkbox checked={dropExisting} onChange={setDropExisting} />
              <span>حذف الجداول الموجودة قبل الاستعادة</span>
            </label>
          </div>

          <div className="restore-dialog__actions">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={loading}
              leftIcon={<RotateCcw size={16} />}
            >
              استعادة
            </Button>
          </div>
        </BaseCard>
      </div>
    </div>
  )
}
