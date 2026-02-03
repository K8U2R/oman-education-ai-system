/**
 * LearningService Tests - اختبارات خدمة التعلم
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { LearningService } from "./LearningService";
import type { IAIProvider } from "@/domain";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import {
    LearningLesson,
    LessonExplanation,
    LessonExamples,
    LessonVideos,
    LessonMindMap,
} from "@/domain/types";

describe("LearningService", () => {
    let learningService: LearningService;
    let mockAIProvider: IAIProvider;
    let mockDatabaseAdapter: DatabaseCoreAdapter;

    beforeEach(() => {
        mockAIProvider = {
            chatCompletion: vi.fn(),
            generateCode: vi.fn(),
            healthCheck: vi.fn(),
        } as unknown as IAIProvider;

        mockDatabaseAdapter = {
            find: vi.fn(),
            findOne: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        } as unknown as DatabaseCoreAdapter;

        learningService = new LearningService(mockAIProvider, mockDatabaseAdapter);
    });

    describe("getLessonExplanation", () => {
        it("should return lesson explanation successfully", async () => {
            // Arrange
            const lessonId = "lesson-123";
            const mockLesson: LearningLesson = {
                id: lessonId,
                title: "Test Lesson",
                content: "Test content",
                difficulty_level: "beginner",
                subject_id: "math",
                grade_level_id: "grade1",
                order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockAIResponse = {
                content: "This is a detailed explanation",
                model: "gpt-4",
                usage: {
                    promptTokens: 50,
                    completionTokens: 50,
                    totalTokens: 100,
                },
            };

            const mockExplanation: LessonExplanation = {
                lesson_id: lessonId,
                explanation: "This is a detailed explanation",
                language: "ar",
                style: "simple",
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockLesson);
            vi.mocked(mockAIProvider.chatCompletion).mockResolvedValue(
                mockAIResponse,
            );
            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockExplanation);

            // Act
            const result = await learningService.getLessonExplanation(
                lessonId,
                "ar",
                "simple",
            );

            // Assert
            expect(result).toHaveProperty("lesson_id", lessonId);
            expect(result).toHaveProperty("explanation");
            expect(mockDatabaseAdapter.findOne).toHaveBeenCalledWith("lessons", {
                id: lessonId,
            });
            expect(mockAIProvider.chatCompletion).toHaveBeenCalled();
        });

        it("should throw error if lesson not found", async () => {
            // Arrange
            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

            // Act & Assert
            await expect(
                learningService.getLessonExplanation("invalid-id", "ar", "simple"),
            ).rejects.toThrow("الدرس غير موجود");
        });
    });

    describe("getLessonExamples", () => {
        it("should return lesson examples successfully", async () => {
            // Arrange
            const lessonId = "lesson-123";
            const mockLesson: LearningLesson = {
                id: lessonId,
                title: "Test Lesson",
                content: "Test content",
                difficulty_level: "beginner",
                subject_id: "math",
                grade_level_id: "grade1",
                order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockAIResponse = {
                content: JSON.stringify([
                    { example: "Example 1", solution: "Solution 1" },
                    { example: "Example 2", solution: "Solution 2" },
                ]),
                model: "gpt-4",
                usage: {
                    promptTokens: 50,
                    completionTokens: 50,
                    totalTokens: 100,
                },
            };

            const mockExamples: LessonExamples = {
                lesson_id: lessonId,
                examples: [
                    {
                        id: 1,
                        question: "Example 1",
                        solution: "Solution 1",
                        explanation: "Explanation 1",
                        difficulty: "easy",
                    },
                    {
                        id: 2,
                        question: "Example 2",
                        solution: "Solution 2",
                        explanation: "Explanation 2",
                        difficulty: "medium",
                    },
                ],
                count: 2,
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockLesson);
            vi.mocked(mockAIProvider.chatCompletion).mockResolvedValue(
                mockAIResponse,
            );
            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockExamples);

            // Act
            const result = await learningService.getLessonExamples(lessonId, 2);

            // Assert
            expect(result).toHaveProperty("lesson_id", lessonId);
            expect(result).toHaveProperty("examples");
            expect(Array.isArray(result.examples)).toBe(true);
        });
    });

    describe("getLessonVideos", () => {
        it("should return lesson videos successfully", async () => {
            // Arrange
            const lessonId = "lesson-123";
            const mockLesson: LearningLesson = {
                id: lessonId,
                title: "Test Lesson",
                content: "Test content",
                difficulty_level: "beginner",
                subject_id: "math",
                grade_level_id: "grade1",
                order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockAIResponse = {
                content: JSON.stringify([
                    {
                        id: "video-1",
                        title: "Video 1",
                        description: "Description 1",
                        thumbnail: "https://example.com/thumb1.jpg",
                        url: "https://youtube.com/video1",
                        platform: "youtube" as const,
                        duration: 300,
                    },
                ]),
                model: "gpt-4",
                usage: {
                    promptTokens: 50,
                    completionTokens: 50,
                    totalTokens: 100,
                },
            };

            const mockVideos: LessonVideos = {
                lesson_id: lessonId,
                videos: [
                    {
                        id: "video-1",
                        title: "Video 1",
                        description: "Description 1",
                        thumbnail: "https://example.com/thumb1.jpg",
                        url: "https://youtube.com/video1",
                        platform: "youtube",
                        duration: 300,
                    },
                ],
                count: 1,
                source: "youtube",
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockLesson);
            vi.mocked(mockAIProvider.chatCompletion).mockResolvedValue(
                mockAIResponse,
            );
            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockVideos);

            // Act
            const result = await learningService.getLessonVideos(lessonId);

            // Assert
            expect(result).toHaveProperty("lesson_id", lessonId);
            expect(result).toHaveProperty("videos");
            expect(Array.isArray(result.videos)).toBe(true);
        });
    });

    describe("getLessonMindMap", () => {
        it("should return lesson mind map successfully", async () => {
            // Arrange
            const lessonId = "lesson-123";
            const mockLesson: LearningLesson = {
                id: lessonId,
                title: "Test Lesson",
                content: "Test content",
                difficulty_level: "beginner",
                subject_id: "math",
                grade_level_id: "grade1",
                order: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const mockAIResponse = {
                content: JSON.stringify({
                    nodes: [{ id: "1", label: "Node 1", type: "root" }],
                    edges: [],
                }),
                model: "gpt-4",
                usage: {
                    promptTokens: 50,
                    completionTokens: 50,
                    totalTokens: 100,
                },
            };

            const mockMindMap: LessonMindMap = {
                lesson_id: lessonId,
                nodes: [{ id: "1", label: "Node 1", type: "root" }],
                edges: [],
                format: "json",
                // @ts-expect-error - Testing error handling
                language: "ar",
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockLesson);
            vi.mocked(mockAIProvider.chatCompletion).mockResolvedValue(
                mockAIResponse,
            );
            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockMindMap);

            // Act
            const result = await learningService.getLessonMindMap(lessonId);

            // Assert
            expect(result).toHaveProperty("lesson_id", lessonId);
            expect(result).toHaveProperty("nodes");
            expect(result).toHaveProperty("edges");
            expect(Array.isArray(result.nodes)).toBe(true);
            expect(Array.isArray(result.edges)).toBe(true);
        });
    });
});
