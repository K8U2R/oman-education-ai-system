import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter";
import {
  SystemStats,
  UserStats,
  ContentStats,
  UsageStats,
  AdminUserInfo,
  UpdateUserRequest,
  SearchUsersRequest,
  UserActivity,
} from "@/domain/types/user";
import { EnhancedBaseService } from "../base/EnhancedBaseService";

// Internal Row Types
interface UserRow {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  role?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  last_activity?: string;
  login_count?: number;
  permissions?: string[];
}

interface LessonRow {
  id: string;
  subject_id?: string;
  grade_level_id?: string;
  is_published: boolean;
}

interface LearningPathRow {
  id: string;
  is_published: boolean;
}

interface NotificationRow {
  id: string;
}

import { KnowledgeBaseService } from "@/application/services/knowledge/KnowledgeBaseService";

// ... (omitted)

export class AdminService extends EnhancedBaseService {
  private knowledgeBaseService?: KnowledgeBaseService;

  constructor(
    databaseAdapter: DatabaseCoreAdapter,
    knowledgeBaseService?: KnowledgeBaseService,
  ) {
    super(databaseAdapter);
    this.knowledgeBaseService = knowledgeBaseService;
  }

  protected getServiceName(): string {
    return "AdminService";
  }

  async ingestKnowledge(
    text: string,
    metadata: Record<string, unknown>,
  ): Promise<unknown> {
    if (!this.knowledgeBaseService) {
      throw new Error("KnowledgeBaseService is not connected");
    }
    return this.executeWithEnhancements(
      async () => {
        return await this.knowledgeBaseService!.ingestDocument(text, metadata);
      },
      { performanceTracking: true },
      { operation: "ingestKnowledge" },
    );
  }

  async getSystemStats(): Promise<SystemStats> {
    return this.executeWithEnhancements(
      async () => {
        const [allUsers, activeUsers, allLessons, allPaths, allNotifications] =
          await Promise.all([
            this.databaseAdapter.find<UserRow>("users", {}),
            this.databaseAdapter.find<UserRow>("users", { is_active: true }),
            this.databaseAdapter.find<LessonRow>("lessons", {}),
            this.databaseAdapter.find<LearningPathRow>("learning_paths", {}),
            this.databaseAdapter.find<NotificationRow>("notifications", {}),
          ]);

        let databaseStatus: "connected" | "disconnected" = "connected";
        try {
          await this.databaseAdapter.findOne("users", {});
        } catch {
          databaseStatus = "disconnected";
        }

        return {
          total_users: allUsers.length,
          active_users: activeUsers.length,
          total_lessons: allLessons.length,
          total_learning_paths: allPaths.length,
          total_notifications: allNotifications.length,
          system_health: databaseStatus === "connected" ? "healthy" : "error",
          database_status: databaseStatus,
          server_status: "active",

          memory_usage: Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024,
          ),
        };
      },
      {
        cacheWarming: ["users", "lessons", "learning_paths", "notifications"],
        performanceTracking: true,
      },
      {
        operation: "getSystemStats",
      },
    );
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const allUsers = await this.databaseAdapter.find<UserRow>("users", {});
      const activeUsers = allUsers.filter((u) => u.is_active);
      const verifiedUsers = allUsers.filter((u) => u.is_verified);

      const byRole: Record<string, number> = {};
      for (const user of allUsers) {
        const role = user.role || "student";
        byRole[role] = (byRole[role] || 0) + 1;
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentRegistrations = allUsers.filter((u) => {
        const createdAt = new Date(u.created_at);
        return createdAt >= sevenDaysAgo;
      }).length;

      return {
        total: allUsers.length,
        active: activeUsers.length,
        inactive: allUsers.length - activeUsers.length,
        verified: verifiedUsers.length,
        unverified: allUsers.length - verifiedUsers.length,
        by_role: byRole,
        recent_registrations: recentRegistrations,
      };
    } catch (error) {
      this.handleServiceError(error, "getUserStats");
    }
  }

  async getContentStats(): Promise<ContentStats> {
    try {
      const allLessons = await this.databaseAdapter.find<LessonRow>(
        "lessons",
        {},
      );
      const publishedLessons = allLessons.filter((l) => l.is_published);
      const draftLessons = allLessons.filter((l) => !l.is_published);

      const allPaths = await this.databaseAdapter.find<LearningPathRow>(
        "learning_paths",
        {},
      );
      const publishedPaths = allPaths.filter((p) => p.is_published);
      const draftPaths = allPaths.filter((p) => !p.is_published);

      const bySubject: Record<string, number> = {};
      for (const lesson of allLessons) {
        const subjectId = lesson.subject_id || "unknown";
        bySubject[subjectId] = (bySubject[subjectId] || 0) + 1;
      }

      const byGradeLevel: Record<string, number> = {};
      for (const lesson of allLessons) {
        const gradeLevelId = lesson.grade_level_id || "unknown";
        byGradeLevel[gradeLevelId] = (byGradeLevel[gradeLevelId] || 0) + 1;
      }

      return {
        total_lessons: allLessons.length,
        published_lessons: publishedLessons.length,
        draft_lessons: draftLessons.length,
        total_learning_paths: allPaths.length,
        published_paths: publishedPaths.length,
        draft_paths: draftPaths.length,
        by_subject: bySubject,
        by_grade_level: byGradeLevel,
      };
    } catch (error) {
      this.handleServiceError(error, "getContentStats");
    }
  }

  async getUsageStats(): Promise<UsageStats> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Using Record<string, unknown> for conditions to match strict type
      const conditions: Record<string, unknown> = {
        last_login: { $gte: oneDayAgo.toISOString() },
      };

      const activeUsers = await this.databaseAdapter.find<UserRow>(
        "users",
        conditions,
      );

      // Placeholder values for now, as the actual data fetching for these is not implemented yet.
      const sessions: unknown[] = []; // Assuming sessions would be fetched from somewhere
      const completedRequests = 0; // Assuming this would be fetched from logs/metrics
      const failedRequests = 0; // Assuming this would be fetched from logs/metrics
      const avgResponseTime = 0; // Assuming this would be calculated from logs/metrics

      const usageStats = {
        total_sessions: sessions.length,
        active_sessions: activeUsers.length, // Using activeUsers
        total_requests: completedRequests + failedRequests,
        completed_requests: completedRequests,
        failed_requests: failedRequests,
        average_response_time: avgResponseTime,
        total_api_calls: 0, // Added
        api_calls_today: 0, // Added
        most_used_endpoints: [], // Added
      };

      return usageStats;
    } catch (error) {
      this.handleServiceError(error, "getUsageStats");
    }
  }

  async searchUsers(request: SearchUsersRequest): Promise<{
    users: AdminUserInfo[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  }> {
    try {
      const page = request.page || 1;
      const perPage = request.per_page || 20;
      const offset = (page - 1) * perPage;

      const conditions: Record<string, unknown> = {};
      if (request.role) conditions.role = request.role;
      if (request.is_active !== undefined)
        conditions.is_active = request.is_active;
      if (request.is_verified !== undefined)
        conditions.is_verified = request.is_verified;

      let allUsers = await this.databaseAdapter.find<UserRow>(
        "users",
        conditions,
      );

      if (request.query) {
        const queryLower = request.query.toLowerCase();
        allUsers = allUsers.filter((user) => {
          return (
            user.email?.toLowerCase().includes(queryLower) ||
            user.first_name?.toLowerCase().includes(queryLower) ||
            user.last_name?.toLowerCase().includes(queryLower) ||
            user.username?.toLowerCase().includes(queryLower)
          );
        });
      }

      const total = allUsers.length;
      const totalPages = Math.ceil(total / perPage);

      const users = allUsers.slice(offset, offset + perPage);

      const adminUsers: AdminUserInfo[] = users.map((user) => ({
        id: user.id,
        email: user.email,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username || "",
        role: user.role || "student",
        is_active: user.is_active,
        is_verified: user.is_verified,
        created_at: user.created_at,
        last_login: user.last_login,
        login_count: user.login_count,
      }));

      return {
        users: adminUsers,
        total,
        page,
        per_page: perPage,
        total_pages: totalPages,
      };
    } catch (error) {
      this.handleServiceError(error, "searchUsers");
    }
  }

  async updateUser(
    userId: string,
    request: UpdateUserRequest,
  ): Promise<AdminUserInfo> {
    try {
      const existing = await this.databaseAdapter.findOne<UserRow>("users", {
        id: userId,
      });
      if (!existing) {
        throw new Error("المستخدم غير موجود");
      }

      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (request.first_name !== undefined)
        updateData.first_name = request.first_name;
      if (request.last_name !== undefined)
        updateData.last_name = request.last_name;
      if (request.username !== undefined)
        updateData.username = request.username;
      if (request.role !== undefined) updateData.role = request.role;
      if (request.is_active !== undefined)
        updateData.is_active = request.is_active;
      if (request.is_verified !== undefined)
        updateData.is_verified = request.is_verified;
      if (request.permissions !== undefined)
        updateData.permissions = request.permissions;

      const updated = await this.databaseAdapter.update<UserRow>(
        "users",
        { id: userId },
        updateData as Record<string, unknown>,
      );

      if (!updated) {
        throw new Error("Failed to update user");
      }

      return {
        id: updated.id,
        email: updated.email,
        first_name: updated.first_name || "",
        last_name: updated.last_name || "",
        username: updated.username || "",
        role: updated.role || "student",
        is_active: updated.is_active,
        is_verified: updated.is_verified,
        created_at: updated.created_at,
        last_login: updated.last_login,
        login_count: updated.login_count,
      };
    } catch (error) {
      this.handleServiceError(error, "updateUser");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const existing = await this.databaseAdapter.findOne("users", {
        id: userId,
      });
      if (!existing) {
        throw new Error("المستخدم غير موجود");
      }

      await this.databaseAdapter.delete("users", { id: userId });
    } catch (error) {
      this.handleServiceError(error, "deleteUser");
    }
  }

  async getUserActivities(): Promise<UserActivity[]> {
    try {
      const users = await this.databaseAdapter.find<UserRow>("users", {});

      return users.map((user) => ({
        user_id: user.id,
        email: user.email,
        last_login: user.last_login,
        login_count: user.login_count || 0,
        last_activity: user.last_activity,
        endpoints_used: [],
        total_requests: 0,
      }));
    } catch (error) {
      this.handleServiceError(error, "getUserActivities");
    }
  }
}
