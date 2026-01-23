/**
 * Email Template Engine - محرك قوالب البريد الإلكتروني
 *
 * محرك لإنشاء قوالب HTML للبريد الإلكتروني مع الهوية العمانية
 */

export interface TemplateVariables {
  [key: string]: string | number | boolean | undefined;
}

/**
 * قاعدة HTML للبريد الإلكتروني (هوية عمانية)
 */
const BASE_TEMPLATE = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      direction: rtl;
    }
    .email-container {
      max-width: 600px;
      margin-inline-start: auto;
      margin-inline-end: auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #D32F2F 0%, #2E7D32 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      font-size: 24px;
      margin-block-end: 10px;
    }
    .email-body {
      padding: 30px 20px;
      color: #333333;
      line-height: 1.6;
      text-align: start;
    }
    .email-body h2 {
      color: #D32F2F;
      margin-block-end: 20px;
      font-size: 20px;
    }
    .email-body p {
      margin-block-end: 15px;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #D32F2F;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
      margin-block: 20px;
      font-weight: bold;
      text-align: center;
    }
    .button:hover {
      background-color: #B71C1C;
    }
    .button-container {
      text-align: center;
    }
    .url-text {
      word-break: break-all;
      color: #666666;
      font-size: 14px;
    }
    .email-footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #666666;
      font-size: 14px;
      border-block-start: 2px solid #D32F2F;
    }
    .email-footer p {
      margin-block: 5px;
    }
    .email-footer-small {
      font-size: 12px;
      color: #999999;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent, #D32F2F, transparent);
      margin-block: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🇴🇲 {{headerTitle}}</h1>
      <p>{{headerSubtitle}}</p>
    </div>
    <div class="email-body">
      {{content}}
    </div>
    <div class="email-footer">
      <p><strong>نظام التعليم الذكي العماني</strong></p>
      <p>سلطنة عمان</p>
      <div class="divider"></div>
      <p class="email-footer-small">
        هذا بريد إلكتروني تلقائي، يرجى عدم الرد عليه.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * استبدال المتغيرات في القالب
 *
 * @param template - القالب
 * @param variables - المتغيرات
 * @returns القالب مع استبدال المتغيرات
 */
function replaceVariables(
  template: string,
  variables: TemplateVariables,
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, String(value || ""));
  }

  return result;
}

/**
 * إنشاء قالب التحقق من البريد الإلكتروني
 *
 * @param verificationUrl - رابط التحقق
 * @param userName - اسم المستخدم (اختياري)
 * @returns HTML template
 */
export function generateVerificationEmailTemplate(
  verificationUrl: string,
  userName?: string,
): string {
  const greeting = userName ? `مرحباً ${userName}` : "مرحباً";

  const content = `
    <h2>${greeting}</h2>
    <p>شكراً لك على التسجيل في نظام التعليم الذكي العماني.</p>
    <p>لإكمال عملية التسجيل، يرجى التحقق من بريدك الإلكتروني من خلال النقر على الزر أدناه:</p>
    <div class="button-container">
      <a href="${verificationUrl}" class="button">تحقق من البريد الإلكتروني</a>
    </div>
    <p>أو يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
    <p class="url-text">${verificationUrl}</p>
    <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة 24 ساعة فقط.</p>
    <p>إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد الإلكتروني.</p>
  `;

  return replaceVariables(BASE_TEMPLATE, {
    title: "تحقق من بريدك الإلكتروني",
    headerTitle: "نظام التعليم الذكي العماني",
    headerSubtitle: "تحقق من بريدك الإلكتروني",
    content,
  });
}

/**
 * إنشاء قالب إعادة تعيين كلمة المرور
 *
 * @param resetUrl - رابط إعادة التعيين
 * @param userName - اسم المستخدم (اختياري)
 * @returns HTML template
 */
export function generatePasswordResetEmailTemplate(
  resetUrl: string,
  userName?: string,
): string {
  const greeting = userName ? `مرحباً ${userName}` : "مرحباً";

  const content = `
    <h2>${greeting}</h2>
    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في نظام التعليم الذكي العماني.</p>
    <p>لإعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:</p>
    <div class="button-container">
      <a href="${resetUrl}" class="button">إعادة تعيين كلمة المرور</a>
    </div>
    <p>أو يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
    <p class="url-text">${resetUrl}</p>
    <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
    <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني. كلمة المرور الخاصة بك لن تتغير.</p>
  `;

  return replaceVariables(BASE_TEMPLATE, {
    title: "إعادة تعيين كلمة المرور",
    headerTitle: "نظام التعليم الذكي العماني",
    headerSubtitle: "إعادة تعيين كلمة المرور",
    content,
  });
}
