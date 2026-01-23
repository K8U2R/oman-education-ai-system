/**
 * Health Checker - فاحص الصحة
 *
 * نظام شامل لفحص صحة المكونات والخدمات
 */

import { logger } from "@/shared/utils/logger";

export type HealthStatus = "healthy" | "unhealthy" | "degraded";

export interface HealthCheckResult {
  name: string;
  status: HealthStatus;
  message?: string;
  latency?: number;
  details?: Record<string, unknown>;
}

export interface IHealthCheck {
  name: string;
  check(): Promise<HealthCheckResult>;
}

export interface HealthCheckSummary {
  status: HealthStatus;
  checks: HealthCheckResult[];
  timestamp: string;
}

/**
 * Health Checker
 *
 * يدير جميع health checks للمكونات المختلفة
 */
export class HealthChecker {
  private checks = new Map<string, IHealthCheck>();

  /**
   * Register health check
   */
  register(check: IHealthCheck): void {
    this.checks.set(check.name, check);
    logger.debug("Health check registered", { name: check.name });
  }

  /**
   * Unregister health check
   */
  unregister(name: string): void {
    this.checks.delete(name);
    logger.debug("Health check unregistered", { name });
  }

  /**
   * Run all health checks
   */
  async checkAll(): Promise<HealthCheckSummary> {
    const results = await Promise.all(
      Array.from(this.checks.values()).map((check) => this.runCheck(check)),
    );

    const status = this.aggregateStatus(results);

    return {
      status,
      checks: results,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Run single health check
   */
  async check(name: string): Promise<HealthCheckResult | null> {
    const healthCheck = this.checks.get(name);
    if (!healthCheck) {
      return null;
    }

    return await this.runCheck(healthCheck);
  }

  /**
   * Run health check with error handling
   */
  private async runCheck(
    healthCheck: IHealthCheck,
  ): Promise<HealthCheckResult> {
    try {
      return await healthCheck.check();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Health check failed", {
        name: healthCheck.name,
        error: errorMessage,
      });

      return {
        name: healthCheck.name,
        status: "unhealthy",
        message: errorMessage,
      };
    }
  }

  /**
   * Aggregate status from all checks
   */
  private aggregateStatus(results: HealthCheckResult[]): HealthStatus {
    const hasUnhealthy = results.some((r) => r.status === "unhealthy");
    if (hasUnhealthy) return "unhealthy";

    const hasDegraded = results.some((r) => r.status === "degraded");
    if (hasDegraded) return "degraded";

    return "healthy";
  }

  /**
   * Get registered checks
   */
  getRegisteredChecks(): string[] {
    return Array.from(this.checks.keys());
  }
}

// Global instance
let healthCheckerInstance: HealthChecker | null = null;

/**
 * Get Health Checker instance (Singleton)
 */
export function getHealthChecker(): HealthChecker {
  if (!healthCheckerInstance) {
    healthCheckerInstance = new HealthChecker();
  }
  return healthCheckerInstance;
}

/**
 * Reset Health Checker (useful for testing)
 */
export function resetHealthChecker(): void {
  healthCheckerInstance = null;
}
