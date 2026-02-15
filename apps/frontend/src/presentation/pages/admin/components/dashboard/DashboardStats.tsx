import React from 'react'
import { Users, Activity, FileText, Server } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../components/common'
import type { DashboardStats as StatsType } from '@/application/types/admin.types'

interface DashboardStatsProps {
    stats: StatsType
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const { t } = useTranslation()

    return (
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
    )
}
