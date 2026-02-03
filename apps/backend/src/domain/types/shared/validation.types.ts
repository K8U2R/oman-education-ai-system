/**
 * Validation Types - أنواع التحقق
 *
 * أنواع موحدة للتحقق من صحة البيانات
 */

import type { Metadata } from "./common.types";

/**
 * Validation Rule - قاعدة التحقق
 *
 * قاعدة للتحقق من حقل واحد
 */
export interface ValidationRule {
  required?: boolean;
  type?:
    | "string"
    | "number"
    | "boolean"
    | "array"
    | "object"
    | "date"
    | "email"
    | "url";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp | string;
  email?: boolean;
  url?: boolean;
  enum?: unknown[];
  custom?: (value: unknown, context?: ValidationContext) => boolean | string;
  message?: string;
  transform?: (value: unknown) => unknown;
}

/**
 * Validation Schema - مخطط التحقق
 *
 * مخطط للتحقق من كائن كامل
 */
export interface ValidationSchema {
  [fieldName: string]: ValidationRule | ValidationRule[] | ValidationSchema;
}

/**
 * Field Validation Error - خطأ التحقق من حقل
 *
 * خطأ في التحقق من حقل واحد
 * يختلف عن ValidationError في api.types.ts (الذي هو للـ API)
 */
export interface FieldValidationError {
  field: string;
  message: string;
  value?: unknown;
  code?: string;
  rule?: string;
}

/**
 * Validation Result - نتيجة التحقق
 *
 * نتيجة التحقق من البيانات
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
  data?: unknown;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Validation Context - سياق التحقق
 *
 * معلومات إضافية للتحقق
 */
export interface ValidationContext {
  data?: Record<string, unknown>;
  parent?: unknown;
  path?: string[];
  metadata?: Metadata;
}

/**
 * Async Validation Rule - قاعدة تحقق غير متزامنة
 *
 * قاعدة تحقق تتطلب عملية غير متزامنة
 */
export interface AsyncValidationRule extends ValidationRule {
  async?: (
    value: unknown,
    context?: ValidationContext,
  ) => Promise<boolean | string>;
}

/**
 * Validation Options - خيارات التحقق
 */
export interface ValidationOptions {
  stopOnFirstError?: boolean;
  strict?: boolean;
  allowUnknown?: boolean;
  stripUnknown?: boolean;
  abortEarly?: boolean;
  context?: ValidationContext;
}

/**
 * Field Validator - محقق حقل
 *
 * دالة للتحقق من حقل واحد
 */
export type FieldValidator = (
  value: unknown,
  rule: ValidationRule,
  context?: ValidationContext,
) => string | null;

/**
 * Schema Validator - محقق مخطط
 *
 * دالة للتحقق من مخطط كامل
 */
export type SchemaValidator = (
  data: unknown,
  schema: ValidationSchema,
  options?: ValidationOptions,
) => ValidationResult;

/**
 * Async Schema Validator - محقق مخطط غير متزامن
 */
export type AsyncSchemaValidator = (
  data: unknown,
  schema: ValidationSchema,
  options?: ValidationOptions,
) => Promise<ValidationResult>;

/**
 * Validation Transform - تحويل التحقق
 *
 * دالة لتحويل القيمة بعد التحقق
 */
export type ValidationTransform<T = unknown> = (value: unknown) => T;

/**
 * Validation Middleware - وسيط التحقق
 *
 * دالة للتحقق قبل المعالجة
 */
export type ValidationMiddleware<T = unknown> = (
  data: unknown,
  schema: ValidationSchema,
) => Promise<T>;

/**
 * Built-in Validators - محققات مدمجة
 *
 * محققات جاهزة للاستخدام
 */
export const BuiltInValidators = {
  /**
   * التحقق من البريد الإلكتروني
   */
  email: (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  /**
   * التحقق من URL
   */
  url: (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    // استخدام regex بسيط للتحقق من URL
    try {
      const urlPattern = /^(https?|ftp):\/\/([^\s/$.?#].[^\s]*)$/i;
      return urlPattern.test(value);
    } catch {
      return false;
    }
  },

  /**
   * التحقق من رقم
   */
  number: (value: unknown): boolean => {
    return typeof value === "number" && !isNaN(value);
  },

  /**
   * التحقق من عدد صحيح
   */
  integer: (value: unknown): boolean => {
    return typeof value === "number" && Number.isInteger(value);
  },

  /**
   * التحقق من تاريخ
   */
  date: (value: unknown): boolean => {
    if (value instanceof Date) return !isNaN(value.getTime());
    if (typeof value === "string") {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  },

  /**
   * التحقق من UUID
   */
  uuid: (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  /**
   * التحقق من كلمة مرور قوية
   */
  strongPassword: (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    // على الأقل 8 أحرف، حرف كبير، حرف صغير، رقم، رمز خاص
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(value);
  },
} as const;

/**
 * Validation Helper - مساعد التحقق
 *
 * دوال مساعدة للتحقق
 */
export const ValidationHelper = {
  /**
   * إنشاء FieldValidationError
   */
  createError(
    field: string,
    message: string,
    value?: unknown,
    code?: string,
  ): FieldValidationError {
    return { field, message, value, code };
  },

  /**
   * إنشاء ValidationResult
   */
  createResult(
    isValid: boolean,
    errors: FieldValidationError[] = [],
    data?: unknown,
  ): ValidationResult {
    return { isValid, errors, data };
  },

  /**
   * دمج نتائج التحقق
   */
  mergeResults(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap((r) => r.errors);
    const isValid = allErrors.length === 0;
    return {
      isValid,
      errors: allErrors,
    };
  },
} as const;
