/**
 * Authentication Middleware - Sovereign Setup
 *
 * Configures session and Passport.js for OAuth.
 * Uses central ENV_CONFIG engine for session secret.
 */

import session from "express-session";
import { passport } from "./passport.config.js";
import { Express } from "express";
import { Settings } from "../../shared/configuration/index.js";
import { ENV_CONFIG } from "../config/env.config.js";

/**
 * Configure authentication middleware
 * Must be called BEFORE routes.
 */
export function setupAuthMiddleware(app: Express, settings: Settings) {
  // Session configuration (BEFORE Passport)
  app.use((req, res, next) => { console.log("  ➡️ Entering: Session Layer"); next(); });
  app.use(
    session({
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
  app.use((req, res, next) => { console.log("  ✅ Exiting: Session Layer"); next(); });

  // Passport initialization (AFTER Session)
  app.use((req, res, next) => { console.log("  ➡️ Entering: Passport Initialization"); next(); });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => { console.log("  ✅ Exiting: Passport Initialization"); next(); });
}
