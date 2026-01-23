/**
 * Configuration Exceptions - استثناءات الإعدادات
 *
 * Custom error classes لأخطاء الإعدادات
 */

/**
 * ConfigurationError - خطأ الإعدادات
 *
 * يُستخدم عندما تكون إعدادات التطبيق غير صحيحة أو مفقودة
 */
export class ConfigurationError extends Error {
  readonly code: string = "CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(message: string = "خطأ في إعدادات التطبيق") {
    super(message);
    this.name = "ConfigurationError";
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

/**
 * MissingConfigurationError - خطأ الإعدادات المفقودة
 *
 * يُستخدم عندما تكون إعدادات مطلوبة مفقودة
 */
export class MissingConfigurationError extends ConfigurationError {
  readonly code = "MISSING_CONFIGURATION_ERROR";

  constructor(key: string, message?: string) {
    super(message || `إعدادات مفقودة: ${key}`);
    Object.setPrototypeOf(this, MissingConfigurationError.prototype);
  }
}

/**
 * InvalidConfigurationError - خطأ الإعدادات غير الصحيحة
 *
 * يُستخدم عندما تكون إعدادات غير صحيحة
 */
export class InvalidConfigurationError extends ConfigurationError {
  readonly code = "INVALID_CONFIGURATION_ERROR";

  constructor(key: string, message?: string) {
    super(message || `إعدادات غير صحيحة: ${key}`);
    Object.setPrototypeOf(this, InvalidConfigurationError.prototype);
  }
}
