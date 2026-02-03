/**
 * Notification Mapper - محول الإشعارات
 *
 * Mapper للتحويل بين Domain Entity و Persistence Data
 * يفصل Domain Layer عن Infrastructure Layer
 */

import { Notification } from "../entities/Notification";
import { NotificationData } from "../types/communication/index.js";
import { Timestamp } from "../value-objects/Timestamp";

export class NotificationMapper {
  /**
   * تحويل NotificationData إلى Notification Entity
   *
   * @param data - بيانات الإشعار من قاعدة البيانات
   * @returns Notification instance
   */
  static toDomain(data: NotificationData): Notification {
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
      Timestamp.fromISO(data.created_at).toDate(),
      data.read_at ? Timestamp.fromISO(data.read_at).toDate() : undefined,
      data.archived_at
        ? Timestamp.fromISO(data.archived_at).toDate()
        : undefined,
      Timestamp.fromISO(data.updated_at).toDate(),
    );
  }

  /**
   * تحويل Notification Entity إلى NotificationData
   *
   * @param entity - Notification Entity
   * @returns NotificationData object
   */
  static toPersistence(entity: Notification): NotificationData {
    return {
      id: entity.id,
      user_id: entity.userId,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      status: entity.status,
      action_url: entity.actionUrl || null,
      action_label: entity.actionLabel || null,
      metadata: entity.metadata || null,
      created_at: Timestamp.fromDate(entity.createdAt).toISO(),
      read_at: entity.readAt ? Timestamp.fromDate(entity.readAt).toISO() : null,
      archived_at: entity.archivedAt
        ? Timestamp.fromDate(entity.archivedAt).toISO()
        : null,
      updated_at: Timestamp.fromDate(entity.updatedAt).toISO(),
    };
  }

  /**
   * تحويل قائمة NotificationData إلى قائمة Notification Entities
   *
   * @param dataList - قائمة بيانات الإشعارات
   * @returns قائمة Notification instances
   */
  static toDomainList(dataList: NotificationData[]): Notification[] {
    return dataList.map((data) => this.toDomain(data));
  }

  /**
   * تحويل قائمة Notification Entities إلى قائمة NotificationData
   *
   * @param entities - قائمة Notification Entities
   * @returns قائمة NotificationData objects
   */
  static toPersistenceList(entities: Notification[]): NotificationData[] {
    return entities.map((entity) => this.toPersistence(entity));
  }
}
