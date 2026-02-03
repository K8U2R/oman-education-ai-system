/**
 * Developer Types - أنواع المطور
 *
 * TypeScript types لوحة تحكم المطور
 */

/**
 * إحصائيات المطور
 */
export interface DeveloperStats {
  total_commits: number
  active_branches: number
  test_coverage: number
  build_status: 'success' | 'failed' | 'pending'
  last_build_time?: string
  api_endpoints_count: number
  services_count: number
  error_rate: number
}

/**
 * معلومات API Endpoint
 */
export interface APIEndpointInfo {
  method: string
  path: string
  description?: string
  request_count: number
  average_response_time: number
  error_count: number
  last_called?: string
}

/**
 * معلومات Service
 */
export interface ServiceInfo {
  name: string
  status: 'healthy' | 'unhealthy' | 'unknown'
  uptime: number
  memory_usage: number
  cpu_usage?: number
  last_check: string
}

/**
 * Log Entry للمطور
 */
export interface DeveloperLog {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  service?: string
  endpoint?: string
  metadata?: Record<string, unknown>
}

/**
 * Performance Metric
 */
export interface PerformanceMetric {
  endpoint: string
  average_response_time: number
  p95_response_time: number
  p99_response_time: number
  request_count: number
  error_rate: number
}
