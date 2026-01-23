/**
 * ChannelToggle Component - مكون تبديل القناة
 *
 * مكون لتبديل تفعيل/إلغاء تفعيل قناة محددة (In-app, Email, Push)
 */

import React from 'react'
import { cn } from '../../../common/utils/classNames'
import { PreferenceToggle } from './PreferenceToggle'
import type { ChannelType } from '../types'
import { CHANNEL_LABELS, CHANNEL_ICONS } from '../constants'

interface ChannelToggleProps {
  /** نوع القناة */
  channel: ChannelType
  /** هل القناة مفعّلة؟ */
  enabled: boolean
  /** هل الصوت مفعّل؟ (لـ in-app فقط) */
  sound?: boolean
  /** دالة التغيير */
  onChange: (enabled: boolean) => void
  /** دالة تغيير الصوت (لـ in-app فقط) */
  onSoundChange?: (sound: boolean) => void
  /** هل معطل؟ */
  disabled?: boolean
  /** Class name إضافي */
  className?: string
}

export const ChannelToggle: React.FC<ChannelToggleProps> = ({
  channel,
  enabled,
  sound,
  onChange,
  onSoundChange,
  disabled = false,
  className,
}) => {
  const Icon = CHANNEL_ICONS[channel]
  const label = CHANNEL_LABELS[channel]
  const isInApp = channel === 'in-app'

  return (
    <div className={cn('channel-toggle', className, { 'channel-toggle--disabled': disabled })}>
      <div className="channel-toggle__header">
        <div className="channel-toggle__info">
          <Icon className="channel-toggle__icon" size={18} />
          <span className="channel-toggle__label">{label}</span>
        </div>
        <PreferenceToggle
          enabled={enabled}
          onChange={onChange}
          disabled={disabled}
          ariaLabel={`${enabled ? 'تعطيل' : 'تفعيل'} ${label}`}
        />
      </div>

      {isInApp && enabled && onSoundChange !== undefined && (
        <div className="channel-toggle__sound-option">
          <label className="channel-toggle__sound-label">
            <input
              type="checkbox"
              checked={sound}
              onChange={e => onSoundChange(e.target.checked)}
              disabled={disabled}
              className="channel-toggle__sound-checkbox"
              aria-label={`${sound ? 'تعطيل' : 'تفعيل'} صوت الإشعارات`}
            />
            <span className="channel-toggle__sound-text">صوت</span>
          </label>
        </div>
      )}
    </div>
  )
}
