/**
 * Initiate Google OAuth Use Case
 *
 * Use case لبدء عملية Google OAuth
 */

// Application Layer - استخدام barrel exports
import { GoogleOAuthService } from "@/modules/auth/services/social/GoogleOAuthService";
import { OAuthStateService } from "@/modules/auth/services/social/OAuthStateService";

// Domain Layer - استخدام barrel exports
import { ValidationError } from "@/domain/exceptions";
import { container } from "@/infrastructure/di/index";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class InitiateGoogleOAuthUseCase {
  constructor(private readonly googleOAuthService: GoogleOAuthService) { }

  /**
   * Execute use case
   *
   * @param redirectTo - Redirect URL after OAuth
   * @returns Authorization URL
   * @throws {ValidationError} If redirect URL is invalid
   */
  async execute(redirectTo: string): Promise<string> {
    // Validate redirect URL
    if (!redirectTo || redirectTo.trim().length === 0) {
      throw new ValidationError("redirect_to مطلوب");
    }

    try {
      new URL(redirectTo); // Validate URL format
    } catch {
      throw new ValidationError("redirect_to يجب أن يكون URL صحيح");
    }

    logger.debug("Initiating Google OAuth", { redirectTo });

    // 1. Resolve OAuthStateService (Lazy resolution to avoid circle during refactor)
    const oauthStateService = container.resolve<OAuthStateService>("OAuthStateService");

    // 2. Generate secure state mapped to this specific user's redirect intent
    const state = await oauthStateService.generateState(redirectTo);

    // 3. Generate Auth URL with this specific state
    return await this.googleOAuthService.generateAuthorizationUrl(state);
  }
}
