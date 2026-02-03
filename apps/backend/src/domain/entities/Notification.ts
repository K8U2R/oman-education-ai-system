/**
 * Notification Entity - كيان الإشعار
 *
 * Domain Entity يمثل الإشعار في النظام مع Business Logic
 *
 * @example
 * ```typescript
 * const notification = Notification.fromData(notificationData)
 * console.log(notification.isUnread) // true/false
 * notification.markAsRead()
 * ```
 */

import {
  NotificationData,
  NotificationType,
  NotificationStatus,
} from "../types/communication/index.js";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    private _status: NotificationStatus,
    public readonly actionUrl?: string,
    public readonly actionLabel?: string,
    public readonly metadata?: Record<string, unknown>,
    public readonly createdAt: Date = new Date(),
    private _readAt?: Date,
    private _archivedAt?: Date,
    public readonly updatedAt: Date = new Date(),
  ) {}

  /**
   * التحقق من أن الإشعار غير مقروء
   *
   * @returns true إذا كان الإشعار غير مقروء
   */
  get isUnread(): boolean {
    return this._status === "unread";
  }

  /**
   * التحقق من أن الإشعار مقروء
   *
   * @returns true إذا كان الإشعار مقروء
   */
  get isRead(): boolean {
    return this._status === "read";
  }

  /**
   * التحقق من أن الإشعار مؤرشف
   *
   * @returns true إذا كان الإشعار مؤرشف
   */
  get isArchived(): boolean {
    return this._status === "archived";
  }

  /**
   * الحصول على حالة الإشعار
   *
   * @returns حالة الإشعار
   */
  get status(): NotificationStatus {
    return this._status;
  }

  /**
   * الحصول على تاريخ القراءة
   *
   * @returns تاريخ القراءة أو undefined
   */
  get readAt(): Date | undefined {
    return this._readAt;
  }

  /**
   * الحصول على تاريخ الأرشفة
   *
   * @returns تاريخ الأرشفة أو undefined
   */
  get archivedAt(): Date | undefined {
    return this._archivedAt;
  }

  /**
   * تحديد الإشعار كمقروء
   *
   * @returns Notification instance محدّث
   */
  markAsRead(): Notification {
    if (this._status === "read") {
      return this;
    }

    return new Notification(
      this.id,
      this.userId,
      this.type,
      this.title,
      this.message,
      "read",
      this.actionUrl,
      this.actionLabel,
      this.metadata,
      this.createdAt,
      new Date(),
      this._archivedAt,
      new Date(),
    );
  }

  /**
   * أرشفة الإشعار
   *
   * @returns Notification instance محدّث
   */
  archive(): Notification {
    if (this._status === "archived") {
      return this;
    }

    return new Notification(
      this.id,
      this.userId,
      this.type,
      this.title,
      this.message,
      "archived",
      this.actionUrl,
      this.actionLabel,
      this.metadata,
      this.createdAt,
      this._readAt,
      new Date(),
      new Date(),
    );
  }

  /**
   * إلغاء أرشفة الإشعار
   *
   * @returns Notification instance محدّث
   */
  unarchive(): Notification {
    if (this._status !== "archived") {
      return this;
    }

    // إرجاع إلى الحالة السابقة (مقروء أو غير مقروء)
    const previousStatus: NotificationStatus = this._readAt ? "read" : "unread";

    return new Notification(
      this.id,
      this.userId,
      this.type,
      this.title,
      this.message,
      previousStatus,
      this.actionUrl,
      this.actionLabel,
      this.metadata,
      this.createdAt,
      this._readAt,
      undefined,
      new Date(),
    );
  }

  /**
   * إنشاء Notification من NotificationData
   *
   * @param data - بيانات الإشعار من قاعدة البيانات
   * @returns Notification instance
   *
   * @example
   * ```typescript
   * const notification = Notification.fromData(notificationData)
   * ```
   */
  static fromData(data: NotificationData): Notification {
    return new Notification(
      data.id,
      data.user_id,
      data.type,
      data.title,
      data.message,
      data.status,
      data.action_url || undefined,
      data.action_label || undefined,
      data.metadata || undefined,
      new Date(data.created_at),
      data.read_at ? new Date(data.read_at) : undefined,
      data.archived_at ? new Date(data.archived_at) : undefined,
      new Date(data.updated_at),
    );
  }

  /**
   * تحويل Notification إلى NotificationData
   *
   * @returns NotificationData object
   *
   * @example
   * ```typescript
   * const notificationData = notification.toData()
   * ```
   */
  toData(): NotificationData {
    return {
      id: this.id,
      user_id: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      status: this._status,
      action_url: this.actionUrl || null,
      action_label: this.actionLabel || null,
      metadata: this.metadata || null,
      created_at: this.createdAt.toISOString(),
      read_at: this._readAt?.toISOString() || null,
      archived_at: this._archivedAt?.toISOString() || null,
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
