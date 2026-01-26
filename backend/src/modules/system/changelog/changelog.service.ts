/**
 * خدمة سجل التغييرات (Changelog Service)
 * 
 * الوصف: تدير هذه الخدمة جميع العمليات المتعلقة بسجلات التغيير في النظام، بما في ذلك
 * استرداد السجلات ونشر التحديثات الجديدة.
 * 
 * السلطة الدستورية: القانون 03 (سيادة العناقيد) و القانون 05 (المسؤولية الفردية).
 */

import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { CreateChangelogDto } from "./dto/create-changelog.dto.js";
import { logger } from "@/shared/common";

/**
 * واجهة استجابة سجل التغييرات (Changelog Response Interface)
 * تضمن هذه الواجهة عدم تسريب بيانات قاعدة البيانات الخام (القانون 04).
 */
export interface ChangelogResponse {
    id: string;
    version: string;
    type: string;
    module: string;
    description: string;
    author?: string;
    metadata?: any;
    created_at: Date;
}

export class ChangelogService {
    private readonly entity = "changelog_entries";

    constructor(private readonly db: DatabaseCoreAdapter) { }

    /**
     * جلب كافة إدخالات سجل التغييرات
     * تعتمد الترتيب الزمني التنازلي لضمان ظهور أحدث التحديثات أولاً.
     */
    async getAll(): Promise<ChangelogResponse[]> {
        try {
            const entries = await this.db.find<any>(this.entity, {}, {
                orderBy: { column: "created_at", direction: "desc" }
            });
            return entries;
        } catch (error) {
            logger.error("فشل في جلب سجلات التغيير", { error });
            throw error;
        }
    }

    /**
     * إنشاء إدخال جديد في سجل التغييرات
     * يتم إلحاق تاريخ الإنشاء تلقائياً لضمان دقة التوثيق التاريخي.
     */
    async create(data: CreateChangelogDto): Promise<ChangelogResponse> {
        try {
            const entry = await this.db.insert<ChangelogResponse>(this.entity, {
                ...data,
                created_at: new Date()
            });
            logger.info("تم إنشاء سجل تغيير جديد", { version: data.version, type: data.type });
            return entry;
        } catch (error) {
            logger.error("فشل في إنشاء سجل التغيير", { error });
            throw error;
        }
    }
}
