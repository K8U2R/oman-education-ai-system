/**
 * Email Value Object - كائن قيمة البريد الإلكتروني
 *
 * Value Object يمثل البريد الإلكتروني مع التحقق الصارم من صحته
 *
 * @example
 * ```typescript
 * const email = new Email('user@example.com')
 * console.log(email.toString()) // "user@example.com"
 * ```
 */

// Branded type for type safety
export type EmailValue = string & { readonly __brand: "Email" };

export class Email {
  private readonly value: EmailValue;

  /**
   * إنشاء Email Value Object
   *
   * @param email - البريد الإلكتروني المراد التحقق منه
   * @throws {InvalidEmailError} إذا كان البريد الإلكتروني غير صحيح
   *
   * @example
   * ```typescript
   * const email = new Email('user@example.com')
   * ```
   */
  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidEmailError(`البريد الإلكتروني غير صحيح: ${email}`);
    }
    // Normalize: lowercase and trim
    this.value = email.toLowerCase().trim() as EmailValue;
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   *
   * @param email - البريد الإلكتروني المراد التحقق منه
   * @returns true إذا كان البريد الإلكتروني صحيحاً
   *
   * @private
   */
  private isValid(email: string): boolean {
    if (!email || typeof email !== "string") {
      return false;
    }

    // RFC 5322 compliant regex (simplified)
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    const [localPart, domain] = email.split("@");

    if (!localPart || localPart.length > 64) {
      return false;
    }

    if (!domain || domain.length > 255) {
      return false;
    }

    return true;
  }

  /**
   * الحصول على قيمة البريد الإلكتروني كـ string
   *
   * @returns البريد الإلكتروني كـ string
   */
  toString(): string {
    return this.value;
  }

  /**
   * الحصول على القيمة الخام (للاستخدام الداخلي)
   *
   * @returns EmailValue
   * @internal
   */
  getValue(): EmailValue {
    return this.value;
  }

  /**
   * مقارنة Email مع Email آخر
   *
   * @param other - Email آخر للمقارنة
   * @returns true إذا كانا متساويين
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * إنشاء Email من string
   *
   * @param email - البريد الإلكتروني كـ string
   * @returns Email instance
   * @throws {InvalidEmailError} إذا كان البريد الإلكتروني غير صحيح
   *
   * @example
   * ```typescript
   * const email = Email.fromString('user@example.com')
   * ```
   */
  static fromString(email: string): Email {
    return new Email(email);
  }

  /**
   * التحقق من صحة البريد الإلكتروني بدون إنشاء instance
   *
   * @param email - البريد الإلكتروني المراد التحقق منه
   * @returns true إذا كان البريد الإلكتروني صحيحاً
   *
   * @example
   * ```typescript
   * if (Email.isValid('user@example.com')) {
   *   // Email is valid
   * }
   * ```
   */
  static isValid(email: string): boolean {
    try {
      new Email(email);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * InvalidEmailError - خطأ البريد الإلكتروني غير الصحيح
 *
 * Custom error class للبريد الإلكتروني غير الصحيح
 */
export class InvalidEmailError extends Error {
  readonly code = "INVALID_EMAIL";
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "InvalidEmailError";
    Object.setPrototypeOf(this, InvalidEmailError.prototype);
  }
}
