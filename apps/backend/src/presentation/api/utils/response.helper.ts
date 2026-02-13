/**
 * Response Helper - مساعد الاستجابات
 *
 * دوال مساعدة لاستخدام API Types في Handlers
 */
import { ZodError } from "zod";
import { t } from "../middleware/i18n/translation.service.js";
import type { Response } from "express";
import {
  APISuccessResponse,
  APIErrorResponse,
  APIPaginatedResponse,
  APIResponseHelper,
  APIError,
  APIStatusCode,
  ErrorHandlerHelper,
} from "../../../domain/types/index.js";

/**
 * إرسال استجابة نجاح
 *
 * @param res - Express Response
 * @param data - البيانات المرجعة
 * @param message - رسالة اختيارية
 * @param statusCode - رمز الحالة (افتراضي: 200)
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: APIStatusCode = 200,
): Response {
  const response: APISuccessResponse<T> = APIResponseHelper.success(
    data,
    message,
  );
  return res.status(statusCode).json(response);
}

/**
 * إرسال استجابة خطأ
 *
 * @param res - Express Response
 * @param error - خطأ API
 * @param statusCode - رمز الحالة (افتراضي: 400)
 */
export function sendError(
  res: Response,
  error: APIError,
  statusCode: APIStatusCode = 400,
): Response {
  const response: APIErrorResponse = APIResponseHelper.error(error);
  return res.status(statusCode).json(response);
}

/**
 * إرسال استجابة paginated
 *
 * @param res - Express Response
 * @param items - العناصر
 * @param page - رقم الصفحة
 * @param perPage - عدد العناصر في الصفحة
 * @param total - العدد الإجمالي
 * @param statusCode - رمز الحالة (افتراضي: 200)
 */
export function sendPaginated<T>(
  res: Response,
  items: T[],
  page: number,
  perPage: number,
  total: number,
  statusCode: APIStatusCode = 200,
): Response {
  const response: APIPaginatedResponse<T> = APIResponseHelper.paginated(
    items,
    page,
    perPage,
    total,
  );
  return res.status(statusCode).json(response);
}

/**
 * إرسال استجابة validation error
 *
 * @param res - Express Response
 * @param message - رسالة الخطأ
 * @param errors - أخطاء التحقق
 * @param statusCode - رمز الحالة (افتراضي: 422)
 */
export function sendValidationError(
  res: Response,
  message: string,
  errors: Array<{ field: string; message: string; value?: unknown }>,
  statusCode: APIStatusCode = 422,
): Response {
  const response = APIResponseHelper.validationError(
    message,
    errors.map((e) => ({
      field: e.field,
      message: e.message,
      value: e.value,
    })),
  );
  return res.status(statusCode).json(response);
}

/**
 * معالجة الأخطاء وإرسال استجابة
 *
 * @param res - Express Response
 * @param error - الخطأ
 * @param defaultMessage - رسالة افتراضية
 * @param defaultCode - رمز افتراضي
 */
export function handleError(
  res: Response,
  error: unknown,
  _defaultMessage: string = "حدث خطأ غير متوقع",
  defaultCode: APIError["code"] = "INTERNAL_SERVER_ERROR",
  language: string = "en",
): Response {
  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    const errors = error.errors.map((err) => ({
      field: err.path.join("."),
      message:
        t(`validation.${err.message}`, language) !== `validation.${err.message}`
          ? t(`validation.${err.message}`, language)
          : err.message, // Fallback to raw Zod message if translation missing
      value: undefined,
    }));

    return sendValidationError(
      res,
      t("validation.invalid_input", language),
      errors,
    );
  }

  const apiError = ErrorHandlerHelper.toAPIError(error, defaultCode);

  // Translate main error message if possible
  // Check if message is a key (no spaces, maybe dots)
  if (!apiError.message.includes(" ")) {
    const translated = t(apiError.message, language);
    if (translated !== apiError.message) {
      apiError.message = translated;
    }
  }

  // تحديد status code حسب نوع الخطأ
  let statusCode: APIStatusCode = 500;
  if (
    apiError.code === "UNAUTHORIZED" ||
    apiError.code === "AUTHENTICATION_FAILED" ||
    apiError.code === "INVALID_TOKEN"
  )
    statusCode = 401;
  else if (apiError.code === "FORBIDDEN") statusCode = 403;
  else if (apiError.code === "NOT_FOUND") statusCode = 404;
  else if (apiError.code === "VALIDATION_ERROR") statusCode = 422;
  else if (apiError.code === "BAD_REQUEST") statusCode = 400;
  else if (apiError.code === "CONFLICT") statusCode = 409;
  else if (apiError.code === "RATE_LIMIT_EXCEEDED") statusCode = 429;

  return sendError(res, apiError, statusCode);
}
