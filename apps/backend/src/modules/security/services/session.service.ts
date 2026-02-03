import type { PrismaClient } from "@prisma/client";
import { BaseService } from "@/application/services/system/base/BaseService.js";
import { logger } from "@/shared/utils/logger.js";

export class SessionService extends BaseService {
    constructor(private readonly prisma: PrismaClient) {
        super();
    }

    protected getServiceName(): string {
        return "SessionService";
    }

    async getUserSessions(userId: string): Promise<any[]> {
        try {
            return await this.prisma.security_sessions.findMany({
                where: { user_id: userId, is_active: true },
                orderBy: { last_activity_at: 'desc' }
            });
        } catch (error) {
            this.handleServiceError(error, "getUserSessions");
            return [];
        }
    }

    async getSessionDetails(sessionId: string): Promise<any> {
        try {
            const session = await this.prisma.security_sessions.findUnique({
                where: { id: sessionId }
            });

            if (!session) return null;

            return {
                id: session.id,
                userId: session.user_id,
                tokenHash: session.token_hash,
                expiresAt: session.expires_at,
                createdAt: session.created_at,
                isValid: session.is_active && (session.expires_at > new Date())
            };
        } catch (error) {
            this.handleServiceError(error, "getSessionDetails");
            return null;
        }
    }

    async getAllSessions(): Promise<any[]> {
        try {
            return await this.prisma.security_sessions.findMany({
                where: { is_active: true }
            });
        } catch (error) {
            this.handleServiceError(error, "getAllSessions");
            return [];
        }
    }

    async terminateSession(sessionId: string): Promise<void> {
        try {
            await this.prisma.security_sessions.update({
                where: { id: sessionId },
                data: { is_active: false }
            });
            logger.info(`Session ${sessionId} terminated`);
        } catch (error) {
            this.handleServiceError(error, "terminateSession");
        }
    }

    async terminateAllUserSessions(userId: string): Promise<void> {
        try {
            await this.prisma.security_sessions.updateMany({
                where: { user_id: userId, is_active: true },
                data: { is_active: false }
            });
            logger.info(`All sessions for user ${userId} terminated`);
        } catch (error) {
            this.handleServiceError(error, "terminateAllUserSessions");
        }
    }

    async refreshSession(sessionId: string, tokenHash: string, refreshTokenHash?: string): Promise<{ token: string; refreshToken: string }> {
        // Implementation note: This normally requires generating new tokens via a TokenService
        // Since SessionService manages STORAGE of sessions, it might delegate token creation.
        // For now, updating the session record.
        try {
            await this.prisma.security_sessions.update({
                where: { id: sessionId },
                data: {
                    last_activity_at: new Date(),
                    token_hash: tokenHash,
                    refresh_token_hash: refreshTokenHash,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // Extend by 24h
                }
            });
            return { token: "updated", refreshToken: "updated" }; // Placeholder return as token generation is external
        } catch (error) {
            this.handleServiceError(error, "refreshSession");
            throw error;
        }
    }
}
