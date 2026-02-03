/**
 * IDatabaseConnectionManager - واجهة مدير اتصالات قاعدة البيانات
 *
 * واجهة لإدارة الاتصالات المتعددة مع قواعد البيانات المختلفة
 */

import {
  DatabaseConnectionConfig,
  DatabaseConnectionInfo,
  DatabaseHealthCheckResult,
} from '../types/database-connection.types'
import { IDatabaseAdapter } from './IDatabaseAdapter'

/**
 * واجهة مدير اتصالات قاعدة البيانات
 */
export interface IDatabaseConnectionManager {
  /**
   * إضافة اتصال جديد
   */
  addConnection(config: DatabaseConnectionConfig): Promise<void>

  /**
   * إزالة اتصال
   */
  removeConnection(connectionId: string): Promise<void>

  /**
   * الحصول على اتصال
   */
  getConnection(connectionId: string): IDatabaseAdapter | null

  /**
   * الحصول على جميع الاتصالات
   */
  getAllConnections(): Map<string, IDatabaseAdapter>

  /**
   * الحصول على معلومات الاتصال
   */
  getConnectionInfo(connectionId: string): DatabaseConnectionInfo | null

  /**
   * الحصول على جميع معلومات الاتصالات
   */
  getAllConnectionsInfo(): DatabaseConnectionInfo[]

  /**
   * فحص صحة الاتصال
   */
  healthCheck(connectionId: string): Promise<DatabaseHealthCheckResult>

  /**
   * فحص صحة جميع الاتصالات
   */
  healthCheckAll(): Promise<DatabaseHealthCheckResult[]>

  /**
   * إعادة الاتصال
   */
  reconnect(connectionId: string): Promise<void>

  /**
   * إعادة الاتصال لجميع الاتصالات
   */
  reconnectAll(): Promise<void>

  /**
   * إغلاق الاتصال
   */
  closeConnection(connectionId: string): Promise<void>

  /**
   * إغلاق جميع الاتصالات
   */
  closeAllConnections(): Promise<void>
}
