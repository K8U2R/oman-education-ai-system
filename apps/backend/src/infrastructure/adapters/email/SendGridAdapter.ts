/**
 * SendGrid Email Adapter
 * 
 * Production-ready email sending using SendGrid API
 */

import sendgrid from "@sendgrid/mail";
import {
  IEmailProvider,
  EmailOptions,
  EmailResult,
} from "../../../domain/interfaces/email/IEmailProvider.js";
import { ENV_CONFIG } from "../../config/env.config.js";
import { logger } from "../../../shared/utils/logger.js";

export class SendGridAdapter implements IEmailProvider {
  constructor() {
    if (!ENV_CONFIG.SENDGRID_API_KEY) {
      logger.warn("⚠️ SENDGRID_API_KEY not configured! Email features will fail.");
      return;
    }

    sendgrid.setApiKey(ENV_CONFIG.SENDGRID_API_KEY);
    logger.info("✅ SendGrid adapter initialized");
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    if (!ENV_CONFIG.SENDGRID_API_KEY) {
      logger.error("SendGrid API key not configured");
      return {
        success: false,
        error: "SendGrid API key not configured",
      };
    }

    try {
      const msg = {
        to: options.to,
        from: options.from || ENV_CONFIG.EMAIL_FROM,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const [response] = await sendgrid.send(msg);

      logger.info("✅ Email sent via SendGrid", {
        to: options.to,
        subject: options.subject,
        statusCode: response.statusCode,
        messageId: response.headers['x-message-id'],
      });

      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
      };
    } catch (error: any) {
      logger.error("❌ SendGrid email failed", {
        to: options.to,
        subject: options.subject,
        error: error.message,
        response: error.response?.body,
      });

      return {
        success: false,
        error: error.message || "Failed to send email via SendGrid",
      };
    }
  }

  async validate(): Promise<boolean> {
    if (!ENV_CONFIG.SENDGRID_API_KEY) {
      return false;
    }

    try {
      // SendGrid doesn't have a specific validation endpoint
      // We'll just check if the API key is set
      return true;
    } catch (error) {
      logger.error("SendGrid validation failed", { error });
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
