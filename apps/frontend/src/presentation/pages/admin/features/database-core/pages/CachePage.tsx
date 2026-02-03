/**
 * Cache Page - صفحة إدارة Cache
 *
 * صفحة لإدارة ومراقبة Cache
 * تم نقلها إلى الهيكل الجديد
 */

import React from 'react'
import { Database, RefreshCw, Trash2, Sparkles } from 'lucide-react'
import { useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services'
import { Button } from '@/presentation/components/common'
import { BaseCard, MetricsCard, CacheChart } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useCachePage } from '../hooks'
import { formatNumber } from '@/application/features/database-core/utils'


const CachePage: React.FC = () => {
  const { canAccess, loading, error, stats, refresh, clearCache, cleanExpired } = useCachePage()
  const clearCacheConfirm = useConfirmDialog()

  const handleClearCache = () => {
    clearCacheConfirm.open({
      title: 'تأكيد مسح Cache',
      message: 'هل أنت متأكد من مسح جميع Cache؟ لا يمكن التراجع عن هذا الإجراء.',
      variant: 'danger',
      confirmText: 'مسح الكل',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await clearCache()
          clearCacheConfirm.close()
        } catch (error) {
          loggingService.error('Failed to clear cache', error as Error)
        }
      },
    })
  }

  const handleCleanExpired = async () => {
    try {
      const cleanedCount = await cleanExpired()
      // TODO: Replace with toast notification
      alert(`تم تنظيف ${cleanedCount} عنصر منتهي الصلاحية`)
    } catch (error) {
      loggingService.error('Failed to clean expired cache', error as Error)
    }
  }

  if (loading) {
    return <AdminLoadingState message="جاري تحميل بيانات Cache..." fullScreen />
  }

  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title="إدارة Cache"
      description="مراقبة وإدارة Cache"
      icon={<Database size={28} />}
      actions={
        <div className="cache-page__header-actions">
          <Button variant="outline" size="sm" onClick={refresh} leftIcon={<RefreshCw size={16} />}>
            تحديث
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanExpired}
            leftIcon={<Sparkles size={16} />}
          >
            تنظيف منتهي الصلاحية
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearCache}
            leftIcon={<Trash2 size={16} />}
          >
            مسح الكل
          </Button>
        </div>
      }
    >
      <div className="cache-page">
        {/* Cache Statistics */}
        {stats && (
          <div className="cache-page__metrics-grid">
            <MetricsCard
              title="Cache Size"
              value={formatNumber(stats.size)}
              icon={<Database />}
              variant="default"
              loading={loading}
            />
            <MetricsCard
              title="Hit Rate"
              value={stats.hitRatePercentage}
              icon={<Sparkles />}
              variant={parseFloat(stats.hitRatePercentage) > 80 ? 'success' : 'warning'}
              loading={loading}
            />
            <MetricsCard
              title="Miss Rate"
              value={stats.missRatePercentage}
              icon={<Database />}
              variant={parseFloat(stats.missRatePercentage) > 20 ? 'warning' : 'success'}
              loading={loading}
            />
            <MetricsCard
              title="Total Requests"
              value={formatNumber(stats.totalRequests)}
              icon={<Database />}
              variant="default"
              loading={loading}
            />
          </div>
        )}

        {/* Cache Chart */}
        <BaseCard title="Cache Statistics" icon={<Database />} loading={loading} error={error}>
          <CacheChart stats={stats} height={300} />
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default CachePage
