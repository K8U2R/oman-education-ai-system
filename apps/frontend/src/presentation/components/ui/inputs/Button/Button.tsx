/**
 * Button Component - مكون الزر
 *
 * مكون زر قابل لإعادة الاستخدام مع أنماط مختلفة
 */

import React, { useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { ButtonProps } from '../types'
import styles from './Button.module.scss'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

    const classes = useMemo(() => {
      const variantClass = styles[`button--${variant}`] || styles['button--primary']
      const sizeClass = styles[`button--${size}`] || styles['button--md']

      return [
        styles.button,
        variantClass,
        sizeClass,
        isLoading ? styles['button--loading'] : '',
        fullWidth ? styles['button--full-width'] : '',
        className // Allow overriding or adding utility classes if absolutely necessary (though discouraged)
      ].filter(Boolean).join(' ')
    }, [variant, size, isLoading, fullWidth, className])

    return (
      <button className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <Loader2 className={styles.loader} />
            <span>{t('common.loading')}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
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
