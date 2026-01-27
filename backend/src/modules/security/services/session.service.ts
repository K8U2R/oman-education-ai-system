import { BaseService } from "@/application/services/system/base/BaseService.js";

export class SessionService extends BaseService {
    constructor() {
        super();
    }

    protected getServiceName(): string {
        return "SessionService";
    }

    async getUserSessions(_userId: string): Promise<any[]> {
        return [];
    }

    async getSessionDetails(_sessionId: string): Promise<any> {
        return { id: _sessionId, userId: "user-1", tokenHash: "hash", expiresAt: new Date(), createdAt: new Date(), isValid: true };
    }

    async getAllSessions(): Promise<any[]> {
        return [];
    }

    async terminateSession(_sessionId: string): Promise<void> {
        return;
    }

    async terminateAllUserSessions(_userId: string): Promise<void> {
        return;
    }

    async refreshSession(_sessionId: string, _tokenHash: string, _refreshTokenHash?: string): Promise<{ token: string; refreshToken: string }> {
        return { token: "new-token", refreshToken: "new-refresh-token" };
    }
}
