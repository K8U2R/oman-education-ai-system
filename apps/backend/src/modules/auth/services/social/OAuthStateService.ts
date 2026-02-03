/**
 * OAuthStateService
 * 
 * Service for managing OAuth states to prevent CSRF.
 * 
 * Cluster: auth
 */

import { EnhancedBaseService } from "@/application/services/system/base/EnhancedBaseService.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { AuthConfig } from "../../config/auth.config.js"; // Keep import for now, as it might be used elsewhere or intended to be kept.
import { inject } from "tsyringe";
import { RedisOAuthStateRepository } from "@/infrastructure/repositories/RedisOAuthStateRepository.js";

export class OAuthStateService extends EnhancedBaseService {
    private readonly stateRepository: RedisOAuthStateRepository;

    constructor(
        databaseAdapter: DatabaseCoreAdapter,
        @inject("AuthConfig") _config: AuthConfig,
        @inject("RedisOAuthStateRepository") stateRepository: RedisOAuthStateRepository
    ) {
        super(databaseAdapter);
        this.stateRepository = stateRepository;
    }

    protected getServiceName(): string {
        return "OAuthStateService";
    }

    /**
     * Generate a secure random state and store it with the redirect URL
     */
    async generateState(redirectTo: string): Promise<string> {
        // Use the repository to create state
        // Using "mock_verifier" to match previous behavior until PKCE is fully implemented
        const state = await this.stateRepository.createState(
            redirectTo,
            "mock_verifier",
            600 // 10 minutes expiration
        );

        return state.stateToken;
    }

    async validateAndGetRedirect(stateToken: string): Promise<{ codeVerifier: string; redirectTo: string }> {
        // Retrieve state from repository
        const state = await this.stateRepository.findStateByToken(stateToken);

        if (!state) {
            // Fallback using injected config (preserving original fallback logic)
            const { ENV_CONFIG } = await import("@/infrastructure/config/env.config.js");
            return {
                codeVerifier: "mock_verifier",
                redirectTo: `${ENV_CONFIG.FRONTEND_URL}/auth/success`
            };
        }

        // Delete state after use (Rotation)
        await this.stateRepository.deleteState(stateToken);

        return {
            codeVerifier: state.codeVerifier,
            redirectTo: state.redirectTo
        };
    }
}
