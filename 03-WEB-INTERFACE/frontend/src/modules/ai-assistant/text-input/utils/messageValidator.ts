import { TextValidationResult } from '../types/text-input.types';

/**
 * ثوابت التحقق من الرسائل
 */
export const MESSAGE_CONSTANTS = {
  MAX_LENGTH: 10000, // 10K characters
  MIN_LENGTH: 1,
  MAX_LINES: 500,
  MAX_WORDS: 2000,
};

/**
 * تنظيف الرسالة من XSS والكود الضار
 */
export function sanitizeMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return '';
  }

  // إنشاء عنصر DOM مؤقت لتنظيف HTML
  const div = document.createElement('div');
  div.textContent = message;
  let sanitized = div.textContent || '';

  // إزالة الأحرف الخطيرة
  sanitized = sanitized
    .replace(/[<>]/g, '') // إزالة < و >
    .replace(/javascript:/gi, '') // إزالة javascript:
    .replace(/on\w+=/gi, '') // إزالة event handlers
    .trim();

  return sanitized;
}

/**
 * التحقق من طول الرسالة
 */
export function validateMessageLength(message: string): TextValidationResult {
  if (message.length < MESSAGE_CONSTANTS.MIN_LENGTH) {
    return {
      valid: false,
      error: 'الرسالة فارغة. يرجى إدخال نص',
    };
  }

  if (message.length > MESSAGE_CONSTANTS.MAX_LENGTH) {
    return {
      valid: false,
      error: `الرسالة طويلة جداً. الحد الأقصى: ${MESSAGE_CONSTANTS.MAX_LENGTH.toLocaleString()} حرف (الحالي: ${message.length.toLocaleString()})`,
    };
  }

  const lines = message.split('\n').length;
  if (lines > MESSAGE_CONSTANTS.MAX_LINES) {
    return {
      valid: false,
      error: `عدد الأسطر كبير جداً. الحد الأقصى: ${MESSAGE_CONSTANTS.MAX_LINES} سطر (الحالي: ${lines})`,
    };
  }

  const words = message.split(/\s+/).filter(word => word.length > 0).length;
  if (words > MESSAGE_CONSTANTS.MAX_WORDS) {
    return {
      valid: false,
      error: `عدد الكلمات كبير جداً. الحد الأقصى: ${MESSAGE_CONSTANTS.MAX_WORDS} كلمة (الحالي: ${words})`,
    };
  }

  // تحذيرات (لا تمنع الإرسال)
  const warnings: string[] = [];
  if (message.length > MESSAGE_CONSTANTS.MAX_LENGTH * 0.8) {
    warnings.push('الرسالة قريبة من الحد الأقصى');
  }
  if (lines > MESSAGE_CONSTANTS.MAX_LINES * 0.8) {
    warnings.push('عدد الأسطر قريب من الحد الأقصى');
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * التحقق من محتوى الرسالة (Spam detection)
 */
export function validateMessageContent(message: string): TextValidationResult {
  const sanitized = sanitizeMessage(message);

  // التحقق من الرسائل المكررة
  const words = sanitized.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;

  if (repetitionRatio < 0.3 && words.length > 10) {
    return {
      valid: false,
      error: 'الرسالة تحتوي على تكرار مفرط',
    };
  }

  // التحقق من الروابط المشبوهة
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const urls = message.match(urlPattern);
  if (urls && urls.length > 5) {
    return {
      valid: false,
      error: 'الرسالة تحتوي على عدد كبير من الروابط',
    };
  }

  // التحقق من الأحرف الخاصة المفرطة
  const specialChars = message.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g);
  if (specialChars && specialChars.length > message.length * 0.5) {
    return {
      valid: false,
      error: 'الرسالة تحتوي على عدد كبير من الأحرف الخاصة',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * التحقق الشامل من الرسالة
 */
export function validateMessage(message: string): TextValidationResult {
  // التحقق من وجود الرسالة
  if (!message || typeof message !== 'string') {
    return {
      valid: false,
      error: 'الرسالة غير صالحة',
    };
  }

  // تنظيف الرسالة
  const sanitized = sanitizeMessage(message);

  // التحقق من الطول
  const lengthCheck = validateMessageLength(sanitized);
  if (!lengthCheck.valid) {
    return lengthCheck;
  }

  // التحقق من المحتوى
  const contentCheck = validateMessageContent(sanitized);
  if (!contentCheck.valid) {
    return contentCheck;
  }

  // دمج التحذيرات
  const warnings = [
    ...(lengthCheck.warnings || []),
    ...(contentCheck.warnings || []),
  ];

  return {
    valid: true,
    sanitized,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * التحقق من رسالة قبل الإرسال (مع معالجة التحذيرات)
 */
export function validateMessageForSend(message: string): {
  canSend: boolean;
  error?: string;
  sanitized?: string;
  warnings?: string[];
} {
  const validation = validateMessage(message);

  if (!validation.valid) {
    return {
      canSend: false,
      error: validation.error,
    };
  }

  return {
    canSend: true,
    sanitized: validation.sanitized,
    warnings: validation.warnings,
  };
}

/**
 * التحقق من رسالة قبل التعديل
 */
export function validateMessageForEdit(
  originalMessage: string,
  editedMessage: string
): TextValidationResult {
  // التحقق من الرسالة المعدلة
  const editValidation = validateMessage(editedMessage);
  if (!editValidation.valid) {
    return editValidation;
  }

  // التحقق من أن الرسالة المعدلة مختلفة عن الأصلية
  if (editValidation.sanitized === sanitizeMessage(originalMessage)) {
    return {
      valid: false,
      error: 'الرسالة المعدلة مطابقة للرسالة الأصلية',
    };
  }

  return editValidation;
}

