/**
 * AssessmentService Tests - اختبارات خدمة التقييمات
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { AssessmentService } from "./AssessmentService";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import {
    Assessment,
    CreateAssessmentRequest,
    UpdateAssessmentRequest,
    SubmitAssessmentRequest,
    AssessmentSubmission,
} from "@/domain/types/shared";

describe("AssessmentService", () => {
    let assessmentService: AssessmentService;
    let mockDatabaseAdapter: DatabaseCoreAdapter;

    beforeEach(() => {
        mockDatabaseAdapter = {
            find: vi.fn(),
            findOne: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        } as unknown as DatabaseCoreAdapter;

        assessmentService = new AssessmentService(mockDatabaseAdapter);
    });

    describe("createAssessment", () => {
        it("should create assessment successfully", async () => {
            // Arrange
            const userId = "user-123";
            const request: CreateAssessmentRequest = {
                title: "Test Quiz",
                type: "quiz",
                total_points: 100,
                passing_score: 60,
                questions: [
                    {
                        type: "multiple_choice",
                        question: "What is 2+2?",
                        options: ["3", "4", "5", "6"],
                        correct_answer: "4",
                        points: 10,
                        order: 0,
                    },
                ],
            };

            const mockAssessment: Assessment = {
                id: "assess-123",
                lesson_id: undefined,
                learning_path_id: undefined,
                title: "Test Quiz",
                description: undefined,
                type: "quiz",
                status: "draft",
                total_points: 100,
                passing_score: 60,
                time_limit: undefined,
                questions: request.questions.map((q, index) => ({
                    ...q,
                    id: `q-${index + 1}`,
                    order: index,
                })),
                created_by: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: undefined,
            };

            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockAssessment);

            // Act
            const result = await assessmentService.createAssessment(request, userId);

            // Assert
            expect(result).toEqual(mockAssessment);
            expect(mockDatabaseAdapter.insert).toHaveBeenCalled();
        });
    });

    describe("updateAssessment", () => {
        it("should update assessment successfully", async () => {
            // Arrange
            const assessmentId = "assess-123";
            const userId = "user-123";
            const request: UpdateAssessmentRequest = {
                title: "Updated Quiz",
                status: "published",
            };

            const existingAssessment: Assessment = {
                id: assessmentId,
                lesson_id: undefined,
                learning_path_id: undefined,
                title: "Test Quiz",
                description: undefined,
                type: "quiz",
                status: "draft",
                total_points: 100,
                passing_score: 60,
                time_limit: undefined,
                questions: "[]",
                created_by: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: undefined,
            };

            const updatedAssessment: Assessment = {
                ...existingAssessment,
                title: "Updated Quiz",
                status: "published",
                updated_at: new Date().toISOString(),
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(
                existingAssessment,
            );
            vi.mocked(mockDatabaseAdapter.update).mockResolvedValue(
                updatedAssessment,
            );

            // Act
            const result = await assessmentService.updateAssessment(
                assessmentId,
                request,
                userId,
            );

            // Assert
            expect(result).toEqual(updatedAssessment);
            expect(result.title).toBe("Updated Quiz");
            expect(result.status).toBe("published");
        });

        it("should throw error if assessment not found", async () => {
            // Arrange
            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

            // Act & Assert
            await expect(
                assessmentService.updateAssessment(
                    "invalid-id",
                    { title: "Test" },
                    "user-123",
                ),
            ).rejects.toThrow("التقييم غير موجود");
        });
    });

    describe("deleteAssessment", () => {
        it("should delete assessment successfully", async () => {
            // Arrange
            const assessmentId = "assess-123";
            const userId = "user-123";
            const existingAssessment: Assessment = {
                id: assessmentId,
                lesson_id: undefined,
                learning_path_id: undefined,
                title: "Test Quiz",
                description: undefined,
                type: "quiz",
                status: "draft",
                total_points: 100,
                passing_score: 60,
                time_limit: undefined,
                questions: "[]",
                created_by: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: undefined,
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(
                existingAssessment,
            );
            vi.mocked(mockDatabaseAdapter.delete).mockResolvedValue(true);

            // Act
            await assessmentService.deleteAssessment(assessmentId, userId);

            // Assert
            expect(mockDatabaseAdapter.delete).toHaveBeenCalledWith("assessments", {
                id: assessmentId,
            });
        });
    });

    describe("getAssessments", () => {
        it("should return assessments list", async () => {
            // Arrange
            const mockAssessments: Assessment[] = [
                {
                    id: "assess-1",
                    lesson_id: undefined,
                    learning_path_id: undefined,
                    title: "Quiz 1",
                    description: undefined,
                    type: "quiz",
                    status: "published",
                    total_points: 100,
                    passing_score: 60,
                    time_limit: undefined,
                    questions: [],
                    created_by: "user-123",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    due_date: undefined,
                },
            ];

            const mockSubmissions: AssessmentSubmission[] = [];

            vi.mocked(mockDatabaseAdapter.find).mockImplementation(async (table) => {
                if (table === "assessments") return mockAssessments;
                if (table === "assessment_submissions") return mockSubmissions;
                return [];
            });
            vi.mocked(mockDatabaseAdapter.count).mockResolvedValue(
                mockAssessments.length,
            );

            // Act
            const result = await assessmentService.getAssessments();

            // Assert
            expect(result).toHaveProperty("assessments");
            expect(result).toHaveProperty("total");
            expect(result).toHaveProperty("page");
            expect(result).toHaveProperty("per_page");
            expect(result).toHaveProperty("total_pages");
            expect(Array.isArray(result.assessments)).toBe(true);
        });
    });

    describe("getAssessment", () => {
        it("should return assessment if found", async () => {
            // Arrange
            const assessmentId = "assess-123";
            const mockAssessment: Assessment = {
                id: assessmentId,
                lesson_id: undefined,
                learning_path_id: undefined,
                title: "Test Quiz",
                description: undefined,
                type: "quiz",
                status: "published",
                total_points: 100,
                passing_score: 60,
                time_limit: undefined,
                questions: "[]",
                created_by: "user-123",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: undefined,
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockAssessment);

            // Act
            const result = await assessmentService.getAssessment(assessmentId);

            // Assert
            expect(result).toEqual(mockAssessment);
        });

        it("should throw error if assessment not found", async () => {
            // Arrange
            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

            // Act & Assert
            await expect(
                assessmentService.getAssessment("invalid-id"),
            ).rejects.toThrow("التقييم غير موجود");
        });
    });

    describe("submitAssessment", () => {
        it("should submit assessment successfully", async () => {
            // Arrange
            const assessmentId = "assess-123";
            const userId = "user-123";
            const request: SubmitAssessmentRequest = {
                answers: [
                    {
                        question_id: "q-1",
                        answer: "4",
                    },
                ],
            };

            const mockAssessment: Assessment = {
                id: assessmentId,
                lesson_id: undefined,
                learning_path_id: undefined,
                title: "Test Quiz",
                description: undefined,
                type: "quiz",
                status: "published",
                total_points: 100,
                passing_score: 60,
                time_limit: undefined,
                questions: [
                    {
                        id: "q-1",
                        type: "multiple_choice",
                        question: "What is 2+2?",
                        options: ["3", "4", "5", "6"],
                        correct_answer: "4",
                        points: 10,
                        order: 0,
                    },
                ],
                created_by: "user-123",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                due_date: undefined,
            };

            const mockSubmission: AssessmentSubmission = {
                id: "sub-123",
                assessment_id: assessmentId,
                user_id: userId,
                status: "submitted",
                answers: [
                    {
                        question_id: "q-1",
                        answer: "4",
                        is_correct: true,
                        points_earned: 10,
                    },
                ],
                total_score: 10,
                percentage: 10,
                started_at: new Date().toISOString(),
                submitted_at: new Date().toISOString(),
                graded_at: new Date().toISOString(),
                graded_by: "system",
                feedback: "لم تنجح في التقييم",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                // Extra fields returned by service
                submission_id: "sub-123",
                score: 10,
                passed: false,
            } as AssessmentSubmission;

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockAssessment);
            vi.mocked(mockDatabaseAdapter.insert).mockResolvedValue(mockSubmission);

            // Act
            const result = await assessmentService.submitAssessment(
                assessmentId,
                request,
                userId,
            );

            // Assert
            expect(result).toEqual(mockSubmission);
            expect(result.total_score).toBe(10);
            expect(mockDatabaseAdapter.insert).toHaveBeenCalled();
        });
    });

    describe("getSubmission", () => {
        it("should return submission if found", async () => {
            // Arrange
            const assessmentId = "assess-123";
            const userId = "user-123";
            const mockSubmission: AssessmentSubmission = {
                id: "sub-123",
                assessment_id: assessmentId,
                user_id: userId,
                status: "submitted",
                answers: [],
                total_score: 80,
                percentage: 80,
                started_at: new Date().toISOString(),
                submitted_at: new Date().toISOString(),
                graded_at: new Date().toISOString(),
                graded_by: "system",
                feedback: undefined,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(mockSubmission);

            // Act
            const result = await assessmentService.getSubmission(
                assessmentId,
                userId,
            );

            // Assert
            expect(result).toEqual(mockSubmission);
        });

        it("should return null if submission not found", async () => {
            // Arrange
            vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

            // Act
            const result = await assessmentService.getSubmission(
                "assess-123",
                "user-123",
            );

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("getAssessmentStats", () => {
        it("should return assessment stats", async () => {
            // Arrange
            const mockAssessments: Assessment[] = [
                {
                    id: "assess-1",
                    lesson_id: undefined,
                    learning_path_id: undefined,
                    title: "Quiz 1",
                    description: undefined,
                    type: "quiz",
                    status: "published",
                    total_points: 100,
                    passing_score: 60,
                    time_limit: undefined,
                    questions: [],
                    created_by: "user-123",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    due_date: undefined,
                },
            ];

            const mockSubmissions: AssessmentSubmission[] = [
                {
                    id: "sub-1",
                    assessment_id: "assess-1",
                    user_id: "user-123",
                    status: "submitted",
                    answers: [],
                    total_score: 80,
                    percentage: 80,
                    started_at: new Date().toISOString(),
                    submitted_at: new Date().toISOString(),
                    graded_at: new Date().toISOString(),
                    graded_by: "system",
                    feedback: undefined,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];

            vi.mocked(mockDatabaseAdapter.find).mockImplementation(async (table) => {
                if (table === "assessments") return mockAssessments;
                if (table === "assessment_submissions") return mockSubmissions;
                return [];
            });

            // Act
            const result = await assessmentService.getAssessmentStats();

            // Assert
            expect(result).toHaveProperty("total_assessments");
            expect(result).toHaveProperty("total_submissions");
            expect(result).toHaveProperty("average_score");
            expect(result).toHaveProperty("pass_rate");
            expect(result).toHaveProperty("by_type");
        });
    });
});
