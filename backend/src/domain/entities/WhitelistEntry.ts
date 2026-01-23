/**
 * Whitelist Entry - إدخال القائمة البيضاء
 *
 * Entity يمثل إدخالاً في القائمة البيضاء للصلاحيات المتقدمة
 */

import {
  PermissionLevel,
  PermissionLevelType,
} from "../value-objects/PermissionLevel";
import { Permission } from "../types/auth/index.js";

/**
 * Whitelist Entry Data - بيانات إدخال القائمة البيضاء
 */
export interface WhitelistEntryData {
  id: string;
  email: string;
  permission_level: PermissionLevelType;
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

/**
 * Whitelist Entry - إدخال القائمة البيضاء
 */
export class WhitelistEntry {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    private readonly permissionLevel: PermissionLevel,
    private readonly permissions: Permission[],
    public readonly grantedBy: string | null,
    public readonly grantedAt: Date,
    public readonly expiresAt: Date | null,
    private _isActive: boolean,
    public readonly isPermanent: boolean,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * إنشاء Whitelist Entry من البيانات
   */
  static fromData(data: WhitelistEntryData): WhitelistEntry {
    return new WhitelistEntry(
      data.id,
      data.email.toLowerCase(), // Normalize email
      PermissionLevel.create(data.permission_level),
      data.permissions as Permission[],
      data.granted_by || null,
      new Date(data.granted_at),
      data.expires_at ? new Date(data.expires_at) : null,
      data.is_active,
      data.is_permanent,
      data.notes || null,
      new Date(data.created_at),
      new Date(data.updated_at),
    );
  }

  /**
   * إنشاء Whitelist Entry جديد
   */
  static create(
    email: string,
    permissionLevel: PermissionLevelType,
    permissions: Permission[],
    grantedBy: string | null = null,
    expiresAt: Date | null = null,
    isPermanent: boolean = false,
    notes: string | null = null,
  ): WhitelistEntry {
    const now = new Date();
    return new WhitelistEntry(
      crypto.randomUUID(),
      email.toLowerCase(),
      PermissionLevel.create(permissionLevel),
      permissions,
      grantedBy,
      now,
      expiresAt,
      true, // Active by default
      isPermanent,
      notes,
      now,
      now,
    );
  }

  /**
   * الحصول على مستوى
   */
  getPermissionLevel(): PermissionLevel {
    return this.permissionLevel;
  }

  /**
   * الحصول على
   */
  getPermissions(): Permission[] {
    return [...this.permissions]; // Return copy
  }

  /**
   * التحقق من أن الإدخال نشط
   */
  isActive(): boolean {
    return this._isActive;
  }

  /**
   * التحقق من أن  منتهية
   */
  isExpired(): boolean {
    if (!this.expiresAt) {
      return false; // No expiration
    }
    return new Date() > this.expiresAt;
  }

  /**
   * التحقق من أن الإدخال صالح للاستخدام
   */
  isValid(): boolean {
    return this._isActive && !this.isExpired();
  }

  /**
   * التحقق من أن المستخدم لديه صلاحية معينة
   */
  hasPermission(permission: Permission): boolean {
    if (!this.isValid()) {
      return false;
    }
    return this.permissions.includes(permission);
  }

  /**
   * التحقق من أن المستخدم لديه إحدى  المطلوبة
   */
  hasAnyPermission(requiredPermissions: Permission[]): boolean {
    if (!this.isValid()) {
      return false;
    }
    return requiredPermissions.some((permission) =>
      this.permissions.includes(permission),
    );
  }

  /**
   * التحقق من أن المستخدم لديه جميع  المطلوبة
   */
  hasAllPermissions(requiredPermissions: Permission[]): boolean {
    if (!this.isValid()) {
      return false;
    }
    return requiredPermissions.every((permission) =>
      this.permissions.includes(permission),
    );
  }

  /**
   * تعطيل الإدخال
   */
  deactivate(): void {
    if (this.isPermanent) {
      throw new Error("لا يمكن تعطيل إدخال دائم في القائمة البيضاء");
    }
    this._isActive = false;
  }

  /**
   * تفعيل الإدخال
   */
  activate(): void {
    this._isActive = true;
  }

  /**
   * تحديث
   */
  updatePermissions(permissions: Permission[]): void {
    if (this.isPermanent && this.permissionLevel.isSuperAdmin()) {
      throw new Error("لا يمكن تحديث صلاحيات Super Admin الدائم");
    }
    // Update permissions (in real implementation, this would be handled by repository)
    (this.permissions as Permission[]) = permissions;
  }

  /**
   * التحويل إلى بيانات
   */
  toData(): WhitelistEntryData {
    return {
      id: this.id,
      email: this.email,
      permission_level: this.permissionLevel.getValue(),
      permissions: this.permissions,
      granted_by: this.grantedBy,
      granted_at: this.grantedAt.toISOString(),
      expires_at: this.expiresAt?.toISOString() || null,
      is_active: this._isActive,
      is_permanent: this.isPermanent,
      notes: this.notes,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
