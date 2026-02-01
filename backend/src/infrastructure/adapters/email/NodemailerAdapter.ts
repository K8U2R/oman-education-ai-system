import nodemailer from 'nodemailer';
import { IEmailProvider } from '@/domain/interfaces/email/IEmailProvider.js';
import { ENV_CONFIG } from '@/infrastructure/config/env.config.js';
import { logger } from '@/shared/utils/logger.js';

export class NodemailerAdapter implements IEmailProvider {
    private transporter: nodemailer.Transporter;

    constructor() {
        if (ENV_CONFIG.EMAIL_PROVIDER === 'smtp') {
            if (!ENV_CONFIG.SMTP_HOST || !ENV_CONFIG.SMTP_USER || !ENV_CONFIG.SMTP_PASS) {
                logger.warn("⚠️ SMTP Credentials missing! Email features will fail.");
            }
        }

        this.transporter = nodemailer.createTransport({
            host: ENV_CONFIG.SMTP_HOST || 'smtp.gmail.com',
            port: ENV_CONFIG.SMTP_PORT || 587,
            secure: ENV_CONFIG.SMTP_SECURE || false, // true for 465, false for other ports
            auth: {
                user: ENV_CONFIG.SMTP_USER,
                pass: ENV_CONFIG.SMTP_PASS,
            },
        });
    }

    async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: ENV_CONFIG.EMAIL_FROM,
                to,
                subject,
                html: htmlBody,
            });
            logger.info("Email sent successfully", { to, subject });
        } catch (error: unknown) {
            const err = error as Error;
            // Law 08: Fail-Safe & Telemetry
            logger.error("Failed to send email", {
                to,
                subject,
                error: err.message,
                stack: err.stack
            });

            // Re-throw as a user-friendly domain exception if needed, or swallow if critical flow shouldn't break
            throw new Error("EmailDeliveryException: Unable to send email at this time.");
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (_error) {
            return false;
        }
    }
}
