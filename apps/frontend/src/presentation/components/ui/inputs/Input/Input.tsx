/**
 * Input Component - مكون حقل الإدخال
 *
 * مكون حقل إدخال قابل لإعادة الاستخدام مع دعم الأخطاء والمساعدة
 */

import React, { useMemo } from 'react'
import { InputProps } from '../types'
import styles from './Input.module.scss'

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
      // Maps variants if needed, for now mainly 'default' or 'error' state
      const sizeClass = styles[`input--${size}`] || styles['input--md']

      return [
        styles.input,
        sizeClass,
        error ? styles['input--error'] : '',
        className
      ].filter(Boolean).join(' ')
    }, [size, error, className])

    const wrapperClasses = useMemo(
      () => [
        styles.wrapper,
        fullWidth ? styles['wrapper--full-width'] : ''
      ].filter(Boolean).join(' '),
      [fullWidth]
    )

    return (
      <div className={wrapperClasses}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.container}>
          {leftIcon && (
            <div className={`${styles.icon} ${styles['icon--left']}`}>{leftIcon}</div>
          )}
          <input
            className={inputClasses}
            {...props}
            data-has-left-icon={!!leftIcon}
            data-has-right-icon={!!rightIcon}
          />
          {rightIcon && (
            <div className={`${styles.icon} ${styles['icon--right']}`}>{rightIcon}</div>
          )}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
      </div>
    )
  }
)

// Input.displayName = 'Input'
// Input.displayName = 'Input'
export { Input }
export default Input
