/**
 * AdminService Tests - اختبارات خدمة الإدارة
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { AdminService } from "./AdminService";
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import {
  SearchUsersRequest,
  UpdateUserRequest,
} from "@/domain/types/user";

describe("AdminService", () => {
  let adminService: AdminService;
  let mockDatabaseAdapter: DatabaseCoreAdapter;

  beforeEach(() => {
    mockDatabaseAdapter = {
      find: vi.fn(),
      findOne: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as DatabaseCoreAdapter;

    adminService = new AdminService(mockDatabaseAdapter);
  });

  describe("getSystemStats", () => {
    it("should return system stats", async () => {
      // Arrange
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValue([]);
      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue({});

      // Act
      const result = await adminService.getSystemStats();

      // Assert
      expect(result).toHaveProperty("total_users");
      expect(result).toHaveProperty("active_users");
      expect(result).toHaveProperty("total_lessons");
      expect(result).toHaveProperty("total_learning_paths");
      expect(result).toHaveProperty("total_notifications");
      expect(result).toHaveProperty("system_health");
      expect(result).toHaveProperty("database_status");
      expect(result).toHaveProperty("server_status");
      expect(result).toHaveProperty("memory_usage");
    });
  });

  describe("getUserStats", () => {
    it("should return user stats", async () => {
      // Arrange
      const mockUsers = [
        {
          id: "1",
          role: "student",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          role: "developer",
          is_active: true,
          is_verified: false,
          created_at: new Date().toISOString(),
        },
      ];
      vi.mocked(mockDatabaseAdapter.find).mockResolvedValue(mockUsers);

      // Act
      const result = await adminService.getUserStats();

      // Assert
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("active");
      expect(result).toHaveProperty("inactive");
      expect(result).toHaveProperty("verified");
      expect(result).toHaveProperty("unverified");
      expect(result).toHaveProperty("by_role");
      expect(result).toHaveProperty("recent_registrations");
    });
  });

  describe("getContentStats", () => {
    it("should return content stats", async () => {
      // Arrange
      const mockLessons = [
        {
          id: "1",
          is_published: true,
          subject_id: "math",
          grade_level_id: "grade1",
        },
        {
          id: "2",
          is_published: false,
          subject_id: "science",
          grade_level_id: "grade2",
        },
      ];
      const mockPaths = [
        { id: "1", is_published: true },
        { id: "2", is_published: false },
      ];

      vi.mocked(mockDatabaseAdapter.find)
        .mockResolvedValueOnce(mockLessons)
        .mockResolvedValueOnce(mockPaths);

      // Act
      const result = await adminService.getContentStats();

      // Assert
      expect(result).toHaveProperty("total_lessons");
      expect(result).toHaveProperty("published_lessons");
      expect(result).toHaveProperty("draft_lessons");
      expect(result).toHaveProperty("total_learning_paths");
      expect(result).toHaveProperty("published_paths");
      expect(result).toHaveProperty("draft_paths");
      expect(result).toHaveProperty("by_subject");
      expect(result).toHaveProperty("by_grade_level");
    });
  });

  describe("searchUsers", () => {
    it("should search users successfully", async () => {
      // Arrange
      const request: SearchUsersRequest = {
        page: 1,
        per_page: 20,
      };

      const mockUsers = [
        {
          id: "1",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          role: "student",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          login_count: 5,
        },
      ];

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValue(mockUsers);

      // Act
      const result = await adminService.searchUsers(request);

      // Assert
      expect(result).toHaveProperty("users");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("per_page");
      expect(result).toHaveProperty("total_pages");
      expect(Array.isArray(result.users)).toBe(true);
    });

    it("should filter users by query", async () => {
      // Arrange
      const request: SearchUsersRequest = {
        page: 1,
        per_page: 20,
        query: "test",
      };

      const mockUsers = [
        {
          id: "1",
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          role: "student",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          login_count: 5,
        },
        {
          id: "2",
          email: "other@example.com",
          first_name: "Other",
          last_name: "User",
          username: "otheruser",
          role: "developer",
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          login_count: 2,
        },
      ];

      vi.mocked(mockDatabaseAdapter.find).mockResolvedValue(mockUsers);

      // Act
      const result = await adminService.searchUsers(request);

      // Assert
      expect(result.users.length).toBeLessThanOrEqual(mockUsers.length);
      if (result.users.length > 0) {
        const user = result.users[0];
        expect(
          user.email.toLowerCase().includes("test") ||
            (user.first_name &&
              user.first_name.toLowerCase().includes("test")) ||
            (user.username && user.username.toLowerCase().includes("test")),
        ).toBe(true);
      }
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      // Arrange
      const userId = "user-123";
      const request: UpdateUserRequest = {
        first_name: "Updated",
        role: "teacher",
      };

      const existingUser = {
        id: userId,
        email: "test@example.com",
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        role: "student",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        login_count: 5,
      };

      const updatedUser = {
        ...existingUser,
        ...request,
        updated_at: new Date().toISOString(),
      };

      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(existingUser);
      vi.mocked(mockDatabaseAdapter.update).mockResolvedValue(updatedUser);

      // Act
      const result = await adminService.updateUser(userId, request);

      // Assert
      expect(result).toHaveProperty("id", userId);
      expect(result).toHaveProperty("first_name", "Updated");
      expect(result).toHaveProperty("role", "teacher");
      expect(mockDatabaseAdapter.update).toHaveBeenCalled();
    });

    it("should throw error if user not found", async () => {
      // Arrange
      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

      // Act & Assert
      await expect(
        adminService.updateUser("invalid-id", { first_name: "Test" }),
      ).rejects.toThrow("المستخدم غير موجود");
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      // Arrange
      const userId = "user-123";
      const existingUser = { id: userId };

      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(existingUser);
      vi.mocked(mockDatabaseAdapter.delete).mockResolvedValue(true);

      // Act
      await adminService.deleteUser(userId);

      // Assert
      expect(mockDatabaseAdapter.delete).toHaveBeenCalledWith("users", {
        id: userId,
      });
    });

    it("should throw error if user not found", async () => {
      // Arrange
      vi.mocked(mockDatabaseAdapter.findOne).mockResolvedValue(null);

      // Act & Assert
      await expect(adminService.deleteUser("invalid-id")).rejects.toThrow(
        "المستخدم غير موجود",
      );
    });
  });
});
