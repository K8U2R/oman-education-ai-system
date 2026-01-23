/**
 * FormField Component - مكون حقل النموذج
 *
 * مكون حقل نموذج مع التحقق من الصحة
 */

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Input } from '../../common'
import { cn } from '../../common/utils/classNames'

export interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
}) => {
  return (
    <div className={cn('form-field', className)}>
      <label htmlFor={name} className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>

      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        fullWidth
        className={cn('form-field__input', error && 'form-field__input--error')}
      />

      {error && (
        <div className="form-field__error">
          <AlertCircle className="form-field__error-icon" />
          <span className="form-field__error-text">{error}</span>
        </div>
      )}

      {hint && !error && <p className="form-field__hint">{hint}</p>}
    </div>
  )
}
