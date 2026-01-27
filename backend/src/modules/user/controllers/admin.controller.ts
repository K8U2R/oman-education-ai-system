/**
 * Admin Controller - متحكم الإدارة
 */

import { Request, Response } from "express";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { AdminService } from "@/modules/user/services/AdminService.js";
import {
    UpdateUserRequest,
    SearchUsersRequest
} from "@/domain/types/user";

export class AdminController extends BaseHandler {
    constructor(private readonly adminService: AdminService) {
        super();
    }

    getSystemStats = async (_req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const stats = await this.adminService.getSystemStats();
                this.ok(res, stats);
            },
            "فشل جلب إحصائيات النظام"
        );
    }

    getUserStats = async (_req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const stats = await this.adminService.getUserStats();
                this.ok(res, stats);
            },
            "فشل جلب إحصائيات المستخدمين"
        );
    }

    getContentStats = async (_req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const stats = await this.adminService.getContentStats();
                this.ok(res, stats);
            },
            "فشل جلب إحصائيات المحتوى"
        );
    }

    getUsageStats = async (_req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const stats = await this.adminService.getUsageStats();
                this.ok(res, stats);
            },
            "فشل جلب إحصائيات الاستخدام"
        );
    }

    searchUsers = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const request = req.query as unknown as SearchUsersRequest;
                // Parse page/per_page to numbers if needed, assuming service handles basic types or cast
                if (req.query.page) request.page = Number(req.query.page);
                if (req.query.per_page) request.per_page = Number(req.query.per_page);

                const result = await this.adminService.searchUsers(request);
                this.ok(res, result);
            },
            "فشل البحث عن المستخدمين"
        );
    }

    updateUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { id } = req.params;
                const request = req.body as UpdateUserRequest;
                const user = await this.adminService.updateUser(id, request);
                this.ok(res, user, "تم تحديث المستخدم بنجاح");
            },
            "فشل تحديث المستخدم"
        );
    }

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const { id } = req.params;
                await this.adminService.deleteUser(id);
                this.ok(res, { message: "تم حذف المستخدم بنجاح" });
            },
            "فشل حذف المستخدم"
        );
    }

    getUserActivities = async (_req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const activities = await this.adminService.getUserActivities();
                this.ok(res, activities);
            },
            "فشل جلب نشاطات المستخدمين"
        );
    }
}
