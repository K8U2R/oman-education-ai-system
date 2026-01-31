/**
 * Main Entry Point - API Gateway (Algorithmic Traffic Coordinator)
 * Updated with Anti-Zombie Protection & Connection Timeouts
 */

import "reflect-metadata"; // Required for tsyringe
import "dotenv/config"; // Must be first (after metadata)
import express from "express";
import type { Express } from "express";
import { ENV_CONFIG } from "./infrastructure/config/env.config.js";
import { validateEnvironment } from "./infrastructure/config/env.validator.js";
import { logger } from "./shared/utils/logger.js";

// ============================================================================
// Environment Validation (CRITICAL - Run before anything else)
// ============================================================================
validateEnvironment();

// ============================================================================
// Application Setup
// ============================================================================
import http from "http";
import { bootstrap } from "./bootstrap.js";
import { setupAuthMiddleware } from "./infrastructure/auth/auth.middleware.js";
import {
  setupPreRouteMiddleware,
  setupPostRouteMiddleware,
} from "./presentation/api/middleware/pipeline.js";
import coreRouter from "./presentation/api/routes/index.js";

const app: Express = express();

/**
 * 🛡️ Anti-Hang Middleware (Law 1: 10-Second Sovereignty)
 * يقتل أي طلب لا يستجيب خلال 10 ثوانٍ لمنع تراكم الاتصالات المعلقة
 */
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    logger.error(`❌ [TIMEOUT] Request to ${req.method} ${req.url} timed out > 10s`);
    res.status(408).send("Request Timeout - Server took too long");
  });
  next();
});

async function startServer() {
  try {
    // ════════════════════════════════════════════════════════════════════════
    // STEP 0: Priority Health Check (No Middleware Blocking)
    // ════════════════════════════════════════════════════════════════════════
    app.get("/api/health", (_req, res) => {
      logger.info(`💓 [HEALTH CHECK] Incoming from ${_req.ip}`);
      res.status(200).json({
        status: "ok",
        priority: true,
        message: "Oman Education AI Backend is alive",
        timestamp: new Date().toISOString()
      });
    });

    // ════════════════════════════════════════════════════════════════════════
    // STEP 2: Strict System Bootstrap (Kernel & Database)
    // ════════════════════════════════════════════════════════════════════════
    logger.info("⏳ [1/4] Starting Sovereign System Kernel...");
    const settings = await bootstrap();
    logger.info("✅ [2/4] Kernel Bootstrap Successful.");

    // ════════════════════════════════════════════════════════════════════════
    // STEP 3: Middleware Pipeline Setup
    // ════════════════════════════════════════════════════════════════════════
    logger.info("⏳ [3/4] Initializing Middleware Pipelines...");
    setupPreRouteMiddleware(app, settings);
    // Authentication middleware (Session + Passport)
    await setupAuthMiddleware(app, settings);

    // Sovereign App Routes
    // app.use("/api/v1", oauthRoutes);
    app.use("/api/v1", coreRouter);

    // Finalize Pipeline (404 and Error handling)
    setupPostRouteMiddleware(app);

    // ════════════════════════════════════════════════════════════════════════
    // STEP 3: Safe Server Binding
    // ════════════════════════════════════════════════════════════════════════
    const { ENV_CONFIG } = await import("./infrastructure/config/env.config.js");
    const PORT = ENV_CONFIG.PORT || 3000;

    logger.info(`⏳ [4/4] Attempting to bind to PORT: ${PORT}`);

    // Create Server Instance explicitly to control timeouts
    const server = http.createServer(app);

    // Hard Timeout for TCP Connections (Kill zombies at TCP level)
    server.timeout = 10000;
    server.keepAliveTimeout = 5000;

    server.listen(PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🚀 SERVER READY                                           ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
      logger.info(`📡 URL: http://localhost:${PORT}`);
      logger.info(`🩺 Health: http://localhost:${PORT}/health`);
      logger.info(`🚀 Sovereign System Ready on Port ${PORT}`);
    });

    // Handle Port Collision Errors
    server.on('error', (e: NodeJS.ErrnoException) => {
      if (e.code === 'EADDRINUSE') {
        logger.error(`❌ FATAL: Port ${PORT} is already in use! Kill the zombie process.`);
        process.exit(1);
      } else {
        logger.error("❌ Server Error:", e);
      }
    });

  } catch (error) {
    logger.error("❌ CRITICAL FAILURE:", error);
    process.exit(1);
  }
}

startServer();
export default app;