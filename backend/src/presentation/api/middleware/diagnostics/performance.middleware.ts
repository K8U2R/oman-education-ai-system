/**
 * Enhanced Performance Middleware - Middleware الأداء المحسّن
 *
 * يستخدم Performance Optimizer و Connection Pool Monitor
 */

import { Response, NextFunction } from "express";
import { PerformanceOptimizer } from "../../../../infrastructure/performance/PerformanceOptimizer.js";
import { connectionPoolMonitor } from "../../../../infrastructure/performance/ConnectionPoolMonitor.js";
import { enhancedLogger } from "../../../../shared/utils/EnhancedLogger.js";
import { DatabaseCoreAdapter } from "../../../../infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { ContextRequest } from "./context.middleware.js";

export interface EnhancedPerformanceRequest extends ContextRequest {
  requestSize?: number;
  performanceOptimizer?: PerformanceOptimizer;
}

// Global performance optimizer instance
let globalPerformanceOptimizer: PerformanceOptimizer | null = null;

/**
 * Initialize performance optimizer
 */
function getPerformanceOptimizer(): PerformanceOptimizer {
  if (!globalPerformanceOptimizer) {
    const adapter = new DatabaseCoreAdapter();
    globalPerformanceOptimizer = new PerformanceOptimizer(adapter);

    // Initialize connection pool monitor
    const httpAgent = (adapter as unknown as { httpAgent?: unknown })
      .httpAgent as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const httpsAgent = (adapter as unknown as { httpsAgent?: unknown })
      .httpsAgent as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (httpAgent || httpsAgent) {
      connectionPoolMonitor.initialize(httpAgent, httpsAgent);
    }
  }
  return globalPerformanceOptimizer;
}

/**
 * Enhanced performance tracking middleware
 */
export function enhancedPerformanceMiddleware(
  req: EnhancedPerformanceRequest,
  res: Response,
  next: NextFunction,
): void {
  // Record start time (if not already set by context middleware)
  if (!req.startTime) {
    req.startTime = Date.now();
  }

  // Calculate request size
  req.requestSize =
    JSON.stringify(req.body || {}).length +
    JSON.stringify(req.query || {}).length;

  // Get performance optimizer
  req.performanceOptimizer = getPerformanceOptimizer();

  // Track response
  const originalSend = res.send.bind(res);
  res.send = function (body: unknown) {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const responseSize =
      typeof body === "string"
        ? body.length
        : JSON.stringify(body || {}).length;

    // Log performance with Enhanced Logger
    enhancedLogger.performance(
      `${req.method} ${req.path}`,
      duration,
      res.statusCode < 400,
      {
        userId: (req as unknown as { user?: { id?: string } }).user?.id,
        requestId: (req as unknown as { requestId?: string }).requestId,
        operation: `${req.method} ${req.path}`,
        service: "API",
        metadata: {
          requestSize: req.requestSize,
          responseSize,
          statusCode: res.statusCode,
          cacheHit: res.getHeader("X-Cache") === "HIT",
        },
      },
    );

    // Record response time in connection pool monitor
    connectionPoolMonitor.recordResponseTime(duration);

    // Log warning for slow requests
    if (duration > 2000) {
      enhancedLogger.warn("Slow request detected", {
        duration,
        requestId: (req as unknown as { requestId?: string }).requestId,
        metadata: {
          path: req.path,
          method: req.method,
        },
      });
    }

    return originalSend(body);
  };

  next();
}

/**
 * Database query performance middleware
 */
export function databasePerformanceMiddleware(
  _req: EnhancedPerformanceRequest,
  _res: Response,
  next: NextFunction,
): void {
  // This middleware can be used to track database queries
  // It will be called before database operations
  next();
}

/**
 * Get performance metrics endpoint data
 */
export function getPerformanceMetrics() {
  const optimizer = getPerformanceOptimizer();
  const poolStats = connectionPoolMonitor.getStats();
  const metrics = optimizer.getPerformanceMetrics();

  return {
    ...metrics,
    connectionPool: poolStats,
    timestamp: Date.now(),
  };
}
