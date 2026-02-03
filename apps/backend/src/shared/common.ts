/**
 * Common Imports - الاستيرادات المشتركة
 *
 * ملف مركزي يجمع الاستيرادات الأكثر استخداماً في المشروع
 * هذا يقلل التكرار ويحسن الصيانة
 */

// Logger - الأكثر استخداماً (44 ملف)
export { logger } from "./utils/logger";

// Domain Exceptions - الأكثر استخداماً (41 ملف)
export * from "../domain/exceptions";

// Domain Types - شائع الاستخدام
// ⚠️ ملاحظة: نستخدم export type * للأنواع فقط
export type * from "../domain/types/auth/index.js";

// Domain Value Objects - شائع الاستخدام
export { Email } from "../domain/value-objects/Email";
export { Password } from "../domain/value-objects/Password";

// Domain Entities - شائع الاستخدام
export { User } from "../domain/entities/User";
