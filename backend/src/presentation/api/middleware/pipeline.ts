/**
 * Middleware Pipeline - Organized Request Processing
 *
 * Centralizes all middleware configuration for clean server setup.
 * Order matters: Basics -> Security -> Auth -> Router -> Completion -> Error
 */

import express, { Express } from "express";
import helmet from "helmet";
import * as Security from "./security/index.js";
import * as Traffic from "./traffic/index.js";
import * as Optimization from "./optimization/index.js";
import * as Diagnostics from "./diagnostics/index.js";
import { Settings } from "../../../shared/configuration/index.js";

/**
 * Setup pre-route middleware pipeline
 */
export function setupPreRouteMiddleware(app: Express, settings: Settings) {
  // 1. Body Parsing (Basics)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // 2. Diagnostics (Soul & Pulse)
  app.use(Diagnostics.requestContextMiddleware);
  app.use(Diagnostics.enhancedPerformanceMiddleware);

  // 3. Security (Shield)
  app.use(helmet({ contentSecurityPolicy: false }));

  if (settings.app.env === "production") {
    app.use(Security.apiSecurityHeadersMiddleware());
  } else {
    app.use(Security.developmentSecurityHeadersMiddleware());
  }

  app.use(Security.corsMiddleware);

  // 4. Optimization & Traffic Control
  app.use(Optimization.etagMiddleware);
  app.use(Optimization.varyMiddleware);

  if (settings.security.rateLimitEnabled) {
    app.use(Traffic.rateLimitMiddleware);
  }

  // 5. Static Assets
  if (settings.app.env === "production") {
    app.use("/static", Optimization.staticCacheMiddleware);
  }
}

/**
 * Setup post-route middleware pipeline
 */
export function setupPostRouteMiddleware(app: Express) {
  // 6. Finalization (Nervous System Response)
  app.use(Diagnostics.requestCompletionMiddleware);

  // 🚪 404 Handler - Catch unreachable routes
  app.use((_req, res) => {
    res.status(404).json({
      status: "error",
      message: "Resource not found",
      path: _req.path,
    });
  });

  // 7. Error Handling (Immune System - MUST BE LAST)
  app.use(Diagnostics.enhancedErrorMiddleware);
}
