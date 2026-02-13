/**
 * User Repository Interface - واجهة مستودع المستخدم
 *
 * @law Law-10 (Scalability) - Data Persistence Contract
 */

import { User } from "../../../../entities/User.js";

export interface IUserRepository {
  /**
   * البحث عن مستخدم بالمعرف
   */
  findById(id: string): Promise<User | null>;

  /**
   * جلب جميع المستخدمين مع دعم التصفح
   */
  findAll(limit?: number, offset?: number): Promise<User[]>;

  /**
   * البحث عن مستخدمين
   */
  search(query: string): Promise<User[]>;

  /**
   * تحديث بيانات المستخدم
   */
  update(id: string, data: Partial<User>): Promise<User>;

  /**
   * تحديث حالة المستخدم (نشط، محظور، ...)
   */
  updateStatus(
    id: string,
    status: "active" | "banned" | "suspended",
  ): Promise<void>;

  /**
   * حساب إجمالي المستخدمين
   */
  count(): Promise<number>;
}
