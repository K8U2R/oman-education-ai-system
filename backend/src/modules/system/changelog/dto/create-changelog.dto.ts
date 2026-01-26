/**
 * عقد بيانات إنشاء سجل تغيير (Create Changelog DTO)
 * 
 * الوصف: يحدد هذا العقد البيانات المطلوبة والصيغة الصحيحة لإنشاء سجل تغيير جديد.
 * السلطة الدستورية: القانون 04 (عقود البيانات).
 */

import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

/**
 * أنواع التغييرات المدعومة (Changelog Types)
 */
export enum ChangelogType {
    FEAT = 'feat',      // ميزة جديدة
    FIX = 'fix',        // إصلاح خطأ
    CHORE = 'chore',    // أعمال صيانة
    DOCS = 'docs',      // توثيق
    STYLE = 'style',    // تنسيق جمالي
    REFAC = 'refactor', // إعادة هيكلة الكود
    PERF = 'perf',      // تحسين أداء
    TEST = 'test'       // اختبارات
}

export class CreateChangelogDto {
    @IsString({ message: 'يجب أن يكون الإصدار نصاً' })
    @IsNotEmpty({ message: 'رقم الإصدار مطلوب' })
    version: string;

    @IsEnum(ChangelogType, { message: 'نوع التغيير غير مدعوم' })
    @IsNotEmpty({ message: 'نوع التغيير مطلوب' })
    type: ChangelogType;

    @IsString({ message: 'يجب أن يكون اسم الوحدة نصاً' })
    @IsNotEmpty({ message: 'اسم الوحدة (Module) مطلوب' })
    module: string;

    @IsString({ message: 'يجب أن يكون الوصف نصاً' })
    @IsNotEmpty({ message: 'وصف التغيير مطلوب' })
    description: string;

    @IsOptional()
    @IsString()
    author?: string; // كاتب التغيير

    @IsOptional()
    @IsString()
    metadata?: string; // بيانات إضافية
}
