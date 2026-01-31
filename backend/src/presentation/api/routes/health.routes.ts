/**
 * Health Routes - مسارات الصحة
 *
 * Health check endpoints
 */

import { Router, Request, Response } from "express";
import { getSettings } from "../../../shared/configuration/index.js";
import { container } from "../../../infrastructure/di/index.js";
import { getHealthChecker } from "../../../infrastructure/monitoring/index.js";
import {
  DatabaseHealthCheck,
  EmailHealthCheck,
} from "../../../infrastructure/monitoring/checks/index.js";
import { DatabaseCoreAdapter } from "../../../infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { EmailService } from "../../../application/services/communication/index.js";

const router = Router();

// Lazy initialization of health checks (resolve services on first request)
let healthChecksInitialized = false;

function initializeHealthChecks(): void {
  if (healthChecksInitialized) return;

  // Resolve services from DI Container
  const databaseAdapter =
    container.resolve<DatabaseCoreAdapter>("DatabaseAdapter");
  const emailService = container.resolve<EmailService>("EmailService");

  // Register health checks
  const healthChecker = getHealthChecker();
  healthChecker.register(new DatabaseHealthCheck(databaseAdapter));
  healthChecker.register(new EmailHealthCheck(emailService));

  healthChecksInitialized = true;
}

/**
 * GET /health
 * Health check endpoint
 */
router.get("/health", (_req: Request, res: Response) => {
  const settings = getSettings();

  res.status(200).json({
    status: "ok",
    service: "Oman Education AI Backend",
    version: settings.app.version,
    environment: settings.app.env,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health/ready
 * Readiness check endpoint
 *
 * يتحقق من جاهزية الخدمات الأساسية:
 * - Database connection
 * - Email service
 */
router.get("/health/ready", async (_req: Request, res: Response) => {
  initializeHealthChecks();
  const healthChecker = getHealthChecker();
  const summary = await healthChecker.checkAll();

  // Convert health check results to legacy format for backward compatibility
  const checks: Record<string, { status: "ok" | "error"; message?: string }> =
    {};

  for (const check of summary.checks) {
    const status = check.status === "healthy" ? "ok" : "error";
    checks[check.name] = {
      status,
      message: check.message,
    };
  }

  const statusCode = summary.status === "healthy" ? 200 : 503;
  res.status(statusCode).json({
    status: summary.status === "healthy" ? "ready" : "not ready",
    checks,
    timestamp: summary.timestamp,
  });
});

/**
 * GET /health/live
 * Liveness check endpoint
 *
 * يتحقق من أن التطبيق يعمل (لا يحتاج إلى فحص الخدمات الخارجية)
 */
router.get("/health/live", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health/redis
 * Redis Session Store health check
 * 
 * يتحقق من اتصال Redis Session Store
 */
router.get("/health/redis", async (_req: Request, res: Response) => {
  try {
    // Dynamically import to avoid circular dependency
    const authModule = await import("../../../infrastructure/auth/auth.middleware.js");

    const isHealthy = await authModule.getSessionStoreHealth();

    if (isHealthy) {
      res.status(200).json({
        status: "healthy",
        service: "Redis Session Store",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: "unhealthy",
        service: "Redis Session Store",
        error: "Redis connection not available or not configured",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";

    res.status(503).json({
      status: "error",
      service: "Redis Session Store",
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
