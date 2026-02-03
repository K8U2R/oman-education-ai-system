/**
 * Code Generation Routes - مسارات توليد الكود
 *
 * Code Generation API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { CodeGenerationHandler } from "../../../handlers/ai/code-generation.handler.js";
import { authMiddleware } from "../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * POST /code-generation/generate
 * Generate code from description
 */
router.post(
  "/generate",
  ...RouteFactory.createAuthenticatedRoute<CodeGenerationHandler>(
    "CodeGenerationHandler",
    "generateCode",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /code-generation/improve
 * Improve existing code
 */
router.post(
  "/improve",
  ...RouteFactory.createAuthenticatedRoute<CodeGenerationHandler>(
    "CodeGenerationHandler",
    "improveCode",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /code-generation/explain
 * Explain existing code
 */
router.post(
  "/explain",
  ...RouteFactory.createAuthenticatedRoute<CodeGenerationHandler>(
    "CodeGenerationHandler",
    "explainCode",
    authMiddleware.authenticate,
  ),
);

export default router;
