import React, { useState, useEffect } from 'react'
import { Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRole } from '@/features/user-authentication-management'
import { adminService } from '@/application'
import { handleError } from '@/utils/errorHandler'
import { AdminPageWrapper } from '../../components/admin'
import { LoadingWrapper } from '../../components/common'
import { PageHeader } from '../components'
import { DashboardStats } from './components/dashboard/DashboardStats'
import { DashboardActions } from './components/dashboard/DashboardActions'
import { SystemHealth } from './components/dashboard/SystemHealth'
import type { DashboardStats as StatsType } from '@/application/types/admin.types'

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { isAdmin } = useRole()
  const [stats, setStats] = useState<StatsType>({
    totalUsers: 0,
    activeUsers: 0,
    totalLessons: 0,
    systemHealth: 'healthy',
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (!isAdmin) return

      try {
        setLoadingStats(true)
        const [systemStats, contentStats] = await Promise.all([
          adminService.getSystemStats(),
          adminService.getContentStats(),
        ])

        setStats({
          totalUsers: systemStats.total_users,
          activeUsers: systemStats.active_users,
          totalLessons: contentStats.total_lessons,
          systemHealth: systemStats.system_health,
        })
      } catch (error) {
        handleError(error, {
          message: 'Failed to load admin stats',
          context: 'AdminDashboardPage',
        })
      } finally {
        setLoadingStats(false)
      }
    }

    fetchAdminStats()
  }, [isAdmin])

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage={t('loading')}>
      <LoadingWrapper isLoading={loadingStats} message={t('loading')}>
        <div className="admin-dashboard-page">
          <PageHeader
            title={t('admin.dashboard.title')}
            description={t('admin.dashboard.description')}
            icon={<Shield />}
          />
          <DashboardStats stats={stats} />
          <DashboardActions />
          <SystemHealth />
        </div>
      </LoadingWrapper>
    </AdminPageWrapper>
  )
}
export default AdminDashboardPage
