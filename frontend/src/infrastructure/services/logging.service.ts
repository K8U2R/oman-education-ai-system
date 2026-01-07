/**
 * Logging Service - خدمة التسجيل
 *
 * Unified logging service للتعامل مع الأخطاء والتحذيرات
 * يدعم مستويات مختلفة من logging حسب البيئة
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

class LoggingService {
  private isDevelopment = import.meta.env.DEV
  private logLevel: LogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO

  /**
   * تعيين مستوى التسجيل
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  /**
   * التحقق من إمكانية تسجيل مستوى معين
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const currentIndex = levels.indexOf(this.logLevel)
    const messageIndex = levels.indexOf(level)
    return messageIndex >= currentIndex
  }

  /**
   * تسجيل Debug
   */
  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (this.isDevelopment) {
        // eslint-disable-next-line no-console
        console.debug(`[DEBUG] ${message}`, data || '')
      }
    }
  }

  /**
   * تسجيل Info
   */
  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data || '')
    }
  }

  /**
   * تسجيل Warning
   */
  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, data || '')
    }
  }

  /**
   * تسجيل Error
   */
  error(message: string, error?: Error | unknown, data?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, error || '', data || '')

      // في production، يمكن إرسال الأخطاء إلى خدمة مراقبة (مثل Sentry)
      if (!this.isDevelopment) {
        // TODO: إضافة integration مع Sentry أو خدمة مراقبة أخرى
        // sentry.captureException(error, { extra: data })
      }
    }
  }

  /**
   * تسجيل Error بدون عرض في Console (للأخطاء المتوقعة)
   */
  silentError(_message: string, _error?: Error | unknown, _data?: unknown): void {
    // فقط في production أو إذا كان LogLevel = ERROR
    if (!this.isDevelopment && this.shouldLog(LogLevel.ERROR)) {
      // يمكن إرسال إلى خدمة مراقبة بدون عرض في console
      // sentry.captureException(_error, { extra: _data, level: 'info' })
    }
  }
}

export const loggingService = new LoggingService()
