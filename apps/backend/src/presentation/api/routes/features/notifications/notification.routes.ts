/**
 * Notification Routes - مسارات الإشعارات
 *
 * Notification API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { NotificationHandler } from "../../../handlers/communication/index.js";
import { authMiddleware } from "../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /notifications
 * Get all notifications for the authenticated user
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "getNotifications",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /notifications/stats
 * Get notification statistics for the authenticated user
 */
router.get(
  "/stats",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "getStats",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /notifications/stream
 * Real-time notifications using Server-Sent Events (SSE)
 */
router.get(
  "/stream",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "streamNotifications",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /notifications/:id
 * Get a specific notification
 */
router.get(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "getNotification",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /notifications/:id/read
 * Mark a notification as read
 */
router.post(
  "/:id/read",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "markAsRead",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /notifications/mark-all-read
 * Mark all notifications as read
 */
router.post(
  "/mark-all-read",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "markAllAsRead",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /notifications/:id
 * Delete a notification
 */
router.delete(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<NotificationHandler>(
    "NotificationHandler",
    "deleteNotification",
    authMiddleware.authenticate,
  ),
);

export default router;
