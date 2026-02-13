/**
 * Session Routes - مسارات الجلسات
 *
 * Session API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { SessionHandler } from "../../handlers/system/session.handler.js";
import {
  authMiddleware,
  requireAdmin,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /security/sessions
 * Get user sessions
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "getUserSessions",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /security/sessions/all
 * Get all sessions (admin only)
 */
router.get(
  "/all",
  ...RouteFactory.createAdminRoute<SessionHandler>(
    "SessionHandler",
    "getAllSessions",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/sessions/:id
 * Get session details
 */
router.get(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "getSessionDetails",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /security/sessions/:id
 * Terminate session
 */
router.delete(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "terminateSession",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /security/sessions/user/:userId
 * Terminate all user sessions
 */
router.delete(
  "/user/:userId",
  ...RouteFactory.createAdminRoute<SessionHandler>(
    "SessionHandler",
    "terminateAllSessions",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * PUT /security/sessions/:id/refresh
 * Refresh session
 */
router.put(
  "/:id/refresh",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "refreshSession",
    authMiddleware.authenticate,
  ),
);

export default router;
