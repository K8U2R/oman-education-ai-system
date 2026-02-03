/**
 * Auth Types - أنواع المصادقة
 *
 * هذا الملف يحتوي على جميع Types المتعلقة بالمصادقة والأدوار و
 */

/**
 * User Role - دور المستخدم
 */
export type UserRole =
  | 'student'
  | 'admin'
  | 'parent'
  | 'developer'
  | 'guest'
  | 'moderator'
  | 'teacher'

/**
 * Permission - صلاحية
 */
export type Permission =
  // User Management
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'users.manage'
  // Lessons
  | 'lessons.view'
  | 'lessons.create'
  | 'lessons.update'
  | 'lessons.delete'
  | 'lessons.manage'
  // Storage
  | 'storage.view'
  | 'storage.upload'
  | 'storage.delete'
  | 'storage.manage'
  // Notifications
  | 'notifications.view'
  | 'notifications.create'
  | 'notifications.manage'
  // System
  | 'system.view'
  | 'system.manage'
  | 'system.settings'
  // Admin
  | 'admin.dashboard'
  | 'admin.users'
  | 'admin.settings'
  | 'admin.reports'
  // Database Core
  | 'database-core.view'
  | 'database-core.metrics.view'
  | 'database-core.connections.manage'
  | 'database-core.cache.manage'
  | 'database-core.explore'
  | 'database-core.query.execute'
  | 'database-core.transactions.view'
  | 'database-core.audit.view'
  | 'database-core.backups.manage'
  | 'database-core.migrations.manage'
  // Whitelist
  | 'whitelist.view'
  | 'whitelist.create'
  | 'whitelist.update'
  | 'whitelist.delete'
  | 'whitelist.manage'
  // Role Simulation
  | 'role-simulation.enable'
  | 'role-simulation.manage'

/**
 * Role Permissions - صلاحيات الأدوار
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  guest: [],
  student: ['lessons.view', 'storage.view', 'storage.upload', 'notifications.view'],
  parent: ['lessons.view', 'storage.view', 'notifications.view'],
  admin: [
    // All permissions
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'users.manage',
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'lessons.delete',
    'lessons.manage',
    'storage.view',
    'storage.upload',
    'storage.delete',
    'storage.manage',
    'notifications.view',
    'notifications.create',
    'notifications.manage',
    'system.view',
    'system.manage',
    'system.settings',
    'admin.dashboard',
    'admin.users',
    'admin.settings',
    'admin.reports',
  ],
  developer: [
    // Developer permissions - All admin permissions + additional dev permissions
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'users.manage',
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'lessons.delete',
    'lessons.manage',
    'storage.view',
    'storage.upload',
    'storage.delete',
    'storage.manage',
    'notifications.view',
    'notifications.create',
    'notifications.manage',
    'system.view',
    'system.manage',
    'system.settings',
    'admin.dashboard',
    'admin.users',
    'admin.settings',
    'admin.reports',
    'database-core.view',
    'database-core.metrics.view',
    'whitelist.manage',
    'role-simulation.enable',
    'role-simulation.manage',
  ],
  moderator: [
    'users.view',
    'users.update',
    'lessons.view',
    'lessons.manage',
    'storage.view',
    'storage.manage',
    'notifications.view',
    'notifications.create',
    'notifications.manage',
    'admin.dashboard',
    'admin.users',
    'admin.reports',
  ],
  teacher: [
    'users.view',
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'lessons.delete',
    'lessons.manage',
    'storage.view',
    'storage.upload',
    'notifications.view',
    'notifications.create',
  ],
}

/**
 * User with Role - مستخدم مع دور
 */
export interface UserWithRole {
  id: string
  email: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
  isVerified: boolean
}

/**
 * Role Check Result - نتيجة التحقق من الدور
 */
export interface RoleCheckResult {
  hasRole: boolean
  missingRoles?: UserRole[]
}

/**
 * Permission Check Result - نتيجة التحقق من الصلاحية
 */
export interface PermissionCheckResult {
  hasPermission: boolean
  missingPermissions?: Permission[]
}

/**
 * Plan Tier - باقة الاشتراك
 */
export type PlanTier = 'FREE' | 'PRO' | 'PREMIUM'

/**
 * UserData - بيانات المستخدم من API
 */
export interface UserData {
  id: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  username?: string
  avatar_url?: string
  is_verified?: boolean
  role?: UserRole
  planTier?: PlanTier
  permissions?: Permission[]
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * AuthTokens - رموز المصادقة
 */
export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
}

/**
 * LoginRequest - طلب تسجيل الدخول
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * RegisterRequest - طلب التسجيل
 */
export interface RegisterRequest {
  email: string
  password: string
  first_name?: string
  last_name?: string
  username?: string
  role?: UserRole
  accept_terms?: boolean
  accept_privacy_policy?: boolean
}

/**
 * LoginResponse - استجابة تسجيل الدخول
 */
export interface LoginResponse {
  user: UserData
  tokens: AuthTokens
}

/**
 * OAuthProvider - مزود OAuth
 */
export type OAuthProvider = 'google' | 'microsoft'

/**
 * OAuthCallbackResult - نتيجة OAuth Callback
 */
export interface OAuthCallbackResult {
  user: UserData
  tokens: AuthTokens
}
