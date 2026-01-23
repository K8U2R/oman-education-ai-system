/**
 * TokenService - خدمة إدارة الرموز (Tokens)
 *
 * Production-grade JWT token management service
 * Handles Access and Refresh token generation and verification
 *
 * @example
 * ```typescript
 * const tokenService = new TokenService();
 * const accessToken = tokenService.generateAccessToken(userData);
 * const payload = tokenService.verifyAccessToken(accessToken);
 * ```
 */

import jwt from "jsonwebtoken";
import { UserData, AuthTokens } from "@/domain/types/auth";
import { logger } from "@/shared/common";
import {
    InvalidTokenError,
    TokenExpiredError,
} from "@/domain/exceptions/AuthExceptions";

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    type: "access" | "refresh";
}

export class TokenService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpiry: string;
    private readonly refreshTokenExpiry: string;

    constructor() {
        // Load secrets from environment variables
        this.accessTokenSecret =
            process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
        this.refreshTokenSecret =
            process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
        this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";

        // Warn if using default secrets in production
        if (
            process.env.NODE_ENV === "production" &&
            (this.accessTokenSecret === "your-access-secret-key" ||
                this.refreshTokenSecret === "your-refresh-secret-key")
        ) {
            logger.warn(
                "⚠️ SECURITY WARNING: Using default JWT secrets. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env",
            );
        }
    }

    /**
     * Generate Access Token (short-lived)
     *
     * @param userOrId - User data object OR user ID
     * @param email - Email (optional, for backward compat)
     * @param role - Role (optional, for backward compat)
     * @returns JWT Access Token (15 minutes default)
     */
    generateAccessToken(user: UserData): string;
    generateAccessToken(userId: string, email: string, role: string): string;
    generateAccessToken(
        userOrId: UserData | string,
        email?: string,
        role?: string,
    ): string {
        let userId: string;
        let userEmail: string;
        let userRole: string;

        if (typeof userOrId === "string") {
            // Legacy signature: (userId, email, role)
            userId = userOrId;
            userEmail = email!;
            userRole = role!;
        } else {
            // New signature: (UserData)
            userId = userOrId.id;
            userEmail = userOrId.email;
            userRole = userOrId.role;
        }

        const payload: TokenPayload = {
            userId,
            email: userEmail,
            role: userRole,
            type: "access",
        };

        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry,
            issuer: "oman-education-ai",
            audience: "oman-education-ai-client",
            subject: userId,
        });
    }

    /**
     * Generate Refresh Token (long-lived)
     *
     * @param userOrId - User data object OR user ID
     * @param email - Email (optional, for backward compat)
     * @returns JWT Refresh Token (7 days default)
     */
    generateRefreshToken(user: UserData): string;
    generateRefreshToken(userId: string, email: string): string;
    generateRefreshToken(
        userOrId: UserData | string,
        email?: string,
    ): string {
        let userId: string;
        let userEmail: string;
        let userRole: string;

        if (typeof userOrId === "string") {
            // Legacy signature: (userId, email)
            userId = userOrId;
            userEmail = email!;
            userRole = "student"; // Default role for refresh tokens
        } else {
            // New signature: (UserData)
            userId = userOrId.id;
            userEmail = userOrId.email;
            userRole = userOrId.role;
        }

        const payload: TokenPayload = {
            userId,
            email: userEmail,
            role: userRole,
            type: "refresh",
        };

        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry,
            issuer: "oman-education-ai",
            audience: "oman-education-ai-client",
            subject: userId,
        });
    }

    /**
     * Generate both Access and Refresh Tokens
     *
     * @param user - User data
     * @returns AuthTokens object with both tokens
     */
    generateTokens(user: UserData): AuthTokens {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        // Extract exp from access token to get expires_in
        const decoded = jwt.decode(accessToken) as { exp: number; iat: number };
        const expiresIn = decoded.exp - decoded.iat;

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: "Bearer",
            expires_in: expiresIn,
        };
    }

    /**
     * Verify Access Token
     *
     * @param token - Access token to verify
     * @returns Decoded token payload
     * @throws {InvalidTokenError} إذا كان Token غير صحيح
     * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret, {
                issuer: "oman-education-ai",
                audience: "oman-education-ai-client",
            }) as TokenPayload;

            // Verify token type
            if (decoded.type !== "access") {
                throw new InvalidTokenError("رمز الوصول غير صحيح");
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError("رمز الوصول منتهي الصلاحية");
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenError("رمز الوصول غير صحيح");
            }
            throw error;
        }
    }

    /**
     * Verify Refresh Token
     *
     * @param token - Refresh token to verify
     * @returns Decoded token payload
     * @throws {InvalidTokenError} إذا كان Token غير صحيح
     * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
     */
    verifyRefreshToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret, {
                issuer: "oman-education-ai",
                audience: "oman-education-ai-client",
            }) as TokenPayload;

            // Verify token type
            if (decoded.type !== "refresh") {
                throw new InvalidTokenError("رمز التحديث غير صحيح");
            }

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new TokenExpiredError("رمز التحديث منتهي الصلاحية");
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new InvalidTokenError("رمز التحديث غير صحيح");
            }
            throw error;
        }
    }

    /**
     * Verify Token (any type)
     *
     * @param token - Token to verify
     * @returns Decoded payload or null
     */
    verifyToken(token: string): TokenPayload | null {
        try {
            // Try as access token first
            return this.verifyAccessToken(token);
        } catch {
            try {
                // Try as refresh token
                return this.verifyRefreshToken(token);
            } catch {
                return null;
            }
        }
    }

    /**
     * Decode token without verification (for debugging)
     *
     * @param token - Token to decode
     * @returns Decoded payload or null
     */
    decodeToken(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload;
        } catch (error) {
            logger.error("Failed to decode token", { error });
            return null;
        }
    }

    /**
     * Check if token is expired without throwing
     *
     * @param token - Token to check
     * @returns true if expired or invalid
     */
    isTokenExpired(token: string): boolean {
        try {
            const decoded = jwt.decode(token) as { exp: number } | null;
            if (!decoded || !decoded.exp) return true;

            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    }

    /**
     * Get token expiration time
     *
     * @param token - Token to check
     * @returns Expiration timestamp or null
     */
    getTokenExpiration(token: string): number | null {
        try {
            const decoded = jwt.decode(token) as { exp: number } | null;
            return decoded?.exp || null;
        } catch {
            return null;
        }
    }

    /**
     * Get remaining time until expiration (in seconds)
     *
     * @param token - Token to check
     * @returns Remaining seconds or 0 if expired
     */
    getTokenRemainingTime(token: string): number {
        const exp = this.getTokenExpiration(token);
        if (!exp) return 0;

        const currentTime = Math.floor(Date.now() / 1000);
        const remaining = exp - currentTime;
        return remaining > 0 ? remaining : 0;
    }
}
