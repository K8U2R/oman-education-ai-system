import { Request, Response } from "express";
// import { container } from "@/infrastructure/di/index.js";
import { WhitelistService } from "../../services/account/WhitelistService.js";
import { PermissionLevelType } from "@/domain/value-objects/PermissionLevel.js";
import { Permission } from "@/domain/types/auth/index.js";
import {
  CreateWhitelistEntryRequestSchema,
  UpdateWhitelistEntryRequestSchema,
  WhitelistListQuerySchema,
} from "../../dto/whitelist.dto.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";

export class WhitelistController extends BaseHandler {
  /**
   * إنشاء Whitelist Controller
   */
  constructor(private readonly whitelistService: WhitelistService) {
    super();
  }

  /**
   * الحصول على جميع الإدخالات
   * GET /api/v1/admin/whitelist
   */
  getAllEntries = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const query = WhitelistListQuerySchema.parse(req.query);
        const entries = await this.whitelistService.getAllEntries({
          is_active: query.is_active,
          permission_level: query.permission_level,
          include_expired: query.include_expired,
        });

        this.ok(res, {
          entries,
          total: entries.length,
        });
      },
      "فشل جلب إدخالات القائمة البيضاء",
    );
  };

  /**
   * الحصول على إدخال بالمعرف
   * GET /api/v1/admin/whitelist/:id
   */
  getEntryById = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const entry = await this.whitelistService.findById(id);
        if (!entry) {
          this.notFound(res, "إدخال القائمة البيضاء غير موجود");
          return;
        }

        this.ok(res, entry);
      },
      "فشل جلب إدخال القائمة البيضاء",
    );
  };

  /**
   * إنشاء إدخال جديد
   * POST /api/v1/admin/whitelist
   */
  createEntry = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const validatedData = CreateWhitelistEntryRequestSchema.parse(req.body);
        const grantedBy = req.user?.id || null;

        const entry = await this.whitelistService.createEntry({
          email: validatedData.email,
          permission_level:
            validatedData.permission_level as PermissionLevelType,
          permissions: validatedData.permissions as Permission[],
          granted_by: grantedBy,
          granted_at: new Date(),
          expires_at: validatedData.expires_at
            ? new Date(validatedData.expires_at)
            : null,
          is_active: true,
          is_permanent: validatedData.is_permanent,
          notes: validatedData.notes || null,
        });

        this.created(res, entry);
      },
      "فشل إنشاء إدخال القائمة البيضاء",
    );
  };

  /**
   * تحديث إدخال موجود
   * PUT /api/v1/admin/whitelist/:id
   */
  updateEntry = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const validatedData = UpdateWhitelistEntryRequestSchema.parse(req.body);

        const entry = await this.whitelistService.updateEntry(id, {
          permission_level: validatedData.permission_level as
            | PermissionLevelType
            | undefined,
          permissions: validatedData.permissions as Permission[] | undefined,
          expires_at: validatedData.expires_at
            ? new Date(validatedData.expires_at)
            : null,
          is_active: validatedData.is_active,
          notes: validatedData.notes || null,
        });

        this.ok(res, entry);
      },
      "فشل تحديث إدخال القائمة البيضاء",
    );
  };

  /**
   * حذف إدخال
   * DELETE /api/v1/admin/whitelist/:id
   */
  deleteEntry = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.whitelistService.deleteEntry(id);
        this.ok(res, { message: "تم حذف إدخال القائمة البيضاء بنجاح" });
      },
      "فشل حذف إدخال القائمة البيضاء",
    );
  };

  /**
   * تعطيل إدخال
   * POST /api/v1/admin/whitelist/:id/deactivate
   */
  deactivateEntry = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const entry = await this.whitelistService.deactivateEntry(id);
        this.ok(res, {
          ...entry,
          message: "تم تعطيل إدخال القائمة البيضاء بنجاح",
        });
      },
      "فشل تعطيل إدخال القائمة البيضاء",
    );
  };

  /**
   * تفعيل إدخال
   * POST /api/v1/admin/whitelist/:id/activate
   */
  activateEntry = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        const entry = await this.whitelistService.activateEntry(id);
        this.ok(res, {
          ...entry,
          message: "تم تفعيل إدخال القائمة البيضاء بنجاح",
        });
      },
      "فشل تفعيل إدخال القائمة البيضاء",
    );
  };

  /**
   * الحصول على الإدخالات المنتهية
   * GET /api/v1/admin/whitelist/expired
   */
  getExpiredEntries = async (_req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const entries = await this.whitelistService.findExpiredEntries();

        this.ok(res, {
          entries,
          total: entries.length,
        });
      },
      "فشل جلب الإدخالات المنتهية",
    );
  };
}
