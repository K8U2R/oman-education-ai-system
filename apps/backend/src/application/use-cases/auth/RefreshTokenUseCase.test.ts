/**
 * RefreshTokenUseCase Tests - اختبارات حالة استخدام تحديث Token
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { IRefreshTokenRepository } from "@/domain/interfaces/repositories";
import { ITokenService } from "./LoginUseCase";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import { InvalidTokenError } from "@/domain/exceptions";
import { RefreshTokenRequest } from "@/domain/types/auth";

describe("RefreshTokenUseCase", () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockTokenService: ITokenService;
  let mockRefreshTokenRepository: IRefreshTokenRepository;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findById: vi.fn(),
    } as unknown as IAuthRepository;

    mockRefreshTokenRepository = {
      findByToken: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      invalidateAllForUser: vi.fn(),
    } as unknown as IRefreshTokenRepository;

    mockTokenService = {
      verifyToken: vi.fn(),
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
    } as unknown as ITokenService;

    refreshTokenUseCase = new RefreshTokenUseCase(
      mockAuthRepository,
      mockTokenService,
      mockRefreshTokenRepository,
    );
  });

  describe("execute", () => {
    it("should successfully refresh token with valid refresh token", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
        undefined,
        "student",
      );

      const request: RefreshTokenRequest = {
        refresh_token: "valid-refresh-token",
      };

      const tokenPayload = {
        userId: "user-id",
        email: "test@example.com",
        role: "student",
        type: "refresh" as const,
      };

      vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);
      vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
        "new-access-token",
      );
      vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
        "new-refresh-token",
      );

      vi.mocked(mockRefreshTokenRepository.findByToken).mockResolvedValue({
        id: "token-id",
        user_id: "user-id",
        token: "valid-refresh-token",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        used: false,
        revoked: false,
      });

      // Act
      const result = await refreshTokenUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.tokens.access_token).toBe("new-access-token");
      expect(result.tokens.refresh_token).toBe("new-refresh-token");
      expect(result.tokens.token_type).toBe("Bearer");
      expect(result.tokens.expires_in).toBe(3600);
      expect(mockTokenService.verifyToken).toHaveBeenCalledWith(
        "valid-refresh-token",
      );
      expect(mockAuthRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
        "user-id",
        "test@example.com",
        "student",
      );
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(
        "user-id",
        "test@example.com",
      );
    });

    it("should throw InvalidTokenError when refresh token is invalid", async () => {
      // Arrange
      const request: RefreshTokenRequest = {
        refresh_token: "invalid-refresh-token",
      };

      vi.mocked(mockTokenService.verifyToken).mockReturnValue(null);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(request)).rejects.toThrow(
        InvalidTokenError,
      );
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw InvalidTokenError when user is not found", async () => {
      // Arrange
      const request: RefreshTokenRequest = {
        refresh_token: "valid-refresh-token",
      };

      const tokenPayload = {
        userId: "non-existent-user",
        email: "test@example.com",
        role: "student",
        type: "refresh" as const,
      };

      vi.mocked(mockRefreshTokenRepository.findByToken).mockResolvedValue({
        id: "token-id",
        user_id: "non-existent-user",
        token: "valid-refresh-token",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        used: false,
        revoked: false,
      });

      vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(request)).rejects.toThrow(
        InvalidTokenError,
      );
      expect(mockAuthRepository.findById).toHaveBeenCalledWith(
        "non-existent-user",
      );
    });

    it("should throw InvalidTokenError when user account is disabled", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        false, // isActive = false
        true,
        undefined,
        "student",
      );

      const request: RefreshTokenRequest = {
        refresh_token: "valid-refresh-token",
      };

      const tokenPayload = {
        userId: "user-id",
        email: "test@example.com",
        role: "student",
        type: "refresh" as const,
      };

      vi.mocked(mockRefreshTokenRepository.findByToken).mockResolvedValue({
        id: "token-id",
        user_id: "user-id",
        token: "valid-refresh-token",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        used: false,
        revoked: false,
      });

      vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);

      // Act & Assert
      await expect(refreshTokenUseCase.execute(request)).rejects.toThrow(
        InvalidTokenError,
      );
      expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    });

    it("should generate new tokens with correct user data", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
        undefined,
        "developer",
      );

      const request: RefreshTokenRequest = {
        refresh_token: "valid-refresh-token",
      };

      const tokenPayload = {
        userId: "user-id",
        email: "test@example.com",
        role: "student",
        type: "refresh" as const,
      };

      vi.mocked(mockTokenService.verifyToken).mockReturnValue(tokenPayload);
      vi.mocked(mockRefreshTokenRepository.findByToken).mockResolvedValue({
        id: "token-id",
        user_id: "user-id",
        token: "valid-refresh-token",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        used: false,
        revoked: false,
      });
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);
      vi.mocked(mockTokenService.generateAccessToken).mockReturnValue(
        "new-access-token",
      );
      vi.mocked(mockTokenService.generateRefreshToken).mockReturnValue(
        "new-refresh-token",
      );
      vi.mocked(mockRefreshTokenRepository.create).mockResolvedValue({
        id: "new-token-id",
        user_id: "user-id",
        token: "new-refresh-token",
        expires_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        used: false,
        revoked: false,
      });

      // Act
      await refreshTokenUseCase.execute(request);

      // Assert
      expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
        "user-id",
        "test@example.com",
        "developer",
      );
      expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(
        "user-id",
        "test@example.com",
      );
    });
  });
});
