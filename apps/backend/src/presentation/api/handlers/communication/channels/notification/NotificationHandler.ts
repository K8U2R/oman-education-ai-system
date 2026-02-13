import { Request, Response } from "express";
import { NotificationService } from "@/modules/communication/index.js";
import { logger } from "@/shared/utils/logger.js";
import { BaseCommunicationHandler } from "../../shared/BaseCommunicationHandler.js";
import { getNotificationsSchema } from "./notification.schema.js";

export class NotificationHandler extends BaseCommunicationHandler {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  getNotifications = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const query = getNotificationsSchema.parse(req.query);
        const userId = req.user!.id;

        const result = await this.notificationService.getUserNotifications(
          userId,
          {
            page: query.page,
            perPage: query.per_page,
            status: query.status as any, // Service type alignment
            type: query.type,
          },
        );
        this.ok(res, result);
      },
      "Failed to fetch notifications",
    );
  };

  getNotification = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const userId = req.user!.id;

        const notification = await this.notificationService.getNotification(
          id,
          userId,
        );
        this.ok(res, notification);
      },
      "Failed to fetch notification",
    );
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user!.id;
        const stats = await this.notificationService.getStats(userId);
        this.ok(res, stats);
      },
      "Failed to fetch notification stats",
    );
  };

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const userId = req.user!.id;

        const notification = await this.notificationService.markAsRead(
          id,
          userId,
        );

        this.ok(res, {
          message: "Notification marked as read",
          notification,
        });
      },
      "Failed to update notification status",
    );
  };

  markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user!.id;
        await this.notificationService.markAllAsRead(userId);

        this.ok(res, {
          message: "All notifications marked as read",
        });
      },
      "Failed to mark all notifications as read",
    );
  };

  streamNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      this.unauthorized(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    res.write(
      `data: ${JSON.stringify({ type: "connected", message: "Connected successfully" })}\n\n`,
    );

    const onNotification = (event: {
      userId: string;
      type: string;
      notification: unknown;
    }) => {
      if (event.userId === userId) {
        res.write(
          `data: ${JSON.stringify({ type: event.type, notification: event.notification })}\n\n`,
        );
      }
    };

    this.notificationService.on("newNotification", onNotification);
    this.notificationService.on("notificationUpdated", onNotification);
    this.notificationService.on("notificationDeleted", onNotification);

    const heartbeatInterval = setInterval(() => {
      res.write(`: heartbeat\n\n`);
    }, 30000);

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

  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const userId = req.user!.id;
        await this.notificationService.deleteNotification(id, userId);
        this.ok(res, { message: "Notification deleted" });
      },
      "Failed to delete notification",
    );
  };
}
