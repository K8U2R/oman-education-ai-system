/**
 * Admin Routes - مسارات الإدارة
 *
 * Admin API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { AdminHandler } from "../../handlers/admin/admin.handler.js";
import { authMiddleware, requireAdmin } from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /admin/stats/system
 * Get system statistics
 */
router.get(
  "/stats/system",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "getSystemStats",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /admin/stats/users
 * Get user statistics
 */
router.get(
  "/stats/users",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "getUserStats",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /admin/stats/content
 * Get content statistics
 */
router.get(
  "/stats/content",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "getContentStats",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /admin/stats/usage
 * Get usage statistics
 */
router.get(
  "/stats/usage",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "getUsageStats",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /admin/users
 * Search users
 */
router.get(
  "/users",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "searchUsers",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * PUT /admin/users/:id
 * Update user
 */
router.put(
  "/users/:id",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "updateUser",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * DELETE /admin/users/:id
 * Delete user
 */
router.delete(
  "/users/:id",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "deleteUser",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /admin/users/activities
 * Get user activities
 */
router.get(
  "/users/activities",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "getUserActivities",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * POST /admin/knowledge/ingest
 * Ingest curriculum knowledge (RAG)
 */
router.post(
  "/knowledge/ingest",
  ...RouteFactory.createAdminRoute<AdminHandler>(
    "AdminHandler",
    "ingestKnowledge",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

export default router;
