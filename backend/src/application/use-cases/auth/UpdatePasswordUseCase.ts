/**
 * Update Password Use Case - حالة استخدام تحديث كلمة المرور
 *
 * Use Case مسؤول عن منطق تحديث كلمة المرور
 *
 * @example
 * ```typescript
 * const updatePasswordUseCase = new UpdatePasswordUseCase(authRepository)
 * await updatePasswordUseCase.execute('user-id', 'currentPass', 'newSecurePass123')
 * ```
 */

// Domain Layer - استخدام barrel exports
import {
  IAuthRepository,
  Password,
  UserNotFoundError,
  AuthenticationFailedError,
  InvalidPasswordError,
} from "@/domain";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export interface UpdatePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class UpdatePasswordUseCase {
  /**
   * إنشاء Update Password Use Case
   *
   * @param authRepository - مستودع المصادقة
   */
  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * تنفيذ تحديث كلمة المرور
   *
   * @param request - طلب تحديث كلمة المرور
   * @returns void
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {AuthenticationFailedError} إذا كانت كلمة المرور الحالية غير صحيحة
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور الجديدة لا تلبي المتطلبات
   *
   * @example
   * ```typescript
   * await updatePasswordUseCase.execute({
   *   userId: 'user-id',
   *   currentPassword: 'CurrentPass123',
   *   newPassword: 'NewSecurePass456'
   * })
   * ```
   */
  async execute(request: UpdatePasswordRequest): Promise<void> {
    // Validate userId
    if (!request.userId || typeof request.userId !== "string") {
      logger.warn("Invalid userId in update password request", {
        userId: request.userId,
      });
      throw new UserNotFoundError("معرف المستخدم غير صحيح");
    }

    // Validate new password using Password Value Object
    let newPassword: Password;
    try {
      newPassword = new Password(request.newPassword, {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
      });
    } catch (error) {
      logger.warn("Invalid new password format", { userId: request.userId });
      if (error instanceof InvalidPasswordError) {
        throw error;
      }
      throw new InvalidPasswordError("كلمة المرور الجديدة لا تلبي المتطلبات");
    }

    // Check if new password is different from current password
    if (request.currentPassword === request.newPassword) {
      logger.warn("New password same as current password", {
        userId: request.userId,
      });
      throw new InvalidPasswordError(
        "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية",
      );
    }

    // Call repository to update password
    // Repository will handle current password verification
    try {
      await this.authRepository.updatePassword(
        request.userId,
        request.currentPassword,
        newPassword.toString(),
      );

      logger.info("Password updated successfully", { userId: request.userId });
    } catch (error: unknown) {
      // Re-throw domain exceptions as-is
      if (
        error instanceof UserNotFoundError ||
        error instanceof AuthenticationFailedError ||
        error instanceof InvalidPasswordError
      ) {
        throw error;
      }

      // Wrap unexpected errors
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Password update failed", {
        userId: request.userId,
        error: errorMessage,
      });
      throw new AuthenticationFailedError("فشل تحديث كلمة المرور");
    }
  }
}
