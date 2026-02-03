/**
 * Run Migration Dialog Component - حوار تشغيل Migration
 *
 * مكون متخصص لتشغيل Migration
 */

import React from 'react'
import { Play, AlertTriangle } from 'lucide-react'
import { BaseCard } from '../BaseCard'
import { Button } from '@/presentation/components/common'
import type { Migration } from '@/application/features/database-core/types'

export interface RunMigrationDialogProps {
  migration: Migration | null
  open: boolean
  loading?: boolean
  error?: Error | null
  onClose: () => void
  onConfirm: (migrationId: string) => void
  className?: string
}

/**
 * Run Migration Dialog - حوار تشغيل Migration
 *
 * @example
 * ```tsx
 * <RunMigrationDialog migration={migration} open={isOpen} onClose={handleClose} onConfirm={handleRun} />
 * ```
 */
export const RunMigrationDialog: React.FC<RunMigrationDialogProps> = ({
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
    <div className={`run-migration-dialog ${className}`}>
      <div className="run-migration-dialog__overlay" onClick={onClose} />
      <div className="run-migration-dialog__content">
        <BaseCard
          title="Run Migration"
          icon={<Play />}
          loading={loading}
          error={error?.message}
          className="run-migration-dialog__card"
        >
          <div className="run-migration-dialog__warning">
            <AlertTriangle size={20} className="run-migration-dialog__warning-icon" />
            <p className="run-migration-dialog__warning-text">
              سيتم تشغيل Migration. تأكد من أنك تريد المتابعة.
            </p>
          </div>

          <div className="run-migration-dialog__info">
            <div className="run-migration-dialog__info-row">
              <span className="run-migration-dialog__info-label">الإصدار:</span>
              <span className="run-migration-dialog__info-value">
                <code>{migration.version}</code>
              </span>
            </div>
            <div className="run-migration-dialog__info-row">
              <span className="run-migration-dialog__info-label">الاسم:</span>
              <span className="run-migration-dialog__info-value">{migration.name}</span>
            </div>
            <div className="run-migration-dialog__info-row">
              <span className="run-migration-dialog__info-label">الحالة الحالية:</span>
              <span className="run-migration-dialog__info-value">{migration.status}</span>
            </div>
          </div>

          <div className="run-migration-dialog__actions">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={loading}
              leftIcon={<Play size={16} />}
            >
              تشغيل
            </Button>
          </div>
        </BaseCard>
      </div>
    </div>
  )
}
