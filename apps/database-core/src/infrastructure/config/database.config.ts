/**
 * database.config.ts - إعدادات قاعدة البيانات
 *
 * إعدادات قاعدة البيانات والمتغيرات البيئية
 */

import {
  DatabaseConnectionConfig,
  DatabaseProvider,
  DatabaseType,
  RoutingStrategy,
} from '../../domain/types/database-connection.types'

export interface DatabaseConfig {
  // إعدادات قديمة (للتوافق مع الإصدارات السابقة)
  supabase?: {
    url: string
    serviceRoleKey: string
  }
  server: {
    port: number
    nodeEnv: string
  }
  logging: {
    level: string
  }
  // إعدادات جديدة (Multiple Databases)
  connections?: DatabaseConnectionConfig[]
  routing?: {
    strategy: RoutingStrategy
    primaryConnectionId: string
    fallbackConnectionIds?: string[]
    entityMapping?: Record<string, string>
  }
}

/**
 * الحصول على إعدادات قاعدة البيانات
 */
export function getDatabaseConfig(): DatabaseConfig {
  const port = parseInt(process.env.PORT || '3001', 10)
  const nodeEnv = process.env.NODE_ENV || 'development'
  const logLevel = process.env.LOG_LEVEL || 'info'

  // إعدادات Supabase (للتوافق مع الإصدارات السابقة - معطل افتراضياً)
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  // متغير بيئي لتفعيل Supabase (افتراضياً: معطل)
  const enableSupabase = process.env.ENABLE_SUPABASE === 'true'

  // إعدادات الاتصالات المتعددة
  const connections: DatabaseConnectionConfig[] = []

  // إضافة PostgreSQL connection أولاً (الأولوية للتنمية المحلية)
  const pgHost = process.env.POSTGRES_HOST
  const pgPort = process.env.POSTGRES_PORT
  const pgDatabase = process.env.POSTGRES_DATABASE || 'oman_education_db'
  const pgUsername = process.env.POSTGRES_USERNAME || 'postgres'
  const pgPassword = process.env.POSTGRES_PASSWORD || 'postgres'

  // PostgreSQL هو الاتصال الأساسي للتنمية المحلية
  connections.push({
    id: 'postgresql-internal',
    name: 'PostgreSQL Internal',
    provider: DatabaseProvider.POSTGRESQL,
    type: DatabaseType.INTERNAL,
    config: {
      host: pgHost || '',
      port: pgPort ? parseInt(pgPort, 10) : 5432,
      database: pgDatabase,
      username: pgUsername,
      password: pgPassword,
      poolSize: process.env.POSTGRES_POOL_SIZE ? parseInt(process.env.POSTGRES_POOL_SIZE, 10) : 20,
      timeout: process.env.POSTGRES_TIMEOUT ? parseInt(process.env.POSTGRES_TIMEOUT, 10) : 30000,
    },
    enabled: true,
    priority: 1, // أولوية أعلى من Supabase
    healthCheckInterval: 60000, // 1 minute
  })

  // إضافة Supabase connection فقط إذا كان مفعلاً صراحة
  if (enableSupabase && supabaseUrl && supabaseServiceKey) {
    connections.push({
      id: 'supabase-primary',
      name: 'Supabase Primary',
      provider: DatabaseProvider.SUPABASE,
      type: DatabaseType.EXTERNAL,
      config: {
        url: supabaseUrl,
        serviceRoleKey: supabaseServiceKey,
      },
      enabled: true,
      priority: 2, // أولوية أقل من PostgreSQL
      healthCheckInterval: 60000, // 1 minute
    })
  }

  // إعدادات التوجيه
  const routingStrategy = (process.env.DATABASE_ROUTING_STRATEGY || 'primary') as RoutingStrategy
  // PostgreSQL هو الاتصال الأساسي افتراضياً
  const primaryConnectionId = process.env.DATABASE_PRIMARY_CONNECTION_ID || 'postgresql-internal'
  const fallbackConnectionIds = process.env.DATABASE_FALLBACK_CONNECTION_IDS
    ? process.env.DATABASE_FALLBACK_CONNECTION_IDS.split(',').map(id => id.trim())
    : undefined

  return {
    // Supabase config (للتوافق مع الإصدارات السابقة - معطل افتراضياً)
    supabase:
      enableSupabase && supabaseUrl && supabaseServiceKey
        ? {
          url: supabaseUrl,
          serviceRoleKey: supabaseServiceKey,
        }
        : undefined,
    server: {
      port,
      nodeEnv,
    },
    logging: {
      level: logLevel,
    },
    connections: connections.length > 0 ? connections : undefined,
    routing: {
      strategy: routingStrategy,
      primaryConnectionId,
      fallbackConnectionIds,
    },
  }
}
