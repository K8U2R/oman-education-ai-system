/**
 * VerificationToken - Value Object لرمز التحقق
 *
 * يمثل رمز التحقق من البريد الإلكتروني أو إعادة تعيين كلمة المرور
 */

import { randomBytes } from "node:crypto";

export type VerificationTokenType = "email_verification" | "password_reset";

export class VerificationToken {
  private readonly value: string;
  private readonly expiresAt: Date;
  private readonly userId: string;
  private readonly type: VerificationTokenType;

  /**
   * إنشاء VerificationToken جديد
   *
   * @param userId - معرف المستخدم
   * @param type - نوع الرمز (email_verification أو password_reset)
   * @param expiresInHours - مدة الصلاحية بالساعات (افتراضي: 24 ساعة)
   */
  constructor(
    userId: string,
    type: VerificationTokenType,
    expiresInHours: number = 24,
  ) {
    if (!userId || typeof userId !== "string") {
      throw new Error("userId مطلوب ويجب أن يكون نصاً");
    }

    if (!type || (type !== "email_verification" && type !== "password_reset")) {
      throw new Error("type يجب أن يكون email_verification أو password_reset");
    }

    if (expiresInHours <= 0) {
      throw new Error("expiresInHours يجب أن يكون أكبر من 0");
    }

    this.userId = userId;
    this.type = type;
    this.value = this.generateToken();
    this.expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  }

  /**
   * توليد رمز تحقق عشوائي (64 حرف hex)
   *
   * @returns رمز التحقق
   * @private
   */
  private generateToken(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * الحصول على قيمة الرمز
   *
   * @returns قيمة الرمز
   */
  getValue(): string {
    return this.value;
  }

  /**
   * الحصول على تاريخ انتهاء الصلاحية
   *
   * @returns تاريخ انتهاء الصلاحية
   */
  getExpiresAt(): Date {
    return this.expiresAt;
  }

  /**
   * الحصول على معرف المستخدم
   *
   * @returns معرف المستخدم
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * الحصول على نوع الرمز
   *
   * @returns نوع الرمز
   */
  getType(): VerificationTokenType {
    return this.type;
  }

  /**
   * التحقق من انتهاء صلاحية الرمز
   *
   * @returns true إذا انتهت الصلاحية
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * التحقق من صحة الرمز
   *
   * @param token - الرمز المراد التحقق منه
   * @returns true إذا كان الرمز صحيحاً
   */
  equals(token: string): boolean {
    return this.value === token;
  }

  /**
   * تحويل الرمز إلى بيانات قابلة للحفظ
   *
   * @returns بيانات الرمز
   */
  toData(): {
    token: string;
    user_id: string;
    type: VerificationTokenType;
    expires_at: string;
  } {
    return {
      token: this.value,
      user_id: this.userId,
      type: this.type,
      expires_at: this.expiresAt.toISOString(),
    };
  }
}
