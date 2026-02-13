import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/services/identity/AuthService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { logger } from "@/shared/utils/logger.js";
import { z } from "zod";
import { t } from "@/presentation/api/middleware/i18n/translation.service.js";

const UpdatePasswordSchema = z.object({
  current_password: z.string().min(1, "password_required"),
  new_password: z.string().min(8, "password_min_length"),
});

const RequestResetSchema = z.object({
  email: z.string().email("invalid_email"),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "invalid_token"),
  new_password: z.string().min(8, "password_min_length"),
});

export class PasswordHandler extends BaseHandler {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * POST /api/v1/auth/password
   */
  updatePassword = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { current_password, new_password } = UpdatePasswordSchema.parse(
          req.body,
        );

        await this.authService.updatePassword(
          userId,
          current_password,
          new_password,
        );

        logger.info("Password updated successfully", { userId });
        this.ok(
          res,
          { success: true },
          t("auth.password_updated", req.language),
        );
      },
      t("auth.password_update_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/password/reset/request
   */
  requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { email } = RequestResetSchema.parse(req.body);

        await this.authService.requestPasswordReset(email);

        logger.info("Password reset request processed", { email });

        this.ok(
          res,
          { success: true },
          t("auth.password_reset_sent", req.language),
        );
      },
      t("auth.password_reset_request_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/password/reset/confirm
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { token, new_password } = ResetPasswordSchema.parse(req.body);

        await this.authService.resetPassword(token, new_password);
        logger.info("Password reset successfully");

        this.ok(
          res,
          { success: true },
          t("auth.password_reset_success", req.language),
        );
      },
      t("auth.password_reset_failed", req.language),
      req.language,
    );
  };
}
