/**
 * MetricsCard Component - بطاقة المقاييس
 *
 * مكون متخصص لعرض المقاييس يستخدم BaseCard
 * يطبق Composition Pattern
 */

import React from 'react'
import { BaseCard, BaseCardProps } from '../BaseCard'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface MetricsCardProps extends Omit<BaseCardProps, 'children'> {
  value: string | number
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string | number
  unit?: string
  description?: string
}

/**
 * MetricsCard - بطاقة المقاييس
 *
 * @example
 * ```tsx
 * <MetricsCard
 *   title="Response Time"
 *   value="125ms"
 *   trend="up"
 *   trendValue="+5%"
 *   icon={<Clock />}
 * />
 * ```
 */
export const MetricsCard: React.FC<MetricsCardProps> = React.memo(
  ({
    title,
    value,
    trend,
    trendValue,
    unit,
    description,
    icon,
    variant = 'default',
    loading,
    error,
    ...restProps
  }) => {
    const trendIcon =
      trend === 'up' ? (
        <TrendingUp className="metrics-card__trend-icon" />
      ) : trend === 'down' ? (
        <TrendingDown className="metrics-card__trend-icon" />
      ) : (
        <Minus className="metrics-card__trend-icon" />
      )

    const trendClass = trend ? `metrics-card__trend--${trend}` : ''

    return (
      <BaseCard
        title={title}
        icon={icon}
        variant={variant}
        loading={loading}
        error={error}
        {...restProps}
      >
        <div className="metrics-card">
          <div className="metrics-card__value-section">
            <div className="metrics-card__value">
              {typeof value === 'number' ? value.toLocaleString('ar-SA') : value}
              {unit && <span className="metrics-card__unit">{unit}</span>}
            </div>
            {trend && trendValue && (
              <div className={`metrics-card__trend ${trendClass}`}>
                {trendIcon}
                <span className="metrics-card__trend-value">{trendValue}</span>
              </div>
            )}
          </div>
          {description && <p className="metrics-card__description">{description}</p>}
        </div>
      </BaseCard>
    )
  }
)

MetricsCard.displayName = 'MetricsCard'
