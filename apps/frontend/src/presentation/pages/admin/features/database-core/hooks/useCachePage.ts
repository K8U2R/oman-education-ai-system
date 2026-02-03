/**
 * useCachePage Hook - Hook لصفحة Cache
 */

import { useDatabaseCorePage } from './useDatabaseCorePage'
import { useCacheStats } from '@/application/features/database-core'
import { ADMIN_REFRESH_INTERVALS } from '../../../core/constants'

import type { CacheStats } from '@/application/features/database-core/types'

export interface ExtendedCacheStats extends CacheStats {
  missRatePercentage: string
  totalRequests: number
}

export interface UseCachePageReturn {
  canAccess: boolean
  loading: boolean
  error: string | null
  stats: ExtendedCacheStats | null
  refresh: () => Promise<void>
  clearCache: ReturnType<typeof useCacheStats>['clearCache']
  cleanExpired: ReturnType<typeof useCacheStats>['cleanExpired']
}

export function useCachePage(): UseCachePageReturn {
  const { canAccess, loading: authLoading } = useDatabaseCorePage('database-core.cache.manage')
  const {
    stats,
    loading: cacheLoading,
    error: cacheError,
    refresh,
    clearCache,
    cleanExpired,
  } = useCacheStats({
    interval: ADMIN_REFRESH_INTERVALS.DATABASE_CORE,
  })

  // Calculate extended stats
  const extendedStats: ExtendedCacheStats | null = stats
    ? {
        ...stats,
        totalRequests: stats.hitCount + stats.missCount,
        missRatePercentage:
          stats.hitCount + stats.missCount > 0
            ? ((stats.missCount / (stats.hitCount + stats.missCount)) * 100).toFixed(1) + '%'
            : '0%',
      }
    : null

  return {
    canAccess,
    loading: authLoading || cacheLoading,
    error: cacheError?.message || null,
    stats: extendedStats,
    refresh,
    clearCache,
    cleanExpired,
  }
}
