/**
 * Notification Handlers - معالجات الإشعارات
 *
 * Request handlers لجميع endpoints الإشعارات
 */

import { Request, Response } from "express";
import { NotificationService } from "@/modules/communication/index.js";
import { logger } from "@/shared/utils/logger.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

export class NotificationHandler extends BaseHandler {
  /**
   * إنشاء Notification Handler
   *
   * @param notificationService - خدمة الإشعارات
   */
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  /**
   * معالج جلب جميع الإشعارات
   *
   * GET /api/v1/notifications
   */
  getNotifications = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;
        const status = req.query.status as
          | "unread"
          | "read"
          | "archived"
          | undefined;
        const type = req.query.type as string | undefined;

        const result = await this.notificationService.getUserNotifications(
          userId,
          {
            page,
            perPage,
            status,
            type,
          },
        );
        this.ok(res, result);
      },
      "فشل جلب الإشعارات",
    );
  };

  /**
   * معالج جلب إشعار محدد
   *
   * GET /api/v1/notifications/:id
   */
  getNotification = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const notification = await this.notificationService.getNotification(
          id,
          userId,
        );
        this.ok(res, notification.toData());
      },
      "فشل جلب الإشعار",
    );
  };

  /**
   * معالج جلب إحصائيات الإشعارات
   *
   * GET /api/v1/notifications/stats
   */
  getStats = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const stats = await this.notificationService.getStats(userId);
        this.ok(res, stats);
      },
      "فشل جلب إحصائيات الإشعارات",
    );
  };

  /**
   * معالج تحديد إشعار كمقروء
   *
   * POST /api/v1/notifications/:id/read
   */
  markAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        const notification = await this.notificationService.markAsRead(
          id,
          userId,
        );
        this.ok(res, {
          message: "تم تحديد الإشعار كمقروء",
          notification: notification.toData(),
        });
      },
      "فشل تحديث حالة الإشعار",
    );
  };

  /**
   * معالج تحديد جميع الإشعارات كمقروءة
   *
   * POST /api/v1/notifications/mark-all-read
   */
  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const updatedCount =
          await this.notificationService.markAllAsRead(userId);
        this.ok(res, {
          updated_count: updatedCount,
          message: `تم تحديد ${updatedCount} إشعار كمقروء`,
        });
      },
      "فشل تحديث جميع الإشعارات",
    );
  };

  /**
   * معالج Real-time Notifications باستخدام Server-Sent Events (SSE)
   *
   * GET /api/v1/notifications/stream
   */
  streamNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      this.unauthorized(res);
      return;
    }

    // Set SSE headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    });

    // Send initial connection message
    res.write(
      `data: ${JSON.stringify({ type: "connected", message: "تم الاتصال بنجاح" })}\n\n`,
    );

    // Event handler for new notifications
    const onNotification = (event: {
      type: string;
      notification: unknown;
      userId: string;
    }) => {
      // Only send notifications for this user
      if (event.userId === userId) {
        const data = {
          type: event.type,
          notification: (event.notification as { toData?: () => unknown })
            .toData
            ? (event.notification as { toData: () => unknown }).toData()
            : event.notification,
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    };

    // Listen to all notification events
    this.notificationService.on("newNotification", onNotification);
    this.notificationService.on("notificationUpdated", onNotification);
    this.notificationService.on("notificationDeleted", onNotification);

    // Keep connection alive with heartbeat
    const heartbeatInterval = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 30000); // Every 30 seconds

    // Cleanup on client disconnect
    req.on("close", () => {
      clearInterval(heartbeatInterval);
      this.notificationService.removeListener(
        "newNotification",
        onNotification,
      );
      this.notificationService.removeListener(
        "notificationUpdated",
        onNotification,
      );
      this.notificationService.removeListener(
        "notificationDeleted",
        onNotification,
      );
      logger.info("SSE connection closed", { userId });
    });

    logger.info("SSE connection established", { userId });
  };

  /**
   * معالج حذف إشعار
   *
   * DELETE /api/v1/notifications/:id
   */
  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const { id } = req.params;
        await this.notificationService.deleteNotification(id, userId);
        this.ok(res, { message: "تم حذف الإشعار" });
      },
      "فشل حذف الإشعار",
    );
  };
}
