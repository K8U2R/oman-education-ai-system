/**
 * Validators Utility - دوال التحقق من البيانات
 *
 * دوال مساعدة للتحقق من صحة البيانات
 */

/**
 * التحقق من صحة SQL Query
 */
export function isValidSQLQuery(query: string): {
  valid: boolean
  error?: string
} {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'الاستعلام فارغ' }
  }

  // التحقق من وجود كلمات محظورة (لأسباب أمنية)
  const forbiddenKeywords = ['DROP DATABASE', 'DROP SCHEMA', 'TRUNCATE DATABASE']
  const upperQuery = query.toUpperCase()

  for (const keyword of forbiddenKeywords) {
    if (upperQuery.includes(keyword)) {
      return { valid: false, error: `الكلمة المحظورة: ${keyword}` }
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة Table Name
 */
export function isValidTableName(name: string): {
  valid: boolean
  error?: string
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'اسم الجدول فارغ' }
  }

  // يجب أن يبدأ بحرف أو underscore
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    return {
      valid: false,
      error: 'اسم الجدول يجب أن يبدأ بحرف أو underscore ويحتوي فقط على أحرف وأرقام وunderscores',
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة Column Name
 */
export function isValidColumnName(name: string): {
  valid: boolean
  error?: string
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'اسم العمود فارغ' }
  }

  // يجب أن يبدأ بحرف أو underscore
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    return {
      valid: false,
      error: 'اسم العمود يجب أن يبدأ بحرف أو underscore ويحتوي فقط على أحرف وأرقام وunderscores',
    }
  }

  return { valid: true }
}

/**
 * التحقق من صحة Connection Config
 */
export function isValidConnectionConfig(config: {
  url?: string
  host?: string
  port?: number
  database?: string
  [key: string]: unknown
}): {
  valid: boolean
  error?: string
} {
  // يجب أن يحتوي على url أو (host + database)
  if (config.url) {
    try {
      new URL(config.url)
      return { valid: true }
    } catch {
      return { valid: false, error: 'URL غير صحيح' }
    }
  }

  if (!config.host || !config.database) {
    return { valid: false, error: 'يجب توفير host و database أو url' }
  }

  if (config.port && (config.port < 1 || config.port > 65535)) {
    return { valid: false, error: 'Port يجب أن يكون بين 1 و 65535' }
  }

  return { valid: true }
}

/**
 * التحقق من صحة Time Window
 */
export function isValidTimeWindow(window: string): boolean {
  return ['1h', '24h', '7d', '30d', 'custom'].includes(window)
}

/**
 * التحقق من صحة Period
 */
export function isValidPeriod(period: string): boolean {
  return ['hourly', 'daily', 'weekly', 'monthly'].includes(period)
}
