/**
 * Security Monitoring Routes - مسارات مراقبة الأمان
 *
 * Security Monitoring API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { SecurityMonitoringHandler } from "../../handlers/security/security-monitoring.handler.js";
import {
  authMiddleware,
  requireDeveloper,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /security/monitoring/health
 * Get system health status
 */
router.get(
  "/health",
  ...RouteFactory.createAdminRoute<SecurityMonitoringHandler>(
    "SecurityMonitoringHandler",
    "getSystemHealthStatus",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/monitoring/realtime
 * Get realtime security metrics
 */
router.get(
  "/realtime",
  ...RouteFactory.createAdminRoute<SecurityMonitoringHandler>(
    "SecurityMonitoringHandler",
    "getRealtimeMetrics",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/monitoring/alert-thresholds
 * Get alert thresholds
 */
router.get(
  "/alert-thresholds",
  ...RouteFactory.createAdminRoute<SecurityMonitoringHandler>(
    "SecurityMonitoringHandler",
    "getAlertThresholds",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * PUT /security/monitoring/config
 * Update monitoring config
 */
router.put(
  "/config",
  ...RouteFactory.createAdminRoute<SecurityMonitoringHandler>(
    "SecurityMonitoringHandler",
    "updateMonitoringConfig",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

export default router;
