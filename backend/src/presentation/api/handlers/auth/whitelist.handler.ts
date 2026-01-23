import { Request, Response } from "express";
import { container } from "@/infrastructure/di/index.js";
import { WhitelistService } from "@/application/services/whitelist/WhitelistService.js";
import { PermissionLevelType } from "@/domain/value-objects/PermissionLevel.js";
import { Permission } from "@/domain/types/auth.types.js";
import {
  CreateWhitelistEntryRequestSchema,
  UpdateWhitelistEntryRequestSchema,
  WhitelistListQuerySchema,
} from "@/presentation/api/dto/auth/whitelist.dto.js";
import { BaseHandler } from "../base/BaseHandler.js";

export class WhitelistHandler extends BaseHandler {
  /**
   * إنشاء Whitelist Handler
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
          isActive: query.is_active,
          permissionLevel: query.permission_level,
          includeExpired: query.include_expired,
        });

        const response = entries.map((entry) => {
          const data = entry.toData();
          return {
            id: data.id,
            email: data.email,
            permission_level: data.permission_level,
            permissions: data.permissions,
            granted_by: data.granted_by,
            granted_at: data.granted_at,
            expires_at: data.expires_at,
            is_active: data.is_active,
            is_permanent: data.is_permanent,
            notes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
        });

        this.ok(res, {
          entries: response,
          total: response.length,
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

        const data = entry.toData();
        this.ok(res, {
          id: data.id,
          email: data.email,
          permission_level: data.permission_level,
          permissions: data.permissions,
          granted_by: data.granted_by,
          granted_at: data.granted_at,
          expires_at: data.expires_at,
          is_active: data.is_active,
          is_permanent: data.is_permanent,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
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

        const entry = await this.whitelistService.createEntry(
          validatedData.email,
          validatedData.permission_level as PermissionLevelType,
          validatedData.permissions as Permission[],
          grantedBy,
          validatedData.expires_at ? new Date(validatedData.expires_at) : null,
          validatedData.is_permanent,
          validatedData.notes || null,
        );

        const data = entry.toData();
        this.created(res, {
          id: data.id,
          email: data.email,
          permission_level: data.permission_level,
          permissions: data.permissions,
          granted_by: data.granted_by,
          granted_at: data.granted_at,
          expires_at: data.expires_at,
          is_active: data.is_active,
          is_permanent: data.is_permanent,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
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
          permissionLevel: validatedData.permission_level as
            | PermissionLevelType
            | undefined,
          permissions: validatedData.permissions as Permission[] | undefined,
          expiresAt: validatedData.expires_at
            ? new Date(validatedData.expires_at)
            : null,
          isActive: validatedData.is_active,
          notes: validatedData.notes || null,
        });

        const data = entry.toData();
        this.ok(res, {
          id: data.id,
          email: data.email,
          permission_level: data.permission_level,
          permissions: data.permissions,
          granted_by: data.granted_by,
          granted_at: data.granted_at,
          expires_at: data.expires_at,
          is_active: data.is_active,
          is_permanent: data.is_permanent,
          notes: data.notes,
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
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
        const data = entry.toData();
        this.ok(res, {
          id: data.id,
          email: data.email,
          is_active: data.is_active,
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
        const data = entry.toData();
        this.ok(res, {
          id: data.id,
          email: data.email,
          is_active: data.is_active,
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
        const response = entries.map((entry) => {
          const data = entry.toData();
          return {
            id: data.id,
            email: data.email,
            permission_level: data.permission_level,
            expires_at: data.expires_at,
            is_active: data.is_active,
          };
        });

        this.ok(res, {
          entries: response,
          total: response.length,
        });
      },
      "فشل جلب الإدخالات المنتهية",
    );
  };
}

/**
 * Factory function لإنشاء Whitelist Handler
 */
export const createWhitelistHandler = (): WhitelistHandler => {
  const whitelistService =
    container.resolve<WhitelistService>("WhitelistService");
  return new WhitelistHandler(whitelistService);
};
