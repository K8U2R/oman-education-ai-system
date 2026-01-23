/**
 * Password Security Routes - مسارات أمان كلمة المرور
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 * @law Law-2 (Gatekeeper) - Rate limiting for recovery routes
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { MiddlewareChains } from "../../../shared/middleware-helpers.js";
import { AuthHandler } from "../../../../handlers/auth/index.js";
import { authMiddleware } from "../../../../middleware/security/index.js";
import { loginRateLimitMiddleware } from "../../../../middleware/traffic/login-rate-limit.middleware.js"; // Using same for now or shared

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: طلب استعادة كلمة المرور
 *     description: إرسال بريد إلكتروني يحتوي على رابط استعادة كلمة المرور
 *     tags: [Authentication - Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: تم إرسال بريد الاستعادة
 */
router.post(
    "/forgot-password",
    ...RouteFactory.createRoute<AuthHandler>(
        "AuthHandler",
        "requestPasswordReset",
        ...MiddlewareChains.rateLimited(loginRateLimitMiddleware),
    ),
);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: إعادة تعيين كلمة المرور
 *     description: تعيين كلمة مرور جديدة باستخدام الرمز المرسل
 *     tags: [Authentication - Security]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, new_password]
 *             properties:
 *               token: { type: string }
 *               new_password: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: تم تغيير كلمة المرور بنجاح
 */
router.post(
    "/reset-password",
    ...RouteFactory.createRoute<AuthHandler>(
        "AuthHandler",
        "resetPassword",
        ...MiddlewareChains.rateLimited(loginRateLimitMiddleware),
    ),
);

/**
 * @swagger
 * /api/v1/auth/update-password:
 *   put:
 *     summary: تحديث كلمة المرور
 *     description: تحديث كلمة مرور المستخدم الحالي (يتطلب تسجيل دخول)
 *     tags: [Authentication - Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password: { type: string }
 *               new_password: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: تم تحديث كلمة المرور
 */
router.put(
    "/update-password",
    ...RouteFactory.createAuthenticatedRoute<AuthHandler>(
        "AuthHandler",
        "updatePassword",
        authMiddleware.authenticate,
    ),
);

export default router;
