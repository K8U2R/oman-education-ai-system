/**
 * Security DTOs - Data Transfer Objects للأمان
 *
 * DTOs للتحقق من صحة البيانات في Security API
 */

import { z } from "zod";

/**
 * Get Security Stats Request
 */
export const GetSecurityStatsRequestSchema = z.object({});

export type GetSecurityStatsRequest = z.infer<
  typeof GetSecurityStatsRequestSchema
>;

/**
 * Get Security Logs Request
 */
export const GetSecurityLogsRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  eventType: z
    .enum([
      "login_attempt",
      "login_success",
      "login_failed",
      "logout",
      "password_change",
      "password_reset",
      "email_verification",
      "two_factor_enabled",
      "two_factor_disabled",
      "session_created",
      "session_terminated",
      "session_expired",
      "permission_granted",
      "permission_revoked",
      "role_changed",
      "account_locked",
      "account_unlocked",
      "suspicious_activity",
      "rate_limit_exceeded",
      "unauthorized_access_attempt",
      "data_access",
      "data_modification",
      "data_deletion",
      "api_call",
      "file_upload",
      "file_download",
      "export_data",
      "import_data",
      "settings_change",
      "route_access",
      "ip_blocked",
      "ip_unblocked",
      "device_registered",
      "device_unregistered",
      "backup_created",
      "backup_restored",
      "system_update",
      "security_policy_updated",
      "audit_log_accessed",
    ] as const)
    .optional(),
  severity: z.enum(["info", "warning", "error", "critical"]).optional(),
  resolved: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  ipAddress: z.string().ip().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(50),
});

export type GetSecurityLogsRequest = z.infer<
  typeof GetSecurityLogsRequestSchema
>;

/**
 * Update Security Settings Request
 */
export const UpdateSecuritySettingsRequestSchema = z.object({
  maxLoginAttempts: z.number().int().positive().max(20).optional(),
  lockoutDuration: z.number().int().positive().max(1440).optional(), // minutes
  passwordMinLength: z.number().int().positive().max(128).optional(),
  passwordRequireUppercase: z.boolean().optional(),
  passwordRequireLowercase: z.boolean().optional(),
  passwordRequireNumbers: z.boolean().optional(),
  passwordRequireSymbols: z.boolean().optional(),
  twoFactorEnabled: z.boolean().optional(),
  sessionTimeout: z.number().int().positive().max(1440).optional(), // minutes
  maxConcurrentSessions: z.number().int().positive().max(50).optional(),
  rateLimitEnabled: z.boolean().optional(),
  rateLimitRequests: z.number().int().positive().max(10000).optional(),
  rateLimitWindow: z.number().int().positive().max(3600).optional(), // seconds
  alertOnSuspiciousLogin: z.boolean().optional(),
  alertOnPasswordChange: z.boolean().optional(),
});

export type UpdateSecuritySettingsRequest = z.infer<
  typeof UpdateSecuritySettingsRequestSchema
>;

/**
 * Create Route Protection Rule Request
 */
export const CreateRouteProtectionRuleRequestSchema = z.object({
  routePath: z.string().min(1).max(255),
  routePattern: z.string().min(1).max(255),
  requiredRoles: z.array(z.string()).default([]),
  requiredPermissions: z.array(z.string()).default([]),
  rateLimitEnabled: z.boolean().default(false),
  rateLimitMax: z.number().int().positive().max(10000).default(100),
  rateLimitWindow: z.number().int().positive().max(3600).default(60), // seconds
  isActive: z.boolean().default(true),
  description: z.string().max(500).optional(),
});

export type CreateRouteProtectionRuleRequest = z.infer<
  typeof CreateRouteProtectionRuleRequestSchema
>;

/**
 * Update Route Protection Rule Request
 */
export const UpdateRouteProtectionRuleRequestSchema = z.object({
  routePath: z.string().min(1).max(255).optional(),
  routePattern: z.string().min(1).max(255).optional(),
  requiredRoles: z.array(z.string()).optional(),
  requiredPermissions: z.array(z.string()).optional(),
  rateLimitEnabled: z.boolean().optional(),
  rateLimitMax: z.number().int().positive().max(10000).optional(),
  rateLimitWindow: z.number().int().positive().max(3600).optional(),
  isActive: z.boolean().optional(),
  description: z.string().max(500).optional(),
});

export type UpdateRouteProtectionRuleRequest = z.infer<
  typeof UpdateRouteProtectionRuleRequestSchema
>;

/**
 * Get Security Alerts Request
 */
export const GetSecurityAlertsRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  alertType: z
    .enum([
      "suspicious_login",
      "password_breach",
      "unusual_activity",
      "multiple_failed_logins",
      "new_device",
      "new_location",
      "permission_change",
      "role_change",
      "account_locked",
      "session_compromised",
      "data_breach_attempt",
      "rate_limit_exceeded",
    ] as const)
    .optional(),
  severity: z.enum(["info", "warning", "error", "critical"]).optional(),
  isRead: z.boolean().optional(),
  actionRequired: z.boolean().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(50),
});

export type GetSecurityAlertsRequest = z.infer<
  typeof GetSecurityAlertsRequestSchema
>;

/**
 * Mark Alert As Read Request
 */
export const MarkAlertAsReadRequestSchema = z.object({
  alertId: z.string().uuid(),
});

export type MarkAlertAsReadRequest = z.infer<
  typeof MarkAlertAsReadRequestSchema
>;

/**
 * Export Security Logs Request
 */
export const ExportSecurityLogsRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  eventType: z.string().optional(),
  severity: z.enum(["info", "warning", "error", "critical"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  format: z.enum(["csv", "json"]).default("csv"),
});

export type ExportSecurityLogsRequest = z.infer<
  typeof ExportSecurityLogsRequestSchema
>;
