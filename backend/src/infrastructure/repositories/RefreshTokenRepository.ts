/**
 * Refresh Token Repository - مستودع رموز التحديث
 *
 * تطبيق IRefreshTokenRepository باستخدام Database Core Adapter
 */

import { IRefreshTokenRepository } from "@/domain/interfaces/repositories";
import { RefreshTokenData } from "@/domain/types/auth";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger";

import { randomUUID } from "crypto";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  /**
   * إنشاء Refresh Token Repository
   *
   * @param databaseAdapter - Database Core Adapter
   */
  constructor(private readonly databaseAdapter: DatabaseCoreAdapter) {}

  /**
   * إنشاء رمز تحديث جديد
   */
  async create(data: {
    user_id: string;
    token: string;
    expires_at: string;
  }): Promise<RefreshTokenData> {
    const refreshToken: RefreshTokenData = {
      id: randomUUID(),
      user_id: data.user_id,
      token: data.token,
      expires_at: data.expires_at,
      used: false,
      revoked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const result = await this.databaseAdapter.insert<RefreshTokenData>(
        "refresh_tokens",
        refreshToken as unknown as Record<string, unknown>,
      );
      logger.debug("Refresh token created", {
        tokenId: result.id,
        userId: result.user_id,
      });
      return result;
    } catch (error) {
      logger.error("Failed to create refresh token", {
        error,
        userId: data.user_id,
      });
      throw error;
    }
  }

  /**
   * البحث عن رمز التحديث
   */
  async findByToken(token: string): Promise<RefreshTokenData | null> {
    try {
      return await this.databaseAdapter.findOne<RefreshTokenData>(
        "refresh_tokens",
        { token },
      );
    } catch (error) {
      logger.error("Failed to find refresh token", { error });
      return null;
    }
  }

  /**
   * تحديث حالة رمز التحديث
   */
  async update(
    id: string,
    data: Partial<Pick<RefreshTokenData, "used" | "revoked">>,
  ): Promise<void> {
    try {
      await this.databaseAdapter.update(
        "refresh_tokens",
        { id },
        {
          ...data,
          updated_at: new Date().toISOString(),
        },
      );
      logger.debug("Refresh token updated", { tokenId: id, ...data });
    } catch (error) {
      logger.error("Failed to update refresh token", { error, tokenId: id });
      throw error;
    }
  }

  /**
   * إبطال جميع رموز المستخدم (تستخدم عند اكتشاف محاولة اختراق)
   */
  async invalidateAllForUser(userId: string): Promise<void> {
    try {
      // In a real scenario, we might want to update all non-revoked tokens
      await this.databaseAdapter.update(
        "refresh_tokens",
        { user_id: userId },
        {
          revoked: true,
          updated_at: new Date().toISOString(),
        },
      );
      logger.info("All refresh tokens invalidated for user", { userId });
    } catch (error) {
      logger.error("Failed to invalidate refresh tokens for user", {
        error,
        userId,
      });
      throw error;
    }
  }

  /**
   * حذف الرموز المنتهية (للصيانة)
   */
  async deleteExpired(): Promise<void> {
    try {
      // Note: This depends on the database core supporting range queries
      // If not supported, we would need to fetch and delete
      // For now, we'll keep it as a placeholder or implement fetch-then-delete
      logger.info("Maintenance: Removing expired refresh tokens");
    } catch (error) {
      logger.error("Failed to delete expired refresh tokens", { error });
    }
  }
}
