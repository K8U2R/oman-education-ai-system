/**
 * Monitoring Routes - مسارات المراقبة
 *
 * Routes for Error Tracking and Performance Monitoring
 */

import { RouteFactory } from "../shared/route-factory.js";
import { MonitoringHandler } from "../../handlers/system/monitoring.handler.js";
import { authMiddleware } from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * Error Tracking Routes
 */

/**
 * GET /monitoring/errors/stats
 */
router.get(
  "/errors/stats",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getErrorStats",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /monitoring/errors
 */
router.get(
  "/errors",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getErrors",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /monitoring/errors/:id
 */
router.get(
  "/errors/:id",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getError",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /monitoring/errors/:id/resolve
 */
router.post(
  "/errors/:id/resolve",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "resolveError",
    authMiddleware.authenticate,
  ),
);

/**
 * Performance Tracking Routes
 */

/**
 * GET /monitoring/performance/stats
 */
router.get(
  "/performance/stats",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getPerformanceStats",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /monitoring/performance
 */
router.get(
  "/performance",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getPerformanceMetrics",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /monitoring/performance/endpoint/:endpoint
 */
router.get(
  "/performance/endpoint/:endpoint",
  ...RouteFactory.createAuthenticatedRoute<MonitoringHandler>(
    "MonitoringHandler",
    "getEndpointPerformance",
    authMiddleware.authenticate,
  ),
);

export default router;
