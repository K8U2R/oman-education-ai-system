/**
 * Transaction Routes
 *
 * Routes لإدارة المعاملات
 */

import { Router, Request, Response } from 'express'
import { DatabaseServiceWithTransactions } from '../../../application/services/DatabaseServiceWithTransactions'
import { OperationType } from '../../../domain/value-objects/OperationType'
import { validationMiddleware } from '../middleware/validation.middleware'
import { asyncRouteHandlerManual } from '../utils/route-handler.util'
import { z } from 'zod'
import type { TransactionOptions } from '../../../domain/interfaces/ITransactionManager'

/**
 * Schema للتحقق من طلب معاملة
 */
const TransactionRequestSchema = z.object({
  operation: z.nativeEnum(OperationType),
  entity: z.string().min(1),
  conditions: z.record(z.any()).default({}),
  payload: z.record(z.any()).optional(),
  actor: z.string().default('system'),
  transactionOptions: z
    .object({
      isolationLevel: z
        .enum(['READ_UNCOMMITTED', 'READ_COMMITTED', 'REPEATABLE_READ', 'SERIALIZABLE'])
        .optional(),
      timeout: z.number().positive().optional(),
      retries: z.number().nonnegative().optional(),
    })
    .optional(),
  autoCommit: z.boolean().default(true),
  options: z
    .object({
      limit: z.number().positive().optional(),
      offset: z.number().nonnegative().optional(),
      orderBy: z
        .object({
          column: z.string(),
          direction: z.enum(['asc', 'desc']),
        })
        .optional(),
    })
    .optional(),
})

/**
 * إنشاء Routes للمعاملات
 */
export function createTransactionRoutes(
  databaseServiceWithTransactions: DatabaseServiceWithTransactions
): Router {
  const router = Router()

  /**
   * POST /api/transactions/execute
   * تنفيذ عملية مع معاملة
   */
  router.post(
    '/execute',
    validationMiddleware(TransactionRequestSchema),
    asyncRouteHandlerManual(async (req: Request, res: Response) => {
      const {
        operation,
        entity,
        conditions,
        payload,
        actor,
        transactionOptions,
        autoCommit,
        options,
      } = req.body as {
        operation: OperationType
        entity: string
        conditions: Record<string, unknown>
        payload?: Record<string, unknown>
        actor: string
        transactionOptions?: TransactionOptions
        autoCommit: boolean
        options?: {
          limit?: number
          offset?: number
          orderBy?: { column: string; direction: 'asc' | 'desc' }
        }
      }

      const result = await databaseServiceWithTransactions.executeWithTransaction({
        operation,
        entity,
        conditions,
        payload,
        actor,
        transactionOptions,
        autoCommit,
        options,
      })

      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(200).json(result.toJSON())
    })
  )

  /**
   * POST /api/transactions/operations/batch
   * تنفيذ عدة عمليات في معاملة واحدة
   */
  router.post(
    '/operations/batch',
    validationMiddleware(
      z.object({
        operations: z.array(TransactionRequestSchema),
        transactionOptions: z
          .object({
            isolationLevel: z
              .enum(['READ_UNCOMMITTED', 'READ_COMMITTED', 'REPEATABLE_READ', 'SERIALIZABLE'])
              .optional(),
            timeout: z.number().positive().optional(),
            retries: z.number().nonnegative().optional(),
          })
          .optional(),
        autoCommit: z.boolean().default(true),
      })
    ),
    asyncRouteHandlerManual(async (req: Request, res: Response) => {
      const { operations, transactionOptions, autoCommit } = req.body as {
        operations: Array<{
          operation: OperationType
          entity: string
          conditions: Record<string, unknown>
          payload?: Record<string, unknown>
          actor: string
          options?: {
            limit?: number
            offset?: number
            orderBy?: { column: string; direction: 'asc' | 'desc' }
          }
        }>
        transactionOptions?: TransactionOptions
        autoCommit: boolean
      }

      const results = await databaseServiceWithTransactions.executeBatchWithTransaction(
        operations,
        transactionOptions,
        autoCommit
      )

      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.status(200).json({
        success: true,
        data: results.map(r => r.toJSON()),
        timestamp: new Date().toISOString(),
      })
    })
  )

  return router
}
