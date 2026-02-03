/**
 * Password Value Object - كائن قيمة كلمة المرور
 *
 * Value Object يمثل كلمة المرور مع التحقق الصارم من قوتها
 *
 * @example
 * ```typescript
 * const password = new Password('SecurePass123', {
 *   minLength: 8,
 *   requireUppercase: true,
 *   requireNumber: true
 * })
 * ```
 */

import { pbkdf2Sync, randomBytes } from "crypto";

// Branded type for type safety
export type PasswordValue = string & { readonly __brand: "Password" };
export type HashedPassword = string & { readonly __brand: "HashedPassword" };

export interface PasswordOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

export class Password {
  private readonly value: PasswordValue;
  private readonly options: Required<PasswordOptions>;

  /**
   * إنشاء Password Value Object
   *
   * @param password - كلمة المرور المراد التحقق منها
   * @param options - خيارات التحقق من كلمة المرور
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور لا تلبي المتطلبات
   *
   * @example
   * ```typescript
   * const password = new Password('SecurePass123')
   * ```
   */
  constructor(password: string, options: PasswordOptions = {}) {
    this.options = {
      minLength: options.minLength ?? 8,
      requireUppercase: options.requireUppercase ?? true,
      requireNumber: options.requireNumber ?? true,
      requireSpecialChar: options.requireSpecialChar ?? false,
    };

    if (!this.isValid(password)) {
      throw new InvalidPasswordError(this.getValidationMessage(password));
    }

    this.value = password as PasswordValue;
  }

  /**
   * التحقق من صحة كلمة المرور
   *
   * @param password - كلمة المرور المراد التحقق منها
   * @returns true إذا كانت كلمة المرور صحيحة
   *
   * @private
   */
  private isValid(password: string): boolean {
    if (!password || typeof password !== "string") {
      return false;
    }

    if (password.length < this.options.minLength) {
      return false;
    }

    if (this.options.requireUppercase && !/[A-Z]/.test(password)) {
      return false;
    }

    if (this.options.requireNumber && !/[0-9]/.test(password)) {
      return false;
    }

    if (
      this.options.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return false;
    }

    return true;
  }

  /**
   * الحصول على رسالة التحقق من كلمة المرور
   *
   * @param password - كلمة المرور المراد التحقق منها
   * @returns رسالة الخطأ
   *
   * @private
   */
  private getValidationMessage(password: string): string {
    const errors: string[] = [];

    if (!password || password.length < this.options.minLength) {
      errors.push(
        `يجب أن تكون كلمة المرور ${this.options.minLength} أحرف على الأقل`,
      );
    }

    if (this.options.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل");
    }

    if (this.options.requireNumber && !/[0-9]/.test(password)) {
      errors.push("يجب أن تحتوي كلمة المرور على رقم واحد على الأقل");
    }

    if (
      this.options.requireSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push("يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل");
    }

    return errors.join("، ");
  }

  /**
   * الحصول على قيمة كلمة المرور كـ string
   *
   * @returns كلمة المرور كـ string
   */
  toString(): string {
    return this.value;
  }

  /**
   * الحصول على القيمة الخام (للاستخدام الداخلي)
   *
   * @returns PasswordValue
   * @internal
   */
  getValue(): PasswordValue {
    return this.value;
  }

  /**
   * مقارنة Password مع Password آخر
   *
   * @param other - Password آخر للمقارنة
   * @returns true إذا كانا متساويين
   */
  equals(other: Password): boolean {
    return this.value === other.value;
  }

  /**
   * تشفير كلمة المرور باستخدام bcrypt
   *
   * @returns HashedPassword
   *
   * @example
   * ```typescript
   * const password = new Password('SecurePass123')
   * const hashed = await password.hash()
   * ```
   */
  async hash(): Promise<HashedPassword> {
    // For now, use crypto for hashing (in production, use bcrypt)
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(this.value, salt, 10000, 64, "sha512").toString(
      "hex",
    );
    return `${salt}:${hash}` as HashedPassword;
  }

  /**
   * التحقق من كلمة المرور مع hash
   *
   * @param hashedPassword - كلمة المرور المشفرة
   * @returns true إذا كانت كلمة المرور صحيحة
   *
   * @example
   * ```typescript
   * const password = new Password('SecurePass123')
   * const isValid = await password.verify(hashedPassword)
   * ```
   */
  async verify(hashedPassword: HashedPassword): Promise<boolean> {
    const [salt, hash] = hashedPassword.split(":");
    if (!salt || !hash) {
      return false;
    }

    const verifyHash = pbkdf2Sync(
      this.value,
      salt,
      10000,
      64,
      "sha512",
    ).toString("hex");
    return hash === verifyHash;
  }

  /**
   * إنشاء Password من string
   *
   * @param password - كلمة المرور كـ string
   * @param options - خيارات التحقق
   * @returns Password instance
   * @throws {InvalidPasswordError} إذا كانت كلمة المرور لا تلبي المتطلبات
   *
   * @example
   * ```typescript
   * const password = Password.fromString('SecurePass123')
   * ```
   */
  static fromString(password: string, options?: PasswordOptions): Password {
    return new Password(password, options);
  }

  /**
   * التحقق من صحة كلمة المرور بدون إنشاء instance
   *
   * @param password - كلمة المرور المراد التحقق منها
   * @param options - خيارات التحقق
   * @returns true إذا كانت كلمة المرور صحيحة
   *
   * @example
   * ```typescript
   * if (Password.isValid('SecurePass123')) {
   *   // Password is valid
   * }
   * ```
   */
  static isValid(password: string, options?: PasswordOptions): boolean {
    try {
      new Password(password, options);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * InvalidPasswordError - خطأ كلمة المرور غير الصحيحة
 *
 * Custom error class لكلمة المرور غير الصحيحة
 */
export class InvalidPasswordError extends Error {
  readonly code = "INVALID_PASSWORD";
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "InvalidPasswordError";
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}
