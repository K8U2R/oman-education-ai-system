/**
 * Notification Preferences Component - تفضيلات الإشعارات
 *
 * مكون لإدارة تفضيلات الإشعارات
 */

import React, { useState, useEffect } from 'react'
// Icons removed - not used in component
import { Modal } from '../../common'
import { Button } from '../../common'
import { storageAdapter } from '@/infrastructure/storage'
import './NotificationPreferences.scss'

interface NotificationPreference {
  type: string
  enabled: boolean
  sound: boolean
  desktop: boolean
  email: boolean
}

const NOTIFICATION_PREFERENCES_KEY = 'notification_preferences'

const defaultPreferences: NotificationPreference[] = [
  { type: 'message', enabled: true, sound: true, desktop: true, email: false },
  { type: 'alert', enabled: true, sound: true, desktop: true, email: true },
  { type: 'task', enabled: true, sound: false, desktop: true, email: false },
  { type: 'test', enabled: true, sound: true, desktop: true, email: false },
  { type: 'success', enabled: true, sound: false, desktop: false, email: false },
  { type: 'warning', enabled: true, sound: true, desktop: true, email: false },
  { type: 'error', enabled: true, sound: true, desktop: true, email: true },
]

interface NotificationPreferencesProps {
  isOpen: boolean
  onClose: () => void
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  isOpen,
  onClose,
}) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences)

  useEffect(() => {
    try {
      const stored = storageAdapter.get(NOTIFICATION_PREFERENCES_KEY)
      if (stored) {
        setPreferences(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error)
    }
  }, [])

  const updatePreference = (type: string, field: keyof NotificationPreference, value: boolean) => {
    setPreferences(prev => {
      const updated = prev.map(pref => (pref.type === type ? { ...pref, [field]: value } : pref))

      try {
        storageAdapter.set(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save notification preferences:', error)
      }

      return updated
    })
  }

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      message: 'الرسائل',
      alert: 'التنبيهات',
      task: 'المهام',
      test: 'الاختبارات',
      success: 'النجاح',
      warning: 'التحذيرات',
      error: 'الأخطاء',
    }
    return labels[type] || type
  }

  const handleSave = () => {
    // Save preferences
    try {
      storageAdapter.set(NOTIFICATION_PREFERENCES_KEY, JSON.stringify(preferences))
      onClose()
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفضيلات الإشعارات" size="lg">
      <div className="notification-preferences">
        <div className="notification-preferences__list">
          {preferences.map(preference => (
            <div key={preference.type} className="notification-preferences__item">
              <div className="notification-preferences__item-header">
                <div className="notification-preferences__item-info">
                  <h4 className="notification-preferences__item-title">
                    {getTypeLabel(preference.type)}
                  </h4>
                </div>
                <label className="notification-preferences__toggle">
                  <input
                    type="checkbox"
                    checked={preference.enabled}
                    onChange={e => updatePreference(preference.type, 'enabled', e.target.checked)}
                  />
                  <span className="notification-preferences__toggle-slider" />
                </label>
              </div>

              {preference.enabled && (
                <div className="notification-preferences__item-options">
                  <label className="notification-preferences__option">
                    <input
                      type="checkbox"
                      checked={preference.sound}
                      onChange={e => updatePreference(preference.type, 'sound', e.target.checked)}
                    />
                    <span>صوت</span>
                  </label>
                  <label className="notification-preferences__option">
                    <input
                      type="checkbox"
                      checked={preference.desktop}
                      onChange={e => updatePreference(preference.type, 'desktop', e.target.checked)}
                    />
                    <span>إشعار سطح المكتب</span>
                  </label>
                  <label className="notification-preferences__option">
                    <input
                      type="checkbox"
                      checked={preference.email}
                      onChange={e => updatePreference(preference.type, 'email', e.target.checked)}
                    />
                    <span>بريد إلكتروني</span>
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="notification-preferences__footer">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSave}>
            حفظ
          </Button>
        </div>
      </div>
    </Modal>
  )
}
