/**
 * Database Connection Types - أنواع اتصالات قاعدة البيانات
 *
 * جميع الأنواع المستخدمة في إدارة الاتصالات مع قواعد البيانات
 */

/**
 * Database Provider Type - نوع مزود قاعدة البيانات
 */
export enum DatabaseProvider {
  SUPABASE = 'supabase',
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MONGODB = 'mongodb',
  SQLITE = 'sqlite',
}

/**
 * Database Type - نوع قاعدة البيانات (خارجية أو داخلية)
 */
export enum DatabaseType {
  EXTERNAL = 'external', // قواعد بيانات خارجية (مثل Supabase)
  INTERNAL = 'internal', // قواعد بيانات داخلية (مثل PostgreSQL محلي)
}

/**
 * Database Connection Status - حالة الاتصال
 */
export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  ERROR = 'error',
}

/**
 * Database Connection Configuration - إعدادات الاتصال
 */
export interface DatabaseConnectionConfig {
  id: string // معرف فريد للاتصال
  name: string // اسم الاتصال
  provider: DatabaseProvider // نوع المزود
  type: DatabaseType // نوع قاعدة البيانات (خارجية/داخلية)
  config: {
    // إعدادات عامة
    url?: string
    host?: string
    port?: number
    database?: string
    username?: string
    password?: string
    // إعدادات Supabase
    serviceRoleKey?: string
    // إعدادات Connection Pool
    poolSize?: number
    timeout?: number
    maxRetries?: number
    retryDelay?: number
  }
  // إعدادات إضافية
  enabled?: boolean // هل الاتصال مفعّل؟
  priority?: number // الأولوية (للـ fallback)
  healthCheckInterval?: number // فترة فحص الصحة (بالميلي ثانية)
}

/**
 * Database Connection Info - معلومات الاتصال
 */
export interface DatabaseConnectionInfo {
  id: string
  name: string
  provider: DatabaseProvider
  type: DatabaseType
  status: ConnectionStatus
  lastHealthCheck?: Date
  error?: string
  latency?: number // زمن الاستجابة بالميلي ثانية
  stats?: {
    totalQueries: number
    successfulQueries: number
    failedQueries: number
    averageLatency: number
  }
}

/**
 * Database Health Check Result - نتيجة فحص الصحة
 */
export interface DatabaseHealthCheckResult {
  connectionId: string
  status: ConnectionStatus
  latency: number
  timestamp: Date
  error?: string
}

/**
 * Database Routing Strategy - استراتيجية التوجيه
 */
export enum RoutingStrategy {
  PRIMARY = 'primary', // استخدام الاتصال الأساسي فقط
  FALLBACK = 'fallback', // استخدام fallback عند فشل الأساسي
  LOAD_BALANCE = 'load_balance', // توزيع الأحمال
  ROUND_ROBIN = 'round_robin', // توزيع دوري
}

/**
 * Database Routing Config - إعدادات التوجيه
 */
export interface DatabaseRoutingConfig {
  strategy: RoutingStrategy
  primaryConnectionId: string
  fallbackConnectionIds?: string[]
  entityMapping?: Record<string, string> // توجيه entities محددة لقواعد بيانات محددة
}
