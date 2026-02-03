/**
 * SendVerificationEmailUseCase Tests - اختبارات حالة استخدام إرسال بريد التحقق
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { SendVerificationEmailUseCase } from "./SendVerificationEmailUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";
import { EmailService } from "@/application/services";

import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import {
  UserNotFoundError,
  EmailAlreadyVerifiedError,
} from "@/domain/exceptions";

describe("SendVerificationEmailUseCase", () => {
  let sendVerificationEmailUseCase: SendVerificationEmailUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockEmailService: EmailService;
  let mockVerificationTokenRepository: IVerificationTokenRepository;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findByEmail: vi.fn(),
    } as unknown as IAuthRepository;

    mockEmailService = {
      sendVerificationEmail: vi.fn(),
    } as unknown as EmailService;

    mockVerificationTokenRepository = {
      save: vi.fn(),
    } as unknown as IVerificationTokenRepository;

    sendVerificationEmailUseCase = new SendVerificationEmailUseCase(
      mockAuthRepository,
      mockEmailService,
      mockVerificationTokenRepository,
    );
  });

  describe("execute", () => {
    it("should successfully send verification email for unverified user", async () => {
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

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await sendVerificationEmailUseCase.execute("test@example.com");

      // Assert
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(mockVerificationTokenRepository.save).toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      // Arrange
      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(
        sendVerificationEmailUseCase.execute("nonexistent@example.com"),
      ).rejects.toThrow(UserNotFoundError);
      expect(mockVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should throw EmailAlreadyVerifiedError when email is already verified", async () => {
      // Arrange
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

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);

      // Act & Assert
      await expect(
        sendVerificationEmailUseCase.execute("test@example.com"),
      ).rejects.toThrow(EmailAlreadyVerifiedError);
      expect(mockVerificationTokenRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should create verification token with correct type and expiration", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await sendVerificationEmailUseCase.execute("test@example.com");

      // Assert
      expect(mockVerificationTokenRepository.save).toHaveBeenCalled();
      const callArgs = vi.mocked(mockVerificationTokenRepository.save).mock
        .calls[0];
      const tokenData = callArgs[0];
      expect(tokenData.user_id).toBe("user-id");
      expect(tokenData.type).toBe("email_verification");
      expect(tokenData.used).toBe(false);
      expect(tokenData.expires_at).toBeDefined();
    });

    it("should send verification email with user name", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await sendVerificationEmailUseCase.execute("test@example.com");

      // Assert
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
      const callArgs = vi.mocked(mockEmailService.sendVerificationEmail).mock
        .calls[0];
      expect(callArgs[0]).toBe("test@example.com");
      expect(callArgs[2]).toBe("أحمد محمد"); // userName
    });

    it("should send verification email without user name when name is missing", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        undefined,
        undefined,
        undefined,
        true,
        false,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await sendVerificationEmailUseCase.execute("test@example.com");

      // Assert
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalled();
      const callArgs = vi.mocked(mockEmailService.sendVerificationEmail).mock
        .calls[0];
      expect(callArgs[0]).toBe("test@example.com");
      expect(callArgs[2]).toBeUndefined(); // userName
    });

    it("should throw error when database insert fails", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockRejectedValue(
        new Error("Database error"),
      );

      // Act & Assert
      await expect(
        sendVerificationEmailUseCase.execute("test@example.com"),
      ).rejects.toThrow();
      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should throw error when email sending fails", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockRejectedValue(
        new Error("Email sending error"),
      );

      // Act & Assert
      await expect(
        sendVerificationEmailUseCase.execute("test@example.com"),
      ).rejects.toThrow();
    });
  });
});
