/**
 * Timestamp Value Object - كائن قيمة الطابع الزمني
 *
 * Value Object يمثل الطابع الزمني مع التحويلات الآمنة
 *
 * @example
 * ```typescript
 * const timestamp = Timestamp.fromISO('2024-01-01T00:00:00.000Z')
 * console.log(timestamp.toISO()) // "2024-01-01T00:00:00.000Z"
 * ```
 */

export class Timestamp {
  private readonly value: Date;

  /**
   * إنشاء Timestamp من Date
   *
   * @param date - Date object
   * @private
   */
  private constructor(date: Date) {
    this.value = new Date(date);
  }

  /**
   * إنشاء Timestamp من ISO string
   *
   * @param isoString - ISO string
   * @returns Timestamp instance
   *
   * @example
   * ```typescript
   * const timestamp = Timestamp.fromISO('2024-01-01T00:00:00.000Z')
   * ```
   */
  static fromISO(isoString: string): Timestamp {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO string: ${isoString}`);
    }
    return new Timestamp(date);
  }

  /**
   * إنشاء Timestamp من Date
   *
   * @param date - Date object
   * @returns Timestamp instance
   */
  static fromDate(date: Date): Timestamp {
    return new Timestamp(date);
  }

  /**
   * إنشاء Timestamp للوقت الحالي
   *
   * @returns Timestamp instance
   */
  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * تحويل Timestamp إلى ISO string
   *
   * @returns ISO string
   */
  toISO(): string {
    return this.value.toISOString();
  }

  /**
   * تحويل Timestamp إلى Date
   *
   * @returns Date object
   */
  toDate(): Date {
    return new Date(this.value);
  }

  /**
   * مقارنة Timestamp مع آخر
   *
   * @param other - Timestamp آخر
   * @returns -1 إذا كان هذا أقدم، 0 إذا كان متساوياً، 1 إذا كان أحدث
   */
  compare(other: Timestamp): number {
    if (this.value < other.value) return -1;
    if (this.value > other.value) return 1;
    return 0;
  }

  /**
   * التحقق من أن Timestamp أقدم من آخر
   *
   * @param other - Timestamp آخر
   * @returns true إذا كان أقدم
   */
  isBefore(other: Timestamp): boolean {
    return this.value < other.value;
  }

  /**
   * التحقق من أن Timestamp أحدث من آخر
   *
   * @param other - Timestamp آخر
   * @returns true إذا كان أحدث
   */
  isAfter(other: Timestamp): boolean {
    return this.value > other.value;
  }
}
