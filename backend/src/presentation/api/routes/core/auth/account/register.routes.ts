/**
 * Register Routes - مسارات التسجيل
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 * @law Law-2 (Gatekeeper) - Restricted registration inputs (No role selection)
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { MiddlewareChains } from "../../../shared/middleware-helpers.js";
import { RegistrationHandler } from "@/modules/auth/controllers/handlers/RegistrationHandler.js";
import { loginRateLimitMiddleware } from "../../../../middleware/traffic/login-rate-limit.middleware.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: التسجيل (إنشاء حساب جديد)
 *     description: إنشاء حساب مستخدم جديد. المستخدم الجديد هو دائماً student افتراضياً.
 *     tags: [Authentication - Account]
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
 *                 minLength: 8
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: تم إنشاء الحساب بنجاح
 *       409:
 *         description: المستخدم موجود بالفعل
 */
router.post(
    "/register",
    ...RouteFactory.createRoute<RegistrationHandler>(
        "RegistrationHandler",
        "register",
        ...MiddlewareChains.rateLimited(loginRateLimitMiddleware),
    ),
);

export default router;
