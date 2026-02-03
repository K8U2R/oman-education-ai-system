/**
 * Authentication Middleware - Sovereign Setup
 *
 * Configures session and Passport.js for OAuth.
 * Uses Redis Session Store in production for stateless sessions.
 * 
 * @compliance LAW_01 - Iron Firewall (Constructor Injection)
 * @compliance LAW_11 - Root Sovereignty (Stateless with Redis)
 */

import session from "express-session";
import { passport } from "./passport.config.js";
import { Express } from "express";
import { Settings } from "../../shared/configuration/index.js";
import { ENV_CONFIG } from "../config/env.config.js";
import { RedisSessionStore } from "../adapters/session/RedisSessionStore.js";
import { ISessionStore } from "../adapters/session/ISessionStore.js";
import { logger } from "../../shared/utils/logger.js";

// Module-level session store instance
let sessionStore: ISessionStore | undefined;

/**
 * Configure authentication middleware
 * Must be called BEFORE routes.
 * 
 * @param app Express application
 * @param settings Application settings
 */
export async function setupAuthMiddleware(app: Express, settings: Settings): Promise<void> {
  // Initialize Redis Session Store for Production
  if (ENV_CONFIG.NODE_ENV === 'production') {
    try {
      logger.info('Initializing Redis Session Store for production...');

      sessionStore = new RedisSessionStore({
        host: ENV_CONFIG.REDIS_HOST || 'localhost',
        port: ENV_CONFIG.REDIS_PORT || 6379,
        password: ENV_CONFIG.REDIS_PASSWORD,
        prefix: 'session:',
        ttl: 86400 // 24 hours
      });

      await sessionStore.connect();

      logger.info('✅ Redis Session Store connected successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      logger.error('❌ Failed to initialize Redis Session Store', { error: errorMsg });
      logger.warn('⚠️  Falling back to MemoryStore (NOT RECOMMENDED FOR PRODUCTION)');
      sessionStore = undefined;
    }
  } else {
    logger.info('Using MemoryStore for development');
  }

  // Session configuration (BEFORE Passport)
  app.use((_req, _res, next) => { console.log("  ➡️ Entering: Session Layer"); next(); });
  app.use(
    session({
      store: sessionStore?.getStore(), // Redis in production, Memory in dev
      secret: ENV_CONFIG.SESSION_SECRET || "fallback-security-not-recommended",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: settings.app.env === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: "lax",
      },
    }),
  );
  app.use((_req, _res, next) => { console.log("  ✅ Exiting: Session Layer"); next(); });

  // Passport initialization (AFTER Session)
  app.use((_req, _res, next) => { console.log("  ➡️ Entering: Passport Initialization"); next(); });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((_req, _res, next) => { console.log("  ✅ Exiting: Passport Initialization"); next(); });
}

/**
 * Get session store health status
 * @returns Promise<boolean> - true if healthy, false otherwise
 */
export async function getSessionStoreHealth(): Promise<boolean> {
  if (!sessionStore) {
    return false; // No Redis configured (dev mode)
  }

  try {
    return await sessionStore.isHealthy();
  } catch {
    return false;
  }
}

/**
 * Graceful shutdown handler for session store
 */
export async function shutdownSessionStore(): Promise<void> {
  if (sessionStore) {
    logger.info('Shutting down session store...');
    await sessionStore.disconnect();
  }
}
