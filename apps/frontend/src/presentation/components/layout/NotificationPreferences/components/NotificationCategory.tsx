import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
import styles from './NotificationCategory.module.scss'

interface NotificationCategoryProps {
  /** Category data */
  category: NotificationCategoryType
  /** Update preference function */
  onPreferenceChange: (preferenceType: string, updates: Partial<NotificationPreference>) => void
  /** Update channel function */
  onChannelChange: (
    preferenceType: string,
    channel: 'in-app' | 'email' | 'push',
    enabled: boolean,
    sound?: boolean
  ) => void
  /** Is disabled? */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

export const NotificationCategory: React.FC<NotificationCategoryProps> = ({
  category,
  onPreferenceChange,
  onChannelChange,
  disabled = false,
  className,
}) => {
  const { t } = useTranslation('common')
  const [isExpanded, setIsExpanded] = useState(category.defaultExpanded ?? false)

  // Use the icon of the first preference as the category icon
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
      className={cn(styles.category, className,
        isExpanded && styles['category--expanded'],
        disabled && styles['category--disabled']
      )}
    >
      {/* Header */}
      <button
        className={styles.category__header}
        onClick={handleToggleExpand}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? t('notifications.actions.collapse') : t('notifications.actions.expand')} ${category.title}`}
      >
        <div className={styles['category__header-content']}>
          {CategoryIcon && <CategoryIcon className={styles.category__icon} size={20} />}
          <div className={styles.category__info}>
            <h3 className={styles.category__title}>{category.title}</h3>
            {category.description && (
              <p className={styles.category__description}>{category.description}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={styles.category__chevron} size={20} />
        ) : (
          <ChevronDown className={styles.category__chevron} size={20} />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className={styles.category__content}>
          {category.preferences.map(preference => {
            const PreferenceIcon = NOTIFICATION_TYPE_ICONS[preference.type]
            const label = NOTIFICATION_TYPE_LABELS[preference.type]
            const description = NOTIFICATION_TYPE_DESCRIPTIONS[preference.type]

            return (
              <div key={preference.type} className={styles.category__preference}>
                <div className={styles['category__preference-header']}>
                  <div className={styles['category__preference-info']}>
                    {PreferenceIcon && (
                      <PreferenceIcon
                        className={styles['category__preference-icon']}
                        size={18}
                      />
                    )}
                    <div className={styles['category__preference-text']}>
                      <h4 className={styles['category__preference-title']}>{label}</h4>
                      {description && (
                        <p className={styles['category__preference-description']}>
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                  <PreferenceToggle
                    enabled={preference.enabled}
                    onChange={enabled => onPreferenceChange(preference.type, { enabled })}
                    disabled={disabled}
                    ariaLabel={`${preference.enabled ? t('notifications.actions.disable') : t('notifications.actions.enable')} ${label}`}
                  />
                </div>

                {preference.enabled && (
                  <div className={styles.category__channels}>
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
