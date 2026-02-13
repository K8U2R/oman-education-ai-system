import { injectable, inject } from "tsyringe";
import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { MockAIProvider } from "@/modules/ai/services/MockAIProvider.js";
import { z } from "zod";
import { logger } from "@/shared/utils/logger.js";
import { AppError } from "@/core/errors/AppError.js";

// Validation Schema (aligned with data-model.md)
export const LessonPlanSchema = z.object({
  topic: z.string(),
  subject: z.string(),
  gradeLevel: z.string(),
  language: z.enum(["ar", "en"]),
  content: z.object({
    objectives: z.array(z.string()),
    introduction: z.string(),
    mainActivity: z.string(),
    assessment: z.string(),
    homework: z.string(),
  }),
  metadata: z
    .object({
      modelUsed: z.string(),
      generationTimeMs: z.number(),
      promptVersion: z.string(),
    })
    .optional(),
});

export type LessonPlan = z.infer<typeof LessonPlanSchema>;

@injectable()
export class LessonGeneratorService {
  constructor(
    // Injecting the concrete Mock provider for now.
    // In a real setup, we'd use a token 'AIProvider'.
    @inject(MockAIProvider) private aiProvider: IAIProvider,
  ) {}

  async generateLesson(
    topic: string,
    subject: string,
    gradeLevel: string,
    language: "ar" | "en" = "ar",
  ): Promise<LessonPlan> {
    // Log the request
    logger.info("LessonGenerator: Request received", {
      topic,
      subject,
      gradeLevel,
      language,
    });

    // 1. Build the prompt
    const prompt = this.buildPrompt(topic, subject, gradeLevel, language);

    try {
      // 2. Call AI Provider (Mock or Real)
      const result = await this.aiProvider.generateJson<LessonPlan>(
        prompt,
        LessonPlanSchema,
        { systemPrompt: "You are an expert teacher." },
      );

      // 3. Validate
      const validated = LessonPlanSchema.safeParse(result);
      if (!validated.success) {
        logger.error("LessonGenerator: Validation failed", {
          errors: validated.error,
        });
        // Fallback or retry logic could go here
        throw new AppError(
          "AI generated invalid lesson structure",
          "AI_VALIDATION_ERROR",
          500,
        );
      }

      return validated.data;
    } catch (error) {
      logger.error("LessonGenerator: Operation failed", { error });
      throw new AppError(
        "Failed to generate lesson",
        "AI_GENERATION_FAILED",
        500,
      );
    }
  }

  private buildPrompt(
    topic: string,
    subject: string,
    gradeLevel: string,
    language: string,
  ): string {
    const langInstruction =
      language === "ar" ? "Respond in Arabic." : "Respond in English.";
    return `
        You are an expert teacher. Create a comprehensive lesson plan.
        
        Details:
        - Topic: ${topic}
        - Subject: ${subject}
        - Grade Level: ${gradeLevel}
        
        Instructions:
        - ${langInstruction}
        - The output must be valid JSON matching the specified schema.
        - The 'content.objectives' should be actionable.
        
        JSON Structure:
        {
            "topic": "string",
            "subject": "string",
            "gradeLevel": "string",
            "language": "ar|en",
            "content": {
                "objectives": ["string"],
                "introduction": "string",
                "mainActivity": "string",
                "assessment": "string",
                "homework": "string"
            }
        }
        `;
  }
}
