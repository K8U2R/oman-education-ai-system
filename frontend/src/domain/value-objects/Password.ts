/**
 * Password Value Object - كائن قيمة كلمة المرور
 *
 * Value Object يمثل كلمة المرور مع التحقق من قوتها
 */

export class Password {
  private readonly value: string

  constructor(
    password: string,
    options?: { minLength?: number; requireUppercase?: boolean; requireNumber?: boolean }
  ) {
    const minLength = options?.minLength ?? 8
    const requireUppercase = options?.requireUppercase ?? true
    const requireNumber = options?.requireNumber ?? true

    if (!this.isValid(password, minLength, requireUppercase, requireNumber)) {
      throw new Error('Password does not meet requirements')
    }
    this.value = password
  }

  private isValid(
    password: string,
    minLength: number,
    requireUppercase: boolean,
    requireNumber: boolean
  ): boolean {
    if (password.length < minLength) {
      return false
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      return false
    }

    if (requireNumber && !/[0-9]/.test(password)) {
      return false
    }

    return true
  }

  toString(): string {
    return this.value
  }

  equals(other: Password): boolean {
    return this.value === other.value
  }

  static fromString(password: string): Password {
    return new Password(password)
  }
}
