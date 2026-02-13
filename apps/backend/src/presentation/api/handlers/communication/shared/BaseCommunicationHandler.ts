import { Response } from "express";
import { BaseHandler } from "../../base/BaseHandler.js";

/**
 * BaseCommunicationHandler - للمعالجات الخاصة بالتواصل
 *
 * يوفر وظائف مشتركة لجميع قنوات التواصل (Email, SMS, Notifications)
 */
export abstract class BaseCommunicationHandler extends BaseHandler {
  /**
   * إرسال استجابة نجاح عملية إرسال رسالة
   *
   * @param res - Express Response
   * @param messageId - معرف الرسالة المرسلة
   * @param provider - مزود الخدمة (اختياري)
   */
  protected sent(
    res: Response,
    messageId: string,
    provider?: string,
  ): Response {
    return this.ok(res, {
      success: true,
      message_id: messageId,
      provider: provider || "system",
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * إرسال استجابة نجاح لعملية مجدولة (Queued)
   */
  protected queued(res: Response, jobId: string): Response {
    return this.accepted(res, {
      status: "queued",
      job_id: jobId,
      message: "Message queued for delivery",
    });
  }

  /**
   * (Helper) إرسال 202 Accepted
   * عادة غير موجود في BaseHandler ولكن مفيد للعمليات غير المتزامنة
   */
  protected accepted<T>(res: Response, data: T): Response {
    return res.status(202).json({
      success: true,
      data,
    });
  }
}
