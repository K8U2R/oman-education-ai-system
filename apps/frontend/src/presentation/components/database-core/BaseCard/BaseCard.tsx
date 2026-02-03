/**
 * BaseCard Component - مكون بطاقة أساسي قابل لإعادة الاستخدام
 *
 * مكون بطاقة متقدم يدعم:
 * - Loading State
 * - Error State
 * - Header مع Icon و Actions
 * - Footer
 * - Variants متعددة
 *
 * يستخدم Composition Pattern لتجنب تكرار الكود
 */

import React, { useMemo } from 'react'
import { Card, LoadingSpinner } from '../../common'
import { AlertCircle } from 'lucide-react'

export interface BaseCardProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  error?: Error | string | null
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  description?: string
}

/**
 * BaseCard - مكون بطاقة أساسي
 *
 * @example
 * ```tsx
 * <BaseCard
 *   title="Performance Metrics"
 *   icon={<TrendingUp />}
 *   actions={<RefreshButton />}
 *   loading={loading}
 *   error={error}
 * >
 *   <PerformanceChart data={metrics} />
 * </BaseCard>
 * ```
 */
export const BaseCard: React.FC<BaseCardProps> = React.memo(
  ({
    title,
    subtitle,
    icon,
    actions,
    footer,
    loading = false,
    error = null,
    variant = 'default',
    children,
    className = '',
    onClick,
    hoverable = false,
    description,
  }) => {
    const variantClass = useMemo(() => `base-card--${variant}`, [variant])

    // Loading State
    if (loading) {
      return (
        <Card className={`base-card ${variantClass} ${className}`} hoverable={hoverable}>
          <div className="base-card__loading">
            <LoadingSpinner size="md" />
            <p>جاري التحميل...</p>
          </div>
        </Card>
      )
    }

    // Error State
    if (error) {
      return (
        <Card
          className={`base-card ${variantClass} base-card--error ${className}`}
          hoverable={hoverable}
        >
          <div className="base-card__error">
            <AlertCircle className="base-card__error-icon" />
            <div className="base-card__error-content">
              <h4 className="base-card__error-title">حدث خطأ</h4>
              <p className="base-card__error-message">
                {typeof error === 'string' ? error : error.message}
              </p>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <Card
        className={`base-card ${variantClass} ${className}`}
        onClick={onClick}
        hoverable={hoverable}
      >
        {/* Header */}
        {(title || icon || actions) && (
          <div className="base-card__header">
            <div className="base-card__header-left">
              {icon && <div className="base-card__icon">{icon}</div>}
              <div className="base-card__title-section">
                {title && <h3 className="base-card__title">{title}</h3>}
                {subtitle && <p className="base-card__subtitle">{subtitle}</p>}
                {description && <p className="base-card__description">{description}</p>}
              </div>
            </div>
            {actions && <div className="base-card__actions">{actions}</div>}
          </div>
        )}

        {/* Content */}
        <div className="base-card__content">{children}</div>

        {/* Footer */}
        {footer && <div className="base-card__footer">{footer}</div>}
      </Card>
    )
  }
)

BaseCard.displayName = 'BaseCard'
