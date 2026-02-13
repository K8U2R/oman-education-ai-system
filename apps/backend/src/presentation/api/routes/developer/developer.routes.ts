/**
 * Developer Routes - مسارات المطور
 *
 * Developer API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { DeveloperController } from "@/modules/user/controllers/developer.controller.js";
import {
  authMiddleware,
  requireDeveloper,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /developer/stats
 * Get developer statistics
 */
router.get(
  "/stats",
  ...RouteFactory.createAdminRoute<DeveloperController>(
    "DeveloperController",
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
  ...RouteFactory.createAdminRoute<DeveloperController>(
    "DeveloperController",
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
  ...RouteFactory.createAdminRoute<DeveloperController>(
    "DeveloperController",
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
  ...RouteFactory.createAdminRoute<DeveloperController>(
    "DeveloperController",
    "getPerformanceMetrics",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

export default router;
