/**
 * SendGrid Adapter - محوّل SendGrid
 *
 * تطبيق IEmailProvider باستخدام SendGrid
 *
 * @example
 * ```typescript
 * const adapter = new SendGridAdapter(apiKey)
 * const result = await adapter.sendEmail({
 *   to: 'user@example.com',
 *   from: 'noreply@oman-education.ai',
 *   subject: 'مرحباً',
 *   html: '<h1>مرحباً</h1>'
 * })
 * ```
 */

import {
  IEmailProvider,
  EmailOptions,
  EmailResult,
} from "@/domain/interfaces/email/IEmailProvider";
import {
  EmailSendError,
  EmailConfigurationError,
  EmailValidationError,
} from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger";

export class SendGridAdapter implements IEmailProvider {
  private readonly apiKey: string;
  private readonly fromEmail: string;
  private readonly fromName: string;

  /**
   * إنشاء SendGrid Adapter
   *
   * @param apiKey - SendGrid API Key
   * @param fromEmail - البريد الإلكتروني المرسل الافتراضي
   * @param fromName - اسم المرسل الافتراضي
   */
  constructor(apiKey: string, fromEmail: string, fromName: string) {
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      throw new EmailConfigurationError("SendGrid API Key مطلوب");
    }

    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
    this.fromName = fromName;

    // Initialize SendGrid (lazy load)

    try {
      // Dynamic import to avoid errors if package not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(this.apiKey);
    } catch {
      logger.warn(
        "SendGrid package not installed. Install with: npm install @sendgrid/mail",
      );
    }
  }

  /**
   * إرسال بريد إلكتروني عبر SendGrid
   *
   * @param options - خيارات البريد الإلكتروني
   * @returns Promise<EmailResult>
   * @throws {EmailSendError} إذا فشل الإرسال
   * @throws {EmailValidationError} إذا كانت البيانات غير صحيحة
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // Validate email options
      if (!options.to || !options.subject || !options.html) {
        throw new EmailValidationError(
          "البريد الإلكتروني، الموضوع، والمحتوى مطلوبون",
        );
      }

      // Dynamic import
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const sgMail = require("@sendgrid/mail");

      const msg = {
        to: options.to,
        from: {
          email: options.from || this.fromEmail,
          name: this.fromName,
        },
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      logger.info("Sending email via SendGrid", {
        to: options.to,
        subject: options.subject,
      });

      const [response] = await sgMail.send(msg);

      logger.info("Email sent successfully via SendGrid", {
        to: options.to,
        messageId: response.headers["x-message-id"],
      });

      return {
        success: true,
        messageId: response.headers["x-message-id"] as string,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logger.error("Failed to send email via SendGrid", {
        to: options.to,
        error: errorMessage,
      });

      // Check if it's a SendGrid-specific error
      if (error && typeof error === "object" && "response" in error) {
        const sgError = error as {
          response?: { body?: { errors?: Array<{ message?: string }> } };
        };
        const errorDetails =
          sgError.response?.body?.errors?.[0]?.message || errorMessage;

        if (
          errorMessage.includes("API key") ||
          errorMessage.includes("authentication")
        ) {
          throw new EmailConfigurationError(
            `خطأ في إعدادات SendGrid: ${errorDetails}`,
          );
        }

        throw new EmailSendError(
          `فشل إرسال البريد الإلكتروني: ${errorDetails}`,
        );
      }

      throw new EmailSendError(`فشل إرسال البريد الإلكتروني: ${errorMessage}`);
    }
  }

  /**
   * التحقق من صحة إعدادات SendGrid
   *
   * @returns Promise<boolean>
   */
  async validate(): Promise<boolean> {
    try {
      if (!this.apiKey || this.apiKey.trim().length === 0) {
        return false;
      }

      // Try to send a test email (or validate API key)
      // For now, just check if API key is set
      return true;
    } catch {
      return false;
    }
  }

  /**
   * إزالة HTML من النص (لإنشاء نص عادي)
   *
   * @param html - النص HTML
   * @returns نص عادي
   * @private
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  }
}
