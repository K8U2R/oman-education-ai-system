/**
 * Database Health Check
 *
 * Health check للتحقق من اتصال قاعدة البيانات
 */

import { IHealthCheck, HealthCheckResult } from "../HealthChecker";
import { DatabaseCoreAdapter } from "../../adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger.js";
import { ENV_CONFIG } from "../../config/env.config.js";

export class DatabaseHealthCheck implements IHealthCheck {
  name = "database";

  constructor(private readonly databaseAdapter: DatabaseCoreAdapter) {}

  async check(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      // Try a simple database operation with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Database health check timeout")),
          2000,
        );
      });

      await Promise.race([
        this.databaseAdapter.findOne("users", { id: "health-check" }),
        timeoutPromise,
      ]);

      const latency = Date.now() - start;

      return {
        name: this.name,
        status: "healthy",
        latency,
        message: "Database connection is healthy",
      };
    } catch (error) {
      const latency = Date.now() - start;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // In test/development, database might not be available
      if (ENV_CONFIG.NODE_ENV !== "production") {
        logger.debug("Database health check failed (non-production)", {
          error: errorMessage,
        });
        return {
          name: this.name,
          status: "degraded",
          latency,
          message: "Database not available (non-production)",
        };
      }

      logger.warn("Database health check failed", { error: errorMessage });
      return {
        name: this.name,
        status: "unhealthy",
        latency,
        message: errorMessage,
      };
    }
  }
}
