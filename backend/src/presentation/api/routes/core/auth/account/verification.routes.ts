/**
 * Verification Routes - مسارات التحقق
 * 
 * @law Law-1 (Modularity) - Domain Encapsulation
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { RegistrationHandler } from "@/modules/auth/controllers/handlers/RegistrationHandler.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: التحقق من البريد الإلكتروني
 *     tags: [Authentication - Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: تم التحقق بنجاح
 */
router.post(
    "/verify-email",
    ...RouteFactory.createRoute<RegistrationHandler>("RegistrationHandler", "verifyEmail"),
);

/**
 * @swagger
 * /api/v1/auth/send-verification:
 *   post:
 *     summary: إرسال بريد التحقق
 *     tags: [Authentication - Account]
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
 *         description: تم إرسال البريد
 */
router.post(
    "/send-verification",
    ...RouteFactory.createRoute<RegistrationHandler>(
        "RegistrationHandler",
        "sendVerificationEmail",
    ),
);

export default router;
