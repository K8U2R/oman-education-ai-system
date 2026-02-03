/**
 * Email Value Object - كائن قيمة البريد الإلكتروني
 *
 * Value Object يمثل البريد الإلكتروني مع التحقق من صحته
 */

export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error(`Invalid email address: ${email}`)
    }
    this.value = email.toLowerCase().trim()
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  static fromString(email: string): Email {
    return new Email(email)
  }
}
