export interface EmailTemplateResult {
  html: string;
  text: string;
}

export interface IEmailTemplateEngine {
  /**
   * Generate content for verification email
   */
  generateVerificationEmail(
    userName: string,
    verificationUrl: string,
  ): Promise<EmailTemplateResult> | EmailTemplateResult;

  /**
   * Generate content for password reset email
   */
  generatePasswordResetEmail(
    userName: string,
    resetUrl: string,
  ): Promise<EmailTemplateResult> | EmailTemplateResult;
}
