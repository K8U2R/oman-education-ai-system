/**
 * LoginUseCase Tests - اختبارات حالة استخدام تسجيل الدخول
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoginUseCase } from "./LoginUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import {
  AuthenticationFailedError,
  UserNotFoundError,
  AccountNotVerifiedError,
  AccountDisabledError,
} from "@/domain/exceptions";
import { LoginRequest, LoginResponse } from "@/domain/types/auth";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    // Create mocks
    mockAuthRepository = {
      findByEmail: vi.fn(),
      login: vi.fn(),
    } as unknown as IAuthRepository;

    loginUseCase = new LoginUseCase(mockAuthRepository);
  });

  describe("execute", () => {
    it("should successfully login with valid credentials", async () => {
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

      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "SecurePass123",
      };

      const loginResponse: LoginResponse = {
        user: user.toData(),
        tokens: {
          access_token: "access-token",
          refresh_token: "refresh-token",
          token_type: "Bearer",
          expires_in: 3600,
        },
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.login).mockResolvedValue(loginResponse);

      // Act
      const result = await loginUseCase.execute(loginRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.user.id).toBe(user.id);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.access_token).toBe("access-token");
      expect(result.tokens.refresh_token).toBe("refresh-token");
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(mockAuthRepository.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "SecurePass123",
      });
    });

    it("should throw AuthenticationFailedError for invalid email format", async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: "invalid-email",
        password: "SecurePass123",
      };

      // Act & Assert
      await expect(loginUseCase.execute(loginRequest)).rejects.toThrow(
        AuthenticationFailedError,
      );
      expect(mockAuthRepository.findByEmail).not.toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      // Arrange
      const loginRequest: LoginRequest = {
        email: "nonexistent@example.com",
        password: "SecurePass123",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(null);

      // Act & Assert
      await expect(loginUseCase.execute(loginRequest)).rejects.toThrow(
        UserNotFoundError,
      );
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com",
      );
      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it("should throw AccountDisabledError when account is disabled", async () => {
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

      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "SecurePass123",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);

      // Act & Assert
      await expect(loginUseCase.execute(loginRequest)).rejects.toThrow(
        AccountDisabledError,
      );
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(mockAuthRepository.login).not.toHaveBeenCalled();
    });

    it("should throw AccountNotVerifiedError when account is not verified (production)", async () => {
      // Arrange
      // Mock environment to be production
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const email = new Email("test@example.com");
      const user = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        false, // isVerified = false
        undefined,
        "student",
      );

      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "SecurePass123",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);

      // Create new instance to pick up environment change
      const productionLoginUseCase = new LoginUseCase(mockAuthRepository);

      // Act & Assert
      await expect(
        productionLoginUseCase.execute(loginRequest),
      ).rejects.toThrow(AccountNotVerifiedError);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it("should throw AuthenticationFailedError when password is incorrect", async () => {
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

      const loginRequest: LoginRequest = {
        email: "test@example.com",
        password: "WrongPassword123",
      };

      vi.mocked(mockAuthRepository.findByEmail).mockResolvedValue(user);
      vi.mocked(mockAuthRepository.login).mockRejectedValue(
        new Error("Invalid password"),
      );

      // Act & Assert
      await expect(loginUseCase.execute(loginRequest)).rejects.toThrow(
        AuthenticationFailedError,
      );
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com",
      );
      expect(mockAuthRepository.login).toHaveBeenCalled();
    });
  });
});
