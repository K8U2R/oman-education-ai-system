import nodemailer from "nodemailer";
import {
  IEmailProvider,
  EmailOptions,
  EmailResult,
} from "@/domain/interfaces/email/IEmailProvider.js";
import { ENV_CONFIG } from "@/infrastructure/config/env.config.js";
import { logger } from "@/shared/utils/logger.js";

export class NodemailerAdapter implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    if (ENV_CONFIG.EMAIL_PROVIDER === "smtp") {
      if (
        !ENV_CONFIG.SMTP_HOST ||
        !ENV_CONFIG.SMTP_USER ||
        !ENV_CONFIG.SMTP_PASS
      ) {
        logger.warn("⚠️ SMTP Credentials missing! Email features will fail.");
      }
    }

    this.transporter = nodemailer.createTransport({
      host: ENV_CONFIG.SMTP_HOST || "smtp.gmail.com",
      port: ENV_CONFIG.SMTP_PORT || 587,
      secure: ENV_CONFIG.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: ENV_CONFIG.SMTP_USER,
        pass: ENV_CONFIG.SMTP_PASS,
      },
      tls: {
        // Required for port 587 (STARTTLS)
        ciphers: 'SSLv3',
        rejectUnauthorized: false, // Allow self-signed certificates in dev
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from || ENV_CONFIG.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text, // Fallback if provided
      });
      logger.info("Email sent successfully", {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
      });
      return { success: true, messageId: info.messageId };
    } catch (error: unknown) {
      const err = error as Error;
      // Law 08: Fail-Safe & Telemetry
      logger.error("Failed to send email", {
        to: options.to,
        subject: options.subject,
        error: err.message,
        stack: err.stack,
      });

      // Re-throw as a user-friendly domain exception if needed, or swallow if critical flow shouldn't break
      // throw new Error("EmailDeliveryException: Unable to send email at this time.");
      return { success: false, error: err.message };
    }
  }

  async validate(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (_error) {
      return false;
    }
  }

  async checkHealth(): Promise<boolean> {
    return this.validate();
  }
}
