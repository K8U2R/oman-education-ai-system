/**
 * Security Routes - مسارات الأمان
 *
 * Security API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { SecurityHandler } from "../../handlers/security/security.handler.js";
import {
  authMiddleware,
  requireAdmin,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /security/stats
 * Get security statistics
 */
router.get(
  "/stats",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "getSecurityStats",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/logs
 * Get security logs
 */
router.get(
  "/logs",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "getSecurityLogs",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/logs/export
 * Export security logs
 */
router.get(
  "/logs/export",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "exportSecurityLogs",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/settings
 * Get security settings
 */
router.get(
  "/settings",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "getSecuritySettings",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * PUT /security/settings
 * Update security settings
 */
router.put(
  "/settings",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "updateSecuritySettings",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/routes
 * Get route protection rules
 */
router.get(
  "/routes",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "getRouteProtectionRules",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * POST /security/routes
 * Create route protection rule
 */
router.post(
  "/routes",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "createRouteProtectionRule",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * PUT /security/routes/:id
 * Update route protection rule
 */
router.put(
  "/routes/:id",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "updateRouteProtectionRule",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * DELETE /security/routes/:id
 * Delete route protection rule
 */
router.delete(
  "/routes/:id",
  ...RouteFactory.createAdminRoute<SecurityHandler>(
    "SecurityHandler",
    "deleteRouteProtectionRule",
    authMiddleware.authenticate,
    requireAdmin,
  ),
);

/**
 * GET /security/alerts
 * Get security alerts
 */
router.get(
  "/alerts",
  ...RouteFactory.createAuthenticatedRoute<SecurityHandler>(
    "SecurityHandler",
    "getSecurityAlerts",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /security/alerts/:id/read
 * Mark alert as read
 */
router.post(
  "/alerts/:id/read",
  ...RouteFactory.createAuthenticatedRoute<SecurityHandler>(
    "SecurityHandler",
    "markAlertAsRead",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /security/alerts/read-all
 * Mark all alerts as read
 */
router.post(
  "/alerts/read-all",
  ...RouteFactory.createAuthenticatedRoute<SecurityHandler>(
    "SecurityHandler",
    "markAllAlertsAsRead",
    authMiddleware.authenticate,
  ),
);

export default router;
