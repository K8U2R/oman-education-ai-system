import { z } from "zod";

/**
 * Create Project DTO Schema
 */
export const CreateProjectRequestSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب").max(200, "العنوان طويل جداً"),
  description: z.string().optional(),
  type: z.enum(["educational", "research", "assignment", "presentation"]),
  subject: z.string().optional(),
  grade_level: z.string().optional(),
  due_date: z.string().optional(),
  requirements: z.array(z.string()).optional(),
});

/**
 * Update Project DTO Schema
 */
export const UpdateProjectRequestSchema = z.object({
  title: z
    .string()
    .min(1, "العنوان مطلوب")
    .max(200, "العنوان طويل جداً")
    .optional(),
  description: z.string().optional(),
  type: z
    .enum(["educational", "research", "assignment", "presentation"])
    .optional(),
  status: z.enum(["draft", "in_progress", "completed", "archived"]).optional(),
  subject: z.string().optional(),
  grade_level: z.string().optional(),
  due_date: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  progress: z.number().int().min(0).max(100).optional(),
});

export type CreateProjectDTO = z.infer<typeof CreateProjectRequestSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectRequestSchema>;
