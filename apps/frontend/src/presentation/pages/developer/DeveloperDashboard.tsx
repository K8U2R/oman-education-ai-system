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
import { Activity, TrendingUp, Users, Zap, Database, Clock } from 'lucide-react'

export const DeveloperDashboard: React.FC = () => {
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
            <div className="developer-dashboard__loading">
                <div className="animate-pulse">
                    <Activity />
                    <p>Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="developer-dashboard__error">
                <p>{error || 'No stats available'}</p>
            </div>
        )
    }

    return (
        <div className="developer-dashboard">
            {/* Header */}
            <div className="developer-dashboard__header">
                <h1>Recommendation Engine Dashboard</h1>
                <p>Real-time monitoring of AI recommendation system performance</p>
            </div>

            {/* Engine Status Badge */}
            <div className="developer-dashboard__status">
                <StatusBadge status={stats.engine_status} />
            </div>

            {/* Stats Grid */}
            <div className="developer-dashboard__stats-grid">
                <StatsCard
                    title="Total Recommendations"
                    value={stats.total_recommendations_generated.toLocaleString()}
                    icon={<Database />}
                    trend={`+${stats.recommendations_today} today`}
                />
                <StatsCard
                    title="Average Accuracy"
                    value={`${(stats.average_accuracy * 100).toFixed(1)}%`}
                    icon={<TrendingUp />}
                    trend="Model performance"
                />
                <StatsCard
                    title="User Satisfaction"
                    value={`${(stats.user_satisfaction_rate * 100).toFixed(1)}%`}
                    icon={<Users />}
                    trend="Feedback score"
                />
                <StatsCard
                    title="Cache Hit Rate"
                    value={`${(stats.cache_hit_rate * 100).toFixed(1)}%`}
                    icon={<Zap />}
                    trend="Performance optimization"
                />
            </div>

            {/* Charts Section */}
            <div className="developer-dashboard__charts-grid">
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
    const getStatusClass = () => {
        switch (status) {
            case 'active':
                return 'status-badge--active'
            case 'training':
                return 'status-badge--training'
            case 'offline':
                return 'status-badge--offline'
            case 'error':
                return 'status-badge--error'
            default:
                return 'status-badge--offline'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'active':
                return '✅ Active'
            case 'training':
                return '🔄 Training'
            case 'offline':
                return '⏸️ Offline'
            case 'error':
                return '❌ Error'
            default:
                return status
        }
    }

    return <div className={`status-badge ${getStatusClass()}`}>{getStatusText()}</div>
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
        <div className="stats-card">
            <div className="stats-card__header">
                <div className="stats-card__header-title">{title}</div>
                <div className="stats-card__header-icon">{icon}</div>
            </div>

            <div className="stats-card__value">{value}</div>

            <div className="stats-card__trend">{trend}</div>
        </div>
    )
}

/**
 * Recommendations by Type Chart
 */
const RecommendationsByTypeChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0)

    return (
        <div className="recommendations-chart">
            <h3 className="recommendations-chart__title">Recommendations by Type</h3>

            <div className="recommendations-chart__items">
                {Object.entries(data).map(([type, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0

                    return (
                        <div key={type}>
                            <div className="recommendations-chart__item-header">
                                <span className="recommendations-chart__item-header-label">{type}</span>
                                <span className="recommendations-chart__item-header-value">
                                    {count.toLocaleString()} ({percentage.toFixed(1)}%)
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="recommendations-chart__progress">
                                <div
                                    className={`recommendations-chart__progress-bar recommendations-chart__progress-bar--${type}`}
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
    return (
        <div className="model-info-panel">
            <h3 className="model-info-panel__title">Model Information</h3>

            <div className="model-info-panel__items">
                <div className="model-info-panel__row">
                    <div className="model-info-panel__row-label-group">
                        <span>Active Models</span>
                    </div>
                    <span className="model-info-panel__row-value">{stats.active_models_count.toString()}</span>
                </div>

                <div className="model-info-panel__row">
                    <div className="model-info-panel__row-label-group">
                        <span>Training Data Size</span>
                    </div>
                    <span className="model-info-panel__row-value">{stats.training_data_size.toLocaleString()}</span>
                </div>

                <div className="model-info-panel__row">
                    <div className="model-info-panel__row-label-group">
                        <span>Avg Inference Time</span>
                    </div>
                    <span className="model-info-panel__row-value">{stats.inference_avg_time_ms}ms</span>
                </div>

                {stats.last_training_date && (
                    <div className="model-info-panel__row">
                        <div className="model-info-panel__row-label-group">
                            <Clock />
                            <span>Last Training</span>
                        </div>
                        <span className="model-info-panel__row-value">
                            {new Date(stats.last_training_date).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                )}

                {stats.next_training_date && (
                    <div className="model-info-panel__row">
                        <div className="model-info-panel__row-label-group">
                            <Clock />
                            <span>Next Training</span>
                        </div>
                        <span className="model-info-panel__row-value">
                            {new Date(stats.next_training_date).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeveloperDashboard
