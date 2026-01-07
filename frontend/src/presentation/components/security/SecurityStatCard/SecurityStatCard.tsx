/**
 * Security Stat Card - بطاقة إحصائية للأمان
 *
 * مكون لعرض إحصائيات الأمان في بطاقة
 */

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card } from '../../common'
import { cn } from '../../common/utils/classNames'
import './SecurityStatCard.scss'

export interface SecurityStatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
  onClick?: () => void
}

export const SecurityStatCard: React.FC<SecurityStatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = 'default',
  className,
  onClick,
}) => {
  const isPositiveChange = change !== undefined && change > 0
  const isNegativeChange = change !== undefined && change < 0

  return (
    <Card
      className={cn(
        'security-stat-card',
        `security-stat-card--${variant}`,
        onClick && 'security-stat-card--clickable',
        className
      )}
      onClick={onClick}
    >
      <div className="security-stat-card__content">
        <div className="security-stat-card__header">
          <p className="security-stat-card__title">{title}</p>
          <div className={cn('security-stat-card__icon', `security-stat-card__icon--${variant}`)}>
            <Icon className="security-stat-card__icon-svg" />
          </div>
        </div>

        <div className="security-stat-card__body">
          <p className="security-stat-card__value">{value}</p>
          {change !== undefined && (
            <div className="security-stat-card__change">
              <span
                className={cn(
                  'security-stat-card__change-value',
                  isPositiveChange &&
                    variant === 'danger' &&
                    'security-stat-card__change-value--negative',
                  isPositiveChange &&
                    variant !== 'danger' &&
                    'security-stat-card__change-value--positive',
                  isNegativeChange &&
                    variant === 'danger' &&
                    'security-stat-card__change-value--positive',
                  isNegativeChange &&
                    variant !== 'danger' &&
                    'security-stat-card__change-value--negative'
                )}
              >
                {isPositiveChange ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="security-stat-card__change-label">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
