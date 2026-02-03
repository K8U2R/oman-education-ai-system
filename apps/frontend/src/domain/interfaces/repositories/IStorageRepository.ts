/**
 * IStorageRepository - واجهة مستودع التخزين
 *
 * Domain Interface لمستودع التخزين السحابي
 */

import {
  StorageProvider,
  UserStorageConnection,
  StorageFile,
  StorageFolder,
  OfficeExportFormat,
} from '../../types/storage.types'

export interface IStorageRepository {
  /**
   * الحصول على جميع مقدمي الخدمة
   */
  getProviders(): Promise<StorageProvider[]>

  /**
   * الحصول على مقدم خدمة محدد
   */
  getProvider(providerId: string): Promise<StorageProvider>

  /**
   * الحصول على اتصالات المستخدم
   */
  getUserConnections(): Promise<UserStorageConnection[]>

  /**
   * الاتصال بمقدم خدمة
   */
  connectProvider(providerId: string): Promise<{ auth_url: string }>

  /**
   * قطع الاتصال بمقدم خدمة
   */
  disconnectProvider(connectionId: string): Promise<void>

  /**
   * تحديث الاتصال
   */
  refreshConnection(connectionId: string): Promise<void>

  /**
   * قائمة الملفات
   */
  listFiles(connectionId: string, folderId?: string, fileType?: string): Promise<StorageFile[]>

  /**
   * قائمة المجلدات
   */
  listFolders(connectionId: string, parentFolderId?: string): Promise<StorageFolder[]>

  /**
   * رفع ملف
   */
  uploadFile(connectionId: string, file: File, parentFolderId?: string): Promise<StorageFile>

  /**
   * تحميل ملف
   */
  downloadFile(connectionId: string, fileId: string): Promise<Blob>

  /**
   * حذف ملف
   */
  deleteFile(connectionId: string, fileId: string): Promise<void>

  /**
   * إنشاء مجلد
   */
  createFolder(
    connectionId: string,
    folderName: string,
    parentFolderId?: string
  ): Promise<StorageFolder>

  /**
   * تصدير إلى Office
   */
  exportToOffice(
    connectionId: string,
    fileId: string,
    format: OfficeExportFormat,
    outputFolderId?: string
  ): Promise<{ file_id: string }>
}
