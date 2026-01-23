/**
 * Admin Handlers - معالجات الإدارة
 *
 * Request handlers لجميع endpoints الإدارة
 */

import { Request, Response } from "express";
import { z } from "zod";
import { AdminService } from "@/application/services/admin/AdminService";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler";

// Validation Schemas
const UpdateUserRequestSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  role: z.enum(["student", "admin", "developer"]).optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
});

export class AdminHandler extends BaseHandler {
  /**
   * إنشاء Admin Handler
   *
   * @param adminService - خدمة الإدارة
   */
  constructor(private readonly adminService: AdminService) {
    super();
  }

  /**
   * معالج جلب إحصائيات النظام
   *
   * GET /api/v1/admin/stats/system
   */
  getSystemStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = await this.adminService.getSystemStats();
        this.ok(res, stats, "تم جلب إحصائيات النظام بنجاح");
      },
      "فشل جلب إحصائيات النظام",
    );
  };

  /**
   * معالج جلب إحصائيات المستخدمين
   *
   * GET /api/v1/admin/stats/users
   */
  getUserStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = await this.adminService.getUserStats();
        this.ok(res, stats, "تم جلب إحصائيات المستخدمين بنجاح");
      },
      "فشل جلب إحصائيات المستخدمين",
    );
  };

  /**
   * معالج جلب إحصائيات المحتوى
   *
   * GET /api/v1/admin/stats/content
   */
  getContentStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = await this.adminService.getContentStats();
        this.ok(res, stats, "تم جلب إحصائيات المحتوى بنجاح");
      },
      "فشل جلب إحصائيات المحتوى",
    );
  };

  /**
   * معالج جلب إحصائيات الاستخدام
   *
   * GET /api/v1/admin/stats/usage
   */
  getUsageStats = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const stats = await this.adminService.getUsageStats();
        this.ok(res, stats, "تم جلب إحصائيات الاستخدام بنجاح");
      },
      "فشل جلب إحصائيات الاستخدام",
    );
  };

  /**
   * معالج البحث عن المستخدمين
   *
   * GET /api/v1/admin/users
   */
  searchUsers = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const request = {
          query: req.query.query as string | undefined,
          role: req.query.role as string | undefined,
          is_active:
            req.query.is_active === "true"
              ? true
              : req.query.is_active === "false"
                ? false
                : undefined,
          is_verified:
            req.query.is_verified === "true"
              ? true
              : req.query.is_verified === "false"
                ? false
                : undefined,
          page: parseInt(req.query.page as string) || 1,
          per_page: parseInt(req.query.per_page as string) || 20,
        };

        const result = await this.adminService.searchUsers(request);
        this.ok(res, result, "تم البحث عن المستخدمين بنجاح");
      },
      "فشل البحث عن المستخدمين",
    );
  };

  /**
   * معالج تحديث مستخدم
   *
   * PUT /api/v1/admin/users/:id
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const validatedData = UpdateUserRequestSchema.parse(req.body);

        const user = await this.adminService.updateUser(id, validatedData);
        this.ok(res, user, "تم تحديث المستخدم بنجاح");
      },
      "فشل تحديث المستخدم",
    );
  };

  /**
   * معالج حذف مستخدم
   *
   * DELETE /api/v1/admin/users/:id
   */
  deleteUser = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.adminService.deleteUser(id);
        this.ok(res, { message: "تم حذف المستخدم بنجاح" });
      },
      "فشل حذف المستخدم",
    );
  };

  /**
   * معالج جلب نشاط المستخدمين
   *
   * GET /api/v1/admin/users/activities
   */
  getUserActivities = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const activities = await this.adminService.getUserActivities();
        this.ok(
          res,
          { activities, count: activities.length },
          "تم جلب نشاط المستخدمين بنجاح",
        );
      },
      "فشل جلب نشاط المستخدمين",
    );
  };
  /**
   * معالج رفع المعرفة (RAG Ingestion)
   *
   * POST /api/v1/admin/knowledge/ingest
   */
  ingestKnowledge = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { text, metadata } = req.body;

        if (!text) {
          throw new Error("Text content is required");
        }

        const result = await this.adminService.ingestKnowledge(
          text,
          metadata || {},
        );
        this.ok(res, result, "تم رفع المعرفة بنجاح");
      },
      "فشل رفع المعرفة",
    );
  };
}
