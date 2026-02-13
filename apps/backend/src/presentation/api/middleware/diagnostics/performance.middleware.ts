import { Response, NextFunction } from "express";
import { ServiceContainer } from "../../../../infrastructure/ioc/container.js";
import { enhancedLogger } from "../../../../shared/utils/EnhancedLogger.js";
import { ContextRequest } from "./context.middleware.js";
import { PerformanceOptimizer } from "../../../../infrastructure/performance/PerformanceOptimizer.js";

export interface EnhancedPerformanceRequest extends ContextRequest {
  requestSize?: number;
  performanceOptimizer?: PerformanceOptimizer;
}

/**
 * Initialize performance optimizer
 * Law 01: Iron Firewall - Use IoC Container
 */
function getPerformanceOptimizer(): PerformanceOptimizer {
  return ServiceContainer.performanceOptimizer;
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

  // Get performance optimizer via IoC
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
        userId: req.user?.id || req.userId, // Use strict typing from ContextRequest
        requestId: req.requestId,
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

    // Law 08: Fail-Safe - Connection Pool Monitoring handled inside Optimizer/Adapter
    // We don't need to manually poke the agents here anymore, metrics are exposed via optimizer.

    // Log warning for slow requests
    if (duration > 2000) {
      enhancedLogger.warn("Slow request detected", {
        duration,
        requestId: req.requestId,
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
  next();
}

/**
 * Get performance metrics endpoint data
 */
export function getPerformanceMetrics() {
  const optimizer = getPerformanceOptimizer();
  return optimizer.getPerformanceMetrics();
}
