/**
 * Auth Exceptions - استثناءات المصادقة
 *
 * Custom error classes لجميع أخطاء المصادقة
 */

/**
 * Base Auth Error - الخطأ الأساسي للمصادقة
 */
export abstract class AuthError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

/**
 * AuthenticationFailedError - خطأ فشل المصادقة
 *
 * يُستخدم عندما تفشل عملية تسجيل الدخول
 */
export class AuthenticationFailedError extends AuthError {
  readonly code = "AUTHENTICATION_FAILED";
  readonly statusCode = 401;

  constructor(
    message: string = "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور",
  ) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationFailedError.prototype);
  }
}

/**
 * UserNotFoundError - خطأ المستخدم غير موجود
 *
 * يُستخدم عندما لا يتم العثور على المستخدم
 */
export class UserNotFoundError extends AuthError {
  readonly code = "USER_NOT_FOUND";
  readonly statusCode = 404;

  constructor(message: string = "المستخدم غير موجود") {
    super(message);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * UserAlreadyExistsError - خطأ المستخدم موجود بالفعل
 *
 * يُستخدم عندما يحاول المستخدم التسجيل ببريد إلكتروني موجود
 */
export class UserAlreadyExistsError extends AuthError {
  readonly code = "USER_ALREADY_EXISTS";
  readonly statusCode = 409;

  constructor(message: string = "المستخدم موجود بالفعل") {
    super(message);
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

/**
 * InvalidTokenError - خطأ Token غير صحيح
 *
 * يُستخدم عندما يكون Token غير صحيح أو منتهي الصلاحية
 */
export class InvalidTokenError extends AuthError {
  readonly code = "INVALID_TOKEN";
  readonly statusCode = 401;

  constructor(message: string = "Token غير صحيح أو منتهي الصلاحية") {
    super(message);
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

/**
 * TokenExpiredError - خطأ Token منتهي الصلاحية
 *
 * يُستخدم عندما يكون Token منتهي الصلاحية
 */
export class TokenExpiredError extends AuthError {
  readonly code = "TOKEN_EXPIRED";
  readonly statusCode = 401;

  constructor(message: string = "Token منتهي الصلاحية") {
    super(message);
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

/**
 * UnauthorizedError - خطأ غير مصرح
 *
 * يُستخدم عندما لا يكون المستخدم مصرحاً له بالوصول (لا يوجد token أو token غير صحيح)
 * Note: 401 Unauthorized = missing/invalid authentication
 *       403 Forbidden = authenticated but not authorized (permissions)
 */
export class UnauthorizedError extends AuthError {
  readonly code = "UNAUTHORIZED";
  readonly statusCode = 401; // Changed from 403 to 401 (authentication issue, not authorization)

  constructor(message: string = "غير مصرح لك بالوصول") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * AccountNotVerifiedError - خطأ الحساب غير مفعّل
 *
 * يُستخدم عندما يكون الحساب غير مفعّل
 */
export class AccountNotVerifiedError extends AuthError {
  readonly code = "ACCOUNT_NOT_VERIFIED";
  readonly statusCode = 403;

  constructor(message: string = "الحساب غير مفعّل. يرجى تفعيل الحساب أولاً") {
    super(message);
    Object.setPrototypeOf(this, AccountNotVerifiedError.prototype);
  }
}

/**
 * AccountDisabledError - خطأ الحساب معطّل
 *
 * يُستخدم عندما يكون الحساب معطّلاً
 */
export class AccountDisabledError extends AuthError {
  readonly code = "ACCOUNT_DISABLED";
  readonly statusCode = 403;

  constructor(message: string = "الحساب معطّل. يرجى الاتصال بالدعم") {
    super(message);
    Object.setPrototypeOf(this, AccountDisabledError.prototype);
  }
}

/**
 * RegistrationFailedError - خطأ فشل التسجيل
 *
 * يُستخدم عندما يفشل التسجيل لأسباب غير متوقعة
 */
export class RegistrationFailedError extends AuthError {
  readonly code = "REGISTRATION_FAILED";
  readonly statusCode = 500;

  constructor(message: string = "فشل التسجيل") {
    super(message);
    Object.setPrototypeOf(this, RegistrationFailedError.prototype);
  }
}

/**
 * RateLimitExceededError - خطأ تجاوز الحد الأقصى للمحاولات
 *
 * يُستخدم عندما يتم تجاوز الحد الأقصى لمحاولات تسجيل الدخول
 */
export class RateLimitExceededError extends AuthError {
  readonly code = "RATE_LIMIT_EXCEEDED";
  readonly statusCode = 429;

  constructor(message: string = "تم تجاوز الحد الأقصى للمحاولات") {
    super(message);
    Object.setPrototypeOf(this, RateLimitExceededError.prototype);
  }
}

/**
 * VerificationTokenExpiredError - خطأ انتهاء صلاحية رمز التحقق
 *
 * يُستخدم عندما يكون رمز التحقق منتهي الصلاحية
 */
export class VerificationTokenExpiredError extends AuthError {
  readonly code = "VERIFICATION_TOKEN_EXPIRED";
  readonly statusCode = 400;

  constructor(message: string = "رمز التحقق منتهي الصلاحية") {
    super(message);
    Object.setPrototypeOf(this, VerificationTokenExpiredError.prototype);
  }
}

/**
 * VerificationTokenInvalidError - خطأ رمز التحقق غير صحيح
 *
 * يُستخدم عندما يكون رمز التحقق غير صحيح أو غير موجود
 */
export class VerificationTokenInvalidError extends AuthError {
  readonly code = "VERIFICATION_TOKEN_INVALID";
  readonly statusCode = 400;

  constructor(message: string = "رمز التحقق غير صحيح") {
    super(message);
    Object.setPrototypeOf(this, VerificationTokenInvalidError.prototype);
  }
}

/**
 * VerificationTokenAlreadyUsedError - خطأ رمز التحقق مستخدم مسبقاً
 *
 * يُستخدم عندما يكون رمز التحقق قد تم استخدامه مسبقاً
 */
export class VerificationTokenAlreadyUsedError extends AuthError {
  readonly code = "VERIFICATION_TOKEN_ALREADY_USED";
  readonly statusCode = 400;

  constructor(message: string = "تم استخدام رمز التحقق مسبقاً") {
    super(message);
    Object.setPrototypeOf(this, VerificationTokenAlreadyUsedError.prototype);
  }
}

/**
 * EmailAlreadyVerifiedError - خطأ البريد الإلكتروني مفعّل بالفعل
 *
 * يُستخدم عندما يكون البريد الإلكتروني مفعّل بالفعل
 */
export class EmailAlreadyVerifiedError extends AuthError {
  readonly code = "EMAIL_ALREADY_VERIFIED";
  readonly statusCode = 400;

  constructor(message: string = "البريد الإلكتروني مفعّل بالفعل") {
    super(message);
    Object.setPrototypeOf(this, EmailAlreadyVerifiedError.prototype);
  }
}
