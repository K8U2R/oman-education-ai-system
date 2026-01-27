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

import { IAuthRepository } from "@/domain/interfaces/repositories/auth/identity/IAuthRepository.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { TokenService } from "./TokenService.js";
import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    UserData,
    RefreshTokenRequest,
    RefreshTokenResponse,
    UserRole,
} from "@/domain/types/auth/index.js";
import { User } from "@/domain/entities/User.js";
import { logger } from "@/shared/utils/logger.js";

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
     * Get or Create User - للحصول على المستخدم أو إنشائه تلقائياً
     * 
     * @param userId - User ID from external provider or legacy system
     * @param email - User email
     * @param role - Optional role override
     */
    async getOrCreateUser(userId: string, email: string, role?: string): Promise<User> {
        return this.executeWithEnhancements(
            async () => {
                try {
                    return await this.authRepository.getCurrentUser(userId);
                } catch (_error) {
                    logger.info("JIT Provisioning: Creating user", { userId, email });
                    return await this.authRepository.register({
                        email,
                        password: Math.random().toString(36), // Random password for JIT users
                        first_name: email.split('@')[0],
                        last_name: "User",
                        role: (role || "student") as UserRole
                    });
                }
            },
            { retryable: true },
            { operation: "getOrCreateUser", userId }
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
                this.tokenService.verifyAccessToken(token);

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
     * Send Verification Email
     *
     * @param email - User email
     */
    async sendVerificationEmail(email: string): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                // Generate token
                const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
                const user = await this.findByEmail(email);
                if (!user) {
                    // Silent failure (Security: User Enumeration prevention)
                    logger.info("Verification email requested for non-existent user", { email });
                    return;
                }

                await this.authRepository.createVerificationToken(
                    user.id,
                    token,
                    "email_verification",
                    new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                );

                // TODO: Integrate with EmailService to actually send the email
                logger.info("Verification token created", { userId: user.id, token });
            },
            { retryable: true },
            { operation: "sendVerificationEmail", metadata: { email } }
        );
    }

    /**
     * Verify Email
     *
     * @param token - Verification token
     * @returns Verified User
     */
    async verifyEmail(token: string): Promise<User> {
        return this.executeWithEnhancements(
            async () => {
                const tokenData = await this.authRepository.findVerificationToken(token);
                if (!tokenData) {
                    throw new Error("Invalid or expired verification token");
                }

                if (new Date(tokenData.expires_at) < new Date() || tokenData.used) {
                    throw new Error("Invalid or expired verification token");
                }

                await this.authRepository.markVerificationTokenAsUsed(tokenData.id);
                const user = await this.updateUser(tokenData.user_id, { is_verified: true });
                return user;
            },
            { retryable: false },
            { operation: "verifyEmail" }
        );
    }

    /**
     * Request Password Reset
     *
     * @param email - User email
     */
    async requestPasswordReset(email: string): Promise<void> {
        return this.executeWithEnhancements(
            async () => {
                const user = await this.findByEmail(email);
                if (!user) {
                    return; // Silent success
                }

                const token = Math.floor(100000 + Math.random() * 900000).toString();
                await this.authRepository.createVerificationToken(
                    user.id,
                    token,
                    "password_reset",
                    new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
                );

                // TODO: Send email
                logger.info("Password reset token created", { userId: user.id, token });
            },
            { retryable: true },
            { operation: "requestPasswordReset", metadata: { email } }
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
