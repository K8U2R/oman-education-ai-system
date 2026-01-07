/**
 * Security Logs Page - صفحة سجلات الأمان
 *
 * صفحة لعرض سجلات الأمان مع الفلترة والتصدير (للمسؤولين فقط)
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Download,
  Search,
  RefreshCw,
  LogIn,
  LogOut,
  Key,
  Shield,
  AlertTriangle,
  Ban,
  Activity,
} from 'lucide-react'
import { Button, Input, Badge } from '../../../components/common'
import { DataTable, DataTableColumn } from '../../../components/data'
import { securityService } from '@/application/features/security/services'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type {
  SecurityEvent,
  SecurityEventType,
  SecurityEventSeverity,
} from '@/application/features/security/types'
import './SecurityLogsPage.scss'

const SecurityLogsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin } = useRole()
  const [logs, setLogs] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<SecurityEventSeverity | 'all'>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<SecurityEventType | 'all'>('all')
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate])

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const filter: {
        page: number
        per_page: number
        severity?: SecurityEventSeverity
        eventType?: SecurityEventType
        search?: string
      } = {
        page,
        per_page: perPage,
      }
      if (severityFilter !== 'all') {
        filter.severity = severityFilter
      }
      if (eventTypeFilter !== 'all') {
        filter.eventType = eventTypeFilter
      }
      const data = await securityService.getSecurityLogs(filter)
      setLogs(data.logs)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل السجلات'
      setError(errorMessage)
      // Error logging is handled by the error interceptor
    } finally {
      setLoading(false)
    }
  }, [page, severityFilter, eventTypeFilter, perPage]) // searchQuery is handled separately

  useEffect(() => {
    if (isAdmin) {
      loadLogs()
    }
  }, [isAdmin, loadLogs])

  const handleExport = async () => {
    try {
      setLoading(true)
      const filter: {
        page?: number
        per_page?: number
        severity?: SecurityEventSeverity
        eventType?: SecurityEventType
        search?: string
      } = {}
      if (severityFilter !== 'all') {
        filter.severity = severityFilter
      }
      if (eventTypeFilter !== 'all') {
        filter.eventType = eventTypeFilter
      }
      const blob = await securityService.exportSecurityLogs(filter)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `security-logs-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تصدير السجلات'
      setError(errorMessage)
      console.error('Failed to export logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const getEventIcon = (type: SecurityEventType) => {
    const iconMap: Record<string, typeof LogIn> = {
      login_success: LogIn,
      login_failed: AlertTriangle,
      logout: LogOut,
      password_changed: Key,
      password_reset_requested: Key,
      '2fa_enabled': Shield,
      '2fa_disabled': Shield,
      session_terminated: Ban,
      suspicious_activity: AlertTriangle,
      brute_force_detected: AlertTriangle,
      ip_blocked: Ban,
      account_locked: Ban,
      permission_denied: Ban,
      rate_limit_exceeded: AlertTriangle,
    }
    return iconMap[type] || Activity
  }

  const getSeverityVariant = (
    severity: SecurityEventSeverity
  ): 'success' | 'warning' | 'error' | 'info' => {
    switch (severity) {
      case 'critical':
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'info'
    }
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
    return matchesSearch
  })

  const stats = {
    total: logs.length,
    critical: logs.filter(e => e.severity === 'critical').length,
    warnings: logs.filter(e => e.severity === 'warning').length,
    resolved: logs.filter(e => e.resolved).length,
  }

  const columns: DataTableColumn<SecurityEvent>[] = [
    {
      key: 'event',
      label: 'الحدث',
      render: (_value, event) => {
        const Icon = getEventIcon(event.type)
        const severityVariant = getSeverityVariant(event.severity)
        return (
          <div className="security-logs-page__event">
            <div
              className={`security-logs-page__event-icon security-logs-page__event-icon--${severityVariant}`}
            >
              <Icon className="security-logs-page__event-icon-svg" />
            </div>
            <div>
              <div className="security-logs-page__event-message">{event.message}</div>
              {event.details && (
                <div className="security-logs-page__event-details">{event.details}</div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'severity',
      label: 'الخطورة',
      render: (_value, event) => {
        const variant = getSeverityVariant(event.severity)
        const label =
          event.severity === 'critical'
            ? 'حرج'
            : event.severity === 'error'
              ? 'خطأ'
              : event.severity === 'warning'
                ? 'تحذير'
                : 'معلومة'
        return (
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        )
      },
    },
    {
      key: 'user',
      label: 'المستخدم',
      render: (_value, event) => (
        <div className="security-logs-page__user">
          {event.userEmail ? (
            <span className="security-logs-page__user-email">{event.userEmail}</span>
          ) : (
            <span className="security-logs-page__user-empty">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'ip',
      label: 'عنوان IP',
      render: (_value, event) => (
        <div className="security-logs-page__ip">
          <div className="security-logs-page__ip-address">{event.ipAddress || '-'}</div>
          {event.location?.city && (
            <div className="security-logs-page__ip-location">{event.location.city}</div>
          )}
        </div>
      ),
    },
    {
      key: 'time',
      label: 'الوقت',
      render: (_value, event) => (
        <div className="security-logs-page__time">{formatDate(event.createdAt)}</div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (_value, event) => (
        <Badge variant={event.resolved ? 'success' : 'warning'} size="sm">
          {event.resolved ? 'تم الحل' : 'معلق'}
        </Badge>
      ),
    },
  ]

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل سجلات الأمان..." />
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="security-logs-page">
      <PageHeader
        title="سجلات الأمان"
        description="تتبع ومراقبة جميع الأحداث الأمنية"
        icon={<FileText className="security-logs-page__header-icon" />}
        actions={
          <div className="security-logs-page__header-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              leftIcon={<Download />}
              disabled={loading}
            >
              تصدير
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadLogs}
              leftIcon={<RefreshCw />}
              disabled={loading}
            >
              تحديث
            </Button>
          </div>
        }
      />

      {error && (
        <div className="security-logs-page__error">
          <AlertTriangle className="security-logs-page__error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="security-logs-page__stats">
        <div className="security-logs-page__stat-item">
          <Activity className="security-logs-page__stat-icon" />
          <div>
            <div className="security-logs-page__stat-label">إجمالي الأحداث</div>
            <div className="security-logs-page__stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="security-logs-page__stat-item security-logs-page__stat-item--critical">
          <AlertTriangle className="security-logs-page__stat-icon" />
          <div>
            <div className="security-logs-page__stat-label">حرجة</div>
            <div className="security-logs-page__stat-value">{stats.critical}</div>
          </div>
        </div>
        <div className="security-logs-page__stat-item security-logs-page__stat-item--warning">
          <AlertTriangle className="security-logs-page__stat-icon" />
          <div>
            <div className="security-logs-page__stat-label">تحذيرات</div>
            <div className="security-logs-page__stat-value">{stats.warnings}</div>
          </div>
        </div>
        <div className="security-logs-page__stat-item security-logs-page__stat-item--success">
          <Shield className="security-logs-page__stat-icon" />
          <div>
            <div className="security-logs-page__stat-label">تم حلها</div>
            <div className="security-logs-page__stat-value">{stats.resolved}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="security-logs-page__filters">
        <div className="security-logs-page__search">
          <Input
            placeholder="بحث في السجلات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
            fullWidth
          />
        </div>
        <div className="security-logs-page__filter-group">
          <select
            value={severityFilter}
            onChange={e => {
              setSeverityFilter(e.target.value as SecurityEventSeverity | 'all')
              setPage(1)
            }}
            className="security-logs-page__select"
          >
            <option value="all">جميع المستويات</option>
            <option value="info">معلومة</option>
            <option value="warning">تحذير</option>
            <option value="error">خطأ</option>
            <option value="critical">حرج</option>
          </select>
          <select
            value={eventTypeFilter}
            onChange={e => {
              setEventTypeFilter(e.target.value as SecurityEventType | 'all')
              setPage(1)
            }}
            className="security-logs-page__select"
          >
            <option value="all">جميع الأنواع</option>
            <option value="login_success">تسجيل دخول ناجح</option>
            <option value="login_failed">تسجيل دخول فاشل</option>
            <option value="suspicious_activity">نشاط مشبوه</option>
            <option value="brute_force_detected">هجوم تخمين</option>
            <option value="rate_limit_exceeded">تجاوز الحد</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <DataTable
        data={filteredLogs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        searchable={false}
        pagination={true}
        pageSize={perPage}
        emptyMessage="لا توجد سجلات"
        className="security-logs-page__table"
      />
    </div>
  )
}

export default SecurityLogsPage
