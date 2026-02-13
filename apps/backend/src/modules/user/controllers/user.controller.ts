/**
 * User Controller - متحكم المستخدم
 *
 * @law Law-10 (Scalability) - Domain Persistence Activation
 */

import { Request, Response } from "express";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { UserService } from "@/modules/user/services/UserService.js";
import { UpdateProfileRequestSchema } from "../dto/user.dto.js";

export class UserController extends BaseHandler {
  constructor(private readonly userService: UserService) {
    super();
  }

  // ─── [Profile Domain] ──────────────────────────────────────────────

  /**
   * جلب البيانات الشخصية
   */
  getMe = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const user = await this.userService.getProfile(userId);
        if (!user) {
          this.notFound(res, "المستخدم غير موجود");
          return;
        }
        this.ok(res, user, "تم جلب البيانات الشخصية");
      },
      "فشل جلب البيانات الشخصية",
    );
  };

  /**
   * تحديث الملف الشخصي
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const userId = req.user?.id;
        if (!userId) {
          this.unauthorized(res);
          return;
        }

        const validatedData = UpdateProfileRequestSchema.parse(req.body);
        const updatedUser = await this.userService.updateProfile(
          userId,
          validatedData,
        );

        if (!updatedUser) {
          res
            .status(400)
            .json({ message: "فشل تحديث الملف الشخصي system error" });
          return;
          return;
        }

        this.ok(res, updatedUser, "تم تحديث الملف الشخصي بنجاح");
      },
      "فشل تحديث الملف الشخصي",
    );
  };

  // ─── [Management Domain] ───────────────────────────────────────────

  /**
   * عرض قائمة المستخدمين
   */
  listUsers = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const result = await this.userService.listUsers(limit, offset);
        this.ok(res, result, "تم جلب قائمة المستخدمين");
      },
      "فشل جلب قائمة المستخدمين",
    );
  };

  /**
   * حظر مستخدم
   */
  banUser = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { id } = req.params;
        await this.userService.banUser(id);
        this.ok(res, { id, status: "banned" }, "تم حظر المستخدم بنجاح");
      },
      "فشل حظر المستخدم",
    );
  };

  // ─── [Discovery Domain] ────────────────────────────────────────────

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    await this.execute(
      res,
      async () => {
        const { q } = req.query;
        if (!q || typeof q !== "string") {
          this.ok(res, [], "يرجى إدخال نص للبحث");
          return;
        }

        const users = await this.userService.searchUsers(q);
        this.ok(res, users, `نتائج البحث عن: ${q}`);
      },
      "فشل البحث عن المستخدمين",
    );
  };
}
