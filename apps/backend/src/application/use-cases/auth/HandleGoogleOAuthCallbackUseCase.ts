/**
 * Handle Google OAuth Callback Use Case
 *
 * Use case لمعالجة Google OAuth callback
 */

// Application Layer - استخدام barrel exports
import { GoogleOAuthService } from "@/application/services";

// Domain Layer - استخدام barrel exports
import { ValidationError } from "@/domain/exceptions";
import { LoginResponse } from "@/domain";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class HandleGoogleOAuthCallbackUseCase {
  constructor(private readonly googleOAuthService: GoogleOAuthService) { }

  /**
   * Execute use case
   *
   * @param code - Authorization code from Google
   * @param state - OAuth state token
   * @param codeVerifier - PKCE code verifier
   * @returns LoginResponse with redirect URL
   * @throws {ValidationError} If inputs are invalid
   */
  async execute(
    code: string,
    state: string,
    codeVerifier: string,
  ): Promise<LoginResponse & { redirectTo: string }> {
    // Validate inputs
    if (!code || code.trim().length === 0) {
      throw new ValidationError("code مطلوب");
    }

    if (!state || state.trim().length === 0) {
      throw new ValidationError("state مطلوب");
    }

    if (!codeVerifier || codeVerifier.trim().length === 0) {
      throw new ValidationError("code_verifier مطلوب");
    }

    logger.debug("Handling Google OAuth callback", {
      code: code.substring(0, 10) + "...",
      state: state.substring(0, 10) + "...",
    });

    return await this.googleOAuthService.handleCallbackWithVerifier(
      code,
      codeVerifier,
      state
    ) as unknown as LoginResponse & { redirectTo: string };
  }
}
