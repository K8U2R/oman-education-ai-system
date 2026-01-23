/**
 * Button Component - مكون الزر
 *
 * مكون زر قابل لإعادة الاستخدام مع أنماط مختلفة
 */

import React, { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { ButtonProps } from '../types'
import { cn, variantClass, sizeClass } from '../../utils/classNames'

const Button: React.FC<ButtonProps> = React.memo(
  ({
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
    const classes = useMemo(() => {
      const baseClass = 'button'
      const variantClassName = variantClass(baseClass, variant)
      const sizeClassName = sizeClass(baseClass, size)

      return cn(
        baseClass,
        variantClassName,
        sizeClassName,
        isLoading && `${baseClass}--loading`,
        disabled && `${baseClass}--disabled`,
        fullWidth && `${baseClass}--full-width`,
        className
      )
    }, [variant, size, isLoading, disabled, fullWidth, className])

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
)

// Button.displayName = 'Button' // Already set in component
// Button.displayName = 'Button' // Already set in component
export { Button }
export default Button
