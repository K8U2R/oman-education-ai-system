/**
 * EmailService - خدمة البريد الإلكتروني
 *
 * Production-grade email service using IEmailProvider adapter
 * Handles transactional emails (verification, password reset, etc.)
 *
 * Constitutional Authority: LAWS.md - Article 3 (Cluster Sovereignty)
 * Cluster: communication/messaging
 *
 * @example
 * ```typescript
 * const emailService = new EmailService(emailProvider);
 * await emailService.sendVerificationEmail(email, token, userName);
 * ```
 */

import {
  IEmailProvider,
  EmailOptions,
} from "@/domain/interfaces/email/IEmailProvider";
import { IEmailTemplateEngine } from "@/domain/interfaces/email/IEmailTemplateEngine";
import { logger } from "@/shared/common";
import { EmailSendError } from "@/domain/exceptions/EmailExceptions.js";

export interface EmailServiceOptions {
  from?: string;
  baseUrl?: string;
}

export class EmailService {
  private readonly from: string;
  private readonly baseUrl: string;

  constructor(
    private readonly emailProvider: IEmailProvider,
    private readonly templateEngine: IEmailTemplateEngine,
    options?: EmailServiceOptions,
  ) {
    this.from =
      options?.from || process.env.EMAIL_FROM || "noreply@oman-education.ai";
    this.baseUrl =
      options?.baseUrl ||
      process.env.FRONTEND_URL ||
      "https://oman-education.ai";
  }

  /**
   * Send Verification Email - إرسال بريد التحقق
   *
   * @param to - Recipient email address
   * @param token - Verification token
   * @param userName - User name (optional)
   * @returns Success status
   */
  async sendVerificationEmail(
    to: string,
    token: string,
    userName?: string,
  ): Promise<void> {
    const verificationUrl = `${this.baseUrl}/verify-email?token=${token}`;
    const displayName = userName || "المستخدم";

    // Law 05: Using Injected Template Engine (Delegation)
    const content = await this.templateEngine.generateVerificationEmail(
      displayName,
      verificationUrl,
    );

    const emailOptions: EmailOptions = {
      to,
      from: this.from,
      subject: "تأكيد البريد الإلكتروني - Oman AI Education",
      html: content.html,
      text: content.text,
    };

    try {
      logger.info("Sending verification email", { to });
      const result = await this.emailProvider.sendEmail(emailOptions);

      if (!result.success) {
        throw new EmailSendError(result.error || "فشل إرسال بريد التحقق");
      }

      logger.info("Verification email sent successfully", {
        to,
        messageId: result.messageId,
      });
    } catch (error) {
      logger.error("Failed to send verification email", { to, error });
      throw new EmailSendError("فشل إرسال بريد التحقق. يرجى المحاولة لاحقاً");
    }
  }

  /**
   * Send Password Reset Email - إرسال بريد إعادة تعيين كلمة المرور
   *
   * @param to - Recipient email address
   * @param token - Password reset token
   * @param userName - User name (optional)
   * @returns Success status
   */
  async sendPasswordResetEmail(
    to: string,
    token: string,
    userName?: string,
  ): Promise<void> {
    const resetUrl = `${this.baseUrl}/reset-password?token=${token}`;
    const displayName = userName || "المستخدم";

    // Law 05: Using Injected Template Engine (Delegation)
    const content = await this.templateEngine.generatePasswordResetEmail(
      displayName,
      resetUrl,
    );

    const emailOptions: EmailOptions = {
      to,
      from: this.from,
      subject: "إعادة تعيين كلمة المرور - Oman AI Education",
      html: content.html,
      text: content.text,
    };

    try {
      logger.info("Sending password reset email", { to });
      const result = await this.emailProvider.sendEmail(emailOptions);

      if (!result.success) {
        throw new EmailSendError(
          result.error || "فشل إرسال بريد إعادة تعيين كلمة المرور",
        );
      }

      logger.info("Password reset email sent successfully", {
        to,
        messageId: result.messageId,
      });
    } catch (error) {
      logger.error("Failed to send password reset email", { to, error });
      throw new EmailSendError(
        "فشل إرسال بريد إعادة تعيين كلمة المرور. يرجى المحاولة لاحقاً",
      );
    }
  }

  /**
   * Send Generic Email
   *
   * @param to - Recipient email
   * @param subject - Email subject
   * @param html - HTML content
   * @param text - Plain text content
   */
  async send(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    const emailOptions: EmailOptions = {
      to,
      from: this.from,
      subject,
      html,
      text: text || this.stripHtml(html),
    };

    try {
      logger.info("Sending email", { to, subject });
      const result = await this.emailProvider.sendEmail(emailOptions);

      if (!result.success) {
        throw new EmailSendError(result.error || "فشل إرسال البريد الإلكتروني");
      }

      logger.info("Email sent successfully", {
        to,
        subject,
        messageId: result.messageId,
      });
    } catch (error) {
      logger.error("Failed to send email", { to, subject, error });
      throw new EmailSendError(
        "فشل إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً",
      );
    }
  }

  /**
   * Validate Email Provider Configuration
   *
   * @returns true if valid
   */
  async validate(): Promise<boolean> {
    try {
      return await this.emailProvider.validate();
    } catch (error) {
      logger.error("Email provider validation failed", { error });
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
