import { z } from 'zod'
import { OperationType } from '@/domain/value-objects/OperationType'

/**
 * DatabaseRequestSchema - مخطط Zod للتحقق من طلب قاعدة البيانات
 */
export const DatabaseRequestSchema = z.object({
  operation: z.nativeEnum(OperationType),
  entity: z.string().min(1, 'Entity name is required'),
  conditions: z.record(z.any()).default({}),
  payload: z.record(z.any()).optional(),
  actor: z.string().default('system'),
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
 * DatabaseRequest - نوع طلب قاعدة البيانات
 */
export type DatabaseRequest = z.infer<typeof DatabaseRequestSchema>
