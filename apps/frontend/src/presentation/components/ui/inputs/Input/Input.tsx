/**
 * Input Component - مكون حقل الإدخال
 *
 * مكون حقل إدخال قابل لإعادة الاستخدام مع دعم الأخطاء والمساعدة
 */

import React, { useMemo } from 'react'
import { InputProps } from '../types'
import { cn, variantClass, sizeClass } from '../../utils/classNames'

const Input: React.FC<InputProps> = React.memo(
  ({
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
    const inputClasses = useMemo(() => {
      const baseClass = 'input'
      const variantClassName = variantClass(baseClass, variant)
      const sizeClassName = sizeClass(baseClass, size)
      const hasIcon = Boolean(leftIcon || rightIcon)

      return cn(
        baseClass,
        variantClassName,
        sizeClassName,
        error && `${baseClass}--error`,
        hasIcon && `${baseClass}--has-icon`,
        fullWidth && `${baseClass}--full-width`,
        className
      )
    }, [variant, size, error, leftIcon, rightIcon, fullWidth, className])

    const wrapperClasses = useMemo(
      () => cn('input-wrapper', fullWidth && 'input-wrapper--full-width'),
      [fullWidth]
    )

    return (
      <div className={wrapperClasses}>
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
)

// Input.displayName = 'Input'
// Input.displayName = 'Input'
export { Input }
export default Input
