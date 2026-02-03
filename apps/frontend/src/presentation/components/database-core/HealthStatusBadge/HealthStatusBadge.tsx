/**
 * HealthStatusBadge Component - شارة حالة الصحة
 *
 * مكون لعرض حالة الصحة (Healthy, Degraded, Error)
 */

import React from 'react'
import { Badge } from '../../common'
import { CheckCircle, AlertTriangle, XCircle, Loader } from 'lucide-react'
import { formatStatus } from '@/application/features/database-core/utils'

export interface HealthStatusBadgeProps {
  status: 'healthy' | 'degraded' | 'error' | 'disconnected' | 'ok' | 'loading'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

/**
 * HealthStatusBadge - شارة حالة الصحة
 *
 * @example
 * ```tsx
 * <HealthStatusBadge status="healthy" showIcon />
 * ```
 */
export const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = React.memo(
  ({ status, size = 'md', showIcon = true, className = '' }) => {
    const { label, color } = formatStatus(status)

    const icon =
      status === 'loading' ? (
        <Loader className="health-status-badge__icon health-status-badge__icon--spinning" />
      ) : status === 'healthy' || status === 'ok' ? (
        <CheckCircle className="health-status-badge__icon" />
      ) : status === 'degraded' ? (
        <AlertTriangle className="health-status-badge__icon" />
      ) : (
        <XCircle className="health-status-badge__icon" />
      )

    return (
      <Badge
        variant={color === 'danger' ? 'error' : color}
        size={size}
        className={`health-status-badge ${className}`}
      >
        {showIcon && icon}
        <span className="health-status-badge__label">{label}</span>
      </Badge>
    )
  }
)

HealthStatusBadge.displayName = 'HealthStatusBadge'
