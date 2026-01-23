/**
 * Auth DTOs - Data Transfer Objects للمصادقة
 *
 * Zod schemas للتحقق من صحة البيانات القادمة من API
 */

import { z } from "zod";

/**
 * Login Request Schema
 */
export const LoginRequestSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

/**
 * Register Request Schema
 */
export const RegisterRequestSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  role: z.enum(["student", "admin", "parent", "developer"]).optional(),
});

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;

/**
 * Refresh Token Request Schema
 */
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1, "Refresh Token مطلوب"),
});

export type RefreshTokenRequestDTO = z.infer<typeof RefreshTokenRequestSchema>;

/**
 * Update Password Request Schema
 */
export const UpdatePasswordRequestSchema = z.object({
  current_password: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  new_password: z
    .string()
    .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
});

export type UpdatePasswordRequestDTO = z.infer<
  typeof UpdatePasswordRequestSchema
>;

/**
 * Update User Request Schema
 */
export const UpdateUserRequestSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

export type UpdateUserRequestDTO = z.infer<typeof UpdateUserRequestSchema>;

/**
 * Send Verification Email Request Schema
 */
export const SendVerificationEmailRequestSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
});

export type SendVerificationEmailRequestDTO = z.infer<
  typeof SendVerificationEmailRequestSchema
>;

/**
 * Verify Email Request Schema
 */
export const VerifyEmailRequestSchema = z.object({
  token: z.string().min(1, "رمز التحقق مطلوب"),
});

export type VerifyEmailRequestDTO = z.infer<typeof VerifyEmailRequestSchema>;

/**
 * Request Password Reset Schema
 */
export const RequestPasswordResetRequestSchema = z.object({
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .min(1, "البريد الإلكتروني مطلوب"),
});

export type RequestPasswordResetRequestDTO = z.infer<
  typeof RequestPasswordResetRequestSchema
>;

/**
 * Reset Password Request Schema
 */
export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, "رمز إعادة التعيين مطلوب"),
  new_password: z
    .string()
    .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
});

export type ResetPasswordRequestDTO = z.infer<
  typeof ResetPasswordRequestSchema
>;
