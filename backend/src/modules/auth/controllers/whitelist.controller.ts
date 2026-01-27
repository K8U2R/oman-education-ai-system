import { Request, Response } from "express";
// import { container } from "@/infrastructure/di/index.js";
import { WhitelistService } from "../services/WhitelistService.js";
import { PermissionLevelType } from "@/domain/value-objects/PermissionLevel.js";
import { Permission } from "@/domain/types/auth/index.js";
import {
    CreateWhitelistEntryRequestSchema,
    UpdateWhitelistEntryRequestSchema,
    WhitelistListQuerySchema,
} from "../dto/whitelist.dto.js";
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

                const response = entries.map((entry) => ({
                    id: entry.id,
                    email: entry.email,
                    permission_level: entry.permission_level,
                    permissions: entry.permissions,
                    granted_by: entry.granted_by,
                    granted_at: entry.granted_at,
                    expires_at: entry.expires_at,
                    is_active: entry.is_active,
                    is_permanent: entry.is_permanent,
                    notes: entry.notes,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at,
                }));


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

                this.ok(res, {
                    id: entry.id,
                    email: entry.email,
                    permission_level: entry.permission_level,
                    permissions: entry.permissions,
                    granted_by: entry.granted_by,
                    granted_at: entry.granted_at,
                    expires_at: entry.expires_at,
                    is_active: entry.is_active,
                    is_permanent: entry.is_permanent,
                    notes: entry.notes,
                    created_at: entry.created_at,
                    updated_at: entry.updated_at,
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

                const entry = await this.whitelistService.createEntry({
                    email: validatedData.email,
                    permission_level: validatedData.permission_level as PermissionLevelType,
                    permissions: validatedData.permissions as Permission[],
                    granted_by: grantedBy,
                    granted_at: new Date(),
                    expires_at: validatedData.expires_at ? new Date(validatedData.expires_at) : null,
                    is_active: true,
                    is_permanent: validatedData.is_permanent,
                    notes: validatedData.notes || null,
                });

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
                const response = entries.map((entry) => ({
                    id: entry.id,
                    email: entry.email,
                    permission_level: entry.permission_level,
                    expires_at: entry.expires_at,
                    is_active: entry.is_active,
                }));

                this.ok(res, {
                    entries: response,
                    total: response.length,
                });
            },
            "فشل جلب الإدخالات المنتهية",
        );
    };
}
