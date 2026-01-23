/**
 * Security Logs Page - صفحة سجلات الأمان
 *
 * صفحة لعرض سجلات الأمان مع الفلترة والتصدير
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { FileText, RefreshCw, Download } from 'lucide-react'
import { Button, Input, Badge } from '@/presentation/components/common'
import { DataTable, DataTableColumn } from '@/presentation/components/data'
import { AdminPageLayout } from '@/presentation/pages/admin/core/components'
import { AdminLoadingState, AdminErrorState } from '@/presentation/pages/admin/shared/components'
import { useSecurityLogs } from '../hooks'
import type { SecurityEvent } from '@/features/system-administration-portal'
import {
  formatSecurityEventType,
  formatSecurityEventSeverity,
} from '@/features/system-administration-portal'


const SecurityLogsPage: React.FC = () => {
  const {
    canAccess,
    loading,
    error,
    logs,
    searchQuery,
    severityFilter,
    eventTypeFilter,
    setSearchQuery,
    refresh,
  } = useSecurityLogs()

  if (loading) {
    return <AdminLoadingState message="جاري تحميل سجلات الأمان..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  const columns: DataTableColumn<SecurityEvent>[] = [
    {
      key: 'createdAt',
      label: 'الوقت',
      render: (_, event: SecurityEvent) => new Date(event.createdAt).toLocaleString('ar-SA'),
    },
    {
      key: 'type',
      label: 'النوع',
      render: (_, event: SecurityEvent) => formatSecurityEventType(event.type),
    },
    {
      key: 'severity',
      label: 'الخطورة',
      render: (_, event: SecurityEvent) => (
        <Badge
          variant={
            event.severity === 'critical' || event.severity === 'error'
              ? 'error'
              : event.severity === 'warning'
                ? 'warning'
                : 'default'
          }
        >
          {formatSecurityEventSeverity(event.severity)}
        </Badge>
      ),
    },
    {
      key: 'actor',
      label: 'المستخدم',
      render: (_, event: SecurityEvent) =>
        event.userName || event.userEmail || event.ipAddress || 'غير معروف',
    },
    {
      key: 'description',
      label: 'الوصف',
      render: (_, event: SecurityEvent) => event.message || event.details || 'لا يوجد وصف',
    },
  ]

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      !searchQuery ||
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    const matchesType = eventTypeFilter === 'all' || log.type === eventTypeFilter
    return matchesSearch && matchesSeverity && matchesType
  })

  return (
    <AdminPageLayout
      title="سجلات الأمان"
      description="سجل العمليات والأنشطة الأمنية"
      icon={<FileText size={28} />}
      actions={
        <div className="security-logs-page__header-actions">
          <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
            تصدير
          </Button>
        </div>
      }
    >
      <div className="security-logs-page">
        {/* Filters */}
        <div className="security-logs-page__filters">
          <Input
            type="text"
            placeholder="بحث في السجلات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="security-logs-page__search"
          />
        </div>

        {/* Logs Table */}
        <DataTable data={filteredLogs} columns={columns} emptyMessage="لا توجد سجلات أمان" />
      </div>
    </AdminPageLayout>
  )
}

export default SecurityLogsPage
