/**
 * NotificationPreferences Component - مكون تفضيلات الإشعارات
 *
 * مكون شامل لإدارة تفضيلات الإشعارات مع UI محسّن
 */

import React, { useState, useEffect } from 'react'
import { Bell, VolumeX, RotateCcw } from 'lucide-react'
import { Modal } from '../../common'
import { Button } from '../../common'
import { useNotificationPreferences } from './hooks/useNotificationPreferences'
import { NotificationCategory } from './components/NotificationCategory'
import { SaveButtonSection } from './components/SaveButtonSection'
import { cn } from '../../common/utils/classNames'

interface NotificationPreferencesProps {
  /** هل النافذة مفتوحة؟ */
  isOpen: boolean
  /** دالة الإغلاق */
  onClose: () => void
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  isOpen,
  onClose,
}) => {
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
    autoFetch: false, // سنجلب البيانات يدوياً عند فتح النافذة
    onSuccess: () => {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000) // إخفاء رسالة النجاح بعد 3 ثوان
    },
    onError: error => {
      console.error('Notification preferences error:', error)
    },
  })

  const [success, setSuccess] = useState(false)

  // جلب البيانات عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      fetchPreferences()
    }
  }, [isOpen, fetchPreferences])

  // إعادة تعيين حالة النجاح عند الإغلاق
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
      }, 1500) // إغلاق النافذة بعد 1.5 ثانية من النجاح
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('هل أنت متأكد من إلغاء التغييرات؟')) {
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
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى الافتراضية؟')) {
      resetToDefaults()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="تفضيلات الإشعارات"
      description="تحكم في الإشعارات التي تصلك عبر القنوات المختلفة"
      size="lg"
      showCloseButton={true}
    >
      <div className="notification-preferences">
        {/* Header Section */}
        <div className="notification-preferences__header">
          <div className="notification-preferences__header-content">
            <Bell className="notification-preferences__header-icon" size={24} />
            <div className="notification-preferences__header-text">
              <h3 className="notification-preferences__header-title">إعدادات الإشعارات</h3>
              <p className="notification-preferences__header-description">
                اختر أنواع الإشعارات التي تريد تلقيها والقنوات المفضلة لديك
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="notification-preferences__quick-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalMute}
            className={cn('notification-preferences__quick-action', {
              'notification-preferences__quick-action--active': preferences?.globalMute,
            })}
            aria-label={preferences?.globalMute ? 'إلغاء كتم الإشعارات' : 'كتم جميع الإشعارات'}
          >
            {preferences?.globalMute ? (
              <>
                <VolumeX size={16} />
                إلغاء كتم الإشعارات
              </>
            ) : (
              <>
                <VolumeX size={16} />
                كتم جميع الإشعارات
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetToDefaults}
            className="notification-preferences__quick-action"
            aria-label="إعادة تعيين للإعدادات الافتراضية"
          >
            <RotateCcw size={16} />
            الإعدادات الافتراضية
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="notification-preferences__loading">
            <div className="notification-preferences__loading-spinner" />
            <p className="notification-preferences__loading-text">جاري تحميل التفضيلات...</p>
          </div>
        ) : error ? (
          <div className="notification-preferences__error" role="alert">
            <p className="notification-preferences__error-text">
              {error.message || 'حدث خطأ أثناء تحميل التفضيلات'}
            </p>
            <Button variant="outline" size="sm" onClick={fetchPreferences}>
              إعادة المحاولة
            </Button>
          </div>
        ) : !preferences || preferences.categories.length === 0 ? (
          <div className="notification-preferences__empty">
            <Bell className="notification-preferences__empty-icon" size={48} />
            <p className="notification-preferences__empty-text">لا توجد تفضيلات متاحة</p>
          </div>
        ) : (
          <div className="notification-preferences__content">
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
