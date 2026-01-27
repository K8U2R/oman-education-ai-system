import { container } from "@/infrastructure/di/Container.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { AuthService } from "@/modules/auth/services/AuthService.js";
import { TokenService } from "@/modules/auth/services/TokenService.js";
import { GoogleOAuthService } from "@/modules/auth/services/GoogleOAuthService.js";
import { OAuthStateService } from "@/modules/auth/services/OAuthStateService.js";
import { WhitelistService } from "@/modules/auth/services/WhitelistService.js";
import { AuthController } from "@/modules/auth/controllers/auth.controller.js";
import { WhitelistController } from "@/modules/auth/controllers/whitelist.controller.js";
import { IAuthRepository } from "@/domain/interfaces/repositories/auth/identity/IAuthRepository.js";
// Auth Repository
import { AuthRepository } from "@/infrastructure/repositories/AuthRepository.js";
import { RefreshTokenRepository } from "@/infrastructure/repositories/RefreshTokenRepository.js";
import { IRefreshTokenRepository } from "@/domain/interfaces/repositories/auth/tokens/IRefreshTokenRepository.js";

export function registerAuthModule(): void {
    // -----------------------------------------------------
    // Cluster 1: Authentication & Security (Modules/Auth)
    // -----------------------------------------------------

    // Repositories
    container.registerFactory("IRefreshTokenRepository", () => {
        const db = new DatabaseCoreAdapter();
        // Assuming RefreshTokenRepository is found in infrastructure/repositories and imported below/above
        return new RefreshTokenRepository(db);
    });

    container.registerFactory("IAuthRepository", () => {
        const db = new DatabaseCoreAdapter();
        const tokenService = container.resolve<TokenService>("TokenService");
        const refreshTokenRepo = container.resolve<IRefreshTokenRepository>("IRefreshTokenRepository");
        return new AuthRepository(db, tokenService, refreshTokenRepo);
    });

    // Services
    container.registerFactory("TokenService", () => {
        return new TokenService();
    });

    container.registerFactory("AuthService", () => {
        const repo = container.resolve<IAuthRepository>("IAuthRepository");
        const db = new DatabaseCoreAdapter();
        const tokenService = container.resolve<TokenService>("TokenService");
        return new AuthService(repo, db, tokenService);
    });

    container.registerFactory("GoogleOAuthService", () => {
        const db = new DatabaseCoreAdapter();
        return new GoogleOAuthService(db);
    });

    container.registerFactory("OAuthStateService", () => {
        const db = new DatabaseCoreAdapter();
        return new OAuthStateService(db);
    });

    container.registerFactory("WhitelistService", () => {
        const db = new DatabaseCoreAdapter();
        return new WhitelistService(db);
    });

    // Controllers
    container.registerFactory("AuthController", () => {
        const service = container.resolve<AuthService>("AuthService");
        return new AuthController(service);
    });

    container.registerFactory("WhitelistController", () => {
        const service = container.resolve<WhitelistService>("WhitelistService");
        return new WhitelistController(service);
    });

    console.log("🔐 Auth Module Registered");
}
