/**
 * Performance Monitoring Routes - مسارات مراقبة الأداء
 *
 * API endpoints لمراقبة الأداء والـ metrics
 */

import { Router, Request, Response } from "express";
import { getPerformanceMetrics } from "../../middleware/diagnostics/performance.middleware.js";
import { connectionPoolMonitor } from "@/infrastructure/performance/ConnectionPoolMonitor";
import { PerformanceOptimizer } from "@/infrastructure/performance/PerformanceOptimizer";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { queryOptimizerService } from "@/infrastructure/database/query-optimizer.service";
import { enhancedLogger } from "@/shared/utils/EnhancedLogger";
import {
  authMiddleware,
  requireDeveloper,
} from "../../middleware/security/index.js";

const router = Router();

// Initialize services (Consider moving to DI if possible)
const adapter = new DatabaseCoreAdapter();
const optimizer = new PerformanceOptimizer(adapter);

// Apply authentication and role check to all routes
router.use(authMiddleware.authenticate);
router.use(requireDeveloper);

/**
 * GET /api/v1/monitoring/performance
 * Get comprehensive performance metrics
 */
router.get("/performance", (_req: Request, res: Response) => {
  try {
    const metrics = getPerformanceMetrics();
    const queryStats = queryOptimizerService.getQueryStatistics();
    const cacheStats = queryOptimizerService.getCacheStatistics();
    const poolStats = connectionPoolMonitor.getStats();

    res.json({
      success: true,
      data: {
        ...metrics,
        queries: queryStats,
        cache: cacheStats,
        connectionPool: poolStats,
      },
    });
  } catch (error) {
    enhancedLogger.error("Failed to get performance metrics", error, {
      operation: "getPerformanceMetrics",
      service: "PerformanceMonitoring",
    });
    res.status(500).json({
      success: false,
      error: {
        message: "فشل جلب مقاييس الأداء",
        code: "PERFORMANCE_METRICS_ERROR",
      },
    });
  }
});

/**
 * GET /api/v1/monitoring/queries
 * Get query statistics
 */
router.get("/queries", (_req: Request, res: Response) => {
  try {
    const stats = queryOptimizerService.getQueryStatistics();
    const slowQueries = queryOptimizerService.getSlowQueries(1000);

    res.json({
      success: true,
      data: {
        ...stats,
        slowQueries: slowQueries.slice(0, 10), // Top 10 slow queries
      },
    });
  } catch (error) {
    enhancedLogger.error("Failed to get query statistics", error, {
      operation: "getQueryStatistics",
      service: "PerformanceMonitoring",
    });
    res.status(500).json({
      success: false,
      error: {
        message: "فشل جلب إحصائيات الاستعلامات",
        code: "QUERY_STATS_ERROR",
      },
    });
  }
});

/**
 * GET /api/v1/monitoring/cache
 * Get cache statistics
 */
router.get("/cache", (_req: Request, res: Response) => {
  try {
    const stats = queryOptimizerService.getCacheStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    enhancedLogger.error("Failed to get cache statistics", error, {
      operation: "getCacheStatistics",
      service: "PerformanceMonitoring",
    });
    res.status(500).json({
      success: false,
      error: {
        message: "فشل جلب إحصائيات Cache",
        code: "CACHE_STATS_ERROR",
      },
    });
  }
});

/**
 * GET /api/v1/monitoring/connection-pool
 * Get connection pool statistics
 */
router.get("/connection-pool", (_req: Request, res: Response) => {
  try {
    const stats = connectionPoolMonitor.getStats();
    const health = connectionPoolMonitor.healthCheck();
    const recommendations = connectionPoolMonitor.getRecommendations();

    res.json({
      success: true,
      data: {
        ...stats,
        health: {
          status: health.status,
          message: health.message,
        },
        recommendations,
      },
    });
  } catch (error) {
    enhancedLogger.error("Failed to get connection pool statistics", error, {
      operation: "getConnectionPoolStats",
      service: "PerformanceMonitoring",
    });
    res.status(500).json({
      success: false,
      error: {
        message: "فشل جلب إحصائيات Connection Pool",
        code: "POOL_STATS_ERROR",
      },
    });
  }
});

/**
 * POST /api/v1/monitoring/cache/warmup
 * Warm up cache for specified entities
 */
router.post("/cache/warmup", async (req: Request, res: Response) => {
  try {
    const { entities } = req.body;

    if (!Array.isArray(entities) || entities.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "يجب تحديد قائمة الكيانات",
          code: "INVALID_REQUEST",
        },
      });
    }

    await optimizer.warmCache(entities);

    return res.json({
      success: true,
      message: "تم تسخين Cache بنجاح",
      data: {
        entities,
      },
    });
  } catch (error) {
    enhancedLogger.error("Failed to warm cache", error, {
      operation: "warmCache",
      service: "PerformanceMonitoring",
    });
    return res.status(500).json({
      success: false,
      error: {
        message: "فشل تسخين Cache",
        code: "CACHE_WARMUP_ERROR",
      },
    });
  }
});

/**
 * GET /api/v1/monitoring/optimization/recommendations
 * Get optimization recommendations
 */
router.get("/optimization/recommendations", (req: Request, res: Response) => {
  try {
    const { entity, conditions, options } = req.query;

    if (!entity || typeof entity !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          message: "يجب تحديد الكيان",
          code: "INVALID_REQUEST",
        },
      });
    }

    const parsedConditions = conditions ? JSON.parse(conditions as string) : {};
    const parsedOptions = options ? JSON.parse(options as string) : {};

    const recommendations = optimizer.optimizeQuery(
      entity,
      parsedConditions,
      parsedOptions,
    );

    return res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    enhancedLogger.error("Failed to get optimization recommendations", error, {
      operation: "getOptimizationRecommendations",
      service: "PerformanceMonitoring",
    });
    return res.status(500).json({
      success: false,
      error: {
        message: "فشل جلب توصيات التحسين",
        code: "OPTIMIZATION_RECOMMENDATIONS_ERROR",
      },
    });
  }
});

export default router;
