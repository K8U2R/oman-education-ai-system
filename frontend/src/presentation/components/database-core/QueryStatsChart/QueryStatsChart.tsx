/**
 * Query Stats Chart Component - مكون رسم إحصائيات الاستعلامات
 *
 * مكون متخصص لعرض Query Statistics
 */

import React, { useMemo } from 'react'
import { BarChart } from '@/presentation/components/charts'
import type { QueryStatistics } from '@/application/features/database-core/types'
import { formatNumber } from '@/application/features/database-core/utils'

export interface QueryStatsChartProps {
  statistics?: QueryStatistics | null
  height?: number
  className?: string
}

/**
 * Query Stats Chart - رسم إحصائيات الاستعلامات
 *
 * @example
 * ```tsx
 * <QueryStatsChart statistics={metrics.queries} />
 * ```
 */
export const QueryStatsChart: React.FC<QueryStatsChartProps> = ({
  statistics,
  height = 300,
  className = '',
}) => {
  const chartData = useMemo(() => {
    if (!statistics) {
      return []
    }

    return [
      {
        label: 'إجمالي',
        value: statistics.total,
        color: '#3b82f6',
      },
      {
        label: 'نجحت',
        value: statistics.successful,
        color: '#10b981',
      },
      {
        label: 'فشلت',
        value: statistics.failed,
        color: '#ef4444',
      },
      {
        label: 'بطيئة',
        value: statistics.slowQueries,
        color: '#f59e0b',
      },
    ]
  }, [statistics])

  if (!statistics) {
    return (
      <div className={`query-stats-chart query-stats-chart--empty ${className}`}>
        <p>لا توجد بيانات متاحة</p>
      </div>
    )
  }

  return (
    <div className={`query-stats-chart ${className}`}>
      <div className="query-stats-chart__header">
        <h3 className="query-stats-chart__title">Query Statistics</h3>
        <div className="query-stats-chart__summary">
          <div className="query-stats-chart__summary-item">
            <span className="query-stats-chart__summary-label">متوسط المدة:</span>
            <span className="query-stats-chart__summary-value">
              {formatNumber(statistics.averageDuration)}ms
            </span>
          </div>
        </div>
      </div>
      <div className="query-stats-chart__chart">
        <BarChart data={chartData} width={600} height={height} showGrid showLabels />
      </div>
    </div>
  )
}
