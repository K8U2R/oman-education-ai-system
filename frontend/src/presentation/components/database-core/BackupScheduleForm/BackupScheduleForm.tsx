/**
 * Backup Schedule Form Component - نموذج جدولة النسخ الاحتياطي
 *
 * مكون متخصص لجدولة النسخ الاحتياطي
 */

import React, { useState } from 'react'
import { BaseCard } from '../BaseCard'
import { Button, Input, Switch } from '@/presentation/components/common'
import type { BackupSchedule } from '@/application/features/database-core/types'

export interface BackupScheduleFormProps {
  schedule?: BackupSchedule | null
  loading?: boolean
  error?: Error | null
  onSubmit?: (schedule: BackupSchedule) => void
  className?: string
}

/**
 * Backup Schedule Form - نموذج جدولة النسخ الاحتياطي
 *
 * @example
 * ```tsx
 * <BackupScheduleForm schedule={schedule} onSubmit={handleSubmit} />
 * ```
 */
export const BackupScheduleForm: React.FC<BackupScheduleFormProps> = ({
  schedule,
  loading = false,
  error = null,
  onSubmit,
  className = '',
}) => {
  const [enabled, setEnabled] = useState(schedule?.enabled || false)
  const [interval, setInterval] = useState<BackupSchedule['interval']>(
    schedule?.interval || 'daily'
  )
  const [time, setTime] = useState(schedule?.time || '02:00')
  const [retentionDays, setRetentionDays] = useState(schedule?.retentionDays || 30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      enabled,
      interval,
      time,
      retentionDays,
    })
  }

  return (
    <BaseCard
      title="Backup Schedule"
      description="جدولة النسخ الاحتياطي التلقائي"
      loading={loading}
      error={error?.message}
      className={`backup-schedule-form ${className}`}
    >
      <form onSubmit={handleSubmit} className="backup-schedule-form__form">
        <div className="backup-schedule-form__field">
          <div className="backup-schedule-form__field-header">
            <label className="backup-schedule-form__label">تفعيل الجدولة</label>
            <Switch checked={enabled} onChange={setEnabled} />
          </div>
        </div>

        {enabled && (
          <>
            <div className="backup-schedule-form__field">
              <label className="backup-schedule-form__label">الفترة</label>
              <select
                className="backup-schedule-form__select"
                value={interval}
                onChange={e => setInterval(e.target.value as BackupSchedule['interval'])}
              >
                <option value="hourly">كل ساعة</option>
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
              </select>
            </div>

            <div className="backup-schedule-form__field">
              <label className="backup-schedule-form__label">الوقت</label>
              <Input
                type="time"
                value={time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
              />
            </div>

            <div className="backup-schedule-form__field">
              <label className="backup-schedule-form__label">مدة الاحتفاظ (أيام)</label>
              <Input
                type="number"
                min="1"
                value={retentionDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRetentionDays(parseInt(e.target.value, 10))
                }
              />
            </div>
          </>
        )}

        <div className="backup-schedule-form__actions">
          <Button type="submit" variant="primary" disabled={loading}>
            حفظ الجدولة
          </Button>
        </div>
      </form>
    </BaseCard>
  )
}
