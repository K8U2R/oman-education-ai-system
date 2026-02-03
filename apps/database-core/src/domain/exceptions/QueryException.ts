/**
 * QueryException - استثناء الاستعلام
 *
 * يُرمى عند حدوث خطأ في تنفيذ استعلام قاعدة البيانات
 */

import { DatabaseException } from './DatabaseException'

export class QueryException extends DatabaseException {
  constructor(message: string, query?: string, details?: Record<string, unknown>) {
    super(message, 'QUERY_ERROR', 400, {
      query,
      ...details,
    })
    this.name = 'QueryException'
  }
}
