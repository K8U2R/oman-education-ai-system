import { Router } from "express";
import { container } from "@/infrastructure/di/Container.js";
import { AIController } from "@/modules/ai/controllers/ai.controller.js";
import { authMiddleware } from "@/presentation/api/middleware/security/auth/auth.middleware.js";
import { distributedRateLimit } from "@/presentation/api/middleware/rate-limit/distributed-rate-limit.middleware.js";
import { validateSchema } from "@/presentation/api/middleware/validation/schema-validator.middleware.js";
import { LessonGenerationSchema, CodeReviewSchema } from "@/presentation/api/schemas/lesson.schema.js";

const router = Router();

// Resolve Controller
const aiController = container.resolve<AIController>("AIController");

// Routes
router.post(
  "/lessons/generate",
  authMiddleware.authenticate,
  validateSchema(LessonGenerationSchema),
  distributedRateLimit(),
  aiController.generateLesson,
);

router.post(
  "/code/review",
  authMiddleware.authenticate,
  validateSchema(CodeReviewSchema),
  distributedRateLimit(),
  aiController.reviewCode,
);

export const aiRoutes = router;
