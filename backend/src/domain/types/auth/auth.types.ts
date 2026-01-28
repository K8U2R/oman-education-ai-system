/**
 * Auth Types - أنواع المصادقة
 *
 * Type definitions لجميع أنواع المصادقة
 */

/**
 * User Role - دور المستخدم
 */
export type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | "parent"
  | "moderator"
  | "developer";

/**
 * Plan Tier - باقة الاشتراك
 */
export type PlanTier = "FREE" | "PRO" | "PREMIUM";

/**
 * Permission - صلاحية
 */
export type Permission =
  // User Management
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "users.manage"
  // Lessons
  | "lessons.view"
  | "lessons.create"
  | "lessons.update"
  | "lessons.delete"
  | "lessons.manage"
  // Storage
  | "storage.view"
  | "storage.upload"
  | "storage.delete"
  | "storage.manage"
  // Notifications
  | "notifications.view"
  | "notifications.create"
  | "notifications.manage"
  // System
  | "system.view"
  | "system.manage"
  | "system.settings"
  // Admin
  | "admin.dashboard"
  | "admin.users"
  | "admin.settings"
  | "admin.reports"
  // Whitelist
  | "whitelist.view"
  | "whitelist.create"
  | "whitelist.update"
  | "whitelist.delete"
  | "whitelist.manage"
  // Role Simulation
  | "role-simulation.enable"
  | "role-simulation.manage";

/**
 * Role Permissions - صلاحيات الأدوار
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    "lessons.view",
    "storage.view",
    "storage.upload",
    "notifications.view",
  ],
  teacher: [
    "lessons.view",
    "lessons.create",
    "lessons.update",
    "storage.view",
    "storage.upload",
    "storage.delete",
    "notifications.view",
    "notifications.create",
  ],
  parent: ["lessons.view", "storage.view", "notifications.view"],
  moderator: [
    "lessons.view",
    "lessons.create",
    "lessons.update",
    "lessons.delete",
    "storage.view",
    "storage.upload",
    "storage.delete",
    "notifications.view",
    "notifications.create",
    "notifications.manage",
    "users.view",
  ],
  admin: [
    "users.view",
    "users.create",
    "users.update",
    "users.delete",
    "users.manage",
    "lessons.view",
    "lessons.create",
    "lessons.update",
    "lessons.delete",
    "lessons.manage",
    "storage.view",
    "storage.upload",
    "storage.delete",
    "storage.manage",
    "notifications.view",
    "notifications.create",
    "notifications.manage",
    "system.view",
    "system.manage",
    "system.settings",
    "admin.dashboard",
    "admin.users",
    "admin.settings",
    "admin.reports",
  ],
  developer: [
    "users.view",
    "lessons.view",
    "lessons.create",
    "lessons.update",
    "lessons.delete",
    "lessons.manage",
    "storage.view",
    "storage.upload",
    "storage.delete",
    "storage.manage",
    "notifications.view",
    "notifications.create",
    "system.view",
    "system.manage",
    "system.settings",
    "admin.dashboard",
  ],
};

/**
 * Permission Source - مصدر
 */
export type PermissionSource = "default" | "whitelist";

/**
 * UserData - بيانات المستخدم من قاعدة البيانات
 *
 * يستخدم snake_case للتوافق مع قاعدة البيانات
 */
export interface UserData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  role: UserRole;
  planTier: PlanTier;
  permissions: Permission[];
  password_hash?: string;
  permission_source?: PermissionSource;
  whitelist_entry_id?: string | null;
  simulation_role?: UserRole | null;
  simulation_active?: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * AuthTokens - رموز المصادقة
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
}

/**
 * LoginRequest - طلب تسجيل الدخول
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * RegisterRequest - طلب التسجيل
 */
export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  role?: UserRole;
}

/**
 * LoginResponse - استجابة تسجيل الدخول
 */
export interface LoginResponse {
  user: UserData;
  tokens: AuthTokens;
}

/**
 * LoginDto - بيانات تسجيل الدخول
 * Alias for LoginRequest for naming consistency
 */
export type LoginDto = LoginRequest;

/**
 * RegisterDto - بيانات التسجيل
 * Alias for RegisterRequest for naming consistency
 */
export type RegisterDto = RegisterRequest;

/**
 * AuthResponse - استجابة المصادقة الموحدة
 */
export type AuthResponse = LoginResponse;

/**
 * GoogleProfile - بيانات حساب جوجل
 */
export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  verified_email?: boolean;
}

/**
 * RefreshTokenRequest - طلب تحديث Token
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * RefreshTokenResponse - استجابة تحديث Token
 */
export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

/**
 * VerificationTokenData - بيانات رمز التحقق
 */
export interface VerificationTokenData {
  id: string;
  user_id: string;
  token: string;
  type: "email_verification" | "password_reset";
  expires_at: string;
  used: boolean;
  created_at: string;
}

/**
 * RefreshTokenData - بيانات رمز التحديث المحفوظة
 */
export interface RefreshTokenData {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  revoked: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * SendVerificationEmailRequest - طلب إرسال بريد التحقق
 */
export interface SendVerificationEmailRequest {
  email: string;
}

/**
 * VerifyEmailRequest - طلب التحقق من البريد الإلكتروني
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * VerifyEmailResponse - استجابة التحقق من البريد الإلكتروني
 */
export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  user: UserData;
}

/**
 * RoleCheckResult - نتيجة التحقق من الدور
 */
export interface RoleCheckResult {
  hasRole: boolean;
  missingRoles?: UserRole[];
}

/**
 * PermissionCheckResult - نتيجة التحقق من الصلاحية
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  missingPermissions?: Permission[];
}

// ============================================================================
// Google OAuth Types
// ============================================================================

export interface GoogleOAuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface GoogleOAuthCallbackResponse {
  tokens: GoogleOAuthTokens;
  user: GoogleUserProfile;
}

// ============================================================================
// Whitelist Types
// ============================================================================

export type PermissionLevel = "developer" | "admin" | "super_admin";

export interface WhitelistEntryDto {
  id: string;
  email: string;
  permission_level: PermissionLevel;
  permissions: string[];
  granted_by?: string | null;
  granted_at: string;
  expires_at?: string | null;
  is_active: boolean;
  is_permanent: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhitelistFilter {
  is_active?: boolean;
  permission_level?: PermissionLevel;
  include_expired?: boolean;
}

export interface WhitelistEntryResponse {
  entries: WhitelistEntryDto[];
  total: number;
}

