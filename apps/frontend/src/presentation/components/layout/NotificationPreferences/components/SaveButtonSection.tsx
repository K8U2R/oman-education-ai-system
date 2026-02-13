import React from 'react'
import { Save, X, RotateCcw, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../common'
import { cn } from '../../../common/utils/classNames'
import styles from './SaveButtonSection.module.scss'

interface SaveButtonSectionProps {
  /** Has changes? */
  hasChanges: boolean
  /** Saving state */
  saving: boolean
  /** Success state */
  success?: boolean
  /** Save function */
  onSave: () => void
  /** Cancel function */
  onCancel: () => void
  /** Reset function */
  onReset?: () => void
  /** Additional class name */
  className?: string
}

export const SaveButtonSection: React.FC<SaveButtonSectionProps> = ({
  hasChanges,
  saving,
  success = false,
  onSave,
  onCancel,
  onReset,
  className,
}) => {
  const { t } = useTranslation('common')

  return (
    <div className={cn(styles.section, className)}>
      {success && (
        <div className={styles.success} role="alert" aria-live="polite">
          <Check className={styles.successIcon} size={18} />
          <span className={styles.successText}>{t('notifications.status.saved')}</span>
        </div>
      )}

      <div className={styles.actions}>
        {onReset && hasChanges && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            disabled={saving}
            leftIcon={<RotateCcw size={18} />}
            className={styles.resetButton}
            aria-label={t('notifications.actions.reset_tooltip')}
          >
            {t('notifications.actions.reset')}
          </Button>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={saving}
          leftIcon={<X size={18} />}
          className={styles.cancelButton}
        >
          {t('notifications.actions.cancel')}
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={!hasChanges || saving}
          isLoading={saving}
          leftIcon={!saving ? <Save size={18} /> : undefined}
          className={styles.saveButton}
        >
          {saving ? t('notifications.status.saving') : t('notifications.actions.save')}
        </Button>
      </div>
    </div>
  )
}
