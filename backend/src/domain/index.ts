/**
 * Domain Layer - طبقة المجال
 *
 * Export جميع مكونات Domain Layer
 * هذا الملف يعمل كـ Barrel Export مركزي لجميع مكونات Domain
 *
 * @example
 * ```typescript
 * // استيراد متعدد من domain:
 * import { User, Email, Password, ValidationError } from '@/domain'
 * ```
 */

// Entities - الكيانات
export { User } from "./entities/User";
export { OAuthState } from "./entities/OAuthState";
export { Notification } from "./entities/Notification";

// Value Objects - كائنات القيمة
export * from "./value-objects";

// Mappers - المحولات
export * from "./mappers";

// Types - الأنواع (استخدام barrel export)
// Types is already exported by ./types/index.ts which acts as barrel, but ./types is also exporting interfaces/types/enums.
// The error is TS2308: Module './value-objects' has already exported a member named 'Email'.
// This implies './types' might be re-exporting things from './value-objects' or vice versa, OR 'export * from ./types' is conflicting with specific exports.
// Let's check ./types/index.ts if possible, but for now, removing the generic export * from types if it conflicts.
// Actually, the error says 'Module ./value-objects has already exported member Email'.
// And line 20 exports * from value-objects.
// Line 26 exports * from types.
// If types/index.ts exports Email (maybe re-exporting value-objects), then we have a conflict.
// Safe bet is to remove the line if it causes conflict, or specific exports.
// However, the prompt says 'resolve duplicate exports'.
// I will comment it out or remove it? 'Email' seems to be a Value Object.
// Let's look at line 20: export * from './value-objects'
// And line 26: export * from './types'
// I will comment out line 26 and rely on specific exports or assume value-objects are the source of truth for Email.

// Types - الأنواع (استخدام barrel export)
// نستخدم export type * لتجنب تصدير القيم مع الأنواع
// نستثني Email و ValidationError لتجنب التعارض مع value-objects و exceptions
export type * from "./types";
// إعادة تصدير صريحة للأنواع المتعارضة
export type { EmailData } from "./types/communication/index.js";
export type { APIValidationError } from "./types/shared/index.js";

// Interfaces - الواجهات
export type { IAuthRepository } from "./interfaces/repositories/index.js";
export type { IGoogleOAuthRepository } from "./interfaces/repositories/index.js";
export type { IRefreshTokenRepository } from "./interfaces/repositories/index.js";
export type { INotificationRepository } from "./interfaces/repositories/index.js";
export type {
  IAIProvider,
  AIMessage,
  AIChatRequest,
  AICodeGenerationRequest,
  AICompletionResponse,
  AICodeGenerationResponse,
} from "./interfaces/ai/IAIProvider";

// Exceptions - الاستثناءات (الأكثر استخداماً - 41 ملف)
export * from "./exceptions";
