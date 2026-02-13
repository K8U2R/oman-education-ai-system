/**
 * System Services - الخدمات النظامية
 */

// Persistence
export { enhancedCacheService } from './persistence/enhanced-cache.service'
export type { EnhancedCacheOptions, EnhancedCacheEntry } from './persistence/enhanced-cache.service'

// Network
export { offlineService } from './network/offline.service'
export type { OfflineRequest } from './network/offline.service'

export { backgroundSyncService } from './network/background-sync.service'
export type { SyncTask } from './network/background-sync.service'

// Observability
export { ErrorBoundaryService } from './observability/error-boundary.service'
export type { ErrorBoundaryInfo } from './observability/error-boundary.service'

export * from './observability/error-handling.service'

export { analyticsService } from './observability/analytics.service'
export type { AnalyticsEvent, PageView } from './observability/analytics.service'

export { performanceService } from './observability/performance.service'
export type {
  PerformanceMetric as SystemPerformanceMetric,
  ResourceTiming,
} from './observability/performance.service'
