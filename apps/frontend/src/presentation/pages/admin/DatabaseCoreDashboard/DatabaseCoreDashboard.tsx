import React, { lazy, Suspense } from 'react'
import { Database, Activity, Server, HardDrive, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageWrapper } from '@/presentation/features/system-administration-portal/components/AdminPageWrapper/AdminPageWrapper'
import { PageHeader, Card, LoadingWrapper } from '@/presentation/components/common'
import { useDatabaseCoreDashboard } from './core/DatabaseCoreDashboard.hooks'
import styles from './DatabaseCoreDashboard.module.scss'

// Lazy load widgets
const DatabaseHealthWidget = lazy(() => import('./components/DatabaseHealthWidget/DatabaseHealthWidget'))
const PerformanceMetricsWidget = lazy(() => import('./components/PerformanceMetricsWidget/PerformanceMetricsWidget'))
const SlowQueriesWidget = lazy(() => import('./components/SlowQueriesWidget/SlowQueriesWidget'))
const StorageUsageWidget = lazy(() => import('./components/StorageUsageWidget/StorageUsageWidget'))
const ConnectionPoolWidget = lazy(() => import('./components/ConnectionPoolWidget/ConnectionPoolWidget'))
const DatabaseQuickActions = lazy(() => import('./components/DatabaseQuickActions/DatabaseQuickActions'))

/**
 * DatabaseCoreDashboard - لوحة تحكم قاعدة البيانات
 *
 * Sovereign container component following Rule 13 (Functional Decomposition).
 * < 100 lines.
 */
const DatabaseCoreDashboard: React.FC = () => {
  const { t: translate } = useTranslation()
  const { stats, loading, refresh } = useDatabaseCoreDashboard()

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage={translate('loading')}>
      <div className={styles['database-dashboard']}>
        <PageHeader
          title="لوحة تحكم قاعدة البيانات"
          description="مراقبة وإدارة أداء قاعدة البيانات والنظام"
          icon={<Database />}
          actions={
            <button onClick={refresh} className={styles['refresh-btn']}>
              t('refresh')
            </button>
          }
        />

        <DatabaseQuickActions />

        <LoadingWrapper isLoading={loading}>
          <div className={styles['dashboard-grid']}>
            <Suspense fallback={<Card>Loading Health...</Card>}>
              <DatabaseHealthWidget stats={stats?.health} />
            </Suspense>
            <Suspense fallback={<Card>Loading Performance...</Card>}>
              <PerformanceMetricsWidget stats={stats?.performance} />
            </Suspense>
            <Suspense fallback={<Card>Loading Storage...</Card>}>
              <StorageUsageWidget stats={stats?.storage} />
            </Suspense>
            <Suspense fallback={<Card>Loading Connections...</Card>}>
              <ConnectionPoolWidget stats={stats?.connections} />
            </Suspense>
          </div>

          <div className={styles['dashboard-row']}>
            <Suspense fallback={<Card>Loading Slow Queries...</Card>}>
              <SlowQueriesWidget queries={stats?.slowQueries} />
            </Suspense>
          </div>
        </LoadingWrapper>
      </div>
    </AdminPageWrapper>
  )
}

export default DatabaseCoreDashboard
