/**
 * General AI Routes - مسارات الذكاء الاصطناعي العامة
 *
 * General AI API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { AIHandler } from "../../../handlers/ai/ai.handler.js";
import { authMiddleware, validateBody } from "../../../middleware/security/index.js";
import { TokenizeRequestSchema } from "../../../dto/ai/ai.dto.js";

const router = RouteFactory.createFeatureRouter();

import { SSEService } from "../../../../../infrastructure/services/communication/SSEService.js";

/**
 * POST /ai/tokenize
 * Tokenize text
 */
router.post(
  "/tokenize",
  validateBody(TokenizeRequestSchema),
  ...RouteFactory.createAuthenticatedRoute<AIHandler>(
    "AIHandler",
    "tokenize",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /ai/stream
 * Connect to SSE Stream for AI responses
 */
router.get("/stream", (req, res) => {
  // Use userId from auth middleware (which looks at query param 'token' too)
  // We use optional auth here because sometimes we might want to allow guest access with a session ID
  // But strictly, we should assume authMiddleware works.
  // Let's wrap it manually or use the middleware.
  // Ideally, authMiddleware.authenticate should have run.
  // But RouteFactory.createAuthenticatedRoute mounts the middleware.
  // Here we are manual.

  // Actually, let's use authMiddleware manually if needed, or rely on global middleware?
  // No, global middleware shouldn't block public routes.
  // Let's trust authMiddleware.authenticate to populate req.user / req.userId

  authMiddleware.authenticate(req, res, () => {
    const userId = req.userId || (req.query.userId as string) || "guest";
    SSEService.getInstance().addClient(userId, res);
  });
});

export default router;
