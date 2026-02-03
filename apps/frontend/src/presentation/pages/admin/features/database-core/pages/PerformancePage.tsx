/**
 * Performance Page - صفحة مراقبة الأداء
 *
 * صفحة شاملة لمراقبة أداء قاعدة البيانات
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { BarChart, Activity, TrendingUp, RefreshCw } from 'lucide-react'
import { Button } from '@/presentation/components/common'
import {
  BaseCard,
  MetricsCard,
  PerformanceChart,
  QueryStatsChart,
} from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { usePerformancePage } from '../hooks'
import { formatDuration, formatPercentage } from '@/application/features/database-core/utils'


const PerformancePage: React.FC = () => {
  const { canAccess, loading, error, metrics, refresh } = usePerformancePage()

  if (loading) {
    return <AdminLoadingState message="جاري تحميل بيانات الأداء..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  const performance = metrics?.performance
  const memory = metrics?.memory

  return (
    <AdminPageLayout
      title="مراقبة الأداء"
      description="مراقبة وتحليل أداء قاعدة البيانات"
      icon={<BarChart size={28} />}
      actions={
        <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
          تحديث
        </Button>
      }
    >
      <div className="performance-page">
        {/* Performance Metrics */}
        <div className="performance-page__metrics-grid">
          <MetricsCard
            title="Response Time (p50)"
            value={performance ? formatDuration(performance.responseTime.p50) : 'N/A'}
            icon={<Activity />}
            variant="default"
            loading={loading}
          />

          <MetricsCard
            title="Response Time (p95)"
            value={performance ? formatDuration(performance.responseTime.p95) : 'N/A'}
            icon={<Activity />}
            variant={performance && performance.responseTime.p95 > 2000 ? 'warning' : 'default'}
            loading={loading}
          />

          <MetricsCard
            title="Response Time (p99)"
            value={performance ? formatDuration(performance.responseTime.p99) : 'N/A'}
            icon={<Activity />}
            variant={performance && performance.responseTime.p99 > 5000 ? 'danger' : 'default'}
            loading={loading}
          />

          <MetricsCard
            title="Error Rate"
            value={performance ? formatPercentage(performance.errorRate) : 'N/A'}
            icon={<TrendingUp />}
            variant={performance && performance.errorRate > 0.1 ? 'danger' : 'success'}
            loading={loading}
          />

          <MetricsCard
            title="Throughput"
            value={performance ? `${performance.throughput.toLocaleString('ar-SA')} req/s` : 'N/A'}
            icon={<TrendingUp />}
            variant="default"
            loading={loading}
          />

          <MetricsCard
            title="Memory Usage"
            value={memory ? formatPercentage(memory.percentage / 100) : 'N/A'}
            icon={<Activity />}
            variant={
              memory && memory.percentage > 90
                ? 'danger'
                : memory && memory.percentage > 70
                  ? 'warning'
                  : 'success'
            }
            loading={loading}
          />
        </div>

        {/* Performance Charts */}
        <BaseCard
          title="Response Time Trends"
          icon={<BarChart />}
          loading={loading}
          error={error}
          className="performance-page__chart-card"
        >
          <PerformanceChart performance={performance} height={300} />
        </BaseCard>

        {/* Query Statistics */}
        <BaseCard title="Query Statistics" icon={<Activity />} loading={loading} error={error}>
          <QueryStatsChart statistics={metrics?.queries} height={300} />
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default PerformancePage
