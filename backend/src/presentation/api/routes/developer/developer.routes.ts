/**
 * Developer Routes - مسارات المطور
 *
 * Developer API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { DeveloperHandler } from "../../handlers/admin/developer.handler.js";
import { authMiddleware, requireDeveloper } from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /developer/stats
 * Get developer statistics
 */
router.get(
  "/stats",
  ...RouteFactory.createAdminRoute<DeveloperHandler>(
    "DeveloperHandler",
    "getDeveloperStats",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /developer/api-endpoints
 * Get API endpoints information
 */
router.get(
  "/api-endpoints",
  ...RouteFactory.createAdminRoute<DeveloperHandler>(
    "DeveloperHandler",
    "getAPIEndpoints",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /developer/services
 * Get services information
 */
router.get(
  "/services",
  ...RouteFactory.createAdminRoute<DeveloperHandler>(
    "DeveloperHandler",
    "getServices",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /developer/performance
 * Get performance metrics
 */
router.get(
  "/performance",
  ...RouteFactory.createAdminRoute<DeveloperHandler>(
    "DeveloperHandler",
    "getPerformanceMetrics",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

export default router;
