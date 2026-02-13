import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { BaseController } from "@/shared/core/BaseController.js";
import { LessonGeneratorService } from "@/modules/education/services/ai/LessonGeneratorService.js";
import { z } from "zod";
import { handleError } from "@/presentation/api/utils/response.helper.js";

// Validation Schemas for Requests
const GenerateLessonRequestSchema = z.object({
  topic: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  language: z.enum(["ar", "en"]).default("ar"),
});

@injectable()
export class AIController extends BaseController {
  constructor(
    @inject(LessonGeneratorService)
    private lessonGenerator: LessonGeneratorService,
  ) {
    super();
  }

  /**
   * POST /api/v1/ai/lessons/generate
   * Generate a structured lesson plan
   */
  generateLesson = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Validate Input
      const validated = GenerateLessonRequestSchema.parse(req.body);

      // 2. Call Service
      const lesson = await this.lessonGenerator.generateLesson(
        validated.topic,
        validated.subject,
        validated.gradeLevel,
        validated.language as "ar" | "en",
      );

      // 3. Return Response (201 Created)
      this.created(res, lesson);
    } catch (error) {
      handleError(
        res,
        error,
        "Internal Server Error",
        "INTERNAL_SERVER_ERROR",
        req.language,
      );
    }
  };

  /**
   * POST /api/v1/ai/code/review
   * Review code snippet
   */
  reviewCode = async (_req: Request, res: Response): Promise<void> => {
    // Stub implementation for now
    this.ok(res, {
      review: "Code review feature is coming soon.",
      suggestions: [],
    });
    return;
  };
}
