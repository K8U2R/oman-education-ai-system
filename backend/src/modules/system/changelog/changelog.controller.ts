/**
 * معالج سجل التغييرات (Changelog Controller)
 * 
 * الوصف: وحدة التحكم المسؤولة عن استقبال طلبات HTTP المتعلقة بسجل التغيير
 * والتحقق من صحة البيانات المدخلة قبل تمريرها للخدمة.
 * 
 * السلطة الدستورية: القانون 04 (عقود البيانات) و القانون 10 (التعليقات الهادفة).
 */

import { Request, Response } from 'express';
import { ChangelogService } from './changelog.service.js';
import { CreateChangelogDto } from './dto/create-changelog.dto.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ChangelogController {
    constructor(private readonly changelogService: ChangelogService) { }

    /**
     * جلب قائمة سجلات التغيير
     * GET /api/system/changelog
     */
    async getEntries(req: Request, res: Response): Promise<void> {
        try {
            const entries = await this.changelogService.getAll();
            res.status(200).json({
                success: true,
                data: entries
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "خطأ داخلي في الخادم"
            });
        }
    }

    /**
     * إضافة سجل تغيير جديد (للمشرفين)
     * POST /api/system/changelog
     * 
     * يقوم المعالج بتحويل البيانات الخام إلى كائن DTO والتحقق من صحة الحقول (Law-4).
     */
    async createEntry(req: Request, res: Response): Promise<void> {
        try {
            const dto = plainToInstance(CreateChangelogDto, req.body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                res.status(400).json({
                    success: false,
                    errors: errors.map(e => Object.values(e.constraints || {})).flat()
                });
                return;
            }

            const entry = await this.changelogService.create(dto);
            res.status(201).json({
                success: true,
                data: entry
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "خطأ داخلي في الخادم"
            });
        }
    }
}
