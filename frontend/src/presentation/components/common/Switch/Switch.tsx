/**
 * Switch Component - مكون المفتاح
 *
 * مكون مفتاح تبديل قابل لإعادة الاستخدام
 */

import React from 'react'
import { cn } from '../utils/classNames'
import './Switch.scss'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className,
  size = 'md',
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div className={cn('switch-wrapper', className)}>
      {label && (
        <label className="switch-wrapper__label" onClick={handleToggle}>
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          'switch',
          `switch--${size}`,
          checked && 'switch--checked',
          disabled && 'switch--disabled'
        )}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="switch__thumb" />
      </button>
    </div>
  )
}
