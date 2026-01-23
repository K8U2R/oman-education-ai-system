/**
 * Performance Tracking Service - خدمة تتبع الأداء
 *
 * خدمة شاملة لتتبع وتحليل أداء التطبيق
 * تدعم:
 * - API response time tracking
 * - Request/Response metrics
 * - Performance trends
 * - Slow endpoint detection
 */

import { logger } from "@/shared/utils/logger.js";

export interface PerformanceMetric {
  id: string;
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestSize?: number;
  responseSize?: number;
  cacheHit?: boolean;
}

export interface PerformanceStats {
  totalRequests: number;
  averageResponseTime: number;
  p50: number; // Median
  p95: number; // 95th percentile
  p99: number; // 99th percentile
  slowEndpoints: Array<{
    endpoint: string;
    method: string;
    averageDuration: number;
    count: number;
  }>;
  byStatusCode: Record<number, number>;
  byEndpoint: Record<string, number>;
  trend: {
    last1h: number;
    last24h: number;
    last7d: number;
  };
  cacheHitRate: number;
}

export interface PerformanceFilter {
  endpoint?: string;
  method?: string;
  statusCode?: number;
  startDate?: number;
  endDate?: number;
  userId?: string;
  minDuration?: number;
  limit?: number;
  offset?: number;
}

export class PerformanceTrackingService {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private maxMetrics = 10000;
  private slowEndpointThreshold = 1000; // 1 second

  /**
   * Record performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, "id" | "timestamp">): string {
    const id = this.generateMetricId(metric);
    const now = Date.now();

    const fullMetric: PerformanceMetric = {
      ...metric,
      id,
      timestamp: now,
    };

    this.metrics.set(id, fullMetric);

    // Cleanup if too many metrics
    if (this.metrics.size > this.maxMetrics) {
      this.cleanupOldMetrics();
    }

    // Log slow endpoints
    if (metric.duration > this.slowEndpointThreshold) {
      logger.warn("Slow endpoint detected", {
        endpoint: metric.endpoint,
        method: metric.method,
        duration: metric.duration,
        statusCode: metric.statusCode,
      });
    }

    return id;
  }

  /**
   * Generate unique metric ID
   */
  private generateMetricId(
    metric: Omit<PerformanceMetric, "id" | "timestamp">,
  ): string {
    const key = `${metric.method}:${metric.endpoint}:${Date.now()}:${Math.random()}`;
    return Buffer.from(key).toString("base64").substring(0, 32);
  }

  /**
   * Get metrics with filters
   */
  getMetrics(filter?: PerformanceFilter): PerformanceMetric[] {
    let results = Array.from(this.metrics.values());

    // Apply filters
    if (filter?.endpoint) {
      results = results.filter((m) => m.endpoint.includes(filter.endpoint!));
    }

    if (filter?.method) {
      results = results.filter((m) => m.method === filter.method);
    }

    if (filter?.statusCode) {
      results = results.filter((m) => m.statusCode === filter.statusCode);
    }

    if (filter?.startDate) {
      results = results.filter((m) => m.timestamp >= filter.startDate!);
    }

    if (filter?.endDate) {
      results = results.filter((m) => m.timestamp <= filter.endDate!);
    }

    if (filter?.userId) {
      results = results.filter((m) => m.userId === filter.userId);
    }

    if (filter?.minDuration) {
      results = results.filter((m) => m.duration >= filter.minDuration!);
    }

    // Sort by timestamp (most recent first)
    results.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 100;

    return results.slice(offset, offset + limit);
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    const metrics = Array.from(this.metrics.values());
    const now = Date.now();
    const last1h = now - 60 * 60 * 1000;
    const last24h = now - 24 * 60 * 60 * 1000;
    const last7d = now - 7 * 24 * 60 * 60 * 1000;

    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        slowEndpoints: [],
        byStatusCode: {},
        byEndpoint: {},
        trend: {
          last1h: 0,
          last24h: 0,
          last7d: 0,
        },
        cacheHitRate: 0,
      };
    }

    // Calculate percentiles
    const durations = metrics.map((m) => m.duration).sort((a, b) => a - b);
    const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
    const p99 = durations[Math.floor(durations.length * 0.99)] || 0;

    const averageResponseTime =
      durations.reduce((sum, d) => sum + d, 0) / durations.length;

    // Group by endpoint and method
    const endpointMap = new Map<string, { duration: number; count: number }>();
    metrics.forEach((m) => {
      const key = `${m.method} ${m.endpoint}`;
      const existing = endpointMap.get(key) || { duration: 0, count: 0 };
      endpointMap.set(key, {
        duration: existing.duration + m.duration,
        count: existing.count + 1,
      });
    });

    const slowEndpoints = Array.from(endpointMap.entries())
      .map(([key, data]) => {
        const [method, endpoint] = key.split(" ", 2);
        return {
          endpoint,
          method,
          averageDuration: data.duration / data.count,
          count: data.count,
        };
      })
      .filter((e) => e.averageDuration > this.slowEndpointThreshold)
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 10);

    // Group by status code
    const byStatusCode: Record<number, number> = {};
    metrics.forEach((m) => {
      byStatusCode[m.statusCode] = (byStatusCode[m.statusCode] || 0) + 1;
    });

    // Group by endpoint
    const byEndpoint: Record<string, number> = {};
    metrics.forEach((m) => {
      byEndpoint[m.endpoint] = (byEndpoint[m.endpoint] || 0) + 1;
    });

    // Calculate cache hit rate
    const cacheHits = metrics.filter((m) => m.cacheHit).length;
    const cacheHitRate =
      metrics.length > 0 ? (cacheHits / metrics.length) * 100 : 0;

    return {
      totalRequests: metrics.length,
      averageResponseTime,
      p50,
      p95,
      p99,
      slowEndpoints,
      byStatusCode,
      byEndpoint,
      trend: {
        last1h: metrics.filter((m) => m.timestamp >= last1h).length,
        last24h: metrics.filter((m) => m.timestamp >= last24h).length,
        last7d: metrics.filter((m) => m.timestamp >= last7d).length,
      },
      cacheHitRate,
    };
  }

  /**
   * Get endpoint performance
   */
  getEndpointPerformance(
    endpoint: string,
    method?: string,
  ): {
    averageDuration: number;
    count: number;
    p50: number;
    p95: number;
    p99: number;
    errors: number;
  } {
    let endpointMetrics = Array.from(this.metrics.values()).filter(
      (m) => m.endpoint === endpoint,
    );

    if (method) {
      endpointMetrics = endpointMetrics.filter((m) => m.method === method);
    }

    if (endpointMetrics.length === 0) {
      return {
        averageDuration: 0,
        count: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        errors: 0,
      };
    }

    const durations = endpointMetrics
      .map((m) => m.duration)
      .sort((a, b) => a - b);
    const averageDuration =
      durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const p50 = durations[Math.floor(durations.length * 0.5)] || 0;
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
    const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
    const errors = endpointMetrics.filter((m) => m.statusCode >= 400).length;

    return {
      averageDuration,
      count: endpointMetrics.length,
      p50,
      p95,
      p99,
      errors,
    };
  }

  /**
   * Cleanup old metrics
   */
  private cleanupOldMetrics(): void {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let cleaned = 0;

    for (const [id, metric] of this.metrics) {
      if (metric.timestamp < sevenDaysAgo) {
        this.metrics.delete(id);
        cleaned++;
      }
    }

    // If still too many, remove oldest metrics
    if (this.metrics.size > this.maxMetrics) {
      const sorted = Array.from(this.metrics.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp,
      );

      for (
        let i = 0;
        i < sorted.length && this.metrics.size > this.maxMetrics;
        i++
      ) {
        this.metrics.delete(sorted[i][0]);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info("Cleaned up old performance metrics", { count: cleaned });
    }
  }

  /**
   * Clear all metrics (for testing)
   */
  clearAll(): void {
    this.metrics.clear();
    logger.info("All performance metrics cleared");
  }
}

export const performanceTrackingService = new PerformanceTrackingService();
