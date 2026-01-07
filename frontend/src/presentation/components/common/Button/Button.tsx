/**
 * Button Component - مكون الزر
 *
 * مكون زر قابل لإعادة الاستخدام مع أنماط مختلفة
 */

import React from 'react'
import { Loader2 } from 'lucide-react'
import { ButtonProps } from '../types'
import { cn, variantClass, sizeClass } from '../utils/classNames'
import './Button.scss'

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}) => {
  const baseClass = 'button'
  const variantClassName = variantClass(baseClass, variant)
  const sizeClassName = sizeClass(baseClass, size)

  const classes = cn(
    baseClass,
    variantClassName,
    sizeClassName,
    isLoading && `${baseClass}--loading`,
    disabled && `${baseClass}--disabled`,
    fullWidth && `${baseClass}--full-width`,
    className
  )

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="button__loader" />
          <span className="button__loading-text">جاري التحميل...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="button__left-icon">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="button__right-icon">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
