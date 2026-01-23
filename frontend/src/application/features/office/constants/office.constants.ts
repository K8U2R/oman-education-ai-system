/**
 * Office Constants - ثوابت Office
 *
 * @description ثوابت ميزة Office
 */

// Office-specific Configuration
export const OFFICE_CONFIG = {
  // Generation
  GENERATION: {
    TIMEOUT: 120 * 1000, // 120 ثانية
    MAX_RETRIES: 3,
    POLL_INTERVAL: 2000, // 2 ثانية
  } as const,

  // File Sizes
  FILE_SIZES: {
    MAX_EXCEL_SIZE: 50 * 1024 * 1024, // 50 MB
    MAX_WORD_SIZE: 20 * 1024 * 1024, // 20 MB
    MAX_POWERPOINT_SIZE: 100 * 1024 * 1024, // 100 MB
    MAX_PDF_SIZE: 50 * 1024 * 1024, // 50 MB
  } as const,

  // Templates
  TEMPLATES: {
    CACHE_TTL: 30 * 60 * 1000, // 30 دقيقة
    DEFAULT_TEMPLATE: 'default',
  } as const,

  // Cache
  CACHE: {
    TEMPLATES_TTL: 30 * 60 * 1000, // 30 دقيقة
    GENERATION_RESULT_TTL: 5 * 60 * 1000, // 5 دقائق
  } as const,

  // Error Messages
  ERROR_MESSAGES: {
    TEMPLATE_NOT_FOUND: 'القالب غير موجود',
    FAILED_TO_GENERATE: 'فشل توليد الملف',
    FAILED_TO_LOAD_TEMPLATES: 'فشل تحميل القوالب',
    INVALID_FILE_TYPE: 'نوع الملف غير مدعوم',
    GENERATION_TIMEOUT: 'انتهت مهلة توليد الملف',
    NETWORK_ERROR: 'خطأ في الاتصال. يرجى المحاولة مرة أخرى',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع',
  } as const,

  // Success Messages
  SUCCESS_MESSAGES: {
    FILE_GENERATED: 'تم توليد الملف بنجاح',
    TEMPLATES_LOADED: 'تم تحميل القوالب بنجاح',
  } as const,

  // Validation Rules
  VALIDATION: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    MAX_SLIDES: 100,
    MIN_SLIDES: 1,
  } as const,
} as const

// Office File Types
export const OFFICE_FILE_TYPES = {
  EXCEL: 'excel',
  WORD: 'word',
  POWERPOINT: 'powerpoint',
  PDF: 'pdf',
} as const

export type OfficeFileTypeValue = (typeof OFFICE_FILE_TYPES)[keyof typeof OFFICE_FILE_TYPES]

// Office Styles
export const OFFICE_STYLES = {
  SIMPLE: 'simple',
  PROFESSIONAL: 'professional',
  ACADEMIC: 'academic',
  BUSINESS: 'business',
} as const

export type OfficeStyleValue = (typeof OFFICE_STYLES)[keyof typeof OFFICE_STYLES]

// Office Languages
export const OFFICE_LANGUAGES = {
  ARABIC: 'ar',
  ENGLISH: 'en',
} as const

export type OfficeLanguageValue = (typeof OFFICE_LANGUAGES)[keyof typeof OFFICE_LANGUAGES]
