/**
 * NodemailerAdapter - محول Nodemailer للبريد الإلكتروني
 *
 * Concrete implementation of IEmailProvider using Nodemailer
 * Supports SMTP, Gmail, and other transports
 *
 * Constitutional Authority: LAWS.md - Law-1 (Iron Firewall)
 * Layer: Infrastructure
 *
 * @example
 * ```typescript
 * const adapter = new NodemailerAdapter();
 * await adapter.sendEmail({
 *   to: 'user@example.com',
 *   from: 'noreply@oman-education.ai',
 *   subject: 'Welcome',
 *   html: '<h1>Hello</h1>'
 * });
 * ```
 */

import nodemailer, { Transporter } from "nodemailer";
import {
    IEmailProvider,
    EmailOptions,
    EmailResult,
} from "@/domain/interfaces/email/IEmailProvider";
import { logger } from "@/shared/common";

export interface NodemailerConfig {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    service?: string; // For Gmail, Outlook, etc.
}

export class NodemailerAdapter implements IEmailProvider {
    private transporter: Transporter;
    private config: NodemailerConfig;

    constructor(config?: NodemailerConfig) {
        // Load from environment or use provided config
        this.config = config || this.loadConfigFromEnv();

        // Create transporter
        this.transporter = nodemailer.createTransport(this.config as any);

        logger.info("NodemailerAdapter initialized", {
            host: this.config.host || this.config.service,
            secure: this.config.secure,
        });
    }

    /**
     * Load SMTP configuration from environment variables
     */
    private loadConfigFromEnv(): NodemailerConfig {
        const service = process.env.EMAIL_SERVICE; // e.g., 'gmail', 'outlook'

        if (service) {
            // Using a predefined service (Gmail, Outlook, etc.)
            return {
                service,
                auth: {
                    user: process.env.EMAIL_USER || "",
                    pass: process.env.EMAIL_PASSWORD || "",
                },
            };
        } else {
            // Using custom SMTP
            return {
                host: process.env.SMTP_HOST || "smtp.mailtrap.io",
                port: parseInt(process.env.SMTP_PORT || "2525"),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER || "",
                    pass: process.env.SMTP_PASSWORD || "",
                },
            };
        }
    }

    /**
     * Send email using Nodemailer
     *
     * @param options - Email options
     * @returns EmailResult with success status
     */
    async sendEmail(options: EmailOptions): Promise<EmailResult> {
        try {
            logger.info("Sending email via Nodemailer", {
                to: options.to,
                subject: options.subject,
            });

            const info = await this.transporter.sendMail({
                from: options.from,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            });

            logger.info("Email sent successfully via Nodemailer", {
                to: options.to,
                messageId: info.messageId,
            });

            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            logger.error("Failed to send email via Nodemailer", {
                to: options.to,
                error: errorMessage,
            });

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Validate SMTP connection
     *
     * @returns true if connection is valid
     */
    async validate(): Promise<boolean> {
        try {
            logger.info("Validating Nodemailer connection...");
            await this.transporter.verify();
            logger.info("Nodemailer connection validated successfully");
            return true;
        } catch (error) {
            logger.error("Nodemailer connection validation failed", { error });
            return false;
        }
    }

    /**
     * Close the transporter (cleanup)
     */
    async close(): Promise<void> {
        this.transporter.close();
        logger.info("Nodemailer transporter closed");
    }
}
