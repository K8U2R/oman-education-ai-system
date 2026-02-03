/**
 * Card Component - مكون البطاقة
 *
 * مكون بطاقة قابل لإعادة الاستخدام لعرض المحتوى
 */

import React, { useMemo } from 'react'
import { CardProps } from '../../layout/types'
import { cn, variantClass, sizeClass } from '../../utils/classNames'

const Card: React.FC<CardProps> = React.memo(
  ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
    hoverable = false,
    shadow = 'md',
    ...restProps // Spread remaining HTML attributes (role, tabIndex, onKeyDown, etc.)
  }) => {
    const classes = useMemo(() => {
      const baseClass = 'card'
      const variantClassName = variantClass(baseClass, variant)
      const paddingClassName = sizeClass(baseClass, `padding-${padding}`)
      const shadowClassName = shadow !== 'none' ? `${baseClass}--shadow-${shadow}` : ''

      return cn(
        baseClass,
        variantClassName,
        paddingClassName,
        shadowClassName,
        onClick && `${baseClass}--clickable`,
        hoverable && `${baseClass}--hoverable`,
        className
      )
    }, [variant, padding, shadow, onClick, hoverable, className])

    return (
      <div className={classes} onClick={onClick} {...restProps}>
        {children}
      </div>
    )
  }
)

// Card.displayName = 'Card'
// Card.displayName = 'Card'
export { Card }
export default Card
