/**
 * Storage Types - أنواع التخزين
 *
 * @description أنواع TypeScript الخاصة بميزة التخزين
 * تجميع جميع الأنواع من Service و Domain
 */

// Re-export from Service
export type {
  StorageProvider,
  UserStorageConnection,
  StorageFile,
  StorageFolder,
} from '../api/storage-integration.service'

// Re-export from Domain
export type {
  ConnectionStatus as StorageConnectionStatus,
  StorageProviderType,
} from '@/domain/types/storage.types'

// Application-specific Types

/**
 * حالة تحميل التخزين
 */
export type StorageLoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * حالة الاتصال
 */
export type ConnectionStatus = 'PENDING' | 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR'

/**
 * نوع مقدم الخدمة
 */
export type ProviderType = 'google_drive' | 'onedrive'

/**
 * خيارات تحميل الملفات
 */
export interface LoadFilesOptions {
  connectionId: string
  folderId?: string
  fileType?: string
  page?: number
  perPage?: number
}

/**
 * خيارات تحميل المجلدات
 */
export interface LoadFoldersOptions {
  connectionId: string
  parentFolderId?: string
}

/**
 * خيارات رفع الملف
 */
export interface UploadFileOptions {
  connectionId: string
  file: File
  parentFolderId?: string
  onProgress?: (progress: number) => void
}

/**
 * خيارات إنشاء مجلد
 */
export interface CreateFolderOptions {
  connectionId: string
  folderName: string
  parentFolderId?: string
}

/**
 * خيارات تصدير إلى Office
 */
export interface ExportToOfficeOptions {
  connectionId: string
  fileId: string
  format: 'word' | 'excel' | 'powerpoint'
  outputFolderId?: string
}

/**
 * معلومات الملف
 */
export interface FileInfo {
  id: string
  name: string
  type: string
  mimeType?: string
  size?: number
  sizeFormatted?: string
  modifiedAt?: Date
  createdAt?: Date
  webViewLink?: string
  downloadLink?: string
  thumbnailLink?: string
}

/**
 * معلومات المجلد
 */
export interface FolderInfo {
  id: string
  name: string
  path?: string
  itemCount?: number
  webViewLink?: string
  createdAt?: Date
  modifiedAt?: Date
}

/**
 * إحصائيات التخزين
 */
export interface StorageStats {
  totalFiles: number
  totalFolders: number
  totalSize: number
  totalSizeFormatted: string
  byProvider: Record<ProviderType, number>
  byFileType: Record<string, number>
}

/**
 * خطأ التخزين
 */
export interface StorageError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

/**
 * نتيجة رفع الملف
 */
export interface UploadFileResult {
  success: boolean
  file?: import('../api/storage-integration.service').StorageFile
  error?: string
  progress?: number
}

/**
 * نتيجة تحميل الملف
 */
export interface DownloadFileResult {
  success: boolean
  blob?: Blob
  error?: string
  fileName?: string
}
