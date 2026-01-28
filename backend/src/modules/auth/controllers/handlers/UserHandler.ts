import { Request, Response } from "express";
import { AuthService } from "@/modules/auth/services/core/AuthService.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { logger } from "@/shared/utils/logger.js";
import { z } from "zod";

const UpdateUserSchema = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    username: z.string().optional()
    // Add other updateable fields as needed
});

export class UserHandler extends BaseHandler {
    constructor(private readonly authService: AuthService) {
        super();
    }

    /**
     * GET /api/v1/auth/me
     */
    me = async (req: Request, res: Response): Promise<void> => {
        return this.getCurrentUser(req, res);
    };

    /**
     * GET /api/v1/auth/me (Implementation)
     */
    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const userId = req.user?.id;
                if (!userId) {
                    this.unauthorized(res);
                    return;
                }

                const user = await this.authService.getOrCreateUser(
                    userId,
                    req.user?.email || "",
                    req.user?.role,
                );
                this.ok(res, { user: user.toData() }, "تم جلب بيانات المستخدم");
            },
            "فشل جلب بيانات المستخدم",
        );
    };

    /**
     * PATCH /api/v1/auth/me
     */
    updateUser = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const userId = req.user?.id;
                if (!userId) {
                    this.unauthorized(res);
                    return;
                }

                const validatedData = UpdateUserSchema.parse(req.body);

                const updatedUser = await this.authService.updateUser(
                    userId,
                    validatedData,
                );

                logger.info("User updated successfully", { userId });
                this.ok(
                    res,
                    { user: updatedUser.toData() },
                    "تم تحديث بيانات المستخدم بنجاح",
                );
            },
            "فشل تحديث بيانات المستخدم",
        );
    };
}
