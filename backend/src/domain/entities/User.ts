/**
 * User Entity - كيان المستخدم
 *
 * Domain Entity يمثل المستخدم في النظام مع Business Logic
 *
 * @example
 * ```typescript
 * const user = User.fromData(userData)
 * console.log(user.fullName) // "أحمد محمد"
 * console.log(user.isActiveUser()) // true/false
 * ```
 */

import {
  UserData,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  PermissionSource,
} from "../types/auth/index.js";
import { Email } from "../value-objects/Email";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly username?: string,
    public readonly isActive: boolean = true,
    public readonly isVerified: boolean = false,
    public readonly avatarUrl?: string,
    public readonly role: UserRole = "student",
    public readonly permissions: Permission[] = [],
    public readonly permissionSource: PermissionSource = "default",
    public readonly whitelistEntryId: string | null = null,
    public readonly simulationRole: UserRole | null = null,
    public readonly simulationActive: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  /**
   * الحصول على الاسم الكامل
   *
   * @returns الاسم الكامل للمستخدم
   */
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    if (this.firstName) {
      return this.firstName;
    }
    if (this.username) {
      return this.username;
    }
    return this.email.toString().split("@")[0] || "User";
  }

  /**
   * الحصول على الأحرف الأولى للاسم
   *
   * @returns الأحرف الأولى للاسم
   */
  get initials(): string {
    if (this.firstName && this.lastName) {
      const first = this.firstName[0] || "";
      const last = this.lastName[0] || "";
      return `${first}${last}`.toUpperCase();
    }
    if (this.firstName && this.firstName.length > 0) {
      return (this.firstName[0] || "U").toUpperCase();
    }
    const emailStr = this.email.toString();
    if (emailStr && emailStr.length > 0) {
      return (emailStr[0] || "U").toUpperCase();
    }
    return "U";
  }

  /**
   * التحقق من أن المستخدم نشط
   *
   * @returns true إذا كان المستخدم نشطاً ومفعّلاً
   */
  isActiveUser(): boolean {
    return this.isActive && this.isVerified;
  }

  /**
   * التحقق من أن المستخدم لديه دور معين
   *
   * @param requiredRole - الدور المطلوب
   * @returns true إذا كان المستخدم لديه الدور المطلوب
   */
  hasRole(requiredRole: UserRole): boolean {
    return this.role === requiredRole;
  }

  /**
   * التحقق من أن المستخدم لديه أحد الأدوار المطلوبة
   *
   * @param requiredRoles - الأدوار المطلوبة
   * @returns true إذا كان المستخدم لديه أحد الأدوار المطلوبة
   */
  hasAnyRole(requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(this.role);
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   *
   * @param requiredPermission - الصلاحية المطلوبة
   * @param whitelistPermissions -  من القائمة البيضاء (اختياري)
   * @returns true إذا كان المستخدم لديه الصلاحية المطلوبة
   */
  hasPermission(
    requiredPermission: Permission,
    whitelistPermissions?: Permission[],
  ): boolean {
    // 1. Check if in simulation mode
    if (this.simulationActive && this.simulationRole) {
      const simulatedPermissions = ROLE_PERMISSIONS[this.simulationRole];
      return simulatedPermissions.includes(requiredPermission);
    }

    // 2. Check whitelist permissions if available
    if (this.permissionSource === "whitelist" && whitelistPermissions) {
      return whitelistPermissions.includes(requiredPermission);
    }

    // 3. Use custom permissions if available, otherwise use role permissions
    const userPermissions =
      this.permissions.length > 0
        ? this.permissions
        : ROLE_PERMISSIONS[this.role];

    return userPermissions.includes(requiredPermission);
  }

  /**
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   *
   * @param requiredPermissions -  المطلوبة
   * @param whitelistPermissions -  من القائمة البيضاء (اختياري)
   * @returns true إذا كان المستخدم لديه إحدى  المطلوبة
   */
  hasAnyPermission(
    requiredPermissions: Permission[],
    whitelistPermissions?: Permission[],
  ): boolean {
    // 1. Check if in simulation mode
    if (this.simulationActive && this.simulationRole) {
      const simulatedPermissions = ROLE_PERMISSIONS[this.simulationRole];
      return requiredPermissions.some((permission) =>
        simulatedPermissions.includes(permission),
      );
    }

    // 2. Check whitelist permissions if available
    if (this.permissionSource === "whitelist" && whitelistPermissions) {
      return requiredPermissions.some((permission) =>
        whitelistPermissions.includes(permission),
      );
    }

    // 3. Use custom permissions if available, otherwise use role permissions
    const userPermissions =
      this.permissions.length > 0
        ? this.permissions
        : ROLE_PERMISSIONS[this.role];

    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
   *
   * @param requiredPermissions -  المطلوبة
   * @param whitelistPermissions -  من القائمة البيضاء (اختياري)
   * @returns true إذا كان المستخدم لديه جميع  المطلوبة
   */
  hasAllPermissions(
    requiredPermissions: Permission[],
    whitelistPermissions?: Permission[],
  ): boolean {
    // 1. Check if in simulation mode
    if (this.simulationActive && this.simulationRole) {
      const simulatedPermissions = ROLE_PERMISSIONS[this.simulationRole];
      return requiredPermissions.every((permission) =>
        simulatedPermissions.includes(permission),
      );
    }

    // 2. Check whitelist permissions if available
    if (this.permissionSource === "whitelist" && whitelistPermissions) {
      return requiredPermissions.every((permission) =>
        whitelistPermissions.includes(permission),
      );
    }

    // 3. Use custom permissions if available, otherwise use role permissions
    const userPermissions =
      this.permissions.length > 0
        ? this.permissions
        : ROLE_PERMISSIONS[this.role];

    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  /**
   * التحقق من أن المستخدم مسؤول
   *
   * @returns true إذا كان المستخدم مسؤولاً
   */
  get isAdmin(): boolean {
    return this.role === "admin";
  }

  /**
   * التحقق من أن المستخدم معلم
   *
   * @returns true إذا كان المستخدم معلم أو مسؤول
   */
  get isTeacher(): boolean {
    return this.role === "teacher" || this.isAdmin;
  }

  /**
   * التحقق من أن المستخدم طالب
   *
   * @returns true إذا كان المستخدم طالب
   */
  get isStudent(): boolean {
    return this.role === "student";
  }

  /**
   * إنشاء User من UserData
   *
   * @param data - بيانات المستخدم من قاعدة البيانات
   * @returns User instance
   *
   * @example
   * ```typescript
   * const user = User.fromData(userData)
   * ```
   */
  static fromData(data: UserData): User {
    return new User(
      data.id,
      Email.fromString(data.email),
      data.first_name,
      data.last_name,
      data.username,
      data.is_active ?? true,
      data.is_verified ?? false,
      data.avatar_url,
      data.role ?? "student",
      data.permissions ?? [],
      data.permission_source ?? "default",
      data.whitelist_entry_id ?? null,
      data.simulation_role ?? null,
      data.simulation_active ?? false,
      new Date(data.created_at ?? new Date().toISOString()),
      new Date(data.updated_at ?? new Date().toISOString()),
    );
  }

  /**
   * تحويل User إلى UserData
   *
   * @returns UserData object
   *
   * @example
   * ```typescript
   * const userData = user.toData()
   * ```
   */
  toData(): UserData {
    return {
      id: this.id,
      email: this.email.toString(),
      first_name: this.firstName,
      last_name: this.lastName,
      username: this.username,
      avatar_url: this.avatarUrl,
      is_verified: this.isVerified,
      is_active: this.isActive,
      role: this.role,
      permissions: this.permissions,
      permission_source: this.permissionSource,
      whitelist_entry_id: this.whitelistEntryId,
      simulation_role: this.simulationRole,
      simulation_active: this.simulationActive,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  /**
   * التحقق من أن المستخدم من القائمة البيضاء
   */
  isWhitelisted(): boolean {
    return (
      this.permissionSource === "whitelist" && this.whitelistEntryId !== null
    );
  }

  /**
   * التحقق من أن المستخدم في وضع المحاكاة
   */
  isInSimulationMode(): boolean {
    return this.simulationActive && this.simulationRole !== null;
  }
}
