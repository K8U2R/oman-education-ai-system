/**
 * Validation Middleware - برمجية وسطية للتحقق من البيانات
 *
 * استخدام Zod للتحقق من صحة البيانات في جميع الطلبات
 */

import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodSchema } from "zod";
import { logger } from "../../../../../shared/utils/logger.js";

/**
 * Validation Error Response
 */
interface ValidationErrorResponse {
  success: false;
  error: {
    message: string;
    code: "VALIDATION_ERROR";
    details: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * تحويل Zod Error إلى Validation Error Response
 */
function formatZodError(error: ZodError): ValidationErrorResponse {
  const details = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return {
    success: false,
    error: {
      message: "خطأ في التحقق من البيانات",
      code: "VALIDATION_ERROR",
      details,
    },
  };
}

/**
 * Validation Middleware Factory
 *
 * ينشئ middleware للتحقق من البيانات باستخدام Zod schema
 *
 * @param schema - Zod schema للتحقق
 * @param source - مصدر البيانات ('body' | 'query' | 'params')
 * @returns Express middleware
 */
export function validateRequest<T extends ZodSchema>(
  schema: T,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data =
        source === "body"
          ? req.body
          : source === "query"
            ? req.query
            : req.params;

      // التحقق من البيانات
      const validatedData = schema.parse(data);

      // استبدال البيانات الأصلية بالبيانات المفحوصة
      if (source === "body") {
        req.body = validatedData as z.infer<T>;
      } else if (source === "query") {
        req.query = validatedData as z.infer<T>;
      } else {
        req.params = validatedData as z.infer<T>;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = formatZodError(error);

        logger.warn("Validation error", {
          path: req.path,
          method: req.method,
          errors: errorResponse.error.details,
        });

        res.status(400).json(errorResponse);
        return;
      }

      // خطأ غير متوقع
      logger.error("Unexpected validation error", { error });
      res.status(500).json({
        success: false,
        error: {
          message: "حدث خطأ أثناء التحقق من البيانات",
          code: "INTERNAL_ERROR",
        },
      });
    }
  };
}

/**
 * Validate Request Body
 *
 * اختصار لـ validateRequest مع source='body'
 */
export function validateBody<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, "body");
}

/**
 * Validate Request Query
 *
 * اختصار لـ validateRequest مع source='query'
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, "query");
}

/**
 * Validate Request Params
 *
 * اختصار لـ validateRequest مع source='params'
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return validateRequest(schema, "params");
}

/**
 * Validate Multiple Sources
 *
 * التحقق من عدة مصادر في نفس الوقت
 */
export function validateMultiple(validators: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate body
      if (validators.body) {
        req.body = validators.body.parse(req.body);
      }

      // Validate query
      if (validators.query) {
        req.query = validators.query.parse(req.query);
      }

      // Validate params
      if (validators.params) {
        req.params = validators.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = formatZodError(error);

        logger.warn("Validation error", {
          path: req.path,
          method: req.method,
          errors: errorResponse.error.details,
        });

        res.status(400).json(errorResponse);
        return;
      }

      logger.error("Unexpected validation error", { error });
      res.status(500).json({
        success: false,
        error: {
          message: "حدث خطأ أثناء التحقق من البيانات",
          code: "INTERNAL_ERROR",
        },
      });
    }
  };
}

/**
 * Common Validation Schemas
 */
export const CommonSchemas = {
  /**
   * UUID Schema
   */
  uuid: z.string().uuid("معرف غير صحيح"),

  /**
   * Email Schema
   */
  email: z.string().email("البريد الإلكتروني غير صحيح"),

  /**
   * Password Schema
   */
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .max(100, "كلمة المرور طويلة جداً")
    .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل"),

  /**
   * Pagination Schema
   */
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    per_page: z.coerce.number().int().min(1).max(100).default(20).optional(),
  }),

  /**
   * Sort Schema
   */
  sort: z.object({
    sort_by: z.string().optional(),
    sort_order: z.enum(["asc", "desc"]).default("desc").optional(),
  }),

  /**
   * Date Schema
   */
  date: z.string().datetime("التاريخ غير صحيح"),

  /**
   * ID Schema (UUID or number)
   */
  id: z.union([z.string().uuid(), z.coerce.number().int().positive()]),
};
