/**
 * UpdatePasswordUseCase Tests - اختبارات حالة استخدام تحديث كلمة المرور
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdatePasswordUseCase } from "./UpdatePasswordUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import {
  UserNotFoundError,
  AuthenticationFailedError,
  InvalidPasswordError,
} from "@/domain/exceptions";

describe("UpdatePasswordUseCase", () => {
  let updatePasswordUseCase: UpdatePasswordUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    // Create mock
    mockAuthRepository = {
      updatePassword: vi.fn(),
    } as unknown as IAuthRepository;

    updatePasswordUseCase = new UpdatePasswordUseCase(mockAuthRepository);
  });

  describe("execute", () => {
    it("should successfully update password with valid credentials", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "CurrentPass123",
        newPassword: "NewSecurePass456",
      };

      vi.mocked(mockAuthRepository.updatePassword).mockResolvedValue(undefined);

      // Act
      await updatePasswordUseCase.execute(request);

      // Assert
      expect(mockAuthRepository.updatePassword).toHaveBeenCalledWith(
        "user-id",
        "CurrentPass123",
        "NewSecurePass456",
      );
    });

    it("should throw UserNotFoundError for invalid userId", async () => {
      // Arrange
      const request = {
        userId: "",
        currentPassword: "CurrentPass123",
        newPassword: "NewSecurePass456",
      };

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        UserNotFoundError,
      );
      expect(mockAuthRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError for weak new password", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "CurrentPass123",
        newPassword: "weak", // Too short
      };

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        InvalidPasswordError,
      );
      expect(mockAuthRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError when new password is same as current", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "SamePassword123",
        newPassword: "SamePassword123",
      };

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        InvalidPasswordError,
      );
      expect(mockAuthRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw AuthenticationFailedError when current password is incorrect", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "WrongPassword123",
        newPassword: "NewSecurePass456",
      };

      vi.mocked(mockAuthRepository.updatePassword).mockRejectedValue(
        new AuthenticationFailedError("كلمة المرور الحالية غير صحيحة"),
      );

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        AuthenticationFailedError,
      );
      expect(mockAuthRepository.updatePassword).toHaveBeenCalled();
    });

    it("should throw UserNotFoundError when user does not exist", async () => {
      // Arrange
      const request = {
        userId: "non-existent-user",
        currentPassword: "CurrentPass123",
        newPassword: "NewSecurePass456",
      };

      vi.mocked(mockAuthRepository.updatePassword).mockRejectedValue(
        new UserNotFoundError("المستخدم غير موجود"),
      );

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        UserNotFoundError,
      );
      expect(mockAuthRepository.updatePassword).toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError for password without uppercase", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "CurrentPass123",
        newPassword: "newsecurepass456", // No uppercase
      };

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        InvalidPasswordError,
      );
      expect(mockAuthRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw InvalidPasswordError for password without number", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "CurrentPass123",
        newPassword: "NewSecurePass", // No number
      };

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        InvalidPasswordError,
      );
      expect(mockAuthRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should wrap unexpected errors as AuthenticationFailedError", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        currentPassword: "CurrentPass123",
        newPassword: "NewSecurePass456",
      };

      vi.mocked(mockAuthRepository.updatePassword).mockRejectedValue(
        new Error("Database connection error"),
      );

      // Act & Assert
      await expect(updatePasswordUseCase.execute(request)).rejects.toThrow(
        AuthenticationFailedError,
      );
    });
  });
});
