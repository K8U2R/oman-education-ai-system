/**
 * Rollback Migration Dialog Component - حوار التراجع عن Migration
 *
 * مكون متخصص للتراجع عن Migration
 */

import React from 'react'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { Button } from '@/presentation/components/common'
import type { Migration } from '@/application/features/database-core/types'

export interface RollbackMigrationDialogProps {
  migration: Migration | null
  open: boolean
  loading?: boolean
  error?: Error | null
  onClose: () => void
  onConfirm: (migrationId: string) => void
  className?: string
}

/**
 * Rollback Migration Dialog - حوار التراجع عن Migration
 *
 * @example
 * ```tsx
 * <RollbackMigrationDialog migration={migration} open={isOpen} onClose={handleClose} onConfirm={handleRollback} />
 * ```
 */
export const RollbackMigrationDialog: React.FC<RollbackMigrationDialogProps> = ({
  migration,
  open,
  loading = false,
  error = null,
  onClose,
  onConfirm,
  className = '',
}) => {
  if (!open || !migration) {
    return null
  }

  const handleConfirm = () => {
    onConfirm(migration.id)
  }

  return (
    <div className={`rollback-migration-dialog ${className}`}>
      <div className="rollback-migration-dialog__overlay" onClick={onClose} />
      <div className="rollback-migration-dialog__content">
        <BaseCard
          title="Rollback Migration"
          icon={<RotateCcw />}
          loading={loading}
          error={error}
          className="rollback-migration-dialog__card"
        >
          <div className="rollback-migration-dialog__warning">
            <AlertTriangle size={20} className="rollback-migration-dialog__warning-icon" />
            <p className="rollback-migration-dialog__warning-text">
              تحذير: التراجع عن Migration سيستبدل التغييرات. تأكد من أنك تريد المتابعة.
            </p>
          </div>

          <div className="rollback-migration-dialog__info">
            <div className="rollback-migration-dialog__info-row">
              <span className="rollback-migration-dialog__info-label">الإصدار:</span>
              <span className="rollback-migration-dialog__info-value">
                <code>{migration.version}</code>
              </span>
            </div>
            <div className="rollback-migration-dialog__info-row">
              <span className="rollback-migration-dialog__info-label">الاسم:</span>
              <span className="rollback-migration-dialog__info-value">{migration.name}</span>
            </div>
            <div className="rollback-migration-dialog__info-row">
              <span className="rollback-migration-dialog__info-label">الحالة الحالية:</span>
              <span className="rollback-migration-dialog__info-value">{migration.status}</span>
            </div>
          </div>

          <div className="rollback-migration-dialog__actions">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={loading}
              leftIcon={<RotateCcw size={16} />}
            >
              تراجع
            </Button>
          </div>
        </BaseCard>
      </div>
    </div>
  )
}
