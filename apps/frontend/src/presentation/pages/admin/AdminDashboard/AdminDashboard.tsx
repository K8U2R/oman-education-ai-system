import React from 'react'
import { Shield } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { useTranslation } from 'react-i18next'
import { AdminPageWrapper } from '@/presentation/features/system-administration-portal/components/AdminPageWrapper/AdminPageWrapper'
import { LoadingWrapper, Card } from '@/presentation/components/common'
import { PageHeader } from '@/presentation/components/common'
import styles from './AdminDashboard.module.scss'
import { useAdminDashboard } from './core/AdminDashboard.hooks'
import AdminStatsCards from './components/AdminStatsCards/AdminStatsCards'
import AdminQuickActions from './components/AdminQuickActions/AdminQuickActions'
import AdminSystemHealth from './components/AdminSystemHealth/AdminSystemHealth'

/**
 * AdminDashboard - لوحة التحكم الرئيسية
 *
 * Sovereign container component following Rule 13 (Functional Decomposition).
 * Logic is handled by useAdminDashboard hook (Rule 2).
 */
const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { canAccess, loading, stats, refresh } = useAdminDashboard()

  if (!canAccess) return null

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage={t('loading')}>
      <LoadingWrapper isLoading={loading} message={t('loading')}>
        <div className={styles['admin-dashboard-page']}>
          <PageHeader
            title={t('admin.dashboard.title')}
            description={t('admin.dashboard.description')}
            icon={<Shield />}
            actions={
              <button
                onClick={() => refresh()}
                className={styles['admin-dashboard-page__refresh-btn']}
              >
                {t('refresh')}
              </button>
            }
          />

          <AdminStatsCards stats={stats} />
          <AdminQuickActions />
          <AdminSystemHealth />
        </div>
      </LoadingWrapper>
    </AdminPageWrapper>
  )
}

export default AdminDashboardPage
