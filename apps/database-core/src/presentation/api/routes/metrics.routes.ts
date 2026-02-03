/**
 * Metrics Routes - مسارات المقاييس
 *
 * مسارات API للحصول على مقاييس الأداء والإحصائيات
 */

import { Router, Request, Response } from 'express'
import { QueryOptimizerService } from '../../../application/services/QueryOptimizerService'
import { PerformanceMonitorService } from '../../../application/services/PerformanceMonitorService'
import { CacheManager } from '../../../infrastructure/cache/CacheManager'

export function createMetricsRoutes(
  queryOptimizer: QueryOptimizerService,
  performanceMonitor: PerformanceMonitorService,
  cacheManager?: CacheManager
): Router {
  const router = Router()

  /**
   * GET /api/metrics/performance
   * الحصول على إحصائيات الأداء
   */
  router.get('/performance', (_req: Request, res: Response) => {
    const stats = performanceMonitor.getStats()
    const memoryUsage = performanceMonitor.getMemoryUsage()
    const uptime = performanceMonitor.getUptime()

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({
      success: true,
      data: {
        performance: stats,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        uptime: {
          seconds: uptime,
          formatted: formatUptime(uptime),
        },
      },
    })
  })

  /**
   * GET /api/metrics/queries
   * الحصول على إحصائيات الاستعلامات
   */
  router.get('/queries', (_req: Request, res: Response) => {
    const stats = queryOptimizer.getStatistics()
    const slowQueries = queryOptimizer.getSlowQueries(10)

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({
      success: true,
      data: {
        statistics: stats,
        slowQueries,
      },
    })
  })

  /**
   * GET /api/metrics/queries/:entity
   * تحليل الاستعلامات لـ entity معين
   */
  router.get('/queries/:entity', (req: Request, res: Response) => {
    const { entity } = req.params
    const analysis = queryOptimizer.analyzeEntity(entity)

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({
      success: true,
      data: analysis,
    })
  })

  /**
   * GET /api/metrics/cache
   * الحصول على إحصائيات Cache
   */
  router.get('/cache', (_req: Request, res: Response) => {
    if (!cacheManager) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(404).json({
        success: false,
        error: 'Cache manager not available',
      })
      return
    }

    const stats = cacheManager.getStats()

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({
      success: true,
      data: stats,
    })
  })

  /**
   * GET /api/metrics/health
   * الحصول على صحة النظام الشاملة
   */
  router.get('/health', (_req: Request, res: Response) => {
    const perfStats = performanceMonitor.getStats()
    const queryStats = queryOptimizer.getStatistics()
    const memoryUsage = performanceMonitor.getMemoryUsage()
    const uptime = performanceMonitor.getUptime()
    const cacheStats = cacheManager?.getStats()

    // تحديد حالة النظام
    const isHealthy =
      perfStats.errorRate < 0.1 && // أقل من 10% أخطاء
      perfStats.p95 < 2000 && // p95 أقل من 2 ثانية
      memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 // استخدام الذاكرة أقل من 90%

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json({
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'degraded',
        performance: perfStats,
        queries: queryStats,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        },
        uptime: formatUptime(uptime),
        cache: cacheStats,
      },
    })
  })

  return router
}

/**
 * تنسيق وقت التشغيل
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (days > 0) {
    return `${days} يوم ${hours} ساعة ${minutes} دقيقة`
  }
  if (hours > 0) {
    return `${hours} ساعة ${minutes} دقيقة ${secs} ثانية`
  }
  if (minutes > 0) {
    return `${minutes} دقيقة ${secs} ثانية`
  }
  return `${secs} ثانية`
}
