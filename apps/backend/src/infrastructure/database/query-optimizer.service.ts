/**
 * Query Optimizer Service - خدمة تحسين الاستعلامات
 *
 * خدمة لتحسين استعلامات قاعدة البيانات
 * تدعم:
 * - Query caching
 * - Query analysis
 * - Index recommendations
 * - Slow query detection
 */

import { logger } from "../../shared/utils/logger.js";

export interface QueryMetrics {
  query: string;
  duration: number;
  timestamp: number;
  table?: string;
  operation?: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  rowsAffected?: number;
}

export interface QueryCacheEntry {
  key: string;
  result: unknown;
  timestamp: number;
  ttl: number;
}

export interface IndexRecommendation {
  table: string;
  columns: string[];
  reason: string;
  priority: "high" | "medium" | "low";
}

class QueryOptimizerService {
  private queryMetrics: QueryMetrics[] = [];
  private queryCache: Map<string, QueryCacheEntry> = new Map();
  private slowQueryThreshold = 1000; // 1 second
  private maxMetrics = 1000;
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  // Cache hit tracking
  private cacheHits = 0;
  private cacheMisses = 0;

  /**
   * Record query metrics
   */
  recordQuery(metrics: QueryMetrics): void {
    this.queryMetrics.push(metrics);

    // Keep only last N metrics
    if (this.queryMetrics.length > this.maxMetrics) {
      this.queryMetrics.shift();
    }

    // Log slow queries
    if (metrics.duration > this.slowQueryThreshold) {
      logger.warn("Slow query detected", {
        query: metrics.query,
        duration: metrics.duration,
        table: metrics.table,
        operation: metrics.operation,
      });
    }
  }

  /**
   * Get query from cache
   */
  getCachedQuery<T = unknown>(key: string): T | null {
    const entry = this.queryCache.get(key);

    if (!entry) {
      this.cacheMisses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.queryCache.delete(key);
      this.cacheMisses++;
      return null;
    }

    this.cacheHits++;
    return entry.result as T;
  }

  /**
   * Cache query result
   */
  cacheQuery(key: string, result: unknown, ttl?: number): void {
    this.queryCache.set(key, {
      key,
      result,
      timestamp: Date.now(),
      ttl: ttl || this.cacheTTL,
    });
  }

  /**
   * Generate cache key from query parameters
   */
  generateCacheKey(
    table: string,
    where: Record<string, unknown>,
    options?: { limit?: number; offset?: number; orderBy?: unknown },
  ): string {
    const parts = [
      table,
      JSON.stringify(where),
      options?.limit?.toString() || "",
      options?.offset?.toString() || "",
      JSON.stringify(options?.orderBy || {}),
    ];

    return `query:${parts.join(":")}`;
  }

  /**
   * Get slow queries
   */
  getSlowQueries(threshold?: number): QueryMetrics[] {
    const limit = threshold || this.slowQueryThreshold;
    return this.queryMetrics
      .filter((m) => m.duration > limit)
      .sort((a, b) => b.duration - a.duration); // Sort by duration descending
  }

  /**
   * Get index recommendations for a specific table
   */
  getIndexRecommendationsForTable(table: string): IndexRecommendation[] {
    const tableQueries = this.queryMetrics.filter((m) => m.table === table);
    const recommendations: IndexRecommendation[] = [];

    for (const metrics of tableQueries) {
      const recs = this.analyzeQuery(metrics.query, metrics);
      recommendations.push(...recs);
    }

    // Remove duplicates and sort by priority
    const uniqueRecs = new Map<string, IndexRecommendation>();
    for (const rec of recommendations) {
      const key = `${rec.table}:${rec.columns.join(",")}`;
      const existing = uniqueRecs.get(key);
      if (
        !existing ||
        (rec.priority === "high" && existing.priority !== "high")
      ) {
        uniqueRecs.set(key, rec);
      }
    }

    return Array.from(uniqueRecs.values()).sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get query statistics
   */
  getQueryStatistics(): {
    totalQueries: number;
    averageDuration: number;
    slowQueries: number;
    cacheHitRate: number;
    mostQueriedTables: Array<{ table: string; count: number }>;
  } {
    const totalQueries = this.queryMetrics.length;

    if (totalQueries === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        cacheHitRate: 0,
        mostQueriedTables: [],
      };
    }

    const averageDuration =
      this.queryMetrics.reduce((sum, m) => sum + m.duration, 0) / totalQueries;

    const slowQueries = this.queryMetrics.filter(
      (m) => m.duration > this.slowQueryThreshold,
    ).length;

    // Calculate cache hit rate
    const totalCacheRequests = this.cacheHits + this.cacheMisses;
    const cacheHitRate =
      totalCacheRequests > 0 ? (this.cacheHits / totalCacheRequests) * 100 : 0;

    // Get most queried tables
    const tableCounts = new Map<string, number>();
    this.queryMetrics.forEach((m) => {
      if (m.table) {
        const count = tableCounts.get(m.table) || 0;
        tableCounts.set(m.table, count + 1);
      }
    });

    const mostQueriedTables = Array.from(tableCounts.entries())
      .map(([table, count]) => ({ table, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalQueries,
      averageDuration,
      slowQueries,
      cacheHitRate,
      mostQueriedTables,
    };
  }

  /**
   * Analyze query and provide recommendations
   */
  analyzeQuery(query: string, metrics: QueryMetrics): IndexRecommendation[] {
    const recommendations: IndexRecommendation[] = [];

    // Check for WHERE clauses without indexes
    const whereMatch = query.match(/WHERE\s+(\w+)\s*=/i);
    if (whereMatch && metrics.duration > 500) {
      recommendations.push({
        table: metrics.table || "unknown",
        columns: [whereMatch[1]],
        reason: "Slow query with WHERE clause - consider adding index",
        priority: "high",
      });
    }

    // Check for multiple WHERE clauses (AND/OR)
    const multipleWhereMatches = [
      ...query.matchAll(
        /WHERE\s+([\w\s=<>!']+)(?:\s+(?:AND|OR)\s+([\w\s=<>!']+))+/gi,
      ),
    ];
    if (multipleWhereMatches.length > 0 && metrics.duration > 700) {
      const columns: string[] = [];
      multipleWhereMatches.forEach((match) => {
        for (let i = 1; i < match.length; i++) {
          if (match[i]) {
            const columnMatch = match[i].match(/(\w+)\s*[=<>!]/);
            if (columnMatch) {
              columns.push(columnMatch[1]);
            }
          }
        }
      });
      if (columns.length > 1) {
        recommendations.push({
          table: metrics.table || "unknown",
          columns: [...new Set(columns)], // Unique columns
          reason:
            "Slow query with multiple WHERE clauses - consider adding composite index",
          priority: "high",
        });
      }
    }

    // Check for ORDER BY without indexes
    const orderByMatch = query.match(/ORDER BY\s+(\w+)/i);
    if (orderByMatch && metrics.duration > 500) {
      recommendations.push({
        table: metrics.table || "unknown",
        columns: [orderByMatch[1]],
        reason: "Slow query with ORDER BY - consider adding index",
        priority: "medium",
      });
    }

    // Check for GROUP BY clauses
    const groupByMatch = query.match(/GROUP BY\s+([\w,\s]+)/i);
    if (groupByMatch && metrics.duration > 700) {
      const columns = groupByMatch[1].split(",").map((col) => col.trim());
      recommendations.push({
        table: metrics.table || "unknown",
        columns: columns,
        reason:
          "Slow query with GROUP BY clause - consider adding composite index",
        priority: "medium",
      });
    }

    // Check for JOINs
    const joinMatch = query.match(
      /JOIN\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i,
    );
    if (joinMatch && metrics.duration > 1000) {
      recommendations.push({
        table: joinMatch[1],
        columns: [joinMatch[3], joinMatch[5]],
        reason: "Slow JOIN query - consider adding indexes on join columns",
        priority: "high",
      });
    }

    return recommendations;
  }

  /**
   * Clear query cache
   */
  clearCache(pattern?: string): number {
    if (!pattern) {
      const size = this.queryCache.size;
      this.queryCache.clear();
      return size;
    }

    let cleared = 0;
    for (const [key] of Array.from(this.queryCache.entries())) {
      if (key.includes(pattern)) {
        this.queryCache.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  /**
   * Clear expired cache entries
   */
  cleanExpiredCache(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, entry] of Array.from(this.queryCache.entries())) {
      if (now - entry.timestamp > entry.ttl) {
        this.queryCache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get cache statistics
   */
  getCacheStatistics(): {
    size: number;
    entries: number;
    hitRate: number;
    hits: number;
    misses: number;
    totalRequests: number;
  } {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate =
      totalRequests > 0 ? (this.cacheHits / totalRequests) * 100 : 0;

    return {
      size: this.queryCache.size,
      entries: this.queryCache.size,
      hitRate,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      totalRequests,
    };
  }

  /**
   * Reset cache statistics
   */
  resetCacheStatistics(): void {
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

export const queryOptimizerService = new QueryOptimizerService();

// Auto clean expired cache every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      queryOptimizerService.cleanExpiredCache();
    },
    5 * 60 * 1000,
  );
}
