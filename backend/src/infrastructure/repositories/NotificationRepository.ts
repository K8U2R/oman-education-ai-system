/**
 * Notification Repository - مستودع الإشعارات
 *
 * تطبيق INotificationRepository باستخدام Database Core Adapter
 *
 * @example
 * ```typescript
 * const repository = new NotificationRepository(databaseAdapter)
 * const notification = await repository.create({ user_id: '123', type: 'info', title: 'Test', message: 'Test message' })
 * ```
 */

import { INotificationRepository } from "@/domain/interfaces/repositories";
import { Notification } from "@/domain/entities/Notification";
import { NotificationMapper } from "@/domain/mappers/NotificationMapper";
import {
  NotificationData,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationStats,
  NotificationListResponse,
} from "@/domain/types/communication";
import {
  NotificationNotFoundError,
  NotificationCreationFailedError,
  NotificationUpdateFailedError,
  NotificationDeleteFailedError,
} from "@/domain/exceptions/NotificationExceptions";
import { DatabaseCoreAdapter } from "../adapters/db/DatabaseCoreAdapter";
import { logger } from "@/shared/utils/logger";

export class NotificationRepository implements INotificationRepository {
  /**
   * إنشاء Notification Repository
   *
   * @param databaseAdapter - Database Core Adapter
   */
  constructor(private readonly databaseAdapter: DatabaseCoreAdapter) {}

  /**
   * إنشاء إشعار جديد
   */
  async create(data: CreateNotificationRequest): Promise<Notification> {
    try {
      const notificationData: Omit<
        NotificationData,
        "id" | "created_at" | "updated_at"
      > = {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        status: "unread",
        action_url: data.action_url || null,
        action_label: data.action_label || null,
        metadata: data.metadata || null,
        read_at: null,
        archived_at: null,
      };

      const result = await this.databaseAdapter.insert<NotificationData>(
        "notifications",
        notificationData,
      );

      return NotificationMapper.toDomain(result);
    } catch (error) {
      logger.error("Failed to create notification", {
        error: error instanceof Error ? error.message : "Unknown error",
        data,
      });
      throw new NotificationCreationFailedError("فشل إنشاء الإشعار");
    }
  }

  /**
   * البحث عن إشعار بالمعرف
   */
  async findById(id: string): Promise<Notification | null> {
    try {
      const result = await this.databaseAdapter.findOne<NotificationData>(
        "notifications",
        { id },
      );

      if (!result) {
        return null;
      }

      return NotificationMapper.toDomain(result);
    } catch (error) {
      logger.error("Failed to find notification by id", {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
      });
      return null;
    }
  }

  /**
   * البحث عن إشعارات المستخدم
   */
  async findByUserId(
    userId: string,
    options?: {
      page?: number;
      perPage?: number;
      status?: "unread" | "read" | "archived";
      type?: string;
    },
  ): Promise<NotificationListResponse> {
    try {
      const page = options?.page || 1;
      const perPage = options?.perPage || 20;
      const offset = (page - 1) * perPage;

      // بناء شروط البحث
      const conditions: Record<string, unknown> = { user_id: userId };
      if (options?.status) {
        conditions.status = options.status;
      }
      if (options?.type) {
        conditions.type = options.type;
      }

      // جلب الإشعارات
      const notifications = await this.databaseAdapter.find<NotificationData>(
        "notifications",
        conditions,
        {
          limit: perPage,
          offset,
          orderBy: { column: "created_at", direction: "desc" },
        },
      );

      // جلب العدد الإجمالي
      const allNotifications =
        await this.databaseAdapter.find<NotificationData>(
          "notifications",
          conditions,
        );
      const total = allNotifications.length;
      const totalPages = Math.ceil(total / perPage);

      return {
        data: notifications,
        total,
        page,
        per_page: perPage,
        total_pages: totalPages,
      };
    } catch (error) {
      logger.error("Failed to find notifications by user id", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
        options,
      });
      // إرجاع قائمة فارغة في حالة الخطأ
      return {
        data: [],
        total: 0,
        page: options?.page || 1,
        per_page: options?.perPage || 20,
        total_pages: 0,
      };
    }
  }

  /**
   * تحديث إشعار
   */
  async update(
    id: string,
    data: UpdateNotificationRequest,
  ): Promise<Notification> {
    try {
      // التحقق من وجود الإشعار
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotificationNotFoundError("الإشعار غير موجود");
      }

      // بناء بيانات التحديث
      const updateData: Record<string, unknown> = {};
      if (data.status !== undefined) {
        updateData.status = data.status;
      }
      if (data.read_at !== undefined) {
        updateData.read_at = data.read_at.toISOString();
      }
      if (data.archived_at !== undefined) {
        updateData.archived_at = data.archived_at.toISOString();
      }
      updateData.updated_at = new Date().toISOString();

      const result = await this.databaseAdapter.update<NotificationData>(
        "notifications",
        { id },
        updateData,
      );

      if (!result) {
        throw new NotificationNotFoundError("الإشعار غير موجود");
      }

      return NotificationMapper.toDomain(result);
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw error;
      }
      logger.error("Failed to update notification", {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
        data,
      });
      throw new NotificationUpdateFailedError("فشل تحديث الإشعار");
    }
  }

  /**
   * حذف إشعار
   */
  async delete(id: string): Promise<void> {
    try {
      // التحقق من وجود الإشعار
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotificationNotFoundError("الإشعار غير موجود");
      }

      await this.databaseAdapter.delete("notifications", { id });
    } catch (error) {
      if (error instanceof NotificationNotFoundError) {
        throw error;
      }
      logger.error("Failed to delete notification", {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
      });
      throw new NotificationDeleteFailedError("فشل حذف الإشعار");
    }
  }

  /**
   * تحديد جميع إشعارات المستخدم كمقروءة
   */
  async markAllAsRead(userId: string): Promise<number> {
    try {
      // جلب جميع الإشعارات غير المقروءة
      const notifications = await this.databaseAdapter.find<NotificationData>(
        "notifications",
        { user_id: userId, status: "unread" },
      );

      if (notifications.length === 0) {
        return 0;
      }

      // تحديث جميع الإشعارات
      const readAt = new Date().toISOString();
      let updatedCount = 0;

      for (const notification of notifications) {
        try {
          await this.databaseAdapter.update<NotificationData>(
            "notifications",
            { id: notification.id },
            {
              status: "read",
              read_at: readAt,
              updated_at: new Date().toISOString(),
            },
          );
          updatedCount++;
        } catch (error) {
          logger.warn("Failed to update notification", {
            notificationId: notification.id,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return updatedCount;
    } catch (error) {
      logger.error("Failed to mark all notifications as read", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
      });
      return 0;
    }
  }

  /**
   * الحصول على إحصائيات إشعارات المستخدم
   */
  async getStats(userId: string): Promise<NotificationStats> {
    try {
      const allNotifications =
        await this.databaseAdapter.find<NotificationData>("notifications", {
          user_id: userId,
        });

      const total = allNotifications.length;
      const unread = allNotifications.filter(
        (n) => n.status === "unread",
      ).length;
      const read = allNotifications.filter((n) => n.status === "read").length;
      const archived = allNotifications.filter(
        (n) => n.status === "archived",
      ).length;

      return {
        total,
        unread,
        read,
        archived,
      };
    } catch (error) {
      logger.error("Failed to get notification stats", {
        error: error instanceof Error ? error.message : "Unknown error",
        userId,
      });
      return {
        total: 0,
        unread: 0,
        read: 0,
        archived: 0,
      };
    }
  }

  /**
   * التحقق من أن الإشعار يخص المستخدم
   */
  async belongsToUser(id: string, userId: string): Promise<boolean> {
    try {
      const notification = await this.findById(id);
      if (!notification) {
        return false;
      }
      return notification.userId === userId;
    } catch (error) {
      logger.error("Failed to check notification ownership", {
        error: error instanceof Error ? error.message : "Unknown error",
        id,
        userId,
      });
      return false;
    }
  }
}
