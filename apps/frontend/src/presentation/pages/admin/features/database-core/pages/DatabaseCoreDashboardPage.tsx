/**
 * Database Core Dashboard Page - لوحة تحكم Database Core
 *
 * الصفحة الرئيسية لمراقبة وإدارة قاعدة البيانات
 * تم نقلها إلى الهيكل الجديد مع استخدام Core Infrastructure
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Database,
  Code,
  Table,
  Shield,
  BarChart,
  Save,
  Activity,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/presentation/components/common'
import { BaseCard, MetricsCard, HealthStatusBadge } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useDatabaseCoreDashboard } from '../hooks'
import { formatPercentage } from '@/application/features/database-core/utils'
import { ADMIN_ROUTES } from '../../../core/constants'


const DatabaseCoreDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { canAccess, loading, error, metrics, connections, poolStats, cacheStats, refresh } =
    useDatabaseCoreDashboard()

  // حالة التحميل
  if (loading) {
    return <AdminLoadingState message="جاري تحميل لوحة التحكم..." fullScreen />
  }

  // حالة الخطأ
  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  // عدم الوصول
  if (!canAccess) {
    return null
  }

  const healthStatus = 'ok' // TODO: Get from health endpoint
  const uptime = metrics?.uptime || '0 ثانية'
  const memoryUsage = metrics?.memory?.percentage || 0
  const cacheHitRate = cacheStats?.hitRatePercentage || '0%'

  return (
    <AdminPageLayout
      title="لوحة تحكم Database Core"
      description="مراقبة وإدارة قاعدة البيانات بشكل شامل"
      icon={<Database size={28} />}
      actions={
        <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
          تحديث
        </Button>
      }
    >
      <div className="database-core-dashboard-page">
        {/* Quick Actions */}
        <BaseCard title="إجراءات سريعة" className="database-core-dashboard-page__quick-actions">
          <div className="database-core-dashboard-page__actions-grid">
            <ActionCard
              icon={<BarChart size={24} />}
              title="Performance Analyzer"
              description="تحليل وتحسين الأداء"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.PERFORMANCE)}
            />
            <ActionCard
              icon={<Activity size={24} />}
              title="Connections"
              description="الاتصالات النشطة"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.CONNECTIONS)}
            />
            <ActionCard
              icon={<TrendingUp size={24} />}
              title="Cache Management"
              description="إدارة التخزين المؤقت"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.CACHE)}
            />
            <ActionCard
              icon={<Table size={24} />}
              title="Database Explorer"
              description="استكشف الجداول والبيانات"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.EXPLORER)}
            />
            <ActionCard
              icon={<Code size={24} />}
              title="Query Builder"
              description="بناء استعلامات SQL بصرياً"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.QUERY_BUILDER)}
            />
            <ActionCard
              icon={<Shield size={24} />}
              title="Transactions"
              description="إدارة المعاملات"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.TRANSACTIONS)}
            />
            <ActionCard
              icon={<Activity size={24} />}
              title="Audit Logs"
              description="سجلات التدقيق"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.AUDIT_LOGS)}
            />
            <ActionCard
              icon={<Save size={24} />}
              title="Backup & Restore"
              description="إدارة النسخ الاحتياطي"
              onClick={() => navigate(ADMIN_ROUTES.DATABASE_CORE.BACKUPS)}
            />
          </div>
        </BaseCard>

        {/* Health Status */}
        <BaseCard title="حالة النظام" className="database-core-dashboard-page__health">
          <div className="database-core-dashboard-page__health-content">
            <HealthStatusBadge status={healthStatus} />
            <div className="database-core-dashboard-page__health-info">
              <p>
                <strong>وقت التشغيل:</strong> {uptime}
              </p>
              <p>
                <strong>استخدام الذاكرة:</strong> {formatPercentage(memoryUsage)}
              </p>
              <p>
                <strong>معدل نجاح التخزين المؤقت:</strong> {cacheHitRate}
              </p>
            </div>
          </div>
        </BaseCard>

        {/* Metrics Cards */}
        {metrics && (
          <div className="database-core-dashboard-page__metrics-grid">
            <MetricsCard
              title="استخدام الذاكرة"
              value={formatPercentage(memoryUsage / 100)}
              icon={<Activity size={20} />}
              variant={memoryUsage > 90 ? 'danger' : memoryUsage > 70 ? 'warning' : 'success'}
            />
            <MetricsCard
              title="الاتصالات النشطة"
              value={poolStats?.active || connections?.length || 0}
              trend="stable"
              icon={<Activity size={20} />}
              variant="default"
            />
            <MetricsCard
              title="معدل نجاح التخزين المؤقت"
              value={cacheHitRate}
              icon={<TrendingUp size={20} />}
              variant={
                parseFloat(cacheHitRate) > 80
                  ? 'success'
                  : parseFloat(cacheHitRate) > 60
                    ? 'warning'
                    : 'danger'
              }
            />
          </div>
        )}

        {/* Connections List */}
        {connections && connections.length > 0 && (
          <BaseCard title="الاتصالات النشطة" className="database-core-dashboard-page__connections">
            <div className="database-core-dashboard-page__connections-list">
              {connections.map(connection => (
                <div key={connection.id} className="database-core-dashboard-page__connection-item">
                  <div className="database-core-dashboard-page__connection-info">
                    <h4>{connection.name}</h4>
                    <p>{connection.provider}</p>
                  </div>
                  <HealthStatusBadge status={connection.status} />
                </div>
              ))}
            </div>
          </BaseCard>
        )}
      </div>
    </AdminPageLayout>
  )
}

// Action Card Component
interface ActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div
      className="database-core-dashboard-page__action-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
        }
      }}
    >
      <div className="database-core-dashboard-page__action-icon">{icon}</div>
      <div className="database-core-dashboard-page__action-content">
        <h3 className="database-core-dashboard-page__action-title">{title}</h3>
        <p className="database-core-dashboard-page__action-description">{description}</p>
      </div>
    </div>
  )
}

export default DatabaseCoreDashboardPage
