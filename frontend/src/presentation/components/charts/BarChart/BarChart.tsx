/**
 * BarChart Component - مكون الرسم البياني العمودي
 *
 * مكون رسم بياني عمودي بسيط
 */

import React, { useRef, useEffect } from 'react'
import { cn } from '../../common/utils/classNames'
import './BarChart.scss'

export interface BarChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  data: BarChartDataPoint[]
  width?: number
  height?: number
  showGrid?: boolean
  showLabels?: boolean
  className?: string
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 200,
  showGrid = true,
  showLabels = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = chartWidth / data.length - 10
    const barSpacing = 10

    // Find max value
    const maxValue = Math.max(...data.map(point => point.value))

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }
    }

    // Draw bars
    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const y = padding + chartHeight - barHeight

      ctx.fillStyle = point.color || '#3b82f6'
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'

      data.forEach((point, index) => {
        const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2
        ctx.fillText(point.label, x, height - padding + 20)
      })

      // Y-axis labels
      ctx.textAlign = 'right'
      for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * (5 - i)
        const y = padding + (chartHeight / 5) * i
        ctx.fillText(value.toFixed(0), padding - 10, y + 4)
      }
    }
  }, [data, width, height, showGrid, showLabels])

  return (
    <div className={cn('bar-chart', className)}>
      <canvas ref={canvasRef} width={width} height={height} className="bar-chart__canvas" />
    </div>
  )
}
