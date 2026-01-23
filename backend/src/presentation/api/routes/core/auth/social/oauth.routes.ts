/**
 * OAuth Routes - مسارات المصادقة الخارجية
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 * @law Law-4 (Dynamic Documentation) - Flexible provider description
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { AuthHandler } from "../../../../handlers/auth/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/oauth/{provider}:
 *   get:
 *     summary: بدء عملية OAuth
 *     description: توجيه المستخدم إلى صفحة تسجيل الدخول للمزود المختار (مثل Google)
 *     tags: [Authentication - Social]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         description: OAuth provider (e.g., google)
 *       - in: query
 *         name: redirect_to
 *         schema:
 *           type: string
 *           format: uri
 *         description: URL للعودة بعد تسجيل الدخول
 *     responses:
 *       302:
 *         description: توجيه إلى صفحة تسجيل الدخول
 */
router.get(
    "/oauth/:provider",
    ...RouteFactory.createRoute<AuthHandler>("AuthHandler", "initiateOAuth"),
);

/**
 * @swagger
 * /api/v1/auth/oauth/{provider}/callback:
 *   get:
 *     summary: معالجة OAuth Callback
 *     description: معالجة البيانات العائدة من مزود الخدمة
 *     tags: [Authentication - Social]
 *     parameters:
 *       - in: path
 *         name: provider
 *         required: true
 *         schema:
 *           type: string
 *         description: OAuth provider
 *     responses:
 *       302:
 *         description: توجيه إلى Frontend مع tokens
 */
router.get(
    "/oauth/:provider/callback",
    ...RouteFactory.createRoute<AuthHandler>(
        "AuthHandler",
        "handleOAuthCallback",
    ),
);

export default router;
