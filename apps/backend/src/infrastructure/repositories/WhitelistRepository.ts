/**
 * Whitelist Repository - مستودع القائمة البيضاء
 *
 * تطبيق IWhitelistRepository باستخدام Database Core Adapter
 * يستخدم BaseRepository لتقليل التكرار
 */

import {
  IWhitelistRepository,
  CreateWhitelistEntryInput,
  UpdateWhitelistEntryInput,
} from "@/domain/interfaces/repositories/auth/access/IWhitelistRepository.js";
import { WhitelistEntry } from "../../domain/entities/WhitelistEntry";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { BaseRepository } from "./BaseRepository";
import { logger } from "@/shared/utils/logger";
import { randomUUID } from "crypto";

/**
 * Whitelist Entry Database Data
 */
interface WhitelistEntryDBData {
  id: string;
  email: string;
  permission_level: string;
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

export class WhitelistRepository
  extends BaseRepository
  implements IWhitelistRepository
{
  constructor(databaseAdapter: DatabaseCoreAdapter) {
    super(databaseAdapter);
  }

  /**
   * Get repository name
   */
  protected getRepositoryName(): string {
    return "WhitelistRepository";
  }

  /**
   * البحث عن إدخال بالبريد الإلكتروني
   */
  async findByEmail(email: string): Promise<WhitelistEntry | null> {
    return this.executeWithErrorHandling(
      async () => {
        const normalizedEmail = email.toLowerCase().trim();
        const result = await this.findOne<WhitelistEntryDBData>(
          "whitelist_entries",
          {
            email: normalizedEmail,
          },
        );

        if (!result) {
          return null;
        }

        return WhitelistEntry.fromData(this.mapToEntryData(result));
      },
      "findByEmail",
      { email },
    );
  }

  /**
   * البحث عن إدخال بالمعرف
   */
  async findById(id: string): Promise<WhitelistEntry | null> {
    return this.executeWithErrorHandling(
      async () => {
        const result = await this.findOne<WhitelistEntryDBData>(
          "whitelist_entries",
          {
            id,
          },
        );

        if (!result) {
          return null;
        }

        return WhitelistEntry.fromData(this.mapToEntryData(result));
      },
      "findById",
      { id },
    );
  }

  /**
   * البحث عن جميع الإدخالات
   */
  async findAll(options?: {
    isActive?: boolean;
    permissionLevel?: string;
    includeExpired?: boolean;
  }): Promise<WhitelistEntry[]> {
    return this.executeWithErrorHandling(
      async () => {
        const conditions: Record<string, unknown> = {};

        if (options?.isActive !== undefined) {
          conditions.is_active = options.isActive;
        }

        if (options?.permissionLevel) {
          conditions.permission_level = options.permissionLevel;
        }

        const results = await this.findMany<WhitelistEntryDBData>(
          "whitelist_entries",
          conditions,
        );

        let entries = results.map((result) =>
          WhitelistEntry.fromData(this.mapToEntryData(result)),
        );

        // Filter expired entries if needed
        if (options?.includeExpired === false) {
          entries = entries.filter((entry) => !entry.isExpired());
        }

        return entries;
      },
      "findAll",
      { options },
    );
  }

  /**
   * إنشاء إدخال جديد
   */
  async create(input: CreateWhitelistEntryInput): Promise<WhitelistEntry> {
    return this.executeWithErrorHandling(
      async () => {
        const now = new Date().toISOString();
        const entryData: Omit<
          WhitelistEntryDBData,
          "id" | "created_at" | "updated_at"
        > = {
          email: input.email.toLowerCase().trim(),
          permission_level: input.permission_level,
          permissions: input.permissions,
          granted_by: input.granted_by || null,
          granted_at: input.expires_at || now,
          expires_at: input.expires_at || null,
          is_active: true,
          is_permanent: input.is_permanent || false,
          notes: input.notes || null,
        };

        const created = await this.insert<WhitelistEntryDBData>(
          "whitelist_entries",
          {
            ...entryData,
            id: randomUUID(),
            created_at: now,
            updated_at: now,
          },
        );

        return WhitelistEntry.fromData(this.mapToEntryData(created));
      },
      "create",
      { email: input.email },
    );
  }

  /**
   * تحديث إدخال موجود
   */
  async update(
    id: string,
    input: UpdateWhitelistEntryInput,
  ): Promise<WhitelistEntry> {
    return this.executeWithErrorHandling(
      async () => {
        const existing = await this.findById(id);
        if (!existing) {
          throw new Error(`Whitelist entry not found: ${id}`);
        }

        const updateData: Partial<WhitelistEntryDBData> = {
          updated_at: new Date().toISOString(),
        };

        if (input.permission_level !== undefined) {
          updateData.permission_level = input.permission_level;
        }

        if (input.permissions !== undefined) {
          updateData.permissions = input.permissions;
        }

        if (input.expires_at !== undefined) {
          updateData.expires_at = input.expires_at;
        }

        if (input.is_active !== undefined) {
          updateData.is_active = input.is_active;
        }

        if (input.notes !== undefined) {
          updateData.notes = input.notes;
        }

        const updated = await this.databaseAdapter.update<WhitelistEntryDBData>(
          "whitelist_entries",
          { id },
          updateData,
        );

        if (!updated) {
          throw new Error(`Failed to update whitelist entry: ${id}`);
        }

        return WhitelistEntry.fromData(this.mapToEntryData(updated));
      },
      "update",
      { id },
    );
  }

  /**
   * حذف إدخال
   */
  async delete(id: string): Promise<void> {
    return this.executeWithErrorHandling(
      async () => {
        const existing = await this.findById(id);
        if (!existing) {
          throw new Error(`Whitelist entry not found: ${id}`);
        }

        if (existing.isPermanent) {
          throw new Error("Cannot delete permanent whitelist entry");
        }

        await this.databaseAdapter.delete("whitelist_entries", { id });

        this.logOperation("delete", { id });
      },
      "delete",
      { id },
    );
  }

  /**
   * التحقق من وجود إدخال بالبريد الإلكتروني
   */
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const entry = await this.findByEmail(email);
      return entry !== null;
    } catch (error) {
      logger.error("Failed to check whitelist entry existence", {
        email,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * البحث عن الإدخالات المنتهية
   */
  async findExpired(): Promise<WhitelistEntry[]> {
    try {
      const results = await this.databaseAdapter.find<WhitelistEntryDBData>(
        "whitelist_entries",
        {
          is_active: true,
        },
      );

      return results
        .map((result) => WhitelistEntry.fromData(this.mapToEntryData(result)))
        .filter((entry) => entry.isExpired());
    } catch (error) {
      logger.error("Failed to find expired whitelist entries", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * تحويل بيانات قاعدة البيانات إلى Entry Data
   */
  private mapToEntryData(data: WhitelistEntryDBData) {
    return {
      id: data.id,
      email: data.email,
      permission_level: data.permission_level as
        | "developer"
        | "admin"
        | "super_admin",
      permissions: data.permissions,
      granted_by: data.granted_by || null,
      granted_at: data.granted_at,
      expires_at: data.expires_at || null,
      is_active: data.is_active,
      is_permanent: data.is_permanent,
      notes: data.notes || null,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }
}
