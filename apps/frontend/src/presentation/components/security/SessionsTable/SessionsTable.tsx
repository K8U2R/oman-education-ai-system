/**
 * Sessions Table - جدول الجلسات
 *
 * مكون لعرض الجلسات النشطة في جدول
 */

import React from 'react'
import { Laptop, Smartphone, Tablet, Eye, XCircle, Shield } from 'lucide-react'
import { Card, Button, Badge, Avatar } from '../../common'
import { DataTable, DataTableColumn } from '../../data'
import { cn } from '../../common/utils/classNames'
import type { Session } from '@/features/system-administration-portal'

export interface SessionsTableProps {
  sessions: Session[]
  onTerminate?: (sessionId: string) => void
  onViewDetails?: (session: Session) => void
  className?: string
}

const deviceIcons = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Laptop,
}

const statusStyles = {
  active: { variant: 'success' as const, label: 'نشط' },
  idle: { variant: 'warning' as const, label: 'خامل' },
  expired: { variant: 'default' as const, label: 'منتهي' },
  frozen: { variant: 'info' as const, label: 'مجمد' },
}

const riskStyles = {
  low: { variant: 'success' as const, label: 'خطر منخفض' },
  medium: { variant: 'warning' as const, label: 'خطر متوسط' },
  high: { variant: 'error' as const, label: 'خطر عالي' },
}

export const SessionsTable: React.FC<SessionsTableProps> = ({
  sessions,
  onTerminate,
  onViewDetails,
  className,
}) => {
  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'الآن'
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`
    return `منذ ${Math.floor(seconds / 86400)} يوم`
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns: DataTableColumn<Session>[] = [
    {
      key: 'user',
      label: 'المستخدم',
      render: (_value, session) => (
        <div className="sessions-table__user">
          <Avatar
            src={session.userAvatar}
            alt={session.userName || session.userEmail || 'User'}
            name={session.userName || session.userEmail || 'User'}
            size="sm"
          />
          <div className="sessions-table__user-info">
            <div className="sessions-table__user-name">
              {session.userName || session.userEmail || 'مستخدم غير معروف'}
              {session.isCurrent && (
                <Badge variant="primary" size="xs" className="sessions-table__current-badge">
                  أنت
                </Badge>
              )}
            </div>
            {session.userEmail && (
              <div className="sessions-table__user-email">{session.userEmail}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'device',
      label: 'الجهاز',
      render: (_value, session) => {
        const deviceType = session.deviceInfo.type as keyof typeof deviceIcons
        const DeviceIcon = deviceIcons[deviceType] || Laptop
        return (
          <div className="sessions-table__device">
            <DeviceIcon className="sessions-table__device-icon" />
            <div>
              <div className="sessions-table__device-browser">{session.deviceInfo.browser}</div>
              <div className="sessions-table__device-os">{session.deviceInfo.os}</div>
            </div>
          </div>
        )
      },
    },
    {
      key: 'location',
      label: 'الموقع',
      render: (_value, session) => (
        <div className="sessions-table__location">
          {session.location?.city || session.location?.country || 'غير معروف'}
          {session.ipAddress && <div className="sessions-table__ip">{session.ipAddress}</div>}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (_value, session) => {
        const status = session.status as keyof typeof statusStyles
        const riskLevel = session.riskLevel as keyof typeof riskStyles
        const statusStyle = statusStyles[status]
        const riskStyle = riskStyles[riskLevel]
        return (
          <div className="sessions-table__status">
            <Badge variant={statusStyle.variant} size="sm">
              {statusStyle.label}
            </Badge>
            <Badge variant={riskStyle.variant} size="xs" className="sessions-table__risk-badge">
              {riskStyle.label}
            </Badge>
          </div>
        )
      },
    },
    {
      key: 'lastActivity',
      label: 'آخر نشاط',
      render: (_value, session) => (
        <div className="sessions-table__activity">
          {formatTimeAgo(session.lastActivityAt)}
          <div className="sessions-table__activity-date">{formatDate(session.lastActivityAt)}</div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_value, session) => (
        <div className="sessions-table__actions">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(session)}
              leftIcon={<Eye />}
            >
              عرض
            </Button>
          )}
          {!session.isCurrent && onTerminate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTerminate(session.id)}
              leftIcon={<XCircle />}
              className="sessions-table__terminate-btn"
            >
              إنهاء
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card className={cn('sessions-table', className)}>
      <div className="sessions-table__header">
        <div className="sessions-table__header-content">
          <Shield className="sessions-table__header-icon" />
          <h3 className="sessions-table__header-title">الجلسات النشطة</h3>
        </div>
        <Badge variant="default" size="sm">
          {sessions.length} جلسة
        </Badge>
      </div>

      <DataTable
        data={sessions as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        emptyMessage="لا توجد جلسات نشطة"
        className="sessions-table__data-table"
      />
    </Card>
  )
}
