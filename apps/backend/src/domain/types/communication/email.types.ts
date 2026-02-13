/**
 * Email Types - أنواع البريد الإلكتروني
 *
 * أنواع موحدة لإرسال البريد الإلكتروني والقوالب
 */

import type { BaseEntity, Metadata } from "../shared/common.types.js";

/**
 * Email Priority - أولوية البريد
 */
export type EmailPriority = "low" | "normal" | "high";

/**
 * Email Status - حالة البريد
 */
export type EmailStatus =
  | "pending"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced";

/**
 * EmailData - بيانات البريد الإلكتروني
 *
 * بنية موحدة لبيانات البريد الإلكتروني
 * (يختلف عن Email Value Object في value-objects)
 */
export interface EmailData extends BaseEntity {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  attachments?: EmailAttachment[];
  priority: EmailPriority;
  status: EmailStatus;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  error?: string;
  metadata?: Metadata;
  userId?: string;
  campaignId?: string;
}

/**
 * Email Attachment - مرفق بريد إلكتروني
 */
export interface EmailAttachment {
  filename: string;
  content: string | Uint8Array; // استخدام Uint8Array بدلاً من Buffer للتوافق
  contentType?: string;
  contentId?: string;
  disposition?: "attachment" | "inline";
}

/**
 * Email Template - قالب بريد إلكتروني
 *
 * قالب قابل لإعادة الاستخدام
 */
export interface EmailTemplate extends BaseEntity {
  name: string;
  subject: string;
  html: string;
  text?: string;
  description?: string;
  category?: string;
  variables: string[]; // قائمة المتغيرات المستخدمة في القالب
  isActive: boolean;
  language?: string;
  metadata?: Metadata;
}

/**
 * Email Template Variable - متغير قالب البريد
 */
export interface EmailTemplateVariable {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  required: boolean;
  description?: string;
  defaultValue?: unknown;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

/**
 * Email Campaign - حملة بريد إلكتروني
 */
export interface EmailCampaign extends BaseEntity {
  name: string;
  description?: string;
  templateId: string;
  recipients:
    | string[]
    | {
        type: "all" | "segment" | "list";
        value: string | string[];
      };
  status: "draft" | "scheduled" | "sending" | "sent" | "paused" | "cancelled";
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  metadata?: Metadata;
}

/**
 * Email Provider - مزود البريد الإلكتروني
 */
export type EmailProvider =
  | "smtp"
  | "sendgrid"
  | "ses"
  | "mailgun"
  | "postmark"
  | "resend"
  | "custom";

/**
 * Email Configuration - إعدادات البريد الإلكتروني
 */
export interface EmailConfiguration {
  provider: EmailProvider;
  from: string;
  replyTo?: string;
  apiKey?: string;
  apiSecret?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  username?: string;
  password?: string;
  region?: string;
  rateLimit?: {
    max: number;
    window: number; // seconds
  };
}

/**
 * Email Statistics - إحصائيات البريد الإلكتروني
 */
export interface EmailStatistics {
  total: number;
  byStatus: Record<EmailStatus, number>;
  byPriority: Record<EmailPriority, number>;
  sentToday: number;
  sentThisWeek: number;
  sentThisMonth: number;
  averageDeliveryTime: number; // milliseconds
  openRate: number; // percentage
  clickRate: number; // percentage
  bounceRate: number; // percentage
  failureRate: number; // percentage
}

/**
 * Email Webhook Event - حدث Webhook للبريد
 */
export interface EmailWebhookEvent {
  event:
    | "sent"
    | "delivered"
    | "opened"
    | "clicked"
    | "bounced"
    | "complained"
    | "unsubscribed";
  emailId: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

/**
 * Email Queue - قائمة انتظار البريد
 */
export interface EmailQueue {
  id: string;
  emails: EmailData[];
  processing: boolean;
  maxConcurrency: number;
  createdAt: string;
}

/**
 * Email Service Interface - واجهة خدمة البريد
 */
export interface IEmailService {
  send(
    email: Omit<EmailData, "id" | "created_at" | "updated_at" | "status">,
  ): Promise<EmailData>;
  sendTemplate(
    templateId: string,
    to: string | string[],
    data: Record<string, unknown>,
    options?: Partial<EmailData>,
  ): Promise<EmailData>;
  getTemplate(templateId: string): Promise<EmailTemplate | null>;
  createTemplate(
    template: Omit<EmailTemplate, "id" | "created_at" | "updated_at">,
  ): Promise<EmailTemplate>;
  updateTemplate(
    templateId: string,
    updates: Partial<EmailTemplate>,
  ): Promise<EmailTemplate>;
  deleteTemplate(templateId: string): Promise<boolean>;
  getEmail(emailId: string): Promise<EmailData | null>;
  getStatistics(): Promise<EmailStatistics>;
}
