/**
 * Class Names Utility - أداة أسماء الفئات
 *
 * وظائف مساعدة لدمج أسماء الفئات (CSS Classes)
 */

/**
 * Combine class names
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[]

export const cn = (...classes: ClassValue[]): string => {
  const result: string[] = []

  const process = (val: ClassValue) => {
    if (!val) return

    if (typeof val === 'string' || typeof val === 'number') {
      result.push(String(val))
    } else if (Array.isArray(val)) {
      val.forEach(process)
    } else if (typeof val === 'object') {
      Object.entries(val).forEach(([key, value]) => {
        if (value) result.push(key)
      })
    }
  }

  classes.forEach(process)
  return result.join(' ')
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
