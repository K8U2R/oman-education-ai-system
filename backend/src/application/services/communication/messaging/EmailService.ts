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

import { IEmailProvider, EmailOptions } from "@/domain/interfaces/email/IEmailProvider";
import { logger } from "@/shared/common";
import { EmailSendError } from "@/domain/exceptions/EmailExceptions.js";

export interface EmailServiceOptions {
    from?: string;
    replyTo?: string;
    baseUrl?: string;
}

export class EmailService {
    private readonly from: string;
    private readonly baseUrl: string;

    constructor(
        private readonly emailProvider: IEmailProvider,
        options?: EmailServiceOptions,
    ) {
        this.from =
            options?.from ||
            process.env.EMAIL_FROM ||
            "noreply@oman-education.ai";
        /* this.replyTo = 
            options?.replyTo ||
            process.env.EMAIL_REPLY_TO ||
            "support@oman-education.ai"; */
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

        const html = this.generateVerificationEmailHtml(
            displayName,
            verificationUrl,
        );
        const text = this.generateVerificationEmailText(
            displayName,
            verificationUrl,
        );

        const emailOptions: EmailOptions = {
            to,
            from: this.from,
            subject: "تأكيد البريد الإلكتروني - Oman AI Education",
            html,
            text,
        };

        try {
            logger.info("Sending verification email", { to });
            const result = await this.emailProvider.sendEmail(emailOptions);

            if (!result.success) {
                throw new EmailSendError(
                    result.error || "فشل إرسال بريد التحقق",
                );
            }

            logger.info("Verification email sent successfully", {
                to,
                messageId: result.messageId,
            });
        } catch (error) {
            logger.error("Failed to send verification email", { to, error });
            throw new EmailSendError(
                "فشل إرسال بريد التحقق. يرجى المحاولة لاحقاً",
            );
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

        const html = this.generatePasswordResetEmailHtml(displayName, resetUrl);
        const text = this.generatePasswordResetEmailText(displayName, resetUrl);

        const emailOptions: EmailOptions = {
            to,
            from: this.from,
            subject: "إعادة تعيين كلمة المرور - Oman AI Education",
            html,
            text,
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
            throw new EmailSendError("فشل إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً");
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

    // ========================================================================
    // HTML TEMPLATE GENERATORS
    // ========================================================================

    private generateVerificationEmailHtml(
        userName: string,
        verificationUrl: string,
    ): string {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد البريد الإلكتروني</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎓 Oman AI Education</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0;">مرحباً ${userName}! 👋</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                    شكراً لتسجيلك في منصة عمان التعليمية للذكاء الاصطناعي. 
                    يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                        ✓ تأكيد البريد الإلكتروني
                    </a>
                </div>
                <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                    أو انسخ الرابط التالي والصقه في المتصفح:<br/>
                    <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;"/>
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    &copy; 2026 Oman AI Education System. جميع الحقوق محفوظة.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
    }

    private generateVerificationEmailText(
        userName: string,
        verificationUrl: string,
    ): string {
        return `
مرحباً ${userName}!

شكراً لتسجيلك في منصة عمان التعليمية للذكاء الاصطناعي.

يرجى تأكيد بريدك الإلكتروني بزيارة الرابط التالي:
${verificationUrl}

إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد.

---
© 2026 Oman AI Education System
    `.trim();
    }

    private generatePasswordResetEmailHtml(
        userName: string,
        resetUrl: string,
    ): string {
        return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔐 Oman AI Education</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #333333; margin-top: 0;">مرحباً ${userName}! 👋</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                    لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.
                    انقر على الزر أدناه لإعادة تعيين كلمة المرور:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #f5576c; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                        🔑 إعادة تعيين كلمة المرور
                    </a>
                </div>
                <p style="color: #ff6b6b; font-size: 14px; background-color: #fff3f3; padding: 15px; border-radius: 5px; border-left: 4px solid #ff6b6b;">
                    ⚠️ هذا الرابط صالح لمدة 24 ساعة فقط.
                </p>
                <p style="color: #999999; font-size: 14px; line-height: 1.6;">
                    أو انسخ الرابط التالي والصقه في المتصفح:<br/>
                    <a href="${resetUrl}" style="color: #f5576c; word-break: break-all;">${resetUrl}</a>
                </p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;"/>
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد. حسابك آمن.
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                    &copy; 2026 Oman AI Education System. جميع الحقوق محفوظة.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
    }

    private generatePasswordResetEmailText(
        userName: string,
        resetUrl: string,
    ): string {
        return `
مرحباً ${userName}!

لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.

يرجى زيارة الرابط التالي لإعادة تعيين كلمة المرور:
${resetUrl}

⚠️ هذا الرابط صالح لمدة 24 ساعة فقط.

إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد. حسابك آمن.

---
© 2026 Oman AI Education System
    `.trim();
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    }
}
