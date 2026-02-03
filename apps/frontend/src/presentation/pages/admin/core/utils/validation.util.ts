/**
 * Validation Utility - أدوات التحقق
 *
 * دوال مساعدة للتحقق من صحة البيانات
 */

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * التحقق من صحة الإدخال (عام)
 */
export function validateAdminInput(input: unknown): boolean {
  if (input === null || input === undefined) return false
  if (typeof input === 'string' && input.trim() === '') return false
  if (typeof input === 'number' && isNaN(input)) return false
  return true
}

/**
 * التحقق من صحة الصلاحية
 */
export function validatePermission(permission: string): boolean {
  // سيتم استيرادها من permissions.util.ts
  return typeof permission === 'string' && permission.length > 0
}

/**
 * التحقق من صحة الدور
 */
export function validateRole(role: string): boolean {
  const validRoles = ['student', 'teacher', 'admin', 'parent', 'moderator', 'developer']
  return validRoles.includes(role)
}
