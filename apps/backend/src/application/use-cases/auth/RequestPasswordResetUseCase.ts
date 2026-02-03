/**
 * RequestPasswordResetUseCase - Use Case لطلب إعادة تعيين كلمة المرور
 *
 * Use Case لإنشاء رمز إعادة تعيين كلمة المرور وإرساله عبر البريد الإلكتروني
 */

// Domain Layer - استخدام barrel exports
import {
  IAuthRepository,
  VerificationToken,
  UserNotFoundError,
} from "@/domain";

// Application Layer - استخدام barrel exports
import { EmailService } from "@/application/services/communication";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class RequestPasswordResetUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly emailService: EmailService,
  ) { }

  /**
   * يطلب إعادة تعيين كلمة المرور للمستخدم.
   *
   * @param email - البريد الإلكتروني للمستخدم.
   * @returns Promise<void>
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم.
   */
  async execute(email: string): Promise<void> {
    logger.info("Attempting to request password reset", { email });

    // 1. Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      logger.warn("User not found for password reset", { email });
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // 2. Generate password reset token (expires in 1 hour)
    const resetToken = new VerificationToken(user.id, "password_reset", 1);

    // 3. Save token to database
    await this.authRepository.createVerificationToken(
      user.id,
      resetToken.getValue(),
      resetToken.getType(),
      resetToken.getExpiresAt(),
    );

    // 4. Send password reset email
    const userName =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : undefined;

    await this.emailService.sendPasswordResetEmail(
      email,
      resetToken.getValue(),
      userName,
    );

    logger.info("Password reset email sent successfully", {
      email,
      userId: user.id,
    });
  }
}
