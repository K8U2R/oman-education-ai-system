/**
 * NotificationCategory Component - مكون فئة الإشعارات
 *
 * مكون لعرض فئة إشعارات مع إمكانية التوسيع/الطي
 */

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../../common/utils/classNames'
import type {
  NotificationCategory as NotificationCategoryType,
  NotificationPreference,
} from '../types'
import { PreferenceToggle } from './PreferenceToggle'
import { ChannelToggle } from './ChannelToggle'
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_DESCRIPTIONS,
  NOTIFICATION_TYPE_ICONS,
} from '../constants'

interface NotificationCategoryProps {
  /** بيانات الفئة */
  category: NotificationCategoryType
  /** دالة تحديث التفضيل */
  onPreferenceChange: (preferenceType: string, updates: Partial<NotificationPreference>) => void
  /** دالة تحديث القناة */
  onChannelChange: (
    preferenceType: string,
    channel: 'in-app' | 'email' | 'push',
    enabled: boolean,
    sound?: boolean
  ) => void
  /** هل معطل؟ */
  disabled?: boolean
  /** Class name إضافي */
  className?: string
}

export const NotificationCategory: React.FC<NotificationCategoryProps> = ({
  category,
  onPreferenceChange,
  onChannelChange,
  disabled = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded ?? false)

  // استخدام أيقونة الفئة - نستخدم أيقونة أول تفضيل في الفئة
  const CategoryIcon = category.preferences[0]
    ? NOTIFICATION_TYPE_ICONS[category.preferences[0].type]
    : null

  const handleToggleExpand = () => {
    if (!disabled) {
      setIsExpanded(prev => !prev)
    }
  }

  return (
    <div
      className={cn('notification-category', className, {
        'notification-category--expanded': isExpanded,
        'notification-category--disabled': disabled,
      })}
    >
      {/* Header */}
      <button
        className="notification-category__header"
        onClick={handleToggleExpand}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'طي' : 'توسيع'} ${category.title}`}
      >
        <div className="notification-category__header-content">
          {CategoryIcon && <CategoryIcon className="notification-category__icon" size={20} />}
          <div className="notification-category__info">
            <h3 className="notification-category__title">{category.title}</h3>
            {category.description && (
              <p className="notification-category__description">{category.description}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="notification-category__chevron" size={20} />
        ) : (
          <ChevronDown className="notification-category__chevron" size={20} />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="notification-category__content">
          {category.preferences.map(preference => {
            const PreferenceIcon = NOTIFICATION_TYPE_ICONS[preference.type]
            const label = NOTIFICATION_TYPE_LABELS[preference.type]
            const description = NOTIFICATION_TYPE_DESCRIPTIONS[preference.type]

            return (
              <div key={preference.type} className="notification-category__preference">
                <div className="notification-category__preference-header">
                  <div className="notification-category__preference-info">
                    {PreferenceIcon && (
                      <PreferenceIcon
                        className="notification-category__preference-icon"
                        size={18}
                      />
                    )}
                    <div className="notification-category__preference-text">
                      <h4 className="notification-category__preference-title">{label}</h4>
                      {description && (
                        <p className="notification-category__preference-description">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  <PreferenceToggle
                    enabled={preference.enabled}
                    onChange={enabled => onPreferenceChange(preference.type, { enabled })}
                    disabled={disabled}
                    ariaLabel={`${preference.enabled ? 'تعطيل' : 'تفعيل'} ${label}`}
                  />
                </div>

                {preference.enabled && (
                  <div className="notification-category__channels">
                    <ChannelToggle
                      channel="in-app"
                      enabled={preference.channels['in-app'].enabled}
                      sound={preference.channels['in-app'].sound}
                      onChange={enabled => onChannelChange(preference.type, 'in-app', enabled)}
                      onSoundChange={sound =>
                        onChannelChange(preference.type, 'in-app', true, sound)
                      }
                      disabled={disabled || !preference.enabled}
                    />
                    <ChannelToggle
                      channel="email"
                      enabled={preference.channels.email.enabled}
                      onChange={enabled => onChannelChange(preference.type, 'email', enabled)}
                      disabled={disabled || !preference.enabled}
                    />
                    <ChannelToggle
                      channel="push"
                      enabled={preference.channels.push.enabled}
                      onChange={enabled => onChannelChange(preference.type, 'push', enabled)}
                      disabled={disabled || !preference.enabled}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
