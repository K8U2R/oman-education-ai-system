
/**
 * Email Template Engine - محرك قوالب البريد الإلكتروني
 *
 * Handles HTML generation for emails to separate concerns from EmailService.
 * Enforces Law 05 (Single Responsibility).
 */
export class EmailTemplateEngine {
    /**
     * Generate Verification Email HTML
     */
    static generateVerificationEmailHtml(
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

    /**
     * Generate Verification Email Text
     */
    static generateVerificationEmailText(
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

    /**
     * Generate Password Reset Email HTML
     */
    static generatePasswordResetEmailHtml(
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

    /**
     * Generate Password Reset Email Text
     */
    static generatePasswordResetEmailText(
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
}
