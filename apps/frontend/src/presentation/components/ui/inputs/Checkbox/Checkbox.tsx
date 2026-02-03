/**
 * Checkbox Component - مكون صندوق الاختيار
 *
 * مكون موحد لصناديق الاختيار
 */

import React from 'react'
import { Check } from 'lucide-react'

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

/**
 * Checkbox Component
 *
 * مكون صندوق الاختيار الموحد
 *
 * @example
 * ```tsx
 * <Checkbox
 *   checked={isChecked}
 *   onChange={setIsChecked}
 *   label="موافق على الشروط"
 * />
 * ```
 */
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
    <label className={`checkbox ${className} ${disabled ? 'checkbox--disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        name={name}
        className="checkbox__input"
      />
      <span className={`checkbox__checkmark ${checked ? 'checkbox__checkmark--checked' : ''}`}>
        {checked && <Check size={14} className="checkbox__icon" />}
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  )
}
