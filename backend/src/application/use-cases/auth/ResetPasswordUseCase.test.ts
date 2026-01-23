/**
 * ResetPasswordUseCase Tests - اختبارات حالة استخدام إعادة تعيين كلمة المرور
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import {
  VerificationTokenInvalidError,
  VerificationTokenExpiredError,
  VerificationTokenAlreadyUsedError,
  UserNotFoundError,
  InvalidPasswordError,
} from "@/domain/exceptions";
import { VerificationTokenData } from "@/domain/types/auth";

describe("ResetPasswordUseCase", () => {
  let resetPasswordUseCase: ResetPasswordUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    // Create mock
    mockAuthRepository = {
      findVerificationToken: vi.fn(),
      findById: vi.fn(),
      updatePasswordHash: vi.fn(),
      markVerificationTokenAsUsed: vi.fn(),
    } as unknown as IAuthRepository;

    resetPasswordUseCase = new ResetPasswordUseCase(mockAuthRepository);
  });

  describe("execute", () => {
    it("should successfully reset password with valid token", async () => {
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
      );

      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "valid-token",
        type: "password_reset",
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.updatePasswordHash).mockResolvedValue(
        undefined,
      );
      vi.mocked(
        mockAuthRepository.markVerificationTokenAsUsed,
      ).mockResolvedValue(undefined);

      // Act
      await resetPasswordUseCase.execute({
        token: "valid-token",
        newPassword: "NewSecurePass123",
      });

      // Assert
      expect(mockAuthRepository.findVerificationToken).toHaveBeenCalledWith(
        "valid-token",
      );
      expect(mockAuthRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockAuthRepository.updatePasswordHash).toHaveBeenCalled();
      expect(
        mockAuthRepository.markVerificationTokenAsUsed,
      ).toHaveBeenCalledWith("token-id");
    });

    it("should throw VerificationTokenInvalidError when token is not found", async () => {
      // Arrange
      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        null,
      );

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "invalid-token",
          newPassword: "NewSecurePass123",
        }),
      ).rejects.toThrow(VerificationTokenInvalidError);
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw VerificationTokenInvalidError when token type is not password_reset", async () => {
      // Arrange
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "valid-token",
        type: "email_verification", // Wrong type
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "valid-token",
          newPassword: "NewSecurePass123",
        }),
      ).rejects.toThrow(VerificationTokenInvalidError);
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw VerificationTokenExpiredError when token is expired", async () => {
      // Arrange
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "expired-token",
        type: "password_reset",
        expires_at: new Date(Date.now() - 1000).toISOString(), // Expired
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "expired-token",
          newPassword: "NewSecurePass123",
        }),
      ).rejects.toThrow(VerificationTokenExpiredError);
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw VerificationTokenAlreadyUsedError when token is already used", async () => {
      // Arrange
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "used-token",
        type: "password_reset",
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: true, // Already used
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "used-token",
          newPassword: "NewSecurePass123",
        }),
      ).rejects.toThrow(VerificationTokenAlreadyUsedError);
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user is not found", async () => {
      // Arrange
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "non-existent-user",
        token: "valid-token",
        type: "password_reset",
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "valid-token",
          newPassword: "NewSecurePass123",
        }),
      ).rejects.toThrow(UserNotFoundError);
    });

    it("should throw InvalidPasswordError for weak password", async () => {
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
      );

      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "valid-token",
        type: "password_reset",
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(mockAuthRepository.findVerificationToken).mockResolvedValue(
        tokenData,
      );
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);

      // Act & Assert
      await expect(
        resetPasswordUseCase.execute({
          token: "valid-token",
          newPassword: "weak", // Too weak
        }),
      ).rejects.toThrow(InvalidPasswordError);
      expect(mockAuthRepository.updatePasswordHash).not.toHaveBeenCalled();
    });
  });
});
