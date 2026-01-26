/**
 * Profile Routes - مسارات الملف الشخصي
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { AuthHandler } from "../../../../handlers/auth/index.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: الحصول على معلومات المستخدم الحالي
 *     description: جلب معلومات المستخدم المصادق عليه
 *     tags: [Authentication - Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: معلومات المستخدم
 */
router.get(
    "/me",
    ...RouteFactory.createAuthenticatedRoute<AuthHandler>(
        "AuthHandler",
        "me",
        authMiddleware.authenticate,
    ),
);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   patch:
 *     summary: تحديث الملف الشخصي
 *     description: تحديث البيانات الشخصية للمستخدم الحالي
 *     tags: [Authentication - Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: تم تحديث البيانات
 */
router.patch(
    "/profile",
    ...RouteFactory.createAuthenticatedRoute<AuthHandler>(
        "AuthHandler",
        "update",
        authMiddleware.authenticate,
    ),
);

export default router;
