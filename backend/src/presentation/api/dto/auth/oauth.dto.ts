/**
 * OAuth DTOs
 *
 * Data Transfer Objects لـ OAuth endpoints
 */

import { z } from "zod";

/**
 * OAuth Request DTO
 */
export const OAuthRequestSchema = z.object({
  redirect_to: z.string().url("redirect_to يجب أن يكون URL صحيح"),
});

export type OAuthRequestDTO = z.infer<typeof OAuthRequestSchema>;

/**
 * OAuth Callback DTO (from query params)
 */
export const OAuthCallbackSchema = z.object({
  code: z.string().min(1, "code مطلوب"),
  state: z.string().min(1, "state مطلوب"),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export type OAuthCallbackDTO = z.infer<typeof OAuthCallbackSchema>;
