/**
 * Admin Routes - مسارات الإدارة
 *
 * Admin API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { AdminController } from "../../../../modules/user/controllers/admin.controller.js";
import {
  authMiddleware,
  requireAdmin,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /admin/stats/system
 * Get system statistics
 */
router.get(
  "/stats/system",
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
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
  ...RouteFactory.createAdminRoute<AdminController>(
    "AdminController",
    "getUserActivities",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * POST /admin/knowledge/ingest
 * Ingest curriculum knowledge (RAG)
 */
// router.post(
//   "/knowledge/ingest",
//   ...RouteFactory.createAdminRoute<AdminController>(
//     "AdminController",
//     // @ts-ignore - method not implemented yet
//     "ingestKnowledge",
//     authMiddleware.authenticate,
//     requireAdmin,
//   ),
// );

export default router;
