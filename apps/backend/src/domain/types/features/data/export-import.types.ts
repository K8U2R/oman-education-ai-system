/**
 * Export/Import Types - أنواع التصدير والاستيراد
 *
 * أنواع موحدة لعمليات التصدير والاستيراد
 */

import type { BaseEntity, Metadata } from "../../shared/common.types.js";

/**
 * Export Format - تنسيق التصدير
 */
export type ExportFormat = "json" | "csv" | "excel" | "xml" | "pdf" | "zip";

/**
 * Import Format - تنسيق الاستيراد
 */
export type ImportFormat = "json" | "csv" | "excel" | "xml";

/**
 * Export Status - حالة التصدير
 */
export type ExportStatus = "pending" | "processing" | "completed" | "failed";

/**
 * Import Status - حالة الاستيراد
 */
export type ImportStatus =
  | "pending"
  | "validating"
  | "processing"
  | "completed"
  | "failed"
  | "partially_completed";

/**
 * Export - تصدير
 *
 * بنية موحدة للتصدير
 */
export interface Export extends BaseEntity {
  name: string;
  format: ExportFormat;
  status: ExportStatus;
  entityType: string; // نوع الكيان (users, lessons, etc.)
  filters?: Record<string, unknown>;
  fields?: string[]; // الحقول المطلوبة
  options?: ExportOptions;
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  exportedBy: string;
  expiresAt?: string;
  metadata?: Metadata;
}

/**
 * Import - استيراد
 *
 * بنية موحدة للاستيراد
 */
export interface Import extends BaseEntity {
  name: string;
  format: ImportFormat;
  status: ImportStatus;
  entityType: string;
  fileUrl: string;
  fileSize: number;
  options?: ImportOptions;
  totalRecords?: number;
  processedRecords?: number;
  successfulRecords?: number;
  failedRecords?: number;
  errors?: ImportError[];
  importedBy: string;
  metadata?: Metadata;
}

/**
 * Export Options - خيارات التصدير
 */
export interface ExportOptions {
  includeHeaders?: boolean;
  encoding?: "utf-8" | "utf-8-bom" | "windows-1256";
  delimiter?: string; // للـ CSV
  dateFormat?: string;
  timezone?: string;
  compress?: boolean;
  password?: string; // للـ PDF/ZIP
  includeMetadata?: boolean;
}

/**
 * Import Options - خيارات الاستيراد
 */
export interface ImportOptions {
  skipHeader?: boolean;
  encoding?: "utf-8" | "utf-8-bom" | "windows-1256";
  delimiter?: string; // للـ CSV
  dateFormat?: string;
  timezone?: string;
  validateOnly?: boolean;
  dryRun?: boolean;
  batchSize?: number;
  onError?: "stop" | "continue" | "skip";
  mapping?: Record<string, string>; // mapping between file columns and entity fields
}

/**
 * Import Error - خطأ الاستيراد
 */
export interface ImportError {
  row: number;
  field?: string;
  value?: unknown;
  message: string;
  code?: string;
}

/**
 * Export Template - قالب تصدير
 *
 * قالب قابل لإعادة الاستخدام
 */
export interface ExportTemplate extends BaseEntity {
  name: string;
  entityType: string;
  format: ExportFormat;
  fields: string[];
  filters?: Record<string, unknown>;
  options?: ExportOptions;
  isActive: boolean;
  createdBy: string;
  metadata?: Metadata;
}

/**
 * Import Mapping - تعيين الاستيراد
 *
 * تعيين بين أعمدة الملف وحقول الكيان
 */
export interface ImportMapping {
  fileColumn: string;
  entityField: string;
  required?: boolean;
  transform?: (value: unknown) => unknown;
  validation?: {
    type?: "string" | "number" | "boolean" | "date" | "email";
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

/**
 * Export/Import Statistics - إحصائيات التصدير/الاستيراد
 */
export interface ExportImportStatistics {
  exports: {
    total: number;
    byFormat: Record<ExportFormat, number>;
    byStatus: Record<ExportStatus, number>;
    totalSize: number;
  };
  imports: {
    total: number;
    byFormat: Record<ImportFormat, number>;
    byStatus: Record<ImportStatus, number>;
    totalRecords: number;
    successRate: number;
  };
}

/**
 * Export/Import Service Interface - واجهة خدمة التصدير/الاستيراد
 */
export interface IExportImportService {
  // Export
  export(
    request: Omit<
      Export,
      "id" | "created_at" | "updated_at" | "status" | "fileUrl" | "fileSize"
    >,
  ): Promise<Export>;
  getExport(exportId: string): Promise<Export | null>;
  getExports(filters?: Record<string, unknown>): Promise<Export[]>;
  deleteExport(exportId: string): Promise<boolean>;

  // Import
  import(
    request: Omit<
      Import,
      | "id"
      | "created_at"
      | "updated_at"
      | "status"
      | "processedRecords"
      | "successfulRecords"
      | "failedRecords"
      | "errors"
    >,
  ): Promise<Import>;
  getImport(importId: string): Promise<Import | null>;
  getImports(filters?: Record<string, unknown>): Promise<Import[]>;
  deleteImport(importId: string): Promise<boolean>;

  // Templates
  createExportTemplate(
    template: Omit<ExportTemplate, "id" | "created_at" | "updated_at">,
  ): Promise<ExportTemplate>;
  getExportTemplate(templateId: string): Promise<ExportTemplate | null>;
  getExportTemplates(entityType?: string): Promise<ExportTemplate[]>;
  deleteExportTemplate(templateId: string): Promise<boolean>;

  // Statistics
  getStatistics(): Promise<ExportImportStatistics>;
}
