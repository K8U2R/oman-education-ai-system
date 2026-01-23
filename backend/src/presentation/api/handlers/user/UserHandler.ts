/**
 * User Handler - معالج المستخدم
 * 
 * @law Law-10 (Scalability) - Domain Persistence Activation
 */

import { Request, Response } from "express";
import { ApiResponse } from "../../../../shared/response/api-response.js";
import { BaseHandler } from "../base/BaseHandler.js";
import { IUserRepository } from "../../../../domain/interfaces/repositories/index.js";

export class UserHandler extends BaseHandler {

    constructor(private readonly _userRepo: IUserRepository) {
        super();
    }

    // ─── [Profile Domain] ──────────────────────────────────────────────
    // يتعامل مع بيانات المستخدم المسجل دخوله (Me context)

    /**
     * جلب البيانات الشخصية
     * @law Law-8 (Data Privacy): يعيد فقط البيانات المسموح للمستخدم رؤيتها
     */
    getMe = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            return ApiResponse.error(res, "غير مصرح لك بالوصول", 401);
        }

        const user = await this._userRepo.findById(userId);

        if (!user) {
            return ApiResponse.error(res, "المستخدم غير موجود", 404);
        }

        return ApiResponse.success(res, user, "تم جلب البيانات الشخصية");
    }

    /**
     * تحديث الملف الشخصي
     */
    updateProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) {
            return ApiResponse.error(res, "غير مصرح لك بالوصول", 401);
        }

        const { firstName, lastName, username, avatarUrl } = req.body;

        // TODO: Add Validation (Zod)
        const updatedUser = await this._userRepo.update(userId, {
            firstName,
            lastName,
            username,
            avatarUrl
        });

        return ApiResponse.success(res, updatedUser, "تم تحديث الملف الشخصي بنجاح");
    }

    // ─── [Management Domain] ───────────────────────────────────────────
    // يتعامل مع العمليات الإدارية (Admin context)

    /**
     * عرض قائمة المستخدمين
     * @law Law-10 (Scalability): يجب أن يدعم التصفح (Pagination)
     */
    listUsers = async (req: Request, res: Response): Promise<void> => {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const users = await this._userRepo.findAll(limit, offset);
        const total = await this._userRepo.count();

        return ApiResponse.success(res, { users, total }, "تم جلب قائمة المستخدمين");
    }

    /**
     * حظر مستخدم
     */
    banUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        await this._userRepo.updateStatus(id, 'banned');
        return ApiResponse.success(res, { id, status: "banned" }, "تم حظر المستخدم بنجاح");
    }

    // ─── [Discovery Domain] ────────────────────────────────────────────
    // البحث العام (Public context)

    searchUsers = async (req: Request, res: Response): Promise<void> => {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return ApiResponse.success(res, [], "يرجى إدخال نص للبحث");
        }

        const users = await this._userRepo.search(q);
        return ApiResponse.success(res, users, `نتائج البحث عن: ${q}`);
    }
}
