/**
 * IRefreshTokenRepository - واجهة مستودع رموز التحديث
 *
 * مسؤول عن إدارة رموز التحديث (Refresh Tokens) في قاعدة البيانات
 */

import { RefreshTokenData } from "../../../../types/auth/index.js";

export interface IRefreshTokenRepository {
  /**
   * إنشاء رمز تحديث جديد
   */
  create(data: {
    user_id: string;
    token: string;
    expires_at: string;
  }): Promise<RefreshTokenData>;

  /**
   * البحث عن رمز التحديث
   */
  findByToken(token: string): Promise<RefreshTokenData | null>;

  /**
   * تحديث حالة رمز التحديث
   */
  update(
    id: string,
    data: Partial<Pick<RefreshTokenData, "used" | "revoked">>,
  ): Promise<void>;

  /**
   * إبطال جميع رموز المستخدم (تستخدم عند اكتشاف محاولة اختراق)
   */
  invalidateAllForUser(userId: string): Promise<void>;

  /**
   * حذف الرموز المنتهية (للصيانة)
   */
  deleteExpired(): Promise<void>;
}
