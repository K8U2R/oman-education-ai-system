/**
 * Class Names Utility - أداة أسماء الفئات
 *
 * وظائف مساعدة لدمج أسماء الفئات (CSS Classes)
 */

/**
 * Combine class names
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Conditional class names
 */
export const conditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string => {
  return condition ? trueClass : falseClass || ''
}

/**
 * Variant class names
 */
export const variantClass = (base: string, variant: string, prefix: string = '--'): string => {
  return `${base}${prefix}${variant}`
}

/**
 * Size class names
 */
export const sizeClass = (base: string, size: string, prefix: string = '--'): string => {
  return `${base}${prefix}${size}`
}
