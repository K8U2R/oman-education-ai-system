/**
 * Environment Configuration - إعدادات البيئة
 *
 * ملف مركزي للتحكم في إعدادات البيئة والأمان
 * Central configuration file for environment and security settings
 */

/**
 * Security Level - مستوى الأمان
 */
export type SecurityLevel = 'low' | 'medium' | 'high' | 'strict'

/**
 * Environment Configuration - إعدادات البيئة
 */
class EnvConfig {
  /**
   * التحقق من وضع التطوير
   * Check if development mode is enabled
   */
  get isDevelopment(): boolean {
    return import.meta.env.MODE === 'development' || import.meta.env.DEV === true
  }

  /**
   * التحقق من وضع الإنتاج
   * Check if production mode is enabled
   */
  get isProduction(): boolean {
    return import.meta.env.MODE === 'production' || import.meta.env.PROD === true
  }

  /**
   * التحقق من وضع Staging
   * Check if staging mode is enabled
   */
  get isStaging(): boolean {
    return import.meta.env.MODE === 'staging'
  }

  /**
   * عرض معلومات تفصيلية عن الأخطاء
   * Show detailed error information
   */
  get showErrorDetails(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_SHOW_ERROR_DETAILS === 'true' || this.isDevelopment
  }

  /**
   * تفعيل تسجيل التطوير
   * Enable development logging
   */
  get enableDevLogging(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_ENABLE_DEV_LOGGING === 'true' || this.isDevelopment
  }

  /**
   * تفعيل أدوات التطوير
   * Enable development tools
   */
  get enableDevTools(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || this.isDevelopment
  }

  /**
   * عرض معلومات المستخدم الحساسة
   * Show sensitive user debug information
   */
  get showUserDebugInfo(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_SHOW_USER_DEBUG_INFO === 'true' || this.isDevelopment
  }

  /**
   * تفعيل وضع التصحيح
   * Enable debug mode
   */
  get debugMode(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_DEBUG_MODE === 'true' || this.isDevelopment
  }

  /**
   * مستوى الأمان
   * Security level
   */
  get securityLevel(): SecurityLevel {
    const level = import.meta.env.VITE_SECURITY_LEVEL as SecurityLevel | undefined
    if (level && ['low', 'medium', 'high', 'strict'].includes(level)) {
      return level
    }
    // القيمة الافتراضية بناءً على الوضع
    if (this.isProduction) {
      return 'high'
    }
    if (this.isStaging) {
      return 'medium'
    }
    return 'low'
  }

  /**
   * تفعيل تسجيل طلبات API
   * Enable API request logging
   */
  get enableApiLogging(): boolean {
    // في الإنتاج، يجب أن يكون false دائماً للأمان
    if (this.isProduction) {
      return false
    }
    // في التطوير، يمكن التحكم فيه عبر المتغير البيئي
    return import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || this.isDevelopment
  }

  /**
   * تفعيل تتبع الأخطاء
   * Enable error tracking
   */
  get enableErrorTracking(): boolean {
    return import.meta.env.VITE_ENABLE_ERROR_TRACKING !== 'false'
  }

  /**
   * مستوى تسجيل الأخطاء
   * Error logging level
   */
  get errorLogLevel(): 'error' | 'warn' | 'info' | 'debug' {
    const level = import.meta.env.VITE_ERROR_LOG_LEVEL as
      | 'error'
      | 'warn'
      | 'info'
      | 'debug'
      | undefined
    if (level && ['error', 'warn', 'info', 'debug'].includes(level)) {
      return level
    }
    // القيمة الافتراضية بناءً على الوضع
    if (this.isProduction) {
      return 'error'
    }
    return 'debug'
  }

  /**
   * التحقق من أن الإعدادات الأمنية صحيحة
   * Validate security settings
   */
  validateSecuritySettings(): {
    isValid: boolean
    warnings: string[]
    errors: string[]
  } {
    const warnings: string[] = []
    const errors: string[] = []

    // التحقق من الإنتاج
    if (this.isProduction) {
      // تحذيرات للإنتاج
      if (this.showErrorDetails) {
        errors.push(
          'VITE_SHOW_ERROR_DETAILS يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)'
        )
      }
      if (this.enableDevLogging) {
        errors.push(
          'VITE_ENABLE_DEV_LOGGING يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)'
        )
      }
      if (this.enableDevTools) {
        errors.push('VITE_ENABLE_DEV_TOOLS يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)')
      }
      if (this.showUserDebugInfo) {
        errors.push(
          'VITE_SHOW_USER_DEBUG_INFO يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)'
        )
      }
      if (this.debugMode) {
        errors.push('VITE_DEBUG_MODE يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)')
      }
      if (this.enableApiLogging) {
        errors.push(
          'VITE_ENABLE_API_LOGGING يجب أن يكون false في الإنتاج (يسبب تسريب معلومات حساسة)'
        )
      }
      if (this.securityLevel === 'low' || this.securityLevel === 'medium') {
        warnings.push(
          `مستوى الأمان ${this.securityLevel} منخفض للإنتاج. يُنصح باستخدام 'high' أو 'strict'`
        )
      }
      if (!this.enableErrorTracking) {
        warnings.push('تتبع الأخطاء معطل في الإنتاج. يُنصح بتفعيله')
      }
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
    }
  }

  /**
   * الحصول على معلومات البيئة (للتطوير فقط)
   * Get environment information (development only)
   */
  getEnvironmentInfo(): Record<string, unknown> {
    if (!this.isDevelopment) {
      return {}
    }

    return {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
      showErrorDetails: this.showErrorDetails,
      enableDevLogging: this.enableDevLogging,
      enableDevTools: this.enableDevTools,
      showUserDebugInfo: this.showUserDebugInfo,
      debugMode: this.debugMode,
      securityLevel: this.securityLevel,
      enableApiLogging: this.enableApiLogging,
      enableErrorTracking: this.enableErrorTracking,
      errorLogLevel: this.errorLogLevel,
    }
  }
}

// Export singleton instance
export const envConfig = new EnvConfig()

// Export for convenience
export default envConfig
