/**
 * VerifyEmailUseCase - Use Case للتحقق من البريد الإلكتروني
 *
 * Use Case للتحقق من البريد الإلكتروني باستخدام رمز التحقق
 */

import { IAuthRepository } from "@/domain/interfaces/repositories";
import { User } from "@/domain/entities/User";
import {
  VerificationTokenExpiredError,
  VerificationTokenInvalidError,
  VerificationTokenAlreadyUsedError,
  EmailAlreadyVerifiedError,
  UserNotFoundError,
} from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger";
import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";

export class VerifyEmailUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
  ) {}

  /**
   * تنفيذ التحقق من البريد الإلكتروني
   *
   * @param token - رمز التحقق
   * @returns Promise<User> - المستخدم المحدث
   *
   * @throws {VerificationTokenInvalidError} إذا كان الرمز غير صحيح
   * @throws {VerificationTokenExpiredError} إذا كان الرمز منتهي الصلاحية
   * @throws {VerificationTokenAlreadyUsedError} إذا كان الرمز مستخدم مسبقاً
   * @throws {EmailAlreadyVerifiedError} إذا كان البريد الإلكتروني مفعّل بالفعل
   */
  async execute(token: string): Promise<User> {
    // Validate token format (should be 64 hex characters)
    if (!token || token.length < 32) {
      logger.warn("Invalid token format", {
        tokenLength: token?.length || 0,
        tokenPreview: token?.substring(0, 20) || "empty",
      });
      throw new VerificationTokenInvalidError(
        "رمز التحقق غير صحيح أو غير مكتمل",
      );
    }

    logger.info("Attempting to verify email", {
      tokenLength: token.length,
      tokenPreview:
        token.substring(0, 8) + "..." + token.substring(token.length - 8),
    });

    // 1. Find token in database
    const tokenData = await this.verificationTokenRepository.findByTokenAndType(
      token,
      "email_verification",
    );

    if (!tokenData) {
      logger.warn("Verification token not found", {
        tokenLength: token.length,
        tokenPreview:
          token.substring(0, 8) + "..." + token.substring(token.length - 8),
        searchConditions: {
          token: token.substring(0, 20) + "...",
          type: "email_verification",
        },
      });
      throw new VerificationTokenInvalidError(
        "رمز التحقق غير صحيح أو منتهي الصلاحية",
      );
    }

    // 2. Validate token (not expired, not used)
    const expiresAt = new Date(tokenData.expires_at);
    if (new Date() > expiresAt) {
      logger.warn("Verification token expired", {
        tokenId: tokenData.id,
        expiresAt: tokenData.expires_at,
      });
      throw new VerificationTokenExpiredError("رمز التحقق منتهي الصلاحية");
    }

    if (tokenData.used) {
      logger.warn("Verification token already used", { tokenId: tokenData.id });
      throw new VerificationTokenAlreadyUsedError(
        "تم استخدام رمز التحقق مسبقاً",
      );
    }

    // 3. Find user by user_id
    const user = await this.authRepository.findById(tokenData.user_id);
    if (!user) {
      logger.error("User not found for verification token", {
        userId: tokenData.user_id,
      });
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // 4. Check if already verified
    if (user.isVerified) {
      logger.warn("Email already verified", {
        userId: user.id,
        email: user.email,
      });
      throw new EmailAlreadyVerifiedError("البريد الإلكتروني مفعّل بالفعل");
    }

    // 5. Update user.is_verified = true
    const updatedUser = await this.authRepository.updateUser(user.id, {
      is_verified: true,
    });

    logger.info("User email verified", {
      userId: user.id,
      email: user.email,
    });

    // 6. Mark token as used
    await this.verificationTokenRepository.markAsUsed(tokenData.id);

    logger.info("Verification token marked as used", {
      tokenId: tokenData.id,
      userId: user.id,
    });

    return updatedUser;
  }
}
