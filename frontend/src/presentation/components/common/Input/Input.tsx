/**
 * Input Component - مكون حقل الإدخال
 *
 * مكون حقل إدخال قابل لإعادة الاستخدام مع دعم الأخطاء والمساعدة
 */

import React from 'react'
import { InputProps } from '../types'
import { cn, variantClass, sizeClass } from '../utils/classNames'
import './Input.scss'

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  className = '',
  fullWidth = true,
  ...props
}) => {
  const baseClass = 'input'
  const variantClassName = variantClass(baseClass, variant)
  const sizeClassName = sizeClass(baseClass, size)

  const inputClasses = cn(
    baseClass,
    variantClassName,
    sizeClassName,
    error && `${baseClass}--error`,
    Boolean(leftIcon || rightIcon) && `${baseClass}--has-icon`,
    fullWidth && `${baseClass}--full-width`,
    className
  )

  return (
    <div className={cn('input-wrapper', fullWidth && 'input-wrapper--full-width')}>
      {label && <label className="input-wrapper__label">{label}</label>}

      <div className="input-wrapper__container">
        {leftIcon && (
          <div className="input-wrapper__icon input-wrapper__icon--left">{leftIcon}</div>
        )}
        <input className={inputClasses} {...props} />
        {rightIcon && (
          <div className="input-wrapper__icon input-wrapper__icon--right">{rightIcon}</div>
        )}
      </div>

      {error && <p className="input-wrapper__error">{error}</p>}

      {helperText && !error && <p className="input-wrapper__helper">{helperText}</p>}
    </div>
  )
}

export default Input
