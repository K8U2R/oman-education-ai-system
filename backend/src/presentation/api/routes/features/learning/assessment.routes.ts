/**
 * Assessment Routes - مسارات التقييمات
 *
 * Assessment API endpoints
 */

import { RouteFactory } from "../../shared/route-factory.js";
import { AssessmentController } from "@/modules/education/controllers/assessment.controller.js";
import { authMiddleware } from "../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * GET /assessments
 * Get all assessments
 */
router.get(
  "/",
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
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
  ...RouteFactory.createAuthenticatedRoute<AssessmentController>(
    "AssessmentController",
    "getSubmission",
    authMiddleware.authenticate,
  ),
);

export default router;
