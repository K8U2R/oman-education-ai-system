/**
 * Security Alerts Feed - تغذية تنبيهات الأمان
 *
 * مكون لعرض قائمة تنبيهات الأمان
 */

import React from 'react'
import { AlertTriangle, AlertCircle, Info, Check, Bell } from 'lucide-react'
import { Card, Button, Badge } from '../../common'
import { cn } from '../../common/utils/classNames'
import type { SecurityAlert } from '@/application/features/security/types'
import './SecurityAlertsFeed.scss'

export interface SecurityAlertsFeedProps {
  alerts: SecurityAlert[]
  onAcknowledge?: (alertId: string) => void
  onViewAll?: () => void
  maxItems?: number
  className?: string
}

const alertIcons: Record<string, typeof AlertTriangle> = {
  critical: AlertTriangle,
  error: AlertTriangle,
  warning: AlertCircle,
  info: Info,
}

export const SecurityAlertsFeed: React.FC<SecurityAlertsFeedProps> = ({
  alerts,
  onAcknowledge,
  onViewAll,
  maxItems = 10,
  className,
}) => {
  const displayedAlerts = alerts.slice(0, maxItems)
  const unacknowledgedCount = alerts.filter(a => !a.isAcknowledged).length

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'الآن'
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} د`
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} س`
    return `منذ ${Math.floor(seconds / 86400)} ي`
  }

  const getSeverityClass = (severity: SecurityAlert['severity']): string => {
    switch (severity) {
      case 'critical':
        return 'security-alerts-feed__alert--critical'
      case 'error':
        return 'security-alerts-feed__alert--error'
      case 'warning':
        return 'security-alerts-feed__alert--warning'
      case 'info':
        return 'security-alerts-feed__alert--info'
      default:
        return ''
    }
  }

  return (
    <Card className={cn('security-alerts-feed', className)}>
      <div className="security-alerts-feed__header">
        <div className="security-alerts-feed__header-content">
          <Bell className="security-alerts-feed__header-icon" />
          <h3 className="security-alerts-feed__header-title">تنبيهات الأمان</h3>
        </div>
        {unacknowledgedCount > 0 && (
          <Badge variant="error" size="sm">
            {unacknowledgedCount} جديد
          </Badge>
        )}
      </div>

      <div className="security-alerts-feed__list">
        {displayedAlerts.length === 0 ? (
          <div className="security-alerts-feed__empty">
            <Bell className="security-alerts-feed__empty-icon" />
            <p className="security-alerts-feed__empty-text">لا توجد تنبيهات</p>
          </div>
        ) : (
          displayedAlerts.map(alert => {
            const Icon = alertIcons[alert.severity] || Info
            const severityClass = getSeverityClass(alert.severity)

            return (
              <div
                key={alert.id}
                className={cn(
                  'security-alerts-feed__alert',
                  severityClass,
                  alert.isAcknowledged && 'security-alerts-feed__alert--acknowledged'
                )}
              >
                <div className="security-alerts-feed__alert-icon">
                  <Icon className="security-alerts-feed__alert-icon-svg" />
                </div>

                <div className="security-alerts-feed__alert-content">
                  <div className="security-alerts-feed__alert-header">
                    <Badge
                      variant={
                        alert.severity === 'critical' || alert.severity === 'error'
                          ? 'error'
                          : alert.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                      size="sm"
                    >
                      {alert.severity === 'critical'
                        ? 'حرج'
                        : alert.severity === 'warning'
                          ? 'تحذير'
                          : 'معلومة'}
                    </Badge>
                    <span className="security-alerts-feed__alert-time">
                      {formatTimeAgo(alert.createdAt)}
                    </span>
                  </div>

                  <h4 className="security-alerts-feed__alert-title">{alert.title}</h4>
                  <p className="security-alerts-feed__alert-message">{alert.message}</p>

                  {alert.description && (
                    <p className="security-alerts-feed__alert-description">{alert.description}</p>
                  )}

                  <div className="security-alerts-feed__alert-footer">
                    {(() => {
                      const source = alert.metadata?.source
                      return source && typeof source === 'string' ? (
                        <span className="security-alerts-feed__alert-source">{source}</span>
                      ) : null
                    })()}

                    {!alert.isAcknowledged && onAcknowledge && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAcknowledge(alert.id)}
                        leftIcon={<Check />}
                      >
                        تأكيد
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {alerts.length > maxItems && onViewAll && (
        <div className="security-alerts-feed__footer">
          <Button variant="ghost" size="sm" onClick={onViewAll} fullWidth>
            عرض الكل ({alerts.length})
          </Button>
        </div>
      )}
    </Card>
  )
}
