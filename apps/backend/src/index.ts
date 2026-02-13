/**
 * Main Server Entry Point
 * Production-ready API Gateway with Redis support
 */

import "reflect-metadata";
import express from "express";
import type { Express } from "express";
import http from "http";
import { logger } from "./shared/utils/logger.js";
import { bootstrap } from "./bootstrap.js";
import { setupAuthMiddleware } from "./infrastructure/auth/auth.middleware.js";
import { Pipeline } from "./presentation/api/middleware/index.js";
import coreRouter from "./presentation/api/routes/index.js";

const app: Express = express();

// Request timeout middleware (10 seconds)
app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    logger.error(`Request timeout: ${req.method} ${req.url}`);
    res.status(408).send("Request Timeout");
  });
  next();
});

async function startServer() {
  try {
    // Health check endpoint (before middleware)
    app.get("/api/health", async (_req, res) => {
      let redisStatus = "not_initialized";
      try {
        const { redisClient } = await import("./infrastructure/cache/RedisClient.js");
        redisStatus = (await redisClient.isHealthy()) ? "connected" : "disconnected";
      } catch {
        redisStatus = "unavailable";
      }

      res.status(200).json({
        status: "ok",
        redis: redisStatus,
        timestamp: new Date().toISOString(),
      });
    });

    // Bootstrap system (database, config)
    logger.info("Starting system bootstrap...");
    const settings = await bootstrap();
    logger.info("✅ Bootstrap complete");

    // Connect to Redis
    logger.info("Connecting to Redis...");
    try {
      const { redisClient } = await import("./infrastructure/cache/RedisClient.js");
      await redisClient.connect();
      logger.info("✅ Redis connected");
    } catch (error) {
      logger.warn("Redis connection failed (non-fatal):", error);
    }

    // Setup middleware pipeline
    logger.info("Initializing middleware...");
    Pipeline.setupPreRouteMiddleware(app, settings);
    await setupAuthMiddleware(app, settings);

    // Register routes
    app.use("/api/v1", coreRouter);
    Pipeline.setupPostRouteMiddleware(app);

    // Start HTTP server
    const { ENV_CONFIG } = await import("./infrastructure/config/env.config.js");
    const PORT = ENV_CONFIG.PORT || 3000;

    const server = http.createServer(app);
    server.timeout = 10000;
    server.keepAliveTimeout = 5000;

    server.listen(PORT, () => {
      logger.info(`🚀 Server ready on port ${PORT}`);
      logger.info(`📡 Health: http://localhost:${PORT}/api/health`);
    });

    server.on("error", (e: NodeJS.ErrnoException) => {
      if (e.code === "EADDRINUSE") {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        logger.error("Server error:", e);
      }
    });
  } catch (error) {
    logger.error("Critical startup failure:", error);
    process.exit(1);
  }
}

startServer();
export default app;
