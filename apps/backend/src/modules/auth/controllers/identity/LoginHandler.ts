import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/services/identity/AuthService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { logger } from "@/shared/utils/logger.js";
import { z } from "zod";
import { t } from "@/presentation/api/middleware/i18n/translation.service.js";

// Define strict schemas for validation (Law 02)
const LoginSchema = z.object({
  email: z.string().email("invalid_email"),
  password: z.string().min(1, "password_required"),
});

const LogoutSchema = z.object({
  refresh_token: z.string().min(1, "refresh_token_required"),
});

export class LoginHandler extends BaseHandler {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * POST /api/v1/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        // Runtime validation (Law 02)
        const validatedData = LoginSchema.parse(req.body);

        const result = await this.authService.login(validatedData);

        logger.info("Login successful", {
          userId: result.user.id,
          email: result.user.email,
        });

        this.ok(res, result, t("auth.login_success", req.language));
      },
      t("auth.login_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/refresh
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { refresh_token } = LogoutSchema.parse(req.body); // Re-use schema as it just needs refresh_token

        const result = await this.authService.refreshToken({ refresh_token });
        logger.info("Token refreshed successfully");

        this.ok(res, result, t("auth.token_refresh_success", req.language));
      },
      t("auth.token_refresh_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/logout
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        // Extract from body or header (legacy support)
        const rawToken =
          req.body.refresh_token || req.headers["x-refresh-token"];

        // Validate using schema (create temporary object to validate)
        const { refresh_token } = LogoutSchema.parse({
          refresh_token: rawToken,
        });

        await this.authService.logout(refresh_token);
        logger.info("Logout successful", { userId: req.user?.id });

        this.ok(res, { success: true }, t("auth.logout_success", req.language));
      },
      t("auth.logout_failed", req.language),
      req.language,
    );
  };
}
