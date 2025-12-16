/**
 * Validation Functions
 */

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file name
 */
export function isValidFileName(filename: string): boolean {
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(filename) && filename.length > 0 && filename.length <= 255;
}

/**
 * Validate project name
 */
export function isValidProjectName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'اسم المشروع مطلوب' };
  }
  if (name.length < 3) {
    return { valid: false, error: 'اسم المشروع يجب أن يكون 3 أحرف على الأقل' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'اسم المشروع يجب أن يكون أقل من 50 حرف' };
  }
  if (!/^[a-zA-Z0-9\u0600-\u06FF\s_-]+$/.test(name)) {
    return { valid: false, error: 'اسم المشروع يحتوي على أحرف غير مسموحة' };
  }
  return { valid: true };
}

/**
 * Sanitize input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

