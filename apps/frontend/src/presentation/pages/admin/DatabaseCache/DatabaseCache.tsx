import React from 'react'
import { Database } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services'
import { BaseCard, CacheChart } from '@/presentation/components/database-core'
import { AdminPageLayout } from '../../../core/components'
import { AdminLoadingState, AdminErrorState } from '../../../shared/components'
import { useCachePage } from '@/presentation/pages/admin/features/database-core/hooks'
import { CacheHeader } from './components/CacheHeader'
import { CacheMetrics } from './components/CacheMetrics'

const DatabaseCache: React.FC = () => {
  const { t } = useTranslation()
  const { canAccess, loading, error, stats, refresh, clearCache, cleanExpired } = useCachePage()
  const clearCacheConfirm = useConfirmDialog()

  const handleClearCache = () => {
    clearCacheConfirm.open({
      title: t('admin.database.cache.confirm.clear_title'),
      message: t('admin.database.cache.confirm.clear_message'),
      variant: 'danger',
      confirmText: t('admin.database.cache.confirm.confirm_btn'),
      cancelText: t('cancel'),
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
      // Note: Ideally use a toast service
      alert(t('admin.database.cache.notifications.cleaned', { count: cleanedCount }))
    } catch (error) {
      loggingService.error('Failed to clean expired cache', error as Error)
    }
  }

  if (loading) {
    return <AdminLoadingState message={t('admin.database.cache.loading')} fullScreen />
  }

  if (error) {
    return <AdminErrorState title={t('error')} message={error} onRetry={refresh} />
  }

  if (!canAccess) {
    return null
  }

  return (
    <AdminPageLayout
      title={t('admin.database.cache.title')}
      description={t('admin.database.cache.description')}
      icon={<Database size={28} />}
      actions={
        <CacheHeader
          onRefresh={refresh}
          onCleanExpired={handleCleanExpired}
          onClearAll={handleClearCache}
        />
      }
    >
      <div className="cache-page">
        <CacheMetrics stats={stats} loading={loading} />
        <BaseCard
          title={t('admin.database.cache.chart.title')}
          icon={<Database />}
          loading={loading}
          error={error}
        >
          <CacheChart stats={stats} height={300} />
        </BaseCard>
      </div>
    </AdminPageLayout>
  )
}

export default DatabaseCache
