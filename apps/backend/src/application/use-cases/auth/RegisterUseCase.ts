/**
 * Register Use Case - حالة استخدام التسجيل
 *
 * Use Case مسؤول عن منطق التسجيل (إنشاء حساب جديد)
 *
 * @example
 * ```typescript
 * const registerUseCase = new RegisterUseCase(authRepository)
 * const user = await registerUseCase.execute({
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 *   first_name: 'أحمد',
 *   last_name: 'محمد'
 * })
 * ```
 */

import { IAuthRepository } from "@/domain/interfaces/repositories";
import { RegisterRequest } from "@/domain/types/auth";
import { User } from "@/domain/entities/User";
import {
  UserAlreadyExistsError,
  InvalidEmailError,
  InvalidPasswordError,
} from "@/domain/exceptions";
import { Email } from "@/domain/value-objects/Email";
import { Password } from "@/domain/value-objects/Password";
import { EmailService } from "@/application/services/communication";
import { VerificationToken } from "@/domain/value-objects/VerificationToken";

import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";
import { VerificationTokenData } from "@/domain/types/auth";

import { randomUUID } from "node:crypto";
import { logger } from "@/shared/utils/logger";

export class RegisterUseCase {
  /**
   * إنشاء Register Use Case
   *
   * @param authRepository - مستودع المصادقة
   * @param emailService - خدمة البريد الإلكتروني (اختياري)
   * @param verificationTokenRepository - مستودع رموز التحقق
   */
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly emailService?: EmailService,
    private readonly verificationTokenRepository?: IVerificationTokenRepository,
  ) {}

  /**
   * تنفيذ التسجيل
   *
   * @param request - طلب التسجيل
   * @returns User instance
   * @throws {UserAlreadyExistsError} إذا كان المستخدم موجوداً بالفعل
   * @throws {InvalidEmailError} إذا كان البريد الإلكتروني غير صحيح
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور لا تلبي المتطلبات
   *
   * @example
   * ```typescript
   * const user = await registerUseCase.execute({
   *   email: 'user@example.com',
   *   password: 'SecurePass123',
   *   first_name: 'أحمد',
   *   last_name: 'محمد'
   * })
   * ```
   */
  async execute(request: RegisterRequest): Promise<User> {
    // Validate email
    let email: Email;
    try {
      email = new Email(request.email);
    } catch {
      logger.warn("Invalid email format during registration", {
        email: request.email,
      });
      throw new InvalidEmailError("البريد الإلكتروني غير صحيح");
    }

    // Check if user already exists
    const existingUser = await this.authRepository.findByEmail(
      email.toString(),
    );
    if (existingUser) {
      logger.warn("Registration attempt with existing email", {
        email: email.toString(),
      });
      throw new UserAlreadyExistsError(
        "المستخدم موجود بالفعل بهذا البريد الإلكتروني",
      );
    }

    // Validate password
    let password: Password;
    try {
      password = new Password(request.password, {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
      });
    } catch (error) {
      logger.warn("Invalid password during registration", {
        email: email.toString(),
      });
      if (error instanceof InvalidPasswordError) {
        throw error;
      }
      throw new InvalidPasswordError("كلمة المرور لا تلبي المتطلبات");
    }

    // Register user
    try {
      const user = await this.authRepository.register({
        email: email.toString(),
        password: password.toString(),
        first_name: request.first_name,
        last_name: request.last_name,
        username: request.username,
        role: request.role || "student",
      });

      logger.info("User registered successfully", {
        userId: user.id,
        email: email.toString(),
      });
      // Send verification email automatically after registration
      if (this.emailService && this.verificationTokenRepository) {
        try {
          // Generate verification token
          const verificationToken = new VerificationToken(
            user.id,
            "email_verification",
            24, // 24 hours expiration
          );

          // Save token to database
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

          // Send verification email
          const userName =
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.firstName || user.username || undefined;

          await this.emailService.sendVerificationEmail(
            email.toString(),
            verificationToken.getValue(),
            userName,
          );

          logger.info("Verification email sent after registration", {
            userId: user.id,
            email: email.toString(),
          });
        } catch (error) {
          // Log error but don't fail registration
          // User can request verification email later
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Failed to send verification email after registration", {
            userId: user.id,
            email: email.toString(),
            error: errorMessage,
          });
        }
      }

      return user;
    } catch (error) {
      logger.error("Registration failed", { email: email.toString(), error });
      throw error;
    }
  }
}
