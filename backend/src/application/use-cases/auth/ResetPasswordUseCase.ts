/**
 * ResetPasswordUseCase - Use Case لإعادة تعيين كلمة المرور
 *
 * Use Case لإعادة تعيين كلمة المرور باستخدام رمز التحقق
 */

// Domain Layer - استخدام barrel exports
import {
  IAuthRepository,
  Password,
  VerificationTokenExpiredError,
  VerificationTokenInvalidError,
  VerificationTokenAlreadyUsedError,
  UserNotFoundError,
  InvalidPasswordError,
} from "@/domain";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * يعيد تعيين كلمة المرور للمستخدم باستخدام رمز التحقق.
   *
   * @param request - بيانات إعادة التعيين (token, newPassword)
   * @returns Promise<void>
   * @throws {VerificationTokenInvalidError} إذا كان الرمز غير صحيح.
   * @throws {VerificationTokenExpiredError} إذا كان الرمز منتهي الصلاحية.
   * @throws {VerificationTokenAlreadyUsedError} إذا تم استخدام الرمز مسبقاً.
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم.
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور الجديدة لا تلبي المتطلبات.
   */
  async execute(request: ResetPasswordRequest): Promise<void> {
    logger.info("Attempting to reset password with token");

    // 1. Find verification token
    const verificationTokenData =
      await this.authRepository.findVerificationToken(request.token);

    if (!verificationTokenData) {
      logger.warn("Password reset token not found");
      throw new VerificationTokenInvalidError(
        "رمز إعادة التعيين غير صحيح أو غير موجود",
      );
    }

    // 2. Validate token type
    if (verificationTokenData.type !== "password_reset") {
      logger.warn("Invalid token type for password reset", {
        tokenId: verificationTokenData.id,
        type: verificationTokenData.type,
      });
      throw new VerificationTokenInvalidError(
        "رمز غير صحيح لإعادة تعيين كلمة المرور",
      );
    }

    // 3. Check if token is expired
    if (new Date(verificationTokenData.expires_at) < new Date()) {
      logger.warn("Password reset token expired", {
        tokenId: verificationTokenData.id,
      });
      throw new VerificationTokenExpiredError(
        "رمز إعادة التعيين منتهي الصلاحية",
      );
    }

    // 4. Check if token is already used
    if (verificationTokenData.used) {
      logger.warn("Password reset token already used", {
        tokenId: verificationTokenData.id,
      });
      throw new VerificationTokenAlreadyUsedError(
        "تم استخدام رمز إعادة التعيين مسبقاً",
      );
    }

    // 5. Find user
    const user = await this.authRepository.findById(
      verificationTokenData.user_id,
    );
    if (!user) {
      logger.error("User associated with password reset token not found", {
        userId: verificationTokenData.user_id,
      });
      throw new UserNotFoundError(
        "المستخدم المرتبط برمز إعادة التعيين غير موجود",
      );
    }

    // 6. Validate new password
    let newPassword: Password;
    try {
      newPassword = new Password(request.newPassword);
    } catch (error) {
      if (error instanceof InvalidPasswordError) {
        throw error;
      }
      logger.warn("Invalid new password format", { userId: user.id });
      throw new InvalidPasswordError("كلمة المرور الجديدة لا تلبي المتطلبات");
    }

    // 7. Hash and update password
    const newPasswordHash = await newPassword.hash();
    await this.authRepository.updatePasswordHash(user.id, newPasswordHash);

    // 8. Mark token as used
    await this.authRepository.markVerificationTokenAsUsed(
      verificationTokenData.id,
    );

    logger.info("Password reset successfully", {
      userId: user.id,
      email: user.email.toString(),
    });
  }
}
