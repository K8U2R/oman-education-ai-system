/**
 * Switch Component - مكون المفتاح
 *
 * مكون مفتاح تبديل قابل لإعادة الاستخدام
 */

import React, { useMemo } from 'react'
import styles from './Switch.module.scss'

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

  const switchClass = useMemo(() => {
    return [
      styles.switch,
      styles[`switch--${size}`],
      checked ? styles['switch--checked'] : '',
      disabled ? styles['switch--disabled'] : ''
    ].filter(Boolean).join(' ')
  }, [size, checked, disabled])

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {label && (
        <label className={styles.label} onClick={handleToggle}>
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={switchClass}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className={styles.thumb} />
      </button>
    </div>
  )
}
