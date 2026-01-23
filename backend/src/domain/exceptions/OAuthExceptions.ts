/**
 * OAuth Exceptions - استثناءات OAuth
 *
 * Custom error classes لجميع أخطاء OAuth
 */

import { AuthError } from "./AuthExceptions";

/**
 * OAuthError - خطأ عام في OAuth
 *
 * يُستخدم للأخطاء العامة في عملية OAuth
 */
export class OAuthError extends AuthError {
  readonly code = "OAUTH_ERROR";
  readonly statusCode = 400;

  constructor(message: string = "خطأ في عملية OAuth") {
    super(message);
    Object.setPrototypeOf(this, OAuthError.prototype);
  }
}

/**
 * OAuthStateExpiredError - خطأ State منتهي الصلاحية
 *
 * يُستخدم عندما يكون State token منتهي الصلاحية
 */
export class OAuthStateExpiredError extends AuthError {
  readonly code = "OAUTH_STATE_EXPIRED";
  readonly statusCode = 400;

  constructor(message: string = "State منتهي الصلاحية") {
    super(message);
    Object.setPrototypeOf(this, OAuthStateExpiredError.prototype);
  }
}

/**
 * OAuthStateInvalidError - خطأ State غير صحيح
 *
 * يُستخدم عندما يكون State token غير صحيح أو غير موجود
 */
export class OAuthStateInvalidError extends AuthError {
  readonly code = "OAUTH_STATE_INVALID";
  readonly statusCode = 400;

  constructor(message: string = "State غير صحيح") {
    super(message);
    Object.setPrototypeOf(this, OAuthStateInvalidError.prototype);
  }
}

/**
 * OAuthCodeExchangeError - خطأ في استبدال Code
 *
 * يُستخدم عندما يفشل استبدال Authorization Code بـ Access Token
 */
export class OAuthCodeExchangeError extends AuthError {
  readonly code = "OAUTH_CODE_EXCHANGE_ERROR";
  readonly statusCode = 400;

  constructor(message: string = "فشل استبدال Authorization Code") {
    super(message);
    Object.setPrototypeOf(this, OAuthCodeExchangeError.prototype);
  }
}

/**
 * OAuthUserInfoError - خطأ في جلب معلومات المستخدم
 *
 * يُستخدم عندما يفشل جلب معلومات المستخدم من OAuth provider
 */
export class OAuthUserInfoError extends AuthError {
  readonly code = "OAUTH_USER_INFO_ERROR";
  readonly statusCode = 400;

  constructor(message: string = "فشل جلب معلومات المستخدم من Google") {
    super(message);
    Object.setPrototypeOf(this, OAuthUserInfoError.prototype);
  }
}

/**
 * OAuthProviderNotSupportedError - خطأ Provider غير مدعوم
 *
 * يُستخدم عندما يكون OAuth provider غير مدعوم
 */
export class OAuthProviderNotSupportedError extends AuthError {
  readonly code = "OAUTH_PROVIDER_NOT_SUPPORTED";
  readonly statusCode = 400;

  constructor(message: string = "OAuth provider غير مدعوم") {
    super(message);
    Object.setPrototypeOf(this, OAuthProviderNotSupportedError.prototype);
  }
}
