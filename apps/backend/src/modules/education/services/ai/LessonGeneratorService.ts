import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { EducationConfig } from "../../config/education.config.js";
import { LessonSchema, GeneratedLesson, GenerateLessonRequest } from "../../domain/lesson.domain.js";
import { PlanTier } from "@/domain/types/auth/auth.types.js";
import { logger } from "@/shared/utils/logger.js";
import { AppError } from "@/core/errors/AppError.js";

/**
 * LessonGeneratorService - محرك توليد الدروس (Adaptive)
 * 
 * Responsible for generating tiered educational content using AI.
 * Implements Law-14 (Tier Supremacy).
 */
export class LessonGeneratorService extends EnhancedBaseService {
    constructor(
        databaseAdapter: DatabaseCoreAdapter,
        private readonly aiProvider: IAIProvider,
        private readonly config: EducationConfig
    ) {
        super(databaseAdapter);
    }

    protected getServiceName(): string {
        return "LessonGeneratorService";
    }

    /**
     * Generate a structured lesson from a topic with adaptive quality.
     */
    async generateLesson(request: GenerateLessonRequest): Promise<GeneratedLesson> {
        return this.executeWithEnhancements(
            async () => {
                logger.info("Generating tiered lesson", {
                    topic: request.topic,
                    tier: request.planTier
                });

                // 1. Get Adaptive Prompt based on Tier (Law-14)
                const adaptiveInstruction = this.getPromptForTier(request.planTier, request.topic);

                const systemPrompt = this.config.ai.prompts.lessonGenerator;
                const userPrompt = `
                    الموضوع: ${request.topic}
                    اللغة: ${request.language === "ar" ? "العربية" : "English"}
                    المستوى: ${request.level || "auto"}
                    
                    ${adaptiveInstruction}
                    
                    ${request.customInstructions ? `تعليمات إضافية: ${request.customInstructions}` : ""}
                `;

                // 2. AI Generation with Zod Schema Validation
                const aiResult = await this.aiProvider.generateJson<GeneratedLesson>(
                    userPrompt,
                    LessonSchema,
                    {
                        systemPrompt,
                        temperature: this.getTemperatureForTier(request.planTier),
                        maxTokens: this.getMaxTokensForTier(request.planTier)
                    }
                );

                // 3. Strict Output Validation
                const validation = LessonSchema.safeParse(aiResult);

                if (!validation.success) {
                    logger.error("AI Output Validation Failed", { errors: validation.error.format() });
                    throw new AppError(
                        "فشل في التحقق من بنية الدرس المولّد ذكياً",
                        "AI_VALIDATION_ERROR",
                        500
                    );
                }

                return validation.data;
            },
            {
                retryable: true,
                performanceTracking: true
            },
            {
                operation: "generateLesson",
                metadata: { tier: request.planTier, topic: request.topic }
            }
        );
    }

    /**
     * Adaptive Prompting Engine
     * Returns varied instructions based on the user's plan tier.
     */
    private getPromptForTier(tier: PlanTier, topic: string): string {
        switch (tier) {
            case "FREE":
                return `
                    Start Level: Beginner / General
                    Style: Simplified, conceptual, easy to read.
                    - Avoiding complex code examples.
                    - Focus on "What is it?" and "Basic usage".
                    - Keep sections short and direct.
                    - Total length: Concise.
                `;

            case "PRO":
                return `
                    Start Level: Professional / Developer
                    Style: Technical, hands-on, practical.
                    - Provide code snippets in every section.
                    - Explain "How it works" and "Why use it".
                    - Include implementation steps.
                    - Total length: Detailed.
                `;

            case "PREMIUM":
                return `
                    Start Level: Expert / Senior Architect
                    Style: Deep dive, architectural, industry-standard.
                    - Analyze Design Patterns, Security, and Scalability.
                    - Provide advanced code scenarios and edge cases.
                    - Discuss "Best Practices" and "Anti-patterns".
                    - Treat this as a mini-project documentation.
                `;

            default:
                return "Style: Standard educational content.";
        }
    }

    private getTemperatureForTier(tier: PlanTier): number {
        return tier === "PREMIUM" ? 0.7 : 0.5; // Creative for Premium, Stable for Free
    }

    private getMaxTokensForTier(tier: PlanTier): number {
        switch (tier) {
            case "FREE": return 1000;
            case "PRO": return 2500;
            case "PREMIUM": return 4000;
            default: return 1000;
        }
    }
}
