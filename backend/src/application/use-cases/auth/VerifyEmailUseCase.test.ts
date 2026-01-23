/**
 * VerifyEmailUseCase Tests - اختبارات حالة استخدام التحقق من البريد الإلكتروني
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { VerifyEmailUseCase } from "./VerifyEmailUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";

import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import {
  VerificationTokenInvalidError,
  VerificationTokenExpiredError,
  VerificationTokenAlreadyUsedError,
  EmailAlreadyVerifiedError,
  UserNotFoundError,
} from "@/domain/exceptions";
import { VerificationTokenData } from "@/domain/types/auth";

describe("VerifyEmailUseCase", () => {
  let verifyEmailUseCase: VerifyEmailUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockVerificationTokenRepository: IVerificationTokenRepository;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findById: vi.fn(),
      updateUser: vi.fn(),
    } as unknown as IAuthRepository;

    mockVerificationTokenRepository = {
      save: vi.fn(),
      findByTokenAndType: vi.fn(),
      markAsUsed: vi.fn(),
      deleteExpiredForUser: vi.fn(),
    } as unknown as IVerificationTokenRepository;

    verifyEmailUseCase = new VerifyEmailUseCase(
      mockAuthRepository,
      mockVerificationTokenRepository,
    );
  });

  describe("execute", () => {
    it("should successfully verify email with valid token", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false, // isVerified = false
      );

      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true, // isVerified = true
      );

      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: "valid-token-with-sufficient-length-greater-than-32-chars",
        type: "email_verification",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(tokenData);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);
      vi.mocked(mockVerificationTokenRepository.markAsUsed).mockResolvedValue(
        undefined,
      );

      // Act
      const result = await verifyEmailUseCase.execute(
        "valid-token-with-sufficient-length-greater-than-32-chars",
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.isVerified).toBe(true);
      expect(
        mockVerificationTokenRepository.findByTokenAndType,
      ).toHaveBeenCalledWith(
        "valid-token-with-sufficient-length-greater-than-32-chars",
        "email_verification",
      );
      expect(mockAuthRepository.findById).toHaveBeenCalledWith("user-id");
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        is_verified: true,
      });
      expect(mockVerificationTokenRepository.markAsUsed).toHaveBeenCalledWith(
        "token-id",
      );
    });

    it("should throw VerificationTokenInvalidError when token is not found", async () => {
      // Arrange
      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(null);

      // Act & Assert
      await expect(verifyEmailUseCase.execute("invalid-token")).rejects.toThrow(
        VerificationTokenInvalidError,
      );
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw VerificationTokenExpiredError when token is expired", async () => {
      // Arrange
      const validLongToken =
        "valid-token-with-sufficient-length-greater-than-32-chars";
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: validLongToken,
        type: "email_verification",
        expires_at: new Date(Date.now() - 1000).toISOString(), // Expired
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(tokenData);

      // Act & Assert
      await expect(verifyEmailUseCase.execute(validLongToken)).rejects.toThrow(
        VerificationTokenExpiredError,
      );
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw VerificationTokenAlreadyUsedError when token is already used", async () => {
      // Arrange
      const validLongToken =
        "valid-token-with-sufficient-length-greater-than-32-chars";
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: validLongToken,
        type: "email_verification",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: true, // Already used
        created_at: new Date().toISOString(),
      };

      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(tokenData);

      // Act & Assert
      await expect(verifyEmailUseCase.execute(validLongToken)).rejects.toThrow(
        VerificationTokenAlreadyUsedError,
      );
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user is not found", async () => {
      // Arrange
      const validLongToken =
        "valid-token-with-sufficient-length-greater-than-32-chars";
      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "non-existent-user",
        token: validLongToken,
        type: "email_verification",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(tokenData);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(null);

      // Act & Assert
      await expect(verifyEmailUseCase.execute(validLongToken)).rejects.toThrow(
        UserNotFoundError,
      );
    });

    it("should throw EmailAlreadyVerifiedError when email is already verified", async () => {
      // Arrange
      const validLongToken =
        "valid-token-with-sufficient-length-greater-than-32-chars";
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true, // isVerified = true
      );

      const tokenData: VerificationTokenData = {
        id: "token-id",
        user_id: "user-id",
        token: validLongToken,
        type: "email_verification",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      };

      vi.mocked(
        mockVerificationTokenRepository.findByTokenAndType,
      ).mockResolvedValue(tokenData);
      vi.mocked(mockAuthRepository.findById).mockResolvedValue(user);

      // Act & Assert
      await expect(verifyEmailUseCase.execute(validLongToken)).rejects.toThrow(
        EmailAlreadyVerifiedError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });
  });
});
