/**
 * Login Use Case - حالة استخدام تسجيل الدخول
 *
 * Use Case مسؤول عن منطق تسجيل الدخول
 *
 * @example
 * ```typescript
 * const loginUseCase = new LoginUseCase(authRepository, tokenService)
 * const result = await loginUseCase.execute({ email: 'user@example.com', password: 'password' })
 * ```
 */

// Domain Layer - استخدام barrel exports
import {
  IAuthRepository,
  LoginRequest,
  LoginResponse,
  Email,
  AuthenticationFailedError,
  UserNotFoundError,
  AccountNotVerifiedError,
  AccountDisabledError,
} from "@/domain";

// Shared Layer - استخدام barrel exports
import { logger } from "@/shared/common";
import { getSettings } from "@/shared";

export interface ITokenService {
  generateAccessToken(userId: string, email: string, role: string): string;
  generateRefreshToken(userId: string, email: string): string;
  verifyToken(token: string): {
    userId: string;
    email: string;
    role?: string;
    type: "access" | "refresh";
  } | null;
}

export class LoginUseCase {
  private readonly allowUnverifiedInDevelopment: boolean;

  /**
   * إنشاء Login Use Case
   *
   * @param authRepository - مستودع المصادقة
   * @param tokenService - خدمة Token
   */
  constructor(private readonly authRepository: IAuthRepository) {
    const settings = getSettings();
    // في بيئة التطوير، نسمح بتسجيل الدخول للحسابات غير المفعّلة
    this.allowUnverifiedInDevelopment = settings.app.env === "development";
  }

  /**
   * تنفيذ تسجيل الدخول
   *
   * @param request - طلب تسجيل الدخول
   * @returns LoginResponse يحتوي على User و Tokens
   * @throws {AuthenticationFailedError} إذا فشل تسجيل الدخول
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {AccountNotVerifiedError} إذا كان الحساب غير مفعّل
   * @throws {AccountDisabledError} إذا كان الحساب معطّلاً
   *
   * @example
   * ```typescript
   * const result = await loginUseCase.execute({
   *   email: 'user@example.com',
   *   password: 'SecurePass123'
   * })
   * ```
   */
  async execute(request: LoginRequest): Promise<LoginResponse> {
    // Validate email
    let email: Email;
    try {
      email = new Email(request.email);
    } catch {
      logger.warn("Invalid email format during login", {
        email: request.email,
      });
      throw new AuthenticationFailedError("البريد الإلكتروني غير صحيح");
    }

    // Find user by email
    const user = await this.authRepository.findByEmail(email.toString());

    if (!user) {
      logger.warn("Login attempt with non-existent email", {
        email: email.toString(),
      });
      throw new UserNotFoundError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }

    // Check if account is active
    if (!user.isActive) {
      logger.warn("Login attempt with disabled account", { userId: user.id });
      throw new AccountDisabledError();
    }

    // Check if account is verified (skip in development for testing)
    if (!user.isVerified && !this.allowUnverifiedInDevelopment) {
      logger.warn("Login attempt with unverified account", { userId: user.id });
      throw new AccountNotVerifiedError();
    }

    // Use repository's login method which handles password verification and token generation
    try {
      const loginResponse = await this.authRepository.login({
        email: email.toString(),
        password: request.password,
      });

      logger.info("User logged in successfully", {
        userId: user.id,
        email: email.toString(),
      });

      return loginResponse;
    } catch {
      logger.warn("Password verification failed", { userId: user.id });
      throw new AuthenticationFailedError(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      );
    }
  }
}
