/**
 * Checkbox Component - مكون صندوق الاختيار
 *
 * مكون موحد لصناديق الاختيار
 */

import React from 'react'
import { Check } from 'lucide-react'
import styles from './Checkbox.module.scss'

export interface CheckboxProps {
  /**
   * هل الصندوق محدد؟
   */
  checked: boolean

  /**
   * دالة التغيير
   */
  onChange: (checked: boolean) => void

  /**
   * هل الصندوق معطل؟
   */
  disabled?: boolean

  /**
   * Label للصندوق
   */
  label?: string

  /**
   * className إضافي
   */
  className?: string

  /**
   * ID للصندوق
   */
  id?: string

  /**
   * Name للصندوق
   */
  name?: string
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
  id,
  name,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked)
    }
  }

  return (
    <label className={`${styles.label} ${disabled ? styles['label--disabled'] : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        name={name}
        className={styles.input}
      />
      <span className={`${styles.checkmark} ${checked ? styles['checkmark--checked'] : ''}`}>
        {checked && <Check size={14} />}
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  )
}
