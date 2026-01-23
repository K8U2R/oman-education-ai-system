import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PolicyEngine } from './infrastructure/policies/PolicyEngine'
import { loadDefaultPolicies } from './infrastructure/policies/DefaultPolicies'
import { AuditLogger } from './infrastructure/audit/AuditLogger'
import { DatabaseCoreService } from './application/services/DatabaseCoreService'
import { createDatabaseRoutes } from './presentation/api/routes/database.routes'
import { createMetricsRoutes } from './presentation/api/routes/metrics.routes'
import { createCacheStatsRoutes } from './presentation/api/routes/cache-stats.routes'
import { createTransactionMonitoringRoutes } from './presentation/api/routes/transaction-monitoring.routes'
import {
  errorMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from './presentation/api/middleware'
// Note: performanceMiddleware تم استبداله بـ enhancedPerformanceMiddleware
// import { performanceMiddleware } from './presentation/api/middleware/performance.middleware'
import { createRateLimitMiddleware } from './presentation/api/middleware/rate-limit.middleware'
import { QueryOptimizerService } from './application/services/QueryOptimizerService'
import { PerformanceMonitorService } from './application/services/PerformanceMonitorService'
import { PolicyService } from './application/services/PolicyService'
import { CacheManager } from './infrastructure/cache/CacheManager'
import { AuthenticationClient } from './infrastructure/clients'
import { TransactionManager } from './infrastructure/transactions'
import { getDatabaseConfig } from './infrastructure/config/database.config'
import { DatabaseConnectionManager, DatabaseRouter } from './infrastructure/adapters'
import {
  RoutingStrategy,
  DatabaseProvider,
  DatabaseType,
} from './domain/types/database-connection.types'

// تحميل المتغيرات البيئية
dotenv.config()

const app = express()

// Middleware
app.use(cors())
// Ensure UTF-8 encoding for JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Set UTF-8 charset for all responses
app.use((_req, res, next) => {
  res.charset = 'utf-8'
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

// Security Middleware (يجب أن يكون قبل أي middleware آخر)
app.use(securityMiddleware)

// Initialize services
const dbConfig = getDatabaseConfig()
// Note: AuditLogger سيتم تهيئته بعد الحصول على primaryAdapter

// Initialize Authentication Client (اختياري)
const authClient = new AuthenticationClient({
  baseUrl: process.env.AUTH_SERVICE_URL,
  apiKey: process.env.AUTH_SERVICE_API_KEY,
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
})

// Initialize Policy Engine
const policyEngine = new PolicyEngine()

// Initialize Policy Service مع Integration مع Authentication Client
const policyService = new PolicyService(policyEngine, authClient, {
  defaultAllow: process.env.POLICY_DEFAULT_ALLOW !== 'false', // افتراضياً: السماح
  strictMode: process.env.POLICY_STRICT_MODE === 'true', // افتراضياً: غير صارم
  cacheEnabled: true,
})

// ربط Policy Service بـ Policy Engine
policyEngine.setPolicyService(policyService)

// Initialize Database Connection Manager
const connectionManager = new DatabaseConnectionManager()

// إضافة الاتصالات من Config
if (dbConfig.connections && dbConfig.connections.length > 0) {
  for (const connectionConfig of dbConfig.connections) {
    if (connectionConfig.enabled) {
      try {
        await connectionManager.addConnection(connectionConfig)
        console.log(`✅ Connected to ${connectionConfig.name} (${connectionConfig.provider})`)
      } catch (error) {
        console.error(
          `❌ Failed to connect to ${connectionConfig.name}:`,
          error instanceof Error ? error.message : String(error)
        )
      }
    }
  }
} else {
  // Fallback للتوافق مع الإصدارات السابقة
  if (dbConfig.supabase) {
    const supabaseConfig = {
      id: 'supabase-primary',
      name: 'Supabase Primary',
      provider: DatabaseProvider.SUPABASE,
      type: DatabaseType.EXTERNAL,
      config: {
        url: dbConfig.supabase.url,
        serviceRoleKey: dbConfig.supabase.serviceRoleKey,
      },
      enabled: true,
      priority: 1,
      healthCheckInterval: 60000,
    }
    try {
      await connectionManager.addConnection(supabaseConfig)
      console.log('✅ Connected to Supabase (legacy mode)')
    } catch (error) {
      console.error('❌ Failed to connect to Supabase:', error)
    }
  }
}

// Initialize Database Router
const routingConfig = dbConfig.routing || {
  strategy: RoutingStrategy.PRIMARY,
  primaryConnectionId: 'postgresql-internal', // PostgreSQL هو الافتراضي الآن
}
const databaseRouter = new DatabaseRouter(connectionManager, routingConfig)

// Get primary adapter for routes (للتوافق)
const primaryAdapter = databaseRouter.getPrimaryAdapter()

// Initialize Audit Logger مع Database Adapter (لحفظ Audit Logs في قاعدة البيانات)
const auditLogger = new AuditLogger(primaryAdapter)

// Initialize Transaction Manager (للاستخدام المستقبلي مع DatabaseServiceWithTransactions)
// Note: يمكن استخدام DatabaseServiceWithTransactions للعمليات التي تحتاج معاملات
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transactionManager = new TransactionManager(primaryAdapter)

// Initialize Database Core Service with Router and Transactions
const databaseService = new DatabaseCoreService(databaseRouter, policyEngine, auditLogger)

// Note: يمكن استخدام DatabaseServiceWithTransactions للعمليات التي تحتاج معاملات
// const databaseServiceWithTransactions = new DatabaseServiceWithTransactions(
//   databaseRouter,
//   policyEngine,
//   auditLogger,
//   transactionManager
// )

// Initialize advanced services
const queryOptimizer = new QueryOptimizerService()
const performanceMonitor = new PerformanceMonitorService()
const cacheManager = new CacheManager({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
})

// Initialize DatabaseRepository (للاستخدام في Cache Stats)
import { DatabaseRepository } from './infrastructure/repositories/DatabaseRepository'
const databaseRepository = new DatabaseRepository(primaryAdapter, cacheManager)

// Logging Middleware
app.use(loggingMiddleware)

// Initialize Prometheus Metrics (before routes)
import { PrometheusMetrics } from './infrastructure/monitoring/PrometheusMetrics'
const prometheusMetrics = new PrometheusMetrics({
  prefix: 'db_core_',
  collectDefaultMetrics: true,
})

// Enhanced Performance Middleware (combines Performance Monitor + Prometheus)
import { enhancedPerformanceMiddleware } from './presentation/api/middleware/enhanced-performance.middleware'
app.use(enhancedPerformanceMiddleware(performanceMonitor, prometheusMetrics))

// Rate Limiting Middleware
app.use(
  createRateLimitMiddleware({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'تم تجاوز الحد الأقصى للطلبات',
  })
)

// تحميل السياسات الافتراضية
loadDefaultPolicies(policyEngine)

// Initialize DatabaseServiceWithTransactions (للاستخدام في Transaction Routes)
import { DatabaseServiceWithTransactions } from './application/services/DatabaseServiceWithTransactions'
const databaseServiceWithTransactions = new DatabaseServiceWithTransactions(
  databaseRouter,
  policyEngine,
  auditLogger,
  transactionManager
)

// Routes
app.use('/api/database', createDatabaseRoutes(databaseService, primaryAdapter))
app.use('/api/metrics', createMetricsRoutes(queryOptimizer, performanceMonitor, cacheManager))
app.use('/api/cache', createCacheStatsRoutes(cacheManager, databaseRepository))

// Transaction Routes (Monitoring + Operations)
import { createTransactionRoutes } from './presentation/api/routes/transactions.routes'
import { createPoolStatsRoutes } from './presentation/api/routes/pool-stats.routes'
import { createPrometheusRoutes } from './presentation/api/routes/prometheus.routes'
import { createAuditAnalyticsRoutes } from './presentation/api/routes/audit-analytics.routes'

const transactionMonitoringRouter = createTransactionMonitoringRoutes(transactionManager)
const transactionOperationsRouter = createTransactionRoutes(databaseServiceWithTransactions)

// دمج Routes (Monitoring أولاً، ثم Operations)
app.use('/api/transactions', transactionMonitoringRouter)
app.use('/api/transactions', transactionOperationsRouter)

// Pool Statistics Routes
app.use('/api/pool', createPoolStatsRoutes(primaryAdapter))

// Prometheus Metrics Routes
app.use('/api', createPrometheusRoutes(prometheusMetrics))

// Audit Analytics Routes
app.use('/api/audit', createAuditAnalyticsRoutes(primaryAdapter))

// Advanced Query Optimizer Routes
import { createQueryOptimizerRoutes } from './presentation/api/routes/query-optimizer.routes'
app.use('/api/query-optimizer', createQueryOptimizerRoutes(primaryAdapter))

// Backup & Recovery Routes
import { createBackupRoutes } from './presentation/api/routes/backup.routes'
app.use('/api/backup', createBackupRoutes(primaryAdapter))

// Migration Routes
import { createMigrationRoutes } from './presentation/api/routes/migration.routes'
app.use('/api/migration', createMigrationRoutes(primaryAdapter))

// Performance Benchmark Routes
import { createBenchmarkRoutes } from './presentation/api/routes/benchmark.routes'
app.use('/api/benchmark', createBenchmarkRoutes(primaryAdapter))

// Favicon handler (لتجنب 404 errors)
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end() // No Content
})

// Health check
app.get('/health', (_req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json({
    status: 'ok',
    service: 'database-core',
    timestamp: new Date().toISOString(),
  })
})

// Root
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json({
    service: 'Database Core Service',
    version: '1.0.0',
    status: 'running',
    features: {
      queryOptimization: true,
      advancedQueryOptimization: true,
      performanceMonitoring: true,
      performanceBenchmarking: true,
      rateLimiting: true,
      caching: true,
      auditLogging: true,
      backupAndRecovery: true,
      dataMigration: true,
      prometheusMetrics: true,
      auditAnalytics: true,
    },
  })
})

// Error handling
app.use(errorMiddleware)

// Start server
const PORT = dbConfig.server.port
app.listen(PORT, () => {
  console.log(`🚀 Database Core Service running on port ${PORT}`)
  console.log(`📊 Environment: ${dbConfig.server.nodeEnv}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/health`)
  console.log(`📈 Metrics: http://localhost:${PORT}/api/metrics/health`)
})
