/**
 * SendVerificationEmailUseCase - Use Case لإرسال بريد التحقق
 *
 * Use Case لإرسال بريد التحقق من البريد الإلكتروني
 */

import { IAuthRepository } from "@/domain/interfaces/repositories";
import { EmailService } from "@/application/services";
import { VerificationToken } from "@/domain/value-objects/VerificationToken";
import {
  UserNotFoundError,
  EmailAlreadyVerifiedError,
} from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger";
import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";
import { VerificationTokenData } from "@/domain/types/auth";
import { randomUUID } from "node:crypto";

export class SendVerificationEmailUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly emailService: EmailService,
    private readonly verificationTokenRepository: IVerificationTokenRepository,
  ) {}

  /**
   * تنفيذ إرسال بريد التحقق
   *
   * @param email - البريد الإلكتروني
   * @returns Promise<void>
   *
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {EmailAlreadyVerifiedError} إذا كان البريد الإلكتروني مفعّل بالفعل
   */
  async execute(email: string): Promise<void> {
    logger.info("Attempting to send verification email", { email });

    // 1. Find user by email
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      logger.warn("User not found for verification email", { email });
      throw new UserNotFoundError("المستخدم غير موجود");
    }

    // 2. Check if already verified
    if (user.isVerified) {
      logger.warn("Email already verified", { email, userId: user.id });
      throw new EmailAlreadyVerifiedError("البريد الإلكتروني مفعّل بالفعل");
    }

    // 3. Generate VerificationToken
    const verificationToken = new VerificationToken(
      user.id,
      "email_verification",
      24, // 24 hours expiration
    );

    // 4. Save token to database
    try {
      const tokenData: VerificationTokenData = {
        id: randomUUID(),
        user_id: verificationToken.getUserId(),
        token: verificationToken.getValue(),
        type: verificationToken.getType(),
        expires_at: verificationToken.getExpiresAt().toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      await this.verificationTokenRepository.save(tokenData);

      logger.info("Verification token created", {
        userId: user.id,
        email,
        tokenType: verificationToken.getType(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to save verification token", {
        userId: user.id,
        email,
        error: errorMessage,
      });
      throw new Error(`فشل حفظ رمز التحقق: ${errorMessage}`);
    }

    // 5. Send email via EmailService
    try {
      const userName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : undefined;

      await this.emailService.sendVerificationEmail(
        email,
        verificationToken.getValue(),
        userName,
      );

      logger.info("Verification email sent successfully", {
        userId: user.id,
        email,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to send verification email", {
        userId: user.id,
        email,
        error: errorMessage,
      });
      // Don't throw - token is saved, user can request another email
      throw new Error(`فشل إرسال بريد التحقق: ${errorMessage}`);
    }
  }
}
