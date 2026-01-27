/**
 * IEmailProvider Interface
 * 
 * Contract for any Email Provider (Nodemailer, SendGrid, etc.)
 * Complies with Law 01 (Dependency Inversion).
 */

export interface IEmailProvider {
    /**
     * Send an email with HTML content
     */
    sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;

    /**
     * Check provider health
     */
    checkHealth(): Promise<boolean>;
}
