/**
 * Card Component - مكون البطاقة
 *
 * مكون بطاقة قابل لإعادة الاستخدام لعرض المحتوى
 */

import React from 'react'
import { CardProps } from '../types'
import { cn, variantClass, sizeClass } from '../utils/classNames'
import './Card.scss'

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
  hoverable = false,
  shadow = 'md',
  ...restProps // Spread remaining HTML attributes (role, tabIndex, onKeyDown, etc.)
}) => {
  const baseClass = 'card'
  const variantClassName = variantClass(baseClass, variant)
  const paddingClassName = sizeClass(baseClass, `padding-${padding}`)
  const shadowClassName = shadow !== 'none' ? `${baseClass}--shadow-${shadow}` : ''

  const classes = cn(
    baseClass,
    variantClassName,
    paddingClassName,
    shadowClassName,
    onClick && `${baseClass}--clickable`,
    hoverable && `${baseClass}--hoverable`,
    className
  )

  return (
    <div className={classes} onClick={onClick} {...restProps}>
      {children}
    </div>
  )
}

export default Card
