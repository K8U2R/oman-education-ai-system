import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, BarChart3, Activity, Server, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRole } from '@/features/user-authentication-management'
import { adminService } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { handleError } from '@/utils/errorHandler'
import { AdminPageWrapper } from '../../components/admin'
import { LoadingWrapper, Card } from '../../components/common'
import { PageHeader } from '../components'
import type { DashboardStats } from '@/application/types/admin.types'

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAdmin } = useRole()
  const [stats, setStats] = useState<DashboardStats>({
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
          message: 'Failed to load admin stats', // Internal error mainly
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

          {/* Statistics Cards */}
          <div className="admin-dashboard-page__stats">
            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--users">
                <Users className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">{t('admin.dashboard.stats.total_users')}</h3>
                <p className="admin-dashboard-page__stat-value">{stats.totalUsers}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--active">
                <Activity className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">{t('admin.dashboard.stats.active_users')}</h3>
                <p className="admin-dashboard-page__stat-value">{stats.activeUsers}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--lessons">
                <FileText className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">{t('admin.dashboard.stats.total_lessons')}</h3>
                <p className="admin-dashboard-page__stat-value">{stats.totalLessons}</p>
              </div>
            </Card>

            <Card className="admin-dashboard-page__stat-card">
              <div className="admin-dashboard-page__stat-icon admin-dashboard-page__stat-icon--health">
                <Server className="w-8 h-8" />
              </div>
              <div className="admin-dashboard-page__stat-content">
                <h3 className="admin-dashboard-page__stat-label">{t('admin.dashboard.stats.system_health')}</h3>
                <p className="admin-dashboard-page__stat-value">
                  {stats.systemHealth === 'healthy'
                    ? t('admin.dashboard.stats.healthy')
                    : stats.systemHealth === 'warning'
                      ? t('admin.dashboard.stats.warning')
                      : t('admin.dashboard.stats.error')}
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">{t('admin.dashboard.actions.title')}</h2>
            <div className="admin-dashboard-page__quick-actions">
              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => navigate(ROUTES.ADMIN_USERS)}
                hoverable
              >
                <Users className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.manage_users')}</h3>
                <p className="admin-dashboard-page__action-description">
                  {t('admin.dashboard.actions.manage_users_desc')}
                </p>
              </Card>

              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => navigate('/content/lessons')}
                hoverable
              >
                <FileText className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.manage_content')}</h3>
                <p className="admin-dashboard-page__action-description">
                  {t('admin.dashboard.actions.manage_content_desc')}
                </p>
              </Card>

              {/* Analytics Placeholder */}
              <Card
                className="admin-dashboard-page__action-card"
                onClick={() => {
                  // Analytics
                }}
                hoverable
              >
                <BarChart3 className="admin-dashboard-page__action-icon" />
                <h3 className="admin-dashboard-page__action-title">{t('admin.dashboard.actions.analytics')}</h3>
                <p className="admin-dashboard-page__action-description">
                  {t('admin.dashboard.actions.analytics_desc')}
                </p>
              </Card>
            </div>
          </div>

          {/* System Health Detailed */}
          <div className="admin-dashboard-page__section">
            <h2 className="admin-dashboard-page__section-title">{t('admin.dashboard.health.title')}</h2>
            <Card className="admin-dashboard-page__health-card">
              <div className="admin-dashboard-page__health-status">
                <div className="admin-dashboard-page__health-indicator admin-dashboard-page__health-indicator--healthy"></div>
                <span className="admin-dashboard-page__health-text">{t('admin.dashboard.health.status_ok')}</span>
              </div>
              <div className="admin-dashboard-page__health-details">
                <div className="admin-dashboard-page__health-item">
                  <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.db')}:</span>
                  <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                    {t('admin.dashboard.health.connected')}
                  </span>
                </div>
                <div className="admin-dashboard-page__health-item">
                  <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.server')}:</span>
                  <span className="admin-dashboard-page__health-value admin-dashboard-page__health-value--healthy">
                    {t('admin.dashboard.health.active')}
                  </span>
                </div>
                <div className="admin-dashboard-page__health-item">
                  <span className="admin-dashboard-page__health-label">{t('admin.dashboard.health.memory')}:</span>
                  <span className="admin-dashboard-page__health-value">75%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </LoadingWrapper>
    </AdminPageWrapper>
  )
}
export default AdminDashboardPage
