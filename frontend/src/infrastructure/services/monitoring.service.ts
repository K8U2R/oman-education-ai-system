/**
 * Monitoring Service - خدمة المراقبة
 *
 * خدمة للوصول إلى Error Tracking و Performance Monitoring APIs
 */

import { apiClient } from '../api/api-client'

export interface ErrorEntry {
  id: string
  message: string
  stack?: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category:
    | 'validation'
    | 'database'
    | 'network'
    | 'authentication'
    | 'authorization'
    | 'business'
    | 'system'
    | 'unknown'
  context?: Record<string, unknown>
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  ipAddress?: string
  url?: string
  method?: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
  resolvedBy?: string
  occurrences: number
  firstOccurrence: number
  lastOccurrence: number
}

export interface ErrorStats {
  total: number
  byCategory: Record<string, number>
  bySeverity: Record<string, number>
  recent: ErrorEntry[]
  critical: ErrorEntry[]
  unresolved: number
  trend: {
    last24h: number
    last7d: number
    last30d: number
  }
}

export interface ErrorFilter {
  category?: string
  severity?: string
  resolved?: boolean
  startDate?: number
  endDate?: number
  userId?: string
  limit?: number
  offset?: number
}

export interface PerformanceMetric {
  id: string
  endpoint: string
  method: string
  duration: number
  statusCode: number
  timestamp: number
  userId?: string
  ipAddress?: string
  userAgent?: string
  requestSize?: number
  responseSize?: number
  cacheHit?: boolean
}

export interface PerformanceStats {
  totalRequests: number
  averageResponseTime: number
  p50: number
  p95: number
  p99: number
  slowEndpoints: Array<{
    endpoint: string
    method: string
    averageDuration: number
    count: number
  }>
  byStatusCode: Record<number, number>
  byEndpoint: Record<string, number>
  trend: {
    last1h: number
    last24h: number
    last7d: number
  }
  cacheHitRate: number
}

export interface PerformanceFilter {
  endpoint?: string
  method?: string
  statusCode?: number
  startDate?: number
  endDate?: number
  userId?: string
  minDuration?: number
  limit?: number
  offset?: number
}

class MonitoringService {
  /**
   * Get error statistics
   */
  async getErrorStats(): Promise<ErrorStats> {
    const response = await apiClient.get<{ success: boolean; data: ErrorStats }>(
      '/api/v1/monitoring/errors/stats'
    )
    return response.data
  }

  /**
   * Get errors with filters
   */
  async getErrors(filter?: ErrorFilter): Promise<{ errors: ErrorEntry[]; total: number }> {
    const params = new URLSearchParams()

    if (filter?.category) params.append('category', filter.category)
    if (filter?.severity) params.append('severity', filter.severity)
    if (filter?.resolved !== undefined) params.append('resolved', String(filter.resolved))
    if (filter?.startDate) params.append('startDate', String(filter.startDate))
    if (filter?.endDate) params.append('endDate', String(filter.endDate))
    if (filter?.userId) params.append('userId', filter.userId)
    if (filter?.limit) params.append('limit', String(filter.limit))
    if (filter?.offset) params.append('offset', String(filter.offset))

    const response = await apiClient.get<{
      success: boolean
      data: { errors: ErrorEntry[]; total: number }
    }>(`/api/v1/monitoring/errors?${params.toString()}`)

    return response.data
  }

  /**
   * Get error by ID
   */
  async getError(errorId: string): Promise<ErrorEntry> {
    const response = await apiClient.get<{ success: boolean; data: ErrorEntry }>(
      `/api/v1/monitoring/errors/${errorId}`
    )
    return response.data
  }

  /**
   * Resolve error
   */
  async resolveError(errorId: string): Promise<void> {
    await apiClient.post(`/api/v1/monitoring/errors/${errorId}/resolve`)
  }

  /**
   * Get performance statistics
   */
  async getPerformanceStats(): Promise<PerformanceStats> {
    const response = await apiClient.get<{ success: boolean; data: PerformanceStats }>(
      '/api/v1/monitoring/performance/stats'
    )
    return response.data
  }

  /**
   * Get performance metrics with filters
   */
  async getPerformanceMetrics(filter?: PerformanceFilter): Promise<{
    metrics: PerformanceMetric[]
    total: number
  }> {
    const params = new URLSearchParams()

    if (filter?.endpoint) params.append('endpoint', filter.endpoint)
    if (filter?.method) params.append('method', filter.method)
    if (filter?.statusCode) params.append('statusCode', String(filter.statusCode))
    if (filter?.startDate) params.append('startDate', String(filter.startDate))
    if (filter?.endDate) params.append('endDate', String(filter.endDate))
    if (filter?.userId) params.append('userId', filter.userId)
    if (filter?.minDuration) params.append('minDuration', String(filter.minDuration))
    if (filter?.limit) params.append('limit', String(filter.limit))
    if (filter?.offset) params.append('offset', String(filter.offset))

    const response = await apiClient.get<{
      success: boolean
      data: { metrics: PerformanceMetric[]; total: number }
    }>(`/api/v1/monitoring/performance?${params.toString()}`)

    return response.data
  }

  /**
   * Get endpoint performance
   */
  async getEndpointPerformance(
    endpoint: string,
    method?: string
  ): Promise<{
    endpoint: string
    method: string
    averageDuration: number
    count: number
    p50: number
    p95: number
    p99: number
    errors: number
  }> {
    const params = new URLSearchParams()
    if (method) params.append('method', method)

    const response = await apiClient.get<{
      success: boolean
      data: {
        endpoint: string
        method: string
        averageDuration: number
        count: number
        p50: number
        p95: number
        p99: number
        errors: number
      }
    }>(
      `/api/v1/monitoring/performance/endpoint/${encodeURIComponent(endpoint)}?${params.toString()}`
    )

    return response.data
  }
}

export const monitoringService = new MonitoringService()
