/**
 * PermissionDeniedException - استثناء رفض 
 *
 * يُرمى عندما لا يمتلك المستخدم  المطلوبة
 */

import { DatabaseException } from './DatabaseException'

export class PermissionDeniedException extends DatabaseException {
  constructor(actor: string, operation: string, entity: string, details?: Record<string, unknown>) {
    super(
      `لا توجد صلاحية لـ ${actor} لتنفيذ ${operation} على ${entity}`,
      'PERMISSION_DENIED',
      403,
      {
        actor,
        operation,
        entity,
        ...details,
      }
    )
    this.name = 'PermissionDeniedException'
  }
}
