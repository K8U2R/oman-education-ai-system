/**
 * Google OAuth2 Strategy - Sovereign Implementation
 *
 * Safe Initialization using central ENV_CONFIG engine.
 * Won't crash the server if keys are missing (Degradation Mode).
 */

import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { logger } from "../../../shared/utils/logger.js";
import { ENV_CONFIG } from "../../config/env.config.js";

import {
  UserData,
  ROLE_PERMISSIONS,
} from "../../../domain/types/auth/auth.types.js";

/**
 * Factory to create Google Strategy only if credentials exist
 */
export function createGoogleStrategy() {
  const clientID = ENV_CONFIG.GOOGLE_CLIENT_ID;
  const clientSecret = ENV_CONFIG.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    logger.warn(
      "[Sovereign Auth] Google OAuth credentials missing. Strategy NOT registered (Degradation Mode enabled).",
    );
    return null;
  }

  return new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL:
        ENV_CONFIG.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/v1/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        logger.info("[GoogleStrategy] Processing OAuth callback", {
          profileId: profile.id,
          email: profile.emails?.[0]?.value,
        });

        const email = profile.emails?.[0]?.value;
        const username =
          profile.displayName || profile.emails?.[0]?.value.split("@")[0];
        const avatar = profile.photos?.[0]?.value;

        const user: UserData = {
          id: profile.id,
          email: email || "",
          username: username || "",
          avatar_url: avatar,
          is_verified: true,
          is_active: true,
          role: "student",
          permissions: ROLE_PERMISSIONS["student"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        logger.info("[GoogleStrategy] User authenticated successfully", {
          userId: user.id,
          email: user.email,
        });

        done(null, user);
      } catch (error) {
        logger.error("[GoogleStrategy] Authentication failed", {
          error: error instanceof Error ? error.message : "Unknown error",
          profileId: profile.id,
        });
        done(error as Error);
      }
    },
  );
}
