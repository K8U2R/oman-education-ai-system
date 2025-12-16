/**
 * أنواع البيانات لقسم كتابة النص ونظام العمل
 */

/**
 * خيارات حقل الإدخال
 */
export interface TextInputOptions {
  /** الحد الأقصى لعدد الأحرف */
  maxLength?: number;
  /** الحد الأدنى لعدد الأحرف */
  minLength?: number;
  /** الحد الأقصى لعدد الأسطر */
  maxLines?: number;
  /** الحد الأقصى للارتفاع بالبكسل */
  maxHeight?: number;
  /** الحد الأدنى للارتفاع بالبكسل */
  minHeight?: number;
  /** تفعيل الإكمال التلقائي */
  autoComplete?: boolean;
  /** تفعيل التصحيح التلقائي */
  autoCorrect?: boolean;
  /** تفعيل الكتابة بالأحرف الكبيرة */
  autoCapitalize?: boolean;
  /** تفعيل التدقيق الإملائي */
  spellCheck?: boolean;
}

/**
 * حالة حقل الإدخال
 */
export interface TextInputState {
  /** النص الحالي */
  value: string;
  /** عدد الأحرف */
  characterCount: number;
  /** عدد الكلمات */
  wordCount: number;
  /** عدد الأسطر */
  lineCount: number;
  /** هل الحقل في حالة focus */
  isFocused: boolean;
  /** هل الحقل في حالة تحميل */
  isLoading: boolean;
  /** هل هناك أخطاء */
  hasError: boolean;
  /** رسالة الخطأ */
  errorMessage?: string;
}

/**
 * إعدادات اختصارات لوحة المفاتيح
 */
export interface KeyboardShortcutsConfig {
  /** التركيز على حقل الإدخال */
  onFocusInput?: () => void;
  /** مسح المحادثة */
  onClearChat?: () => void;
  /** إغلاق النوافذ المنبثقة */
  onCloseModal?: () => void;
  /** إرسال الرسالة */
  onSendMessage?: () => void;
  /** فتح البحث */
  onSearch?: () => void;
}

/**
 * نتيجة التحقق من النص
 */
export interface TextValidationResult {
  /** هل النص صالح */
  valid: boolean;
  /** رسالة الخطأ */
  error?: string;
  /** النص المنظف */
  sanitized?: string;
  /** التحذيرات */
  warnings?: string[];
}

/**
 * خيارات تنسيق النص
 */
export interface TextFormatOptions {
  /** تنسيق Markdown */
  markdown?: boolean;
  /** تنسيق HTML */
  html?: boolean;
  /** تنسيق JSON */
  json?: boolean;
  /** تنسيق نص عادي */
  plain?: boolean;
}

