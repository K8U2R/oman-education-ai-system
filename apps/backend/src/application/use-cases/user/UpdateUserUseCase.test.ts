/**
 * UpdateUserUseCase Tests - اختبارات حالة استخدام تحديث بيانات المستخدم
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { IAuthRepository } from "@/domain/interfaces/repositories";
import { User } from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import { UserNotFoundError, ValidationError } from "@/domain/exceptions";

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    // Create mock
    mockAuthRepository = {
      updateUser: vi.fn(),
      getCurrentUser: vi.fn(),
    } as unknown as IAuthRepository;

    updateUserUseCase = new UpdateUserUseCase(mockAuthRepository);
  });

  describe("execute", () => {
    it("should successfully update user first_name", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          first_name: "أحمد",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.firstName).toBe("أحمد");
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        first_name: "أحمد",
      });
    });

    it("should successfully update user last_name", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          last_name: "محمد",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        last_name: "محمد",
      });
    });

    it("should successfully update user username", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        "ahmed_mohammed",
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          username: "ahmed_mohammed",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        username: "ahmed_mohammed",
      });
    });

    it("should successfully update user avatar_url", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
        "https://example.com/avatar.jpg",
      );

      const request = {
        userId: "user-id",
        data: {
          avatar_url: "https://example.com/avatar.jpg",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        avatar_url: "https://example.com/avatar.jpg",
      });
    });

    it("should successfully update multiple fields", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        "ahmed_mohammed",
        true,
        true,
        "https://example.com/avatar.jpg",
      );

      const request = {
        userId: "user-id",
        data: {
          first_name: "أحمد",
          last_name: "محمد",
          username: "ahmed_mohammed",
          avatar_url: "https://example.com/avatar.jpg",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        first_name: "أحمد",
        last_name: "محمد",
        username: "ahmed_mohammed",
        avatar_url: "https://example.com/avatar.jpg",
      });
    });

    it("should throw UserNotFoundError for invalid userId", async () => {
      // Arrange
      const request = {
        userId: "",
        data: {
          first_name: "أحمد",
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        UserNotFoundError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for first_name exceeding 100 characters", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          first_name: "أ".repeat(101), // 101 characters
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        ValidationError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for last_name exceeding 100 characters", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          last_name: "أ".repeat(101), // 101 characters
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        ValidationError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid username format", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          username: "ahmed-mohammed!", // Contains invalid characters
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        ValidationError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for username exceeding 100 characters", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          username: "a".repeat(101), // 101 characters
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        ValidationError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid avatar_url", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          avatar_url: "not-a-valid-url",
        },
      };

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        ValidationError,
      );
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
    });

    it("should return current user when no data to update", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const currentUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {},
      };

      vi.mocked(mockAuthRepository.getCurrentUser).mockResolvedValue(
        currentUser,
      );

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe("user-id");
      expect(mockAuthRepository.updateUser).not.toHaveBeenCalled();
      expect(mockAuthRepository.getCurrentUser).toHaveBeenCalledWith("user-id");
    });

    it("should clear username when set to null", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          username: null as unknown as string,
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(updatedUser);
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        username: undefined,
      });
    });

    it("should clear avatar_url when set to null", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          avatar_url: null as unknown as string,
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      const result = await updateUserUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual(updatedUser);
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        avatar_url: undefined,
      });
    });

    it("should trim whitespace from first_name", async () => {
      // Arrange
      const email = new Email("test@example.com");
      const updatedUser = new User(
        "user-id",
        email,
        "أحمد",
        "محمد",
        undefined,
        true,
        true,
      );

      const request = {
        userId: "user-id",
        data: {
          first_name: "  أحمد  ",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockResolvedValue(updatedUser);

      // Act
      await updateUserUseCase.execute(request);

      // Assert
      expect(mockAuthRepository.updateUser).toHaveBeenCalledWith("user-id", {
        first_name: "أحمد",
      });
    });

    it("should wrap unexpected errors as UserNotFoundError", async () => {
      // Arrange
      const request = {
        userId: "user-id",
        data: {
          first_name: "أحمد",
        },
      };

      vi.mocked(mockAuthRepository.updateUser).mockRejectedValue(
        new Error("Database connection error"),
      );

      // Act & Assert
      await expect(updateUserUseCase.execute(request)).rejects.toThrow(
        UserNotFoundError,
      );
    });
  });
});
