/**
 * Office Routes - مسارات Office
 *
 * Office API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { OfficeHandler } from "../../../handlers/office/office.handler.js";
import { authMiddleware } from "../../../middleware/security/index.js";
import { requireTier, requireFeature } from "../../../middleware/subscription/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * POST /office/generate
 * Generate Office file
 */
router.post(
  "/generate",
  ...RouteFactory.createAuthenticatedRoute<OfficeHandler>(
    "OfficeHandler",
    "generateOffice",
    authMiddleware.authenticate,
    requireTier({ minTier: "pro" }),
    requireFeature("office_generation"),
  ),
);

/**
 * GET /office/templates
 * Get available templates
 */
router.get(
  "/templates",
  ...RouteFactory.createAuthenticatedRoute<OfficeHandler>(
    "OfficeHandler",
    "getTemplates",
    authMiddleware.authenticate,
    requireTier({ minTier: "pro" }),
    requireFeature("office_generation"),
  ),
);

export default router;
