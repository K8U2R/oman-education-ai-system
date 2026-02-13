import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/services/identity/AuthService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { logger } from "@/shared/utils/logger.js";
import { z } from "zod";
import { t } from "@/presentation/api/middleware/i18n/translation.service.js";

const RegisterSchema = z.object({
  email: z.string().email("invalid_email"),
  password: z.string().min(8, "password_min_length"),
  first_name: z.string().min(1, "field_required"),
  last_name: z.string().min(1, "field_required"),
  username: z.string().optional(),
});

const EmailSchema = z.object({
  email: z.string().email("invalid_email"),
});

const TokenSchema = z.object({
  token: z.string().min(1, "invalid_token"),
});

export class RegistrationHandler extends BaseHandler {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * POST /api/v1/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = RegisterSchema.parse(req.body);

        const registerDto = {
          ...validatedData,
          role: "student" as const, // Law-2 (Gatekeeper)
        };

        const result = await this.authService.register(registerDto);

        logger.info("Registration successful", {
          userId: result.user.id,
          email: result.user.email,
        });

        this.created(res, result, t("auth.registration_success", req.language));
      },
      t("auth.registration_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/verify/send
   */
  sendVerificationEmail = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { email } = EmailSchema.parse(req.body);

        await this.authService.sendVerificationEmail(email);

        logger.info("Verification email sent successfully", { email });
        this.ok(
          res,
          { success: true },
          t("auth.verification_email_sent", req.language),
        );
      },
      t("auth.verification_email_failed", req.language),
      req.language,
    );
  };

  /**
   * POST /api/v1/auth/verify/confirm
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { token } = TokenSchema.parse(req.body);

        const verifiedUser = await this.authService.verifyEmail(token);

        logger.info("Email verified successfully", { userId: verifiedUser.id });
        this.ok(
          res,
          { user: verifiedUser.toData() },
          t("auth.email_verified", req.language),
        );
      },
      t("auth.email_verification_failed", req.language),
      req.language,
    );
  };
}
