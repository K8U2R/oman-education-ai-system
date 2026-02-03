/**
 * Audit Logs Page - صفحة Audit Logs
 *
 * صفحة شاملة لعرض وتحليل Audit Logs
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { FileText, RefreshCw, Download } from 'lucide-react'
import { useSearchFilter } from '@/application/shared/hooks'
import { Button, Input } from '@/presentation/components/common'
import {
  BaseCard,
  AuditLogsTable,
  AuditStatisticsCard,
  AuditTrendsChart,
} from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useAuditLogsPage } from '../hooks'


const AuditLogsPage: React.FC = () => {
  const { canAccess, loading, error, logs, stats, trends, refresh } = useAuditLogsPage()

  const { searchTerm, setSearchTerm, filteredData } = useSearchFilter(logs || [], {
    searchFields: ['actor', 'action', 'entity'],
  })

  // Convert string error to Error object for components
  const errorObj = error ? new Error(error) : null

  if (loading) {
    return <AdminLoadingState message="جاري تحميل Audit Logs..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="Audit Logs"
      description="سجل العمليات والأنشطة في قاعدة البيانات"
      icon={<FileText size={28} />}
      actions={
        <div className="audit-logs-page__header-actions">
          <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
            تصدير
          </Button>
        </div>
      }
    >
      <div className="audit-logs-page">
        {/* Statistics */}
        <AuditStatisticsCard statistics={stats} loading={loading} error={errorObj} />

        {/* Trends */}
        {stats && <AuditTrendsChart trends={trends} loading={loading} error={errorObj} />}

        {/* Filters & Search */}
        <BaseCard title="Filters & Search" className="audit-logs-page__filters-card">
          <div className="audit-logs-page__filters">
            <div className="audit-logs-page__search">
              <Input
                type="text"
                placeholder="بحث في Audit Logs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </BaseCard>

        {/* Audit Logs Table */}
        <BaseCard title="Audit Logs" icon={<FileText />} loading={loading} error={errorObj}>
          <AuditLogsTable logs={filteredData} loading={loading} />
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default AuditLogsPage
