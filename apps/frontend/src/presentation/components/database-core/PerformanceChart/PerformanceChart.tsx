/**
 * Performance Chart Component - مكون رسم أداء قاعدة البيانات
 *
 * مكون متخصص لعرض Response Time Trends
 */

import React, { useMemo } from 'react'
import { LineChart } from '@/presentation/components/charts'
import type { PerformanceMetrics } from '@/application/features/database-core/types'
import { formatDuration } from '@/application/features/database-core/utils'

export interface PerformanceChartProps {
  performance?: PerformanceMetrics | null
  height?: number
  className?: string
}

/**
 * Performance Chart - رسم أداء قاعدة البيانات
 *
 * @example
 * ```tsx
 * <PerformanceChart performance={metrics.performance} timeWindow="24h" />
 * ```
 */
export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  performance,
  height = 300,
  className = '',
}) => {
  // Generate mock data points (سيتم استبدالها ببيانات حقيقية من API)
  const chartData = useMemo(() => {
    if (!performance) {
      return []
    }

    // Generate 20 data points
    const points = []
    const baseTime = performance.responseTime.average
    const variance = baseTime * 0.2

    for (let i = 0; i < 20; i++) {
      const value = baseTime + (Math.random() - 0.5) * variance
      points.push({
        x: `T${i + 1}`,
        y: Math.max(0, value),
      })
    }

    return points
  }, [performance])

  if (!performance) {
    return (
      <div className={`performance-chart performance-chart--empty ${className}`}>
        <p>لا توجد بيانات متاحة</p>
      </div>
    )
  }

  return (
    <div className={`performance-chart ${className}`}>
      <div className="performance-chart__header">
        <h3 className="performance-chart__title">Response Time Trends</h3>
        <div className="performance-chart__legend">
          <div className="performance-chart__legend-item">
            <span className="performance-chart__legend-color performance-chart__legend-color--p50" />
            <span>P50: {formatDuration(performance.responseTime.p50)}</span>
          </div>
          <div className="performance-chart__legend-item">
            <span className="performance-chart__legend-color performance-chart__legend-color--p95" />
            <span>P95: {formatDuration(performance.responseTime.p95)}</span>
          </div>
          <div className="performance-chart__legend-item">
            <span className="performance-chart__legend-color performance-chart__legend-color--p99" />
            <span>P99: {formatDuration(performance.responseTime.p99)}</span>
          </div>
        </div>
      </div>
      <div className="performance-chart__chart">
        <LineChart
          data={chartData}
          width={800}
          height={height}
          color="#3b82f6"
          showGrid
          showLabels
        />
      </div>
    </div>
  )
}
