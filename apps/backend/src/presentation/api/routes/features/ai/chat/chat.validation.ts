import { z } from "zod";

export const InteractRequestSchema = z.object({
  message: z
    .string()
    .min(1, "الرسالة لا يمكن أن تكون فارغة")
    .max(2000, "الرسالة طويلة جداً"),
  userId: z.string().uuid("معرف المستخدم غير صالح"),
  sessionId: z
    .string()
    .uuid("معرف الجلسة غير صالح")
    .optional()
    .default(() => crypto.randomUUID()),
  context: z
    .object({
      currentSubject: z.string().optional(),
      proficiencyLevel: z.number().min(1).max(5).default(3), // Default to Intermediate
    })
    .optional(),
});

export type InteractRequest = z.infer<typeof InteractRequestSchema>;
