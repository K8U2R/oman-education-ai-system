/**
 * Performance Dashboard Page - صفحة لوحة تحكم الأداء
 *
 * عرض شامل لمقاييس الأداء وإحصائياتها
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Activity, TrendingUp, Clock, Zap, Server, Gauge } from 'lucide-react'
import { AdminStatsCard } from '../../../core/components'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { usePerformanceDashboard } from '@/presentation/pages/admin/features/analytics/hooks'
import { formatAdminNumber as formatNumber } from '../../../core/utils/formatting.util'


const PerformanceDashboardPage: React.FC = () => {
  const { canAccess, loading, error, stats, webVitals, metrics, refresh } =
    usePerformanceDashboard()

  if (loading) {
    return <AdminLoadingState message="جارٍ تحميل البيانات..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="فشل تحميل البيانات" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <AdminPageLayout
      title="لوحة تحكم الأداء"
      description="عرض شامل لمقاييس الأداء وإحصائياتها"
      icon={<Activity size={28} />}
    >
      <div className="performance-dashboard-page">
        {/* Performance Statistics */}
        {stats && (
          <div className="performance-dashboard-page__stats-grid">
            <AdminStatsCard
              title="Average Response Time"
              value={stats.averageResponseTime ? formatDuration(stats.averageResponseTime) : 'N/A'}
              icon={<Clock />}
              variant="default"
            />
            <AdminStatsCard
              title="Requests Per Second"
              value={stats.requestsPerSecond ? formatNumber(stats.requestsPerSecond) : 'N/A'}
              icon={<TrendingUp />}
              variant="default"
            />
            <AdminStatsCard
              title="Error Rate"
              value={stats.errorRate ? `${(stats.errorRate * 100).toFixed(2)}%` : 'N/A'}
              icon={<Activity />}
              variant={stats.errorRate && stats.errorRate > 0.01 ? 'danger' : 'success'}
            />
          </div>
        )}

        {/* Web Vitals */}
        {webVitals && (
          <div className="performance-dashboard-page__web-vitals">
            <h3>Web Vitals</h3>
            <div className="performance-dashboard-page__vitals-grid">
              <AdminStatsCard
                title="LCP"
                value={webVitals.lcp ? formatDuration(webVitals.lcp) : 'N/A'}
                icon={<Gauge />}
                variant="default"
              />
              <AdminStatsCard
                title="FID"
                value={webVitals.fid ? formatDuration(webVitals.fid) : 'N/A'}
                icon={<Zap />}
                variant="default"
              />
              <AdminStatsCard
                title="CLS"
                value={webVitals.cls ? webVitals.cls.toFixed(3) : 'N/A'}
                icon={<Server />}
                variant="default"
              />
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {metrics && (
          <div className="performance-dashboard-page__metrics">
            <h3>Performance Metrics</h3>
            <div className="performance-dashboard-page__metrics-grid">
              <AdminStatsCard
                title="Memory Usage"
                value={
                  metrics.memory?.usedJSHeapSize
                    ? formatBytes(metrics.memory.usedJSHeapSize)
                    : 'N/A'
                }
                icon={<Server />}
                variant="default"
              />
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  )
}

export default PerformanceDashboardPage
