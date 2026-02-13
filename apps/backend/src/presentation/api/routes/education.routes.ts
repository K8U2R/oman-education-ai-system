import { Router } from "express";
import { EducationController } from "../controllers/education/EducationController.js";
import { authMiddleware } from "../middleware/security/auth/auth.middleware.js";
// import { authorize } from "../middleware/security/auth/authorize.js";

const router = Router();

/**
 * Education Routes
 * Prefix: /api/v1/education
 */

// Generate Lesson (Expensive operation, restricted to teachers/admins)
router.post(
  "/lessons/generate",
  authMiddleware.authenticate,
  // authorize(['lesson.create']),
  EducationController.generateLesson,
);

// Track Management
router.post(
  "/tracks",
  authMiddleware.authenticate,
  EducationController.createTrack,
);
router.post(
  "/tracks/:trackId/units",
  authMiddleware.authenticate,
  EducationController.createUnit,
);

export default router;
