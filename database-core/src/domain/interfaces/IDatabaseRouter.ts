/**
 * IDatabaseRouter - واجهة موجه قاعدة البيانات
 *
 * واجهة لتوجيه الطلبات للقاعدة المناسبة
 */

import { IDatabaseAdapter } from './IDatabaseAdapter'
import { DatabaseRoutingConfig } from '../types/database-connection.types'

/**
 * واجهة موجه قاعدة البيانات
 */
export interface IDatabaseRouter {
  /**
   * الحصول على Adapter المناسب لـ entity معين
   */
  getAdapterForEntity(entity: string): IDatabaseAdapter

  /**
   * الحصول على Adapter الأساسي
   */
  getPrimaryAdapter(): IDatabaseAdapter

  /**
   * الحصول على Adapter احتياطي (fallback)
   */
  getFallbackAdapter(): IDatabaseAdapter | null

  /**
   * تحديث إعدادات التوجيه
   */
  updateRoutingConfig(config: DatabaseRoutingConfig): void

  /**
   * الحصول على إعدادات التوجيه الحالية
   */
  getRoutingConfig(): DatabaseRoutingConfig
}
