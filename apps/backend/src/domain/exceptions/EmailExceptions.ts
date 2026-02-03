/**
 * Email Exceptions - استثناءات البريد الإلكتروني
 *
 * Custom Error Classes لعمليات البريد الإلكتروني
 */

export abstract class EmailError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, EmailError.prototype);
  }
}

/**
 * EmailConnectionError - خطأ في الاتصال بمزود البريد
 */
export class EmailConnectionError extends EmailError {
  readonly code = "EMAIL_CONNECTION_ERROR";
  readonly statusCode = 500;

  constructor(message: string = "فشل الاتصال بمزود البريد الإلكتروني") {
    super(message);
    Object.setPrototypeOf(this, EmailConnectionError.prototype);
  }
}

/**
 * EmailSendError - خطأ في إرسال البريد
 */
export class EmailSendError extends EmailError {
  readonly code = "EMAIL_SEND_ERROR";
  readonly statusCode = 500;

  constructor(message: string = "فشل إرسال البريد الإلكتروني") {
    super(message);
    Object.setPrototypeOf(this, EmailSendError.prototype);
  }
}

/**
 * EmailConfigurationError - خطأ في إعدادات البريد
 */
export class EmailConfigurationError extends EmailError {
  readonly code = "EMAIL_CONFIGURATION_ERROR";
  readonly statusCode = 500;

  constructor(message: string = "خطأ في إعدادات البريد الإلكتروني") {
    super(message);
    Object.setPrototypeOf(this, EmailConfigurationError.prototype);
  }
}

/**
 * EmailValidationError - خطأ في التحقق من صحة البيانات
 */
export class EmailValidationError extends EmailError {
  readonly code = "EMAIL_VALIDATION_ERROR";
  override readonly statusCode = 400;

  constructor(message: string = "بيانات البريد الإلكتروني غير صحيحة") {
    super(message);
    Object.setPrototypeOf(this, EmailValidationError.prototype);
  }
}
