/**
 * LineChart Component - مكون الرسم البياني الخطي
 *
 * مكون رسم بياني خطي بسيط
 */

import React, { useRef, useEffect } from 'react'
import { cn } from '../../common/utils/classNames'

export interface LineChartDataPoint {
  x: string | number
  y: number
  label?: string
}

export interface LineChartProps {
  data: LineChartDataPoint[]
  width?: number
  height?: number
  color?: string
  showGrid?: boolean
  showLabels?: boolean
  className?: string
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3b82f6',
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

    // Find min/max values
    const values = data.map(point => point.y)
    const minY = Math.min(...values)
    const maxY = Math.max(...values)
    const rangeY = maxY - minY || 1

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1

      // Horizontal lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let i = 0; i <= data.length - 1; i++) {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * i
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
        ctx.stroke()
      }
    }

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index
      const y = padding + chartHeight - ((point.y - minY) / rangeY) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    ctx.fillStyle = color
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1 || 1)) * index
      const y = padding + chartHeight - ((point.y - minY) / rangeY) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    if (showLabels) {
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'

      data.forEach((point, index) => {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * index
        const label = point.label || point.x.toString()
        ctx.fillText(label, x, height - padding + 20)
      })

      // Y-axis labels
      ctx.textAlign = 'right'
      for (let i = 0; i <= 5; i++) {
        const value = minY + (rangeY / 5) * (5 - i)
        const y = padding + (chartHeight / 5) * i
        ctx.fillText(value.toFixed(0), padding - 10, y + 4)
      }
    }
  }, [data, width, height, color, showGrid, showLabels])

  return (
    <div className={cn('line-chart', className)}>
      <canvas ref={canvasRef} width={width} height={height} className="line-chart__canvas" />
    </div>
  )
}
