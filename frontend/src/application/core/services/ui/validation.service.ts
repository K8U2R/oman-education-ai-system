/**
 * Validation Service - خدمة التحقق
 *
 * خدمة للتحقق من صحة البيانات
 */

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: unknown) => boolean | string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export class ValidationService {
  /**
   * التحقق من البريد الإلكتروني
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * التحقق من كلمة المرور
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    }

    if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على حرف كبير وصغير')
    }

    if (!/\d/.test(password)) {
      errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * التحقق من حقل واحد
   */
  static validateField(value: unknown, rules: ValidationRule, fieldName: string): string | null {
    // Required
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${fieldName} مطلوب`
    }

    if (!value && !rules.required) {
      return null // Optional field is empty, no error
    }

    // Min length
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `${fieldName} يجب أن يكون ${rules.minLength} أحرف على الأقل`
    }

    // Max length
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `${fieldName} يجب أن يكون ${rules.maxLength} أحرف على الأكثر`
    }

    // Pattern
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return `${fieldName} غير صحيح`
    }

    // Email
    if (rules.email && typeof value === 'string' && !this.validateEmail(value)) {
      return `${fieldName} غير صحيح`
    }

    // Custom validation
    if (rules.custom) {
      const result = rules.custom(value)
      if (result !== true) {
        return typeof result === 'string' ? result : `${fieldName} غير صحيح`
      }
    }

    return null
  }

  /**
   * التحقق من نموذج كامل
   */
  static validateForm(
    data: Record<string, unknown>,
    rules: Record<string, ValidationRule>
  ): ValidationResult {
    const errors: Record<string, string> = {}

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const error = this.validateField(data[fieldName], fieldRules, fieldName)
      if (error) {
        errors[fieldName] = error
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  /**
   * التحقق من رقم الهاتف
   */
  static validatePhone(phone: string): boolean {
    // Omani phone number format: +968 XXXX XXXX or 9XXX XXXX
    const phoneRegex = /^(\+968|968|0)?[79]\d{7}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  /**
   * التحقق من URL
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}
