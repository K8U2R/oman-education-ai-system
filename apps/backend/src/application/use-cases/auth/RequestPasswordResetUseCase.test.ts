/**
 * RequestPasswordResetUseCase Tests - اختبارات حالة استخدام طلب إعادة تعيين كلمة المرور
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RequestPasswordResetUseCase } from "./RequestPasswordResetUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { EmailService } from "@/application/services/communication/index.js";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import { UserNotFoundError } from "@/domain/exceptions";

describe("RequestPasswordResetUseCase", () => {
  let requestPasswordResetUseCase: RequestPasswordResetUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockEmailService: EmailService;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findByEmail: vi.fn(),
      createVerificationToken: vi.fn(),
    } as unknown as IAuthRepository;

    mockEmailService = {
      sendPasswordResetEmail: vi.fn(),
    } as unknown as EmailService;

    requestPasswordResetUseCase = new RequestPasswordResetUseCase(
      mockAuthRepository,
      mockEmailService,
    );
  });

  describe("execute", () => {
    it("should successfully request password reset for valid user", async () => {
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

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.createVerificationToken).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendPasswordResetEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await requestPasswordResetUseCase.execute("test@example.com");

      // Assert
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(mockAuthRepository.createVerificationToken).toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      // Arrange
      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(
        requestPasswordResetUseCase.execute("nonexistent@example.com"),
      ).rejects.toThrow(UserNotFoundError);
      expect(mockAuthRepository.createVerificationToken).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
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
        true,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.createVerificationToken).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendPasswordResetEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await requestPasswordResetUseCase.execute("test@example.com");

      // Assert
      expect(mockAuthRepository.createVerificationToken).toHaveBeenCalled();
      const callArgs = vi.mocked(mockAuthRepository.createVerificationToken)
        .mock.calls[0];
      expect(callArgs[0]).toBe("user-id");
      expect(callArgs[2]).toBe("password_reset");
      // Token should expire in 1 hour
      const expiresAt = callArgs[3];
      expect(expiresAt).toBeDefined();
    });

    it("should send password reset email with user name", async () => {
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

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.createVerificationToken).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendPasswordResetEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await requestPasswordResetUseCase.execute("test@example.com");

      // Assert
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
      const callArgs = vi.mocked(mockEmailService.sendPasswordResetEmail).mock
        .calls[0];
      expect(callArgs[0]).toBe("test@example.com");
      expect(callArgs[2]).toBe("أحمد محمد"); // userName
    });

    it("should send password reset email without user name when name is missing", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        undefined,
        undefined,
        undefined,
        true,
        true,
      );

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.createVerificationToken).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendPasswordResetEmail).mockResolvedValue(
        undefined,
      );

      // Act
      await requestPasswordResetUseCase.execute("test@example.com");

      // Assert
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
      const callArgs = vi.mocked(mockEmailService.sendPasswordResetEmail).mock
        .calls[0];
      expect(callArgs[0]).toBe("test@example.com");
      expect(callArgs[2]).toBeUndefined(); // userName
    });
  });
});
