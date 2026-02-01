/**
 * Type Guards - حراس الأنواع
 *
 * دوال للتحقق من أنواع البيانات في Runtime
 * تساعد في Type Narrowing وتحسين Type Safety
 */

import type {
  LearningLesson,
  ContentLesson,
} from '../features/education/index.js';
import type {
  BaseLog,
  LogLevel,
  HealthStatus,
  Status,
  Metadata,
} from "./common.types.js";

/**
 * Type Guard للتحقق من أن القيمة هي LearningLesson
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة LearningLesson
 *
 * @example
 * ```typescript
 * if (isLearningLesson(data)) {
 *   // TypeScript يعرف الآن أن data هو LearningLesson
 *   console.log(data.title)
 * }
 * ```
 */
export function isLearningLesson(value: unknown): value is LearningLesson {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.subject_id === "string" &&
    typeof obj.grade_level_id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.order === "number"
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي ContentLesson
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة ContentLesson
 *
 * @example
 * ```typescript
 * if (isContentLesson(data)) {
 *   // TypeScript يعرف الآن أن data هو ContentLesson
 *   console.log(data.is_published)
 * }
 * ```
 */
export function isContentLesson(value: unknown): value is ContentLesson {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.subject_id === "string" &&
    typeof obj.grade_level_id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.order === "number" &&
    typeof obj.is_published === "boolean" &&
    typeof obj.created_by === "string"
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي BaseLog
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة BaseLog
 */
export function isBaseLog(value: unknown): value is BaseLog {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.level === "string" &&
    isLogLevel(obj.level) &&
    typeof obj.message === "string" &&
    typeof obj.timestamp === "string"
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي LogLevel
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة LogLevel صحيح
 */
export function isLogLevel(value: unknown): value is LogLevel {
  return (
    typeof value === "string" &&
    (value === "info" ||
      value === "warn" ||
      value === "error" ||
      value === "debug")
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي HealthStatus
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة HealthStatus صحيح
 */
export function isHealthStatus(value: unknown): value is HealthStatus {
  return (
    typeof value === "string" &&
    (value === "healthy" ||
      value === "warning" ||
      value === "error" ||
      value === "critical")
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي Status
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة Status صحيح
 */
export function isStatus(value: unknown): value is Status {
  return (
    typeof value === "string" &&
    (value === "active" ||
      value === "inactive" ||
      value === "pending" ||
      value === "archived")
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي Metadata
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة Metadata
 */
export function isMetadata(value: unknown): value is Metadata {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // التحقق من أن جميع القيم هي primitive types أو objects
  return Object.values(value).every(
    (val) =>
      val === null ||
      typeof val === "string" ||
      typeof val === "number" ||
      typeof val === "boolean" ||
      typeof val === "object",
  );
}

/**
 * Type Guard للتحقق من أن القيمة هي string غير فارغ
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة string غير فارغ
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/**
 * Type Guard للتحقق من أن القيمة هي array غير فارغ
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة array غير فارغ
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Type Guard للتحقق من أن القيمة هي object غير null
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة object غير null
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Type Guard للتحقق من أن القيمة هي ID صحيح
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة ID صحيح
 */
export function isID(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/**
 * Type Guard للتحقق من أن القيمة هي Email صحيح (تحقق بسيط)
 *
 * @param value - القيمة للتحقق منها
 * @returns true إذا كانت القيمة تبدو كـ email
 *
 * @note هذا تحقق بسيط، للتحقق الكامل استخدم Value Objects
 */
export function isEmail(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  // تحقق بسيط من وجود @ و . في البريد
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
