import { EducationalLesson } from "@/domain/entities/education/EducationalLesson.js";
import { EducationLevel } from "@/domain/types/education-types.js";

/**
 * Generate Lesson Request DTO
 * Input data required to trigger lesson generation
 */
export interface GenerateLessonRequest {
  trackId: string;
  unitId: string;
  topic: string;
  level: EducationLevel;
  additionalContext?: string; // Optional context for the AI
}

/**
 * Generate Lesson Response DTO
 * The result returned to the controller
 */
export interface GenerateLessonResponse {
  lesson: EducationalLesson;
  usage: {
    tokensConsumed: number;
    model: string;
    processingTimeMs?: number;
  };
}

/**
 * AI Schema Interface (Internal)
 * Defines the expected structure of the AI's JSON response
 */
export interface AILessonSchema {
  title: string;
  summary: string;
  contentMarkdown: string; // The main educational content
  keywords: string[];
  quiz: {
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}
