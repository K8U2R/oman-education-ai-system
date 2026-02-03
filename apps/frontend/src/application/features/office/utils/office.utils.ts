/**
 * Office Utils - دوال مساعدة لـ Office
 *
 * @description دوال مساعدة خاصة بميزة Office
 */

import type {
  OfficeFileType,
  OfficeStyle,
  OfficeLanguage,
  OfficeGenerationResponse,
} from '../types'
import { OFFICE_CONFIG, OFFICE_FILE_TYPES, OFFICE_STYLES, OFFICE_LANGUAGES } from '../constants'

/**
 * تنسيق اسم نوع الملف
 */
export function formatOfficeFileType(type: OfficeFileType): string {
  const typeMap: Record<OfficeFileType, string> = {
    excel: 'Excel',
    word: 'Word',
    powerpoint: 'PowerPoint',
    pdf: 'PDF',
  }
  return typeMap[type] || type
}

/**
 * تنسيق اسم النمط
 */
export function formatOfficeStyle(style: OfficeStyle): string {
  const styleMap: Record<OfficeStyle, string> = {
    simple: 'بسيط',
    professional: 'احترافي',
    academic: 'أكاديمي',
    business: 'تجاري',
  }
  return styleMap[style] || style
}

/**
 * تنسيق اسم اللغة
 */
export function formatOfficeLanguage(language: OfficeLanguage): string {
  const languageMap: Record<OfficeLanguage, string> = {
    ar: 'العربية',
    en: 'English',
  }
  return languageMap[language] || language
}

/**
 * الحصول على أيقونة نوع الملف
 */
export function getOfficeFileTypeIcon(type: OfficeFileType): string {
  const iconMap: Record<OfficeFileType, string> = {
    excel: 'table',
    word: 'file-text',
    powerpoint: 'presentation',
    pdf: 'file-pdf',
  }
  return iconMap[type] || 'file'
}

/**
 * الحصول على لون نوع الملف
 */
export function getOfficeFileTypeColor(type: OfficeFileType): string {
  const colorMap: Record<OfficeFileType, string> = {
    excel: '#22c55e', // green
    word: '#3b82f6', // blue
    powerpoint: '#f59e0b', // yellow
    pdf: '#ef4444', // red
  }
  return colorMap[type] || '#6b7280'
}

/**
 * تنسيق حجم الملف
 */
export function formatOfficeFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * التحقق من صحة نوع الملف
 */
export function isValidOfficeFileType(type: string): type is OfficeFileType {
  return Object.values(OFFICE_FILE_TYPES).includes(type as OfficeFileType)
}

/**
 * التحقق من صحة النمط
 */
export function isValidOfficeStyle(style: string): style is OfficeStyle {
  return Object.values(OFFICE_STYLES).includes(style as OfficeStyle)
}

/**
 * التحقق من صحة اللغة
 */
export function isValidOfficeLanguage(language: string): language is OfficeLanguage {
  return Object.values(OFFICE_LANGUAGES).includes(language as OfficeLanguage)
}

/**
 * التحقق من صحة عدد الشرائح
 */
export function validateSlidesCount(slides: number): {
  valid: boolean
  error?: string
} {
  if (slides < OFFICE_CONFIG.VALIDATION.MIN_SLIDES) {
    return {
      valid: false,
      error: `عدد الشرائح يجب أن يكون على الأقل ${OFFICE_CONFIG.VALIDATION.MIN_SLIDES}`,
    }
  }

  if (slides > OFFICE_CONFIG.VALIDATION.MAX_SLIDES) {
    return {
      valid: false,
      error: `عدد الشرائح يجب أن يكون أقل من ${OFFICE_CONFIG.VALIDATION.MAX_SLIDES}`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة العنوان
 */
export function validateOfficeTitle(title: string): {
  valid: boolean
  error?: string
} {
  if (title.length < OFFICE_CONFIG.VALIDATION.TITLE_MIN_LENGTH) {
    return {
      valid: false,
      error: `العنوان يجب أن يكون على الأقل ${OFFICE_CONFIG.VALIDATION.TITLE_MIN_LENGTH} حرف`,
    }
  }

  if (title.length > OFFICE_CONFIG.VALIDATION.TITLE_MAX_LENGTH) {
    return {
      valid: false,
      error: `العنوان يجب أن يكون أقل من ${OFFICE_CONFIG.VALIDATION.TITLE_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة الوصف
 */
export function validateOfficeDescription(description: string): {
  valid: boolean
  error?: string
} {
  if (description.length > OFFICE_CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH) {
    return {
      valid: false,
      error: `الوصف يجب أن يكون أقل من ${OFFICE_CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH} حرف`,
    }
  }

  return { valid: true }
}

/**
 * تنسيق رسالة الخطأ
 */
export function formatOfficeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return OFFICE_CONFIG.ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * الحصول على امتداد الملف
 */
export function getOfficeFileExtension(type: OfficeFileType): string {
  const extensionMap: Record<OfficeFileType, string> = {
    excel: 'xlsx',
    word: 'docx',
    powerpoint: 'pptx',
    pdf: 'pdf',
  }
  return extensionMap[type] || 'file'
}

/**
 * الحصول على MIME Type
 */
export function getOfficeFileMimeType(type: OfficeFileType): string {
  const mimeMap: Record<OfficeFileType, string> = {
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    powerpoint: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pdf: 'application/pdf',
  }
  return mimeMap[type] || 'application/octet-stream'
}

/**
 * تحميل الملف المولد
 */
export function downloadOfficeFile(response: OfficeGenerationResponse): void {
  const link = document.createElement('a')
  link.href = response.download_url
  link.download = response.file_name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * فتح معاينة الملف
 */
export function openOfficeFilePreview(response: OfficeGenerationResponse): void {
  if (response.preview_url) {
    window.open(response.preview_url, '_blank')
  }
}
