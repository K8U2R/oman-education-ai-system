/**
 * Permission Level - مستوى
 *
 * Value Object لمستويات  في القائمة البيضاء
 */

export type PermissionLevelType = "developer" | "admin" | "super_admin";

/**
 * Permission Level - مستوى
 */
export class PermissionLevel {
  private constructor(private readonly value: PermissionLevelType) {
    this.validate();
  }

  /**
   * إنشاء Permission Level من قيمة
   */
  static create(value: PermissionLevelType): PermissionLevel {
    return new PermissionLevel(value);
  }

  /**
   * التحقق من صحة القيمة
   */
  private validate(): void {
    const validLevels: PermissionLevelType[] = [
      "developer",
      "admin",
      "super_admin",
    ];
    if (!validLevels.includes(this.value)) {
      throw new Error(`مستوى  غير صحيح: ${this.value}`);
    }
  }

  /**
   * الحصول على القيمة
   */
  getValue(): PermissionLevelType {
    return this.value;
  }

  /**
   * التحقق من أن المستوى أعلى من أو يساوي مستوى آخر
   */
  isGreaterThanOrEqual(level: PermissionLevel): boolean {
    const hierarchy: Record<PermissionLevelType, number> = {
      developer: 1,
      admin: 2,
      super_admin: 3,
    };

    return hierarchy[this.value] >= hierarchy[level.value];
  }

  /**
   * التحقق من أن المستوى هو Super Admin
   */
  isSuperAdmin(): boolean {
    return this.value === "super_admin";
  }

  /**
   * التحقق من أن المستوى هو Admin أو أعلى
   */
  isAdminOrHigher(): boolean {
    return this.value === "admin" || this.value === "super_admin";
  }

  /**
   * المقارنة
   */
  equals(other: PermissionLevel): boolean {
    return this.value === other.value;
  }

  /**
   * التحويل إلى String
   */
  toString(): string {
    return this.value;
  }
}
