import React, { useState, useEffect } from 'react'
import { Bell, VolumeX, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../../common'
import { Button } from '../../common'
import { useNotificationPreferences } from './hooks/useNotificationPreferences'
import { NotificationCategory } from './components/NotificationCategory'
import { SaveButtonSection } from './components/SaveButtonSection'
import { cn } from '../../common/utils/classNames'
import styles from './NotificationPreferences.module.scss'

interface NotificationPreferencesProps {
  /** Is the window open? */
  isOpen: boolean
  /** Close function */
  onClose: () => void
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('common')
  const {
    preferences,
    loading,
    saving,
    error,
    hasChanges,
    fetchPreferences,
    updatePreference,
    updateChannel,
    savePreferences,
    resetToDefaults,
    toggleGlobalMute,
    resetChanges,
  } = useNotificationPreferences({
    autoFetch: false,
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: error => {
      console.error('Notification preferences error:', error)
    },
  })

  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchPreferences()
    }
  }, [isOpen, fetchPreferences])

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false)
    }
  }, [isOpen])

  const handleSave = async () => {
    const saved = await savePreferences()
    if (saved) {
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm(t('notifications.confirm.cancel'))) {
        resetChanges()
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleGlobalMute = () => {
    toggleGlobalMute()
  }

  const handleResetToDefaults = () => {
    if (window.confirm(t('notifications.confirm.reset_all'))) {
      resetToDefaults()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('notifications.preferences.title')}
      description={t('notifications.preferences.subtitle')}
      size="lg"
      showCloseButton={true}
    >
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Bell className={styles.headerIcon} size={24} />
            <div className={styles.headerText}>
              <h3 className={styles.headerTitle}>{t('notifications.preferences.section_title')}</h3>
              <p className={styles.headerDescription}>
                {t('notifications.preferences.section_description')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalMute}
            className={cn(styles.quickActionsButton,
              preferences?.globalMute && styles['quickActionsButton--active']
            )}
            aria-label={
              preferences?.globalMute
                ? t('notifications.actions.unmute')
                : t('notifications.actions.mute_all')
            }
          >
            {preferences?.globalMute ? (
              <>
                <VolumeX size={16} />
                {t('notifications.actions.unmute')}
              </>
            ) : (
              <>
                <VolumeX size={16} />
                {t('notifications.actions.mute_all')}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetToDefaults}
            className={styles.quickActionsButton}
            aria-label={t('notifications.actions.reset_tooltip')}
          >
            <RotateCcw size={16} />
            {t('notifications.actions.default_settings')}
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <p>{t('notifications.status.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.error} role="alert">
            <p>
              {error.message || t('notifications.status.error')}
            </p>
            <Button variant="outline" size="sm" onClick={fetchPreferences}>
              {t('notifications.actions.retry')}
            </Button>
          </div>
        ) : !preferences || preferences.categories.length === 0 ? (
          <div className={styles.empty}>
            <Bell size={48} />
            <p>{t('notifications.status.empty')}</p>
          </div>
        ) : (
          <div className={styles.content}>
            {preferences.categories.map(category => (
              <NotificationCategory
                key={category.id}
                category={category}
                onPreferenceChange={(preferenceType, updates) =>
                  updatePreference(category.id, preferenceType, updates)
                }
                onChannelChange={(preferenceType, channel, enabled, sound) =>
                  updateChannel(category.id, preferenceType, channel, enabled, sound)
                }
                disabled={preferences.globalMute || saving}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && !error && preferences && preferences.categories.length > 0 && (
          <SaveButtonSection
            hasChanges={hasChanges}
            saving={saving}
            success={success}
            onSave={handleSave}
            onCancel={handleCancel}
            onReset={hasChanges ? resetChanges : undefined}
          />
        )}
      </div>
    </Modal>
  )
}
