import { container } from "@/infrastructure/di/Container.js";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { AuthService } from "@/modules/auth/services/core/AuthService.js";
import { TokenService } from "@/modules/auth/services/core/TokenService.js";
import { GoogleOAuthService } from "@/modules/auth/services/strategies/GoogleOAuthService.js";
import { OAuthStateService } from "@/modules/auth/services/state/OAuthStateService.js";
import { InitiateGoogleOAuthUseCase } from "@/application/use-cases/auth/InitiateGoogleOAuthUseCase.js";
import { WhitelistService } from "@/modules/auth/services/security/WhitelistService.js";
import { LoginHandler } from "@/modules/auth/controllers/handlers/LoginHandler.js";
import { RegistrationHandler } from "@/modules/auth/controllers/handlers/RegistrationHandler.js";
import { PasswordHandler } from "@/modules/auth/controllers/handlers/PasswordHandler.js";
import { OAuthHandler } from "@/modules/auth/controllers/handlers/OAuthHandler.js";
import { UserHandler } from "@/modules/auth/controllers/handlers/UserHandler.js";
import { WhitelistController } from "@/modules/auth/controllers/whitelist.controller.js";
import { IAuthRepository } from "@/domain/interfaces/repositories/auth/identity/IAuthRepository.js";
import { IWhitelistRepository } from "@/domain/interfaces/repositories/auth/access/IWhitelistRepository.js";
// Repositories
import { AuthRepository } from "@/infrastructure/repositories/AuthRepository.js";
import { WhitelistRepository } from "@/infrastructure/repositories/WhitelistRepository.js";
import { RefreshTokenRepository } from "@/infrastructure/repositories/RefreshTokenRepository.js";
import { IRefreshTokenRepository } from "@/domain/interfaces/repositories/auth/tokens/IRefreshTokenRepository.js";
import { EmailService } from "@/application/services/communication/messaging/EmailService.js";
import { authConfig, type AuthConfig } from "@/modules/auth/config/auth.config.js";

export function registerAuthModule(): void {
    // -----------------------------------------------------
    // Cluster 1: Authentication & Security (Modules/Auth)
    // -----------------------------------------------------

    // Config
    container.registerFactory("AuthConfig", () => {
        return authConfig;
    });

    // Repositories
    container.registerFactory("IRefreshTokenRepository", () => {
        const db = new DatabaseCoreAdapter();
        return new RefreshTokenRepository(db);
    });

    container.registerFactory("IAuthRepository", () => {
        const db = new DatabaseCoreAdapter();
        const tokenService = container.resolve<TokenService>("TokenService");
        const refreshTokenRepo = container.resolve<IRefreshTokenRepository>("IRefreshTokenRepository");
        return new AuthRepository(db, tokenService, refreshTokenRepo);
    });

    container.registerFactory("IWhitelistRepository", () => {
        const db = new DatabaseCoreAdapter();
        return new WhitelistRepository(db);
    });

    // Services
    container.registerFactory("TokenService", () => {
        const config = container.resolve<AuthConfig>("AuthConfig");
        return new TokenService(config);
    });

    container.registerFactory("AuthService", () => {
        const repo = container.resolve<IAuthRepository>("IAuthRepository");
        const db = new DatabaseCoreAdapter();
        const tokenService = container.resolve<TokenService>("TokenService");
        const emailService = container.resolve<EmailService>("EmailService");
        return new AuthService(repo, db, tokenService, emailService);
    });

    container.registerFactory("GoogleOAuthService", () => {
        const db = new DatabaseCoreAdapter();
        const config = container.resolve<AuthConfig>("AuthConfig");
        return new GoogleOAuthService(db, config);
    });

    container.registerFactory("OAuthStateService", () => {
        const db = new DatabaseCoreAdapter();
        const config = container.resolve<AuthConfig>("AuthConfig");
        return new OAuthStateService(db, config);
    });

    container.registerFactory("WhitelistService", () => {
        const repo = container.resolve<IWhitelistRepository>("IWhitelistRepository");
        const db = new DatabaseCoreAdapter();
        return new WhitelistService(repo, db);
    });

    // Use Cases
    container.registerFactory("InitiateGoogleOAuthUseCase", () => {
        const googleOAuthService = container.resolve<GoogleOAuthService>("GoogleOAuthService");
        return new InitiateGoogleOAuthUseCase(googleOAuthService);
    });

    // Controllers
    // Controllers
    container.registerFactory("LoginHandler", () => {
        const service = container.resolve<AuthService>("AuthService");
        return new LoginHandler(service);
    });

    container.registerFactory("RegistrationHandler", () => {
        const service = container.resolve<AuthService>("AuthService");
        return new RegistrationHandler(service);
    });

    container.registerFactory("PasswordHandler", () => {
        const service = container.resolve<AuthService>("AuthService");
        return new PasswordHandler(service);
    });

    container.registerFactory("OAuthHandler", () => {
        const initiateData = container.resolve<InitiateGoogleOAuthUseCase>("InitiateGoogleOAuthUseCase");
        const oauthStateService = container.resolve<OAuthStateService>("OAuthStateService");
        const googleOAuthService = container.resolve<GoogleOAuthService>("GoogleOAuthService");
        return new OAuthHandler(initiateData, oauthStateService, googleOAuthService);
    });

    container.registerFactory("UserHandler", () => {
        const service = container.resolve<AuthService>("AuthService");
        return new UserHandler(service);
    });

    container.registerFactory("WhitelistController", () => {
        const service = container.resolve<WhitelistService>("WhitelistService");
        return new WhitelistController(service);
    });

    console.log("🔐 Auth Module Registered");
}
