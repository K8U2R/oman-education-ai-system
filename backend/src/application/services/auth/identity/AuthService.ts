/**
 * AuthService - خدمة المصادقة
 *
 * Production-grade authentication service
 * Handles user authentication, registration, and session management
 *
 * Constitutional Authority: LAWS.md - Article 3 (Cluster Sovereignty)
 * Cluster: auth/identity
 *
 * @example
 * ```typescript
 * const authService = new AuthService(authRepo, dbAdapter, tokenService);
 * const response = await authService.login({ email, password });
 * ```
 */

import { IAuthRepository } from "@/domain/interfaces/repositories/auth/identity/IAuthRepository";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import { TokenService } from "./TokenService";
import { EnhancedBaseService } from "../../system/base/EnhancedBaseService";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserData,
    RefreshTokenRequest,
    RefreshTokenResponse,
} from "@/domain/types/auth";
import { User } from "@/domain/entities/User";
import {
    AuthenticationFailedError,
    UserNotFoundError,
    InvalidTokenError,
    TokenExpiredError,
} from "@/domain/exceptions/AuthExceptions";
import { logger } from "@/shared/common";

export class AuthService extends EnhancedBaseService {
    constructor(
        private readonly authRepository: IAuthRepository,
        databaseAdapter: DatabaseCoreAdapter,
        private readonly tokenService: TokenService,
    ) {
        super(databaseAdapter);
    }

    protected getServiceName(): string {
        return "AuthService";
    }

    /**
     * Login - تسجيل الدخول
     *
     * @param credentials - بيانات تسجيل الدخول
     * @returns LoginResponse with user data and tokens
     * @throws {AuthenticationFailedError} إذا فشل تسجيل الدخول
     * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return this.executeWithEnhancements(
            async () => {
                logger.info("Login attempt", { email: credentials.email });

                // Delegate to repository (handles password verification)
                const response = await this.authRepository.login(credentials);

                logger.info("Login successful", { userId: response.user.id });
                return response;
            },
            {
                retryable: false, // Login should not be retried automatically
                performanceTracking: true,
            },
            {
                operation: "login",
                metadata: { email: credentials.email },
            },
        );
    }

    /**
     * Register - التسجيل
     *
     * @param data - بيانات التسجيل
     * @returns User instance
     * @throws {UserAlreadyExistsError} إذا كان المستخدم موجوداً بالفعل
     * @throws {InvalidEmailError} إذا كان البريد الإلكتروني غير صحيح
     */
    async register(data: RegisterRequest): Promise<User> {
        return this.executeWithEnhancements(
            async () => {
                logger.info("Registration attempt", { email: data.email });

                const user = await this.authRepository.register(data);

                logger.info("Registration successful", { userId: user.id });
                return user;
            },
            {
                retryable: false,
                performanceTracking: true,
            },
            {
                operation: "register",
                metadata: { email: data.email },
            },
        );
    }

    /**
     * Logout - تسجيل الخروج
     *
     * @param refreshToken - Refresh token to revoke
     */
    async logout(refreshToken: string): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                await this.authRepository.logout(refreshToken);
                logger.info("Logout successful");
            },
            {
                retryable: true,
                performanceTracking: false,
            },
            {
                operation: "logout",
            },
        );
    }

    /**
     * Get Current User - الحصول على المستخدم الحالي
     *
     * @param userId - User ID
     * @returns User instance
     * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
     */
    async getCurrentUser(userId: string): Promise<User> {
        return this.executeWithEnhancements(
            async () => {
                const user = await this.authRepository.getCurrentUser(userId);
                return user;
            },
            {
                retryable: true,
                performanceTracking: false,
            },
            {
                operation: "getCurrentUser",
                userId,
            },
        );
    }

    /**
     * Refresh Token - تحديث الرمز
     *
     * @param request - RefreshTokenRequest
     * @returns RefreshTokenResponse with new tokens
     * @throws {InvalidTokenError} إذا كان Token غير صحيح
     * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
     */
    async refreshToken(
        request: RefreshTokenRequest,
    ): Promise<RefreshTokenResponse> {
        return this.executeWithEnhancements(
            async () => {
                // Verify refresh token first
                const payload = this.tokenService.verifyRefreshToken(
                    request.refresh_token,
                );

                // Delegate to repository for token refresh
                const response = await this.authRepository.refreshToken(request);

                logger.info("Token refreshed successfully", { userId: payload.userId });
                return response;
            },
            {
                retryable: false,
                performanceTracking: true,
            },
            {
                operation: "refreshToken",
            },
        );
    }

    /**
     * Verify Token - التحقق من صحة الرمز
     *
     * @param token - Access token
     * @returns UserData if valid
     * @throws {InvalidTokenError} إذا كان Token غير صحيح
     * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
     */
    async verifyToken(token: string): Promise<UserData> {
        return this.executeWithEnhancements(
            async () => {
                // First verify token structure
                const payload = this.tokenService.verifyAccessToken(token);

                // Then verify against repository (checks if user still exists/active)
                const userData = await this.authRepository.verifyToken(token);

                return userData;
            },
            {
                retryable: false,
                performanceTracking: false,
            },
            {
                operation: "verifyToken",
            },
        );
    }

    /**
     * Find User by Email
     *
     * @param email - User email
     * @returns User instance or null
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.executeWithEnhancements(
            async () => {
                return await this.authRepository.findByEmail(email);
            },
            {
                retryable: true,
                performanceTracking: false,
            },
            {
                operation: "findByEmail",
                metadata: { email },
            },
        );
    }

    /**
     * Update User
     *
     * @param userId - User ID
     * @param data - Data to update
     * @returns Updated User
     * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
     */
    async updateUser(userId: string, data: Partial<UserData>): Promise<User> {
        return this.executeWithEnhancements(
            async () => {
                const user = await this.authRepository.updateUser(userId, data);
                logger.info("User updated successfully", { userId });
                return user;
            },
            {
                retryable: false,
                performanceTracking: true,
            },
            {
                operation: "updateUser",
                userId,
                metadata: { fields: Object.keys(data) },
            },
        );
    }

    /**
     * Update Password
     *
     * @param userId - User ID
     * @param currentPassword - Current password
     * @param newPassword - New password
     * @throws {AuthenticationFailedError} إذا كانت كلمة المرور الحالية غير صحيحة
     */
    async updatePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                await this.authRepository.updatePassword(
                    userId,
                    currentPassword,
                    newPassword,
                );
                logger.info("Password updated successfully", { userId });
            },
            {
                retryable: false,
                performanceTracking: true,
            },
            {
                operation: "updatePassword",
                userId,
            },
        );
    }

    /**
     * Reset Password (Direct) - for password reset flow
     *
     * @param userId - User ID
     * @param newPasswordHash - New password hash
     */
    async resetPassword(userId: string, newPasswordHash: string): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                await this.authRepository.updatePasswordHash(userId, newPasswordHash);
                logger.info("Password reset successful", { userId });
            },
            {
                retryable: false,
                performanceTracking: true,
            },
            {
                operation: "resetPassword",
                userId,
            },
        );
    }

    /**
     * Generate Tokens for User
     *
     * @param user - User data
     * @returns AuthTokens
     */
    generateTokensForUser(user: UserData) {
        return this.tokenService.generateTokens(user);
    }

    /**
     * Validate Token Structure (without repository check)
     *
     * @param token - Access token
     * @returns Decoded payload or null
     */
    validateToken(token: string): boolean {
        try {
            this.tokenService.verifyAccessToken(token);
            return true;
        } catch {
            return false;
        }
    }
}
