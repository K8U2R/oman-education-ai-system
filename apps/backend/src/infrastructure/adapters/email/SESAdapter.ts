/**
 * AWS SES Adapter - محوّل AWS SES
 *
 * تطبيق IEmailProvider باستخدام AWS SES
 *
 * @example
 * ```typescript
 * const adapter = new SESAdapter(region, accessKeyId, secretAccessKey, fromEmail, fromName)
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

export class SESAdapter implements IEmailProvider {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly fromEmail: string;
  private readonly fromName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sesClient: any; // AWS SES Client (lazy loaded)

  /**
   * إنشاء AWS SES Adapter
   *
   * @param region - AWS Region (e.g., 'us-east-1')
   * @param accessKeyId - AWS Access Key ID
   * @param secretAccessKey - AWS Secret Access Key
   * @param fromEmail - البريد الإلكتروني المرسل الافتراضي
   * @param fromName - اسم المرسل الافتراضي
   */
  constructor(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    fromEmail: string,
    fromName: string,
  ) {
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new EmailConfigurationError("AWS SES credentials مطلوبة");
    }

    this.region = region;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.fromEmail = fromEmail;
    this.fromName = fromName;

    // Initialize SES Client (lazy load)
    this.initializeSESClient();
  }

  /**
   * تهيئة AWS SES Client
   *
   * @private
   */
  private initializeSESClient(): void {
    try {
      // Dynamic import to avoid errors if package not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const { SESClient } = require("@aws-sdk/client-ses");
      // SendEmailCommand is used dynamically in sendEmail method

      this.sesClient = new SESClient({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      logger.info("AWS SES Client initialized", { region: this.region });
    } catch {
      logger.warn(
        "AWS SES SDK not installed. Install with: npm install @aws-sdk/client-ses",
      );
    }
  }

  /**
   * إرسال بريد إلكتروني عبر AWS SES
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

      if (!this.sesClient) {
        this.initializeSESClient();
      }

      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      const { SendEmailCommand } = require("@aws-sdk/client-ses");

      const command = new SendEmailCommand({
        Source: `${this.fromName} <${options.from || this.fromEmail}>`,
        Destination: {
          ToAddresses: [options.to],
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: options.html,
              Charset: "UTF-8",
            },
            Text: {
              Data: options.text || this.stripHtml(options.html),
              Charset: "UTF-8",
            },
          },
        },
      });

      logger.info("Sending email via AWS SES", {
        to: options.to,
        subject: options.subject,
      });

      const response = await this.sesClient.send(command);

      logger.info("Email sent successfully via AWS SES", {
        to: options.to,
        messageId: response.MessageId,
      });

      return {
        success: true,
        messageId: response.MessageId,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logger.error("Failed to send email via AWS SES", {
        to: options.to,
        error: errorMessage,
      });

      // Check if it's an AWS-specific error
      if (error && typeof error === "object" && "name" in error) {
        const awsError = error as { name?: string; message?: string };

        if (
          awsError.name === "InvalidParameterValue" ||
          awsError.name === "ValidationError"
        ) {
          throw new EmailValidationError(
            `بيانات غير صحيحة: ${awsError.message || errorMessage}`,
          );
        }

        if (
          awsError.name === "InvalidClientTokenId" ||
          awsError.name === "SignatureDoesNotMatch"
        ) {
          throw new EmailConfigurationError(
            `خطأ في إعدادات AWS SES: ${awsError.message || errorMessage}`,
          );
        }

        throw new EmailSendError(
          `فشل إرسال البريد الإلكتروني: ${awsError.message || errorMessage}`,
        );
      }

      throw new EmailSendError(`فشل إرسال البريد الإلكتروني: ${errorMessage}`);
    }
  }

  /**
   * التحقق من صحة إعدادات AWS SES
   *
   * @returns Promise<boolean>
   */
  async validate(): Promise<boolean> {
    try {
      if (!this.region || !this.accessKeyId || !this.secretAccessKey) {
        return false;
      }

      if (!this.sesClient) {
        this.initializeSESClient();
      }

      // Try to get account sending quota (lightweight operation)
      // For now, just check if credentials are set
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
