/**
 * Storage Types - أنواع التخزين السحابي
 *
 * أنواع موحدة للتخزين السحابي (Google Drive, OneDrive)
 */

import type { BaseEntity } from "../../shared/common.types.js";

/**
 * Storage Provider Type - نوع مزود التخزين
 */
export type StorageProviderType = "google_drive" | "onedrive";

/**
 * Storage Connection Status - حالة الاتصال
 */
export type StorageConnectionStatus =
  | "PENDING"
  | "CONNECTED"
  | "DISCONNECTED"
  | "EXPIRED"
  | "ERROR";

/**
 * Storage Provider - مزود التخزين
 */
export interface StorageProvider extends BaseEntity {
  id: string;
  provider_type: StorageProviderType;
  name: string;
  display_name: string;
  description?: string;
  is_active: boolean;
  is_enabled: boolean;
  icon_url?: string;
  auth_url?: string;
}

/**
 * User Storage Connection - اتصال المستخدم بالتخزين
 */
export interface UserStorageConnection extends BaseEntity {
  user_id: string;
  provider_id: string;
  status: StorageConnectionStatus;
  root_folder_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
}

/**
 * Storage File - ملف في التخزين السحابي
 *
 * بنية موحدة للملفات في التخزين السحابي
 * مع index signature للتوافق مع DatabaseAdapter
 */
export interface StorageFile extends Record<string, unknown> {
  id: string;
  connection_id: string;
  provider_file_id: string;
  name: string;
  file_type: string;
  mime_type?: string;
  size?: number;
  parent_folder_id?: string;
  web_view_link?: string;
  download_link?: string;
  thumbnail_link?: string;
  modified_at?: string;
  created_at?: string;
}

/**
 * Storage Folder - مجلد في التخزين السحابي
 *
 * بنية موحدة للمجلدات في التخزين السحابي
 * مع index signature للتوافق مع DatabaseAdapter
 */
export interface StorageFolder extends Record<string, unknown> {
  id: string;
  connection_id: string;
  provider_folder_id: string;
  name: string;
  parent_folder_id?: string;
  path?: string;
  web_view_link?: string;
  item_count?: number;
  created_at?: string;
  modified_at?: string;
}

/**
 * Office Export Format - تنسيق تصدير Office
 */
export type OfficeExportFormat = "docx" | "xlsx" | "pptx" | "pdf";
