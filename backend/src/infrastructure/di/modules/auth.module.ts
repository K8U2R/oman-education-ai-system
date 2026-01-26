import { container } from "../Container.js";
import { TokenService, AuthService } from "../../../application/services/auth/index.js";
import { AuthRepository } from "../../repositories/AuthRepository.js";
import { RefreshTokenRepository } from "../../repositories/RefreshTokenRepository.js";
import { VerificationTokenRepository } from "../../repositories/VerificationTokenRepository.js";
import { UserRepository } from "../../repositories/UserRepository.js";
import { GoogleOAuthRepository } from "../../repositories/GoogleOAuthRepository.js";
import { WhitelistRepository } from "../../repositories/WhitelistRepository.js";
import { AuthHandler } from "../../../presentation/api/handlers/auth/AuthHandler.js";
import { UserHandler } from "../../../presentation/api/handlers/user/UserHandler.js";

/**
 * Auth Module - وحدة الهوية والتحقق
 * Handles registration of authentication, users, and session security.
 */
export function registerAuthModule(): void {
    // Services
    container.register("TokenService", () => new TokenService(), "singleton");

    container.register(
        "AuthService",
        (c) =>
            new AuthService(
                c.resolve("AuthRepository"),
                c.resolve("DatabaseAdapter"),
                c.resolve("TokenService"),
            ),
        "singleton",
    );

    // Repositories
    container.register(
        "UserRepository",
        (c) => new UserRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );

    container.register(
        "RefreshTokenRepository",
        (c) => new RefreshTokenRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );

    container.register(
        "VerificationTokenRepository",
        (c) => new VerificationTokenRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );

    container.register(
        "AuthRepository",
        (c) =>
            new AuthRepository(
                c.resolve("DatabaseAdapter"),
                c.resolve("TokenService"),
                c.resolve("RefreshTokenRepository"),
            ),
        "transient",
    );

    container.register(
        "GoogleOAuthRepository",
        (c) => new GoogleOAuthRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );

    container.register(
        "WhitelistRepository",
        (c) => new WhitelistRepository(c.resolve("DatabaseAdapter")),
        "transient",
    );

    // Handlers
    container.register(
        "AuthHandler",
        (c) => new AuthHandler(c.resolve("AuthService")),
        "singleton",
    );

    container.register(
        "UserHandler",
        (c) => new UserHandler(c.resolve("UserRepository")),
        "singleton",
    );
}
