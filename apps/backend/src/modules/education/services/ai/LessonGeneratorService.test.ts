import { describe, it, expect, beforeEach } from "vitest";
import "reflect-metadata"; // Required for tsyringe
import {
  LessonGeneratorService,
  LessonPlanSchema,
} from "./LessonGeneratorService";
import { MockAIProvider } from "@/modules/ai/services/MockAIProvider";

describe("LessonGeneratorService", () => {
  let service: LessonGeneratorService;
  let mockProvider: MockAIProvider;

  beforeEach(() => {
    mockProvider = new MockAIProvider();
    service = new LessonGeneratorService(mockProvider);
  });

  it("should generate a valid lesson plan using local mock", async () => {
    const result = await service.generateLesson(
      "Math",
      "Mathematics",
      "Grade 4",
      "en",
    );

    // 1. Verify Structure Matches Schema
    const validated = LessonPlanSchema.safeParse(result);
    expect(validated.success).toBe(true);
    expect(result.topic).toBe("Mock Lesson Topic"); // Expected from MockAIProvider
  });

  it("should handle Arabic language request", async () => {
    const result = await service.generateLesson(
      "القواعد",
      "اللغة العربية",
      "الخامس",
      "ar",
    );
    expect(result.language).toBe("ar");
    expect(result.content.objectives).toBeDefined();
  });
});
