/**
 * RegisterUseCase Tests - اختبارات حالة استخدام التسجيل
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { RegisterUseCase } from "./RegisterUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { IVerificationTokenRepository } from "@/domain/interfaces/repositories";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import {
  UserAlreadyExistsError,
  InvalidEmailError,
  InvalidPasswordError,
} from "@/domain/exceptions";
import { RegisterRequest } from "@/domain/types/auth";
import { EmailService } from "@/application/services";

describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUseCase;
  let mockAuthRepository: IAuthRepository;
  let mockEmailService: EmailService;
  let mockVerificationTokenRepository: IVerificationTokenRepository;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findByEmail: vi.fn(),
      register: vi.fn(),
    } as unknown as IAuthRepository;

    mockEmailService = {
      sendVerificationEmail: vi.fn(),
    } as unknown as EmailService;

    mockVerificationTokenRepository = {
      save: vi.fn(),
      findByTokenAndType: vi.fn(),
      markAsUsed: vi.fn(),
      deleteExpiredForUser: vi.fn(),
    } as unknown as IVerificationTokenRepository;

    registerUseCase = new RegisterUseCase(
      mockAuthRepository,
      mockEmailService,
      mockVerificationTokenRepository,
    );
  });

  describe("execute", () => {
    it("should successfully register a new user", async () => {
      // Arrange
      const email = new Email("newuser@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        "ahmed_mohammed",
        true,
        false,
        undefined,
        "student",
      );

      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "SecurePass123",
        first_name: "أحمد",
        last_name: "محمد",
        username: "ahmed_mohammed",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockAuthRepository.register).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.register).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockResolvedValue(
        undefined,
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockResolvedValue(
        undefined,
      );

      // Act
      const result = await registerUseCase.execute(registerRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe("user-id");
      expect(result.email.toString()).toBe("newuser@example.com");
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "newuser@example.com",
      );
      expect(mockAuthRepository.register).toHaveBeenCalled();
    });

    it("should throw InvalidEmailError for invalid email format", async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: "invalid-email",
        password: "SecurePass123",
        first_name: "أحمد",
        last_name: "محمد",
      };

      // Act & Assert
      await expect(registerUseCase.execute(registerRequest)).rejects.toThrow(
        InvalidEmailError,
      );
      expect(mockAuthRepository.findByEmail).not.toHaveBeenCalled();
    });

    it("should throw UserAlreadyExistsError when user already exists", async () => {
      // Arrange
      const email = new Email("existing@example.com");
      const existingUser = new User(
        "existing-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
        undefined,
        "student",
      );

      const registerRequest: RegisterRequest = {
        email: "existing@example.com",
        password: "SecurePass123",
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUseCase.execute(registerRequest)).rejects.toThrow(
        UserAlreadyExistsError,
      );
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "existing@example.com",
      );
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError for weak password", async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "weak", // Too short, no uppercase, no number
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(registerUseCase.execute(registerRequest)).rejects.toThrow(
        InvalidPasswordError,
      );
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "newuser@example.com",
      );
      expect(mockAuthRepository.register).not.toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError for password without uppercase", async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "securepass123", // No uppercase
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(registerUseCase.execute(registerRequest)).rejects.toThrow(
        InvalidPasswordError,
      );
    });

    it("should throw InvalidPasswordError for password without number", async () => {
      // Arrange
      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "SecurePass", // No number
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(registerUseCase.execute(registerRequest)).rejects.toThrow(
        InvalidPasswordError,
      );
    });

    it("should register user without email service if not provided", async () => {
      // Arrange
      const registerUseCaseWithoutEmail = new RegisterUseCase(
        mockAuthRepository,
      );

      const email = new Email("newuser@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
        undefined,
        "student",
      );

      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "SecurePass123",
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockAuthRepository.register).mockResolvedValue(user);

      // Act
      const result = await registerUseCaseWithoutEmail.execute(registerRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe("user-id");
    });

    it("should continue registration even if verification email fails", async () => {
      // Arrange
      const email = new Email("newuser@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false,
        undefined,
        "student",
      );

      const registerRequest: RegisterRequest = {
        email: "newuser@example.com",
        password: "SecurePass123",
        first_name: "أحمد",
        last_name: "محمد",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);
      vi.mocked(mockAuthRepository.register).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.register).mockResolvedValue(user);
      vi.mocked(mockVerificationTokenRepository.save).mockRejectedValue(
        new Error("Database error"),
      );
      vi.mocked(mockEmailService.sendVerificationEmail).mockRejectedValue(
        new Error("Email service error"),
      );

      // Act
      const result = await registerUseCase.execute(registerRequest);

      // Assert
      // Registration should succeed even if email fails
      expect(result).toBeDefined();
      expect(result.id).toBe("user-id");
    });
  });
});
