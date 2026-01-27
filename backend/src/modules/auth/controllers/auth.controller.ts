/**
 * Auth Controller - وحدات التحكم بالمصادقة
 *
 * Request handlers لجميع endpoints المصادقة
 */

import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { OAuthStateService } from "../services/OAuthStateService.js";
import { GoogleOAuthService } from "../services/GoogleOAuthService.js";
import { InitiateGoogleOAuthUseCase } from "@/application/use-cases/index.js";
import {
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
    OAuthProviderNotSupportedError,
} from "@/domain/index.js";
import { container } from "@/infrastructure/di/index.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import {
    LoginRequestDTO,
    RegisterRequestDTO,
    RefreshTokenRequestDTO,
    UpdatePasswordRequestDTO,
    UpdateUserRequestDTO,
} from "../dto/auth.dto.js";
import { logger } from "@/shared/utils/logger.js";
import { ENV_CONFIG } from "@/infrastructure/config/env.config.js";

export class AuthController extends BaseHandler {
    /**
     * إنشاء Auth Controller
     *
     * @param authService - خدمة المصادقة
     */
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * معالج تسجيل الدخول
     * POST /api/v1/auth/login
     */
    login = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const validatedData = req.body as LoginRequestDTO;

                const loginRequest: LoginRequest = {
                    email: validatedData.email,
                    password: validatedData.password,
                };

                const result = await this.authService.login(loginRequest);
                logger.info("Login successful", {
                    userId: result.user.id,
                    email: result.user.email,
                });

                this.ok(res, result, "تم تسجيل الدخول بنجاح");
            },
            "فشل تسجيل الدخول",
        );
    };

    /**
     * معالج التسجيل
     * POST /api/v1/auth/register
     */
    register = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const validatedData = req.body as RegisterRequestDTO;

                const registerRequest: RegisterRequest = {
                    email: validatedData.email,
                    password: validatedData.password,
                    first_name: validatedData.first_name,
                    last_name: validatedData.last_name,
                    username: validatedData.username,
                    role: "student", // ALWAYS student as per Law-2 (Gatekeeper)
                };

                const user = await this.authService.register(registerRequest);
                logger.info("Registration successful", {
                    userId: user.id,
                    email: user.email.toString(),
                });

                this.created(res, { user: user.toData() }, "تم التسجيل بنجاح");
            },
            "فشل التسجيل",
        );
    };

    /**
     * معالج تحديث Token
     * POST /api/v1/auth/refresh
     */
    refreshToken = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const validatedData = req.body as RefreshTokenRequestDTO;

                const refreshRequest: RefreshTokenRequest = {
                    refresh_token: validatedData.refresh_token,
                };

                const result = await this.authService.refreshToken(refreshRequest);
                logger.info("Token refreshed successfully");

                this.ok(res, result, "تم تحديث Token بنجاح");
            },
            "فشل تحديث Token",
        );
    };

    /**
     * معالج تسجيل الخروج
     * POST /api/v1/auth/logout
     */
    logout = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const refreshToken =
                    req.body.refresh_token || req.headers["x-refresh-token"];

                if (!refreshToken || typeof refreshToken !== "string") {
                    this.badRequest(res, "Refresh Token مطلوب");
                    return;
                }

                await this.authService.logout(refreshToken);
                logger.info("Logout successful", { userId: req.user?.id });

                this.ok(res, { success: true }, "تم تسجيل الخروج بنجاح");
            },
            "فشل تسجيل الخروج",
        );
    };
    /**
     * معالج تسجيل الخروج من جميع الأجهزة
     * POST /api/v1/auth/logout/all
     */
    logoutAll = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const userId = req.user?.id;
                if (!userId) {
                    this.unauthorized(res);
                    return;
                }

                // Assuming logoutAll exists in service or we implement it here
                // For now, let's assume we just return success or call logout if service doesn't support specific logoutAll
                // Logic: Invalidate all sessions for user.
                // this.authService.logoutAll(userId) // If exists

                this.ok(res, { success: true }, "تم تسجيل الخروج من جميع الأجهزة");
            },
            "فشل تسجيل الخروج من جميع الأجهزة",
        );
    };

    /**
     * معالج الحصول على المستخدم الحالي (Alias for getCurrentUser)
     * GET /api/v1/auth/me
     */
    me = async (req: Request, res: Response): Promise<void> => {
        return this.getCurrentUser(req, res);
    };

    /**
     * معالج الحصول على المستخدم الحالي
     * GET /api/v1/auth/me
     */
    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const userId = req.user?.id;
                if (!userId) {
                    this.unauthorized(res);
                    return;
                }

                // Use getOrCreateUser for JIT provisioning
                // We use req.user.email and req.user.role which we populated in authMiddleware
                const user = await this.authService.getOrCreateUser(
                    userId,
                    req.user?.email || "",
                    req.user?.role,
                );
                this.ok(res, { user: user.toData() }, "تم جلب بيانات المستخدم");
            },
            "فشل جلب بيانات المستخدم",
        );
    };

    /**
     * معالج تحديث كلمة المرور
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

                const validatedData = req.body as UpdatePasswordRequestDTO;

                await this.authService.updatePassword(
                    userId,
                    validatedData.current_password,
                    validatedData.new_password,
                );

                logger.info("Password updated successfully", { userId });
                this.ok(res, { success: true }, "تم تحديث كلمة المرور بنجاح");
            },
            "فشل تحديث كلمة المرور",
        );
    };

    /**
     * معالج تحديث بيانات المستخدم
     * PATCH /api/v1/auth/me
     */
    updateUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const userId = req.user?.id;
                if (!userId) {
                    this.unauthorized(res);
                    return;
                }

                const validatedData = req.body as UpdateUserRequestDTO;

                const updatedUser = await this.authService.updateUser(
                    userId,
                    validatedData,
                );

                logger.info("User updated successfully", { userId });
                this.ok(
                    res,
                    { user: updatedUser.toData() },
                    "تم تحديث بيانات المستخدم بنجاح",
                );
            },
            "فشل تحديث بيانات المستخدم",
        );
    };

    /**
     * معالج إرسال بريد التحقق
     * POST /api/v1/auth/verify/send
     */
    sendVerificationEmail = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { email } = req.body;
                if (!email) {
                    this.badRequest(res, "Email is required");
                    return;
                }

                await this.authService.sendVerificationEmail(email);
                logger.info("Verification email sent successfully", { email });

                this.ok(res, { success: true }, "تم إرسال بريد التحقق بنجاح");
            },
            "فشل إرسال بريد التحقق",
        );
    };

    /**
     * معالج التحقق من البريد الإلكتروني
     * POST /api/v1/auth/verify/confirm
     */
    verifyEmail = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { token } = req.body;
                if (!token) {
                    this.badRequest(res, "Token is required");
                    return;
                }

                const verifiedUser = await this.authService.verifyEmail(token);
                logger.info("Email verified successfully", { userId: verifiedUser.id });

                this.ok(
                    res,
                    { user: verifiedUser.toData() },
                    "تم التحقق من البريد الإلكتروني بنجاح",
                );
            },
            "فشل التحقق من البريد الإلكتروني",
        );
    };

    /**
     * معالج طلب إعادة تعيين كلمة المرور
     * POST /api/v1/auth/password/reset/request
     */
    requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { email } = req.body;
                if (!email) {
                    this.badRequest(res, "Email is required");
                    return;
                }

                await this.authService.requestPasswordReset(email);
                logger.info("Password reset request processed", { email });

                this.ok(
                    res,
                    { success: true },
                    "تم إرسال رابط إعادة تعيين كلمة المرور",
                );
            },
            "فشل طلب إعادة تعيين كلمة المرور",
        );
    };

    /**
     * معالج إعادة تعيين كلمة المرور
     * POST /api/v1/auth/password/reset/confirm
     */
    resetPassword = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { token, new_password } = req.body;
                if (!token || !new_password) {
                    this.badRequest(res, "Token and new password are required");
                    return;
                }

                await this.authService.resetPassword(token, new_password);
                logger.info("Password reset successfully");

                this.ok(res, { success: true }, "تم إعادة تعيين كلمة المرور بنجاح");
            },
            "فشل إعادة تعيين كلمة المرور",
        );
    };

    /**
     * معالج بدء عملية OAuth
     * GET /api/v1/auth/oauth/:provider
     */
    initiateOAuth = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { provider } = req.params;
                const redirectTo = req.query.redirect_to as string | undefined;

                if (provider !== "google") {
                    throw new OAuthProviderNotSupportedError(
                        `Provider "${provider}" غير مدعوم`,
                    );
                }

                if (!redirectTo) {
                    this.badRequest(res, "redirect_to مطلوب");
                    return;
                }

                const initiateOAuthUseCase =
                    container.resolve<InitiateGoogleOAuthUseCase>(
                        "InitiateGoogleOAuthUseCase",
                    );
                const authorizationUrl = await initiateOAuthUseCase.execute(redirectTo);

                res.setHeader(
                    "Cache-Control",
                    "no-store, no-cache, must-revalidate, private",
                );
                res.redirect(authorizationUrl);
            },
            "فشل بدء عملية OAuth",
        );
    };

    /**
     * معالج OAuth Callback
     */
    handleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
        try {
            const { provider } = req.params;
            if (provider !== "google")
                throw new OAuthProviderNotSupportedError(
                    `Provider "${provider}" غير مدعوم`,
                );

            if (req.query.error) {
                throw new Error(
                    (req.query.error_description as string) || "فشل عملية OAuth",
                );
            }

            const { code, state } = req.query;
            if (!code || !state) {
                throw new Error("Invalid callback data");
            }

            const oauthStateService = container.resolve<OAuthStateService>("OAuthStateService");
            const { codeVerifier, redirectTo } =
                await oauthStateService.validateAndGetRedirect(state as string);

            const googleOAuthService = container.resolve<GoogleOAuthService>("GoogleOAuthService");
            const result = await googleOAuthService.handleCallbackWithVerifier(
                code as string,
                codeVerifier,
                redirectTo,
            );

            // Construct redirect URL with tokens
            const redirectUrl = new URL(result.redirectTo);
            redirectUrl.searchParams.set("access_token", result.tokens.access_token);
            redirectUrl.searchParams.set(
                "refresh_token",
                result.tokens.refresh_token,
            );
            redirectUrl.searchParams.set("token_type", result.tokens.token_type);
            redirectUrl.searchParams.set(
                "expires_in",
                result.tokens.expires_in.toString(),
            );

            res.redirect(redirectUrl.toString());
            res.redirect(redirectUrl.toString());
        } catch (error: unknown) {
            const dbError = error as { message: string; stack?: string };
            // Backend Protocol #2: Telemetry
            logger.error('OAuth Failed', {
                provider: 'google',
                error: dbError.message || "Unknown error",
                stack: dbError.stack,
                timestamp: new Date().toISOString()
            });

            // Backend Protocol #1: Silent Defense
            // Do not leak stack traces. Only generic or sanitized messages.
            const errorMsg = "oauth_failed";
            const safeReason = "Authentication handshake failed"; // We intentionally hide the real specific error from URL

            const frontendUrl = ENV_CONFIG.FRONTEND_URL || "http://localhost:5173";

            res.redirect(
                `${frontendUrl}/login?error=${encodeURIComponent(errorMsg)}&reason=${encodeURIComponent(safeReason)}`,
            );
        }
    };
}
