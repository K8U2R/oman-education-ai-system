/**
 * Notification Exceptions - استثناءات الإشعارات
 *
 * Custom error classes لجميع أخطاء الإشعارات
 */

/**
 * Base Notification Error - الخطأ الأساسي للإشعارات
 */
export abstract class NotificationError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, NotificationError.prototype);
  }
}

/**
 * NotificationNotFoundError - خطأ الإشعار غير موجود
 *
 * يُستخدم عندما لا يتم العثور على الإشعار
 */
export class NotificationNotFoundError extends NotificationError {
  readonly code = "NOTIFICATION_NOT_FOUND";
  readonly statusCode = 404;

  constructor(message: string = "الإشعار غير موجود") {
    super(message);
    Object.setPrototypeOf(this, NotificationNotFoundError.prototype);
  }
}

/**
 * NotificationAccessDeniedError - خطأ رفض الوصول للإشعار
 *
 * يُستخدم عندما يحاول المستخدم الوصول لإشعار لا يملكه
 */
export class NotificationAccessDeniedError extends NotificationError {
  readonly code = "NOTIFICATION_ACCESS_DENIED";
  readonly statusCode = 403;

  constructor(message: string = "ليس لديك صلاحية للوصول إلى هذا الإشعار") {
    super(message);
    Object.setPrototypeOf(this, NotificationAccessDeniedError.prototype);
  }
}

/**
 * NotificationCreationFailedError - خطأ فشل إنشاء الإشعار
 *
 * يُستخدم عندما يفشل إنشاء الإشعار
 */
export class NotificationCreationFailedError extends NotificationError {
  readonly code = "NOTIFICATION_CREATION_FAILED";
  readonly statusCode = 500;

  constructor(message: string = "فشل إنشاء الإشعار") {
    super(message);
    Object.setPrototypeOf(this, NotificationCreationFailedError.prototype);
  }
}

/**
 * NotificationUpdateFailedError - خطأ فشل تحديث الإشعار
 *
 * يُستخدم عندما يفشل تحديث الإشعار
 */
export class NotificationUpdateFailedError extends NotificationError {
  readonly code = "NOTIFICATION_UPDATE_FAILED";
  readonly statusCode = 500;

  constructor(message: string = "فشل تحديث الإشعار") {
    super(message);
    Object.setPrototypeOf(this, NotificationUpdateFailedError.prototype);
  }
}

/**
 * NotificationDeleteFailedError - خطأ فشل حذف الإشعار
 *
 * يُستخدم عندما يفشل حذف الإشعار
 */
export class NotificationDeleteFailedError extends NotificationError {
  readonly code = "NOTIFICATION_DELETE_FAILED";
  readonly statusCode = 500;

  constructor(message: string = "فشل حذف الإشعار") {
    super(message);
    Object.setPrototypeOf(this, NotificationDeleteFailedError.prototype);
  }
}
