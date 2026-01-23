/**
 * Whitelist DTOs - Data Transfer Objects للقائمة البيضاء
 *
 * Zod schemas للتحقق من صحة البيانات القادمة من API
 */

import { z } from "zod";

/**
 * Permission Level Schema
 */
export const PermissionLevelSchema = z.enum([
  "developer",
  "admin",
  "super_admin",
]);

/**
 * Create Whitelist Entry Request Schema
 */
export const CreateWhitelistEntryRequestSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب")
    .transform((val) => val.toLowerCase().trim()),
  permission_level: PermissionLevelSchema,
  permissions: z.array(z.string()).min(1, "يجب تحديد صلاحية واحدة على الأقل"),
  granted_by: z.string().uuid().optional().nullable(),
  expires_at: z
    .string()
    .datetime("تاريخ انتهاء الصلاحية غير صحيح")
    .optional()
    .nullable()
    .transform((val) => val || null),
  is_permanent: z.boolean().default(false),
  notes: z.string().optional().nullable(),
});

export type CreateWhitelistEntryRequestDTO = z.infer<
  typeof CreateWhitelistEntryRequestSchema
>;

/**
 * Update Whitelist Entry Request Schema
 */
export const UpdateWhitelistEntryRequestSchema = z.object({
  permission_level: PermissionLevelSchema.optional(),
  permissions: z.array(z.string()).optional(),
  expires_at: z
    .string()
    .datetime("تاريخ انتهاء الصلاحية غير صحيح")
    .optional()
    .nullable()
    .transform((val) => val || null),
  is_active: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

export type UpdateWhitelistEntryRequestDTO = z.infer<
  typeof UpdateWhitelistEntryRequestSchema
>;

/**
 * Whitelist Entry Response Schema
 */
export const WhitelistEntryResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  permission_level: PermissionLevelSchema,
  permissions: z.array(z.string()),
  granted_by: z.string().uuid().nullable(),
  granted_at: z.string().datetime(),
  expires_at: z.string().datetime().nullable(),
  is_active: z.boolean(),
  is_permanent: z.boolean(),
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type WhitelistEntryResponseDTO = z.infer<
  typeof WhitelistEntryResponseSchema
>;

/**
 * Whitelist List Query Schema
 */
export const WhitelistListQuerySchema = z.object({
  is_active: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined,
    ),
  permission_level: PermissionLevelSchema.optional(),
  include_expired: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export type WhitelistListQueryDTO = z.infer<typeof WhitelistListQuerySchema>;

/**
 * Whitelist List Response Schema
 */
export const WhitelistListResponseSchema = z.object({
  entries: z.array(WhitelistEntryResponseSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type WhitelistListResponseDTO = z.infer<
  typeof WhitelistListResponseSchema
>;
