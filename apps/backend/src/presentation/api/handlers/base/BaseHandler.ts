/**
 * Base Handler - المعالج الأساسي
 *
 * فئة مجردة توفر وظائف مشتركة لجميع المعالجات:
 * - معالجة الأخطاء المركزية
 * - استجابات قياسية (Standardized Responses)
 * - تسجيل العمليات (Logging)
 */

import { Response } from "express";
// Removed unused logger import
import {
  sendSuccess,
  sendError,
  sendValidationError,
  handleError,
} from "../../utils/response.helper.js";
import { APIErrorCode } from "../../../../domain/types/index.js";

export abstract class BaseHandler {
  /**
   * تنفيذ عملية ومعالجة الأخطاء تلقائياً
   *
   * @param operation - الدالة المراد تنفيذها
   * @param res - Express Response
   * @param errorMessage - رسالة الخطأ الافتراضية
   */
  protected async execute(
    res: Response,
    operation: () => Promise<void>,
    errorMessage: string = "حدث خطأ أثناء معالجة الطلب",
    language: string = "en",
  ): Promise<void> {
    try {
      await operation();
    } catch (error) {
      handleError(res, error, errorMessage, "INTERNAL_SERVER_ERROR", language);
    }
  }

  /**
   * إرسال استجابة نجاح (200 OK)
   */
  protected ok<T>(res: Response, data: T, message?: string): Response {
    return sendSuccess(res, data, message, 200);
  }

  /**
   * إرسال استجابة إنشاء (201 Created)
   */
  protected created<T>(res: Response, data: T, message?: string): Response {
    return sendSuccess(res, data, message, 201);
  }

  /**
   * إرسال استجابة لا يوجد محتوى (204 No Content)
   */
  protected noContent(res: Response, message?: string): Response {
    return sendSuccess(res, null, message, 204);
  }

  /**
   * إرسال استجابة خطأ في البيانات (400 Bad Request)
   */
  protected badRequest(
    res: Response,
    message: string,
    code: APIErrorCode = "BAD_REQUEST",
  ): Response {
    return sendError(res, { message, code }, 400);
  }

  /**
   * إرسال استجابة غير مصرح (401 Unauthorized)
   */
  protected unauthorized(
    res: Response,
    message: string = "غير مصرح لك بالوصول",
  ): Response {
    return sendError(res, { message, code: "UNAUTHORIZED" }, 401);
  }

  /**
   * إرسال استجابة ممنوع (403 Forbidden)
   */
  protected forbidden(
    res: Response,
    message: string = "ليس لديك صلاحية",
  ): Response {
    return sendError(res, { message, code: "FORBIDDEN" }, 403);
  }

  /**
   * إرسال استجابة غير موجود (404 Not Found)
   */
  protected notFound(
    res: Response,
    message: string = "المورد غير موجود",
  ): Response {
    return sendError(res, { message, code: "NOT_FOUND" }, 404);
  }

  /**
   * إرسال أخطاء التحقق (422 Unprocessable Entity)
   */
  protected validationError(
    res: Response,
    message: string,
    errors: Array<{ field: string; message: string }>,
  ): Response {
    return sendValidationError(res, message, errors, 422);
  }
}
