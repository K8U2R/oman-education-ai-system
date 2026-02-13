import { Router } from "express";
import { AssessmentController } from "../../../controllers/assessment.controller.js";
import { AssessmentService } from "@/modules/education/services/AssessmentService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { authMiddleware } from "@/presentation/api/middleware/security/auth/auth.middleware.js";

const router = Router();
const dbAdapter = new DatabaseCoreAdapter();
const service = new AssessmentService(dbAdapter);
const controller = new AssessmentController(service);

/**
 * Assessment Routes
 * Base Path needs to be determined by where this is mounted.
 * Assuming mounted at /api/v1/assessments or /api/v1/education/assessments
 */

// Routes
router.get(
  "/stats",
  authMiddleware.authenticate,
  controller.getAssessmentStats,
);
router.post("/", authMiddleware.authenticate, controller.createAssessment);
router.get("/", authMiddleware.authenticate, controller.getAssessments);
router.get("/:id", authMiddleware.authenticate, controller.getAssessment);
router.put("/:id", authMiddleware.authenticate, controller.updateAssessment);
router.delete("/:id", authMiddleware.authenticate, controller.deleteAssessment);
router.post(
  "/:id/submit",
  authMiddleware.authenticate,
  controller.submitAssessment,
);
router.get(
  "/:id/results",
  authMiddleware.authenticate,
  controller.getAssessmentResults,
);

export default router;
