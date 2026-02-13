/**
 * Report Types - أنواع التقارير
 *
 * أنواع موحدة لتوليد التقارير (PDF, Excel, CSV)
 */

import type { BaseEntity, Metadata } from "../../shared/common.types.js";

/**
 * Report Type - نوع التقرير
 */
export type ReportType = "pdf" | "excel" | "csv" | "json" | "html";

/**
 * Report Format - تنسيق التقرير
 */
export type ReportFormat =
  | "portrait"
  | "landscape"
  | "a4"
  | "letter"
  | "custom";

/**
 * Report Status - حالة التقرير
 */
export type ReportStatus =
  | "pending"
  | "generating"
  | "completed"
  | "failed"
  | "expired";

/**
 * Report - تقرير
 *
 * بنية موحدة للتقارير
 */
export interface Report extends BaseEntity {
  name: string;
  description?: string;
  type: ReportType;
  format?: ReportFormat;
  status: ReportStatus;
  templateId?: string;
  data: unknown;
  filters?: Record<string, unknown>;
  generatedBy: string;
  fileUrl?: string;
  fileSize?: number;
  expiresAt?: string;
  metadata?: Metadata;
}

/**
 * Report Template - قالب تقرير
 *
 * قالب قابل لإعادة الاستخدام
 */
export interface ReportTemplate extends BaseEntity {
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  template: string; // HTML template أو JSON structure
  variables: string[]; // قائمة المتغيرات
  category?: string;
  isActive: boolean;
  metadata?: Metadata;
}

/**
 * Report Generation Request - طلب توليد تقرير
 */
export interface ReportGenerationRequest {
  name: string;
  type: ReportType;
  templateId?: string;
  data: unknown;
  filters?: Record<string, unknown>;
  format?: ReportFormat;
  options?: {
    includeCharts?: boolean;
    includeImages?: boolean;
    includeTables?: boolean;
    language?: "ar" | "en";
    timezone?: string;
    dateFormat?: string;
  };
}

/**
 * PDF Report Options - خيارات تقرير PDF
 */
export interface PDFReportOptions {
  format: "a4" | "letter" | "legal" | "custom";
  orientation: "portrait" | "landscape";
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header?: {
    enabled: boolean;
    content?: string;
    height?: number;
  };
  footer?: {
    enabled: boolean;
    content?: string;
    height?: number;
  };
  pageNumbers?: boolean;
  watermark?: {
    text?: string;
    image?: string;
    opacity?: number;
  };
  compression?: boolean;
  quality?: number;
}

/**
 * Excel Report Options - خيارات تقرير Excel
 */
export interface ExcelReportOptions {
  sheets?: Array<{
    name: string;
    data: unknown[][];
    headers?: string[];
  }>;
  includeFormulas?: boolean;
  includeCharts?: boolean;
  includeFormatting?: boolean;
  freezeFirstRow?: boolean;
  autoFilter?: boolean;
}

/**
 * CSV Report Options - خيارات تقرير CSV
 */
export interface CSVReportOptions {
  delimiter?: string;
  encoding?: "utf-8" | "utf-8-bom" | "windows-1256";
  includeHeaders?: boolean;
  quoteFields?: boolean;
}

/**
 * Report Statistics - إحصائيات التقارير
 */
export interface ReportStatistics {
  total: number;
  byType: Record<ReportType, number>;
  byStatus: Record<ReportStatus, number>;
  totalSize: number; // bytes
  averageGenerationTime: number; // milliseconds
  successRate: number; // percentage
}

/**
 * Scheduled Report - تقرير مجدول
 *
 * تقرير يتم توليده تلقائياً في أوقات محددة
 */
export interface ScheduledReport extends BaseEntity {
  name: string;
  reportType: ReportType;
  templateId?: string;
  schedule: {
    type: "daily" | "weekly" | "monthly" | "custom";
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    timezone?: string;
  };
  recipients: string[]; // email addresses
  enabled: boolean;
  lastGeneratedAt?: string;
  nextGenerationAt: string;
  generationCount: number;
  metadata?: Metadata;
}

/**
 * Report Export Options - خيارات تصدير التقرير
 */
export interface ReportExportOptions {
  format: ReportType;
  filename?: string;
  download?: boolean;
  email?: {
    to: string[];
    subject?: string;
    body?: string;
  };
  storage?: {
    provider: string;
    path?: string;
    public?: boolean;
  };
}

/**
 * Report Service Interface - واجهة خدمة التقارير
 */
export interface IReportService {
  generate(request: ReportGenerationRequest): Promise<Report>;
  getReport(reportId: string): Promise<Report | null>;
  getReports(filters?: Record<string, unknown>): Promise<Report[]>;
  deleteReport(reportId: string): Promise<boolean>;
  getTemplate(templateId: string): Promise<ReportTemplate | null>;
  createTemplate(
    template: Omit<ReportTemplate, "id" | "created_at" | "updated_at">,
  ): Promise<ReportTemplate>;
  updateTemplate(
    templateId: string,
    updates: Partial<ReportTemplate>,
  ): Promise<ReportTemplate>;
  deleteTemplate(templateId: string): Promise<boolean>;
  schedule(
    scheduledReport: Omit<ScheduledReport, "id" | "created_at" | "updated_at">,
  ): Promise<ScheduledReport>;
  getStatistics(): Promise<ReportStatistics>;
}
