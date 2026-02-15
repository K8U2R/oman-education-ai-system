/**
 * DeveloperDashboard Component - لوحة تحكم المطور
 *
 * ✅ SCSS-based styling (no inline styles)
 * ✅ Liquid variables system compliant
 * ✅ CSS custom properties for theming
 * ✅ Styles loaded via main.scss
 */

import React, { useEffect, useState } from 'react'
import { recommendationService } from '@/application/features/recommendations'
import type { RecommendationEngineStats } from '@/domain/types/developer.types'
import { useTranslation } from 'react-i18next'
import { Activity, TrendingUp, Users, Zap, Database, Clock } from 'lucide-react'
import styles from './DeveloperDashboard.module.scss'

export const DeveloperDashboard: React.FC = () => {
    const { t } = useTranslation()
    const [stats, setStats] = useState<RecommendationEngineStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const engineStats = await recommendationService.getEngineStats()
                setStats(engineStats)
            } catch (err) {
                console.error('[DeveloperDashboard] Failed to fetch stats:', err)
                setError('Failed to load recommendation engine stats')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()

        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <div className={styles['developer-dashboard__loading']}>
                <div className="animate-pulse">
                    <Activity />
                    <p>{t('admin.developer.dashboard.loading')}</p>
                </div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className={styles['developer-dashboard__error']}>
                <p>{error || t('admin.developer.dashboard.no_stats')}</p>
            </div>
        )
    }

    return (
        <div className={styles['developer-dashboard']}>
            {/* Header */}
            {/* Header */}
            <div className={styles['developer-dashboard__header']}>
                <h1>{t('admin.developer.dashboard.title')}</h1>
                <p>{t('admin.developer.dashboard.description')}</p>
            </div>

            {/* Engine Status Badge */}
            {/* Engine Status Badge */}
            <div className={styles['developer-dashboard__status']}>
                <StatusBadge status={stats.engine_status} />
            </div>

            {/* Stats Grid */}
            {/* Stats Grid */}
            <div className={styles['developer-dashboard__stats-grid']}>
                <StatsCard
                    title={t('admin.developer.dashboard.stats.total_recommendations')}
                    value={stats.total_recommendations_generated.toLocaleString()}
                    icon={<Database />}
                    trend={`+${stats.recommendations_today} ${t('admin.developer.dashboard.stats.today')}`}
                />
                <StatsCard
                    title={t('admin.developer.dashboard.stats.avg_accuracy')}
                    value={`${(stats.average_accuracy * 100).toFixed(1)}%`}
                    icon={<TrendingUp />}
                    trend={t('admin.developer.dashboard.stats.performance')}
                />
                <StatsCard
                    title={t('admin.developer.dashboard.stats.user_satisfaction')}
                    value={`${(stats.user_satisfaction_rate * 100).toFixed(1)}%`}
                    icon={<Users />}
                    trend={t('admin.developer.dashboard.stats.feedback_score')}
                />
                <StatsCard
                    title={t('admin.developer.dashboard.stats.cache_hit_rate')}
                    value={`${(stats.cache_hit_rate * 100).toFixed(1)}%`}
                    icon={<Zap />}
                    trend={t('admin.developer.dashboard.stats.optimization')}
                />
            </div>

            {/* Charts Section */}
            {/* Charts Section */}
            <div className={styles['developer-dashboard__charts-grid']}>
                <RecommendationsByTypeChart data={stats.recommendations_by_type} />
                <ModelInfoPanel stats={stats} />
            </div>
        </div>
    )
}

/**
 * Engine Status Badge
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const { t } = useTranslation()
    const getStatusClass = () => {
        switch (status) {
            case 'active':
                return styles['status-badge--active']
            case 'training':
                return styles['status-badge--training']
            case 'offline':
                return styles['status-badge--offline']
            case 'error':
                return styles['status-badge--error']
            default:
                return styles['status-badge--offline']
        }
    }



    const getStatusText = () => {
        switch (status) {
            case 'active':
                return `✅ ${t('admin.developer.dashboard.status.active')}`
            case 'training':
                return `🔄 ${t('admin.developer.dashboard.status.training')}`
            case 'offline':
                return `⏸️ ${t('admin.developer.dashboard.status.offline')}`
            case 'error':
                return `❌ ${t('admin.developer.dashboard.status.error')}`
            default:
                return status
        }
    }

    return <div className={`${styles['status-badge']} ${getStatusClass()}`}>{getStatusText()}</div>
}

/**
 * Stats Card Component
 */
interface StatsCardProps {
    title: string
    value: string
    icon: React.ReactNode
    trend: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend }) => {
    return (
        <div className={styles['stats-card']}>
            <div className={styles['stats-card__header']}>
                <div className={styles['stats-card__header-title']}>{title}</div>
                <div className={styles['stats-card__header-icon']}>{icon}</div>
            </div>

            <div className={styles['stats-card__value']}>{value}</div>

            <div className={styles['stats-card__trend']}>{trend}</div>
        </div>
    )
}

/**
 * Recommendations by Type Chart
 */
const RecommendationsByTypeChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    const { t } = useTranslation()
    const total = Object.values(data).reduce((sum, val) => sum + val, 0)

    return (
        <div className={styles['recommendations-chart']}>
            <h3 className={styles['recommendations-chart__title']}>{t('admin.developer.dashboard.charts.recommendations_by_type')}</h3>

            <div className={styles['recommendations-chart__items']}>
                {Object.entries(data).map(([type, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0

                    return (
                        <div key={type}>
                            <div className={styles['recommendations-chart__item-header']}>
                                <span className={styles['recommendations-chart__item-header-label']}>{type}</span>
                                <span className={styles['recommendations-chart__item-header-value']}>
                                    {count.toLocaleString()} ({percentage.toFixed(1)}%)
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className={styles['recommendations-chart__progress']}>
                                <div
                                    className={`${styles['recommendations-chart__progress-bar']} ${styles[`recommendations-chart__progress-bar--${type}`]}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * Model Info Panel
 */
const ModelInfoPanel: React.FC<{ stats: RecommendationEngineStats }> = ({ stats }) => {
    const { t } = useTranslation()
    return (
        <div className={styles['model-info-panel']}>
            <h3 className={styles['model-info-panel__title']}>{t('admin.developer.dashboard.charts.model_info.title')}</h3>

            <div className={styles['model-info-panel__items']}>
                <div className={styles['model-info-panel__row']}>
                    <div className={styles['model-info-panel__row-label-group']}>
                        <span>{t('admin.developer.dashboard.charts.model_info.active_models')}</span>
                    </div>
                    <span className={styles['model-info-panel__row-value']}>{stats.active_models_count.toString()}</span>
                </div>

                <div className={styles['model-info-panel__row']}>
                    <div className={styles['model-info-panel__row-label-group']}>
                        <span>{t('admin.developer.dashboard.charts.model_info.training_data')}</span>
                    </div>
                    <span className={styles['model-info-panel__row-value']}>{stats.training_data_size.toLocaleString()}</span>
                </div>

                <div className={styles['model-info-panel__row']}>
                    <div className={styles['model-info-panel__row-label-group']}>
                        <span>{t('admin.developer.dashboard.charts.model_info.inference_time')}</span>
                    </div>
                    <span className={styles['model-info-panel__row-value']}>{stats.inference_avg_time_ms}ms</span>
                </div>

                {stats.last_training_date && (
                    <div className={styles['model-info-panel__row']}>
                        <div className={styles['model-info-panel__row-label-group']}>
                            <Clock />
                            <span>{t('admin.developer.dashboard.charts.model_info.last_training')}</span>
                        </div>
                        <span className={styles['model-info-panel__row-value']}>
                            {new Date(stats.last_training_date).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                )}

                {stats.next_training_date && (
                    <div className={styles['model-info-panel__row']}>
                        <div className={styles['model-info-panel__row-label-group']}>
                            <Clock />
                            <span>{t('admin.developer.dashboard.charts.model_info.next_training')}</span>
                        </div>
                        <span className={styles['model-info-panel__row-value']}>
                            {new Date(stats.next_training_date).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeveloperDashboard
