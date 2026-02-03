/**
 * Connections Types - أنواع الاتصالات
 */

/**
 * Connection
 */
export interface Connection {
  id: string
  name: string
  provider: 'supabase' | 'postgresql' | 'mysql' | 'mongodb' | 'sqlite'
  type: 'internal' | 'external'
  status: 'healthy' | 'degraded' | 'error' | 'disconnected'
  config: {
    url?: string
    host?: string
    port?: number
    database?: string
    [key: string]: unknown
  }
  enabled: boolean
  priority: number
  lastHealthCheck?: string
  averageResponseTime?: number
}

/**
 * Pool Statistics
 */
export interface PoolStats {
  total: number
  active: number
  idle: number
  waiting: number
  max: number
  min: number
  utilization: number
}

/**
 * Pool Health Status
 */
export interface PoolHealthStatus {
  healthy: boolean
  lastHealthCheck: string
  consecutiveFailures: number
  averageResponseTime: number
  errorRate: number
}

/**
 * Connection Stats Response
 */
export interface ConnectionStatsResponse {
  connections: Connection[]
  poolStats: PoolStats
  healthStatus: PoolHealthStatus
}
