/**
 * مستويات Logging
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * إدخال Log
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * نظام Logging للمحادثة
 */
class ChatLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private isProduction = import.meta.env.PROD;
  private enabledLevels: Set<LogLevel> = new Set(['error', 'warn', 'info']);

  constructor() {
    // في التطوير، تفعيل debug أيضاً
    if (!this.isProduction) {
      this.enabledLevels.add('debug');
    }
  }

  /**
   * إضافة log entry
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // الاحتفاظ بآخر maxLogs فقط
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    this.logToConsole(entry);

    // في الإنتاج، إرسال إلى خدمة logging
    if (this.isProduction && entry.level === 'error') {
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Logging إلى Console
   */
  private logToConsole(entry: LogEntry): void {
    if (!this.enabledLevels.has(entry.level)) {
      return;
    }

    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${entry.level.toUpperCase()}] [${timestamp}]`;

    const consoleMethod = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    }[entry.level] || console.log;

    if (entry.error) {
      consoleMethod(prefix, entry.message, entry.context || '', entry.error);
    } else {
      consoleMethod(prefix, entry.message, entry.context || '');
    }
  }

  /**
   * إرسال إلى خدمة logging (في الإنتاج)
   */
  private sendToLoggingService(entry: LogEntry): void {
    // TODO: إرسال إلى خدمة logging خارجية
    // يمكن استخدام services مثل Sentry, LogRocket, etc.
    try {
      // حفظ في localStorage كنسخة احتياطية
      const errorLogs = JSON.parse(
        localStorage.getItem('chat-error-logs') || '[]'
      );
      errorLogs.push({
        ...entry,
        timestamp: entry.timestamp.toISOString(),
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack,
        } : undefined,
      });
      
      // الاحتفاظ بآخر 50 خطأ فقط
      const limited = errorLogs.slice(-50);
      localStorage.setItem('chat-error-logs', JSON.stringify(limited));
    } catch (error) {
      console.error('فشل حفظ log:', error);
    }
  }

  /**
   * Log error
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.addLog({
      level: 'error',
      message,
      timestamp: new Date(),
      error,
      context,
      stack: error?.stack,
    });
  }

  /**
   * Log warning
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.addLog({
      level: 'warn',
      message,
      timestamp: new Date(),
      context,
    });
  }

  /**
   * Log info
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.addLog({
      level: 'info',
      message,
      timestamp: new Date(),
      context,
    });
  }

  /**
   * Log debug
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isProduction) {
      this.addLog({
        level: 'debug',
        message,
        timestamp: new Date(),
        context,
      });
    }
  }

  /**
   * الحصول على جميع الـ logs
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * مسح الـ logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * تصدير الـ logs
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * تفعيل/تعطيل مستوى معين
   */
  setLevelEnabled(level: LogLevel, enabled: boolean): void {
    if (enabled) {
      this.enabledLevels.add(level);
    } else {
      this.enabledLevels.delete(level);
    }
  }

  /**
   * تعيين معلومات المستخدم والجلسة
   */
  setContext(_userId?: string, _sessionId?: string): void {
    // يمكن استخدام هذا لتتبع المستخدم والجلسة في الـ logs
    // سيتم إضافتها تلقائياً في جميع الـ logs التالية
  }
}

// إنشاء instance عام
export const logger = new ChatLogger();

/**
 * Helper functions للاستخدام السريع
 */
export const logError = (message: string, error?: Error, context?: Record<string, unknown>) => {
  logger.error(message, error, context);
};

export const logWarn = (message: string, context?: Record<string, unknown>) => {
  logger.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info(message, context);
};

export const logDebug = (message: string, context?: Record<string, unknown>) => {
  logger.debug(message, context);
};

