/**
 * Passport Configuration - Sovereign Auth System
 *
 * Configures Passport.js with Google OAuth2 strategy.
 * Handles session serialization/deserialization.
 */

import passport from "passport";
import { createGoogleStrategy } from "./strategies/google.strategy.js";
import { logger } from "../../shared/utils/logger.js";
import { UserData, ROLE_PERMISSIONS } from "../../domain/types/auth/auth.types.js";

// Safe Registration: Only use strategy if it was successfully created
const strategy = createGoogleStrategy();
if (strategy) {
  passport.use(strategy);
  logger.info("[Passport] Google OAuth2 strategy registered successfully.");
} else {
  logger.warn(
    "[Passport] Google strategy initialization skipped (Missing Credentials).",
  );
}

/**
 * Serialize user for session storage
 */
passport.serializeUser((user: any, done) => {
  logger.debug("[Passport] Serializing user", { userId: user.id });
  done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id: string, done) => {
  try {
    logger.debug("[Passport] Deserializing user", { userId: id });

    // Placeholder - integrate with your User repository later
    const user: UserData = {
      id: id,
      username: "User",
      email: "user@example.com",
      is_verified: true,
      is_active: true,
      role: "student",
      permissions: ROLE_PERMISSIONS["student"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    done(null, user);
  } catch (error) {
    logger.error("[Passport] Deserialization error", {
      userId: id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    done(error);
  }
});

export { passport };
