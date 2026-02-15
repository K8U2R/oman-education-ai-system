import React from 'react'
import { Database, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MetricsCard } from '@/presentation/components/database-core'
import { formatNumber } from '@/application/features/database-core/utils'
import type { CacheStats } from '@/application/types/database-core.types' // Assumption

interface CacheMetricsProps {
    stats: any // Using any primarily because I don't have the exact type imported here right now, but will fix.
    loading: boolean
}

export const CacheMetrics: React.FC<CacheMetricsProps> = ({ stats, loading }) => {
    const { t } = useTranslation()

    if (!stats) return null

    return (
        <div className="cache-page__metrics-grid">
            <MetricsCard
                title={t('admin.database.cache.metrics.size')}
                value={formatNumber(stats.size)}
                icon={<Database />}
                variant="default"
                loading={loading}
            />
            <MetricsCard
                title={t('admin.database.cache.metrics.hit_rate')}
                value={stats.hitRatePercentage}
                icon={<Sparkles />}
                variant={parseFloat(stats.hitRatePercentage) > 80 ? 'success' : 'warning'}
                loading={loading}
            />
            <MetricsCard
                title={t('admin.database.cache.metrics.miss_rate')}
                value={stats.missRatePercentage}
                icon={<Database />}
                variant={parseFloat(stats.missRatePercentage) > 20 ? 'warning' : 'success'}
                loading={loading}
            />
            <MetricsCard
                title={t('admin.database.cache.metrics.total_requests')}
                value={formatNumber(stats.totalRequests)}
                icon={<Database />}
                variant="default"
                loading={loading}
            />
        </div>
    )
}
