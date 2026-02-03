/**
 * Storage Types - أنواع التخزين
 *
 * هذا الملف يحتوي على جميع Types المتعلقة بالتخزين السحابي
 */

// ==================== أنواع التخزين الأساسية ====================

/** أنواع مزودي التخزين السحابي المدعومين */
export type StorageProviderType = 'google_drive' | 'onedrive'

/** حالة الاتصال بمزود التخزين */
export type ConnectionStatus =
  | 'PENDING' // في انتظار إكمال الاتصال
  | 'CONNECTED' // متصل بنجاح
  | 'DISCONNECTED' // تم قطع الاتصال يدوياً
  | 'EXPIRED' // انتهت صلاحية التوكن
  | 'ERROR' // حدث خطأ في الاتصال

/** صيغ تصدير الملفات المكتبية المدعومة */
export type OfficeExportFormat = 'word' | 'excel' | 'powerpoint'

// ==================== واجهات البيانات ====================

/** معلومات مزود التخزين السحابي */
export interface StorageProvider {
  id: string
  provider_type: StorageProviderType
  name: string // اسم النظام الداخلي (مثل: google-drive-basic)
  display_name: string // الاسم المعروض للمستخدم (مثل: Google Drive)
  description?: string // وصف اختياري للمزود
  is_active: boolean // هل المزود نشط في النظام
  is_enabled: boolean // هل المزود مفعّل للاستخدام
  icon_url?: string // رابط أيقونة المزود
  auth_url?: string // رابط توجيه المصادقة (OAuth)
}

/** اتصال المستخدم بمزود تخزين سحابي */
export interface UserStorageConnection {
  id: string
  user_id: string
  provider_id: string
  status: ConnectionStatus
  root_folder_id?: string // معرف المجلد الجذر في مزود التخزين
  created_at: string // تاريخ إنشاء الاتصال (ISO string)
  updated_at: string // تاريخ آخر تحديث (ISO string)
}

/** ملف في التخزين السحابي */
export interface StorageFile {
  id: string // المعرف الداخلي في قاعدة البيانات
  connection_id: string // ربط بالاتصال الخاص بالمستخدم
  provider_file_id: string // المعرف في مزود التخزين الخارجي
  name: string // اسم الملف
  file_type: string // امتداد الملف أو نوعه (مثل: pdf, jpg)
  mime_type?: string // نوع MIME الكامل
  size?: number // حجم الملف بالبايت
  parent_folder_id?: string // معرف المجلد الأب
  web_view_link?: string // رابط عرض الملف في المتصفح
  download_link?: string // رابط تحميل مباشر
  thumbnail_link?: string // رابط صورة مصغرة إن وجدت
  modified_at?: string // تاريخ آخر تعديل (ISO string)
  created_at?: string // تاريخ الإنشاء (ISO string)
}

/** مجلد في التخزين السحابي */
export interface StorageFolder {
  id: string // المعرف الداخلي
  connection_id: string // ربط بالاتصال الخاص بالمستخدم
  provider_folder_id: string // المعرف في مزود التخزين الخارجي
  name: string // اسم المجلد
  parent_folder_id?: string // معرف المجلد الأب (null للجذر)
  path?: string // المسار الكامل (مثل: /Documents/Work)
  web_view_link?: string // رابط عرض المجلد في المتصفح
  item_count?: number // عدد العناصر داخل المجلد
  created_at?: string // تاريخ الإنشاء
  modified_at?: string // تاريخ آخر تعديل
}
