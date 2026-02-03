/**
 * Session DTOs - Data Transfer Objects للجلسات
 *
 * DTOs للتحقق من صحة البيانات في Session API
 */

import { z } from "zod";

/**
 * Get User Sessions Request
 */
export const GetUserSessionsRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  deviceType: z.enum(["desktop", "mobile", "tablet", "unknown"]).optional(),
  ipAddress: z.string().ip().optional(),
  country: z.string().optional(),
});

export type GetUserSessionsRequest = z.infer<
  typeof GetUserSessionsRequestSchema
>;

/**
 * Get Session Details Request
 */
export const GetSessionDetailsRequestSchema = z.object({
  sessionId: z.string().uuid(),
});

export type GetSessionDetailsRequest = z.infer<
  typeof GetSessionDetailsRequestSchema
>;

/**
 * Terminate Session Request
 */
export const TerminateSessionRequestSchema = z.object({
  sessionId: z.string().uuid(),
});

export type TerminateSessionRequest = z.infer<
  typeof TerminateSessionRequestSchema
>;

/**
 * Terminate All Sessions Request
 */
export const TerminateAllSessionsRequestSchema = z.object({
  userId: z.string().uuid(),
  excludeSessionId: z.string().uuid().optional(),
});

export type TerminateAllSessionsRequest = z.infer<
  typeof TerminateAllSessionsRequestSchema
>;

/**
 * Refresh Session Request
 */
export const RefreshSessionRequestSchema = z.object({
  sessionId: z.string().uuid(),
  tokenHash: z.string().min(1),
  refreshTokenHash: z.string().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
});

export type RefreshSessionRequest = z.infer<typeof RefreshSessionRequestSchema>;
