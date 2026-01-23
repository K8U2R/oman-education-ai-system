/**
 * User Entity - كيان المستخدم
 *
 * Domain Entity يمثل المستخدم في النظام
 */

import { UserData, UserRole, Permission } from '../types/auth.types'
import { RoleService } from '../services/role.service'

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly username?: string,
    public readonly isActive: boolean = true,
    public readonly isVerified: boolean = false,
    public readonly avatarUrl?: string,
    public readonly role: UserRole = 'student',
    public readonly permissions: Permission[] = [],
    public readonly createdAt: string = new Date().toISOString(),
    public readonly updatedAt: string = new Date().toISOString()
  ) {}

  /**
   * الحصول على الاسم الكامل
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    }
    if (this.firstName) {
      return this.firstName
    }
    if (this.username) {
      return this.username
    }
    return this.email?.split('@')[0] || 'User'
  }

  /**
   * الحصول على الأحرف الأولى للاسم
   */
  get initials(): string {
    if (this.firstName && this.lastName) {
      const first = this.firstName[0] || ''
      const last = this.lastName[0] || ''
      return `${first}${last}`.toUpperCase()
    }
    if (this.firstName && this.firstName.length > 0) {
      return (this.firstName[0] || 'U').toUpperCase()
    }
    if (this.email && this.email.length > 0) {
      return (this.email[0] || 'U').toUpperCase()
    }
    return 'U'
  }

  /**
   * التحقق من أن المستخدم نشط
   */
  isActiveUser(): boolean {
    return this.isActive && this.isVerified
  }

  /**
   * التحقق من أن المستخدم لديه دور معين
   */
  hasRole(requiredRole: UserRole): boolean {
    return RoleService.hasRole(this.role, requiredRole)
  }

  /**
   * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
   */
  hasAnyRole(requiredRoles: UserRole[]): boolean {
    return RoleService.hasAnyRole(this.role, requiredRoles)
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   */
  hasPermission(requiredPermission: Permission): boolean {
    // استخدام  المخصصة إذا كانت موجودة، وإلا استخدام صلاحيات الدور
    const userPermissions =
      this.permissions.length > 0 ? this.permissions : RoleService.getRolePermissions(this.role)

    return RoleService.hasPermission(userPermissions, requiredPermission)
  }

  /**
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   */
  hasAnyPermission(requiredPermissions: Permission[]): boolean {
    const userPermissions =
      this.permissions.length > 0 ? this.permissions : RoleService.getRolePermissions(this.role)

    return RoleService.hasAnyPermission(userPermissions, requiredPermissions)
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
   */
  hasAllPermissions(requiredPermissions: Permission[]): boolean {
    const userPermissions =
      this.permissions.length > 0 ? this.permissions : RoleService.getRolePermissions(this.role)

    return RoleService.hasAllPermissions(userPermissions, requiredPermissions).hasPermission
  }

  /**
   * الحصول على  الفعالة (المخصصة أو صلاحيات الدور)
   */
  getEffectivePermissions(): Permission[] {
    // إذا كان المستخدم لديه صلاحيات مخصصة، استخدمها
    if (this.permissions.length > 0) {
      return this.permissions
    }
    // وإلا استخدم صلاحيات الدور الافتراضية
    return RoleService.getRolePermissions(this.role)
  }

  /**
   * التحقق من أن المستخدم مسؤول
   */
  get isAdmin(): boolean {
    return this.role === 'admin'
  }

  /**
   * التحقق من أن المستخدم معلم
   */
  get isTeacher(): boolean {
    return this.role === 'teacher' || this.isAdmin
  }

  /**
   * التحقق من أن المستخدم طالب
   */
  get isStudent(): boolean {
    return this.role === 'student'
  }

  /**
   * إنشاء User من UserData
   */
  static fromData(data: UserData): User {
    return new User(
      data.id,
      data.email,
      data.first_name,
      data.last_name,
      data.username,
      data.is_active ?? true,
      data.is_verified ?? false,
      data.avatar_url,
      data.role ?? 'student',
      data.permissions ?? [],
      data.created_at ?? new Date().toISOString(),
      data.updated_at ?? new Date().toISOString()
    )
  }

  /**
   * تحويل User إلى UserData
   */
  toData(): UserData {
    return {
      id: this.id,
      email: this.email,
      first_name: this.firstName ?? undefined,
      last_name: this.lastName ?? undefined,
      username: this.username ?? undefined,
      is_active: this.isActive,
      is_verified: this.isVerified,
      avatar_url: this.avatarUrl ?? undefined,
      role: this.role,
      permissions: this.permissions,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
}
