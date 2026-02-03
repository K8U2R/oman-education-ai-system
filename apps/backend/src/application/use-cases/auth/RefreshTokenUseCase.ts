/**
 * Refresh Token Use Case - حالة استخدام تحديث Token
 *
 * Use Case مسؤول عن منطق تحديث Access Token باستخدام Refresh Token
 *
 * @example
 * ```typescript
 * const refreshTokenUseCase = new RefreshTokenUseCase(authRepository, tokenService)
 * const result = await refreshTokenUseCase.execute({ refresh_token: 'token' })
 * ```
 */

// Domain Layer - استخدام barrel exports
import {
  IAuthRepository,
  IRefreshTokenRepository,
  RefreshTokenRequest,
  RefreshTokenResponse,
  InvalidTokenError,
} from "@/domain";

// Types
import { ITokenService } from "./LoginUseCase";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class RefreshTokenUseCase {
  /**
   * إنشاء Refresh Token Use Case
   *
   * @param authRepository - مستودع المصادقة
   * @param tokenService - خدمة Token
   */
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  /**
   * تنفيذ تحديث Token
   *
   * @param request - طلب تحديث Token
   * @returns RefreshTokenResponse يحتوي على tokens جديدة
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
   *
   * @example
   * ```typescript
   * const result = await refreshTokenUseCase.execute({
   *   refresh_token: 'refresh_token_here'
   * })
   * ```
   */
  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    // 1. Verify refresh token signature and basic expiry
    const tokenPayload = this.tokenService.verifyToken(request.refresh_token);

    if (!tokenPayload || tokenPayload.type !== "refresh") {
      logger.warn("Invalid refresh token signature or type");
      throw new InvalidTokenError("Refresh Token غير صحيح");
    }

    // 2. Check database for token status
    const storedToken = await this.refreshTokenRepository.findByToken(
      request.refresh_token,
    );

    if (!storedToken) {
      logger.warn("Refresh token not found in database", {
        token: "..." + request.refresh_token.slice(-10),
      });
      throw new InvalidTokenError("جلسة العمل غير صالحة أو منتهية");
    }

    if (storedToken.revoked) {
      logger.warn("Attempted to use revoked refresh token", {
        userId: storedToken.user_id,
      });
      throw new InvalidTokenError("تم إلغاء هذه الجلسة");
    }

    // 3. REUSE DETECTION: If token is already used, it might have been stolen!
    if (storedToken.used) {
      logger.error("REFRESH TOKEN REUSE DETECTED! Potential token theft.", {
        userId: storedToken.user_id,
        tokenId: storedToken.id,
      });

      // Invalidate all tokens for this user for security
      await this.refreshTokenRepository.invalidateAllForUser(
        storedToken.user_id,
      );

      throw new InvalidTokenError(
        "تم الكشف عن محاولة دخول مشبوهة. يرجى تسجيل الدخول مرة أخرى.",
      );
    }

    // Get user from repository
    const user = await this.authRepository.findById(tokenPayload.userId);

    if (!user) {
      logger.warn("User not found for refresh token", {
        userId: tokenPayload.userId,
      });
      throw new InvalidTokenError("المستخدم غير موجود");
    }

    // Check if user is still active
    if (!user.isActive) {
      logger.warn("Refresh token attempt for disabled account", {
        userId: user.id,
      });
      throw new InvalidTokenError("الحساب معطّل");
    }

    // 4. Mark current token as used
    await this.refreshTokenRepository.update(storedToken.id, { used: true });

    // 5. Generate new tokens (Rotation)
    const accessToken = this.tokenService.generateAccessToken(
      user.id,
      user.email.toString(),
      user.role,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user.id,
      user.email.toString(),
    );

    // 6. Store new refresh token
    // Decoded token to get expiry if available, or just use a standard offset
    await this.refreshTokenRepository.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    logger.info("Token rotated successfully", { userId: user.id });

    return {
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 3600, // 1 hour
      },
    };
  }
}
