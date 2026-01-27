/**
 * Logout Routes - مسارات تسجيل الخروج
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { AuthController } from "@/modules/auth/controllers/auth.controller.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: تسجيل الخروج
 *     description: تسجيل خروج المستخدم وإلغاء الجلسة الحالية
 *     tags: [Authentication - Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تسجيل الخروج بنجاح
 */
router.post(
    "/logout",
    ...RouteFactory.createAuthenticatedRoute<AuthController>(
        "AuthController",
        "logout",
        authMiddleware.authenticate,
    ),
);

/**
 * @swagger
 * /api/v1/auth/logout-all:
 *   post:
 *     summary: تسجيل الخروج من جميع الأجهزة
 *     description: تسجيل خروج المستخدم من جميع الجلسات
 *     tags: [Authentication - Session]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: تم تسجيل الخروج من جميع الأجهزة
 */
router.post(
    "/logout-all",
    ...RouteFactory.createAuthenticatedRoute<AuthController>(
        "AuthController",
        "logoutAll",
        authMiddleware.authenticate,
    ),
);

export default router;
