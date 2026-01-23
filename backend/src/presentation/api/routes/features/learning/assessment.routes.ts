/**
 * Assessment Routes - مسارات التقييمات
 *
 * Assessment API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { AssessmentHandler } from "../../../handlers/content/assessment.handler.js";
import { authMiddleware } from "../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /assessments
 * Get all assessments
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "getAssessments",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /assessments/stats
 * Get assessment statistics
 */
router.get(
  "/stats",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "getAssessmentStats",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /assessments/:id
 * Get a specific assessment
 */
router.get(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "getAssessment",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /assessments
 * Create a new assessment
 */
router.post(
  "/",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "createAssessment",
    authMiddleware.authenticate,
  ),
);

/**
 * PUT /assessments/:id
 * Update an assessment
 */
router.put(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "updateAssessment",
    authMiddleware.authenticate,
  ),
);

/**
 * DELETE /assessments/:id
 * Delete an assessment
 */
router.delete(
  "/:id",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "deleteAssessment",
    authMiddleware.authenticate,
  ),
);

/**
 * POST /assessments/:id/submit
 * Submit assessment answers
 */
router.post(
  "/:id/submit",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "submitAssessment",
    authMiddleware.authenticate,
  ),
);

/**
 * GET /assessments/:id/submission
 * Get user's submission for an assessment
 */
router.get(
  "/:id/submission",
  ...RouteFactory.createAuthenticatedRoute<AssessmentHandler>(
    "AssessmentHandler",
    "getSubmission",
    authMiddleware.authenticate,
  ),
);

export default router;
