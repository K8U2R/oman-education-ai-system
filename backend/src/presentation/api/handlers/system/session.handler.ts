import { Request, Response } from "express";
import { z } from "zod";
import { SessionService } from "@/application/services/security/SessionService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

// Validation Schemas
const RefreshSessionRequestSchema = z.object({
  tokenHash: z.string(),
  refreshTokenHash: z.string().optional(),
});

export class SessionHandler extends BaseHandler {
  /**
   * إنشاء Session Handler
   *
   * @param sessionService - خدمة الجلسات
   */
  constructor(private readonly sessionService: SessionService) {
    super();
  }

  /**
   * معالج جلب جلسات المستخدم
   *
   * GET /api/v1/sessions
   */
  getUserSessions = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const sessions = await this.sessionService.getUserSessions(userId);
        this.ok(res, sessions);
      },
      "فشل جلب جلسات المستخدم",
    );
  };

  /**
   * معالج جلب تفاصيل جلسة
   *
   * GET /api/v1/sessions/:id
   */
  getSessionDetails = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const session = await this.sessionService.getSessionDetails(id);
        this.ok(res, session);
      },
      "فشل جلب تفاصيل الجلسة",
    );
  };

  /**
   * معالج جلب جميع الجلسات (للمسؤولين)
   *
   * GET /api/v1/sessions/all
   */
  getAllSessions = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const sessions = await this.sessionService.getAllSessions();
        this.ok(res, sessions);
      },
      "فشل جلب جميع الجلسات",
    );
  };

  /**
   * معالج إنهاء جلسة
   *
   * DELETE /api/v1/sessions/:id
   */
  terminateSession = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.sessionService.terminateSession(id);
        this.ok(res, { message: "تم إنهاء الجلسة بنجاح" });
      },
      "فشل إنهاء الجلسة",
    );
  };

  /**
   * معالج إنهاء جميع جلسات المستخدم
   *
   * DELETE /api/v1/sessions/user/:userId
   */
  terminateAllSessions = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { userId } = req.params;
        await this.sessionService.terminateAllUserSessions(userId);
        this.ok(res, { message: "تم إنهاء جميع الجلسات بنجاح" });
      },
      "فشل إنهاء الجلسات",
    );
  };

  /**
   * معالج تحديث الجلسة
   *
   * PUT /api/v1/sessions/:id/refresh
   */
  refreshSession = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const { tokenHash, refreshTokenHash } =
          RefreshSessionRequestSchema.parse(req.body);
        const result = await this.sessionService.refreshSession(
          id,
          tokenHash,
          refreshTokenHash,
        );
        this.ok(res, result);
      },
      "فشل تحديث الجلسة",
    );
  };
}
