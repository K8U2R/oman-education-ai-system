/**
 * System Services - الخدمات النظامية
 */

export { cacheService } from './cache.service'
export type { CacheOptions, CacheEntry } from './cache.service'

export { offlineService } from './offline.service'
export type { OfflineRequest } from './offline.service'

export { backgroundSyncService } from './background-sync.service'
export type { SyncTask } from './background-sync.service'

export { ErrorBoundaryService } from './error-boundary.service'
export type { ErrorBoundaryInfo } from './error-boundary.service'

export * from './error-handling.service'

export { analyticsService } from './analytics.service'
export type { AnalyticsEvent, PageView } from './analytics.service'

export { performanceService } from './performance.service'
export type {
  PerformanceMetric as SystemPerformanceMetric,
  ResourceTiming,
} from './performance.service'
