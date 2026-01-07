/**
 * Auth Types - أنواع المصادقة
 *
 * هذا الملف يحتوي على جميع Types المتعلقة بالمصادقة والأدوار والصلاحيات
 */

/**
 * User Role - دور المستخدم
 */
export type UserRole = 'student' | 'teacher' | 'admin' | 'parent' | 'moderator' | 'developer'

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

/**
 * Role Permissions - صلاحيات الأدوار
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: ['lessons.view', 'storage.view', 'storage.upload', 'notifications.view'],
  teacher: [
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'storage.view',
    'storage.upload',
    'storage.delete',
    'notifications.view',
    'notifications.create',
  ],
  parent: ['lessons.view', 'storage.view', 'notifications.view'],
  moderator: [
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'lessons.delete',
    'storage.view',
    'storage.upload',
    'storage.delete',
    'notifications.view',
    'notifications.create',
    'notifications.manage',
    'users.view',
  ],
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
    // Developer permissions - similar to admin but focused on development
    'users.view',
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
    'system.view',
    'system.manage',
    'system.settings',
    'admin.dashboard',
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
export type OAuthProvider = 'google' | 'github' | 'microsoft'

/**
 * OAuthCallbackResult - نتيجة OAuth Callback
 */
export interface OAuthCallbackResult {
  user: UserData
  tokens: AuthTokens
}
