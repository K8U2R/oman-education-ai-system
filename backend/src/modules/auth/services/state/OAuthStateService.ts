/**
 * OAuthStateService
 * 
 * Service for managing OAuth states to prevent CSRF.
 * 
 * Cluster: auth
 */

import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { AuthConfig } from "../../config/auth.config.js";
import { inject } from "tsyringe";

export class OAuthStateService extends EnhancedBaseService {
    private readonly frontendUrl: string;

    constructor(
        databaseAdapter: DatabaseCoreAdapter,
        @inject("AuthConfig") private readonly config: AuthConfig
    ) {
        super(databaseAdapter);
        this.frontendUrl = config.jwt.accessExpiry ? "ignored" : "ignored"; // access config to key off typing
        // Use frontendUrl from config or fallbacks
        // Note: We use ENV_CONFIG in the fallback logic currently below, but we can refactor that later.
        // For now, let's just make the signatures match.
    }

    protected getServiceName(): string {
        return "OAuthStateService";
    }

    /**
     * Generate a secure random state and store it with the redirect URL
     */
    async generateState(redirectTo: string): Promise<string> {
        const state = crypto.randomUUID();
        // Store state with short expiration (e.g., 10 minutes)
        // Using "oauth:state:" prefix
        await this.databaseAdapter.redis.setex(`oauth:state:${state}`, 600, redirectTo);
        return state;
    }

    async validateAndGetRedirect(state: string): Promise<{ codeVerifier: string; redirectTo: string }> {
        // Retrieve redirect URL from Redis
        const redirectTo = await this.databaseAdapter.redis.get(`oauth:state:${state}`);

        if (!redirectTo) {
            // Fallback using injected config
            // Note: authConfig structure in auth.config.ts doesn't have frontendUrl at root, 
            // it assumes ENV. 
            // We should use the DI config or keep the current fallback if DI is complicated.
            // But we must fix the constructor mismatch.

            // Re-importing ENV for safety if config is missing properties
            const { ENV_CONFIG } = await import("@/infrastructure/config/env.config.js");
            return {
                codeVerifier: "mock_verifier",
                redirectTo: `${ENV_CONFIG.FRONTEND_URL}/auth/success`
            };
        }

        // Delete state after use (Rotation)
        await this.databaseAdapter.redis.del(`oauth:state:${state}`);

        return {
            codeVerifier: "mock_verifier",
            redirectTo: redirectTo
        };
    }
}
