import { z } from "zod";

/**
 * Lesson Schema - مخطط الدرس المنظم
 *
 * Defined using Zod for strict validation of AI outputs.
 */
// 1. Zod Validation Schema (Matches LessonStructure)
export const LessonSchema = z.object({
  title: z.string().describe("Topic Title"),
  introduction: z.string().describe("Engaging Introduction (2-3 paragraphs)"),
  sections: z
    .array(
      z.object({
        heading: z.string().describe("Section Heading"),
        content: z
          .string()
          .describe("Detailed educational content for this section"),
        codeSnippet: z
          .string()
          .optional()
          .describe("Relevant code example if applicable (Markdown format)"),
      }),
    )
    .describe("Main lesson content divided into logical sections"),
  summary: z.string().describe("Concise summary of what was learned"),
  quizQuestions: z
    .array(
      z.object({
        question: z.string().describe("Assessment question"),
        options: z.array(z.string()).describe("List of 4 possible answers"),
        answer: z.string().describe("The correct answer from the options list"),
      }),
    )
    .optional()
    .describe("Optional quiz for self-assessment"),
});

export type GeneratedLesson = z.infer<typeof LessonSchema>;

import { PlanTier } from "@/domain/types/auth/auth.types.js";

/**
 * Identify Topic Request - طلب توليد درس
 */
export interface GenerateLessonRequest {
  topic: string;
  language: "ar" | "en";
  level?: string;
  planTier: PlanTier;
  customInstructions?: string;
}
