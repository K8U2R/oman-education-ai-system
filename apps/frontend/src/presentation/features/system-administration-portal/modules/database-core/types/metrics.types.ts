/**
 * Metrics Types - أنواع المقاييس
 */

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  responseTime: {
    p50: number
    p95: number
    p99: number
    average: number
  }
  errorRate: number
  throughput: number
  requestsPerSecond: number
  memoryUsage?: number
  cpuUsage?: number
}

/**
 * Memory Usage
 */
export interface MemoryUsage {
  rss: string
  heapTotal: string
  heapUsed: string
  external: string
  percentage: number
}

/**
 * Query Statistics
 */
export interface QueryStatistics {
  total: number
  successful: number
  failed: number
  averageDuration: number
  slowQueries: number
}

/**
 * Slow Query
 */
export interface SlowQuery {
  query: string
  duration: number
  count: number
  entity: string
  timestamp: string
}

/**
 * Entity Analysis
 */
export interface EntityAnalysis {
  entity: string
  totalQueries: number
  averageDuration: number
  slowQueries: SlowQuery[]
  recommendations: string[]
}

/**
 * Cache Statistics
 */
export interface CacheStats {
  size: number
  entries: number
  expired: number
  hitCount: number
  missCount: number
  hitRate: number
  hitRatePercentage: string
}

/**
 * Metrics Response
 */
export interface MetricsResponse {
  performance: PerformanceMetrics
  memory: MemoryUsage
  queries: QueryStatistics
  cache?: CacheStats
  uptime: string
}
