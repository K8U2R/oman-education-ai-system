/**
 * IAuthRepository - واجهة مستودع المصادقة
 *
 * Domain Interface لمستودع المصادقة
 *
 * هذه الواجهة تحدد العقد (Contract) لجميع عمليات المصادقة
 * يجب أن تطبقها Infrastructure Layer
 */

import { User } from "../../../../entities/User";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserData,
  VerificationTokenData,
} from "../../../../types/auth/index.js";

export interface IAuthRepository {
  /**
   * تسجيل الدخول
   *
   * @param credentials - بيانات تسجيل الدخول (البريد الإلكتروني وكلمة المرور)
   * @returns LoginResponse يحتوي على User و Tokens
   * @throws {AuthenticationFailedError} إذا فشل تسجيل الدخول
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {AccountNotVerifiedError} إذا كان الحساب غير مفعّل
   * @throws {AccountDisabledError} إذا كان الحساب معطّلاً
   */
  login(credentials: LoginRequest): Promise<LoginResponse>;

  /**
   * التسجيل (إنشاء حساب جديد)
   *
   * @param data - بيانات التسجيل
   * @returns User instance
   * @throws {UserAlreadyExistsError} إذا كان المستخدم موجوداً بالفعل
   * @throws {InvalidEmailError} إذا كان البريد الإلكتروني غير صحيح
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور لا تلبي المتطلبات
   */
  register(data: RegisterRequest): Promise<User>;

  /**
   * تسجيل الخروج
   *
   * @param refreshToken - Refresh Token المراد إلغاؤه
   * @returns void
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   */
  logout(refreshToken: string): Promise<void>;

  /**
   * الحصول على المستخدم الحالي
   *
   * @param userId - معرف المستخدم
   * @returns User instance
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  getCurrentUser(userId: string): Promise<User>;

  /**
   * تحديث Token
   *
   * @param request - RefreshTokenRequest يحتوي على refresh_token
   * @returns RefreshTokenResponse يحتوي على tokens جديدة
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
   */
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;

  /**
   * التحقق من صحة Token
   *
   * @param token - Access Token المراد التحقق منه
   * @returns UserData إذا كان Token صحيحاً
   * @throws {InvalidTokenError} إذا كان Token غير صحيح
   * @throws {TokenExpiredError} إذا كان Token منتهي الصلاحية
   */
  verifyToken(token: string): Promise<UserData>;

  /**
   * البحث عن مستخدم بالبريد الإلكتروني
   *
   * @param email - البريد الإلكتروني
   * @returns User instance أو null إذا لم يتم العثور على المستخدم
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * البحث عن مستخدم بالمعرف
   *
   * @param id - معرف المستخدم
   * @returns User instance أو null إذا لم يتم العثور على المستخدم
   */
  findById(id: string): Promise<User | null>;

  /**
   * تحديث بيانات المستخدم
   *
   * @param userId - معرف المستخدم
   * @param data - البيانات المراد تحديثها
   * @returns User instance محدّث
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  updateUser(userId: string, data: Partial<UserData>): Promise<User>;

  /**
   * تحديث كلمة المرور
   *
   * @param userId - معرف المستخدم
   * @param currentPassword - كلمة المرور الحالية
   * @param newPassword - كلمة المرور الجديدة
   * @returns void
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   * @throws {AuthenticationFailedError} إذا كانت كلمة المرور الحالية غير صحيحة
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور الجديدة لا تلبي المتطلبات
   */
  updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;

  /**
   * تحديث كلمة المرور مباشرة (لإعادة التعيين)
   *
   * @param userId - معرف المستخدم
   * @param newPasswordHash - كلمة المرور الجديدة المشفرة
   * @returns void
   * @throws {UserNotFoundError} إذا لم يتم العثور على المستخدم
   */
  updatePasswordHash(userId: string, newPasswordHash: string): Promise<void>;

  /**
   * تحديث وقت آخر ظهور للمستخدم
   *
   * @param userId - معرف المستخدم
   * @returns void
   */
  updateLastLogin(userId: string): Promise<void>;

  /**
   * إنشاء رمز التحقق
   *
   * @param userId - معرف المستخدم
   * @param token - رمز التحقق
   * @param type - نوع الرمز (email_verification, password_reset)
   * @param expiresAt - تاريخ انتهاء الصلاحية
   * @returns void
   */
  createVerificationToken(
    userId: string,
    token: string,
    type: "email_verification" | "password_reset",
    expiresAt: Date,
  ): Promise<void>;

  /**
   * البحث عن رمز التحقق
   *
   * @param token - رمز التحقق
   * @returns VerificationTokenData أو null إذا لم يتم العثور عليه
   */
  findVerificationToken(token: string): Promise<VerificationTokenData | null>;

  /**
   * تحديد رمز التحقق كمستخدم
   *
   * @param tokenId - معرف رمز التحقق
   * @returns void
   */
  markVerificationTokenAsUsed(tokenId: string): Promise<void>;

  /**
   * مزامنة مستخدم خارجي (مثل Supabase)
   *
   * @param data - بيانات المستخدم
   * @returns User instance
   */
  syncExternalUser(data: {
    id: string;
    email: string;
    role: string;
    is_verified: boolean;
    username: string;
  }): Promise<User>;
}
