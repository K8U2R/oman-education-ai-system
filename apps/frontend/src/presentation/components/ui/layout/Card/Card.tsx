/**
 * Card Component - مكون البطاقة
 *
 * مكون بطاقة قابل لإعادة الاستخدام لعرض المحتوى
 */

import React, { useMemo } from 'react'
import { CardProps } from '../../layout/types'
import styles from './Card.module.scss'

const Card: React.FC<CardProps> = React.memo(
  ({
    children,
    className = '',
    variant = 'default', // Ignored for now or mapped if needed
    padding = 'md',
    onClick,
    hoverable = false,
    shadow = 'md',
    ...restProps // Spread remaining HTML attributes (role, tabIndex, onKeyDown, etc.)
  }) => {
    const classes = useMemo(() => {
      // Basic mappings
      return [
        styles.card,
        styles[`card--padding-${padding}`],
        shadow !== 'none' ? styles[`card--shadow-${shadow}`] : styles['card--shadow-none'],
        onClick ? styles['card--clickable'] : '',
        hoverable ? styles['card--hoverable'] : '',
        className
      ].filter(Boolean).join(' ')
    }, [padding, shadow, onClick, hoverable, className])

    return (
      <div className={classes} onClick={onClick} {...restProps}>
        {children}
      </div>
    )
  }
)

// Card.displayName = 'Card'
export { Card }
export default Card
