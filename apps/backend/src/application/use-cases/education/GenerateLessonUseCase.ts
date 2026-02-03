import { IEducationalRepository } from "@/domain/interfaces/repositories/IEducationalRepository.js";
import { IAIProvider } from "@/domain/interfaces/ai/IAIProvider.js";
import { EducationalLesson } from "@/domain/entities/education/EducationalLesson.js";
import { AIMetadata } from "@/domain/types/education-types.js";
import { GenerateLessonRequest, GenerateLessonResponse, AILessonSchema } from "@/application/dtos/education/lesson.dtos.js";
import { LESSON_GENERATION_SYSTEM_PROMPT, constructUserPrompt } from "@/application/prompts/lesson.prompts.js";
import { logger } from "@/shared/utils/logger.js";

/**
 * GenerateGenericLessonUseCase
 * 
 * Orchestrates the creation of a lesson by:
 * 1. Preparing the Prompt
 * 2. Calling the AI Provider
 * 3. Mapping the result to the Domain Entity
 * 4. Persisting the new Lesson
 */
export class GenerateLessonUseCase {
    constructor(
        private readonly educationalRepository: IEducationalRepository,
        private readonly aiProvider: IAIProvider
    ) { }

    async execute(request: GenerateLessonRequest): Promise<GenerateLessonResponse> {
        logger.info("Generating Lesson...", { topic: request.topic, level: request.level });

        const startTime = Date.now();

        // 1. Prepare Prompt
        const prompt = constructUserPrompt(request.topic, request.level, request.additionalContext);

        // 2. Call AI
        // We expect AILessonSchema structure back
        const aiResponse = await this.aiProvider.generateJson<AILessonSchema>(
            prompt,
            JSON.parse('{}'), // Schema is strictly enforced by system prompt mostly, but can pass schema obj if provider supports it 
            {
                systemPrompt: LESSON_GENERATION_SYSTEM_PROMPT,
                temperature: 0.7,
                maxTokens: 2500
            }
        );

        // 3. Create Entity
        // We generate a temporary ID or let DB handle UUIDs. 
        // For Domain purity, let's create a UUID here if we had a UUID generator, 
        // but for now, we'll assume the entity creation might need a UUID. 
        // Let's rely on a helper or random string for the entity in memory before persistence.
        const tempId = crypto.randomUUID();

        // Note: orderIndex should ideally be calculated based on existing lessons in the unit.
        // For this MVP Use Case, we'll fetch unit lessons count or just default to 1.
        // Simplification: default to 1 for now.

        const lesson = EducationalLesson.create(
            tempId,
            request.unitId,
            aiResponse.title,
            1
        );

        const aiMetadata: AIMetadata = {
            model: "gpt-4o", // Should come from provider response effectively
            promptUsed: prompt.substring(0, 100) + "...",
            tokensConsumed: 0, // Provider usually returns this, assuming 0 for MVP if not available
            generatedAt: new Date(),
            version: "1.0.0"
        };

        lesson.setAIContent(aiResponse.contentMarkdown, aiMetadata);

        // 4. Persistence
        const savedLesson = await this.educationalRepository.addLesson(lesson);

        logger.info("Lesson Generated & Saved", { lessonId: savedLesson.id });

        return {
            lesson: savedLesson,
            usage: {
                tokensConsumed: aiMetadata.tokensConsumed,
                model: aiMetadata.model,
                processingTimeMs: Date.now() - startTime
            }
        };
    }
}
