import React from 'react'
import { Users, Activity, FileText, Server } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'
import styles from './AdminStatsCards.module.scss'
import type { DashboardStats } from '../../core/AdminDashboard.types'

interface AdminStatsCardsProps {
    stats: DashboardStats | null
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
    const { t } = useTranslation()

    return (
        <div className={styles['admin-stats-cards']}>
            <Card className={styles['admin-stats-cards__card']}>
                <div className={`${styles['admin-stats-cards__icon']} ${styles['admin-stats-cards__icon--users']}`}>
                    <Users className="w-8 h-8" />
                </div>
                <div className={styles['admin-stats-cards__content']}>
                    <h3 className={styles['admin-stats-cards__label']}>{t('admin.dashboard.stats.total_users')}</h3>
                    <p className={styles['admin-stats-cards__value']}>{stats?.totalUsers ?? 0}</p>
                </div>
            </Card>

            <Card className={styles['admin-stats-cards__card']}>
                <div className={`${styles['admin-stats-cards__icon']} ${styles['admin-stats-cards__icon--active']}`}>
                    <Activity className="w-8 h-8" />
                </div>
                <div className={styles['admin-stats-cards__content']}>
                    <h3 className={styles['admin-stats-cards__label']}>{t('admin.dashboard.stats.active_users')}</h3>
                    <p className={styles['admin-stats-cards__value']}>{stats?.activeUsers ?? 0}</p>
                </div>
            </Card>

            <Card className={styles['admin-stats-cards__card']}>
                <div className={`${styles['admin-stats-cards__icon']} ${styles['admin-stats-cards__icon--lessons']}`}>
                    <FileText className="w-8 h-8" />
                </div>
                <div className={styles['admin-stats-cards__content']}>
                    <h3 className={styles['admin-stats-cards__label']}>{t('admin.dashboard.stats.total_lessons')}</h3>
                    <p className={styles['admin-stats-cards__value']}>{stats?.totalLessons ?? 0}</p>
                </div>
            </Card>

            <Card className={styles['admin-stats-cards__card']}>
                <div className={`${styles['admin-stats-cards__icon']} ${styles['admin-stats-cards__icon--health']}`}>
                    <Server className="w-8 h-8" />
                </div>
                <div className={styles['admin-stats-cards__content']}>
                    <h3 className={styles['admin-stats-cards__label']}>{t('admin.dashboard.stats.system_health')}</h3>
                    <p className={styles['admin-stats-cards__value']}>
                        {stats?.systemHealth === 'healthy'
                            ? t('admin.dashboard.stats.healthy')
                            : stats?.systemHealth === 'warning'
                                ? t('admin.dashboard.stats.warning')
                                : t('admin.dashboard.stats.error')}
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default AdminStatsCards
