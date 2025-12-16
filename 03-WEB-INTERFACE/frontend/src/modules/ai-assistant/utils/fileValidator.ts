/**
 * ثوابت التحقق من الملفات
 */
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

/**
 * واجهة نتيجة التحقق
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * التحقق من حجم الملف
 */
export function validateFileSize(file: File, maxSize: number = FILE_CONSTANTS.MAX_FILE_SIZE): ValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `حجم الملف كبير جداً. الحد الأقصى: ${maxSizeMB}MB`,
    };
  }
  return { valid: true };
}

/**
 * التحقق من نوع الملف
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = FILE_CONSTANTS.ALLOWED_IMAGE_TYPES
): ValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `نوع الملف غير مدعوم. الأنواع المدعومة: ${allowedTypes.join(', ')}`,
    };
  }
  return { valid: true };
}

/**
 * التحقق من إجمالي حجم الملفات
 */
export function validateTotalSize(
  files: File[],
  maxTotalSize: number = FILE_CONSTANTS.MAX_TOTAL_SIZE
): ValidationResult {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    const maxSizeMB = (maxTotalSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `إجمالي حجم الملفات كبير جداً. الحد الأقصى: ${maxSizeMB}MB`,
    };
  }
  return { valid: true };
}

/**
 * التحقق الشامل من الملف
 */
export function validateFile(
  file: File,
  options?: {
    maxSize?: number;
    allowedTypes?: string[];
  }
): ValidationResult {
  const maxSize = options?.maxSize || FILE_CONSTANTS.MAX_FILE_SIZE;
  const allowedTypes = options?.allowedTypes || FILE_CONSTANTS.ALLOWED_IMAGE_TYPES;

  // التحقق من الحجم
  const sizeCheck = validateFileSize(file, maxSize);
  if (!sizeCheck.valid) {
    return sizeCheck;
  }

  // التحقق من النوع
  const typeCheck = validateFileType(file, allowedTypes);
  if (!typeCheck.valid) {
    return typeCheck;
  }

  return { valid: true };
}

/**
 * التحقق من عدة ملفات
 */
export function validateFiles(
  files: File[],
  options?: {
    maxSize?: number;
    maxTotalSize?: number;
    allowedTypes?: string[];
  }
): ValidationResult {
  const maxTotalSize = options?.maxTotalSize || FILE_CONSTANTS.MAX_TOTAL_SIZE;

  // التحقق من إجمالي الحجم
  const totalSizeCheck = validateTotalSize(files, maxTotalSize);
  if (!totalSizeCheck.valid) {
    return totalSizeCheck;
  }

  // التحقق من كل ملف
  for (const file of files) {
    const fileCheck = validateFile(file, {
      maxSize: options?.maxSize,
      allowedTypes: options?.allowedTypes,
    });
    if (!fileCheck.valid) {
      return fileCheck;
    }
  }

  return { valid: true };
}

