/**
 * PreferenceToggle Component - مكون تبديل التفضيل
 *
 * مكون لتبديل تفعيل/إلغاء تفعيل إشعار محدد
 */

import React from 'react'
import { cn } from '../../../common/utils/classNames'

interface PreferenceToggleProps {
  /** هل التفضيل مفعّل؟ */
  enabled: boolean
  /** دالة التغيير */
  onChange: (enabled: boolean) => void
  /** Label للوصولية */
  ariaLabel?: string
  /** Class name إضافي */
  className?: string
  /** هل معطل؟ */
  disabled?: boolean
}

export const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  enabled,
  onChange,
  ariaLabel,
  className,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!enabled)
    }
  }

  return (
    <label
      className={cn('preference-toggle', className, {
        'preference-toggle--disabled': disabled,
      })}
      aria-label={ariaLabel}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={handleToggle}
        disabled={disabled}
        className="preference-toggle__input"
        aria-label={ariaLabel}
      />
      <span
        className={cn('preference-toggle__slider', {
          'preference-toggle__slider--checked': enabled,
        })}
      />
    </label>
  )
}
