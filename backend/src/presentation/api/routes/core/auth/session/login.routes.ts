/**
 * Login Routes - مسارات تسجيل الدخول
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { MiddlewareChains } from "../../../shared/middleware-helpers.js";
import { LoginHandler } from "@/modules/auth/controllers/handlers/LoginHandler.js";
import { loginRateLimitMiddleware } from "../../../../middleware/traffic/login-rate-limit.middleware.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: تسجيل الدخول
 *     description: تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
 *     tags: [Authentication - Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: تسجيل الدخول نجح
 *       401:
 *         description: فشل تسجيل الدخول
 *       429:
 *         description: تم تجاوز الحد الأقصى للمحاولات
 */
router.post(
    "/login",
    ...RouteFactory.createRoute<LoginHandler>(
        "LoginHandler",
        "login",
        ...MiddlewareChains.rateLimited(loginRateLimitMiddleware),
    ),
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: تحديث رمز الوصول
 *     tags: [Authentication - Session]
 */
router.post(
    "/refresh",
    ...RouteFactory.createRoute<LoginHandler>("LoginHandler", "refreshToken"),
);

export default router;
