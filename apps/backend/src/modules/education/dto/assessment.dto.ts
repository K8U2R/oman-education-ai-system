import { z } from "zod";

/**
 * Create Assessment DTO Schema
 */
export const CreateAssessmentRequestSchema = z.object({
    lesson_id: z.string().optional(),
    learning_path_id: z.string().optional(),
    title: z.string().min(1, "العنوان مطلوب").max(200, "العنوان طويل جداً"),
    description: z.string().optional(),
    type: z.enum(["quiz", "assignment", "exam", "project"]),
    status: z.enum(["draft", "published", "archived"]).optional(),
    total_points: z.number().int().min(1, "النقاط الإجمالية مطلوبة"),
    passing_score: z
        .number()
        .int()
        .min(0, "نقاط النجاح يجب أن تكون أكبر من أو تساوي 0"),
    time_limit: z.number().int().min(1).optional(),
    questions: z
        .array(
            z.object({
                question: z.string().min(1, "السؤال مطلوب"),
                type: z.enum([
                    "multiple_choice",
                    "true_false",
                    "short_answer",
                    "essay",
                    "code",
                ]),
                points: z.number().int().min(1, "النقاط مطلوبة"),
                options: z.array(z.string()).optional(),
                correct_answer: z.union([z.string(), z.array(z.string())]).optional(),
                explanation: z.string().optional(),
                order: z.number().int().min(0),
            }),
        )
        .min(1, "يجب تحديد سؤال واحد على الأقل"),
    due_date: z.string().optional(),
});

/**
 * Submit Assessment DTO Schema
 */
export const SubmitAssessmentRequestSchema = z.object({
    answers: z
        .array(
            z.object({
                question_id: z.string().min(1, "معرف السؤال مطلوب"),
                answer: z.union([z.string(), z.array(z.string())]),
            }),
        )
        .min(1, "يجب تقديم إجابة واحدة على الأقل"),
});

export type CreateAssessmentDTO = z.infer<typeof CreateAssessmentRequestSchema>;
export type SubmitAssessmentDTO = z.infer<typeof SubmitAssessmentRequestSchema>;
