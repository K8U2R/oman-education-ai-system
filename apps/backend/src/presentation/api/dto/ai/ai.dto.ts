import { z } from "zod";

/**
 * Tokenize Request DTO Schema
 */
export const TokenizeRequestSchema = z.object({
  text: z.string().min(1, "النص مطلوب"),
  normalize: z.boolean().optional().default(true),
});

export type TokenizeRequestDTO = z.infer<typeof TokenizeRequestSchema>;
