/**
 * Security Analytics Routes - مسارات تحليلات الأمان
 *
 * Security Analytics API endpoints
 */

import { RouteFactory } from "../shared/route-factory.js";
import { SecurityAnalyticsHandler } from "../../handlers/security/security-analytics.handler.js";
import {
  authMiddleware,
  requireDeveloper,
} from "../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /security/analytics/report
 * Get analytics report
 */
router.get(
  "/report",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getAnalyticsReport",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/login-attempts
 * Get login attempts over time
 */
router.get(
  "/login-attempts",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getLoginAttemptsOverTime",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/user-activity
 * Get user activity trend
 */
router.get(
  "/user-activity",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getUserActivityTrend",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/geographic
 * Get geographic login distribution
 */
router.get(
  "/geographic",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getGeographicDistribution",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/top-failed-logins
 * Get top failed logins
 */
router.get(
  "/top-failed-logins",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getTopFailedLogins",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/event-summary
 * Get security event summary
 */
router.get(
  "/event-summary",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getSecurityEventSummary",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/session-distribution
 * Get session distribution
 */
router.get(
  "/session-distribution",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getSessionDistribution",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/user-risk-scores
 * Get user risk scores
 */
router.get(
  "/user-risk-scores",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getUserRiskScores",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

/**
 * GET /security/analytics/metrics
 * Get security metrics
 */
router.get(
  "/metrics",
  ...RouteFactory.createAdminRoute<SecurityAnalyticsHandler>(
    "SecurityAnalyticsHandler",
    "getSecurityMetrics",
    authMiddleware.authenticate,
    requireDeveloper,
  ),
);

export default router;
