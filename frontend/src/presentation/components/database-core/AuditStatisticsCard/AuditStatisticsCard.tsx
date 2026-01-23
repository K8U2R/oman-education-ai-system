/**
 * Audit Statistics Card Component - بطاقة إحصائيات Audit
 *
 * مكون متخصص لعرض إحصائيات Audit
 */

import React from 'react'
import { BaseCard } from '../BaseCard'
import { MetricsCard } from '../MetricsCard'
import { formatNumber, formatDuration } from '@/application/features/database-core/utils'
import type { AuditStatistics } from '@/application/features/database-core/types'

export interface AuditStatisticsCardProps {
  statistics?: AuditStatistics | null
  loading?: boolean
  error?: Error | null
  className?: string
}

/**
 * Audit Statistics Card - بطاقة إحصائيات Audit
 *
 * @example
 * ```tsx
 * <AuditStatisticsCard statistics={stats} loading={loading} />
 * ```
 */
export const AuditStatisticsCard: React.FC<AuditStatisticsCardProps> = ({
  statistics,
  loading = false,
  error = null,
  className = '',
}) => {
  if (!statistics) {
    return (
      <BaseCard
        title="Audit Statistics"
        loading={loading}
        error={error?.message}
        className={`audit-statistics-card ${className}`}
      >
        <div className="audit-statistics-card__empty">
          <p>لا توجد إحصائيات متاحة</p>
        </div>
      </BaseCard>
    )
  }

  const successRate = statistics.total > 0 ? (statistics.successful / statistics.total) * 100 : 0

  return (
    <BaseCard
      title="Audit Statistics"
      loading={loading}
      error={error?.message}
      className={`audit-statistics-card ${className}`}
    >
      <div className="audit-statistics-card__grid">
        <MetricsCard
          title="Total"
          value={formatNumber(statistics.total)}
          variant="default"
          loading={loading}
        />
        <MetricsCard
          title="Successful"
          value={formatNumber(statistics.successful)}
          variant="success"
          loading={loading}
        />
        <MetricsCard
          title="Failed"
          value={formatNumber(statistics.failed)}
          variant={statistics.failed > 0 ? 'danger' : 'success'}
          loading={loading}
        />
        <MetricsCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          variant={successRate > 95 ? 'success' : successRate > 80 ? 'warning' : 'danger'}
          loading={loading}
        />
        <MetricsCard
          title="Avg Execution Time"
          value={formatDuration(statistics.averageExecutionTime)}
          variant="default"
          loading={loading}
        />
      </div>

      {/* Top Actions */}
      {Object.keys(statistics.byAction).length > 0 && (
        <div className="audit-statistics-card__section">
          <h3 className="audit-statistics-card__section-title">Top Actions</h3>
          <div className="audit-statistics-card__list">
            {Object.entries(statistics.byAction)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([action, count]) => (
                <div key={action} className="audit-statistics-card__list-item">
                  <span className="audit-statistics-card__list-label">{action}</span>
                  <span className="audit-statistics-card__list-value">{formatNumber(count)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top Entities */}
      {Object.keys(statistics.byEntity).length > 0 && (
        <div className="audit-statistics-card__section">
          <h3 className="audit-statistics-card__section-title">Top Entities</h3>
          <div className="audit-statistics-card__list">
            {Object.entries(statistics.byEntity)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([entity, count]) => (
                <div key={entity} className="audit-statistics-card__list-item">
                  <span className="audit-statistics-card__list-label">{entity}</span>
                  <span className="audit-statistics-card__list-value">{formatNumber(count)}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </BaseCard>
  )
}
