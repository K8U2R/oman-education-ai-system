import { Router } from "express";
import { AssessmentController } from "./AssessmentController";
import { TierGuard } from "../../presentation/middleware/TierGuard";
import { PlanTier } from "@prisma/client";

const router = Router();

// Law 14: Only PRO+ can get AI Grading?
// Or maybe specific assessments are locked.
// For now, let's protect it as a premium AI feature.
router.post(
  "/:id/submit",
  TierGuard(PlanTier.PRO),
  AssessmentController.submitAnswer,
);

export default router;
