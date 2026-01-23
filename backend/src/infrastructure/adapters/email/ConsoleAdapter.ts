/**
 * Console Adapter - محوّل Console (للتطوير)
 *
 * تطبيق IEmailProvider للاستخدام في التطوير
 * يطبع الرسائل في Console بدلاً من إرسالها
 *
 * @example
 * ```typescript
 * const adapter = new ConsoleAdapter(fromEmail, fromName)
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
import { EmailValidationError } from "@/domain/exceptions";
import { logger } from "@/shared/utils/logger.js";
import { ENV_CONFIG } from "../../config/env.config.js";

export class ConsoleAdapter implements IEmailProvider {
  private readonly fromEmail: string;
  private readonly fromName: string;

  /**
   * إنشاء Console Adapter
   *
   * @param fromEmail - البريد الإلكتروني المرسل الافتراضي
   * @param fromName - اسم المرسل الافتراضي
   */
  constructor(fromEmail: string, fromName: string) {
    this.fromEmail = fromEmail;
    this.fromName = fromName;
  }

  /**
   * إرسال بريد إلكتروني (طباعة في Console)
   *
   * @param options - خيارات البريد الإلكتروني
   * @returns Promise<EmailResult>
   * @throws {EmailValidationError} إذا كانت البيانات غير صحيحة
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    // Validate email options
    if (!options.to || !options.subject || !options.html) {
      throw new EmailValidationError(
        "البريد الإلكتروني، الموضوع، والمحتوى مطلوبون",
      );
    }

    logger.info("📧 Email would be sent (Console Adapter)", {
      from: `${this.fromName} <${options.from || this.fromEmail}>`,
      to: options.to,
      subject: options.subject,
    });

    // Extract verification/reset link from HTML
    const linkMatch = options.html.match(/href=["']([^"']+)["']/);
    const verificationLink = linkMatch ? linkMatch[1] : null;

    // Log email content in development
    if (ENV_CONFIG.NODE_ENV === "development") {
      console.log("\n" + "=".repeat(80));
      console.log("📧 EMAIL SENT (Console Adapter - Development Mode)");
      console.log("=".repeat(80));
      console.log(`From: ${this.fromName} <${options.from || this.fromEmail}>`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log("-".repeat(80));

      if (verificationLink) {
        console.log("\n🔗 VERIFICATION LINK (Copy this URL):");
        console.log("─".repeat(80));
        console.log(verificationLink);
        console.log("─".repeat(80));

        // Extract token from URL for easier debugging
        const tokenMatch = verificationLink.match(/[?&]token=([^&]+)/);
        if (tokenMatch) {
          const token = decodeURIComponent(tokenMatch[1]);
          console.log("\n📝 TOKEN INFO:");
          console.log(`   Length: ${token.length} characters`);
          console.log(
            `   Preview: ${token.substring(0, 16)}...${token.substring(token.length - 8)}`,
          );
          if (token.length < 32) {
            console.log(
              "   ⚠️  WARNING: Token seems too short! Expected at least 32 characters.",
            );
          }
        }

        console.log(
          "\n💡 TIP: Copy the link above and paste it in your browser to verify the email",
        );
      }

      console.log("\n📄 Email Content Preview:");
      console.log("-".repeat(80));
      const textContent = options.text || this.stripHtml(options.html);
      console.log(
        textContent.substring(0, 500) + (textContent.length > 500 ? "..." : ""),
      );
      console.log("=".repeat(80) + "\n");

      logger.info("📧 Email Content (Dev Only)", {
        hasVerificationLink: !!verificationLink,
        verificationLink: verificationLink || "N/A",
        html: options.html.substring(0, 200) + "...",
        text: textContent.substring(0, 200) + "...",
      });
    }

    // Simulate successful send
    return {
      success: true,
      messageId: `console-${Date.now()}`,
    };
  }

  /**
   * التحقق من صحة الإعدادات (دائماً true للـ Console)
   *
   * @returns Promise<boolean>
   */
  async validate(): Promise<boolean> {
    return true;
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
