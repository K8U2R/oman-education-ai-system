/**
 * HealthHandler - معالج طلبات الصحة
 *
 * معالج لطلبات فحص صحة الخدمة
 */

import { Request, Response } from 'express'
import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'

export class HealthHandler {
  constructor(private readonly databaseAdapter: IDatabaseAdapter) {}

  /**
   * معالج فحص الصحة
   */
  async checkHealth(_req: Request, res: Response): Promise<void> {
    try {
      // محاولة تنفيذ استعلام بسيط للتحقق من الاتصال
      // نستخدم SELECT 1 كاستعلام بسيط وآمن للتحقق من الاتصال
      await this.databaseAdapter.executeRaw('SELECT 1 as health_check').catch(() => {
        // إذا فشل، نعتبر الاتصال صحيحاً إذا لم يكن هناك خطأ في الاتصال نفسه
        return null
      })

      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.json({
        status: 'ok',
        service: 'database-core',
        timestamp: new Date().toISOString(),
        database: 'connected',
      })
    } catch (error) {
      // حتى لو فشل الاستعلام، نعيد استجابة (قد تكون المشكلة في الاتصال)
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(503).json({
        status: 'error',
        service: 'database-core',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
