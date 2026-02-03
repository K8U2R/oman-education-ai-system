/**
 * FindRecordsUseCase - Use Case للبحث عن السجلات
 *
 * Use Case للبحث عن سجلات متعددة في قاعدة البيانات
 */

import { IDatabaseAdapter } from '../../../domain/interfaces/IDatabaseAdapter'
import { IPolicyEngine } from '../../../domain/interfaces/IPolicyEngine'
import { IAuditLogger } from '../../../domain/interfaces/IAuditLogger'
import { OperationType } from '@/domain/value-objects/OperationType'
import { QueryOptions } from '@/domain/value-objects/QueryOptions'
import { Actor } from '@/domain/value-objects/Actor'
import { QueryResult } from '@/domain/entities/QueryResult'
import { PermissionDeniedException, QueryException } from '@/domain/exceptions'
import { logger } from '@/shared/utils/logger'

export interface FindRecordsParams {
  entity: string
  conditions?: Record<string, unknown>
  options?: {
    limit?: number
    offset?: number
    orderBy?: { column: string; direction: 'asc' | 'desc' }
  }
  actor: Actor | string
}

export class FindRecordsUseCase {
  constructor(
    private readonly databaseAdapter: IDatabaseAdapter,
    private readonly policyEngine: IPolicyEngine,
    private readonly auditLogger: IAuditLogger
  ) { }

  /**
   * تنفيذ البحث عن السجلات
   */
  async execute<T = unknown>(params: FindRecordsParams): Promise<QueryResult<T[]>> {
    const startTime = Date.now()
    const actor = params.actor instanceof Actor ? params.actor : new Actor(params.actor)

    try {
      // 1. التحقق من 
      const actorId = actor instanceof Actor ? actor.getId() : actor
      const hasPermission = await this.policyEngine.checkPermission({
        actor: actorId,
        operation: OperationType.FIND,
        entity: params.entity,
        conditions: params.conditions,
      })

      if (!hasPermission) {
        throw new PermissionDeniedException(actorId, OperationType.FIND, params.entity)
      }

      // 2. بناء QueryOptions
      const queryOptions = params.options ? new QueryOptions(params.options) : undefined

      // 3. تنفيذ البحث
      const results = await this.databaseAdapter.find<T>(
        params.entity,
        params.conditions || {},
        queryOptions?.toJSON()
      )

      const executionTime = Date.now() - startTime

      // 4. تسجيل العملية
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.FIND,
        entity: params.entity,
        conditions: params.conditions || {},
        success: true,
        executionTime,
      })

      // 5. إرجاع النتيجة
      return new QueryResult<T[]>({
        data: results,
        count: results.length,
        metadata: {
          executionTime,
          cached: false,
        },
      })
    } catch (error) {
      const executionTime = Date.now() - startTime

      const actorId = actor instanceof Actor ? actor.getId() : actor

      // تسجيل الخطأ
      await this.auditLogger.log({
        actor: actorId,
        action: OperationType.FIND,
        entity: params.entity,
        conditions: params.conditions || {},
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      })

      if (error instanceof PermissionDeniedException) {
        throw error
      }

      logger.error('FindRecordsUseCase failed', {
        entity: params.entity,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      throw new QueryException(
        `فشل البحث في ${params.entity}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        undefined,
        { entity: params.entity, conditions: params.conditions }
      )
    }
  }
}
