/**
 * Initiate Google OAuth Use Case
 *
 * Use case لبدء عملية Google OAuth
 */

// Application Layer - استخدام barrel exports
import { GoogleOAuthService } from "@/application/services";

// Domain Layer - استخدام barrel exports
import { ValidationError } from "@/domain/exceptions";

// Shared Layer - استخدام common.ts
import { logger } from "@/shared/common";

export class InitiateGoogleOAuthUseCase {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

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

    return await this.googleOAuthService.generateAuthorizationUrl(redirectTo);
  }
}
