/**
 * DatabaseCoreService - الخدمة الرئيسية لنواة قاعدة البيانات
 *
 * تنفذ عمليات قاعدة البيانات باستخدام Use Cases
 * - التحقق من 
 * - تسجيل التدقيق
 * - إدارة المعاملات
 */

import { IDatabaseAdapter } from '../../domain/interfaces/IDatabaseAdapter'
import { IDatabaseRouter } from '../../domain/interfaces/IDatabaseRouter'
import { IPolicyEngine } from '../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../domain/interfaces/IAuditLogger'
import { OperationType } from '../../domain/value-objects/OperationType'
import { Actor } from '../../domain/value-objects/Actor'
import { QueryResult } from '../../domain/entities/QueryResult'
import {
  FindRecordsUseCase,
  InsertRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  CountRecordsUseCase,
} from '../use-cases/database'
import { DatabaseResponse } from '../dto/DatabaseResponse.dto'
import {
  PermissionDeniedException,
  QueryException,
  ValidationException,
} from '../../domain/exceptions'

export interface ExecuteOperationParams {
  operation: OperationType | string
  entity: string
  conditions?: Record<string, unknown>
  payload?: Record<string, unknown>
  actor: string | Actor
  options?: {
    limit?: number
    offset?: number
    orderBy?: { column: string; direction: 'asc' | 'desc' }
  }
}

export class DatabaseCoreService {
  private findRecordsUseCase: FindRecordsUseCase
  private insertRecordUseCase: InsertRecordUseCase
  private updateRecordUseCase: UpdateRecordUseCase
  private deleteRecordUseCase: DeleteRecordUseCase
  private countRecordsUseCase: CountRecordsUseCase
  private readonly router: IDatabaseRouter | null
  private readonly adapter: IDatabaseAdapter | null

  constructor(
    adapterOrRouter: IDatabaseAdapter | IDatabaseRouter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) {
    // دعم Router أو Adapter مباشرة (للتوافق مع الإصدارات السابقة)
    if ('getAdapterForEntity' in adapterOrRouter) {
      // Router
      this.router = adapterOrRouter as IDatabaseRouter
      this.adapter = null
    } else {
      // Adapter مباشر
      this.router = null
      this.adapter = adapterOrRouter as IDatabaseAdapter
    }

    // Initialize Use Cases (سيتم استخدام Adapter من Router عند الحاجة)
    const useCaseAdapter = this.getAdapter()
    this.findRecordsUseCase = new FindRecordsUseCase(
      useCaseAdapter,
      this.policyEngine,
      this.auditLogger
    )
    this.insertRecordUseCase = new InsertRecordUseCase(
      useCaseAdapter,
      this.policyEngine,
      this.auditLogger
    )
    this.updateRecordUseCase = new UpdateRecordUseCase(
      useCaseAdapter,
      this.policyEngine,
      this.auditLogger
    )
    this.deleteRecordUseCase = new DeleteRecordUseCase(
      useCaseAdapter,
      this.policyEngine,
      this.auditLogger
    )
    this.countRecordsUseCase = new CountRecordsUseCase(
      useCaseAdapter,
      this.policyEngine,
      this.auditLogger
    )
  }

  /**
   * الحصول على Adapter المناسب
   */
  private getAdapter(entity?: string): IDatabaseAdapter {
    if (this.router) {
      return entity ? this.router.getAdapterForEntity(entity) : this.router.getPrimaryAdapter()
    }
    if (this.adapter) {
      return this.adapter
    }
    throw new Error('No database adapter available')
  }

  /**
   * تنفيذ عملية على قاعدة البيانات مع الحوكمة
   */
  async executeOperation<T = unknown>(
    params: ExecuteOperationParams
  ): Promise<DatabaseResponse<T>> {
    const { operation, entity, conditions, payload, actor, options } = params
    const startTime = Date.now()

    try {
      let result: QueryResult<unknown>

      // الحصول على Adapter المناسب لـ entity
      const adapter = this.getAdapter(entity)

      // تحديث Use Cases مع Adapter المناسب (إذا كان Router)
      if (this.router) {
        this.findRecordsUseCase = new FindRecordsUseCase(
          adapter,
          this.policyEngine,
          this.auditLogger
        )
        this.insertRecordUseCase = new InsertRecordUseCase(
          adapter,
          this.policyEngine,
          this.auditLogger
        )
        this.updateRecordUseCase = new UpdateRecordUseCase(
          adapter,
          this.policyEngine,
          this.auditLogger
        )
        this.deleteRecordUseCase = new DeleteRecordUseCase(
          adapter,
          this.policyEngine,
          this.auditLogger
        )
        this.countRecordsUseCase = new CountRecordsUseCase(
          adapter,
          this.policyEngine,
          this.auditLogger
        )
      }

      // تنفيذ العملية باستخدام Use Cases
      switch (operation) {
        case OperationType.FIND: {
          const findResult = await this.findRecordsUseCase.execute<unknown[]>({
            entity,
            conditions,
            options,
            actor,
          })
          return DatabaseResponse.success<unknown[]>(
            findResult.getDataAsArray() as unknown[],
            findResult.getMetadata()
          ) as DatabaseResponse<T>
        }

        case OperationType.INSERT:
          if (!payload) {
            throw new ValidationException('البيانات مطلوبة لعملية الإدراج', [
              { field: 'payload', message: 'البيانات مطلوبة' },
            ])
          }
          result = await this.insertRecordUseCase.execute<T>({
            entity,
            data: payload,
            actor,
          })
          return DatabaseResponse.success<T>(result.getDataAsSingle() as T, result.getMetadata())

        case OperationType.UPDATE:
          if (!payload) {
            throw new ValidationException('البيانات مطلوبة لعملية التحديث', [
              { field: 'payload', message: 'البيانات مطلوبة' },
            ])
          }
          if (!conditions || Object.keys(conditions).length === 0) {
            throw new ValidationException('شروط البحث مطلوبة لعملية التحديث', [
              { field: 'conditions', message: 'شروط البحث مطلوبة' },
            ])
          }
          result = await this.updateRecordUseCase.execute<T>({
            entity,
            conditions,
            data: payload,
            actor,
          })
          return DatabaseResponse.success<T>(result.getDataAsSingle() as T, result.getMetadata())

        case OperationType.DELETE: {
          if (!conditions || Object.keys(conditions).length === 0) {
            throw new ValidationException('شروط البحث مطلوبة لعملية الحذف', [
              { field: 'conditions', message: 'شروط البحث مطلوبة' },
            ])
          }
          const deleteResult = await this.deleteRecordUseCase.execute({
            entity,
            conditions,
            actor,
          })
          return DatabaseResponse.success<boolean>(
            deleteResult.getDataAsSingle() as boolean,
            deleteResult.getMetadata()
          ) as DatabaseResponse<T>
        }

        default:
          throw new QueryException(`عملية غير معروفة: ${operation}`)
      }
    } catch (error) {
      const executionTime = Date.now() - startTime

      // إرجاع استجابة خطأ
      if (error instanceof PermissionDeniedException) {
        return DatabaseResponse.error<T>(error.message, { executionTime })
      }

      if (error instanceof ValidationException) {
        return DatabaseResponse.error<T>(error.message, { executionTime })
      }

      if (error instanceof QueryException) {
        return DatabaseResponse.error<T>(error.message, { executionTime })
      }

      // خطأ غير معروف
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف'
      return DatabaseResponse.error<T>(errorMessage, { executionTime })
    }
  }

  /**
   * البحث عن سجلات (convenience method)
   */
  async find<T = unknown>(
    entity: string,
    conditions?: Record<string, unknown>,
    options?: {
      limit?: number
      offset?: number
      orderBy?: { column: string; direction: 'asc' | 'desc' }
    },
    actor?: string | Actor
  ): Promise<DatabaseResponse<T[]>> {
    return this.executeOperation<T[]>({
      operation: OperationType.FIND,
      entity,
      conditions,
      actor: actor || Actor.system(),
      options,
    })
  }

  /**
   * إدراج سجل (convenience method)
   */
  async insert<T = unknown>(
    entity: string,
    data: Record<string, unknown>,
    actor?: string | Actor
  ): Promise<DatabaseResponse<T>> {
    return this.executeOperation<T>({
      operation: OperationType.INSERT,
      entity,
      payload: data,
      actor: actor || Actor.system(),
    })
  }

  /**
   * تحديث سجل (convenience method)
   */
  async update<T = unknown>(
    entity: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>,
    actor?: string | Actor
  ): Promise<DatabaseResponse<T>> {
    return this.executeOperation<T>({
      operation: OperationType.UPDATE,
      entity,
      conditions,
      payload: data,
      actor: actor || Actor.system(),
    })
  }

  /**
   * حذف سجل (convenience method)
   */
  async delete(
    entity: string,
    conditions: Record<string, unknown>,
    actor?: string | Actor
  ): Promise<DatabaseResponse<boolean>> {
    return this.executeOperation<boolean>({
      operation: OperationType.DELETE,
      entity,
      conditions,
      actor: actor || Actor.system(),
    })
  }

  /**
   * عد السجلات (convenience method)
   */
  async count(
    entity: string,
    conditions?: Record<string, unknown>,
    actor?: string | Actor
  ): Promise<DatabaseResponse<number>> {
    const result = await this.countRecordsUseCase.execute({
      entity,
      conditions,
      actor: actor || Actor.system(),
    })

    return DatabaseResponse.success<number>(
      result.getDataAsSingle() as number,
      result.getMetadata()
    )
  }
}
