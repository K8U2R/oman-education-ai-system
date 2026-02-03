/**
 * PieChart Component - مكون الرسم البياني الدائري
 *
 * مكون رسم بياني دائري بسيط
 */

import React, { useRef, useEffect } from 'react'
import { cn } from '../../common/utils/classNames'

export interface PieChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface PieChartProps {
  data: PieChartDataPoint[]
  width?: number
  height?: number
  showLabels?: boolean
  showLegend?: boolean
  className?: string
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 300,
  height = 300,
  showLabels = true,
  showLegend = true,
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

    // Calculate total
    const total = data.reduce((sum, point) => sum + point.value, 0)
    if (total === 0) return

    // Center and radius
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    // Draw pie slices
    let currentAngle = -Math.PI / 2 // Start from top

    data.forEach(point => {
      const sliceAngle = (point.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = point.color || '#3b82f6'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label
      if (showLabels && point.value / total > 0.05) {
        const labelAngle = currentAngle + sliceAngle / 2
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`${Math.round((point.value / total) * 100)}%`, labelX, labelY)
      }

      currentAngle += sliceAngle
    })
  }, [data, width, height, showLabels])

  return (
    <div className={cn('pie-chart', className)}>
      <canvas ref={canvasRef} width={width} height={height} className="pie-chart__canvas" />
      {showLegend && (
        <div className="pie-chart__legend">
          {data.map((point, index) => (
            <div key={index} className="pie-chart__legend-item">
              <div
                className="pie-chart__legend-color"
                style={{ backgroundColor: point.color || '#3b82f6' }}
              />
              <span className="pie-chart__legend-label">{point.label}</span>
              <span className="pie-chart__legend-value">{point.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
