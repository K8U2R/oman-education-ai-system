import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import {
  ITransactionAdapter,
  type TransactionInfo,
  type TransactionOptions,
} from '../../domain/interfaces/ITransactionAdapter'
import { logger } from '../../shared/utils/logger'

/**
 * SupabaseAdapter - محول Supabase
 *
 * تنفيذ واجهة IDatabaseAdapter باستخدام Supabase
 * Note: Supabase يدعم Transactions محدودة عبر RPC functions
 */
export class SupabaseAdapter implements IDatabaseAdapter, ITransactionAdapter {
  private client: SupabaseClient
  private readonly url: string
  private readonly serviceRoleKey: string

  constructor(url?: string, serviceRoleKey?: string) {
    // استخدام المعاملات إذا كانت متوفرة، وإلا استخدام المتغيرات البيئية
    this.url = url || process.env.SUPABASE_URL || ''
    this.serviceRoleKey = serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!this.url || !this.serviceRoleKey) {
      throw new Error(
        'Supabase configuration is missing. Please provide url and serviceRoleKey, or set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
      )
    }

    this.client = createClient(this.url, this.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  /**
   * الحصول على Supabase Client
   */
  getClient(): SupabaseClient {
    return this.client
  }

  /**
   * فحص صحة الاتصال
   */
  async healthCheck(): Promise<boolean> {
    try {
      // محاولة تنفيذ استعلام بسيط على جدول موجود (users كجدول افتراضي)
      const { error } = await this.client.from('users').select('id').limit(1)
      return !error
    } catch {
      // إذا فشل كل شيء، نعتبر الاتصال غير صحيح
      return false
    }
  }

  async find<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    options?: {
      limit?: number
      offset?: number
      orderBy?: { column: string; direction: 'asc' | 'desc' }
    }
  ): Promise<T[]> {
    let query = this.client.from(entity).select('*')

    // تطبيق الشروط
    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    }

    // تطبيق الخيارات
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset !== undefined) {
      const end = options.offset + (options.limit || 10) - 1
      query = query.range(options.offset, end)
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.direction === 'asc',
      })
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`)
    }

    return (data || []) as T[]
  }

  async findOne<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>
  ): Promise<T | null> {
    const results = await this.find<T>(entity, conditions, { limit: 1 })
    return results[0] || null
  }

  async insert<T = unknown>(entity: string, data: Record<string, unknown>): Promise<T> {
    const { data: result, error } = await this.client.from(entity).insert(data).select().single()

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`)
    }

    return result as T
  }

  async insertMany<T = unknown>(entity: string, data: Record<string, unknown>[]): Promise<T[]> {
    const { data: result, error } = await this.client.from(entity).insert(data).select()

    if (error) {
      throw new Error(`Supabase insertMany error: ${error.message}`)
    }

    return (result || []) as T[]
  }

  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<T> {
    let query = this.client.from(entity).update(data)

    // تطبيق الشروط
    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    }

    const { data: result, error } = await query.select().single()

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`)
    }

    return result as T
  }

  async count(entity: string, conditions: Record<string, unknown> = {}): Promise<number> {
    let query = this.client.from(entity).select('*', { count: 'exact', head: true })

    // تطبيق الشروط
    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    }

    const { count, error } = await query

    if (error) {
      logger.error(`Supabase count error for entity ${entity}: ${error.message}`, {
        conditions,
        error,
      })
      throw new Error(`Supabase count error: ${error.message}`)
    }

    return count || 0
  }

  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    soft: boolean = true
  ): Promise<boolean> {
    if (soft) {
      // Soft delete - تحديث deleted_at
      try {
        await this.update(entity, conditions, {
          deleted_at: new Date().toISOString(),
        })
        return true
      } catch (error) {
        throw new Error(
          `Supabase soft delete error: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    // Hard delete
    let query = this.client.from(entity).delete()

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    }

    const { error } = await query

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`)
    }

    return true
  }

  async executeRaw<T = unknown>(_query: string, _params?: Record<string, unknown>): Promise<T> {
    // Supabase لا يدعم raw queries مباشرة
    // يمكن استخدام RPC functions أو direct PostgreSQL connection
    throw new Error('Raw queries not directly supported. Use RPC functions instead.')
  }

  // ITransactionAdapter Implementation
  // Note: Supabase يدعم Transactions محدودة عبر RPC functions أو direct PostgreSQL connection

  /**
   * التحقق من دعم المعاملات
   * Supabase يدعم Transactions محدودة عبر RPC functions
   */
  supportsTransactions(): boolean {
    // Supabase يدعم Transactions عبر RPC functions
    // لكن ليس مباشرة عبر REST API
    // يمكن استخدام direct PostgreSQL connection للـ Transactions الكاملة
    return false // حالياً غير مدعوم مباشرة
  }

  /**
   * بدء معاملة جديدة
   * Note: Supabase لا يدعم Transactions مباشرة عبر REST API
   */
  async beginTransaction(_options?: TransactionOptions): Promise<string> {
    throw new Error(
      'Transactions are not directly supported via Supabase REST API. Use RPC functions or direct PostgreSQL connection for full transaction support.'
    )
  }

  /**
   * تأكيد المعاملة
   */
  async commitTransaction(_transactionId: string): Promise<void> {
    throw new Error('Transactions are not supported via Supabase REST API')
  }

  /**
   * إلغاء المعاملة
   */
  async rollbackTransaction(_transactionId: string): Promise<void> {
    throw new Error('Transactions are not supported via Supabase REST API')
  }

  /**
   * الحصول على معلومات المعاملة
   */
  async getTransactionInfo(_transactionId: string): Promise<TransactionInfo | null> {
    return null
  }

  /**
   * تنفيذ عملية داخل معاملة
   */
  async executeInTransaction<T>(
    _transactionId: string,
    _operation: (client: unknown) => Promise<T>
  ): Promise<T> {
    throw new Error('Transactions are not supported via Supabase REST API')
  }

  /**
   * دعم Nested Transactions
   */
  supportsNestedTransactions(): boolean {
    return false
  }

  /**
   * إنشاء Savepoint
   */
  async createSavepoint(_transactionId: string, _name: string): Promise<string> {
    throw new Error('Savepoints are not supported via Supabase REST API')
  }

  /**
   * Rollback إلى Savepoint
   */
  async rollbackToSavepoint(_transactionId: string, _savepointName: string): Promise<void> {
    throw new Error('Savepoints are not supported via Supabase REST API')
  }

  /**
   * إطلاق Savepoint
   */
  async releaseSavepoint(_transactionId: string, _savepointName: string): Promise<void> {
    throw new Error('Savepoints are not supported via Supabase REST API')
  }
}
