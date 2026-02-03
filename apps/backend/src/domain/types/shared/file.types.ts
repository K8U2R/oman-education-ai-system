/**
 * File Types - أنواع الملفات
 *
 * أنواع موحدة لعمليات الملفات
 */

import type { BaseEntity, Metadata } from "./common.types";

/**
 * File Type - نوع الملف
 */
export type FileType =
  | "image"
  | "document"
  | "video"
  | "audio"
  | "archive"
  | "code"
  | "other";

/**
 * File Status - حالة الملف
 */
export type FileStatus =
  | "uploading"
  | "uploaded"
  | "processing"
  | "ready"
  | "error"
  | "deleted";

/**
 * File - ملف
 *
 * بنية موحدة للملفات
 */
export interface File extends BaseEntity {
  name: string;
  originalName: string;
  path: string;
  url: string;
  mimeType: string;
  size: number;
  type: FileType;
  status: FileStatus;
  uploadedBy: string;
  storageProvider: string;
  checksum?: string;
  metadata?: Metadata;
  tags?: string[];
  folderId?: string;
}

/**
 * File Upload Options - خيارات رفع الملف
 */
export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  folderId?: string;
  tags?: string[];
  metadata?: Metadata;
  generateThumbnail?: boolean;
  resize?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  encrypt?: boolean;
  compress?: boolean;
}

/**
 * File Download Options - خيارات تنزيل الملف
 */
export interface FileDownloadOptions {
  asAttachment?: boolean;
  filename?: string;
  expiresIn?: number; // seconds
  range?: {
    start: number;
    end: number;
  };
}

/**
 * File Search Options - خيارات البحث عن الملفات
 */
export interface FileSearchOptions {
  query?: string;
  type?: FileType | FileType[];
  mimeType?: string | string[];
  tags?: string[];
  uploadedBy?: string;
  folderId?: string;
  startDate?: string;
  endDate?: string;
  minSize?: number;
  maxSize?: number;
  sortBy?: "name" | "size" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

/**
 * File Operation - عملية ملف
 */
export type FileOperation =
  | "upload"
  | "download"
  | "delete"
  | "move"
  | "copy"
  | "rename"
  | "share";

/**
 * File Share - مشاركة ملف
 */
export interface FileShare {
  id: string;
  fileId: string;
  sharedWith: string; // userId or email
  permission: "read" | "write" | "admin";
  expiresAt?: string;
  password?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * File Version - إصدار ملف
 */
export interface FileVersion extends BaseEntity {
  fileId: string;
  version: number;
  path: string;
  url: string;
  size: number;
  checksum: string;
  createdBy: string;
  changeLog?: string;
}

/**
 * File Thumbnail - صورة مصغرة للملف
 */
export interface FileThumbnail {
  fileId: string;
  url: string;
  width: number;
  height: number;
  size: number;
  format: "jpg" | "png" | "webp";
}

/**
 * File Metadata - بيانات وصفية للملف
 */
export interface FileMetadata extends Metadata {
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  codec?: string;
  author?: string;
  title?: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  camera?: {
    make?: string;
    model?: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
  };
}

/**
 * File Storage Provider - مزود تخزين الملفات
 */
export type FileStorageProvider =
  | "local"
  | "s3"
  | "gcs"
  | "azure"
  | "cloudinary"
  | "custom";

/**
 * File Storage Configuration - إعدادات تخزين الملفات
 */
export interface FileStorageConfiguration {
  provider: FileStorageProvider;
  bucket?: string;
  region?: string;
  accessKey?: string;
  secretKey?: string;
  endpoint?: string;
  cdnUrl?: string;
  publicUrl?: string;
}

/**
 * File Processing Result - نتيجة معالجة الملف
 */
export interface FileProcessingResult {
  success: boolean;
  fileId: string;
  operations: Array<{
    operation: string;
    success: boolean;
    result?: unknown;
    error?: string;
  }>;
  metadata?: FileMetadata;
  thumbnails?: FileThumbnail[];
}

/**
 * File Batch Operation - عملية ملفات مجمعة
 */
export interface FileBatchOperation {
  id: string;
  operation: FileOperation;
  files: string[]; // file IDs
  options?: FileUploadOptions | FileDownloadOptions;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  results?: Array<{
    fileId: string;
    success: boolean;
    error?: string;
  }>;
  createdAt: string;
  completedAt?: string;
}
