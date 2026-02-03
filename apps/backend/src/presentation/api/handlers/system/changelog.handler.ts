import { Request, Response } from "express";
import { ChangelogService } from "@/modules/support/changelog/changelog.service.js";
import { BaseHandler } from "@/presentation/api/handlers/base/BaseHandler.js";
import { CreateChangelogSchema } from "@/presentation/api/dto/system/changelog/create-changelog.dto.js";

/**
 * Changelog Handler - معالج سجل التغييرات
 * 
 * HTTP Adapter for the Changelog System.
 * Constitutional Authority: Law-4 (Data Contracts)
 */
export class ChangelogHandler extends BaseHandler {
    constructor(private readonly changelogService: ChangelogService) {
        super();
    }

    /**
     * جلب سجل التغييرات (Feed)
     */
    getFeed = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                const filters = {
                    category: req.query.category as string,
                    status: req.query.status as string,
                    is_for_students: req.query.forStudents === "true" ? true : undefined,
                    is_for_teachers: req.query.forTeachers === "true" ? true : undefined,
                    is_for_developers: req.query.forDevelopers === "true" ? true : undefined,
                };

                const feed = await this.changelogService.getChangelogFeed(filters);
                this.ok(res, feed);
            },
            "فشل جلب سجل التغييرات",
        );
    };

    /**
     * إنشاء إدخال جديد
     */
    create = async (req: Request, res: Response): Promise<void> => {
        await this.execute(
            res,
            async () => {
                // Validate input with Zod (Law-5)
                const validation = CreateChangelogSchema.safeParse(req.body);

                if (!validation.success) {
                    this.badRequest(res, validation.error.errors[0].message);
                    return;
                }

                const authorId = req.user?.id || "system"; // Auth middleware expected to populate req.user

                const entry = await this.changelogService.createEntry(validation.data, authorId);
                this.created(res, entry);
            },
            "فشل إنشاء إدخال سجل التغييرات",
        );
    };
}
