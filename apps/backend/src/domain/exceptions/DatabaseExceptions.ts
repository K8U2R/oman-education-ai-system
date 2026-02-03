/**
 * Database Exceptions - استثناءات قاعدة البيانات
 *
 * Custom error classes لجميع أخطاء قاعدة البيانات
 */

/**
 * Base Database Error - الخطأ الأساسي لقاعدة البيانات
 */
export abstract class DatabaseError extends Error {
  abstract readonly code: string;
  readonly statusCode = 500;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * DatabaseConnectionError - خطأ الاتصال بقاعدة البيانات
 *
 * يُستخدم عندما يفشل الاتصال بقاعدة البيانات أو Database Core Service
 */
export class DatabaseConnectionError extends DatabaseError {
  readonly code = "DATABASE_CONNECTION_ERROR";

  constructor(message: string = "فشل الاتصال بقاعدة البيانات") {
    super(message);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

/**
 * DatabaseQueryError - خطأ تنفيذ الاستعلام
 *
 * يُستخدم عندما يفشل تنفيذ استعلام قاعدة البيانات
 */
export class DatabaseQueryError extends DatabaseError {
  readonly code = "DATABASE_QUERY_ERROR";

  constructor(message: string = "فشل تنفيذ الاستعلام") {
    super(message);
    Object.setPrototypeOf(this, DatabaseQueryError.prototype);
  }
}

/**
 * DatabaseTimeoutError - خطأ انتهاء مهلة الاتصال
 *
 * يُستخدم عندما تنتهي مهلة الاتصال بقاعدة البيانات
 */
export class DatabaseTimeoutError extends DatabaseError {
  readonly code = "DATABASE_TIMEOUT_ERROR";

  constructor(message: string = "انتهت مهلة الاتصال بقاعدة البيانات") {
    super(message);
    Object.setPrototypeOf(this, DatabaseTimeoutError.prototype);
  }
}

/**
 * DatabaseTransactionError - خطأ المعاملة
 *
 * يُستخدم عندما تفشل معاملة قاعدة البيانات
 */
export class DatabaseTransactionError extends DatabaseError {
  readonly code = "DATABASE_TRANSACTION_ERROR";

  constructor(message: string = "فشلت معاملة قاعدة البيانات") {
    super(message);
    Object.setPrototypeOf(this, DatabaseTransactionError.prototype);
  }
}
