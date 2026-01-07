/**
 * StorageConnection Entity - كيان اتصال التخزين
 *
 * Domain Entity يمثل اتصال التخزين السحابي
 */

import { UserStorageConnection, ConnectionStatus } from '../types/storage.types'

export class StorageConnection {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly providerId: string,
    public readonly status: ConnectionStatus,
    public readonly rootFolderId?: string,
    public readonly createdAt: string = new Date().toISOString(),
    public readonly updatedAt: string = new Date().toISOString()
  ) {}

  /**
   * التحقق من أن الاتصال متصل
   */
  get isConnected(): boolean {
    return this.status === 'CONNECTED'
  }

  /**
   * التحقق من أن الاتصال نشط
   */
  get isActive(): boolean {
    return this.status === 'CONNECTED' || this.status === 'PENDING'
  }

  /**
   * التحقق من أن الاتصال منتهي الصلاحية
   */
  get isExpired(): boolean {
    return this.status === 'EXPIRED'
  }

  /**
   * التحقق من وجود خطأ في الاتصال
   */
  get hasError(): boolean {
    return this.status === 'ERROR'
  }

  /**
   * إنشاء StorageConnection من UserStorageConnection
   */
  static fromData(data: UserStorageConnection): StorageConnection {
    return new StorageConnection(
      data.id,
      data.user_id,
      data.provider_id,
      data.status,
      data.root_folder_id,
      data.created_at,
      data.updated_at
    )
  }

  /**
   * تحويل StorageConnection إلى UserStorageConnection
   */
  toData(): UserStorageConnection {
    return {
      id: this.id,
      user_id: this.userId,
      provider_id: this.providerId,
      status: this.status,
      root_folder_id: this.rootFolderId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
}
