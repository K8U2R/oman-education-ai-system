/**
 * OAuth Routes - Google Authentication
 *
 * Sovereign OAuth implementation using ENV_CONFIG central engine.
 */

import { Router, Request, Response } from "express";
import { passport } from "../../infrastructure/auth/passport.config.js";
import { logger } from "../../shared/utils/logger.js";
import { ENV_CONFIG } from "../../infrastructure/config/env.config.js";

const router = Router();

/**
 * Initiate Google OAuth flow
 */
router.get("/auth/google", (req: Request, res: Response, next) => {
  logger.info("[OAuth] Initiating Google OAuth flow");

  // Safe check for credentials via ENV_CONFIG
  if (!ENV_CONFIG.GOOGLE_CLIENT_ID) {
    logger.error("[OAuth] GOOGLE_CLIENT_ID is missing");
    return res.status(500).json({
      success: false,
      error: "OAuth provider not configured (Missing GOOGLE_CLIENT_ID)",
    });
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

/**
 * Google OAuth callback handler (GET)
 */
router.get("/auth/google/callback", (req: Request, res: Response, next) => {
  return passport.authenticate("google", {
    failureRedirect: `${ENV_CONFIG.FRONTEND_URL}/login?error=oauth_failed`,
    successRedirect: `${ENV_CONFIG.FRONTEND_URL}/auth/success`,
  })(req, res, next);
});

/**
 * Google OAuth callback handler (POST) - Messenger Flow
 */
router.post(
  "/auth/oauth/callback",
  async (req: Request, res: Response, next) => {
    const { code, state } = req.body;
    logger.info("[OAuth] Messenger callback received", { state });

    if (!code) {
      return res
        .status(400)
        .json({ success: false, error: "Missing OAuth code" });
    }

    return passport.authenticate("google", (err: Error | null, user: Express.User | false) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          error: err?.message || "OAuth exchange failed",
        });
      }

      return req.login(user, (loginErr) => {
        if (loginErr) {
          return res
            .status(500)
            .json({ success: false, error: "Session creation failed" });
        }
        return res.json({ success: true, user });
      });
    })(req, res, next);
  },
);

/**
 * Get current authenticated user
 */
router.get("/auth/me", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  return res.json({
    success: true,
    user: req.user,
  });
});

/**
 * Logout endpoint
 */
router.post("/auth/logout", (req: Request, res: Response) => {
  const userId = (req.user as Express.User & { id?: string })?.id;

  req.logout((err) => {
    if (err) {
      logger.error("[OAuth] Logout error", { userId, error: err.message });
      return res.status(500).json({ success: false, error: "Logout failed" });
    }

    return req.session.destroy(() => {
      return res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

export default router;
