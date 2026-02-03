/**
 * IEmailProvider - واجهة مزود البريد الإلكتروني
 *
 * Domain Interface لمزودي البريد الإلكتروني (SendGrid, AWS SES, etc.)
 *
 * هذه الواجهة تحدد العقد (Contract) لجميع عمليات إرسال البريد الإلكتروني
 * يجب أن تطبقها Infrastructure Layer
 */

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * IEmailProvider - واجهة مزود البريد الإلكتروني
 *
 * @example
 * ```typescript
 * const emailProvider = new SendGridAdapter(apiKey)
 * const result = await emailProvider.sendEmail({
 *   to: 'user@example.com',
 *   from: 'noreply@oman-education.ai',
 *   subject: 'مرحباً',
 *   html: '<h1>مرحباً</h1>'
 * })
 * ```
 */
export interface IEmailProvider {
  /**
   * إرسال بريد إلكتروني
   *
   * @param options - خيارات البريد الإلكتروني
   * @returns Promise<EmailResult>
   * @throws {EmailError} إذا فشل الإرسال
   *
   * @example
   * ```typescript
   * const result = await emailProvider.sendEmail({
   *   to: 'user@example.com',
   *   from: 'noreply@oman-education.ai',
   *   subject: 'مرحباً',
   *   html: '<h1>مرحباً</h1>'
   * })
   * ```
   */
  sendEmail(options: EmailOptions): Promise<EmailResult>;

  /**
   * التحقق من صحة الإعدادات
   *
   * @returns Promise<boolean>
   *
   * @example
   * ```typescript
   * const isValid = await emailProvider.validate()
   * ```
   */
  validate(): Promise<boolean>;
}
