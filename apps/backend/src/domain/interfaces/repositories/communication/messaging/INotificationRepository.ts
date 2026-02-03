/**
 * INotificationRepository - واجهة مستودع الإشعارات
 *
 * Domain Interface لمستودع الإشعارات
 *
 * هذه الواجهة تحدد العقد (Contract) لجميع عمليات الإشعارات
 * يجب أن تطبقها Infrastructure Layer
 */

import { Notification } from "../../../../entities/Notification";
import {
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationStats,
  NotificationListResponse,
} from "../../../../types/communication/index.js";

export interface INotificationRepository {
  /**
   * إنشاء إشعار جديد
   *
   * @param data - بيانات الإشعار
   * @returns Notification instance
   * @throws {NotificationCreationFailedError} إذا فشل إنشاء الإشعار
   */
  create(data: CreateNotificationRequest): Promise<Notification>;

  /**
   * البحث عن إشعار بالمعرف
   *
   * @param id - معرف الإشعار
   * @returns Notification instance أو null إذا لم يتم العثور عليه
   */
  findById(id: string): Promise<Notification | null>;

  /**
   * البحث عن إشعارات المستخدم
   *
   * @param userId - معرف المستخدم
   * @param options - خيارات البحث (page, perPage, status, type)
   * @returns NotificationListResponse
   */
  findByUserId(
    userId: string,
    options?: {
      page?: number;
      perPage?: number;
      status?: "unread" | "read" | "archived";
      type?: string;
    },
  ): Promise<NotificationListResponse>;

  /**
   * تحديث إشعار
   *
   * @param id - معرف الإشعار
   * @param data - البيانات المراد تحديثها
   * @returns Notification instance محدّث
   * @throws {NotificationNotFoundError} إذا لم يتم العثور على الإشعار
   * @throws {NotificationUpdateFailedError} إذا فشل التحديث
   */
  update(id: string, data: UpdateNotificationRequest): Promise<Notification>;

  /**
   * حذف إشعار
   *
   * @param id - معرف الإشعار
   * @returns void
   * @throws {NotificationNotFoundError} إذا لم يتم العثور على الإشعار
   * @throws {NotificationDeleteFailedError} إذا فشل الحذف
   */
  delete(id: string): Promise<void>;

  /**
   * تحديد جميع إشعارات المستخدم كمقروءة
   *
   * @param userId - معرف المستخدم
   * @returns عدد الإشعارات المحدثة
   */
  markAllAsRead(userId: string): Promise<number>;

  /**
   * الحصول على إحصائيات إشعارات المستخدم
   *
   * @param userId - معرف المستخدم
   * @returns NotificationStats
   */
  getStats(userId: string): Promise<NotificationStats>;

  /**
   * التحقق من أن الإشعار يخص المستخدم
   *
   * @param id - معرف الإشعار
   * @param userId - معرف المستخدم
   * @returns true إذا كان الإشعار يخص المستخدم
   */
  belongsToUser(id: string, userId: string): Promise<boolean>;
}
