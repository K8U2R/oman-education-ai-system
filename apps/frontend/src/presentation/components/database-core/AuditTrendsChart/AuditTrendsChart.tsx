/**
 * Audit Trends Chart Component - رسم اتجاهات Audit
 *
 * مكون متخصص لعرض اتجاهات Audit
 */

import React, { useMemo } from 'react'
import { LineChart } from '@/presentation/components/charts'
import { BaseCard } from '../BaseCard'
import { formatNumber } from '@/application/features/database-core/utils'
import type { AuditTrend } from '@/application/features/database-core/types'

export interface AuditTrendsChartProps {
  trends?: AuditTrend[]
  loading?: boolean
  error?: Error | null
  height?: number
  className?: string
}

/**
 * Audit Trends Chart - رسم اتجاهات Audit
 *
 * @example
 * ```tsx
 * <AuditTrendsChart trends={trends} loading={loading} />
 * ```
 */
export const AuditTrendsChart: React.FC<AuditTrendsChartProps> = ({
  trends = [],
  loading = false,
  error = null,
  height = 300,
  className = '',
}) => {
  const chartData = useMemo(() => {
    if (!trends || trends.length === 0) {
      return []
    }

    return trends.map(trend => ({
      x: trend.period,
      y: trend.total,
    }))
  }, [trends])

  if (!trends || trends.length === 0) {
    return (
      <BaseCard
        title="Audit Trends"
        loading={loading}
        error={error?.message}
        className={`audit-trends-chart ${className}`}
      >
        <div className="audit-trends-chart__empty">
          <p>لا توجد بيانات متاحة</p>
        </div>
      </BaseCard>
    )
  }

  return (
    <BaseCard
      title="Audit Trends"
      loading={loading}
      error={error?.message}
      className={`audit-trends-chart ${className}`}
    >
      <div className="audit-trends-chart__header">
        <div className="audit-trends-chart__summary">
          <div className="audit-trends-chart__summary-item">
            <span className="audit-trends-chart__summary-label">إجمالي:</span>
            <span className="audit-trends-chart__summary-value">
              {formatNumber(trends.reduce((sum, t) => sum + t.total, 0))}
            </span>
          </div>
          <div className="audit-trends-chart__summary-item">
            <span className="audit-trends-chart__summary-label">نجحت:</span>
            <span className="audit-trends-chart__summary-value">
              {formatNumber(trends.reduce((sum, t) => sum + t.successful, 0))}
            </span>
          </div>
          <div className="audit-trends-chart__summary-item">
            <span className="audit-trends-chart__summary-label">فشلت:</span>
            <span className="audit-trends-chart__summary-value">
              {formatNumber(trends.reduce((sum, t) => sum + t.failed, 0))}
            </span>
          </div>
        </div>
      </div>
      <div className="audit-trends-chart__chart">
        <LineChart
          data={chartData}
          width={800}
          height={height}
          color="#3b82f6"
          showGrid
          showLabels
        />
      </div>
    </BaseCard>
  )
}
