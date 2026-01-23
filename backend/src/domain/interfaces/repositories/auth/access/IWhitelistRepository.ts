/**
 * IWhitelistRepository - واجهة مستودع القائمة البيضاء
 *
 * واجهة Domain Layer لمستودع القائمة البيضاء
 */

import { WhitelistEntry } from "../../../../entities/WhitelistEntry";
import { PermissionLevelType } from "../../../../value-objects/PermissionLevel";

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
 * Create Whitelist Entry Input - بيانات إنشاء إدخال جديد
 */
export interface CreateWhitelistEntryInput {
  email: string;
  permission_level: PermissionLevelType;
  permissions: string[];
  granted_by?: string | null;
  expires_at?: string | null;
  is_permanent?: boolean;
  notes?: string | null;
}

/**
 * Update Whitelist Entry Input - بيانات تحديث إدخال
 */
export interface UpdateWhitelistEntryInput {
  permission_level?: PermissionLevelType;
  permissions?: string[];
  expires_at?: string | null;
  is_active?: boolean;
  notes?: string | null;
}

/**
 * IWhitelistRepository - واجهة مستودع القائمة البيضاء
 */
export interface IWhitelistRepository {
  /**
   * البحث عن إدخال بالبريد الإلكتروني
   */
  findByEmail(email: string): Promise<WhitelistEntry | null>;

  /**
   * البحث عن إدخال بالمعرف
   */
  findById(id: string): Promise<WhitelistEntry | null>;

  /**
   * البحث عن جميع الإدخالات
   */
  findAll(options?: {
    isActive?: boolean;
    permissionLevel?: PermissionLevelType;
    includeExpired?: boolean;
  }): Promise<WhitelistEntry[]>;

  /**
   * إنشاء إدخال جديد
   */
  create(input: CreateWhitelistEntryInput): Promise<WhitelistEntry>;

  /**
   * تحديث إدخال موجود
   */
  update(id: string, input: UpdateWhitelistEntryInput): Promise<WhitelistEntry>;

  /**
   * حذف إدخال
   */
  delete(id: string): Promise<void>;

  /**
   * التحقق من وجود إدخال بالبريد الإلكتروني
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * البحث عن الإدخالات المنتهية
   */
  findExpired(): Promise<WhitelistEntry[]>;
}
