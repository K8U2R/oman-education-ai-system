import { Request, Response, NextFunction } from "express";
import { BaseController } from "@/shared/core/BaseController.js";
import { LessonGeneratorService } from "@/modules/education/services/ai/LessonGeneratorService.js";
import { container } from "@/infrastructure/di/Container.js";
import { GenerateLessonRequest } from "@/modules/education/domain/lesson.domain.js";
import { PlanTier } from "@/domain/types/auth/auth.types.js";

/**
 * EducationController - متحكم التعليم
 * 
 * Handles HTTP requests for the Education Module via the unified API.
 * Implements Law-14 (Tier Supremacy) by enforcing plan limits at the entry point.
 */
export class EducationController extends BaseController {
    private lessonGenerator: LessonGeneratorService;

    constructor() {
        super();
        // Lazy resolution or Constructor Injection
        this.lessonGenerator = container.resolve<LessonGeneratorService>("LessonGeneratorService");
    }

    /**
     * Generate a Lesson
     * POST /api/v1/education/generate
     */
    generateLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // 1. Sanitize & Validate Inputs
            const { topic, language, level, customInstructions } = req.body;

            if (!topic) {
                this.clientError(res, "Topic is required");
                return;
            }

            // 2. Extract Validated User Context (Law-14)
            // We TRUST req.user because it comes from AuthMiddleware
            const user = req.user;

            if (!user) {
                this.unauthorized(res);
                return;
            }

            // Force the PlanTier from the authenticated user (Critical Security Step)
            // Users cannot spoof their tier in the request body.
            const userTier: PlanTier = user.planTier || "FREE";

            // 3. Construct Secure Request
            const request: GenerateLessonRequest = {
                topic,
                language: language || "ar",
                level,
                planTier: userTier, // <--- Law-14 Enforcement
                customInstructions
            };

            // 4. Delegate to AI Service
            const result = await this.lessonGenerator.generateLesson(request);

            // 5. Success Responses
            this.created(res, result);

        } catch (error) {
            this.fail(res, error instanceof Error ? error.message : "Internal Server Error");
        }
    }
}
