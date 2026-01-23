/**
 * Common Types - الأنواع المشتركة
 *
 * أنواع مشتركة تستخدم في جميع أنحاء النظام
 * هذه الأنواع توفر بنية موحدة للاستخدام المتكرر
 */

/**
 * Base Entity - الكيان الأساسي
 *
 * جميع الكيانات في النظام تشترك في هذه الخصائص الأساسية
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Timestamps - الطوابع الزمنية
 *
 * للاستخدام في الكيانات التي تحتاج فقط للطوابع الزمنية بدون id
 */
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

/**
 * Pagination Request - طلب التصفح
 *
 * معايير التصفح القياسية
 */
export interface PaginationRequest {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * Pagination Response - استجابة التصفح
 *
 * استجابة قياسية للتصفح
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * Metadata - البيانات الوصفية
 *
 * نوع آمن للبيانات الوصفية (بدلاً من Record<string, any>)
 */
export type Metadata = Record<string, unknown>;

/**
 * Log Level - مستوى السجل
 *
 * مستويات السجلات الموحدة
 */
export type LogLevel = "info" | "warn" | "error" | "debug";

/**
 * Base Log - السجل الأساسي
 *
 * بنية أساسية لجميع السجلات في النظام
 */
export interface BaseLog {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Metadata;
}

/**
 * Status - الحالة
 *
 * حالات عامة تستخدم في عدة أماكن
 */
export type Status = "active" | "inactive" | "pending" | "archived";

/**
 * Health Status - حالة الصحة
 *
 * حالات الصحة للنظام والخدمات
 */
export type HealthStatus = "healthy" | "warning" | "error" | "critical";

/**
 * ID - معرف
 *
 * نوع معرف موحد (يمكن تغييره لاحقاً إذا لزم الأمر)
 */
export type ID = string;

/**
 * EmailString - بريد إلكتروني (نوع أساسي)
 *
 * نوع بريد إلكتروني (للتوثيق فقط، التحقق الفعلي في Value Objects)
 * تم إعادة تسميته لتجنب التعارض مع Email interface في email.types.ts
 */
export type EmailString = string;

/**
 * URL - رابط
 *
 * نوع رابط موحد
 */
export type URL = string;

/**
 * ISO Date String - تاريخ بصيغة ISO
 *
 * نوع تاريخ بصيغة ISO 8601
 */
export type ISODateString = string;

/**
 * Optional Fields - حقول اختيارية
 *
 * Utility type لجعل جميع الحقول اختيارية
 */
export type Optional<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Required Fields - حقول مطلوبة
 *
 * Utility type لجعل جميع الحقول مطلوبة
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Partial Except - جزئي باستثناء
 *
 * Utility type لجعل جميع الحقول اختيارية باستثناء حقول محددة
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Nullable - قابل للقيمة null
 *
 * Utility type لجعل النوع قابل للقيمة null
 */
export type Nullable<T> = T | null;

/**
 * Maybe - قد يكون موجوداً أو لا
 *
 * Utility type للنوع الذي قد يكون موجوداً أو undefined
 */
export type Maybe<T> = T | undefined;

/**
 * Result - نتيجة العملية
 *
 * نوع موحد لنتائج العمليات (Success/Error pattern)
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Async Result - نتيجة غير متزامنة
 *
 * Promise مع Result pattern
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/**
 * Filter - فلتر
 *
 * نوع عام للفلاتر
 */
export interface Filter {
  [key: string]: unknown;
}

/**
 * Sort Order - ترتيب الفرز
 */
export type SortOrder = "asc" | "desc";

/**
 * Sort By - ترتيب حسب
 */
export interface SortBy {
  column: string;
  direction: SortOrder;
}
