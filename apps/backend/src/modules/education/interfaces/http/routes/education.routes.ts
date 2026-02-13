import { Router } from "express";
import { EducationController } from "../controllers/EducationController.js";
import { authMiddleware } from "@/presentation/api/middleware/security/auth/auth.middleware.js";

const router = Router();
const controller = new EducationController();

/**
 * Education Routes
 * Prefix: /api/v1/education
 */

// POST /api/v1/education/generate
// Protected by AuthMiddleware to ensure req.user is populated
router.post(
  "/generate",
  authMiddleware.authenticate,
  controller.generateLesson,
);

export default router;
