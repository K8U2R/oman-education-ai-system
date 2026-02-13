/**
 * Device & Session Management Routes - مسارات إدارة الأجهزة والجلسات
 *
 * @law Law-1 (Modularity) - Domain Encapsulation
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { SessionHandler } from "../../../../handlers/system/session.handler.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/sessions:
 *   get:
 *     summary: قائمة الجلسات النشطة
 *     description: جلب قائمة بجميع الأجهزة والجلسات النشطة للمستخدم
 *     tags: [Authentication - Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: قائمة الجلسات
 */
router.get(
  "/sessions",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "getUserSessions",
    authMiddleware.authenticate,
  ),
);

/**
 * @swagger
 * /api/v1/auth/sessions/{sessionId}:
 *   delete:
 *     summary: إنهاء جلسة معينة
 *     description: تسجيل الخروج من جهاز معين باستخدام ID الجلسة
 *     tags: [Authentication - Session]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: تم إنهاء الجلسة
 */
router.delete(
  "/sessions/:sessionId",
  ...RouteFactory.createAuthenticatedRoute<SessionHandler>(
    "SessionHandler",
    "terminateSession",
    authMiddleware.authenticate,
  ),
);

export default router;
