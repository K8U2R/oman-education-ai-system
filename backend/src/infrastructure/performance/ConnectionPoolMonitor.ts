/**
 * Connection Pool Monitor - مراقب Connection Pool
 *
 * مراقبة وإدارة Connection Pool:
 * - Real-time monitoring
 * - Health checks
 * - Automatic scaling
 * - Performance metrics
 */

import { logger } from "@/shared/utils/logger";
import http from "http";
import https from "https";

export interface PoolStats {
  maxSockets: number;
  freeSockets: number;
  usedSockets: number;
  pendingRequests: number;
  usagePercentage: number;
  health: "healthy" | "degraded" | "critical";
  averageResponseTime: number;
  errorRate: number;
}

export interface PoolConfig {
  maxSockets: number;
  maxFreeSockets: number;
  keepAlive: boolean;
  keepAliveMsecs: number;
  timeout: number;
}

export class ConnectionPoolMonitor {
  private httpAgent?: http.Agent;
  private httpsAgent?: https.Agent;
  private responseTimes: number[] = [];
  private errors: number = 0;
  private requests: number = 0;
  private readonly maxResponseTimeHistory = 100;

  /**
   * Initialize monitor with agents
   */
  initialize(httpAgent?: http.Agent, httpsAgent?: https.Agent): void {
    this.httpAgent = httpAgent;
    this.httpsAgent = httpsAgent;
  }

  /**
   * Get current pool statistics
   */
  getStats(): PoolStats {
    const agent = this.httpAgent || this.httpsAgent;
    if (!agent) {
      return {
        maxSockets: 0,
        freeSockets: 0,
        usedSockets: 0,
        pendingRequests: 0,
        usagePercentage: 0,
        health: "critical",
        averageResponseTime: 0,
        errorRate: 0,
      };
    }

    const maxSockets = agent.maxSockets || 100;
    const freeSockets = agent.freeSockets
      ? Object.keys(agent.freeSockets).length
      : 0;
    const usedSockets = agent.sockets ? Object.keys(agent.sockets).length : 0;
    const pendingRequests = agent.requests
      ? Object.keys(agent.requests).length
      : 0;
    const usagePercentage =
      maxSockets > 0 ? (usedSockets / maxSockets) * 100 : 0;

    // Calculate average response time
    const averageResponseTime =
      this.responseTimes.length > 0
        ? this.responseTimes.reduce((a, b) => a + b, 0) /
          this.responseTimes.length
        : 0;

    // Calculate error rate
    const errorRate =
      this.requests > 0 ? (this.errors / this.requests) * 100 : 0;

    // Determine health
    let health: "healthy" | "degraded" | "critical" = "healthy";
    if (usagePercentage > 90 || errorRate > 10 || averageResponseTime > 5000) {
      health = "critical";
    } else if (
      usagePercentage > 70 ||
      errorRate > 5 ||
      averageResponseTime > 2000
    ) {
      health = "degraded";
    }

    return {
      maxSockets,
      freeSockets,
      usedSockets,
      pendingRequests,
      usagePercentage,
      health,
      averageResponseTime,
      errorRate,
    };
  }

  /**
   * Record response time
   */
  recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    if (this.responseTimes.length > this.maxResponseTimeHistory) {
      this.responseTimes.shift();
    }
  }

  /**
   * Record request
   */
  recordRequest(): void {
    this.requests++;
  }

  /**
   * Record error
   */
  recordError(): void {
    this.errors++;
    this.requests++;
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.responseTimes = [];
    this.errors = 0;
    this.requests = 0;
  }

  /**
   * Get health check
   */
  healthCheck(): {
    status: "healthy" | "degraded" | "critical";
    message: string;
    stats: PoolStats;
  } {
    const stats = this.getStats();
    let message = "Connection pool is healthy";

    if (stats.health === "critical") {
      message = "Connection pool is critical - immediate attention required";
    } else if (stats.health === "degraded") {
      message = "Connection pool is degraded - monitor closely";
    }

    return {
      status: stats.health,
      message,
      stats,
    };
  }

  /**
   * Get recommendations for optimization
   */
  getRecommendations(): string[] {
    const stats = this.getStats();
    const recommendations: string[] = [];

    if (stats.usagePercentage > 80) {
      recommendations.push(
        "Consider increasing maxSockets - current usage is high",
      );
    }

    if (stats.averageResponseTime > 2000) {
      recommendations.push(
        "High average response time - check database performance",
      );
    }

    if (stats.errorRate > 5) {
      recommendations.push("High error rate - investigate connection issues");
    }

    if (stats.pendingRequests > 10) {
      recommendations.push(
        "Many pending requests - consider increasing pool size",
      );
    }

    if (stats.freeSockets === 0 && stats.usedSockets === stats.maxSockets) {
      recommendations.push("Pool is fully utilized - increase maxSockets");
    }

    return recommendations;
  }

  /**
   * Log statistics
   */
  logStats(): void {
    const stats = this.getStats();
    logger.info("Connection pool statistics", {
      usage: `${stats.usagePercentage.toFixed(2)}%`,
      sockets: `${stats.usedSockets}/${stats.maxSockets}`,
      free: stats.freeSockets,
      pending: stats.pendingRequests,
      health: stats.health,
      avgResponseTime: `${stats.averageResponseTime.toFixed(2)}ms`,
      errorRate: `${stats.errorRate.toFixed(2)}%`,
    });
  }
}

// Global instance
export const connectionPoolMonitor = new ConnectionPoolMonitor();
