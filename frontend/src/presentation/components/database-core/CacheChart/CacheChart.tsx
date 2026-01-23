/**
 * Cache Chart Component - مكون رسم Cache Statistics
 *
 * مكون متخصص لعرض Cache Statistics
 */

import React, { useMemo } from 'react'
import { PieChart } from '@/presentation/components/charts'
import type { CacheStats } from '@/application/features/database-core/types'
import { formatNumber } from '@/application/features/database-core/utils'

export interface CacheChartProps {
  stats?: CacheStats | null
  height?: number
  className?: string
}

/**
 * Cache Chart - رسم Cache Statistics
 *
 * @example
 * ```tsx
 * <CacheChart stats={cacheStats} />
 * ```
 */
export const CacheChart: React.FC<CacheChartProps> = ({ stats, height = 300, className = '' }) => {
  const chartData = useMemo(() => {
    if (!stats) {
      return []
    }

    return [
      {
        label: 'Hit',
        value: stats.hitCount,
        color: '#10b981',
      },
      {
        label: 'Miss',
        value: stats.missCount,
        color: '#ef4444',
      },
      {
        label: 'Expired',
        value: stats.expired,
        color: '#f59e0b',
      },
    ]
  }, [stats])

  if (!stats) {
    return (
      <div className={`cache-chart cache-chart--empty ${className}`}>
        <p>لا توجد بيانات متاحة</p>
      </div>
    )
  }

  return (
    <div className={`cache-chart ${className}`}>
      <div className="cache-chart__header">
        <h3 className="cache-chart__title">Cache Statistics</h3>
        <div className="cache-chart__summary">
          <div className="cache-chart__summary-item">
            <span className="cache-chart__summary-label">Hit Rate:</span>
            <span className="cache-chart__summary-value">{stats.hitRatePercentage}</span>
          </div>
          <div className="cache-chart__summary-item">
            <span className="cache-chart__summary-label">Entries:</span>
            <span className="cache-chart__summary-value">{formatNumber(stats.entries)}</span>
          </div>
        </div>
      </div>
      <div className="cache-chart__chart">
        <PieChart data={chartData} width={height} height={height} showLabels showLegend />
      </div>
    </div>
  )
}
